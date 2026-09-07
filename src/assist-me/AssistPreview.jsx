import { Link, useSearchParams } from "react-router-dom";
import { AssistMeEmbedded } from "./AssistMeWorkspace.jsx";

// Pokedex (and the whole prior SMB product catalog before it) was replaced 2026-09-03 by Mini
// ERP — a real Fastify + Prisma + PostgreSQL backend (Procure-to-Pay, Order-to-Cash, double-entry
// GL — already built, verified against its own spec's acceptance criteria, and running) with
// purely-frontend learner tasks against it.
//
// 2026-09-07: this used to be four separate tasks, but idt-erp-reports-dashboard's own steps
// imported types (Item/PurchaseOrder/SalesOrder) from files the other three tasks built — a
// learner assigned only the dashboard task hit an import with nothing to point at (user report:
// "its still asking me to import type from a file that was never created"). Merged all four into
// one 26-step task under the same idt-erp-reports-dashboard tag, in dependency order (inventory ->
// procurement -> sales -> financials -> App.tsx assembly), so the prerequisite steps and the
// steps that depend on them now live in the same task. The three old per-component engine files
// (inpact_assist_idt-erp-inventory-table/po-form/so-pipeline_engine.tsx) are left on disk, not
// deleted — their content still exists inside the merged file — but are no longer listed here.
const MODULES = [
  { tag: "idt-erp-reports-dashboard", product: "MiniERP", trade: "Coding · FE", title: "Build the MiniERP frontend: inventory, procurement, sales & financial dashboard" },
];

export default function AssistPreview() {
  const [params, setParams] = useSearchParams();
  const tag = params.get("module");
  const current = MODULES.find((m) => m.tag === tag);

  if (current) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <div style={{ padding: "10px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", gap: 12, alignItems: "center" }}>
          <button type="button" onClick={() => setParams({})}>
            ← All {MODULES.length} Coding modules
          </button>
          <span>
            {current.product} · {current.trade}
          </span>
        </div>
        <AssistMeEmbedded moduleTag={current.tag} mode="here" embedded />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px", fontFamily: "Segoe UI, system-ui, sans-serif" }}>
      <h1 style={{ color: "#c41e3a", fontSize: 22 }}>Assist preview — {MODULES.length} Coding modules</h1>
      <p style={{ color: "#64748b" }}>
        Same INPACT lesson UI (Lesson → Objectives → Step N). Objectives are transferable skills;
        Why this matters is developer rationale; UI lessons include a tryable DESIGN MOCK. Products
        justified in docs/SMB_PRODUCT_SELECTION_JOURNAL.md.
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {MODULES.map((m) => (
          <li key={m.tag} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, margin: "10px 0" }}>
            <div style={{ fontSize: 12, color: "#c41e3a", fontWeight: 700 }}>
              {m.product} · {m.trade}
            </div>
            <div style={{ fontWeight: 600, margin: "4px 0 10px" }}>{m.title}</div>
            <Link to={`/assist-preview?module=${m.tag}`}>Open Assist Me →</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
