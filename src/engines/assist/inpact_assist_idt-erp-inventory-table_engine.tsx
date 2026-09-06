import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-erp-inventory-table",
      title: "Inventory master table",
      body: `Build a screen that lists real inventory from a real backend:

  Fetch  →  every item, live from the real Mini ERP API
  Table  →  a real TanStack Table — sortable columns, not a plain <ul>
  Loading →  a message while the fetch is in flight
  Empty  →  a message if there are no items yet
`,
      usecase: "The backend (Fastify + Prisma + PostgreSQL, real double-entry ledger and all) already exists and is running — this task is frontend only, against real endpoints.",
      designMock: {"kind":"list-and-form","screenTitle":"Inventory","caption":"This is the screen you are building — every row is a real item fetched from the real Mini ERP API, rendered as a real table.","listCaption":"TABLE — real inventory, live from the API","emptyCaption":"EMPTY — if no items exist yet","emptyMessage":"No items found.","rows":[{"title":"WIDGET-01","subtitle":"$7.50","meta":"20 on hand"},{"title":"WIDGET-02","subtitle":"$12.00","meta":"5 on hand"}],"fields":[{"label":"SKU","sample":"WIDGET-01"}],"submitLabel":"Search","formMode":"filter"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Create an item blueprint describing an inventory product (SKU, name, stock count, cost).","Set up a storage container in state to hold the incoming catalog.","Fetch the real inventory catalog from the API when the component first appears on screen.","Configure the spreadsheet columns using TanStack Table to map headers to data fields.","Draw table headers and data rows, displaying a loading message while fetching and an empty state if no stock exists."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 6",
    paal: `Create an item blueprint describing an inventory product (SKU, name, stock count, cost).

WHAT YOU'LL NEED
- sku (text)
- name (text)
- quantity (number or text)
- unitPrice (number or text)

Your task: Create the blueprint for an inventory item (SKU, title, stock, cost) and initialize the table component.`,
    hint: `1. Create type: Define your inventory type with sku, name, quantity, and unitPrice.
2. Set types: Use string for text and number for counts/costs.
3. Build container: Set up the component function shell.`,
    example_code: `export type StockItem = {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export function InventoryTable() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Inventory
  Sku: "WIDGET-01"
  Cost Price: "7.5"
  Stock On Hand: 20
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the real API's response above, one field looks like it should be a number but is actually sent as a string, and one is genuinely a number — what does the type need to name, and get right, for each, and what does the component that will render it need to be called?`,
    mc_options: ["Define type Item (costPrice/sellingPrice as string, stockOnHand as number), then export function InventoryTable() returning <div />", "Make every field a number since they are all quantities", "Wait until the table is built before deciding the type or the component"],
    mc_correct_option: "Define type Item (costPrice/sellingPrice as string, stockOnHand as number), then export function InventoryTable() returning <div />",
    mc_anchor: "Define type Item (costPrice/sellingPrice",
    why_this_matters: `A precise blueprint ensures that table columns correctly map to valid database properties.`,
    answer_keywords: ["export", "type", "Item", "sku", "costPrice", "sellingPrice", "stockOnHand", "function", "InventoryTable", "return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type matching exactly what the real API sends, then the component shell that will use it.",
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have — and matching the real API's actual response shape (string price fields included) is what keeps that contract honest. A component just needs to exist before it can render anything.`,
    expected: `export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

export function InventoryTable() {
  return <div />;
}
`,
    analog_example: `export type StockItem = {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export function InventoryTable() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A precise blueprint ensures that table columns correctly map to valid database properties.`,
      pain: "A type that guesses wrong about the API's real shape produces confusing runtime bugs that TypeScript should have caught but didn't.",
      mentalModel: `Build a screen that lists real inventory from a real backend:

  Fetch  →  every item, live from the real Mini ERP API
  Table  →  a real TanStack Table — sortable columns, not a plain <ul>
  Loading →  a message while the fetch is in flight
  Empty  →  a message if there are no items yet
`,
      discover: `export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

export function InventoryTable() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not assume a numeric-looking field is a number without checking what the real API actually sends.",
      dryRun: "Write the same step for a different resource with a real API you haven't used before — check its actual response shape first.",
      build: `type Item = { id: string; sku: string; name: string; costPrice: string; sellingPrice: string; stockOnHand: number; };\n\nexport function InventoryTable() { return <div />; }`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 6",
    paal: `Set up a storage container in state to hold the incoming catalog.

WHAT YOU'LL NEED
- useState typed with an array of your inventory blueprint.
- Initial value set to an empty array.

Your task: Create a state container in your component to hold the list of inventory items.`,
    hint: `1. Declare state: Call useState with your item type wrapped in array brackets: <StockItem[]>.
2. Initialize empty: Pass [] as the initial state so the page can mount safely before data loads.`,
    example_code: `const [inventory, setInventory] = useState<StockItem[]>([]);`,
    think_prompt: `React only redraws a component when the value it reads changes through React itself — a plain variable can change without React ever finding out, and the real inventory data hasn't even been fetched yet. Where should that eventually-filled array live so the screen redraws the moment it arrives?`,
    mc_options: ["const [items, setItems] = useState<Item[]>([]);", "let items = [];", "const items = fetch('/api/items');"],
    mc_correct_option: "const [items, setItems] = useState<Item[]>([]);",
    mc_anchor: "const [items, setItems] = useState<Item",
    why_this_matters: `Initializing with an empty array prevents "cannot read property of undefined" errors while fetching data.`,
    answer_keywords: ["useState", "items", "setItems", "Item"],
    seed_code: `import { useState } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

export function InventoryTable() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

export function InventoryTable() {
  // list state here
  return <div />;
}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "List data must live in useState, not a bare let.",
    pre_check_hint: `To re-render a component, we need to update the value it watches through React's own state mechanism — a hook that both holds the current value and gives you a setter to update it.`,
    expected: `import { useState } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);
  return <div />;
}
`,
    analog_example: `const [inventory, setInventory] = useState<StockItem[]>([]);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Initializing with an empty array prevents "cannot read property of undefined" errors while fetching data.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists real inventory from a real backend:

  Fetch  →  every item, live from the real Mini ERP API
  Table  →  a real TanStack Table — sortable columns, not a plain <ul>
  Loading →  a message while the fetch is in flight
  Empty  →  a message if there are no items yet
`,
      discover: `import { useState } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `useState<Item[]>([]). Import useState.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 6",
    paal: `Fetch the real inventory catalog from the API when the component first appears on screen.

WHAT YOU'LL NEED
- A useEffect hook running on mount (empty dependency array []).
- A fetch call targeting the inventory API endpoint.
- A state update saving the received data.

Your task: Load live inventory data from the server the moment the component displays.`,
    hint: `1. Hook setup: Wrap the request in useEffect with [] as the second argument.
2. Make the call: Fetch from your ERP inventory endpoint.
3. Store result: Convert response to json and pass the payload into your state setter.`,
    example_code: `useEffect(() => {
  fetch("/api/inventory")
    .then((res) => res.json())
    .then((data) => setInventory(data));
}, []);`,
    think_prompt: `A useEffect with an empty dependency array runs exactly once, right after the component's first render — the same moment a component "mounts." A fetch is asynchronous: its result only exists inside a .then() (or after an await), never as fetch()'s own direct return value. Given that, how do you get real data from the real API into this component's state as soon as it loads?`,
    mc_options: ["useEffect(() => { fetch(url).then((r) => r.json()).then((body) => setItems(body.data)); }, [])", "const data = fetch(url); setItems(data);", "Call fetch directly inside the JSX return"],
    mc_correct_option: "useEffect(() => { fetch(url).then((r) => r.json()).then((body) => setItems(body.data)); }, [])",
    mc_anchor: "useEffect(() => { fetch(url).then((r) =>",
    why_this_matters: `Running fetch inside useEffect ensures data is fetched once when the page loads rather than on every render.`,
    answer_keywords: ["useEffect", "fetch", "then", "setItems", "json"],
    seed_code: `import { useState } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);
  return <div />;
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);
  // fetch real data here
  return <div />;
}
`,
    feedback_correct: "Correct — real data now flows into state on mount.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "The fetch has to run inside a useEffect with an empty dependency array, and its result goes to setItems via .then(), not as a direct return value.",
    pre_check_hint: `fetch() returns a Promise, not the data itself — the real response only exists inside the .then() chain (or after an await), and a useEffect with an empty array is what makes that chain run exactly once when the component first appears.`,
    expected: `import { useState, useEffect } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("http://localhost:4100/api/items")
      .then((res) => res.json())
      .then((body) => setItems(body.data));
  }, []);

  return <div />;
}
`,
    analog_example: `useEffect(() => {
  fetch("/api/inventory")
    .then((res) => res.json())
    .then((data) => setInventory(data));
}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Running fetch inside useEffect ensures data is fetched once when the page loads rather than on every render.`,
      pain: "Skipping this step leaves the component with a type and a state slot, but no actual data ever arrives — it renders forever empty.",
      mentalModel: `Build a screen that lists real inventory from a real backend:

  Fetch  →  every item, live from the real Mini ERP API
  Table  →  a real TanStack Table — sortable columns, not a plain <ul>
  Loading →  a message while the fetch is in flight
  Empty  →  a message if there are no items yet
`,
      discover: `useEffect(() => {
  fetch("http://localhost:4100/api/items")
    .then((res) => res.json())
    .then((body) => setItems(body.data));
}, []);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not call fetch() directly inside the component body (outside useEffect) — that re-fetches on every single render, not once.",
      dryRun: "Write the same fetch-on-mount step for a different real endpoint on this same backend.",
      build: `useEffect(() => { fetch("http://localhost:4100/api/items").then((res) => res.json()).then((body) => setItems(body.data)); }, []);`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 6",
    paal: `Configure the spreadsheet columns using TanStack Table to map headers to data fields.

WHAT YOU'LL NEED
- Column definitions mapping headers to property keys.
- useReactTable hook connecting data and columns.

Your task: Configure the table's columns and initialize the TanStack Table instance.`,
    hint: `1. Define columns: Create an array where each object has accessorKey matching an item property and header for the column title.
2. Initialize table: Call useReactTable, passing your inventory state as data and your columns array.
3. Add core model: Supply getCoreRowModel: getCoreRowModel().`,
    example_code: `const columns = [
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "name", header: "Product" },
  { accessorKey: "quantity", header: "In Stock" },
];

const table = useReactTable({
  data: inventory,
  columns,
  getCoreRowModel: getCoreRowModel(),
});`,
    think_prompt: `A real table library separates "what the columns are" from "how to draw them" — createColumnHelper<Item>() gives you a typed builder for one column per field, and useReactTable turns that column list plus your data array into a table object with everything worked out (headers, rows, cells) but nothing rendered yet. What do the column definitions need to name, and what two things does useReactTable need to be handed?`,
    mc_options: ["Column definitions per field via createColumnHelper, then useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })", "Write raw <table> HTML by hand and skip the library entirely", "Call useReactTable with just the data array and let it guess the columns"],
    mc_correct_option: "Column definitions per field via createColumnHelper, then useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })",
    mc_anchor: "Column definitions per field via createCo",
    why_this_matters: `TanStack Table decouples table logic from rendering, making sorting and pagination easier to implement later.`,
    answer_keywords: ["createColumnHelper", "useReactTable", "getCoreRowModel", "columns", "accessor"],
    seed_code: `import { useState, useEffect } from "react";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("http://localhost:4100/api/items")
      .then((res) => res.json())
      .then((body) => setItems(body.data));
  }, []);

  return <div />;
}
`,
    starter_code: `import { useState, useEffect } from "react";
import { createColumnHelper, useReactTable, getCoreRowModel } from "@tanstack/react-table";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("http://localhost:4100/api/items")
      .then((res) => res.json())
      .then((body) => setItems(body.data));
  }, []);

  // define columns and instantiate the table here

  return <div />;
}
`,
    feedback_correct: "Correct — the table object is ready to render.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Define one column per field with createColumnHelper, then hand data + columns + getCoreRowModel() to useReactTable.",
    pre_check_hint: `createColumnHelper<Item>() is a typed builder — each .accessor(fieldName, { header }) call describes one column. useReactTable then combines that column list with your actual data array and getCoreRowModel() to compute a table object you'll render in the next step.`,
    expected: `import { useState, useEffect } from "react";
import { createColumnHelper, useReactTable, getCoreRowModel } from "@tanstack/react-table";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

const columnHelper = createColumnHelper<Item>();
const columns = [
  columnHelper.accessor("sku", { header: "SKU" }),
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("costPrice", { header: "Cost" }),
  columnHelper.accessor("sellingPrice", { header: "Price" }),
  columnHelper.accessor("stockOnHand", { header: "On Hand" }),
];

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("http://localhost:4100/api/items")
      .then((res) => res.json())
      .then((body) => setItems(body.data));
  }, []);

  const table = useReactTable({ data: items, columns, getCoreRowModel: getCoreRowModel() });

  return <div />;
}
`,
    analog_example: `const columns = [
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "name", header: "Product" },
  { accessorKey: "quantity", header: "In Stock" },
];

const table = useReactTable({
  data: inventory,
  columns,
  getCoreRowModel: getCoreRowModel(),
});`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `TanStack Table decouples table logic from rendering, making sorting and pagination easier to implement later.`,
      pain: "Skipping proper column definitions means falling back to a hand-rolled table with none of a real table library's features.",
      mentalModel: `Build a screen that lists real inventory from a real backend:

  Fetch  →  every item, live from the real Mini ERP API
  Table  →  a real TanStack Table — sortable columns, not a plain <ul>
  Loading →  a message while the fetch is in flight
  Empty  →  a message if there are no items yet
`,
      discover: `const columnHelper = createColumnHelper<Item>();
const columns = [
  columnHelper.accessor("sku", { header: "SKU" }),
  columnHelper.accessor("name", { header: "Name" }),
];
const table = useReactTable({ data: items, columns, getCoreRowModel: getCoreRowModel() });`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not define columns inside the component body on every render — TanStack Table expects a stable columns reference (module scope or memoized).",
      dryRun: "Define columns for a different real dataset with a different set of fields.",
      build: `createColumnHelper<Item>() + useReactTable({ data: items, columns, getCoreRowModel: getCoreRowModel() })`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 6",
    paal: `Draw table headers and data rows, displaying a loading message while fetching and an empty state if no stock exists.

WHAT YOU'LL NEED
- Conditional loading indicator while fetching.
- Table rendering header groups and row models.
- Empty message if data array is empty.

Your task: Render the HTML table using the TanStack instance, showing loading or empty indicators when appropriate.`,
    hint: `1. Empty check: Check if data is empty before rendering the table.
2. Render thead: Map table.getHeaderGroups() to <tr> and headers to <th> using flexRender.
3. Render tbody: Map table.getRowModel().rows to <tr> and visible cells to <td> using flexRender.`,
    example_code: `if (inventory.length === 0) return <p>No inventory items found.</p>;

return (
  <table>
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);`,
    think_prompt: `Right after the component mounts, the fetch hasn't resolved yet — items is still an empty array, exactly the same as it would look if the API had genuinely returned nothing. A real user needs to tell those two situations apart. Given a real table object from useReactTable, what does drawing its actual header and rows look like — and what has to be checked before you even get there?`,
    mc_options: ["a loading flag checked first, then length, then table.getHeaderGroups()/getRowModel().rows via flexRender", "always render the table, even with zero columns loaded", "skip the table object and hand-write <tr> tags from the raw items array"],
    mc_correct_option: "a loading flag checked first, then length, then table.getHeaderGroups()/getRowModel().rows via flexRender",
    mc_anchor: "a loading flag checked first, then lengt",
    why_this_matters: `Using flexRender properly delegates cell content formatting to TanStack Table.


================================================================================`,
    answer_keywords: ["loading", "setLoading", "getHeaderGroups", "getRowModel", "flexRender"],
    seed_code: `import { useState, useEffect } from "react";
import { createColumnHelper, useReactTable, getCoreRowModel } from "@tanstack/react-table";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

const columnHelper = createColumnHelper<Item>();
const columns = [
  columnHelper.accessor("sku", { header: "SKU" }),
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("costPrice", { header: "Cost" }),
  columnHelper.accessor("sellingPrice", { header: "Price" }),
  columnHelper.accessor("stockOnHand", { header: "On Hand" }),
];

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("http://localhost:4100/api/items")
      .then((res) => res.json())
      .then((body) => setItems(body.data));
  }, []);

  const table = useReactTable({ data: items, columns, getCoreRowModel: getCoreRowModel() });

  return <div />;
}
`,
    starter_code: `import { useState, useEffect } from "react";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

const columnHelper = createColumnHelper<Item>();
const columns = [
  columnHelper.accessor("sku", { header: "SKU" }),
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("costPrice", { header: "Cost" }),
  columnHelper.accessor("sellingPrice", { header: "Price" }),
  columnHelper.accessor("stockOnHand", { header: "On Hand" }),
];

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);
  // loading state here

  useEffect(() => {
    fetch("http://localhost:4100/api/items")
      .then((res) => res.json())
      .then((body) => setItems(body.data));
  }, []);

  const table = useReactTable({ data: items, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div>
      {/* loading or empty or table */}
    </div>
  );
}
`,
    feedback_correct: "Correct — the screen is done.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Branch on loading first, then on length, then draw the table from getHeaderGroups()/getRowModel().rows via flexRender.",
    pre_check_hint: `Checking two booleans in order (loading, then length === 0) before deciding what to render is just two nested conditionals. Once past both, table.getHeaderGroups() gives you the header row(s) and table.getRowModel().rows gives you the data rows — flexRender is what actually turns each column's definition into real JSX.`,
    expected: `import { useState, useEffect } from "react";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

export type Item = {
  id: string;
  sku: string;
  name: string;
  costPrice: string;
  sellingPrice: string;
  stockOnHand: number;
};

const columnHelper = createColumnHelper<Item>();
const columns = [
  columnHelper.accessor("sku", { header: "SKU" }),
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("costPrice", { header: "Cost" }),
  columnHelper.accessor("sellingPrice", { header: "Price" }),
  columnHelper.accessor("stockOnHand", { header: "On Hand" }),
];

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4100/api/items")
      .then((res) => res.json())
      .then((body) => {
        setItems(body.data);
        setLoading(false);
      });
  }, []);

  const table = useReactTable({ data: items, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div>
      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
`,
    analog_example: `if (inventory.length === 0) return <p>No inventory items found.</p>;

return (
  <table>
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Using flexRender properly delegates cell content formatting to TanStack Table.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists real inventory from a real backend:

  Fetch  →  every item, live from the real Mini ERP API
  Table  →  a real TanStack Table — sortable columns, not a plain <ul>
  Loading →  a message while the fetch is in flight
  Empty  →  a message if there are no items yet
`,
      discover: `{table.getRowModel().rows.map((row) => (
  <tr key={row.id}>
    {row.getVisibleCells().map((cell) => (
      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
    ))}
  </tr>
))}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not map the raw items array directly for rendering once a table object exists — always draw from table.getHeaderGroups()/getRowModel(), which is what keeps columns and rows in sync.",
      dryRun: "Write the same render step for a table with different columns.",
      build: `loading ? <p>Loading…</p> : items.length === 0 ? <p>No items found.</p> : <table>...via getHeaderGroups()/getRowModel()/flexRender...</table>`,
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
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Inventory master table",
  shortName: "Inventory table",
});
