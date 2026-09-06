import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-lead-stale-api",
      title: "Leads API with fresh/stale status",
      body: `Implement /api/leads with a derived status:

  Store    →  in-memory Lead rows
  Validate →  required fields
  Derive   →  if capturedAt older than N days → stale; else fresh
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      usecase: "Stale leads must be computed from capture time so the inbox stays honest.",
      designMock: {"kind":"api-sample","screenTitle":"/api/leads","caption":"Status is computed on the way out — clients cannot fake it.","getSample":"GET /api/leads\n→ [ { \"id\": \"1\", \"status\": \"…\" } ]","postSample":"POST /api/leads\n{ …fields… }\n→ 201 { …row, \"status\": \"…\" }"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Create an in-memory customer drawer and an ID generator to assign unique lead tracking tags.","Validate that submitted leads contain valid contact info before accepting them.","Let the server evaluate the lead's last interaction date to classify it as \"fresh\" or \"stale\".","Expose GET to list leads and POST to save new leads with their server-assigned freshness status."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

This file doesn't exist yet — you're the first to touch it. Create it at \`server/routes/leads.ts\` before anything else. Every step from here on edits that same file.

Create an in-memory customer drawer and an ID generator to assign unique lead tracking tags.

WHAT YOU'LL NEED
- An array holding lead records.
- An incremental ID generator helper.

Your task: Set up server storage for leads and an ID generator.`,
    hint: `1. In-memory store: Declare an empty array typed with your lead shape.
2. ID helper: Return an incremental ID string from your helper function.`,
    example_code: `let leadsArchive: StoredLead[] = [];
let leadCounter = 1;

function makeLeadId(): string {
  return \`lead-\${leadCounter++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/leads
GET /api/leads
→ [ { "id": "1", "status": "…" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId","no store — recompute from logs only","client sends the whole catalog every GET"],
    mc_correct_option: "module-level array + a counter-based nextId",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `An in-memory array allows rapid prototyping and testing of API logic.`,
    answer_keywords: ["leads","nextId","nextIdCounter"],
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
    expected: `let leads = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return leads; }
`,
    analog_example: `let leadsArchive: StoredLead[] = [];
let leadCounter = 1;

function makeLeadId(): string {
  return \`lead-\${leadCounter++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `An in-memory array allows rapid prototyping and testing of API logic.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/leads with a derived status:

  Store    →  in-memory Lead rows
  Validate →  required fields
  Derive   →  if capturedAt older than N days → stale; else fresh
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let leads = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return leads; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. In-memory store: Declare an empty array typed with your lead shape.
2. ID helper: Return an incremental ID string from your helper function.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Validate that submitted leads contain valid contact info before accepting them.

WHAT YOU'LL NEED
- Checks verifying required body properties.
- 400 status response for incomplete requests.

Your task: Reject lead submissions lacking a name or contact details with status 400.`,
    hint: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 if any required field is falsy.`,
    example_code: `if (!req.body.name || !req.body.contact) {
  return res.status(400).json({ error: "Name and contact info are required" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/leads
POST /api/leads
{ …fields… }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. What must be true about the fields above before you insert a row?`,
    mc_options: ["error string for bad fields, else null","accept any JSON","coerce everything to strings silently"],
    mc_correct_option: "error string for bad fields, else null",
    mc_anchor: "error string for bad fields, else null",
    why_this_matters: `Validation prevents uncontactable leads from entering the database.`,
    answer_keywords: ["validateLead","name","source","capturedAt"],
    seed_code: `let leads = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let leads = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateLead(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate first.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let leads = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return leads; }
export function validateLead(input) {
  if (typeof input?.name !== "string" || !input.name.trim()) return "name is required";
  if (typeof input?.source !== "string" || !input.source.trim()) return "source is required";
  if (typeof input?.capturedAt !== "string" || !input.capturedAt.trim()) return "capturedAt is required";
  return null;
}
`,
    analog_example: `if (!req.body.name || !req.body.contact) {
  return res.status(400).json({ error: "Name and contact info are required" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Validation prevents uncontactable leads from entering the database.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/leads with a derived status:

  Store    →  in-memory Lead rows
  Validate →  required fields
  Derive   →  if capturedAt older than N days → stale; else fresh
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let leads = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return leads; }
export function validateLead(input) {
  if (typeof input?.name !== "string" || !input.name.trim()) return "name is required";
  if (typeof input?.source !== "string" || !input.source.trim()) return "source is required";
  if (typeof input?.capturedAt !== "string" || !input.capturedAt.trim()) return "capturedAt is required";
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

Let the server evaluate the lead's last interaction date to classify it as "fresh" or "stale".

WHAT YOU'LL NEED
- Timestamp comparison evaluating elapsed time.
- Assignment of "fresh" or "stale" based on that check.

Your task: Calculate whether a lead is "fresh" or "stale" based on interaction timestamps on the server.`,
    hint: `1. Compare dates: Calculate elapsed time since lastContact.
2. Set status: Assign "stale" if threshold is exceeded; otherwise, assign "fresh".`,
    example_code: `const sevenDays = 7 * 24 * 60 * 60 * 1000;
const isStale = Date.now() - new Date(req.body.lastContact).getTime() > sevenDays;
const status = isStale ? "stale" : "fresh";`,
    think_prompt: `\`\`\`text
SAMPLE — /api/leads
GET /api/leads
→ [ { "id": "1", "status": "…" } ]

Rule: if capturedAt older than N days → stale; else fresh
\`\`\`

A status label describing a record can always be recalculated from that record's own stored facts — comparing dates, or checking a boolean flag — rather than being sent by the client and simply trusted. Given the rule above, should the browser send status, or should the server compute it — and from what?`,
    mc_options: ["server derives status from stored facts; ignore client status","save req.body.status as-is","randomize status on every GET"],
    mc_correct_option: "server derives status from stored facts; ignore client status",
    mc_anchor: "server derives status from stored facts;",
    why_this_matters: `Server-calculated statuses guarantee consistency based on verifiable timestamps.`,
    answer_keywords: ["deriveLeadStatus"],
    seed_code: `let leads = [];
export function validateLead(input) { return null; }
`,
    starter_code: `let leads = [];
export function validateLead(input) { return null; }
export function deriveLeadStatus(row, now = new Date()) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Status is computed on the server.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A derive function takes one stored row (plus, optionally, the current time) and returns a label computed purely from that row's own fields — it never reads anything the client sent in the current request.`,
    expected: `let leads = [];
export function validateLead(input) { return null; }
export function deriveLeadStatus(row, now = new Date()) {
  if (new Date(row.capturedAt) < now) return "stale";
  return "fresh";
}
`,
    analog_example: `const sevenDays = 7 * 24 * 60 * 60 * 1000;
const isStale = Date.now() - new Date(req.body.lastContact).getTime() > sevenDays;
const status = isStale ? "stale" : "fresh";`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Server-calculated statuses guarantee consistency based on verifiable timestamps.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/leads with a derived status:

  Store    →  in-memory Lead rows
  Validate →  required fields
  Derive   →  if capturedAt older than N days → stale; else fresh
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let leads = [];
export function validateLead(input) { return null; }
export function deriveLeadStatus(row, now = new Date()) {
  if (new Date(row.capturedAt) < now) return "stale";
  return "fresh";
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Compare dates: Calculate elapsed time since lastContact.
2. Set status: Assign "stale" if threshold is exceeded; otherwise, assign "fresh".`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Expose GET to list leads and POST to save new leads with their server-assigned freshness status.

WHAT YOU'LL NEED
- GET endpoint returning stored leads.
- POST endpoint validating data, computing status, saving, and returning 201.

Your task: Build endpoints to fetch leads and create new leads with the calculated status.`,
    hint: `1. Return store: Send status 200 with the leads array in GET.
2. Protect POST: Run validation and status derivation before pushing the record.
3. Save record: Assign a unique ID, push the item to storage, and return status 201.`,
    example_code: `export function getLeads(res: Response) {
  return res.status(200).json(leadsArchive);
}

export function createLead(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derive fresh/stale status
  const item = { id: makeLeadId(), ...req.body, status };
  leadsArchive.push(item);
  return res.status(201).json(item);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/leads
GET /api/leads
→ [ …rows with status ]

POST /api/leads
→ 201 { …row, "status": "…" }
\`\`\`

Attaching a computed field to data on its way out of a route means running the derive function once per record, every time that record is returned — never once at write time and then reused. How do GET and POST above reuse validateLead and deriveLeadStatus to guarantee status is never stale?`,
    mc_options: ["GET/POST attach derived status; POST validates first","POST stores client status verbatim","GET omits status"],
    mc_correct_option: "GET/POST attach derived status; POST validates first",
    mc_anchor: "GET/POST attach derived status; POST val",
    why_this_matters: `The client receives back the saved lead along with its server-calculated freshness tag.


================================================================================`,
    answer_keywords: ["deriveLeadStatus","validateLead","201"],
    seed_code: `let leads = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateLead(input) { return null; }
export function deriveLeadStatus(row, now = new Date()) { return "open"; }
`,
    starter_code: `let leads = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateLead(input) { return null; }
export function deriveLeadStatus(row, now = new Date()) { return "open"; }
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
    expected: `let leads = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateLead(input) { return null; }
export function deriveLeadStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(leads.map((r) => ({ ...r, status: deriveLeadStatus(r) })));
    },
    create(req, res) {
      const err = validateLead(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), name: req.body.name, source: req.body.source, capturedAt: req.body.capturedAt };
      leads.push(row);
      res.status(201).json({ ...row, status: deriveLeadStatus(row) });
    },
  };
}
`,
    analog_example: `export function getLeads(res: Response) {
  return res.status(200).json(leadsArchive);
}

export function createLead(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derive fresh/stale status
  const item = { id: makeLeadId(), ...req.body, status };
  leadsArchive.push(item);
  return res.status(201).json(item);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The client receives back the saved lead along with its server-calculated freshness tag.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/leads with a derived status:

  Store    →  in-memory Lead rows
  Validate →  required fields
  Derive   →  if capturedAt older than N days → stale; else fresh
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let leads = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateLead(input) { return null; }
export function deriveLeadStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(leads.map((r) => ({ ...r, status: deriveLeadStatus(r) })));
    },
    create(req, res) {
      const err = validateLead(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), name: req.body.name, source: req.body.source, capturedAt: req.body.capturedAt };
      leads.push(row);
      res.status(201).json({ ...row, status: deriveLeadStatus(row) });
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Return store: Send status 200 with the leads array in GET.
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
  title: "Leads API with fresh/stale status",
  shortName: "Lead API",
});
