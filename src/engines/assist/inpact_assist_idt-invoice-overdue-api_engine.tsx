import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-invoice-overdue-api",
      title: "Invoices API with overdue status",
      body: `Implement /api/invoices with a derived status:

  Store    →  in-memory Invoice rows
  Validate →  required fields
  Derive   →  paid → paid; else dueDate in the past → overdue; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      usecase: "Overdue must be computed from due date and paid — never trusted from the client body.",
      designMock: {"kind":"api-sample","screenTitle":"/api/invoices","caption":"Status is computed on the way out — clients cannot fake it.","getSample":"GET /api/invoices\n→ [ { \"id\": \"1\", \"status\": \"…\" } ]","postSample":"POST /api/invoices\n{ …fields… }\n→ 201 { …row, \"status\": \"…\" }"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Create an in-memory invoice store and an ID generator for unique billing numbers.","Validate that new invoice entries contain a positive balance and a valid customer ID.","Have the server compare the due date against the current date to determine if it is \"current\" or \"overdue\".","Implement a GET route to list invoices and a POST route that stamps the computed overdue status before saving."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

This file doesn't exist yet — you're the first to touch it. Create it at \`server/routes/invoices.ts\` before anything else. Every step from here on edits that same file.

Create an in-memory invoice store and an ID generator for unique billing numbers.

WHAT YOU'LL NEED
- An array holding invoice records.
- An incremental ID generator helper.

Your task: Create server-side storage for invoices and an ID generator.`,
    hint: `1. In-memory store: Declare a let variable initialized to an empty array.
2. ID counter: Initialize a numeric counter variable.
3. Generator: Return an incremental ID string.`,
    example_code: `let invoiceStore: InvoiceRecord[] = [];
let invIdCounter = 1;

function generateInvoiceId(): string {
  return \`inv-\${invIdCounter++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/invoices
GET /api/invoices
→ [ { "id": "1", "status": "…" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId","no store — recompute from logs only","client sends the whole catalog every GET"],
    mc_correct_option: "module-level array + a counter-based nextId",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `Storing records in an array allows API testing without configuring external databases.`,
    answer_keywords: ["invoices","nextId","nextIdCounter"],
    seed_code: `// store
`,
    starter_code: `// store
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Server owns the array.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `Two requests that arrive close together must never be handed the same id — a counter that only ever increases guarantees each new record gets a value nothing before it used, which a timestamp alone cannot promise.`,
    expected: `let invoices = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return invoices; }
`,
    analog_example: `let invoiceStore: InvoiceRecord[] = [];
let invIdCounter = 1;

function generateInvoiceId(): string {
  return \`inv-\${invIdCounter++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Storing records in an array allows API testing without configuring external databases.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/invoices with a derived status:

  Store    →  in-memory Invoice rows
  Validate →  required fields
  Derive   →  paid → paid; else dueDate in the past → overdue; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let invoices = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return invoices; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. In-memory store: Declare a let variable initialized to an empty array.
2. ID counter: Initialize a numeric counter variable.
3. Generator: Return an incremental ID string.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Validate that new invoice entries contain a positive balance and a valid customer ID.

WHAT YOU'LL NEED
- Checks for required body fields.
- 400 status response for incomplete requests.

Your task: Verify incoming invoices include client name and due date, rejecting with 400 if missing.`,
    hint: `1. Check body: Evaluate required properties using !req.body.property.
2. Reject invalid: Return res.status(400).json(...) if any check fails.`,
    example_code: `if (!req.body.client || !req.body.dueDate) {
  return res.status(400).json({ error: "Client and due date are required" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/invoices
POST /api/invoices
{ …fields… }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. What must be true about the fields above before you insert a row?`,
    mc_options: ["error string for bad fields, else null","accept any JSON","coerce everything to strings silently"],
    mc_correct_option: "error string for bad fields, else null",
    mc_anchor: "error string for bad fields, else null",
    why_this_matters: `Validating inputs ensures bad data is rejected before reaching your storage array.`,
    answer_keywords: ["validateInvoice","client","amount","dueDate"],
    seed_code: `let invoices = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let invoices = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateInvoice(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate first.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let invoices = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return invoices; }
export function validateInvoice(input) {
  if (typeof input?.client !== "string" || !input.client.trim()) return "client is required";
  if (typeof input?.amount !== "number" || input.amount <= 0) return "amount must be > 0";
  if (typeof input?.dueDate !== "string" || !input.dueDate.trim()) return "dueDate is required";
  return null;
}
`,
    analog_example: `if (!req.body.client || !req.body.dueDate) {
  return res.status(400).json({ error: "Client and due date are required" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Validating inputs ensures bad data is rejected before reaching your storage array.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/invoices with a derived status:

  Store    →  in-memory Invoice rows
  Validate →  required fields
  Derive   →  paid → paid; else dueDate in the past → overdue; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let invoices = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return invoices; }
export function validateInvoice(input) {
  if (typeof input?.client !== "string" || !input.client.trim()) return "client is required";
  if (typeof input?.amount !== "number" || input.amount <= 0) return "amount must be > 0";
  if (typeof input?.dueDate !== "string" || !input.dueDate.trim()) return "dueDate is required";
  return null;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Check body: Evaluate required properties using !req.body.property.
2. Reject invalid: Return res.status(400).json(...) if any check fails.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Have the server compare the due date against the current date to determine if it is "current" or "overdue".

WHAT YOU'LL NEED
- Date comparison logic comparing dueDate against Date.now().
- Status assignment based on the comparison.

Your task: Calculate whether the invoice is "current" or "overdue" by comparing its due date against the current date.`,
    hint: `1. Compare timestamps: Parse dueDate and compare against the current timestamp.
2. Set status: Assign "overdue" if past due; otherwise, assign "current".`,
    example_code: `const isLate = new Date(req.body.dueDate).getTime() < Date.now();
const status = isLate ? "overdue" : "current";`,
    think_prompt: `\`\`\`text
SAMPLE — /api/invoices
GET /api/invoices
→ [ { "id": "1", "status": "…" } ]

Rule: paid → paid; else dueDate in the past → overdue; else open
\`\`\`

A status label describing a record can always be recalculated from that record's own stored facts — comparing dates, or checking a boolean flag — rather than being sent by the client and simply trusted. Given the rule above, should the browser send status, or should the server compute it — and from what?`,
    mc_options: ["server derives status from stored facts; ignore client status","save req.body.status as-is","randomize status on every GET"],
    mc_correct_option: "server derives status from stored facts; ignore client status",
    mc_anchor: "server derives status from stored facts;",
    why_this_matters: `Calculating status on the server prevents clients from falsifying payment statuses.`,
    answer_keywords: ["deriveStatus"],
    seed_code: `let invoices = [];
export function validateInvoice(input) { return null; }
`,
    starter_code: `let invoices = [];
export function validateInvoice(input) { return null; }
export function deriveStatus(row, now = new Date()) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Status is computed on the server.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A derive function takes one stored row (plus, optionally, the current time) and returns a label computed purely from that row's own fields — it never reads anything the client sent in the current request.`,
    expected: `let invoices = [];
export function validateInvoice(input) { return null; }
export function deriveStatus(row, now = new Date()) {
  if (row.paid === true) return "paid";
  if (new Date(row.dueDate) < now) return "overdue";
  return "open";
}
`,
    analog_example: `const isLate = new Date(req.body.dueDate).getTime() < Date.now();
const status = isLate ? "overdue" : "current";`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Calculating status on the server prevents clients from falsifying payment statuses.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/invoices with a derived status:

  Store    →  in-memory Invoice rows
  Validate →  required fields
  Derive   →  paid → paid; else dueDate in the past → overdue; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let invoices = [];
export function validateInvoice(input) { return null; }
export function deriveStatus(row, now = new Date()) {
  if (row.paid === true) return "paid";
  if (new Date(row.dueDate) < now) return "overdue";
  return "open";
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Compare timestamps: Parse dueDate and compare against the current timestamp.
2. Set status: Assign "overdue" if past due; otherwise, assign "current".`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Implement a GET route to list invoices and a POST route that stamps the computed overdue status before saving.

WHAT YOU'LL NEED
- GET endpoint returning the storage array.
- POST endpoint running validation, calculating status, appending to store, and returning 201.

Your task: Expose a GET endpoint to return invoices and a POST endpoint to create invoices with the calculated status.`,
    hint: `1. Read route: Return status 200 with the storage array.
2. Write route: Run validation and status derivation, save the item, and return 201 with the created record.`,
    example_code: `export function getInvoices(res: Response) {
  return res.status(200).json(invoiceStore);
}

export function createInvoice(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derive overdue status
  const item = { id: generateInvoiceId(), ...req.body, status };
  invoiceStore.push(item);
  return res.status(201).json(item);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/invoices
GET /api/invoices
→ [ …rows with status ]

POST /api/invoices
→ 201 { …row, "status": "…" }
\`\`\`

Attaching a computed field to data on its way out of a route means running the derive function once per record, every time that record is returned — never once at write time and then reused. How do GET and POST above reuse validateInvoice and deriveStatus to guarantee status is never stale?`,
    mc_options: ["GET/POST attach derived status; POST validates first","POST stores client status verbatim","GET omits status"],
    mc_correct_option: "GET/POST attach derived status; POST validates first",
    mc_anchor: "GET/POST attach derived status; POST val",
    why_this_matters: `The client receives the finalized invoice with the calculated status included.


================================================================================`,
    answer_keywords: ["deriveStatus","validateInvoice","201"],
    seed_code: `let invoices = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateInvoice(input) { return null; }
export function deriveStatus(row, now = new Date()) { return "open"; }
`,
    starter_code: `let invoices = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateInvoice(input) { return null; }
export function deriveStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return { list() {}, create() {} };
}
`,
    feedback_correct: "Correct — list and create attach derived status.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Always derive on the way out.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A route handler's job is to call helpers in the right order and translate their answers into HTTP responses — validate first, then map the derive function over whatever gets returned.`,
    expected: `let invoices = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateInvoice(input) { return null; }
export function deriveStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(invoices.map((r) => ({ ...r, status: deriveStatus(r) })));
    },
    create(req, res) {
      const err = validateInvoice(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), client: req.body.client, amount: req.body.amount, dueDate: req.body.dueDate, paid: false };
      invoices.push(row);
      res.status(201).json({ ...row, status: deriveStatus(row) });
    },
  };
}
`,
    analog_example: `export function getInvoices(res: Response) {
  return res.status(200).json(invoiceStore);
}

export function createInvoice(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derive overdue status
  const item = { id: generateInvoiceId(), ...req.body, status };
  invoiceStore.push(item);
  return res.status(201).json(item);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The client receives the finalized invoice with the calculated status included.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/invoices with a derived status:

  Store    →  in-memory Invoice rows
  Validate →  required fields
  Derive   →  paid → paid; else dueDate in the past → overdue; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let invoices = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateInvoice(input) { return null; }
export function deriveStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(invoices.map((r) => ({ ...r, status: deriveStatus(r) })));
    },
    create(req, res) {
      const err = validateInvoice(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), client: req.body.client, amount: req.body.amount, dueDate: req.body.dueDate, paid: false };
      invoices.push(row);
      res.status(201).json({ ...row, status: deriveStatus(row) });
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Read route: Return status 200 with the storage array.
2. Write route: Run validation and status derivation, save the item, and return 201 with the created record.`,
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
  title: "Invoices API with overdue status",
  shortName: "Invoice API",
});
