import createINPACTEngine from "../inpact_engine_shared";

const MENTAL_MODEL = `Build a screen that lists real inventory from the real MiniERP backend:

  Fetch    →  every item, live from GET /api/items
  Table    →  real rows, one per item — SKU, Name, Cost, Price, Stock
  Loading  →  a message while the fetch is in flight
  Empty    →  a message if there are no items yet
  Badge    →  REORDER when stockOnHand <= reorderPoint, HEALTHY otherwise
`;

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-erp-inventory-table",
      title: "Inventory master table",
      body: MENTAL_MODEL,
      usecase: "The real MiniERP backend (Task 1-5's ledger, item valuation, and transaction engine) is already running — this task is frontend only, against real endpoints.",
      designMock: {"kind":"list-and-form","screenTitle":"Inventory","caption":"This is the screen you are building — every row is a real item fetched from the real MiniERP API.","listCaption":"TABLE — real inventory, live from the API","emptyCaption":"EMPTY — if no items exist yet","emptyMessage":"No items found.","rows":[{"title":"WIDGET-01","subtitle":"$7.50","meta":"20 on hand"},{"title":"WIDGET-02","subtitle":"$12.00","meta":"5 on hand"}],"fields":[{"label":"SKU","sample":"WIDGET-01"}],"submitLabel":"Search","formMode":"filter"},
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
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Create the component file at src/components/InventoryTable.tsx, define type Item, and export the shell.

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
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have — matching the real API's actual response shape is what keeps that contract honest.`,
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
    analog_example: `export type StockItem = {
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
    phase: "Step 2 of 4",
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
    pre_check_hint: `fetch() returns a Promise; the real response only exists inside .then() (or after an await). A useEffect with an empty array makes that chain run exactly once, right when the component first appears.`,
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
    analog_example: `const [items, setItems] = useState<StockItem[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/items")
    .then((res) => res.json())
    .then((data) => {
      setItems(data);
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
    phase: "Step 3 of 4",
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
    phase: "Step 4 of 4",
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
  title: "Inventory master table",
  shortName: "Inventory table",
});
