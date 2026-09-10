/**
 * MiniERP's guided tour — stage markup + the 7-chapter script, ported faithfully from the pasted
 * "MiniERP Interactive Guided Tour with Chapter Navigation" HTML mockup (2026-09-10). Narration
 * text, numbers, and story beats are unchanged from that source; only the mechanics changed — real
 * measured cursor targets (moveCursorToRef) instead of the original's hardcoded pixel coordinates,
 * since those were tuned to one exact fixed-size layout and this stage is responsive.
 */

function ClipboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
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

export function renderMiniERPStage(reg) {
  return (
    <>
      <div className="gt-topbar">
        <div className="gt-brand">
          <ClipboardIcon />
          MiniERP <span className="gt-brand-sub">Command Center</span>
        </div>
        <div className="gt-pill" ref={reg("parityPill")}>
          <CheckIcon />
          <span>TRIAL BALANCE: BALANCED (diff $0.00)</span>
        </div>
      </div>

      <div className="gt-viewport">
        <div className="gt-kpi-row" ref={reg("kpiDeck")}>
          <div className="gt-kpi-card">
            <span className="gt-kpi-label">Real-Time Sales Revenue</span>
            <span className="gt-kpi-val" ref={reg("valRevenue")} style={{ color: "var(--gt-emerald)" }}>$0.00</span>
          </div>
          <div className="gt-kpi-card">
            <span className="gt-kpi-label">Cost of Goods Sold (COGS)</span>
            <span className="gt-kpi-val" ref={reg("valCogs")} style={{ color: "var(--gt-rose)" }}>$0.00</span>
          </div>
          <div className="gt-kpi-card">
            <span className="gt-kpi-label">Net Operating Profit</span>
            <span className="gt-kpi-val" ref={reg("valNet")} style={{ color: "#fff" }}>$0.00</span>
          </div>
        </div>

        <div className="gt-panel" ref={reg("inventoryPanel")}>
          <div className="gt-panel-header">
            <span>Live Inventory &amp; Moving Average Valuation</span>
            <span className="gt-badge gt-badge-blue">Warehouse Deck</span>
          </div>
          <table>
            <thead>
              <tr><th>SKU</th><th>Item Name</th><th>Avg Unit Cost</th><th>On Hand</th><th>Health Status</th></tr>
            </thead>
            <tbody>
              <tr ref={reg("rowKb")}>
                <td><strong>KB-MECH</strong></td>
                <td>Mechanical Keyboard</td>
                <td ref={reg("costKb")}>$42.00</td>
                <td ref={reg("qtyKb")} style={{ fontWeight: 700 }}>2</td>
                <td><span className="gt-badge gt-badge-amber" ref={reg("badgeKb")}>LOW STOCK</span></td>
              </tr>
              <tr>
                <td><strong>MS-ERGO</strong></td>
                <td>Precision Mouse</td>
                <td>$19.50</td>
                <td>50</td>
                <td><span className="gt-badge gt-badge-emerald">HEALTHY</span></td>
              </tr>
            </tbody>
          </table>

          <div className="gt-action-card" ref={reg("actionCard")}>
            <div>
              <div className="gt-action-title">Draft PO-9042 Generated Automatically</div>
              <div className="gt-action-subtitle">Replenishing 20 units @ $40.00 from KeyTech Labs</div>
            </div>
            <button type="button" className="gt-action-btn">CONFIRM &amp; RECEIVE</button>
          </div>
        </div>

        <div className="gt-panel" ref={reg("ledgerPanel")}>
          <div className="gt-panel-header">
            <span>General Ledger Journal Stream</span>
            <span style={{ fontSize: "10px", color: "var(--gt-text-muted)" }}>Immutable Double-Entry</span>
          </div>
          <div className="gt-ledger-list" ref={reg("ledgerFeed")}>
            <div className="gt-ledger-entry show" style={{ borderLeftColor: "#64748b" }}>
              <span>1000 Operating Cash</span>
              <span>$50,000.00 DR</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function addLedgerLine(refs, code, name, amount, type) {
  const feed = refs.ledgerFeed;
  if (!feed) return;
  const row = document.createElement("div");
  row.className = "gt-ledger-entry";
  row.innerHTML = `<span>${code} ${name}</span><span>${amount} ${type}</span>`;
  feed.prepend(row);
  setTimeout(() => row.classList.add("show"), 40);
}

function resetSimulationState(refs) {
  if (refs.rowKb) refs.rowKb.style.background = "transparent";
  if (refs.qtyKb) refs.qtyKb.textContent = "2";
  if (refs.costKb) refs.costKb.textContent = "$42.00";
  if (refs.badgeKb) {
    refs.badgeKb.className = "gt-badge gt-badge-amber";
    refs.badgeKb.textContent = "LOW STOCK";
  }
  if (refs.actionCard) refs.actionCard.classList.remove("open");
  if (refs.valRevenue) refs.valRevenue.textContent = "$0.00";
  if (refs.valCogs) refs.valCogs.textContent = "$0.00";
  if (refs.valNet) refs.valNet.textContent = "$0.00";
  if (refs.parityPill) {
    refs.parityPill.style.background = "rgba(255, 255, 255, 0.04)";
    refs.parityPill.style.borderColor = "var(--gt-panel-border)";
  }
  if (refs.ledgerFeed) {
    refs.ledgerFeed.innerHTML = `
      <div class="gt-ledger-entry show" style="border-left-color: #64748b;">
        <span>1000 Operating Cash</span>
        <span>$50,000.00 DR</span>
      </div>`;
  }
}

const N = {
  bigPicture:
    "Most businesses struggle because their warehouse, sales team, and accountants use separate apps. When stock sells, the books aren't updated until weeks later. MiniERP fixes this by treating every action as a single, connected chain of events.",
  stockAlert:
    "Look at our mechanical keyboards highlighted here. We only have two left on the shelf, which is risky. In a manual shop, you wouldn't notice until a customer complained about a backorder.",
  autoPo:
    "MiniERP takes care of this proactively. A background worker noticed the shortage and drafted purchase order 9042 with our supplier, ready for the warehouse to review and approve.",
  goodsReceipt:
    "When the shipment arrives at the loading dock, the warehouse simply confirms receipt. We had two keyboards at forty-two dollars, and just got twenty more at forty dollars. The system recalculates our true average unit cost to forty dollars and eighteen cents.",
  ledgerBalance:
    "Notice the ledger on the right. The moment those boxes were checked in, your balance sheet updated. Inventory assets increased by eight hundred dollars, and accounts payable recorded what we owe the vendor. No manual invoices to key in.",
  orderFulfillment:
    "Now, a customer buys five keyboards for seventy-five dollars each. The ledger posts a four-line balanced entry. Revenue and receivables capture the three-hundred and seventy-five dollar sale, while cost of goods sold and inventory reflect the two-hundred dollar asset depletion.",
  realTimePnl:
    "Your executive cards at the top show your exact financial health instantly. Revenue minus cost of goods sold reveals a real-time net operating margin of one-hundred and seventy-four dollars. Because every transaction is verified on entry, your books are always closed, always accurate, and completely automated.",
};

export const miniErpChapters = [
  {
    title: "Big Picture",
    caption: "Most businesses struggle because warehouse, sales, and accounting use separate apps. MiniERP unifies them into a single connected operational loop.",
    setup: (refs) => resetSimulationState(refs),
    run: async (sId, h) => {
      h.highlightElement("inventoryPanel", "gt-accent-blue", 8);
      await h.moveCursorToRef("inventoryPanel", 40, 60);
      await h.speakText(N.bigPicture, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Stock Alert",
    caption: "Look at row KB-MECH: stock on hand has dropped to 2 units, triggering an automated low-stock warning.",
    setup: (refs) => resetSimulationState(refs),
    run: async (sId, h, refs) => {
      if (refs.rowKb) refs.rowKb.style.background = "rgba(245, 158, 11, 0.15)";
      h.highlightElement("rowKb", "gt-accent-amber", 4);
      await h.moveCursorToRef("rowKb", 100, 12);
      await h.speakText(N.stockAlert, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Auto-PO",
    caption: "A background worker spots the inventory deficit and automatically drafts replenishment Purchase Order 9042.",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.rowKb) refs.rowKb.style.background = "rgba(245, 158, 11, 0.15)";
    },
    run: async (sId, h, refs) => {
      refs.actionCard?.classList.add("open");
      await h.sleep(400, sId);
      h.highlightElement("actionCard", "", 6);
      await h.moveCursorToRef("actionCard", 200, 20);
      await h.speakText(N.autoPo, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Goods Receipt",
    caption: "Warehouse receives 20 units @ $40. The Moving Average Cost automatically recalculates to $40.18, and the row turns healthy.",
    setup: (refs) => {
      resetSimulationState(refs);
      refs.actionCard?.classList.add("open");
    },
    run: async (sId, h, refs) => {
      await h.moveCursorToRef("actionCard", 260, 24);
      h.highlightElement("rowKb", "", 4);

      if (refs.qtyKb) refs.qtyKb.textContent = "22";
      if (refs.costKb) refs.costKb.textContent = "$40.18";
      if (refs.badgeKb) {
        refs.badgeKb.className = "gt-badge gt-badge-emerald";
        refs.badgeKb.textContent = "HEALTHY";
      }
      if (refs.rowKb) refs.rowKb.style.background = "transparent";
      refs.actionCard?.classList.remove("open");

      await h.speakText(N.goodsReceipt, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Ledger Balance",
    caption: "Physical goods receipt immediately debits Inventory Assets ($800) and credits Accounts Payable ($800) in the ledger.",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.qtyKb) refs.qtyKb.textContent = "22";
      if (refs.costKb) refs.costKb.textContent = "$40.18";
      if (refs.badgeKb) {
        refs.badgeKb.className = "gt-badge gt-badge-emerald";
        refs.badgeKb.textContent = "HEALTHY";
      }
    },
    run: async (sId, h, refs) => {
      addLedgerLine(refs, "1200", "Inventory Asset", "$800.00", "DR");
      addLedgerLine(refs, "2000", "Accounts Payable", "$800.00", "CR");
      h.highlightElement("ledgerFeed", "gt-accent-blue", 8);
      await h.moveCursorToRef("ledgerFeed", 30, 20);
      await h.speakText(N.ledgerBalance, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Order Fulfillment",
    caption: "A customer purchases 5 keyboards for $75 each. The system fulfills the order and posts a 4-line revenue and COGS recognition.",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.qtyKb) refs.qtyKb.textContent = "22";
      if (refs.costKb) refs.costKb.textContent = "$40.18";
      if (refs.badgeKb) {
        refs.badgeKb.className = "gt-badge gt-badge-emerald";
        refs.badgeKb.textContent = "HEALTHY";
      }
      addLedgerLine(refs, "1200", "Inventory Asset", "$800.00", "DR");
      addLedgerLine(refs, "2000", "Accounts Payable", "$800.00", "CR");
    },
    run: async (sId, h, refs) => {
      if (refs.qtyKb) refs.qtyKb.textContent = "17";
      addLedgerLine(refs, "1100", "Accounts Receivable", "$375.00", "DR");
      addLedgerLine(refs, "4000", "Sales Revenue", "$375.00", "CR");
      addLedgerLine(refs, "5000", "Cost of Goods Sold", "$200.90", "DR");
      addLedgerLine(refs, "1200", "Inventory Asset", "$200.90", "CR");

      if (refs.valRevenue) refs.valRevenue.textContent = "$375.00";
      if (refs.valCogs) refs.valCogs.textContent = "$200.90";
      if (refs.valNet) refs.valNet.textContent = "$174.10";

      h.highlightElement("ledgerFeed", "", 8);
      await h.moveCursorToRef("ledgerFeed", 30, 20);
      await h.speakText(N.orderFulfillment, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Real-Time P&L",
    caption: "Debits strictly equal credits. The Trial Balance is verified after every mutation, ending month-end closing chaos.",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.qtyKb) refs.qtyKb.textContent = "17";
      if (refs.costKb) refs.costKb.textContent = "$40.18";
      if (refs.badgeKb) {
        refs.badgeKb.className = "gt-badge gt-badge-emerald";
        refs.badgeKb.textContent = "HEALTHY";
      }
      addLedgerLine(refs, "1200", "Inventory Asset", "$800.00", "DR");
      addLedgerLine(refs, "2000", "Accounts Payable", "$800.00", "CR");
      addLedgerLine(refs, "1100", "Accounts Receivable", "$375.00", "DR");
      addLedgerLine(refs, "4000", "Sales Revenue", "$375.00", "CR");
      addLedgerLine(refs, "5000", "Cost of Goods Sold", "$200.90", "DR");
      addLedgerLine(refs, "1200", "Inventory Asset", "$200.90", "CR");
      if (refs.valRevenue) refs.valRevenue.textContent = "$375.00";
      if (refs.valCogs) refs.valCogs.textContent = "$200.90";
      if (refs.valNet) refs.valNet.textContent = "$174.10";
    },
    run: async (sId, h, refs) => {
      h.highlightElement("kpiDeck", "gt-accent-blue", 6);
      await h.moveCursorToRef("kpiDeck", 120, 30);
      await h.sleep(1200, sId);

      h.highlightElement("parityPill", "", 4);
      await h.moveCursorToRef("parityPill", 60, 12);
      if (refs.parityPill) {
        refs.parityPill.style.background = "rgba(16, 185, 129, 0.15)";
        refs.parityPill.style.borderColor = "var(--gt-emerald)";
      }

      await h.speakText(N.realTimePnl, sId);
      h.clearHighlight();
    },
  },
];
