import { useEffect, useRef, useState } from "react";
import { PRODUCT_WALKTHROUGHS } from "./productWalkthroughConfigs.jsx";
import "./ProductWalkthrough.css";

/**
 * The reusable animated walkthrough — one shared component, per-product data in
 * productWalkthroughConfigs.jsx. Renders wherever a product's real engineering story needs to be
 * told: the public /products/:slug overview page, a task's Assist Me intro (via
 * inpact_engine_shared.jsx's `content.walkthroughProduct` field), and linked from the task list
 * (Workbench.jsx). Same 4-phase timeline / canvas / console-log / Prev-Next-AutoPlay-Reset chrome
 * across every product; only the canvas visual and the log lines differ per config.
 *
 * `productKey` looks up PRODUCT_WALKTHROUGHS. Renders nothing (not an error, not a placeholder) for
 * an unknown or missing key — e.g. MiniERP, which has no walkthrough mockup yet — so embedding this
 * unconditionally in shared lesson chrome never breaks a product that isn't ready.
 */
export default function ProductWalkthrough({ productKey }) {
  const config = PRODUCT_WALKTHROUGHS[productKey];
  const [step, setStep] = useState(0); // 0-based index into config.phases
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!config) return null;

  const totalPhases = config.phases.length;
  const activePhase = config.phases[step];

  function goTo(nextStep) {
    setStep(Math.max(0, Math.min(totalPhases - 1, nextStep)));
  }

  function togglePlay() {
    if (playing) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setPlaying(false);
      return;
    }
    setPlaying(true);
    intervalRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= totalPhases - 1) return 0;
        return s + 1;
      });
    }, 1800);
  }

  function reset() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setPlaying(false);
    }
    setStep(0);
  }

  // Cumulative log — every phase's lines from the first through the currently active one, so the
  // console reads as the real story building up rather than resetting each click.
  const visibleLogs = config.phases.slice(0, step + 1).flatMap((p, i) =>
    p.logs.map((log, j) => ({ ...log, key: `${i}-${j}` }))
  );

  return (
    <div className="pw-container">
      <div className="pw-header-row">
        <h3 className="pw-title">
          {config.title}
          <span className="pw-subtitle">| {config.subtitle}</span>
        </h3>
        <span className={`pw-badge pw-badge-${config.badgeTone}`}>{config.badgeLabel}</span>
      </div>

      <div className="pw-timeline">
        {config.phases.map((p, i) => (
          <div
            key={p.phaseLabel}
            className={`pw-timeline-step${i === step ? " active" : ""}${i < step ? " completed" : ""}`}
          >
            <div className="pw-step-number">{p.phaseLabel}</div>
            <div className="pw-step-title">{p.title}</div>
          </div>
        ))}
      </div>

      <div className="pw-simulation-grid">
        <div className="pw-sim-panel">
          <div className="pw-panel-header">Visual State Engine</div>
          <div className="pw-stage-canvas">
            {config.renderCanvas(activePhase.activeNodes || [], activePhase.mapState)}
          </div>
        </div>
        <div className="pw-sim-panel">
          <div className="pw-panel-header">Telemetry Execution Stream</div>
          <div className="pw-console-stream">
            {visibleLogs.map((log) => (
              <div key={log.key}>
                <span className="pw-log-accent">{log.tag}:</span> <span className={log.type ? `pw-log-${log.type}` : ""}>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pw-controls">
        <div className="pw-step-label">
          Step <strong>{step + 1} of {totalPhases}</strong>
        </div>
        <div className="pw-btn-group">
          <button type="button" onClick={() => goTo(step - 1)} disabled={step === 0}>Prev</button>
          <button type="button" className="pw-btn-primary" onClick={() => goTo(step + 1)} disabled={step === totalPhases - 1}>
            Next Step ➔
          </button>
          <button type="button" onClick={togglePlay}>{playing ? "Pause" : "Auto Play"}</button>
          <button type="button" onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  );
}
