import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-coverage-list-form",
      title: "Open coverage list + request form",
      body: `Build a screen that lists requests and a form to add one:

  List     →  each row is one CoverageRequest
  Empty    →  a message when the list has no items
  Form     →  Shift id, Reason, Needed by
  Submit   →  the new row appears on the list
`,
      usecase: "Last-minute coverage is another list+form — request goes up, teammates claim later.",
      designMock: {"kind":"list-and-form","screenTitle":"Coverage","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No open coverage requests.","rows":[{"title":"s-3","subtitle":"Sick","meta":"Fri noon"},{"title":"Second row","subtitle":"Another","meta":"Fri noon"}],"fields":[{"label":"Shift id","sample":"s-3"},{"label":"Reason","sample":"Sick"},{"label":"Needed by","sample":"Fri noon"}],"submitLabel":"Request cover"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Create an item blueprint for shift requests and assemble the display container.","Keep shift requests in memory; render each open slot as a row, or show \"All shifts fully staffed\" if empty.","Connect input boxes to state so requested roles and shift hours are tracked character-by-character.","Prevent form submission refresh, append the shift request to the list, and empty the inputs."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

This file doesn't exist yet — you're the first to touch it. Create it at \`src/components/CoverageDesk.tsx\` before anything else. Every step from here on edits that same file.

Create an item blueprint for shift requests and assemble the display container.

WHAT YOU'LL NEED
- id (text)
- shift (text)
- role (text)

Your task: Define the shape of a coverage request and create the outer component.`,
    hint: `1. Type declaration: Replace CoverageSlot with your type name.
2. Add fields: Define shift and role as string fields.
3. Component shell: Declare your component returning an empty <div />.`,
    example_code: `export type CoverageSlot = {
  id: string;
  shift: string;
  role: string;
};

export function CoverageManager() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Coverage
  Shift id: "s-3"
  Reason: "Sick"
  Needed by: "Fri noon"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type CoverageRequest (id + shiftId, reason, neededBy), then export function CoverageDesk() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type CoverageRequest (id + shiftId, reason, neededBy), then export function CoverageDesk() returning <div />",
    mc_anchor: "Define type CoverageRequest (id + shiftI",
    why_this_matters: `A defined shape guarantees your list component knows exactly what information every shift card will display.`,
    answer_keywords: ["export","type","CoverageRequest","shiftId","reason","neededBy","export","function","CoverageDesk","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  neededBy: string;
};

export function CoverageDesk() {
  return <div />;
}
`,
    analog_example: `export type CoverageSlot = {
  id: string;
  shift: string;
  role: string;
};

export function CoverageManager() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `A defined shape guarantees your list component knows exactly what information every shift card will display.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists requests and a form to add one:

  List     →  each row is one CoverageRequest
  Empty    →  a message when the list has no items
  Form     →  Shift id, Reason, Needed by
  Submit   →  the new row appears on the list
`,
      discover: `export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  neededBy: string;
};

export function CoverageDesk() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Type declaration: Replace CoverageSlot with your type name.
2. Add fields: Define shift and role as string fields.
3. Component shell: Declare your component returning an empty <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Keep shift requests in memory; render each open slot as a row, or show "All shifts fully staffed" if empty.

WHAT YOU'LL NEED
- State array holding coverage items.
- Conditional check for empty list.
- Map loop rendering shift details.

Your task: Store coverage requests in state and display them, showing an empty state note if none exist.`,
    hint: `1. State hook: Declare useState<CoverageSlot[]>([]).
2. Check length: Render a fallback message if slots.length === 0.
3. Render rows: Loop over slots with .map(), displaying shift info with a key attribute.`,
    example_code: `const [slots, setSlots] = useState<CoverageSlot[]>([]);

return (
  <div>
    {slots.length === 0 ? (
      <p>No open coverage requests</p>
    ) : (
      slots.map((s) => (
        <div key={s.id}>
          {s.shift} - {s.role}
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST — Coverage
  s-3
  Sick

EMPTY — "No open coverage requests."
\`\`\`

React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user. Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
    mc_options: ["useState for the array; branch on length === 0 before mapping rows with a stable key","let requests = [] and mutate it directly on every update","always render the mapped rows, even when the array is empty"],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `Users can immediately see whether all shifts are staffed or if openings remain.`,
    answer_keywords: ["useState","requests","setRequests","length","map","key"],
    seed_code: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  neededBy: string;
};

export function CoverageDesk() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  neededBy: string;
};

export function CoverageDesk() {
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

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  neededBy: string;
};

export function CoverageDesk() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  return (
    <div>
      {requests.length === 0 ? (
        <p>No open coverage requests.</p>
      ) : (
        <ul>
          {requests.map((a) => (
            <li key={a.id}>{a.shiftId}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [slots, setSlots] = useState<CoverageSlot[]>([]);

return (
  <div>
    {slots.length === 0 ? (
      <p>No open coverage requests</p>
    ) : (
      slots.map((s) => (
        <div key={s.id}>
          {s.shift} - {s.role}
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Users can immediately see whether all shifts are staffed or if openings remain.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists requests and a form to add one:

  List     →  each row is one CoverageRequest
  Empty    →  a message when the list has no items
  Form     →  Shift id, Reason, Needed by
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  neededBy: string;
};

export function CoverageDesk() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  return (
    <div>
      {requests.length === 0 ? (
        <p>No open coverage requests.</p>
      ) : (
        <ul>
          {requests.map((a) => (
            <li key={a.id}>{a.shiftId}</li>
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
      build: `1. State hook: Declare useState<CoverageSlot[]>([]).
2. Check length: Render a fallback message if slots.length === 0.
3. Render rows: Loop over slots with .map(), displaying shift info with a key attribute.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Connect input boxes to state so requested roles and shift hours are tracked character-by-character.

WHAT YOU'LL NEED
- State variables for shift and role inputs.
- Value and onChange props wired on each field.

Your task: Bind shift time and role input fields to React state.`,
    hint: `1. Declare states: Call useState("") for shift and role.
2. Connect inputs: Set value={shift} and value={role}.
3. Update on keystroke: Set onChange handlers to update state with e.target.value.`,
    example_code: `const [shift, setShift] = useState("");
const [role, setRole] = useState("");

<input value={shift} onChange={(e) => setShift(e.target.value)} />
<input value={role} onChange={(e) => setRole(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Coverage
  [ Shift id ]  [ Reason ]  [ Needed by ]   → Request cover
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `React tracks every change live, making form submission straightforward and bug-free.`,
    answer_keywords: ["useState","value=","onChange","shiftId","reason","neededBy"],
    seed_code: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  neededBy: string;
};

export function CoverageDesk() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  neededBy: string;
};

export function CoverageDesk() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
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

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  neededBy: string;
};

export function CoverageDesk() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const [shiftId, setShiftId] = useState("");
  const [reason, setReason] = useState("");
  const [neededBy, setNeededBy] = useState("");
  return (
    <form>
        <input value={shiftId} onChange={(e) => setShiftId(e.target.value)} placeholder="Shift id" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
        <input value={neededBy} onChange={(e) => setNeededBy(e.target.value)} placeholder="Needed by" />
    </form>
  );
}
`,
    analog_example: `const [shift, setShift] = useState("");
const [role, setRole] = useState("");

<input value={shift} onChange={(e) => setShift(e.target.value)} />
<input value={role} onChange={(e) => setRole(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `React tracks every change live, making form submission straightforward and bug-free.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists requests and a form to add one:

  List     →  each row is one CoverageRequest
  Empty    →  a message when the list has no items
  Form     →  Shift id, Reason, Needed by
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  neededBy: string;
};

export function CoverageDesk() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const [shiftId, setShiftId] = useState("");
  const [reason, setReason] = useState("");
  const [neededBy, setNeededBy] = useState("");
  return (
    <form>
        <input value={shiftId} onChange={(e) => setShiftId(e.target.value)} placeholder="Shift id" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
        <input value={neededBy} onChange={(e) => setNeededBy(e.target.value)} placeholder="Needed by" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Declare states: Call useState("") for shift and role.
2. Connect inputs: Set value={shift} and value={role}.
3. Update on keystroke: Set onChange handlers to update state with e.target.value.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Prevent form submission refresh, append the shift request to the list, and empty the inputs.

WHAT YOU'LL NEED
- e.preventDefault() call.
- New object creation with unique ID.
- Spread update to state.
- State setters called with empty strings.

Your task: Add the new coverage request to your list without refreshing the page and reset the inputs.`,
    hint: `1. Intercept submit: Place e.preventDefault() at the start.
2. Build item: Package id, shift, and role into an object.
3. Append: Update state using setSlots((prev) => [...prev, entry]).
4. Clear inputs: Reset both input states to "".`,
    example_code: `function submitSlot(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), shift, role };
  setSlots((prev) => [...prev, entry]);
  setShift("");
  setRole("");
}`,
    think_prompt: `\`\`\`text
FORM — Coverage
  [ Shift id ]  [ Reason ]  [ Needed by ]   → Request cover
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Request cover is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `The schedule updates immediately on screen without jarring browser reloads.


================================================================================`,
    answer_keywords: ["preventDefault","setRequests","prev","shiftId","reason","neededBy"],
    seed_code: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  neededBy: string;
};

export function CoverageDesk() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const [shiftId, setShiftId] = useState("");
  const [reason, setReason] = useState("");
  const [neededBy, setNeededBy] = useState("");
  return (
    <div>
      {requests.length === 0 ? <p>No open coverage requests.</p> : <ul>{requests.map((a) => <li key={a.id}>{a.shiftId} · {a.reason} · {a.neededBy}</li>)}</ul>}
      <form>
        <input value={shiftId} onChange={(e) => setShiftId(e.target.value)} placeholder="Shift id" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
        <input value={neededBy} onChange={(e) => setNeededBy(e.target.value)} placeholder="Needed by" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  neededBy: string;
};

export function CoverageDesk() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const [shiftId, setShiftId] = useState("");
  const [reason, setReason] = useState("");
  const [neededBy, setNeededBy] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {requests.length === 0 ? <p>No open coverage requests.</p> : <ul>{requests.map((a) => <li key={a.id}>{a.shiftId} · {a.reason} · {a.neededBy}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={shiftId} onChange={(e) => setShiftId(e.target.value)} placeholder="Shift id" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
        <input value={neededBy} onChange={(e) => setNeededBy(e.target.value)} placeholder="Needed by" />
        <button type="submit">Request cover</button>
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

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  neededBy: string;
};

export function CoverageDesk() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const [shiftId, setShiftId] = useState("");
  const [reason, setReason] = useState("");
  const [neededBy, setNeededBy] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: CoverageRequest = { id: String(Date.now()), shiftId, reason, neededBy };
    setRequests((prev) => [...prev, next]);
    setShiftId("");
    setReason("");
    setNeededBy("");
  }
  return (
    <div>
      {requests.length === 0 ? (
        <p>No open coverage requests.</p>
      ) : (
        <ul>
          {requests.map((a) => (
            <li key={a.id}>{a.shiftId} · {a.reason} · {a.neededBy}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={shiftId} onChange={(e) => setShiftId(e.target.value)} placeholder="Shift id" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
        <input value={neededBy} onChange={(e) => setNeededBy(e.target.value)} placeholder="Needed by" />
        <button type="submit">Request cover</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function submitSlot(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), shift, role };
  setSlots((prev) => [...prev, entry]);
  setShift("");
  setRole("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The schedule updates immediately on screen without jarring browser reloads.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists requests and a form to add one:

  List     →  each row is one CoverageRequest
  Empty    →  a message when the list has no items
  Form     →  Shift id, Reason, Needed by
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  neededBy: string;
};

export function CoverageDesk() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const [shiftId, setShiftId] = useState("");
  const [reason, setReason] = useState("");
  const [neededBy, setNeededBy] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: CoverageRequest = { id: String(Date.now()), shiftId, reason, neededBy };
    setRequests((prev) => [...prev, next]);
    setShiftId("");
    setReason("");
    setNeededBy("");
  }
  return (
    <div>
      {requests.length === 0 ? (
        <p>No open coverage requests.</p>
      ) : (
        <ul>
          {requests.map((a) => (
            <li key={a.id}>{a.shiftId} · {a.reason} · {a.neededBy}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={shiftId} onChange={(e) => setShiftId(e.target.value)} placeholder="Shift id" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
        <input value={neededBy} onChange={(e) => setNeededBy(e.target.value)} placeholder="Needed by" />
        <button type="submit">Request cover</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Intercept submit: Place e.preventDefault() at the start.
2. Build item: Package id, shift, and role into an object.
3. Append: Update state using setSlots((prev) => [...prev, entry]).
4. Clear inputs: Reset both input states to "".`,
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
  title: "Open coverage list + request form",
  shortName: "Coverage FE",
});
