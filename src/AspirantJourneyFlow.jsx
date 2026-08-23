/**
 * Applicant → workday journey (SVG illustration).
 * Decorative; paired with accessible text list in JsExperienceHome.
 *
 * Flow depicted: Apply -> matched to an open task (by trade preference, FE/BE) -> open the
 * task -> build it (Assist Me help or solo) -> commit -> review (merged, or feedback loop back
 * to commit). A second band below shows the parallel, ongoing part: once assigned, you're on
 * that product's team, so daily huddles + status updates run alongside the work.
 *
 * Layout math (kept simple on purpose, so it stays correct on the next edit):
 *   6 stages, each stage's group is translate(STAGE_X[i], 20), circle is local cx=90 cy=120 r=90.
 *   So each circle's global span is [STAGE_X[i], STAGE_X[i]+180], vertical center always y=140.
 *   Gap between consecutive circles is exactly GAP (40), so arrows drawn in
 *   [STAGE_X[i]+180, STAGE_X[i+1]] never cross into a circle.
 */
const STAGE_X = [20, 240, 460, 680, 900, 1120];
const GAP_MID = STAGE_X.map((x, i) => (i < STAGE_X.length - 1 ? x + 180 + 20 : null)).filter(Boolean);
const CANVAS_W = STAGE_X[STAGE_X.length - 1] + 180 + 20; // 1320
const CANVAS_H = 460;

export default function AspirantJourneyFlow() {
  return (
    <figure className="jxh-flow">
      <svg
        className="jxh-flow-svg"
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        role="img"
        aria-labelledby="jxh-flow-title jxh-flow-desc"
      >
        <title id="jxh-flow-title">Applicant to workday journey</title>
        <desc id="jxh-flow-desc">
          Apply, get matched to an open task by your trade preference (frontend or backend),
          open the task, build it with Assist Me help or on your own, commit your work, then get
          reviewed — merged, or sent back with feedback to fix and recommit. Meanwhile, as part of
          that product's team, you join daily huddles and share status like any scrum team.
        </desc>

        <defs>
          <linearGradient id="jxhGBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d8eef3" />
            <stop offset="55%" stopColor="#e8f4f7" />
            <stop offset="100%" stopColor="#cfe6ec" />
          </linearGradient>
          <linearGradient id="jxhGRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0e7490" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="jxhGWarm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
          <filter id="jxhSoft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0c1222" floodOpacity="0.08" />
          </filter>
          <marker id="jxhArrowWarm" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="#ea580c" />
          </marker>
        </defs>

        <rect width={CANVAS_W} height={CANVAS_H} rx="20" fill="url(#jxhGBg)" />

        {/* spine: one short arrow per gap between circles, never crossing into a circle */}
        {GAP_MID.map((gx, i) => (
          <g key={i}>
            <path d={`M${gx - 20} 140 H${gx + 20}`} stroke="#0e7490" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
            <polygon points={`${gx + 20},140 ${gx + 10},133 ${gx + 10},147`} fill="#0e7490" opacity="0.45" />
          </g>
        ))}

        {/* ── Stage 1: Apply ── */}
        <g transform={`translate(${STAGE_X[0]},20)`} filter="url(#jxhSoft)">
          <circle cx="90" cy="120" r="90" fill="#fff" stroke="url(#jxhGRing)" strokeWidth="3.5" />
          <rect x="40" y="24" width="90" height="16" rx="8" fill="#0e7490" />
          <text x="85" y="36" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="0.06em">
            START
          </text>
          <rect x="52" y="62" width="66" height="76" rx="6" fill="#e8f4f7" stroke="#0e7490" strokeWidth="1.5" />
          <rect x="62" y="76" width="46" height="4" rx="2" fill="#0e7490" opacity="0.55" />
          <rect x="62" y="88" width="34" height="4" rx="2" fill="#0e7490" opacity="0.35" />
          <rect x="62" y="100" width="40" height="4" rx="2" fill="#0e7490" opacity="0.35" />
          <circle cx="102" cy="122" r="14" fill="url(#jxhGWarm)" />
          <path d="M95 122 l5 5 l9 -10" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="90" y="176" textAnchor="middle" fill="#0c1222" fontSize="13" fontWeight="700" fontFamily="Fraunces, Georgia, serif">
            1 · Apply
          </text>
          <text x="90" y="196" textAnchor="middle" fill="#3d4a63" fontSize="10" fontFamily="Plus Jakarta Sans, sans-serif">
            Pick FE or BE
          </text>
        </g>

        {/* ── Stage 2: Matched ── */}
        <g transform={`translate(${STAGE_X[1]},20)`} filter="url(#jxhSoft)">
          <circle cx="90" cy="120" r="90" fill="#fff" stroke="url(#jxhGRing)" strokeWidth="3.5" />
          <circle cx="58" cy="110" r="22" fill="#155e75" />
          <text x="58" y="115" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
            YOU
          </text>
          <path d="M80 110 H98" stroke="#0e7490" strokeWidth="3" strokeDasharray="4 4" />
          <rect x="98" y="90" width="44" height="40" rx="8" fill="#fff7ed" stroke="#ea580c" strokeWidth="1.5" />
          <text x="120" y="114" textAnchor="middle" fill="#c2410c" fontSize="8" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
            TASK
          </text>
          <text x="90" y="176" textAnchor="middle" fill="#0c1222" fontSize="13" fontWeight="700" fontFamily="Fraunces, Georgia, serif">
            2 · Get matched
          </text>
          <text x="90" y="196" textAnchor="middle" fill="#3d4a63" fontSize="10" fontFamily="Plus Jakarta Sans, sans-serif">
            To an open task
          </text>
        </g>

        {/* ── Stage 3: Open task ── */}
        <g transform={`translate(${STAGE_X[2]},20)`} filter="url(#jxhSoft)">
          <circle cx="90" cy="120" r="90" fill="#fff" stroke="url(#jxhGRing)" strokeWidth="3.5" />
          <path d="M46 78 h34 l8 10 h44 v46 h-86 z" fill="#e8f4f7" stroke="#0e7490" strokeWidth="1.5" />
          <path d="M46 88 l-6 40 h86 l8 -40 z" fill="#fff" stroke="#0e7490" strokeWidth="1.5" />
          <rect x="58" y="112" width="40" height="4" rx="2" fill="#0e7490" opacity="0.45" />
          <rect x="58" y="122" width="26" height="4" rx="2" fill="#0e7490" opacity="0.3" />
          <text x="90" y="176" textAnchor="middle" fill="#0c1222" fontSize="13" fontWeight="700" fontFamily="Fraunces, Georgia, serif">
            3 · Open the task
          </text>
          <text x="90" y="196" textAnchor="middle" fill="#3d4a63" fontSize="10" fontFamily="Plus Jakarta Sans, sans-serif">
            Read the brief
          </text>
        </g>

        {/* ── Stage 4: Build it (Assist Me or solo) ── */}
        <g transform={`translate(${STAGE_X[3]},20)`} filter="url(#jxhSoft)">
          <circle cx="90" cy="120" r="90" fill="#fff" stroke="url(#jxhGRing)" strokeWidth="3.5" />
          <circle cx="90" cy="66" r="7" fill="url(#jxhGRing)" />
          <path d="M90 73 V86" stroke="#0e7490" strokeWidth="2.5" />
          <path d="M90 86 C90 98 56 94 56 108" fill="none" stroke="#0e7490" strokeWidth="2.5" />
          <path d="M90 86 C90 98 124 94 124 108" fill="none" stroke="#0e7490" strokeWidth="2.5" />
          <rect x="28" y="108" width="56" height="20" rx="10" fill="#e8f4f7" stroke="#0e7490" />
          <text x="56" y="122" textAnchor="middle" fill="#155e75" fontSize="7.5" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
            ASSIST ME
          </text>
          <rect x="96" y="108" width="56" height="20" rx="10" fill="#fff7ed" stroke="#ea580c" />
          <text x="124" y="122" textAnchor="middle" fill="#c2410c" fontSize="7.5" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
            SOLO
          </text>
          <text x="90" y="176" textAnchor="middle" fill="#0c1222" fontSize="13" fontWeight="700" fontFamily="Fraunces, Georgia, serif">
            4 · Build it
          </text>
          <text x="90" y="196" textAnchor="middle" fill="#3d4a63" fontSize="10" fontFamily="Plus Jakarta Sans, sans-serif">
            Your call, either way
          </text>
        </g>

        {/* ── Stage 5: Commit ── */}
        <g transform={`translate(${STAGE_X[4]},20)`} filter="url(#jxhSoft)">
          <circle cx="90" cy="120" r="90" fill="#fff" stroke="url(#jxhGRing)" strokeWidth="3.5" />
          <path d="M62 66 V150" stroke="#0e7490" strokeWidth="2.5" />
          <path d="M62 92 C62 108 112 100 112 118" fill="none" stroke="#0e7490" strokeWidth="2.5" opacity="0.6" />
          <circle cx="62" cy="70" r="8" fill="#94a3b8" />
          <circle cx="62" cy="118" r="9" fill="url(#jxhGWarm)" />
          <circle cx="112" cy="122" r="8" fill="#94a3b8" opacity="0.7" />
          <rect x="30" y="132" width="64" height="16" rx="8" fill="#fff7ed" stroke="#ea580c" />
          <text x="62" y="144" textAnchor="middle" fill="#c2410c" fontSize="7.5" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
            git commit
          </text>
          <text x="90" y="176" textAnchor="middle" fill="#0c1222" fontSize="13" fontWeight="700" fontFamily="Fraunces, Georgia, serif">
            5 · Commit
          </text>
          <text x="90" y="196" textAnchor="middle" fill="#3d4a63" fontSize="10" fontFamily="Plus Jakarta Sans, sans-serif">
            Push your work
          </text>
        </g>

        {/* ── Stage 6: Review (merge or feedback loop) ── */}
        <g transform={`translate(${STAGE_X[5]},20)`} filter="url(#jxhSoft)">
          <circle cx="90" cy="120" r="90" fill="#fff" stroke="url(#jxhGRing)" strokeWidth="3.5" />
          <path d="M62 70 C62 90 90 86 90 104" fill="none" stroke="#0e7490" strokeWidth="2.5" />
          <path d="M118 70 C118 90 90 86 90 104" fill="none" stroke="#0e7490" strokeWidth="2.5" />
          <circle cx="62" cy="64" r="7" fill="#94a3b8" />
          <circle cx="118" cy="64" r="7" fill="#94a3b8" />
          <circle cx="90" cy="114" r="18" fill="url(#jxhGRing)" />
          <path d="M81 114 l6 7 l13 -15" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M55 138 C22 150 20 108 48 92" fill="none" stroke="#ea580c" strokeWidth="2" strokeDasharray="3 4" markerEnd="url(#jxhArrowWarm)" />
          <text x="90" y="176" textAnchor="middle" fill="#0c1222" fontSize="13" fontWeight="700" fontFamily="Fraunces, Georgia, serif">
            6 · Review
          </text>
          <text x="90" y="196" textAnchor="middle" fill="#3d4a63" fontSize="9.5" fontFamily="Plus Jakarta Sans, sans-serif">
            Merged, or feedback + recommit
          </text>
        </g>

        {/* ── Meanwhile band: on the product team ── */}
        <g transform="translate(20,262)">
          <rect x="0" y="0" width={CANVAS_W - 40} height="118" rx="16" fill="#ffffff" stroke="#0e7490" strokeWidth="1.5" strokeOpacity="0.35" />
          <text x="24" y="26" fill="#5c6b86" fontSize="10.5" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="0.08em">
            MEANWHILE — YOU'RE ON THAT PRODUCT'S TEAM
          </text>

          <g transform="translate(40,44)">
            <ellipse cx="20" cy="20" rx="26" ry="18" fill="#e8f4f7" stroke="#0e7490" strokeWidth="1.5" />
            <path d="M6 34 l-6 10 12 -4 z" fill="#e8f4f7" stroke="#0e7490" strokeWidth="1.5" />
            <ellipse cx="52" cy="12" rx="20" ry="14" fill="#fff7ed" stroke="#ea580c" strokeWidth="1.5" />
            <path d="M64 22 l6 8 -10 -3 z" fill="#fff7ed" stroke="#ea580c" strokeWidth="1.5" />
            <text x="34" y="24" textAnchor="middle" fill="#155e75" fontSize="7" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
              STAND-UP
            </text>
          </g>
          <text x="46" y="98" fill="#3d4a63" fontSize="10" fontFamily="Plus Jakarta Sans, sans-serif">
            Daily huddle
          </text>

          <g transform="translate(240,44)">
            <rect x="0" y="0" width="66" height="46" rx="6" fill="#e8f4f7" stroke="#0e7490" strokeWidth="1.5" />
            <rect x="10" y="10" width="30" height="4" rx="2" fill="#0e7490" opacity="0.5" />
            <circle cx="52" cy="12" r="5" fill="url(#jxhGWarm)" />
            <rect x="10" y="20" width="46" height="4" rx="2" fill="#0e7490" opacity="0.3" />
            <rect x="10" y="30" width="36" height="4" rx="2" fill="#0e7490" opacity="0.3" />
          </g>
          <text x="240" y="106" fill="#3d4a63" fontSize="10" fontFamily="Plus Jakarta Sans, sans-serif">
            Status updates
          </text>

          <g transform="translate(440,46)">
            <circle cx="16" cy="20" r="14" fill="#155e75" />
            <circle cx="46" cy="16" r="13" fill="#0e7490" />
            <circle cx="76" cy="22" r="12" fill="#fb923c" />
            <circle cx="104" cy="18" r="11" fill="#38bdf8" />
          </g>
          <text x="440" y="98" fill="#3d4a63" fontSize="10" fontFamily="Plus Jakarta Sans, sans-serif">
            Reviewers &amp; teammates
          </text>

          <g transform="translate(680,32)">
            <rect x="0" y="0" width="180" height="58" rx="10" fill="#fff7ed" stroke="#ea580c" strokeWidth="1.2" />
            <text x="90" y="26" textAnchor="middle" fill="#c2410c" fontSize="9.5" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
              Same scrum rituals
            </text>
            <text x="90" y="42" textAnchor="middle" fill="#9a3412" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif">
              as any dev team
            </text>
          </g>
        </g>

        <text
          x={CANVAS_W / 2}
          y="428"
          textAnchor="middle"
          fill="#5c6b86"
          fontSize="11"
          fontWeight="600"
          fontFamily="Plus Jakarta Sans, sans-serif"
          letterSpacing="0.1em"
        >
          APPLICANT JOURNEY · APPLY → MATCHED → BUILD → REVIEW
        </text>
      </svg>
    </figure>
  );
}
