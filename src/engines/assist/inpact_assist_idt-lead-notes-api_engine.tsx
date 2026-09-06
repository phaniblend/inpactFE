import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-lead-notes-api",
      title: "Notes API — block duplicate notes per lead",
      body: `Implement /api/lead-notes with persistence and a conflict rule:

  Store    →  in-memory array of ReplyNote
  Validate →  required fields before insert
  Conflict →  same leadId + same body already stored → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      usecase: "APIs should reject obvious duplicate notes so the timeline stays readable.",
      designMock: {"kind":"api-sample","screenTitle":"/api/lead-notes","caption":"Sample requests/responses — the server owns the conflict rule.","getSample":"GET /api/lead-notes\n→ [ { \"id\": \"1\", \"leadId\": \"L-1\", \"body\": \"Sent price sheet\", \"channel\": \"sms\" } ]","postSample":"POST /api/lead-notes\n{ \"leadId\": \"L-1\", \"body\": \"Sent price sheet\", \"channel\": \"sms\" }\n→ 201 created  OR  409 conflict"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Set up a note storage drawer in memory and an ID generator for unique note references.","Require that all note submissions contain both a lead ID and non-empty note content (400).","Search existing notes to ensure this exact message hasn't already been logged for this lead.","Expose a GET endpoint to view notes and a POST endpoint that returns 409 if a matching note already exists."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Set up a note storage drawer in memory and an ID generator for unique note references.

WHAT YOU'LL NEED
- An array holding note records.
- An incremental ID generator helper.

Your task: Set up server storage for notes and an ID generator.`,
    hint: `1. In-memory store: Declare an empty array typed with your note interface.
2. ID helper: Return an incremental ID string from your helper function.`,
    example_code: `let notesStore: NoteRecord[] = [];
let noteIdCounter = 1;

function generateNoteId(): string {
  return \`note-\${noteIdCounter++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/lead-notes
GET /api/lead-notes
→ [ { "id": "1", "leadId": "L-1", "body": "Sent price sheet", "channel": "sms" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next in a simple lesson server, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId helper","store only in the browser localStorage","ask the client to send the full database each time"],
    mc_correct_option: "module-level array + a counter-based nextId helper",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `In-memory storage allows quick API testing without database setup.`,
    answer_keywords: ["notes","nextId","nextIdCounter"],
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
    expected: `let notes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return notes; }
`,
    analog_example: `let notesStore: NoteRecord[] = [];
let noteIdCounter = 1;

function generateNoteId(): string {
  return \`note-\${noteIdCounter++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `In-memory storage allows quick API testing without database setup.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/lead-notes with persistence and a conflict rule:

  Store    →  in-memory array of ReplyNote
  Validate →  required fields before insert
  Conflict →  same leadId + same body already stored → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let notes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return notes; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. In-memory store: Declare an empty array typed with your note interface.
2. ID helper: Return an incremental ID string from your helper function.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Require that all note submissions contain both a lead ID and non-empty note content (400).

WHAT YOU'LL NEED
- Checks verifying required body properties.
- 400 status response for incomplete requests.

Your task: Reject note submissions that lack a lead ID or note text with status 400.`,
    hint: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 if any required field is falsy.`,
    example_code: `if (!req.body.leadId || !req.body.text) {
  return res.status(400).json({ error: "Lead ID and text content are required" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/lead-notes
POST /api/lead-notes
{ "leadId": "L-1", "body": "Sent price sheet", "channel": "sms" }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. Looking at the POST body above, which checks have to pass before you push a row?`,
    mc_options: ["return an error string for missing/invalid fields, else null","always return null and trust the client","throw and crash the process on bad input"],
    mc_correct_option: "return an error string for missing/invalid fields, else null",
    mc_anchor: "return an error string for missing/inval",
    why_this_matters: `Validating inputs ensures empty or unlinked notes never enter storage.`,
    answer_keywords: ["validateNote","leadId","body","channel"],
    seed_code: `let notes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let notes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateNote(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate, then create.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let notes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return notes; }
export function validateNote(input) {
  if (typeof input?.leadId !== "string" || !input.leadId.trim()) return "leadId is required";
  if (typeof input?.body !== "string" || !input.body.trim()) return "body is required";
  if (typeof input?.channel !== "string" || !input.channel.trim()) return "channel is required";
  return null;
}
`,
    analog_example: `if (!req.body.leadId || !req.body.text) {
  return res.status(400).json({ error: "Lead ID and text content are required" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Validating inputs ensures empty or unlinked notes never enter storage.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/lead-notes with persistence and a conflict rule:

  Store    →  in-memory array of ReplyNote
  Validate →  required fields before insert
  Conflict →  same leadId + same body already stored → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let notes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return notes; }
export function validateNote(input) {
  if (typeof input?.leadId !== "string" || !input.leadId.trim()) return "leadId is required";
  if (typeof input?.body !== "string" || !input.body.trim()) return "body is required";
  if (typeof input?.channel !== "string" || !input.channel.trim()) return "channel is required";
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
    paal: `Search existing notes to ensure this exact message hasn't already been logged for this lead.

WHAT YOU'LL NEED
- An array search checking for matching leadId and text.
- 409 conflict response if a duplicate is found.

Your task: Scan existing notes to ensure an identical note has not already been logged for this lead.`,
    hint: `1. Scan store: Use .some() on your notes array.
2. Match criteria: Compare leadId and text properties.
3. Reject duplicates: If found, halt execution with status 409.`,
    example_code: `const isDuplicate = notesStore.some(
  (n) => n.leadId === req.body.leadId && n.text === req.body.text
);
if (isDuplicate) {
  return res.status(409).json({ error: "Duplicate note detected for this lead" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/lead-notes
POST /api/lead-notes
→ 201 created  OR  409 conflict

Rule: same leadId + same body already stored → conflict
\`\`\`

Two requests can describe the same resource at the same moment — before inserting one, you compare it against everything already stored to decide whether it collides. Given the rule above, how should the server decide "conflict" before insert?`,
    mc_options: ["compare candidate against existing rows; true means conflict","always allow POST and fix conflicts in the UI later","delete the older row silently"],
    mc_correct_option: "compare candidate against existing rows; true means conflict",
    mc_anchor: "compare candidate against existing rows;",
    why_this_matters: `Preventing duplicate notes keeps customer interaction logs clean and uncluttered.`,
    answer_keywords: ["isDuplicateNote","some","leadId"],
    seed_code: `let notes = [];
export function validateNote(input) { return null; }
`,
    starter_code: `let notes = [];
export function validateNote(input) { return null; }
export function isDuplicateNote(candidate) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Server detects conflict before insert.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `Checking one candidate record against a list of existing ones for a matching combination of fields is exactly what Array.prototype.some() is for — it stops at the first match and returns true or false.`,
    expected: `let notes = [];
export function validateNote(input) { return null; }
export function isDuplicateNote(candidate) {
  return notes.some((row) => row.leadId === candidate.leadId && row.channel === candidate.channel);
}
`,
    analog_example: `const isDuplicate = notesStore.some(
  (n) => n.leadId === req.body.leadId && n.text === req.body.text
);
if (isDuplicate) {
  return res.status(409).json({ error: "Duplicate note detected for this lead" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Preventing duplicate notes keeps customer interaction logs clean and uncluttered.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/lead-notes with persistence and a conflict rule:

  Store    →  in-memory array of ReplyNote
  Validate →  required fields before insert
  Conflict →  same leadId + same body already stored → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let notes = [];
export function validateNote(input) { return null; }
export function isDuplicateNote(candidate) {
  return notes.some((row) => row.leadId === candidate.leadId && row.channel === candidate.channel);
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Scan store: Use .some() on your notes array.
2. Match criteria: Compare leadId and text properties.
3. Reject duplicates: If found, halt execution with status 409.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Expose a GET endpoint to view notes and a POST endpoint that returns 409 if a matching note already exists.

WHAT YOU'LL NEED
- GET endpoint returning stored notes.
- POST endpoint applying 400 validation and 409 duplicate checks before saving.

Your task: Build endpoints to return notes and create new ones with validation and duplicate checks.`,
    hint: `1. Return store: Send status 200 with the notes array in GET.
2. Protect POST: Run validation and duplicate checks before pushing the record.
3. Save record: Assign a unique ID, push the item to storage, and return status 201.`,
    example_code: `export function getNotes(res: Response) {
  return res.status(200).json(notesStore);
}

export function createNote(req: Request, res: Response) {
  // Step 2 validation check (400)
  // Step 3 duplicate check (409)
  const item = { id: generateNoteId(), ...req.body };
  notesStore.push(item);
  return res.status(201).json(item);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/lead-notes
GET /api/lead-notes
→ [ ...rows ]

POST /api/lead-notes
→ 201 created  OR  400/409 error
\`\`\`

A route handler is where validation, conflict-checking, and storage come together — it should call the helpers you already wrote, in order, not re-implement any of their logic inline. How do GET and POST above use notes, validateNote, and isDuplicateNote together?`,
    mc_options: ["GET lists store; POST validates, rejects conflict, else 201","POST always 201 even on overlap","GET returns HTML instead of JSON"],
    mc_correct_option: "GET lists store; POST validates, rejects conflict, else 201",
    mc_anchor: "GET lists store; POST validates, rejects",
    why_this_matters: `Consistent error codes (400 for bad data, 409 for duplicates) make the API easy to consume.


================================================================================`,
    answer_keywords: ["409","400","201","validateNote","isDuplicateNote"],
    seed_code: `let notes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateNote(input) { return null; }
export function isDuplicateNote(c) { return false; }
`,
    starter_code: `let notes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateNote(input) { return null; }
export function isDuplicateNote(c) { return false; }
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
    expected: `let notes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateNote(input) { return null; }
export function isDuplicateNote(candidate) {
  return notes.some((row) => row.leadId === candidate.leadId && row.channel === candidate.channel);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(notes);
    },
    create(req, res) {
      const err = validateNote(req.body);
      if (err) return res.status(400).json({ error: err });
      if (isDuplicateNote(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), leadId: req.body.leadId, body: req.body.body, channel: req.body.channel };
      notes.push(row);
      res.status(201).json(row);
    },
  };
}
`,
    analog_example: `export function getNotes(res: Response) {
  return res.status(200).json(notesStore);
}

export function createNote(req: Request, res: Response) {
  // Step 2 validation check (400)
  // Step 3 duplicate check (409)
  const item = { id: generateNoteId(), ...req.body };
  notesStore.push(item);
  return res.status(201).json(item);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Consistent error codes (400 for bad data, 409 for duplicates) make the API easy to consume.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/lead-notes with persistence and a conflict rule:

  Store    →  in-memory array of ReplyNote
  Validate →  required fields before insert
  Conflict →  same leadId + same body already stored → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let notes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateNote(input) { return null; }
export function isDuplicateNote(candidate) {
  return notes.some((row) => row.leadId === candidate.leadId && row.channel === candidate.channel);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(notes);
    },
    create(req, res) {
      const err = validateNote(req.body);
      if (err) return res.status(400).json({ error: err });
      if (isDuplicateNote(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), leadId: req.body.leadId, body: req.body.body, channel: req.body.channel };
      notes.push(row);
      res.status(201).json(row);
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Return store: Send status 200 with the notes array in GET.
2. Protect POST: Run validation and duplicate checks before pushing the record.
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
  title: "Notes API — block duplicate notes per lead",
  shortName: "Notes API",
});
