import { useEffect, useMemo, useRef, useState } from "react";
import { findModuleBySlug } from "../assist-me/AssistMeWorkspace.jsx";
import { fetchLessonCodeValidation } from "../ai-lessons/clientLessonValidation.js";
import { fetchFeedbackAnnotate } from "../ai-lessons/clientFeedbackAnnotate.js";
import StepAssistPopup from "./StepAssistPopup.jsx";
import { formatFeedbackText, renderAnnotatedCode } from "./formatFeedbackText.jsx";
import "./TaskStepsPanel.css";

function doneStorageKey(moduleTag) {
  return `ipf-task-steps-done:${moduleTag}`;
}

function loadDoneSet(moduleTag) {
  try {
    const raw = window.localStorage.getItem(doneStorageKey(moduleTag));
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

/**
 * `paal` was written for the old toy-editor TASK box, which wanted the full context inline: goal
 * sentence, then a reference block copied from the mock (MOCK ROW / LIST / FORM — sample values
 * for whatever this step touches), then a "Your task: ..." restatement of the same goal a second
 * time. In this panel that's three passes at the same thing — found live 2026-09-02, the user
 * pointing at a "What" that read as a step-by-step recipe instead of a goal. Keep the module's
 * `paal` field itself untouched (the old Assist Me lightbox still uses the full version) and just
 * take its first paragraph here: every step in practice states the goal, then a blank line, before
 * any reference block or "Your task" restatement follows.
 *
 * Every step's `paal` later also picked up a leading language/file-type line ("You're writing this
 * in...") and, on step 1, a "this file doesn't exist yet, create it at..." line, both meant for
 * beginners reading the full Assist Me popup — but as the literal first paragraph here, it made
 * every step's "What" show that same generic sentence instead of the step's actual goal (found
 * live 2026-09-06: Step 1 and Step 2 rendered identically). Skip any leading paragraph that's one
 * of those two preambles and take the first real goal paragraph after them.
 */
const PAAL_PREAMBLE_RE = /^(You're writing this in|This file doesn't exist yet)/;
function whatFromPaal(paal) {
  if (!paal) return "";
  const paragraphs = paal.split("\n\n").map((p) => p.trim());
  const goal = paragraphs.find((p) => p && !PAAL_PREAMBLE_RE.test(p));
  return goal || paragraphs[0] || "";
}

function saveDoneSet(moduleTag, set) {
  try {
    window.localStorage.setItem(doneStorageKey(moduleTag), JSON.stringify([...set]));
  } catch {
    /* private-browsing/storage-blocked — the checklist just won't persist, not worth surfacing */
  }
}

/**
 * The task pane from the original 3-pane ask: the assignment's own algorithm, broken into
 * independent micro-steps — each one What (the goal) / How (the technique) — with its own
 * "Assist me" trigger. Replaces the old modal MC-gate-before-editor flow for task EXECUTION: there
 * is no toy sandbox to gate anymore (the learner writes the real line(s) directly in the real
 * editor beside this panel), so a step is just something to read, understand, do, and check off —
 * not something that blocks moving on. Reuses the exact NODES content already written for every
 * generated module (`paal`/`hint`/`why_this_matters`/`analog_example`/`deepDive`) — no content
 * regeneration needed, only this new renderer.
 *
 * List + detail-card layout (rebuilt live 2026-09-06 from the original always-all-expanded stack):
 * every step's full What/How text stacked one after another made the panel a long scroll of dense
 * paragraphs, hard to scan for which step you're even on. Now the list only shows compact rows
 * (checkbox + "Step N") — clicking one opens a single-step detail card with the full What/How and
 * Assist me, plus Prev/Next so a learner can walk the whole sequence without closing and reopening
 * a different row each time. Close returns to the compact row list; clicking a different row while
 * closed opens straight to that step.
 *
 * The detail card floats (2026-09-07, user report: "cramp the step card in the corner again we
 * need a spaced model.. and make it draggable") — squeezing the full What/How text into the ~300px
 * sidebar column made it unreadable. It now renders as a fixed-position floating card, wide enough
 * to breathe, that the learner can drag anywhere on screen by its header; the compact row list
 * underneath stays visible the whole time so switching steps doesn't mean closing and reopening.
 *
 * Done-state persists to localStorage per moduleTag (a real per-learner progress store is future
 * work, not this component's job).
 *
 * "Check my code" (added live 2026-09-02, user request): a learner who finishes step 2, forgets to
 * tick it, and moves on to step 3 shouldn't have to backtrack — one click re-validates every
 * not-yet-ticked step against the actual code in the workspace (via the same /api/lessons/validate
 * AI check the old toy-editor CHECK MY CODE button already used, `getCheckPayload` supplies the
 * real changed-file content) and checks off + greens out whichever ones now pass, in one pass, no
 * per-step manual confirmation required. Only ever adds to `done` — never un-ticks a step the
 * learner already confirmed themselves, even if a fresh check somehow scores it "wrong" (code they
 * later changed, a flaky AI call, etc.) — a checkbox going backwards on its own reads as a bug, not
 * a feature.
 */
export default function TaskStepsPanel({ moduleTag, getCheckPayload }) {
  const mod = useMemo(() => (moduleTag ? findModuleBySlug(moduleTag) : null), [moduleTag]);
  const steps = useMemo(() => (mod?.NODES || []).filter((n) => n.type === "question"), [mod]);
  const [done, setDone] = useState(() => (moduleTag ? loadDoneSet(moduleTag) : new Set()));
  // Separate from `done` (user report, live: opened Step 1, ticked its own "Mark done" checkbox,
  // clicked Check my code — got "Open a step first" even though a step was plainly open). `done`
  // is shared by two different things: the learner's own self-report checkbox, and Check my code's
  // "this passed" confirmation — checkAllSteps() used `done` to decide what still needs checking,
  // so self-marking a step done (a completely reasonable thing to click) silently made it
  // unre-checkable and produced a misleading "open a step" message once nothing else was pending.
  // aiVerified tracks only the second thing — a step Check my code has actually confirmed correct
  // — so a self-marked-but-unverified step still gets checked for real. In-memory only (not
  // persisted like `done`): losing this on reload just means an already-correct step gets
  // re-verified once more, a wasted API call, never an incorrect result.
  const [aiVerified, setAiVerified] = useState(() => new Set());
  const [assistNode, setAssistNode] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState("");
  const [justPassed, setJustPassed] = useState(() => new Set());
  // null = no detail card open; a number = that step's floating card is open.
  const [activeStep, setActiveStep] = useState(null);
  // Floating card's screen position — null until first opened, then persists across Prev/Next and
  // re-picking a different row, so the learner's chosen spot on screen doesn't reset every click.
  const [cardPos, setCardPos] = useState(null);
  const dragRef = useRef(null); // { startX, startY, originX, originY } while a drag is in progress
  // Resize handles (2026-09-07, user request — "resize handles on all models especially
  // anotation"). null = default CSS-driven size; once dragged, an explicit pixel size takes over
  // and persists across Prev/Next / reopening, same as position does.
  const [cardSize, setCardSize] = useState(null); // { width, height } | null
  const cardElRef = useRef(null);
  const resizeRef = useRef(null); // { startX, startY, startW, startH } while a resize is in progress
  // Check my code's result also floats — a real, specific reason ("Step 2: this step uses
  // useState()...") got clipped in a cramped inline sidebar strip (user report, 2026-09-07: "its
  // flagging extra feedback... hiding"). Same draggable/closeable floating-card pattern as the step
  // detail card, its own independent position so both can be open on screen at once.
  const [checkCardPos, setCheckCardPos] = useState(null);
  const checkDragRef = useRef(null);
  const [checkCardSize, setCheckCardSize] = useState(null); // { width, height } | null
  const checkCardElRef = useRef(null);
  const checkResizeRef = useRef(null);
  // Steps the learner has actually opened this session (row click or Prev/Next) — "Check my code"
  // only validates these, not every unchecked step (user report, 2026-09-07: Steps 9/10 got
  // evaluated — and once, wrongly marked done — despite never being opened; a learner working
  // through steps in order shouldn't get feedback, right or wrong, about steps they haven't
  // looked at yet).
  const [visitedSteps, setVisitedSteps] = useState(() => new Set());
  // Context for "Annotate my code" (2026-09-07, user request — the same feature the toy-editor
  // lesson engine already has: map the written feedback onto the learner's actual code as inline
  // coaching comments, so "Finanials is wrong" becomes visible AT the line it's wrong on, not just
  // described in prose). Only set when the check card is showing a real per-step result — null for
  // generic messages ("already done", "open a step first", network errors) that have no single
  // step/code pairing to annotate against.
  const [checkContext, setCheckContext] = useState(null); // { node, code, language, feedback } | null
  const [annotating, setAnnotating] = useState(false);
  const [annotateError, setAnnotateError] = useState("");
  const [annotatedCode, setAnnotatedCode] = useState(null);

  useEffect(() => {
    setDone(moduleTag ? loadDoneSet(moduleTag) : new Set());
    setAiVerified(new Set());
    setCheckMessage("");
    setJustPassed(new Set());
    setActiveStep(null);
    setCardPos(null);
    setCardSize(null);
    setCheckCardPos(null);
    setCheckCardSize(null);
    setVisitedSteps(new Set());
    setCheckContext(null);
    setAnnotating(false);
    setAnnotateError("");
    setAnnotatedCode(null);
  }, [moduleTag]);

  // Covers both openStep (row click) and Prev/Next — both just change activeStep, so one effect
  // marks whichever step becomes active as visited, instead of duplicating the same update at
  // every place activeStep can change.
  useEffect(() => {
    if (activeStep === null) return;
    const id = steps[activeStep]?.id;
    if (!id) return;
    setVisitedSteps((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, [activeStep, steps]);

  // Centered by default (user request, 2026-09-08 — "open the step card in the center of the
  // screen"; previously anchored to the top-right corner, same as the check-result card used to be
  // before that one got centered for the same reason).
  function defaultCardPos() {
    if (typeof window === "undefined") return { x: 80, y: 100 };
    return { x: Math.max(24, window.innerWidth / 2 - 230), y: Math.max(24, window.innerHeight / 2 - 220) };
  }

  // Centered by default (a "toast" in the middle of the screen, per request), not anchored to a
  // corner like the step card — the two are visually distinct floating windows.
  function defaultCheckCardPos() {
    if (typeof window === "undefined") return { x: 80, y: 100 };
    return { x: Math.max(24, window.innerWidth / 2 - 230), y: Math.max(24, window.innerHeight / 2 - 140) };
  }

  function openStep(i) {
    setActiveStep(i);
    setCardPos((prev) => prev || defaultCardPos());
  }

  function handleDragPointerMove(e) {
    const d = dragRef.current;
    if (!d) return;
    const nextX = d.originX + (e.clientX - d.startX);
    const nextY = d.originY + (e.clientY - d.startY);
    setCardPos({
      x: Math.min(Math.max(nextX, -200), window.innerWidth - 80),
      y: Math.min(Math.max(nextY, 0), window.innerHeight - 60),
    });
  }

  function handleDragPointerUp() {
    dragRef.current = null;
    window.removeEventListener("pointermove", handleDragPointerMove);
    window.removeEventListener("pointerup", handleDragPointerUp);
  }

  function handleDragPointerDown(e) {
    e.preventDefault();
    const origin = cardPos || defaultCardPos();
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: origin.x, originY: origin.y };
    window.addEventListener("pointermove", handleDragPointerMove);
    window.addEventListener("pointerup", handleDragPointerUp);
  }

  function handleResizePointerMove(e) {
    const d = resizeRef.current;
    if (!d) return;
    setCardSize({
      width: Math.max(360, Math.min(d.startW + (e.clientX - d.startX), window.innerWidth - 32)),
      height: Math.max(240, Math.min(d.startH + (e.clientY - d.startY), window.innerHeight - 32)),
    });
  }

  function handleResizePointerUp() {
    resizeRef.current = null;
    window.removeEventListener("pointermove", handleResizePointerMove);
    window.removeEventListener("pointerup", handleResizePointerUp);
  }

  function handleResizePointerDown(e) {
    e.preventDefault();
    e.stopPropagation(); // don't let the drag handle's own listener also fire
    const rect = cardElRef.current?.getBoundingClientRect();
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: cardSize?.width ?? rect?.width ?? 460,
      startH: cardSize?.height ?? rect?.height ?? 320,
    };
    window.addEventListener("pointermove", handleResizePointerMove);
    window.addEventListener("pointerup", handleResizePointerUp);
  }

  function handleCheckDragPointerMove(e) {
    const d = checkDragRef.current;
    if (!d) return;
    const nextX = d.originX + (e.clientX - d.startX);
    const nextY = d.originY + (e.clientY - d.startY);
    setCheckCardPos({
      x: Math.min(Math.max(nextX, -200), window.innerWidth - 80),
      y: Math.min(Math.max(nextY, 0), window.innerHeight - 60),
    });
  }

  function handleCheckDragPointerUp() {
    checkDragRef.current = null;
    window.removeEventListener("pointermove", handleCheckDragPointerMove);
    window.removeEventListener("pointerup", handleCheckDragPointerUp);
  }

  function handleCheckDragPointerDown(e) {
    e.preventDefault();
    const origin = checkCardPos || defaultCheckCardPos();
    checkDragRef.current = { startX: e.clientX, startY: e.clientY, originX: origin.x, originY: origin.y };
    window.addEventListener("pointermove", handleCheckDragPointerMove);
    window.addEventListener("pointerup", handleCheckDragPointerUp);
  }

  function handleCheckResizePointerMove(e) {
    const d = checkResizeRef.current;
    if (!d) return;
    setCheckCardSize({
      width: Math.max(360, Math.min(d.startW + (e.clientX - d.startX), window.innerWidth - 32)),
      height: Math.max(240, Math.min(d.startH + (e.clientY - d.startY), window.innerHeight - 32)),
    });
  }

  function handleCheckResizePointerUp() {
    checkResizeRef.current = null;
    window.removeEventListener("pointermove", handleCheckResizePointerMove);
    window.removeEventListener("pointerup", handleCheckResizePointerUp);
  }

  function handleCheckResizePointerDown(e) {
    e.preventDefault();
    e.stopPropagation();
    const rect = checkCardElRef.current?.getBoundingClientRect();
    checkResizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: checkCardSize?.width ?? rect?.width ?? 460,
      startH: checkCardSize?.height ?? rect?.height ?? 320,
    };
    window.addEventListener("pointermove", handleCheckResizePointerMove);
    window.addEventListener("pointerup", handleCheckResizePointerUp);
  }

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handleDragPointerMove);
      window.removeEventListener("pointerup", handleDragPointerUp);
      window.removeEventListener("pointermove", handleResizePointerMove);
      window.removeEventListener("pointerup", handleResizePointerUp);
      window.removeEventListener("pointermove", handleCheckResizePointerMove);
      window.removeEventListener("pointerup", handleCheckResizePointerUp);
      window.removeEventListener("pointermove", handleCheckDragPointerMove);
      window.removeEventListener("pointerup", handleCheckDragPointerUp);
    };
  }, []);

  function toggleDone(id) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveDoneSet(moduleTag, next);
      return next;
    });
  }

  // Opens the floating check-result card alongside setting its text — only if it isn't already
  // positioned, so re-checking repeatedly doesn't keep re-centering a card the learner dragged.
  function showCheckMessage(msg) {
    setCheckMessage(msg);
    setCheckCardPos((prev) => prev || defaultCheckCardPos());
  }

  function closeCheckCard() {
    setCheckMessage("");
    setCheckContext(null);
    setAnnotating(false);
    setAnnotateError("");
    setAnnotatedCode(null);
  }

  async function annotateCode() {
    if (!checkContext || annotating) return;
    setAnnotating(true);
    setAnnotateError("");
    try {
      const data = await fetchFeedbackAnnotate({
        instruction: checkContext.node.paal || checkContext.node.instruction || "",
        feedback: checkContext.feedback,
        hint: checkContext.node.pre_check_hint || checkContext.node.hint || "",
        userCode: checkContext.code,
        language: checkContext.language,
      });
      const code = String(data?.annotatedCode ?? "").trim();
      if (!code) {
        setAnnotateError("Couldn't map the feedback onto your code. Try again, or re-read the feedback above.");
        return;
      }
      setAnnotatedCode(code);
    } catch (err) {
      setAnnotateError(err?.message || "Couldn't annotate your code. Please try again.");
    } finally {
      setAnnotating(false);
    }
  }

  async function checkAllSteps() {
    if (checking || !getCheckPayload) return;
    const pending = steps.filter((s) => !aiVerified.has(s.id) && visitedSteps.has(s.id));
    if (pending.length === 0) {
      const allDone = steps.every((s) => aiVerified.has(s.id));
      setCheckContext(null);
      showCheckMessage(
        allDone
          ? "Every step is already checked off. 🎉"
          : "Open a step first (or use Prev/Next) — Check my code only validates steps you've actually looked at."
      );
      return;
    }
    setChecking(true);
    setCheckMessage("");
    try {
      const { code, language } = await getCheckPayload();
      const settled = await Promise.allSettled(
        pending.map((node) => fetchLessonCodeValidation({ track: moduleTag, node, userCode: code, language }))
      );
      if (settled.every((s) => s.status === "rejected")) {
        const reason = settled[0]?.reason;
        setCheckContext(null);
        showCheckMessage(`Couldn't check your code: ${reason?.message || "please try again."}`);
        return;
      }
      const newlyDone = [];
      settled.forEach((s, i) => {
        if (s.status === "fulfilled" && s.value?.result === "correct") newlyDone.push(pending[i].id);
      });
      if (newlyDone.length > 0) {
        setDone((prev) => {
          const next = new Set(prev);
          newlyDone.forEach((id) => next.add(id));
          saveDoneSet(moduleTag, next);
          return next;
        });
        setAiVerified((prev) => {
          const next = new Set(prev);
          newlyDone.forEach((id) => next.add(id));
          return next;
        });
        setJustPassed(new Set(newlyDone));
        setTimeout(() => setJustPassed(new Set()), 1600);
        setCheckContext(null);
        showCheckMessage(`✅ ${newlyDone.length} step${newlyDone.length > 1 ? "s" : ""} confirmed complete.`);
      } else {
        // Surface *why*, not just "keep going" — every pending step genuinely got checked and
        // usually has real, specific feedback (found live 2026-09-07: a real missing-import bug
        // was being detected correctly the whole time, but this generic message threw the actual
        // reason away, making a working fix look like it wasn't catching anything). Prefer the
        // currently-open step's feedback if it's among the failures; otherwise the earliest
        // pending step that has one.
        const withFeedback = settled
          .map((s, i) => ({ node: pending[i], result: s.status === "fulfilled" ? s.value : null }))
          .filter((r) => r.result?.feedback);
        const activeNodeId = activeStep !== null ? steps[activeStep]?.id : null;
        const chosen = withFeedback.find((r) => r.node.id === activeNodeId) || withFeedback[0];
        if (chosen) {
          const stepNum = steps.findIndex((s) => s.id === chosen.node.id) + 1;
          setCheckContext({ node: chosen.node, code, language, feedback: chosen.result.feedback });
          setAnnotatedCode(null);
          setAnnotateError("");
          showCheckMessage(`Step ${stepNum}: ${chosen.result.feedback}`);
        } else {
          setCheckContext(null);
          showCheckMessage("No new steps look complete yet — keep going.");
        }
      }
    } catch (err) {
      setCheckContext(null);
      showCheckMessage(`Couldn't check your code: ${err?.message || "please try again."}`);
    } finally {
      setChecking(false);
    }
  }

  if (!moduleTag) {
    return <div className="tsp-empty">No guided steps wired to this task yet.</div>;
  }
  if (!mod) {
    return <div className="tsp-empty">No guided lesson found for this task yet.</div>;
  }

  const activeNode = activeStep === null ? null : steps[activeStep];

  return (
    <div className="tsp-root">
      <div className="tsp-header">
        <span>TASK STEPS</span>
        <span className="tsp-progress">
          {done.size}/{steps.length}
        </span>
      </div>
      <div className="tsp-check-bar">
        <button type="button" className="tsp-check-btn" onClick={checkAllSteps} disabled={checking || !getCheckPayload}>
          {checking ? "Checking…" : "✓ Check my code"}
        </button>
      </div>

      <div className="tsp-list">
        {steps.map((node, i) => {
          const isDone = done.has(node.id);
          const justPassedNow = justPassed.has(node.id);
          const isActive = i === activeStep;
          return (
            <div
              key={node.id}
              className={`tsp-row${isDone ? " tsp-row-done" : ""}${justPassedNow ? " tsp-row-just-passed" : ""}${isActive ? " tsp-row-active" : ""}`}
              onClick={() => openStep(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openStep(i);
                }
              }}
            >
              <label className="tsp-check" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" checked={isDone} onChange={() => toggleDone(node.id)} />
              </label>
              <span className="tsp-row-num">Step {i + 1}</span>
              <span className="tsp-row-arrow">›</span>
            </div>
          );
        })}
      </div>

      {activeNode && cardPos ? (
        <div
          ref={cardElRef}
          className="tsp-card-float"
          style={{ left: cardPos.x, top: cardPos.y, ...(cardSize ? { width: cardSize.width, height: cardSize.height } : {}) }}
        >
          <div className="tsp-card-head">
            <button type="button" className="tsp-card-close" onClick={() => setActiveStep(null)} aria-label="Close step">
              ✕ Close
            </button>
            {/* Drag handle — deliberately separate from the Close button so a press on Close never
                gets mistaken for a drag start. */}
            <div className="tsp-card-drag" onPointerDown={handleDragPointerDown} title="Drag to move">
              ⠿ Step {activeStep + 1} of {steps.length}
            </div>
          </div>
          <div className="tsp-card-body">
            {/* Which file this step is actually about — declared per-step (see e.g. the MiniERP
                task's NODES array), not inferred from prose, since not every step restates its path
                (user request, 2026-09-08: "include the filepath the step is talking about"). Only
                modules that declare `file` on their steps show this row — older modules without it
                render exactly as before. */}
            {activeNode.file ? <div className="tsp-card-file">{activeNode.file}</div> : null}
            <label className="tsp-card-check">
              <input type="checkbox" checked={done.has(activeNode.id)} onChange={() => toggleDone(activeNode.id)} />
              <span>Mark done</span>
            </label>
            <div className="tsp-what">
              <span className="tsp-tag">What</span> {whatFromPaal(activeNode.paal)}
            </div>
            {/* `hint` is usually the literal code answer (or close to it) — showing that as "How"
                just restates "What" a second time, found live 2026-09-02 testing this.
                `pre_check_hint` (written for a different original purpose — guidance shown before
                the learner has attempted the step) is the field that's actually technique-level
                across every module checked: what to do conceptually, not the finished line of
                code. Fall back to `hint` only when a module has no pre_check_hint at all. */}
            {activeNode.pre_check_hint || activeNode.hint ? (
              <div className="tsp-how">
                <span className="tsp-tag">How</span>
                <div className="tsp-how-body">{formatFeedbackText(activeNode.pre_check_hint || activeNode.hint, "how")}</div>
              </div>
            ) : null}
            <button type="button" className="tsp-assist-btn" onClick={() => setAssistNode(activeNode)}>
              💡 Assist me
            </button>
            <div className="tsp-card-nav">
              <button
                type="button"
                className="tsp-nav-btn"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((i) => Math.max(0, i - 1))}
              >
                ← Prev
              </button>
              <button
                type="button"
                className="tsp-nav-btn tsp-nav-btn-primary"
                disabled={activeStep === steps.length - 1}
                onClick={() => setActiveStep((i) => Math.min(steps.length - 1, i + 1))}
              >
                Next →
              </button>
            </div>
          </div>
          <div className="tsp-resize-handle" onPointerDown={handleResizePointerDown} title="Drag to resize" />
        </div>
      ) : null}

      {checkMessage && checkCardPos ? (
        <div
          ref={checkCardElRef}
          className={`tsp-card-float tsp-check-float${annotatedCode ? " tsp-check-float-wide" : ""}`}
          style={{
            left: checkCardPos.x,
            top: checkCardPos.y,
            ...(checkCardSize ? { width: checkCardSize.width, height: checkCardSize.height } : {}),
          }}
        >
          <div className="tsp-card-head">
            <button type="button" className="tsp-card-close" onClick={closeCheckCard} aria-label="Close check result">
              ✕ Close
            </button>
            <div className="tsp-card-drag" onPointerDown={handleCheckDragPointerDown} title="Drag to move">
              ⠿ Check my code
            </div>
          </div>
          <div className="tsp-card-body">
            <div className="tsp-check-float-body">{formatFeedbackText(checkMessage)}</div>
            {checkContext ? (
              <>
                <button type="button" className="tsp-assist-btn tsp-annotate-btn" onClick={annotateCode} disabled={annotating}>
                  {annotating ? "Annotating…" : "🔍 Annotate my code"}
                </button>
                {annotateError ? <div className="tsp-annotate-error">{annotateError}</div> : null}
                {annotatedCode ? renderAnnotatedCode(annotatedCode) : null}
              </>
            ) : null}
          </div>
          <div className="tsp-resize-handle" onPointerDown={handleCheckResizePointerDown} title="Drag to resize" />
        </div>
      ) : null}

      {assistNode && <StepAssistPopup moduleTag={moduleTag} node={assistNode} onClose={() => setAssistNode(null)} />}
    </div>
  );
}
