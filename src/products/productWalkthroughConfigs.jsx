/**
 * Per-product config for ProductWalkthrough.jsx — one entry per catalog product with a real
 * engineering walkthrough. Ported faithfully from the three "Interactive Walkthrough Simulator"
 * HTML mockups the user provided (2026-09-10): SentinelPOS.html (renamed from KioskGuard),
 * RouteMatrix.html, BatchCraft.html — same phase labels, same console log lines, same visual
 * beats, just re-expressed as data + JSX render functions instead of hand-rolled vanilla JS/DOM.
 *
 * Each entry: { title, subtitle, badgeLabel, badgeTone, phases: [{ phaseLabel, title, logs,
 * renderCanvas(activePhase) }] }. `logs` accumulate as the walkthrough advances (phase N's panel
 * shows every log line from phase 1 through N) — a deliberate improvement over the original HTML,
 * which re-appended the same lines to the DOM on every revisit of a phase (harmless there since
 * nobody scripted a return trip, but not a pattern worth reproducing in a real component).
 *
 * MiniERP has no entry yet — no walkthrough mockup was provided for it. ProductWalkthrough.jsx
 * renders nothing (not a placeholder) when a productKey has no config, so nothing breaks in the
 * meantime; add its entry here the same way once that mockup exists.
 */

export const PRODUCT_WALKTHROUGHS = {
  sentinelpos: {
    title: "SentinelPOS",
    subtitle: "Cashier Anomaly & Refund Fraud Pipeline",
    badgeLabel: "Real-Time Anomaly Interceptor",
    badgeTone: "rose",
    phases: [
      {
        phaseLabel: "PHASE 01",
        title: "POS Ingestion Stream",
        activeNodes: ["pos"],
        logs: [{ tag: "INGEST", msg: "Captured Event: TX_REFUND #4092, Cashier ID: usr_c91, Amount: $185.00" }],
      },
      {
        phaseLabel: "PHASE 02",
        title: "Gaussian Z-Score Eval",
        activeNodes: ["worker"],
        logs: [
          { tag: "BULLMQ", msg: 'Job queued into "fraud-eval-zscore". Processing cashier historical distribution…' },
          { tag: "STATS", msg: "μ (Mean) = $24.10, σ (StdDev) = $18.40", type: "warn" },
        ],
      },
      {
        phaseLabel: "PHASE 03",
        title: "Threshold Anomaly Flag",
        activeNodes: ["stats"],
        logs: [
          { tag: "CALC", msg: "Z-Score = (185.00 − 24.10) / 18.40 = 8.74", type: "err" },
          { tag: "ALERT", msg: "CRITICAL THRESHOLD EXCEEDED (Z > 3.00). Incident flagged as SUSPECTED_TILL_DRAIN.", type: "err" },
        ],
      },
      {
        phaseLabel: "PHASE 04",
        title: "WORM Audit & S3 Lock",
        activeNodes: ["audit"],
        logs: [
          { tag: "WORM", msg: "Emitted audit record. Hash: e3b0c44298fc… to the tamper-proof evidence bucket.", type: "success" },
          { tag: "COMMIT", msg: "POS Terminal #04 remote lock triggered. Incident ticket #INC-8819 opened.", type: "success" },
        ],
      },
    ],
    renderCanvas: (activeNodes) => (
      <div className="pw-canvas-flow">
        <div className="pw-flow-row">
          <div className={`pw-flow-node${activeNodes.includes("pos") ? " active" : ""}`}>
            <span className="pw-flow-node-tag">SRC: POS #04</span>
            <span>Cashier Refund $185.00</span>
          </div>
          <div className="pw-flow-arrow">➔</div>
          <div className={`pw-flow-node${activeNodes.includes("worker") ? " active" : ""}`}>
            <span className="pw-flow-node-tag">EVAL: Queue</span>
            <span>Anomaly Ingestion</span>
          </div>
        </div>
        <div className="pw-flow-row">
          <div className={`pw-flow-node${activeNodes.includes("stats") ? " active" : ""}`}>
            <span className="pw-flow-node-tag">MATH: Mean &amp; StdDev</span>
            <span>Z = (X − μ) / σ</span>
          </div>
          <div className="pw-flow-arrow">➔</div>
          <div className={`pw-flow-node${activeNodes.includes("audit") ? " active" : ""}`}>
            <span className="pw-flow-node-tag">SEC: WORM Storage</span>
            <span>Immutable Evidence Ledger</span>
          </div>
        </div>
      </div>
    ),
  },

  routematrix: {
    title: "RouteMatrix",
    subtitle: "Capacitated VRPTW & Proof-of-Delivery Auto-Closeout",
    badgeLabel: "Vehicle Routing Engine",
    badgeTone: "accent",
    phases: [
      {
        phaseLabel: "PHASE 01",
        title: "Capacity & Payload Check",
        mapState: "idle",
        logs: [
          { tag: "PAYLOAD", msg: "Aggregating stops: Stop 1 (45kg) + Stop 2 (80kg) + Stop 3 (60kg) = 185.00kg." },
          { tag: "VALIDATE", msg: "Total 185kg ≤ max 450kg. Payload verified within vehicle capacity safety margin.", type: "success" },
        ],
      },
      {
        phaseLabel: "PHASE 02",
        title: "Nearest Neighbor Sort",
        mapState: "solved",
        logs: [
          { tag: "SOLVER", msg: "Executing spherical Haversine heuristic…" },
          { tag: "ORDER", msg: "Optimal sequence generated: Depot ➔ Stop 1 (4.2km) ➔ Stop 2 (7.8km) ➔ Stop 3 (6.1km). Total: 18.10km." },
        ],
      },
      {
        phaseLabel: "PHASE 03",
        title: "Driver Mobile POD Capture",
        mapState: "solved",
        logs: [
          { tag: "DRIVER-APP", msg: "Driver sync: Stop 1 & Stop 2 signed and completed." },
          { tag: "CAPTURE", msg: "Ingesting Stop 3 signature + GPS coordinates at time of delivery.", type: "warn" },
        ],
      },
      {
        phaseLabel: "PHASE 04",
        title: "Atomic Route Closeout",
        mapState: "completed",
        logs: [
          { tag: "TX-COMMIT", msg: "Zero pending stops remaining for Route RT-100482.", type: "success" },
          { tag: "ATOMIC", msg: 'Route.status transitioned to "COMPLETED" in the same transaction as the last stop.', type: "success" },
        ],
      },
    ],
    renderCanvas: (_activeNodes, mapState) => {
      const dotColor = mapState === "idle" ? "#475569" : mapState === "completed" ? "#34d399" : "#38bdf8";
      const lineColor = mapState === "idle" ? "#334155" : "#38bdf8";
      return (
        <svg width="100%" height="200" viewBox="0 0 340 200" className="pw-map-svg" role="img" aria-label="Route map from depot through three stops">
          <circle cx="50" cy="100" r="8" fill="#38bdf8" />
          <text x="40" y="85" fill="#38bdf8" fontSize="10" fontWeight="bold">DEPOT</text>
          <line x1="50" y1="100" x2="130" y2="50" stroke={lineColor} strokeDasharray={mapState === "idle" ? "4" : "0"} strokeWidth="2" />
          <line x1="130" y1="50" x2="220" y2="70" stroke={lineColor} strokeDasharray={mapState === "idle" ? "4" : "0"} strokeWidth="2" />
          <line x1="220" y1="70" x2="280" y2="140" stroke={lineColor} strokeDasharray={mapState === "idle" ? "4" : "0"} strokeWidth="2" />
          <circle cx="130" cy="50" r="6" fill={dotColor} />
          <text x="138" y="54" fill="#94a3b8" fontSize="9">Stop 1 (45kg)</text>
          <circle cx="220" cy="70" r="6" fill={dotColor} />
          <text x="228" y="74" fill="#94a3b8" fontSize="9">Stop 2 (80kg)</text>
          <circle cx="280" cy="140" r="6" fill={dotColor} />
          <text x="225" y="155" fill="#94a3b8" fontSize="9">Stop 3 (60kg)</text>
        </svg>
      );
    },
  },

  batchcraft: {
    title: "BatchCraft",
    subtitle: "Recursive Yield Explosion & Atomic Depletion",
    badgeLabel: "Culinary ERP Core",
    badgeTone: "emerald",
    phases: [
      {
        phaseLabel: "PHASE 01",
        title: "Scale Factor Calculation",
        activeNodes: ["root"],
        logs: [{ tag: "SCALE", msg: "Target yield: 25 portions. Standard recipe yield: 10 portions. Multiplier: 2.50×." }],
      },
      {
        phaseLabel: "PHASE 02",
        title: "Edible Yield % Adjustment",
        activeNodes: ["sub1"],
        logs: [
          { tag: "YIELD-ADJ", msg: "Marinara Sauce: cook-down loss 22% (yield 78%). Unit cost inflated from $0.42/100ml to $0.5385/100ml.", type: "warn" },
          { tag: "YIELD-ADJ", msg: "Ground Beef: fat trim loss 8% (yield 92%). Base $8.50/kg scaled to $9.2391/kg edible-portion cost.", type: "warn" },
        ],
      },
      {
        phaseLabel: "PHASE 03",
        title: "Recursive Sub-Recipe Costing",
        activeNodes: ["sub2"],
        logs: [
          { tag: "RECURSION", msg: "Exploding child sub-assemblies: 2.5 × (Marinara cost + Beef cost + Mozzarella cost)." },
          { tag: "PLATE-COST", msg: "Calculated cost per serving: $3.48 | Menu selling price: $16.00 | Food cost: 21.75%", type: "success" },
        ],
      },
      {
        phaseLabel: "PHASE 04",
        title: "Atomic Inventory Commit",
        activeNodes: ["root"],
        logs: [
          { tag: "STOCK-TX", msg: "Deducting pantry inventory: −2.50kg raw tomatoes, −3.75kg ground beef, −1.25kg pasta sheets.", type: "success" },
          { tag: "COMMITTED", msg: "Generated finished batch BATCH-44019 (yield: 25 servings). Stock updated.", type: "success" },
        ],
      },
    ],
    renderCanvas: (activeNodes) => (
      <div className="pw-canvas-flow" style={{ flexDirection: "column", gap: "14px" }}>
        <div className={`pw-flow-node pw-flow-node-wide${activeNodes.includes("root") ? " active" : ""}`}>
          <span className="pw-flow-node-tag pw-flow-node-tag-emerald">ROOT DISH (×2.5 Batch)</span>
          <span>Artisan Meat Lasagna</span>
        </div>
        <div className="pw-canvas-decompose">↓ Decomposing sub-recipes</div>
        <div className="pw-flow-row">
          <div className={`pw-flow-node${activeNodes.includes("sub1") ? " active" : ""}`}>
            <span className="pw-flow-node-tag pw-flow-node-tag-amber">SUB-RECIPE</span>
            <span>Marinara Base (78% Yield)</span>
          </div>
          <div className={`pw-flow-node${activeNodes.includes("sub2") ? " active" : ""}`}>
            <span className="pw-flow-node-tag pw-flow-node-tag-amber">RAW COMMODITY</span>
            <span>Ground Beef (92% Trim)</span>
          </div>
        </div>
      </div>
    ),
  },
};

export function slugForProjectName(name) {
  const key = (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  return Object.keys(PRODUCT_WALKTHROUGHS).find((k) => k === key) || null;
}
