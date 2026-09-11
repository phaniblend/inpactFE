/**
 * RouteMatrix's guided tour — stage markup + the 7-chapter script, ported faithfully from the
 * pasted "RouteMatrix Interactive Guided Tour with Chapter Navigation" HTML mockup (2026-09-10).
 * Same mechanics note as MiniERPTour.jsx: real measured cursor targets (moveCursorToRef) instead
 * of the original's hardcoded pixel coordinates, since this stage is responsive.
 */

function CompassIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

const SEED_ORDERS_HTML = `
  <tr>
    <td><strong>ORD-101</strong></td>
    <td>Apex Design Studio</td>
    <td>10:00 - 12:00</td>
    <td>45 kg</td>
    <td><span class="gt-badge gt-badge-amber">QUEUED</span></td>
  </tr>
  <tr>
    <td><strong>ORD-102</strong></td>
    <td>Beacon BioLabs</td>
    <td>11:00 - 13:00</td>
    <td>80 kg</td>
    <td><span class="gt-badge gt-badge-amber">QUEUED</span></td>
  </tr>
  <tr>
    <td><strong>ORD-103</strong></td>
    <td>Crestview Law</td>
    <td>13:00 - 15:00</td>
    <td>35 kg</td>
    <td><span class="gt-badge gt-badge-amber">QUEUED</span></td>
  </tr>
`;

const DISPATCHED_ROW_HTML = `<tr><td colspan="5" style="text-align:center;color:var(--gt-text-muted);padding:18px;">All queued stops dispatched to active vehicle manifest.</td></tr>`;

export function renderRouteMatrixStage(reg) {
  return (
    <>
      <div className="gt-topbar">
        <div className="gt-brand">
          <CompassIcon />
          RouteMatrix <span className="gt-brand-sub">Capacitated Dispatch Core</span>
        </div>
        <div className="gt-pill" ref={reg("fleetPill")}>
          <CheckIcon />
          <span ref={reg("fleetPillText")}>FLEET PAYLOAD: 100% NOMINAL</span>
        </div>
      </div>

      <div className="gt-viewport">
        <div className="gt-kpi-row" ref={reg("kpiDeck")}>
          <div className="gt-kpi-card">
            <span className="gt-kpi-label">Unassigned Orders</span>
            <span className="gt-kpi-val" ref={reg("valUnassigned")} style={{ color: "var(--gt-amber)" }}>3 Stops</span>
          </div>
          <div className="gt-kpi-card">
            <span className="gt-kpi-label">Total Planned Transit</span>
            <span className="gt-kpi-val" ref={reg("valDistance")} style={{ color: "#fff" }}>0.0 km</span>
          </div>
          <div className="gt-kpi-card">
            <span className="gt-kpi-label">Completed Deliveries</span>
            <span className="gt-kpi-val" ref={reg("valPods")} style={{ color: "var(--gt-emerald)" }}>0 / 3</span>
          </div>
        </div>

        <div className="gt-panel" ref={reg("manifestPanel")}>
          <div className="gt-panel-header">
            <span>Unassigned Order Queue</span>
            <span className="gt-badge gt-badge-blue">WGS84 Ingestion</span>
          </div>
          <table>
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Window</th><th>Weight</th><th>Status</th></tr>
            </thead>
            <tbody ref={reg("ordersBody")}>
              <tr>
                <td><strong>ORD-101</strong></td>
                <td>Apex Design Studio</td>
                <td>10:00 - 12:00</td>
                <td>45 kg</td>
                <td><span className="gt-badge gt-badge-amber">QUEUED</span></td>
              </tr>
              <tr>
                <td><strong>ORD-102</strong></td>
                <td>Beacon BioLabs</td>
                <td>11:00 - 13:00</td>
                <td>80 kg</td>
                <td><span className="gt-badge gt-badge-amber">QUEUED</span></td>
              </tr>
              <tr>
                <td><strong>ORD-103</strong></td>
                <td>Crestview Law</td>
                <td>13:00 - 15:00</td>
                <td>35 kg</td>
                <td><span className="gt-badge gt-badge-amber">QUEUED</span></td>
              </tr>
            </tbody>
          </table>

          <div className="gt-action-card" ref={reg("actionCard")}>
            <div>
              <div className="gt-action-title">Delivery Stop 1 Reached: Apex Design</div>
              <div className="gt-action-subtitle">Digital signature collected: "J. Miller" (Timestamped Base64).</div>
            </div>
            <button type="button" className="gt-action-btn">CONFIRM &amp; ADVANCE</button>
          </div>
        </div>

        <div className="gt-panel" ref={reg("driverPanel")}>
          <div className="gt-panel-header">
            <span>Van 04 — Driver: Alex Rivera</span>
            <span style={{ fontSize: "10px", color: "var(--gt-text-muted)" }}>Max 450 kg</span>
          </div>
          <div className="gt-capacity-gauge" ref={reg("capacityBox")}>
            <div className="gt-gauge-top">
              <span>Payload Utilization</span>
              <span ref={reg("capPercentText")}>0% (0 / 450 kg)</span>
            </div>
            <div className="gt-bar-bg">
              <div className="gt-bar-fill" ref={reg("capBar")} />
            </div>
          </div>
          <div className="gt-panel-header" style={{ marginTop: "4px" }}>
            <span>Active Sequential Stops</span>
          </div>
          <div className="gt-ledger-list" ref={reg("routeStopsList")}>
            <div style={{ fontSize: "12px", color: "var(--gt-text-muted)", fontStyle: "italic" }}>
              No route currently assigned.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function resetSimulationState(refs) {
  if (refs.valUnassigned) refs.valUnassigned.textContent = "3 Stops";
  if (refs.valDistance) refs.valDistance.textContent = "0.0 km";
  if (refs.valPods) refs.valPods.textContent = "0 / 3";
  if (refs.capBar) refs.capBar.style.width = "0%";
  if (refs.capPercentText) refs.capPercentText.textContent = "0% (0 / 450 kg)";
  if (refs.ordersBody) refs.ordersBody.innerHTML = SEED_ORDERS_HTML;
  if (refs.routeStopsList) {
    refs.routeStopsList.innerHTML = `<div style="font-size:12px;color:var(--gt-text-muted);font-style:italic;">No route currently assigned.</div>`;
  }
  if (refs.actionCard) refs.actionCard.classList.remove("open");
  if (refs.fleetPill) {
    refs.fleetPill.style.background = "rgba(255, 255, 255, 0.04)";
    refs.fleetPill.style.borderColor = "var(--gt-panel-border)";
  }
  if (refs.fleetPillText) refs.fleetPillText.textContent = "FLEET PAYLOAD: 100% NOMINAL";
}

function addStopEntry(refs, seq, title, meta, status = "PENDING") {
  const feed = refs.routeStopsList;
  if (!feed) return;
  if (feed.children.length === 1 && feed.children[0].tagName === "DIV" && !feed.children[0].className) {
    feed.innerHTML = "";
  }
  const row = document.createElement("div");
  row.className = "gt-ledger-entry";
  row.innerHTML = `
    <div>
      <strong style="color:#fff;">Stop ${seq}:</strong> ${title}
      <div style="font-size:10px;color:#94a3b8;margin-top:2px;">${meta}</div>
    </div>
    <span class="gt-badge ${status === "COMPLETED" ? "gt-badge-emerald" : "gt-badge-amber"}" data-stop-badge="${seq}">${status}</span>
  `;
  feed.appendChild(row);
  setTimeout(() => row.classList.add("show"), 40);
}

function markStopCompleted(refs, seq) {
  const badge = refs.routeStopsList?.querySelector(`[data-stop-badge="${seq}"]`);
  if (badge) {
    badge.className = "gt-badge gt-badge-emerald";
    badge.textContent = "COMPLETED";
  }
}

const N = {
  fleetProblem:
    "Local delivery fleets and service providers lose thousands of dollars each month because dispatchers manually plan routes across multiple browser tabs. Drivers guess their delivery sequences, vans crisscross town with excessive mileage, and packages exceed vehicle weight ratings without warning.",
  ingestionChecks:
    "RouteMatrix validates every order at ingestion. Orders require clean WGS-eighty-four spatial coordinates, package weights, cubic volume, and promised arrival windows. Corrupted addresses or negative delivery timeframes are rejected before they touch the routing solver.",
  capacityGuard:
    "Notice the vehicle payload meter on the right. Before assigning a route, RouteMatrix checks the driver's vehicle limits. Alex's van has a four-hundred and fifty kilogram limit. The three pending orders total one-hundred and sixty kilograms, verified safe to load without breaching transport safety regulations.",
  spatialSolver:
    "Clicking optimize triggers our spatial solver. The engine computes point-to-point spherical Haversine distances from the company depot and sequences the stops into an optimal fourteen-point-eight kilometer manifest, minimizing driving time and fuel consumption.",
  mobilePod:
    "When the driver arrives at Stop One, the customer signs directly on the mobile web application. The digital signature and completion timestamp are captured instantly, eliminating customer delivery disputes with non-repudiable proof of delivery.",
  autoCloseout:
    "Submitting proof of delivery updates the driver manifest and live dispatcher telemetry in real time. When the driver completes the final delivery on the route, the system automatically transitions the parent route to completed inside an ACID database transaction.",
  zeroLockIn:
    "Because RouteMatrix runs completely self-hosted with open-source technologies, local delivery operations gain full fleet visibility and automated route optimization without paying enterprise per-task overages or monthly software retainers.",
};

export const routeMatrixChapters = [
  {
    title: "Fleet Problem",
    caption: "Independent delivery fleets waste hours guessing delivery sequences on consumer map apps while risking van overloads.",
    setup: (refs) => resetSimulationState(refs),
    run: async (sId, h) => {
      h.highlightElement("manifestPanel", "gt-accent-blue", 8);
      await h.moveCursorToRef("manifestPanel", 40, 60);
      await h.speakText(N.fleetProblem, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Ingestion Checks",
    caption: "Orders ingest with strict WGS84 GPS validation and chronological delivery window enforcement.",
    setup: (refs) => resetSimulationState(refs),
    run: async (sId, h) => {
      h.highlightElement("ordersBody", "gt-accent-amber", 6);
      await h.moveCursorToRef("ordersBody", 60, 30);
      await h.speakText(N.ingestionChecks, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Capacity Guard",
    caption: "The Payload Invariant strictly guarantees vans never exceed physical weight or cubic volume ratings.",
    setup: (refs) => resetSimulationState(refs),
    run: async (sId, h, refs) => {
      h.highlightElement("capacityBox", "gt-accent-emerald", 6);
      await h.moveCursorToRef("capacityBox", 60, 20);
      if (refs.capBar) refs.capBar.style.width = "35.5%";
      if (refs.capPercentText) refs.capPercentText.textContent = "35.5% (160 / 450 kg)";
      await h.speakText(N.capacityGuard, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Spatial Solver",
    caption: "The solver executes a Nearest-Neighbor heuristic, sequencing stops by proximity and cutting transit to 14.8 km.",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.capBar) refs.capBar.style.width = "35.5%";
      if (refs.capPercentText) refs.capPercentText.textContent = "35.5% (160 / 450 kg)";
    },
    run: async (sId, h, refs) => {
      if (refs.valUnassigned) refs.valUnassigned.textContent = "0 Stops";
      if (refs.valDistance) refs.valDistance.textContent = "14.8 km";
      if (refs.ordersBody) refs.ordersBody.innerHTML = DISPATCHED_ROW_HTML;
      addStopEntry(refs, 1, "Apex Design Studio", "10:00 - 12:00 · 45 kg");
      addStopEntry(refs, 2, "Beacon BioLabs", "11:00 - 13:00 · 80 kg");
      addStopEntry(refs, 3, "Crestview Law", "13:00 - 15:00 · 35 kg");

      h.highlightElement("driverPanel", "gt-accent-blue", 8);
      await h.moveCursorToRef("driverPanel", 60, 40);
      await h.speakText(N.spatialSolver, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Mobile POD",
    caption: "At the destination, the driver captures non-repudiable proof of delivery with a digital signature on mobile.",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.capBar) refs.capBar.style.width = "35.5%";
      if (refs.capPercentText) refs.capPercentText.textContent = "35.5% (160 / 450 kg)";
      if (refs.valUnassigned) refs.valUnassigned.textContent = "0 Stops";
      if (refs.valDistance) refs.valDistance.textContent = "14.8 km";
      if (refs.ordersBody) refs.ordersBody.innerHTML = DISPATCHED_ROW_HTML;
      addStopEntry(refs, 1, "Apex Design Studio", "10:00 - 12:00 · 45 kg");
      addStopEntry(refs, 2, "Beacon BioLabs", "11:00 - 13:00 · 80 kg");
      addStopEntry(refs, 3, "Crestview Law", "13:00 - 15:00 · 35 kg");
    },
    run: async (sId, h, refs) => {
      refs.actionCard?.classList.add("open");
      h.highlightElement("actionCard", "gt-accent-blue", 6);
      await h.moveCursorToRef("actionCard", 200, 20);
      await h.speakText(N.mobilePod, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Auto-Closeout",
    caption: "Confirming delivery advances the sequence, updates telemetry, and automatically completes the route when the last stop closes.",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.capBar) refs.capBar.style.width = "35.5%";
      if (refs.capPercentText) refs.capPercentText.textContent = "35.5% (160 / 450 kg)";
      if (refs.valUnassigned) refs.valUnassigned.textContent = "0 Stops";
      if (refs.valDistance) refs.valDistance.textContent = "14.8 km";
      if (refs.ordersBody) refs.ordersBody.innerHTML = DISPATCHED_ROW_HTML;
      addStopEntry(refs, 1, "Apex Design Studio", "10:00 - 12:00 · 45 kg");
      addStopEntry(refs, 2, "Beacon BioLabs", "11:00 - 13:00 · 80 kg");
      addStopEntry(refs, 3, "Crestview Law", "13:00 - 15:00 · 35 kg");
      refs.actionCard?.classList.add("open");
    },
    run: async (sId, h, refs) => {
      await h.moveCursorToRef("actionCard", 260, 20);
      refs.actionCard?.classList.remove("open");
      if (refs.valPods) refs.valPods.textContent = "3 / 3";
      markStopCompleted(refs, 1);
      markStopCompleted(refs, 2);
      markStopCompleted(refs, 3);

      h.highlightElement("driverPanel", "gt-accent-emerald", 8);
      await h.moveCursorToRef("driverPanel", 60, 60);
      await h.speakText(N.autoCloseout, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Zero Lock-In",
    caption: "RouteMatrix delivers enterprise-level dispatch and capacity intelligence with zero per-stop fees or vendor lock-in.",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.capBar) refs.capBar.style.width = "35.5%";
      if (refs.capPercentText) refs.capPercentText.textContent = "35.5% (160 / 450 kg)";
      if (refs.valUnassigned) refs.valUnassigned.textContent = "0 Stops";
      if (refs.valDistance) refs.valDistance.textContent = "14.8 km";
      if (refs.ordersBody) refs.ordersBody.innerHTML = DISPATCHED_ROW_HTML;
      addStopEntry(refs, 1, "Apex Design Studio", "10:00 - 12:00 · 45 kg", "COMPLETED");
      addStopEntry(refs, 2, "Beacon BioLabs", "11:00 - 13:00 · 80 kg", "COMPLETED");
      addStopEntry(refs, 3, "Crestview Law", "13:00 - 15:00 · 35 kg", "COMPLETED");
      if (refs.valPods) refs.valPods.textContent = "3 / 3";
    },
    run: async (sId, h, refs) => {
      h.highlightElement("fleetPill", "gt-accent-emerald", 4);
      await h.moveCursorToRef("fleetPill", 60, 12);
      if (refs.fleetPill) {
        refs.fleetPill.style.background = "rgba(52, 211, 153, 0.15)";
        refs.fleetPill.style.borderColor = "var(--gt-emerald)";
      }
      if (refs.fleetPillText) refs.fleetPillText.textContent = "ROUTE RT-9042: ALL STOPS COMPLETED";

      await h.speakText(N.zeroLockIn, sId);
      h.clearHighlight();
    },
  },
];
