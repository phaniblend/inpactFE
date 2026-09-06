import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-open-shift-board",
      title: "Open-shift board: filter unfilled coverage",
      body: `Build a screen that lists requests and a form to add one:

  List     →  each row is one CoverageRequest
  Empty    →  a message when the list has no items
  Form     →  Shift id, Reason, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      usecase: "Managers filter to open coverage only. Same filter-before-map skill as other desks.",
      designMock: {"kind":"list-and-form","screenTitle":"Open shifts","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No open coverage.","rows":[{"title":"s-3","subtitle":"Sick","meta":"open"},{"title":"Second row","subtitle":"Another","meta":"open"}],"fields":[{"label":"Shift id","sample":"s-3"},{"label":"Reason","sample":"Sick"},{"label":"Status","sample":"open"}],"submitLabel":"Request"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Create a shift blueprint with staffing status and assemble the board frame.","Filter shifts to isolate unfilled openings, displaying a \"Schedule fully covered\" notice if all slots are staffed.","Link shift date and role fields to state so live typing is tracked without loss.","Intercept submission, save the open shift to memory, reset the form, and let the unfilled filter render it."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Create a shift blueprint with staffing status and assemble the board frame.

WHAT YOU'LL NEED
- id (text)
- role (text)
- status (text)

Your task: Define the shape of a coverage request with its status tag, and build the board shell.`,
    hint: `1. Blueprint declaration: Rename ShiftItem to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    example_code: `export type ShiftItem = {
  id: string;
  role: string;
  status: string;
};

export function OpenShiftBoard() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Open shifts
  Shift id: "s-3"
  Reason: "Sick"
  Status: "open"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type CoverageRequest (id + shiftId, reason, status), then export function OpenShiftBoard() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type CoverageRequest (id + shiftId, reason, status), then export function OpenShiftBoard() returning <div />",
    mc_anchor: "Define type CoverageRequest (id + shiftI",
    why_this_matters: `Defining the status field in the blueprint ensures clean filtering in later steps.`,
    answer_keywords: ["export","type","CoverageRequest","shiftId","reason","status","export","function","OpenShiftBoard","return"],
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
  status: string;
};

export function OpenShiftBoard() {
  return <div />;
}
`,
    analog_example: `export type ShiftItem = {
  id: string;
  role: string;
  status: string;
};

export function OpenShiftBoard() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Defining the status field in the blueprint ensures clean filtering in later steps.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists requests and a form to add one:

  List     →  each row is one CoverageRequest
  Empty    →  a message when the list has no items
  Form     →  Shift id, Reason, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  status: string;
};

export function OpenShiftBoard() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Blueprint declaration: Rename ShiftItem to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Filter shifts to isolate unfilled openings, displaying a "Schedule fully covered" notice if all slots are staffed.

WHAT YOU'LL NEED
- State array holding all shifts.
- .filter() call selecting shifts where status === 'unfilled'.
- Conditional empty check.

Your task: Filter shifts to show only unfilled openings, displaying a message if all shifts are covered.`,
    hint: `1. Master list: Keep all records in allShifts state.
2. Filter logic: Create openShifts using .filter(s => s.status === "unfilled").
3. Conditional render: Check openShifts.length === 0 to render the fallback message or the list rows.`,
    example_code: `const [allShifts, setAllShifts] = useState<ShiftItem[]>([]);

const openShifts = allShifts.filter((shift) => shift.status === "unfilled");

return (
  <div>
    {openShifts.length === 0 ? (
      <p>All shifts are covered</p>
    ) : (
      openShifts.map((shift) => (
        <div key={shift.id}>
          {shift.role} - Open
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST (filtered) — Open shifts
  s-3
  Sick   (only rows where status is "open")

EMPTY — "No open coverage."
\`\`\`

Filtering for display means computing a smaller array from the full one with .filter() before mapping — the state array itself never loses any rows, and a zero-length filtered result is still an empty case worth its own message. How do you keep the complete requests list in state, render only the subset above, and still show a clear message when that subset is empty?`,
    mc_options: ["keep the full list in state; filter before map; branch on the filtered length for the empty message","delete non-matching rows from state permanently","hide the whole list whenever any filter is active"],
    mc_correct_option: "keep the full list in state; filter before map; branch on the filtered length for the empty message",
    mc_anchor: "keep the full list in state; filter befo",
    why_this_matters: `Filtering isolates open shifts without mutating the master schedule.`,
    answer_keywords: ["useState","requests","filter","map","length"],
    seed_code: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  status: string;
};

export function OpenShiftBoard() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  status: string;
};

export function OpenShiftBoard() {
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

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  status: string;
};

export function OpenShiftBoard() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const visible = requests.filter((a) => a.status === "open");
  return (
    <div>
      {visible.length === 0 ? (
        <p>No open coverage.</p>
      ) : (
        <ul>
          {visible.map((a) => (
            <li key={a.id}>{a.shiftId}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [allShifts, setAllShifts] = useState<ShiftItem[]>([]);

const openShifts = allShifts.filter((shift) => shift.status === "unfilled");

return (
  <div>
    {openShifts.length === 0 ? (
      <p>All shifts are covered</p>
    ) : (
      openShifts.map((shift) => (
        <div key={shift.id}>
          {shift.role} - Open
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Filtering isolates open shifts without mutating the master schedule.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists requests and a form to add one:

  List     →  each row is one CoverageRequest
  Empty    →  a message when the list has no items
  Form     →  Shift id, Reason, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  status: string;
};

export function OpenShiftBoard() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const visible = requests.filter((a) => a.status === "open");
  return (
    <div>
      {visible.length === 0 ? (
        <p>No open coverage.</p>
      ) : (
        <ul>
          {visible.map((a) => (
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
      build: `1. Master list: Keep all records in allShifts state.
2. Filter logic: Create openShifts using .filter(s => s.status === "unfilled").
3. Conditional render: Check openShifts.length === 0 to render the fallback message or the list rows.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Link shift date and role fields to state so live typing is tracked without loss.

WHAT YOU'LL NEED
- State hooks for role and status inputs.
- Value and onChange props wired on inputs.

Your task: Connect shift creation input fields to React state.`,
    hint: `1. Initialize states: Call useState("") for your form inputs.
2. Wire inputs: Connect value and onChange to each state variable.`,
    example_code: `const [role, setRole] = useState("");
const [status, setStatus] = useState("unfilled");

<input value={role} onChange={(e) => setRole(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Open shifts
  [ Shift id ]  [ Reason ]  [ Status ]   → Request
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure clean data capture when recording new shifts.`,
    answer_keywords: ["useState","value=","onChange","shiftId","reason","status"],
    seed_code: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  status: string;
};

export function OpenShiftBoard() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  status: string;
};

export function OpenShiftBoard() {
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
  status: string;
};

export function OpenShiftBoard() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const [shiftId, setShiftId] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  return (
    <form>
        <input value={shiftId} onChange={(e) => setShiftId(e.target.value)} placeholder="Shift id" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
    </form>
  );
}
`,
    analog_example: `const [role, setRole] = useState("");
const [status, setStatus] = useState("unfilled");

<input value={role} onChange={(e) => setRole(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure clean data capture when recording new shifts.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists requests and a form to add one:

  List     →  each row is one CoverageRequest
  Empty    →  a message when the list has no items
  Form     →  Shift id, Reason, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  status: string;
};

export function OpenShiftBoard() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const [shiftId, setShiftId] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  return (
    <form>
        <input value={shiftId} onChange={(e) => setShiftId(e.target.value)} placeholder="Shift id" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
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
    paal: `Intercept submission, save the open shift to memory, reset the form, and let the unfilled filter render it.

WHAT YOU'LL NEED
- Form interceptor using e.preventDefault().
- Object assembly matching blueprint.
- Spread update to state.
- Form reset calls.

Your task: Append the new shift to state without reloading the page and reset the inputs.`,
    hint: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, role, and status into an object.
3. Append item: Use setAllShifts((prev) => [...prev, entry]).
4. Clear form: Reset input states to "".`,
    example_code: `function handleAdd(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), role, status };
  setAllShifts((prev) => [...prev, entry]);
  setRole("");
}`,
    think_prompt: `\`\`\`text
FORM — Open shifts
  [ Shift id ]  [ Reason ]  [ Status ]   → Request
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Request is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `The new shift is added to the master list, and your filter automatically displays it if it is marked unfilled.


================================================================================`,
    answer_keywords: ["preventDefault","setRequests","prev","shiftId","reason","status"],
    seed_code: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  status: string;
};

export function OpenShiftBoard() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const [shiftId, setShiftId] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  return (
    <div>
      {requests.length === 0 ? <p>No open coverage.</p> : <ul>{requests.map((a) => <li key={a.id}>{a.shiftId} · {a.reason} · {a.status}</li>)}</ul>}
      <form>
        <input value={shiftId} onChange={(e) => setShiftId(e.target.value)} placeholder="Shift id" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
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
  status: string;
};

export function OpenShiftBoard() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const [shiftId, setShiftId] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {requests.length === 0 ? <p>No open coverage.</p> : <ul>{requests.map((a) => <li key={a.id}>{a.shiftId} · {a.reason} · {a.status}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={shiftId} onChange={(e) => setShiftId(e.target.value)} placeholder="Shift id" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Request</button>
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
  status: string;
};

export function OpenShiftBoard() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const [shiftId, setShiftId] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: CoverageRequest = { id: String(Date.now()), shiftId, reason, status };
    setRequests((prev) => [...prev, next]);
    setShiftId("");
    setReason("");
    setStatus("");
  }
  return (
    <div>
      {requests.length === 0 ? (
        <p>No open coverage.</p>
      ) : (
        <ul>
          {requests.map((a) => (
            <li key={a.id}>{a.shiftId} · {a.reason} · {a.status}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={shiftId} onChange={(e) => setShiftId(e.target.value)} placeholder="Shift id" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Request</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function handleAdd(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), role, status };
  setAllShifts((prev) => [...prev, entry]);
  setRole("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The new shift is added to the master list, and your filter automatically displays it if it is marked unfilled.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists requests and a form to add one:

  List     →  each row is one CoverageRequest
  Empty    →  a message when the list has no items
  Form     →  Shift id, Reason, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type CoverageRequest = {
  id: string;
  shiftId: string;
  reason: string;
  status: string;
};

export function OpenShiftBoard() {
  const [requests, setRequests] = useState<CoverageRequest[]>([]);
  const [shiftId, setShiftId] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: CoverageRequest = { id: String(Date.now()), shiftId, reason, status };
    setRequests((prev) => [...prev, next]);
    setShiftId("");
    setReason("");
    setStatus("");
  }
  return (
    <div>
      {requests.length === 0 ? (
        <p>No open coverage.</p>
      ) : (
        <ul>
          {requests.map((a) => (
            <li key={a.id}>{a.shiftId} · {a.reason} · {a.status}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={shiftId} onChange={(e) => setShiftId(e.target.value)} placeholder="Shift id" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Request</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, role, and status into an object.
3. Append item: Use setAllShifts((prev) => [...prev, entry]).
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
  title: "Open-shift board: filter unfilled coverage",
  shortName: "Open board",
});
