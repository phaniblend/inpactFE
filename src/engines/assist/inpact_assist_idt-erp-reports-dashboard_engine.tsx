import createINPACTEngine from "../inpact_engine_shared";

const MENTAL_MODEL = `Build the whole real MiniERP frontend, in dependency order, against the real backend:

  Inventory   ->  InventoryTable.tsx    -- real items from GET /api/items, REORDER/HEALTHY badge
  Procurement ->  ProcurementPanel.tsx  -- real purchase orders + a Receive Goods action
  Sales       ->  SalesFulfillmentBoard.tsx -- real sales orders + a Fulfill & Ship action
  Financials  ->  FinancialMetrics.tsx  -- Revenue, COGS, Net Income from GET /api/reports/income-statement
  Assemble    ->  App.tsx owns items/purchaseOrders/salesOrders, one loadData() call, wires every panel together
`;

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-erp-reports-dashboard",
      title: "MiniERP: inventory, procurement, sales & financial dashboard",
      body: MENTAL_MODEL,
      usecase: "The real MiniERP backend (ledger, item valuation, procure-to-pay, order-to-cash) is already running — this task builds the entire frontend against it: the inventory table, the procurement panel, the sales fulfillment board, the financial metrics cards, and the App.tsx that assembles all four into one live, self-updating dashboard.",
      designMock: {"kind":"list-and-form","screenTitle":"MiniERP Command Center","caption":"This is the screen you are building — real financial cards on top, real inventory/procurement/sales panels below, all sharing one live data source.","listCaption":"CARDS — real figures from the ledger","emptyCaption":"EMPTY — before the first fetch resolves","emptyMessage":"Loading…","rows":[{"title":"Revenue","subtitle":"$125.00","meta":""},{"title":"Net Income","subtitle":"$85.00","meta":""}],"fields":[{"label":"Status","options":["All"]}],"formMode":"filter","submitLabel":"Refresh"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Create the component file, define type Item matching the real API's response shape, and export the empty shell.",
      "Fetch the real item catalog on mount and hold it in state, with a loading message while the request is in flight.",
      "Render the fetched items as a real table — one row per item, correct columns.",
      "Add a REORDER/HEALTHY badge column derived from each item's own stockOnHand vs reorderPoint.",
      "Create the component file, define the props shape (orders + onReceive), and export the empty shell.",
      "Render the list of purchase orders — number, total, and status.",
      "Add a Receive Goods button on any order that isn't RECEIVED yet, wired to the real receive endpoint.",
      "Handle the response — success reloads the parent's data, failure (already received) shows the real error.",
      "Create the component file, define the props shape (orders + onFulfill), and export the empty shell.",
      "Render the list of sales orders — number, customer's total, and status.",
      "Add a Fulfill & Ship button on CONFIRMED orders, wired to the real fulfillment endpoint.",
      "Handle the response — success reloads the parent's data, a real 409 (insufficient stock) is shown, not swallowed.",
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
    phase: "Step 1 of 26",
    file: "src/components/InventoryTable.tsx",
    paal: `Create the component file at src/components/InventoryTable.tsx, define type Item, and export the InventoryTable component.

Create src/components/InventoryTable.tsx, declare the Item type matching what the real API actually returns, and export an empty InventoryTable component.

WHAT YOUR BLUEPRINT NEEDS
- id (text)
- sku (text)
- name (text)
- costPrice (number)
- sellingPrice (number)
- stockOnHand (number)
- reorderPoint (number)

Your task: write \`type Item\` with all seven fields, then define and export InventoryTable as a function component returning <div /> — every step from here on edits this same file.`,
    hint: `1. Create the file: Add a new file at src/components/InventoryTable.tsx.
2. Mirror the declaration: match the real API's shape exactly — GET /api/items returns costPrice and sellingPrice as numbers, not strings.
3. Component shell: Declare export function InventoryTable() { return <div />; }.`,
    example_code: `// src/components/StockCatalog.tsx
export type StockItem = {
  id: string;
  sku: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stockOnHand: number;
  reorderPoint: number;
};

export function StockCatalog() {
  return <div />;
}`,
    think_prompt: `A type is only honest if it matches what the real endpoint actually sends back — not a guess. The real /api/items response includes both prices as plain numbers and a reorderPoint you'll need later for the badge, even though the mock only shows some of these on screen. What does the blueprint need to name?`,
    mc_options: [
      "Define type Item (id, sku, name, costPrice, sellingPrice, stockOnHand, reorderPoint), then export function InventoryTable() returning <div />",
      "Make every field a string since the API is JSON",
      "Wait until the table is built before deciding the type",
    ],
    mc_correct_option: "Define type Item (id, sku, name, costPrice, sellingPrice, stockOnHand, reorderPoint), then export function InventoryTable() returning <div />",
    mc_anchor: "Define type Item (id, sku, name, costPric",
    why_this_matters: `A blueprint that matches the real API's actual shape is what lets your editor catch a typo'd field name before you ever run the code.`,
    answer_keywords: ["export", "type", "Item", "sku", "costPrice", "sellingPrice", "stockOnHand", "reorderPoint", "export", "function", "InventoryTable"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the blueprint matches the real API, and the component shell exists.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Match the type to what GET /api/items actually returns, then add the empty component shell.",
    pre_check_hint: `Every row in the inventory table describes the same kind of thing — an item — so before writing any table code, standardize what one item looks like as a type.

Picture two real rows the warehouse tracks:
- Levi's 501 Blue Jeans – 32x32 — code JEAN-501-BLU-3232, costs $18.00, sells for $25.00, 25 on the shelf, reorder once it drops to 10.
- Levi's 501 Blue Jeans – 34x32 — code JEAN-501-BLU-3432, costs $18.00, sells for $25.00, 18 on the shelf, reorder once it drops to 10.

Every item needs a property for each of these real facts:
- a unique identifier, so any one item can always be picked out from the rest
- a stock-keeping code like the one above, that uniquely tags this exact product and size
- a human-readable name a person would actually recognize
- what it costs you to acquire one unit
- what you sell one unit for
- how many units are sitting on the shelf right now
- the threshold at which it needs reordering

Name each fact as its own property, in the camelCase style real JavaScript APIs use, and give each the kind it actually is — money and counts are numbers, everything else is text.`,
    expected: `export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stockOnHand: number;
  reorderPoint: number;
};

export function InventoryTable() {
  return <div />;
}
`,
    analog_example: `export type Vehicle = {
  id: string;
  plateNumber: string;
  make: string;
  dailyRate: number;
  weeklyRate: number;
  milesOnRoad: number;
  serviceDueAt: number;
};

export function VehicleRoster() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A blueprint that matches the real API's actual shape is what lets your editor catch a typo'd field name before you ever run the code.`,
      pain: "A type that guesses wrong about the real response shape produces confusing runtime bugs TypeScript should have caught.",
      mentalModel: MENTAL_MODEL,
      discover: `export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stockOnHand: number;
  reorderPoint: number;
};

export function InventoryTable() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not guess a field's type — check what the real endpoint actually returns.",
      dryRun: "Write the same step for a different real endpoint you haven't used before.",
      build: `1. Create the file.\n2. Match the type to the real API shape.\n3. Export the empty shell.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 26",
    file: "src/components/InventoryTable.tsx",
    paal: `Fetch the real item catalog on mount and hold it in state, with a loading message while the request is in flight.

Set up state for the items array and a loading flag, fetch from the real API inside useEffect, and show a loading message until the first response arrives.

WHAT YOUR LOGIC NEEDS
- useState<Item[]>([]) for the fetched items.
- useState(true) for a loading flag, set to false once the fetch resolves.
- useEffect with an empty dependency array running the fetch exactly once, on mount.
- A relative fetch("/api/items") call — same origin as the app, no hardcoded host.

Your task: fetch("/api/items") inside useEffect, store the response in items, set loading to false when it resolves, and render "Loading…" while loading is true.`,
    hint: `1. Declare state: const [items, setItems] = useState<Item[]>([]); const [loading, setLoading] = useState(true);
2. Fetch on mount: useEffect(() => { fetch("/api/items").then((r) => r.json()).then((data) => { setItems(data); setLoading(false); }); }, []);
3. Render loading: return loading ? <p>Loading…</p> : <div />; for now.`,
    example_code: `const [items, setItems] = useState<StockItem[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/items")
    .then((res) => res.json())
    .then((data) => {
      setItems(data);
      setLoading(false);
    });
}, []);`,
    think_prompt: `fetch() returns a Promise, not the data itself — the real response only exists inside .then(). A useEffect with an empty dependency array runs exactly once, right when the component first appears. Right after mount, items is empty for the exact same reason it would be empty if the API genuinely had no items — what tells those two situations apart until the real data arrives?`,
    mc_options: [
      "a loading flag, true until the fetch resolves, checked before deciding what to render",
      "assume items.length === 0 always means no data yet",
      "call fetch directly inside the JSX return",
    ],
    mc_correct_option: "a loading flag, true until the fetch resolves, checked before deciding what to render",
    mc_anchor: "a loading flag, true until the fetch res",
    why_this_matters: `Running fetch inside useEffect with a loading flag means the request fires exactly once, and users see an honest "still loading" instead of a false "empty" for a moment.`,
    answer_keywords: ["useState", "loading", "useEffect", "fetch", "items", "setItems", "setLoading"],
    seed_code: `export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stockOnHand: number;
  reorderPoint: number;
};

export function InventoryTable() {
  return <div />;
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stockOnHand: number;
  reorderPoint: number;
};

export function InventoryTable() {
  // items + loading state, and the fetch, go here
  return <div />;
}
`,
    feedback_correct: "Correct — real data now flows into state on mount, with an honest loading state.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "fetch has to run inside useEffect([]), and its result only exists inside .then() — set loading false there too.",
    pre_check_hint: `fetch() returns a Promise; the real response only exists inside .then() (or after an await). A useEffect with an empty array makes that chain run exactly once, right when the component first appears.

- Fetch from the real endpoint: \`/api/items\`.
- Once that response resolves, hand it straight to your \`items\` state setter.
- Then flip your loading flag to false, now that the real data has arrived.

Until that response comes back, the loading flag stays true — that's what tells a catalog that's genuinely still loading apart from one that's genuinely empty.`,
    expected: `import { useState, useEffect } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stockOnHand: number;
  reorderPoint: number;
};

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  return loading ? <p>Loading…</p> : <div />;
}
`,
    analog_example: `const [vehicles, setVehicles] = useState<Vehicle[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/vehicles")
    .then((res) => res.json())
    .then((data) => {
      setVehicles(data);
      setLoading(false);
    });
}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Running fetch inside useEffect with a loading flag means the request fires exactly once, and users see an honest "still loading" instead of a false "empty" for a moment.`,
      pain: "Without a loading flag, a genuinely empty catalog and a catalog that just hasn't loaded yet look identical to the user.",
      mentalModel: MENTAL_MODEL,
      discover: `useEffect(() => {
  fetch("/api/items")
    .then((res) => res.json())
    .then((data) => {
      setItems(data);
      setLoading(false);
    });
}, []);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not call fetch() directly inside the component body (outside useEffect) — that refetches on every render.",
      dryRun: "Write the same fetch-on-mount step for a different real endpoint on this same backend.",
      build: `useState<Item[]>([]) + useState(true) for loading, then fetch("/api/items") inside useEffect([]).`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 26",
    file: "src/components/InventoryTable.tsx",
    paal: `Render the fetched items as a real table — one row per item, correct columns.

Once loading is false, draw an actual HTML table with one row per fetched item, or a message when the catalog is genuinely empty.

WHAT YOUR LOGIC NEEDS
- A check for items.length === 0 (after loading finishes) rendering "No items found."
- A real <table> with a <thead> row (SKU, Name, Cost, Price, Stock) and a <tbody> row per item.
- Formatted currency for costPrice/sellingPrice (toFixed(2)).

Your task: after the loading branch, check items.length === 0 for "No items found.", otherwise render a table with one row per item showing sku, name, costPrice, sellingPrice, and stockOnHand.`,
    hint: `1. Empty check: items.length === 0 ? <p>No items found.</p> : (...)
2. Table head: <thead><tr><th>SKU</th><th>Name</th><th>Cost (MAC)</th><th>Price</th><th>Stock</th></tr></thead>
3. Table body: items.map((i) => <tr key={i.id}><td>{i.sku}</td>...</tr>), formatting prices with .toFixed(2).`,
    example_code: `if (items.length === 0) return <p>No items found.</p>;

return (
  <table>
    <thead>
      <tr><th>SKU</th><th>Name</th><th>Cost</th><th>Stock</th></tr>
    </thead>
    <tbody>
      {items.map((i) => (
        <tr key={i.id}>
          <td>{i.sku}</td>
          <td>{i.name}</td>
          <td>\${i.costPrice.toFixed(2)}</td>
          <td>{i.stockOnHand}</td>
        </tr>
      ))}
    </tbody>
  </table>
);`,
    think_prompt: `A real table needs a header row naming each column and a body row per record — the exact same list-and-empty-state pattern as any other list, just drawn as <table>/<thead>/<tbody> instead of <ul>/<li>. What goes in each column, and what's the key for each row?`,
    mc_options: [
      "a real <table> with header cells naming each column and one <tr> per item, keyed by item.id",
      "one giant string built with string concatenation and dangerouslySetInnerHTML",
      "render items directly as raw JSON text",
    ],
    mc_correct_option: "a real <table> with header cells naming each column and one <tr> per item, keyed by item.id",
    mc_anchor: "a real <table> with header cells naming",
    why_this_matters: `A real semantic table (not a styled <div> grid) is what screen readers and browser table features actually understand.`,
    answer_keywords: ["table", "thead", "tbody", "map", "key", "toFixed"],
    seed_code: `import { useState, useEffect } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stockOnHand: number;
  reorderPoint: number;
};

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  return loading ? <p>Loading…</p> : <div />;
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stockOnHand: number;
  reorderPoint: number;
};

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  // empty check + table go here
  return <div />;
}
`,
    feedback_correct: "Correct — real rows, real columns, one per fetched item.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Check items.length === 0 first, then draw a real <table> with one <tr> per item.",
    pre_check_hint: `Once loading is done, this is the same list-render pattern you've used before — check length for the empty case, then .map() into table rows instead of list items.`,
    expected: `import { useState, useEffect } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stockOnHand: number;
  reorderPoint: number;
};

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (items.length === 0) return <p>No items found.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Cost (MAC)</th>
          <th>Price</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        {items.map((i) => (
          <tr key={i.id}>
            <td>{i.sku}</td>
            <td>{i.name}</td>
            <td>\${i.costPrice.toFixed(2)}</td>
            <td>\${i.sellingPrice.toFixed(2)}</td>
            <td>{i.stockOnHand}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    analog_example: `if (items.length === 0) return <p>No items found.</p>;

return (
  <table>
    <thead>
      <tr><th>SKU</th><th>Name</th><th>Cost</th><th>Stock</th></tr>
    </thead>
    <tbody>
      {items.map((i) => (
        <tr key={i.id}>
          <td>{i.sku}</td>
          <td>{i.name}</td>
          <td>\${i.costPrice.toFixed(2)}</td>
          <td>{i.stockOnHand}</td>
        </tr>
      ))}
    </tbody>
  </table>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A real semantic table (not a styled <div> grid) is what screen readers and browser table features actually understand.`,
      pain: "Skipping the empty check leaves a permanently blank table with no explanation once the fetch resolves to nothing.",
      mentalModel: MENTAL_MODEL,
      discover: `<table>
  <thead><tr><th>SKU</th><th>Name</th><th>Cost (MAC)</th><th>Price</th><th>Stock</th></tr></thead>
  <tbody>
    {items.map((i) => <tr key={i.id}>...</tr>)}
  </tbody>
</table>`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not skip the empty-array check — a table with zero rows and no message reads as broken.",
      dryRun: "Draw the same table shape for a different real dataset with different columns.",
      build: `1. Empty check: items.length === 0.\n2. Table head: 5 columns.\n3. Table body: .map() with key={i.id}, prices formatted with .toFixed(2).`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 26",
    file: "src/components/InventoryTable.tsx",
    paal: `Add a REORDER/HEALTHY badge column derived from each item's own stockOnHand vs reorderPoint.

Add a sixth column showing a "REORDER" warning badge when an item's stock has fallen to or below its own reorder point, or a "HEALTHY" badge otherwise.

WHAT YOUR LOGIC NEEDS
- A sixth <th>Status</th> column.
- A per-row conditional: i.stockOnHand <= i.reorderPoint ? "REORDER" : "HEALTHY".
- Visually distinct styling for the two states (e.g. red vs green).

Your task: add a Status column, and for each row render a red "REORDER" badge when stockOnHand <= reorderPoint, or a green "HEALTHY" badge otherwise.`,
    hint: `1. Add header: <th>Status</th> after the Stock column.
2. Add cell: <td>{i.stockOnHand <= i.reorderPoint ? <span style={{color:"red"}}>REORDER</span> : <span style={{color:"green"}}>HEALTHY</span>}</td>.
3. Compare each item to its OWN reorderPoint — never a hardcoded number.`,
    example_code: `<td>
  {i.stockOnHand <= i.reorderPoint ? (
    <span style={{ color: "red", fontWeight: 700 }}>REORDER</span>
  ) : (
    <span style={{ color: "green" }}>HEALTHY</span>
  )}
</td>`,
    think_prompt: `Every item can have its own reorder threshold — a widget that reorders at 10 units and a bolt that reorders at 500 are both "low" by their own standard. What single per-row comparison decides which badge to show?`,
    mc_options: [
      "compare each row's own stockOnHand to its own reorderPoint",
      "compare every row's stock to one hardcoded threshold like 10",
      "show REORDER for every item with stock under 100",
    ],
    mc_correct_option: "compare each row's own stockOnHand to its own reorderPoint",
    mc_anchor: "compare each row's own stockOnHand to it",
    why_this_matters: `A clear per-item stock table gives immediate visibility into exactly which products need replenishment, using each product's own real threshold.`,
    answer_keywords: ["stockOnHand", "reorderPoint", "REORDER", "HEALTHY"],
    seed_code: `import { useState, useEffect } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stockOnHand: number;
  reorderPoint: number;
};

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (items.length === 0) return <p>No items found.</p>;

  return (
    <table>
      <thead>
        <tr><th>SKU</th><th>Name</th><th>Cost (MAC)</th><th>Price</th><th>Stock</th></tr>
      </thead>
      <tbody>
        {items.map((i) => (
          <tr key={i.id}>
            <td>{i.sku}</td>
            <td>{i.name}</td>
            <td>\${i.costPrice.toFixed(2)}</td>
            <td>\${i.sellingPrice.toFixed(2)}</td>
            <td>{i.stockOnHand}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stockOnHand: number;
  reorderPoint: number;
};

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (items.length === 0) return <p>No items found.</p>;

  return (
    <table>
      <thead>
        <tr><th>SKU</th><th>Name</th><th>Cost (MAC)</th><th>Price</th><th>Stock</th>{/* add Status header */}</tr>
      </thead>
      <tbody>
        {items.map((i) => (
          <tr key={i.id}>
            <td>{i.sku}</td>
            <td>{i.name}</td>
            <td>\${i.costPrice.toFixed(2)}</td>
            <td>\${i.sellingPrice.toFixed(2)}</td>
            <td>{i.stockOnHand}</td>
            {/* add Status cell */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    feedback_correct: "Correct — the table now flags exactly which items need reordering, per-item.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Compare each item's own stockOnHand to its own reorderPoint, not a hardcoded number.",
    pre_check_hint: `Add one more header and one more cell per row — the cell's content is a simple ternary comparing stockOnHand to reorderPoint, evaluated fresh for every row.`,
    expected: `import { useState, useEffect } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
  stockOnHand: number;
  reorderPoint: number;
};

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (items.length === 0) return <p>No items found.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Cost (MAC)</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {items.map((i) => (
          <tr key={i.id}>
            <td>{i.sku}</td>
            <td>{i.name}</td>
            <td>\${i.costPrice.toFixed(2)}</td>
            <td>\${i.sellingPrice.toFixed(2)}</td>
            <td>{i.stockOnHand}</td>
            <td>
              {i.stockOnHand <= i.reorderPoint ? (
                <span style={{ color: "red", fontWeight: 700 }}>REORDER</span>
              ) : (
                <span style={{ color: "green" }}>HEALTHY</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    analog_example: `<td>
  {i.stockOnHand <= i.reorderPoint ? (
    <span style={{ color: "red", fontWeight: 700 }}>REORDER</span>
  ) : (
    <span style={{ color: "green" }}>HEALTHY</span>
  )}
</td>`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A clear per-item stock table gives immediate visibility into exactly which products need replenishment, using each product's own real threshold.`,
      pain: "A hardcoded threshold would misflag items that are genuinely fine at their own lower reorder point, or miss ones that are genuinely critical at a higher one.",
      mentalModel: MENTAL_MODEL,
      discover: `{i.stockOnHand <= i.reorderPoint ? (
  <span style={{ color: "red", fontWeight: 700 }}>REORDER</span>
) : (
  <span style={{ color: "green" }}>HEALTHY</span>
)}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not hardcode a single stock threshold for every item — always compare a row to its own reorderPoint.",
      dryRun: "Add the same kind of threshold badge to a different table with a different pair of fields.",
      build: `Add <th>Status</th> and a <td> per row comparing stockOnHand to reorderPoint.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 26",
    file: "src/components/ProcurementPanel.tsx",
    paal: `Create the component file at src/components/ProcurementPanel.tsx, define its props, and export the shell.

Create src/components/ProcurementPanel.tsx. This component doesn't own any purchase-order data itself — it receives the list and a refresh callback as props from the parent page.

WHAT YOUR CODE NEEDS
- A PurchaseOrder type: id, poNumber, totalAmount, status (all matching the real /api/po response).
- A props type: orders: PurchaseOrder[]; onReceive: () => void.

Your task: define PurchaseOrder and ProcurementPanelProps, then export ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) returning <div /> — every step from here on edits this same file.`,
    hint: `1. Create file: Add a new file at src/components/ProcurementPanel.tsx.
2. Define PurchaseOrder: id, poNumber, totalAmount, status — matching the real POST/GET /api/po response shape.
3. Define props: type ProcurementPanelProps = { orders: PurchaseOrder[]; onReceive: () => void; }.
4. Export shell: export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) { return <div />; }.`,
    example_code: `// src/components/POManager.tsx
export type PO = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type POManagerProps = {
  orders: PO[];
  onReceive: () => void;
};

export function POManager({ orders, onReceive }: POManagerProps) {
  return <div />;
}`,
    think_prompt: `This panel never fetches its own purchase orders — the parent page owns that list and hands it down, the same way the parent will also own items and sales orders. What does this component need to accept from outside, rather than manage on its own?`,
    mc_options: [
      "define PurchaseOrder and a props type ({ orders, onReceive }), then export ProcurementPanel accepting both as props",
      "fetch /api/po itself inside this component",
      "hardcode a fixed list of sample purchase orders",
    ],
    mc_correct_option: "define PurchaseOrder and a props type ({ orders, onReceive }), then export ProcurementPanel accepting both as props",
    mc_anchor: "define PurchaseOrder and a props type ({",
    why_this_matters: `A panel that only renders what it's handed — never fetching on its own — is what lets the parent page keep every panel showing the same, consistent data.`,
    answer_keywords: ["PurchaseOrder", "poNumber", "totalAmount", "status", "orders", "onReceive", "ProcurementPanel"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the shape and the props-only shell both exist now.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "This panel takes orders and onReceive as props — it doesn't fetch or own the list itself.",
    pre_check_hint: `Just like an inventory item, a purchase order is one real business record — and this component doesn't fetch it, it's handed one from the parent page.

Picture two real purchase orders:
- PO-1001 — total $150.00, still DRAFT.
- PO-1002 — total $90.00, already RECEIVED.

A purchase order needs a property for each of these real facts:
- a unique identifier, so any one order can always be picked out from the rest
- its own order number, the kind staff would actually read off a printed PO
- the total amount of the order
- its current status, in whatever words the real backend uses for that

Beyond that, the component itself needs two more things handed to it from outside, since it never fetches anything on its own:
- the full list of orders to render
- a callback it can call to ask the parent page to refresh, once something changes

Name each of these as its own property, in the camelCase style real APIs use.`,
    expected: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  return <div />;
}
`,
    analog_example: `export type MaintenanceTicket = {
  id: string;
  ticketNumber: string;
  totalCost: number;
  status: string;
};

type MaintenanceQueueProps = {
  tickets: MaintenanceTicket[];
  onClose: () => void;
};

export function MaintenanceQueue({ tickets, onClose }: MaintenanceQueueProps) {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A panel that only renders what it's handed — never fetching on its own — is what lets the parent page keep every panel showing the same, consistent data.`,
      pain: "A component that fetches its own copy of shared data can drift out of sync the moment another panel changes that same data.",
      mentalModel: MENTAL_MODEL,
      discover: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not fetch /api/po from inside this component — that's the parent page's job.",
      dryRun: "Write the same props-only shell for a different list + action pair.",
      build: `1. Define PurchaseOrder.\n2. Define props (orders, onReceive).\n3. Export the shell accepting both.`,
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 26",
    file: "src/components/ProcurementPanel.tsx",
    paal: `Render the list of purchase orders — number, total, and status.

Loop over the orders prop and display each one's PO number, formatted total, and current status, or a message when there are none.

WHAT YOUR LOGIC NEEDS
- A conditional check for orders.length === 0.
- An empty message: "No purchase orders yet."
- A .map() rendering each order's poNumber, totalAmount (formatted), and status.

Your task: render "No purchase orders yet." when orders.length === 0, otherwise one row per order (key={po.id}) showing poNumber, totalAmount formatted with $ and 2 decimals, and status.`,
    hint: `1. Check for empty: orders.length === 0 ? <p>No purchase orders yet.</p> : (...)
2. Loop orders: orders.map((po) => <div key={po.id}>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</div>)`,
    example_code: `{orders.length === 0 ? (
  <p>No purchase orders yet.</p>
) : (
  orders.map((po) => (
    <div key={po.id} className="flex justify-between p-2 border-b">
      <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
    </div>
  ))
)}`,
    think_prompt: `Same list-or-empty-message pattern as every other list you've built — the only difference here is what each row actually shows. What three fields does a purchase-order row need to display?`,
    mc_options: [
      "branch on orders.length === 0, otherwise map each order to a row showing poNumber, totalAmount, and status",
      "always render the rows even when orders is empty",
      "only show the order count, not each order",
    ],
    mc_correct_option: "branch on orders.length === 0, otherwise map each order to a row showing poNumber, totalAmount, and status",
    mc_anchor: "branch on orders.length === 0, otherwise",
    why_this_matters: `Showing the real order number and status gives procurement staff the same information a paper PO file would, at a glance.`,
    answer_keywords: ["orders", "length", "map", "poNumber", "totalAmount", "status", "key"],
    seed_code: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  return <div />;
}
`,
    starter_code: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  return (
    <div>
      <h3>Purchase Orders</h3>
      {/* empty or list */}
    </div>
  );
}
`,
    feedback_correct: "Correct — every real purchase order now renders, or an honest empty message.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Branch on orders.length === 0 first, then map each order into a row with a stable key.",
    pre_check_hint: `List all purchase orders. For each, this is just the familiar length-check-then-map pattern, showing poNumber, totalAmount, and status per row.`,
    expected: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  return (
    <div>
      <h3>Purchase Orders</h3>
      {orders.length === 0 ? (
        <p>No purchase orders yet.</p>
      ) : (
        orders.map((po) => (
          <div key={po.id} className="flex justify-between p-2 border-b">
            <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
          </div>
        ))
      )}
    </div>
  );
}
`,
    analog_example: `{orders.length === 0 ? (
  <p>No purchase orders yet.</p>
) : (
  orders.map((po) => (
    <div key={po.id} className="flex justify-between p-2 border-b">
      <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
    </div>
  ))
)}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Showing the real order number and status gives procurement staff the same information a paper PO file would, at a glance.`,
      pain: "Skipping the empty check leaves a blank panel with no explanation before any PO has ever been created.",
      mentalModel: MENTAL_MODEL,
      discover: `orders.map((po) => (
  <div key={po.id}>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</div>
))`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Render the same kind of list for a different resource with the same shape.",
      build: `1. Check length.\n2. Empty message.\n3. Map rows with key={po.id}.`,
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 26",
    file: "src/components/ProcurementPanel.tsx",
    paal: `Add a Receive Goods button on any order that isn't RECEIVED yet, wired to the real receive endpoint.

For any order whose status isn't RECEIVED, show a "Receive Goods" button that calls the real receipt endpoint for that specific order.

WHAT YOUR LOGIC NEEDS
- A conditional render: only show the button when po.status !== "RECEIVED".
- An onClick handler calling fetch(\`/api/po/\${po.id}/receive\`, { method: "POST" }).
- The handler is async so it can await the response.

Your task: add the button per row, calling POST /api/po/:id/receive for that exact order's id when clicked.`,
    hint: `1. Conditional button: {po.status !== "RECEIVED" && (<button onClick={() => handleReceive(po.id)}>Receive Goods</button>)}
2. Handler: async function handleReceive(id: string) { await fetch(\`/api/po/\${id}/receive\`, { method: "POST" }); }
3. Place the handler above the return statement, inside the component.`,
    example_code: `async function handleReceive(id: string) {
  await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
}

{po.status !== "RECEIVED" && (
  <button
    onClick={() => handleReceive(po.id)}
    className="bg-blue-600 text-white px-3 py-1 rounded"
  >
    Receive Goods
  </button>
)}`,
    think_prompt: `Every order needs its OWN button pointed at its OWN id — clicking Receive Goods on PO-1001 must never accidentally receive PO-1002. What does the URL for this fetch need to include, and which orders should the button even appear on?`,
    mc_options: [
      "a button per non-RECEIVED order, calling fetch with that exact order's id in the URL",
      "one global Receive Goods button that receives every order at once",
      "a button that's always visible, even on already-RECEIVED orders",
    ],
    mc_correct_option: "a button per non-RECEIVED order, calling fetch with that exact order's id in the URL",
    mc_anchor: "a button per non-RECEIVED order, calling",
    why_this_matters: `One-click receiving makes warehouse processing straightforward while triggering a real, atomic stock + cost + ledger update behind the scenes.`,
    answer_keywords: ["handleReceive", "fetch", "po.id", "receive", "POST", "status"],
    seed_code: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  return (
    <div>
      <h3>Purchase Orders</h3>
      {orders.length === 0 ? (
        <p>No purchase orders yet.</p>
      ) : (
        orders.map((po) => (
          <div key={po.id} className="flex justify-between p-2 border-b">
            <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
          </div>
        ))
      )}
    </div>
  );
}
`,
    starter_code: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  // handleReceive goes here

  return (
    <div>
      <h3>Purchase Orders</h3>
      {orders.length === 0 ? (
        <p>No purchase orders yet.</p>
      ) : (
        orders.map((po) => (
          <div key={po.id} className="flex justify-between p-2 border-b">
            <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
            {/* Receive Goods button goes here */}
          </div>
        ))
      )}
    </div>
  );
}
`,
    feedback_correct: "Correct — each order gets its own button, targeting its own id.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "The button must only show on non-RECEIVED orders and must call receive with that exact order's id.",
    pre_check_hint: `The button's onClick calls an async function that posts to /api/po/:id/receive using this specific row's po.id, not a fixed value.`,
    expected: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  async function handleReceive(id: string) {
    await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
  }

  return (
    <div>
      <h3>Purchase Orders</h3>
      {orders.length === 0 ? (
        <p>No purchase orders yet.</p>
      ) : (
        orders.map((po) => (
          <div key={po.id} className="flex justify-between p-2 border-b">
            <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
            {po.status !== "RECEIVED" && (
              <button onClick={() => handleReceive(po.id)} className="bg-blue-600 text-white px-3 py-1 rounded">
                Receive Goods
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    analog_example: `async function handleReceive(id: string) {
  await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
}

{po.status !== "RECEIVED" && (
  <button onClick={() => handleReceive(po.id)} className="bg-blue-600 text-white px-3 py-1 rounded">
    Receive Goods
  </button>
)}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `One-click receiving makes warehouse processing straightforward while triggering a real, atomic stock + cost + ledger update behind the scenes.`,
      pain: "A button not scoped to its own row's id risks receiving the wrong purchase order entirely.",
      mentalModel: MENTAL_MODEL,
      discover: `async function handleReceive(id: string) {
  await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not hardcode a single PO id — always use the row's own po.id.",
      dryRun: "Wire the same per-row action button for a different resource and endpoint.",
      build: `1. Conditional button on status !== "RECEIVED".\n2. Handler posts to /api/po/\${id}/receive.`,
    },
  },
  {
    id: "step8",
    type: "question",
    phase: "Step 8 of 26",
    file: "src/components/ProcurementPanel.tsx",
    paal: `Handle the response — success reloads the parent's data, failure (already received) shows the real error.

After the receive request resolves, call onReceive() to tell the parent to reload everything, or surface the real error message when the API rejects the request.

WHAT YOUR LOGIC NEEDS
- Check res.ok after the fetch resolves.
- On success, call the onReceive() prop so the parent refetches items/orders/reports.
- On failure, read the real error body and show it (e.g. via alert or inline state) instead of failing silently.

Your task: after fetch resolves, call onReceive() if res.ok; otherwise parse the JSON error body and surface it to the user.`,
    hint: `1. Capture the response: const res = await fetch(...).
2. Branch on res.ok: if (res.ok) { onReceive(); } else { const body = await res.json(); alert(body.error); }
3. Keep the fetch call itself unchanged — only what happens after it resolves is new.`,
    example_code: `async function handleReceive(id: string) {
  const res = await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
  if (res.ok) {
    onReceive();
  } else {
    const body = await res.json();
    alert(body.error || "Could not receive this order.");
  }
}`,
    think_prompt: `A real API can genuinely fail — someone else already received this exact order a second ago, and the server correctly says 409. Silently doing nothing on failure would leave staff clicking a dead button with no idea why. What has to happen in each of the two outcomes?`,
    mc_options: [
      "check res.ok: call onReceive() on success, read and show the real error body on failure",
      "always call onReceive(), whether or not the request actually succeeded",
      "ignore the response entirely once the fetch call is made",
    ],
    mc_correct_option: "check res.ok: call onReceive() on success, read and show the real error body on failure",
    mc_anchor: "check res.ok: call onReceive() on success",
    why_this_matters: `Refreshing on success keeps every panel on screen in sync with what the ledger actually did; surfacing a real failure keeps staff from believing an order was received when it wasn't.`,
    answer_keywords: ["res.ok", "onReceive", "alert", "body.error", "json"],
    seed_code: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  async function handleReceive(id: string) {
    await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
  }

  return (
    <div>
      <h3>Purchase Orders</h3>
      {orders.length === 0 ? (
        <p>No purchase orders yet.</p>
      ) : (
        orders.map((po) => (
          <div key={po.id} className="flex justify-between p-2 border-b">
            <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
            {po.status !== "RECEIVED" && (
              <button onClick={() => handleReceive(po.id)} className="bg-blue-600 text-white px-3 py-1 rounded">
                Receive Goods
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    starter_code: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  async function handleReceive(id: string) {
    const res = await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
    // handle res.ok / error here
  }

  return (
    <div>
      <h3>Purchase Orders</h3>
      {orders.length === 0 ? (
        <p>No purchase orders yet.</p>
      ) : (
        orders.map((po) => (
          <div key={po.id} className="flex justify-between p-2 border-b">
            <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
            {po.status !== "RECEIVED" && (
              <button onClick={() => handleReceive(po.id)} className="bg-blue-600 text-white px-3 py-1 rounded">
                Receive Goods
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    feedback_correct: "Correct — a real success reloads everything, and a real failure is never silent.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Branch on res.ok — call onReceive() only on success, and show the real error body on failure.",
    pre_check_hint: `res.ok tells you whether the server actually accepted the request. On success, tell the parent to reload (onReceive()); on failure, read the JSON body's error field and show it.`,
    expected: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  async function handleReceive(id: string) {
    const res = await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
    if (res.ok) {
      onReceive();
    } else {
      const body = await res.json();
      alert(body.error || "Could not receive this order.");
    }
  }

  return (
    <div>
      <h3>Purchase Orders</h3>
      {orders.length === 0 ? (
        <p>No purchase orders yet.</p>
      ) : (
        orders.map((po) => (
          <div key={po.id} className="flex justify-between p-2 border-b">
            <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
            {po.status !== "RECEIVED" && (
              <button onClick={() => handleReceive(po.id)} className="bg-blue-600 text-white px-3 py-1 rounded">
                Receive Goods
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    analog_example: `async function handleReceive(id: string) {
  const res = await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
  if (res.ok) {
    onReceive();
  } else {
    const body = await res.json();
    alert(body.error || "Could not receive this order.");
  }
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Refreshing on success keeps every panel on screen in sync with what the ledger actually did; surfacing a real failure keeps staff from believing an order was received when it wasn't.`,
      pain: "Ignoring the response leaves staff clicking a button that looks like it worked, even on a real 409 rejection.",
      mentalModel: MENTAL_MODEL,
      discover: `if (res.ok) {
  onReceive();
} else {
  const body = await res.json();
  alert(body.error);
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not assume every fetch succeeds — always branch on res.ok.",
      dryRun: "Handle success/failure the same way for a different action button.",
      build: `1. Capture res.\n2. if (res.ok) onReceive().\n3. else read + show body.error.`,
    },
  },
  {
    id: "step9",
    type: "question",
    phase: "Step 9 of 26",
    file: "src/components/SalesFulfillmentBoard.tsx",
    paal: `Create the component file at src/components/SalesFulfillmentBoard.tsx, define its props, and export the shell.

Create src/components/SalesFulfillmentBoard.tsx. Like the procurement panel, this component doesn't own any sales-order data itself — it receives the list and a refresh callback as props.

WHAT YOUR CODE NEEDS
- A SalesOrder type: id, soNumber, totalAmount, status (matching the real /api/so response).
- A props type: orders: SalesOrder[]; onFulfill: () => void.

Your task: define SalesOrder and SalesFulfillmentBoardProps, then export SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) returning <div /> — every step from here on edits this same file.`,
    hint: `1. Create file: Add a new file at src/components/SalesFulfillmentBoard.tsx.
2. Define SalesOrder: id, soNumber, totalAmount, status — matching the real POST/GET /api/so response shape.
3. Define props: type SalesFulfillmentBoardProps = { orders: SalesOrder[]; onFulfill: () => void; }.
4. Export shell: export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) { return <div />; }.`,
    example_code: `// src/components/SalesPipeline.tsx
export type SO = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesPipelineProps = {
  orders: SO[];
  onFulfill: () => void;
};

export function SalesPipeline({ orders, onFulfill }: SalesPipelineProps) {
  return <div />;
}`,
    think_prompt: `This board is the mirror image of the procurement panel you may have already built — same "props, not its own fetch" shape, but for the other side of the transaction: shipping instead of receiving. What does this component need handed to it from outside?`,
    mc_options: [
      "define SalesOrder and a props type ({ orders, onFulfill }), then export SalesFulfillmentBoard accepting both as props",
      "fetch /api/so itself inside this component",
      "hardcode a fixed list of sample sales orders",
    ],
    mc_correct_option: "define SalesOrder and a props type ({ orders, onFulfill }), then export SalesFulfillmentBoard accepting both as props",
    mc_anchor: "define SalesOrder and a props type ({ or",
    why_this_matters: `A board that only renders what it's handed keeps every panel on the page showing the same real, current data.`,
    answer_keywords: ["SalesOrder", "soNumber", "totalAmount", "status", "orders", "onFulfill", "SalesFulfillmentBoard"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the shape and the props-only shell both exist now.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "This board takes orders and onFulfill as props — it doesn't fetch or own the list itself.",
    pre_check_hint: `Just like the purchase order, a sales order is one real business record — and this board doesn't fetch it, it's handed one from the parent page.

Picture two real sales orders:
- SO-2001 — total $125.00, CONFIRMED and ready to ship.
- SO-2002 — total $60.00, already SHIPPED.

A sales order needs a property for each of these real facts:
- a unique identifier, so any one order can always be picked out from the rest
- its own order number, the kind staff would actually read off a printed SO
- the total amount of the order
- its current status, in whatever words the real backend uses for that

Beyond that, the board itself needs two more things handed to it from outside, since it never fetches anything on its own:
- the full list of orders to render
- a callback it can call to ask the parent page to refresh, once a shipment goes out

Name each of these as its own property, in the camelCase style real APIs use.`,
    expected: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  return <div />;
}
`,
    analog_example: `export type ClassBooking = {
  id: string;
  bookingNumber: string;
  totalFee: number;
  status: string;
};

type ClassRosterProps = {
  bookings: ClassBooking[];
  onCheckIn: () => void;
};

export function ClassRoster({ bookings, onCheckIn }: ClassRosterProps) {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A board that only renders what it's handed keeps every panel on the page showing the same real, current data.`,
      pain: "A component that fetches its own copy of shared sales-order data can drift out of sync with what the procurement panel or inventory table just changed.",
      mentalModel: MENTAL_MODEL,
      discover: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not fetch /api/so from inside this component — that's the parent page's job.",
      dryRun: "Write the same props-only shell for a different list + action pair.",
      build: `1. Define SalesOrder.\n2. Define props (orders, onFulfill).\n3. Export the shell accepting both.`,
    },
  },
  {
    id: "step10",
    type: "question",
    phase: "Step 10 of 26",
    file: "src/components/SalesFulfillmentBoard.tsx",
    paal: `Render the list of sales orders — number, customer's total, and status.

Loop over the orders prop and display each one's SO number, formatted total, and current status, or a message when there are none.

WHAT YOUR LOGIC NEEDS
- A conditional check for orders.length === 0.
- An empty message: "No sales orders yet."
- A .map() rendering each order's soNumber, totalAmount (formatted), and status.

Your task: render "No sales orders yet." when orders.length === 0, otherwise one row per order (key={so.id}) showing soNumber, totalAmount formatted with $ and 2 decimals, and status.`,
    hint: `1. Check for empty: orders.length === 0 ? <p>No sales orders yet.</p> : (...)
2. Loop orders: orders.map((so) => <div key={so.id}>{so.soNumber} - \${so.totalAmount.toFixed(2)} ({so.status})</div>)`,
    example_code: `{orders.length === 0 ? (
  <p>No sales orders yet.</p>
) : (
  orders.map((so) => (
    <div key={so.id} className="p-3 border rounded mb-2">
      <div className="flex justify-between">
        <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
        <span className="uppercase text-sm">{so.status}</span>
      </div>
    </div>
  ))
)}`,
    think_prompt: `Same list-or-empty-message pattern you've used throughout this whole product. What three fields does a sales-order row need to display?`,
    mc_options: [
      "branch on orders.length === 0, otherwise map each order to a row showing soNumber, totalAmount, and status",
      "always render the rows even when orders is empty",
      "only show the order count, not each order",
    ],
    mc_correct_option: "branch on orders.length === 0, otherwise map each order to a row showing soNumber, totalAmount, and status",
    mc_anchor: "branch on orders.length === 0, otherwise",
    why_this_matters: `Showing the real order number and status gives warehouse staff exactly what they need to decide what to ship next.`,
    answer_keywords: ["orders", "length", "map", "soNumber", "totalAmount", "status", "key"],
    seed_code: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  return <div />;
}
`,
    starter_code: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  return (
    <div>
      <h3>Sales Orders</h3>
      {/* empty or list */}
    </div>
  );
}
`,
    feedback_correct: "Correct — every real sales order now renders, or an honest empty message.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Branch on orders.length === 0 first, then map each order into a row with a stable key.",
    pre_check_hint: `Render sales orders grouped by status. For each, this is the familiar length-check-then-map pattern, showing soNumber, totalAmount, and status per row.`,
    expected: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders yet.</p>
      ) : (
        orders.map((so) => (
          <div key={so.id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
              <span className="uppercase text-sm">{so.status}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
`,
    analog_example: `{orders.length === 0 ? (
  <p>No sales orders yet.</p>
) : (
  orders.map((so) => (
    <div key={so.id} className="p-3 border rounded mb-2">
      <div className="flex justify-between">
        <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
        <span className="uppercase text-sm">{so.status}</span>
      </div>
    </div>
  ))
)}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Showing the real order number and status gives warehouse staff exactly what they need to decide what to ship next.`,
      pain: "Skipping the empty check leaves a blank board with no explanation before any SO has ever been created.",
      mentalModel: MENTAL_MODEL,
      discover: `orders.map((so) => (
  <div key={so.id}>{so.soNumber} - \${so.totalAmount.toFixed(2)} ({so.status})</div>
))`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Render the same kind of list for a different resource with the same shape.",
      build: `1. Check length.\n2. Empty message.\n3. Map rows with key={so.id}.`,
    },
  },
  {
    id: "step11",
    type: "question",
    phase: "Step 11 of 26",
    file: "src/components/SalesFulfillmentBoard.tsx",
    paal: `Add a Fulfill & Ship button on CONFIRMED orders, wired to the real fulfillment endpoint.

For any order whose status is CONFIRMED, show a "Fulfill & Ship" button that calls the real fulfillment endpoint for that specific order.

WHAT YOUR LOGIC NEEDS
- A conditional render: only show the button when so.status === "CONFIRMED".
- An onClick handler calling fetch(\`/api/so/\${so.id}/fulfill\`, { method: "POST" }).
- The handler is async so it can await the response.

Your task: add the button per row, calling POST /api/so/:id/fulfill for that exact order's id when clicked.`,
    hint: `1. Conditional button: {so.status === "CONFIRMED" && (<button onClick={() => handleFulfill(so.id)}>Fulfill & Ship</button>)}
2. Handler: async function handleFulfill(id: string) { await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" }); }
3. Place the handler above the return statement, inside the component.`,
    example_code: `async function handleFulfill(id: string) {
  await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
}

{so.status === "CONFIRMED" && (
  <button
    onClick={() => handleFulfill(so.id)}
    className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded"
  >
    Fulfill & Ship
  </button>
)}`,
    think_prompt: `Only a CONFIRMED order is waiting to ship — an already-SHIPPED order should never show this button again. What decides whether the button even appears, and what must the fetch target?`,
    mc_options: [
      "a button only on CONFIRMED orders, calling fetch with that exact order's id in the URL",
      "one global Fulfill & Ship button that fulfills every order at once",
      "a button that's always visible, even on already-SHIPPED orders",
    ],
    mc_correct_option: "a button only on CONFIRMED orders, calling fetch with that exact order's id in the URL",
    mc_anchor: "a button only on CONFIRMED orders, calli",
    why_this_matters: `The pipeline view guides orders smoothly through each fulfillment stage while enforcing stock availability at the exact moment of dispatch.`,
    answer_keywords: ["handleFulfill", "fetch", "so.id", "fulfill", "POST", "CONFIRMED"],
    seed_code: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders yet.</p>
      ) : (
        orders.map((so) => (
          <div key={so.id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
              <span className="uppercase text-sm">{so.status}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
`,
    starter_code: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  // handleFulfill goes here

  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders yet.</p>
      ) : (
        orders.map((so) => (
          <div key={so.id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
              <span className="uppercase text-sm">{so.status}</span>
            </div>
            {/* Fulfill & Ship button goes here */}
          </div>
        ))
      )}
    </div>
  );
}
`,
    feedback_correct: "Correct — each order gets its own button, targeting its own id.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "The button must only show on CONFIRMED orders and must call fulfill with that exact order's id.",
    pre_check_hint: `The button's onClick calls an async function that posts to /api/so/:id/fulfill using this specific row's so.id, not a fixed value.`,
    expected: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  async function handleFulfill(id: string) {
    await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
  }

  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders yet.</p>
      ) : (
        orders.map((so) => (
          <div key={so.id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
              <span className="uppercase text-sm">{so.status}</span>
            </div>
            {so.status === "CONFIRMED" && (
              <button onClick={() => handleFulfill(so.id)} className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded">
                Fulfill & Ship
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    analog_example: `async function handleFulfill(id: string) {
  await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
}

{so.status === "CONFIRMED" && (
  <button onClick={() => handleFulfill(so.id)} className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded">
    Fulfill & Ship
  </button>
)}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `The pipeline view guides orders smoothly through each fulfillment stage while enforcing stock availability at the exact moment of dispatch.`,
      pain: "A button not scoped to its own row's id or its own status risks shipping the wrong order, or shipping one already shipped.",
      mentalModel: MENTAL_MODEL,
      discover: `async function handleFulfill(id: string) {
  await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not hardcode a single SO id — always use the row's own so.id.",
      dryRun: "Wire the same per-row action button for a different resource and endpoint.",
      build: `1. Conditional button on status === "CONFIRMED".\n2. Handler posts to /api/so/\${id}/fulfill.`,
    },
  },
  {
    id: "step12",
    type: "question",
    phase: "Step 12 of 26",
    file: "src/components/SalesFulfillmentBoard.tsx",
    paal: `Handle the response — success reloads the parent's data, a real 409 (insufficient stock) is shown, not swallowed.

After the fulfill request resolves, call onFulfill() to tell the parent to reload everything, or surface the real 409 INSUFFICIENT_STOCK error when the API rejects the request.

WHAT YOUR LOGIC NEEDS
- Check res.ok after the fetch resolves.
- On success, call the onFulfill() prop so the parent refetches items/orders/reports.
- On failure, read the real error body (e.g. "INSUFFICIENT_STOCK: WIDGET-01") and show it instead of failing silently.

Your task: after fetch resolves, call onFulfill() if res.ok; otherwise parse the JSON error body and surface it to the user.`,
    hint: `1. Capture the response: const res = await fetch(...).
2. Branch on res.ok: if (res.ok) { onFulfill(); } else { const body = await res.json(); alert(body.error); }
3. Keep the fetch call itself unchanged — only what happens after it resolves is new.`,
    example_code: `async function handleFulfill(id: string) {
  const res = await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
  if (res.ok) {
    onFulfill();
  } else {
    const body = await res.json();
    alert(body.error || "Could not fulfill this order.");
  }
}`,
    think_prompt: `A real fulfillment can genuinely fail — someone tries to ship 999 units of something with 25 in stock, and the server correctly says 409 INSUFFICIENT_STOCK. Silently doing nothing on failure would leave staff thinking the order shipped when it didn't. What has to happen in each of the two outcomes?`,
    mc_options: [
      "check res.ok: call onFulfill() on success, read and show the real error body on failure",
      "always call onFulfill(), whether or not the request actually succeeded",
      "ignore the response entirely once the fetch call is made",
    ],
    mc_correct_option: "check res.ok: call onFulfill() on success, read and show the real error body on failure",
    mc_anchor: "check res.ok: call onFulfill() on success",
    why_this_matters: `Refreshing on success keeps every panel synced with the ledger; surfacing a real 409 keeps staff from believing an order shipped when stock genuinely ran out.`,
    answer_keywords: ["res.ok", "onFulfill", "alert", "body.error", "json", "INSUFFICIENT_STOCK"],
    seed_code: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  async function handleFulfill(id: string) {
    await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
  }

  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders yet.</p>
      ) : (
        orders.map((so) => (
          <div key={so.id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
              <span className="uppercase text-sm">{so.status}</span>
            </div>
            {so.status === "CONFIRMED" && (
              <button onClick={() => handleFulfill(so.id)} className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded">
                Fulfill & Ship
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    starter_code: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  async function handleFulfill(id: string) {
    const res = await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
    // handle res.ok / error here
  }

  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders yet.</p>
      ) : (
        orders.map((so) => (
          <div key={so.id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
              <span className="uppercase text-sm">{so.status}</span>
            </div>
            {so.status === "CONFIRMED" && (
              <button onClick={() => handleFulfill(so.id)} className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded">
                Fulfill & Ship
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    feedback_correct: "Correct — a real success reloads everything, and a real 409 is never silent.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Branch on res.ok — call onFulfill() only on success, and show the real error body on failure.",
    pre_check_hint: `res.ok tells you whether the server actually accepted the request. On success, tell the parent to reload (onFulfill()); on failure, read the JSON body's error field (a real INSUFFICIENT_STOCK message) and show it.`,
    expected: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  async function handleFulfill(id: string) {
    const res = await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
    if (res.ok) {
      onFulfill();
    } else {
      const body = await res.json();
      alert(body.error || "Could not fulfill this order.");
    }
  }

  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders yet.</p>
      ) : (
        orders.map((so) => (
          <div key={so.id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
              <span className="uppercase text-sm">{so.status}</span>
            </div>
            {so.status === "CONFIRMED" && (
              <button onClick={() => handleFulfill(so.id)} className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded">
                Fulfill & Ship
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    analog_example: `async function handleFulfill(id: string) {
  const res = await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
  if (res.ok) {
    onFulfill();
  } else {
    const body = await res.json();
    alert(body.error || "Could not fulfill this order.");
  }
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Refreshing on success keeps every panel synced with the ledger; surfacing a real 409 keeps staff from believing an order shipped when stock genuinely ran out.`,
      pain: "Ignoring the response leaves staff clicking a button that looks like it worked, even on a real 409 rejection.",
      mentalModel: MENTAL_MODEL,
      discover: `if (res.ok) {
  onFulfill();
} else {
  const body = await res.json();
  alert(body.error);
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not assume every fetch succeeds — always branch on res.ok.",
      dryRun: "Handle success/failure the same way for a different action button.",
      build: `1. Capture res.\n2. if (res.ok) onFulfill().\n3. else read + show body.error.`,
    },
  },
  {
    id: "step13",
    type: "question",
    phase: "Step 13 of 26",
    file: "src/components/FinancialMetrics.tsx",
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
    id: "step14",
    type: "question",
    phase: "Step 14 of 26",
    file: "src/components/FinancialMetrics.tsx",
    paal: `Define the Financials type.

You already created the file in Step 13. Now write a TypeScript type naming every field the real income-statement endpoint sends back.

WHAT YOUR BLUEPRINT NEEDS
- revenue (text — the API sends an already-formatted 2-decimal string, e.g. "125.00")
- cogs (text)
- netIncome (text)

Your task: in the file from Step 1, write \`type Financials\` with those three fields. Nothing else yet — the component itself comes in the next step.`,
    hint: `1. The file already exists from Step 13 — just open it.
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
    pre_check_hint: `The file already exists from Step 13. The type itself just needs to match what the real endpoint actually sends: three already-formatted money strings, not numbers.`,
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
    id: "step15",
    type: "question",
    phase: "Step 15 of 26",
    file: "src/components/FinancialMetrics.tsx",
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
    id: "step16",
    type: "question",
    phase: "Step 16 of 26",
    file: "src/components/FinancialMetrics.tsx",
    paal: `Add state to hold the fetched financials, defaulting to real zeros.

The Financials type already exists — you defined it in Step 14. This step just uses it: give the component somewhere to hold the financials once they arrive, defaulting to real zero-strings, not nothing.

WHAT YOUR LOGIC NEEDS
- Import useState: import { useState } from "react";
- The Financials type from Step 2 — nothing new to define here.
- useState<Financials>, defaulting to { revenue: "0.00", cogs: "0.00", netIncome: "0.00" }.

Your task: import useState from "react", then add const [financials, setFinancials] = useState<Financials>({ revenue: "0.00", cogs: "0.00", netIncome: "0.00" }); inside the component, right after FinancialMetrics() opens. No fetch yet.`,
    hint: `1. Import useState: import { useState } from "react";
2. The Financials type is already there from Step 14 — nothing new to define.
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
    pre_check_hint: `The Financials type already exists from Step 14 — this step only adds state that uses it.

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
    id: "step17",
    type: "question",
    phase: "Step 17 of 26",
    file: "src/components/FinancialMetrics.tsx",
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
    id: "step18",
    type: "question",
    phase: "Step 18 of 26",
    file: "src/components/FinancialMetrics.tsx",
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
    id: "step19",
    type: "question",
    phase: "Step 19 of 26",
    file: "src/App.tsx",
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
    id: "step20",
    type: "question",
    phase: "Step 20 of 26",
    file: "src/App.tsx",
    paal: `Declare the \`items\` state array in App.tsx.

You already created App.tsx in Step 19. This is the first of three shared state arrays every panel on the dashboard will read from — one array, one step at a time.

The Item type comes from InventoryTable.tsx, which you already built in Steps 1-4 of this same task.

WHAT YOUR LOGIC NEEDS
- Import useState: import { useState } from "react"; — App.tsx is a new file, it doesn't inherit FinancialMetrics.tsx's import.
- Import the Item type from InventoryTable.
- One useState array: items, defaulting to an empty array — type Item[].

Your task: in App.tsx (from Step 7), import useState and the Item type, then declare items as a useState<Item[]>([]) array. purchaseOrders and salesOrders come in the next two steps.`,
    hint: `1. The file already exists from Step 19 — just open it.
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
    pre_check_hint: `The file already exists from Step 19 — App.tsx needs its own useState import, separate from FinancialMetrics.tsx's. The Item type comes from InventoryTable.tsx, which you already built in Steps 1-4 of this task.

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
    id: "step21",
    type: "question",
    phase: "Step 21 of 26",
    file: "src/App.tsx",
    paal: `Declare the \`purchaseOrders\` state array in App.tsx.

The items array already exists from Step 20. Add the second of the three shared arrays the same way, right alongside it.

The PurchaseOrder type comes from ProcurementPanel.tsx, which you already built in Steps 5-8 of this same task.

WHAT YOUR LOGIC NEEDS
- Import the PurchaseOrder type from ProcurementPanel.
- One useState array: purchaseOrders, defaulting to an empty array — type PurchaseOrder[].

Your task: import the PurchaseOrder type, then declare purchaseOrders as a useState<PurchaseOrder[]>([]) array, alongside items. salesOrders comes in the next step.`,
    hint: `1. items is already declared from Step 20 — just add to the same file.
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
    pre_check_hint: `items is already declared from Step 20 — add purchaseOrders the same way, in the same file. The PurchaseOrder type comes from ProcurementPanel.tsx, which you already built in Steps 5-8 of this task.

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
    id: "step22",
    type: "question",
    phase: "Step 22 of 26",
    file: "src/App.tsx",
    paal: `Declare the \`salesOrders\` state array in App.tsx.

items and purchaseOrders already exist from Steps 20 and 21. This is the third and last of the shared arrays.

The SalesOrder type comes from SalesFulfillmentBoard.tsx, which you already built in Steps 9-12 of this same task.

WHAT YOUR LOGIC NEEDS
- Import the SalesOrder type from SalesFulfillmentBoard.
- One useState array: salesOrders, defaulting to an empty array — type SalesOrder[].

Your task: import the SalesOrder type, then declare salesOrders as a useState<SalesOrder[]>([]) array, alongside items and purchaseOrders. No fetching yet — that's the next step.`,
    hint: `1. items and purchaseOrders are already declared from Steps 20 and 21 — just add to the same file.
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
    pre_check_hint: `items and purchaseOrders are already declared from Steps 20 and 21 — add salesOrders the same way, in the same file. The SalesOrder type comes from SalesFulfillmentBoard.tsx, which you already built in Steps 9-12 of this task.

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
    id: "step23",
    type: "question",
    phase: "Step 23 of 26",
    file: "src/App.tsx",
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
    id: "step24",
    type: "question",
    phase: "Step 24 of 26",
    file: "src/App.tsx",
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
    id: "step25",
    type: "question",
    phase: "Step 25 of 26",
    file: "src/App.tsx",
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
    id: "step26",
    type: "question",
    phase: "Step 26 of 26",
    file: "src/App.tsx",
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
  { label: "Step 15", id: "step15" },
  { label: "Step 16", id: "step16" },
  { label: "Step 17", id: "step17" },
  { label: "Step 18", id: "step18" },
  { label: "Step 19", id: "step19" },
  { label: "Step 20", id: "step20" },
  { label: "Step 21", id: "step21" },
  { label: "Step 22", id: "step22" },
  { label: "Step 23", id: "step23" },
  { label: "Step 24", id: "step24" },
  { label: "Step 25", id: "step25" },
  { label: "Step 26", id: "step26" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "MiniERP: inventory, procurement, sales & financial dashboard",
  shortName: "MiniERP suite",
});
