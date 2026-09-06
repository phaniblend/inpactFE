import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-invoice-reminder-api",
      title: "Reminders API — one pending nudge per invoice per channel",
      body: `Implement /api/reminders with persistence and a conflict rule:

  Store    →  in-memory array of Reminder
  Validate →  required fields before insert
  Conflict →  same invoiceId + channel already pending → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      usecase: "Do not spam: one pending reminder per invoice/channel is a server rule, not a UI hope.",
      designMock: {"kind":"api-sample","screenTitle":"/api/reminders","caption":"Sample requests/responses — the server owns the conflict rule.","getSample":"GET /api/reminders\n→ [ { \"id\": \"1\", \"invoiceId\": \"inv-9\", \"channel\": \"email\", \"sendAt\": \"2026-08-22T09:00:00Z\" } ]","postSample":"POST /api/reminders\n{ \"invoiceId\": \"inv-9\", \"channel\": \"email\", \"sendAt\": \"2026-08-22T09:00:00Z\" }\n→ 201 created  OR  409 conflict"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Set up memory storage for notification logs and an ID generator for reminder tokens.","Reject reminder requests that omit the invoice ID, destination address, or contact channel (400).","Inspect stored reminders to verify no pending nudge already exists for that specific invoice on that same channel.","Build GET to list reminders and POST to create nudges, sending a 409 conflict if a duplicate reminder is already queued."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Set up memory storage for notification logs and an ID generator for reminder tokens.

WHAT YOU'LL NEED
- An array holding reminder records.
- An incremental ID generator helper.

Your task: Set up server storage for reminder records and an ID generator.`,
    hint: `1. In-memory store: Declare an empty array typed with your reminder shape.
2. ID helper: Return an incremented string ID from your helper function.`,
    example_code: `let reminders: ReminderRecord[] = [];
let remIdCounter = 1;

function getNextReminderId(): string {
  return \`rem-\${remIdCounter++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/reminders
GET /api/reminders
→ [ { "id": "1", "invoiceId": "inv-9", "channel": "email", "sendAt": "2026-08-22T09:00:00Z" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next in a simple lesson server, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId helper","store only in the browser localStorage","ask the client to send the full database each time"],
    mc_correct_option: "module-level array + a counter-based nextId helper",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `In-memory storage allows rapid testing of API endpoints without database overhead.`,
    answer_keywords: ["reminders","nextId","nextIdCounter"],
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
    expected: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return reminders; }
`,
    analog_example: `let reminders: ReminderRecord[] = [];
let remIdCounter = 1;

function getNextReminderId(): string {
  return \`rem-\${remIdCounter++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `In-memory storage allows rapid testing of API endpoints without database overhead.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/reminders with persistence and a conflict rule:

  Store    →  in-memory array of Reminder
  Validate →  required fields before insert
  Conflict →  same invoiceId + channel already pending → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return reminders; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. In-memory store: Declare an empty array typed with your reminder shape.
2. ID helper: Return an incremented string ID from your helper function.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Reject reminder requests that omit the invoice ID, destination address, or contact channel (400).

WHAT YOU'LL NEED
- Checks verifying required body properties.
- 400 response for incomplete data.

Your task: Reject reminder requests missing invoice ID, channel, or message with status 400.`,
    hint: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 with an informative error message.`,
    example_code: `if (!req.body.invoiceId || !req.body.channel) {
  return res.status(400).json({ error: "Invoice ID and channel are required" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/reminders
POST /api/reminders
{ "invoiceId": "inv-9", "channel": "email", "sendAt": "2026-08-22T09:00:00Z" }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. Looking at the POST body above, which checks have to pass before you push a row?`,
    mc_options: ["return an error string for missing/invalid fields, else null","always return null and trust the client","throw and crash the process on bad input"],
    mc_correct_option: "return an error string for missing/invalid fields, else null",
    mc_anchor: "return an error string for missing/inval",
    why_this_matters: `Validation prevents incomplete reminder entries from being scheduled.`,
    answer_keywords: ["validateReminder","invoiceId","channel","sendAt"],
    seed_code: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReminder(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate, then create.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return reminders; }
export function validateReminder(input) {
  if (typeof input?.invoiceId !== "string" || !input.invoiceId.trim()) return "invoiceId is required";
  if (typeof input?.channel !== "string" || !input.channel.trim()) return "channel is required";
  if (typeof input?.sendAt !== "string" || !input.sendAt.trim()) return "sendAt is required";
  return null;
}
`,
    analog_example: `if (!req.body.invoiceId || !req.body.channel) {
  return res.status(400).json({ error: "Invoice ID and channel are required" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Validation prevents incomplete reminder entries from being scheduled.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/reminders with persistence and a conflict rule:

  Store    →  in-memory array of Reminder
  Validate →  required fields before insert
  Conflict →  same invoiceId + channel already pending → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return reminders; }
export function validateReminder(input) {
  if (typeof input?.invoiceId !== "string" || !input.invoiceId.trim()) return "invoiceId is required";
  if (typeof input?.channel !== "string" || !input.channel.trim()) return "channel is required";
  if (typeof input?.sendAt !== "string" || !input.sendAt.trim()) return "sendAt is required";
  return null;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 with an informative error message.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Inspect stored reminders to verify no pending nudge already exists for that specific invoice on that same channel.

WHAT YOU'LL NEED
- An array search checking for matching invoiceId and channel.
- 409 conflict response if a duplicate is found.

Your task: Scan existing reminders to ensure a pending reminder does not already exist for this invoice on this channel.`,
    hint: `1. Scan store: Use .some() on your reminders array.
2. Match criteria: Check if invoiceId, channel, and status === 'pending' all match.
3. Reject conflicts: If found, halt execution with status 409.`,
    example_code: `const exists = reminders.some(
  (r) =>
    r.invoiceId === req.body.invoiceId &&
    r.channel === req.body.channel &&
    r.status === "pending"
);
if (exists) {
  return res.status(409).json({ error: "Pending reminder already exists on this channel" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/reminders
POST /api/reminders
→ 201 created  OR  409 conflict

Rule: same invoiceId + channel already pending → conflict
\`\`\`

Two requests can describe the same resource at the same moment — before inserting one, you compare it against everything already stored to decide whether it collides. Given the rule above, how should the server decide "conflict" before insert?`,
    mc_options: ["compare candidate against existing rows; true means conflict","always allow POST and fix conflicts in the UI later","delete the older row silently"],
    mc_correct_option: "compare candidate against existing rows; true means conflict",
    mc_anchor: "compare candidate against existing rows;",
    why_this_matters: `Checking for duplicates prevents spamming clients with multiple reminders on the same channel.`,
    answer_keywords: ["hasPendingReminder","some","invoiceId"],
    seed_code: `let reminders = [];
export function validateReminder(input) { return null; }
`,
    starter_code: `let reminders = [];
export function validateReminder(input) { return null; }
export function hasPendingReminder(candidate) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Server detects conflict before insert.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `Checking one candidate record against a list of existing ones for a matching combination of fields is exactly what Array.prototype.some() is for — it stops at the first match and returns true or false.`,
    expected: `let reminders = [];
export function validateReminder(input) { return null; }
export function hasPendingReminder(candidate) {
  return reminders.some((row) => row.invoiceId === candidate.invoiceId && row.sendAt === candidate.sendAt);
}
`,
    analog_example: `const exists = reminders.some(
  (r) =>
    r.invoiceId === req.body.invoiceId &&
    r.channel === req.body.channel &&
    r.status === "pending"
);
if (exists) {
  return res.status(409).json({ error: "Pending reminder already exists on this channel" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Checking for duplicates prevents spamming clients with multiple reminders on the same channel.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/reminders with persistence and a conflict rule:

  Store    →  in-memory array of Reminder
  Validate →  required fields before insert
  Conflict →  same invoiceId + channel already pending → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let reminders = [];
export function validateReminder(input) { return null; }
export function hasPendingReminder(candidate) {
  return reminders.some((row) => row.invoiceId === candidate.invoiceId && row.sendAt === candidate.sendAt);
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Scan store: Use .some() on your reminders array.
2. Match criteria: Check if invoiceId, channel, and status === 'pending' all match.
3. Reject conflicts: If found, halt execution with status 409.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Build GET to list reminders and POST to create nudges, sending a 409 conflict if a duplicate reminder is already queued.

WHAT YOU'LL NEED
- GET endpoint returning stored reminders.
- POST endpoint applying 400 validation and 409 conflict checks before saving.

Your task: Build endpoints to fetch all reminders and save new reminders with validation checks in place.`,
    hint: `1. Return store: Send status 200 with the reminders array in GET.
2. Protect POST: Run validation and duplicate checks before pushing the record.
3. Save record: Assign a unique ID, append the record to the array, and return status 201.`,
    example_code: `export function getReminders(res: Response) {
  return res.status(200).json(reminders);
}

export function createReminder(req: Request, res: Response) {
  // Step 2 validation check (400)
  // Step 3 duplicate check (409)
  const item = { id: getNextReminderId(), ...req.body, status: "pending" };
  reminders.push(item);
  return res.status(201).json(item);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/reminders
GET /api/reminders
→ [ ...rows ]

POST /api/reminders
→ 201 created  OR  400/409 error
\`\`\`

A route handler is where validation, conflict-checking, and storage come together — it should call the helpers you already wrote, in order, not re-implement any of their logic inline. How do GET and POST above use reminders, validateReminder, and hasPendingReminder together?`,
    mc_options: ["GET lists store; POST validates, rejects conflict, else 201","POST always 201 even on overlap","GET returns HTML instead of JSON"],
    mc_correct_option: "GET lists store; POST validates, rejects conflict, else 201",
    mc_anchor: "GET lists store; POST validates, rejects",
    why_this_matters: `Clear error codes (400 for bad data, 409 for conflicts) make API behavior predictable.


================================================================================`,
    answer_keywords: ["409","400","201","validateReminder","hasPendingReminder"],
    seed_code: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReminder(input) { return null; }
export function hasPendingReminder(c) { return false; }
`,
    starter_code: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReminder(input) { return null; }
export function hasPendingReminder(c) { return false; }
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
    expected: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReminder(input) { return null; }
export function hasPendingReminder(candidate) {
  return reminders.some((row) => row.invoiceId === candidate.invoiceId && row.sendAt === candidate.sendAt);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(reminders);
    },
    create(req, res) {
      const err = validateReminder(req.body);
      if (err) return res.status(400).json({ error: err });
      if (hasPendingReminder(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), invoiceId: req.body.invoiceId, channel: req.body.channel, sendAt: req.body.sendAt };
      reminders.push(row);
      res.status(201).json(row);
    },
  };
}
`,
    analog_example: `export function getReminders(res: Response) {
  return res.status(200).json(reminders);
}

export function createReminder(req: Request, res: Response) {
  // Step 2 validation check (400)
  // Step 3 duplicate check (409)
  const item = { id: getNextReminderId(), ...req.body, status: "pending" };
  reminders.push(item);
  return res.status(201).json(item);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Clear error codes (400 for bad data, 409 for conflicts) make API behavior predictable.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/reminders with persistence and a conflict rule:

  Store    →  in-memory array of Reminder
  Validate →  required fields before insert
  Conflict →  same invoiceId + channel already pending → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReminder(input) { return null; }
export function hasPendingReminder(candidate) {
  return reminders.some((row) => row.invoiceId === candidate.invoiceId && row.sendAt === candidate.sendAt);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(reminders);
    },
    create(req, res) {
      const err = validateReminder(req.body);
      if (err) return res.status(400).json({ error: err });
      if (hasPendingReminder(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), invoiceId: req.body.invoiceId, channel: req.body.channel, sendAt: req.body.sendAt };
      reminders.push(row);
      res.status(201).json(row);
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Return store: Send status 200 with the reminders array in GET.
2. Protect POST: Run validation and duplicate checks before pushing the record.
3. Save record: Assign a unique ID, append the record to the array, and return status 201.`,
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
  title: "Reminders API — one pending nudge per invoice per channel",
  shortName: "Reminder API",
});
