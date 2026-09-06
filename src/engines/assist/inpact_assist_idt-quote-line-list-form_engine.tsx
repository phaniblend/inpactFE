import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-quote-line-list-form",
      title: "Quote line-items list + add-line form",
      body: `Build a screen that lists lines and a form to add one:

  List     →  each row is one QuoteLine
  Empty    →  a message when the list has no items
  Form     →  Quote id, Label, Amount
  Submit   →  the new row appears on the list
`,
      usecase: "Estimates are built from lines. Same list+form skill — different nouns.",
      designMock: {"kind":"list-and-form","screenTitle":"Quote lines","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No line items yet.","rows":[{"title":"q-1","subtitle":"Labor","meta":"900"},{"title":"Second row","subtitle":"Another","meta":"900"}],"fields":[{"label":"Quote id","sample":"q-1"},{"label":"Label","sample":"Labor"},{"label":"Amount","sample":"900"}],"submitLabel":"Add line"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Create a blueprint for an individual line item (description, quantity, price) and build the table frame.","Store line items in state; render an itemized row for each entry, or a \"No items added to estimate\" message.","Connect item description and price inputs to state to capture values as the user types.","Intercept submit, add the new item line to the running quote, and clear the inputs."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Create a blueprint for an individual line item (description, quantity, price) and build the table frame.

WHAT YOU'LL NEED
- id (text)
- label (text)
- price (number or text)

Your task: Define the shape of a quote line item and create the component shell.`,
    hint: `1. Blueprint declaration: Rename LineItem to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    example_code: `export type LineItem = {
  id: string;
  label: string;
  price: string;
};

export function LineItemsTable() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Quote lines
  Quote id: "q-1"
  Label: "Labor"
  Amount: "900"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type QuoteLine (id + quoteId, label, amount), then export function QuoteLines() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type QuoteLine (id + quoteId, label, amount), then export function QuoteLines() returning <div />",
    mc_anchor: "Define type QuoteLine (id + quoteId, lab",
    why_this_matters: `Defining the line item shape ensures that itemized rows share consistent property names.`,
    answer_keywords: ["export","type","QuoteLine","quoteId","label","amount","export","function","QuoteLines","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type QuoteLine = {
  id: string;
  quoteId: string;
  label: string;
  amount: string;
};

export function QuoteLines() {
  return <div />;
}
`,
    analog_example: `export type LineItem = {
  id: string;
  label: string;
  price: string;
};

export function LineItemsTable() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Defining the line item shape ensures that itemized rows share consistent property names.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists lines and a form to add one:

  List     →  each row is one QuoteLine
  Empty    →  a message when the list has no items
  Form     →  Quote id, Label, Amount
  Submit   →  the new row appears on the list
`,
      discover: `export type QuoteLine = {
  id: string;
  quoteId: string;
  label: string;
  amount: string;
};

export function QuoteLines() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Blueprint declaration: Rename LineItem to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Store line items in state; render an itemized row for each entry, or a "No items added to estimate" message.

WHAT YOU'LL NEED
- State array holding line items.
- Conditional empty check.
- Map loop rendering line items.

Your task: Store line items in state and display them, showing a placeholder if no items exist.`,
    hint: `1. Set up state: Use useState<LineItem[]>([]).
2. Check for empty: Use lines.length === 0 to render the empty message.
3. Render entries: Map through lines, passing key={item.id}.`,
    example_code: `const [lines, setLines] = useState<LineItem[]>([]);

return (
  <div>
    {lines.length === 0 ? (
      <p>No line items added</p>
    ) : (
      lines.map((item) => (
        <div key={item.id}>
          {item.label}: \${item.price}
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST — Quote lines
  q-1
  Labor

EMPTY — "No line items yet."
\`\`\`

React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user. Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
    mc_options: ["useState for the array; branch on length === 0 before mapping rows with a stable key","let lines = [] and mutate it directly on every update","always render the mapped rows, even when the array is empty"],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `A clear empty state prevents users from wondering whether line items failed to load.`,
    answer_keywords: ["useState","lines","setLines","length","map","key"],
    seed_code: `import { useState } from "react";

export type QuoteLine = {
  id: string;
  quoteId: string;
  label: string;
  amount: string;
};

export function QuoteLines() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type QuoteLine = {
  id: string;
  quoteId: string;
  label: string;
  amount: string;
};

export function QuoteLines() {
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

export type QuoteLine = {
  id: string;
  quoteId: string;
  label: string;
  amount: string;
};

export function QuoteLines() {
  const [lines, setLines] = useState<QuoteLine[]>([]);
  return (
    <div>
      {lines.length === 0 ? (
        <p>No line items yet.</p>
      ) : (
        <ul>
          {lines.map((a) => (
            <li key={a.id}>{a.quoteId}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [lines, setLines] = useState<LineItem[]>([]);

return (
  <div>
    {lines.length === 0 ? (
      <p>No line items added</p>
    ) : (
      lines.map((item) => (
        <div key={item.id}>
          {item.label}: \${item.price}
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `A clear empty state prevents users from wondering whether line items failed to load.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists lines and a form to add one:

  List     →  each row is one QuoteLine
  Empty    →  a message when the list has no items
  Form     →  Quote id, Label, Amount
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type QuoteLine = {
  id: string;
  quoteId: string;
  label: string;
  amount: string;
};

export function QuoteLines() {
  const [lines, setLines] = useState<QuoteLine[]>([]);
  return (
    <div>
      {lines.length === 0 ? (
        <p>No line items yet.</p>
      ) : (
        <ul>
          {lines.map((a) => (
            <li key={a.id}>{a.quoteId}</li>
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
      build: `1. Set up state: Use useState<LineItem[]>([]).
2. Check for empty: Use lines.length === 0 to render the empty message.
3. Render entries: Map through lines, passing key={item.id}.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Connect item description and price inputs to state to capture values as the user types.

WHAT YOU'LL NEED
- State hooks for label and price inputs.
- Value and onChange props wired on inputs.

Your task: Connect line item input fields to React state.`,
    hint: `1. Initialize states: Call useState("") for label and price.
2. Wire inputs: Connect value and onChange to each state variable.`,
    example_code: `const [label, setLabel] = useState("");
const [price, setPrice] = useState("");

<input value={label} onChange={(e) => setLabel(e.target.value)} />
<input value={price} onChange={(e) => setPrice(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Quote lines
  [ Quote id ]  [ Label ]  [ Amount ]   → Add line
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure clean data capture when adding new line items.`,
    answer_keywords: ["useState","value=","onChange","quoteId","label","amount"],
    seed_code: `import { useState } from "react";

export type QuoteLine = {
  id: string;
  quoteId: string;
  label: string;
  amount: string;
};

export function QuoteLines() {
  const [lines, setLines] = useState<QuoteLine[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type QuoteLine = {
  id: string;
  quoteId: string;
  label: string;
  amount: string;
};

export function QuoteLines() {
  const [lines, setLines] = useState<QuoteLine[]>([]);
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

export type QuoteLine = {
  id: string;
  quoteId: string;
  label: string;
  amount: string;
};

export function QuoteLines() {
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [quoteId, setQuoteId] = useState("");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <form>
        <input value={quoteId} onChange={(e) => setQuoteId(e.target.value)} placeholder="Quote id" />
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
    </form>
  );
}
`,
    analog_example: `const [label, setLabel] = useState("");
const [price, setPrice] = useState("");

<input value={label} onChange={(e) => setLabel(e.target.value)} />
<input value={price} onChange={(e) => setPrice(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure clean data capture when adding new line items.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists lines and a form to add one:

  List     →  each row is one QuoteLine
  Empty    →  a message when the list has no items
  Form     →  Quote id, Label, Amount
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type QuoteLine = {
  id: string;
  quoteId: string;
  label: string;
  amount: string;
};

export function QuoteLines() {
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [quoteId, setQuoteId] = useState("");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <form>
        <input value={quoteId} onChange={(e) => setQuoteId(e.target.value)} placeholder="Quote id" />
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize states: Call useState("") for label and price.
2. Wire inputs: Connect value and onChange to each state variable.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Intercept submit, add the new item line to the running quote, and clear the inputs.

WHAT YOU'LL NEED
- Form interceptor using e.preventDefault().
- Object assembly matching blueprint.
- Spread update to state.
- Form reset calls.

Your task: Append the new line item to state without a page refresh and reset the form.`,
    hint: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, label, and price into an object.
3. Append item: Use setLines((prev) => [...prev, entry]).
4. Clear form: Reset input states to "".`,
    example_code: `function addLine(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), label, price };
  setLines((prev) => [...prev, entry]);
  setLabel("");
  setPrice("");
}`,
    think_prompt: `\`\`\`text
FORM — Quote lines
  [ Quote id ]  [ Label ]  [ Amount ]   → Add line
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Add line is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `The new line item appears in the list instantly, keeping estimate creation responsive.


================================================================================`,
    answer_keywords: ["preventDefault","setLines","prev","quoteId","label","amount"],
    seed_code: `import { useState } from "react";

export type QuoteLine = {
  id: string;
  quoteId: string;
  label: string;
  amount: string;
};

export function QuoteLines() {
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [quoteId, setQuoteId] = useState("");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <div>
      {lines.length === 0 ? <p>No line items yet.</p> : <ul>{lines.map((a) => <li key={a.id}>{a.quoteId} · {a.label} · {a.amount}</li>)}</ul>}
      <form>
        <input value={quoteId} onChange={(e) => setQuoteId(e.target.value)} placeholder="Quote id" />
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type QuoteLine = {
  id: string;
  quoteId: string;
  label: string;
  amount: string;
};

export function QuoteLines() {
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [quoteId, setQuoteId] = useState("");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {lines.length === 0 ? <p>No line items yet.</p> : <ul>{lines.map((a) => <li key={a.id}>{a.quoteId} · {a.label} · {a.amount}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={quoteId} onChange={(e) => setQuoteId(e.target.value)} placeholder="Quote id" />
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <button type="submit">Add line</button>
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

export type QuoteLine = {
  id: string;
  quoteId: string;
  label: string;
  amount: string;
};

export function QuoteLines() {
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [quoteId, setQuoteId] = useState("");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: QuoteLine = { id: String(Date.now()), quoteId, label, amount };
    setLines((prev) => [...prev, next]);
    setQuoteId("");
    setLabel("");
    setAmount("");
  }
  return (
    <div>
      {lines.length === 0 ? (
        <p>No line items yet.</p>
      ) : (
        <ul>
          {lines.map((a) => (
            <li key={a.id}>{a.quoteId} · {a.label} · {a.amount}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={quoteId} onChange={(e) => setQuoteId(e.target.value)} placeholder="Quote id" />
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <button type="submit">Add line</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function addLine(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), label, price };
  setLines((prev) => [...prev, entry]);
  setLabel("");
  setPrice("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The new line item appears in the list instantly, keeping estimate creation responsive.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists lines and a form to add one:

  List     →  each row is one QuoteLine
  Empty    →  a message when the list has no items
  Form     →  Quote id, Label, Amount
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type QuoteLine = {
  id: string;
  quoteId: string;
  label: string;
  amount: string;
};

export function QuoteLines() {
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [quoteId, setQuoteId] = useState("");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: QuoteLine = { id: String(Date.now()), quoteId, label, amount };
    setLines((prev) => [...prev, next]);
    setQuoteId("");
    setLabel("");
    setAmount("");
  }
  return (
    <div>
      {lines.length === 0 ? (
        <p>No line items yet.</p>
      ) : (
        <ul>
          {lines.map((a) => (
            <li key={a.id}>{a.quoteId} · {a.label} · {a.amount}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={quoteId} onChange={(e) => setQuoteId(e.target.value)} placeholder="Quote id" />
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <button type="submit">Add line</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, label, and price into an object.
3. Append item: Use setLines((prev) => [...prev, entry]).
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
  title: "Quote line-items list + add-line form",
  shortName: "Line FE",
});
