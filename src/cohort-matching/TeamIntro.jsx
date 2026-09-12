import { useEffect, useState } from "react";
import { useTeamChat } from "../team-messaging/TeamChatProvider.jsx";
import { fetchTeamRoster } from "../team-messaging/roster.js";
import "./TeamIntro.css";

// Real cadence, not invented meeting times — this whole product is async/self-paced (see
// JsExperienceHome.jsx's "post on your own schedule" / "mentors clear roadblocks" copy, and
// AspirantJourneyFlow.jsx's "Sprint rituals" band). Printing fabricated fixed meeting slots here
// would misrepresent that as literal scheduled calls nobody is actually holding — the day/window
// values below describe *when the ritual happens in the loop*, not a clock time to show up to.
const RITUALS = [
  {
    day: "Every weekday",
    label: "Daily check-in",
    detail: "Post what you worked on, what's next, and how it's going — any time before end of day, on your own schedule.",
  },
  {
    day: "When a task opens",
    label: "Sprint planning",
    detail: "New tasks unlock as earlier ones ship — pick up whatever fits your track next.",
  },
  {
    day: "On every PR",
    label: "Mentor review",
    detail: "Submit your work for review with one click; a real engineer reviews it line-by-line and leaves feedback.",
  },
  {
    day: "After each feature ships",
    label: "Retro, built in",
    detail: "Review feedback becomes the next lesson — what got flagged is what Assist Me leans on next time.",
  },
];

/**
 * Real teammates on the same product, read the same way HuddleCalendar.jsx already builds its
 * roster — live "Matched: <name> → ... in <project>" issues in the shared Cohort project (see
 * server/recruit-router.js), not a fabricated list. `/api/onedev` only requires a signed-in session
 * (server/index.js) — the HuddleCalendar *route* is staff-only, but the underlying data a freshly
 * matched applicant just became part of is readable by anyone signed in, including them.
 */
export default function TeamIntro({ projectName, myName }) {
  const [roster, setRoster] = useState(null); // null = loading
  const [error, setError] = useState("");
  // Real commit count on the product's main branch (server/index.js /api/repo-stats) — shown when
  // the roster is just you, so "you're the first" is backed by an actual number instead of reading
  // as an empty product. Not required for a populated roster, so a slow/failed fetch never blocks
  // the page — it just quietly doesn't show a count.
  const [commits, setCommits] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchTeamRoster(projectName)
      .then((rows) => !cancelled && setRoster(rows))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [projectName]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/repo-stats/${encodeURIComponent(projectName)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => !cancelled && data && setCommits(data.commits))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [projectName]);

  const isSolo = roster && (roster.length === 0 || (roster.length === 1 && roster[0].name === myName));
  const myTask = roster?.find((r) => r.name === myName)?.taskTitle;

  // idle -> sending -> sent. notifyTeam() (team-messaging/notify.js) already swallows its own
  // failures (a slow/down webhook shouldn't be the reason someone can't get into the room) — this
  // just tracks the click-to-feedback moment, not whether the post itself actually landed.
  const [helloState, setHelloState] = useState("idle");
  // The chat window itself is now global (TeamChatProvider, mounted once in main.jsx) — user
  // request, 2026-09-08: "add chat option everywhere in the platform.. not just on first visit".
  // "Say hello" just opens that same shared window with the hello message seeded into it, instead
  // of running its own separate copy scoped to this one screen.
  const { openChat, isOpen: chatOpen, refreshTeam } = useTeamChat();

  // TeamChatProvider learns its own projectName/roster from a fetch keyed on the signed-in name,
  // which already ran (at sign-in) before this brand-new match existed — so without forcing a
  // refresh here, the global "Team Chat" launcher would stay hidden (no known team yet) until the
  // next full page load, even though this exact screen is proof a team now exists.
  useEffect(() => {
    refreshTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName]);

  async function sayHello() {
    setHelloState("sending");
    const text = `👋 ${myName || "Someone"} just joined the ${projectName} team${myTask ? ` — working on "${myTask}"` : ""}. Say hi!`;
    await openChat(text);
    setHelloState("sent");
  }

  return (
    <div className="ti-root">
      <section className="ti-panel">
        <h2>Your team on {projectName}</h2>
        {error && <p className="ti-hint ti-error">Couldn't load the team roster right now.</p>}
        {!error && roster === null && <p className="ti-hint">Loading your team…</p>}
        {!error && roster && isSolo && (
          <p className="ti-hint">
            You're the first one matched here — more teammates join as they apply.
            {commits !== null && (
              <span className="ti-repo-stat">
                {" "}
                Repo: {projectName} · {commits} commit{commits === 1 ? "" : "s"} · 0 open PRs — be the first.
              </span>
            )}
          </p>
        )}
        {!error && roster && !isSolo && (
          <ul className="ti-roster">
            {roster.map((r, i) => (
              <li key={`${r.name}-${i}`} className={r.name === myName ? "ti-roster-you" : ""}>
                <span className="ti-roster-name">
                  {r.name}
                  {r.name === myName ? " (you)" : ""}
                </span>
                {r.taskTitle && <span className="ti-roster-task">{r.taskTitle}</span>}
              </li>
            ))}
          </ul>
        )}
        {!error && roster && helloState !== "sent" && (
          <button type="button" className="ti-say-hello-btn" onClick={sayHello} disabled={helloState === "sending"}>
            {helloState === "sending" ? "Saying hello…" : "👋 Say hello to the team"}
          </button>
        )}
        {/* Said hello already — the persistent "Team Chat" button in the corner (TeamChatProvider)
            is the one lasting way back in, so this only ever confirms + offers a one-tap jump
            straight into it, never a second button that quietly re-sends the same hello (user
            report, 2026-09-12: the old relabeled button looked like a dead end / wasn't clear the
            chat is always reachable, not just right after applying). */}
        {helloState === "sent" && (
          <p className="ti-hello-sent">
            👋 Said hello — your team's talking in <strong>Team Chat</strong>, reachable any time from the
            button in the corner.
            {!chatOpen && (
              <button type="button" className="ti-open-chat-link" onClick={() => openChat()}>
                Open it now →
              </button>
            )}
          </p>
        )}
      </section>

      <section className="ti-panel">
        <h2>How this team works</h2>
        <div className="ti-rituals">
          {RITUALS.map((r) => (
            <div className="ti-ritual-row" key={r.label}>
              <div className="ti-ritual-day">{r.day}</div>
              <div>
                <div className="ti-ritual-label">{r.label}</div>
                <div className="ti-ritual-detail">{r.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
