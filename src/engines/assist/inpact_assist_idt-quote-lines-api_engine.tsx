import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-quote-lines-api",
      title: "Quote lines API — no duplicate label on a quote",
      body: `Implement /api/quote-lines with persistence and a conflict rule:

  Store    →  in-memory array of QuoteLine
  Validate →  required fields before insert
  Conflict →  same quoteId + same label → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      usecase: "Two Labor lines on one quote confuse totals. The API rejects duplicate labels.",
      designMock: {"kind":"api-sample","screenTitle":"/api/quote-lines","caption":"Sample requests/responses — the server owns the conflict rule.","getSample":"GET /api/quote-lines\n→ [ { \"id\": \"1\", \"quoteId\": \"q-1\", \"label\": \"Labor\", \"amount\": 900 } ]","postSample":"POST /api/quote-lines\n{ \"quoteId\": \"q-1\", \"label\": \"Labor\", \"amount\": 900 }\n→ 201 created  OR  409 conflict"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Create an in-memory line-item store and an ID generator to stamp unique line IDs.","Require that line-item submissions include an estimate ID, item name, and price (400).","Check existing line items on that quote to ensure the same item name is not entered twice.","Expose GET to list lines and POST to create new lines, returning a 409 error if that item label is already present."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Create an in-memory line-item store and an ID generator to stamp unique line IDs.

WHAT YOU'LL NEED
- An array holding line records.
- An incremental ID generator helper.

Your task: Set up server storage for quote line items and an ID generator.`,
    hint: `1. In-memory store: Declare an empty array typed with your line item interface.
2. ID helper: Return an incremental ID string from your helper function.`,
    example_code: `let quoteLines: QuoteLineRecord[] = [];
let lineIdCounter = 1;

function generateLineId(): string {
  return \`line-\${lineIdCounter++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/quote-lines
GET /api/quote-lines
→ [ { "id": "1", "quoteId": "q-1", "label": "Labor", "amount": 900 } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next in a simple lesson server, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId helper","store only in the browser localStorage","ask the client to send the full database each time"],
    mc_correct_option: "module-level array + a counter-based nextId helper",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `In-memory storage allows quick API testing without database setup.`,
    answer_keywords: ["lines","nextId","nextIdCounter"],
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
    expected: `let lines = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return lines; }
`,
    analog_example: `let quoteLines: QuoteLineRecord[] = [];
let lineIdCounter = 1;

function generateLineId(): string {
  return \`line-\${lineIdCounter++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `In-memory storage allows quick API testing without database setup.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/quote-lines with persistence and a conflict rule:

  Store    →  in-memory array of QuoteLine
  Validate →  required fields before insert
  Conflict →  same quoteId + same label → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let lines = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return lines; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. In-memory store: Declare an empty array typed with your line item interface.
2. ID helper: Return an incremental ID string from your helper function.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Require that line-item submissions include an estimate ID, item name, and price (400).

WHAT YOU'LL NEED
- Checks verifying required body properties.
- 400 status response for incomplete requests.

Your task: Reject line item requests missing quoteId, label, or price with status 400.`,
    hint: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 if any required field is falsy.`,
    example_code: `if (!req.body.quoteId || !req.body.label || !req.body.price) {
  return res.status(400).json({ error: "Quote ID, label, and price are required" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/quote-lines
POST /api/quote-lines
{ "quoteId": "q-1", "label": "Labor", "amount": 900 }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. Looking at the POST body above, which checks have to pass before you push a row?`,
    mc_options: ["return an error string for missing/invalid fields, else null","always return null and trust the client","throw and crash the process on bad input"],
    mc_correct_option: "return an error string for missing/invalid fields, else null",
    mc_anchor: "return an error string for missing/inval",
    why_this_matters: `Validation prevents incomplete or unlinked line items from entering storage.`,
    answer_keywords: ["validateLine","quoteId","label","amount"],
    seed_code: `let lines = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let lines = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateLine(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate, then create.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let lines = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return lines; }
export function validateLine(input) {
  if (typeof input?.quoteId !== "string" || !input.quoteId.trim()) return "quoteId is required";
  if (typeof input?.label !== "string" || !input.label.trim()) return "label is required";
  if (typeof input?.amount !== "number" || input.amount <= 0) return "amount must be > 0";
  return null;
}
`,
    analog_example: `if (!req.body.quoteId || !req.body.label || !req.body.price) {
  return res.status(400).json({ error: "Quote ID, label, and price are required" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Validation prevents incomplete or unlinked line items from entering storage.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/quote-lines with persistence and a conflict rule:

  Store    →  in-memory array of QuoteLine
  Validate →  required fields before insert
  Conflict →  same quoteId + same label → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let lines = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return lines; }
export function validateLine(input) {
  if (typeof input?.quoteId !== "string" || !input.quoteId.trim()) return "quoteId is required";
  if (typeof input?.label !== "string" || !input.label.trim()) return "label is required";
  if (typeof input?.amount !== "number" || input.amount <= 0) return "amount must be > 0";
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
    paal: `Check existing line items on that quote to ensure the same item name is not entered twice.

WHAT YOU'LL NEED
- An array search checking for matching quoteId and label.
- 409 conflict response if a duplicate is found.

Your task: Scan existing quote lines and reject with status 409 if a line with the same label already exists on this quote.`,
    hint: `1. Scan store: Use .some() on your quoteLines array.
2. Match criteria: Compare quoteId and normalized label values.
3. Reject duplicates: If found, halt execution with status 409.`,
    example_code: `const exists = quoteLines.some(
  (l) => l.quoteId === req.body.quoteId && l.label.toLowerCase() === req.body.label.toLowerCase()
);
if (exists) {
  return res.status(409).json({ error: "A line with this label already exists on this quote" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/quote-lines
POST /api/quote-lines
→ 201 created  OR  409 conflict

Rule: same quoteId + same label → conflict
\`\`\`

Two requests can describe the same resource at the same moment — before inserting one, you compare it against everything already stored to decide whether it collides. Given the rule above, how should the server decide "conflict" before insert?`,
    mc_options: ["compare candidate against existing rows; true means conflict","always allow POST and fix conflicts in the UI later","delete the older row silently"],
    mc_correct_option: "compare candidate against existing rows; true means conflict",
    mc_anchor: "compare candidate against existing rows;",
    why_this_matters: `Preventing duplicate line items avoids billing confusion on customer estimates.`,
    answer_keywords: ["hasDuplicateLine","some","quoteId"],
    seed_code: `let lines = [];
export function validateLine(input) { return null; }
`,
    starter_code: `let lines = [];
export function validateLine(input) { return null; }
export function hasDuplicateLine(candidate) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Server detects conflict before insert.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `Checking one candidate record against a list of existing ones for a matching combination of fields is exactly what Array.prototype.some() is for — it stops at the first match and returns true or false.`,
    expected: `let lines = [];
export function validateLine(input) { return null; }
export function hasDuplicateLine(candidate) {
  return lines.some((row) => row.quoteId === candidate.quoteId && row.amount === candidate.amount);
}
`,
    analog_example: `const exists = quoteLines.some(
  (l) => l.quoteId === req.body.quoteId && l.label.toLowerCase() === req.body.label.toLowerCase()
);
if (exists) {
  return res.status(409).json({ error: "A line with this label already exists on this quote" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Preventing duplicate line items avoids billing confusion on customer estimates.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/quote-lines with persistence and a conflict rule:

  Store    →  in-memory array of QuoteLine
  Validate →  required fields before insert
  Conflict →  same quoteId + same label → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let lines = [];
export function validateLine(input) { return null; }
export function hasDuplicateLine(candidate) {
  return lines.some((row) => row.quoteId === candidate.quoteId && row.amount === candidate.amount);
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Scan store: Use .some() on your quoteLines array.
2. Match criteria: Compare quoteId and normalized label values.
3. Reject duplicates: If found, halt execution with status 409.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Expose GET to list lines and POST to create new lines, returning a 409 error if that item label is already present.

WHAT YOU'LL NEED
- GET endpoint returning stored line items.
- POST endpoint applying 400 validation and 409 duplicate checks before saving.

Your task: Build endpoints to return line items and add new lines with validation and duplicate checks.`,
    hint: `1. Return store: Send status 200 with the quoteLines array in GET.
2. Protect POST: Run validation and duplicate checks before pushing the record.
3. Save record: Assign a unique ID, push the item to storage, and return status 201.`,
    example_code: `export function getLines(res: Response) {
  return res.status(200).json(quoteLines);
}

export function createLine(req: Request, res: Response) {
  // Step 2 validation check (400)
  // Step 3 duplicate label check (409)
  const item = { id: generateLineId(), ...req.body };
  quoteLines.push(item);
  return res.status(201).json(item);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/quote-lines
GET /api/quote-lines
→ [ ...rows ]

POST /api/quote-lines
→ 201 created  OR  400/409 error
\`\`\`

A route handler is where validation, conflict-checking, and storage come together — it should call the helpers you already wrote, in order, not re-implement any of their logic inline. How do GET and POST above use lines, validateLine, and hasDuplicateLine together?`,
    mc_options: ["GET lists store; POST validates, rejects conflict, else 201","POST always 201 even on overlap","GET returns HTML instead of JSON"],
    mc_correct_option: "GET lists store; POST validates, rejects conflict, else 201",
    mc_anchor: "GET lists store; POST validates, rejects",
    why_this_matters: `Consistent error codes (400 for bad data, 409 for duplicates) make API behavior predictable.


================================================================================`,
    answer_keywords: ["409","400","201","validateLine","hasDuplicateLine"],
    seed_code: `let lines = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateLine(input) { return null; }
export function hasDuplicateLine(c) { return false; }
`,
    starter_code: `let lines = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateLine(input) { return null; }
export function hasDuplicateLine(c) { return false; }
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
    expected: `let lines = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateLine(input) { return null; }
export function hasDuplicateLine(candidate) {
  return lines.some((row) => row.quoteId === candidate.quoteId && row.amount === candidate.amount);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(lines);
    },
    create(req, res) {
      const err = validateLine(req.body);
      if (err) return res.status(400).json({ error: err });
      if (hasDuplicateLine(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), quoteId: req.body.quoteId, label: req.body.label, amount: req.body.amount };
      lines.push(row);
      res.status(201).json(row);
    },
  };
}
`,
    analog_example: `export function getLines(res: Response) {
  return res.status(200).json(quoteLines);
}

export function createLine(req: Request, res: Response) {
  // Step 2 validation check (400)
  // Step 3 duplicate label check (409)
  const item = { id: generateLineId(), ...req.body };
  quoteLines.push(item);
  return res.status(201).json(item);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Consistent error codes (400 for bad data, 409 for duplicates) make API behavior predictable.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/quote-lines with persistence and a conflict rule:

  Store    →  in-memory array of QuoteLine
  Validate →  required fields before insert
  Conflict →  same quoteId + same label → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let lines = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateLine(input) { return null; }
export function hasDuplicateLine(candidate) {
  return lines.some((row) => row.quoteId === candidate.quoteId && row.amount === candidate.amount);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(lines);
    },
    create(req, res) {
      const err = validateLine(req.body);
      if (err) return res.status(400).json({ error: err });
      if (hasDuplicateLine(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), quoteId: req.body.quoteId, label: req.body.label, amount: req.body.amount };
      lines.push(row);
      res.status(201).json(row);
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Return store: Send status 200 with the quoteLines array in GET.
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
  title: "Quote lines API — no duplicate label on a quote",
  shortName: "Lines API",
});
