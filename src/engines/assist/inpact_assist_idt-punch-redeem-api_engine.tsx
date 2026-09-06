import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-punch-redeem-api",
      title: "Punches API — reject redeem when empty",
      body: `Implement /api/punches with persistence and a conflict rule:

  Store    →  in-memory array of Punch
  Validate →  required fields before insert
  Conflict →  package already at totalPunches used → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      usecase: "You cannot punch an empty card. The API owns that rule so the UI cannot cheat.",
      designMock: {"kind":"api-sample","screenTitle":"/api/punches","caption":"Sample requests/responses — the server owns the conflict rule.","getSample":"GET /api/punches\n→ [ { \"id\": \"1\", \"packageId\": \"p-1\", \"note\": \"Visit 3\", \"at\": \"2026-08-23T11:00:00Z\" } ]","postSample":"POST /api/punches\n{ \"packageId\": \"p-1\", \"note\": \"Visit 3\", \"at\": \"2026-08-23T11:00:00Z\" }\n→ 201 created  OR  409 conflict"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Establish memory storage for redemptions and an ID tool for generating transaction tags.","Ensure incoming punch requests include a valid package ID and user confirmation (400).","Check the customer's balance to confirm they still have punches left to redeem.","Expose GET for redemption history and POST to redeem a punch, returning a 409 conflict error if zero punches remain."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Establish memory storage for redemptions and an ID tool for generating transaction tags.

WHAT YOU'LL NEED
- An array holding redemption records.
- An incremental ID generator helper.

Your task: Set up server storage for punch logs and an ID generator.`,
    hint: `1. In-memory store: Declare an empty array typed with your redemption interface.
2. ID helper: Return an incremental ID string from your helper function.`,
    example_code: `let redemptions: RedemptionRecord[] = [];
let redIdCounter = 1;

function generateRedemptionId(): string {
  return \`red-\${redIdCounter++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/punches
GET /api/punches
→ [ { "id": "1", "packageId": "p-1", "note": "Visit 3", "at": "2026-08-23T11:00:00Z" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next in a simple lesson server, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId helper","store only in the browser localStorage","ask the client to send the full database each time"],
    mc_correct_option: "module-level array + a counter-based nextId helper",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `In-memory storage allows quick API testing without database setup.`,
    answer_keywords: ["punches","nextId","nextIdCounter"],
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
    expected: `let punches = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return punches; }
`,
    analog_example: `let redemptions: RedemptionRecord[] = [];
let redIdCounter = 1;

function generateRedemptionId(): string {
  return \`red-\${redIdCounter++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `In-memory storage allows quick API testing without database setup.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/punches with persistence and a conflict rule:

  Store    →  in-memory array of Punch
  Validate →  required fields before insert
  Conflict →  package already at totalPunches used → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let punches = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return punches; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. In-memory store: Declare an empty array typed with your redemption interface.
2. ID helper: Return an incremental ID string from your helper function.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Ensure incoming punch requests include a valid package ID and user confirmation (400).

WHAT YOU'LL NEED
- Checks verifying required body properties.
- 400 status response for incomplete requests.

Your task: Reject redemption requests missing packageId with status 400.`,
    hint: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 if packageId is missing.`,
    example_code: `if (!req.body.packageId) {
  return res.status(400).json({ error: "Package ID is mandatory" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/punches
POST /api/punches
{ "packageId": "p-1", "note": "Visit 3", "at": "2026-08-23T11:00:00Z" }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. Looking at the POST body above, which checks have to pass before you push a row?`,
    mc_options: ["return an error string for missing/invalid fields, else null","always return null and trust the client","throw and crash the process on bad input"],
    mc_correct_option: "return an error string for missing/invalid fields, else null",
    mc_anchor: "return an error string for missing/inval",
    why_this_matters: `Validation prevents orphaned redemptions from entering the system.`,
    answer_keywords: ["validatePunch","packageId","note","at"],
    seed_code: `let punches = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let punches = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validatePunch(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate, then create.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let punches = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return punches; }
export function validatePunch(input) {
  if (typeof input?.packageId !== "string" || !input.packageId.trim()) return "packageId is required";
  if (typeof input?.note !== "string" || !input.note.trim()) return "note is required";
  if (typeof input?.at !== "string" || !input.at.trim()) return "at is required";
  return null;
}
`,
    analog_example: `if (!req.body.packageId) {
  return res.status(400).json({ error: "Package ID is mandatory" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Validation prevents orphaned redemptions from entering the system.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/punches with persistence and a conflict rule:

  Store    →  in-memory array of Punch
  Validate →  required fields before insert
  Conflict →  package already at totalPunches used → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let punches = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return punches; }
export function validatePunch(input) {
  if (typeof input?.packageId !== "string" || !input.packageId.trim()) return "packageId is required";
  if (typeof input?.note !== "string" || !input.note.trim()) return "note is required";
  if (typeof input?.at !== "string" || !input.at.trim()) return "at is required";
  return null;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 if packageId is missing.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Check the customer's balance to confirm they still have punches left to redeem.

WHAT YOU'LL NEED
- Lookup checking remaining balance for the requested package.
- 409 conflict response if remaining balance is zero.

Your task: Check the package balance and reject the redemption with status 409 if no punches remain.`,
    hint: `1. Inspect balance: Look up the current balance for packageId.
2. Block empty redemptions: If balance is <= 0, halt execution with status 409.`,
    example_code: `const balance = getPackageBalance(req.body.packageId);
if (balance <= 0) {
  return res.status(409).json({ error: "Package has zero punches remaining" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/punches
POST /api/punches
→ 201 created  OR  409 conflict

Rule: package already at totalPunches used → conflict
\`\`\`

Two requests can describe the same resource at the same moment — before inserting one, you compare it against everything already stored to decide whether it collides. Given the rule above, how should the server decide "conflict" before insert?`,
    mc_options: ["compare candidate against existing rows; true means conflict","always allow POST and fix conflicts in the UI later","delete the older row silently"],
    mc_correct_option: "compare candidate against existing rows; true means conflict",
    mc_anchor: "compare candidate against existing rows;",
    why_this_matters: `Checking balances on the server prevents clients from redeeming punches on expired or empty packages.`,
    answer_keywords: ["isPackageEmpty","some","packageId"],
    seed_code: `let punches = [];
export function validatePunch(input) { return null; }
`,
    starter_code: `let punches = [];
export function validatePunch(input) { return null; }
export function isPackageEmpty(candidate) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Server detects conflict before insert.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `Checking one candidate record against a list of existing ones for a matching combination of fields is exactly what Array.prototype.some() is for — it stops at the first match and returns true or false.`,
    expected: `let punches = [];
export function validatePunch(input) { return null; }
export function isPackageEmpty(candidate) {
  return punches.some((row) => row.packageId === candidate.packageId && row.at === candidate.at);
}
`,
    analog_example: `const balance = getPackageBalance(req.body.packageId);
if (balance <= 0) {
  return res.status(409).json({ error: "Package has zero punches remaining" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Checking balances on the server prevents clients from redeeming punches on expired or empty packages.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/punches with persistence and a conflict rule:

  Store    →  in-memory array of Punch
  Validate →  required fields before insert
  Conflict →  package already at totalPunches used → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let punches = [];
export function validatePunch(input) { return null; }
export function isPackageEmpty(candidate) {
  return punches.some((row) => row.packageId === candidate.packageId && row.at === candidate.at);
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Inspect balance: Look up the current balance for packageId.
2. Block empty redemptions: If balance is <= 0, halt execution with status 409.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Expose GET for redemption history and POST to redeem a punch, returning a 409 conflict error if zero punches remain.

WHAT YOU'LL NEED
- GET endpoint returning stored redemptions.
- POST endpoint applying 400 validation and 409 balance checks before saving.

Your task: Build endpoints to return redemption logs and redeem punches with validation and balance checks.`,
    hint: `1. Return store: Send status 200 with the redemptions array in GET.
2. Protect POST: Run validation and balance checks before pushing the record.
3. Save record: Assign a unique ID, push the item to storage, and return status 201.`,
    example_code: `export function getRedemptions(res: Response) {
  return res.status(200).json(redemptions);
}

export function redeemPunch(req: Request, res: Response) {
  // Step 2 validation check (400)
  // Step 3 zero-balance check (409)
  const item = { id: generateRedemptionId(), ...req.body };
  redemptions.push(item);
  return res.status(201).json(item);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/punches
GET /api/punches
→ [ ...rows ]

POST /api/punches
→ 201 created  OR  400/409 error
\`\`\`

A route handler is where validation, conflict-checking, and storage come together — it should call the helpers you already wrote, in order, not re-implement any of their logic inline. How do GET and POST above use punches, validatePunch, and isPackageEmpty together?`,
    mc_options: ["GET lists store; POST validates, rejects conflict, else 201","POST always 201 even on overlap","GET returns HTML instead of JSON"],
    mc_correct_option: "GET lists store; POST validates, rejects conflict, else 201",
    mc_anchor: "GET lists store; POST validates, rejects",
    why_this_matters: `Consistent error codes (400 for bad data, 409 for depleted balance) make API behavior predictable.


================================================================================`,
    answer_keywords: ["409","400","201","validatePunch","isPackageEmpty"],
    seed_code: `let punches = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validatePunch(input) { return null; }
export function isPackageEmpty(c) { return false; }
`,
    starter_code: `let punches = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validatePunch(input) { return null; }
export function isPackageEmpty(c) { return false; }
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
    expected: `let punches = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validatePunch(input) { return null; }
export function isPackageEmpty(candidate) {
  return punches.some((row) => row.packageId === candidate.packageId && row.at === candidate.at);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(punches);
    },
    create(req, res) {
      const err = validatePunch(req.body);
      if (err) return res.status(400).json({ error: err });
      if (isPackageEmpty(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), packageId: req.body.packageId, note: req.body.note, at: req.body.at };
      punches.push(row);
      res.status(201).json(row);
    },
  };
}
`,
    analog_example: `export function getRedemptions(res: Response) {
  return res.status(200).json(redemptions);
}

export function redeemPunch(req: Request, res: Response) {
  // Step 2 validation check (400)
  // Step 3 zero-balance check (409)
  const item = { id: generateRedemptionId(), ...req.body };
  redemptions.push(item);
  return res.status(201).json(item);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Consistent error codes (400 for bad data, 409 for depleted balance) make API behavior predictable.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/punches with persistence and a conflict rule:

  Store    →  in-memory array of Punch
  Validate →  required fields before insert
  Conflict →  package already at totalPunches used → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let punches = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validatePunch(input) { return null; }
export function isPackageEmpty(candidate) {
  return punches.some((row) => row.packageId === candidate.packageId && row.at === candidate.at);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(punches);
    },
    create(req, res) {
      const err = validatePunch(req.body);
      if (err) return res.status(400).json({ error: err });
      if (isPackageEmpty(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), packageId: req.body.packageId, note: req.body.note, at: req.body.at };
      punches.push(row);
      res.status(201).json(row);
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Return store: Send status 200 with the redemptions array in GET.
2. Protect POST: Run validation and balance checks before pushing the record.
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
  title: "Punches API — reject redeem when empty",
  shortName: "Punch API",
});
