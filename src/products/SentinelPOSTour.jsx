/**
 * SentinelPOS's guided tour — stage markup + the 7-chapter script, ported faithfully from the
 * pasted "KioskGuard Interactive Guided Tour with Chapter Navigation" HTML mockup (2026-09-10) —
 * KioskGuard was renamed to SentinelPOS earlier this session (same product, id 14); this port uses
 * the new name throughout. Same mechanics note as MiniERPTour.jsx: real measured cursor targets
 * (moveCursorToRef) instead of the original's hardcoded pixel coordinates.
 */

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
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

export function renderSentinelPOSStage(reg) {
  return (
    <>
      <div className="gt-topbar">
        <div className="gt-brand">
          <ShieldIcon />
          SentinelPOS <span className="gt-brand-sub">Loss Prevention &amp; Exception Analytics</span>
        </div>
        <div className="gt-pill" ref={reg("integrityPill")}>
          <CheckIcon />
          <span ref={reg("integrityText")}>TERMINAL STREAMS: NOMINAL (0 FLAGGED)</span>
        </div>
      </div>

      <div className="gt-viewport">
        <div className="gt-kpi-row" ref={reg("kpiDeck")}>
          <div className="gt-kpi-card">
            <span className="gt-kpi-label">Shift Suspected Shrink</span>
            <span className="gt-kpi-val" ref={reg("valShrink")} style={{ color: "#fff" }}>$0.00</span>
          </div>
          <div className="gt-kpi-card">
            <span className="gt-kpi-label">Active Z-Score Alerts</span>
            <span className="gt-kpi-val" ref={reg("valAnomalies")} style={{ color: "var(--gt-emerald)" }}>0 Active</span>
          </div>
          <div className="gt-kpi-card" ref={reg("cardVault")}>
            <span className="gt-kpi-label">Sealed WORM Packets</span>
            <span className="gt-kpi-val" ref={reg("valVault")} style={{ color: "var(--gt-accent)" }}>0 Sealed</span>
          </div>
        </div>

        <div className="gt-panel" ref={reg("rosterPanel")}>
          <div className="gt-panel-header">
            <span>Active Cashier Shift Roster</span>
            <span className="gt-badge gt-badge-blue">Gaussian 30-Day Baselines</span>
          </div>
          <table>
            <thead>
              <tr><th>Emp ID</th><th>Cashier Name</th><th>Shift Voids</th><th>Z-Score</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>#1042</strong></td>
                <td>Marcus Vance (Reg 02)</td>
                <td>2 Voids</td>
                <td style={{ fontWeight: 700 }}>+0.32</td>
                <td><span className="gt-badge gt-badge-emerald">NOMINAL</span></td>
              </tr>
              <tr ref={reg("rowCashier2")}>
                <td><strong>#1089</strong></td>
                <td>Elena Rostova (Reg 04)</td>
                <td ref={reg("voidsC2")}>3 Voids</td>
                <td ref={reg("zC2")} style={{ fontWeight: 700 }}>+0.41</td>
                <td><span className="gt-badge gt-badge-emerald" ref={reg("badgeC2")}>NOMINAL</span></td>
              </tr>
            </tbody>
          </table>

          <div className="gt-action-card" ref={reg("actionCard")}>
            <div>
              <div className="gt-action-title">Statistical Anomaly Intercepted (Z ≥ 3.0)</div>
              <div className="gt-action-subtitle">Reg 04: Post-void burst + drawer opening without sale detected.</div>
            </div>
            <button type="button" className="gt-action-btn">LOCK EVIDENCE &amp; SEAL</button>
          </div>
        </div>

        <div className="gt-panel" ref={reg("auditPanel")}>
          <div className="gt-panel-header">
            <span>POS Journal Ingestion Stream</span>
            <span style={{ fontSize: "10px", color: "var(--gt-text-muted)" }}>Real-Time Queue</span>
          </div>
          <div className="gt-ledger-list" ref={reg("journalFeed")}>
            <div className="gt-ledger-entry show" style={{ borderLeftColor: "#64748b" }}>
              <span>SALE: Ticket #8801 ($42.50)</span>
              <span>Reg 02 OK</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function resetSimulationState(refs) {
  if (refs.rowCashier2) refs.rowCashier2.style.background = "transparent";
  if (refs.voidsC2) refs.voidsC2.textContent = "3 Voids";
  if (refs.zC2) {
    refs.zC2.textContent = "+0.41";
    refs.zC2.style.color = "#fff";
  }
  if (refs.badgeC2) {
    refs.badgeC2.className = "gt-badge gt-badge-emerald";
    refs.badgeC2.textContent = "NOMINAL";
  }
  if (refs.actionCard) refs.actionCard.classList.remove("open");
  if (refs.valShrink) {
    refs.valShrink.textContent = "$0.00";
    refs.valShrink.style.color = "#fff";
  }
  if (refs.valAnomalies) {
    refs.valAnomalies.textContent = "0 Active";
    refs.valAnomalies.style.color = "var(--gt-emerald)";
  }
  if (refs.valVault) refs.valVault.textContent = "0 Sealed";
  if (refs.integrityPill) {
    refs.integrityPill.style.background = "rgba(255, 255, 255, 0.04)";
    refs.integrityPill.style.borderColor = "var(--gt-panel-border)";
  }
  if (refs.integrityText) refs.integrityText.textContent = "TERMINAL STREAMS: NOMINAL (0 FLAGGED)";
  if (refs.journalFeed) {
    refs.journalFeed.innerHTML = `
      <div class="gt-ledger-entry show" style="border-left-color: #64748b;">
        <span>SALE: Ticket #8801 ($42.50)</span>
        <span>Reg 02 OK</span>
      </div>`;
  }
}

function addJournalEvent(refs, action, amount, reg, type = "") {
  const feed = refs.journalFeed;
  if (!feed) return;
  const row = document.createElement("div");
  row.className = "gt-ledger-entry";
  if (type === "gt-accent-rose") row.style.borderLeftColor = "var(--gt-rose)";
  else if (type === "gt-accent-amber") row.style.borderLeftColor = "var(--gt-amber)";
  row.innerHTML = `<span>${action} (${amount})</span><span>${reg}</span>`;
  feed.prepend(row);
  setTimeout(() => row.classList.add("show"), 40);
}

const N = {
  shrinkProblem:
    "Independent grocers, convenience stores, and retailers lose thousands of dollars each month to internal checkout fraud. Dishonest cashiers void items after customers pay in cash, apply manual overrides, or pop the till without recording a sale. Most owners never notice until inventory counts reveal massive missing stock weeks later.",
  streamIngestion:
    "SentinelPOS monitors every terminal in real time. Register events — including sales, item voids, price overrides, and cash drawer kicks — are buffered through an asynchronous queue with cryptographic idempotency keys. Retried or offline POS syncs will never corrupt your audit trail.",
  sweethearting:
    "Watch Register 04, operated by Elena. Notice that she executes a post-void for seventy-five dollars, followed immediately by two no-sale drawer kicks while a customer is standing at the register. In a typical store, this sweethearting behavior goes unnoticed.",
  gaussianMath:
    "Instead of dumb static alerts, SentinelPOS evaluates cashier deviation using rolling thirty-day Gaussian baselines. Elena's void frequency has spiked far beyond the store mean. Her Z-score jumps to plus 3.84 standard deviations, proving this is not an honest mistake.",
  caseIntercept:
    "The engine instantly trips a critical incident. It clusters the post-void receipt, drawer kick logs, and calculated shift shrinkage of one-hundred and eighty-five dollars into a single case dossier ready for the store manager.",
  wormVault:
    "When you confirm the loss, SentinelPOS seals the evidence packet. It computes an immutable integrity hash and locks the raw receipt journal into tamper-proof storage for legal compliance and termination documentation.",
  executiveHealth:
    "Your loss prevention status bar alerts managers the instant theft patterns emerge. By deploying SentinelPOS, independent merchants protect their margins and eliminate cashier sweethearting without paying thousands to enterprise legacy vendors.",
};

export const sentinelPOSChapters = [
  {
    title: "Shrink Problem",
    caption: "Retailers lose up to 3% of revenue to internal theft like line voids and sweet-hearting. SentinelPOS replaces blind spreadsheet reviews with real-time exception scoring.",
    setup: (refs) => resetSimulationState(refs),
    run: async (sId, h) => {
      h.highlightElement("rosterPanel", "gt-accent-blue", 8);
      await h.moveCursorToRef("rosterPanel", 40, 60);
      await h.speakText(N.shrinkProblem, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Stream Ingestion",
    caption: "The system ingests raw register actions via a high-throughput queue with cryptographic idempotency protection.",
    setup: (refs) => resetSimulationState(refs),
    run: async (sId, h, refs) => {
      h.highlightElement("auditPanel", "gt-accent-blue", 8);
      await h.moveCursorToRef("auditPanel", 60, 40);
      addJournalEvent(refs, "SALE: Ticket #8802", "$19.20", "Reg 04 OK");
      addJournalEvent(refs, "SALE: Ticket #8803", "$114.00", "Reg 02 OK");
      await h.speakText(N.streamIngestion, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Sweethearting",
    caption: "Elena on Register 04 begins executing multiple post-voids and no-sale till openings within minutes.",
    setup: (refs) => resetSimulationState(refs),
    run: async (sId, h, refs) => {
      h.highlightElement("rowCashier2", "gt-accent-amber", 4);
      await h.moveCursorToRef("rowCashier2", 100, 12);
      if (refs.rowCashier2) refs.rowCashier2.style.background = "rgba(245, 158, 11, 0.15)";
      addJournalEvent(refs, "POST_VOID: Ticket #8804", "$75.00", "Reg 04 ALERT", "gt-accent-rose");
      addJournalEvent(refs, "DRAWER_KICK_NO_SALE", "$0.00", "Reg 04 WARN", "gt-accent-amber");
      if (refs.voidsC2) refs.voidsC2.textContent = "14 Voids";
      await h.speakText(N.sweethearting, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Gaussian Math",
    caption: "SentinelPOS normalizes employee behavior against rolling 30-day store baselines using standard deviation (Z-score).",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.rowCashier2) refs.rowCashier2.style.background = "rgba(245, 158, 11, 0.15)";
      if (refs.voidsC2) refs.voidsC2.textContent = "14 Voids";
    },
    run: async (sId, h, refs) => {
      if (refs.zC2) {
        refs.zC2.textContent = "+3.84";
        refs.zC2.style.color = "var(--gt-rose)";
      }
      if (refs.badgeC2) {
        refs.badgeC2.className = "gt-badge gt-badge-rose";
        refs.badgeC2.textContent = "ANOMALY DETECTED";
      }
      h.highlightElement("rowCashier2", "", 6);
      await h.moveCursorToRef("rowCashier2", 220, 12);
      await h.speakText(N.gaussianMath, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Case Intercept",
    caption: "The engine trips an automated incident case with correlated receipts and flags $185.00 in suspected register leakage.",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.rowCashier2) refs.rowCashier2.style.background = "rgba(245, 158, 11, 0.15)";
      if (refs.voidsC2) refs.voidsC2.textContent = "14 Voids";
      if (refs.zC2) {
        refs.zC2.textContent = "+3.84";
        refs.zC2.style.color = "var(--gt-rose)";
      }
      if (refs.badgeC2) {
        refs.badgeC2.className = "gt-badge gt-badge-rose";
        refs.badgeC2.textContent = "ANOMALY DETECTED";
      }
    },
    run: async (sId, h, refs) => {
      refs.actionCard?.classList.add("open");
      if (refs.valShrink) {
        refs.valShrink.textContent = "$185.00";
        refs.valShrink.style.color = "var(--gt-rose)";
      }
      if (refs.valAnomalies) {
        refs.valAnomalies.textContent = "1 Critical";
        refs.valAnomalies.style.color = "var(--gt-rose)";
      }
      h.highlightElement("actionCard", "", 6);
      await h.moveCursorToRef("actionCard", 200, 20);
      await h.speakText(N.caseIntercept, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "WORM Vault",
    caption: "Clicking 'Lock Evidence' packages raw receipts and hashes them into an immutable tamper-proof vault for legal compliance.",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.rowCashier2) refs.rowCashier2.style.background = "rgba(245, 158, 11, 0.15)";
      if (refs.voidsC2) refs.voidsC2.textContent = "14 Voids";
      if (refs.zC2) {
        refs.zC2.textContent = "+3.84";
        refs.zC2.style.color = "var(--gt-rose)";
      }
      if (refs.badgeC2) {
        refs.badgeC2.className = "gt-badge gt-badge-rose";
        refs.badgeC2.textContent = "ANOMALY DETECTED";
      }
      if (refs.valShrink) {
        refs.valShrink.textContent = "$185.00";
        refs.valShrink.style.color = "var(--gt-rose)";
      }
      if (refs.valAnomalies) {
        refs.valAnomalies.textContent = "1 Critical";
        refs.valAnomalies.style.color = "var(--gt-rose)";
      }
      refs.actionCard?.classList.add("open");
    },
    run: async (sId, h, refs) => {
      await h.moveCursorToRef("actionCard", 260, 20);
      if (refs.valVault) refs.valVault.textContent = "1 Sealed";
      addJournalEvent(refs, "WORM_VAULT: Sealed Case #INC-904", "Hash OK", "S3 Bucket", "gt-accent-rose");
      refs.actionCard?.classList.remove("open");

      h.highlightElement("cardVault", "gt-accent-blue", 6);
      await h.moveCursorToRef("cardVault", 60, 20);
      await h.speakText(N.wormVault, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Executive Health",
    caption: "Store metrics immediately reflect contained shrink. Real-time exception auditing protects your cash margin around the clock.",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.valShrink) {
        refs.valShrink.textContent = "$185.00";
        refs.valShrink.style.color = "var(--gt-rose)";
      }
      if (refs.valAnomalies) {
        refs.valAnomalies.textContent = "0 Active";
        refs.valAnomalies.style.color = "var(--gt-emerald)";
      }
      if (refs.valVault) refs.valVault.textContent = "1 Sealed";
    },
    run: async (sId, h, refs) => {
      h.highlightElement("integrityPill", "gt-accent-emerald", 4);
      await h.moveCursorToRef("integrityPill", 60, 12);
      if (refs.integrityPill) {
        refs.integrityPill.style.background = "rgba(244, 63, 94, 0.15)";
        refs.integrityPill.style.borderColor = "var(--gt-rose)";
      }
      if (refs.integrityText) refs.integrityText.textContent = "CASE #INC-904: EVIDENCE SECURED";

      await h.speakText(N.executiveHealth, sId);
      h.clearHighlight();
    },
  },
];
