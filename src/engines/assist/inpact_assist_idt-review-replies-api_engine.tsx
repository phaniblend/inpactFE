import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-review-replies-api",
      title: "Replies API — one reply per review channel",
      body: `Implement /api/review-replies with persistence and a conflict rule:

  Store    →  in-memory array of ReviewReply
  Validate →  required fields before insert
  Conflict →  same reviewId + channel already replied → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      usecase: "Double-posting the same reply looks unprofessional. The API enforces one per channel.",
      designMock: {"kind":"api-sample","screenTitle":"/api/review-replies","caption":"Sample requests/responses — the server owns the conflict rule.","getSample":"GET /api/review-replies\n→ [ { \"id\": \"1\", \"reviewId\": \"r-1\", \"body\": \"Thanks Sam!\", \"channel\": \"google\" } ]","postSample":"POST /api/review-replies\n{ \"reviewId\": \"r-1\", \"body\": \"Thanks Sam!\", \"channel\": \"google\" }\n→ 201 created  OR  409 conflict"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Establish an in-memory replies drawer and an ID tool to generate unique response IDs.","Check that submitted replies contain a review ID, responder name, and message body (400).","Scan existing replies to verify this review hasn't already received a response on this channel.","Expose GET to list responses and POST to submit replies, returning a 409 conflict error if a response already exists."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

This file doesn't exist yet — you're the first to touch it. Create it at \`server/routes/review-replies.ts\` before anything else. Every step from here on edits that same file.

Establish an in-memory replies drawer and an ID tool to generate unique response IDs.

WHAT YOU'LL NEED
- An array holding reply records.
- An incremental ID generator helper.

Your task: Set up server storage for review replies and an ID generator.`,
    hint: `1. In-memory store: Declare an empty array typed with your reply interface.
2. ID helper: Return an incremental ID string from your helper function.`,
    example_code: `let replyStore: ReplyRecord[] = [];
let repIdCounter = 1;

function generateReplyId(): string {
  return \`rep-\${repIdCounter++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/review-replies
GET /api/review-replies
→ [ { "id": "1", "reviewId": "r-1", "body": "Thanks Sam!", "channel": "google" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next in a simple lesson server, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId helper","store only in the browser localStorage","ask the client to send the full database each time"],
    mc_correct_option: "module-level array + a counter-based nextId helper",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `In-memory storage allows quick API testing without database setup.`,
    answer_keywords: ["replies","nextId","nextIdCounter"],
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
    expected: `let replies = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return replies; }
`,
    analog_example: `let replyStore: ReplyRecord[] = [];
let repIdCounter = 1;

function generateReplyId(): string {
  return \`rep-\${repIdCounter++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `In-memory storage allows quick API testing without database setup.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/review-replies with persistence and a conflict rule:

  Store    →  in-memory array of ReviewReply
  Validate →  required fields before insert
  Conflict →  same reviewId + channel already replied → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let replies = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return replies; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. In-memory store: Declare an empty array typed with your reply interface.
2. ID helper: Return an incremental ID string from your helper function.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Check that submitted replies contain a review ID, responder name, and message body (400).

WHAT YOU'LL NEED
- Checks verifying required body properties.
- 400 status response for incomplete requests.

Your task: Reject reply submissions missing reviewId, channel, or message with status 400.`,
    hint: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 if any required field is falsy.`,
    example_code: `if (!req.body.reviewId || !req.body.channel || !req.body.message) {
  return res.status(400).json({ error: "Review ID, channel, and message are required" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/review-replies
POST /api/review-replies
{ "reviewId": "r-1", "body": "Thanks Sam!", "channel": "google" }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. Looking at the POST body above, which checks have to pass before you push a row?`,
    mc_options: ["return an error string for missing/invalid fields, else null","always return null and trust the client","throw and crash the process on bad input"],
    mc_correct_option: "return an error string for missing/invalid fields, else null",
    mc_anchor: "return an error string for missing/inval",
    why_this_matters: `Validation prevents incomplete or unlinked replies from entering storage.`,
    answer_keywords: ["validateReply","reviewId","body","channel"],
    seed_code: `let replies = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let replies = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReply(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate, then create.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let replies = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return replies; }
export function validateReply(input) {
  if (typeof input?.reviewId !== "string" || !input.reviewId.trim()) return "reviewId is required";
  if (typeof input?.body !== "string" || !input.body.trim()) return "body is required";
  if (typeof input?.channel !== "string" || !input.channel.trim()) return "channel is required";
  return null;
}
`,
    analog_example: `if (!req.body.reviewId || !req.body.channel || !req.body.message) {
  return res.status(400).json({ error: "Review ID, channel, and message are required" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Validation prevents incomplete or unlinked replies from entering storage.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/review-replies with persistence and a conflict rule:

  Store    →  in-memory array of ReviewReply
  Validate →  required fields before insert
  Conflict →  same reviewId + channel already replied → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let replies = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return replies; }
export function validateReply(input) {
  if (typeof input?.reviewId !== "string" || !input.reviewId.trim()) return "reviewId is required";
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
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Scan existing replies to verify this review hasn't already received a response on this channel.

WHAT YOU'LL NEED
- An array search checking for matching reviewId and channel.
- 409 conflict response if a duplicate is found.

Your task: Scan existing replies and reject with status 409 if this review already has a reply on this channel.`,
    hint: `1. Scan store: Use .some() on your replyStore array.
2. Match criteria: Compare reviewId and channel properties.
3. Reject duplicates: If found, halt execution with status 409.`,
    example_code: `const exists = replyStore.some(
  (r) => r.reviewId === req.body.reviewId && r.channel === req.body.channel
);
if (exists) {
  return res.status(409).json({ error: "A reply has already been posted to this review on this channel" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/review-replies
POST /api/review-replies
→ 201 created  OR  409 conflict

Rule: same reviewId + channel already replied → conflict
\`\`\`

Two requests can describe the same resource at the same moment — before inserting one, you compare it against everything already stored to decide whether it collides. Given the rule above, how should the server decide "conflict" before insert?`,
    mc_options: ["compare candidate against existing rows; true means conflict","always allow POST and fix conflicts in the UI later","delete the older row silently"],
    mc_correct_option: "compare candidate against existing rows; true means conflict",
    mc_anchor: "compare candidate against existing rows;",
    why_this_matters: `Preventing duplicate replies avoids confusing customers with multiple conflicting responses.`,
    answer_keywords: ["hasReplyAlready","some","reviewId"],
    seed_code: `let replies = [];
export function validateReply(input) { return null; }
`,
    starter_code: `let replies = [];
export function validateReply(input) { return null; }
export function hasReplyAlready(candidate) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Server detects conflict before insert.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `Checking one candidate record against a list of existing ones for a matching combination of fields is exactly what Array.prototype.some() is for — it stops at the first match and returns true or false.`,
    expected: `let replies = [];
export function validateReply(input) { return null; }
export function hasReplyAlready(candidate) {
  return replies.some((row) => row.reviewId === candidate.reviewId && row.channel === candidate.channel);
}
`,
    analog_example: `const exists = replyStore.some(
  (r) => r.reviewId === req.body.reviewId && r.channel === req.body.channel
);
if (exists) {
  return res.status(409).json({ error: "A reply has already been posted to this review on this channel" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Preventing duplicate replies avoids confusing customers with multiple conflicting responses.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/review-replies with persistence and a conflict rule:

  Store    →  in-memory array of ReviewReply
  Validate →  required fields before insert
  Conflict →  same reviewId + channel already replied → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let replies = [];
export function validateReply(input) { return null; }
export function hasReplyAlready(candidate) {
  return replies.some((row) => row.reviewId === candidate.reviewId && row.channel === candidate.channel);
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Scan store: Use .some() on your replyStore array.
2. Match criteria: Compare reviewId and channel properties.
3. Reject duplicates: If found, halt execution with status 409.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript — a \`.ts\` file for a small backend API module (no JSX here).

Expose GET to list responses and POST to submit replies, returning a 409 conflict error if a response already exists.

WHAT YOU'LL NEED
- GET endpoint returning stored replies.
- POST endpoint applying 400 validation and 409 duplicate checks before saving.

Your task: Build endpoints to return replies and post new replies with validation and duplicate checks.`,
    hint: `1. Return store: Send status 200 with the replyStore array in GET.
2. Protect POST: Run validation and duplicate checks before pushing the record.
3. Save record: Assign a unique ID, push the item to storage, and return status 201.`,
    example_code: `export function getReplies(res: Response) {
  return res.status(200).json(replyStore);
}

export function postReply(req: Request, res: Response) {
  // Step 2 validation check (400)
  // Step 3 duplicate check (409)
  const item = { id: generateReplyId(), ...req.body };
  replyStore.push(item);
  return res.status(201).json(item);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/review-replies
GET /api/review-replies
→ [ ...rows ]

POST /api/review-replies
→ 201 created  OR  400/409 error
\`\`\`

A route handler is where validation, conflict-checking, and storage come together — it should call the helpers you already wrote, in order, not re-implement any of their logic inline. How do GET and POST above use replies, validateReply, and hasReplyAlready together?`,
    mc_options: ["GET lists store; POST validates, rejects conflict, else 201","POST always 201 even on overlap","GET returns HTML instead of JSON"],
    mc_correct_option: "GET lists store; POST validates, rejects conflict, else 201",
    mc_anchor: "GET lists store; POST validates, rejects",
    why_this_matters: `Consistent error codes (400 for bad data, 409 for duplicates) make API behavior predictable.


================================================================================`,
    answer_keywords: ["409","400","201","validateReply","hasReplyAlready"],
    seed_code: `let replies = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReply(input) { return null; }
export function hasReplyAlready(c) { return false; }
`,
    starter_code: `let replies = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReply(input) { return null; }
export function hasReplyAlready(c) { return false; }
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
    expected: `let replies = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReply(input) { return null; }
export function hasReplyAlready(candidate) {
  return replies.some((row) => row.reviewId === candidate.reviewId && row.channel === candidate.channel);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(replies);
    },
    create(req, res) {
      const err = validateReply(req.body);
      if (err) return res.status(400).json({ error: err });
      if (hasReplyAlready(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), reviewId: req.body.reviewId, body: req.body.body, channel: req.body.channel };
      replies.push(row);
      res.status(201).json(row);
    },
  };
}
`,
    analog_example: `export function getReplies(res: Response) {
  return res.status(200).json(replyStore);
}

export function postReply(req: Request, res: Response) {
  // Step 2 validation check (400)
  // Step 3 duplicate check (409)
  const item = { id: generateReplyId(), ...req.body };
  replyStore.push(item);
  return res.status(201).json(item);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Consistent error codes (400 for bad data, 409 for duplicates) make API behavior predictable.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/review-replies with persistence and a conflict rule:

  Store    →  in-memory array of ReviewReply
  Validate →  required fields before insert
  Conflict →  same reviewId + channel already replied → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let replies = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateReply(input) { return null; }
export function hasReplyAlready(candidate) {
  return replies.some((row) => row.reviewId === candidate.reviewId && row.channel === candidate.channel);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(replies);
    },
    create(req, res) {
      const err = validateReply(req.body);
      if (err) return res.status(400).json({ error: err });
      if (hasReplyAlready(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), reviewId: req.body.reviewId, body: req.body.body, channel: req.body.channel };
      replies.push(row);
      res.status(201).json(row);
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Return store: Send status 200 with the replyStore array in GET.
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
  title: "Replies API — one reply per review channel",
  shortName: "Replies API",
});
