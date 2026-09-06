import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-package-remaining-api",
      title: "Packages API with remaining / empty status",
      body: `Implement /api/packages with a derived status:

  Store    →  in-memory ServicePackage rows
  Validate →  required fields
  Derive   →  used >= total → empty; else active (expose remaining)
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      usecase: "Remaining punches must be computed from totals — clients cannot invent free punches.",
      designMock: {"kind":"api-sample","screenTitle":"/api/packages","caption":"Status is computed on the way out — clients cannot fake it.","getSample":"GET /api/packages\n→ [ { \"id\": \"1\", \"status\": \"…\" } ]","postSample":"POST /api/packages\n{ …fields… }\n→ 201 { …row, \"status\": \"…\" }"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Build an in-memory card archive and an ID generator for unique pass codes.","Verify that new package requests specify a valid customer and a positive starting punch total.","Compute the status on the server—labeling it \"remaining\" if punches are available, or \"empty\" if zero.","Expose GET to fetch packages and POST to create packages with the server-derived status included."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

This file doesn't exist yet — you're the first to touch it. Create it at \`server/routes/packages.ts\` before anything else. Every step from here on edits that same file.

Build an in-memory card archive and an ID generator for unique pass codes.

WHAT YOU'LL NEED
- An array holding package records.
- An incremental ID generator helper.

Your task: Set up server storage for package passes and an ID generator.`,
    hint: `1. In-memory store: Declare an empty array typed with your package shape.
2. ID helper: Return an incremental ID string from your helper function.`,
    example_code: `let packageStore: PackageRecord[] = [];
let pkgIdCounter = 1;

function generatePackageId(): string {
  return \`pkg-\${pkgIdCounter++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/packages
GET /api/packages
→ [ { "id": "1", "status": "…" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId","no store — recompute from logs only","client sends the whole catalog every GET"],
    mc_correct_option: "module-level array + a counter-based nextId",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `In-memory storage allows quick API testing without database setup.`,
    answer_keywords: ["packages","nextId","nextIdCounter"],
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
    expected: `let packages = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return packages; }
`,
    analog_example: `let packageStore: PackageRecord[] = [];
let pkgIdCounter = 1;

function generatePackageId(): string {
  return \`pkg-\${pkgIdCounter++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `In-memory storage allows quick API testing without database setup.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/packages with a derived status:

  Store    →  in-memory ServicePackage rows
  Validate →  required fields
  Derive   →  used >= total → empty; else active (expose remaining)
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let packages = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return packages; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. In-memory store: Declare an empty array typed with your package shape.
2. ID helper: Return an incremental ID string from your helper function.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Verify that new package requests specify a valid customer and a positive starting punch total.

WHAT YOU'LL NEED
- Checks verifying required body properties.
- 400 status response for incomplete requests.

Your task: Reject package requests lacking client name or initial punch count with status 400.`,
    hint: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 if any required field is falsy or undefined.`,
    example_code: `if (!req.body.client || req.body.initialPunches === undefined) {
  return res.status(400).json({ error: "Client and punch count are required" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/packages
POST /api/packages
{ …fields… }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. What must be true about the fields above before you insert a row?`,
    mc_options: ["error string for bad fields, else null","accept any JSON","coerce everything to strings silently"],
    mc_correct_option: "error string for bad fields, else null",
    mc_anchor: "error string for bad fields, else null",
    why_this_matters: `Validation prevents packages with missing or undefined balances from being created.`,
    answer_keywords: ["validatePackage","client","service","totalPunches","usedPunches"],
    seed_code: `let packages = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let packages = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validatePackage(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate first.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let packages = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return packages; }
export function validatePackage(input) {
  if (typeof input?.client !== "string" || !input.client.trim()) return "client is required";
  if (typeof input?.service !== "string" || !input.service.trim()) return "service is required";
  if (typeof input?.totalPunches !== "number" || input.totalPunches <= 0) return "totalPunches must be > 0";
  if (typeof input?.usedPunches !== "number" || input.usedPunches < 0) return "usedPunches must be >= 0";
  return null;
}
`,
    analog_example: `if (!req.body.client || req.body.initialPunches === undefined) {
  return res.status(400).json({ error: "Client and punch count are required" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Validation prevents packages with missing or undefined balances from being created.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/packages with a derived status:

  Store    →  in-memory ServicePackage rows
  Validate →  required fields
  Derive   →  used >= total → empty; else active (expose remaining)
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let packages = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return packages; }
export function validatePackage(input) {
  if (typeof input?.client !== "string" || !input.client.trim()) return "client is required";
  if (typeof input?.service !== "string" || !input.service.trim()) return "service is required";
  if (typeof input?.totalPunches !== "number" || input.totalPunches <= 0) return "totalPunches must be > 0";
  if (typeof input?.usedPunches !== "number" || input.usedPunches < 0) return "usedPunches must be >= 0";
  return null;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 if any required field is falsy or undefined.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Compute the status on the server—labeling it "remaining" if punches are available, or "empty" if zero.

WHAT YOU'LL NEED
- Numeric comparison checking if remaining punches are greater than zero.
- Assignment of "remaining" or "empty" based on that check.

Your task: Calculate whether a package is "remaining" or "empty" based on its punch count on the server.`,
    hint: `1. Evaluate punch count: Check if remaining punches exceed 0.
2. Set status: Assign "remaining" if positive; otherwise, assign "empty".`,
    example_code: `const status = Number(req.body.remainingPunches) > 0 ? "remaining" : "empty";`,
    think_prompt: `\`\`\`text
SAMPLE — /api/packages
GET /api/packages
→ [ { "id": "1", "status": "…" } ]

Rule: used >= total → empty; else active (expose remaining)
\`\`\`

A status label describing a record can always be recalculated from that record's own stored facts — comparing dates, or checking a boolean flag — rather than being sent by the client and simply trusted. Given the rule above, should the browser send status, or should the server compute it — and from what?`,
    mc_options: ["server derives status from stored facts; ignore client status","save req.body.status as-is","randomize status on every GET"],
    mc_correct_option: "server derives status from stored facts; ignore client status",
    mc_anchor: "server derives status from stored facts;",
    why_this_matters: `Server-calculated statuses guarantee consistency based on verifiable balances.`,
    answer_keywords: ["derivePackageStatus"],
    seed_code: `let packages = [];
export function validatePackage(input) { return null; }
`,
    starter_code: `let packages = [];
export function validatePackage(input) { return null; }
export function derivePackageStatus(row, now = new Date()) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Status is computed on the server.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A derive function takes one stored row (plus, optionally, the current time) and returns a label computed purely from that row's own fields — it never reads anything the client sent in the current request.`,
    expected: `let packages = [];
export function validatePackage(input) { return null; }
export function derivePackageStatus(row) {
  if ((row.usedPunches || 0) >= row.totalPunches) return "empty";
  return "active";
}
`,
    analog_example: `const status = Number(req.body.remainingPunches) > 0 ? "remaining" : "empty";`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Server-calculated statuses guarantee consistency based on verifiable balances.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/packages with a derived status:

  Store    →  in-memory ServicePackage rows
  Validate →  required fields
  Derive   →  used >= total → empty; else active (expose remaining)
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let packages = [];
export function validatePackage(input) { return null; }
export function derivePackageStatus(row) {
  if ((row.usedPunches || 0) >= row.totalPunches) return "empty";
  return "active";
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Evaluate punch count: Check if remaining punches exceed 0.
2. Set status: Assign "remaining" if positive; otherwise, assign "empty".`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Expose GET to fetch packages and POST to create packages with the server-derived status included.

WHAT YOU'LL NEED
- GET endpoint returning stored packages.
- POST endpoint validating data, computing status, saving, and returning 201.

Your task: Build endpoints to fetch packages and create new packages with the calculated status.`,
    hint: `1. Return store: Send status 200 with the packages array in GET.
2. Protect POST: Run validation and status derivation before pushing the record.
3. Save record: Assign a unique ID, push the item to storage, and return status 201.`,
    example_code: `export function getPackages(res: Response) {
  return res.status(200).json(packageStore);
}

export function createPackage(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derive status
  const item = { id: generatePackageId(), ...req.body, status };
  packageStore.push(item);
  return res.status(201).json(item);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/packages
GET /api/packages
→ [ …rows with status ]

POST /api/packages
→ 201 { …row, "status": "…" }
\`\`\`

Attaching a computed field to data on its way out of a route means running the derive function once per record, every time that record is returned — never once at write time and then reused. How do GET and POST above reuse validatePackage and derivePackageStatus to guarantee status is never stale?`,
    mc_options: ["GET/POST attach derived status; POST validates first","POST stores client status verbatim","GET omits status"],
    mc_correct_option: "GET/POST attach derived status; POST validates first",
    mc_anchor: "GET/POST attach derived status; POST val",
    why_this_matters: `The client receives back the saved package along with its server-calculated status tag.


================================================================================`,
    answer_keywords: ["derivePackageStatus","validatePackage","201"],
    seed_code: `let packages = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validatePackage(input) { return null; }
export function derivePackageStatus(row, now = new Date()) { return "open"; }
`,
    starter_code: `let packages = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validatePackage(input) { return null; }
export function derivePackageStatus(row, now = new Date()) { return "open"; }
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
    expected: `let packages = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validatePackage(input) { return null; }
export function derivePackageStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(packages.map((r) => ({ ...r, status: derivePackageStatus(r) })));
    },
    create(req, res) {
      const err = validatePackage(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), client: req.body.client, service: req.body.service, totalPunches: req.body.totalPunches, usedPunches: req.body.usedPunches, usedPunches: 0 };
      packages.push(row);
      res.status(201).json({ ...row, status: derivePackageStatus(row) });
    },
  };
}
`,
    analog_example: `export function getPackages(res: Response) {
  return res.status(200).json(packageStore);
}

export function createPackage(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derive status
  const item = { id: generatePackageId(), ...req.body, status };
  packageStore.push(item);
  return res.status(201).json(item);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The client receives back the saved package along with its server-calculated status tag.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/packages with a derived status:

  Store    →  in-memory ServicePackage rows
  Validate →  required fields
  Derive   →  used >= total → empty; else active (expose remaining)
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let packages = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validatePackage(input) { return null; }
export function derivePackageStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(packages.map((r) => ({ ...r, status: derivePackageStatus(r) })));
    },
    create(req, res) {
      const err = validatePackage(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), client: req.body.client, service: req.body.service, totalPunches: req.body.totalPunches, usedPunches: req.body.usedPunches, usedPunches: 0 };
      packages.push(row);
      res.status(201).json({ ...row, status: derivePackageStatus(row) });
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Return store: Send status 200 with the packages array in GET.
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
  title: "Packages API with remaining / empty status",
  shortName: "Package API",
});
