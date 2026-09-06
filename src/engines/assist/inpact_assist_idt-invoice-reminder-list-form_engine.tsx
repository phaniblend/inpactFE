import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-invoice-reminder-list-form",
      title: "Reminder log list + schedule form",
      body: `Build a screen that lists reminders and a form to add one:

  List     →  each row is one Reminder
  Empty    →  a message when the list has no items
  Form     →  Invoice id, Channel, Send at
  Submit   →  the new row appears on the list
`,
      usecase: "Collections work is a second list+form: who gets nudged, how, and when.",
      designMock: {"kind":"list-and-form","screenTitle":"Reminders","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No reminders yet.","rows":[{"title":"inv-9","subtitle":"email","meta":"Fri 9:00"},{"title":"Second row","subtitle":"Another","meta":"Fri 9:00"}],"fields":[{"label":"Invoice id","sample":"inv-9"},{"label":"Channel","sample":"email"},{"label":"Send at","sample":"Fri 9:00"}],"submitLabel":"Schedule"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Build a blueprint for scheduled notifications (recipient, message, send time) and set up the outer container.","Store reminders in memory; display each scheduled row, or show \"No pending reminders in queue\" when empty.","Wire the message and date inputs to state to track typed content in real time.","Stop page reload on submit, drop the reminder into the queue, and clear the input boxes."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Build a blueprint for scheduled notifications (recipient, message, send time) and set up the outer container.

WHAT YOU'LL NEED
- id (text)
- target (text)
- time (text)

Your task: Define the reminder blueprint and create the container component.`,
    hint: `1. Blueprint declaration: Rename ReminderLog to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    example_code: `export type ReminderLog = {
  id: string;
  target: string;
  time: string;
};

export function ReminderTracker() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Reminders
  Invoice id: "inv-9"
  Channel: "email"
  Send at: "Fri 9:00"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type Reminder (id + invoiceId, channel, sendAt), then export function ReminderDesk() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type Reminder (id + invoiceId, channel, sendAt), then export function ReminderDesk() returning <div />",
    mc_anchor: "Define type Reminder (id + invoiceId, ch",
    why_this_matters: `A clear type definition ensures that reminder logs have consistent fields across the app.`,
    answer_keywords: ["export","type","Reminder","invoiceId","channel","sendAt","export","function","ReminderDesk","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type Reminder = {
  id: string;
  invoiceId: string;
  channel: string;
  sendAt: string;
};

export function ReminderDesk() {
  return <div />;
}
`,
    analog_example: `export type ReminderLog = {
  id: string;
  target: string;
  time: string;
};

export function ReminderTracker() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `A clear type definition ensures that reminder logs have consistent fields across the app.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists reminders and a form to add one:

  List     →  each row is one Reminder
  Empty    →  a message when the list has no items
  Form     →  Invoice id, Channel, Send at
  Submit   →  the new row appears on the list
`,
      discover: `export type Reminder = {
  id: string;
  invoiceId: string;
  channel: string;
  sendAt: string;
};

export function ReminderDesk() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Blueprint declaration: Rename ReminderLog to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Store reminders in memory; display each scheduled row, or show "No pending reminders in queue" when empty.

WHAT YOU'LL NEED
- State array holding reminder items.
- Conditional empty-state render.
- Map loop rendering reminder rows.

Your task: Store reminder logs in state and display them, showing a placeholder message when empty.`,
    hint: `1. Set up state: Use useState<ReminderLog[]>([]).
2. Check for empty: Use logs.length === 0 to branch the render.
3. Render entries: Map through logs, passing key={l.id} and rendering properties.`,
    example_code: `const [logs, setLogs] = useState<ReminderLog[]>([]);

return (
  <div>
    {logs.length === 0 ? (
      <p>No reminders logged</p>
    ) : (
      logs.map((l) => (
        <div key={l.id}>
          {l.target} at {l.time}
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST — Reminders
  inv-9
  email

EMPTY — "No reminders yet."
\`\`\`

React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user. Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
    mc_options: ["useState for the array; branch on length === 0 before mapping rows with a stable key","let reminders = [] and mutate it directly on every update","always render the mapped rows, even when the array is empty"],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `Clear empty-state messaging confirms the system is working even when there are no records.`,
    answer_keywords: ["useState","reminders","setReminders","length","map","key"],
    seed_code: `import { useState } from "react";

export type Reminder = {
  id: string;
  invoiceId: string;
  channel: string;
  sendAt: string;
};

export function ReminderDesk() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type Reminder = {
  id: string;
  invoiceId: string;
  channel: string;
  sendAt: string;
};

export function ReminderDesk() {
  // list state here
  return (
    <div>
      {/* empty or list */}
    </div>
  );
}
`,
    feedback_correct: "Correct — the list is real state, and both the empty and populated cases are covered.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "List data must live in useState, and the render has to branch on length before mapping.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `To re-render on change, the array has to live in a hook that both holds the value and gives you a setter. Once it does, checking its length before deciding what to render is just an ordinary conditional — the empty case and the list case are two branches of one render.`,
    expected: `import { useState } from "react";

export type Reminder = {
  id: string;
  invoiceId: string;
  channel: string;
  sendAt: string;
};

export function ReminderDesk() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  return (
    <div>
      {reminders.length === 0 ? (
        <p>No reminders yet.</p>
      ) : (
        <ul>
          {reminders.map((a) => (
            <li key={a.id}>{a.invoiceId}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [logs, setLogs] = useState<ReminderLog[]>([]);

return (
  <div>
    {logs.length === 0 ? (
      <p>No reminders logged</p>
    ) : (
      logs.map((l) => (
        <div key={l.id}>
          {l.target} at {l.time}
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Clear empty-state messaging confirms the system is working even when there are no records.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists reminders and a form to add one:

  List     →  each row is one Reminder
  Empty    →  a message when the list has no items
  Form     →  Invoice id, Channel, Send at
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Reminder = {
  id: string;
  invoiceId: string;
  channel: string;
  sendAt: string;
};

export function ReminderDesk() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  return (
    <div>
      {reminders.length === 0 ? (
        <p>No reminders yet.</p>
      ) : (
        <ul>
          {reminders.map((a) => (
            <li key={a.id}>{a.invoiceId}</li>
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
      build: `1. Set up state: Use useState<ReminderLog[]>([]).
2. Check for empty: Use logs.length === 0 to branch the render.
3. Render entries: Map through logs, passing key={l.id} and rendering properties.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Wire the message and date inputs to state to track typed content in real time.

WHAT YOU'LL NEED
- State hooks for target and time inputs.
- Value and onChange props wired on inputs.

Your task: Connect reminder form inputs to React state.`,
    hint: `1. Initialize states: Call useState("") for each input.
2. Wire inputs: Connect value and onChange to each state variable.`,
    example_code: `const [target, setTarget] = useState("");
const [time, setTime] = useState("");

<input value={target} onChange={(e) => setTarget(e.target.value)} />
<input value={time} onChange={(e) => setTime(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Reminders
  [ Invoice id ]  [ Channel ]  [ Send at ]   → Schedule
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure form data is tracked cleanly before submission.`,
    answer_keywords: ["useState","value=","onChange","invoiceId","channel","sendAt"],
    seed_code: `import { useState } from "react";

export type Reminder = {
  id: string;
  invoiceId: string;
  channel: string;
  sendAt: string;
};

export function ReminderDesk() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type Reminder = {
  id: string;
  invoiceId: string;
  channel: string;
  sendAt: string;
};

export function ReminderDesk() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
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

export type Reminder = {
  id: string;
  invoiceId: string;
  channel: string;
  sendAt: string;
};

export function ReminderDesk() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [channel, setChannel] = useState("");
  const [sendAt, setSendAt] = useState("");
  return (
    <form>
        <input value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} placeholder="Invoice id" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <input value={sendAt} onChange={(e) => setSendAt(e.target.value)} placeholder="Send at" />
    </form>
  );
}
`,
    analog_example: `const [target, setTarget] = useState("");
const [time, setTime] = useState("");

<input value={target} onChange={(e) => setTarget(e.target.value)} />
<input value={time} onChange={(e) => setTime(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure form data is tracked cleanly before submission.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists reminders and a form to add one:

  List     →  each row is one Reminder
  Empty    →  a message when the list has no items
  Form     →  Invoice id, Channel, Send at
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Reminder = {
  id: string;
  invoiceId: string;
  channel: string;
  sendAt: string;
};

export function ReminderDesk() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [channel, setChannel] = useState("");
  const [sendAt, setSendAt] = useState("");
  return (
    <form>
        <input value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} placeholder="Invoice id" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <input value={sendAt} onChange={(e) => setSendAt(e.target.value)} placeholder="Send at" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize states: Call useState("") for each input.
2. Wire inputs: Connect value and onChange to each state variable.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Stop page reload on submit, drop the reminder into the queue, and clear the input boxes.

WHAT YOU'LL NEED
- Form interceptor using e.preventDefault().
- Object assembly with a unique ID.
- Spread update to state.
- Form reset calls.

Your task: Append the new reminder to the list without reloading the page and clear the form inputs.`,
    hint: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, target, and time into a new object.
3. Append item: Use setLogs((prev) => [...prev, entry]).
4. Clear form: Reset input states to "".`,
    example_code: `function addReminder(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), target, time };
  setLogs((prev) => [...prev, entry]);
  setTarget("");
  setTime("");
}`,
    think_prompt: `\`\`\`text
FORM — Reminders
  [ Invoice id ]  [ Channel ]  [ Send at ]   → Schedule
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Schedule is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `The reminder log updates instantly without jarring browser reloads.


================================================================================`,
    answer_keywords: ["preventDefault","setReminders","prev","invoiceId","channel","sendAt"],
    seed_code: `import { useState } from "react";

export type Reminder = {
  id: string;
  invoiceId: string;
  channel: string;
  sendAt: string;
};

export function ReminderDesk() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [channel, setChannel] = useState("");
  const [sendAt, setSendAt] = useState("");
  return (
    <div>
      {reminders.length === 0 ? <p>No reminders yet.</p> : <ul>{reminders.map((a) => <li key={a.id}>{a.invoiceId} · {a.channel} · {a.sendAt}</li>)}</ul>}
      <form>
        <input value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} placeholder="Invoice id" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <input value={sendAt} onChange={(e) => setSendAt(e.target.value)} placeholder="Send at" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type Reminder = {
  id: string;
  invoiceId: string;
  channel: string;
  sendAt: string;
};

export function ReminderDesk() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [channel, setChannel] = useState("");
  const [sendAt, setSendAt] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {reminders.length === 0 ? <p>No reminders yet.</p> : <ul>{reminders.map((a) => <li key={a.id}>{a.invoiceId} · {a.channel} · {a.sendAt}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} placeholder="Invoice id" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <input value={sendAt} onChange={(e) => setSendAt(e.target.value)} placeholder="Send at" />
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

export type Reminder = {
  id: string;
  invoiceId: string;
  channel: string;
  sendAt: string;
};

export function ReminderDesk() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [channel, setChannel] = useState("");
  const [sendAt, setSendAt] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Reminder = { id: String(Date.now()), invoiceId, channel, sendAt };
    setReminders((prev) => [...prev, next]);
    setInvoiceId("");
    setChannel("");
    setSendAt("");
  }
  return (
    <div>
      {reminders.length === 0 ? (
        <p>No reminders yet.</p>
      ) : (
        <ul>
          {reminders.map((a) => (
            <li key={a.id}>{a.invoiceId} · {a.channel} · {a.sendAt}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} placeholder="Invoice id" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <input value={sendAt} onChange={(e) => setSendAt(e.target.value)} placeholder="Send at" />
        <button type="submit">Schedule</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function addReminder(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), target, time };
  setLogs((prev) => [...prev, entry]);
  setTarget("");
  setTime("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The reminder log updates instantly without jarring browser reloads.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists reminders and a form to add one:

  List     →  each row is one Reminder
  Empty    →  a message when the list has no items
  Form     →  Invoice id, Channel, Send at
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Reminder = {
  id: string;
  invoiceId: string;
  channel: string;
  sendAt: string;
};

export function ReminderDesk() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [channel, setChannel] = useState("");
  const [sendAt, setSendAt] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Reminder = { id: String(Date.now()), invoiceId, channel, sendAt };
    setReminders((prev) => [...prev, next]);
    setInvoiceId("");
    setChannel("");
    setSendAt("");
  }
  return (
    <div>
      {reminders.length === 0 ? (
        <p>No reminders yet.</p>
      ) : (
        <ul>
          {reminders.map((a) => (
            <li key={a.id}>{a.invoiceId} · {a.channel} · {a.sendAt}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} placeholder="Invoice id" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <input value={sendAt} onChange={(e) => setSendAt(e.target.value)} placeholder="Send at" />
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
2. Build item: Package id, target, and time into a new object.
3. Append item: Use setLogs((prev) => [...prev, entry]).
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
  title: "Reminder log list + schedule form",
  shortName: "Reminder FE",
});
