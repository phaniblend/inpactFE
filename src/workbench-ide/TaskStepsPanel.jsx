import { useEffect, useMemo, useState } from "react";
import { findModuleBySlug } from "../assist-me/AssistMeWorkspace.jsx";
import { fetchLessonCodeValidation } from "../ai-lessons/clientLessonValidation.js";
import StepAssistPopup from "./StepAssistPopup.jsx";
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
  const [assistNode, setAssistNode] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState("");
  const [justPassed, setJustPassed] = useState(() => new Set());

  useEffect(() => {
    setDone(moduleTag ? loadDoneSet(moduleTag) : new Set());
    setCheckMessage("");
    setJustPassed(new Set());
  }, [moduleTag]);

  function toggleDone(id) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveDoneSet(moduleTag, next);
      return next;
    });
  }

  async function checkAllSteps() {
    if (checking || !getCheckPayload) return;
    const pending = steps.filter((s) => !done.has(s.id));
    if (pending.length === 0) {
      setCheckMessage("Every step is already checked off. 🎉");
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
        setCheckMessage(`Couldn't check your code: ${reason?.message || "please try again."}`);
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
        setJustPassed(new Set(newlyDone));
        setTimeout(() => setJustPassed(new Set()), 1600);
        setCheckMessage(`✅ ${newlyDone.length} step${newlyDone.length > 1 ? "s" : ""} confirmed complete.`);
      } else {
        setCheckMessage("No new steps look complete yet — keep going.");
      }
    } catch (err) {
      setCheckMessage(`Couldn't check your code: ${err?.message || "please try again."}`);
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
        {checkMessage && <span className="tsp-check-msg">{checkMessage}</span>}
      </div>
      <div className="tsp-list">
        {steps.map((node, i) => {
          const isDone = done.has(node.id);
          const justPassedNow = justPassed.has(node.id);
          return (
            <div
              key={node.id}
              className={`tsp-step${isDone ? " tsp-step-done" : ""}${justPassedNow ? " tsp-step-just-passed" : ""}`}
            >
              <label className="tsp-check">
                <input type="checkbox" checked={isDone} onChange={() => toggleDone(node.id)} />
              </label>
              <div className="tsp-step-body">
                <div className="tsp-step-num">Step {i + 1}</div>
                <div className="tsp-what">
                  <span className="tsp-tag">What</span> {whatFromPaal(node.paal)}
                </div>
                {/* `hint` is usually the literal code answer (or close to it) — showing that as
                    "How" just restates "What" a second time, found live 2026-09-02 testing this.
                    `pre_check_hint` (written for a different original purpose — guidance shown
                    before the learner has attempted the step) is the field that's actually
                    technique-level across every module checked: what to do conceptually, not the
                    finished line of code. Fall back to `hint` only when a module has no
                    pre_check_hint at all. */}
                {node.pre_check_hint || node.hint ? (
                  <div className="tsp-how">
                    <span className="tsp-tag">How</span> {node.pre_check_hint || node.hint}
                  </div>
                ) : null}
                <button type="button" className="tsp-assist-btn" onClick={() => setAssistNode(node)}>
                  💡 Assist me
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {assistNode && <StepAssistPopup moduleTag={moduleTag} node={assistNode} onClose={() => setAssistNode(null)} />}
    </div>
  );
}
