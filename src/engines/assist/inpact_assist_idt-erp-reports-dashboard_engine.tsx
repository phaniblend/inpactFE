import createINPACTEngine from "../inpact_engine_shared";

const MENTAL_MODEL = `Assemble the whole MiniERP dashboard around one shared source of truth:

  Metrics  →  Revenue, COGS, Net Income — fetched live from GET /api/reports/income-statement
  State    →  App.tsx owns items, purchaseOrders, salesOrders — nobody else fetches independently
  Load     →  one loadData() call, fired on mount and after every receive/fulfill
  Assemble →  FinancialMetrics + InventoryTable + ProcurementPanel + SalesFulfillmentBoard, wired together

PREREQUISITE — this task imports from three OTHER tasks, not from anything built here:
  InventoryTable.tsx (the Item type)        →  built in task idt-erp-inventory-table
  ProcurementPanel.tsx (the PurchaseOrder type)  →  built in task idt-erp-po-form
  SalesFulfillmentBoard.tsx (the SalesOrder type) →  built in task idt-erp-so-pipeline
If those three aren't done yet, Step 8 onward will try to import from files that don't
exist. Get those three finished first — this task assembles them, it doesn't build them.
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
      usecase: "This task assembles three OTHER MiniERP components — InventoryTable, ProcurementPanel, SalesFulfillmentBoard — into one live dashboard. It assumes those three tasks are already done: this task is what makes them a single, self-updating whole, not what builds them.",
      designMock: {"kind":"list-and-form","screenTitle":"MiniERP Command Center","caption":"This is the screen you are building — real financial cards on top, real inventory/procurement/sales panels below, all sharing one live data source.","listCaption":"CARDS — real figures from the ledger","emptyCaption":"EMPTY — before the first fetch resolves","emptyMessage":"Loading…","rows":[{"title":"Revenue","subtitle":"$125.00","meta":""},{"title":"Net Income","subtitle":"$85.00","meta":""}],"fields":[{"label":"Status","options":["All"]}],"formMode":"filter","submitLabel":"Refresh"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Create the file at src/components/FinancialMetrics.tsx.",
      "Define what one income-statement response looks like.",
      "Export the empty FinancialMetrics component shell.",
      "Add state to hold the fetched financials, defaulting to real zeros.",
      "Fetch the real income statement on mount and store it in state.",
      "Render the three financial cards from state.",
      "Create the file at src/App.tsx.",
      "Declare the items state array in App.tsx.",
      "Declare the purchaseOrders state array in App.tsx.",
      "Declare the salesOrders state array in App.tsx.",
      "Write loadData(), fetching items, purchase orders, and sales orders in parallel.",
      "Call loadData() once, when the dashboard first mounts.",
      "Render FinancialMetrics and InventoryTable — neither needs any props.",
      "Render ProcurementPanel and SalesFulfillmentBoard, wired to shared state and loadData.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 14",
    paal: `Create the file at \`src/components/FinancialMetrics.tsx\`.

Nothing can go inside a file that doesn't exist yet — this is the very first, purely mechanical step: get the file created at the right path. This step only checks that the file exists; whatever you've written into it since (even finished work from later steps) is completely fine and expected — checking this step never requires the file to be empty.

WHAT YOU NEED
- A file at exactly this path: src/components/FinancialMetrics.tsx.

Your task: create the file at src/components/FinancialMetrics.tsx. That's the whole requirement — the type, component, and everything else come in the steps after this one.`,
    hint: `1. Use the + in FILES (or your file tree) to add a new file.
2. Path: src/components/FinancialMetrics.tsx — must match exactly.
3. This step only checks that the file exists — keep writing the rest as you work through later steps, it won't fail this check.`,
    example_code: `// src/components/EarningsCard.tsx
// (empty — just created)`,
    think_prompt: `Nothing can be defined inside a file that doesn't exist yet. What's the very first, purely mechanical thing this task needs, before any TypeScript or React code at all?`,
    mc_options: [
      "Create the empty file at src/components/FinancialMetrics.tsx",
      "Start by writing the Financials type directly in App.tsx",
      "Skip creating the file — the editor creates it automatically the first time you save",
    ],
    mc_correct_option: "Create the empty file at src/components/FinancialMetrics.tsx",
    mc_anchor: "Create the empty file at src/components",
    why_this_matters: `Every later step in this task assumes this file already exists — skip this and the next step has nowhere to write the type.`,
    answer_keywords: [],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the file exists, ready for the type in the next step.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Create the file at the exact path: src/components/FinancialMetrics.tsx.",
    pre_check_hint: `This step only checks that the file exists at the right path — nothing else. If you've already written more into it (the type, the component, state, and so on from later steps), that's expected and won't fail this check.`,
    expected: ``,
    analog_example: `// src/components/EarningsCard.tsx
// (empty — just created)`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Every later step in this task assumes this file already exists — skip this and the next step has nowhere to write the type.`,
      pain: "Trying to define a type or component in a file that was never created just means your edits go nowhere.",
      mentalModel: MENTAL_MODEL,
      discover: `// src/components/FinancialMetrics.tsx (just created)`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "This step only checks the file exists — it's fine (expected, even) if later-step code is already in it.",
      dryRun: "Create the same kind of starter file for a different real component.",
      build: `File created at src/components/FinancialMetrics.tsx.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 14",
    paal: `Define the Financials type.

You already created the file in Step 1. Now write a TypeScript type naming every field the real income-statement endpoint sends back.

WHAT YOUR BLUEPRINT NEEDS
- revenue (text — the API sends an already-formatted 2-decimal string, e.g. "125.00")
- cogs (text)
- netIncome (text)

Your task: in the file from Step 1, write \`type Financials\` with those three fields. Nothing else yet — the component itself comes in the next step.`,
    hint: `1. The file already exists from Step 1 — just open it.
2. Match the real shape: GET /api/reports/income-statement returns { revenue, cogs, netIncome } as strings like "125.00", not numbers.
3. Write only the type — no component yet.`,
    example_code: `export type DriverEarnings = {
  fares: string;
  expenses: string;
  takeHome: string;
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
    pre_check_hint: `The file already exists from Step 1. The type itself just needs to match what the real endpoint actually sends: three already-formatted money strings, not numbers.`,
    expected: `export type Financials = {
  revenue: string;
  cogs: string;
  netIncome: string;
};
`,
    analog_example: `export type DriverEarnings = {
  fares: string;
  expenses: string;
  takeHome: string;
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
    id: "step3",
    type: "question",
    phase: "Step 3 of 14",
    paal: `Export the empty FinancialMetrics component shell.

Add the component itself — no data, no fetch, just a function that returns something on screen.

WHAT YOUR CODE NEEDS
- An exported function named FinancialMetrics.
- A return value of <div /> for now.

Your task: export function FinancialMetrics() { return <div />; } below the type from the previous step.`,
    hint: `1. Export a function: export function FinancialMetrics() { ... }
2. Return the shell: return <div />;`,
    example_code: `export function EarningsCard() {
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
    analog_example: `export function EarningsCard() {
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
    id: "step4",
    type: "question",
    phase: "Step 4 of 14",
    paal: `Add state to hold the fetched financials, defaulting to real zeros.

The Financials type already exists — you defined it in Step 2. This step just uses it: give the component somewhere to hold the financials once they arrive, defaulting to real zero-strings, not nothing.

WHAT YOUR LOGIC NEEDS
- Import useState: import { useState } from "react";
- The Financials type from Step 2 — nothing new to define here.
- useState<Financials>, defaulting to { revenue: "0.00", cogs: "0.00", netIncome: "0.00" }.

Your task: import useState from "react", then add const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" }); inside the component, right after FinancialMetrics() opens. No fetch yet.`,
    hint: `1. Import useState: import { useState } from "react";
2. The Financials type is already there from Step 2 — nothing new to define.
3. Declare state: const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" });
4. Place it inside FinancialMetrics(), before the return.`,
    example_code: `import { useState } from "react";

export function EarningsCard() {
  const [earnings, setEarnings] = useState<DriverEarnings>({ fares: "0.00", expenses: "0.00", takeHome: "0.00" });
  return <div />;
}`,
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
    pre_check_hint: `The Financials type already exists from Step 2 — this step only adds state that uses it.

- Import the useState hook from React.
- Create a state variable for financials, typed with Financials, defaulting to zero-strings for every field.

useState needs a starting value even before real data exists — real zero-strings, not undefined, keep the first render honest.`,
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
    analog_example: `import { useState } from "react";

export function EarningsCard() {
  const [earnings, setEarnings] = useState<DriverEarnings>({ fares: "0.00", expenses: "0.00", takeHome: "0.00" });
  return <div />;
}`,
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
    id: "step5",
    type: "question",
    phase: "Step 5 of 14",
    paal: `Fetch the real income statement on mount and store it in state.

Fetch the real endpoint exactly once, when the component first appears, and hand the response straight to your state setter.

WHAT YOUR LOGIC NEEDS
- Add useEffect to your React import: import { useState, useEffect } from "react";
- useEffect with an empty dependency array ([]).
- fetch("/api/reports/income-statement") inside it.
- The parsed JSON body passed straight into setFinancials.

Your task: add useEffect to your existing React import, then wrap a fetch to /api/reports/income-statement in useEffect(() => {...}, []), calling setFinancials with the parsed response.`,
    hint: `1. Import useEffect: import { useState, useEffect } from "react";
2. Add the effect: useEffect(() => { ... }, []);
3. Fetch and store: fetch("/api/reports/income-statement").then((res) => res.json()).then(setFinancials);`,
    example_code: `import { useState, useEffect } from "react";

export function EarningsCard() {
  const [earnings, setEarnings] = useState<DriverEarnings>({ fares: "0.00", expenses: "0.00", takeHome: "0.00" });

  useEffect(() => {
    fetch("/api/driver/earnings")
      .then((res) => res.json())
      .then(setEarnings);
  }, []);

  return <div />;
}`,
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
    pre_check_hint: `Add useEffect to your existing React import first.

- Import the useEffect hook alongside useState.
- Inside a useEffect that runs once, on mount, fetch the real income-statement endpoint.
- Pass the parsed response straight into your state setter.

fetch() returns a Promise — the real response only exists inside .then(). A useEffect with an empty array makes that run exactly once, right when the component first appears.`,
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
    analog_example: `import { useState, useEffect } from "react";

export function EarningsCard() {
  const [earnings, setEarnings] = useState<DriverEarnings>({ fares: "0.00", expenses: "0.00", takeHome: "0.00" });

  useEffect(() => {
    fetch("/api/driver/earnings")
      .then((res) => res.json())
      .then(setEarnings);
  }, []);

  return <div />;
}`,
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
    id: "step6",
    type: "question",
    phase: "Step 6 of 14",
    paal: `Render the three financial cards from state.

Draw the three cards — Revenue, COGS, Net Income — reading their values straight from state.

WHAT YOUR LOGIC NEEDS
- Three simple elements, each showing a label and \${financials.<field>}.

Your task: replace <div /> with a layout showing all three fields from financials, each with a $ prefix.`,
    hint: `1. Wrap in a container: <div className="grid grid-cols-3 gap-4"> ... </div>
2. One card per field: <div>Revenue: \${financials.revenue}</div>, and the same for cogs and netIncome.`,
    example_code: `return (
  <div className="grid grid-cols-3 gap-4">
    <div className="p-4 bg-white rounded shadow">Fares: \${earnings.fares}</div>
    <div className="p-4 bg-white rounded shadow">Expenses: \${earnings.expenses}</div>
    <div className="p-4 bg-white rounded shadow">Take Home: \${earnings.takeHome}</div>
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
    <div className="p-4 bg-white rounded shadow">Fares: \${earnings.fares}</div>
    <div className="p-4 bg-white rounded shadow">Expenses: \${earnings.expenses}</div>
    <div className="p-4 bg-white rounded shadow">Take Home: \${earnings.takeHome}</div>
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
    id: "step7",
    type: "question",
    phase: "Step 7 of 14",
    paal: `Create the file at \`src/App.tsx\`.

This step edits a different file from everything so far — before declaring any state, the file itself has to exist. This step only checks that the file exists; whatever you write into it afterward (this step or later ones) is completely fine.

WHAT YOU NEED
- A file at exactly this path: src/App.tsx.

Your task: create the file at src/App.tsx. That's the whole requirement — the state arrays and everything else come in the steps after this one.`,
    hint: `1. Use the + in FILES (or your file tree) to add a new file.
2. Path: src/App.tsx — must match exactly, at the project root (not inside src/components).
3. This step only checks that the file exists — keep writing the rest as you work through later steps.`,
    example_code: `// src/App.tsx
// (just created)`,
    think_prompt: `Nothing can be defined inside a file that doesn't exist yet. What's the very first, purely mechanical thing this step needs, before any state or imports at all?`,
    mc_options: [
      "Create the empty file at src/App.tsx",
      "Start by declaring the state arrays directly in FinancialMetrics.tsx",
      "Skip creating the file — the editor creates it automatically the first time you save",
    ],
    mc_correct_option: "Create the empty file at src/App.tsx",
    mc_anchor: "Create the empty file at src/App.tsx",
    why_this_matters: `Every later step in this task assumes this file already exists — skip this and the next step has nowhere to write the state arrays.`,
    answer_keywords: [],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the file exists now, ready for the state arrays in the next step.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Create the file at the exact path: src/App.tsx.",
    pre_check_hint: `This step only checks that the file exists at the right path — nothing else. Whatever you've already written into it (this step or later ones) won't fail this check.`,
    expected: ``,
    analog_example: `// src/App.tsx
// (just created)`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Every later step in this task assumes this file already exists — skip this and the next step has nowhere to write the state arrays.`,
      pain: "Trying to declare state in a file that was never created just means your edits go nowhere.",
      mentalModel: MENTAL_MODEL,
      discover: `// src/App.tsx (just created)`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "This step only checks the file exists — it's fine if later-step code is already in it.",
      dryRun: "Create the same kind of starter file for a different real component.",
      build: `File created at src/App.tsx.`,
    },
  },
  {
    id: "step8",
    type: "question",
    phase: "Step 8 of 14",
    paal: `Declare the \`items\` state array in App.tsx.

You already created App.tsx in Step 7. This is the first of three shared state arrays every panel on the dashboard will read from — one array, one step at a time.

Reminder: this step imports the Item type from InventoryTable.tsx — built in a separate task, idt-erp-inventory-table. If that task isn't done yet, this import has nothing to point at.

WHAT YOUR LOGIC NEEDS
- Import useState: import { useState } from "react"; — App.tsx is a new file, it doesn't inherit FinancialMetrics.tsx's import.
- Import the Item type from InventoryTable.
- One useState array: items, defaulting to an empty array — type Item[].

Your task: in App.tsx (from Step 7), import useState and the Item type, then declare items as a useState<Item[]>([]) array. purchaseOrders and salesOrders come in the next two steps.`,
    hint: `1. The file already exists from Step 7 — just open it.
2. Import useState: import { useState } from "react";
3. Import the type: import { type Item } from "./components/InventoryTable";
4. Declare: const [items, setItems] = useState<Item[]>([]);`,
    example_code: `import { useState } from "react";

export default function BlogAdminApp() {
  const [posts, setPosts] = useState<Post[]>([]);
  return <main />;
}`,
    think_prompt: `Every child panel on this dashboard needs to read from the SAME live data — that means one shared owner, not three separate copies. What's the first of those three shared lists, and what should it start as?`,
    mc_options: [
      "const [items, setItems] = useState<Item[]>([]) in App.tsx",
      "let each child component declare its own local items array",
      "one big useState holding all three lists nested in one object",
    ],
    mc_correct_option: "const [items, setItems] = useState<Item[]>([]) in App.tsx",
    mc_anchor: "const [items, setItems] = useState<Item[]>([]) in App",
    why_this_matters: `Declaring this list once, in the parent, is what makes it possible for every panel to see the same real inventory data.`,
    answer_keywords: ["items", "useState", "Item"],
    seed_code: ``,
    starter_code: `import { useState } from "react";

export default function App() {
  // items state goes here
  return <main />;
}
`,
    feedback_correct: "Correct — the first shared list exists now.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Just the items array for now — purchaseOrders and salesOrders come in the next two steps.",
    pre_check_hint: `The file already exists from Step 7 — App.tsx needs its own useState import, separate from FinancialMetrics.tsx's. The Item type comes from a separate task (idt-erp-inventory-table) — if that one isn't done yet, this import has nothing to point at.

- Import the useState hook from React.
- Import the Item type from the InventoryTable component.
- Create a state variable for items, typed as an array of Item, starting empty.

purchaseOrders and salesOrders come in the next two steps.`,
    expected: `import { useState } from "react";
import { type Item } from "./components/InventoryTable";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  return <main />;
}
`,
    analog_example: `import { useState } from "react";

export default function BlogAdminApp() {
  const [posts, setPosts] = useState<Post[]>([]);
  return <main />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Declaring this list once, in the parent, is what makes it possible for every panel to see the same real inventory data.`,
      pain: "Letting each child component own its own copy means an action in one panel never shows up in another.",
      mentalModel: MENTAL_MODEL,
      discover: `const [items, setItems] = useState<Item[]>([]);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not add purchaseOrders or salesOrders yet — this step is just the items array.",
      dryRun: "Declare the same shared-state pattern for a different real list.",
      build: `useState<Item[]>([]) declared as items in App.tsx.`,
    },
  },
  {
    id: "step9",
    type: "question",
    phase: "Step 9 of 14",
    paal: `Declare the \`purchaseOrders\` state array in App.tsx.

The items array already exists from Step 8. Add the second of the three shared arrays the same way, right alongside it.

Reminder: this step imports the PurchaseOrder type from ProcurementPanel.tsx — built in a separate task, idt-erp-po-form. If that task isn't done yet, this import has nothing to point at.

WHAT YOUR LOGIC NEEDS
- Import the PurchaseOrder type from ProcurementPanel.
- One useState array: purchaseOrders, defaulting to an empty array — type PurchaseOrder[].

Your task: import the PurchaseOrder type, then declare purchaseOrders as a useState<PurchaseOrder[]>([]) array, alongside items. salesOrders comes in the next step.`,
    hint: `1. items is already declared from Step 8 — just add to the same file.
2. Import the type: import { type PurchaseOrder } from "./components/ProcurementPanel";
3. Declare: const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);`,
    example_code: `import { useState } from "react";

export default function BlogAdminApp() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  return <main />;
}`,
    think_prompt: `The pattern is identical to the last step — just a different type, for a different real endpoint's list. What changes, and what stays exactly the same?`,
    mc_options: [
      "const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]) in App.tsx",
      "reuse the items state to hold purchase orders too",
      "declare purchaseOrders inside ProcurementPanel instead of App.tsx",
    ],
    mc_correct_option: "const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]) in App.tsx",
    mc_anchor: "const [purchaseOrders, setPurchaseOrders] = useState<Pur",
    why_this_matters: `Declaring purchaseOrders here too keeps every shared list in the same one place, not scattered across whichever component happens to need it first.`,
    answer_keywords: ["purchaseOrders", "useState", "PurchaseOrder"],
    seed_code: `import { useState } from "react";
import { type Item } from "./components/InventoryTable";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  return <main />;
}
`,
    starter_code: `import { useState } from "react";
import { type Item } from "./components/InventoryTable";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  // purchaseOrders state goes here
  return <main />;
}
`,
    feedback_correct: "Correct — two of the three shared lists exist now.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Just add the purchaseOrders array this step — salesOrders comes next.",
    pre_check_hint: `items is already declared from Step 8 — add purchaseOrders the same way, in the same file. The PurchaseOrder type comes from a separate task (idt-erp-po-form) — if that one isn't done yet, this import has nothing to point at.

- Import the PurchaseOrder type from the ProcurementPanel component.
- Create a state variable for purchaseOrders, typed as an array of PurchaseOrder, starting empty.

salesOrders comes in the next step.`,
    expected: `import { useState } from "react";
import { type Item } from "./components/InventoryTable";
import { type PurchaseOrder } from "./components/ProcurementPanel";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  return <main />;
}
`,
    analog_example: `import { useState } from "react";

export default function BlogAdminApp() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  return <main />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Declaring purchaseOrders here too keeps every shared list in the same one place, not scattered across whichever component happens to need it first.`,
      pain: "Letting each child component own its own copy means an action in one panel never shows up in another.",
      mentalModel: MENTAL_MODEL,
      discover: `const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not add salesOrders yet — this step is just the purchaseOrders array.",
      dryRun: "Declare the same shared-state pattern for a different real list.",
      build: `useState<PurchaseOrder[]>([]) declared as purchaseOrders in App.tsx.`,
    },
  },
  {
    id: "step10",
    type: "question",
    phase: "Step 10 of 14",
    paal: `Declare the \`salesOrders\` state array in App.tsx.

items and purchaseOrders already exist from Steps 8 and 9. This is the third and last of the shared arrays.

Reminder: this step imports the SalesOrder type from SalesFulfillmentBoard.tsx — built in a separate task, idt-erp-so-pipeline. If that task isn't done yet, this import has nothing to point at.

WHAT YOUR LOGIC NEEDS
- Import the SalesOrder type from SalesFulfillmentBoard.
- One useState array: salesOrders, defaulting to an empty array — type SalesOrder[].

Your task: import the SalesOrder type, then declare salesOrders as a useState<SalesOrder[]>([]) array, alongside items and purchaseOrders. No fetching yet — that's the next step.`,
    hint: `1. items and purchaseOrders are already declared from Steps 8 and 9 — just add to the same file.
2. Import the type: import { type SalesOrder } from "./components/SalesFulfillmentBoard";
3. Declare: const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);`,
    example_code: `import { useState } from "react";

export default function BlogAdminApp() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  return <main />;
}`,
    think_prompt: `Same pattern a third time. What's the last of the three shared lists, and what should it start as?`,
    mc_options: [
      "const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]) in App.tsx",
      "reuse purchaseOrders to hold sales orders too",
      "declare salesOrders inside SalesFulfillmentBoard instead of App.tsx",
    ],
    mc_correct_option: "const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]) in App.tsx",
    mc_anchor: "const [salesOrders, setSalesOrders] = useState<SalesOr",
    why_this_matters: `All three lists now live in one shared place — every panel that reads or updates them sees the same real data.`,
    answer_keywords: ["salesOrders", "useState", "SalesOrder"],
    seed_code: `import { useState } from "react";
import { type Item } from "./components/InventoryTable";
import { type PurchaseOrder } from "./components/ProcurementPanel";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  return <main />;
}
`,
    starter_code: `import { useState } from "react";
import { type Item } from "./components/InventoryTable";
import { type PurchaseOrder } from "./components/ProcurementPanel";

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  // salesOrders state goes here
  return <main />;
}
`,
    feedback_correct: "Correct — all three shared lists exist now.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Just add the salesOrders array this step — no fetching yet.",
    pre_check_hint: `items and purchaseOrders are already declared from Steps 8 and 9 — add salesOrders the same way, in the same file. The SalesOrder type comes from a separate task (idt-erp-so-pipeline) — if that one isn't done yet, this import has nothing to point at.

- Import the SalesOrder type from the SalesFulfillmentBoard component.
- Create a state variable for salesOrders, typed as an array of SalesOrder, starting empty.

The fetch that fills all three comes in the next step.`,
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
    analog_example: `import { useState } from "react";

export default function BlogAdminApp() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  return <main />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `All three lists now live in one shared place — every panel that reads or updates them sees the same real data.`,
      pain: "Letting each child component own its own copy means an action in one panel never shows up in another.",
      mentalModel: MENTAL_MODEL,
      discover: `const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not add a fetch yet — this step is just the salesOrders array.",
      dryRun: "Declare the same shared-state pattern for a different real list.",
      build: `useState<SalesOrder[]>([]) declared as salesOrders in App.tsx.`,
    },
  },
  {
    id: "step11",
    type: "question",
    phase: "Step 11 of 14",
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
    example_code: `const loadBlogData = async () => {
  const [p, c, s] = await Promise.all([
    fetch("/api/posts").then((r) => r.json()),
    fetch("/api/comments").then((r) => r.json()),
    fetch("/api/subscribers").then((r) => r.json()),
  ]);
  setPosts(p);
  setComments(c);
  setSubscribers(s);
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
    pre_check_hint: `Promise.all lets three independent fetches run at once instead of one after another — the results come back in the same order you passed the fetches in.

- Declare an async function called loadData.
- Inside it, use Promise.all to fetch all three real endpoints (items, purchase orders, sales orders) at the same time.
- Pass each result to its matching state setter.

Don't call loadData() anywhere yet — that's the next step.`,
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
    analog_example: `const loadBlogData = async () => {
  const [p, c, s] = await Promise.all([
    fetch("/api/posts").then((r) => r.json()),
    fetch("/api/comments").then((r) => r.json()),
    fetch("/api/subscribers").then((r) => r.json()),
  ]);
  setPosts(p);
  setComments(c);
  setSubscribers(s);
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
    id: "step12",
    type: "question",
    phase: "Step 12 of 14",
    paal: `Call loadData() once, when the dashboard first mounts.

Run the function you just wrote exactly once, right when the page first appears.

WHAT YOUR LOGIC NEEDS
- Add useEffect to your React import: import { useState, useEffect } from "react";
- useEffect with an empty dependency array ([]) calling loadData().

Your task: add useEffect to your existing React import, then add useEffect(() => { loadData(); }, []); right after loadData is defined.`,
    hint: `1. Import useEffect: import { useState, useEffect } from "react";
2. Add the effect: useEffect(() => { loadData(); }, []);
3. Place it directly after the loadData function.`,
    example_code: `import { useState, useEffect } from "react";

export default function BlogAdminApp() {
  // ...loadBlogData is already defined above this...

  useEffect(() => {
    loadBlogData();
  }, []);

  return <main />;
}`,
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
    pre_check_hint: `Add useEffect to the existing React import in App.tsx first. A useEffect with an empty dependency array is what runs something exactly once, right after the first render.`,
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
    analog_example: `import { useState, useEffect } from "react";

export default function BlogAdminApp() {
  // ...loadBlogData is already defined above this...

  useEffect(() => {
    loadBlogData();
  }, []);

  return <main />;
}`,
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
    id: "step13",
    type: "question",
    phase: "Step 13 of 14",
    paal: `Render FinancialMetrics and InventoryTable — neither needs any props.

Import both components and place them inside <main>. Both fetch their own data independently, so neither needs anything passed in.

WHAT YOUR LOGIC NEEDS
- Import FinancialMetrics and InventoryTable.
- <FinancialMetrics /> and <InventoryTable /> rendered inside <main>, no props on either.

Your task: import both components and render them, in that order, inside <main>. The procurement and sales panels come in the next step.`,
    hint: `1. Import: import { FinancialMetrics } from "./components/FinancialMetrics"; import { InventoryTable } from "./components/InventoryTable";
2. Render: <main><FinancialMetrics /><InventoryTable /></main>`,
    example_code: `import { BlogMetrics } from "./components/BlogMetrics";
import { PostList } from "./components/PostList";

return (
  <main>
    <BlogMetrics />
    <PostList />
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
    analog_example: `import { BlogMetrics } from "./components/BlogMetrics";
import { PostList } from "./components/PostList";

return (
  <main>
    <BlogMetrics />
    <PostList />
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
    id: "step14",
    type: "question",
    phase: "Step 14 of 14",
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
    example_code: `import { CommentModeration } from "./components/CommentModeration";
import { SubscriberOutreach } from "./components/SubscriberOutreach";

<div className="grid grid-cols-2 gap-6">
  <CommentModeration comments={comments} onApprove={loadBlogData} />
  <SubscriberOutreach subscribers={subscribers} onWelcome={loadBlogData} />
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
    analog_example: `import { CommentModeration } from "./components/CommentModeration";
import { SubscriberOutreach } from "./components/SubscriberOutreach";

<div className="grid grid-cols-2 gap-6">
  <CommentModeration comments={comments} onApprove={loadBlogData} />
  <SubscriberOutreach subscribers={subscribers} onWelcome={loadBlogData} />
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
  { label: "Step 11", id: "step11" },
  { label: "Step 12", id: "step12" },
  { label: "Step 13", id: "step13" },
  { label: "Step 14", id: "step14" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Financial metrics + dashboard assembly",
  shortName: "Reports + assembly",
});
