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
      "Create FinancialMetrics.tsx and define what one income-statement response looks like.",
      "Export the empty FinancialMetrics component shell.",
      "Add state to hold the fetched financials, defaulting to real zeros.",
      "Fetch the real income statement on mount and store it in state.",
      "Render the three financial cards from state.",
      "Open App.tsx and declare the three shared state arrays.",
      "Write loadData(), fetching items, purchase orders, and sales orders in parallel.",
      "Call loadData() once, when the dashboard first mounts.",
      "Render FinancialMetrics and InventoryTable — neither needs any props.",
      "Render ProcurementPanel and SalesFulfillmentBoard, wired to shared state and loadData.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 10",
    paal: `Create FinancialMetrics.tsx and define what one income-statement response looks like.

Create the file at \`src/components/FinancialMetrics.tsx\` — it doesn't exist yet — and write a TypeScript type naming every field the real income-statement endpoint sends back.

WHAT YOUR BLUEPRINT NEEDS
- revenue (text — the API sends an already-formatted 2-decimal string, e.g. "125.00")
- cogs (text)
- netIncome (text)

Your task: create the file and write \`type Financials\` with those three fields. Nothing else yet — the component itself comes in the next step.`,
    hint: `1. Create the file: Add a new file at src/components/FinancialMetrics.tsx.
2. Match the real shape: GET /api/reports/income-statement returns { revenue, cogs, netIncome } as strings like "125.00", not numbers.
3. Write only the type — no component yet.`,
    example_code: `// src/components/RevenueCards.tsx
export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};`,
    think_prompt: `The real /api/reports/income-statement endpoint already formats every figure to 2 decimal places as a string — the type needs to reflect that exact shape, not a guess. What does the blueprint need to name?`,
    mc_options: [
      "type Financials = { revenue: string; cogs: string; netIncome: string; }",
      "type Financials = { revenue: number; cogs: number; netIncome: number; }",
      "Skip the type and read the response as untyped JSON",
    ],
    mc_correct_option: "type Financials = { revenue: string; cogs: string; netIncome: string; }",
    mc_anchor: "type Financials = { revenue: string; cog",
    why_this_matters: `Matching the type to the real API's already-formatted strings avoids a pointless re-parse (or a silent bug) later when you render them.`,
    answer_keywords: ["export", "type", "Financials", "revenue", "cogs", "netIncome"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the blueprint matches exactly what the real endpoint sends.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Just the type for now — three string fields, matching the real API's response.",
    pre_check_hint: `A TypeScript type just needs to match what the real endpoint actually sends — three already-formatted money strings.`,
    expected: `export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};
`,
    analog_example: `export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Matching the type to the real API's already-formatted strings avoids a pointless re-parse (or a silent bug) later when you render them.`,
      pain: "Typing money fields as number when the real API sends formatted strings produces a type that lies about the data it describes.",
      mentalModel: MENTAL_MODEL,
      discover: `export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not assume a money field is a number without checking what the real endpoint actually returns.",
      dryRun: "Write the same single-purpose type for a different real report endpoint.",
      build: `type Financials = { revenue: string; cogs: string; netIncome: string; }`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 10",
    paal: `Export the empty FinancialMetrics component shell.

Add the component itself — no data, no fetch, just a function that returns something on screen.

WHAT YOUR CODE NEEDS
- An exported function named FinancialMetrics.
- A return value of <div /> for now.

Your task: export function FinancialMetrics() { return <div />; } below the type from the previous step.`,
    hint: `1. Export a function: export function FinancialMetrics() { ... }
2. Return the shell: return <div />;`,
    example_code: `export function RevenueCards() {
  return <div />;
}`,
    think_prompt: `Every component starts as an empty shell before it holds or renders anything real — that's true whether it will eventually fetch one object or a whole array. What's the minimum a component needs to exist?`,
    mc_options: [
      "export function FinancialMetrics() { return <div />; }",
      "export const FinancialMetrics = <div />;",
      "Wait until the fetch logic is ready before creating the component",
    ],
    mc_correct_option: "export function FinancialMetrics() { return <div />; }",
    mc_anchor: "export function FinancialMetrics() { ret",
    why_this_matters: `A component that exists (even doing nothing yet) is something the rest of your dashboard can already import and place, before its real behavior is finished.`,
    answer_keywords: ["export", "function", "FinancialMetrics", "return"],
    seed_code: `export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};
`,
    starter_code: `export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};

// component shell goes here
`,
    feedback_correct: "Correct — the component exists now.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Just export the function and return an empty <div /> — nothing else yet.",
    pre_check_hint: `A component is just a function that returns JSX — it doesn't need to do anything real yet to exist.`,
    expected: `export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};

export function FinancialMetrics() {
  return <div />;
}
`,
    analog_example: `export function RevenueCards() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A component that exists (even doing nothing yet) is something the rest of your dashboard can already import and place, before its real behavior is finished.`,
      pain: "Trying to write state, fetch, and render all in one step makes it hard to tell which part broke if something goes wrong.",
      mentalModel: MENTAL_MODEL,
      discover: `export function FinancialMetrics() {
  return <div />;
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not add state or a fetch call yet — this step is only the shell.",
      dryRun: "Write the same one-line shell for a different component.",
      build: `export function FinancialMetrics() { return <div />; }`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 10",
    paal: `Add state to hold the fetched financials, defaulting to real zeros.

Give the component somewhere to hold the financials once they arrive — defaulting to real zero-strings, not nothing.

WHAT YOUR LOGIC NEEDS
- useState<Financials>, defaulting to { revenue: "0.00", cogs: "0.00", netIncome: "0.00" }.

Your task: add const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" }); inside the component. No fetch yet.`,
    hint: `1. Import useState: import { useState } from "react";
2. Declare state: const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" });
3. Place it inside FinancialMetrics(), before the return.`,
    example_code: `const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" });`,
    think_prompt: `Right after the component mounts, the real fetch hasn't resolved yet. What should the cards show in that brief moment — nothing, or an honest starting value?`,
    mc_options: [
      "default state to real zero-strings, e.g. { revenue: \"0.00\", cogs: \"0.00\", netIncome: \"0.00\" }",
      "leave the initial state undefined until the fetch resolves",
      "default state to empty strings instead of zero-strings",
    ],
    mc_correct_option: "default state to real zero-strings, e.g. { revenue: \"0.00\", cogs: \"0.00\", netIncome: \"0.00\" }",
    mc_anchor: "default state to real zero-strings, e.g.",
    why_this_matters: `Defaulting to real zero-strings means the cards render sensibly from the very first frame, instead of flashing "$undefined" for a moment.`,
    answer_keywords: ["useState", "Financials", "financials", "setFinancials", "0.00"],
    seed_code: `export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};

export function FinancialMetrics() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};

export function FinancialMetrics() {
  // financials state goes here
  return <div />;
}
`,
    feedback_correct: "Correct — the component now has somewhere honest to hold real data.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Add just the useState declaration, defaulted to zero-strings — no fetch yet.",
    pre_check_hint: `useState needs a starting value even before real data exists — real zero-strings, not undefined, keep the first render honest.`,
    expected: `import { useState } from "react";

export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};

export function FinancialMetrics() {
  const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" });
  return <div />;
}
`,
    analog_example: `const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" });`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Defaulting to real zero-strings means the cards render sensibly from the very first frame, instead of flashing "$undefined" for a moment.`,
      pain: "Undefined initial state produces a visible flash of broken-looking output before the real fetch resolves.",
      mentalModel: MENTAL_MODEL,
      discover: `const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" });`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not leave the initial state undefined or as empty strings — use real zero-strings.",
      dryRun: "Default state the same way for a different single-object real report.",
      build: `useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" })`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 10",
    paal: `Fetch the real income statement on mount and store it in state.

Fetch the real endpoint exactly once, when the component first appears, and hand the response straight to your state setter.

WHAT YOUR LOGIC NEEDS
- useEffect with an empty dependency array ([]).
- fetch("/api/reports/income-statement") inside it.
- The parsed JSON body passed straight into setFinancials.

Your task: wrap a fetch to /api/reports/income-statement in useEffect(() => {...}, []), calling setFinancials with the parsed response.`,
    hint: `1. Import useEffect: import { useState, useEffect } from "react";
2. Add the effect: useEffect(() => { ... }, []);
3. Fetch and store: fetch("/api/reports/income-statement").then((res) => res.json()).then(setFinancials);`,
    example_code: `useEffect(() => {
  fetch("/api/reports/income-statement")
    .then((res) => res.json())
    .then(setFinancials);
}, []);`,
    think_prompt: `A useEffect with an empty dependency array runs exactly once, right after the component's first render. fetch() itself returns a Promise — the real response only exists inside .then(). What single line turns that response into new state?`,
    mc_options: [
      "fetch(\"/api/reports/income-statement\").then((res) => res.json()).then(setFinancials)",
      "const data = fetch(\"/api/reports/income-statement\"); setFinancials(data);",
      "call fetch directly inside the JSX return",
    ],
    mc_correct_option: "fetch(\"/api/reports/income-statement\").then((res) => res.json()).then(setFinancials)",
    mc_anchor: "fetch(\"/api/reports/income-statement\").t",
    why_this_matters: `Real-time financial cards, fetched straight from the ledger, are what let a business owner trust the number on screen without waiting for a manual month-end close.`,
    answer_keywords: ["useEffect", "fetch", "income-statement", "setFinancials", "json"],
    seed_code: `import { useState } from "react";

export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};

export function FinancialMetrics() {
  const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" });
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
  const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" });
  // fetch goes here
  return <div />;
}
`,
    feedback_correct: "Correct — real data now flows into state on mount.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "The fetch has to run inside useEffect([]), passing the parsed response straight to setFinancials.",
    pre_check_hint: `fetch() returns a Promise; the real response only exists inside .then(). A useEffect with an empty array makes that run exactly once, right when the component first appears.`,
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

  return <div />;
}
`,
    analog_example: `useEffect(() => {
  fetch("/api/reports/income-statement")
    .then((res) => res.json())
    .then(setFinancials);
}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Real-time financial cards, fetched straight from the ledger, are what let a business owner trust the number on screen without waiting for a manual month-end close.`,
      pain: "Skipping this step leaves a type and a state slot, but no actual data ever arrives.",
      mentalModel: MENTAL_MODEL,
      discover: `useEffect(() => {
  fetch("/api/reports/income-statement")
    .then((res) => res.json())
    .then(setFinancials);
}, []);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not call fetch() directly inside the component body (outside useEffect) — that refetches on every render.",
      dryRun: "Write the same fetch-on-mount step for a different real single-object endpoint.",
      build: `useEffect(() => { fetch("/api/reports/income-statement").then((res) => res.json()).then(setFinancials); }, []);`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 10",
    paal: `Render the three financial cards from state.

Draw the three cards — Revenue, COGS, Net Income — reading their values straight from state.

WHAT YOUR LOGIC NEEDS
- Three simple elements, each showing a label and \${financials.<field>}.

Your task: replace <div /> with a layout showing all three fields from financials, each with a $ prefix.`,
    hint: `1. Wrap in a container: <div className="grid grid-cols-3 gap-4"> ... </div>
2. One card per field: <div>Revenue: \${financials.revenue}</div>, and the same for cogs and netIncome.`,
    example_code: `return (
  <div className="grid grid-cols-3 gap-4">
    <div className="p-4 bg-white rounded shadow">Revenue: \${financials.revenue}</div>
    <div className="p-4 bg-white rounded shadow">COGS: \${financials.cogs}</div>
    <div className="p-4 bg-white rounded shadow">Net Income: \${financials.netIncome}</div>
  </div>
);`,
    think_prompt: `This is the simplest possible render step — no conditionals, no loop, just reading three fields off one state object straight into JSX. What does each card need to show?`,
    mc_options: [
      "three elements reading financials.revenue, financials.cogs, and financials.netIncome",
      "one element showing the whole financials object as JSON",
      "hardcoded dollar figures instead of reading from state",
    ],
    mc_correct_option: "three elements reading financials.revenue, financials.cogs, and financials.netIncome",
    mc_anchor: "three elements reading financials.revenu",
    why_this_matters: `Reading straight from state means the cards always show whatever the last real fetch (or future refresh) actually returned — never a stale, hardcoded number.`,
    answer_keywords: ["financials.revenue", "financials.cogs", "financials.netIncome"],
    seed_code: `import { useState, useEffect } from "react";

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
  const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" });

  useEffect(() => {
    fetch("/api/reports/income-statement")
      .then((res) => res.json())
      .then(setFinancials);
  }, []);

  return (
    <div>
      {/* three cards go here */}
    </div>
  );
}
`,
    feedback_correct: "Correct — FinancialMetrics is done: real data, real cards.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Render exactly three elements, each reading one field off the financials state object.",
    pre_check_hint: `This is a direct read — no branching needed. Three cards, each showing one field from the state object you already have.`,
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
    analog_example: `return (
  <div className="grid grid-cols-3 gap-4">
    <div className="p-4 bg-white rounded shadow">Revenue: \${financials.revenue}</div>
    <div className="p-4 bg-white rounded shadow">COGS: \${financials.cogs}</div>
    <div className="p-4 bg-white rounded shadow">Net Income: \${financials.netIncome}</div>
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Reading straight from state means the cards always show whatever the last real fetch (or future refresh) actually returned — never a stale, hardcoded number.`,
      pain: "Hardcoding the figures would make the cards look right once and wrong forever after.",
      mentalModel: MENTAL_MODEL,
      discover: `<div className="grid grid-cols-3 gap-4">
  <div>Revenue: \${financials.revenue}</div>
  <div>COGS: \${financials.cogs}</div>
  <div>Net Income: \${financials.netIncome}</div>
</div>`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not hardcode any of the three figures — always read from financials.",
      dryRun: "Render the same three-card layout for a different single-object real report.",
      build: `<div>Revenue: \${financials.revenue}</div> + COGS + Net Income cards.`,
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 10",
    paal: `Open App.tsx and declare the three shared state arrays.

This step edits a different file: \`src/App.tsx\` — create it if it doesn't already exist. Declare the three state arrays every other panel on the dashboard will read from.

WHAT YOUR LOGIC NEEDS
- Three useState arrays: items, purchaseOrders, salesOrders — all starting empty.

Your task: in App.tsx, declare items/purchaseOrders/salesOrders as three separate useState<[]>([]) arrays. No fetching yet — that's the next step.`,
    hint: `1. Create/open the file: src/App.tsx.
2. Import types from their own components: Item from InventoryTable, PurchaseOrder from ProcurementPanel, SalesOrder from SalesFulfillmentBoard.
3. Three states: const [items, setItems] = useState<Item[]>([]); (same shape for purchaseOrders and salesOrders).`,
    example_code: `const [items, setItems] = useState<Item[]>([]);
const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);`,
    think_prompt: `Every child panel on this dashboard needs to read from the SAME live data — that means one shared owner, not three separate copies. Where does that shared data need to live, and what should it start as?`,
    mc_options: [
      "three separate useState<[]>([]) arrays in App.tsx: items, purchaseOrders, salesOrders",
      "one big useState holding all three lists nested in one object",
      "let each child component declare its own copy of these three arrays",
    ],
    mc_correct_option: "three separate useState<[]>([]) arrays in App.tsx: items, purchaseOrders, salesOrders",
    mc_anchor: "three separate useState<[]>([]) arrays i",
    why_this_matters: `Declaring these three lists once, in the parent, is what makes it possible for every panel to see the same real data.`,
    answer_keywords: ["items", "purchaseOrders", "salesOrders", "useState"],
    seed_code: ``,
    starter_code: `import { useState } from "react";
import { type Item } from "./components/InventoryTable";
import { type PurchaseOrder } from "./components/ProcurementPanel";
import { type SalesOrder } from "./components/SalesFulfillmentBoard";

export default function App() {
  // three state arrays go here
  return <main />;
}
`,
    feedback_correct: "Correct — one shared home for all three lists.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Just the three empty state arrays for now — no fetching yet.",
    pre_check_hint: `Three separate useState hooks, each starting as an empty array — the fetch that fills them comes in the next step.`,
    expected: `import { useState } from "react";
import { type Item } from "./components/InventoryTable";
import { type PurchaseOrder } from "./components/ProcurementPanel";
import { type SalesOrder } from "./components/SalesFulfillmentBoard";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  return <main />;
}
`,
    analog_example: `const [items, setItems] = useState<Item[]>([]);
const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Declaring these three lists once, in the parent, is what makes it possible for every panel to see the same real data.`,
      pain: "Letting each child component own its own copy means an action in one panel never shows up in another.",
      mentalModel: MENTAL_MODEL,
      discover: `const [items, setItems] = useState<Item[]>([]);
const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not add a fetch yet — this step is just the three empty state declarations.",
      dryRun: "Declare the same shared-state pattern for a different set of three related resources.",
      build: `Three useState<[]>([]) declarations: items, purchaseOrders, salesOrders.`,
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 10",
    paal: `Write loadData(), fetching items, purchase orders, and sales orders in parallel.

Add one function that fetches all three real endpoints at once and updates all three state setters.

WHAT YOUR LOGIC NEEDS
- An async function loadData.
- Promise.all fetching /api/items, /api/po, and /api/so together.
- The three results passed to setItems, setPurchaseOrders, and setSalesOrders.

Your task: write loadData as an async function using Promise.all over the three fetches, then call the matching setter for each result. Don't call it anywhere yet — that's the next step.`,
    hint: `1. Declare the function: const loadData = async () => { ... };
2. Fetch in parallel: const [i, po, so] = await Promise.all([fetch("/api/items").then(r=>r.json()), fetch("/api/po").then(r=>r.json()), fetch("/api/so").then(r=>r.json())]);
3. Update state: setItems(i); setPurchaseOrders(po); setSalesOrders(so);`,
    example_code: `const loadData = async () => {
  const [i, po, so] = await Promise.all([
    fetch("/api/items").then((r) => r.json()),
    fetch("/api/po").then((r) => r.json()),
    fetch("/api/so").then((r) => r.json()),
  ]);
  setItems(i);
  setPurchaseOrders(po);
  setSalesOrders(so);
};`,
    think_prompt: `Three independent fetches that don't depend on each other can run at the same time instead of one after another. What lets three separate fetch() calls run in parallel and hands back all three results together?`,
    mc_options: [
      "Promise.all over the three fetch() calls, then one setter call per result",
      "await each fetch one after another, in sequence",
      "call all three setters with the same raw fetch() promise",
    ],
    mc_correct_option: "Promise.all over the three fetch() calls, then one setter call per result",
    mc_anchor: "Promise.all over the three fetch() calls",
    why_this_matters: `One loadData() function is what every panel's action (a receipt, a fulfillment) can call to refresh the whole dashboard at once.`,
    answer_keywords: ["loadData", "Promise.all", "items", "purchaseOrders", "salesOrders", "setItems", "setPurchaseOrders", "setSalesOrders"],
    seed_code: `import { useState } from "react";
import { type Item } from "./components/InventoryTable";
import { type PurchaseOrder } from "./components/ProcurementPanel";
import { type SalesOrder } from "./components/SalesFulfillmentBoard";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  return <main />;
}
`,
    starter_code: `import { useState } from "react";
import { type Item } from "./components/InventoryTable";
import { type PurchaseOrder } from "./components/ProcurementPanel";
import { type SalesOrder } from "./components/SalesFulfillmentBoard";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);

  // loadData goes here

  return <main />;
}
`,
    feedback_correct: "Correct — one function, three real fetches, three updates.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Use Promise.all over the three fetches, then call each setter with its matching result.",
    pre_check_hint: `Promise.all lets three independent fetches run at once instead of one after another — the array it resolves to is in the same order you passed the fetches in.`,
    expected: `import { useState } from "react";
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

  return <main />;
}
`,
    analog_example: `const loadData = async () => {
  const [i, po, so] = await Promise.all([
    fetch("/api/items").then((r) => r.json()),
    fetch("/api/po").then((r) => r.json()),
    fetch("/api/so").then((r) => r.json()),
  ]);
  setItems(i);
  setPurchaseOrders(po);
  setSalesOrders(so);
};`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `One loadData() function is what every panel's action (a receipt, a fulfillment) can call to refresh the whole dashboard at once.`,
      pain: "Fetching sequentially instead of with Promise.all makes the dashboard wait three times longer than it needs to.",
      mentalModel: MENTAL_MODEL,
      discover: `const loadData = async () => {
  const [i, po, so] = await Promise.all([...]);
  setItems(i);
  setPurchaseOrders(po);
  setSalesOrders(so);
};`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not call loadData() anywhere yet — this step only defines it.",
      dryRun: "Write the same parallel-loader pattern for a different set of three related resources.",
      build: `async loadData() using Promise.all over three fetches, then three setter calls.`,
    },
  },
  {
    id: "step8",
    type: "question",
    phase: "Step 8 of 10",
    paal: `Call loadData() once, when the dashboard first mounts.

Run the function you just wrote exactly once, right when the page first appears.

WHAT YOUR LOGIC NEEDS
- useEffect with an empty dependency array ([]) calling loadData().

Your task: add useEffect(() => { loadData(); }, []); right after loadData is defined.`,
    hint: `1. Import useEffect: import { useState, useEffect } from "react";
2. Add the effect: useEffect(() => { loadData(); }, []);
3. Place it directly after the loadData function.`,
    example_code: `useEffect(() => {
  loadData();
}, []);`,
    think_prompt: `Defining a function doesn't run it — something has to actually call it. What runs exactly once, right when a component first appears?`,
    mc_options: [
      "useEffect(() => { loadData(); }, [])",
      "call loadData() directly in the component body, outside any hook",
      "loadData() runs automatically the moment it's defined",
    ],
    mc_correct_option: "useEffect(() => { loadData(); }, [])",
    mc_anchor: "useEffect(() => { loadData(); }, [])",
    why_this_matters: `This is what makes the dashboard show real data the instant it loads, instead of three empty panels waiting for a manual trigger.`,
    answer_keywords: ["useEffect", "loadData"],
    seed_code: `import { useState } from "react";
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

  return <main />;
}
`,
    starter_code: `import { useState, useEffect } from "react";
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

  // call loadData() on mount here

  return <main />;
}
`,
    feedback_correct: "Correct — the dashboard now loads real data the moment it appears.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Wrap the call in useEffect(() => { loadData(); }, []) — a bare call outside a hook runs on every render.",
    pre_check_hint: `A useEffect with an empty dependency array is what runs something exactly once, right after the first render.`,
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
    analog_example: `useEffect(() => {
  loadData();
}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `This is what makes the dashboard show real data the instant it loads, instead of three empty panels waiting for a manual trigger.`,
      pain: "A bare loadData() call outside useEffect would re-run on every single render, hammering all three endpoints constantly.",
      mentalModel: MENTAL_MODEL,
      discover: `useEffect(() => {
  loadData();
}, []);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not call loadData() outside of useEffect — that would refire on every render.",
      dryRun: "Wire the same on-mount call for a different loader function.",
      build: `useEffect(() => { loadData(); }, []);`,
    },
  },
  {
    id: "step9",
    type: "question",
    phase: "Step 9 of 10",
    paal: `Render FinancialMetrics and InventoryTable — neither needs any props.

Import both components and place them inside <main>. Both fetch their own data independently, so neither needs anything passed in.

WHAT YOUR LOGIC NEEDS
- Import FinancialMetrics and InventoryTable.
- <FinancialMetrics /> and <InventoryTable /> rendered inside <main>, no props on either.

Your task: import both components and render them, in that order, inside <main>. The procurement and sales panels come in the next step.`,
    hint: `1. Import: import { FinancialMetrics } from "./components/FinancialMetrics"; import { InventoryTable } from "./components/InventoryTable";
2. Render: <main><FinancialMetrics /><InventoryTable /></main>`,
    example_code: `import { FinancialMetrics } from "./components/FinancialMetrics";
import { InventoryTable } from "./components/InventoryTable";

return (
  <main>
    <FinancialMetrics />
    <InventoryTable />
  </main>
);`,
    think_prompt: `FinancialMetrics and InventoryTable each already fetch their own real data inside themselves — App.tsx doesn't own either one's data. What do they need from the parent to render correctly?`,
    mc_options: [
      "nothing — <FinancialMetrics /> and <InventoryTable /> with no props",
      "pass items and financials down as props to both",
      "wrap them in a form before rendering",
    ],
    mc_correct_option: "nothing — <FinancialMetrics /> and <InventoryTable /> with no props",
    mc_anchor: "nothing — <FinancialMetrics /> and <Inve",
    why_this_matters: `Not every component on this dashboard needs shared state — some are genuinely self-sufficient, and forcing props onto them would just add noise.`,
    answer_keywords: ["FinancialMetrics", "InventoryTable", "main"],
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
// import FinancialMetrics and InventoryTable here

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
      {/* FinancialMetrics and InventoryTable go here */}
    </main>
  );
}
`,
    feedback_correct: "Correct — two real, self-sufficient panels now render on the dashboard.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Just import and render both — neither needs props from App.tsx.",
    pre_check_hint: `Both of these components already fetch their own data internally — this step is only about placing them, not feeding them anything.`,
    expected: `import { useState, useEffect } from "react";
import { FinancialMetrics } from "./components/FinancialMetrics";
import { InventoryTable, type Item } from "./components/InventoryTable";
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

  return (
    <main>
      <FinancialMetrics />
      <InventoryTable />
    </main>
  );
}
`,
    analog_example: `import { FinancialMetrics } from "./components/FinancialMetrics";
import { InventoryTable } from "./components/InventoryTable";

return (
  <main>
    <FinancialMetrics />
    <InventoryTable />
  </main>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Not every component on this dashboard needs shared state — some are genuinely self-sufficient, and forcing props onto them would just add noise.`,
      pain: "Passing unnecessary props onto a self-sufficient component adds a coupling that isn't real.",
      mentalModel: MENTAL_MODEL,
      discover: `<main>
  <FinancialMetrics />
  <InventoryTable />
</main>`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not pass props to components that don't declare any — they already fetch their own data.",
      dryRun: "Place the same two self-sufficient components in a different layout.",
      build: `Import FinancialMetrics + InventoryTable, render both with no props inside <main>.`,
    },
  },
  {
    id: "step10",
    type: "question",
    phase: "Step 10 of 10",
    paal: `Render ProcurementPanel and SalesFulfillmentBoard, wired to shared state and loadData.

Finish the dashboard: these two panels DO need real props — the shared order lists, and loadData itself as the refresh callback.

WHAT YOUR LOGIC NEEDS
- Import ProcurementPanel and SalesFulfillmentBoard.
- <ProcurementPanel orders={purchaseOrders} onReceive={loadData} />.
- <SalesFulfillmentBoard orders={salesOrders} onFulfill={loadData} />.

Your task: import both components and render them inside <main>, passing loadData itself (not loadData()) as each one's refresh callback.`,
    hint: `1. Import: import { ProcurementPanel } from "./components/ProcurementPanel"; import { SalesFulfillmentBoard } from "./components/SalesFulfillmentBoard";
2. Render with props: <ProcurementPanel orders={purchaseOrders} onReceive={loadData} /> and <SalesFulfillmentBoard orders={salesOrders} onFulfill={loadData} />.
3. Pass the function itself — loadData, not loadData() — so it runs only when the panel actually calls it.`,
    example_code: `import { ProcurementPanel } from "./components/ProcurementPanel";
import { SalesFulfillmentBoard } from "./components/SalesFulfillmentBoard";

<div className="grid grid-cols-2 gap-6">
  <ProcurementPanel orders={purchaseOrders} onReceive={loadData} />
  <SalesFulfillmentBoard orders={salesOrders} onFulfill={loadData} />
</div>`,
    think_prompt: `Passing loadData (no parentheses) means the panel decides exactly when to call it — right after a real successful receipt or fulfillment. What's the difference between handing over a function and handing over the result of calling it right now?`,
    mc_options: [
      "pass loadData (the function reference) as onReceive/onFulfill, so it runs only when the panel calls it",
      "pass loadData() (call it immediately) as the prop value",
      "skip wiring the callbacks — the panels don't need to trigger a refresh",
    ],
    mc_correct_option: "pass loadData (the function reference) as onReceive/onFulfill, so it runs only when the panel calls it",
    mc_anchor: "pass loadData (the function reference) a",
    why_this_matters: `Wiring "Receive Goods" and "Fulfill & Ship" back to the same loadData() is what makes the new package's cost, the updated stock count, and the moved financial figures all appear together, instantly, on one screen.`,
    answer_keywords: ["ProcurementPanel", "SalesFulfillmentBoard", "onReceive", "onFulfill", "loadData"],
    seed_code: `import { useState, useEffect } from "react";
import { FinancialMetrics } from "./components/FinancialMetrics";
import { InventoryTable, type Item } from "./components/InventoryTable";
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

  return (
    <main>
      <FinancialMetrics />
      <InventoryTable />
    </main>
  );
}
`,
    starter_code: `import { useState, useEffect } from "react";
import { FinancialMetrics } from "./components/FinancialMetrics";
import { InventoryTable, type Item } from "./components/InventoryTable";
import { type PurchaseOrder } from "./components/ProcurementPanel";
import { type SalesOrder } from "./components/SalesFulfillmentBoard";
// import ProcurementPanel and SalesFulfillmentBoard here

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
      <FinancialMetrics />
      <InventoryTable />
      {/* ProcurementPanel and SalesFulfillmentBoard go here */}
    </main>
  );
}
`,
    feedback_correct: "Correct — the whole MiniERP dashboard is now one real, self-updating product.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Render both, passing the real orders array and loadData itself (not loadData()) as the callback.",
    pre_check_hint: `These two panels genuinely need real props — the order list to render, and loadData as the thing they call after a real success.`,
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
    analog_example: `import { ProcurementPanel } from "./components/ProcurementPanel";
import { SalesFulfillmentBoard } from "./components/SalesFulfillmentBoard";

<div className="grid grid-cols-2 gap-6">
  <ProcurementPanel orders={purchaseOrders} onReceive={loadData} />
  <SalesFulfillmentBoard orders={salesOrders} onFulfill={loadData} />
</div>`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Wiring "Receive Goods" and "Fulfill & Ship" back to the same loadData() is what makes the new package's cost, the updated stock count, and the moved financial figures all appear together, instantly, on one screen.`,
      pain: "Passing loadData() instead of loadData would call it once during render instead of handing the panel something it can call later, on its own trigger.",
      mentalModel: MENTAL_MODEL,
      discover: `<ProcurementPanel orders={purchaseOrders} onReceive={loadData} />
<SalesFulfillmentBoard orders={salesOrders} onFulfill={loadData} />`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not pass loadData() (with parentheses) as a prop — that calls it immediately instead of handing over the function.",
      dryRun: "Wire the same real props + callback pattern for a different pair of action panels.",
      build: `Import both, render with orders={...} and onReceive/onFulfill={loadData} (no parentheses).`,
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
  { label: "Step 5", id: "step5" },
  { label: "Step 6", id: "step6" },
  { label: "Step 7", id: "step7" },
  { label: "Step 8", id: "step8" },
  { label: "Step 9", id: "step9" },
  { label: "Step 10", id: "step10" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Financial metrics + dashboard assembly",
  shortName: "Reports + assembly",
});
