import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-erp-po-form",
      title: "Purchase order form & receive modal",
      body: `Build the screen that creates a purchase order against a real vendor and item, then receives it for real:

  Form    →  pick a vendor, add item lines with quantity + unit price
  Create  →  POST a real PO to the real Mini ERP API
  Receive →  one click bumps real stock and posts a real ledger entry
  Reflect →  the screen shows the item's new stock and cost after receiving
`,
      usecase: "The backend (Fastify + Prisma + PostgreSQL) already implements PO creation and receiving — including moving-average cost recalculation and a balanced journal entry — for real. This task is frontend only, against real endpoints.",
      designMock: {"kind":"list-and-form","screenTitle":"Purchase Orders","caption":"This is the screen you are building — pick a vendor and items, create the PO, then receive it for real.","listCaption":"Vendor + item lines you're ordering","emptyCaption":"Nothing ordered yet","emptyMessage":"Add a line to get started.","rows":[{"title":"WIDGET-01 × 20","subtitle":"$7.50 / unit","meta":"line total $150.00"}],"fields":[{"label":"Vendor","sample":"Acme Supply Co."},{"label":"Quantity","sample":"20"},{"label":"Unit Price","sample":"7.50"}],"submitLabel":"Create PO","formMode":"create"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Define blueprints for vendors, items, and line items, then create the purchase order screen layout.","Set up memory storage for available vendors, item options, and the items currently added to the order.","Fetch active vendors and item catalogs from the server on initial load.","Submit the completed order to the server using a POST call, creating an official pending purchase order.","Send a receive confirmation call to the server to mark items arrived and immediately reflect updated warehouse counts."],
  },
  {
    // Redesign: the old template opened with two pure-scaffolding steps (create the file, write
    // an empty shell) before ever touching real data. Neither is a move in this task's actual
    // algorithm. This step merges all three: the real content is modeling the three distinct
    // shapes a PO form has to keep straight, and the component shell is just the container that
    // decision needs to live in — not a lesson of its own.
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

This file doesn't exist yet — you're the first to touch it. Create it at \`src/components/PurchaseOrderForm.tsx\` before anything else. Every step from here on edits that same file.

Define blueprints for vendors, items, and line items, then create the purchase order screen layout.

WHAT YOU'LL NEED
- Vendor type (id, name)
- ItemOption type (id, name, cost)
- OrderLine type (itemId, quantity, unitCost)

Your task: Define types for vendors, catalog items, and order lines, then assemble the component frame.`,
    hint: `1. Define entities: Write type declarations for vendors, catalog items, and order line entries.
2. Map fields: Ensure IDs and names are strings, and quantities and costs are numbers.
3. Component frame: Build the empty parent component.`,
    example_code: `export type Vendor = { id: string; name: string };
export type Product = { id: string; title: string; cost: number };
export type LineEntry = { productId: string; qty: number };

export function PurchaseOrderManager() {
  return <div />;
}`,
    think_prompt: `Three different shapes are in play here: a vendor to pick from, an item to pick from, and a line you're building to send. Unlike the inventory table's display-only costPrice/sellingPrice (strings, because that's what the API echoes back), quantity and unitPrice here are values *your form* sends as real numbers. What does each of the three types need to name, and what does the component that will hold them need to be called?`,
    mc_options: ["Three separate types (Vendor, ItemOption, OrderLine with numeric quantity/unitPrice), then export function PurchaseOrderForm() returning <div />", "One big type with every field optional", "Reuse the inventory table's Item type unchanged for everything"],
    mc_correct_option: "Three separate types (Vendor, ItemOption, OrderLine with numeric quantity/unitPrice), then export function PurchaseOrderForm() returning <div />",
    mc_anchor: "Three separate types (Vendor, ItemOption",
    why_this_matters: `Purchase orders combine multiple records; modeling all three types upfront prevents data mismatches between catalogs and line items.`,
    answer_keywords: ["type", "Vendor", "ItemOption", "OrderLine", "quantity", "unitPrice", "number", "export", "function", "PurchaseOrderForm"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — three distinct data shapes and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Write three separate types matching exactly what POST /api/po expects, then the component shell that will use them.",
    pre_check_hint: `POST /api/po expects { vendorId, items: [{ itemId, quantity, unitPrice }] } — quantity and unitPrice as real numbers, since your form is producing them, not echoing a decimal field back from the database. The component just needs to exist before it can render anything.`,
    expected: `export type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  return <div />;\n}\n`,
    analog_example: `export type Vendor = { id: string; name: string };
export type Product = { id: string; title: string; cost: number };
export type LineEntry = { productId: string; qty: number };

export function PurchaseOrderManager() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Purchase orders combine multiple records; modeling all three types upfront prevents data mismatches between catalogs and line items.`,
      pain: "Collapsing three different shapes into one loose type lets the wrong id slide into the wrong field silently.",
      mentalModel: `Build the screen that creates a purchase order against a real vendor and item, then receives it for real.`,
      discover: `export type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  return <div />;\n}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not type quantity/unitPrice as string here — they're real numbers your form produces, unlike the inventory table's echoed decimal strings.",
      dryRun: "Write the same three-type-plus-shell split for a different create-form against a different real API.",
      build: `type Vendor = { id: string; name: string }; type ItemOption = { id: string; sku: string; name: string }; type OrderLine = { itemId: string; quantity: number; unitPrice: number };\n\nexport function PurchaseOrderForm() { return <div />; }`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Set up memory storage for available vendors, item options, and the items currently added to the order.

WHAT YOU'LL NEED
- State for vendor list.
- State for product items.
- State for current order lines.

Your task: Set up state hooks for available vendors, catalog items, and active order lines.`,
    hint: `1. Vendors state: Initialize with an empty array of Vendor.
2. Products state: Initialize with an empty array of ItemOption.
3. Lines state: Initialize with an empty array of OrderLine.`,
    example_code: `const [vendors, setVendors] = useState<Vendor[]>([]);
const [products, setProducts] = useState<Product[]>([]);
const [orderLines, setOrderLines] = useState<LineEntry[]>([]);`,
    think_prompt: `This screen tracks five distinct pieces of changing data: two lists fetched from the API to pick from, the lines the learner is building, which vendor is selected, and the eventual created order. Each one needs React to know when it changes — what does that mean for how each is declared?`,
    mc_options: ["Five separate useState calls — vendors, items, lines, vendorId, po — each starting empty/null", "One useState holding a single object with all five keys mutated directly", "Plain variables for everything except the final po result"],
    mc_correct_option: "Five separate useState calls — vendors, items, lines, vendorId, po — each starting empty/null",
    mc_anchor: "Five separate useState calls",
    why_this_matters: `Isolating catalogs from the in-progress order ensures draft edits do not alter base vendor or product information.`,
    answer_keywords: ["useState", "vendors", "items", "lines", "vendorId", "po"],
    seed_code: `import { useState } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  return <div />;\n}\n`,
    starter_code: `import { useState } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  // state here\n  return <div />;\n}\n`,
    feedback_correct: "Correct — every piece of changing data has its own state slot.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Five separate useState calls, not one merged object or plain variables.",
    pre_check_hint: `Each of these five values changes independently and on its own schedule (vendors/items arrive once from a fetch, lines grow one at a time, vendorId flips on a single click, po appears only after a real POST succeeds) — separate state slots keep each change isolated.`,
    expected: `import { useState } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n  return <div />;\n}\n`,
    analog_example: `const [vendors, setVendors] = useState<Vendor[]>([]);
const [products, setProducts] = useState<Product[]>([]);
const [orderLines, setOrderLines] = useState<LineEntry[]>([]);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Isolating catalogs from the in-progress order ensures draft edits do not alter base vendor or product information.`,
      pain: "One merged state object invites accidental overwrites when updating just one field.",
      mentalModel: `Build the screen that creates a purchase order against a real vendor and item, then receives it for real.`,
      discover: `const [lines, setLines] = useState<OrderLine[]>([]);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not merge independent pieces of state into one object unless they genuinely change together.",
      dryRun: "Declare the same five-slot state shape for a different multi-part form.",
      build: `Five useState calls: vendors, items, lines, vendorId, po.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Fetch active vendors and item catalogs from the server on initial load.

WHAT YOU'LL NEED
- useEffect with [] dependency array.
- Promise.all or dual fetch calls requesting vendors and items.

Your task: Load live vendor and catalog lists from the API on mount.`,
    hint: `1. Use useEffect: Trigger requests on initial mount with [].
2. Load concurrently: Use Promise.all to fetch vendors and products in parallel.
3. Populate state: Update both state variables with their respective responses.`,
    example_code: `useEffect(() => {
  Promise.all([
    fetch("/api/vendors").then((r) => r.json()),
    fetch("/api/items").then((r) => r.json()),
  ]).then(([vendorData, itemData]) => {
    setVendors(vendorData);
    setProducts(itemData);
  });
}, []);`,
    think_prompt: `You've fetched one real endpoint on mount before for the inventory table. This form needs two, fired the same way, each filling its own state slot. What does firing both on mount look like?`,
    mc_options: ["useEffect(() => { fetch(vendorsUrl).then(r=>r.json()).then(b=>setVendors(b.data)); fetch(itemsUrl).then(r=>r.json()).then(b=>setItems(b.data)); }, [])", "Fetch vendors inside the vendor dropdown's onClick handler instead of on mount", "Call both fetches directly in the component body outside any effect"],
    mc_correct_option: "useEffect(() => { fetch(vendorsUrl).then(r=>r.json()).then(b=>setVendors(b.data)); fetch(itemsUrl).then(r=>r.json()).then(b=>setItems(b.data)); }, [])",
    mc_anchor: "useEffect(() => { fetch(vendorsUrl)",
    why_this_matters: `Loading both catalogs in parallel speeds up page readiness.`,
    answer_keywords: ["useEffect", "fetch", "vendors", "items", "setVendors", "setItems"],
    seed_code: `import { useState } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n  return <div />;\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n  // fetch vendors and items here\n  return <div />;\n}\n`,
    feedback_correct: "Correct — vendors and items now load for real on mount.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Both fetches belong inside one useEffect with an empty dependency array, each feeding its own setter via .then().",
    pre_check_hint: `Two independent fetches can both fire from the same mount-once effect — each just needs its own .then() chain into its own setter.`,
    expected: `import { useState, useEffect } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/vendors")\n      .then((res) => res.json())\n      .then((body) => setVendors(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  return <div />;\n}\n`,
    analog_example: `useEffect(() => {
  Promise.all([
    fetch("/api/vendors").then((r) => r.json()),
    fetch("/api/items").then((r) => r.json()),
  ]).then(([vendorData, itemData]) => {
    setVendors(vendorData);
    setProducts(itemData);
  });
}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Loading both catalogs in parallel speeds up page readiness.`,
      pain: "Fetching reference data anywhere other than mount means a form that's sometimes missing its own dropdown options.",
      mentalModel: `Build the screen that creates a purchase order against a real vendor and item, then receives it for real.`,
      discover: `fetch("http://localhost:4100/api/vendors").then((r) => r.json()).then((b) => setVendors(b.data));`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not nest the second fetch inside the first's .then() unless one genuinely depends on the other's result — here they don't, so fire both independently.",
      dryRun: "Fetch two independent reference lists on mount for a different form.",
      build: `Two independent fetch().then().then() chains inside one useEffect(() => {...}, []).`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Submit the completed order to the server using a POST call, creating an official pending purchase order.

WHAT YOU'LL NEED
- Submission handler triggering fetch with method POST.
- JSON payload containing vendorId and order lines.

Your task: Submit the constructed purchase order lines and selected vendor to the server via POST.`,
    hint: `1. Setup request: Call fetch targeting "/api/po" with method "POST".
2. Set headers: Include "Content-Type": "application/json".
3. Serialize body: Stringify an object containing the vendor ID and orderLines state.`,
    example_code: `async function submitOrder(vendorId: string) {
  const res = await fetch("/api/po", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vendorId, lines: orderLines }),
  });
  const newPo = await res.json();
  return newPo;
}`,
    think_prompt: `A real POST against a real backend, same shape as every other create-form in this app: send the payload, await the response, store what comes back. What does this one send, and where does the result go?`,
    mc_options: ["createPO POSTs {vendorId, items: lines} to /api/po and stores the response's data via setPo", "Skip storing the response — the button click is enough", "POST with no body and let the server guess the vendor and lines"],
    mc_correct_option: "createPO POSTs {vendorId, items: lines} to /api/po and stores the response's data via setPo",
    mc_anchor: "createPO POSTs {vendorId, items: lines}",
    why_this_matters: `Communicating via structured JSON ensures the ERP receives the purchase order formatted exactly as required.`,
    answer_keywords: ["createPO", "POST", "vendorId", "items", "setPo"],
    seed_code: `import { useState, useEffect } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/vendors")\n      .then((res) => res.json())\n      .then((body) => setVendors(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  return <div />;\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/vendors")\n      .then((res) => res.json())\n      .then((body) => setVendors(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  // createPO here\n\n  return (\n    <div>\n      {/* Create PO button, and once po exists: its status */}\n    </div>\n  );\n}\n`,
    feedback_correct: "Correct — a real purchase order now exists on the server.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "createPO must POST {vendorId, items: lines} and store the response's data via setPo.",
    pre_check_hint: `A real POST is just fetch with a method and a JSON body — the part that matters here is not skipping the response and actually storing it, since the next step needs po.id from it.`,
    expected: `import { useState, useEffect } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/vendors")\n      .then((res) => res.json())\n      .then((body) => setVendors(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  async function createPO() {\n    const res = await fetch("http://localhost:4100/api/po", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ vendorId, items: lines }),\n    });\n    const body = await res.json();\n    setPo(body.data);\n  }\n\n  return (\n    <div>\n      <button onClick={createPO}>Create PO</button>\n      {po && <p>Status: {po.status}</p>}\n    </div>\n  );\n}\n`,
    analog_example: `async function submitOrder(vendorId: string) {
  const res = await fetch("/api/po", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vendorId, lines: orderLines }),
  });
  const newPo = await res.json();
  return newPo;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Communicating via structured JSON ensures the ERP receives the purchase order formatted exactly as required.`,
      pain: "Discarding the create response means the screen has no real po.id to receive against later.",
      mentalModel: `Build the screen that creates a purchase order against a real vendor and item, then receives it for real.`,
      discover: `async function createPO() {\n  const res = await fetch("http://localhost:4100/api/po", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ vendorId, items: lines }),\n  });\n  const body = await res.json();\n  setPo(body.data);\n}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not fire the POST and ignore the response — the next step needs po.id from it.",
      dryRun: "Write the same create-and-store pattern for a different real create endpoint.",
      build: `createPO() POSTs {vendorId, items: lines} to /api/po and stores the response via setPo.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Send a receive confirmation call to the server to mark items arrived and immediately reflect updated warehouse counts.

WHAT YOU'LL NEED
- Function taking the purchase order ID.
- POST request to /api/po/:id/receive.
- Refresh or state update reflecting newly received stock levels.

Your task: Confirm receipt of goods by calling the receive endpoint and updating screen data.`,
    hint: `1. Construct URL: Inject the target PO's ID into the endpoint URL.
2. Trigger POST: Send the receive command to the backend.
3. Handle success: On a successful response, update local state or re-fetch items to display updated warehouse counts.`,
    example_code: `async function receivePo(poId: string) {
  const res = await fetch(\`/api/po/\${poId}/receive\`, { method: "POST" });
  if (res.ok) {
    // refresh catalog or trigger inventory reload
  }
}`,
    think_prompt: `Two real, sequential POSTs: the first creates a PO and only then do you have a real po.id to receive against. What does the receive call send, and what does it do with what comes back?`,
    mc_options: ["receivePO POSTs to /api/po/:id/receive using po.id and stores data.po via setPo", "receivePO can run before po exists, using a placeholder id", "Skip storing the receive response — the click alone is proof enough"],
    mc_correct_option: "receivePO POSTs to /api/po/:id/receive using po.id and stores data.po via setPo",
    mc_anchor: "receivePO POSTs to /api/po/:id/receive",
    why_this_matters: `Closing the loop on the PO updates inventory numbers without requiring a full browser refresh.


================================================================================`,
    answer_keywords: ["receivePO", "POST", "receive", "po.id", "setPo"],
    seed_code: `import { useState, useEffect } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/vendors")\n      .then((res) => res.json())\n      .then((body) => setVendors(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  async function createPO() {\n    const res = await fetch("http://localhost:4100/api/po", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ vendorId, items: lines }),\n    });\n    const body = await res.json();\n    setPo(body.data);\n  }\n\n  return (\n    <div>\n      <button onClick={createPO}>Create PO</button>\n      {po && <p>Status: {po.status}</p>}\n    </div>\n  );\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/vendors")\n      .then((res) => res.json())\n      .then((body) => setVendors(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  async function createPO() {\n    const res = await fetch("http://localhost:4100/api/po", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ vendorId, items: lines }),\n    });\n    const body = await res.json();\n    setPo(body.data);\n  }\n\n  // receivePO here\n\n  return (\n    <div>\n      <button onClick={createPO}>Create PO</button>\n      {po && (\n        <div>\n          <p>Status: {po.status}</p>\n          {/* Receive Goods button once po exists and isn't already received */}\n        </div>\n      )}\n    </div>\n  );\n}\n`,
    feedback_correct: "Correct — the screen creates and receives a real purchase order end to end.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "receivePO must POST to /api/po/:id/receive using the created po's real id, and store data.po.",
    pre_check_hint: `Receiving requires a real po.id, which only exists after createPO's response comes back — that's why receivePO reads po.id rather than anything computed earlier.`,
    expected: `import { useState, useEffect } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/vendors")\n      .then((res) => res.json())\n      .then((body) => setVendors(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  async function createPO() {\n    const res = await fetch("http://localhost:4100/api/po", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ vendorId, items: lines }),\n    });\n    const body = await res.json();\n    setPo(body.data);\n  }\n\n  async function receivePO() {\n    const res = await fetch(\`http://localhost:4100/api/po/\${po.id}/receive\`, { method: "POST" });\n    const body = await res.json();\n    setPo(body.data.po);\n  }\n\n  return (\n    <div>\n      <button onClick={createPO}>Create PO</button>\n      {po && (\n        <div>\n          <p>Status: {po.status}</p>\n          {po.status !== "RECEIVED" && <button onClick={receivePO}>Receive Goods</button>}\n        </div>\n      )}\n    </div>\n  );\n}\n`,
    analog_example: `async function receivePo(poId: string) {
  const res = await fetch(\`/api/po/\${poId}/receive\`, { method: "POST" });
  if (res.ok) {
    // refresh catalog or trigger inventory reload
  }
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Closing the loop on the PO updates inventory numbers without requiring a full browser refresh.


================================================================================`,
      pain: "Skipping the real receive call means the form looks done but never touches actual stock or the ledger.",
      mentalModel: `Build the screen that creates a purchase order against a real vendor and item, then receives it for real.`,
      discover: `async function receivePO() {\n  const res = await fetch(\`http://localhost:4100/api/po/\${po.id}/receive\`, { method: "POST" });\n  const body = await res.json();\n  setPo(body.data.po);\n}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not call receivePO before po exists — there is no id to receive against yet.",
      dryRun: "Write the same create-then-act pattern for a different two-step real workflow.",
      build: `createPO() POSTs to /api/po; receivePO() POSTs to /api/po/\${po.id}/receive once po exists.`,
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
  title: "Purchase order form & receive modal",
  shortName: "PO form",
});
