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
    items: [
      "Model the vendor, item option, and order-line shapes, then set up the component around them",
      "Store vendors, items, and the in-progress order lines in React state",
      "Fetch real vendors and items from the Mini ERP API when the component mounts",
      "Create a real purchase order with POST /api/po",
      "Receive the purchase order for real with POST /api/po/:id/receive and reflect the updated stock and cost",
    ],
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
    paal: `Model the vendor, item option, and order-line shapes, then set up the component around them

MOCK DATA
  Vendor: { id: "v1", name: "Acme Supply Co." }
  Item:   { id: "i1", sku: "WIDGET-01", name: "Widget" }
  Line:   { itemId: "i1", quantity: 20, unitPrice: 7.5 }

The real POST /api/po body is { vendorId, items: [{ itemId, quantity, unitPrice }] } — quantity and unitPrice are real JSON numbers here (not strings like the inventory table's display fields), because this is what your form sends, not what the API echoes back.

Your task: write \`type Vendor\` (id, name), \`type ItemOption\` (id, sku, name), and \`type OrderLine\` (itemId, quantity, unitPrice) — quantity and unitPrice as number — then define and export PurchaseOrderForm as a function component returning <div /> — every step from here on edits this same file.`,
    hint: `type Vendor = { id: string; name: string; };\ntype ItemOption = { id: string; sku: string; name: string; };\ntype OrderLine = { itemId: string; quantity: number; unitPrice: number; };\n\nexport function PurchaseOrderForm() {\n  return <div />;\n}`,
    example_code: `export type Item = {\n  id: string;\n  sku: string;\n  name: string;\n  costPrice: string;\n  sellingPrice: string;\n  stockOnHand: number;\n};\n\nexport function InventoryTable() {\n  return <div />;\n}`,
    think_prompt: `Three different shapes are in play here: a vendor to pick from, an item to pick from, and a line you're building to send. Unlike the inventory table's display-only costPrice/sellingPrice (strings, because that's what the API echoes back), quantity and unitPrice here are values *your form* sends as real numbers. What does each of the three types need to name, and what does the component that will hold them need to be called?`,
    mc_options: ["Three separate types (Vendor, ItemOption, OrderLine with numeric quantity/unitPrice), then export function PurchaseOrderForm() returning <div />", "One big type with every field optional", "Reuse the inventory table's Item type unchanged for everything"],
    mc_correct_option: "Three separate types (Vendor, ItemOption, OrderLine with numeric quantity/unitPrice), then export function PurchaseOrderForm() returning <div />",
    mc_anchor: "Three separate types (Vendor, ItemOption",
    why_this_matters: `A form has three different kinds of data in play — what you can pick from, and what you're building to send. Keeping them as separate, precisely-typed shapes is what stops a vendor id from being passed where an item id belongs. Naming and exporting the component next to them is what lets every later step — vendor state, the create call, the receive call — attach to something real.`,
    answer_keywords: ["type", "Vendor", "ItemOption", "OrderLine", "quantity", "unitPrice", "number", "export", "function", "PurchaseOrderForm"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — three distinct data shapes and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Write three separate types matching exactly what POST /api/po expects, then the component shell that will use them.",
    pre_check_hint: `POST /api/po expects { vendorId, items: [{ itemId, quantity, unitPrice }] } — quantity and unitPrice as real numbers, since your form is producing them, not echoing a decimal field back from the database. The component just needs to exist before it can render anything.`,
    expected: `export type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  return <div />;\n}\n`,
    analog_example: `export type Item = {\n  id: string;\n  sku: string;\n  name: string;\n  costPrice: string;\n  sellingPrice: string;\n  stockOnHand: number;\n};\n\nexport function InventoryTable() {\n  return <div />;\n}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A form built around one giant type invites bugs where a vendor's id ends up where an item's id belongs. Three narrow types, each matching exactly one real shape, make that mistake a compile error instead of a runtime surprise — and pairing them with the component's own shell in the same step turns this from "a types file" into a real, mergeable start on the actual screen.`,
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
    paal: `Store vendors, items, and the in-progress order lines in React state

Your task: hold vendors (Vendor[]), items (ItemOption[]), lines (OrderLine[]), a selected vendorId (string), and the created purchase order result (any, starting null) — all in useState, all starting empty/null.`,
    hint: `const [vendors, setVendors] = useState<Vendor[]>([]);\nconst [items, setItems] = useState<ItemOption[]>([]);\nconst [lines, setLines] = useState<OrderLine[]>([]);\nconst [vendorId, setVendorId] = useState("");\nconst [po, setPo] = useState<any>(null);`,
    example_code: `const [guests, setGuests] = useState<Guest[]>([]);`,
    think_prompt: `This screen tracks five distinct pieces of changing data: two lists fetched from the API to pick from, the lines the learner is building, which vendor is selected, and the eventual created order. Each one needs React to know when it changes — what does that mean for how each is declared?`,
    mc_options: ["Five separate useState calls — vendors, items, lines, vendorId, po — each starting empty/null", "One useState holding a single object with all five keys mutated directly", "Plain variables for everything except the final po result"],
    mc_correct_option: "Five separate useState calls — vendors, items, lines, vendorId, po — each starting empty/null",
    mc_anchor: "Five separate useState calls",
    why_this_matters: `Every one of these five values needs to trigger a re-render when it changes — the vendor dropdown, the line list, and the eventual receipt all read directly from this state.`,
    answer_keywords: ["useState", "vendors", "items", "lines", "vendorId", "po"],
    seed_code: `import { useState } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  return <div />;\n}\n`,
    starter_code: `import { useState } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  // state here\n  return <div />;\n}\n`,
    feedback_correct: "Correct — every piece of changing data has its own state slot.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Five separate useState calls, not one merged object or plain variables.",
    pre_check_hint: `Each of these five values changes independently and on its own schedule (vendors/items arrive once from a fetch, lines grow one at a time, vendorId flips on a single click, po appears only after a real POST succeeds) — separate state slots keep each change isolated.`,
    expected: `import { useState } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n  return <div />;\n}\n`,
    analog_example: `const [guests, setGuests] = useState<Guest[]>([]);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Five state slots instead of one merged object means updating the line list never accidentally clobbers the selected vendor or the fetched item list in the same render.`,
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
    paal: `Fetch real vendors and items from the Mini ERP API when the component mounts

Your task: inside a useEffect that runs once on mount, fetch("http://localhost:4100/api/vendors") and fetch("http://localhost:4100/api/items"), read each response's \`data\` array, and store them with setVendors and setItems.`,
    hint: `useEffect(() => {\n  fetch("http://localhost:4100/api/vendors").then((r) => r.json()).then((b) => setVendors(b.data));\n  fetch("http://localhost:4100/api/items").then((r) => r.json()).then((b) => setItems(b.data));\n}, []);`,
    example_code: `useEffect(() => {\n  fetch("http://localhost:4100/api/items")\n    .then((res) => res.json())\n    .then((body) => setItems(body.data));\n}, []);`,
    think_prompt: `You've fetched one real endpoint on mount before for the inventory table. This form needs two, fired the same way, each filling its own state slot. What does firing both on mount look like?`,
    mc_options: ["useEffect(() => { fetch(vendorsUrl).then(r=>r.json()).then(b=>setVendors(b.data)); fetch(itemsUrl).then(r=>r.json()).then(b=>setItems(b.data)); }, [])", "Fetch vendors inside the vendor dropdown's onClick handler instead of on mount", "Call both fetches directly in the component body outside any effect"],
    mc_correct_option: "useEffect(() => { fetch(vendorsUrl).then(r=>r.json()).then(b=>setVendors(b.data)); fetch(itemsUrl).then(r=>r.json()).then(b=>setItems(b.data)); }, [])",
    mc_anchor: "useEffect(() => { fetch(vendorsUrl)",
    why_this_matters: `Same fetch-on-mount pattern as the inventory table, run twice — this is the one skill every real, API-backed dropdown in this app depends on.`,
    answer_keywords: ["useEffect", "fetch", "vendors", "items", "setVendors", "setItems"],
    seed_code: `import { useState } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n  return <div />;\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n  // fetch vendors and items here\n  return <div />;\n}\n`,
    feedback_correct: "Correct — vendors and items now load for real on mount.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Both fetches belong inside one useEffect with an empty dependency array, each feeding its own setter via .then().",
    pre_check_hint: `Two independent fetches can both fire from the same mount-once effect — each just needs its own .then() chain into its own setter.`,
    expected: `import { useState, useEffect } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/vendors")\n      .then((res) => res.json())\n      .then((body) => setVendors(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  return <div />;\n}\n`,
    analog_example: `useEffect(() => {\n  fetch("http://localhost:4100/api/items")\n    .then((res) => res.json())\n    .then((body) => setItems(body.data));\n}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Two independent fetches in one mount-once effect is the normal shape of a real form that needs more than one dropdown's worth of reference data — neither fetch waits on the other.`,
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
    paal: `Create the purchase order for real, then receive it for real

Your task: write an async function \`createPO\` that POSTs { vendorId, items: lines } as JSON to http://localhost:4100/api/po, reads the response's \`data\`, and stores it with setPo. Then write \`receivePO\` that POSTs to \`http://localhost:4100/api/po/\${po.id}/receive\` (once po exists) and again stores the response's \`data\` with setPo. Render a "Create PO" button calling createPO, and — once po exists — a "Receive Goods" button calling receivePO, plus the current po.status.`,
    hint: `async function createPO() {\n  const res = await fetch("http://localhost:4100/api/po", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ vendorId, items: lines }),\n  });\n  const body = await res.json();\n  setPo(body.data);\n}\n\nasync function receivePO() {\n  const res = await fetch(\`http://localhost:4100/api/po/\${po.id}/receive\`, { method: "POST" });\n  const body = await res.json();\n  setPo(body.data.po);\n}`,
    example_code: `async function createGuest() {\n  const res = await fetch("https://api.example.com/guests", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ name }),\n  });\n  const data = await res.json();\n  setGuests((prev) => [...prev, data]);\n}`,
    think_prompt: `Two real, sequential POSTs: the first creates a PO and only then do you have a real po.id to receive against. What does each call send, and what does each do with what comes back?`,
    mc_options: ["createPO POSTs {vendorId, items: lines} to /api/po and stores data; receivePO POSTs to /api/po/:id/receive using po.id and stores data.po", "One function that both creates and receives in a single POST", "Skip storing the create response — just call receive immediately with a made-up id"],
    mc_correct_option: "createPO POSTs {vendorId, items: lines} to /api/po and stores data; receivePO POSTs to /api/po/:id/receive using po.id and stores data.po",
    mc_anchor: "createPO POSTs {vendorId, items: lines}",
    why_this_matters: `This is the real create-then-act-on-it pattern behind every workflow screen in this app: you cannot receive a purchase order that does not exist yet, so the created po's real id is what makes the second call possible at all.`,
    answer_keywords: ["createPO", "receivePO", "POST", "vendorId", "items", "receive", "setPo"],
    seed_code: `import { useState, useEffect } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/vendors")\n      .then((res) => res.json())\n      .then((body) => setVendors(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  return <div />;\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/vendors")\n      .then((res) => res.json())\n      .then((body) => setVendors(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  // createPO and receivePO here\n\n  return (\n    <div>\n      {/* Create PO button, and once po exists: status + Receive Goods button */}\n    </div>\n  );\n}\n`,
    feedback_correct: "Correct — the screen creates and receives a real purchase order end to end.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "createPO must send {vendorId, items: lines} and store the response; receivePO must use the created po's real id.",
    pre_check_hint: `Receiving requires a real po.id, which only exists after createPO's response comes back — that's why receivePO reads po.id rather than anything computed earlier.`,
    expected: `import { useState, useEffect } from "react";\n\nexport type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function PurchaseOrderForm() {\n  const [vendors, setVendors] = useState<Vendor[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [vendorId, setVendorId] = useState("");\n  const [po, setPo] = useState<any>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/vendors")\n      .then((res) => res.json())\n      .then((body) => setVendors(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  async function createPO() {\n    const res = await fetch("http://localhost:4100/api/po", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ vendorId, items: lines }),\n    });\n    const body = await res.json();\n    setPo(body.data);\n  }\n\n  async function receivePO() {\n    const res = await fetch(\`http://localhost:4100/api/po/\${po.id}/receive\`, { method: "POST" });\n    const body = await res.json();\n    setPo(body.data.po);\n  }\n\n  return (\n    <div>\n      <button onClick={createPO}>Create PO</button>\n      {po && (\n        <div>\n          <p>Status: {po.status}</p>\n          {po.status !== "RECEIVED" && <button onClick={receivePO}>Receive Goods</button>}\n        </div>\n      )}\n    </div>\n  );\n}\n`,
    analog_example: `async function createGuest() {\n  const res = await fetch("https://api.example.com/guests", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ name }),\n  });\n  const data = await res.json();\n  setGuests((prev) => [...prev, data]);\n}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `The real /api/po/:id/receive endpoint does far more than flip a status flag — inside one database transaction it bumps stock, recalculates moving-average cost, and posts a balanced Inventory/Accounts-Payable journal entry. Your click is the one thing standing between "on paper" and "for real."`,
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
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Purchase order form & receive modal",
  shortName: "PO form",
});
