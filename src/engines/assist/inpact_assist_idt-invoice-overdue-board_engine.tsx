import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-invoice-overdue-board",
      title: "Overdue board: filter invoices by status label",
      body: `Build a screen that lists invoices and a form to add one:

  List     →  each row is one InvoiceRow
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      usecase: "Finance desks filter to overdue. Same list skill — filter for display, keep full state.",
      designMock: {"kind":"list-and-form","screenTitle":"Overdue board","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No overdue invoices.","rows":[{"title":"River Co","subtitle":"250","meta":"overdue"},{"title":"Second row","subtitle":"Another","meta":"overdue"}],"fields":[{"label":"Client","sample":"River Co"},{"label":"Amount","sample":"250"},{"label":"Status","sample":"overdue"}],"submitLabel":"Add"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Model an invoice item with a status tag and prepare the overdue board layout.","Filter invoices in memory to display only overdue rows, showing an \"All accounts current\" banner if none exist.","Connect input boxes to state so new billing data is tracked cleanly.","Intercept form submit, append the invoice to the main list, reset the form, and let the overdue filter manage display."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Model an invoice item with a status tag and prepare the overdue board layout.

WHAT YOU'LL NEED
- id (text)
- client (text)
- amount (text)
- status (text)

Your task: Define the shape of an invoice including its status tag, and build the board component.`,
    hint: `1. Blueprint declaration: Define your invoice type including a status property.
2. Shell component: Create your component returning an empty <div />.`,
    example_code: `export type FilterableInvoice = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Overdue board
  Client: "River Co"
  Amount: "250"
  Status: "overdue"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type InvoiceRow (id + client, amount, status), then export function OverdueBoard() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type InvoiceRow (id + client, amount, status), then export function OverdueBoard() returning <div />",
    mc_anchor: "Define type InvoiceRow (id + client, amo",
    why_this_matters: `Adding the status field to the type ensures safe filtering in later steps.`,
    answer_keywords: ["export","type","InvoiceRow","client","amount","status","export","function","OverdueBoard","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type InvoiceRow = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  return <div />;
}
`,
    analog_example: `export type FilterableInvoice = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Adding the status field to the type ensures safe filtering in later steps.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists invoices and a form to add one:

  List     →  each row is one InvoiceRow
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `export type InvoiceRow = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Blueprint declaration: Define your invoice type including a status property.
2. Shell component: Create your component returning an empty <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Filter invoices in memory to display only overdue rows, showing an "All accounts current" banner if none exist.

WHAT YOU'LL NEED
- State array holding all invoices.
- .filter() call selecting items where status === 'overdue'.
- Conditional check displaying an empty message if no items match.

Your task: Filter stored invoices to show only overdue items, displaying a message if none are overdue.`,
    hint: `1. Master list: Keep all records in allInvoices state.
2. Filter logic: Create overdueInvoices using .filter(inv => inv.status === "overdue").
3. Conditional render: Check overdueInvoices.length === 0 to render either the message or the list rows.`,
    example_code: `const [allInvoices, setAllInvoices] = useState<FilterableInvoice[]>([]);

const overdueInvoices = allInvoices.filter((inv) => inv.status === "overdue");

return (
  <div>
    {overdueInvoices.length === 0 ? (
      <p>No overdue invoices found</p>
    ) : (
      overdueInvoices.map((inv) => (
        <div key={inv.id}>
          {inv.client} owes \${inv.amount}
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST (filtered) — Overdue board
  River Co
  250   (only rows where status is "overdue")

EMPTY — "No overdue invoices."
\`\`\`

Filtering for display means computing a smaller array from the full one with .filter() before mapping — the state array itself never loses any rows, and a zero-length filtered result is still an empty case worth its own message. How do you keep the complete invoices list in state, render only the subset above, and still show a clear message when that subset is empty?`,
    mc_options: ["keep the full list in state; filter before map; branch on the filtered length for the empty message","delete non-matching rows from state permanently","hide the whole list whenever any filter is active"],
    mc_correct_option: "keep the full list in state; filter before map; branch on the filtered length for the empty message",
    mc_anchor: "keep the full list in state; filter befo",
    why_this_matters: `Filtering leaves the master list untouched while displaying only the items requiring immediate attention.`,
    answer_keywords: ["useState","invoices","filter","map","length"],
    seed_code: `import { useState } from "react";

export type InvoiceRow = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type InvoiceRow = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
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

export type InvoiceRow = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const visible = invoices.filter((a) => a.status === "overdue");
  return (
    <div>
      {visible.length === 0 ? (
        <p>No overdue invoices.</p>
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
    analog_example: `const [allInvoices, setAllInvoices] = useState<FilterableInvoice[]>([]);

const overdueInvoices = allInvoices.filter((inv) => inv.status === "overdue");

return (
  <div>
    {overdueInvoices.length === 0 ? (
      <p>No overdue invoices found</p>
    ) : (
      overdueInvoices.map((inv) => (
        <div key={inv.id}>
          {inv.client} owes \${inv.amount}
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Filtering leaves the master list untouched while displaying only the items requiring immediate attention.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists invoices and a form to add one:

  List     →  each row is one InvoiceRow
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type InvoiceRow = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const visible = invoices.filter((a) => a.status === "overdue");
  return (
    <div>
      {visible.length === 0 ? (
        <p>No overdue invoices.</p>
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
      build: `1. Master list: Keep all records in allInvoices state.
2. Filter logic: Create overdueInvoices using .filter(inv => inv.status === "overdue").
3. Conditional render: Check overdueInvoices.length === 0 to render either the message or the list rows.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Connect input boxes to state so new billing data is tracked cleanly.

WHAT YOU'LL NEED
- State hooks for client, amount, and status.
- Value and onChange props wired to inputs.

Your task: Track invoice form inputs in React state.`,
    hint: `1. Initialize states: Call useState("") for your form inputs.
2. Bind inputs: Link value and onChange to your state variables.`,
    example_code: `const [client, setClient] = useState("");
const [amount, setAmount] = useState("");
const [status, setStatus] = useState("current");

<input value={client} onChange={(e) => setClient(e.target.value)} />
<input value={amount} onChange={(e) => setAmount(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Overdue board
  [ Client ]  [ Amount ]  [ Status ]   → Add
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure clean data capture when creating records.`,
    answer_keywords: ["useState","value=","onChange","client","amount","status"],
    seed_code: `import { useState } from "react";

export type InvoiceRow = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type InvoiceRow = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
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

export type InvoiceRow = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
    </form>
  );
}
`,
    analog_example: `const [client, setClient] = useState("");
const [amount, setAmount] = useState("");
const [status, setStatus] = useState("current");

<input value={client} onChange={(e) => setClient(e.target.value)} />
<input value={amount} onChange={(e) => setAmount(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure clean data capture when creating records.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists invoices and a form to add one:

  List     →  each row is one InvoiceRow
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type InvoiceRow = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize states: Call useState("") for your form inputs.
2. Bind inputs: Link value and onChange to your state variables.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Intercept form submit, append the invoice to the main list, reset the form, and let the overdue filter manage display.

WHAT YOU'LL NEED
- Form interceptor using e.preventDefault().
- Object assembly matching your blueprint.
- Spread update to master state.
- Form reset calls.

Your task: Append the new invoice to your master state and clear inputs without refreshing the page.`,
    hint: `1. Stop reload: Call e.preventDefault() first.
2. Assemble record: Create an object with an ID and your form state values.
3. Update state: Append using setAllInvoices((prev) => [...prev, entry]).
4. Clear form: Reset input states to "".`,
    example_code: `function handleAdd(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), client, amount, status };
  setAllInvoices((prev) => [...prev, entry]);
  setClient("");
  setAmount("");
}`,
    think_prompt: `\`\`\`text
FORM — Overdue board
  [ Client ]  [ Amount ]  [ Status ]   → Add
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Add is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `The new invoice is added to the master list, and your filter automatically displays it if it is marked overdue.


================================================================================`,
    answer_keywords: ["preventDefault","setInvoices","prev","client","amount","status"],
    seed_code: `import { useState } from "react";

export type InvoiceRow = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  return (
    <div>
      {invoices.length === 0 ? <p>No overdue invoices.</p> : <ul>{invoices.map((a) => <li key={a.id}>{a.client} · {a.amount} · {a.status}</li>)}</ul>}
      <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type InvoiceRow = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {invoices.length === 0 ? <p>No overdue invoices.</p> : <ul>{invoices.map((a) => <li key={a.id}>{a.client} · {a.amount} · {a.status}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
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

export type InvoiceRow = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: InvoiceRow = { id: String(Date.now()), client, amount, status };
    setInvoices((prev) => [...prev, next]);
    setClient("");
    setAmount("");
    setStatus("");
  }
  return (
    <div>
      {invoices.length === 0 ? (
        <p>No overdue invoices.</p>
      ) : (
        <ul>
          {invoices.map((a) => (
            <li key={a.id}>{a.client} · {a.amount} · {a.status}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function handleAdd(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), client, amount, status };
  setAllInvoices((prev) => [...prev, entry]);
  setClient("");
  setAmount("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The new invoice is added to the master list, and your filter automatically displays it if it is marked overdue.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists invoices and a form to add one:

  List     →  each row is one InvoiceRow
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type InvoiceRow = {
  id: string;
  client: string;
  amount: string;
  status: string;
};

export function OverdueBoard() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: InvoiceRow = { id: String(Date.now()), client, amount, status };
    setInvoices((prev) => [...prev, next]);
    setClient("");
    setAmount("");
    setStatus("");
  }
  return (
    <div>
      {invoices.length === 0 ? (
        <p>No overdue invoices.</p>
      ) : (
        <ul>
          {invoices.map((a) => (
            <li key={a.id}>{a.client} · {a.amount} · {a.status}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Stop reload: Call e.preventDefault() first.
2. Assemble record: Create an object with an ID and your form state values.
3. Update state: Append using setAllInvoices((prev) => [...prev, entry]).
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
  title: "Overdue board: filter invoices by status label",
  shortName: "Overdue board",
});
