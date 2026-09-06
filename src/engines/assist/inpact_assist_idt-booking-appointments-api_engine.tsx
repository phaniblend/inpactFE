import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-booking-appointments-api",
      title: "Appointments API with slot conflicts",
      body: `Implement /api/appointments with persistence and a conflict rule:

  Store    →  in-memory array of Appointment
  Validate →  required fields before insert
  Conflict →  same provider + same startsAt is a conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      usecase: "Service businesses cannot double-book a provider. The API must refuse overlapping slots so the calendar stays trustworthy.",
      designMock: {"kind":"api-sample","screenTitle":"/api/appointments","caption":"Sample requests/responses — the server owns the conflict rule.","getSample":"GET /api/appointments\n→ [ { \"id\": \"1\", \"provider\": \"Maya\", \"service\": \"Color & cut\", \"startsAt\": \"2026-08-20T14:00:00Z\" } ]","postSample":"POST /api/appointments\n{ \"provider\": \"Maya\", \"service\": \"Color & cut\", \"startsAt\": \"2026-08-20T14:00:00Z\" }\n→ 201 created  OR  409 conflict"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Create an in-memory storage drawer and an ID generator to give each booking a unique receipt number.","Check incoming requests for missing patient names or times, rejecting incomplete data with an error (400).","Scan existing appointments to confirm no other booking already occupies that exact time slot.","Provide a GET doorway to read bookings and a POST doorway that blocks overlapping times with a conflict error (409)."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

This file doesn't exist yet — you're the first to touch it. Create it at \`server/routes/appointments.ts\` before anything else. Every step from here on edits that same file.

Create an in-memory storage drawer and an ID generator to give each booking a unique receipt number.

WHAT YOU'LL NEED
- A module-level array variable acting as the database.
- An ID generator function returning a unique text string.

Your task: Create a memory drawer on the server to hold records and a function that stamps unique IDs.`,
    hint: `1. Define the storage drawer: Declare a let variable initialized to an empty array, typed with your record shape.
2. Track counters: Declare a counter number variable outside the functions so it persists.
3. Build the generator: Write a helper function that returns the incremented counter turned into a string.`,
    example_code: `let records: Guest[] = [];
let nextId = 1;

function generateId(): string {
  return String(nextId++);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/appointments
GET /api/appointments
→ [ { "id": "1", "provider": "Maya", "service": "Color & cut", "startsAt": "2026-08-20T14:00:00Z" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next in a simple lesson server, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId helper","store only in the browser localStorage","ask the client to send the full database each time"],
    mc_correct_option: "module-level array + a counter-based nextId helper",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `A centralized storage list and unique ID generator ensure that new records never overwrite or collide with existing records.`,
    answer_keywords: ["appointments","nextId","nextIdCounter"],
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
    expected: `let appointments = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return appointments; }
`,
    analog_example: `let records: Guest[] = [];
let nextId = 1;

function generateId(): string {
  return String(nextId++);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `A centralized storage list and unique ID generator ensure that new records never overwrite or collide with existing records.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/appointments with persistence and a conflict rule:

  Store    →  in-memory array of Appointment
  Validate →  required fields before insert
  Conflict →  same provider + same startsAt is a conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let appointments = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return appointments; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Define the storage drawer: Declare a let variable initialized to an empty array, typed with your record shape.
2. Track counters: Declare a counter number variable outside the functions so it persists.
3. Build the generator: Write a helper function that returns the incremented counter turned into a string.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Check incoming requests for missing patient names or times, rejecting incomplete data with an error (400).

WHAT YOU'LL NEED
- An inspection of incoming request fields.
- A return of error status 400 if any required field is missing or empty.

Your task: Act as a bouncer that rejects incomplete submissions before they touch your memory drawer.`,
    hint: `1. Inspect the incoming data: Check body properties using the NOT operator (!).
2. Group the checks: Combine missing-property checks using OR (||).
3. Send early rejection: Inside the condition block, immediately return status 400 with an informative error message.`,
    example_code: `if (!body.name || !body.time) {
  return res.status(400).json({ error: "Name and time are required" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/appointments
POST /api/appointments
{ "provider": "Maya", "service": "Color & cut", "startsAt": "2026-08-20T14:00:00Z" }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. Looking at the POST body above, which checks have to pass before you push a row?`,
    mc_options: ["return an error string for missing/invalid fields, else null","always return null and trust the client","throw and crash the process on bad input"],
    mc_correct_option: "return an error string for missing/invalid fields, else null",
    mc_anchor: "return an error string for missing/inval",
    why_this_matters: `Validating data at the door ensures incomplete or malformed records never corrupt your internal storage.`,
    answer_keywords: ["validateAppointment","provider","service","startsAt"],
    seed_code: `let appointments = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let appointments = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateAppointment(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate, then create.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let appointments = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return appointments; }
export function validateAppointment(input) {
  if (typeof input?.provider !== "string" || !input.provider.trim()) return "provider is required";
  if (typeof input?.service !== "string" || !input.service.trim()) return "service is required";
  if (typeof input?.startsAt !== "string" || !input.startsAt.trim()) return "startsAt is required";
  return null;
}
`,
    analog_example: `if (!body.name || !body.time) {
  return res.status(400).json({ error: "Name and time are required" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Validating data at the door ensures incomplete or malformed records never corrupt your internal storage.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/appointments with persistence and a conflict rule:

  Store    →  in-memory array of Appointment
  Validate →  required fields before insert
  Conflict →  same provider + same startsAt is a conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let appointments = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return appointments; }
export function validateAppointment(input) {
  if (typeof input?.provider !== "string" || !input.provider.trim()) return "provider is required";
  if (typeof input?.service !== "string" || !input.service.trim()) return "service is required";
  if (typeof input?.startsAt !== "string" || !input.startsAt.trim()) return "startsAt is required";
  return null;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Inspect the incoming data: Check body properties using the NOT operator (!).
2. Group the checks: Combine missing-property checks using OR (||).
3. Send early rejection: Inside the condition block, immediately return status 400 with an informative error message.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Scan existing appointments to confirm no other booking already occupies that exact time slot.

WHAT YOU'LL NEED
- A search through the existing records array.
- A comparison between existing values and the incoming request value.

Your task: Scan existing bookings to verify that the requested time slot or key is not already taken.`,
    hint: `1. Scan the drawer: Use .some() on your records array to check if any existing element meets your conflict rule.
2. Match conflict fields: Inside the callback, return true if the stored identifying keys match the incoming body keys.
3. Reject collisions: If .some() returns true, halt execution immediately with status 409 (Conflict).`,
    example_code: `const hasConflict = records.some(
  (record) => record.date === body.date && record.slot === body.slot
);
if (hasConflict) {
  return res.status(409).json({ error: "Slot already booked" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/appointments
POST /api/appointments
→ 201 created  OR  409 conflict

Rule: same provider + same startsAt is a conflict
\`\`\`

Two requests can describe the same resource at the same moment — before inserting one, you compare it against everything already stored to decide whether it collides. Given the rule above, how should the server decide "conflict" before insert?`,
    mc_options: ["compare candidate against existing rows; true means conflict","always allow POST and fix conflicts in the UI later","delete the older row silently"],
    mc_correct_option: "compare candidate against existing rows; true means conflict",
    mc_anchor: "compare candidate against existing rows;",
    why_this_matters: `Checking for overlaps stops race conditions and guarantees that appointments never get double-booked.`,
    answer_keywords: ["hasSlotConflict","some","provider"],
    seed_code: `let appointments = [];
export function validateAppointment(input) { return null; }
`,
    starter_code: `let appointments = [];
export function validateAppointment(input) { return null; }
export function hasSlotConflict(candidate) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Server detects conflict before insert.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `Checking one candidate record against a list of existing ones for a matching combination of fields is exactly what Array.prototype.some() is for — it stops at the first match and returns true or false.`,
    expected: `let appointments = [];
export function validateAppointment(input) { return null; }
export function hasSlotConflict(candidate) {
  return appointments.some((row) => row.provider === candidate.provider && row.startsAt === candidate.startsAt);
}
`,
    analog_example: `const hasConflict = records.some(
  (record) => record.date === body.date && record.slot === body.slot
);
if (hasConflict) {
  return res.status(409).json({ error: "Slot already booked" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Checking for overlaps stops race conditions and guarantees that appointments never get double-booked.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/appointments with persistence and a conflict rule:

  Store    →  in-memory array of Appointment
  Validate →  required fields before insert
  Conflict →  same provider + same startsAt is a conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let appointments = [];
export function validateAppointment(input) { return null; }
export function hasSlotConflict(candidate) {
  return appointments.some((row) => row.provider === candidate.provider && row.startsAt === candidate.startsAt);
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Scan the drawer: Use .some() on your records array to check if any existing element meets your conflict rule.
2. Match conflict fields: Inside the callback, return true if the stored identifying keys match the incoming body keys.
3. Reject collisions: If .some() returns true, halt execution immediately with status 409 (Conflict).`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Provide a GET doorway to read bookings and a POST doorway that blocks overlapping times with a conflict error (409).

WHAT YOU'LL NEED
- A GET handler returning the records array with status 200.
- A POST handler running Step 2 checks (400), Step 3 checks (409), pushing valid data, and returning status 201.

Your task: Expose a route to read all stored items and a route to save new ones using your validation and conflict checks.`,
    hint: `1. Deliver the records: In the GET handler, return status 200 containing your in-memory array.
2. Run safety guards: In the POST handler, place your missing-field check (400) and overlap check (409) at the top.
3. Stamp and save: Create the new record object using your ID helper, push it into the storage array, and reply with status 201.`,
    example_code: `export function handleGet(res: Response) {
  return res.status(200).json(records);
}

export function handlePost(req: Request, res: Response) {
  // run validation -> return 400 if invalid
  // run conflict check -> return 409 if conflict
  const record = { id: generateId(), ...req.body };
  records.push(record);
  return res.status(201).json(record);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/appointments
GET /api/appointments
→ [ ...rows ]

POST /api/appointments
→ 201 created  OR  400/409 error
\`\`\`

A route handler is where validation, conflict-checking, and storage come together — it should call the helpers you already wrote, in order, not re-implement any of their logic inline. How do GET and POST above use appointments, validateAppointment, and hasSlotConflict together?`,
    mc_options: ["GET lists store; POST validates, rejects conflict, else 201","POST always 201 even on overlap","GET returns HTML instead of JSON"],
    mc_correct_option: "GET lists store; POST validates, rejects conflict, else 201",
    mc_anchor: "GET lists store; POST validates, rejects",
    why_this_matters: `Separating read and write doorways makes your API predictable, standard, and easy for frontend components to consume.


================================================================================`,
    answer_keywords: ["409","400","201","validateAppointment","hasSlotConflict"],
    seed_code: `let appointments = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateAppointment(input) { return null; }
export function hasSlotConflict(c) { return false; }
`,
    starter_code: `let appointments = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateAppointment(input) { return null; }
export function hasSlotConflict(c) { return false; }
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
    expected: `let appointments = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateAppointment(input) { return null; }
export function hasSlotConflict(candidate) {
  return appointments.some((row) => row.provider === candidate.provider && row.startsAt === candidate.startsAt);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(appointments);
    },
    create(req, res) {
      const err = validateAppointment(req.body);
      if (err) return res.status(400).json({ error: err });
      if (hasSlotConflict(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), provider: req.body.provider, service: req.body.service, startsAt: req.body.startsAt };
      appointments.push(row);
      res.status(201).json(row);
    },
  };
}
`,
    analog_example: `export function handleGet(res: Response) {
  return res.status(200).json(records);
}

export function handlePost(req: Request, res: Response) {
  // run validation -> return 400 if invalid
  // run conflict check -> return 409 if conflict
  const record = { id: generateId(), ...req.body };
  records.push(record);
  return res.status(201).json(record);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Separating read and write doorways makes your API predictable, standard, and easy for frontend components to consume.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/appointments with persistence and a conflict rule:

  Store    →  in-memory array of Appointment
  Validate →  required fields before insert
  Conflict →  same provider + same startsAt is a conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let appointments = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateAppointment(input) { return null; }
export function hasSlotConflict(candidate) {
  return appointments.some((row) => row.provider === candidate.provider && row.startsAt === candidate.startsAt);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(appointments);
    },
    create(req, res) {
      const err = validateAppointment(req.body);
      if (err) return res.status(400).json({ error: err });
      if (hasSlotConflict(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), provider: req.body.provider, service: req.body.service, startsAt: req.body.startsAt };
      appointments.push(row);
      res.status(201).json(row);
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Deliver the records: In the GET handler, return status 200 containing your in-memory array.
2. Run safety guards: In the POST handler, place your missing-field check (400) and overlap check (409) at the top.
3. Stamp and save: Create the new record object using your ID helper, push it into the storage array, and reply with status 201.`,
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
  title: "Appointments API with slot conflicts",
  shortName: "Book API",
});
