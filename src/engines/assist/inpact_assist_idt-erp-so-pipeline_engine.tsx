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
    items: ["Model customer info, item details, and order rows, assembling the pipeline view shell.","Store customer lists, inventory options, current order lines, and any order warnings in state.","Fetch real customers and current warehouse item quantities from the server on load.","Post the sales order to the server, catching and showing a friendly alert if requested quantities exceed current stock.","Call the fulfillment endpoint on the server and update the order's status pill to \"Fulfilled\" right on screen."],
  },
  {
    // Redesign: merges the old "create the file" + "empty shell" scaffolding steps into the real
    // data-modeling step — neither was a move in this task's actual algorithm on its own.
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: `Model customer info, item details, and order rows, assembling the pipeline view shell.

WHAT YOU'LL NEED
- Customer type (id, name)
- ItemOption type (id, name, availableStock)
- OrderLine type (itemId, quantity)

Your task: Create blueprints for customer info, catalog items, and sales order lines, then set up the pipeline component.`,
    hint: `1. Define shapes: Create types for clients, catalog inventory items, and line entries.
2. Specify fields: Ensure availableStock and quantity use the number type.
3. Component shell: Declare your parent SalesPipeline component.`,
    example_code: `export type Client = { id: string; name: string };
export type CatalogItem = { id: string; title: string; availableStock: number };
export type SaleLine = { itemId: string; quantity: number };

export function SalesPipeline() {
  return <div />;
}`,
    think_prompt: `You've written this exact OrderLine shape once already for the purchase order. What changes here is the picker — a customer instead of a vendor — while the line itself stays identical, because both APIs send the same {itemId, quantity, unitPrice} shape. What do the three types need to name, and what does the component that will hold them need to be called?`,
    mc_options: ["Three separate types (Customer, ItemOption, OrderLine with numeric quantity/unitPrice), then export function SalesOrderPipeline() returning <div />", "Reuse the Vendor type renamed, since it has the same fields", "One big type with every field optional"],
    mc_correct_option: "Three separate types (Customer, ItemOption, OrderLine with numeric quantity/unitPrice), then export function SalesOrderPipeline() returning <div />",
    mc_anchor: "Three separate types (Customer, ItemOption",
    why_this_matters: `Modeling available stock directly in the item type allows frontend components to warn users before overselling.`,
    answer_keywords: ["type", "Customer", "ItemOption", "OrderLine", "quantity", "unitPrice", "number", "export", "function", "SalesOrderPipeline"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — three distinct data shapes and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Write three separate types matching exactly what POST /api/so expects, then the component shell that will use them.",
    pre_check_hint: `POST /api/so expects { customerId, items: [{ itemId, quantity, unitPrice }] } — the same OrderLine shape as the purchase order. The component just needs to exist before it can render anything.`,
    expected: `export type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  return <div />;\n}\n`,
    analog_example: `export type Client = { id: string; name: string };
export type CatalogItem = { id: string; title: string; availableStock: number };
export type SaleLine = { itemId: string; quantity: number };

export function SalesPipeline() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Modeling available stock directly in the item type allows frontend components to warn users before overselling.`,
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
    paal: `Store customer lists, inventory options, current order lines, and any order warnings in state.

WHAT YOU'LL NEED
- State for customers list.
- State for available items.
- State for in-progress order lines.
- State for error message strings.

Your task: Create state hooks to hold customer lists, inventory stock, active order lines, and error alerts.`,
    hint: `1. Catalogs: Initialize clients and items as empty arrays.
2. Lines: Initialize lines as an empty array of SaleLine.
3. Errors: Initialize error with null to hold server or validation messages.`,
    example_code: `const [clients, setClients] = useState<Client[]>([]);
const [items, setItems] = useState<CatalogItem[]>([]);
const [lines, setLines] = useState<SaleLine[]>([]);
const [error, setError] = useState<string | null>(null);`,
    think_prompt: `This screen tracks the same shape of state as the purchase order form, plus one new thing: a real oversell attempt returns a 409 the UI has to show. Where does that error message live?`,
    mc_options: ["Six separate useState calls — customers, items, lines, customerId, so, error — each starting empty/null/\"\"", "Reuse the purchase order's state variables directly without an error slot", "Throw the oversell error and let it crash instead of storing it"],
    mc_correct_option: "Six separate useState calls — customers, items, lines, customerId, so, error — each starting empty/null/\"\"",
    mc_anchor: "Six separate useState calls",
    why_this_matters: `Dedicated error state allows the UI to surface rejection reasons without breaking the rest of the view.`,
    answer_keywords: ["useState", "customers", "items", "lines", "customerId", "so", "error"],
    seed_code: `import { useState } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  return <div />;\n}\n`,
    starter_code: `import { useState } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  // state here\n  return <div />;\n}\n`,
    feedback_correct: "Correct — the error slot is what makes a real oversell block visible on screen.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Six separate useState calls, including a string error state for a real oversell block.",
    pre_check_hint: `Every one of these six values changes independently and needs React to notice — including the error message, which starts empty and only fills in if the real API rejects the order.`,
    expected: `import { useState } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n  return <div />;\n}\n`,
    analog_example: `const [clients, setClients] = useState<Client[]>([]);
const [items, setItems] = useState<CatalogItem[]>([]);
const [lines, setLines] = useState<SaleLine[]>([]);
const [error, setError] = useState<string | null>(null);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Dedicated error state allows the UI to surface rejection reasons without breaking the rest of the view.`,
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
    paal: `Fetch real customers and current warehouse item quantities from the server on load.

WHAT YOU'LL NEED
- useEffect with [] dependency array.
- Parallel fetch calls for customers and inventory.

Your task: Fetch customer records and catalog availability on page mount.`,
    hint: `1. Mount trigger: Set up useEffect with an empty dependency array.
2. Fetch in parallel: Use Promise.all to query /api/customers and /api/items.
3. Populate state: Store the incoming data using setClients and setItems.`,
    example_code: `useEffect(() => {
  Promise.all([
    fetch("/api/customers").then((r) => r.json()),
    fetch("/api/items").then((r) => r.json()),
  ]).then(([customerData, itemData]) => {
    setClients(customerData);
    setItems(itemData);
  });
}, []);`,
    think_prompt: `Same fetch-on-mount pattern you've now used for the inventory table and the purchase order form, aimed at two new endpoints. What does firing both on mount look like here?`,
    mc_options: ["useEffect(() => { fetch(customersUrl).then(r=>r.json()).then(b=>setCustomers(b.data)); fetch(itemsUrl).then(r=>r.json()).then(b=>setItems(b.data)); }, [])", "Fetch customers inside the customer dropdown's onClick handler instead of on mount", "Call both fetches directly in the component body outside any effect"],
    mc_correct_option: "useEffect(() => { fetch(customersUrl).then(r=>r.json()).then(b=>setCustomers(b.data)); fetch(itemsUrl).then(r=>r.json()).then(b=>setItems(b.data)); }, [])",
    mc_anchor: "useEffect(() => { fetch(customersUrl)",
    why_this_matters: `Populating both lists upfront enables smooth selection in dropdown menus.`,
    answer_keywords: ["useEffect", "fetch", "customers", "items", "setCustomers", "setItems"],
    seed_code: `import { useState } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n  return <div />;\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n  // fetch customers and items here\n  return <div />;\n}\n`,
    feedback_correct: "Correct — customers and items now load for real on mount.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Both fetches belong inside one useEffect with an empty dependency array, each feeding its own setter via .then().",
    pre_check_hint: `Same shape as the purchase order form's dual fetch — just two different real endpoints this time.`,
    expected: `import { useState, useEffect } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/customers")\n      .then((res) => res.json())\n      .then((body) => setCustomers(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  return <div />;\n}\n`,
    analog_example: `useEffect(() => {
  Promise.all([
    fetch("/api/customers").then((r) => r.json()),
    fetch("/api/items").then((r) => r.json()),
  ]).then(([customerData, itemData]) => {
    setClients(customerData);
    setItems(itemData);
  });
}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Populating both lists upfront enables smooth selection in dropdown menus.`,
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
    paal: `Post the sales order to the server, catching and showing a friendly alert if requested quantities exceed current stock.

WHAT YOU'LL NEED
- POST request sending customerId and lines.
- Status check handling 400/409 errors by setting the error state.

Your task: Send the completed sales order to the server and display an error if items exceed available stock.`,
    hint: `1. Reset errors: Clear previous error state before sending.
2. Make POST call: Fetch "/api/so" with serialized order data.
3. Handle errors: If !res.ok, parse the JSON error and assign it to your error state variable.`,
    example_code: `async function submitSalesOrder(customerId: string) {
  setError(null);
  const res = await fetch("/api/so", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, lines }),
  });
  if (!res.ok) {
    const data = await res.json();
    setError(data.error || "Order failed");
    return;
  }
  // proceed on success
}`,
    think_prompt: `This is the create-then-act pattern you already used for the purchase order, plus one real new thing: the API can genuinely say no with a 409 if any line would oversell. What has to happen differently on that response than on a normal success?`,
    mc_options: ["createSO checks res.status === 409 and stores body.message via setError, otherwise stores body.data via setSo", "Treat a 409 exactly like a 201 and store whatever comes back as the order", "Retry the create call automatically on a 409 without telling the user why it failed"],
    mc_correct_option: "createSO checks res.status === 409 and stores body.message via setError, otherwise stores body.data via setSo",
    mc_anchor: "createSO checks res.status === 409",
    why_this_matters: `Explicit error handling surfaces oversell warnings directly to the user.`,
    answer_keywords: ["createSO", "409", "setError", "setSo", "message"],
    seed_code: `import { useState, useEffect } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/customers")\n      .then((res) => res.json())\n      .then((body) => setCustomers(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  return <div />;\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/customers")\n      .then((res) => res.json())\n      .then((body) => setCustomers(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  // createSO here\n\n  return (\n    <div>\n      {/* Create SO button, error message, and once so exists: status */}\n    </div>\n  );\n}\n`,
    feedback_correct: "Correct — a real, guarded sales order now exists (or a real reason it was blocked).",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "createSO must check for a 409 and store body.message via setError instead of setting so.",
    pre_check_hint: `A 409 response is still valid JSON with a real body — check res.status before deciding whether that body is an order (setSo) or a rejection reason (setError).`,
    expected: `import { useState, useEffect } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/customers")\n      .then((res) => res.json())\n      .then((body) => setCustomers(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  async function createSO() {\n    const res = await fetch("http://localhost:4100/api/so", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ customerId, items: lines }),\n    });\n    const body = await res.json();\n    if (res.status === 409) {\n      setError(body.message);\n    } else {\n      setSo(body.data);\n      setError("");\n    }\n  }\n\n  return (\n    <div>\n      <button onClick={createSO}>Create SO</button>\n      {error && <p>{error}</p>}\n      {so && <p>Status: {so.status}</p>}\n    </div>\n  );\n}\n`,
    analog_example: `async function submitSalesOrder(customerId: string) {
  setError(null);
  const res = await fetch("/api/so", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, lines }),
  });
  if (!res.ok) {
    const data = await res.json();
    setError(data.error || "Order failed");
    return;
  }
  // proceed on success
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Explicit error handling surfaces oversell warnings directly to the user.`,
      pain: "Ignoring the 409 branch means a genuinely blocked oversell looks to the user exactly like nothing happened.",
      mentalModel: `Build the screen that sells real inventory without ever overselling it.`,
      discover: `if (res.status === 409) {\n  setError(body.message);\n}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not treat a 409 body the same way as a 201 body — check status first.",
      dryRun: "Write the same guarded-create pattern for a different real workflow that can be rejected.",
      build: `createSO() checks res.status === 409 before deciding setError vs setSo.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: `Call the fulfillment endpoint on the server and update the order's status pill to "Fulfilled" right on screen.

WHAT YOU'LL NEED
- POST call targeting /api/so/:id/fulfill.
- State update marking the order as fulfilled.

Your task: Trigger fulfillment for a sales order and update its status tag on screen.`,
    hint: `1. Endpoint call: Send a POST request to the parameterized fulfillment endpoint.
2. Confirm success: Check if res.ok is true.
3. Update state: Update local state to reflect the "Fulfilled" status.`,
    example_code: `async function fulfillOrder(orderId: string) {
  const res = await fetch(\`/api/so/\${orderId}/fulfill\`, { method: "POST" });
  if (res.ok) {
    // update order status in state to "Fulfilled"
  }
}`,
    think_prompt: `Fulfillment only becomes possible once a real, non-blocked order exists — the same create-then-act shape as the purchase order's receive step. What does this call send, and what does it do with what comes back?`,
    mc_options: ["fulfillSO POSTs to /api/so/:id/fulfill using so.id and stores data.order via setSo", "fulfillSO can run before so exists, using a placeholder id", "Skip storing the fulfill response — the click alone is proof enough"],
    mc_correct_option: "fulfillSO POSTs to /api/so/:id/fulfill using so.id and stores data.order via setSo",
    mc_anchor: "fulfillSO POSTs to /api/so/:id/fulfill",
    why_this_matters: `Updating status immediately upon API success gives instant visual feedback that the order was completed.


================================================================================`,
    answer_keywords: ["fulfillSO", "POST", "fulfill", "so.id", "setSo"],
    seed_code: `import { useState, useEffect } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/customers")\n      .then((res) => res.json())\n      .then((body) => setCustomers(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  async function createSO() {\n    const res = await fetch("http://localhost:4100/api/so", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ customerId, items: lines }),\n    });\n    const body = await res.json();\n    if (res.status === 409) {\n      setError(body.message);\n    } else {\n      setSo(body.data);\n      setError("");\n    }\n  }\n\n  return (\n    <div>\n      <button onClick={createSO}>Create SO</button>\n      {error && <p>{error}</p>}\n      {so && <p>Status: {so.status}</p>}\n    </div>\n  );\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/customers")\n      .then((res) => res.json())\n      .then((body) => setCustomers(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  async function createSO() {\n    const res = await fetch("http://localhost:4100/api/so", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ customerId, items: lines }),\n    });\n    const body = await res.json();\n    if (res.status === 409) {\n      setError(body.message);\n    } else {\n      setSo(body.data);\n      setError("");\n    }\n  }\n\n  // fulfillSO here\n\n  return (\n    <div>\n      <button onClick={createSO}>Create SO</button>\n      {error && <p>{error}</p>}\n      {so && (\n        <div>\n          <p>Status: {so.status}</p>\n          {/* Fulfill button once so exists and hasn't shipped */}\n        </div>\n      )}\n    </div>\n  );\n}\n`,
    feedback_correct: "Correct — the screen creates a guarded real order and fulfills it end to end.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "fulfillSO must POST to /api/so/:id/fulfill using the created so's real id, and store data.order.",
    pre_check_hint: `Fulfilling requires a real so.id, which only exists after createSO's response comes back non-blocked — that's why fulfillSO reads so.id rather than anything computed earlier.`,
    expected: `import { useState, useEffect } from "react";\n\nexport type Customer = {\n  id: string;\n  name: string;\n};\n\nexport type ItemOption = {\n  id: string;\n  sku: string;\n  name: string;\n};\n\nexport type OrderLine = {\n  itemId: string;\n  quantity: number;\n  unitPrice: number;\n};\n\nexport function SalesOrderPipeline() {\n  const [customers, setCustomers] = useState<Customer[]>([]);\n  const [items, setItems] = useState<ItemOption[]>([]);\n  const [lines, setLines] = useState<OrderLine[]>([]);\n  const [customerId, setCustomerId] = useState("");\n  const [so, setSo] = useState<any>(null);\n  const [error, setError] = useState("");\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/customers")\n      .then((res) => res.json())\n      .then((body) => setCustomers(body.data));\n    fetch("http://localhost:4100/api/items")\n      .then((res) => res.json())\n      .then((body) => setItems(body.data));\n  }, []);\n\n  async function createSO() {\n    const res = await fetch("http://localhost:4100/api/so", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ customerId, items: lines }),\n    });\n    const body = await res.json();\n    if (res.status === 409) {\n      setError(body.message);\n    } else {\n      setSo(body.data);\n      setError("");\n    }\n  }\n\n  async function fulfillSO() {\n    const res = await fetch(\`http://localhost:4100/api/so/\${so.id}/fulfill\`, { method: "POST" });\n    const body = await res.json();\n    setSo(body.data.order);\n  }\n\n  return (\n    <div>\n      <button onClick={createSO}>Create SO</button>\n      {error && <p>{error}</p>}\n      {so && (\n        <div>\n          <p>Status: {so.status}</p>\n          {so.status !== "SHIPPED" && <button onClick={fulfillSO}>Fulfill</button>}\n        </div>\n      )}\n    </div>\n  );\n}\n`,
    analog_example: `async function fulfillOrder(orderId: string) {
  const res = await fetch(\`/api/so/\${orderId}/fulfill\`, { method: "POST" });
  if (res.ok) {
    // update order status in state to "Fulfilled"
  }
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Updating status immediately upon API success gives instant visual feedback that the order was completed.


================================================================================`,
      pain: "Skipping the real fulfill call means the order looks accepted but never actually ships or posts to the ledger.",
      mentalModel: `Build the screen that sells real inventory without ever overselling it.`,
      discover: `async function fulfillSO() {\n  const res = await fetch(\`http://localhost:4100/api/so/\${so.id}/fulfill\`, { method: "POST" });\n  const body = await res.json();\n  setSo(body.data.order);\n}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not call fulfillSO before so exists — there is no id to fulfill against yet.",
      dryRun: "Write the same create-then-act pattern for a different two-step real workflow.",
      build: `fulfillSO() POSTs to /api/so/\${so.id}/fulfill once so exists, and stores data.order via setSo.`,
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
  title: "Sales order pipeline view",
  shortName: "SO pipeline",
});
