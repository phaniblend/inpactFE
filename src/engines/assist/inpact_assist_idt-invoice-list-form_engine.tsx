import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-invoice-list-form",
      title: "Invoice list + create form",
      body: `Build a screen that lists invoices and a form to add one:

  List     →  each row is one Invoice
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Due date
  Submit   →  the new row appears on the list
`,
      usecase: "Cash-flow tools always start as a list of what is owed plus a form to add the next invoice.",
      designMock: {"kind":"list-and-form","screenTitle":"Invoices","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No invoices yet.","rows":[{"title":"River Co","subtitle":"250","meta":"2026-09-01"},{"title":"Second row","subtitle":"Another","meta":"2026-09-01"}],"fields":[{"label":"Client","sample":"River Co"},{"label":"Amount","sample":"250"},{"label":"Due date","sample":"2026-09-01"}],"submitLabel":"Create"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Outline an invoice blueprint (invoice number, client, total) and build the page shell.","Store invoices in memory; render an itemized row for each bill, or a \"No invoices issued\" screen if empty.","Connect text inputs to memory so recipient and billing numbers are saved with every keystroke.","Prevent default submission refresh, push the fresh invoice into the list, and wipe the inputs clean."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Outline an invoice blueprint (invoice number, client, total) and build the page shell.

WHAT YOU'LL NEED
- id (text)
- client (text)
- amount (text)

Your task: Create the blueprint for an invoice and construct the outer component.`,
    hint: `1. Blueprint declaration: Rename Bill to Invoice and InvoiceTracker to your component name.
2. Define fields: Add id, client, and amount with string types.
3. Return shell: Return an empty <div /> from your component.`,
    example_code: `export type Bill = {
  id: string;
  recipient: string;
  total: string;
};

export function InvoiceTracker() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Invoices
  Client: "River Co"
  Amount: "250"
  Due date: "2026-09-01"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type Invoice (id + client, amount, dueDate), then export function InvoiceDesk() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type Invoice (id + client, amount, dueDate), then export function InvoiceDesk() returning <div />",
    mc_anchor: "Define type Invoice (id + client, amount",
    why_this_matters: `Defining the invoice shape upfront ensures all billing entries have matching property names.`,
    answer_keywords: ["export","type","Invoice","client","amount","dueDate","export","function","InvoiceDesk","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
};

export function InvoiceDesk() {
  return <div />;
}
`,
    analog_example: `export type Bill = {
  id: string;
  recipient: string;
  total: string;
};

export function InvoiceTracker() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Defining the invoice shape upfront ensures all billing entries have matching property names.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists invoices and a form to add one:

  List     →  each row is one Invoice
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Due date
  Submit   →  the new row appears on the list
`,
      discover: `export type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
};

export function InvoiceDesk() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Blueprint declaration: Rename Bill to Invoice and InvoiceTracker to your component name.
2. Define fields: Add id, client, and amount with string types.
3. Return shell: Return an empty <div /> from your component.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Store invoices in memory; render an itemized row for each bill, or a "No invoices issued" screen if empty.

WHAT YOU'LL NEED
- State array holding invoices.
- Conditional check for empty list.
- List rendering displaying invoice rows.

Your task: Store invoices in state and display each entry, showing a placeholder if none exist.`,
    hint: `1. Set up state: Use useState<Invoice[]>([]).
2. Check for empty: Use invoices.length === 0 to render an empty-state message.
3. Map rows: Render each invoice with a unique key={inv.id}.`,
    example_code: `const [invoices, setInvoices] = useState<Bill[]>([]);

return (
  <div>
    {invoices.length === 0 ? (
      <p>No invoices created yet</p>
    ) : (
      invoices.map((inv) => (
        <div key={inv.id}>
          {inv.recipient} - \${inv.total}
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST — Invoices
  River Co
  250

EMPTY — "No invoices yet."
\`\`\`

React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user. Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
    mc_options: ["useState for the array; branch on length === 0 before mapping rows with a stable key","let invoices = [] and mutate it directly on every update","always render the mapped rows, even when the array is empty"],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `A dedicated empty state prevents confusion when starting with a fresh account.`,
    answer_keywords: ["useState","invoices","setInvoices","length","map","key"],
    seed_code: `import { useState } from "react";

export type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
};

export function InvoiceDesk() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
};

export function InvoiceDesk() {
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

export type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
};

export function InvoiceDesk() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  return (
    <div>
      {invoices.length === 0 ? (
        <p>No invoices yet.</p>
      ) : (
        <ul>
          {invoices.map((a) => (
            <li key={a.id}>{a.client}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [invoices, setInvoices] = useState<Bill[]>([]);

return (
  <div>
    {invoices.length === 0 ? (
      <p>No invoices created yet</p>
    ) : (
      invoices.map((inv) => (
        <div key={inv.id}>
          {inv.recipient} - \${inv.total}
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `A dedicated empty state prevents confusion when starting with a fresh account.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists invoices and a form to add one:

  List     →  each row is one Invoice
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Due date
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
};

export function InvoiceDesk() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  return (
    <div>
      {invoices.length === 0 ? (
        <p>No invoices yet.</p>
      ) : (
        <ul>
          {invoices.map((a) => (
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
      build: `1. Set up state: Use useState<Invoice[]>([]).
2. Check for empty: Use invoices.length === 0 to render an empty-state message.
3. Map rows: Render each invoice with a unique key={inv.id}.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Connect text inputs to memory so recipient and billing numbers are saved with every keystroke.

WHAT YOU'LL NEED
- State hooks for client and amount.
- Controlled input props (value and onChange).

Your task: Connect client and invoice amount inputs to React state.`,
    hint: `1. Initialize fields: Declare useState("") for client and amount.
2. Bind values: Set value to the corresponding state variable.
3. Handle changes: Use onChange to update state with e.target.value.`,
    example_code: `const [recipient, setRecipient] = useState("");
const [total, setTotal] = useState("");

<input value={recipient} onChange={(e) => setRecipient(e.target.value)} />
<input value={total} onChange={(e) => setTotal(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Invoices
  [ Client ]  [ Amount ]  [ Due date ]   → Create
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure user values are preserved and ready for submission.`,
    answer_keywords: ["useState","value=","onChange","client","amount","dueDate"],
    seed_code: `import { useState } from "react";

export type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
};

export function InvoiceDesk() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
};

export function InvoiceDesk() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
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

export type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
};

export function InvoiceDesk() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="Due date" />
    </form>
  );
}
`,
    analog_example: `const [recipient, setRecipient] = useState("");
const [total, setTotal] = useState("");

<input value={recipient} onChange={(e) => setRecipient(e.target.value)} />
<input value={total} onChange={(e) => setTotal(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure user values are preserved and ready for submission.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists invoices and a form to add one:

  List     →  each row is one Invoice
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Due date
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
};

export function InvoiceDesk() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="Due date" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize fields: Declare useState("") for client and amount.
2. Bind values: Set value to the corresponding state variable.
3. Handle changes: Use onChange to update state with e.target.value.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Prevent default submission refresh, push the fresh invoice into the list, and wipe the inputs clean.

WHAT YOU'LL NEED
- e.preventDefault() call.
- New invoice object creation.
- State update appending the invoice.
- Setters clearing input states.

Your task: Add the new invoice to your list without a page refresh and reset the form inputs.`,
    hint: `1. Block reload: Put e.preventDefault() at the top of the function.
2. Build item: Package id, client, and amount into a new object.
3. Append item: Use setInvoices((prev) => [...prev, entry]).
4. Clear form: Reset input states back to empty strings.`,
    example_code: `function addInvoice(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), recipient, total };
  setInvoices((prev) => [...prev, entry]);
  setRecipient("");
  setTotal("");
}`,
    think_prompt: `\`\`\`text
FORM — Invoices
  [ Client ]  [ Amount ]  [ Due date ]   → Create
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Create is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `The invoice list updates immediately in place, providing a smooth user experience.


================================================================================`,
    answer_keywords: ["preventDefault","setInvoices","prev","client","amount","dueDate"],
    seed_code: `import { useState } from "react";

export type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
};

export function InvoiceDesk() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  return (
    <div>
      {invoices.length === 0 ? <p>No invoices yet.</p> : <ul>{invoices.map((a) => <li key={a.id}>{a.client} · {a.amount} · {a.dueDate}</li>)}</ul>}
      <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="Due date" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
};

export function InvoiceDesk() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {invoices.length === 0 ? <p>No invoices yet.</p> : <ul>{invoices.map((a) => <li key={a.id}>{a.client} · {a.amount} · {a.dueDate}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="Due date" />
        <button type="submit">Create</button>
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

export type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
};

export function InvoiceDesk() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Invoice = { id: String(Date.now()), client, amount, dueDate };
    setInvoices((prev) => [...prev, next]);
    setClient("");
    setAmount("");
    setDueDate("");
  }
  return (
    <div>
      {invoices.length === 0 ? (
        <p>No invoices yet.</p>
      ) : (
        <ul>
          {invoices.map((a) => (
            <li key={a.id}>{a.client} · {a.amount} · {a.dueDate}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="Due date" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function addInvoice(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), recipient, total };
  setInvoices((prev) => [...prev, entry]);
  setRecipient("");
  setTotal("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The invoice list updates immediately in place, providing a smooth user experience.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists invoices and a form to add one:

  List     →  each row is one Invoice
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Due date
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Invoice = {
  id: string;
  client: string;
  amount: string;
  dueDate: string;
};

export function InvoiceDesk() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Invoice = { id: String(Date.now()), client, amount, dueDate };
    setInvoices((prev) => [...prev, next]);
    setClient("");
    setAmount("");
    setDueDate("");
  }
  return (
    <div>
      {invoices.length === 0 ? (
        <p>No invoices yet.</p>
      ) : (
        <ul>
          {invoices.map((a) => (
            <li key={a.id}>{a.client} · {a.amount} · {a.dueDate}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="Due date" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Block reload: Put e.preventDefault() at the top of the function.
2. Build item: Package id, client, and amount into a new object.
3. Append item: Use setInvoices((prev) => [...prev, entry]).
4. Clear form: Reset input states back to empty strings.`,
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
  title: "Invoice list + create form",
  shortName: "Invoice FE",
});
