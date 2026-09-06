import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-booking-day-board-filter",
      title: "Day board: filter appointments by provider",
      body: `Build a screen that lists appointments and a form to add one:

  List     →  each row is one Appointment
  Empty    →  a message when the list has no items
  Form     →  Provider, Service, Starts at
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      usecase: "Operators scan one provider's day. Filtering a list without destroying the full dataset is a core frontend skill.",
      designMock: {"kind":"list-and-form","screenTitle":"Day board","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No appointments for this filter.","rows":[{"title":"Maya","subtitle":"Cut","meta":"10:00"},{"title":"Second row","subtitle":"Another","meta":"10:00"}],"fields":[{"label":"Provider","sample":"Maya"},{"label":"Service","sample":"Cut"},{"label":"Starts at","sample":"10:00"}],"submitLabel":"Add"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Define the appointment blueprint (including the provider name) and set up the day-board screen layout.","View appointments through a provider filter lens, displaying only their patients or a \"No visits for this provider\" message.","Connect input text boxes to memory so newly entered appointment details are tracked live.","Intercept submission, add the new visit to memory, clear the form, and let the provider filter sort it."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

This file doesn't exist yet — you're the first to touch it. Create it at \`src/components/DayBoard.tsx\` before anything else. Every step from here on edits that same file.

Define the appointment blueprint (including the provider name) and set up the day-board screen layout.

WHAT YOU'LL NEED
- id (text)
- provider (text)
- patient (text)
- time (text)

Your task: Create the blueprint for a provider-linked appointment and an empty wrapper component.`,
    hint: `1. Declare the type: Swap ScheduleItem for your appointment type name.
2. Add your properties: Follow "field: string;" line-by-line for all required data keys.
3. Create the component: Match the function frame, replacing ScheduleBoard with your component name.`,
    example_code: `export type ScheduleItem = {
  id: string;
  category: string;
  label: string;
};

export function ScheduleBoard() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Day board
  Provider: "Maya"
  Service: "Cut"
  Starts at: "10:00"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type Appointment (id + provider, service, startsAt), then export function DayBoard() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type Appointment (id + provider, service, startsAt), then export function DayBoard() returning <div />",
    mc_anchor: "Define type Appointment (id + provider, ",
    why_this_matters: `Explicitly declaring the provider property in your type ensures that your filtering step won't suffer from missing keys.`,
    answer_keywords: ["export","type","Appointment","provider","service","startsAt","export","function","DayBoard","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function DayBoard() {
  return <div />;
}
`,
    analog_example: `export type ScheduleItem = {
  id: string;
  category: string;
  label: string;
};

export function ScheduleBoard() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Explicitly declaring the provider property in your type ensures that your filtering step won't suffer from missing keys.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists appointments and a form to add one:

  List     →  each row is one Appointment
  Empty    →  a message when the list has no items
  Form     →  Provider, Service, Starts at
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function DayBoard() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Declare the type: Swap ScheduleItem for your appointment type name.
2. Add your properties: Follow "field: string;" line-by-line for all required data keys.
3. Create the component: Match the function frame, replacing ScheduleBoard with your component name.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

View appointments through a provider filter lens, displaying only their patients or a "No visits for this provider" message.

WHAT YOU'LL NEED
- Array state holding appointments.
- An active filter variable (e.g. selected provider).
- A .filter() call producing a displayed subset.
- A fallback note if the filtered subset is empty.

Your task: Filter the appointment list by a selected provider and display only matches, or a note if none exist.`,
    hint: `1. Maintain the full list: Store all appointments in main state using useState.
2. Apply the filter: Create a derived variable with items.filter(...), checking if item.provider matches the target provider.
3. Render conditionally: Check visibleItems.length === 0. If zero, render your empty message; otherwise, loop through visibleItems with .map().`,
    example_code: `const [items, setItems] = useState<ScheduleItem[]>([]);
const [filter, setFilter] = useState("Dr. Smith");

const visibleItems = items.filter((item) => item.category === filter);

return (
  <div>
    {visibleItems.length === 0 ? (
      <p>No entries found</p>
    ) : (
      visibleItems.map((item) => <div key={item.id}>{item.label}</div>)
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST (filtered) — Day board
  Maya
  Cut   (only rows where provider is "Maya")

EMPTY — "No appointments for this filter."
\`\`\`

Filtering for display means computing a smaller array from the full one with .filter() before mapping — the state array itself never loses any rows, and a zero-length filtered result is still an empty case worth its own message. How do you keep the complete appointments list in state, render only the subset above, and still show a clear message when that subset is empty?`,
    mc_options: ["keep the full list in state; filter before map; branch on the filtered length for the empty message","delete non-matching rows from state permanently","hide the whole list whenever any filter is active"],
    mc_correct_option: "keep the full list in state; filter before map; branch on the filtered length for the empty message",
    mc_anchor: "keep the full list in state; filter befo",
    why_this_matters: `Deriving a filtered list on the fly keeps your original master list completely safe while showing users only what they asked to see.`,
    answer_keywords: ["useState","appointments","filter","map","length"],
    seed_code: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function DayBoard() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function DayBoard() {
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

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function DayBoard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const visible = appointments.filter((a) => a.provider === "Maya");
  return (
    <div>
      {visible.length === 0 ? (
        <p>No appointments for this filter.</p>
      ) : (
        <ul>
          {visible.map((a) => (
            <li key={a.id}>{a.provider}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [items, setItems] = useState<ScheduleItem[]>([]);
const [filter, setFilter] = useState("Dr. Smith");

const visibleItems = items.filter((item) => item.category === filter);

return (
  <div>
    {visibleItems.length === 0 ? (
      <p>No entries found</p>
    ) : (
      visibleItems.map((item) => <div key={item.id}>{item.label}</div>)
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Deriving a filtered list on the fly keeps your original master list completely safe while showing users only what they asked to see.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists appointments and a form to add one:

  List     →  each row is one Appointment
  Empty    →  a message when the list has no items
  Form     →  Provider, Service, Starts at
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function DayBoard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const visible = appointments.filter((a) => a.provider === "Maya");
  return (
    <div>
      {visible.length === 0 ? (
        <p>No appointments for this filter.</p>
      ) : (
        <ul>
          {visible.map((a) => (
            <li key={a.id}>{a.provider}</li>
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
      build: `1. Maintain the full list: Store all appointments in main state using useState.
2. Apply the filter: Create a derived variable with items.filter(...), checking if item.provider matches the target provider.
3. Render conditionally: Check visibleItems.length === 0. If zero, render your empty message; otherwise, loop through visibleItems with .map().`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Connect input text boxes to memory so newly entered appointment details are tracked live.

WHAT YOU'LL NEED
- State variables for provider, patient, and time.
- Matching input boxes with value and onChange wired.

Your task: Track what the user types into appointment fields in real time using component state.`,
    hint: `1. Initialize fields: Declare useState("") for each input needed.
2. Link value: Set the input's value prop to the state variable.
3. Link onChange: Update the corresponding state variable using e.target.value.`,
    example_code: `const [label, setLabel] = useState("");

<input
  value={label}
  onChange={(e) => setLabel(e.target.value)}
  placeholder="Label"
/>;`,
    think_prompt: `\`\`\`text
FORM — Day board
  [ Provider ]  [ Service ]  [ Starts at ]   → Add
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Synchronizing user inputs with state allows you to inspect, modify, and package data before saving.`,
    answer_keywords: ["useState","value=","onChange","provider","service","startsAt"],
    seed_code: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function DayBoard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function DayBoard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function DayBoard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [provider, setProvider] = useState("");
  const [service, setService] = useState("");
  const [startsAt, setStartsAt] = useState("");
  return (
    <form>
        <input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Provider" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} placeholder="Starts at" />
    </form>
  );
}
`,
    analog_example: `const [label, setLabel] = useState("");

<input
  value={label}
  onChange={(e) => setLabel(e.target.value)}
  placeholder="Label"
/>;`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Synchronizing user inputs with state allows you to inspect, modify, and package data before saving.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists appointments and a form to add one:

  List     →  each row is one Appointment
  Empty    →  a message when the list has no items
  Form     →  Provider, Service, Starts at
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function DayBoard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [provider, setProvider] = useState("");
  const [service, setService] = useState("");
  const [startsAt, setStartsAt] = useState("");
  return (
    <form>
        <input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Provider" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} placeholder="Starts at" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize fields: Declare useState("") for each input needed.
2. Link value: Set the input's value prop to the state variable.
3. Link onChange: Update the corresponding state variable using e.target.value.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Intercept submission, add the new visit to memory, clear the form, and let the provider filter sort it.

WHAT YOU'LL NEED
- Form submission interceptor.
- Creation of an item matching your Step 1 blueprint.
- Spread update appending the item to state.
- Field reset calls.

Your task: Add the new appointment to the master list without a page refresh and reset the input form.`,
    hint: `1. Halt refresh: Call e.preventDefault() at the top of your handler.
2. Construct item: Build an object containing an id and your form state values.
3. Update state safely: Append using setItems((prev) => [...prev, next]).
4. Reset inputs: Clear the input state variables by setting them back to "".`,
    example_code: `function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  const next = { id: String(Date.now()), category: currentCategory, label };
  setItems((prev) => [...prev, next]);
  setLabel("");
}`,
    think_prompt: `\`\`\`text
FORM — Day board
  [ Provider ]  [ Service ]  [ Starts at ]   → Add
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Add is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `Appending to state keeps the master list updated, and your filter from Step 2 will immediately determine if the new item appears on the current board.


================================================================================`,
    answer_keywords: ["preventDefault","setAppointments","prev","provider","service","startsAt"],
    seed_code: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function DayBoard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [provider, setProvider] = useState("");
  const [service, setService] = useState("");
  const [startsAt, setStartsAt] = useState("");
  return (
    <div>
      {appointments.length === 0 ? <p>No appointments for this filter.</p> : <ul>{appointments.map((a) => <li key={a.id}>{a.provider} · {a.service} · {a.startsAt}</li>)}</ul>}
      <form>
        <input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Provider" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} placeholder="Starts at" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function DayBoard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [provider, setProvider] = useState("");
  const [service, setService] = useState("");
  const [startsAt, setStartsAt] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {appointments.length === 0 ? <p>No appointments for this filter.</p> : <ul>{appointments.map((a) => <li key={a.id}>{a.provider} · {a.service} · {a.startsAt}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Provider" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} placeholder="Starts at" />
        <button type="submit">Add</button>
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

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function DayBoard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [provider, setProvider] = useState("");
  const [service, setService] = useState("");
  const [startsAt, setStartsAt] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Appointment = { id: String(Date.now()), provider, service, startsAt };
    setAppointments((prev) => [...prev, next]);
    setProvider("");
    setService("");
    setStartsAt("");
  }
  return (
    <div>
      {appointments.length === 0 ? (
        <p>No appointments for this filter.</p>
      ) : (
        <ul>
          {appointments.map((a) => (
            <li key={a.id}>{a.provider} · {a.service} · {a.startsAt}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Provider" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} placeholder="Starts at" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  const next = { id: String(Date.now()), category: currentCategory, label };
  setItems((prev) => [...prev, next]);
  setLabel("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Appending to state keeps the master list updated, and your filter from Step 2 will immediately determine if the new item appears on the current board.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists appointments and a form to add one:

  List     →  each row is one Appointment
  Empty    →  a message when the list has no items
  Form     →  Provider, Service, Starts at
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function DayBoard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [provider, setProvider] = useState("");
  const [service, setService] = useState("");
  const [startsAt, setStartsAt] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Appointment = { id: String(Date.now()), provider, service, startsAt };
    setAppointments((prev) => [...prev, next]);
    setProvider("");
    setService("");
    setStartsAt("");
  }
  return (
    <div>
      {appointments.length === 0 ? (
        <p>No appointments for this filter.</p>
      ) : (
        <ul>
          {appointments.map((a) => (
            <li key={a.id}>{a.provider} · {a.service} · {a.startsAt}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Provider" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} placeholder="Starts at" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Halt refresh: Call e.preventDefault() at the top of your handler.
2. Construct item: Build an object containing an id and your form state values.
3. Update state safely: Append using setItems((prev) => [...prev, next]).
4. Reset inputs: Clear the input state variables by setting them back to "".`,
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
  title: "Day board: filter appointments by provider",
  shortName: "Day board FE",
});
