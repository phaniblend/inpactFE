import createINPACTEngine from "../inpact_engine_shared";

const MENTAL_MODEL = `Build the catalog screen that lists every sold package and a form to sell a new one:

  List     →  each row is one ServicePackage
  Empty    →  "No packages sold yet" when the list has no items
  Props    →  optional packages/setPackages, falling back to local state — works alone now, plugs into the shared catalog once every task is assembled
  Form     →  Client, Service, Total punches
  Submit   →  build the record (with remainingPunches + a derived status), append it, reset the form
`;

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-package-list-form",
      title: "Package punch-card list + sell form",
      body: MENTAL_MODEL,
      usecase: "Prepaid packages are cash up front. A punch-card list+form replaces the paper card that gets lost.",
      designMock: {"kind":"list-and-form","screenTitle":"Packages","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No packages sold yet.","rows":[{"title":"Riley","subtitle":"Cut","meta":"5"},{"title":"Second row","subtitle":"Another","meta":"5"}],"fields":[{"label":"Client","sample":"Riley"},{"label":"Service","sample":"Cut"},{"label":"Total punches","sample":"5"}],"submitLabel":"Sell package"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Create the component file, define type ServicePackage, and export the empty PackageList shell.",
      "Accept packages/setPackages as optional props with a local-state fallback, and render cards when present or a message when empty.",
      "Wire controlled input text boxes to capture client name, service, and punch count.",
      "On form submit, prevent default reload, append the new package to state, and reset inputs.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Create the component file at src/components/PackageList.tsx, define type ServicePackage, and export the component shell.

Create src/components/PackageList.tsx, declare the ServicePackage type, and export the empty PackageList component.

WHAT YOUR BLUEPRINT NEEDS
- id (text)
- client (text)
- service (text)
- totalPunches (number)
- remainingPunches (number)
- status (text)

Your task: write \`type ServicePackage\` with all six fields, then define and export PackageList as a function component returning <div /> — every step from here on edits this same file.`,
    hint: `1. Create the file: Add a new file at src/components/PackageList.tsx.
2. Mirror the declaration: Look at "export type GymPass = {". Replace GymPass with ServicePackage.
3. Add fields: Mirror the pattern lines. Use string for id, client, service, and status. Use number for totalPunches and remainingPunches.
4. Component shell: Declare export function PackageList() { return <div />; }.`,
    example_code: `// src/components/MembershipCatalog.tsx
export type GymPass = {
  id: string;
  member: string;
  activity: string;
  totalVisits: number;
  remainingVisits: number;
  status: string;
};

export function MembershipCatalog() {
  return <div />;
}`,
    think_prompt: `The full catalog needs its own component. Before displaying anything, create PackageList.tsx and write a TypeScript blueprint describing every field a sold package has — including the two the mock never shows on screen (remainingPunches and status), since a package can't be tracked without them. What does the blueprint need to name, and what does the component need to be called?`,
    mc_options: [
      "Define type ServicePackage (id, client, service, totalPunches, remainingPunches, status), then export function PackageList() returning <div />",
      "Skip the type and write JSX directly against untyped objects",
      "Wait until every backend endpoint exists before modeling the row or the component",
    ],
    mc_correct_option: "Define type ServicePackage (id, client, service, totalPunches, remainingPunches, status), then export function PackageList() returning <div />",
    mc_anchor: "Define type ServicePackage (id, client, s",
    why_this_matters: `Defining the complete package blueprint upfront gives your editor the type checklist needed to prevent missing-property errors later.`,
    answer_keywords: ["export", "type", "ServicePackage", "client", "service", "totalPunches", "remainingPunches", "status", "export", "function", "PackageList"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the blueprint and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a blueprint for one record (all six fields), then the empty component shell that will use it.",
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: number;
  remainingPunches: number;
  status: string;
};

export function PackageList() {
  return <div />;
}
`,
    analog_example: `// src/components/MembershipCatalog.tsx
export type GymPass = {
  id: string;
  member: string;
  activity: string;
  totalVisits: number;
  remainingVisits: number;
  status: string;
};

export function MembershipCatalog() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Defining the complete package blueprint upfront gives your editor the type checklist needed to prevent missing-property errors later.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: MENTAL_MODEL,
      discover: `export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: number;
  remainingPunches: number;
  status: string;
};

export function PackageList() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Create the file: src/components/PackageList.tsx.
2. Mirror the declaration: type ServicePackage.
3. Add fields: id/client/service/status as string, totalPunches/remainingPunches as number.
4. Component shell: export function PackageList() { return <div />; }`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Accept packages/setPackages as optional props with a local-state fallback, and render cards when present or a message when empty.

Create a state array for packages and render either the package cards or an empty-state note. Also accept packages/setPackages as optional props, falling back to your own local state when none are given — this component needs to keep working standing alone right now (while you build and test just this one task), and later plug straight into the shared catalog once every Package Desk task gets assembled together in one page.

WHAT YOUR LOGIC NEEDS
- A useState hook holding an array of ServicePackage, used as the fallback when no props are passed.
- An optional props type: packages?: ServicePackage[]; setPackages?: the matching state-setter type.
- Resolved packages/setPackages that use the prop when given, otherwise the local state.
- A conditional check for packages.length === 0.
- An array .map() returning card elements.

Your task: define PackageListProps with optional packages/setPackages, declare local fallback state, resolve which one to actually use with ??, render "No packages sold yet" when packages.length === 0, and mapped rows (key={pkg.id}) otherwise.`,
    hint: `1. Define props: type PackageListProps = { packages?: ServicePackage[]; setPackages?: React.Dispatch<React.SetStateAction<ServicePackage[]>>; }.
2. Accept them: export function PackageList({ packages: packagesProp, setPackages: setPackagesProp }: PackageListProps = {}) { ... }.
3. Local fallback: Declare const [ownPackages, setOwnPackages] = useState<ServicePackage[]>([]) inside the component.
4. Resolve which to use: const packages = packagesProp ?? ownPackages; const setPackages = setPackagesProp ?? setOwnPackages;.
5. Check length: In your return block, use a ternary operator: packages.length === 0 ? (...) : (...).
6. Empty message: Put <p>No packages sold yet</p> in the first branch.
7. Map cards: In the second branch, map over packages, rendering client, service, remainingPunches, totalPunches, and status with key={pkg.id}.`,
    example_code: `type CatalogProps = {
  passes?: GymPass[];
  setPasses?: React.Dispatch<React.SetStateAction<GymPass[]>>;
};

export function MembershipCatalog({ passes: passesProp, setPasses: setPassesProp }: CatalogProps = {}) {
  const [ownPasses, setOwnPasses] = useState<GymPass[]>([]);
  const passes = passesProp ?? ownPasses;
  const setPasses = setPassesProp ?? setOwnPasses;

  return (
    <div>
      {passes.length === 0 ? (
        <p>No passes currently active.</p>
      ) : (
        passes.map((pass) => (
          <div key={pass.id}>
            <h4>{pass.member} - {pass.activity}</h4>
            <p>Visits: {pass.remainingVisits} / {pass.totalVisits} ({pass.status})</p>
          </div>
        ))
      )}
    </div>
  );
}`,
    think_prompt: `A zero-length array is a normal, common state — a bare .map() over it renders nothing, with no explanation for the user. But this component also needs to work two different ways: alone, while you build and test just this task, and later wired into a shared catalog once every task in the product gets put together on one page. What lets a component do both without two separate versions of itself?`,
    mc_options: [
      "an optional packages/setPackages prop pair, resolved with ?? against local useState as the fallback",
      "always require packages/setPackages as props, even while testing this task alone",
      "copy the packages array into a module-level global variable",
    ],
    mc_correct_option: "an optional packages/setPackages prop pair, resolved with ?? against local useState as the fallback",
    mc_anchor: "an optional packages/setPackages prop pai",
    why_this_matters: `Falling back to local state when no props are given means this exact component works both on its own right now, and inside the shared page you'll build once every task in this product is done.`,
    answer_keywords: ["packagesProp", "setPackagesProp", "ownPackages", "useState", "packages", "setPackages", "length", "map", "key"],
    seed_code: `export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: number;
  remainingPunches: number;
  status: string;
};

export function PackageList() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: number;
  remainingPunches: number;
  status: string;
};

type PackageListProps = {
  packages?: ServicePackage[];
  setPackages?: React.Dispatch<React.SetStateAction<ServicePackage[]>>;
};

export function PackageList({ packages: packagesProp, setPackages: setPackagesProp }: PackageListProps = {}) {
  // local fallback state + resolved packages/setPackages here
  return (
    <div>
      {/* empty or list */}
    </div>
  );
}
`,
    feedback_correct: "Correct — the list is real state (with a props override), and both the empty and populated cases are covered.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Accept optional packages/setPackages props, fall back to local useState, and branch the render on the resolved packages' length.",
    pre_check_hint: `To re-render on change, the array has to live in a hook that both holds the value and gives you a setter. An optional props pair, resolved with ?? against that local state, lets the same component work standalone or wired to a shared catalog.`,
    expected: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: number;
  remainingPunches: number;
  status: string;
};

type PackageListProps = {
  packages?: ServicePackage[];
  setPackages?: React.Dispatch<React.SetStateAction<ServicePackage[]>>;
};

export function PackageList({ packages: packagesProp, setPackages: setPackagesProp }: PackageListProps = {}) {
  const [ownPackages, setOwnPackages] = useState<ServicePackage[]>([]);
  const packages = packagesProp ?? ownPackages;
  const setPackages = setPackagesProp ?? setOwnPackages;

  return (
    <div>
      {packages.length === 0 ? (
        <p>No packages sold yet.</p>
      ) : (
        <ul>
          {packages.map((pkg) => (
            <li key={pkg.id}>{pkg.client} — {pkg.service}: {pkg.remainingPunches}/{pkg.totalPunches} ({pkg.status})</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `type CatalogProps = {
  passes?: GymPass[];
  setPasses?: React.Dispatch<React.SetStateAction<GymPass[]>>;
};

export function MembershipCatalog({ passes: passesProp, setPasses: setPassesProp }: CatalogProps = {}) {
  const [ownPasses, setOwnPasses] = useState<GymPass[]>([]);
  const passes = passesProp ?? ownPasses;
  const setPasses = setPassesProp ?? setOwnPasses;

  return (
    <div>
      {passes.length === 0 ? (
        <p>No passes currently active.</p>
      ) : (
        passes.map((pass) => (
          <div key={pass.id}>
            <h4>{pass.member} - {pass.activity}</h4>
            <p>Visits: {pass.remainingVisits} / {pass.totalVisits} ({pass.status})</p>
          </div>
        ))
      )}
    </div>
  );
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Falling back to local state when no props are given means this exact component works both on its own right now, and inside the shared page you'll build once every task in this product is done.`,
      pain: "A component that only ever manages its own state can't share data with siblings — a component that only ever takes props can't be tested alone.",
      mentalModel: MENTAL_MODEL,
      discover: `const [ownPackages, setOwnPackages] = useState<ServicePackage[]>([]);
const packages = packagesProp ?? ownPackages;
const setPackages = setPackagesProp ?? setOwnPackages;`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Define props: PackageListProps { packages?, setPackages? }.
2. Accept them: destructure with a default {} param.
3. Local fallback: useState<ServicePackage[]>([]).
4. Resolve: packages = packagesProp ?? ownPackages.
5. Check length + map, same as any list.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Wire controlled input text boxes to capture client name, service, and punch count.

Create state hooks for client, service, and punch count, binding them to their respective input fields.

WHAT YOUR LOGIC NEEDS
- Three useState hooks for client, service, and totalPunches.
- Input fields with value set to state and onChange capturing e.target.value.

Your task: add client/service/totalPunches state, then wire each input's value and onChange to it.`,
    hint: `1. State hooks: Declare states for client (default ""), service (default ""), and totalPunches (default "5").
2. Connect client: Add an input with value={client} and onChange={(e) => setClient(e.target.value)}.
3. Connect service: Add an input with value={service} and onChange={(e) => setService(e.target.value)}.
4. Connect punches: Add an input with value={totalPunches} and onChange={(e) => setTotalPunches(e.target.value)}.`,
    example_code: `const [member, setMember] = useState("");
const [activity, setActivity] = useState("");
const [visits, setVisits] = useState("5");

<input value={member} onChange={(e) => setMember(e.target.value)} placeholder="Client" />
<input value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="Service" />
<input value={visits} onChange={(e) => setVisits(e.target.value)} type="number" />`,
    think_prompt: `Controlled inputs ensure form data is validated and instantly accessible when the sell button is clicked. Where does each field's typed text need to live, and what should totalPunches default to before anyone types?`,
    mc_options: [
      "value from state, onChange writes back to state",
      "read the input only on submit via document.getElementById",
      "store the DOM node in a global",
    ],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure form data is validated and instantly accessible when the sell button is clicked.`,
    answer_keywords: ["useState", "value=", "onChange", "client", "service", "totalPunches"],
    seed_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: number;
  remainingPunches: number;
  status: string;
};

type PackageListProps = {
  packages?: ServicePackage[];
  setPackages?: React.Dispatch<React.SetStateAction<ServicePackage[]>>;
};

export function PackageList({ packages: packagesProp, setPackages: setPackagesProp }: PackageListProps = {}) {
  const [ownPackages, setOwnPackages] = useState<ServicePackage[]>([]);
  const packages = packagesProp ?? ownPackages;
  const setPackages = setPackagesProp ?? setOwnPackages;
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: number;
  remainingPunches: number;
  status: string;
};

type PackageListProps = {
  packages?: ServicePackage[];
  setPackages?: React.Dispatch<React.SetStateAction<ServicePackage[]>>;
};

export function PackageList({ packages: packagesProp, setPackages: setPackagesProp }: PackageListProps = {}) {
  const [ownPackages, setOwnPackages] = useState<ServicePackage[]>([]);
  const packages = packagesProp ?? ownPackages;
  const setPackages = setPackagesProp ?? setOwnPackages;
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
    pre_check_hint: `Standard forms disconnect user typing from component state. Create three separate state variables and wire them into input elements with value and onChange so every keystroke is tracked live.`,
    expected: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: number;
  remainingPunches: number;
  status: string;
};

type PackageListProps = {
  packages?: ServicePackage[];
  setPackages?: React.Dispatch<React.SetStateAction<ServicePackage[]>>;
};

export function PackageList({ packages: packagesProp, setPackages: setPackagesProp }: PackageListProps = {}) {
  const [ownPackages, setOwnPackages] = useState<ServicePackage[]>([]);
  const packages = packagesProp ?? ownPackages;
  const setPackages = setPackagesProp ?? setOwnPackages;
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [totalPunches, setTotalPunches] = useState("5");
  return (
    <form>
      <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
      <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
      <input value={totalPunches} onChange={(e) => setTotalPunches(e.target.value)} type="number" placeholder="Total punches" />
    </form>
  );
}
`,
    analog_example: `const [member, setMember] = useState("");
const [activity, setActivity] = useState("");
const [visits, setVisits] = useState("5");

<input value={member} onChange={(e) => setMember(e.target.value)} placeholder="Client" />
<input value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="Service" />
<input value={visits} onChange={(e) => setVisits(e.target.value)} type="number" />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Controlled inputs ensure form data is validated and instantly accessible when the sell button is clicked.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: MENTAL_MODEL,
      discover: `const [client, setClient] = useState("");
const [service, setService] = useState("");
const [totalPunches, setTotalPunches] = useState("5");

<input value={client} onChange={(e) => setClient(e.target.value)} />
<input value={service} onChange={(e) => setService(e.target.value)} />
<input value={totalPunches} onChange={(e) => setTotalPunches(e.target.value)} type="number" />`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. State hooks: client (""), service (""), totalPunches ("5").
2. Connect client input.
3. Connect service input.
4. Connect totalPunches input.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `On form submit, prevent default reload, append the new package to state, and reset inputs.

Build the submission handler that saves the new package to state without refreshing the browser and resets form fields.

WHAT YOUR LOGIC NEEDS
- e.preventDefault() to halt page refresh.
- Construction of a new ServicePackage object — remainingPunches starts equal to totalPunches, and status is derived from that count ("low" if 2 or fewer, otherwise "ok").
- A state update appending the package (...prev) — using the resolved setPackages, so this works whether it's your own local state or the shared one passed in as a prop.
- Resets clearing the input state variables.

Your task: on submit, call preventDefault, build a new ServicePackage (remainingPunches = totalPunches, status derived from the count), add it via setPackages without mutating the old array, then clear the fields.`,
    hint: `1. Form handler: Declare function handleSell(e: React.FormEvent) and call e.preventDefault() on line 1.
2. Build record: Create an object with id: \`pkg-\${Date.now()}\`, client, service, totalPunches: Number(totalPunches), remainingPunches: Number(totalPunches), and status: Number(totalPunches) <= 2 ? "low" : "ok".
3. Append: Update state using setPackages((prev) => [...prev, newPackage]) — setPackages already resolves to whichever one (prop or local) is actually in use.
4. Clear form: Call setClient(""), setService(""), and setTotalPunches("5").
5. Connect form: Attach onSubmit={handleSell} to your <form> tag.`,
    example_code: `function handleSell(e: React.FormEvent) {
  e.preventDefault();
  const count = Number(visits);
  const newPass: GymPass = {
    id: \`pass-\${Date.now()}\`,
    member,
    activity,
    totalVisits: count,
    remainingVisits: count,
    status: count <= 2 ? "low" : "ok",
  };
  setPasses((prev) => [...prev, newPass]);
  setMember("");
  setActivity("");
  setVisits("5");
}`,
    think_prompt: `Halting page refresh keeps user state intact and lets the new package render immediately without screen flicker. Given that a brand-new package starts fully loaded, what should remainingPunches equal on creation, and what determines whether its status starts as "low" or "ok"?`,
    mc_options: [
      "preventDefault, build the record with remainingPunches = totalPunches and a derived status, append it via setPackages, clear fields",
      "window.location.reload after every sale",
      "only console.log the form values",
    ],
    mc_correct_option: "preventDefault, build the record with remainingPunches = totalPunches and a derived status, append it via setPackages, clear fields",
    mc_anchor: "preventDefault, build the record with rem",
    why_this_matters: `Halting page refresh keeps user state intact and lets the new package render immediately without screen flicker.`,
    answer_keywords: ["preventDefault", "setPackages", "prev", "remainingPunches", "status"],
    seed_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: number;
  remainingPunches: number;
  status: string;
};

type PackageListProps = {
  packages?: ServicePackage[];
  setPackages?: React.Dispatch<React.SetStateAction<ServicePackage[]>>;
};

export function PackageList({ packages: packagesProp, setPackages: setPackagesProp }: PackageListProps = {}) {
  const [ownPackages, setOwnPackages] = useState<ServicePackage[]>([]);
  const packages = packagesProp ?? ownPackages;
  const setPackages = setPackagesProp ?? setOwnPackages;
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [totalPunches, setTotalPunches] = useState("5");
  return (
    <div>
      {packages.length === 0 ? <p>No packages sold yet.</p> : <ul>{packages.map((pkg) => <li key={pkg.id}>{pkg.client} — {pkg.service}: {pkg.remainingPunches}/{pkg.totalPunches} ({pkg.status})</li>)}</ul>}
      <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={totalPunches} onChange={(e) => setTotalPunches(e.target.value)} type="number" placeholder="Total punches" />
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
  totalPunches: number;
  remainingPunches: number;
  status: string;
};

type PackageListProps = {
  packages?: ServicePackage[];
  setPackages?: React.Dispatch<React.SetStateAction<ServicePackage[]>>;
};

export function PackageList({ packages: packagesProp, setPackages: setPackagesProp }: PackageListProps = {}) {
  const [ownPackages, setOwnPackages] = useState<ServicePackage[]>([]);
  const packages = packagesProp ?? ownPackages;
  const setPackages = setPackagesProp ?? setOwnPackages;
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [totalPunches, setTotalPunches] = useState("5");
  function handleSell(e: React.FormEvent) {
    // sell
  }
  return (
    <div>
      {packages.length === 0 ? <p>No packages sold yet.</p> : <ul>{packages.map((pkg) => <li key={pkg.id}>{pkg.client} — {pkg.service}: {pkg.remainingPunches}/{pkg.totalPunches} ({pkg.status})</li>)}</ul>}
      <form onSubmit={handleSell}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={totalPunches} onChange={(e) => setTotalPunches(e.target.value)} type="number" placeholder="Total punches" />
        <button type="submit">Sell package</button>
      </form>
    </div>
  );
}
`,
    feedback_correct: "Correct — submit updates state (props or local) without a reload, and the new package's status is derived, not guessed.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Stay on the page, grow the list via setPackages, derive status from the punch count, reset the form.",
    pre_check_hint: `Form submissions trigger browser page reloads by default. Intercept the submit event with e.preventDefault(), build the new ServicePackage object with calculated initial status, append it to state using spread syntax, and clear the input fields.`,
    expected: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  totalPunches: number;
  remainingPunches: number;
  status: string;
};

type PackageListProps = {
  packages?: ServicePackage[];
  setPackages?: React.Dispatch<React.SetStateAction<ServicePackage[]>>;
};

export function PackageList({ packages: packagesProp, setPackages: setPackagesProp }: PackageListProps = {}) {
  const [ownPackages, setOwnPackages] = useState<ServicePackage[]>([]);
  const packages = packagesProp ?? ownPackages;
  const setPackages = setPackagesProp ?? setOwnPackages;
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [totalPunches, setTotalPunches] = useState("5");

  function handleSell(e: React.FormEvent) {
    e.preventDefault();
    const count = Number(totalPunches);
    const newPackage: ServicePackage = {
      id: \`pkg-\${Date.now()}\`,
      client,
      service,
      totalPunches: count,
      remainingPunches: count,
      status: count <= 2 ? "low" : "ok",
    };
    setPackages((prev) => [...prev, newPackage]);
    setClient("");
    setService("");
    setTotalPunches("5");
  }

  return (
    <div>
      {packages.length === 0 ? (
        <p>No packages sold yet.</p>
      ) : (
        <ul>
          {packages.map((pkg) => (
            <li key={pkg.id}>{pkg.client} — {pkg.service}: {pkg.remainingPunches}/{pkg.totalPunches} ({pkg.status})</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSell}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service" />
        <input value={totalPunches} onChange={(e) => setTotalPunches(e.target.value)} type="number" placeholder="Total punches" />
        <button type="submit">Sell package</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function handleSell(e: React.FormEvent) {
  e.preventDefault();
  const count = Number(visits);
  const newPass: GymPass = {
    id: \`pass-\${Date.now()}\`,
    member,
    activity,
    totalVisits: count,
    remainingVisits: count,
    status: count <= 2 ? "low" : "ok",
  };
  setPasses((prev) => [...prev, newPass]);
  setMember("");
  setActivity("");
  setVisits("5");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Halting page refresh keeps user state intact and lets the new package render immediately without screen flicker.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: MENTAL_MODEL,
      discover: `function handleSell(e: React.FormEvent) {
  e.preventDefault();
  const count = Number(totalPunches);
  const newPackage: ServicePackage = {
    id: \`pkg-\${Date.now()}\`,
    client,
    service,
    totalPunches: count,
    remainingPunches: count,
    status: count <= 2 ? "low" : "ok",
  };
  setPackages((prev) => [...prev, newPackage]);
  setClient("");
  setService("");
  setTotalPunches("5");
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Form handler: e.preventDefault() first.
2. Build record: remainingPunches = totalPunches, status derived (<=2 → "low", else "ok").
3. Append: setPackages((prev) => [...prev, newPackage]).
4. Clear form: reset client/service/totalPunches.
5. Connect form: onSubmit={handleSell}.`,
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
