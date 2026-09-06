import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-booking-deposits-api",
      title: "Deposits API with held/applied status",
      body: `Implement /api/deposits with a derived status:

  Store    →  in-memory Deposit rows
  Validate →  required fields
  Derive   →  if appliedAt is set → applied; else held
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      usecase: "Money states must be derived from facts (held vs applied), not from a status string the browser invents.",
      designMock: {"kind":"api-sample","screenTitle":"/api/deposits","caption":"Status is computed on the way out — clients cannot fake it.","getSample":"GET /api/deposits\n→ [ { \"id\": \"1\", \"status\": \"…\" } ]","postSample":"POST /api/deposits\n{ …fields… }\n→ 201 { …row, \"status\": \"…\" }"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Set up an in-memory ledger and an ID helper to stamp each payment with a distinct ID.","Validate that incoming deposits include an amount greater than zero and a valid customer reference.","Let the server determine whether the deposit is \"held\" or \"applied\" based on balance rules rather than client input.","Set up a GET route to list deposits and a POST route that attaches the server-verified status on save."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Set up an in-memory ledger and an ID helper to stamp each payment with a distinct ID.

WHAT YOU'LL NEED
- An in-memory array holding deposit objects.
- A function returning unique ID strings.

Your task: Create server-side storage for deposits and an ID generator function.`,
    hint: `1. Storage array: Initialize a let variable to an empty array typed with your deposit interface.
2. Counter: Initialize a let count variable to track numbers.
3. Generator: Return an incremental ID string from your helper function.`,
    example_code: `let store: DepositRecord[] = [];
let count = 1;

function makeId(): string {
  return \`dep-\${count++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/deposits
GET /api/deposits
→ [ { "id": "1", "status": "…" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId","no store — recompute from logs only","client sends the whole catalog every GET"],
    mc_correct_option: "module-level array + a counter-based nextId",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `Maintaining an in-memory store allows your API to save and query records during local development without complex databases.`,
    answer_keywords: ["deposits","nextId","nextIdCounter"],
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
    expected: `let deposits = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return deposits; }
`,
    analog_example: `let store: DepositRecord[] = [];
let count = 1;

function makeId(): string {
  return \`dep-\${count++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Maintaining an in-memory store allows your API to save and query records during local development without complex databases.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/deposits with a derived status:

  Store    →  in-memory Deposit rows
  Validate →  required fields
  Derive   →  if appliedAt is set → applied; else held
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let deposits = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return deposits; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Storage array: Initialize a let variable to an empty array typed with your deposit interface.
2. Counter: Initialize a let count variable to track numbers.
3. Generator: Return an incremental ID string from your helper function.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Validate that incoming deposits include an amount greater than zero and a valid customer reference.

WHAT YOU'LL NEED
- Checks for missing client or amount fields.
- Early return with status 400 and error text.

Your task: Reject invalid deposit requests with status 400 if required info is missing.`,
    hint: `1. Verify body content: Inspect req.body for missing properties.
2. Trigger check: If any required property is falsy, enter the error block.
3. Return 400: Send res.status(400).json(...) to halt the request.`,
    example_code: `if (!req.body.client || !req.body.amount) {
  return res.status(400).json({ error: "Missing required deposit details" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/deposits
POST /api/deposits
{ …fields… }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. What must be true about the fields above before you insert a row?`,
    mc_options: ["error string for bad fields, else null","accept any JSON","coerce everything to strings silently"],
    mc_correct_option: "error string for bad fields, else null",
    mc_anchor: "error string for bad fields, else null",
    why_this_matters: `Strict validation prevents blank or corrupt financial entries from ever entering the system.`,
    answer_keywords: ["validateDeposit","client","amount","appointmentId"],
    seed_code: `let deposits = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let deposits = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateDeposit(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate first.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let deposits = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return deposits; }
export function validateDeposit(input) {
  if (typeof input?.client !== "string" || !input.client.trim()) return "client is required";
  if (typeof input?.amount !== "number" || input.amount <= 0) return "amount must be > 0";
  if (typeof input?.appointmentId !== "string" || !input.appointmentId.trim()) return "appointmentId is required";
  return null;
}
`,
    analog_example: `if (!req.body.client || !req.body.amount) {
  return res.status(400).json({ error: "Missing required deposit details" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Strict validation prevents blank or corrupt financial entries from ever entering the system.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/deposits with a derived status:

  Store    →  in-memory Deposit rows
  Validate →  required fields
  Derive   →  if appliedAt is set → applied; else held
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let deposits = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return deposits; }
export function validateDeposit(input) {
  if (typeof input?.client !== "string" || !input.client.trim()) return "client is required";
  if (typeof input?.amount !== "number" || input.amount <= 0) return "amount must be > 0";
  if (typeof input?.appointmentId !== "string" || !input.appointmentId.trim()) return "appointmentId is required";
  return null;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Verify body content: Inspect req.body for missing properties.
2. Trigger check: If any required property is falsy, enter the error block.
3. Return 400: Send res.status(400).json(...) to halt the request.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Let the server determine whether the deposit is "held" or "applied" based on balance rules rather than client input.

WHAT YOU'LL NEED
- Business logic inspecting payment values or account flags.
- Determination of status string based on internal conditions.

Your task: Calculate whether the deposit should be marked "held" or "applied" on the server rather than trusting the user.`,
    hint: `1. Evaluate business rules: Check the condition (e.g. amount thresholds or account balance).
2. Set the status: Use a ternary expression or if statement to set status to either "held" or "applied".
3. Ignore user payload status: Never read status directly from req.body.`,
    example_code: `const status = Number(req.body.amount) > 5000 ? "held" : "applied";`,
    think_prompt: `\`\`\`text
SAMPLE — /api/deposits
GET /api/deposits
→ [ { "id": "1", "status": "…" } ]

Rule: if appliedAt is set → applied; else held
\`\`\`

A status label describing a record can always be recalculated from that record's own stored facts — comparing dates, or checking a boolean flag — rather than being sent by the client and simply trusted. Given the rule above, should the browser send status, or should the server compute it — and from what?`,
    mc_options: ["server derives status from stored facts; ignore client status","save req.body.status as-is","randomize status on every GET"],
    mc_correct_option: "server derives status from stored facts; ignore client status",
    mc_anchor: "server derives status from stored facts;",
    why_this_matters: `Deriving status on the server prevents clients from maliciously marking unverified deposits as completed or applied.`,
    answer_keywords: ["deriveDepositStatus"],
    seed_code: `let deposits = [];
export function validateDeposit(input) { return null; }
`,
    starter_code: `let deposits = [];
export function validateDeposit(input) { return null; }
export function deriveDepositStatus(row, now = new Date()) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Status is computed on the server.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A derive function takes one stored row (plus, optionally, the current time) and returns a label computed purely from that row's own fields — it never reads anything the client sent in the current request.`,
    expected: `let deposits = [];
export function validateDeposit(input) { return null; }
export function deriveDepositStatus(row, now = new Date()) {
  if (new Date(row.appointmentId) < now) return "stale";
  return "fresh";
}
`,
    analog_example: `const status = Number(req.body.amount) > 5000 ? "held" : "applied";`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Deriving status on the server prevents clients from maliciously marking unverified deposits as completed or applied.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/deposits with a derived status:

  Store    →  in-memory Deposit rows
  Validate →  required fields
  Derive   →  if appliedAt is set → applied; else held
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let deposits = [];
export function validateDeposit(input) { return null; }
export function deriveDepositStatus(row, now = new Date()) {
  if (new Date(row.appointmentId) < now) return "stale";
  return "fresh";
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Evaluate business rules: Check the condition (e.g. amount thresholds or account balance).
2. Set the status: Use a ternary expression or if statement to set status to either "held" or "applied".
3. Ignore user payload status: Never read status directly from req.body.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Set up a GET route to list deposits and a POST route that attaches the server-verified status on save.

WHAT YOU'LL NEED
- GET endpoint returning all stored deposits.
- POST endpoint running validation, calculating status, appending to store, and returning 201.

Your task: Provide endpoints to view deposits and create new ones with the calculated status attached.`,
    hint: `1. GET route: Send status 200 with the storage array.
2. Run checks: In POST, validate inputs and calculate the server-derived status.
3. Save record: Assemble the final record with id and derived status, push to store, and respond with 201.`,
    example_code: `export function getDeposits(res: Response) {
  return res.status(200).json(store);
}

export function createDeposit(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derive status logic
  const record = { id: makeId(), ...req.body, status };
  store.push(record);
  return res.status(201).json(record);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/deposits
GET /api/deposits
→ [ …rows with status ]

POST /api/deposits
→ 201 { …row, "status": "…" }
\`\`\`

Attaching a computed field to data on its way out of a route means running the derive function once per record, every time that record is returned — never once at write time and then reused. How do GET and POST above reuse validateDeposit and deriveDepositStatus to guarantee status is never stale?`,
    mc_options: ["GET/POST attach derived status; POST validates first","POST stores client status verbatim","GET omits status"],
    mc_correct_option: "GET/POST attach derived status; POST validates first",
    mc_anchor: "GET/POST attach derived status; POST val",
    why_this_matters: `The client receives back the exact saved record along with the server-verified status.


================================================================================`,
    answer_keywords: ["deriveDepositStatus","validateDeposit","201"],
    seed_code: `let deposits = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateDeposit(input) { return null; }
export function deriveDepositStatus(row, now = new Date()) { return "open"; }
`,
    starter_code: `let deposits = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateDeposit(input) { return null; }
export function deriveDepositStatus(row, now = new Date()) { return "open"; }
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
    expected: `let deposits = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateDeposit(input) { return null; }
export function deriveDepositStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(deposits.map((r) => ({ ...r, status: deriveDepositStatus(r) })));
    },
    create(req, res) {
      const err = validateDeposit(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), client: req.body.client, amount: req.body.amount, appointmentId: req.body.appointmentId };
      deposits.push(row);
      res.status(201).json({ ...row, status: deriveDepositStatus(row) });
    },
  };
}
`,
    analog_example: `export function getDeposits(res: Response) {
  return res.status(200).json(store);
}

export function createDeposit(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derive status logic
  const record = { id: makeId(), ...req.body, status };
  store.push(record);
  return res.status(201).json(record);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The client receives back the exact saved record along with the server-verified status.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/deposits with a derived status:

  Store    →  in-memory Deposit rows
  Validate →  required fields
  Derive   →  if appliedAt is set → applied; else held
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let deposits = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateDeposit(input) { return null; }
export function deriveDepositStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(deposits.map((r) => ({ ...r, status: deriveDepositStatus(r) })));
    },
    create(req, res) {
      const err = validateDeposit(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), client: req.body.client, amount: req.body.amount, appointmentId: req.body.appointmentId };
      deposits.push(row);
      res.status(201).json({ ...row, status: deriveDepositStatus(row) });
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. GET route: Send status 200 with the storage array.
2. Run checks: In POST, validate inputs and calculate the server-derived status.
3. Save record: Assemble the final record with id and derived status, push to store, and respond with 201.`,
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
  title: "Deposits API with held/applied status",
  shortName: "Deposit API",
});
