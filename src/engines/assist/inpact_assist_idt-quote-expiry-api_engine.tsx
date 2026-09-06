import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-quote-expiry-api",
      title: "Quotes API with open/expired/accepted status",
      body: `Implement /api/quotes with a derived status:

  Store    →  in-memory Quote rows
  Validate →  required fields
  Derive   →  accepted → accepted; else validUntil in the past → expired; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      usecase: "Expired vs open must be derived from validUntil and accepted — never trusted from the client body.",
      designMock: {"kind":"api-sample","screenTitle":"/api/quotes","caption":"Status is computed on the way out — clients cannot fake it.","getSample":"GET /api/quotes\n→ [ { \"id\": \"1\", \"status\": \"…\" } ]","postSample":"POST /api/quotes\n{ …fields… }\n→ 201 { …row, \"status\": \"…\" }"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Set up memory storage for estimates and an ID generator for unique quote numbers.","Validate that incoming quote payloads include customer details, item totals, and expiration dates.","Calculate status on the server based on customer action and current date (\"open\", \"expired\", or \"accepted\").","Provide a GET endpoint to list quotes and a POST endpoint that attaches the calculated status before saving."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Set up memory storage for estimates and an ID generator for unique quote numbers.

WHAT YOU'LL NEED
- An array holding quote records.
- An incremental ID generator helper.

Your task: Set up server storage for estimates and an ID generator.`,
    hint: `1. In-memory store: Declare an empty array typed with your quote shape.
2. ID helper: Return an incremental ID string from your helper function.`,
    example_code: `let quoteStore: QuoteRecord[] = [];
let quoteIdCounter = 1;

function makeQuoteId(): string {
  return \`q-\${quoteIdCounter++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/quotes
GET /api/quotes
→ [ { "id": "1", "status": "…" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId","no store — recompute from logs only","client sends the whole catalog every GET"],
    mc_correct_option: "module-level array + a counter-based nextId",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `In-memory storage allows quick API testing without database setup.`,
    answer_keywords: ["quotes","nextId","nextIdCounter"],
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
    expected: `let quotes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return quotes; }
`,
    analog_example: `let quoteStore: QuoteRecord[] = [];
let quoteIdCounter = 1;

function makeQuoteId(): string {
  return \`q-\${quoteIdCounter++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `In-memory storage allows quick API testing without database setup.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/quotes with a derived status:

  Store    →  in-memory Quote rows
  Validate →  required fields
  Derive   →  accepted → accepted; else validUntil in the past → expired; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let quotes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return quotes; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. In-memory store: Declare an empty array typed with your quote shape.
2. ID helper: Return an incremental ID string from your helper function.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Validate that incoming quote payloads include customer details, item totals, and expiration dates.

WHAT YOU'LL NEED
- Checks verifying required body properties.
- 400 status response for incomplete requests.

Your task: Reject quote requests lacking client name, total, or expiration date with status 400.`,
    hint: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 if any required field is falsy.`,
    example_code: `if (!req.body.client || !req.body.total || !req.body.expiresAt) {
  return res.status(400).json({ error: "Missing required quote information" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/quotes
POST /api/quotes
{ …fields… }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. What must be true about the fields above before you insert a row?`,
    mc_options: ["error string for bad fields, else null","accept any JSON","coerce everything to strings silently"],
    mc_correct_option: "error string for bad fields, else null",
    mc_anchor: "error string for bad fields, else null",
    why_this_matters: `Validation prevents unpriced or incomplete estimates from being recorded.`,
    answer_keywords: ["validateQuote","client","total","validUntil"],
    seed_code: `let quotes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let quotes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateQuote(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate first.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let quotes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return quotes; }
export function validateQuote(input) {
  if (typeof input?.client !== "string" || !input.client.trim()) return "client is required";
  if (typeof input?.total !== "number" || input.total <= 0) return "total must be > 0";
  if (typeof input?.validUntil !== "string" || !input.validUntil.trim()) return "validUntil is required";
  return null;
}
`,
    analog_example: `if (!req.body.client || !req.body.total || !req.body.expiresAt) {
  return res.status(400).json({ error: "Missing required quote information" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Validation prevents unpriced or incomplete estimates from being recorded.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/quotes with a derived status:

  Store    →  in-memory Quote rows
  Validate →  required fields
  Derive   →  accepted → accepted; else validUntil in the past → expired; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let quotes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return quotes; }
export function validateQuote(input) {
  if (typeof input?.client !== "string" || !input.client.trim()) return "client is required";
  if (typeof input?.total !== "number" || input.total <= 0) return "total must be > 0";
  if (typeof input?.validUntil !== "string" || !input.validUntil.trim()) return "validUntil is required";
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
    paal: `Calculate status on the server based on customer action and current date ("open", "expired", or "accepted").

WHAT YOU'LL NEED
- Evaluation checking acceptance flags and expiration dates.
- Assignment of "accepted", "expired", or "open" based on those checks.

Your task: Calculate quote status ("accepted", "expired", or "open") on the server.`,
    hint: `1. Check acceptance: If user confirmed approval, assign "accepted".
2. Check date: If expiration date is in the past, assign "expired".
3. Default: Otherwise, assign "open".`,
    example_code: `let status = "open";
if (req.body.isAccepted) {
  status = "accepted";
} else if (new Date(req.body.expiresAt).getTime() < Date.now()) {
  status = "expired";
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/quotes
GET /api/quotes
→ [ { "id": "1", "status": "…" } ]

Rule: accepted → accepted; else validUntil in the past → expired; else open
\`\`\`

A status label describing a record can always be recalculated from that record's own stored facts — comparing dates, or checking a boolean flag — rather than being sent by the client and simply trusted. Given the rule above, should the browser send status, or should the server compute it — and from what?`,
    mc_options: ["server derives status from stored facts; ignore client status","save req.body.status as-is","randomize status on every GET"],
    mc_correct_option: "server derives status from stored facts; ignore client status",
    mc_anchor: "server derives status from stored facts;",
    why_this_matters: `Server-calculated statuses guarantee consistency based on verifiable business rules.`,
    answer_keywords: ["deriveQuoteStatus"],
    seed_code: `let quotes = [];
export function validateQuote(input) { return null; }
`,
    starter_code: `let quotes = [];
export function validateQuote(input) { return null; }
export function deriveQuoteStatus(row, now = new Date()) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Status is computed on the server.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A derive function takes one stored row (plus, optionally, the current time) and returns a label computed purely from that row's own fields — it never reads anything the client sent in the current request.`,
    expected: `let quotes = [];
export function validateQuote(input) { return null; }
export function deriveQuoteStatus(row, now = new Date()) {
  if (row.accepted === true) return "accepted";
  if (new Date(row.validUntil) < now) return "expired";
  return "open";
}
`,
    analog_example: `let status = "open";
if (req.body.isAccepted) {
  status = "accepted";
} else if (new Date(req.body.expiresAt).getTime() < Date.now()) {
  status = "expired";
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Server-calculated statuses guarantee consistency based on verifiable business rules.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/quotes with a derived status:

  Store    →  in-memory Quote rows
  Validate →  required fields
  Derive   →  accepted → accepted; else validUntil in the past → expired; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let quotes = [];
export function validateQuote(input) { return null; }
export function deriveQuoteStatus(row, now = new Date()) {
  if (row.accepted === true) return "accepted";
  if (new Date(row.validUntil) < now) return "expired";
  return "open";
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Check acceptance: If user confirmed approval, assign "accepted".
2. Check date: If expiration date is in the past, assign "expired".
3. Default: Otherwise, assign "open".`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Provide a GET endpoint to list quotes and a POST endpoint that attaches the calculated status before saving.

WHAT YOU'LL NEED
- GET endpoint returning stored quotes.
- POST endpoint validating data, computing status, saving, and returning 201.

Your task: Build endpoints to fetch quotes and create new quotes with the calculated status.`,
    hint: `1. Return store: Send status 200 with the quotes array in GET.
2. Protect POST: Run validation and status derivation before pushing the record.
3. Save record: Assign a unique ID, push the item to storage, and return status 201.`,
    example_code: `export function getQuotes(res: Response) {
  return res.status(200).json(quoteStore);
}

export function createQuote(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derive status
  const item = { id: makeQuoteId(), ...req.body, status };
  quoteStore.push(item);
  return res.status(201).json(item);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/quotes
GET /api/quotes
→ [ …rows with status ]

POST /api/quotes
→ 201 { …row, "status": "…" }
\`\`\`

Attaching a computed field to data on its way out of a route means running the derive function once per record, every time that record is returned — never once at write time and then reused. How do GET and POST above reuse validateQuote and deriveQuoteStatus to guarantee status is never stale?`,
    mc_options: ["GET/POST attach derived status; POST validates first","POST stores client status verbatim","GET omits status"],
    mc_correct_option: "GET/POST attach derived status; POST validates first",
    mc_anchor: "GET/POST attach derived status; POST val",
    why_this_matters: `The client receives back the saved quote along with its server-calculated status tag.


================================================================================`,
    answer_keywords: ["deriveQuoteStatus","validateQuote","201"],
    seed_code: `let quotes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateQuote(input) { return null; }
export function deriveQuoteStatus(row, now = new Date()) { return "open"; }
`,
    starter_code: `let quotes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateQuote(input) { return null; }
export function deriveQuoteStatus(row, now = new Date()) { return "open"; }
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
    expected: `let quotes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateQuote(input) { return null; }
export function deriveQuoteStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(quotes.map((r) => ({ ...r, status: deriveQuoteStatus(r) })));
    },
    create(req, res) {
      const err = validateQuote(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), client: req.body.client, total: req.body.total, validUntil: req.body.validUntil, accepted: false };
      quotes.push(row);
      res.status(201).json({ ...row, status: deriveQuoteStatus(row) });
    },
  };
}
`,
    analog_example: `export function getQuotes(res: Response) {
  return res.status(200).json(quoteStore);
}

export function createQuote(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derive status
  const item = { id: makeQuoteId(), ...req.body, status };
  quoteStore.push(item);
  return res.status(201).json(item);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The client receives back the saved quote along with its server-calculated status tag.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/quotes with a derived status:

  Store    →  in-memory Quote rows
  Validate →  required fields
  Derive   →  accepted → accepted; else validUntil in the past → expired; else open
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let quotes = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateQuote(input) { return null; }
export function deriveQuoteStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(quotes.map((r) => ({ ...r, status: deriveQuoteStatus(r) })));
    },
    create(req, res) {
      const err = validateQuote(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), client: req.body.client, total: req.body.total, validUntil: req.body.validUntil, accepted: false };
      quotes.push(row);
      res.status(201).json({ ...row, status: deriveQuoteStatus(row) });
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Return store: Send status 200 with the quotes array in GET.
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
  title: "Quotes API with open/expired/accepted status",
  shortName: "Quote API",
});
