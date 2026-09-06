import createINPACTEngine from "../inpact_engine_shared";

const MENTAL_MODEL = `Build the redemption screen: pick a package, punch a visit off it, see the log:

  Log      →  each row is one PunchRecord (packageId, serviceName, timestamp)
  Empty    →  "No punches redeemed today" when the log has no items
  Select   →  a dropdown of active packages, disabled once the picked one is empty
  Redeem   →  append the punch log AND decrement the matching package's balance
`;

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-punch-log-list-form",
      title: "Punch log list + redeem form",
      body: MENTAL_MODEL,
      usecase: "Each visit is a punch off an existing package — a redemption receipt, not a new sale.",
      designMock: {"kind":"list-and-form","screenTitle":"Punches","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No punches redeemed today.","rows":[{"title":"Riley","subtitle":"Cut","meta":"Just now"},{"title":"Second row","subtitle":"Another","meta":"Just now"}],"fields":[{"label":"Package","sample":"Riley — Cut (3 left)"}],"submitLabel":"Redeem visit"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Create the component file, define type PunchRecord, and build the component shell.",
      "Hold punch logs in state and render redemption history entries or an empty state message.",
      "Build a redemption dropdown input and block submission if the selected package is empty.",
      "On redeem submit, record the punch, decrement the package's punch count, and update its status.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Create the component file at src/components/PunchLog.tsx, define type PunchRecord, and build the component shell.

Create src/components/PunchLog.tsx, define the PunchRecord type, and export the component shell.

WHAT YOUR BLUEPRINT NEEDS
- id (text)
- packageId (text)
- timestamp (text)
- serviceName (text)

Your task: write \`type PunchRecord\` with those four fields, then define and export PunchLog as a function component returning <div /> — every step from here on edits this same file.`,
    hint: `1. Create file: Add a new file at src/components/PunchLog.tsx.
2. Declare type: Replace SessionAudit with PunchRecord.
3. Define fields: Add id, packageId, timestamp, and serviceName, all typed as string.
4. Export component: Declare export function PunchLog() { return <div />; }.`,
    example_code: `// src/components/SessionAudit.tsx
export type SessionAudit = {
  id: string;
  passId: string;
  timestamp: string;
  activityName: string;
};

export function SessionAuditView() {
  return <div />;
}`,
    think_prompt: `Redemptions represent individual transaction slips, separate from the packages themselves — a PunchRecord doesn't hold a balance, it holds a receipt of one visit being used. What four fields does that receipt need, and what should the component be called?`,
    mc_options: [
      "Define type PunchRecord (id, packageId, timestamp, serviceName), then export function PunchLog() returning <div />",
      "Reuse ServicePackage for punch entries since they're related",
      "Skip the type and write JSX directly against untyped objects",
    ],
    mc_correct_option: "Define type PunchRecord (id, packageId, timestamp, serviceName), then export function PunchLog() returning <div />",
    mc_anchor: "Define type PunchRecord (id, packageId,",
    why_this_matters: `Typing the punch record guarantees transaction history retains the package link and service name cleanly.`,
    answer_keywords: ["export", "type", "PunchRecord", "packageId", "timestamp", "serviceName", "export", "function", "PunchLog"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the receipt shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a blueprint for one redemption receipt, then the empty component shell that will use it.",
    pre_check_hint: `Redemptions represent individual transaction slips. Create the file, define the PunchRecord type (id, packageId, timestamp, serviceName), and export the component function.`,
    expected: `export type PunchRecord = {
  id: string;
  packageId: string;
  timestamp: string;
  serviceName: string;
};

export function PunchLog() {
  return <div />;
}
`,
    analog_example: `// src/components/SessionAudit.tsx
export type SessionAudit = {
  id: string;
  passId: string;
  timestamp: string;
  activityName: string;
};

export function SessionAuditView() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Typing the punch record guarantees transaction history retains the package link and service name cleanly.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: MENTAL_MODEL,
      discover: `export type PunchRecord = {
  id: string;
  packageId: string;
  timestamp: string;
  serviceName: string;
};

export function PunchLog() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Create file: src/components/PunchLog.tsx.
2. Declare type: PunchRecord.
3. Define fields: id, packageId, timestamp, serviceName.
4. Export component: PunchLog() { return <div />; }`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Hold punch logs in state and render redemption history entries or an empty state message.

Create a state array to hold redemptions and display each logged punch row.

WHAT YOUR LOGIC NEEDS
- A useState array typed with PunchRecord.
- A conditional render checking punches.length === 0.
- A .map() of the logged redemption rows.

Your task: hold punches in useState<PunchRecord[]>([]), render "No punches redeemed today" when empty, and mapped rows (key={punch.id}) showing packageId, serviceName, and timestamp otherwise.`,
    hint: `1. State setup: Declare const [punches, setPunches] = useState<PunchRecord[]>([]).
2. Empty check: Use punches.length === 0 ? (...) : (...) in the JSX return.
3. Fallback: Render <p>No punches redeemed today</p> when empty.
4. Render rows: Map punches to display packageId, serviceName, and timestamp with key={punch.id}.`,
    example_code: `const [audits, setAudits] = useState<SessionAudit[]>([]);

return (
  <div>
    {audits.length === 0 ? (
      <p>No sessions redeemed today.</p>
    ) : (
      audits.map((a) => (
        <div key={a.id}>
          <p>Redeemed pass #{a.passId} ({a.activityName}) at {a.timestamp}</p>
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `Displaying logged punches reassures clients that their visit was successfully counted — but only once the base render works: what two branches does this need, and what does each punch row need to show?`,
    mc_options: [
      "useState for the log array; branch on punches.length === 0 before mapping rows with a stable key",
      "let punches = [] and mutate it directly on every redeem",
      "always render the mapped rows, even when the array is empty",
    ],
    mc_correct_option: "useState for the log array; branch on punches.length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the log array; branch on pu",
    why_this_matters: `Displaying logged punches reassures clients that their visit was successfully counted.`,
    answer_keywords: ["useState", "punches", "setPunches", "length", "map", "key"],
    seed_code: `export type PunchRecord = {
  id: string;
  packageId: string;
  timestamp: string;
  serviceName: string;
};

export function PunchLog() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type PunchRecord = {
  id: string;
  packageId: string;
  timestamp: string;
  serviceName: string;
};

export function PunchLog() {
  // log state here
  return (
    <div>
      {/* empty or list */}
    </div>
  );
}
`,
    feedback_correct: "Correct — the log is real state, and both the empty and populated cases are covered.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Log data must live in useState, and the render has to branch on length before mapping.",
    pre_check_hint: `Initialize a state array for punch logs. Check its length: if zero, show "No punches redeemed today"; if records exist, map over them to display timestamp and package details.`,
    expected: `import { useState } from "react";

export type PunchRecord = {
  id: string;
  packageId: string;
  timestamp: string;
  serviceName: string;
};

export function PunchLog() {
  const [punches, setPunches] = useState<PunchRecord[]>([]);
  return (
    <div>
      {punches.length === 0 ? (
        <p>No punches redeemed today.</p>
      ) : (
        <ul>
          {punches.map((punch) => (
            <li key={punch.id}>{punch.serviceName} — package {punch.packageId} at {punch.timestamp}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [audits, setAudits] = useState<SessionAudit[]>([]);

return (
  <div>
    {audits.length === 0 ? (
      <p>No sessions redeemed today.</p>
    ) : (
      audits.map((a) => (
        <div key={a.id}>
          <p>Redeemed pass #{a.passId} ({a.activityName}) at {a.timestamp}</p>
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Displaying logged punches reassures clients that their visit was successfully counted.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: MENTAL_MODEL,
      discover: `import { useState } from "react";

export type PunchRecord = {
  id: string;
  packageId: string;
  timestamp: string;
  serviceName: string;
};

export function PunchLog() {
  const [punches, setPunches] = useState<PunchRecord[]>([]);
  return (
    <div>
      {punches.length === 0 ? (
        <p>No punches redeemed today.</p>
      ) : (
        <ul>
          {punches.map((punch) => (
            <li key={punch.id}>{punch.serviceName} — package {punch.packageId} at {punch.timestamp}</li>
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
      build: `1. State setup: useState<PunchRecord[]>([]).
2. Empty check: punches.length === 0.
3. Fallback: "No punches redeemed today".
4. Render rows: key={punch.id}.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Build a redemption dropdown input and block submission if the selected package is empty.

Connect a package selection dropdown to state and disable redemption if the selected package has no visits left.

WHAT YOUR LOGIC NEEDS
- PunchLog accepts the active packages collection as a prop (packages / setPackages) — the same list Task 3's PackageList sells into.
- A state variable holding the selected package's id.
- A lookup finding the selected package object from packages.
- A disable flag: no package selected, or the selected one has remainingPunches <= 0.

Your task: accept packages/setPackages as props, add selectedPkgId state and a <select> populated from packages, look up the matching package, and disable the redeem button when it's empty or nothing is selected.`,
    hint: `1. Accept props: type PunchLogProps = { packages?: ServicePackage[]; setPackages?: ... }; export function PunchLog({ packages = [], setPackages = () => {} }: PunchLogProps) { ... }.
2. Selected state: Declare const [selectedPkgId, setSelectedPkgId] = useState("").
3. Find package: const activePkg = packages.find((p) => p.id === selectedPkgId).
4. Depleted check: Create a boolean flag const isDepleted = !activePkg || activePkg.remainingPunches <= 0.
5. Input bindings: Render a <select> updating selectedPkgId (with one <option> per package), and add disabled={isDepleted} to your submit button.`,
    example_code: `const [selectedPassId, setSelectedPassId] = useState("");
const currentPass = passes.find((p) => p.id === selectedPassId);
const isDepleted = currentPass ? currentPass.remainingVisits <= 0 : true;

<select value={selectedPassId} onChange={(e) => setSelectedPassId(e.target.value)}>
  <option value="">Select a pass</option>
  {passes.map((p) => (
    <option key={p.id} value={p.id}>
      {p.member} - {p.remainingVisits} left
    </option>
  ))}
</select>
<button disabled={isDepleted}>Redeem Visit</button>`,
    think_prompt: `Disabling the button immediately stops staff from attempting to punch a card that has no balance left — but PunchLog can only know that if it actually sees the same packages PackageList sold. Where does that shared data need to come from, and what two conditions make redemption unsafe?`,
    mc_options: [
      "accept packages as a prop, look it up by selectedPkgId, and disable when nothing is selected or remainingPunches <= 0",
      "keep a separate local copy of packages inside PunchLog",
      "only check remainingPunches after the redeem button is clicked",
    ],
    mc_correct_option: "accept packages as a prop, look it up by selectedPkgId, and disable when nothing is selected or remainingPunches <= 0",
    mc_anchor: "accept packages as a prop, look it up by",
    why_this_matters: `Disabling the button immediately stops staff from attempting to punch a card that has no balance left.`,
    answer_keywords: ["packages", "selectedPkgId", "find", "remainingPunches", "disabled"],
    seed_code: `import { useState } from "react";

export type PunchRecord = {
  id: string;
  packageId: string;
  timestamp: string;
  serviceName: string;
};

export function PunchLog() {
  const [punches, setPunches] = useState<PunchRecord[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";
import type { ServicePackage } from "./PackageList";

export type PunchRecord = {
  id: string;
  packageId: string;
  timestamp: string;
  serviceName: string;
};

type PunchLogProps = {
  packages?: ServicePackage[];
  setPackages?: React.Dispatch<React.SetStateAction<ServicePackage[]>>;
};

export function PunchLog({ packages = [], setPackages = () => {} }: PunchLogProps) {
  const [punches, setPunches] = useState<PunchRecord[]>([]);
  // selected package state + dropdown here
  return (
    <form>
      {/* select + submit */}
    </form>
  );
}
`,
    feedback_correct: "Correct — the dropdown is wired to the shared packages prop, and depleted cards are correctly blocked.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "PunchLog needs the real packages via props, a selected-id state, and a disabled flag driven by remainingPunches.",
    pre_check_hint: `Create a controlled select input allowing staff to choose which package to punch. If the selected package has remainingPunches <= 0, disable the redeem button to prevent redemption. Default packages to [] and setPackages to a no-op so this component is still safe to preview before it's wired to a real catalog.`,
    expected: `import { useState } from "react";
import type { ServicePackage } from "./PackageList";

export type PunchRecord = {
  id: string;
  packageId: string;
  timestamp: string;
  serviceName: string;
};

type PunchLogProps = {
  packages?: ServicePackage[];
  setPackages?: React.Dispatch<React.SetStateAction<ServicePackage[]>>;
};

export function PunchLog({ packages = [], setPackages = () => {} }: PunchLogProps) {
  const [punches, setPunches] = useState<PunchRecord[]>([]);
  const [selectedPkgId, setSelectedPkgId] = useState("");
  const activePkg = packages.find((p) => p.id === selectedPkgId);
  const isDepleted = !activePkg || activePkg.remainingPunches <= 0;

  return (
    <form>
      <select value={selectedPkgId} onChange={(e) => setSelectedPkgId(e.target.value)}>
        <option value="">Select a package</option>
        {packages.map((p) => (
          <option key={p.id} value={p.id}>
            {p.client} — {p.service} ({p.remainingPunches} left)
          </option>
        ))}
      </select>
      <button type="submit" disabled={isDepleted}>Redeem visit</button>
    </form>
  );
}
`,
    analog_example: `const [selectedPassId, setSelectedPassId] = useState("");
const currentPass = passes.find((p) => p.id === selectedPassId);
const isDepleted = currentPass ? currentPass.remainingVisits <= 0 : true;

<select value={selectedPassId} onChange={(e) => setSelectedPassId(e.target.value)}>
  <option value="">Select a pass</option>
  {passes.map((p) => (
    <option key={p.id} value={p.id}>
      {p.member} - {p.remainingVisits} left
    </option>
  ))}
</select>
<button disabled={isDepleted}>Redeem Visit</button>`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Disabling the button immediately stops staff from attempting to punch a card that has no balance left.`,
      pain: "A dropdown with its own copy of package data would drift out of sync with what PackageList actually sold.",
      mentalModel: MENTAL_MODEL,
      discover: `const activePkg = packages.find((p) => p.id === selectedPkgId);
const isDepleted = !activePkg || activePkg.remainingPunches <= 0;

<button type="submit" disabled={isDepleted}>Redeem visit</button>`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Accept props: packages, setPackages.
2. Selected state: selectedPkgId.
3. Find package: packages.find(...).
4. Depleted check: !activePkg || remainingPunches <= 0.
5. Input bindings: <select> + disabled button.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `On redeem submit, record the punch, decrement the package's punch count, and update its status.

Append the redemption record to history and deduct 1 visit from the package in state.

WHAT YOUR LOGIC NEEDS
- A submit interceptor with e.preventDefault(), guarded so it does nothing when activePkg is missing or already depleted.
- A new PunchRecord appended to punches state.
- A package balance update via setPackages, decrementing remainingPunches by 1 and recomputing status ("empty" if it hits 0, "low" if <= 2, else "ok") for the matching package only.

Your task: on submit, guard against a missing/depleted package, append a new PunchRecord to punches, and update the matching package in the packages prop's state — decrement its remainingPunches and recompute its status without touching any other package.`,
    hint: `1. Halt refresh: Call e.preventDefault() at the top of handleRedeem.
2. Guard: If !activePkg || activePkg.remainingPunches <= 0, return early.
3. Append log: Create a PunchRecord and append it using setPunches((prev) => [...prev, newPunch]).
4. Deduct balance: Use setPackages(prev => prev.map(...)) to decrement remainingPunches by 1 and update status to "empty" or "low" where p.id === activePkg.id.`,
    example_code: `function handleRedeem(e: React.FormEvent) {
  e.preventDefault();
  if (!currentPass || currentPass.remainingVisits <= 0) return;

  const log: SessionAudit = {
    id: \`audit-\${Date.now()}\`,
    passId: currentPass.id,
    activityName: currentPass.activity,
    timestamp: new Date().toLocaleTimeString(),
  };
  setAudits((prev) => [...prev, log]);

  setPasses((prev) =>
    prev.map((p) => {
      if (p.id !== currentPass.id) return p;
      const nextRemaining = p.remainingVisits - 1;
      return {
        ...p,
        remainingVisits: nextRemaining,
        status: nextRemaining <= 0 ? "empty" : nextRemaining <= 2 ? "low" : "ok",
      };
    })
  );
}`,
    think_prompt: `Synchronizing the punch log and the package balance in memory ensures immediate visual confirmation on screen. Given .map() never mutates the original array, how do you update exactly one package's remainingPunches and status while leaving every other package in the shared list untouched?`,
    mc_options: [
      "guard against a missing/depleted package, append the log, then setPackages(prev => prev.map(...)) updating only the matching id",
      "mutate activePkg.remainingPunches directly, then re-render",
      "delete the package from state once it's redeemed",
    ],
    mc_correct_option: "guard against a missing/depleted package, append the log, then setPackages(prev => prev.map(...)) updating only the matching id",
    mc_anchor: "guard against a missing/depleted package,",
    why_this_matters: `Synchronizing the punch log and the package balance in memory ensures immediate visual confirmation on screen.`,
    answer_keywords: ["preventDefault", "setPunches", "setPackages", "map", "remainingPunches", "status"],
    seed_code: `import { useState } from "react";
import type { ServicePackage } from "./PackageList";

export type PunchRecord = {
  id: string;
  packageId: string;
  timestamp: string;
  serviceName: string;
};

type PunchLogProps = {
  packages?: ServicePackage[];
  setPackages?: React.Dispatch<React.SetStateAction<ServicePackage[]>>;
};

export function PunchLog({ packages = [], setPackages = () => {} }: PunchLogProps) {
  const [punches, setPunches] = useState<PunchRecord[]>([]);
  const [selectedPkgId, setSelectedPkgId] = useState("");
  const activePkg = packages.find((p) => p.id === selectedPkgId);
  const isDepleted = !activePkg || activePkg.remainingPunches <= 0;

  return (
    <div>
      {punches.length === 0 ? <p>No punches redeemed today.</p> : <ul>{punches.map((p) => <li key={p.id}>{p.serviceName} — package {p.packageId} at {p.timestamp}</li>)}</ul>}
      <form>
        <select value={selectedPkgId} onChange={(e) => setSelectedPkgId(e.target.value)}>
          <option value="">Select a package</option>
          {packages.map((p) => (
            <option key={p.id} value={p.id}>{p.client} — {p.service} ({p.remainingPunches} left)</option>
          ))}
        </select>
        <button type="submit" disabled={isDepleted}>Redeem visit</button>
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";
import type { ServicePackage } from "./PackageList";

export type PunchRecord = {
  id: string;
  packageId: string;
  timestamp: string;
  serviceName: string;
};

type PunchLogProps = {
  packages?: ServicePackage[];
  setPackages?: React.Dispatch<React.SetStateAction<ServicePackage[]>>;
};

export function PunchLog({ packages = [], setPackages = () => {} }: PunchLogProps) {
  const [punches, setPunches] = useState<PunchRecord[]>([]);
  const [selectedPkgId, setSelectedPkgId] = useState("");
  const activePkg = packages.find((p) => p.id === selectedPkgId);
  const isDepleted = !activePkg || activePkg.remainingPunches <= 0;

  function handleRedeem(e: React.FormEvent) {
    // redeem
  }

  return (
    <div>
      {punches.length === 0 ? <p>No punches redeemed today.</p> : <ul>{punches.map((p) => <li key={p.id}>{p.serviceName} — package {p.packageId} at {p.timestamp}</li>)}</ul>}
      <form onSubmit={handleRedeem}>
        <select value={selectedPkgId} onChange={(e) => setSelectedPkgId(e.target.value)}>
          <option value="">Select a package</option>
          {packages.map((p) => (
            <option key={p.id} value={p.id}>{p.client} — {p.service} ({p.remainingPunches} left)</option>
          ))}
        </select>
        <button type="submit" disabled={isDepleted}>Redeem visit</button>
      </form>
    </div>
  );
}
`,
    feedback_correct: "Correct — the punch is logged, and exactly one package's balance and status update in place.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Guard the depleted case, append the log, then update only the matching package via .map().",
    pre_check_hint: `In the submission handler, create a new PunchRecord, append it to punch state, and update the matching package by subtracting 1 from remainingPunches and setting status to "empty" (if 0) or "low" (if <= 2).`,
    expected: `import { useState } from "react";
import type { ServicePackage } from "./PackageList";

export type PunchRecord = {
  id: string;
  packageId: string;
  timestamp: string;
  serviceName: string;
};

type PunchLogProps = {
  packages?: ServicePackage[];
  setPackages?: React.Dispatch<React.SetStateAction<ServicePackage[]>>;
};

export function PunchLog({ packages = [], setPackages = () => {} }: PunchLogProps) {
  const [punches, setPunches] = useState<PunchRecord[]>([]);
  const [selectedPkgId, setSelectedPkgId] = useState("");
  const activePkg = packages.find((p) => p.id === selectedPkgId);
  const isDepleted = !activePkg || activePkg.remainingPunches <= 0;

  function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!activePkg || activePkg.remainingPunches <= 0) return;

    const log: PunchRecord = {
      id: \`punch-\${Date.now()}\`,
      packageId: activePkg.id,
      serviceName: activePkg.service,
      timestamp: new Date().toLocaleTimeString(),
    };
    setPunches((prev) => [...prev, log]);

    setPackages((prev) =>
      prev.map((p) => {
        if (p.id !== activePkg.id) return p;
        const nextRemaining = p.remainingPunches - 1;
        return {
          ...p,
          remainingPunches: nextRemaining,
          status: nextRemaining <= 0 ? "empty" : nextRemaining <= 2 ? "low" : "ok",
        };
      })
    );
    setSelectedPkgId("");
  }

  return (
    <div>
      {punches.length === 0 ? (
        <p>No punches redeemed today.</p>
      ) : (
        <ul>
          {punches.map((p) => (
            <li key={p.id}>{p.serviceName} — package {p.packageId} at {p.timestamp}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleRedeem}>
        <select value={selectedPkgId} onChange={(e) => setSelectedPkgId(e.target.value)}>
          <option value="">Select a package</option>
          {packages.map((p) => (
            <option key={p.id} value={p.id}>{p.client} — {p.service} ({p.remainingPunches} left)</option>
          ))}
        </select>
        <button type="submit" disabled={isDepleted}>Redeem visit</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function handleRedeem(e: React.FormEvent) {
  e.preventDefault();
  if (!currentPass || currentPass.remainingVisits <= 0) return;

  const log: SessionAudit = {
    id: \`audit-\${Date.now()}\`,
    passId: currentPass.id,
    activityName: currentPass.activity,
    timestamp: new Date().toLocaleTimeString(),
  };
  setAudits((prev) => [...prev, log]);

  setPasses((prev) =>
    prev.map((p) => {
      if (p.id !== currentPass.id) return p;
      const nextRemaining = p.remainingVisits - 1;
      return {
        ...p,
        remainingVisits: nextRemaining,
        status: nextRemaining <= 0 ? "empty" : nextRemaining <= 2 ? "low" : "ok",
      };
    })
  );
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Synchronizing the punch log and the package balance in memory ensures immediate visual confirmation on screen.`,
      pain: "Forgetting the depleted guard would let a double-click redeem the same last punch twice, driving a balance negative.",
      mentalModel: MENTAL_MODEL,
      discover: `setPackages((prev) =>
  prev.map((p) => {
    if (p.id !== activePkg.id) return p;
    const nextRemaining = p.remainingPunches - 1;
    return {
      ...p,
      remainingPunches: nextRemaining,
      status: nextRemaining <= 0 ? "empty" : nextRemaining <= 2 ? "low" : "ok",
    };
  })
);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Halt refresh: e.preventDefault().
2. Guard: return early if depleted/missing.
3. Append log: setPunches((prev) => [...prev, log]).
4. Deduct balance: setPackages(prev => prev.map(...)) on the matching id only.`,
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
  title: "Punch log list + redeem form",
  shortName: "Punch FE",
});
