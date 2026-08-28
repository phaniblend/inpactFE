/**
 * Applicant → workday journey (SVG illustration).
 * Decorative; paired with accessible text list in JsExperienceHome.
 *
 * Row-based layout, not circles-on-a-spine: each step gets a full-width row (icon badge +
 * title + description), connected top-to-bottom by a single arrowed line down the left margin.
 * Rows give text room to breathe — the earlier circle layout clipped/overflowed text at some
 * viewport widths (found live); a row can just be as tall as its content needs.
 */
const ROW_H = 108;
const ROW_GAP = 14;
const ICON_COL = 88;
const PAD_X = 24;
const PAD_TOP = 24;
const WIDTH = 900;

const STEPS = [
  {
    n: 1,
    title: "Apply",
    desc: "Pick FE or BE — the trade you want in.",
    icon: "apply",
  },
  {
    n: 2,
    title: "Get matched",
    desc: "To an open task in that trade — a real ticket, not an exercise.",
    icon: "matched",
  },
  {
    n: 3,
    title: "Open the task",
    desc: "Read the brief: what it needs and why it matters to the product.",
    icon: "open",
  },
  {
    n: 4,
    title: "Build it",
    desc: "Assist Me guide, or solo — your call either way.",
    icon: "build",
  },
  {
    n: 5,
    title: "Commit",
    desc: "Push your work, open a pull request.",
    icon: "commit",
  },
  {
    n: 6,
    title: "Review",
    desc: "Merged — or feedback, fix, recommit.",
    icon: "review",
  },
];

const rowY = (i) => PAD_TOP + i * (ROW_H + ROW_GAP);
const MEANWHILE_Y = rowY(STEPS.length) + 8;
const MEANWHILE_H = 132;
const HEIGHT = MEANWHILE_Y + MEANWHILE_H + 40;

function IconApply() {
  return (
    <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="8" width="26" height="34" rx="3" />
      <path d="M20 18h14 M20 25h14 M20 32h8" />
      <circle cx="34" cy="34" r="9" fill="#ea580c" stroke="none" />
      <path d="M30.5 34l2.5 2.5 5-5.5" stroke="#fff" strokeWidth="2.2" />
    </g>
  );
}
function IconMatched() {
  return (
    <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="24" r="9" fill="rgba(255,255,255,0.18)" />
      <rect x="30" y="16" width="18" height="16" rx="3" fill="rgba(255,255,255,0.18)" />
      <path d="M23 24h6" strokeDasharray="2.5 3" />
      <path d="M22.5 20.5l1.5 1.5-1.5 1.5" fill="none" />
    </g>
  );
}
function IconOpen() {
  return (
    <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 18h12l4 5h20v18a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z" fill="rgba(255,255,255,0.18)" />
      <path d="M10 24l-2 15a2 2 0 0 0 2 2h30l3-15z" fill="#fff" fillOpacity="0.92" stroke="#0e7490" strokeWidth="1.6" />
    </g>
  );
}
function IconBuild() {
  return (
    <g stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 16l-10 12 10 12" />
      <path d="M38 16l10 12-10 12" />
      <path d="M31 14l-4 28" strokeWidth="2.2" />
    </g>
  );
}
function IconCommit() {
  return (
    <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round">
      <path d="M28 8v13 M28 27v13" />
      <circle cx="28" cy="27" r="7" fill="#ea580c" stroke="#fff" strokeWidth="2" />
    </g>
  );
}
function IconReview() {
  return (
    <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 12l-8 4v10c0 9 6 14 14 17 8-3 14-8 14-17V16l-8-4-6-3z" fill="rgba(255,255,255,0.18)" />
      <path d="M19 25l6 6 12-13" />
    </g>
  );
}
const ICONS = { apply: IconApply, matched: IconMatched, open: IconOpen, build: IconBuild, commit: IconCommit, review: IconReview };

export default function AspirantJourneyFlow() {
  return (
    <figure className="jxh-flow">
      <svg
        className="jxh-flow-svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Applicant journey: apply, get matched to an open task by trade, open the task, build it with Assist Me or solo, commit, then get reviewed — merged or sent back with feedback to fix and recommit. Meanwhile, once matched, you're on that product's team for daily huddles and status updates."
      >
        <title>Applicant journey — apply to review</title>

        <defs>
          <linearGradient id="jxhGRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0e7490" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <marker id="jxhArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="#0e7490" />
          </marker>
        </defs>

        <rect width={WIDTH} height={HEIGHT} rx="18" fill="#f8fafc" />

        {/* single connecting line down the icon column, behind the badges */}
        <line
          x1={PAD_X + ICON_COL / 2}
          y1={PAD_TOP + 28}
          x2={PAD_X + ICON_COL / 2}
          y2={rowY(STEPS.length - 1) + 28}
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />

        {STEPS.map((step, i) => {
          const y = rowY(i);
          const Icon = ICONS[step.icon];
          return (
            <g key={step.n}>
              <rect x={PAD_X} y={y} width={ICON_COL - 16} height={ROW_H} rx="14" fill="url(#jxhGRing)" />
              <g transform={`translate(${PAD_X + 8}, ${y + (ROW_H - 56) / 2})`}>
                <Icon />
              </g>
              <circle cx={PAD_X + ICON_COL - 16} cy={y + 14} r="12" fill="#ea580c" stroke="#f8fafc" strokeWidth="2.5" />
              <text x={PAD_X + ICON_COL - 16} y={y + 18} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
                {step.n}
              </text>

              <text x={PAD_X + ICON_COL + 16} y={y + 32} fill="#0c1222" fontSize="18" fontWeight="700" fontFamily="Fraunces, Georgia, serif">
                {step.title}
              </text>
              <text x={PAD_X + ICON_COL + 16} y={y + 58} fill="#475569" fontSize="13.5" fontFamily="Plus Jakarta Sans, sans-serif">
                {step.desc}
              </text>

              {i < STEPS.length - 1 && (
                <line
                  x1={PAD_X + ICON_COL / 2}
                  y1={y + ROW_H + 1}
                  x2={PAD_X + ICON_COL / 2}
                  y2={y + ROW_H + ROW_GAP - 1}
                  stroke="#0e7490"
                  strokeWidth="2.5"
                  markerEnd="url(#jxhArrow)"
                />
              )}
            </g>
          );
        })}

        {/* ── Meanwhile band: on the product team ── */}
        <g transform={`translate(${PAD_X}, ${MEANWHILE_Y})`}>
          <rect x="0" y="0" width={WIDTH - PAD_X * 2} height={MEANWHILE_H} rx="14" fill="#fff7ed" stroke="#fdba74" strokeWidth="1.4" />
          <text x="20" y="26" fill="#c2410c" fontSize="10.5" fontWeight="700" letterSpacing="0.08em" fontFamily="Plus Jakarta Sans, sans-serif">
            MEANWHILE — YOU&apos;RE ON THAT PRODUCT&apos;S TEAM
          </text>

          <g transform="translate(24,48)">
            <ellipse cx="18" cy="18" rx="22" ry="15" fill="#fff" stroke="#ea580c" strokeWidth="1.5" />
            <path d="M6 30l-5 8 10-3z" fill="#fff" stroke="#ea580c" strokeWidth="1.5" />
          </g>
          <text x="24" y="98" fill="#7c2d12" fontSize="12" fontFamily="Plus Jakarta Sans, sans-serif">
            Daily huddle
          </text>

          <g transform="translate(210,50)">
            <rect x="0" y="0" width="56" height="40" rx="6" fill="#fff" stroke="#ea580c" strokeWidth="1.5" />
            <rect x="9" y="9" width="26" height="3.5" rx="1.5" fill="#ea580c" opacity="0.55" />
            <rect x="9" y="18" width="38" height="3.5" rx="1.5" fill="#ea580c" opacity="0.3" />
            <rect x="9" y="27" width="30" height="3.5" rx="1.5" fill="#ea580c" opacity="0.3" />
          </g>
          <text x="210" y="108" fill="#7c2d12" fontSize="12" fontFamily="Plus Jakarta Sans, sans-serif">
            Status updates
          </text>

          <g transform="translate(390,52)">
            <circle cx="14" cy="18" r="12" fill="#0e7490" />
            <circle cx="38" cy="14" r="11" fill="#38bdf8" />
            <circle cx="60" cy="19" r="10" fill="#ea580c" />
          </g>
          <text x="390" y="98" fill="#7c2d12" fontSize="12" fontFamily="Plus Jakarta Sans, sans-serif">
            Reviewers &amp; teammates
          </text>

          <g transform={`translate(${WIDTH - PAD_X * 2 - 210}, 40)`}>
            <rect x="0" y="0" width="190" height="60" rx="10" fill="#ea580c" />
            <text x="95" y="26" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
              Same scrum rituals
            </text>
            <text x="95" y="44" textAnchor="middle" fill="#ffedd5" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif">
              as any dev team
            </text>
          </g>
        </g>
      </svg>
      <figcaption className="jxh-flow-caption">
        Apply once, get matched to a real open task by trade, open it, build it with Assist Me or
        solo, commit your work, and get reviewed — merged, or sent back with feedback to fix and
        recommit. Once matched you're on that product's team, so daily huddles and status updates
        run alongside every step from "open task" onward.
      </figcaption>
    </figure>
  );
}
