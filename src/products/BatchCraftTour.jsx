/**
 * BatchCraft's guided tour — stage markup + the 7-chapter script, ported faithfully from the
 * pasted "BatchCraft Interactive Guided Tour with Chapter Navigation" HTML mockup (2026-09-10).
 * Same mechanics note as MiniERPTour.jsx: real measured cursor targets (moveCursorToRef) instead
 * of the original's hardcoded pixel coordinates.
 */

function ChefHatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
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

export function renderBatchCraftStage(reg) {
  return (
    <>
      <div className="gt-topbar">
        <div className="gt-brand">
          <ChefHatIcon />
          BatchCraft <span className="gt-brand-sub">Kitchen Prep &amp; Recipe Yield Engine</span>
        </div>
        <div className="gt-pill" ref={reg("yieldPill")}>
          <CheckIcon />
          <span ref={reg("yieldText")}>FOOD COST MARGIN: TARGET 28.5% (STABLE)</span>
        </div>
      </div>

      <div className="gt-viewport">
        <div className="gt-kpi-row" ref={reg("kpiDeck")}>
          <div className="gt-kpi-card" ref={reg("cardPlateCost")}>
            <span className="gt-kpi-label">Serving Plate Cost</span>
            <span className="gt-kpi-val" ref={reg("valPlateCost")} style={{ color: "var(--gt-emerald)" }}>$3.48</span>
          </div>
          <div className="gt-kpi-card">
            <span className="gt-kpi-label">Actual Food Cost %</span>
            <span className="gt-kpi-val" ref={reg("valFoodCostPct")} style={{ color: "#fff" }}>21.8%</span>
          </div>
          <div className="gt-kpi-card">
            <span className="gt-kpi-label">Pantry Batches</span>
            <span className="gt-kpi-val" ref={reg("valBatches")} style={{ color: "var(--gt-accent)" }}>12 Active</span>
          </div>
        </div>

        <div className="gt-panel" ref={reg("recipePanel")}>
          <div className="gt-panel-header">
            <span>Active Menu Formulation &amp; Sub-BOM Tree</span>
            <span className="gt-badge gt-badge-blue">Recursive Assembly</span>
          </div>
          <table>
            <thead>
              <tr><th>Component</th><th>Required</th><th>Trim Yield %</th><th>Effective Cost</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr ref={reg("rowTomatoes")}>
                <td><strong>Roma Tomatoes</strong></td>
                <td>2.50 kg</td>
                <td>78.0%</td>
                <td>$0.54 / 100g</td>
                <td><span className="gt-badge gt-badge-emerald">SUB-RECIPE</span></td>
              </tr>
              <tr ref={reg("rowBeef")}>
                <td><strong>Ground Chuck 80/20</strong></td>
                <td>3.75 kg</td>
                <td>92.0%</td>
                <td ref={reg("costBeef")}>$9.24 / kg</td>
                <td><span className="gt-badge gt-badge-emerald">RAW COMMODITY</span></td>
              </tr>
            </tbody>
          </table>

          <div className="gt-action-card" ref={reg("actionCard")}>
            <div>
              <div className="gt-action-title">Scale Prep Order: Artisan Lasagna</div>
              <div className="gt-action-subtitle">Multiplier 2.5x: Generates 25 portions with FIFO pantry depletion.</div>
            </div>
            <button type="button" className="gt-action-btn">DISPATCH PREP RUN</button>
          </div>
        </div>

        <div className="gt-panel" ref={reg("prepFeedPanel")}>
          <div className="gt-panel-header">
            <span>Kitchen Prep Execution Log</span>
            <span style={{ fontSize: "10px", color: "var(--gt-text-muted)" }}>FIFO Depletion Ledger</span>
          </div>
          <div className="gt-ledger-list" ref={reg("prepFeed")}>
            <div className="gt-ledger-entry show" style={{ borderLeftColor: "#64748b" }}>
              <span>PREP: Marinara Batch #401</span>
              <span>+10.0L Yield</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function resetSimulationState(refs) {
  if (refs.rowBeef) refs.rowBeef.style.background = "transparent";
  if (refs.costBeef) {
    refs.costBeef.textContent = "$9.24 / kg";
    refs.costBeef.style.color = "#cbd5e1";
  }
  if (refs.actionCard) refs.actionCard.classList.remove("open");
  if (refs.valPlateCost) {
    refs.valPlateCost.textContent = "$3.48";
    refs.valPlateCost.style.color = "var(--gt-emerald)";
  }
  if (refs.valFoodCostPct) {
    refs.valFoodCostPct.textContent = "21.8%";
    refs.valFoodCostPct.style.color = "#fff";
  }
  if (refs.valBatches) refs.valBatches.textContent = "12 Active";
  if (refs.yieldPill) {
    refs.yieldPill.style.background = "rgba(255, 255, 255, 0.04)";
    refs.yieldPill.style.borderColor = "var(--gt-panel-border)";
  }
  if (refs.yieldText) refs.yieldText.textContent = "FOOD COST MARGIN: TARGET 28.5% (STABLE)";
  if (refs.prepFeed) {
    refs.prepFeed.innerHTML = `
      <div class="gt-ledger-entry show" style="border-left-color: #64748b;">
        <span>PREP: Marinara Batch #401</span>
        <span>+10.0L Yield</span>
      </div>`;
  }
}

function addPrepLog(refs, desc, yieldQty, color = "var(--gt-emerald)") {
  const feed = refs.prepFeed;
  if (!feed) return;
  const row = document.createElement("div");
  row.className = "gt-ledger-entry";
  row.style.borderLeftColor = color;
  row.innerHTML = `<span>${desc}</span><span>${yieldQty}</span>`;
  feed.prepend(row);
  setTimeout(() => row.classList.add("show"), 40);
}

const N = {
  kitchenFriction:
    "Independent food operators and commercial kitchens struggle with food cost leakage every day. Wholesale commodity prices for butter, eggs, and proteins surge unexpectedly, but menus remain locked at static prices. Prep cooks eyeball production batches, leading to excess food waste, stockouts, and shrinking profit margins.",
  epYieldMath:
    "Notice how BatchCraft handles commodity yield mathematics. Raw ground beef purchased at eight dollars and fifty cents per kilogram loses eight percent fat trim during preparation. The engine factors in this ninety-two percent yield, pricing your true net edible portion at nine dollars and twenty-four cents per kilogram.",
  subAssemblies:
    "Real kitchens rely on sub-recipes. Our artisan meat lasagna contains house-made marinara sauce and fresh pasta sheets. BatchCraft recursively calculates child production costs down to base raw pantry commodities, giving you exact plate costs instead of guestimates.",
  costSpikes:
    "Imagine your meat distributor hikes beef prices by twenty percent overnight. Watch the KPI deck at the top. The moment wholesale purchasing receives the invoice, our serving plate cost updates in real time from three dollars and forty-eight cents up to four dollars and twelve cents.",
  scaledPrep:
    "During morning prep, the chef needs twenty-five servings of lasagna. Instead of manual ratio math on a whiteboard, the chef selects a two-point-five multiplier. BatchCraft recalculates ingredient needs down to the exact gram and prepares an atomic production order.",
  fifoDepletion:
    "Confirming the batch dispatches an atomic transaction. Raw pantry stock decrements across tomatoes, pasta sheets, and beef, while a newly prepared twenty-five portion batch stamps into the kitchen inventory with full FIFO batch traceability.",
  marginHealth:
    "Your kitchen operations, recipe formulations, and inventory depletion stay perfectly in sync. BatchCraft delivers enterprise culinary control to independent food operators without the thousand-dollar monthly price tag.",
};

export const batchCraftChapters = [
  {
    title: "Kitchen Friction",
    caption: "Independent restaurants and bakeries lose thousands each month to recipe drift and outdated ingredient spreadsheets.",
    setup: (refs) => resetSimulationState(refs),
    run: async (sId, h) => {
      h.highlightElement("recipePanel", "gt-accent-blue", 8);
      await h.moveCursorToRef("recipePanel", 40, 60);
      await h.speakText(N.kitchenFriction, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "EP Yield Math",
    caption: "BatchCraft enforces the Edible Portion (EP) invariant, inflating unit costs by trim shrinkage automatically.",
    setup: (refs) => resetSimulationState(refs),
    run: async (sId, h, refs) => {
      h.highlightElement("rowBeef", "gt-accent-amber", 4);
      await h.moveCursorToRef("rowBeef", 100, 12);
      if (refs.rowBeef) refs.rowBeef.style.background = "rgba(245, 158, 11, 0.15)";
      await h.speakText(N.epYieldMath, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Sub-Assemblies",
    caption: "Dishes are modeled as recursive trees. A finished Lasagna pulls costs from sub-recipes down to base pantry staples.",
    setup: (refs) => resetSimulationState(refs),
    run: async (sId, h) => {
      h.highlightElement("rowTomatoes", "gt-accent-blue", 4);
      await h.moveCursorToRef("rowTomatoes", 100, 12);
      await h.speakText(N.subAssemblies, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Cost Spikes",
    caption: "A sudden wholesale beef surge automatically updates plate costs in real time from $3.48 to $4.12.",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.rowBeef) refs.rowBeef.style.background = "rgba(245, 158, 11, 0.15)";
    },
    run: async (sId, h, refs) => {
      if (refs.costBeef) {
        refs.costBeef.textContent = "$11.08 / kg";
        refs.costBeef.style.color = "var(--gt-rose)";
      }
      if (refs.valPlateCost) {
        refs.valPlateCost.textContent = "$4.12";
        refs.valPlateCost.style.color = "var(--gt-rose)";
      }
      if (refs.valFoodCostPct) refs.valFoodCostPct.textContent = "25.8%";

      h.highlightElement("cardPlateCost", "gt-accent-rose", 6);
      await h.moveCursorToRef("cardPlateCost", 60, 20);
      await h.speakText(N.costSpikes, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Scaled Prep",
    caption: "Chefs dispatch a 2.5x batch prep order for tonight's dinner service.",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.valPlateCost) refs.valPlateCost.textContent = "$3.48";
      if (refs.valFoodCostPct) refs.valFoodCostPct.textContent = "21.8%";
    },
    run: async (sId, h, refs) => {
      refs.actionCard?.classList.add("open");
      h.highlightElement("actionCard", "", 6);
      await h.moveCursorToRef("actionCard", 200, 20);
      await h.speakText(N.scaledPrep, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "FIFO Depletion",
    caption: "Confirming the run atomically deducts raw pantry stock and creates a new finished prep batch in the ledger.",
    setup: (refs) => {
      resetSimulationState(refs);
      refs.actionCard?.classList.add("open");
    },
    run: async (sId, h, refs) => {
      await h.moveCursorToRef("actionCard", 260, 20);
      refs.actionCard?.classList.remove("open");
      if (refs.valBatches) refs.valBatches.textContent = "13 Active";

      addPrepLog(refs, "DEDUCT: -3.75kg Ground Beef", "FIFO Match", "var(--gt-rose)");
      addPrepLog(refs, "PREP: Lasagna Batch #902", "+25 Servings", "var(--gt-emerald)");

      h.highlightElement("prepFeedPanel", "gt-accent-blue", 8);
      await h.moveCursorToRef("prepFeedPanel", 60, 40);
      await h.speakText(N.fifoDepletion, sId);
      await h.sleep(500, sId);
    },
  },
  {
    title: "Margin Health",
    caption: "Menu engineers and owners maintain complete food cost parity with zero spreadsheet maintenance.",
    setup: (refs) => {
      resetSimulationState(refs);
      if (refs.valBatches) refs.valBatches.textContent = "13 Active";
    },
    run: async (sId, h, refs) => {
      h.highlightElement("yieldPill", "", 4);
      await h.moveCursorToRef("yieldPill", 60, 12);
      if (refs.yieldPill) {
        refs.yieldPill.style.background = "rgba(52, 211, 153, 0.15)";
        refs.yieldPill.style.borderColor = "var(--gt-emerald)";
      }
      await h.speakText(N.marginHealth, sId);
      h.clearHighlight();
    },
  },
];
