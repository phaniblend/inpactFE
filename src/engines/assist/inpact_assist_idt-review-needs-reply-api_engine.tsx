import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-review-needs-reply-api",
      title: "Reviews API with needs-reply status",
      body: `Implement /api/reviews with a derived status:

  Store    →  in-memory Review rows
  Validate →  required fields
  Derive   →  if replied true → answered; else needs-reply
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      usecase: "Needs-reply must come from whether a reply exists — not from a client-sent flag.",
      designMock: {"kind":"api-sample","screenTitle":"/api/reviews","caption":"Status is computed on the way out — clients cannot fake it.","getSample":"GET /api/reviews\n→ [ { \"id\": \"1\", \"status\": \"…\" } ]","postSample":"POST /api/reviews\n{ …fields… }\n→ 201 { …row, \"status\": \"…\" }"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Set up memory storage for client feedback and an ID generator for unique review records.","Validate that submitted reviews include a customer name, rating, and feedback comment.","Check whether an official reply is attached; if missing, have the server tag it as \"needs-reply\".","Provide GET to view feedback and POST to log reviews with their calculated status attached."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Set up memory storage for client feedback and an ID generator for unique review records.

WHAT YOU'LL NEED
- An array holding review records.
- An incremental ID generator helper.

Your task: Set up server storage for customer reviews and an ID generator.`,
    hint: `1. In-memory store: Declare an empty array typed with your feedback shape.
2. ID helper: Return an incremental ID string from your helper function.`,
    example_code: `let feedbackStore: FeedbackRecord[] = [];
let fbIdCounter = 1;

function generateFeedbackId(): string {
  return \`fb-\${fbIdCounter++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/reviews
GET /api/reviews
→ [ { "id": "1", "status": "…" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId","no store — recompute from logs only","client sends the whole catalog every GET"],
    mc_correct_option: "module-level array + a counter-based nextId",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `In-memory storage allows quick API testing without database setup.`,
    answer_keywords: ["reviews","nextId","nextIdCounter"],
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
    expected: `let reviews = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return reviews; }
`,
    analog_example: `let feedbackStore: FeedbackRecord[] = [];
let fbIdCounter = 1;

function generateFeedbackId(): string {
  return \`fb-\${fbIdCounter++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `In-memory storage allows quick API testing without database setup.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/reviews with a derived status:

  Store    →  in-memory Review rows
  Validate →  required fields
  Derive   →  if replied true → answered; else needs-reply
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let reviews = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return reviews; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. In-memory store: Declare an empty array typed with your feedback shape.
2. ID helper: Return an incremental ID string from your helper function.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Validate that submitted reviews include a customer name, rating, and feedback comment.

WHAT YOU'LL NEED
- Checks verifying required body properties.
- 400 status response for incomplete requests.

Your task: Reject reviews lacking customer name or rating with status 400.`,
    hint: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 if any required field is falsy.`,
    example_code: `if (!req.body.reviewer || !req.body.rating) {
  return res.status(400).json({ error: "Reviewer and rating are required" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/reviews
POST /api/reviews
{ …fields… }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. What must be true about the fields above before you insert a row?`,
    mc_options: ["error string for bad fields, else null","accept any JSON","coerce everything to strings silently"],
    mc_correct_option: "error string for bad fields, else null",
    mc_anchor: "error string for bad fields, else null",
    why_this_matters: `Validation prevents empty or unrated reviews from entering storage.`,
    answer_keywords: ["validateReview","author","rating","body","postedAt"],
    seed_code: `let reviews = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let reviews = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReview(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate first.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let reviews = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return reviews; }
export function validateReview(input) {
  if (typeof input?.author !== "string" || !input.author.trim()) return "author is required";
  if (typeof input?.rating !== "number" || input.rating <= 0) return "rating must be > 0";
  if (typeof input?.body !== "string" || !input.body.trim()) return "body is required";
  if (typeof input?.postedAt !== "string" || !input.postedAt.trim()) return "postedAt is required";
  return null;
}
`,
    analog_example: `if (!req.body.reviewer || !req.body.rating) {
  return res.status(400).json({ error: "Reviewer and rating are required" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Validation prevents empty or unrated reviews from entering storage.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/reviews with a derived status:

  Store    →  in-memory Review rows
  Validate →  required fields
  Derive   →  if replied true → answered; else needs-reply
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let reviews = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return reviews; }
export function validateReview(input) {
  if (typeof input?.author !== "string" || !input.author.trim()) return "author is required";
  if (typeof input?.rating !== "number" || input.rating <= 0) return "rating must be > 0";
  if (typeof input?.body !== "string" || !input.body.trim()) return "body is required";
  if (typeof input?.postedAt !== "string" || !input.postedAt.trim()) return "postedAt is required";
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
    paal: `Check whether an official reply is attached; if missing, have the server tag it as "needs-reply".

WHAT YOU'LL NEED
- Check verifying if a reply text or flag exists.
- Assignment of "replied" or "needs-reply" based on that check.

Your task: Determine whether a review is "replied" or "needs-reply" based on attached response data on the server.`,
    hint: `1. Inspect replies: Check if reply text or an answer is provided.
2. Set status: Assign "replied" if present; otherwise, assign "needs-reply".`,
    example_code: `const status = req.body.replyText ? "replied" : "needs-reply";`,
    think_prompt: `\`\`\`text
SAMPLE — /api/reviews
GET /api/reviews
→ [ { "id": "1", "status": "…" } ]

Rule: if replied true → answered; else needs-reply
\`\`\`

A status label describing a record can always be recalculated from that record's own stored facts — comparing dates, or checking a boolean flag — rather than being sent by the client and simply trusted. Given the rule above, should the browser send status, or should the server compute it — and from what?`,
    mc_options: ["server derives status from stored facts; ignore client status","save req.body.status as-is","randomize status on every GET"],
    mc_correct_option: "server derives status from stored facts; ignore client status",
    mc_anchor: "server derives status from stored facts;",
    why_this_matters: `Server-calculated statuses guarantee consistency based on verifiable reply data.`,
    answer_keywords: ["deriveReviewStatus"],
    seed_code: `let reviews = [];
export function validateReview(input) { return null; }
`,
    starter_code: `let reviews = [];
export function validateReview(input) { return null; }
export function deriveReviewStatus(row, now = new Date()) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Status is computed on the server.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A derive function takes one stored row (plus, optionally, the current time) and returns a label computed purely from that row's own fields — it never reads anything the client sent in the current request.`,
    expected: `let reviews = [];
export function validateReview(input) { return null; }
export function deriveReviewStatus(row, now = new Date()) {
  if (row.replied === true) return "answered";
  if (new Date(row.rating) < now) return "needs-reply";
  return "needs-reply";
}
`,
    analog_example: `const status = req.body.replyText ? "replied" : "needs-reply";`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Server-calculated statuses guarantee consistency based on verifiable reply data.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/reviews with a derived status:

  Store    →  in-memory Review rows
  Validate →  required fields
  Derive   →  if replied true → answered; else needs-reply
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let reviews = [];
export function validateReview(input) { return null; }
export function deriveReviewStatus(row, now = new Date()) {
  if (row.replied === true) return "answered";
  if (new Date(row.rating) < now) return "needs-reply";
  return "needs-reply";
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Inspect replies: Check if reply text or an answer is provided.
2. Set status: Assign "replied" if present; otherwise, assign "needs-reply".`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Provide GET to view feedback and POST to log reviews with their calculated status attached.

WHAT YOU'LL NEED
- GET endpoint returning stored reviews.
- POST endpoint validating data, computing status, saving, and returning 201.

Your task: Build endpoints to fetch reviews and log new reviews with the calculated status.`,
    hint: `1. Return store: Send status 200 with the feedbackStore array in GET.
2. Protect POST: Run validation and status derivation before pushing the record.
3. Save record: Assign a unique ID, push the item to storage, and return status 201.`,
    example_code: `export function getFeedback(res: Response) {
  return res.status(200).json(feedbackStore);
}

export function logFeedback(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derive status
  const item = { id: generateFeedbackId(), ...req.body, status };
  feedbackStore.push(item);
  return res.status(201).json(item);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/reviews
GET /api/reviews
→ [ …rows with status ]

POST /api/reviews
→ 201 { …row, "status": "…" }
\`\`\`

Attaching a computed field to data on its way out of a route means running the derive function once per record, every time that record is returned — never once at write time and then reused. How do GET and POST above reuse validateReview and deriveReviewStatus to guarantee status is never stale?`,
    mc_options: ["GET/POST attach derived status; POST validates first","POST stores client status verbatim","GET omits status"],
    mc_correct_option: "GET/POST attach derived status; POST validates first",
    mc_anchor: "GET/POST attach derived status; POST val",
    why_this_matters: `The client receives back the logged review along with its server-calculated status tag.


================================================================================`,
    answer_keywords: ["deriveReviewStatus","validateReview","201"],
    seed_code: `let reviews = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReview(input) { return null; }
export function deriveReviewStatus(row, now = new Date()) { return "open"; }
`,
    starter_code: `let reviews = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReview(input) { return null; }
export function deriveReviewStatus(row, now = new Date()) { return "open"; }
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
    expected: `let reviews = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReview(input) { return null; }
export function deriveReviewStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(reviews.map((r) => ({ ...r, status: deriveReviewStatus(r) })));
    },
    create(req, res) {
      const err = validateReview(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), author: req.body.author, rating: req.body.rating, body: req.body.body, postedAt: req.body.postedAt, replied: false };
      reviews.push(row);
      res.status(201).json({ ...row, status: deriveReviewStatus(row) });
    },
  };
}
`,
    analog_example: `export function getFeedback(res: Response) {
  return res.status(200).json(feedbackStore);
}

export function logFeedback(req: Request, res: Response) {
  // Step 2 validation check
  // Step 3 derive status
  const item = { id: generateFeedbackId(), ...req.body, status };
  feedbackStore.push(item);
  return res.status(201).json(item);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The client receives back the logged review along with its server-calculated status tag.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/reviews with a derived status:

  Store    →  in-memory Review rows
  Validate →  required fields
  Derive   →  if replied true → answered; else needs-reply
  Routes   →  GET/POST attach computed status (do not trust client status)`,
      discover: `let reviews = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReview(input) { return null; }
export function deriveReviewStatus(row, now = new Date()) { return "open"; }
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(reviews.map((r) => ({ ...r, status: deriveReviewStatus(r) })));
    },
    create(req, res) {
      const err = validateReview(req.body);
      if (err) return res.status(400).json({ error: err });
      const row = { id: nextId(), author: req.body.author, rating: req.body.rating, body: req.body.body, postedAt: req.body.postedAt, replied: false };
      reviews.push(row);
      res.status(201).json({ ...row, status: deriveReviewStatus(row) });
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Return store: Send status 200 with the feedbackStore array in GET.
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
  title: "Reviews API with needs-reply status",
  shortName: "Review API",
});
