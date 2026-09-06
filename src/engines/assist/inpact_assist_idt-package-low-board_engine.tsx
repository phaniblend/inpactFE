import createINPACTEngine from "../inpact_engine_shared";

const MENTAL_MODEL = `Build the alert board, then wire the whole Package Desk together:

  Prop     →  LowPackageBoard receives the same packages PackageList sells into
  Derive   →  .filter() to status === "low" || status === "empty" — never mutate the master list
  Render   →  alert cards for matching packages, or a healthy banner when none match
  Assemble →  src/pages/index.tsx holds the shared state and renders all three components together
`;

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-package-low-board",
      title: "Low-balance board: filter packages almost empty",
      body: MENTAL_MODEL,
      usecase: "Owners upsell when a card is almost empty. Filter for display; keep full packages in state.",
      designMock: {"kind":"list-and-form","screenTitle":"Low-balance packages","meansExplainer":"you need to derive a filtered subset of the shared packages list — status \"low\" or \"empty\" — and render it as alert cards, without ever changing the shared list itself.","caption":"This is the screen you are building. Match the pieces — list, empty message, filter — not the brand colors. Try filtering by status.","listCaption":"LIST — sample packages","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"All client packages have healthy balances.","rows":[{"title":"Riley","subtitle":"Cut","meta":"low"},{"title":"Jordan","subtitle":"Color","meta":"empty"}],"fields":[{"label":"Status","options":["All","low","empty","ok"]}],"formMode":"filter","submitLabel":"Filter"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Create the board file, import the shared ServicePackage type, and export the component shell accepting packages as a prop.",
      "Derive a filtered subset of packages matching status === \"low\" or status === \"empty\".",
      "Render the low-balance cards, showing a healthy-balance banner if zero items match.",
      "Assemble PackageList, PunchLog, and LowPackageBoard together in src/pages/index.tsx with shared state.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Create the board file at src/components/LowPackageBoard.tsx and export the component shell.

Create src/components/LowPackageBoard.tsx and export the empty LowPackageBoard shell component.

WHAT YOUR CODE NEEDS
- An import of type ServicePackage from PackageList.
- A component declaration accepting packages as a prop.

Your task: import ServicePackage, declare a BoardProps type holding packages: ServicePackage[], and export LowPackageBoard({ packages }: BoardProps) returning <div /> — every step from here on edits this same file.`,
    hint: `1. Create file: Add a new file at src/components/LowPackageBoard.tsx.
2. Import type: Write import type { ServicePackage } from "./PackageList".
3. Define props: Declare type BoardProps = { packages: ServicePackage[]; }.
4. Export shell: Export function LowPackageBoard({ packages }: BoardProps) { return <div />; }.`,
    example_code: `// src/components/RenewalWatchlist.tsx
import type { GymPass } from "./MembershipCatalog";

type WatchlistProps = {
  passes: GymPass[];
};

export function RenewalWatchlist({ passes }: WatchlistProps) {
  return <div />;
}`,
    think_prompt: `Importing the blueprint from the catalog task (rather than redefining it here) ensures this filtered view always stays in sync with catalog data — one shape, used everywhere. What does this component need to import, and what shape does the prop that carries the master list need?`,
    mc_options: [
      "import type { ServicePackage } from \"./PackageList\"; define BoardProps { packages: ServicePackage[] }; export LowPackageBoard({ packages }: BoardProps)",
      "redefine ServicePackage locally inside LowPackageBoard.tsx",
      "fetch packages itself instead of accepting them as a prop",
    ],
    mc_correct_option: "import type { ServicePackage } from \"./PackageList\"; define BoardProps { packages: ServicePackage[] }; export LowPackageBoard({ packages }: BoardProps)",
    mc_anchor: "import type { ServicePackage } from \"./Pa",
    why_this_matters: `Importing the blueprint from the catalog task ensures this filtered view always stays in sync with catalog data.`,
    answer_keywords: ["import", "type", "ServicePackage", "PackageList", "BoardProps", "packages", "LowPackageBoard"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the board now shares the exact same package shape as the catalog, via a prop.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Import the shared type, don't redefine it, and accept packages as a prop rather than owning your own copy.",
    pre_check_hint: `Dedicated filtered boards need isolated layout containers. Create the component file, import the shared ServicePackage type from PackageList, and export the LowPackageBoard function component.`,
    expected: `import type { ServicePackage } from "./PackageList";

type BoardProps = {
  packages: ServicePackage[];
};

export function LowPackageBoard({ packages }: BoardProps) {
  return <div />;
}
`,
    analog_example: `// src/components/RenewalWatchlist.tsx
import type { GymPass } from "./MembershipCatalog";

type WatchlistProps = {
  passes: GymPass[];
};

export function RenewalWatchlist({ passes }: WatchlistProps) {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Importing the blueprint from the catalog task ensures this filtered view always stays in sync with catalog data.`,
      pain: "A second, redefined copy of the type would silently drift the moment the real one gains a field.",
      mentalModel: MENTAL_MODEL,
      discover: `import type { ServicePackage } from "./PackageList";

type BoardProps = {
  packages: ServicePackage[];
};

export function LowPackageBoard({ packages }: BoardProps) {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Create file: src/components/LowPackageBoard.tsx.
2. Import type: ServicePackage from ./PackageList.
3. Define props: BoardProps { packages }.
4. Export shell: LowPackageBoard({ packages }).`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Derive a filtered subset of packages matching status === "low" or status === "empty".

Create a derived list variable that filters the master package array for low and empty statuses.

WHAT YOUR LOGIC NEEDS
- A .filter() call on the incoming packages prop.
- An exact status condition checking item.status === "low" || item.status === "empty".

Your task: compute lowPackages = packages.filter(pkg => pkg.status === "low" || pkg.status === "empty") — a new derived array, never a state setter, so the master catalog stays completely intact.`,
    hint: `1. Filter call: Declare const lowPackages = packages.filter(...).
2. Status check: Inside the callback, return pkg.status === "low" || pkg.status === "empty".
3. Do not mutate: Ensure you assign the result to a new const variable rather than calling a state setter.`,
    example_code: `const criticalPasses = passes.filter(
  (pass) => pass.status === "low" || pass.status === "empty"
);`,
    think_prompt: `Filtering as a derived calculation leaves the master catalog completely intact while isolating urgent items — no state setter, no mutation, just a computed const. What single expression turns the packages prop into just the low/empty ones?`,
    mc_options: [
      "const lowPackages = packages.filter((pkg) => pkg.status === \"low\" || pkg.status === \"empty\")",
      "packages.forEach to hide non-matching rows with CSS",
      "call setPackages to remove the healthy ones from the master list",
    ],
    mc_correct_option: "const lowPackages = packages.filter((pkg) => pkg.status === \"low\" || pkg.status === \"empty\")",
    mc_anchor: "const lowPackages = packages.filter((pkg",
    why_this_matters: `Filtering as a derived calculation leaves the master catalog completely intact while isolating urgent items.`,
    answer_keywords: ["lowPackages", "filter", "status", "low", "empty"],
    seed_code: `import type { ServicePackage } from "./PackageList";

type BoardProps = {
  packages: ServicePackage[];
};

export function LowPackageBoard({ packages }: BoardProps) {
  return <div />;
}
`,
    starter_code: `import type { ServicePackage } from "./PackageList";

type BoardProps = {
  packages: ServicePackage[];
};

export function LowPackageBoard({ packages }: BoardProps) {
  // derive lowPackages here
  return <div />;
}
`,
    feedback_correct: "Correct — the derived list is a fresh array, and packages itself is never touched.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Use .filter() into a new const — never a state setter, never mutating packages.",
    pre_check_hint: `Never filter by modifying the original array. Use .filter() on the packages prop to create a new derived array containing only items where status === "low" || status === "empty".`,
    expected: `import type { ServicePackage } from "./PackageList";

type BoardProps = {
  packages: ServicePackage[];
};

export function LowPackageBoard({ packages }: BoardProps) {
  const lowPackages = packages.filter((pkg) => pkg.status === "low" || pkg.status === "empty");
  return <div />;
}
`,
    analog_example: `const criticalPasses = passes.filter(
  (pass) => pass.status === "low" || pass.status === "empty"
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Filtering as a derived calculation leaves the master catalog completely intact while isolating urgent items.`,
      pain: "Mutating or re-storing the filtered result would fork it away from the live packages prop.",
      mentalModel: MENTAL_MODEL,
      discover: `const lowPackages = packages.filter((pkg) => pkg.status === "low" || pkg.status === "empty");`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Filter call: const lowPackages = packages.filter(...).
2. Status check: pkg.status === "low" || pkg.status === "empty".
3. Do not mutate: assign to a new const.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Render the low-balance cards, showing a healthy-balance banner if zero items match.

Render alert cards for low-balance packages, or a healthy status message when the list is empty.

WHAT YOUR LOGIC NEEDS
- A conditional check on lowPackages.length === 0.
- A positive fallback message when no cards are low.
- A list mapping that displays urgent card details.

Your task: add a heading, then render "All client packages have healthy balances." when lowPackages.length === 0, or a mapped alert card (key={pkg.id}) per low/empty package otherwise, showing client, service, remainingPunches, and status.`,
    hint: `1. Header: Add <h2>Low Balance & Empty Packages</h2> inside your container.
2. Check length: Evaluate lowPackages.length === 0 using a ternary operator.
3. Fallback: In the first branch, display <p>All client packages have healthy balances.</p>.
4. Render alerts: In the second branch, map over lowPackages, rendering client, service, remainingPunches, and status with key={pkg.id}.`,
    example_code: `return (
  <div>
    <h2>Renewal Alerts</h2>
    {criticalPasses.length === 0 ? (
      <p>All member accounts are in good standing.</p>
    ) : (
      criticalPasses.map((pass) => (
        <div key={pass.id} style={{ border: "1px solid orange" }}>
          <h4>{pass.member}</h4>
          <p>Remaining: {pass.remainingVisits} (Status: {pass.status})</p>
          <button>Offer Renewal</button>
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `Clear visual feedback when balances are healthy reassures reception staff that no renewals are currently overdue — the empty case here is a *good* outcome, not a broken one, so it deserves its own reassuring message rather than a generic "nothing here." What goes in each of the two branches?`,
    mc_options: [
      "branch on lowPackages.length === 0: a healthy-balance message, or mapped alert cards otherwise",
      "always render the alert cards, even when the filtered list is empty",
      "hide the whole board whenever any package is healthy",
    ],
    mc_correct_option: "branch on lowPackages.length === 0: a healthy-balance message, or mapped alert cards otherwise",
    mc_anchor: "branch on lowPackages.length === 0: a he",
    why_this_matters: `Clear visual feedback when balances are healthy reassures reception staff that no renewals are currently overdue.`,
    answer_keywords: ["lowPackages", "length", "map", "key", "healthy"],
    seed_code: `import type { ServicePackage } from "./PackageList";

type BoardProps = {
  packages: ServicePackage[];
};

export function LowPackageBoard({ packages }: BoardProps) {
  const lowPackages = packages.filter((pkg) => pkg.status === "low" || pkg.status === "empty");
  return <div />;
}
`,
    starter_code: `import type { ServicePackage } from "./PackageList";

type BoardProps = {
  packages: ServicePackage[];
};

export function LowPackageBoard({ packages }: BoardProps) {
  const lowPackages = packages.filter((pkg) => pkg.status === "low" || pkg.status === "empty");
  return (
    <div>
      {/* heading, then empty or list */}
    </div>
  );
}
`,
    feedback_correct: "Correct — the board shows alert cards or a reassuring healthy banner, never a blank space.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Branch on lowPackages.length === 0, with a distinctly positive message for the healthy case.",
    pre_check_hint: `Inspect the filtered array's length. If 0, render a positive notice: "All client packages have healthy balances." If items exist, map through lowPackages to render warning cards with client name, remaining punches, and status badges.`,
    expected: `import type { ServicePackage } from "./PackageList";

type BoardProps = {
  packages: ServicePackage[];
};

export function LowPackageBoard({ packages }: BoardProps) {
  const lowPackages = packages.filter((pkg) => pkg.status === "low" || pkg.status === "empty");

  return (
    <div>
      <h2>Low Balance & Empty Packages</h2>
      {lowPackages.length === 0 ? (
        <p>All client packages have healthy balances.</p>
      ) : (
        <ul>
          {lowPackages.map((pkg) => (
            <li key={pkg.id}>{pkg.client} — {pkg.service}: {pkg.remainingPunches} left ({pkg.status})</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `return (
  <div>
    <h2>Renewal Alerts</h2>
    {criticalPasses.length === 0 ? (
      <p>All member accounts are in good standing.</p>
    ) : (
      criticalPasses.map((pass) => (
        <div key={pass.id} style={{ border: "1px solid orange" }}>
          <h4>{pass.member}</h4>
          <p>Remaining: {pass.remainingVisits} (Status: {pass.status})</p>
          <button>Offer Renewal</button>
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Clear visual feedback when balances are healthy reassures reception staff that no renewals are currently overdue.`,
      pain: "A generic 'nothing here' message for a healthy catalog reads as broken, not good news.",
      mentalModel: MENTAL_MODEL,
      discover: `{lowPackages.length === 0 ? (
  <p>All client packages have healthy balances.</p>
) : (
  <ul>
    {lowPackages.map((pkg) => (
      <li key={pkg.id}>{pkg.client} — {pkg.service}: {pkg.remainingPunches} left ({pkg.status})</li>
    ))}
  </ul>
)}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Header: "Low Balance & Empty Packages".
2. Check length: lowPackages.length === 0.
3. Fallback: "All client packages have healthy balances."
4. Render alerts: key={pkg.id}.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Assemble PackageList, PunchLog, and LowPackageBoard together in src/pages/index.tsx with shared state.

Connect the catalog, punch logger, and alert board inside your main page to complete the full application workflow.

This step edits a different file: \`src/pages/index.tsx\` — create it if it doesn't already exist.

WHAT YOUR LOGIC NEEDS
- Root page imports for PackageList, PunchLog, and LowPackageBoard.
- A single packages state array declared at this parent level, shared across all three components.

Your task: in src/pages/index.tsx, hold packages/setPackages at the page level and render LowPackageBoard, PackageList, and PunchLog together so a punch redeemed in PunchLog updates the same catalog PackageList and LowPackageBoard both read from.`,
    hint: `1. Open root page: Edit src/pages/index.tsx.
2. Import components: Import PackageList, PunchLog, LowPackageBoard, and type ServicePackage.
3. Root state: Declare const [packages, setPackages] = useState<ServicePackage[]>([]).
4. Layout tree: Render <LowPackageBoard packages={packages} />, <PackageList packages={packages} setPackages={setPackages} />, and <PunchLog packages={packages} setPackages={setPackages} /> inside <main>.`,
    example_code: `// src/pages/index.tsx
import { useState } from "react";
import { MembershipCatalog, type GymPass } from "@/components/MembershipCatalog";
import { SessionAuditView } from "@/components/SessionAudit";
import { RenewalWatchlist } from "@/components/RenewalWatchlist";

export default function Home() {
  const [passes, setPasses] = useState<GymPass[]>([]);

  return (
    <main>
      <h1>Gym Desk Manager</h1>
      <RenewalWatchlist passes={passes} />
      <MembershipCatalog passes={passes} setPasses={setPasses} />
      <SessionAuditView passes={passes} setPasses={setPasses} />
    </main>
  );
}`,
    think_prompt: `Holding state in the parent view ensures that when a punch is redeemed in the punch log, the low-balance board updates instantly on the exact same screen — three components, one shared source of truth. What single state declaration, placed in the parent page, makes that possible?`,
    mc_options: [
      "declare packages/setPackages once in index.tsx, and pass them down as props to LowPackageBoard, PackageList, and PunchLog",
      "let each component keep its own separate packages state",
      "read packages fresh from an API call inside each component instead of sharing state",
    ],
    mc_correct_option: "declare packages/setPackages once in index.tsx, and pass them down as props to LowPackageBoard, PackageList, and PunchLog",
    mc_anchor: "declare packages/setPackages once in inde",
    why_this_matters: `Holding state in the parent view ensures that when a punch is redeemed, the low-balance board updates instantly on the exact same screen.`,
    answer_keywords: ["useState", "packages", "setPackages", "LowPackageBoard", "PackageList", "PunchLog"],
    seed_code: ``,
    starter_code: `import { useState } from "react";
// import PackageList, PunchLog, LowPackageBoard, and type ServicePackage here

export default function Home() {
  // shared packages state here
  return (
    <main>
      {/* LowPackageBoard, PackageList, PunchLog */}
    </main>
  );
}
`,
    feedback_correct: "Correct — one shared state, three components, and a punch in one instantly reflects in the others.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Hold packages/setPackages once at the page level and pass the same pair down to all three components.",
    pre_check_hint: `Bring all parts together. In your root page, import PackageList, PunchLog, and LowPackageBoard, maintain the master package state at this parent level, and pass data down so sales, punches, and alerts update simultaneously.`,
    expected: `import { useState } from "react";
import { PackageList, type ServicePackage } from "../components/PackageList";
import { PunchLog } from "../components/PunchLog";
import { LowPackageBoard } from "../components/LowPackageBoard";

export default function Home() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);

  return (
    <main>
      <h1>Package Desk</h1>
      <LowPackageBoard packages={packages} />
      <PackageList packages={packages} setPackages={setPackages} />
      <PunchLog packages={packages} setPackages={setPackages} />
    </main>
  );
}
`,
    analog_example: `// src/pages/index.tsx
import { useState } from "react";
import { MembershipCatalog, type GymPass } from "@/components/MembershipCatalog";
import { SessionAuditView } from "@/components/SessionAudit";
import { RenewalWatchlist } from "@/components/RenewalWatchlist";

export default function Home() {
  const [passes, setPasses] = useState<GymPass[]>([]);

  return (
    <main>
      <h1>Gym Desk Manager</h1>
      <RenewalWatchlist passes={passes} />
      <MembershipCatalog passes={passes} setPasses={setPasses} />
      <SessionAuditView passes={passes} setPasses={setPasses} />
    </main>
  );
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Holding state in the parent view ensures that when a punch is redeemed, the low-balance board updates instantly on the exact same screen.`,
      pain: "Three components each holding their own copy of packages would show three different, drifting answers to 'how many are low right now.'",
      mentalModel: MENTAL_MODEL,
      discover: `const [packages, setPackages] = useState<ServicePackage[]>([]);

<LowPackageBoard packages={packages} />
<PackageList packages={packages} setPackages={setPackages} />
<PunchLog packages={packages} setPackages={setPackages} />`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Open root page: src/pages/index.tsx.
2. Import components: PackageList, PunchLog, LowPackageBoard.
3. Root state: useState<ServicePackage[]>([]).
4. Layout tree: render all three with shared packages/setPackages.`,
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
