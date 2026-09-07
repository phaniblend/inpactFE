import createINPACTEngine from "../inpact_engine_shared";

const MENTAL_MODEL = `Assemble the whole MiniERP dashboard around one shared source of truth:

  Metrics  →  Revenue, COGS, Net Income — fetched live from GET /api/reports/income-statement
  State    →  App.tsx owns items, purchaseOrders, salesOrders — nobody else fetches independently
  Load     →  one loadData() call, fired on mount and after every receive/fulfill
  Assemble →  FinancialMetrics + InventoryTable + ProcurementPanel + SalesFulfillmentBoard, wired together
`;

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-erp-reports-dashboard",
      title: "Financial metrics + dashboard assembly",
      body: MENTAL_MODEL,
      usecase: "Every other MiniERP screen already exists as its own component — this task is what makes them a single, live, self-updating dashboard.",
      designMock: {"kind":"list-and-form","screenTitle":"MiniERP Command Center","caption":"This is the screen you are building — real financial cards on top, real inventory/procurement/sales panels below, all sharing one live data source.","listCaption":"CARDS — real figures from the ledger","emptyCaption":"EMPTY — before the first fetch resolves","emptyMessage":"Loading…","rows":[{"title":"Revenue","subtitle":"$125.00","meta":""},{"title":"Net Income","subtitle":"$85.00","meta":""}],"fields":[{"label":"Status","options":["All"]}],"formMode":"filter","submitLabel":"Refresh"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Create FinancialMetrics.tsx, define its data shape, and export the empty shell.",
      "Fetch the real income statement on mount and render Revenue, COGS, and Net Income cards.",
      "In App.tsx, hold items/purchaseOrders/salesOrders in shared state, with one loadData() fetching all three plus the report in parallel.",
      "Assemble FinancialMetrics, InventoryTable, ProcurementPanel, and SalesFulfillmentBoard together, wiring onReceive/onFulfill back to loadData.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Create FinancialMetrics.tsx, define its data shape, and export the empty shell.

Create src/components/FinancialMetrics.tsx and define the shape of the real income-statement response this component will render.

WHAT YOUR BLUEPRINT NEEDS
- revenue (text — the API sends a formatted 2-decimal string)
- cogs (text)
- netIncome (text)

Your task: write \`type Financials\` with those three fields, then define and export FinancialMetrics as a function component returning <div /> — every step from here on edits this same file.`,
    hint: `1. Create the file: Add a new file at src/components/FinancialMetrics.tsx.
2. Match the real shape: GET /api/reports/income-statement returns { revenue, cogs, netIncome } as already-formatted strings like "125.00", not numbers.
3. Component shell: Declare export function FinancialMetrics() { return <div />; }.`,
    example_code: `// src/components/RevenueCards.tsx
export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};

export function RevenueCards() {
  return <div />;
}`,
    think_prompt: `The real /api/reports/income-statement endpoint already formats every figure to 2 decimal places as a string — the type needs to reflect that exact shape, not reformat numbers that are already text. What does the blueprint need to name?`,
    mc_options: [
      "Define type Financials (revenue, cogs, netIncome, all string), then export function FinancialMetrics() returning <div />",
      "Make every field a number since they're all money amounts",
      "Wait until the cards are drawn before deciding the type",
    ],
    mc_correct_option: "Define type Financials (revenue, cogs, netIncome, all string), then export function FinancialMetrics() returning <div />",
    mc_anchor: "Define type Financials (revenue, cogs, n",
    why_this_matters: `Matching the type to the real API's already-formatted strings avoids a pointless re-parse (or a silent bug) when you go to render them.`,
    answer_keywords: ["export", "type", "Financials", "revenue", "cogs", "netIncome", "export", "function", "FinancialMetrics"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the blueprint matches the real API, and the component shell exists.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Match the type to the real income-statement response (all three fields are strings), then add the shell.",
    pre_check_hint: `A TypeScript type just needs to match what the real endpoint actually sends — three already-formatted money strings.`,
    expected: `export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};

export function FinancialMetrics() {
  return <div />;
}
`,
    analog_example: `export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};

export function RevenueCards() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Matching the type to the real API's already-formatted strings avoids a pointless re-parse (or a silent bug) when you go to render them.`,
      pain: "Typing money fields as number when the real API sends formatted strings produces a type that lies about the data it describes.",
      mentalModel: MENTAL_MODEL,
      discover: `export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};

export function FinancialMetrics() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not assume a money field is a number without checking what the real endpoint actually returns.",
      dryRun: "Write the same step for a different real report endpoint.",
      build: `type Financials = { revenue: string; cogs: string; netIncome: string; }\n\nexport function FinancialMetrics() { return <div />; }`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Fetch the real income statement on mount and render Revenue, COGS, and Net Income cards.

Fetch GET /api/reports/income-statement inside useEffect, hold the result in state, and render three cards once it arrives.

WHAT YOUR LOGIC NEEDS
- useState<Financials> initialized to { revenue: "0.00", cogs: "0.00", netIncome: "0.00" }.
- useEffect([]) fetching /api/reports/income-statement and storing the result.
- Three cards displaying Revenue, COGS, and Net Income with a $ prefix.

Your task: fetch the real report on mount, default to zeros before it arrives, and render three cards from whatever the state currently holds.`,
    hint: `1. Declare state: const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" });
2. Fetch on mount: useEffect(() => { fetch("/api/reports/income-statement").then((r) => r.json()).then(setFinancials); }, []);
3. Render three cards showing \${financials.revenue}, \${financials.cogs}, \${financials.netIncome}.`,
    example_code: `const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" });

useEffect(() => {
  fetch("/api/reports/income-statement")
    .then((res) => res.json())
    .then(setFinancials);
}, []);

return (
  <div className="grid grid-cols-3 gap-4">
    <div className="p-4 bg-white rounded shadow">Revenue: \${financials.revenue}</div>
    <div className="p-4 bg-white rounded shadow">COGS: \${financials.cogs}</div>
    <div className="p-4 bg-white rounded shadow">Net Income: \${financials.netIncome}</div>
  </div>
);`,
    think_prompt: `Defaulting state to real zero-strings ("0.00", not empty strings) means the cards render sensibly even before the fetch resolves, rather than showing "$undefined" for a moment. What does the initial state need to be, and what does useEffect need to do with the real response?`,
    mc_options: [
      "default state to zero-strings, fetch the real report in useEffect([]), pass the whole response straight into setFinancials",
      "leave state undefined until the fetch resolves",
      "hardcode the three figures instead of fetching them",
    ],
    mc_correct_option: "default state to zero-strings, fetch the real report in useEffect([]), pass the whole response straight into setFinancials",
    mc_anchor: "default state to zero-strings, fetch the",
    why_this_matters: `Real-time financial cards, fetched straight from the ledger, are what let a business owner trust the number on screen without waiting for a manual month-end close.`,
    answer_keywords: ["Financials", "useState", "useEffect", "fetch", "income-statement", "setFinancials", "revenue", "cogs", "netIncome"],
    seed_code: `export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};

export function FinancialMetrics() {
  return <div />;
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};

export function FinancialMetrics() {
  // financials state + fetch go here
  return <div />;
}
`,
    feedback_correct: "Correct — three real cards, fed by the real ledger.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Default state to zero-strings, fetch inside useEffect([]), and render all three cards from that state.",
    pre_check_hint: `Display 3 key metrics from the real report endpoint — same fetch-in-useEffect pattern as InventoryTable, just a single object instead of an array.`,
    expected: `import { useState, useEffect } from "react";

export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};

export function FinancialMetrics() {
  const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" });

  useEffect(() => {
    fetch("/api/reports/income-statement")
      .then((res) => res.json())
      .then(setFinancials);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-white rounded shadow">Revenue: \${financials.revenue}</div>
      <div className="p-4 bg-white rounded shadow">COGS: \${financials.cogs}</div>
      <div className="p-4 bg-white rounded shadow">Net Income: \${financials.netIncome}</div>
    </div>
  );
}
`,
    analog_example: `const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" });

useEffect(() => {
  fetch("/api/reports/income-statement")
    .then((res) => res.json())
    .then(setFinancials);
}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Real-time financial cards, fetched straight from the ledger, are what let a business owner trust the number on screen without waiting for a manual month-end close.`,
      pain: "Undefined initial state produces a flash of \"$undefined\" before the real fetch resolves.",
      mentalModel: MENTAL_MODEL,
      discover: `useEffect(() => {
  fetch("/api/reports/income-statement")
    .then((res) => res.json())
    .then(setFinancials);
}, []);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not leave the initial state undefined — default to real zero-strings so the cards always render something sensible.",
      dryRun: "Fetch-and-render a different single-object real report the same way.",
      build: `useState({revenue:"0.00",cogs:"0.00",netIncome:"0.00"}) + fetch inside useEffect([]) + three cards.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `In App.tsx, hold items/purchaseOrders/salesOrders in shared state, with one loadData() fetching all three plus the report in parallel.

Open (or create) src/App.tsx and set up the master state every other panel on the dashboard will read from and write into.

WHAT YOUR LOGIC NEEDS
- Three state arrays: items, purchaseOrders, salesOrders — all starting empty.
- One async loadData() function fetching /api/items, /api/po, and /api/so in parallel with Promise.all, then updating all three state setters.
- A useEffect([]) calling loadData() once, on mount.

Your task: declare the three state arrays, write loadData() fetching all three endpoints in parallel and updating state, and call it once on mount — no rendering of the child panels yet, that's the next step.`,
    hint: `1. Three states: const [items, setItems] = useState<Item[]>([]); (same for purchaseOrders and salesOrders).
2. loadData: const loadData = async () => { const [i, po, so] = await Promise.all([fetch("/api/items").then(r=>r.json()), fetch("/api/po").then(r=>r.json()), fetch("/api/so").then(r=>r.json())]); setItems(i); setPurchaseOrders(po); setSalesOrders(so); };
3. Call once: useEffect(() => { loadData(); }, []);`,
    example_code: `const [items, setItems] = useState<Item[]>([]);
const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);

const loadData = async () => {
  const [i, po, so] = await Promise.all([
    fetch("/api/items").then((r) => r.json()),
    fetch("/api/po").then((r) => r.json()),
    fetch("/api/so").then((r) => r.json()),
  ]);
  setItems(i);
  setPurchaseOrders(po);
  setSalesOrders(so);
};

useEffect(() => {
  loadData();
}, []);`,
    think_prompt: `Every child panel on this dashboard (inventory, procurement, sales) needs to read from the SAME live data, and every action any one of them takes (receiving, fulfilling) needs to refresh ALL of them — not just itself. What single function makes that possible, and where does it need to live?`,
    mc_options: [
      "one loadData() in App.tsx, fetching all three endpoints in parallel via Promise.all and updating all three states",
      "let each child component fetch its own copy of items/purchaseOrders/salesOrders",
      "fetch each endpoint sequentially with three separate useEffects",
    ],
    mc_correct_option: "one loadData() in App.tsx, fetching all three endpoints in parallel via Promise.all and updating all three states",
    mc_anchor: "one loadData() in App.tsx, fetching all",
    why_this_matters: `Centralizing state in App.tsx is what makes "Receive Goods" or "Fulfill & Ship" instantly update the inventory table and the financial cards on the exact same screen — not just the panel someone clicked in.`,
    answer_keywords: ["items", "purchaseOrders", "salesOrders", "loadData", "Promise.all", "useEffect"],
    seed_code: ``,
    starter_code: `import { useState, useEffect } from "react";
// import Item, PurchaseOrder, SalesOrder types from their own components

export default function App() {
  // items, purchaseOrders, salesOrders state + loadData go here
  return <main />;
}
`,
    feedback_correct: "Correct — one real shared state, fed by one real parallel load.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "All three lists live in App.tsx's own state, loaded together by one loadData() function.",
    pre_check_hint: `Implement loadData() fetching items, orders, and reports in parallel — Promise.all is what lets three independent fetches run at once instead of one after another.`,
    expected: `import { useState, useEffect } from "react";
import { type Item } from "./components/InventoryTable";
import { type PurchaseOrder } from "./components/ProcurementPanel";
import { type SalesOrder } from "./components/SalesFulfillmentBoard";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);

  const loadData = async () => {
    const [i, po, so] = await Promise.all([
      fetch("/api/items").then((r) => r.json()),
      fetch("/api/po").then((r) => r.json()),
      fetch("/api/so").then((r) => r.json()),
    ]);
    setItems(i);
    setPurchaseOrders(po);
    setSalesOrders(so);
  };

  useEffect(() => {
    loadData();
  }, []);

  return <main />;
}
`,
    analog_example: `const [items, setItems] = useState<Item[]>([]);
const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);

const loadData = async () => {
  const [i, po, so] = await Promise.all([
    fetch("/api/items").then((r) => r.json()),
    fetch("/api/po").then((r) => r.json()),
    fetch("/api/so").then((r) => r.json()),
  ]);
  setItems(i);
  setPurchaseOrders(po);
  setSalesOrders(so);
};

useEffect(() => {
  loadData();
}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Centralizing state in App.tsx is what makes "Receive Goods" or "Fulfill & Ship" instantly update the inventory table and the financial cards on the exact same screen — not just the panel someone clicked in.`,
      pain: "Letting each panel fetch its own copy of shared data means an action in one panel never shows up in another until a manual full-page reload.",
      mentalModel: MENTAL_MODEL,
      discover: `const loadData = async () => {
  const [i, po, so] = await Promise.all([
    fetch("/api/items").then((r) => r.json()),
    fetch("/api/po").then((r) => r.json()),
    fetch("/api/so").then((r) => r.json()),
  ]);
  setItems(i);
  setPurchaseOrders(po);
  setSalesOrders(so);
};`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not let child panels fetch their own copies of items/purchaseOrders/salesOrders — everything comes from this one loadData().",
      dryRun: "Write the same shared-loader pattern for a different set of three related resources.",
      build: `1. Three state arrays.\n2. loadData() with Promise.all over three fetches.\n3. useEffect([]) calling it once.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Assemble FinancialMetrics, InventoryTable, ProcurementPanel, and SalesFulfillmentBoard together, wiring onReceive/onFulfill back to loadData.

Render all four components together inside App.tsx's return, passing each the data (and callback) it needs.

WHAT YOUR LOGIC NEEDS
- <FinancialMetrics /> rendered with no props (it fetches its own report independently).
- <InventoryTable /> rendered with no props (it fetches its own items independently).
- <ProcurementPanel orders={purchaseOrders} onReceive={loadData} />.
- <SalesFulfillmentBoard orders={salesOrders} onFulfill={loadData} />.

Your task: render all four inside a <main>, passing loadData itself as the onReceive/onFulfill callback so any real receipt or fulfillment refreshes the whole dashboard's shared state.`,
    hint: `1. Import all four components at the top of App.tsx.
2. Layout: wrap everything in <main>.
3. Wire callbacks: <ProcurementPanel orders={purchaseOrders} onReceive={loadData} /> and <SalesFulfillmentBoard orders={salesOrders} onFulfill={loadData} /> — pass the function itself, not loadData().`,
    example_code: `import { FinancialMetrics } from "./components/FinancialMetrics";
import { InventoryTable } from "./components/InventoryTable";
import { ProcurementPanel } from "./components/ProcurementPanel";
import { SalesFulfillmentBoard } from "./components/SalesFulfillmentBoard";

return (
  <main className="p-6 max-w-7xl mx-auto space-y-6">
    <h1 className="text-2xl font-bold">MiniERP Command Center</h1>
    <FinancialMetrics />
    <InventoryTable />
    <div className="grid grid-cols-2 gap-6">
      <ProcurementPanel orders={purchaseOrders} onReceive={loadData} />
      <SalesFulfillmentBoard orders={salesOrders} onFulfill={loadData} />
    </div>
  </main>
);`,
    think_prompt: `Passing loadData itself — not loadData() — as onReceive means the callback runs exactly when the panel decides to call it (right after a real successful receipt), not once immediately when the page renders. What's the difference between handing over a function and handing over the result of calling it?`,
    mc_options: [
      "pass loadData (the function reference) as onReceive/onFulfill, so it runs only when the panel actually calls it",
      "pass loadData() (call it immediately) as the prop value",
      "skip wiring the callbacks — the panels don't need to trigger a refresh",
    ],
    mc_correct_option: "pass loadData (the function reference) as onReceive/onFulfill, so it runs only when the panel actually calls it",
    mc_anchor: "pass loadData (the function reference) a",
    why_this_matters: `Wiring "Receive Goods" and "Fulfill & Ship" back to the same loadData() is what makes the new package's cost, the updated stock count, and the moved financial figures all appear together, instantly, on one screen.`,
    answer_keywords: ["FinancialMetrics", "InventoryTable", "ProcurementPanel", "SalesFulfillmentBoard", "onReceive", "onFulfill", "loadData"],
    seed_code: `import { useState, useEffect } from "react";
import { type Item } from "./components/InventoryTable";
import { type PurchaseOrder } from "./components/ProcurementPanel";
import { type SalesOrder } from "./components/SalesFulfillmentBoard";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);

  const loadData = async () => {
    const [i, po, so] = await Promise.all([
      fetch("/api/items").then((r) => r.json()),
      fetch("/api/po").then((r) => r.json()),
      fetch("/api/so").then((r) => r.json()),
    ]);
    setItems(i);
    setPurchaseOrders(po);
    setSalesOrders(so);
  };

  useEffect(() => {
    loadData();
  }, []);

  return <main />;
}
`,
    starter_code: `import { useState, useEffect } from "react";
import { type Item } from "./components/InventoryTable";
import { type PurchaseOrder } from "./components/ProcurementPanel";
import { type SalesOrder } from "./components/SalesFulfillmentBoard";
// import FinancialMetrics, InventoryTable, ProcurementPanel, SalesFulfillmentBoard here

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);

  const loadData = async () => {
    const [i, po, so] = await Promise.all([
      fetch("/api/items").then((r) => r.json()),
      fetch("/api/po").then((r) => r.json()),
      fetch("/api/so").then((r) => r.json()),
    ]);
    setItems(i);
    setPurchaseOrders(po);
    setSalesOrders(so);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main>
      {/* assemble FinancialMetrics, InventoryTable, ProcurementPanel, SalesFulfillmentBoard here */}
    </main>
  );
}
`,
    feedback_correct: "Correct — the whole MiniERP dashboard is now one real, self-updating product.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Render all four components, and pass loadData itself (not loadData()) as onReceive/onFulfill.",
    pre_check_hint: `Bring all parts together in App.tsx: FinancialMetrics and InventoryTable need no props (they fetch their own data); ProcurementPanel and SalesFulfillmentBoard need their real orders array plus loadData as the refresh callback.`,
    expected: `import { useState, useEffect } from "react";
import { FinancialMetrics } from "./components/FinancialMetrics";
import { InventoryTable, type Item } from "./components/InventoryTable";
import { ProcurementPanel, type PurchaseOrder } from "./components/ProcurementPanel";
import { SalesFulfillmentBoard, type SalesOrder } from "./components/SalesFulfillmentBoard";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);

  const loadData = async () => {
    const [i, po, so] = await Promise.all([
      fetch("/api/items").then((r) => r.json()),
      fetch("/api/po").then((r) => r.json()),
      fetch("/api/so").then((r) => r.json()),
    ]);
    setItems(i);
    setPurchaseOrders(po);
    setSalesOrders(so);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">MiniERP Command Center</h1>
      <FinancialMetrics />
      <InventoryTable />
      <div className="grid grid-cols-2 gap-6">
        <ProcurementPanel orders={purchaseOrders} onReceive={loadData} />
        <SalesFulfillmentBoard orders={salesOrders} onFulfill={loadData} />
      </div>
    </main>
  );
}
`,
    analog_example: `import { FinancialMetrics } from "./components/FinancialMetrics";
import { InventoryTable } from "./components/InventoryTable";
import { ProcurementPanel } from "./components/ProcurementPanel";
import { SalesFulfillmentBoard } from "./components/SalesFulfillmentBoard";

return (
  <main className="p-6 max-w-7xl mx-auto space-y-6">
    <h1 className="text-2xl font-bold">MiniERP Command Center</h1>
    <FinancialMetrics />
    <InventoryTable />
    <div className="grid grid-cols-2 gap-6">
      <ProcurementPanel orders={purchaseOrders} onReceive={loadData} />
      <SalesFulfillmentBoard orders={salesOrders} onFulfill={loadData} />
    </div>
  </main>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Wiring "Receive Goods" and "Fulfill & Ship" back to the same loadData() is what makes the new package's cost, the updated stock count, and the moved financial figures all appear together, instantly, on one screen.`,
      pain: "Passing loadData() instead of loadData would call it once during render instead of handing the panel something it can call later, on its own trigger.",
      mentalModel: MENTAL_MODEL,
      discover: `<ProcurementPanel orders={purchaseOrders} onReceive={loadData} />
<SalesFulfillmentBoard orders={salesOrders} onFulfill={loadData} />`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not pass loadData() (with parentheses) as a prop — that calls it immediately instead of handing over the function.",
      dryRun: "Assemble the same kind of multi-panel dashboard for a different set of four components.",
      build: `1. Import all four components.\n2. Layout in <main>.\n3. Pass loadData (not loadData()) as onReceive/onFulfill.`,
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1", id: "step1" },
  { label: "Step 2", id: "step2" },
  { label: "Step 3", id: "step3" },
  { label: "Step 4", id: "step4" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Financial metrics + dashboard assembly",
  shortName: "Reports + assembly",
});
