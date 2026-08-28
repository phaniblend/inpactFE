/**
 * Applicant → workday journey (SVG illustration).
 * Decorative; paired with accessible text list in JsExperienceHome.
 *
 * Row-based layout: each step is a full-width row (a small line-drawn character
 * illustration + title + description), connected top-to-bottom by a single arrowed
 * line down the left margin. Illustrations are hand-drawn scenes (a person doing the
 * action), not icon-in-a-box glyphs — that flatter icon-pack treatment read as dated
 * clip art (flagged live); a sketched character scene reads as an actual illustration.
 */
const ROW_H = 120;
const ROW_GAP = 16;
const ICON_COL = 156;
const PAD_X = 24;
const PAD_TOP = 24;
const WIDTH = 920;
const SCENE_W = 132;
const SCENE_H = 104;

const INK = "#0e7490";
const ACCENT = "#ea580c";

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

const sceneStroke = { fill: "none", stroke: INK, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" };
const accentStroke = { fill: "none", stroke: ACCENT, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" };

function SceneApply() {
  return (
    <g>
      <line x1="6" y1="88" x2="126" y2="88" {...sceneStroke} strokeWidth="2.5" />
      <path d="M40 88 L92 88 L84 78 L48 78 Z" {...sceneStroke} />
      <rect x="46" y="44" width="28" height="30" rx="2" {...sceneStroke} />
      <circle cx="70" cy="22" r="9" {...sceneStroke} />
      <path d="M70 31 C70 42 68 48 70 60" {...sceneStroke} />
      <path d="M70 42 C60 48 55 56 55 66" {...sceneStroke} />
      <path d="M70 42 C80 48 85 56 85 66" {...sceneStroke} />
      <path d="M54 60 l4 4 8 -9" {...accentStroke} strokeWidth="3" />
    </g>
  );
}

function SceneMatched() {
  return (
    <g>
      <circle cx="26" cy="26" r="9" {...sceneStroke} />
      <path d="M26 35 L26 62" {...sceneStroke} />
      <path d="M26 62 L17 88" {...sceneStroke} />
      <path d="M26 62 L35 88" {...sceneStroke} />
      <path d="M26 44 C40 48 50 50 58 52" {...sceneStroke} />
      <rect x="78" y="28" width="42" height="32" rx="4" {...sceneStroke} />
      <line x1="86" y1="40" x2="112" y2="40" {...sceneStroke} strokeWidth="2.2" />
      <line x1="86" y1="50" x2="104" y2="50" {...sceneStroke} strokeWidth="2.2" />
      <path d="M58 52 L78 52" stroke={INK} strokeWidth="2.2" strokeDasharray="2 6" strokeLinecap="round" />
      <path d="M68 45 L73 52 L68 59 L63 52 Z" fill={ACCENT} stroke="none" />
    </g>
  );
}

function SceneOpen() {
  return (
    <g>
      <circle cx="66" cy="20" r="9" {...sceneStroke} />
      <path d="M66 29 L66 40" {...sceneStroke} />
      <path d="M66 38 C54 42 46 46 40 52" {...sceneStroke} />
      <path d="M66 38 C78 42 86 46 92 52" {...sceneStroke} />
      <rect x="30" y="52" width="72" height="32" rx="3" {...sceneStroke} />
      <path d="M30 52 L66 36 L102 52" {...sceneStroke} />
      <line x1="42" y1="66" x2="90" y2="66" {...sceneStroke} strokeWidth="2.2" />
      <line x1="42" y1="76" x2="78" y2="76" {...sceneStroke} strokeWidth="2.2" />
    </g>
  );
}

function SceneBuild() {
  return (
    <g>
      <line x1="6" y1="88" x2="126" y2="88" {...sceneStroke} strokeWidth="2.5" />
      <path d="M40 88 L92 88 L84 78 L48 78 Z" {...sceneStroke} />
      <rect x="46" y="44" width="28" height="30" rx="2" {...sceneStroke} />
      <circle cx="70" cy="22" r="9" {...sceneStroke} />
      <path d="M70 31 C70 42 68 48 70 60" {...sceneStroke} />
      <path d="M70 40 C58 42 50 50 48 64" {...sceneStroke} />
      <path d="M70 40 C82 42 90 50 92 64" {...sceneStroke} />
      <path d="M56 56 l-4 4 4 4 M68 56 l4 4 -4 4 M63 53 l-3 14" {...accentStroke} strokeWidth="2.4" />
    </g>
  );
}

function SceneCommit() {
  return (
    <g>
      <line x1="104" y1="16" x2="104" y2="90" {...sceneStroke} strokeWidth="2.5" />
      <path d="M98 22 L104 13 L110 22" {...sceneStroke} strokeWidth="2.5" />
      <circle cx="104" cy="72" r="4.5" fill="#f8fafc" stroke={INK} strokeWidth="2.5" />
      <circle cx="104" cy="44" r="5.5" fill={ACCENT} stroke="#f8fafc" strokeWidth="2" />
      <circle cx="30" cy="26" r="9" {...sceneStroke} />
      <path d="M30 35 L30 62" {...sceneStroke} />
      <path d="M30 62 L21 88" {...sceneStroke} />
      <path d="M30 62 L39 88" {...sceneStroke} />
      <path d="M30 46 C50 48 72 46 92 44" {...sceneStroke} />
    </g>
  );
}

function SceneReview() {
  return (
    <g>
      <rect x="18" y="30" width="56" height="50" rx="4" {...sceneStroke} />
      <path d="M25 41 l3 3 6 -7" {...accentStroke} strokeWidth="2.4" />
      <line x1="40" y1="44" x2="68" y2="44" {...sceneStroke} strokeWidth="2.2" />
      <path d="M25 55 l3 3 6 -7" {...accentStroke} strokeWidth="2.4" />
      <line x1="40" y1="58" x2="68" y2="58" {...sceneStroke} strokeWidth="2.2" />
      <path d="M25 69 l3 3 6 -7" {...accentStroke} strokeWidth="2.4" />
      <line x1="40" y1="72" x2="60" y2="72" {...sceneStroke} strokeWidth="2.2" />
      <circle cx="100" cy="26" r="9" {...sceneStroke} />
      <path d="M100 35 L100 60" {...sceneStroke} />
      <path d="M100 60 L91 88" {...sceneStroke} />
      <path d="M100 60 L109 88" {...sceneStroke} />
      <path d="M100 44 C90 47 82 52 76 58" {...sceneStroke} />
      <circle cx="64" cy="46" r="11" fill="rgba(14,116,144,0.06)" stroke={INK} strokeWidth="3" />
      <line x1="72" y1="54" x2="79" y2="61" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    </g>
  );
}

const SCENES = {
  apply: SceneApply,
  matched: SceneMatched,
  open: SceneOpen,
  build: SceneBuild,
  commit: SceneCommit,
  review: SceneReview,
};

function GlyphHuddle() {
  return (
    <path
      d="M-9 -6a9 7 0 0 1 9-7 9 7 0 0 1 9 7c0 4-4 7-9 7a11 6 0 0 1-3-.4L-8 3l1.6-4.4A6.5 5 0 0 1-9-6z"
      fill="none"
      stroke={ACCENT}
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  );
}
function GlyphStatus() {
  return (
    <g stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" fill="none">
      <rect x="-8" y="-10" width="16" height="20" rx="2.5" />
      <path d="M-4 -4h8 M-4 1h8 M-4 6h5" />
    </g>
  );
}
function GlyphMerge() {
  return (
    <g stroke={ACCENT} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="-7" cy="-7" r="2.6" />
      <circle cx="-7" cy="7" r="2.6" />
      <circle cx="7" cy="-7" r="2.6" />
      <path d="M-7 -4.4V4.4 M-4.4 -7c6 0 9 2.5 9 8.5" />
    </g>
  );
}
function GlyphRitual() {
  return (
    <g stroke={ACCENT} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 -1a8 8 0 1 1-2.3-5.6" />
      <path d="M8 -9v4.5H3.5" />
    </g>
  );
}

const MEANWHILE_ITEMS = [
  { label: "Daily huddle", Glyph: GlyphHuddle },
  { label: "Status updates", Glyph: GlyphStatus },
  { label: "PR reviews", Glyph: GlyphMerge },
  { label: "Sprint rituals", Glyph: GlyphRitual },
];

export default function AspirantJourneyFlow() {
  return (
    <figure className="jxh-flow">
      <svg
        className="jxh-flow-svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Applicant journey: apply, get matched to an open task by trade, open the task, build it with Assist Me or solo, commit, then get reviewed — merged or sent back with feedback to fix and recommit. Meanwhile, once matched, you're on that product's team for daily huddles, status updates, PR reviews and sprint rituals."
      >
        <title>Applicant journey — apply to review</title>

        <defs>
          <marker id="jxhArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill={INK} />
          </marker>
        </defs>

        <rect width={WIDTH} height={HEIGHT} rx="18" fill="#f8fafc" />

        {/* single connecting line down the icon column, behind the illustrations */}
        <line
          x1={PAD_X + ICON_COL / 2}
          y1={PAD_TOP + 4}
          x2={PAD_X + ICON_COL / 2}
          y2={rowY(STEPS.length - 1) + ROW_H - 4}
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />

        {STEPS.map((step, i) => {
          const y = rowY(i);
          const Scene = SCENES[step.icon];
          const sceneX = PAD_X + (ICON_COL - SCENE_W) / 2;
          const sceneY = y + (ROW_H - SCENE_H) / 2;
          return (
            <g key={step.n}>
              <g transform={`translate(${sceneX}, ${sceneY})`}>
                <Scene />
              </g>

              <circle cx={PAD_X + 15} cy={y + 15} r="13" fill={ACCENT} stroke="#f8fafc" strokeWidth="3" />
              <text x={PAD_X + 15} y={y + 19.5} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
                {step.n}
              </text>

              <text x={PAD_X + ICON_COL + 20} y={y + 40} fill="#0c1222" fontSize="18" fontWeight="700" fontFamily="Fraunces, Georgia, serif">
                {step.title}
              </text>
              <text x={PAD_X + ICON_COL + 20} y={y + 66} fill="#475569" fontSize="13.5" fontFamily="Plus Jakarta Sans, sans-serif">
                {step.desc}
              </text>

              {i < STEPS.length - 1 && (
                <line
                  x1={PAD_X + ICON_COL / 2}
                  y1={y + ROW_H + 1}
                  x2={PAD_X + ICON_COL / 2}
                  y2={y + ROW_H + ROW_GAP - 1}
                  stroke={INK}
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

          {MEANWHILE_ITEMS.map((item, i) => {
            const colW = (WIDTH - PAD_X * 2) / MEANWHILE_ITEMS.length;
            const cx = colW * i + colW / 2;
            const cy = 62;
            const Glyph = item.Glyph;
            return (
              <g key={item.label}>
                <circle cx={cx} cy={cy} r="22" fill="#fff" stroke={ACCENT} strokeWidth="1.6" />
                <g transform={`translate(${cx}, ${cy})`}>
                  <Glyph />
                </g>
                <text
                  x={cx}
                  y={cy + 40}
                  textAnchor="middle"
                  fill="#7c2d12"
                  fontSize="12.5"
                  fontWeight="600"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
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
