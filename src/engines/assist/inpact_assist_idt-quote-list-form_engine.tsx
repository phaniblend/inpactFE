import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-quote-list-form",
      title: "Quote list + create-estimate form",
      body: `Build a screen that lists quotes and a form to add one:

  List     →  each row is one Quote
  Empty    →  a message when the list has no items
  Form     →  Client, Total, Valid until
  Submit   →  the new row appears on the list
`,
      usecase: "Trades lose jobs between estimate and acceptance. A quote list+form is the bridge from lead to cash.",
      designMock: {"kind":"list-and-form","screenTitle":"Quotes","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No quotes yet.","rows":[{"title":"Patel Home","subtitle":"1800","meta":"2026-09-15"},{"title":"Second row","subtitle":"Another","meta":"2026-09-15"}],"fields":[{"label":"Client","sample":"Patel Home"},{"label":"Total","sample":"1800"},{"label":"Valid until","sample":"2026-09-15"}],"submitLabel":"Create quote"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Define a quote blueprint (client, project name, total estimate) and set up the outer display container.","Keep quotes in state; display each estimate row, or show \"No estimates created yet\" when empty.","Connect client and estimate inputs directly to state for real-time tracking.","Prevent form submission reload, append the new estimate to the list, and wipe the inputs clean."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

This file doesn't exist yet — you're the first to touch it. Create it at \`src/components/QuoteDesk.tsx\` before anything else. Every step from here on edits that same file.

Define a quote blueprint (client, project name, total estimate) and set up the outer display container.

WHAT YOU'LL NEED
- id (text)
- client (text)
- estimate (text)

Your task: Define the shape of an estimate and create the component shell.`,
    hint: `1. Blueprint declaration: Rename Estimate to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    example_code: `export type Estimate = {
  id: string;
  client: string;
  estimate: string;
};

export function EstimateList() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Quotes
  Client: "Patel Home"
  Total: "1800"
  Valid until: "2026-09-15"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type Quote (id + client, total, validUntil), then export function QuoteDesk() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type Quote (id + client, total, validUntil), then export function QuoteDesk() returning <div />",
    mc_anchor: "Define type Quote (id + client, total, v",
    why_this_matters: `Modeling estimate records ensures consistent summary fields across the app.`,
    answer_keywords: ["export","type","Quote","client","total","validUntil","export","function","QuoteDesk","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type Quote = {
  id: string;
  client: string;
  total: string;
  validUntil: string;
};

export function QuoteDesk() {
  return <div />;
}
`,
    analog_example: `export type Estimate = {
  id: string;
  client: string;
  estimate: string;
};

export function EstimateList() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Modeling estimate records ensures consistent summary fields across the app.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists quotes and a form to add one:

  List     →  each row is one Quote
  Empty    →  a message when the list has no items
  Form     →  Client, Total, Valid until
  Submit   →  the new row appears on the list
`,
      discover: `export type Quote = {
  id: string;
  client: string;
  total: string;
  validUntil: string;
};

export function QuoteDesk() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Blueprint declaration: Rename Estimate to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Keep quotes in state; display each estimate row, or show "No estimates created yet" when empty.

WHAT YOU'LL NEED
- State array holding estimates.
- Conditional empty check.
- Map loop rendering estimate rows.

Your task: Store estimates in state and display them, showing a placeholder if none exist.`,
    hint: `1. Set up state: Use useState<Estimate[]>([]).
2. Check for empty: Use estimates.length === 0 to render the empty message.
3. Render entries: Map through estimates, passing key={est.id}.`,
    example_code: `const [estimates, setEstimates] = useState<Estimate[]>([]);

return (
  <div>
    {estimates.length === 0 ? (
      <p>No estimates recorded</p>
    ) : (
      estimates.map((est) => (
        <div key={est.id}>
          {est.client}: \${est.estimate}
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST — Quotes
  Patel Home
  1800

EMPTY — "No quotes yet."
\`\`\`

React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user. Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
    mc_options: ["useState for the array; branch on length === 0 before mapping rows with a stable key","let quotes = [] and mutate it directly on every update","always render the mapped rows, even when the array is empty"],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `A clear empty state prevents users from wondering whether estimates failed to load.`,
    answer_keywords: ["useState","quotes","setQuotes","length","map","key"],
    seed_code: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  validUntil: string;
};

export function QuoteDesk() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  validUntil: string;
};

export function QuoteDesk() {
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

export type Quote = {
  id: string;
  client: string;
  total: string;
  validUntil: string;
};

export function QuoteDesk() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  return (
    <div>
      {quotes.length === 0 ? (
        <p>No quotes yet.</p>
      ) : (
        <ul>
          {quotes.map((a) => (
            <li key={a.id}>{a.client}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [estimates, setEstimates] = useState<Estimate[]>([]);

return (
  <div>
    {estimates.length === 0 ? (
      <p>No estimates recorded</p>
    ) : (
      estimates.map((est) => (
        <div key={est.id}>
          {est.client}: \${est.estimate}
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `A clear empty state prevents users from wondering whether estimates failed to load.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists quotes and a form to add one:

  List     →  each row is one Quote
  Empty    →  a message when the list has no items
  Form     →  Client, Total, Valid until
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  validUntil: string;
};

export function QuoteDesk() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  return (
    <div>
      {quotes.length === 0 ? (
        <p>No quotes yet.</p>
      ) : (
        <ul>
          {quotes.map((a) => (
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
      build: `1. Set up state: Use useState<Estimate[]>([]).
2. Check for empty: Use estimates.length === 0 to render the empty message.
3. Render entries: Map through estimates, passing key={est.id}.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Connect client and estimate inputs directly to state for real-time tracking.

WHAT YOU'LL NEED
- State hooks for client and estimate inputs.
- Value and onChange props wired on inputs.

Your task: Connect estimate input fields to React state.`,
    hint: `1. Initialize states: Call useState("") for client and estimate.
2. Wire inputs: Connect value and onChange to each state variable.`,
    example_code: `const [client, setClient] = useState("");
const [estimate, setEstimate] = useState("");

<input value={client} onChange={(e) => setClient(e.target.value)} />
<input value={estimate} onChange={(e) => setEstimate(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Quotes
  [ Client ]  [ Total ]  [ Valid until ]   → Create quote
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure clean data capture when creating new estimates.`,
    answer_keywords: ["useState","value=","onChange","client","total","validUntil"],
    seed_code: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  validUntil: string;
};

export function QuoteDesk() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  validUntil: string;
};

export function QuoteDesk() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
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

export type Quote = {
  id: string;
  client: string;
  total: string;
  validUntil: string;
};

export function QuoteDesk() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [validUntil, setValidUntil] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={validUntil} onChange={(e) => setValidUntil(e.target.value)} placeholder="Valid until" />
    </form>
  );
}
`,
    analog_example: `const [client, setClient] = useState("");
const [estimate, setEstimate] = useState("");

<input value={client} onChange={(e) => setClient(e.target.value)} />
<input value={estimate} onChange={(e) => setEstimate(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure clean data capture when creating new estimates.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists quotes and a form to add one:

  List     →  each row is one Quote
  Empty    →  a message when the list has no items
  Form     →  Client, Total, Valid until
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  validUntil: string;
};

export function QuoteDesk() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [validUntil, setValidUntil] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={validUntil} onChange={(e) => setValidUntil(e.target.value)} placeholder="Valid until" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize states: Call useState("") for client and estimate.
2. Wire inputs: Connect value and onChange to each state variable.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Prevent form submission reload, append the new estimate to the list, and wipe the inputs clean.

WHAT YOU'LL NEED
- Form interceptor using e.preventDefault().
- New estimate object creation.
- Spread update to state.
- Form reset calls.

Your task: Append the new estimate to state without a page refresh and reset the form.`,
    hint: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, client, and estimate into an object.
3. Append item: Use setEstimates((prev) => [...prev, entry]).
4. Clear form: Reset input states to "".`,
    example_code: `function handleCreate(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), client, estimate };
  setEstimates((prev) => [...prev, entry]);
  setClient("");
  setEstimate("");
}`,
    think_prompt: `\`\`\`text
FORM — Quotes
  [ Client ]  [ Total ]  [ Valid until ]   → Create quote
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Create quote is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `Estimates appear instantly in the list without page reloads.


================================================================================`,
    answer_keywords: ["preventDefault","setQuotes","prev","client","total","validUntil"],
    seed_code: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  validUntil: string;
};

export function QuoteDesk() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [validUntil, setValidUntil] = useState("");
  return (
    <div>
      {quotes.length === 0 ? <p>No quotes yet.</p> : <ul>{quotes.map((a) => <li key={a.id}>{a.client} · {a.total} · {a.validUntil}</li>)}</ul>}
      <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={validUntil} onChange={(e) => setValidUntil(e.target.value)} placeholder="Valid until" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  validUntil: string;
};

export function QuoteDesk() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [validUntil, setValidUntil] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {quotes.length === 0 ? <p>No quotes yet.</p> : <ul>{quotes.map((a) => <li key={a.id}>{a.client} · {a.total} · {a.validUntil}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={validUntil} onChange={(e) => setValidUntil(e.target.value)} placeholder="Valid until" />
        <button type="submit">Create quote</button>
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

export type Quote = {
  id: string;
  client: string;
  total: string;
  validUntil: string;
};

export function QuoteDesk() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [validUntil, setValidUntil] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Quote = { id: String(Date.now()), client, total, validUntil };
    setQuotes((prev) => [...prev, next]);
    setClient("");
    setTotal("");
    setValidUntil("");
  }
  return (
    <div>
      {quotes.length === 0 ? (
        <p>No quotes yet.</p>
      ) : (
        <ul>
          {quotes.map((a) => (
            <li key={a.id}>{a.client} · {a.total} · {a.validUntil}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={validUntil} onChange={(e) => setValidUntil(e.target.value)} placeholder="Valid until" />
        <button type="submit">Create quote</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function handleCreate(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), client, estimate };
  setEstimates((prev) => [...prev, entry]);
  setClient("");
  setEstimate("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Estimates appear instantly in the list without page reloads.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists quotes and a form to add one:

  List     →  each row is one Quote
  Empty    →  a message when the list has no items
  Form     →  Client, Total, Valid until
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  validUntil: string;
};

export function QuoteDesk() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [validUntil, setValidUntil] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Quote = { id: String(Date.now()), client, total, validUntil };
    setQuotes((prev) => [...prev, next]);
    setClient("");
    setTotal("");
    setValidUntil("");
  }
  return (
    <div>
      {quotes.length === 0 ? (
        <p>No quotes yet.</p>
      ) : (
        <ul>
          {quotes.map((a) => (
            <li key={a.id}>{a.client} · {a.total} · {a.validUntil}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={validUntil} onChange={(e) => setValidUntil(e.target.value)} placeholder="Valid until" />
        <button type="submit">Create quote</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, client, and estimate into an object.
3. Append item: Use setEstimates((prev) => [...prev, entry]).
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
  title: "Quote list + create-estimate form",
  shortName: "Quote FE",
});
