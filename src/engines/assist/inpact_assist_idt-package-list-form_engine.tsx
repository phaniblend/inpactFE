import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-package-list-form",
      title: "Package punch-card list + sell form",
      body: `Build a screen that lists packages and a form to add one:

  List     →  each row is one ServicePackage
  Empty    →  a message when the list has no items
  Form     →  Client, Service, Total punches
  Submit   →  the new row appears on the list
`,
      usecase: "Prepaid packages are cash up front. A punch-card list+form replaces the paper card that gets lost.",
      designMock: {"kind":"list-and-form","screenTitle":"Packages","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No packages sold yet.","rows":[{"title":"Riley","subtitle":"Cut","meta":"5"},{"title":"Second row","subtitle":"Another","meta":"5"}],"fields":[{"label":"Client","sample":"Riley"},{"label":"Service","sample":"Cut"},{"label":"Total punches","sample":"5"}],"submitLabel":"Sell package"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Model one list item as a type, then set up the component around it","Hold packages in state and render it — rows when present, a message when empty","Wire controlled inputs so form fields live in React state","On submit, preventDefault, append one item to the list, and clear the form"],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Model one list item as a type, then set up the component around it

MOCK ROW — Packages
  Client: "Riley"
  Service: "Cut"
  Total punches: "5"

Every row also needs a unique \`id\` — not shown in the mock, but required to track, update, and key each item.

Your task: write \`type ServicePackage\` with \`id\` plus client, service, totalPunches, then define and export PackageDesk as a function component returning <div /> — every step from here on edits this same file.`,
    hint: `type ServicePackage = { id: string; client: string; service: string; totalPunches: string; }

export function PackageDesk() {
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
MOCK ROW — Packages
  Client: "Riley"
  Service: "Cut"
  Total punches: "5"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type ServicePackage (id + client, service, totalPunches), then export function PackageDesk() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type ServicePackage (id + client, service, totalPunches), then export function PackageDesk() returning <div />",
    mc_anchor: "Define type ServicePackage (id + client,",
    why_this_matters: `Prepaid packages are cash up front. A punch-card list+form replaces the paper card that gets lost. If list rows and form fields do not share one shape, some rows end up missing a field, or the form saves a field the list can never display — a type names that shared shape once, so the compiler catches the mismatch before a user does. Naming and exporting the component next to it is what lets every later step, and a real pull request, attach real behavior to something that already exists.`,
    answer_keywords: ["export","type","ServicePackage","client","service","totalPunches","export","function","PackageDesk","return"],
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
  totalPunches: string;
};

export function PackageDesk() {
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
      mentalModel: `Build a screen that lists packages and a form to add one:

  List     →  each row is one ServicePackage
  Empty    →  a message when the list has no items
  Form     →  Client, Service, Total punches
  Submit   →  the new row appears on the list
`,
      discover: `export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: string;
};

export function PackageDesk() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `type ServicePackage = { id: string; client: string; service: string; totalPunches: string; }

export function PackageDesk() {
  return <div />;
}`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Hold packages in state and render it — rows when present, a message when empty

LIST — Packages
  Riley
  Cut

EMPTY — "No packages sold yet."

Your task: hold packages in state typed as ServicePackage[], starting empty, then render the empty message when packages.length === 0 and the mapped rows (key={item.id}) otherwise.`,
    hint: `const [packages, setPackages] = useState<ServicePackage[]>([]);
return packages.length === 0 ? <p>No packages sold yet.</p> : <ul>{packages.map((a) => <li key={a.id}>{a.client}</li>)}</ul>;`,
    example_code: `const [guests, setGuests] = useState<Guest[]>([]);
return guests.length === 0 ? (
  <p>No names yet.</p>
) : (
  <ul>
    {guests.map((g) => (
      <li key={g.id}>{g.name}</li>
    ))}
  </ul>
);`,
    think_prompt: `\`\`\`text
LIST — Packages
  Riley
  Cut

EMPTY — "No packages sold yet."
\`\`\`

React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user. Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
    mc_options: ["useState for the array; branch on length === 0 before mapping rows with a stable key","let packages = [] and mutate it directly on every update","always render the mapped rows, even when the array is empty"],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `Prepaid packages are cash up front. A punch-card list+form replaces the paper card that gets lost. A plain array in a variable will not make React redraw, and a list that renders as literally nothing when empty looks broken — useState gives the screen something to watch, and branching on length before mapping is what keeps a brand-new list from looking like a bug.`,
    answer_keywords: ["useState","packages","setPackages","length","map","key"],
    seed_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: string;
};

export function PackageDesk() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: string;
};

export function PackageDesk() {
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

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: string;
};

export function PackageDesk() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  return (
    <div>
      {packages.length === 0 ? (
        <p>No packages sold yet.</p>
      ) : (
        <ul>
          {packages.map((a) => (
            <li key={a.id}>{a.client}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [guests, setGuests] = useState<Guest[]>([]);
return guests.length === 0 ? (
  <p>No names yet.</p>
) : (
  <ul>
    {guests.map((g) => (
      <li key={g.id}>{g.name}</li>
    ))}
  </ul>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `A plain variable and a piece of React state can hold the identical value yet behave completely differently — mutating a variable is invisible to React, while calling a state setter schedules a re-render. And an empty array is not a missing feature to handle later; it is one of exactly two branches every list render has from the very first render.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists packages and a form to add one:

  List     →  each row is one ServicePackage
  Empty    →  a message when the list has no items
  Form     →  Client, Service, Total punches
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: string;
};

export function PackageDesk() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  return (
    <div>
      {packages.length === 0 ? (
        <p>No packages sold yet.</p>
      ) : (
        <ul>
          {packages.map((a) => (
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
      build: `const [packages, setPackages] = useState<ServicePackage[]>([]);
return packages.length === 0 ? <p>No packages sold yet.</p> : <ul>{packages.map((a) => <li key={a.id}>{a.client}</li>)}</ul>;`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Wire controlled inputs so form fields live in React state

FORM — Packages
  [ Client ]  [ Service ]  [ Total punches ]   → Sell package

Your task: add one state value per field (client, service, totalPunches), then wire each input's value and onChange to it.`,
    hint: `useState("") per field; value={...} onChange sets that state.`,
    example_code: `const [name, setName] = useState("");
<input value={name} onChange={(e) => setName(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Packages
  [ Client ]  [ Service ]  [ Total punches ]   → Sell package
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs use value from state and onChange to write back, keeping the form and the submit payload in sync. Prepaid packages are cash up front. A punch-card list+form replaces the paper card that gets lost.`,
    answer_keywords: ["useState","value=","onChange","client","service","totalPunches"],
    seed_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: string;
};

export function PackageDesk() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: string;
};

export function PackageDesk() {
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
  totalPunches: string;
};

export function PackageDesk() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [totalPunches, setTotalPunches] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={totalPunches} onChange={(e) => setTotalPunches(e.target.value)} placeholder="Total punches" />
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
      mentalModel: `Build a screen that lists packages and a form to add one:

  List     →  each row is one ServicePackage
  Empty    →  a message when the list has no items
  Form     →  Client, Service, Total punches
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: string;
};

export function PackageDesk() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [totalPunches, setTotalPunches] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={totalPunches} onChange={(e) => setTotalPunches(e.target.value)} placeholder="Total punches" />
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

FORM — Packages
  [ Client ]  [ Service ]  [ Total punches ]   → Sell package

Your task: on submit: call preventDefault, build a new ServicePackage from the field state, add it to packages without mutating the old array, then clear the fields.`,
    hint: `e.preventDefault(); setPackages((prev) => [...prev, { id: String(Date.now()), client, service, totalPunches }]); then clear fields.`,
    example_code: `setGuests((prev) => [...prev, { id: String(Date.now()), name, note }]);`,
    think_prompt: `\`\`\`text
FORM — Packages
  [ Client ]  [ Service ]  [ Total punches ]   → Sell package
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Sell package is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `preventDefault stops navigation; copying the old list plus one new item, then clearing fields, matches the design mock behavior. Prepaid packages are cash up front. A punch-card list+form replaces the paper card that gets lost.`,
    answer_keywords: ["preventDefault","setPackages","prev","client","service","totalPunches"],
    seed_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: string;
};

export function PackageDesk() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [totalPunches, setTotalPunches] = useState("");
  return (
    <div>
      {packages.length === 0 ? <p>No packages sold yet.</p> : <ul>{packages.map((a) => <li key={a.id}>{a.client} · {a.service} · {a.totalPunches}</li>)}</ul>}
      <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={totalPunches} onChange={(e) => setTotalPunches(e.target.value)} placeholder="Total punches" />
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
  totalPunches: string;
};

export function PackageDesk() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [totalPunches, setTotalPunches] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {packages.length === 0 ? <p>No packages sold yet.</p> : <ul>{packages.map((a) => <li key={a.id}>{a.client} · {a.service} · {a.totalPunches}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={totalPunches} onChange={(e) => setTotalPunches(e.target.value)} placeholder="Total punches" />
        <button type="submit">Sell package</button>
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
  totalPunches: string;
};

export function PackageDesk() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [totalPunches, setTotalPunches] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: ServicePackage = { id: String(Date.now()), client, service, totalPunches };
    setPackages((prev) => [...prev, next]);
    setClient("");
    setService("");
    setTotalPunches("");
  }
  return (
    <div>
      {packages.length === 0 ? (
        <p>No packages sold yet.</p>
      ) : (
        <ul>
          {packages.map((a) => (
            <li key={a.id}>{a.client} · {a.service} · {a.totalPunches}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={totalPunches} onChange={(e) => setTotalPunches(e.target.value)} placeholder="Total punches" />
        <button type="submit">Sell package</button>
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
      mentalModel: `Build a screen that lists packages and a form to add one:

  List     →  each row is one ServicePackage
  Empty    →  a message when the list has no items
  Form     →  Client, Service, Total punches
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: string;
};

export function PackageDesk() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [totalPunches, setTotalPunches] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: ServicePackage = { id: String(Date.now()), client, service, totalPunches };
    setPackages((prev) => [...prev, next]);
    setClient("");
    setService("");
    setTotalPunches("");
  }
  return (
    <div>
      {packages.length === 0 ? (
        <p>No packages sold yet.</p>
      ) : (
        <ul>
          {packages.map((a) => (
            <li key={a.id}>{a.client} · {a.service} · {a.totalPunches}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={totalPunches} onChange={(e) => setTotalPunches(e.target.value)} placeholder="Total punches" />
        <button type="submit">Sell package</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `e.preventDefault(); setPackages((prev) => [...prev, { id: String(Date.now()), client, service, totalPunches }]); then clear fields.`,
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
  title: "Package punch-card list + sell form",
  shortName: "Package FE",
});
