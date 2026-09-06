import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-reminder-due-board",
      title: "Due board: filter reminders that should send now",
      body: `Build a screen that lists reminders and a form to add one:

  List     →  each row is one ScheduledReminder
  Empty    →  a message when the list has no items
  Form     →  Client, Channel, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      usecase: "Owners open a due board first. Filter for display; keep the full schedule in state.",
      designMock: {"kind":"list-and-form","screenTitle":"Due now","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"Nothing due.","rows":[{"title":"Alex","subtitle":"sms","meta":"due"},{"title":"Second row","subtitle":"Another","meta":"due"}],"fields":[{"label":"Client","sample":"Alex"},{"label":"Channel","sample":"sms"},{"label":"Status","sample":"due"}],"submitLabel":"Schedule"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Model a reminder item with delivery timestamps and assemble the active board container.","Filter reminders to display only those whose scheduled time is due right now, showing \"All caught up\" if clear.","Connect reminder fields to state so typed messages and times stay synced.","Stop page reload on submit, append the reminder to state, clear the form, and let the due filter sort it."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

This file doesn't exist yet — you're the first to touch it. Create it at \`src/components/DueBoard.tsx\` before anything else. Every step from here on edits that same file.

Model a reminder item with delivery timestamps and assemble the active board container.

WHAT YOU'LL NEED
- id (text)
- recipient (text)
- status (text)

Your task: Define the shape of a reminder with its status tag, and build the board shell.`,
    hint: `1. Blueprint declaration: Rename FilterableReminder to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    example_code: `export type FilterableReminder = {
  id: string;
  recipient: string;
  status: string;
};

export function DueBoard() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Due now
  Client: "Alex"
  Channel: "sms"
  Status: "due"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type ScheduledReminder (id + client, channel, status), then export function DueBoard() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type ScheduledReminder (id + client, channel, status), then export function DueBoard() returning <div />",
    mc_anchor: "Define type ScheduledReminder (id + clie",
    why_this_matters: `Defining the status field in the blueprint ensures clean filtering in later steps.`,
    answer_keywords: ["export","type","ScheduledReminder","client","channel","status","export","function","DueBoard","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type ScheduledReminder = {
  id: string;
  client: string;
  channel: string;
  status: string;
};

export function DueBoard() {
  return <div />;
}
`,
    analog_example: `export type FilterableReminder = {
  id: string;
  recipient: string;
  status: string;
};

export function DueBoard() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Defining the status field in the blueprint ensures clean filtering in later steps.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists reminders and a form to add one:

  List     →  each row is one ScheduledReminder
  Empty    →  a message when the list has no items
  Form     →  Client, Channel, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `export type ScheduledReminder = {
  id: string;
  client: string;
  channel: string;
  status: string;
};

export function DueBoard() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Blueprint declaration: Rename FilterableReminder to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Filter reminders to display only those whose scheduled time is due right now, showing "All caught up" if clear.

WHAT YOU'LL NEED
- State array holding all reminders.
- .filter() call selecting reminders where status === 'due'.
- Conditional empty check.

Your task: Filter reminders to show only those marked "due", displaying a message if all are sent.`,
    hint: `1. Master list: Keep all records in allReminders state.
2. Filter logic: Create dueReminders using .filter(r => r.status === "due").
3. Conditional render: Check dueReminders.length === 0 to render the fallback message or the list rows.`,
    example_code: `const [allReminders, setAllReminders] = useState<FilterableReminder[]>([]);

const dueReminders = allReminders.filter((r) => r.status === "due");

return (
  <div>
    {dueReminders.length === 0 ? (
      <p>All reminders are sent</p>
    ) : (
      dueReminders.map((r) => (
        <div key={r.id}>
          Send reminder to: {r.recipient}
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST (filtered) — Due now
  Alex
  sms   (only rows where status is "due")

EMPTY — "Nothing due."
\`\`\`

Filtering for display means computing a smaller array from the full one with .filter() before mapping — the state array itself never loses any rows, and a zero-length filtered result is still an empty case worth its own message. How do you keep the complete reminders list in state, render only the subset above, and still show a clear message when that subset is empty?`,
    mc_options: ["keep the full list in state; filter before map; branch on the filtered length for the empty message","delete non-matching rows from state permanently","hide the whole list whenever any filter is active"],
    mc_correct_option: "keep the full list in state; filter before map; branch on the filtered length for the empty message",
    mc_anchor: "keep the full list in state; filter befo",
    why_this_matters: `Filtering isolates urgent tasks without modifying the master schedule.`,
    answer_keywords: ["useState","reminders","filter","map","length"],
    seed_code: `import { useState } from "react";

export type ScheduledReminder = {
  id: string;
  client: string;
  channel: string;
  status: string;
};

export function DueBoard() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type ScheduledReminder = {
  id: string;
  client: string;
  channel: string;
  status: string;
};

export function DueBoard() {
  // list state here
  return (
    <div>
      {/* filter, then empty or list */}
    </div>
  );
}
`,
    feedback_correct: "Correct — the full list stays in state, and only the matching rows (or an honest empty message) render.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Filter for display only — state keeps every row, and the empty check runs on the filtered result, not the original.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `.filter() always returns a brand-new array and never touches the one it was called on — so the full list stays in state, and the array you check for "empty" and then map is the filtered one, not the original.`,
    expected: `import { useState } from "react";

export type ScheduledReminder = {
  id: string;
  client: string;
  channel: string;
  status: string;
};

export function DueBoard() {
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);
  const visible = reminders.filter((a) => a.status === "due");
  return (
    <div>
      {visible.length === 0 ? (
        <p>Nothing due.</p>
      ) : (
        <ul>
          {visible.map((a) => (
            <li key={a.id}>{a.client}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [allReminders, setAllReminders] = useState<FilterableReminder[]>([]);

const dueReminders = allReminders.filter((r) => r.status === "due");

return (
  <div>
    {dueReminders.length === 0 ? (
      <p>All reminders are sent</p>
    ) : (
      dueReminders.map((r) => (
        <div key={r.id}>
          Send reminder to: {r.recipient}
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Filtering isolates urgent tasks without modifying the master schedule.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists reminders and a form to add one:

  List     →  each row is one ScheduledReminder
  Empty    →  a message when the list has no items
  Form     →  Client, Channel, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type ScheduledReminder = {
  id: string;
  client: string;
  channel: string;
  status: string;
};

export function DueBoard() {
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);
  const visible = reminders.filter((a) => a.status === "due");
  return (
    <div>
      {visible.length === 0 ? (
        <p>Nothing due.</p>
      ) : (
        <ul>
          {visible.map((a) => (
            <li key={a.id}>{a.client}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Master list: Keep all records in allReminders state.
2. Filter logic: Create dueReminders using .filter(r => r.status === "due").
3. Conditional render: Check dueReminders.length === 0 to render the fallback message or the list rows.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Connect reminder fields to state so typed messages and times stay synced.

WHAT YOU'LL NEED
- State hooks for recipient and status inputs.
- Value and onChange props wired on inputs.

Your task: Connect reminder input fields to React state.`,
    hint: `1. Initialize states: Call useState("") for your form inputs.
2. Wire inputs: Connect value and onChange to each state variable.`,
    example_code: `const [recipient, setRecipient] = useState("");
const [status, setStatus] = useState("due");

<input value={recipient} onChange={(e) => setRecipient(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Due now
  [ Client ]  [ Channel ]  [ Status ]   → Schedule
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure clean data capture when scheduling reminders.`,
    answer_keywords: ["useState","value=","onChange","client","channel","status"],
    seed_code: `import { useState } from "react";

export type ScheduledReminder = {
  id: string;
  client: string;
  channel: string;
  status: string;
};

export function DueBoard() {
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type ScheduledReminder = {
  id: string;
  client: string;
  channel: string;
  status: string;
};

export function DueBoard() {
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);
  // field state
  return (
    <form>
      {/* inputs */}
    </form>
  );
}
`,
    feedback_correct: "Correct — keep going.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Controlled inputs: value and onChange both talk to React state.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `In a functional component, a piece of typed text is just another value that can live in state — the input's value prop reads it back out, and onChange is the only place that ever changes it.`,
    expected: `import { useState } from "react";

export type ScheduledReminder = {
  id: string;
  client: string;
  channel: string;
  status: string;
};

export function DueBoard() {
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);
  const [client, setClient] = useState("");
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
    </form>
  );
}
`,
    analog_example: `const [recipient, setRecipient] = useState("");
const [status, setStatus] = useState("due");

<input value={recipient} onChange={(e) => setRecipient(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure clean data capture when scheduling reminders.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists reminders and a form to add one:

  List     →  each row is one ScheduledReminder
  Empty    →  a message when the list has no items
  Form     →  Client, Channel, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type ScheduledReminder = {
  id: string;
  client: string;
  channel: string;
  status: string;
};

export function DueBoard() {
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);
  const [client, setClient] = useState("");
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize states: Call useState("") for your form inputs.
2. Wire inputs: Connect value and onChange to each state variable.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Stop page reload on submit, append the reminder to state, clear the form, and let the due filter sort it.

WHAT YOU'LL NEED
- Form interceptor using e.preventDefault().
- Object assembly matching blueprint.
- Spread update to state.
- Form reset calls.

Your task: Append the new reminder to state without reloading the page and reset the inputs.`,
    hint: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, recipient, and status into an object.
3. Append item: Use setAllReminders((prev) => [...prev, entry]).
4. Clear form: Reset input states to "".`,
    example_code: `function handleAdd(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), recipient, status };
  setAllReminders((prev) => [...prev, entry]);
  setRecipient("");
}`,
    think_prompt: `\`\`\`text
FORM — Due now
  [ Client ]  [ Channel ]  [ Status ]   → Schedule
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Schedule is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `The new reminder is added to the master list, and your filter automatically displays it if it is marked due.


================================================================================`,
    answer_keywords: ["preventDefault","setReminders","prev","client","channel","status"],
    seed_code: `import { useState } from "react";

export type ScheduledReminder = {
  id: string;
  client: string;
  channel: string;
  status: string;
};

export function DueBoard() {
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);
  const [client, setClient] = useState("");
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");
  return (
    <div>
      {reminders.length === 0 ? <p>Nothing due.</p> : <ul>{reminders.map((a) => <li key={a.id}>{a.client} · {a.channel} · {a.status}</li>)}</ul>}
      <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type ScheduledReminder = {
  id: string;
  client: string;
  channel: string;
  status: string;
};

export function DueBoard() {
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);
  const [client, setClient] = useState("");
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {reminders.length === 0 ? <p>Nothing due.</p> : <ul>{reminders.map((a) => <li key={a.id}>{a.client} · {a.channel} · {a.status}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Schedule</button>
      </form>
    </div>
  );
}
`,
    feedback_correct: "Correct — submit updates list state without a reload.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Stay on the page, grow the list, reset the form.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A submit handler runs in a fixed order: stop the default page reload, build the new record from the current field values, add it to state without mutating the old array, then clear the fields for the next entry.`,
    expected: `import { useState } from "react";

export type ScheduledReminder = {
  id: string;
  client: string;
  channel: string;
  status: string;
};

export function DueBoard() {
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);
  const [client, setClient] = useState("");
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: ScheduledReminder = { id: String(Date.now()), client, channel, status };
    setReminders((prev) => [...prev, next]);
    setClient("");
    setChannel("");
    setStatus("");
  }
  return (
    <div>
      {reminders.length === 0 ? (
        <p>Nothing due.</p>
      ) : (
        <ul>
          {reminders.map((a) => (
            <li key={a.id}>{a.client} · {a.channel} · {a.status}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Schedule</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function handleAdd(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), recipient, status };
  setAllReminders((prev) => [...prev, entry]);
  setRecipient("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The new reminder is added to the master list, and your filter automatically displays it if it is marked due.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists reminders and a form to add one:

  List     →  each row is one ScheduledReminder
  Empty    →  a message when the list has no items
  Form     →  Client, Channel, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type ScheduledReminder = {
  id: string;
  client: string;
  channel: string;
  status: string;
};

export function DueBoard() {
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);
  const [client, setClient] = useState("");
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: ScheduledReminder = { id: String(Date.now()), client, channel, status };
    setReminders((prev) => [...prev, next]);
    setClient("");
    setChannel("");
    setStatus("");
  }
  return (
    <div>
      {reminders.length === 0 ? (
        <p>Nothing due.</p>
      ) : (
        <ul>
          {reminders.map((a) => (
            <li key={a.id}>{a.client} · {a.channel} · {a.status}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Schedule</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, recipient, and status into an object.
3. Append item: Use setAllReminders((prev) => [...prev, entry]).
4. Clear form: Reset input states to "".`,
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
  title: "Due board: filter reminders that should send now",
  shortName: "Due board",
});
