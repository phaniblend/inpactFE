import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SKILL_LEVELS, BE_SKILL_LEVELS } from "./skillLevels.js";
import { useAuth } from "../auth/useAuth.js";
import "./CohortMatching.css";

// Curated copy for trade labels we already know about — SpecForge (see src/specforge/schemas.js's
// `trade` field: "a free label, not an enum") writes whatever trade a task actually needs, so the
// real list of options below is fetched live from open tasks, not this array. This only supplies a
// nicer blurb/tech line when a fetched label happens to match one we recognize; anything else still
// renders as a pickable card, just with a generic blurb (see roleCardCopy below).
const KNOWN_TRADE_COPY = {
  coding: {
    label: "Coding",
    blurb: "Build the actual product — UI, backend logic, or both.",
    tech: "HTML, CSS, JavaScript, TypeScript, React, Angular, Node",
  },
  "product design": {
    label: "Product design",
    blurb: "Shape how the product looks and feels — wireframes, mockups, UX flows.",
    tech: "Figma, design systems, prototyping",
  },
  pm: {
    label: "Project management",
    blurb: "Keep scope, priorities, and delivery on track — constant judgment calls, not code.",
    tech: "Roadmapping, stakeholder communication, prioritization",
  },
  qa: {
    label: "QA / Testing",
    blurb: "Make sure it actually works — manual test plans, or automated tests (which is real code).",
    tech: "Test planning, or Jest/Playwright/Cypress if you write automated tests",
  },
  content: {
    label: "Content",
    blurb: "Write the words users read — docs, in-app copy, help guides.",
    tech: "Technical writing, UX copy",
  },
};

function roleCardCopy(trade) {
  return (
    KNOWN_TRADE_COPY[trade.toLowerCase()] || {
      label: trade,
      blurb: "An open task is waiting for this trade right now.",
      tech: "",
    }
  );
}

// Real guided support (Assist Me, the counselor flow, the skill-level ladder) only exists for
// Coding right now. Other trades have real open tasks in OneDev, but nothing to actually guide
// someone through them yet — so they're shown, not hidden (applicants should see what's coming),
// but not selectable until there's real support behind them.
const SUPPORTED_TRADES = new Set(["coding"]);
function isTradeSupported(trade) {
  return SUPPORTED_TRADES.has(trade.toLowerCase());
}

/** Distinct `Trade:` labels (see MatchingQueue.jsx's same marker) across open tasks — real demand,
 * whether or not a specific task is placeable this second. Deliberately NOT filtered by
 * NeedsTutorial/isAssignable (see matching.js): applying is the trigger for automatic matching
 * (server/recruit-router.js), which queues you if nothing's placeable yet rather than requiring
 * something to already be ready — so "available" means "we have real work in this trade," not
 * "guaranteed instant placement." Core-only trades (matching.js's CORE_ONLY_TRADES — Product design,
 * for now) are excluded even if open tasks exist: that work stays with -core roles, not JS applicants.*/
async function fetchAvailableTrades() {
  // Public, no session required — the server does the same filtering that used to happen here
  // against the raw (and, until today, unauthenticated) OneDev issue list. See
  // server/recruit-router.js's GET /open-trades for why this moved server-side.
  const res = await fetch("/api/recruit/open-trades");
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const { trades } = await res.json();
  return trades || [];
}

const ASPIRATION_LEVELS = SKILL_LEVELS.filter((l) => l.value !== "none");
const BE_ASPIRATION_LEVELS = BE_SKILL_LEVELS;

// Career-counselor pre-step (Coding only): gather prior languages + what pulls the applicant,
// then recommend a focus + starting skill level from the same taxonomy Apply already uses for
// matching (skillLevels.js) — this doesn't invent a parallel system, it just decides the default
// for the picker below instead of leaving it to a cold guess.
const LANGUAGE_OPTIONS = [
  { value: "html-css", label: "HTML & CSS", side: "frontend" },
  { value: "javascript", label: "JavaScript", side: "frontend" },
  { value: "typescript", label: "TypeScript", side: "frontend" },
  { value: "react", label: "React", side: "frontend" },
  { value: "angular", label: "Angular", side: "frontend" },
  { value: "vue", label: "Vue", side: "frontend" },
  { value: "nodejs", label: "Node.js", side: "backend" },
  { value: "python", label: "Python", side: "backend" },
  { value: "java", label: "Java", side: "backend" },
  { value: "csharp", label: "C#", side: "backend" },
  { value: "php", label: "PHP", side: "backend" },
  { value: "ruby", label: "Ruby", side: "backend" },
  { value: "go", label: "Go", side: "backend" },
  { value: "sql", label: "SQL / databases", side: "backend" },
  { value: "other", label: "Something else", side: null },
];

/** Recommend { focus, skillLevel, beSkillLevel, why } from prior-knowledge signal. Reuses
 * skillLevels.js's own rungs so the recommendation and the picker below always agree. */
function recommend({ priorKnowledge, knownLanguages, interestPull }) {
  if (priorKnowledge !== "yes") {
    // No prior code: recommend by stated interest, defaulting to Frontend — JS/React is the
    // friendlier on-ramp and matches how the FE ladder starts at "none".
    const focus = interestPull === "backend" ? "backend" : "frontend";
    return {
      focus,
      skillLevel: focus !== "backend" ? "none" : "",
      beSkillLevel: focus === "backend" ? "http-api" : "",
      why:
        focus === "backend"
          ? "You said backend logic is what pulls you — we'll start you on HTTP APIs, the language-agnostic on-ramp."
          : "With no prior code yet, Frontend (HTML/CSS → JavaScript → React) is the most approachable starting point.",
    };
  }

  const feKnown = new Set(knownLanguages.filter((v) => LANGUAGE_OPTIONS.find((o) => o.value === v)?.side === "frontend"));
  const beKnown = new Set(knownLanguages.filter((v) => LANGUAGE_OPTIONS.find((o) => o.value === v)?.side === "backend"));
  let focus;
  if (feKnown.size && beKnown.size) focus = "both";
  else if (beKnown.size) focus = "backend";
  else if (feKnown.size) focus = "frontend";
  else focus = interestPull === "backend" ? "backend" : "frontend"; // knew languages but picked "other" only

  const feLevel = feKnown.has("react") || feKnown.has("angular") || feKnown.has("vue")
    ? "framework"
    : feKnown.has("typescript")
      ? "ts"
      : feKnown.has("javascript")
        ? "js"
        : feKnown.has("html-css")
          ? "html-css"
          : "none";
  const beLevel = beKnown.has("sql") || beKnown.size >= 2 ? "crud" : beKnown.size ? "http-api" : "http-api";

  const knownLabel = knownLanguages
    .map((v) => LANGUAGE_OPTIONS.find((o) => o.value === v)?.label)
    .filter(Boolean)
    .join(", ");
  return {
    focus,
    skillLevel: focus !== "backend" ? feLevel : "",
    beSkillLevel: focus !== "frontend" ? beLevel : "",
    why: knownLabel
      ? `Based on your experience with ${knownLabel}, we recommend ${
          focus === "both" ? "starting with both Frontend and Backend" : focus === "backend" ? "Backend" : "Frontend"
        } — that's where your existing skills carry over directly.`
      : "We recommend Frontend (HTML/CSS → JavaScript → React) as your starting track.",
  };
}

// No email field anymore — signing in with Google (below) IS how we get a verified, reachable
// email, so asking for one by hand and trusting it unverified was redundant. See EMPTY's lack of
// an `email` key: the submitted email always comes from the server's own session, never form state.
const EMPTY = {
  name: "",
  trade: "",
  skillLevel: "",
  beSkillLevel: "",
  aspiration: "",
  beAspiration: "",
  codingFocus: "both",
  note: "",
  ownershipAck: false,
  // Career-counselor signal — client-side only for computing the recommendation; folded into
  // `note` at submit time (see submitApplication) since the backend schema has no dedicated
  // fields for these, and a reviewer should still be able to see the raw answers.
  priorKnowledge: "",
  knownLanguages: [],
  interestPull: "",
};

// Founder call 2026-08-09 (v2): signing in isn't a separate mid-form gate — someone fills out the
// whole form first, then the submit button itself IS "Apply with Google" if they're not signed in
// yet. That means the form has to survive a full page navigation away to Google's consent screen and
// back (OAuth can't happen without one), so the draft goes here right before redirecting, gets
// restored + auto-submitted the moment the post-auth loginCode exchange succeeds, then is cleared —
// same "short-lived, used within seconds" spirit as the loginCode itself (auth-router.js).
const DRAFT_STORAGE_KEY = "ipf-apply-draft";

const OWNERSHIP_ACK_TEXT =
  "I understand this is a hands-on training engagement, not employment or a partnership. What I build becomes part of the product for training, portfolio, and reference purposes — I don't hold ownership, equity, or claim to revenue in future if any. I keep the experience and a verifiable reference for what I actually built.";

export default function Apply() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");
  const [submittedTrade, setSubmittedTrade] = useState("");
  const [matchResult, setMatchResult] = useState(null); // { matched, task? } from /api/recruit/apply

  const { session, status: authStatus, refresh, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [authNotice, setAuthNotice] = useState(null); // { kind: 'error' | 'signedIn', text }

  const [trades, setTrades] = useState(null); // null = loading, [] = loaded but empty
  const [tradesError, setTradesError] = useState(false);
  // Once true, the manual "prefer frontend/backend/both" + skill-level section is replaced by a
  // compact confirmation (see applyRecommendation/pickRole below and the render logic further
  // down) — showing the same choice again right after "Use this recommendation" read as broken.
  const [recommendationApplied, setRecommendationApplied] = useState(false);
  useEffect(() => {
    fetchAvailableTrades()
      .then(setTrades)
      .catch(() => {
        setTradesError(true);
        setTrades([]);
      });
  }, []);

  // The actual POST — parameterized on `data` rather than reading `form` directly, since the
  // post-Google-redirect path below has to call this from a restored draft, not live form state
  // (the whole in-memory component tree is gone and rebuilt across that navigation).
  async function submitApplication(data) {
    if (!data.ownershipAck) {
      setError("Please confirm the training / ownership acknowledgment before applying.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      // Recruit auto-matches at application time (server/recruit-router.js) — not a manual queue
      // step. Falls back to queued-for-Matching-Queue only when nothing's placeable yet. No email in
      // the body: the server requires this route's session and reads the verified email from it —
      // see recruit-router.js's own comment for why (this used to be a free-text field).
      const isDataCoding = data.trade.toLowerCase() === "coding";
      // Fold the counselor's raw signal into the note — there's no dedicated backend field for
      // "prior languages known," but a human reviewer (or the applicant re-reading their own
      // application) should still see what was actually said, not just the resulting focus/level.
      const counselorNote =
        isDataCoding && data.priorKnowledge
          ? data.priorKnowledge === "yes"
            ? `Prior coding experience: ${
                data.knownLanguages
                  .map((v) => LANGUAGE_OPTIONS.find((o) => o.value === v)?.label)
                  .filter(Boolean)
                  .join(", ") || "yes, unspecified languages"
              }.`
            : `No prior coding experience. Drawn to: ${
                data.interestPull === "backend"
                  ? "backend logic/data"
                  : data.interestPull === "frontend"
                    ? "frontend UI/interaction"
                    : "not sure yet"
              }.`
          : "";
      const fullNote = [counselorNote, data.note].filter(Boolean).join(" ");
      const res = await fetch("/api/recruit/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          trade: data.trade,
          skillLevel: isDataCoding ? data.skillLevel || undefined : undefined,
          beSkillLevel: isDataCoding ? data.beSkillLevel || undefined : undefined,
          aspiration: isDataCoding ? data.aspiration || undefined : undefined,
          beAspiration: isDataCoding ? data.beAspiration || undefined : undefined,
          codingFocus: isDataCoding ? data.codingFocus || "both" : undefined,
          note: fullNote || undefined,
          ownershipAck: true,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || `Application failed (${res.status})`);
      setSubmittedTrade(data.trade);
      setMatchResult(result);
      setStatus("done");
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  // Google's callback always lands here with ?loginCode=... (see server/auth-router.js) — trade it
  // in immediately via this same-origin, Vite-proxied call so the response (not Google's own
  // cross-origin redirect) is what actually sets the session cookie. Runs once per code: the query
  // param is stripped right after, so a page refresh never re-fires the exchange. If a draft was
  // saved before the redirect (handleApplyClick below), this is also where the application actually
  // gets submitted — the whole point of merging sign-in into the submit action is that the applicant
  // shouldn't have to click anything a second time after coming back from Google.
  useEffect(() => {
    const loginCode = searchParams.get("loginCode");
    const authError = searchParams.get("authError");
    if (!loginCode && !authError) return;

    const draftRaw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    const draft = draftRaw ? JSON.parse(draftRaw) : null;

    if (authError) {
      setAuthNotice({ kind: "error", text: "Google sign-in failed or was cancelled — please try again." });
      if (draft) setForm(draft); // don't make them re-type everything just to retry
      setSearchParams((p) => { p.delete("authError"); return p; }, { replace: true });
      return;
    }

    fetch("/api/auth/exchange-login-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: loginCode }),
    })
      .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Sign-in link expired");
        refresh();
        if (draft) {
          submitApplication(draft); // auto-submit — this IS the application completing, not a side effect
        } else {
          setAuthNotice({ kind: "signedIn", text: `Signed in as ${data.name}.` });
        }
      })
      .catch((err) => {
        setAuthNotice({ kind: "error", text: err.message });
        if (draft) setForm(draft);
      })
      .finally(() => setSearchParams((p) => { p.delete("loginCode"); return p; }, { replace: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once for whichever code/error is in the URL at mount
  }, []);

  // Prefill Name for someone who's already signed in when this page loads (e.g. came back via "Go
  // to Workbench" and returned, or the top strip below) — still editable, never overwrites what
  // they've already typed. Irrelevant to the draft-restore path above (that sets the whole form).
  useEffect(() => {
    if (session?.name && !form.name) setForm((f) => ({ ...f, name: session.name }));
  }, [session, form.name]);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function pickRole(value) {
    setForm((f) => ({
      ...f,
      trade: value,
      skillLevel: "",
      beSkillLevel: "",
      aspiration: "",
      beAspiration: "",
      priorKnowledge: "",
      knownLanguages: [],
      interestPull: "",
    }));
    setRecommendationApplied(false);
  }

  function toggleLanguage(value) {
    setForm((f) => ({
      ...f,
      knownLanguages: f.knownLanguages.includes(value)
        ? f.knownLanguages.filter((v) => v !== value)
        : [...f.knownLanguages, value],
    }));
    // Editing the answer the recommendation was based on invalidates an already-applied one —
    // re-show the (now recalculated) suggestion instead of a stale confirmation.
    setRecommendationApplied(false);
  }

  // Requires an actual answer on both branches — was true the instant priorKnowledge became "no",
  // before "What pulls you more?" had been touched, so the recommendation defaulted to Frontend
  // regardless of a stated backend/database pull (found live: recommendation banner showing above
  // three still-unselected pull cards).
  const counselorReady =
    (form.priorKnowledge === "no" && !!form.interestPull) ||
    (form.priorKnowledge === "yes" && (form.knownLanguages.length > 0 || !!form.interestPull));
  const rec = counselorReady
    ? recommend({ priorKnowledge: form.priorKnowledge, knownLanguages: form.knownLanguages, interestPull: form.interestPull })
    : null;

  function applyRecommendation() {
    if (!rec) return;
    setForm((f) => ({ ...f, codingFocus: rec.focus, skillLevel: rec.skillLevel, beSkillLevel: rec.beSkillLevel }));
    setRecommendationApplied(true);
  }

  const isCoding = form.trade.toLowerCase() === "coding";
  const isSignedIn = authStatus === "signedIn";
  const focus = form.codingFocus || "both";
  const needsFeSkill = isCoding && (focus === "frontend" || focus === "both");
  const needsBeSkill = isCoding && (focus === "backend" || focus === "both");
  const skillOk =
    (!needsFeSkill || !!form.skillLevel) && (!needsBeSkill || !!form.beSkillLevel);
  const canSubmit = form.name && form.trade && form.ownershipAck && (!isCoding || skillOk);

  // Plain-language summary of what "Use this recommendation" actually set — shown in place of the
  // confirmed recommendation banner once applied, so the applicant sees what they agreed to instead
  // of just a checkmark.
  const focusLabel = { frontend: "Frontend", backend: "Backend", both: "Frontend & Backend" }[form.codingFocus] || form.codingFocus;
  const feLevelLabel = SKILL_LEVELS.find((s) => s.value === form.skillLevel)?.label;
  const beLevelLabel = BE_SKILL_LEVELS.find((s) => s.value === form.beSkillLevel)?.label;
  const appliedSummary = [focusLabel, feLevelLabel, beLevelLabel].filter(Boolean).join(" · ");

  function handleApplyClick(e) {
    e.preventDefault();
    if (!canSubmit) return;
    if (isSignedIn) {
      submitApplication(form);
    } else {
      // Round-trip to Google and back (server/auth-router.js's /google/start → /google/callback →
      // ?loginCode= on this page) — the draft is what survives that full page navigation; the
      // loginCode effect above picks it up and auto-submits once signed in. Explicit returnTo keeps
      // Apply as the post-OAuth landing even if someone later changes the default.
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
      window.location.href = `/api/auth/google/start?returnTo=${encodeURIComponent("#/apply")}`;
    }
  }

  if (status === "done") {
    return (
      <div className="cm-apply">
        <div className="cm-done">
          {matchResult?.matched ? (
            <>
              <h1>You're in!</h1>
              <p className="cm-done-lead">
                Congratulations — you're now part of the <strong>{matchResult.task.project}</strong> development
                team. Your first task:
              </p>
              <p className="cm-done-task">
                #{matchResult.task.number} {matchResult.task.title}
              </p>
              <a
                className="cm-submit-btn cm-open-task-btn"
                href={`#/workbench?highlightTaskId=${matchResult.task.id}&highlightProjectId=${matchResult.task.projectId}`}
              >
                Open my task →
              </a>
              <p className="cm-done-sub">Assist Me is available inside the task if you need a guided lesson.</p>
              <p className="cm-legal-note">
                You confirmed at apply time that this is a hands-on training engagement — what you build becomes
                part of {matchResult.task.project} for training, portfolio, and reference purposes, without
                ownership, equity, or revenue claim.
              </p>
            </>
          ) : (
            <>
              <h1>Application received</h1>
              <p>
                Nothing open in {submittedTrade} is ready to assign right this second, so you&apos;re queued — we&apos;ll
                place you automatically as soon as a fitting task opens up.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="cm-apply">
      <header className="cm-header">
        <div className="cm-kicker">From campus to real product work</div>
        <h1>Apply — interests first, then a match</h1>
        <p className="cm-sub">
          Tell us your trade, where you are academically/career-wise, and (for Coding) frontend vs
          backend. We match you into a team building enterprise apps that will go live soon for
          thousands of customers — so you learn by shipping with others, not by stacking another solo
          project on your resume.
        </p>
      </header>

      {/* Signing in is now the "verify it's you" step inline below, not a separate optional link —
          this strip only appears for someone already signed in (e.g. returning to apply again, or
          checking their existing match) so there's exactly one sign-in entry point, not two. */}
      {authStatus === "signedIn" && session?.accountType === "js" && (
        <div className="cm-auth-strip" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, fontSize: 13 }}>
          <span>
            Signed in as <strong>{session.name}</strong> ({session.email}).
          </span>
          <a href="#/workbench">Go to your tasks</a>
          <button type="button" onClick={logout} style={{ background: "none", border: "none", color: "#0891b2", cursor: "pointer", padding: 0 }}>
            Sign out
          </button>
        </div>
      )}
      {authNotice && (
        <div
          className="cm-auth-notice"
          style={{
            marginBottom: 16,
            padding: "8px 12px",
            borderRadius: 6,
            fontSize: 13,
            background: authNotice.kind === "error" ? "#fef2f2" : "#f0fdf4",
            color: authNotice.kind === "error" ? "#991b1b" : "#166534",
          }}
        >
          {authNotice.text}
        </div>
      )}

      <form className="cm-form" onSubmit={handleApplyClick}>
        <label>
          Name
          <input required value={form.name} onChange={update("name")} placeholder="Jane Doe" />
        </label>

        <div className="cm-field-group">
          <span className="cm-field-label">What kind of work interests you?</span>
          {trades === null ? (
            <p className="cm-hint">Checking what's open…</p>
          ) : trades.length === 0 ? (
            <p className="cm-hint">
              {tradesError
                ? "Couldn't load open trades right now — try refreshing."
                : "Nothing open to be matched against yet — check back soon."}
            </p>
          ) : (
            <div className="cm-role-grid">
              {trades.map((trade) => {
                const copy = roleCardCopy(trade);
                const supported = isTradeSupported(trade);
                return (
                  <button
                    type="button"
                    key={trade}
                    disabled={!supported}
                    aria-disabled={!supported}
                    className={`cm-role-card ${form.trade === trade ? "cm-role-card-selected" : ""} ${!supported ? "cm-role-card-soon" : ""}`}
                    onClick={() => supported && pickRole(trade)}
                  >
                    <div className="cm-role-label">
                      {copy.label}
                      {!supported && <span className="cm-role-soon-badge">Coming soon</span>}
                    </div>
                    <p className="cm-role-blurb">
                      {supported
                        ? copy.blurb
                        : "We're only onboarding Frontend/Backend (Coding) right now — check back soon for this trade."}
                    </p>
                    {supported && copy.tech && <p className="cm-role-tech">{copy.tech}</p>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {isCoding && (
          <div className="cm-field-group cm-counselor">
            <span className="cm-field-label">Do you have any prior coding knowledge?</span>
            <div className="cm-skill-grid">
              {[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={`cm-skill-card ${form.priorKnowledge === opt.value ? "cm-skill-card-selected" : ""}`}
                  onClick={() => {
                    setForm((f) => ({
                      ...f,
                      priorKnowledge: opt.value,
                      knownLanguages: opt.value === "no" ? [] : f.knownLanguages,
                    }));
                    setRecommendationApplied(false);
                  }}
                >
                  <div className="cm-skill-label">{opt.label}</div>
                </button>
              ))}
            </div>

            {form.priorKnowledge === "yes" && (
              <>
                <span className="cm-field-label" style={{ marginTop: 12, display: "block" }}>
                  Which languages/tools have you used? <span className="cm-hint">pick any that apply</span>
                </span>
                <div className="cm-language-grid">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <button
                      type="button"
                      key={lang.value}
                      className={`cm-language-chip ${form.knownLanguages.includes(lang.value) ? "cm-language-chip-selected" : ""}`}
                      onClick={() => toggleLanguage(lang.value)}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {form.priorKnowledge === "no" && (
              <>
                <span className="cm-field-label" style={{ marginTop: 12, display: "block" }}>
                  What pulls you more?
                </span>
                <div className="cm-skill-grid">
                  {[
                    { value: "frontend", label: "What users see & interact with", blurb: "Layouts, interactions, UI." },
                    { value: "backend", label: "What happens behind the scenes", blurb: "Data, logic, rules, APIs." },
                    { value: "unsure", label: "Not sure yet", blurb: "We'll recommend a starting point." },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      className={`cm-skill-card ${form.interestPull === opt.value ? "cm-skill-card-selected" : ""}`}
                      onClick={() => {
                        setForm((f) => ({ ...f, interestPull: opt.value }));
                        setRecommendationApplied(false);
                      }}
                    >
                      <div className="cm-skill-label">{opt.label}</div>
                      <p className="cm-skill-blurb">{opt.blurb}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {rec && !recommendationApplied && (
              <div className="cm-recommendation">
                <div className="cm-recommendation-label">Our recommendation</div>
                <p className="cm-recommendation-text">{rec.why}</p>
                <button type="button" className="cm-recommendation-apply" onClick={applyRecommendation}>
                  Use this recommendation
                </button>
              </div>
            )}

            {recommendationApplied && (
              <div className="cm-recommendation cm-recommendation-confirmed">
                <div className="cm-recommendation-label cm-recommendation-label-confirmed">Track set</div>
                <p className="cm-recommendation-text cm-recommendation-text-confirmed">{appliedSummary}</p>
                <button type="button" className="cm-recommendation-change" onClick={() => setRecommendationApplied(false)}>
                  Choose differently
                </button>
              </div>
            )}
          </div>
        )}

        {isCoding && !recommendationApplied && (
          <div className="cm-field-group">
            <span className="cm-field-label">Prefer frontend, backend, or both?</span>
            <div className="cm-skill-grid">
              {[
                { value: "frontend", label: "Frontend", blurb: "UI / React tasks and webapp lessons." },
                { value: "backend", label: "Backend", blurb: "API / data tasks — language-agnostic skills." },
                { value: "both", label: "Both", blurb: "Open to either — typical Coding start." },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={`cm-skill-card ${form.codingFocus === opt.value ? "cm-skill-card-selected" : ""}`}
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      codingFocus: opt.value,
                      skillLevel: opt.value === "backend" ? "" : f.skillLevel,
                      beSkillLevel: opt.value === "frontend" ? "" : f.beSkillLevel,
                    }))
                  }
                >
                  <div className="cm-skill-label">{opt.label}</div>
                  <p className="cm-skill-blurb">{opt.blurb}</p>
                </button>
              ))}
            </div>

            {needsFeSkill && (
              <>
                <span className="cm-field-label" style={{ marginTop: 12, display: "block" }}>
                  Frontend comfort today
                </span>
                <div className="cm-skill-grid">
                  {SKILL_LEVELS.map((s) => (
                    <button
                      type="button"
                      key={s.value}
                      className={`cm-skill-card ${form.skillLevel === s.value ? "cm-skill-card-selected" : ""}`}
                      onClick={() => setForm((f) => ({ ...f, skillLevel: s.value }))}
                    >
                      <div className="cm-skill-label">{s.label}</div>
                      <p className="cm-skill-blurb">{s.blurb}</p>
                    </button>
                  ))}
                </div>
                <label className="cm-aspiration-label">
                  Frontend aim{" "}
                  <span className="cm-hint">optional — unlocks harder UI tasks later</span>
                  <select value={form.aspiration} onChange={update("aspiration")}>
                    <option value="">No particular target yet</option>
                    {ASPIRATION_LEVELS.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            {needsBeSkill && (
              <>
                <span className="cm-field-label" style={{ marginTop: 12, display: "block" }}>
                  Backend comfort today{" "}
                  <span className="cm-hint">language-agnostic</span>
                </span>
                <div className="cm-skill-grid">
                  {BE_SKILL_LEVELS.map((s) => (
                    <button
                      type="button"
                      key={s.value}
                      className={`cm-skill-card ${form.beSkillLevel === s.value ? "cm-skill-card-selected" : ""}`}
                      onClick={() => setForm((f) => ({ ...f, beSkillLevel: s.value }))}
                    >
                      <div className="cm-skill-label">{s.label}</div>
                      <p className="cm-skill-blurb">{s.blurb}</p>
                    </button>
                  ))}
                </div>
                <label className="cm-aspiration-label">
                  Backend aim{" "}
                  <span className="cm-hint">optional — unlocks CRUD-tier API tasks later</span>
                  <select value={form.beAspiration} onChange={update("beAspiration")}>
                    <option value="">No particular target yet</option>
                    {BE_ASPIRATION_LEVELS.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}
          </div>
        )}

        <label>
          Note <span className="cm-hint">optional</span>
          <textarea rows={3} value={form.note} onChange={update("note")} placeholder="Anything else worth knowing" />
        </label>

        <label className="cm-consent">
          <input
            type="checkbox"
            checked={form.ownershipAck}
            onChange={(e) => setForm((f) => ({ ...f, ownershipAck: e.target.checked }))}
          />
          <span>{OWNERSHIP_ACK_TEXT}</span>
        </label>

        <button type="submit" className="cm-submit-btn" disabled={status === "loading" || !canSubmit}>
          {status === "loading" ? "Submitting…" : isSignedIn ? "Submit application" : "Apply with Google"}
        </button>
        {!isSignedIn && (
          <p className="cm-hint">You'll sign in with Google as the last step — no separate password to create.</p>
        )}
        {status === "error" && <div className="cm-error">{error}</div>}
      </form>
    </div>
  );
}
