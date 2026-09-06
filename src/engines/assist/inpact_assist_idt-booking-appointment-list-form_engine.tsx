import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-booking-appointment-list-form",
      title: "Appointment list + book form",
      body: `Build a screen that lists appointments and a form to add one:

  List     →  each row is one Appointment
  Empty    →  a message when the list has no items
  Form     →  Provider, Service, Starts at
  Submit   →  the new row appears on the list
`,
      usecase: "Most web apps need a screen that lists data as rows you can scan — people, orders, tickets. You also need a form to add a new row, and a clear message when the list is empty.",
      designMock: {"kind":"list-and-form","screenTitle":"Bookings","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No appointments yet.","rows":[{"title":"Maya","subtitle":"Color & cut","meta":"Tue 2:00 PM"},{"title":"Second row","subtitle":"Another","meta":"Tue 2:00 PM"}],"fields":[{"label":"Provider","sample":"Maya"},{"label":"Service","sample":"Color & cut"},{"label":"Starts at","sample":"Tue 2:00 PM"}],"submitLabel":"Book"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Create an appointment blueprint (name, time) and set up the outer container component.","Store appointments in app memory; show rows if booked, or a \"No appointments scheduled today\" note if empty.","Connect the booking input boxes directly to memory so names and times are tracked as you type.","Stop the form from refreshing the page on click, append the new appointment to the list, and wipe the inputs clean."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Create an appointment blueprint (name, time) and set up the outer container component.

WHAT YOU'LL NEED
- id (text)
- patient (text)
- time (text)

Your task: Create the blueprint for a single appointment and set up an empty screen frame to hold the view.`,
    hint: `1. Mirror the declaration: Look at "export type Guest = {". Replace Guest with your task's blueprint name.
2. Fill the lines: In the example, every detail follows "name: string;". Add your fields one by one using that exact shape (property name, colon, string, semicolon).
3. Close the blueprint: End with "};" just like the pattern.
4. Mirror the component frame: Look at "export function GuestList() { ... }". Replace GuestList with your component name, keeping the return structure intact.`,
    example_code: `export type Guest = {
  id: string;
  name: string;
  note: string;
};

export function GuestList() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Bookings
  Provider: "Maya"
  Service: "Color & cut"
  Starts at: "Tue 2:00 PM"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type Appointment (id + provider, service, startsAt), then export function BookingDesk() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type Appointment (id + provider, service, startsAt), then export function BookingDesk() returning <div />",
    mc_anchor: "Define type Appointment (id + provider, ",
    why_this_matters: `Writing a type creates an official checklist. Your editor uses it to autocomplete names and underline typos in red before you even run your project.`,
    answer_keywords: ["export","type","Appointment","provider","service","startsAt","export","function","BookingDesk","return"],
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

export function BookingDesk() {
  return <div />;
}
`,
    analog_example: `export type Guest = {
  id: string;
  name: string;
  note: string;
};

export function GuestList() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Writing a type creates an official checklist. Your editor uses it to autocomplete names and underline typos in red before you even run your project.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists appointments and a form to add one:

  List     →  each row is one Appointment
  Empty    →  a message when the list has no items
  Form     →  Provider, Service, Starts at
  Submit   →  the new row appears on the list
`,
      discover: `export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function BookingDesk() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Mirror the declaration: Look at "export type Guest = {". Replace Guest with your task's blueprint name.
2. Fill the lines: In the example, every detail follows "name: string;". Add your fields one by one using that exact shape (property name, colon, string, semicolon).
3. Close the blueprint: End with "};" just like the pattern.
4. Mirror the component frame: Look at "export function GuestList() { ... }". Replace GuestList with your component name, keeping the return structure intact.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Store appointments in app memory; show rows if booked, or a "No appointments scheduled today" note if empty.

WHAT YOU'LL NEED
- An array state holding items typed with your blueprint.
- A condition checking if the list length is 0.
- A fallback message when empty, or a loop drawing each row.

Your task: Give the app a memory slot for your appointments collection and show either the booked rows or a friendly empty note.`,
    hint: `1. Set up memory: Replace Guest in useState<Guest[]>([]) with your task's item type.
2. Check for empty: Check if your array's length equals 0 using a ternary operator (? :).
3. Render the fallback: Put your polite "no records" text inside the first branch.
4. Render the list: In the second branch, use .map() to loop through each item, ensuring you pass the unique id into the key attribute.`,
    example_code: `const [items, setItems] = useState<Guest[]>([]);

return (
  <div>
    {items.length === 0 ? (
      <p>No guests yet</p>
    ) : (
      items.map((item) => <div key={item.id}>{item.name}</div>)
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST — Bookings
  Maya
  Color & cut

EMPTY — "No appointments yet."
\`\`\`

React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user. Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
    mc_options: ["useState for the array; branch on length === 0 before mapping rows with a stable key","let appointments = [] and mutate it directly on every update","always render the mapped rows, even when the array is empty"],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `Checking for an empty list guarantees your user never stares at a broken, blank page when no records exist.`,
    answer_keywords: ["useState","appointments","setAppointments","length","map","key"],
    seed_code: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function BookingDesk() {
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

export function BookingDesk() {
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

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function BookingDesk() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  return (
    <div>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <ul>
          {appointments.map((a) => (
            <li key={a.id}>{a.provider}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [items, setItems] = useState<Guest[]>([]);

return (
  <div>
    {items.length === 0 ? (
      <p>No guests yet</p>
    ) : (
      items.map((item) => <div key={item.id}>{item.name}</div>)
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Checking for an empty list guarantees your user never stares at a broken, blank page when no records exist.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists appointments and a form to add one:

  List     →  each row is one Appointment
  Empty    →  a message when the list has no items
  Form     →  Provider, Service, Starts at
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function BookingDesk() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  return (
    <div>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <ul>
          {appointments.map((a) => (
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
      build: `1. Set up memory: Replace Guest in useState<Guest[]>([]) with your task's item type.
2. Check for empty: Check if your array's length equals 0 using a ternary operator (? :).
3. Render the fallback: Put your polite "no records" text inside the first branch.
4. Render the list: In the second branch, use .map() to loop through each item, ensuring you pass the unique id into the key attribute.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Connect the booking input boxes directly to memory so names and times are tracked as you type.

WHAT YOU'LL NEED
- State variables for each field the user types.
- An input with value pointing to state.
- An onChange handler feeding event text into the setter.

Your task: Connect your form's text boxes directly to memory so every typed keystroke is saved immediately.`,
    hint: `1. Create field memory: For every text input, create a pair using useState("").
2. Bind the screen: In your <input />, point value to that state variable.
3. Listen for typing: Write onChange={(e) => setYourField(e.target.value)} to forward the typed text into memory.`,
    example_code: `const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Enter name"
/>;`,
    think_prompt: `\`\`\`text
FORM — Bookings
  [ Provider ]  [ Service ]  [ Starts at ]   → Book
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `When inputs are tied to state, React always knows what the user typed, making validation and saving predictable.`,
    answer_keywords: ["useState","value=","onChange","provider","service","startsAt"],
    seed_code: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function BookingDesk() {
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

export function BookingDesk() {
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

export function BookingDesk() {
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
    analog_example: `const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Enter name"
/>;`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `When inputs are tied to state, React always knows what the user typed, making validation and saving predictable.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists appointments and a form to add one:

  List     →  each row is one Appointment
  Empty    →  a message when the list has no items
  Form     →  Provider, Service, Starts at
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function BookingDesk() {
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
      build: `1. Create field memory: For every text input, create a pair using useState("").
2. Bind the screen: In your <input />, point value to that state variable.
3. Listen for typing: Write onChange={(e) => setYourField(e.target.value)} to forward the typed text into memory.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Stop the form from refreshing the page on click, append the new appointment to the list, and wipe the inputs clean.

WHAT YOU'LL NEED
- An onSubmit function intercepting form submission.
- A call to stop the default browser reload.
- An update adding the new record to your existing list.
- Resets setting form state variables back to empty strings.

Your task: Save the newly typed item into your collection on submit without refreshing the browser, then reset the text boxes.`,
    hint: `1. Stop browser reload: Put e.preventDefault() as the very first line inside your submission handler.
2. Assemble the record: Create an object containing a unique id and the values from your input state.
3. Append without mutating: Use the spread operator ([...prev, newItem]) inside your list setter to add the new entry safely.
4. Clean the slate: Call your input state setters with empty strings "" so the form clears.`,
    example_code: `function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  const newItem = { id: String(Date.now()), name };
  setItems((prev) => [...prev, newItem]);
  setName("");
}`,
    think_prompt: `\`\`\`text
FORM — Bookings
  [ Provider ]  [ Service ]  [ Starts at ]   → Book
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Book is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `Stopping page reload prevents the entire browser from blinking, creating an instant and seamless app experience.


================================================================================`,
    answer_keywords: ["preventDefault","setAppointments","prev","provider","service","startsAt"],
    seed_code: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function BookingDesk() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [provider, setProvider] = useState("");
  const [service, setService] = useState("");
  const [startsAt, setStartsAt] = useState("");
  return (
    <div>
      {appointments.length === 0 ? <p>No appointments yet.</p> : <ul>{appointments.map((a) => <li key={a.id}>{a.provider} · {a.service} · {a.startsAt}</li>)}</ul>}
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

export function BookingDesk() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [provider, setProvider] = useState("");
  const [service, setService] = useState("");
  const [startsAt, setStartsAt] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {appointments.length === 0 ? <p>No appointments yet.</p> : <ul>{appointments.map((a) => <li key={a.id}>{a.provider} · {a.service} · {a.startsAt}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Provider" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} placeholder="Starts at" />
        <button type="submit">Book</button>
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

export function BookingDesk() {
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
        <p>No appointments yet.</p>
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
        <button type="submit">Book</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  const newItem = { id: String(Date.now()), name };
  setItems((prev) => [...prev, newItem]);
  setName("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Stopping page reload prevents the entire browser from blinking, creating an instant and seamless app experience.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists appointments and a form to add one:

  List     →  each row is one Appointment
  Empty    →  a message when the list has no items
  Form     →  Provider, Service, Starts at
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Appointment = {
  id: string;
  provider: string;
  service: string;
  startsAt: string;
};

export function BookingDesk() {
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
        <p>No appointments yet.</p>
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
        <button type="submit">Book</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Stop browser reload: Put e.preventDefault() as the very first line inside your submission handler.
2. Assemble the record: Create an object containing a unique id and the values from your input state.
3. Append without mutating: Use the spread operator ([...prev, newItem]) inside your list setter to add the new entry safely.
4. Clean the slate: Call your input state setters with empty strings "" so the form clears.`,
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
  title: "Appointment list + book form",
  shortName: "Book list+form",
});
