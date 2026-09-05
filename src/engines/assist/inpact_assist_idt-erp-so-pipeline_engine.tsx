import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-erp-so-pipeline",
      title: "Sales order pipeline view",
      body: `Build the screen that sells real inventory without ever overselling it:

  Form     →  pick a customer, add item lines with quantity + unit price
  Create   →  POST a real SO — the real API blocks it if you'd oversell
  Fulfill  →  one click ships the order and posts a real revenue + COGS entry
  Reflect  →  status moves from DRAFT to SHIPPED on screen, for real
`,
      usecase: "The backend (Fastify + Prisma + PostgreSQL) already implements the oversell guard and fulfillment — including the 4-line balanced revenue/COGS journal entry — for real. This task is frontend only, against real endpoints.",
      designMock: {"kind":"list-and-form","screenTitle":"Sales Orders","caption":"This is the screen you are building — pick a customer and items, create the SO, then fulfill it for real.","listCaption":"Customer + item lines you're selling","emptyCaption":"Nothing ordered yet","emptyMessage":"Add a line to get started.","rows":[{"title":"WIDGET-01 × 5","subtitle":"$25.00 / unit","meta":"line total $125.00"}],"fields":[{"label":"Customer","sample":"Riverside Cafe"},{"label":"Quantity","sample":"5"},{"label":"Unit Price","sample":"25.00"}],"submitLabel":"Create SO","formMode":"create"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Model the customer, item option, and order-line shapes, then set up the component around them",
      "Store customers, items, the in-progress order lines, and any error in React state",
      "Fetch real customers and items from the Mini ERP API when the component mounts",
      "Create a real sales order with POST /api/so, surfacing a real oversell error if it's blocked",
      "Fulfill the sales order for real with POST /api/so/:id/fulfill and reflect its status change",
    ],
  },
  {
    // Redesign: merges the old "create the file" + "empty shell" scaffolding steps into the real
    // data-modeling step — neither was a move in this task's actual algorithm on its own.
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: `Model the customer, item option, and order-line shapes, then set up the component around them

MOCK DATA
  Customer: { id: "c1", name: "Riverside Cafe" }
  Item:     { id: "i1", sku: "WIDGET-01", name: "Widget" }
  Line:     { itemId: "i1", quantity: 5, unitPrice: 25 }

The real POST /api/so body is { customerId, items: [{ itemId, quantity, unitPrice }] } — same shape as the purchase order's line, because both forms send a real number for quantity and unitPrice.

Your task: write \`type Customer\` (id, name), \`type ItemOption\` (id, sku, name), and \`type OrderLine\` (itemId, quantity, unitPrice) — quantity and unitPrice as number — then define and export SalesOrderPipeline as a function component returning <div /> — every step from here on edits this same file.`,
    hint: `type Customer = { id: string; name: string; };\ntype ItemOption = { id: string; sku: string; name: string; };\ntype OrderLine = { itemId: string; quantity: number; unitPrice: number; };\n\nexport function SalesOrderPipeline() {\n  return <div />;\n}`,
    example_code: `export type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport function PurchaseOrderForm() {\n  return <div />;\n}`,
    think_prompt: `You've written this exact OrderLine shape once already for the purchase order. What changes here is the picker — a customer instead of a vendor — while the line itself stays identical, because both APIs send the same {itemId, quantity, unitPrice} shape. What do the three types need to name, and what does the component that will hold them need to be called?`,
    mc_options: ["Three separate types (Customer, ItemOption, OrderLine with numeric quantity/unitPrice), then export function SalesOrderPipeline() returning <div />", "Reuse the Vendor type renamed, since it has the same fields", "One big type with every field optional"],
    mc_correct_option: "Three separate types (Customer, ItemOption, OrderLine with numeric quantity/unitPrice), then export function SalesOrderPipeline() returning <div />",
    mc_anchor: "Three separate types (Customer, ItemOption",
    why_this_matters: `Even though Customer and Vendor happen to share the same two fields today, they represent different real entities in the database — keeping them as separate named types is what stops a customer id from being sent where the API expects a vendor id (and here, there is no vendor id at all). Naming and exporting the component next to them is what lets every later step attach to something real.`,
    answer_keywords: ["type", "Customer", "ItemOption", "OrderLine", "quantity", "unitPrice", "number", "export", "function", "SalesOrderPipeline"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — three distinct data shapes and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Write three separate types matching exactly what POST /api/so expects, then the component shell that will use them.",
    pre_check_hint: `POST /api/so expects { customerId, items: [{ itemId, quantity, unitPrice }] } — the same OrderLine shape as the purchase order. The component just needs to exist before it can render anything.`,
    expected: `export type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  return <div />;\n}\n`,
    analog_example: `export type Vendor = {\n  id: string;\n  name: string;\n};\n\nexport function PurchaseOrderForm() {\n  return <div />;\n}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Customer and Vendor look identical today (id + name) but name genuinely different real-world entities — a real codebase keeps them as separate types even when the shape briefly coincides, because that shape can diverge the moment either entity needs a new field. Pairing that with the component's own shell in the same step turns this from "a types file" into a real, mergeable start on the actual screen.`,
      pain: "Collapsing two different real entities into one shared type because they happen to look alike today breaks the moment either one needs its own field.",
      mentalModel: `Build the screen that sells real inventory without ever overselling it.`,
      discover: `export type Customer = {\n  id: string;\n  name: string;\n};\n\nexport function SalesOrderPipeline() {\n  return <div />;\n}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not reuse the Vendor type for Customer just because the fields currently match.",
      dryRun: "Write the same three-type-plus-shell split for a different create-form against a different real API.",
      build: `type Customer = { id: string; name: string }; type ItemOption = { id: string; sku: string; name: string }; type OrderLine = { itemId: string; quantity: number; unitPrice: number };\n\nexport function SalesOrderPipeline() { return <div />; }`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: `Store customers, items, the in-progress order lines, and any error in React state

Your task: hold customers (Customer[]), items (ItemOption[]), lines (OrderLine[]), a selected customerId (string), the created sales order result (any, starting null), and an error message (string, starting empty) — all in useState.`,
    hint: `const [customers, setCustomers] = useState<Customer[]>([]);\nconst [items, setItems] = useState<ItemOption[]>([]);\nconst [lines, setLines] = useState<OrderLine[]>([]);\nconst [customerId, setCustomerId] = useState("");\nconst [so, setSo] = useState<any>(null);\nconst [error, setError] = useState("");`,
    example_code: `const [vendors, setVendors] = useState<Vendor[]>([]);`,
    think_prompt: `This screen tracks the same shape of state as the purchase order form, plus one new thing: a real oversell attempt returns a 409 the UI has to show. Where does that error message live?`,
    mc_options: ["Six separate useState calls — customers, items, lines, customerId, so, error — each starting empty/null/\"\"", "Reuse the purchase order's state variables directly without an error slot", "Throw the oversell error and let it crash instead of storing it"],
    mc_correct_option: "Six separate useState calls — customers, items, lines, customerId, so, error — each starting empty/null/\"\"",
    mc_anchor: "Six separate useState calls",
    why_this_matters: `The real API blocks an oversell with a 409 and a message — that message needs its own state slot so the screen can show it instead of silently failing.`,
    answer_keywords: ["useState", "customers", "items", "lines", "customerId", "so", "error"],
    seed_code: `import { useState } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  return <div />;\n}\n`,
    starter_code: `import { useState } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  // state here\n  return <div />;\n}\n`,
    feedback_correct: "Correct — the error slot is what makes a real oversell block visible on screen.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Six separate useState calls, including a string error state for a real oversell block.",
    pre_check_hint: `Every one of these six values changes independently and needs React to notice — including the error message, which starts empty and only fills in if the real API rejects the order.`,
    expected: `import { useState } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n  return <div />;\n}\n`,
    analog_example: `const [vendors, setVendors] = useState<Vendor[]>([]);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `An error message that lives in real state, not a thrown exception nobody catches, is what turns "the API said no" into something a real user can actually read and react to.`,
      pain: "An uncaught rejection or an ignored error response leaves a user staring at a screen that silently did nothing.",
      mentalModel: `Build the screen that sells real inventory without ever overselling it.`,
      discover: `const [error, setError] = useState("");`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not skip the error state just because the happy path doesn't need it — the oversell guard is the whole point of this task.",
      dryRun: "Add the same error-state slot to a different form that can be rejected by its real API.",
      build: `Six useState calls: customers, items, lines, customerId, so, error.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: `Fetch real customers and items from the Mini ERP API when the component mounts

Your task: inside a useEffect that runs once on mount, fetch("http://localhost:4100/api/customers") and fetch("http://localhost:4100/api/items"), read each response's \`data\` array, and store them with setCustomers and setItems.`,
    hint: `useEffect(() => {\n  fetch("http://localhost:4100/api/customers").then((r) => r.json()).then((b) => setCustomers(b.data));\n  fetch("http://localhost:4100/api/items").then((r) => r.json()).then((b) => setItems(b.data));\n}, []);`,
    example_code: `useEffect(() => {\n  fetch("http://localhost:4100/api/vendors")\n    .then((res) => res.json())\n    .then((body) => setVendors(body.data));\n}, []);`,
    think_prompt: `Same fetch-on-mount pattern you've now used for the inventory table and the purchase order form, aimed at two new endpoints. What does firing both on mount look like here?`,
    mc_options: ["useEffect(() => { fetch(customersUrl).then(r=>r.json()).then(b=>setCustomers(b.data)); fetch(itemsUrl).then(r=>r.json()).then(b=>setItems(b.data)); }, [])", "Fetch customers inside the customer dropdown's onClick handler instead of on mount", "Call both fetches directly in the component body outside any effect"],
    mc_correct_option: "useEffect(() => { fetch(customersUrl).then(r=>r.json()).then(b=>setCustomers(b.data)); fetch(itemsUrl).then(r=>r.json()).then(b=>setItems(b.data)); }, [])",
    mc_anchor: "useEffect(() => { fetch(customersUrl)",
    why_this_matters: `Third time using this exact fetch-on-mount pattern — by now it should be a pattern you recognize instantly, not something you re-derive from scratch.`,
    answer_keywords: ["useEffect", "fetch", "customers", "items", "setCustomers", "setItems"],
    seed_code: `import { useState } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n  return <div />;\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n  // fetch customers and items here\n  return <div />;\n}\n`,
    feedback_correct: "Correct — customers and items now load for real on mount.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Both fetches belong inside one useEffect with an empty dependency array, each feeding its own setter via .then().",
    pre_check_hint: `Same shape as the purchase order form's dual fetch — just two different real endpoints this time.`,
    expected: `import { useState, useEffect } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/customers")\n      .then((res) => res.json())\n      .then((body) => setCustomers(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  return <div />;\n}\n`,
    analog_example: `useEffect(() => {\n  fetch("http://localhost:4100/api/vendors")\n    .then((res) => res.json())\n    .then((body) => setVendors(body.data));\n}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A pattern used a third time stops being "the fetch step" and starts being a tool you reach for automatically — that's the actual goal of repetition across these tasks.`,
      pain: "Fetching reference data anywhere other than mount means a form that's sometimes missing its own dropdown options.",
      mentalModel: `Build the screen that sells real inventory without ever overselling it.`,
      discover: `fetch("http://localhost:4100/api/customers").then((r) => r.json()).then((b) => setCustomers(b.data));`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not nest the second fetch inside the first's .then() — they don't depend on each other.",
      dryRun: "Fetch two independent reference lists on mount for a different form.",
      build: `Two independent fetch().then().then() chains inside one useEffect(() => {...}, []).`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: `Create the sales order for real, surface a real oversell block, then fulfill it for real

Your task: write an async function \`createSO\` that POSTs { customerId, items: lines } as JSON to http://localhost:4100/api/so. On a 409 response, read the response's \`message\` and store it with setError instead of setting so. On success, store the response's \`data\` with setSo and clear the error. Then write \`fulfillSO\` that POSTs to \`http://localhost:4100/api/so/\${so.id}/fulfill\` (once so exists) and stores the response's \`data.order\` with setSo. Render a "Create SO" button, the error message if one exists, and — once so exists — the current so.status plus a "Fulfill" button.`,
    hint: `async function createSO() {\n  const res = await fetch("http://localhost:4100/api/so", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ customerId, items: lines }),\n  });\n  const body = await res.json();\n  if (res.status === 409) {\n    setError(body.message);\n  } else {\n    setSo(body.data);\n    setError("");\n  }\n}\n\nasync function fulfillSO() {\n  const res = await fetch(\`http://localhost:4100/api/so/\${so.id}/fulfill\`, { method: "POST" });\n  const body = await res.json();\n  setSo(body.data.order);\n}`,
    example_code: `async function createPO() {\n  const res = await fetch("http://localhost:4100/api/po", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ vendorId, items: lines }),\n  });\n  const body = await res.json();\n  setPo(body.data);\n}`,
    think_prompt: `This is the create-then-act pattern you already used for the purchase order, plus one real new thing: the API can genuinely say no with a 409 if any line would oversell. What has to happen differently on that response than on a normal success?`,
    mc_options: ["createSO checks res.status === 409 and stores body.message via setError, otherwise stores body.data via setSo; fulfillSO POSTs to /api/so/:id/fulfill using so.id", "Treat a 409 exactly like a 201 and store whatever comes back as the order", "Retry the create call automatically on a 409 without telling the user why it failed"],
    mc_correct_option: "createSO checks res.status === 409 and stores body.message via setError, otherwise stores body.data via setSo; fulfillSO POSTs to /api/so/:id/fulfill using so.id",
    mc_anchor: "createSO checks res.status === 409",
    why_this_matters: `The oversell guard is the entire point of this screen — a business that can't tell a customer "we don't have that many in stock" before promising a shipment date is the exact problem Mini ERP exists to solve. Fulfillment only becomes possible once a real (non-blocked) order exists.`,
    answer_keywords: ["createSO", "fulfillSO", "409", "setError", "setSo", "fulfill", "message"],
    seed_code: `import { useState, useEffect } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/customers")\n      .then((res) => res.json())\n      .then((body) => setCustomers(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  return <div />;\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/customers")\n      .then((res) => res.json())\n      .then((body) => setCustomers(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  // createSO and fulfillSO here\n\n  return (\n    <div>\n      {/* Create SO button, error message, and once so exists: status + Fulfill button */}\n    </div>\n  );\n}\n`,
    feedback_correct: "Correct — the screen creates a guarded real order and fulfills it end to end.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "createSO must check for a 409 and store body.message via setError instead of setting so; fulfillSO must use the created so's real id.",
    pre_check_hint: `A 409 response is still valid JSON with a real body — check res.status before deciding whether that body is an order (setSo) or a rejection reason (setError).`,
    expected: `import { useState, useEffect } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/customers")\n      .then((res) => res.json())\n      .then((body) => setCustomers(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  async function createSO() {\n    const res = await fetch("http://localhost:4100/api/so", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ customerId, items: lines }),\n    });\n    const body = await res.json();\n    if (res.status === 409) {\n      setError(body.message);\n    } else {\n      setSo(body.data);\n      setError("");\n    }\n  }\n\n  async function fulfillSO() {\n    const res = await fetch(\`http://localhost:4100/api/so/\${so.id}/fulfill\`, { method: "POST" });\n    const body = await res.json();\n    setSo(body.data.order);\n  }\n\n  return (\n    <div>\n      <button onClick={createSO}>Create SO</button>\n      {error && <p>{error}</p>}\n      {so && (\n        <div>\n          <p>Status: {so.status}</p>\n          {so.status !== "SHIPPED" && <button onClick={fulfillSO}>Fulfill</button>}\n        </div>\n      )}\n    </div>\n  );\n}\n`,
    analog_example: `async function createPO() {\n  const res = await fetch("http://localhost:4100/api/po", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ vendorId, items: lines }),\n  });\n  const body = await res.json();\n  setPo(body.data);\n}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `The real /api/so/:id/fulfill endpoint runs inside a Serializable transaction specifically so two simultaneous fulfillments can never both succeed against the same remaining stock — the same real-world race a busy small business hits constantly. Your fulfill button is the trigger for that whole guarantee.`,
      pain: "Ignoring the 409 branch means a genuinely blocked oversell looks to the user exactly like nothing happened.",
      mentalModel: `Build the screen that sells real inventory without ever overselling it.`,
      discover: `if (res.status === 409) {\n  setError(body.message);\n}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not call fulfillSO before so exists, and do not treat a 409 body the same way as a 201 body.",
      dryRun: "Write the same guarded create-then-act pattern for a different real workflow that can be rejected.",
      build: `createSO() checks res.status === 409 before deciding setError vs setSo; fulfillSO() POSTs to /api/so/\${so.id}/fulfill once so exists.`,
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
  title: "Sales order pipeline view",
  shortName: "SO pipeline",
});
