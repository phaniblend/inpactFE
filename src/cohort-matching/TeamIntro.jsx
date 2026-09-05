import { useEffect, useState } from "react";
import { COHORT_PROJECT_ID } from "./matching.js";
import "./TeamIntro.css";

async function api(path) {
  const res = await fetch(`/api/onedev${path}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

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
    api("/issues?offset=0&count=200")
      .then((issues) => {
        if (cancelled) return;
        const matches = issues.filter((i) => i.projectId === COHORT_PROJECT_ID && i.title.startsWith("Matched:"));
        const rows = matches
          .filter((m) => (m.description || "").includes(`in ${projectName}`))
          .map((m) => {
            const nameMatch = /Matched: (.+?) →/.exec(m.title);
            const taskMatch = /Task: #\d+ "(.+?)"/.exec(m.description || "");
            return { name: nameMatch?.[1] ?? "Teammate", taskTitle: taskMatch?.[1] ?? "" };
          });
        setRoster(rows);
      })
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
