import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-coverage-api",
      title: "Coverage API with open/filled status",
      body: `Implement /api/coverage with a derived status:

  Store    →  in-memory CoverageRequest rows
  Validate →  required fields
  Derive   →  if claimedBy set → filled; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      usecase: "Open vs filled must come from whether someone claimed the request — not from a client-sent label.",
      designMock: {"kind":"api-sample","screenTitle":"/api/coverage","caption":"Status is computed on the way out — clients cannot fake it.","getSample":"GET /api/coverage\n→ [ { \"id\": \"1\", \"status\": \"…\" } ]","postSample":"POST /api/coverage\n{ …fields… }\n→ 201 { …row, \"status\": \"…\" }"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Set up a shift-coverage memory drawer and an ID generator for unique coverage tickets.","Check that coverage requests include a shift date, role, and department before proceeding.","Have the server assign \"open\" if no worker is attached or \"filled\" once an employee is assigned.","Build endpoints to fetch all coverage tickets (GET) and register new requests with their calculated status (POST)."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

This file doesn't exist yet — you're the first to touch it. Create it at \`server/routes/coverage.ts\` before anything else. Every step from here on edits that same file.

Set up a shift-coverage memory drawer and an ID generator for unique coverage tickets.

WHAT YOU'LL NEED
- An array holding coverage items.
- An incremental ID generation helper.

Your task: Create server-side storage for shift coverage requests and an ID generator.`,
    hint: `1. Initialize store: Create an empty array typed with your coverage blueprint.
2. Initialize ID tracker: Create an integer counter variable.
3. ID generator: Write a helper returning formatted ID strings.`,
    example_code: `let coverageEntries: CoverageItem[] = [];
let idCounter = 1;

function nextCoverageId(): string {
  return \`cov-\${idCounter++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/coverage
GET /api/coverage
→ [ { "id": "1", "status": "…" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId","no store — recompute from logs only","client sends the whole catalog every GET"],
    mc_correct_option: "module-level array + a counter-based nextId",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `Unique identifiers make sure individual coverage tickets can be claimed or updated independently.`,
    answer_keywords: ["coverage","nextId","nextIdCounter"],
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
    expected: `let coverage = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return coverage; }
`,
    analog_example: `let coverageEntries: CoverageItem[] = [];
let idCounter = 1;

function nextCoverageId(): string {
  return \`cov-\${idCounter++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Unique identifiers make sure individual coverage tickets can be claimed or updated independently.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/coverage with a derived status:

  Store    →  in-memory CoverageRequest rows
  Validate →  required fields
  Derive   →  if claimedBy set → filled; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let coverage = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return coverage; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize store: Create an empty array typed with your coverage blueprint.
2. Initialize ID tracker: Create an integer counter variable.
3. ID generator: Write a helper returning formatted ID strings.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Check that coverage requests include a shift date, role, and department before proceeding.

WHAT YOU'LL NEED
- Check for shift date and department on req.body.
- 400 status response for incomplete requests.

Your task: Verify that incoming coverage requests specify shift date and department, returning 400 if missing.`,
    hint: `1. Validate fields: Check req.body properties using !body.property.
2. Halt on failure: Return res.status(400).json(...) if any check fails.`,
    example_code: `if (!req.body.shiftDate || !req.body.role) {
  return res.status(400).json({ error: "Shift date and role are mandatory" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/coverage
POST /api/coverage
{ …fields… }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. What must be true about the fields above before you insert a row?`,
    mc_options: ["error string for bad fields, else null","accept any JSON","coerce everything to strings silently"],
    mc_correct_option: "error string for bad fields, else null",
    mc_anchor: "error string for bad fields, else null",
    why_this_matters: `Ensuring every request has date and role data prevents unassignable shifts from cluttering schedules.`,
    answer_keywords: ["validateCoverage","shiftId","reason","neededBy"],
    seed_code: `let coverage = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let coverage = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateCoverage(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate first.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let coverage = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return coverage; }
export function validateCoverage(input) {
  if (typeof input?.shiftId !== "string" || !input.shiftId.trim()) return "shiftId is required";
  if (typeof input?.reason !== "string" || !input.reason.trim()) return "reason is required";
  if (typeof input?.neededBy !== "string" || !input.neededBy.trim()) return "neededBy is required";
  return null;
}
`,
    analog_example: `if (!req.body.shiftDate || !req.body.role) {
  return res.status(400).json({ error: "Shift date and role are mandatory" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Ensuring every request has date and role data prevents unassignable shifts from cluttering schedules.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/coverage with a derived status:

  Store    →  in-memory CoverageRequest rows
  Validate →  required fields
  Derive   →  if claimedBy set → filled; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let coverage = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return coverage; }
export function validateCoverage(input) {
  if (typeof input?.shiftId !== "string" || !input.shiftId.trim()) return "shiftId is required";
  if (typeof input?.reason !== "string" || !input.reason.trim()) return "reason is required";
  if (typeof input?.neededBy !== "string" || !input.neededBy.trim()) return "neededBy is required";
  return null;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Validate fields: Check req.body properties using !body.property.
2. Halt on failure: Return res.status(400).json(...) if any check fails.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Have the server assign "open" if no worker is attached or "filled" once an employee is assigned.

WHAT YOU'LL NEED
- Server check verifying if an employee ID or assignee is attached.
- Assignment of "filled" if present, "open" if absent.

Your task: Determine on the server whether coverage is "open" or "filled" based on worker assignment.`,
    hint: `1. Check assignment: Look at whether an assignee was provided.
2. Derive label: If an assignee exists, assign "filled"; otherwise, assign "open".`,
    example_code: `const status = req.body.assignedWorkerId ? "filled" : "open";`,
    think_prompt: `\`\`\`text
SAMPLE — /api/coverage
GET /api/coverage
→ [ { "id": "1", "status": "…" } ]

Rule: if claimedBy set → filled; else open
\`\`\`

A status label describing a record can always be recalculated from that record's own stored facts — comparing dates, or checking a boolean flag — rather than being sent by the client and simply trusted. Given the rule above, should the browser send status, or should the server compute it — and from what?`,
    mc_options: ["server derives status from stored facts; ignore client status","save req.body.status as-is","randomize status on every GET"],
    mc_correct_option: "server derives status from stored facts; ignore client status",
    mc_anchor: "server derives status from stored facts;",
    why_this_matters: `The status reflects true system state rather than unchecked client claims.`,
    answer_keywords: ["deriveCoverageStatus"],
    seed_code: `let coverage = [];
export function validateCoverage(input) { return null; }
`,
    starter_code: `let coverage = [];
export function validateCoverage(input) { return null; }
export function deriveCoverageStatus(row, now = new Date()) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Status is computed on the server.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A derive function takes one stored row (plus, optionally, the current time) and returns a label computed purely from that row's own fields — it never reads anything the client sent in the current request.`,
    expected: `let coverage = [];
export function validateCoverage(input) { return null; }
export function deriveCoverageStatus(row, now = new Date()) {
  if (new Date(row.neededBy) < now) return "stale";
  return "fresh";
}
`,
    analog_example: `const status = req.body.assignedWorkerId ? "filled" : "open";`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The status reflects true system state rather than unchecked client claims.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/coverage with a derived status:

  Store    →  in-memory CoverageRequest rows
  Validate →  required fields
  Derive   →  if claimedBy set → filled; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let coverage = [];
export function validateCoverage(input) { return null; }
export function deriveCoverageStatus(row, now = new Date()) {
  if (new Date(row.neededBy) < now) return "stale";
  return "fresh";
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Check assignment: Look at whether an assignee was provided.
2. Derive label: If an assignee exists, assign "filled"; otherwise, assign "open".`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Build endpoints to fetch all coverage tickets (GET) and register new requests with their calculated status (POST).

WHAT YOU'LL NEED
- GET returning all coverage records.
- POST validating fields, stamping status, saving, and returning 201.

Your task: Build the GET list endpoint and POST creation endpoint with the calculated status.`,
    hint: `1. Return list: Return status 200 with coverageEntries in the GET handler.
2. Execute workflow: Run validation and status derivation inside the POST handler.
3. Store and respond: Append the item to coverageEntries and return status 201 with the created object.`,
    example_code: `export function getCoverage(res: Response) {
  return res.status(200).json(coverageEntries);
}

export function addCoverage(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derived status
  const item = { id: nextCoverageId(), ...req.body, status };
  coverageEntries.push(item);
  return res.status(201).json(item);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/coverage
GET /api/coverage
→ [ …rows with status ]

POST /api/coverage
→ 201 { …row, "status": "…" }
\`\`\`

Attaching a computed field to data on its way out of a route means running the derive function once per record, every time that record is returned — never once at write time and then reused. How do GET and POST above reuse validateCoverage and deriveCoverageStatus to guarantee status is never stale?`,
    mc_options: ["GET/POST attach derived status; POST validates first","POST stores client status verbatim","GET omits status"],
    mc_correct_option: "GET/POST attach derived status; POST validates first",
    mc_anchor: "GET/POST attach derived status; POST val",
    why_this_matters: `Consistently returning the newly created object with its derived status gives the client instant confirmation.


================================================================================`,
    answer_keywords: ["deriveCoverageStatus","validateCoverage","201"],
    seed_code: `let coverage = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateCoverage(input) { return null; }
export function deriveCoverageStatus(row, now = new Date()) { return "open"; }
`,
    starter_code: `let coverage = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateCoverage(input) { return null; }
export function deriveCoverageStatus(row, now = new Date()) { return "open"; }
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
    expected: `let coverage = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateCoverage(input) { return null; }
export function deriveCoverageStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(coverage.map((r) => ({ ...r, status: deriveCoverageStatus(r) })));
    },
    create(req, res) {
      const err = validateCoverage(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), shiftId: req.body.shiftId, reason: req.body.reason, neededBy: req.body.neededBy };
      coverage.push(row);
      res.status(201).json({ ...row, status: deriveCoverageStatus(row) });
    },
  };
}
`,
    analog_example: `export function getCoverage(res: Response) {
  return res.status(200).json(coverageEntries);
}

export function addCoverage(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derived status
  const item = { id: nextCoverageId(), ...req.body, status };
  coverageEntries.push(item);
  return res.status(201).json(item);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Consistently returning the newly created object with its derived status gives the client instant confirmation.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/coverage with a derived status:

  Store    →  in-memory CoverageRequest rows
  Validate →  required fields
  Derive   →  if claimedBy set → filled; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let coverage = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateCoverage(input) { return null; }
export function deriveCoverageStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(coverage.map((r) => ({ ...r, status: deriveCoverageStatus(r) })));
    },
    create(req, res) {
      const err = validateCoverage(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), shiftId: req.body.shiftId, reason: req.body.reason, neededBy: req.body.neededBy };
      coverage.push(row);
      res.status(201).json({ ...row, status: deriveCoverageStatus(row) });
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Return list: Return status 200 with coverageEntries in the GET handler.
2. Execute workflow: Run validation and status derivation inside the POST handler.
3. Store and respond: Append the item to coverageEntries and return status 201 with the created object.`,
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
  title: "Coverage API with open/filled status",
  shortName: "Coverage API",
});
