import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-booking-deposit-list-form",
      title: "Deposit list + take-deposit form",
      body: `Build a screen that lists deposits and a form to add one:

  List     →  each row is one Deposit
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Appointment id
  Submit   →  the new row appears on the list
`,
      usecase: "Taking a deposit is the same list+form skill as booking — different fields, same React pattern you will reuse on every product desk.",
      designMock: {"kind":"list-and-form","screenTitle":"Deposits","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No deposits yet.","rows":[{"title":"Priya","subtitle":"40","meta":"a-100"},{"title":"Second row","subtitle":"Another","meta":"a-100"}],"fields":[{"label":"Client","sample":"Priya"},{"label":"Amount","sample":"40"},{"label":"Appointment id","sample":"a-100"}],"submitLabel":"Take deposit"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Design a blueprint for a deposit record (customer, amount) and build the shell container.","Hold deposits in memory; show a transaction row for each payment, or an \"All deposits clear\" message when empty.","Wire payment amount and customer fields to memory so keystrokes register in real time.","Block the default page reload, drop the new deposit into the ledger, and clear the input boxes."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Design a blueprint for a deposit record (customer, amount) and build the shell container.

WHAT YOU'LL NEED
- id (text)
- client (text)
- amount (text)

Your task: Define the shape of a deposit record and create the component container.`,
    hint: `1. Replace names: Change Payment to your deposit type name and PaymentTracker to your component name.
2. Populate fields: Write each field on its own line followed by ": string;".
3. Return container: Keep the "return <div />;" shell in your component.`,
    example_code: `export type Payment = {
  id: string;
  payer: string;
  total: string;
};

export function PaymentTracker() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Deposits
  Client: "Priya"
  Amount: "40"
  Appointment id: "a-100"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type Deposit (id + client, amount, appointmentId), then export function DepositDesk() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type Deposit (id + client, amount, appointmentId), then export function DepositDesk() returning <div />",
    mc_anchor: "Define type Deposit (id + client, amount",
    why_this_matters: `Having an explicit shape for deposits ensures every transaction record has the required bookkeeping fields.`,
    answer_keywords: ["export","type","Deposit","client","amount","appointmentId","export","function","DepositDesk","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type Deposit = {
  id: string;
  client: string;
  amount: string;
  appointmentId: string;
};

export function DepositDesk() {
  return <div />;
}
`,
    analog_example: `export type Payment = {
  id: string;
  payer: string;
  total: string;
};

export function PaymentTracker() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Having an explicit shape for deposits ensures every transaction record has the required bookkeeping fields.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists deposits and a form to add one:

  List     →  each row is one Deposit
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Appointment id
  Submit   →  the new row appears on the list
`,
      discover: `export type Deposit = {
  id: string;
  client: string;
  amount: string;
  appointmentId: string;
};

export function DepositDesk() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Replace names: Change Payment to your deposit type name and PaymentTracker to your component name.
2. Populate fields: Write each field on its own line followed by ": string;".
3. Return container: Keep the "return <div />;" shell in your component.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Hold deposits in memory; show a transaction row for each payment, or an "All deposits clear" message when empty.

WHAT YOU'LL NEED
- State array holding deposits.
- Empty-state conditional render.
- Array mapping rendering transaction rows.

Your task: Store deposits in state and display them as rows, showing a message when there are no deposits.`,
    hint: `1. Declare list state: Initialize useState with an empty array typed with your deposit type.
2. Conditional check: Use deposits.length === 0 to branch the display.
3. Render contents: Map over deposits, passing key={d.id} and rendering the client and amount.`,
    example_code: `const [deposits, setDeposits] = useState<Payment[]>([]);

return (
  <div>
    {deposits.length === 0 ? (
      <p>No deposits recorded</p>
    ) : (
      deposits.map((d) => (
        <div key={d.id}>
          {d.payer}: \${d.total}
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST — Deposits
  Priya
  40

EMPTY — "No deposits yet."
\`\`\`

React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user. Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
    mc_options: ["useState for the array; branch on length === 0 before mapping rows with a stable key","let deposits = [] and mutate it directly on every update","always render the mapped rows, even when the array is empty"],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `Clear visual feedback when the ledger is empty prevents users from wondering if the application failed to load.`,
    answer_keywords: ["useState","deposits","setDeposits","length","map","key"],
    seed_code: `import { useState } from "react";

export type Deposit = {
  id: string;
  client: string;
  amount: string;
  appointmentId: string;
};

export function DepositDesk() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type Deposit = {
  id: string;
  client: string;
  amount: string;
  appointmentId: string;
};

export function DepositDesk() {
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

export type Deposit = {
  id: string;
  client: string;
  amount: string;
  appointmentId: string;
};

export function DepositDesk() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  return (
    <div>
      {deposits.length === 0 ? (
        <p>No deposits yet.</p>
      ) : (
        <ul>
          {deposits.map((a) => (
            <li key={a.id}>{a.client}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [deposits, setDeposits] = useState<Payment[]>([]);

return (
  <div>
    {deposits.length === 0 ? (
      <p>No deposits recorded</p>
    ) : (
      deposits.map((d) => (
        <div key={d.id}>
          {d.payer}: \${d.total}
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Clear visual feedback when the ledger is empty prevents users from wondering if the application failed to load.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists deposits and a form to add one:

  List     →  each row is one Deposit
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Appointment id
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Deposit = {
  id: string;
  client: string;
  amount: string;
  appointmentId: string;
};

export function DepositDesk() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  return (
    <div>
      {deposits.length === 0 ? (
        <p>No deposits yet.</p>
      ) : (
        <ul>
          {deposits.map((a) => (
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
      build: `1. Declare list state: Initialize useState with an empty array typed with your deposit type.
2. Conditional check: Use deposits.length === 0 to branch the display.
3. Render contents: Map over deposits, passing key={d.id} and rendering the client and amount.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Wire payment amount and customer fields to memory so keystrokes register in real time.

WHAT YOU'LL NEED
- Separate state hooks for client and amount.
- Inputs bound via value and onChange.

Your task: Bind the client name and deposit amount inputs to React state.`,
    hint: `1. Initialize states: Create a useState("") for client and one for amount.
2. Attach props: Assign each state variable to its input's value attribute.
3. Handle updates: Update the corresponding state inside onChange using e.target.value.`,
    example_code: `const [payer, setPayer] = useState("");
const [total, setTotal] = useState("");

<input value={payer} onChange={(e) => setPayer(e.target.value)} />
<input value={total} onChange={(e) => setTotal(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Deposits
  [ Client ]  [ Amount ]  [ Appointment id ]   → Take deposit
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure numbers and strings are sanitized and accessible when the user clicks save.`,
    answer_keywords: ["useState","value=","onChange","client","amount","appointmentId"],
    seed_code: `import { useState } from "react";

export type Deposit = {
  id: string;
  client: string;
  amount: string;
  appointmentId: string;
};

export function DepositDesk() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type Deposit = {
  id: string;
  client: string;
  amount: string;
  appointmentId: string;
};

export function DepositDesk() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
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

export type Deposit = {
  id: string;
  client: string;
  amount: string;
  appointmentId: string;
};

export function DepositDesk() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} placeholder="Appointment id" />
    </form>
  );
}
`,
    analog_example: `const [payer, setPayer] = useState("");
const [total, setTotal] = useState("");

<input value={payer} onChange={(e) => setPayer(e.target.value)} />
<input value={total} onChange={(e) => setTotal(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure numbers and strings are sanitized and accessible when the user clicks save.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists deposits and a form to add one:

  List     →  each row is one Deposit
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Appointment id
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Deposit = {
  id: string;
  client: string;
  amount: string;
  appointmentId: string;
};

export function DepositDesk() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} placeholder="Appointment id" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize states: Create a useState("") for client and one for amount.
2. Attach props: Assign each state variable to its input's value attribute.
3. Handle updates: Update the corresponding state inside onChange using e.target.value.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Block the default page reload, drop the new deposit into the ledger, and clear the input boxes.

WHAT YOU'LL NEED
- e.preventDefault() to stop page reload.
- A new deposit object with a unique id.
- State update appending the new object.
- State cleanup resetting fields.

Your task: Record the new deposit to the list and clear the input boxes without reloading the page.`,
    hint: `1. Stop browser action: Put e.preventDefault() first.
2. Build record: Create an object with an ID and your state fields.
3. Update list: Append using setDeposits((prev) => [...prev, entry]).
4. Reset fields: Set both input states back to "".`,
    example_code: `function onSave(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), payer, total };
  setDeposits((prev) => [...prev, entry]);
  setPayer("");
  setTotal("");
}`,
    think_prompt: `\`\`\`text
FORM — Deposits
  [ Client ]  [ Amount ]  [ Appointment id ]   → Take deposit
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Take deposit is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `Immediate visual feedback gives users confidence that their deposit was recorded accurately.


================================================================================`,
    answer_keywords: ["preventDefault","setDeposits","prev","client","amount","appointmentId"],
    seed_code: `import { useState } from "react";

export type Deposit = {
  id: string;
  client: string;
  amount: string;
  appointmentId: string;
};

export function DepositDesk() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  return (
    <div>
      {deposits.length === 0 ? <p>No deposits yet.</p> : <ul>{deposits.map((a) => <li key={a.id}>{a.client} · {a.amount} · {a.appointmentId}</li>)}</ul>}
      <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} placeholder="Appointment id" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type Deposit = {
  id: string;
  client: string;
  amount: string;
  appointmentId: string;
};

export function DepositDesk() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {deposits.length === 0 ? <p>No deposits yet.</p> : <ul>{deposits.map((a) => <li key={a.id}>{a.client} · {a.amount} · {a.appointmentId}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} placeholder="Appointment id" />
        <button type="submit">Take deposit</button>
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

export type Deposit = {
  id: string;
  client: string;
  amount: string;
  appointmentId: string;
};

export function DepositDesk() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Deposit = { id: String(Date.now()), client, amount, appointmentId };
    setDeposits((prev) => [...prev, next]);
    setClient("");
    setAmount("");
    setAppointmentId("");
  }
  return (
    <div>
      {deposits.length === 0 ? (
        <p>No deposits yet.</p>
      ) : (
        <ul>
          {deposits.map((a) => (
            <li key={a.id}>{a.client} · {a.amount} · {a.appointmentId}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} placeholder="Appointment id" />
        <button type="submit">Take deposit</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function onSave(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), payer, total };
  setDeposits((prev) => [...prev, entry]);
  setPayer("");
  setTotal("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Immediate visual feedback gives users confidence that their deposit was recorded accurately.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists deposits and a form to add one:

  List     →  each row is one Deposit
  Empty    →  a message when the list has no items
  Form     →  Client, Amount, Appointment id
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Deposit = {
  id: string;
  client: string;
  amount: string;
  appointmentId: string;
};

export function DepositDesk() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Deposit = { id: String(Date.now()), client, amount, appointmentId };
    setDeposits((prev) => [...prev, next]);
    setClient("");
    setAmount("");
    setAppointmentId("");
  }
  return (
    <div>
      {deposits.length === 0 ? (
        <p>No deposits yet.</p>
      ) : (
        <ul>
          {deposits.map((a) => (
            <li key={a.id}>{a.client} · {a.amount} · {a.appointmentId}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} placeholder="Appointment id" />
        <button type="submit">Take deposit</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Stop browser action: Put e.preventDefault() first.
2. Build record: Create an object with an ID and your state fields.
3. Update list: Append using setDeposits((prev) => [...prev, entry]).
4. Reset fields: Set both input states back to "".`,
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
  title: "Deposit list + take-deposit form",
  shortName: "Deposit FE",
});
