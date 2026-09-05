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
    items: ["Model one list item as a type, then set up the component around it","Hold invoices in state and render only the matching rows — filtered, with an empty state","Wire controlled inputs so form fields live in React state","On submit, preventDefault, append one item to the list, and clear the form"],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Model one list item as a type, then set up the component around it

MOCK ROW — Overdue board
  Client: "River Co"
  Amount: "250"
  Status: "overdue"

Every row also needs a unique \`id\` — not shown in the mock, but required to track, update, and key each item.

Your task: write \`type InvoiceRow\` with \`id\` plus client, amount, status, then define and export OverdueBoard as a function component returning <div /> — every step from here on edits this same file.`,
    hint: `type InvoiceRow = { id: string; client: string; amount: string; status: string; }

export function OverdueBoard() {
  return <div />;
}`,
    example_code: `export type Guest = {
  id: string;
  name: string;
  note: string;
};

export function GuestList() {
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
    why_this_matters: `Finance desks filter to overdue. Same list skill — filter for display, keep full state. If list rows and form fields do not share one shape, some rows end up missing a field, or the form saves a field the list can never display — a type names that shared shape once, so the compiler catches the mismatch before a user does. Naming and exporting the component next to it is what lets every later step, and a real pull request, attach real behavior to something that already exists.`,
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
      hook: `One shared type is a single source of truth for what a record looks like — when the list, the form, and the API all reference it, a renamed or removed field breaks the build immediately instead of failing silently in production. Pairing that with the component's own shell in the same step is what turns this from "a type file" into a real, mergeable start on the actual screen.`,
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
      build: `type InvoiceRow = { id: string; client: string; amount: string; status: string; }

export function OverdueBoard() {
  return <div />;
}`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Hold invoices in state and render only the matching rows — filtered, with an empty state

LIST (filtered) — Overdue board
  River Co
  250

EMPTY — "No overdue invoices."

Your task: hold invoices in state typed as InvoiceRow[], render invoices.filter((a) => a.status === "overdue") mapped to rows (key={item.id}), and show the empty message when that filtered result has zero items.`,
    hint: `const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
const visible = invoices.filter((a) => a.status === "overdue");
return visible.length === 0 ? <p>No overdue invoices.</p> : <ul>{visible.map((a) => <li key={a.id}>{a.client}</li>)}</ul>;`,
    example_code: `const visible = guests.filter((g) => g.status === "active");
return visible.length === 0 ? (
  <p>No matches.</p>
) : (
  <ul>
    {visible.map((g) => (
      <li key={g.id}>{g.name}</li>
    ))}
  </ul>
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
    why_this_matters: `Finance desks filter to overdue. Same list skill — filter for display, keep full state. Filtering in render lets users scan what matters without deleting other rows from state, and the empty case still needs its own message — an empty filtered view should not look like a broken screen.`,
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
    analog_example: `const visible = guests.filter((g) => g.status === "active");
return visible.length === 0 ? (
  <p>No matches.</p>
) : (
  <ul>
    {visible.map((g) => (
      <li key={g.id}>{g.name}</li>
    ))}
  </ul>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `.filter() followed by .map() is a pipeline, not a special React trick: narrow the array down to what should render, then turn what's left into rows. Checking the narrowed array's length — not the original's — is what keeps the empty state honest about the current view instead of the whole dataset.`,
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
      build: `const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
const visible = invoices.filter((a) => a.status === "overdue");
return visible.length === 0 ? <p>No overdue invoices.</p> : <ul>{visible.map((a) => <li key={a.id}>{a.client}</li>)}</ul>;`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Wire controlled inputs so form fields live in React state

FORM — Overdue board
  [ Client ]  [ Amount ]  [ Status ]   → Add

Your task: add one state value per field (client, amount, status), then wire each input's value and onChange to it.`,
    hint: `useState("") per field; value={...} onChange sets that state.`,
    example_code: `const [name, setName] = useState("");
<input value={name} onChange={(e) => setName(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Overdue board
  [ Client ]  [ Amount ]  [ Status ]   → Add
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs use value from state and onChange to write back, keeping the form and the submit payload in sync. Finance desks filter to overdue. Same list skill — filter for display, keep full state.`,
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
    analog_example: `const [name, setName] = useState("");
<input value={name} onChange={(e) => setName(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled vs. uncontrolled is a real, ongoing choice in React forms, not just boilerplate — a controlled input makes React the single source of truth for what is on screen, so validation, clearing, and reading the value on submit are all just state reads, not DOM queries.`,
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
      build: `useState("") per field; value={...} onChange sets that state.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `On submit, preventDefault, append one item to the list, and clear the form

FORM — Overdue board
  [ Client ]  [ Amount ]  [ Status ]   → Add

Your task: on submit: call preventDefault, build a new InvoiceRow from the field state, add it to invoices without mutating the old array, then clear the fields.`,
    hint: `e.preventDefault(); setInvoices((prev) => [...prev, { id: String(Date.now()), client, amount, status }]); then clear fields.`,
    example_code: `setGuests((prev) => [...prev, { id: String(Date.now()), name, note }]);`,
    think_prompt: `\`\`\`text
FORM — Overdue board
  [ Client ]  [ Amount ]  [ Status ]   → Add
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Add is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `preventDefault stops navigation; copying the old list plus one new item, then clearing fields, matches the design mock behavior. Finance desks filter to overdue. Same list skill — filter for display, keep full state.`,
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
    analog_example: `setGuests((prev) => [...prev, { id: String(Date.now()), name, note }]);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Every controlled form in React follows the same submit shape — cancel the default, derive the new record, update state immutably, reset the inputs — regardless of what the record actually contains. Learning that shape once means every future "add to a list" form is the same four moves with different field names.`,
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
      build: `e.preventDefault(); setInvoices((prev) => [...prev, { id: String(Date.now()), client, amount, status }]); then clear fields.`,
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
