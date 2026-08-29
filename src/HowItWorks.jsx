import { useNavigate } from "react-router-dom";
import "./HowItWorks.css";

/**
 * "How it works" section content for JsExperienceHome (#/join, #/try). Replaces the earlier
 * SVG-diagram + accessible-list combo (AspirantJourneyFlow) with a fuller walkthrough: fast-track
 * onboarding steps, the daily team rhythm, then the three-phase build→review→ship loop.
 *
 * Self-contained: every custom property and reset lives under .hiw so it can't leak into the rest
 * of the page (the source mockup this was built from styled :root/body/* directly).
 */
export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="hiw">
      <div className="hiw-header">
        <div className="hiw-pill">
          <span className="hiw-pill-dot" />
          Virtual Enterprise Architecture
        </div>
        <h2 className="hiw-title">
          How You <span>Build &amp; Ship</span> with Inpact
        </h2>
        <p className="hiw-subtitle">
          Skip synthetic tutorials. Join an active engineering squad shipping real software for
          small businesses, and finish with a verified portfolio of your work.
        </p>
      </div>

      {/* Fast-Track Application Stream */}
      <div className="hiw-onboarding">
        <div className="hiw-onboarding-lead">
          <h3>Fast-Track Entry</h3>
          <p>Immediate placement into live engineering sprints without paperwork hurdles or gatekeeping.</p>
        </div>

        <div className="hiw-mini-steps">
          <div className="hiw-mini-step">
            <div className="hiw-mini-step-svg">
              <svg viewBox="0 0 100 60" width="100" height="60">
                <rect x="25" y="8" width="50" height="44" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
                <rect x="30" y="14" width="10" height="10" rx="2" fill="#0284c7" />
                <line x1="45" y1="19" x2="68" y2="19" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                <rect x="30" y="28" width="10" height="10" rx="2" fill="#e2e8f0" />
                <line x1="45" y1="33" x2="68" y2="33" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                <path d="M70 36 C 75 36, 75 48, 70 48" fill="none" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="80" cy="42" r="3" fill="#f59e0b" />
              </svg>
            </div>
            <div>
              <div className="hiw-mini-step-tag">Step 01</div>
              <div className="hiw-mini-step-title">Share Interests</div>
              <div className="hiw-mini-step-desc">
                Pick what you want to build (Front-end or Back-end) and what tech excites you.
              </div>
            </div>
          </div>

          <div className="hiw-mini-step">
            <div className="hiw-mini-step-svg">
              <svg viewBox="0 0 100 60" width="100" height="60">
                <circle cx="50" cy="30" r="22" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
                <circle cx="50" cy="24" r="8" fill="#0284c7" />
                <path d="M36 44 C 36 37, 42 35, 50 35 C 58 35, 64 37, 64 44" fill="#1e293b" />
                <circle cx="66" cy="20" r="6" fill="#10b981" />
                <polyline
                  points="63 20 65 22 69 18"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <div className="hiw-mini-step-tag">Step 02</div>
              <div className="hiw-mini-step-title">One-Click Sign In</div>
              <div className="hiw-mini-step-desc">
                Sign in with Google to create your account and unlock your personal workspace.
              </div>
            </div>
          </div>

          <div className="hiw-mini-step">
            <div className="hiw-mini-step-svg">
              <svg viewBox="0 0 100 60" width="100" height="60">
                <circle cx="32" cy="30" r="14" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
                <rect x="60" y="18" width="26" height="24" rx="4" fill="#ffffff" stroke="#0d9488" strokeWidth="1.5" />
                <line x1="65" y1="24" x2="78" y2="24" stroke="#0d9488" strokeWidth="1.5" />
                <line x1="65" y1="30" x2="74" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />
                <path d="M46 30 L 58 30" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,2" />
                <polygon points="58,28 62,30 58,32" fill="#f59e0b" />
              </svg>
            </div>
            <div>
              <div className="hiw-mini-step-tag">Step 03</div>
              <div className="hiw-mini-step-title">Get Matched</div>
              <div className="hiw-mini-step-desc">
                Our system instantly assigns you a real feature to build based on your stated interests.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative everyday engineering rhythm */}
      <aside className="hiw-rhythm" aria-label="Everyday team support">
        <div className="hiw-rhythm-header">
          <div className="hiw-rhythm-title-group">
            <span className="hiw-pulse-dot" />
            <h3>What Your Daily Routine Looks Like</h3>
          </div>
          <span className="hiw-rhythm-tag">Happens In Parallel With Your Work</span>
        </div>

        <div className="hiw-rhythm-grid">
          <div className="hiw-rhythm-item">
            <div className="hiw-rhythm-icon-box hiw-rhythm-icon-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="hiw-rhythm-item-text">
              <h4>Quick 1-Minute Daily Check-ins</h4>
              <p>
                Post a quick update on our team board on your own schedule: what you worked on,
                what you're doing next, and how it's going.
              </p>
            </div>
          </div>

          <div className="hiw-rhythm-item">
            <div className="hiw-rhythm-icon-box hiw-rhythm-icon-amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div className="hiw-rhythm-item-text">
              <h4>Mentors Clear Your Roadblocks</h4>
              <p>
                If you hit a wall or get confused, drop a note. Senior teammates unblock you so
                you're never left guessing or stuck alone.
              </p>
            </div>
          </div>

          <div className="hiw-rhythm-item">
            <div className="hiw-rhythm-icon-box hiw-rhythm-icon-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div className="hiw-rhythm-item-text">
              <h4>Unlock Advanced Skills Automatically</h4>
              <p>
                Each feature you finish logs progress to your profile and automatically unlocks
                more advanced challenges.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* The 3 sequential engineering delivery phases */}
      <div className="hiw-section-label">
        <h3>The Core Production Loop</h3>
        <span>3 SIMPLE STEPS TO REAL EXPERIENCE</span>
      </div>

      <div className="hiw-pipeline">
        {/* Phase 1: Workbench & Assist Module */}
        <article className="hiw-step">
          <div>
            <div className="hiw-step-top">
              <span className="hiw-step-num">PHASE 01</span>
              <span className="hiw-status-badge">Hands-On Building</span>
            </div>

            <div className="hiw-scene-box">
              <svg viewBox="0 0 240 120" width="220" height="110">
                <ellipse cx="120" cy="65" rx="90" ry="40" fill="#f1f5f9" />
                <rect x="50" y="80" width="130" height="4" rx="2" fill="#cbd5e1" />
                <line x1="65" y1="84" x2="65" y2="110" stroke="#cbd5e1" strokeWidth="3" />
                <line x1="165" y1="84" x2="165" y2="110" stroke="#cbd5e1" strokeWidth="3" />
                <rect x="110" y="45" width="48" height="32" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
                <line x1="134" y1="77" x2="134" y2="82" stroke="#94a3b8" strokeWidth="2" />
                <rect x="114" y="50" width="22" height="14" fill="#e0f2fe" />
                <rect x="114" y="67" width="40" height="2" fill="#0284c7" />
                <rect x="114" y="71" width="26" height="2" fill="#cbd5e1" />
                <circle cx="85" cy="40" r="10" fill="#f87171" />
                <rect x="75" y="52" width="20" height="26" rx="4" fill="#0284c7" />
                <line x1="90" y1="62" x2="112" y2="76" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
                <rect x="72" y="78" width="24" height="6" fill="#1e293b" />
                <line x1="80" y1="84" x2="74" y2="110" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                <line x1="90" y1="84" x2="94" y2="110" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                <path d="M190,75 Q195,50 185,45 Q195,65 190,75" fill="#10b981" />
                <path d="M192,75 Q205,55 200,50 Q196,65 192,75" fill="#059669" />
                <polygon points="186,75 198,75 195,88 189,88" fill="#d97706" />
                <g transform="translate(140, 20)">
                  <rect width="46" height="20" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
                  <text x="5" y="14" fontSize="9" fontWeight="bold" fill="#92400e" fontFamily="sans-serif">
                    Assist Me
                  </text>
                </g>
              </svg>
            </div>

            <h4 className="hiw-step-heading">Read the Brief &amp; Build</h4>
            <ul className="hiw-duty-list">
              <li className="hiw-duty-item">
                <svg className="hiw-check-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>
                  <strong>Your Role:</strong> Read simple project instructions, write the code, and
                  build your feature.
                </span>
              </li>
              <li className="hiw-duty-item">
                <svg className="hiw-check-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>
                  <strong>Built-In Help:</strong> Whenever you feel stuck, click <em>Assist Me</em>{" "}
                  for a mini-lesson tailored exactly to what you're working on.
                </span>
              </li>
            </ul>
          </div>
          <div className="hiw-micro-box hiw-micro-box-amber">
            <strong>Built-In Guidance:</strong>
            <div>Interactive Help: Clean User Interface Basics</div>
          </div>
        </article>

        {/* Phase 2: Human PR review & iteration */}
        <article className="hiw-step">
          <div>
            <div className="hiw-step-top">
              <span className="hiw-step-num">PHASE 02</span>
              <span className="hiw-status-badge">Expert Feedback</span>
            </div>

            <div className="hiw-scene-box">
              <svg viewBox="0 0 240 120" width="220" height="110">
                <ellipse cx="120" cy="65" rx="90" ry="40" fill="#f1f5f9" />
                <rect x="40" y="30" width="60" height="55" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="40" y1="42" x2="100" y2="42" stroke="#e2e8f0" strokeWidth="1.5" />
                <rect x="46" y="48" width="12" height="10" rx="2" fill="#10b981" />
                <rect x="62" y="48" width="12" height="10" rx="2" fill="#0284c7" />
                <rect x="46" y="64" width="12" height="10" rx="2" fill="#f59e0b" />
                <rect x="78" y="48" width="14" height="24" rx="2" fill="#eff6ff" stroke="#93c5fd" />
                <circle cx="140" cy="35" r="10" fill="#475569" />
                <rect x="130" y="47" width="20" height="30" rx="4" fill="#1e293b" />
                <line x1="140" y1="47" x2="140" y2="60" stroke="#ffffff" strokeWidth="2" />
                <polygon points="140,60 138,50 142,50" fill="#ef4444" />
                <line x1="130" y1="55" x2="108" y2="48" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                <circle cx="106" cy="48" r="3" fill="#fbcfe8" />
                <line x1="135" y1="77" x2="132" y2="110" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                <line x1="145" y1="77" x2="148" y2="110" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                <g transform="translate(170, 45)">
                  <circle cx="14" cy="14" r="14" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                  <polyline points="9 14 13 18 19 10" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
            </div>

            <h4 className="hiw-step-heading">Submit Work &amp; Get Feedback</h4>
            <ul className="hiw-duty-list">
              <li className="hiw-duty-item">
                <svg className="hiw-check-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>
                  <strong>Your Role:</strong> Submit your completed work for review with a single click.
                </span>
              </li>
              <li className="hiw-duty-item">
                <svg className="hiw-check-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>
                  <strong>Senior Guidance:</strong> Real engineers review your code line-by-line and
                  give you friendly, clear tips to improve.
                </span>
              </li>
            </ul>
          </div>
          <div className="hiw-micro-box hiw-micro-box-dark">
            <div>
              <span className="hiw-status-amber">● Review Status:</span> Helpful Tips Provided
            </div>
            <div className="hiw-status-green">✔ Approved &amp; Added to Live App</div>
          </div>
        </article>

        {/* Phase 3: Verified outcome & public proof */}
        <article className="hiw-step hiw-step-outcome">
          <div>
            <div className="hiw-step-top">
              <span className="hiw-step-num hiw-step-num-outcome">PHASE 03</span>
              <span className="hiw-status-badge hiw-status-badge-outcome">Your Portfolio</span>
            </div>

            <div className="hiw-scene-box hiw-scene-box-outcome">
              <svg viewBox="0 0 240 120" width="220" height="110">
                <path d="M60,95 C40,65 50,25 90,30 C130,35 150,85 130,105 Z" fill="#ccfbf1" />
                <rect x="140" y="25" width="55" height="75" rx="5" fill="#ffffff" stroke="#059669" strokeWidth="2" />
                <rect x="158" y="20" width="18" height="8" rx="2" fill="#0f172a" />
                <line x1="150" y1="40" x2="182" y2="40" stroke="#cbd5e1" strokeWidth="2" />
                <circle cx="152" cy="52" r="3" fill="#10b981" />
                <line x1="160" y1="52" x2="184" y2="52" stroke="#64748b" strokeWidth="2" />
                <circle cx="152" cy="64" r="3" fill="#10b981" />
                <line x1="160" y1="64" x2="184" y2="64" stroke="#64748b" strokeWidth="2" />
                <circle cx="152" cy="76" r="3" fill="#10b981" />
                <line x1="160" y1="76" x2="184" y2="76" stroke="#64748b" strokeWidth="2" />
                <line x1="150" y1="88" x2="175" y2="88" stroke="#0284c7" strokeWidth="2" />
                <circle cx="95" cy="35" r="10" fill="#d97706" />
                <rect x="85" y="47" width="20" height="30" rx="4" fill="#0d9488" />
                <rect x="91" y="47" width="8" height="30" fill="#ffffff" />
                <line x1="105" y1="58" x2="136" y2="52" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" />
                <circle cx="137" cy="52" r="3" fill="#fed7aa" />
                <line x1="90" y1="77" x2="88" y2="110" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
                <line x1="100" y1="77" x2="102" y2="110" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

            <h4 className="hiw-step-heading">Show Off Real Work</h4>
            <ul className="hiw-duty-list">
              <li className="hiw-duty-item">
                <svg className="hiw-check-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>
                  <strong>Public Repo:</strong> Every feature you ship lands in the product's open
                  source repo, commit history intact, with your name on it.
                </span>
              </li>
              <li className="hiw-duty-item">
                <svg className="hiw-check-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>
                  <strong>Job Ready:</strong> Send hiring managers a link to the repo — real, working
                  software you personally helped build and ship.
                </span>
              </li>
            </ul>
          </div>

          <div className="hiw-proof-banner">
            <div>
              <h4>ShiftCoverage App // Active Feature Shipped</h4>
              <p className="hiw-proof-byline">Your Name • 3 Live Features Contributed</p>
            </div>
            <div className="hiw-proof-chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              VERIFIED EXPERIENCE
            </div>
          </div>
        </article>
      </div>

      {/* Bottom CTA bar */}
      <div className="hiw-loop-cta">
        <div className="hiw-loop-cta-text">
          <h3>Ready to build your verified software portfolio?</h3>
          <p>Work on real software, learn from real engineers, and graduate with undeniable proof of your work.</p>
        </div>
        <button type="button" className="hiw-cta-btn" onClick={() => navigate("/apply")}>
          Join a Product Team →
        </button>
      </div>
    </div>
  );
}
