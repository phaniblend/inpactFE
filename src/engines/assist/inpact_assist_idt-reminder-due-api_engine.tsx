import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-reminder-due-api",
      title: "Reminders API with due/sent status",
      body: `Implement /api/scheduled-reminders with a derived status:

  Store    →  in-memory ScheduledReminder rows
  Validate →  required fields
  Derive   →  sent → sent; else sendAt in the past → due; else scheduled
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      usecase: "Due vs scheduled must be derived from sendAt and sent — not invented by the browser.",
      designMock: {"kind":"api-sample","screenTitle":"/api/scheduled-reminders","caption":"Status is computed on the way out — clients cannot fake it.","getSample":"GET /api/scheduled-reminders\n→ [ { \"id\": \"1\", \"status\": \"…\" } ]","postSample":"POST /api/scheduled-reminders\n{ …fields… }\n→ 201 { …row, \"status\": \"…\" }"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Set up a reminder memory drawer and an ID generator for tracking notification receipts.","Ensure incoming requests include a target recipient and scheduled dispatch timestamp.","Have the server verify whether the dispatch time has passed to classify the record as \"due\" or \"sent\".","Expose GET to retrieve reminders and POST to record reminders with their calculated dispatch status."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

This file doesn't exist yet — you're the first to touch it. Create it at \`server/routes/scheduled-reminders.ts\` before anything else. Every step from here on edits that same file.

Set up a reminder memory drawer and an ID generator for tracking notification receipts.

WHAT YOU'LL NEED
- An array holding reminder records.
- An incremental ID generator helper.

Your task: Set up server storage for reminders and an ID generator.`,
    hint: `1. In-memory store: Declare an empty array typed with your scheduled reminder shape.
2. ID helper: Return an incremental ID string from your helper function.`,
    example_code: `let scheduleStore: ScheduledReminder[] = [];
let scheduleIdCounter = 1;

function makeScheduleId(): string {
  return \`sched-\${scheduleIdCounter++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/scheduled-reminders
GET /api/scheduled-reminders
→ [ { "id": "1", "status": "…" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId","no store — recompute from logs only","client sends the whole catalog every GET"],
    mc_correct_option: "module-level array + a counter-based nextId",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `In-memory storage allows quick API testing without database setup.`,
    answer_keywords: ["reminders","nextId","nextIdCounter"],
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
    expected: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return reminders; }
`,
    analog_example: `let scheduleStore: ScheduledReminder[] = [];
let scheduleIdCounter = 1;

function makeScheduleId(): string {
  return \`sched-\${scheduleIdCounter++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `In-memory storage allows quick API testing without database setup.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/scheduled-reminders with a derived status:

  Store    →  in-memory ScheduledReminder rows
  Validate →  required fields
  Derive   →  sent → sent; else sendAt in the past → due; else scheduled
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return reminders; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. In-memory store: Declare an empty array typed with your scheduled reminder shape.
2. ID helper: Return an incremental ID string from your helper function.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Ensure incoming requests include a target recipient and scheduled dispatch timestamp.

WHAT YOU'LL NEED
- Checks verifying required body properties.
- 400 status response for incomplete requests.

Your task: Reject reminder requests lacking target recipient or send time with status 400.`,
    hint: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 if any required field is falsy.`,
    example_code: `if (!req.body.recipient || !req.body.sendTime) {
  return res.status(400).json({ error: "Recipient and send time are required" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/scheduled-reminders
POST /api/scheduled-reminders
{ …fields… }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. What must be true about the fields above before you insert a row?`,
    mc_options: ["error string for bad fields, else null","accept any JSON","coerce everything to strings silently"],
    mc_correct_option: "error string for bad fields, else null",
    mc_anchor: "error string for bad fields, else null",
    why_this_matters: `Validation prevents reminders with missing delivery details from entering storage.`,
    answer_keywords: ["validateScheduledReminder","client","channel","sendAt"],
    seed_code: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateScheduledReminder(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate first.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return reminders; }
export function validateScheduledReminder(input) {
  if (typeof input?.client !== "string" || !input.client.trim()) return "client is required";
  if (typeof input?.channel !== "string" || !input.channel.trim()) return "channel is required";
  if (typeof input?.sendAt !== "string" || !input.sendAt.trim()) return "sendAt is required";
  return null;
}
`,
    analog_example: `if (!req.body.recipient || !req.body.sendTime) {
  return res.status(400).json({ error: "Recipient and send time are required" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Validation prevents reminders with missing delivery details from entering storage.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/scheduled-reminders with a derived status:

  Store    →  in-memory ScheduledReminder rows
  Validate →  required fields
  Derive   →  sent → sent; else sendAt in the past → due; else scheduled
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return reminders; }
export function validateScheduledReminder(input) {
  if (typeof input?.client !== "string" || !input.client.trim()) return "client is required";
  if (typeof input?.channel !== "string" || !input.channel.trim()) return "channel is required";
  if (typeof input?.sendAt !== "string" || !input.sendAt.trim()) return "sendAt is required";
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

Have the server verify whether the dispatch time has passed to classify the record as "due" or "sent".

WHAT YOU'LL NEED
- Timestamp comparison evaluating whether sendTime is past.
- Assignment of "due" or "sent" based on that check.

Your task: Calculate whether a reminder is "due" or "sent" based on scheduled timestamps on the server.`,
    hint: `1. Compare timestamps: Check if sendTime is before or equal to Date.now().
2. Set status: Assign "due" if past/ready; otherwise, assign "sent" (or pending).`,
    example_code: `const hasPassed = new Date(req.body.sendTime).getTime() <= Date.now();
const status = hasPassed ? "due" : "sent";`,
    think_prompt: `\`\`\`text
SAMPLE — /api/scheduled-reminders
GET /api/scheduled-reminders
→ [ { "id": "1", "status": "…" } ]

Rule: sent → sent; else sendAt in the past → due; else scheduled
\`\`\`

A status label describing a record can always be recalculated from that record's own stored facts — comparing dates, or checking a boolean flag — rather than being sent by the client and simply trusted. Given the rule above, should the browser send status, or should the server compute it — and from what?`,
    mc_options: ["server derives status from stored facts; ignore client status","save req.body.status as-is","randomize status on every GET"],
    mc_correct_option: "server derives status from stored facts; ignore client status",
    mc_anchor: "server derives status from stored facts;",
    why_this_matters: `Server-calculated statuses guarantee consistency based on verifiable timestamps.`,
    answer_keywords: ["deriveReminderStatus"],
    seed_code: `let reminders = [];
export function validateScheduledReminder(input) { return null; }
`,
    starter_code: `let reminders = [];
export function validateScheduledReminder(input) { return null; }
export function deriveReminderStatus(row, now = new Date()) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Status is computed on the server.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A derive function takes one stored row (plus, optionally, the current time) and returns a label computed purely from that row's own fields — it never reads anything the client sent in the current request.`,
    expected: `let reminders = [];
export function validateScheduledReminder(input) { return null; }
export function deriveReminderStatus(row, now = new Date()) {
  if (row.sent === true) return "sent";
  if (new Date(row.sendAt) < now) return "due";
  return "scheduled";
}
`,
    analog_example: `const hasPassed = new Date(req.body.sendTime).getTime() <= Date.now();
const status = hasPassed ? "due" : "sent";`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Server-calculated statuses guarantee consistency based on verifiable timestamps.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/scheduled-reminders with a derived status:

  Store    →  in-memory ScheduledReminder rows
  Validate →  required fields
  Derive   →  sent → sent; else sendAt in the past → due; else scheduled
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let reminders = [];
export function validateScheduledReminder(input) { return null; }
export function deriveReminderStatus(row, now = new Date()) {
  if (row.sent === true) return "sent";
  if (new Date(row.sendAt) < now) return "due";
  return "scheduled";
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Compare timestamps: Check if sendTime is before or equal to Date.now().
2. Set status: Assign "due" if past/ready; otherwise, assign "sent" (or pending).`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Expose GET to retrieve reminders and POST to record reminders with their calculated dispatch status.

WHAT YOU'LL NEED
- GET endpoint returning stored reminders.
- POST endpoint validating data, computing status, saving, and returning 201.

Your task: Build endpoints to fetch reminders and schedule new reminders with the calculated status.`,
    hint: `1. Return store: Send status 200 with the scheduleStore array in GET.
2. Protect POST: Run validation and status derivation before pushing the record.
3. Save record: Assign a unique ID, push the item to storage, and return status 201.`,
    example_code: `export function getSchedule(res: Response) {
  return res.status(200).json(scheduleStore);
}

export function createScheduleItem(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derive status
  const item = { id: makeScheduleId(), ...req.body, status };
  scheduleStore.push(item);
  return res.status(201).json(item);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/scheduled-reminders
GET /api/scheduled-reminders
→ [ …rows with status ]

POST /api/scheduled-reminders
→ 201 { …row, "status": "…" }
\`\`\`

Attaching a computed field to data on its way out of a route means running the derive function once per record, every time that record is returned — never once at write time and then reused. How do GET and POST above reuse validateScheduledReminder and deriveReminderStatus to guarantee status is never stale?`,
    mc_options: ["GET/POST attach derived status; POST validates first","POST stores client status verbatim","GET omits status"],
    mc_correct_option: "GET/POST attach derived status; POST validates first",
    mc_anchor: "GET/POST attach derived status; POST val",
    why_this_matters: `The client receives back the scheduled reminder along with its server-calculated status tag.


================================================================================`,
    answer_keywords: ["deriveReminderStatus","validateScheduledReminder","201"],
    seed_code: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateScheduledReminder(input) { return null; }
export function deriveReminderStatus(row, now = new Date()) { return "open"; }
`,
    starter_code: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateScheduledReminder(input) { return null; }
export function deriveReminderStatus(row, now = new Date()) { return "open"; }
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
    expected: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateScheduledReminder(input) { return null; }
export function deriveReminderStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(reminders.map((r) => ({ ...r, status: deriveReminderStatus(r) })));
    },
    create(req, res) {
      const err = validateScheduledReminder(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), client: req.body.client, channel: req.body.channel, sendAt: req.body.sendAt, sent: false };
      reminders.push(row);
      res.status(201).json({ ...row, status: deriveReminderStatus(row) });
    },
  };
}
`,
    analog_example: `export function getSchedule(res: Response) {
  return res.status(200).json(scheduleStore);
}

export function createScheduleItem(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derive status
  const item = { id: makeScheduleId(), ...req.body, status };
  scheduleStore.push(item);
  return res.status(201).json(item);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The client receives back the scheduled reminder along with its server-calculated status tag.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/scheduled-reminders with a derived status:

  Store    →  in-memory ScheduledReminder rows
  Validate →  required fields
  Derive   →  sent → sent; else sendAt in the past → due; else scheduled
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let reminders = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateScheduledReminder(input) { return null; }
export function deriveReminderStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(reminders.map((r) => ({ ...r, status: deriveReminderStatus(r) })));
    },
    create(req, res) {
      const err = validateScheduledReminder(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), client: req.body.client, channel: req.body.channel, sendAt: req.body.sendAt, sent: false };
      reminders.push(row);
      res.status(201).json({ ...row, status: deriveReminderStatus(row) });
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Return store: Send status 200 with the scheduleStore array in GET.
2. Protect POST: Run validation and status derivation before pushing the record.
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
  title: "Reminders API with due/sent status",
  shortName: "Reminder due API",
});
