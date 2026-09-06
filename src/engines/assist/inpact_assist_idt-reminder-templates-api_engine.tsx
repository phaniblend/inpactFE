import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-reminder-templates-api",
      title: "Templates API — unique name per channel",
      body: `Implement /api/reminder-templates with persistence and a conflict rule:

  Store    →  in-memory array of ReminderTemplate
  Validate →  required fields before insert
  Conflict →  same name + channel → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      usecase: "Two templates with the same name on one channel confuse staff. The API rejects duplicates.",
      designMock: {"kind":"api-sample","screenTitle":"/api/reminder-templates","caption":"Sample requests/responses — the server owns the conflict rule.","getSample":"GET /api/reminder-templates\n→ [ { \"id\": \"1\", \"name\": \"Appt tomorrow\", \"body\": \"See you at {time}\", \"channel\": \"sms\" } ]","postSample":"POST /api/reminder-templates\n{ \"name\": \"Appt tomorrow\", \"body\": \"See you at {time}\", \"channel\": \"sms\" }\n→ 201 created  OR  409 conflict"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Establish memory storage for message templates and an ID helper for unique template keys.","Reject template submissions that lack a name, channel type, or message body (400).","Inspect stored templates to guarantee no template shares the exact same name on that channel.","Expose GET for template retrieval and POST for saving, returning 409 if a duplicate name is detected."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Establish memory storage for message templates and an ID helper for unique template keys.

WHAT YOU'LL NEED
- An array holding template records.
- An incremental ID generator helper.

Your task: Set up server storage for message templates and an ID generator.`,
    hint: `1. In-memory store: Declare an empty array typed with your template interface.
2. ID helper: Return an incremental ID string from your helper function.`,
    example_code: `let templateStore: TemplateRecord[] = [];
let tplIdCounter = 1;

function generateTemplateId(): string {
  return \`tpl-\${tplIdCounter++}\`;
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/reminder-templates
GET /api/reminder-templates
→ [ { "id": "1", "name": "Appt tomorrow", "body": "See you at {time}", "channel": "sms" } ]
\`\`\`

A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created. Where do the rows above live between one request and the next in a simple lesson server, and how does each new row get an id nothing else already has?`,
    mc_options: ["module-level array + a counter-based nextId helper","store only in the browser localStorage","ask the client to send the full database each time"],
    mc_correct_option: "module-level array + a counter-based nextId helper",
    mc_anchor: "module-level array + a counter-based nex",
    why_this_matters: `In-memory storage allows quick API testing without database setup.`,
    answer_keywords: ["templates","nextId","nextIdCounter"],
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
    expected: `let templates = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return templates; }
`,
    analog_example: `let templateStore: TemplateRecord[] = [];
let tplIdCounter = 1;

function generateTemplateId(): string {
  return \`tpl-\${tplIdCounter++}\`;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `In-memory storage allows quick API testing without database setup.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/reminder-templates with persistence and a conflict rule:

  Store    →  in-memory array of ReminderTemplate
  Validate →  required fields before insert
  Conflict →  same name + channel → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let templates = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return templates; }
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. In-memory store: Declare an empty array typed with your template interface.
2. ID helper: Return an incremental ID string from your helper function.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Reject template submissions that lack a name, channel type, or message body (400).

WHAT YOU'LL NEED
- Checks verifying required body properties.
- 400 status response for incomplete requests.

Your task: Reject template requests missing name, channel, or body with status 400.`,
    hint: `1. Inspect fields: Evaluate required properties using !req.body.property.
2. Reject missing: Send status 400 if any required field is falsy.`,
    example_code: `if (!req.body.name || !req.body.channel || !req.body.body) {
  return res.status(400).json({ error: "Name, channel, and body are required" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/reminder-templates
POST /api/reminder-templates
{ "name": "Appt tomorrow", "body": "See you at {time}", "channel": "sms" }
→ 201 created  OR  400 bad request
\`\`\`

Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage. Looking at the POST body above, which checks have to pass before you push a row?`,
    mc_options: ["return an error string for missing/invalid fields, else null","always return null and trust the client","throw and crash the process on bad input"],
    mc_correct_option: "return an error string for missing/invalid fields, else null",
    mc_anchor: "return an error string for missing/inval",
    why_this_matters: `Validation prevents blank or malformed templates from entering storage.`,
    answer_keywords: ["validateTemplate","name","body","channel"],
    seed_code: `let templates = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
`,
    starter_code: `let templates = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateTemplate(input) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Validate, then create.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.`,
    expected: `let templates = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return templates; }
export function validateTemplate(input) {
  if (typeof input?.name !== "string" || !input.name.trim()) return "name is required";
  if (typeof input?.body !== "string" || !input.body.trim()) return "body is required";
  if (typeof input?.channel !== "string" || !input.channel.trim()) return "channel is required";
  return null;
}
`,
    analog_example: `if (!req.body.name || !req.body.channel || !req.body.body) {
  return res.status(400).json({ error: "Name, channel, and body are required" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Validation prevents blank or malformed templates from entering storage.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/reminder-templates with persistence and a conflict rule:

  Store    →  in-memory array of ReminderTemplate
  Validate →  required fields before insert
  Conflict →  same name + channel → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let templates = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function getStore() { return templates; }
export function validateTemplate(input) {
  if (typeof input?.name !== "string" || !input.name.trim()) return "name is required";
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
    paal: `Inspect stored templates to guarantee no template shares the exact same name on that channel.

WHAT YOU'LL NEED
- An array search checking for matching channel and name.
- 409 conflict response if a duplicate is found.

Your task: Scan existing templates and reject with status 409 if a template with the same name already exists on this channel.`,
    hint: `1. Scan store: Use .some() on your templateStore array.
2. Match criteria: Compare channel and normalized name values.
3. Reject duplicates: If found, halt execution with status 409.`,
    example_code: `const exists = templateStore.some(
  (t) =>
    t.channel === req.body.channel &&
    t.name.toLowerCase() === req.body.name.toLowerCase()
);
if (exists) {
  return res.status(409).json({ error: "A template with this name already exists on this channel" });
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/reminder-templates
POST /api/reminder-templates
→ 201 created  OR  409 conflict

Rule: same name + channel → conflict
\`\`\`

Two requests can describe the same resource at the same moment — before inserting one, you compare it against everything already stored to decide whether it collides. Given the rule above, how should the server decide "conflict" before insert?`,
    mc_options: ["compare candidate against existing rows; true means conflict","always allow POST and fix conflicts in the UI later","delete the older row silently"],
    mc_correct_option: "compare candidate against existing rows; true means conflict",
    mc_anchor: "compare candidate against existing rows;",
    why_this_matters: `Preventing duplicate template names avoids ambiguity when selecting templates.`,
    answer_keywords: ["hasTemplateName","some","name"],
    seed_code: `let templates = [];
export function validateTemplate(input) { return null; }
`,
    starter_code: `let templates = [];
export function validateTemplate(input) { return null; }
export function hasTemplateName(candidate) {}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Server detects conflict before insert.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `Checking one candidate record against a list of existing ones for a matching combination of fields is exactly what Array.prototype.some() is for — it stops at the first match and returns true or false.`,
    expected: `let templates = [];
export function validateTemplate(input) { return null; }
export function hasTemplateName(candidate) {
  return templates.some((row) => row.name === candidate.name && row.channel === candidate.channel);
}
`,
    analog_example: `const exists = templateStore.some(
  (t) =>
    t.channel === req.body.channel &&
    t.name.toLowerCase() === req.body.name.toLowerCase()
);
if (exists) {
  return res.status(409).json({ error: "A template with this name already exists on this channel" });
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Preventing duplicate template names avoids ambiguity when selecting templates.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/reminder-templates with persistence and a conflict rule:

  Store    →  in-memory array of ReminderTemplate
  Validate →  required fields before insert
  Conflict →  same name + channel → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let templates = [];
export function validateTemplate(input) { return null; }
export function hasTemplateName(candidate) {
  return templates.some((row) => row.name === candidate.name && row.channel === candidate.channel);
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Scan store: Use .some() on your templateStore array.
2. Match criteria: Compare channel and normalized name values.
3. Reject duplicates: If found, halt execution with status 409.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Expose GET for template retrieval and POST for saving, returning 409 if a duplicate name is detected.

WHAT YOU'LL NEED
- GET endpoint returning stored templates.
- POST endpoint applying 400 validation and 409 duplicate checks before saving.

Your task: Build endpoints to return templates and create new ones with validation and duplicate checks.`,
    hint: `1. Return store: Send status 200 with the templateStore array in GET.
2. Protect POST: Run validation and duplicate checks before pushing the record.
3. Save record: Assign a unique ID, push the item to storage, and return status 201.`,
    example_code: `export function getTemplates(res: Response) {
  return res.status(200).json(templateStore);
}

export function createTemplate(req: Request, res: Response) {
  // Step 2 validation check (400)
  // Step 3 duplicate name check (409)
  const item = { id: generateTemplateId(), ...req.body };
  templateStore.push(item);
  return res.status(201).json(item);
}`,
    think_prompt: `\`\`\`text
SAMPLE — /api/reminder-templates
GET /api/reminder-templates
→ [ ...rows ]

POST /api/reminder-templates
→ 201 created  OR  400/409 error
\`\`\`

A route handler is where validation, conflict-checking, and storage come together — it should call the helpers you already wrote, in order, not re-implement any of their logic inline. How do GET and POST above use templates, validateTemplate, and hasTemplateName together?`,
    mc_options: ["GET lists store; POST validates, rejects conflict, else 201","POST always 201 even on overlap","GET returns HTML instead of JSON"],
    mc_correct_option: "GET lists store; POST validates, rejects conflict, else 201",
    mc_anchor: "GET lists store; POST validates, rejects",
    why_this_matters: `Consistent error codes (400 for bad data, 409 for duplicates) make API behavior predictable.


================================================================================`,
    answer_keywords: ["409","400","201","validateTemplate","hasTemplateName"],
    seed_code: `let templates = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateTemplate(input) { return null; }
export function hasTemplateName(c) { return false; }
`,
    starter_code: `let templates = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateTemplate(input) { return null; }
export function hasTemplateName(c) { return false; }
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
    expected: `let templates = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateTemplate(input) { return null; }
export function hasTemplateName(candidate) {
  return templates.some((row) => row.name === candidate.name && row.channel === candidate.channel);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(templates);
    },
    create(req, res) {
      const err = validateTemplate(req.body);
      if (err) return res.status(400).json({ error: err });
      if (hasTemplateName(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), name: req.body.name, body: req.body.body, channel: req.body.channel };
      templates.push(row);
      res.status(201).json(row);
    },
  };
}
`,
    analog_example: `export function getTemplates(res: Response) {
  return res.status(200).json(templateStore);
}

export function createTemplate(req: Request, res: Response) {
  // Step 2 validation check (400)
  // Step 3 duplicate name check (409)
  const item = { id: generateTemplateId(), ...req.body };
  templateStore.push(item);
  return res.status(201).json(item);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Consistent error codes (400 for bad data, 409 for duplicates) make API behavior predictable.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Implement /api/reminder-templates with persistence and a conflict rule:

  Store    →  in-memory array of ReminderTemplate
  Validate →  required fields before insert
  Conflict →  same name + channel → conflict
  Routes   →  GET list, POST create (400 on bad/conflict)`,
      discover: `let templates = [];
let nextIdCounter = 1;
function nextId() { return String(nextIdCounter++); }
export function validateTemplate(input) { return null; }
export function hasTemplateName(candidate) {
  return templates.some((row) => row.name === candidate.name && row.channel === candidate.channel);
}
export function createHandlers() {
  return {
    list(_req, res) {
      res.json(templates);
    },
    create(req, res) {
      const err = validateTemplate(req.body);
      if (err) return res.status(400).json({ error: err });
      if (hasTemplateName(req.body)) return res.status(409).json({ error: "conflict" });
      const row = { id: nextId(), name: req.body.name, body: req.body.body, channel: req.body.channel };
      templates.push(row);
      res.status(201).json(row);
    },
  };
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Return store: Send status 200 with the templateStore array in GET.
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
  title: "Templates API — unique name per channel",
  shortName: "Templates API",
});
