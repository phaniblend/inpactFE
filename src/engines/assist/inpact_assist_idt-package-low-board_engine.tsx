import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-package-low-board",
      title: "Low-balance board: filter packages almost empty",
      body: `Build a screen that lists packages and a form to add one:

  List     →  each row is one ServicePackage
  Empty    →  a message when the list has no items
  Form     →  Client, Service, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      usecase: "Owners upsell when a card is almost empty. Filter for display; keep full packages in state.",
      designMock: {"kind":"list-and-form","screenTitle":"Almost empty","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No low-balance packages.","rows":[{"title":"Riley","subtitle":"Cut","meta":"low"},{"title":"Second row","subtitle":"Another","meta":"low"}],"fields":[{"label":"Client","sample":"Riley"},{"label":"Service","sample":"Cut"},{"label":"Status","sample":"low"}],"submitLabel":"Sell"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Define the punch-card blueprint (including remaining punch count) and build the alert board shell.","Filter packages to show only those with 1 or 2 punches left, showing \"All client balances healthy\" if empty.","Link package form inputs to state so edits are tracked in real time.","Prevent submit reload, append the package to state, clear the inputs, and let the low-balance filter display it."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Define the punch-card blueprint (including remaining punch count) and build the alert board shell.

WHAT YOU'LL NEED
- id (text)
- client (text)
- remaining (number)

Your task: Define the shape of a package card with remaining punches, and build the board shell.`,
    hint: `1. Blueprint declaration: Rename PunchBalance to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    example_code: `export type PunchBalance = {
  id: string;
  client: string;
  remaining: number;
};

export function LowBalanceBoard() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Almost empty
  Client: "Riley"
  Service: "Cut"
  Status: "low"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type ServicePackage (id + client, service, status), then export function LowPackageBoard() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type ServicePackage (id + client, service, status), then export function LowPackageBoard() returning <div />",
    mc_anchor: "Define type ServicePackage (id + client,",
    why_this_matters: `Defining the balance field in the blueprint ensures clean filtering in later steps.`,
    answer_keywords: ["export","type","ServicePackage","client","service","status","export","function","LowPackageBoard","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: string;
};

export function LowPackageBoard() {
  return <div />;
}
`,
    analog_example: `export type PunchBalance = {
  id: string;
  client: string;
  remaining: number;
};

export function LowBalanceBoard() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Defining the balance field in the blueprint ensures clean filtering in later steps.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists packages and a form to add one:

  List     →  each row is one ServicePackage
  Empty    →  a message when the list has no items
  Form     →  Client, Service, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: string;
};

export function LowPackageBoard() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Blueprint declaration: Rename PunchBalance to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Filter packages to show only those with 1 or 2 punches left, showing "All client balances healthy" if empty.

WHAT YOU'LL NEED
- State array holding all packages.
- .filter() call selecting packages where remaining <= 2.
- Conditional empty check.

Your task: Filter packages to show only those with low balances (e.g. 2 or fewer punches remaining).`,
    hint: `1. Master list: Keep all records in allPackages state.
2. Filter logic: Create lowBalances using .filter(p => p.remaining <= 2).
3. Conditional render: Check lowBalances.length === 0 to render the fallback message or the list rows.`,
    example_code: `const [allPackages, setAllPackages] = useState<PunchBalance[]>([]);

const lowBalances = allPackages.filter((pkg) => pkg.remaining <= 2);

return (
  <div>
    {lowBalances.length === 0 ? (
      <p>All package balances are healthy</p>
    ) : (
      lowBalances.map((pkg) => (
        <div key={pkg.id}>
          {pkg.client} has only {pkg.remaining} left!
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST (filtered) — Almost empty
  Riley
  Cut   (only rows where status is "low")

EMPTY — "No low-balance packages."
\`\`\`

Filtering for display means computing a smaller array from the full one with .filter() before mapping — the state array itself never loses any rows, and a zero-length filtered result is still an empty case worth its own message. How do you keep the complete packages list in state, render only the subset above, and still show a clear message when that subset is empty?`,
    mc_options: ["keep the full list in state; filter before map; branch on the filtered length for the empty message","delete non-matching rows from state permanently","hide the whole list whenever any filter is active"],
    mc_correct_option: "keep the full list in state; filter before map; branch on the filtered length for the empty message",
    mc_anchor: "keep the full list in state; filter befo",
    why_this_matters: `Filtering highlights accounts nearing expiration without modifying master records.`,
    answer_keywords: ["useState","packages","filter","map","length"],
    seed_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: string;
};

export function LowPackageBoard() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: string;
};

export function LowPackageBoard() {
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

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: string;
};

export function LowPackageBoard() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const visible = packages.filter((a) => a.status === "low");
  return (
    <div>
      {visible.length === 0 ? (
        <p>No low-balance packages.</p>
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
    analog_example: `const [allPackages, setAllPackages] = useState<PunchBalance[]>([]);

const lowBalances = allPackages.filter((pkg) => pkg.remaining <= 2);

return (
  <div>
    {lowBalances.length === 0 ? (
      <p>All package balances are healthy</p>
    ) : (
      lowBalances.map((pkg) => (
        <div key={pkg.id}>
          {pkg.client} has only {pkg.remaining} left!
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Filtering highlights accounts nearing expiration without modifying master records.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists packages and a form to add one:

  List     →  each row is one ServicePackage
  Empty    →  a message when the list has no items
  Form     →  Client, Service, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: string;
};

export function LowPackageBoard() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const visible = packages.filter((a) => a.status === "low");
  return (
    <div>
      {visible.length === 0 ? (
        <p>No low-balance packages.</p>
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
      build: `1. Master list: Keep all records in allPackages state.
2. Filter logic: Create lowBalances using .filter(p => p.remaining <= 2).
3. Conditional render: Check lowBalances.length === 0 to render the fallback message or the list rows.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Link package form inputs to state so edits are tracked in real time.

WHAT YOU'LL NEED
- State hooks for client and remaining punches.
- Value and onChange props wired on inputs.

Your task: Connect package update inputs to React state.`,
    hint: `1. Initialize states: Call useState("") for your form inputs.
2. Wire inputs: Connect value and onChange to each state variable.`,
    example_code: `const [client, setClient] = useState("");
const [remaining, setRemaining] = useState("1");

<input value={client} onChange={(e) => setClient(e.target.value)} />
<input value={remaining} onChange={(e) => setRemaining(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Almost empty
  [ Client ]  [ Service ]  [ Status ]   → Sell
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure clean data capture when recording new packages.`,
    answer_keywords: ["useState","value=","onChange","client","service","status"],
    seed_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: string;
};

export function LowPackageBoard() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: string;
};

export function LowPackageBoard() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
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

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: string;
};

export function LowPackageBoard() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
    </form>
  );
}
`,
    analog_example: `const [client, setClient] = useState("");
const [remaining, setRemaining] = useState("1");

<input value={client} onChange={(e) => setClient(e.target.value)} />
<input value={remaining} onChange={(e) => setRemaining(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure clean data capture when recording new packages.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists packages and a form to add one:

  List     →  each row is one ServicePackage
  Empty    →  a message when the list has no items
  Form     →  Client, Service, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: string;
};

export function LowPackageBoard() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
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
    paal: `Prevent submit reload, append the package to state, clear the inputs, and let the low-balance filter display it.

WHAT YOU'LL NEED
- Form interceptor using e.preventDefault().
- Object assembly matching blueprint.
- Spread update to state.
- Form reset calls.

Your task: Append the new package to state without reloading the page and reset the inputs.`,
    hint: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, client, and remaining into an object.
3. Append item: Use setAllPackages((prev) => [...prev, entry]).
4. Clear form: Reset input states to their default values.`,
    example_code: `function handleAdd(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), client, remaining: Number(remaining) };
  setAllPackages((prev) => [...prev, entry]);
  setClient("");
  setRemaining("1");
}`,
    think_prompt: `\`\`\`text
FORM — Almost empty
  [ Client ]  [ Service ]  [ Status ]   → Sell
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Sell is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `The new package is added to the master list, and your filter automatically displays it if its balance is low.


================================================================================`,
    answer_keywords: ["preventDefault","setPackages","prev","client","service","status"],
    seed_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: string;
};

export function LowPackageBoard() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  return (
    <div>
      {packages.length === 0 ? <p>No low-balance packages.</p> : <ul>{packages.map((a) => <li key={a.id}>{a.client} · {a.service} · {a.status}</li>)}</ul>}
      <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: string;
};

export function LowPackageBoard() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {packages.length === 0 ? <p>No low-balance packages.</p> : <ul>{packages.map((a) => <li key={a.id}>{a.client} · {a.service} · {a.status}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Sell</button>
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

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: string;
};

export function LowPackageBoard() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: ServicePackage = { id: String(Date.now()), client, service, status };
    setPackages((prev) => [...prev, next]);
    setClient("");
    setService("");
    setStatus("");
  }
  return (
    <div>
      {packages.length === 0 ? (
        <p>No low-balance packages.</p>
      ) : (
        <ul>
          {packages.map((a) => (
            <li key={a.id}>{a.client} · {a.service} · {a.status}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Sell</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function handleAdd(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), client, remaining: Number(remaining) };
  setAllPackages((prev) => [...prev, entry]);
  setClient("");
  setRemaining("1");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `The new package is added to the master list, and your filter automatically displays it if its balance is low.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists packages and a form to add one:

  List     →  each row is one ServicePackage
  Empty    →  a message when the list has no items
  Form     →  Client, Service, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
`,
      discover: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: string;
};

export function LowPackageBoard() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: ServicePackage = { id: String(Date.now()), client, service, status };
    setPackages((prev) => [...prev, next]);
    setClient("");
    setService("");
    setStatus("");
  }
  return (
    <div>
      {packages.length === 0 ? (
        <p>No low-balance packages.</p>
      ) : (
        <ul>
          {packages.map((a) => (
            <li key={a.id}>{a.client} · {a.service} · {a.status}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Sell</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, client, and remaining into an object.
3. Append item: Use setAllPackages((prev) => [...prev, entry]).
4. Clear form: Reset input states to their default values.`,
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
  title: "Low-balance board: filter packages almost empty",
  shortName: "Low board",
});
