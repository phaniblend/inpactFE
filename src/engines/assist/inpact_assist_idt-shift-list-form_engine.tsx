import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-shift-list-form",
      title: "Shift board list + publish form",
      body: `Build a screen that lists shifts and a form to add one:

  List     →  each row is one Shift
  Empty    →  a message when the list has no items
  Form     →  Worker, Role, Starts at
  Submit   →  the new row appears on the list
`,
      usecase: "Small teams still run on group chats. A shift list+form is the staffing desk they can actually use.",
      designMock: {"kind":"list-and-form","screenTitle":"Shifts","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No shifts yet.","rows":[{"title":"Ana","subtitle":"Barista","meta":"Sat 8:00"},{"title":"Second row","subtitle":"Another","meta":"Sat 8:00"}],"fields":[{"label":"Worker","sample":"Ana"},{"label":"Role","sample":"Barista"},{"label":"Starts at","sample":"Sat 8:00"}],"submitLabel":"Publish"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Outline a shift blueprint (worker name, shift hours, role) and build the board container.","Store shifts in state; display each scheduled shift row, or show a \"No shifts published for this week\" message.","Connect worker name and time slot inputs to state to keep typing synchronized.","Stop default submit reload, publish the shift into the active schedule, and clear the form fields."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

This file doesn't exist yet — you're the first to touch it. Create it at \`src/components/ShiftBoard.tsx\` before anything else. Every step from here on edits that same file.

Outline a shift blueprint (worker name, shift hours, role) and build the board container.

WHAT YOU'LL NEED
- id (text)
- worker (text)
- shiftTime (text)

Your task: Define the shape of a scheduled shift and create the component shell.`,
    hint: `1. Blueprint declaration: Rename WorkShift to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    example_code: `export type WorkShift = {
  id: string;
  worker: string;
  shiftTime: string;
};

export function ShiftPlanner() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Shifts
  Worker: "Ana"
  Role: "Barista"
  Starts at: "Sat 8:00"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type Shift (id + worker, role, startsAt), then export function ShiftBoard() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type Shift (id + worker, role, startsAt), then export function ShiftBoard() returning <div />",
    mc_anchor: "Define type Shift (id + worker, role, st",
    why_this_matters: `Modeling shift records ensures consistent schedule fields across the app.`,
    answer_keywords: ["export","type","Shift","worker","role","startsAt","export","function","ShiftBoard","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type Shift = {
  id: string;
  worker: string;
  role: string;
  startsAt: string;
};

export function ShiftBoard() {
  return <div />;
}
`,
    analog_example: `export type WorkShift = {
  id: string;
  worker: string;
  shiftTime: string;
};

export function ShiftPlanner() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Modeling shift records ensures consistent schedule fields across the app.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists shifts and a form to add one:

  List     →  each row is one Shift
  Empty    →  a message when the list has no items
  Form     →  Worker, Role, Starts at
  Submit   →  the new row appears on the list
`,
      discover: `export type Shift = {
  id: string;
  worker: string;
  role: string;
  startsAt: string;
};

export function ShiftBoard() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Blueprint declaration: Rename WorkShift to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Store shifts in state; display each scheduled shift row, or show a "No shifts published for this week" message.

WHAT YOU'LL NEED
- State array holding shifts.
- Conditional empty check.
- Map loop rendering shift entries.

Your task: Store shifts in state and display them, showing a placeholder if the schedule is empty.`,
    hint: `1. Set up state: Use useState<WorkShift[]>([]).
2. Check for empty: Use shifts.length === 0 to render the empty message.
3. Render entries: Map through shifts, passing key={s.id}.`,
    example_code: `const [shifts, setShifts] = useState<WorkShift[]>([]);

return (
  <div>
    {shifts.length === 0 ? (
      <p>No shifts scheduled</p>
    ) : (
      shifts.map((s) => (
        <div key={s.id}>
          {s.worker} working {s.shiftTime}
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST — Shifts
  Ana
  Barista

EMPTY — "No shifts yet."
\`\`\`

React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user. Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
    mc_options: ["useState for the array; branch on length === 0 before mapping rows with a stable key","let shifts = [] and mutate it directly on every update","always render the mapped rows, even when the array is empty"],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `A clear empty state prevents users from wondering whether shifts failed to load.`,
    answer_keywords: ["useState","shifts","setShifts","length","map","key"],
    seed_code: `import { useState } from "react";

export type Shift = {
  id: string;
  worker: string;
  role: string;
  startsAt: string;
};

export function ShiftBoard() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type Shift = {
  id: string;
  worker: string;
  role: string;
  startsAt: string;
};

export function ShiftBoard() {
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

export type Shift = {
  id: string;
  worker: string;
  role: string;
  startsAt: string;
};

export function ShiftBoard() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  return (
    <div>
      {shifts.length === 0 ? (
        <p>No shifts yet.</p>
      ) : (
        <ul>
          {shifts.map((a) => (
            <li key={a.id}>{a.worker}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [shifts, setShifts] = useState<WorkShift[]>([]);

return (
  <div>
    {shifts.length === 0 ? (
      <p>No shifts scheduled</p>
    ) : (
      shifts.map((s) => (
        <div key={s.id}>
          {s.worker} working {s.shiftTime}
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `A clear empty state prevents users from wondering whether shifts failed to load.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists shifts and a form to add one:

  List     →  each row is one Shift
  Empty    →  a message when the list has no items
  Form     →  Worker, Role, Starts at
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Shift = {
  id: string;
  worker: string;
  role: string;
  startsAt: string;
};

export function ShiftBoard() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  return (
    <div>
      {shifts.length === 0 ? (
        <p>No shifts yet.</p>
      ) : (
        <ul>
          {shifts.map((a) => (
            <li key={a.id}>{a.worker}</li>
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
      build: `1. Set up state: Use useState<WorkShift[]>([]).
2. Check for empty: Use shifts.length === 0 to render the empty message.
3. Render entries: Map through shifts, passing key={s.id}.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Connect worker name and time slot inputs to state to keep typing synchronized.

WHAT YOU'LL NEED
- State hooks for worker and shiftTime inputs.
- Value and onChange props wired on inputs.

Your task: Connect shift publishing inputs to React state.`,
    hint: `1. Initialize states: Call useState("") for worker and shiftTime.
2. Wire inputs: Connect value and onChange to each state variable.`,
    example_code: `const [worker, setWorker] = useState("");
const [shiftTime, setShiftTime] = useState("");

<input value={worker} onChange={(e) => setWorker(e.target.value)} />
<input value={shiftTime} onChange={(e) => setShiftTime(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Shifts
  [ Worker ]  [ Role ]  [ Starts at ]   → Publish
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure clean data capture when scheduling new shifts.`,
    answer_keywords: ["useState","value=","onChange","worker","role","startsAt"],
    seed_code: `import { useState } from "react";

export type Shift = {
  id: string;
  worker: string;
  role: string;
  startsAt: string;
};

export function ShiftBoard() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type Shift = {
  id: string;
  worker: string;
  role: string;
  startsAt: string;
};

export function ShiftBoard() {
  const [shifts, setShifts] = useState<Shift[]>([]);
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

export type Shift = {
  id: string;
  worker: string;
  role: string;
  startsAt: string;
};

export function ShiftBoard() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [worker, setWorker] = useState("");
  const [role, setRole] = useState("");
  const [startsAt, setStartsAt] = useState("");
  return (
    <form>
        <input value={worker} onChange={(e) => setWorker(e.target.value)} placeholder="Worker" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
        <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} placeholder="Starts at" />
    </form>
  );
}
`,
    analog_example: `const [worker, setWorker] = useState("");
const [shiftTime, setShiftTime] = useState("");

<input value={worker} onChange={(e) => setWorker(e.target.value)} />
<input value={shiftTime} onChange={(e) => setShiftTime(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure clean data capture when scheduling new shifts.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists shifts and a form to add one:

  List     →  each row is one Shift
  Empty    →  a message when the list has no items
  Form     →  Worker, Role, Starts at
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Shift = {
  id: string;
  worker: string;
  role: string;
  startsAt: string;
};

export function ShiftBoard() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [worker, setWorker] = useState("");
  const [role, setRole] = useState("");
  const [startsAt, setStartsAt] = useState("");
  return (
    <form>
        <input value={worker} onChange={(e) => setWorker(e.target.value)} placeholder="Worker" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
        <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} placeholder="Starts at" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize states: Call useState("") for worker and shiftTime.
2. Wire inputs: Connect value and onChange to each state variable.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Stop default submit reload, publish the shift into the active schedule, and clear the form fields.

WHAT YOU'LL NEED
- Form interceptor using e.preventDefault().
- New shift object creation.
- Spread update to state.
- Form reset calls.

Your task: Append the new shift to state without a page refresh and reset the form.`,
    hint: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, worker, and shiftTime into an object.
3. Append item: Use setShifts((prev) => [...prev, entry]).
4. Clear form: Reset input states to "".`,
    example_code: `function publishShift(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), worker, shiftTime };
  setShifts((prev) => [...prev, entry]);
  setWorker("");
  setShiftTime("");
}`,
    think_prompt: `\`\`\`text
FORM — Shifts
  [ Worker ]  [ Role ]  [ Starts at ]   → Publish
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Publish is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `Published shifts appear on the board instantly without page reloads.


================================================================================`,
    answer_keywords: ["preventDefault","setShifts","prev","worker","role","startsAt"],
    seed_code: `import { useState } from "react";

export type Shift = {
  id: string;
  worker: string;
  role: string;
  startsAt: string;
};

export function ShiftBoard() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [worker, setWorker] = useState("");
  const [role, setRole] = useState("");
  const [startsAt, setStartsAt] = useState("");
  return (
    <div>
      {shifts.length === 0 ? <p>No shifts yet.</p> : <ul>{shifts.map((a) => <li key={a.id}>{a.worker} · {a.role} · {a.startsAt}</li>)}</ul>}
      <form>
        <input value={worker} onChange={(e) => setWorker(e.target.value)} placeholder="Worker" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
        <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} placeholder="Starts at" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type Shift = {
  id: string;
  worker: string;
  role: string;
  startsAt: string;
};

export function ShiftBoard() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [worker, setWorker] = useState("");
  const [role, setRole] = useState("");
  const [startsAt, setStartsAt] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {shifts.length === 0 ? <p>No shifts yet.</p> : <ul>{shifts.map((a) => <li key={a.id}>{a.worker} · {a.role} · {a.startsAt}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={worker} onChange={(e) => setWorker(e.target.value)} placeholder="Worker" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
        <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} placeholder="Starts at" />
        <button type="submit">Publish</button>
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

export type Shift = {
  id: string;
  worker: string;
  role: string;
  startsAt: string;
};

export function ShiftBoard() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [worker, setWorker] = useState("");
  const [role, setRole] = useState("");
  const [startsAt, setStartsAt] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Shift = { id: String(Date.now()), worker, role, startsAt };
    setShifts((prev) => [...prev, next]);
    setWorker("");
    setRole("");
    setStartsAt("");
  }
  return (
    <div>
      {shifts.length === 0 ? (
        <p>No shifts yet.</p>
      ) : (
        <ul>
          {shifts.map((a) => (
            <li key={a.id}>{a.worker} · {a.role} · {a.startsAt}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={worker} onChange={(e) => setWorker(e.target.value)} placeholder="Worker" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
        <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} placeholder="Starts at" />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function publishShift(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), worker, shiftTime };
  setShifts((prev) => [...prev, entry]);
  setWorker("");
  setShiftTime("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Published shifts appear on the board instantly without page reloads.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists shifts and a form to add one:

  List     →  each row is one Shift
  Empty    →  a message when the list has no items
  Form     →  Worker, Role, Starts at
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Shift = {
  id: string;
  worker: string;
  role: string;
  startsAt: string;
};

export function ShiftBoard() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [worker, setWorker] = useState("");
  const [role, setRole] = useState("");
  const [startsAt, setStartsAt] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Shift = { id: String(Date.now()), worker, role, startsAt };
    setShifts((prev) => [...prev, next]);
    setWorker("");
    setRole("");
    setStartsAt("");
  }
  return (
    <div>
      {shifts.length === 0 ? (
        <p>No shifts yet.</p>
      ) : (
        <ul>
          {shifts.map((a) => (
            <li key={a.id}>{a.worker} · {a.role} · {a.startsAt}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={worker} onChange={(e) => setWorker(e.target.value)} placeholder="Worker" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
        <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} placeholder="Starts at" />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, worker, and shiftTime into an object.
3. Append item: Use setShifts((prev) => [...prev, entry]).
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
  title: "Shift board list + publish form",
  shortName: "Shift FE",
});
