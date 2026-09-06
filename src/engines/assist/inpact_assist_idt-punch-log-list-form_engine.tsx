import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-punch-log-list-form",
      title: "Punch log list + redeem form",
      body: `Build a screen that lists punches and a form to add one:

  List     →  each row is one Punch
  Empty    →  a message when the list has no items
  Form     →  Package id, Note, At
  Submit   →  the new row appears on the list
`,
      usecase: "Each visit is a punch row — same list+form skill as every other desk.",
      designMock: {"kind":"list-and-form","screenTitle":"Punches","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No punches yet.","rows":[{"title":"p-1","subtitle":"Visit 3","meta":"Sat 11:00"},{"title":"Second row","subtitle":"Another","meta":"Sat 11:00"}],"fields":[{"label":"Package id","sample":"p-1"},{"label":"Note","sample":"Visit 3"},{"label":"At","sample":"Sat 11:00"}],"submitLabel":"Redeem"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Model a punch redemption entry (package ID, date, attendant) and set up the log layout.","Maintain punch redemptions in state; show each logged punch, or an \"Empty log — no punches redeemed\" note.","Connect redemption input boxes to state so session selections are tracked cleanly.","Prevent default form reload, append the redemption event to the log, and reset the form fields."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

This file doesn't exist yet — you're the first to touch it. Create it at \`src/components/PunchDesk.tsx\` before anything else. Every step from here on edits that same file.

Model a punch redemption entry (package ID, date, attendant) and set up the log layout.

WHAT YOU'LL NEED
- id (text)
- packageId (text)
- timestamp (text)

Your task: Define the shape of a punch redemption log and create the component shell.`,
    hint: `1. Blueprint declaration: Rename Redemption to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    example_code: `export type Redemption = {
  id: string;
  packageId: string;
  timestamp: string;
};

export function PunchLog() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Punches
  Package id: "p-1"
  Note: "Visit 3"
  At: "Sat 11:00"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type Punch (id + packageId, note, at), then export function PunchDesk() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type Punch (id + packageId, note, at), then export function PunchDesk() returning <div />",
    mc_anchor: "Define type Punch (id + packageId, note,",
    why_this_matters: `Defining the redemption shape ensures all punch logs share a consistent data structure.`,
    answer_keywords: ["export","type","Punch","packageId","note","at","export","function","PunchDesk","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type Punch = {
  id: string;
  packageId: string;
  note: string;
  at: string;
};

export function PunchDesk() {
  return <div />;
}
`,
    analog_example: `export type Redemption = {
  id: string;
  packageId: string;
  timestamp: string;
};

export function PunchLog() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Defining the redemption shape ensures all punch logs share a consistent data structure.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists punches and a form to add one:

  List     →  each row is one Punch
  Empty    →  a message when the list has no items
  Form     →  Package id, Note, At
  Submit   →  the new row appears on the list
`,
      discover: `export type Punch = {
  id: string;
  packageId: string;
  note: string;
  at: string;
};

export function PunchDesk() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Blueprint declaration: Rename Redemption to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Maintain punch redemptions in state; show each logged punch, or an "Empty log — no punches redeemed" note.

WHAT YOU'LL NEED
- State array holding redemptions.
- Conditional empty check.
- Map loop rendering redemption rows.

Your task: Store redemptions in state and display them, showing a placeholder if the log is empty.`,
    hint: `1. Set up state: Use useState<Redemption[]>([]).
2. Check for empty: Use punches.length === 0 to render the empty message.
3. Render entries: Map through punches, passing key={p.id}.`,
    example_code: `const [punches, setPunches] = useState<Redemption[]>([]);

return (
  <div>
    {punches.length === 0 ? (
      <p>No punches redeemed</p>
    ) : (
      punches.map((p) => (
        <div key={p.id}>
          Redeemed for {p.packageId} at {p.timestamp}
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST — Punches
  p-1
  Visit 3

EMPTY — "No punches yet."
\`\`\`

React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user. Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
    mc_options: ["useState for the array; branch on length === 0 before mapping rows with a stable key","let punches = [] and mutate it directly on every update","always render the mapped rows, even when the array is empty"],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `A clear empty state prevents users from wondering whether redemptions failed to load.`,
    answer_keywords: ["useState","punches","setPunches","length","map","key"],
    seed_code: `import { useState } from "react";

export type Punch = {
  id: string;
  packageId: string;
  note: string;
  at: string;
};

export function PunchDesk() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type Punch = {
  id: string;
  packageId: string;
  note: string;
  at: string;
};

export function PunchDesk() {
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

export type Punch = {
  id: string;
  packageId: string;
  note: string;
  at: string;
};

export function PunchDesk() {
  const [punches, setPunches] = useState<Punch[]>([]);
  return (
    <div>
      {punches.length === 0 ? (
        <p>No punches yet.</p>
      ) : (
        <ul>
          {punches.map((a) => (
            <li key={a.id}>{a.packageId}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [punches, setPunches] = useState<Redemption[]>([]);

return (
  <div>
    {punches.length === 0 ? (
      <p>No punches redeemed</p>
    ) : (
      punches.map((p) => (
        <div key={p.id}>
          Redeemed for {p.packageId} at {p.timestamp}
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `A clear empty state prevents users from wondering whether redemptions failed to load.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists punches and a form to add one:

  List     →  each row is one Punch
  Empty    →  a message when the list has no items
  Form     →  Package id, Note, At
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Punch = {
  id: string;
  packageId: string;
  note: string;
  at: string;
};

export function PunchDesk() {
  const [punches, setPunches] = useState<Punch[]>([]);
  return (
    <div>
      {punches.length === 0 ? (
        <p>No punches yet.</p>
      ) : (
        <ul>
          {punches.map((a) => (
            <li key={a.id}>{a.packageId}</li>
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
      build: `1. Set up state: Use useState<Redemption[]>([]).
2. Check for empty: Use punches.length === 0 to render the empty message.
3. Render entries: Map through punches, passing key={p.id}.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Connect redemption input boxes to state so session selections are tracked cleanly.

WHAT YOU'LL NEED
- State hook for package ID.
- Value and onChange props wired on inputs.

Your task: Connect punch redemption input fields to React state.`,
    hint: `1. Initialize states: Call useState("") for packageId.
2. Wire inputs: Connect value and onChange to the state variable.`,
    example_code: `const [packageId, setPackageId] = useState("");

<input value={packageId} onChange={(e) => setPackageId(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Punches
  [ Package id ]  [ Note ]  [ At ]   → Redeem
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure clean data capture when redeeming punches.`,
    answer_keywords: ["useState","value=","onChange","packageId","note","at"],
    seed_code: `import { useState } from "react";

export type Punch = {
  id: string;
  packageId: string;
  note: string;
  at: string;
};

export function PunchDesk() {
  const [punches, setPunches] = useState<Punch[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type Punch = {
  id: string;
  packageId: string;
  note: string;
  at: string;
};

export function PunchDesk() {
  const [punches, setPunches] = useState<Punch[]>([]);
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

export type Punch = {
  id: string;
  packageId: string;
  note: string;
  at: string;
};

export function PunchDesk() {
  const [punches, setPunches] = useState<Punch[]>([]);
  const [packageId, setPackageId] = useState("");
  const [note, setNote] = useState("");
  const [at, setAt] = useState("");
  return (
    <form>
        <input value={packageId} onChange={(e) => setPackageId(e.target.value)} placeholder="Package id" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
        <input value={at} onChange={(e) => setAt(e.target.value)} placeholder="At" />
    </form>
  );
}
`,
    analog_example: `const [packageId, setPackageId] = useState("");

<input value={packageId} onChange={(e) => setPackageId(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure clean data capture when redeeming punches.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists punches and a form to add one:

  List     →  each row is one Punch
  Empty    →  a message when the list has no items
  Form     →  Package id, Note, At
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Punch = {
  id: string;
  packageId: string;
  note: string;
  at: string;
};

export function PunchDesk() {
  const [punches, setPunches] = useState<Punch[]>([]);
  const [packageId, setPackageId] = useState("");
  const [note, setNote] = useState("");
  const [at, setAt] = useState("");
  return (
    <form>
        <input value={packageId} onChange={(e) => setPackageId(e.target.value)} placeholder="Package id" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
        <input value={at} onChange={(e) => setAt(e.target.value)} placeholder="At" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize states: Call useState("") for packageId.
2. Wire inputs: Connect value and onChange to the state variable.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Prevent default form reload, append the redemption event to the log, and reset the form fields.

WHAT YOU'LL NEED
- Form interceptor using e.preventDefault().
- New redemption object creation.
- Spread update to state.
- Form reset calls.

Your task: Append the new redemption to state without a page refresh and reset the form.`,
    hint: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, packageId, and timestamp into an object.
3. Append item: Use setPunches((prev) => [...prev, entry]).
4. Clear form: Reset input states to "".`,
    example_code: `function handleRedeem(e: React.FormEvent) {
  e.preventDefault();
  const entry = {
    id: String(Date.now()),
    packageId,
    timestamp: new Date().toLocaleTimeString(),
  };
  setPunches((prev) => [...prev, entry]);
  setPackageId("");
}`,
    think_prompt: `\`\`\`text
FORM — Punches
  [ Package id ]  [ Note ]  [ At ]   → Redeem
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Redeem is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `Redemptions appear instantly in the log without page reloads.


================================================================================`,
    answer_keywords: ["preventDefault","setPunches","prev","packageId","note","at"],
    seed_code: `import { useState } from "react";

export type Punch = {
  id: string;
  packageId: string;
  note: string;
  at: string;
};

export function PunchDesk() {
  const [punches, setPunches] = useState<Punch[]>([]);
  const [packageId, setPackageId] = useState("");
  const [note, setNote] = useState("");
  const [at, setAt] = useState("");
  return (
    <div>
      {punches.length === 0 ? <p>No punches yet.</p> : <ul>{punches.map((a) => <li key={a.id}>{a.packageId} · {a.note} · {a.at}</li>)}</ul>}
      <form>
        <input value={packageId} onChange={(e) => setPackageId(e.target.value)} placeholder="Package id" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
        <input value={at} onChange={(e) => setAt(e.target.value)} placeholder="At" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type Punch = {
  id: string;
  packageId: string;
  note: string;
  at: string;
};

export function PunchDesk() {
  const [punches, setPunches] = useState<Punch[]>([]);
  const [packageId, setPackageId] = useState("");
  const [note, setNote] = useState("");
  const [at, setAt] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {punches.length === 0 ? <p>No punches yet.</p> : <ul>{punches.map((a) => <li key={a.id}>{a.packageId} · {a.note} · {a.at}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={packageId} onChange={(e) => setPackageId(e.target.value)} placeholder="Package id" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
        <input value={at} onChange={(e) => setAt(e.target.value)} placeholder="At" />
        <button type="submit">Redeem</button>
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

export type Punch = {
  id: string;
  packageId: string;
  note: string;
  at: string;
};

export function PunchDesk() {
  const [punches, setPunches] = useState<Punch[]>([]);
  const [packageId, setPackageId] = useState("");
  const [note, setNote] = useState("");
  const [at, setAt] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Punch = { id: String(Date.now()), packageId, note, at };
    setPunches((prev) => [...prev, next]);
    setPackageId("");
    setNote("");
    setAt("");
  }
  return (
    <div>
      {punches.length === 0 ? (
        <p>No punches yet.</p>
      ) : (
        <ul>
          {punches.map((a) => (
            <li key={a.id}>{a.packageId} · {a.note} · {a.at}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={packageId} onChange={(e) => setPackageId(e.target.value)} placeholder="Package id" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
        <input value={at} onChange={(e) => setAt(e.target.value)} placeholder="At" />
        <button type="submit">Redeem</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function handleRedeem(e: React.FormEvent) {
  e.preventDefault();
  const entry = {
    id: String(Date.now()),
    packageId,
    timestamp: new Date().toLocaleTimeString(),
  };
  setPunches((prev) => [...prev, entry]);
  setPackageId("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Redemptions appear instantly in the log without page reloads.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists punches and a form to add one:

  List     →  each row is one Punch
  Empty    →  a message when the list has no items
  Form     →  Package id, Note, At
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Punch = {
  id: string;
  packageId: string;
  note: string;
  at: string;
};

export function PunchDesk() {
  const [punches, setPunches] = useState<Punch[]>([]);
  const [packageId, setPackageId] = useState("");
  const [note, setNote] = useState("");
  const [at, setAt] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Punch = { id: String(Date.now()), packageId, note, at };
    setPunches((prev) => [...prev, next]);
    setPackageId("");
    setNote("");
    setAt("");
  }
  return (
    <div>
      {punches.length === 0 ? (
        <p>No punches yet.</p>
      ) : (
        <ul>
          {punches.map((a) => (
            <li key={a.id}>{a.packageId} · {a.note} · {a.at}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={packageId} onChange={(e) => setPackageId(e.target.value)} placeholder="Package id" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
        <input value={at} onChange={(e) => setAt(e.target.value)} placeholder="At" />
        <button type="submit">Redeem</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, packageId, and timestamp into an object.
3. Append item: Use setPunches((prev) => [...prev, entry]).
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
  title: "Punch log list + redeem form",
  shortName: "Punch FE",
});
