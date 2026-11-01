import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";
import { useTeamChat } from "../team-messaging/TeamChatProvider.jsx";
import "./AspirantWelcome.css";

const PROGRESS_KEY = (id) => `ipf-ask-progress:${id}`;

function firstNameFromSession(session) {
  const raw = String(session?.name || "").trim();
  if (!raw) {
    const local = String(session?.email || "").split("@")[0] || "there";
    return local.charAt(0).toUpperCase() + local.slice(1);
  }
  const nick = raw.match(/[“"]([^”"]+)[”"]/);
  if (nick?.[1]) return nick[1].trim();
  return raw.split(/\s+/)[0];
}

function readProgress(task) {
  if (!task) return 0;
  if (task.state && task.state !== "Open") return 100;
  try {
    const n = Number(localStorage.getItem(PROGRESS_KEY(task.id)));
    if (Number.isFinite(n) && n >= 0 && n <= 100) return Math.round(n);
  } catch {
    /* ignore */
  }
  // Soft start: matched + opened is not zero — they've already claimed the ask.
  return 8;
}

function writeProgress(taskId, pct) {
  try {
    localStorage.setItem(PROGRESS_KEY(taskId), String(Math.max(0, Math.min(100, Math.round(pct)))));
  } catch {
    /* ignore */
  }
}

function acceptanceHint(description) {
  const line = /^AcceptanceCriteria:\s*(.+)$/m.exec(description || "")?.[1]?.trim();
  if (!line) return null;
  const parts = line.split(/;\s*/).map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts : null;
}

/**
 * Signed-in aspirant home — skip the public cinematic. Speaks like a product coach:
 * name the current ask, show honest progress, and offer peer moves (scrum note / blocker).
 */
export default function AspirantWelcome() {
  const { session, status } = useAuth();
  const { openChat } = useTeamChat();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const name = firstNameFromSession(session);

  useEffect(() => {
    if (status !== "signedIn") return;
    setLoading(true);
    setError("");
    fetch("/api/recruit/my-tasks")
      .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Couldn't load your work");
        setTasks(Array.isArray(data.tasks) ? data.tasks : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [status]);

  const openTasks = useMemo(() => tasks.filter((t) => !t.state || t.state === "Open"), [tasks]);
  const closedTasks = useMemo(() => tasks.filter((t) => t.state && t.state !== "Open"), [tasks]);
  const currentAsk = openTasks[0] || tasks[0] || null;
  const criteria = currentAsk ? acceptanceHint(currentAsk.description) : null;

  useEffect(() => {
    setProgress(readProgress(currentAsk));
  }, [currentAsk?.id, currentAsk?.state]);

  function bumpProgress(delta) {
    if (!currentAsk) return;
    const next = Math.max(0, Math.min(100, progress + delta));
    writeProgress(currentAsk.id, next);
    setProgress(next);
  }

  function postScrumUpdate() {
    if (!currentAsk) return;
    const pct = progress;
    openChat(
      `${name}: Scrum check-in — working "${currentAsk.title}" on ${currentAsk.project || "the product"}. About ${pct}% through the acceptance checks. Next: keep building and ask if I get stuck.`
    );
  }

  function postBlocker() {
    if (!currentAsk) return;
    openChat(
      `${name}: Blocker on "${currentAsk.title}" (${currentAsk.project || "product"}). I could use a peer eyes-on — drop a tip or pair if you have cycles.`
    );
  }

  if (status === "loading" || loading) {
    return (
      <div className="aw-page">
        <p className="aw-muted">Loading your desk…</p>
      </div>
    );
  }

  return (
    <div className="aw-page">
      <div className="aw-aspirant-chrome">
        <Link className="aw-chrome-link aw-chrome-link-active" to="/home">
          Home
        </Link>
        <Link className="aw-chrome-link" to="/workbench">
          My tasks
        </Link>
        <Link className="aw-chrome-link" to="/apply">
          Apply
        </Link>
        <Link className="aw-chrome-link" to="/join">
          How it works
        </Link>
      </div>

      <header className="aw-header">
        <p className="aw-kicker">Your desk</p>
        <h1 className="aw-title">Hey {name} — welcome back.</h1>
        <p className="aw-lede">
          This is your home base on the product team. Pick up the current ask, check where you stand,
          and ping peers when you need them. My tasks holds the full list.
        </p>
      </header>

      {error ? <div className="aw-error">{error}</div> : null}

      <section className="aw-stats" aria-label="Your snapshot">
        <div className="aw-stat">
          <div className="aw-stat-value">{openTasks.length}</div>
          <div className="aw-stat-label">Open asks</div>
        </div>
        <div className="aw-stat">
          <div className="aw-stat-value">{closedTasks.length}</div>
          <div className="aw-stat-label">Closed</div>
        </div>
        <div className="aw-stat">
          <div className="aw-stat-value">{tasks.length}</div>
          <div className="aw-stat-label">Assigned total</div>
        </div>
      </section>

      {!currentAsk ? (
        <section className="aw-card">
          <h2 className="aw-card-title">No ask on your plate yet</h2>
          <p className="aw-card-body">
            When Recruit matches you, your first delivery task shows up here and under My tasks. If you
            already applied, hang tight — or check Apply for status.
          </p>
          <div className="aw-actions">
            <Link className="aw-btn aw-btn-primary" to="/apply">
              Go to Apply
            </Link>
            <Link className="aw-btn aw-btn-ghost" to="/workbench">
              My tasks
            </Link>
          </div>
        </section>
      ) : (
        <section className="aw-card aw-card-ask">
          <p className="aw-ask-kicker">Your current ask</p>
          <h2 className="aw-card-title">&ldquo;{currentAsk.title}&rdquo;</h2>
          <p className="aw-ask-meta">
            #{currentAsk.number} · {currentAsk.project || "Product"}
            {currentAsk.state ? ` · ${currentAsk.state}` : ""}
          </p>

          <div className="aw-progress" role="group" aria-label={`Progress ${progress} percent`}>
            <div className="aw-progress-ring" style={{ "--aw-pct": progress }}>
              <span className="aw-progress-num">{progress}%</span>
            </div>
            <div className="aw-progress-copy">
              <p className="aw-progress-lead">
                You&apos;ve completed about <strong>{progress}%</strong> of this ask.
              </p>
              <p className="aw-progress-hint">
                Progress is yours to update as you clear acceptance checks — keep it honest so peers
                and Assist Me know where you are.
              </p>
              <div className="aw-progress-tweak">
                <button type="button" className="aw-btn aw-btn-tiny" onClick={() => bumpProgress(-10)}>
                  −10%
                </button>
                <button type="button" className="aw-btn aw-btn-tiny" onClick={() => bumpProgress(15)}>
                  +15% progress
                </button>
              </div>
            </div>
          </div>

          {criteria?.length ? (
            <div className="aw-criteria">
              <h3 className="aw-criteria-title">What “done” looks like</h3>
              <ul>
                {criteria.slice(0, 5).map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="aw-coach">
            <h3 className="aw-coach-title">What do you need next?</h3>
            <p className="aw-card-body">
              Shipping is a team sport. Post a short scrum note so others know you&apos;re moving — or
              raise a blocker early so peers can unblock you before the day slips.
            </p>
            <div className="aw-actions">
              <button type="button" className="aw-btn aw-btn-primary" onClick={postScrumUpdate}>
                Post this in scrum chat
              </button>
              <button type="button" className="aw-btn aw-btn-warn" onClick={postBlocker}>
                I hit a blocker — ask peers
              </button>
              <Link
                className="aw-btn aw-btn-ghost"
                to={`/workbench?openTask=${encodeURIComponent(String(currentAsk.id))}`}
              >
                Open this ask
              </Link>
              <Link className="aw-btn aw-btn-ghost" to="/workbench">
                All my tasks
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
