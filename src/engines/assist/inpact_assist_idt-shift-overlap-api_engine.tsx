import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-shift-overlap-api",
      title: "Shifts API with worker overlap conflicts",
      body: `Implement /api/shifts with persistence and a conflict rule:

  Store    →  in-memory array of Shift
  Validate →  required fields before insert
  Conflict →  same worker + same startsAt → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      usecase: "One person cannot work two stations at once. Overlap belongs in the API.",
      designMock: {"kind":"api-sample","screenTitle":"/api/shifts","caption":"Sample requests/responses — the server owns the conflict rule.","getSample":"GET /api/shifts\n→ [ { \"id\": \"1\", \"worker\": \"Ana\", \"role\": \"Barista\", \"startsAt\": \"2026-08-23T08:00:00Z\" } ]","postSample":"POST /api/shifts\n{ \"worker\": \"Ana\", \"role\": \"Barista\", \"startsAt\": \"2026-08-23T08:00:00Z\" }\n→ 201 created  OR  409 conflict"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Set up an in-memory schedule store and an ID generator for unique shift slips.","Validate that shift requests include a worker ID, start time, and end time (400).","Check existing assignments to verify this worker isn't already scheduled for another shift during that exact window.","Build GET to view published shifts and POST to create assignments, returning a 409 conflict if the worker is double-booked."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

This file doesn't exist yet — you're the first to touch it. Create it at \`server/routes/shifts.ts\` before anything else. Every step from here on edits that same file.

Set up an in-memory schedule store and an ID generator for unique shift slips.

WHAT YOU'LL NEED
- An array holding shift records.
- An incremental ID generator helper.

Your task: Set up server storage for worker shifts and an ID generator.`,
    hint: `1. In-memory store: Declare an empty array typed with your shift interface.
2. ID helper: Return an incremental ID string from your helper function.`,
    example_code: `let roster: ShiftRecord[] = [];
let shiftIdCounter = 1;

function generateShiftId(): string {
  return \`shift-\${shiftIdCounter++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/shifts
GET /api/shifts
→ [ { "id": "1", "worker": "Ana", "role": "Barista", "startsAt": "2026-08-23T08:00:00Z" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next in a simple lesson server, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId helper","store only in the browser localStorage","ask the client to send the full database each time"],
    mc_correct_option: "module-level array + a counter-based nextId helper",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `In-memory storage allows quick API testing without database setup.`,
    answer_keywords: ["shifts","nextId","nextIdCounter"],
    seed_code: `// store + ids
`,
    starter_code: `// store + ids
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Server owns the store.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `Two requests that arrive close together must never be handed the same id — a counter that only ever increases guarantees each new record gets a value nothing before it used, which a timestamp alone cannot promise.`,
    expected: `let shifts = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return shifts; }
`,
    analog_example: `let roster: ShiftRecord[] = [];
let shiftIdCounter = 1;

function generateShiftId(): string {
  return \`shift-\${shiftIdCounter++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `In-memory storage allows quick API testing without database setup.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/shifts with persistence and a conflict rule:

  Store    →  in-memory array of Shift
  Validate →  required fields before insert
  Conflict →  same worker + same startsAt → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let shifts = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return shifts; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. In-memory store: Declare an empty array typed with your shift interface.
2. ID helper: Return an incremental ID string from your helper function.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Validate that shift requests include a worker ID, start time, and end time (400).

WHAT YOU'LL NEED
- Checks verifying required body properties.
- 400 status response for incomplete requests.

Your task: Reject shift requests missing worker ID, start time, or end time with status 400.`,
    hint: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 if any required field is falsy.`,
    example_code: `if (!req.body.workerId || !req.body.startTime || !req.body.endTime) {
  return res.status(400).json({ error: "Worker ID, start time, and end time are required" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/shifts
POST /api/shifts
{ "worker": "Ana", "role": "Barista", "startsAt": "2026-08-23T08:00:00Z" }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. Looking at the POST body above, which checks have to pass before you push a row?`,
    mc_options: ["return an error string for missing/invalid fields, else null","always return null and trust the client","throw and crash the process on bad input"],
    mc_correct_option: "return an error string for missing/invalid fields, else null",
    mc_anchor: "return an error string for missing/inval",
    why_this_matters: `Validation prevents incomplete shift records from entering the roster.`,
    answer_keywords: ["validateShift","worker","role","startsAt"],
    seed_code: `let shifts = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let shifts = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateShift(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate, then create.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let shifts = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return shifts; }
export function validateShift(input) {
  if (typeof input?.worker !== "string" || !input.worker.trim()) return "worker is required";
  if (typeof input?.role !== "string" || !input.role.trim()) return "role is required";
  if (typeof input?.startsAt !== "string" || !input.startsAt.trim()) return "startsAt is required";
  return null;
}
`,
    analog_example: `if (!req.body.workerId || !req.body.startTime || !req.body.endTime) {
  return res.status(400).json({ error: "Worker ID, start time, and end time are required" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Validation prevents incomplete shift records from entering the roster.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/shifts with persistence and a conflict rule:

  Store    →  in-memory array of Shift
  Validate →  required fields before insert
  Conflict →  same worker + same startsAt → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let shifts = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return shifts; }
export function validateShift(input) {
  if (typeof input?.worker !== "string" || !input.worker.trim()) return "worker is required";
  if (typeof input?.role !== "string" || !input.role.trim()) return "role is required";
  if (typeof input?.startsAt !== "string" || !input.startsAt.trim()) return "startsAt is required";
  return null;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 if any required field is falsy.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Check existing assignments to verify this worker isn't already scheduled for another shift during that exact window.

WHAT YOU'LL NEED
- An array search checking for matching workerId and overlapping time windows.
- 409 conflict response if an overlap is found.

Your task: Scan existing shifts and reject with status 409 if this worker is already scheduled during that time.`,
    hint: `1. Scan store: Use .some() on your roster array.
2. Match criteria: Check if workerId matches and time windows overlap.
3. Reject conflicts: If found, halt execution with status 409.`,
    example_code: `const hasConflict = roster.some(
  (s) =>
    s.workerId === req.body.workerId &&
    !(req.body.endTime <= s.startTime || req.body.startTime >= s.endTime)
);
if (hasConflict) {
  return res.status(409).json({ error: "Worker already scheduled during this shift window" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/shifts
POST /api/shifts
→ 201 created  OR  409 conflict

Rule: same worker + same startsAt → conflict
\`\`\`

Two requests can describe the same resource at the same moment — before inserting one, you compare it against everything already stored to decide whether it collides. Given the rule above, how should the server decide "conflict" before insert?`,
    mc_options: ["compare candidate against existing rows; true means conflict","always allow POST and fix conflicts in the UI later","delete the older row silently"],
    mc_correct_option: "compare candidate against existing rows; true means conflict",
    mc_anchor: "compare candidate against existing rows;",
    why_this_matters: `Preventing scheduling overlaps stops workers from being double-booked.`,
    answer_keywords: ["hasWorkerOverlap","some","worker"],
    seed_code: `let shifts = [];
export function validateShift(input) { return null; }
`,
    starter_code: `let shifts = [];
export function validateShift(input) { return null; }
export function hasWorkerOverlap(candidate) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Server detects conflict before insert.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `Checking one candidate record against a list of existing ones for a matching combination of fields is exactly what Array.prototype.some() is for — it stops at the first match and returns true or false.`,
    expected: `let shifts = [];
export function validateShift(input) { return null; }
export function hasWorkerOverlap(candidate) {
  return shifts.some((row) => row.worker === candidate.worker && row.startsAt === candidate.startsAt);
}
`,
    analog_example: `const hasConflict = roster.some(
  (s) =>
    s.workerId === req.body.workerId &&
    !(req.body.endTime <= s.startTime || req.body.startTime >= s.endTime)
);
if (hasConflict) {
  return res.status(409).json({ error: "Worker already scheduled during this shift window" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Preventing scheduling overlaps stops workers from being double-booked.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/shifts with persistence and a conflict rule:

  Store    →  in-memory array of Shift
  Validate →  required fields before insert
  Conflict →  same worker + same startsAt → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let shifts = [];
export function validateShift(input) { return null; }
export function hasWorkerOverlap(candidate) {
  return shifts.some((row) => row.worker === candidate.worker && row.startsAt === candidate.startsAt);
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Scan store: Use .some() on your roster array.
2. Match criteria: Check if workerId matches and time windows overlap.
3. Reject conflicts: If found, halt execution with status 409.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Build GET to view published shifts and POST to create assignments, returning a 409 conflict if the worker is double-booked.

WHAT YOU'LL NEED
- GET endpoint returning stored shifts.
- POST endpoint applying 400 validation and 409 overlap checks before saving.

Your task: Build endpoints to return shifts and create new shifts with validation and overlap checks.`,
    hint: `1. Return store: Send status 200 with the roster array in GET.
2. Protect POST: Run validation and overlap checks before pushing the record.
3. Save record: Assign a unique ID, push the item to storage, and return status 201.`,
    example_code: `export function getShifts(res: Response) {
  return res.status(200).json(roster);
}

export function assignShift(req: Request, res: Response) {
  // Step 2 validation check (400)
  // Step 3 worker overlap check (409)
  const item = { id: generateShiftId(), ...req.body };
  roster.push(item);
  return res.status(201).json(item);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/shifts
GET /api/shifts
→ [ ...rows ]

POST /api/shifts
→ 201 created  OR  400/409 error
\`\`\`

A route handler is where validation, conflict-checking, and storage come together — it should call the helpers you already wrote, in order, not re-implement any of their logic inline. How do GET and POST above use shifts, validateShift, and hasWorkerOverlap together?`,
    mc_options: ["GET lists store; POST validates, rejects conflict, else 201","POST always 201 even on overlap","GET returns HTML instead of JSON"],
    mc_correct_option: "GET lists store; POST validates, rejects conflict, else 201",
    mc_anchor: "GET lists store; POST validates, rejects",
    why_this_matters: `Consistent error codes (400 for bad data, 409 for conflicts) make API behavior predictable.`,
    answer_keywords: ["409","400","201","validateShift","hasWorkerOverlap"],
    seed_code: `let shifts = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateShift(input) { return null; }
export function hasWorkerOverlap(c) { return false; }
`,
    starter_code: `let shifts = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateShift(input) { return null; }
export function hasWorkerOverlap(c) { return false; }
export function createHandlers() {
  return { list() {}, create() {} };
}
`,
    feedback_correct: "Correct — list and create with validation and conflict.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Wire helpers into GET/POST with the right status codes.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A route handler's job is to call helpers in the right order and translate their answers into HTTP status codes — the actual rules already live in the functions written in earlier steps.`,
    expected: `let shifts = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateShift(input) { return null; }
export function hasWorkerOverlap(candidate) {
  return shifts.some((row) => row.worker === candidate.worker && row.startsAt === candidate.startsAt);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(shifts);
    },
    create(req, res) {
      const err = validateShift(req.body);
      if (err) return res.status(400).json({ error: err });
      if (hasWorkerOverlap(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), worker: req.body.worker, role: req.body.role, startsAt: req.body.startsAt };
      shifts.push(row);
      res.status(201).json(row);
    },
  };
}
`,
    analog_example: `export function getShifts(res: Response) {
  return res.status(200).json(roster);
}

export function assignShift(req: Request, res: Response) {
  // Step 2 validation check (400)
  // Step 3 worker overlap check (409)
  const item = { id: generateShiftId(), ...req.body };
  roster.push(item);
  return res.status(201).json(item);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Consistent error codes (400 for bad data, 409 for conflicts) make API behavior predictable.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/shifts with persistence and a conflict rule:

  Store    →  in-memory array of Shift
  Validate →  required fields before insert
  Conflict →  same worker + same startsAt → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let shifts = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateShift(input) { return null; }
export function hasWorkerOverlap(candidate) {
  return shifts.some((row) => row.worker === candidate.worker && row.startsAt === candidate.startsAt);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(shifts);
    },
    create(req, res) {
      const err = validateShift(req.body);
      if (err) return res.status(400).json({ error: err });
      if (hasWorkerOverlap(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), worker: req.body.worker, role: req.body.role, startsAt: req.body.startsAt };
      shifts.push(row);
      res.status(201).json(row);
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Return store: Send status 200 with the roster array in GET.
2. Protect POST: Run validation and overlap checks before pushing the record.
3. Save record: Assign a unique ID, push the item to storage, and return status 201.`,
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
  title: "Shifts API with worker overlap conflicts",
  shortName: "Shift API",
});
