import { createContext, useContext, useRef, useState } from "react";
import { useAuth } from "../auth/useAuth.js";
import { notifyTeam } from "./notify.js";
import "./TeamChatWidget.css";

/**
 * Global "Catch up" team chat — one floating launcher + window available from every page, not just
 * the moment right after applying (user request, 2026-09-08: "we need to add chat option
 * everywhere in the platform.. not just on first visit"). Previously this lived entirely inside
 * TeamIntro.jsx, only reachable from the post-match screen in Apply.jsx. Lifted the whole thing
 * (state, drag/resize, send) up here so it can be mounted once, wrapping every route in main.jsx,
 * and reached from anywhere via useTeamChat() — TeamIntro's own "Say hello" button now just opens
 * this same shared window instead of running its own separate copy.
 *
 * Messages send to the same shared team channel notifyTeam() already posts to; this window can
 * only show what *you* send from it (there's no read-back API wired up yet).
 */
const TeamChatContext = createContext(null);

export function useTeamChat() {
  const ctx = useContext(TeamChatContext);
  if (!ctx) throw new Error("useTeamChat() must be called inside a <TeamChatProvider>");
  return ctx;
}

function defaultChatPos() {
  if (typeof window === "undefined") return { x: 24, y: 24 };
  return {
    x: Math.max(24, window.innerWidth - 404),
    y: Math.max(24, window.innerHeight - 560),
  };
}

export function TeamChatProvider({ children }) {
  // /api/auth/me — signed-in IPF name for message attribution, and the gate for whether the
  // launcher shows at all (a public, anonymous lesson visitor isn't part of any team channel yet).
  const { session } = useAuth();
  const myName = session?.name || null;

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
      startW: size?.width ?? rect?.width ?? 380,
      startH: size?.height ?? rect?.height ?? 520,
    };
    window.addEventListener("pointermove", handleResizePointerMove);
    window.addEventListener("pointerup", handleResizePointerUp);
  }

  return (
    <TeamChatContext.Provider value={{ openChat, closeChat, isOpen: open }}>
      {children}
      {myName && (
        <>
          {!open && (
            <button type="button" className="tc-launcher" onClick={() => openChat()} aria-label="Open team chat">
              <span className="tc-launcher-avatar" aria-hidden="true" />
            </button>
          )}
          {open && (
            <div
              className="tc-widget"
              ref={elRef}
              style={{
                left: (pos || defaultChatPos()).x,
                top: (pos || defaultChatPos()).y,
                ...(size ? { width: size.width, height: size.height } : {}),
              }}
            >
              <button type="button" className="tc-close" onClick={closeChat} aria-label="Close">
                ×
              </button>
              <div className="tc-header" onPointerDown={handleDragPointerDown} title="Drag to move">
                <span className="tc-avatar" aria-hidden="true" />
                <h3>Catch up</h3>
              </div>
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
              <div className="tc-resize-handle" onPointerDown={handleResizePointerDown} title="Drag to resize" />
            </div>
          )}
        </>
      )}
    </TeamChatContext.Provider>
  );
}
