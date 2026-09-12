import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/useAuth.js";
import { notifyTeam } from "./notify.js";
import { fetchMyProjectName, fetchTeamRoster } from "./roster.js";
import "./TeamChatWidget.css";

/**
 * Global "Team Chat" — one floating launcher + Slack-style window (member roster on the left, chat
 * on the right) available from every page once someone is actually matched to a team, not just the
 * moment right after applying (user report, 2026-09-08: "add chat option everywhere in the
 * platform.. not just on first visit"; and 2026-09-12: the post-apply screen's own "Said hello —
 * open team chat" button was the *only* way back in, which reads as a dead end rather than a
 * persistent, prominent affordance). Previously this lived entirely inside TeamIntro.jsx, only
 * reachable from the post-match screen in Apply.jsx. Lifted the whole thing (state, roster,
 * drag/resize, send) up here so it can be mounted once, wrapping every route in main.jsx, and
 * reached from anywhere via useTeamChat() — TeamIntro's own "Say hello" button now just opens this
 * same shared window instead of running its own separate copy.
 *
 * Messages send to the same shared team channel notifyTeam() already posts to; this window can
 * only show what *you* send from it (there's no read-back API wired up yet). The member list is
 * real, though — the same "Matched:" roster TeamIntro.jsx reads, via fetchTeamRoster().
 */
const TeamChatContext = createContext(null);

export function useTeamChat() {
  const ctx = useContext(TeamChatContext);
  if (!ctx) throw new Error("useTeamChat() must be called inside a <TeamChatProvider>");
  return ctx;
}

const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 520;

function defaultChatPos(width = DEFAULT_WIDTH) {
  if (typeof window === "undefined") return { x: 24, y: 24 };
  return {
    x: Math.max(24, window.innerWidth - width - 24),
    y: Math.max(24, window.innerHeight - DEFAULT_HEIGHT - 40),
  };
}

/** "PS" for "Phani Setty", "T" for a lone "Teammate" — initials for the sidebar avatar, since
 * there's no profile-photo store to pull a real image from. */
function initialsFor(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function TeamChatProvider({ children }) {
  // /api/auth/me — signed-in IPF name for message attribution, and the gate for whether the
  // launcher shows at all (a public, anonymous lesson visitor isn't part of any team channel yet).
  const { session } = useAuth();
  const myName = session?.name || null;

  // Real project + roster for the signed-in aspirant's own team (fetchMyProjectName/fetchTeamRoster
  // — same source TeamIntro.jsx reads). This is also the actual gate on whether the launcher shows
  // at all: signed in but not yet matched to a task means there's no team to chat with yet (user
  // report, 2026-09-12 — the launcher should be "always available... once assigned to a team", not
  // shown to every signed-in visitor regardless).
  const [projectName, setProjectName] = useState(null);
  const [roster, setRoster] = useState([]);
  // Bumped by refreshTeam() (exposed via context) so TeamIntro.jsx can force an immediate re-fetch
  // right when someone lands on the post-match screen — this effect otherwise only keys off
  // `myName`, which doesn't change at the exact moment a signed-in visitor gets freshly matched, so
  // without this the launcher would stay hidden until the next full page load.
  const [refreshTick, setRefreshTick] = useState(0);
  const refreshTeam = () => setRefreshTick((t) => t + 1);

  useEffect(() => {
    if (!myName) {
      setProjectName(null);
      setRoster([]);
      return;
    }
    let cancelled = false;
    fetchMyProjectName()
      .then((proj) => {
        if (cancelled) return;
        setProjectName(proj);
        if (!proj) {
          setRoster([]);
          return Promise.resolve();
        }
        return fetchTeamRoster(proj).then((rows) => !cancelled && setRoster(rows));
      })
      .catch(() => {
        if (!cancelled) {
          setProjectName(null);
          setRoster([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [myName, refreshTick]);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  // Draggable + resizable (same pointer-driven pattern as TaskStepsPanel's floating cards): null =
  // default position/size until first moved/resized, then an explicit pixel value takes over and
  // persists for the rest of the browser session (not just one page — this provider now lives above
  // the router).
  const [pos, setPos] = useState(null);
  const [size, setSize] = useState(null);
  const elRef = useRef(null);
  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  /** Opens the widget; `seedText`, if given, is posted to the team channel and added as the first
   * visible message — used by TeamIntro's "Say hello" so that message lands in the same shared
   * window instead of a separate one-off toast. */
  async function openChat(seedText) {
    setPos((prev) => prev || defaultChatPos());
    setOpen(true);
    if (seedText) {
      await notifyTeam(seedText);
      setMessages((prev) => [...prev, { text: seedText, at: Date.now() }]);
    }
  }

  function closeChat() {
    setOpen(false);
  }

  async function sendMessage(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    await notifyTeam(`${myName || "Someone"}: ${text}`);
    setMessages((prev) => [...prev, { text, at: Date.now() }]);
    setDraft("");
    setSending(false);
  }

  function handleDragPointerMove(e) {
    const d = dragRef.current;
    if (!d) return;
    const nextX = d.originX + (e.clientX - d.startX);
    const nextY = d.originY + (e.clientY - d.startY);
    setPos({
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
    const origin = pos || defaultChatPos();
    dragRef.current = { startX: e.clientX, startY: e.clientY, originX: origin.x, originY: origin.y };
    window.addEventListener("pointermove", handleDragPointerMove);
    window.addEventListener("pointerup", handleDragPointerUp);
  }

  function handleResizePointerMove(e) {
    const d = resizeRef.current;
    if (!d) return;
    setSize({
      width: Math.max(320, Math.min(d.startW + (e.clientX - d.startX), window.innerWidth - 32)),
      height: Math.max(360, Math.min(d.startH + (e.clientY - d.startY), window.innerHeight - 32)),
    });
  }

  function handleResizePointerUp() {
    resizeRef.current = null;
    window.removeEventListener("pointermove", handleResizePointerMove);
    window.removeEventListener("pointerup", handleResizePointerUp);
  }

  function handleResizePointerDown(e) {
    e.preventDefault();
    e.stopPropagation();
    const rect = elRef.current?.getBoundingClientRect();
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: size?.width ?? rect?.width ?? DEFAULT_WIDTH,
      startH: size?.height ?? rect?.height ?? DEFAULT_HEIGHT,
    };
    window.addEventListener("pointermove", handleResizePointerMove);
    window.addEventListener("pointerup", handleResizePointerUp);
  }

  // Roster for the sidebar — falls back to just "you" while the real roster is still loading or
  // when you're genuinely the first one matched (TeamIntro.jsx's "isSolo" case), so the sidebar
  // never renders empty.
  const members = roster.length > 0 ? roster : myName ? [{ name: myName, taskTitle: "" }] : [];

  return (
    <TeamChatContext.Provider value={{ openChat, closeChat, isOpen: open, refreshTeam }}>
      {children}
      {/* The launcher FAB is gated on projectName — "always available... once assigned to a team"
          (user report, 2026-09-12), not shown to a signed-in visitor with no team yet. The widget
          itself, once open, is gated only on `open` — TeamIntro's own "Say hello" can call
          openChat() the instant someone's freshly matched, before this provider's own independent
          roster fetch (below) has necessarily resolved; gating the widget on projectName too would
          risk openChat() silently doing nothing in that race. */}
      {myName && (
        <>
          {!open && projectName && (
            <button type="button" className="tc-launcher" onClick={() => openChat()} aria-label="Team Chat" title="Team Chat">
              <span className="tc-launcher-avatar" aria-hidden="true" />
            </button>
          )}
          {open && (
            <div
              className="tc-widget"
              ref={elRef}
              style={{
                left: (pos || defaultChatPos(size?.width)).x,
                top: (pos || defaultChatPos(size?.width)).y,
                ...(size ? { width: size.width, height: size.height } : {}),
              }}
            >
              <button type="button" className="tc-close" onClick={closeChat} aria-label="Close">
                ×
              </button>
              <div className="tc-header" onPointerDown={handleDragPointerDown} title="Drag to move">
                <span className="tc-avatar" aria-hidden="true" />
                <div className="tc-header-text">
                  <h3>Team Chat</h3>
                  {projectName && <p className="tc-header-sub">{projectName}</p>}
                </div>
              </div>
              <div className="tc-body">
                <div className="tc-sidebar">
                  <p className="tc-sidebar-label">Team ({members.length})</p>
                  <ul className="tc-member-list">
                    {members.map((m, i) => (
                      <li key={`${m.name}-${i}`} className={m.name === myName ? "tc-member tc-member-you" : "tc-member"}>
                        <span className="tc-member-avatar" aria-hidden="true">
                          {initialsFor(m.name)}
                        </span>
                        <span className="tc-member-info">
                          <span className="tc-member-name">
                            {m.name}
                            {m.name === myName ? " (you)" : ""}
                          </span>
                          {m.taskTitle && <span className="tc-member-task">{m.taskTitle}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="tc-main">
                  <p className="tc-note">
                    Messages you send here reach your whole team instantly. Replies land in the same shared channel, so check back later.
                  </p>
                  <div className="tc-messages">
                    {messages.length === 0 && <p className="tc-empty">Say something — it posts straight to your team's channel.</p>}
                    {messages.map((m) => (
                      <div className="tc-bubble" key={m.at}>
                        {m.text}
                      </div>
                    ))}
                  </div>
                  <form className="tc-form" onSubmit={sendMessage}>
                    <input
                      className="tc-input"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Your text here....."
                      disabled={sending}
                    />
                    <button type="submit" className="tc-send" disabled={sending || !draft.trim()} aria-label="Send">
                      {sending ? "…" : "↑"}
                    </button>
                  </form>
                </div>
              </div>
              <div className="tc-resize-handle" onPointerDown={handleResizePointerDown} title="Drag to resize" />
            </div>
          )}
        </>
      )}
    </TeamChatContext.Provider>
  );
}
