import createINPACTEngine from "../inpact_engine_shared";

const MENTAL_MODEL = `Build a board that shows an existing catalog, filtered by status:

  State    →  the full catalog of packages already sold
  Filter   →  a Status dropdown (All/Low/OK), defaulting to Low
  Derive   →  .filter() computes the visible rows — the full catalog never changes
  Empty    →  a message when nothing matches the current filter
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
      designMock: {"kind":"list-and-form","screenTitle":"Low-balance packages","meansExplainer":"you need to add a filter dropdown that lets the user narrow the package rows by status (All, Low, OK).","caption":"This is the screen you are building. Match the pieces — list, empty message, filter — not the brand colors. Try filtering by status.","listCaption":"LIST — sample packages","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No low-balance packages.","rows":[{"title":"Riley","subtitle":"Cut","meta":"Low"},{"title":"Jordan","subtitle":"Color","meta":"OK"}],"fields":[{"label":"Status","options":["All","Low","OK"]}],"formMode":"filter","submitLabel":"Filter"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Define the package blueprint and seed the full catalog into state — every package the shop has sold, not just the low ones.",
      "Render every package in the catalog as a row, or a friendly message when the catalog is empty.",
      "Add a Status dropdown so staff can choose which packages the board shows.",
      "Derive the visible rows from the selected status, without ever changing the full catalog in state.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Define the package blueprint and seed the full catalog into state — every package the shop has sold, not just the low ones.

Define a ServicePackage type (id, client, service, status) and seed a full state array with a few sample packages — a mix of Low and OK statuses — then build the empty board shell.

WHAT YOUR BLUEPRINT NEEDS
- id (text identifier)
- client (text)
- service (text)
- status (text — "Low" or "OK")

Your task: write \`type ServicePackage\` with those four fields, then seed useState with 2-3 sample packages (not an empty array — this board is a new view onto packages that already exist) and return an empty <div /> shell.`,
    hint: `1. Create the file: Create a new file named LowPackageBoard.tsx in your components folder.
2. Define the blueprint: Write type ServicePackage with id, client, service, and status, all strings.
3. Seed real data: Call useState<ServicePackage[]>([...]) with 2-3 sample packages, giving some "Low" status and at least one "OK" — an empty array would misrepresent a shop that has already sold packages.
4. Return the shell: Return an empty <div /> for now.`,
    example_code: `// GuestList.tsx
export type Guest = {
  id: string;
  name: string;
  note: string;
};

export function GuestList() {
  const [guests] = useState<Guest[]>([
    { id: "1", name: "Riley", note: "VIP" },
    { id: "2", name: "Jordan", note: "" },
  ]);
  return <div />;
}`,
    think_prompt: `This board doesn't create anything new — it's a filtered view onto packages a shop has already sold. That means state needs to start with real sample rows, not an empty array, the same way a page showing "today's appointments" wouldn't start blank on a real day. What four fields does one package record need, and what should the starting state look like?`,
    mc_options: [
      "Define type ServicePackage (id, client, service, status), seed useState with a few sample packages, then export function LowPackageBoard() returning <div />",
      "Start state as an empty array since packages will be added later",
      "Skip the type and store packages as untyped objects",
    ],
    mc_correct_option: "Define type ServicePackage (id, client, service, status), seed useState with a few sample packages, then export function LowPackageBoard() returning <div />",
    mc_anchor: "Define type ServicePackage (id, client, s",
    why_this_matters: `Seeding the full catalog into state up front matches the real business rule — every package already sold stays in memory here; nothing on this board ever creates a new one.`,
    answer_keywords: ["export", "type", "ServicePackage", "client", "service", "status", "useState", "export", "function", "LowPackageBoard"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the blueprint exists and state already holds the full sample catalog, not an empty list.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "This board reads an existing catalog — seed real sample packages into state, don't start empty.",
    pre_check_hint: `Create a new file at \`src/components/LowPackageBoard.tsx\` — it doesn't exist yet. A TypeScript type lists every field a package record has; useState seeded with real starting values (not an empty array) represents the shop's full catalog already in memory.`,
    expected: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: "Low" | "OK";
};

export function LowPackageBoard() {
  const [packages] = useState<ServicePackage[]>([
    { id: "1", client: "Riley", service: "Cut", status: "Low" },
    { id: "2", client: "Jordan", service: "Color", status: "OK" },
    { id: "3", client: "Sam", service: "Trim", status: "Low" },
  ]);
  return <div />;
}
`,
    analog_example: `export type Guest = {
  id: string;
  name: string;
  note: string;
};

export function GuestList() {
  const [guests] = useState<Guest[]>([
    { id: "1", name: "Riley", note: "VIP" },
    { id: "2", name: "Jordan", note: "" },
  ]);
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Seeding the full catalog into state up front matches the real business rule — every package already sold stays in memory here; nothing on this board ever creates a new one.`,
      pain: "Starting state empty would misrepresent a shop that already has sold packages, and every later step would build on a lie.",
      mentalModel: MENTAL_MODEL,
      discover: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: "Low" | "OK";
};

export function LowPackageBoard() {
  const [packages] = useState<ServicePackage[]>([
    { id: "1", client: "Riley", service: "Cut", status: "Low" },
    { id: "2", client: "Jordan", service: "Color", status: "OK" },
    { id: "3", client: "Sam", service: "Trim", status: "Low" },
  ]);
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Create the file: src/components/LowPackageBoard.tsx.
2. Define the blueprint: type ServicePackage { id, client, service, status }.
3. Seed real data: useState with 2-3 sample packages (mixed Low/OK).
4. Return the shell: <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Render every package in the catalog as a row, or a friendly message when the catalog is empty.

Render all packages as rows (client, service, status), with a fallback message only when there are zero packages at all.

WHAT YOUR LOGIC NEEDS
- A conditional check on packages.length === 0.
- A fallback message for the true-empty case.
- A .map() loop rendering each package as a row with a stable key.

Your task: render "No packages sold yet." when packages.length === 0, and a mapped row (key={p.id}) for every package otherwise — no filtering yet, this step is just proving the full catalog renders correctly.`,
    hint: `1. Check for empty: Write a ternary checking packages.length === 0.
2. Add the fallback: In that branch, render a message like <p>No packages sold yet.</p>.
3. Loop through entries: In the other branch, use .map() to render a row per package, with key={p.id}.`,
    example_code: `return (
  <div>
    {guests.length === 0 ? (
      <p>No guests yet.</p>
    ) : (
      <ul>
        {guests.map((g) => (
          <li key={g.id}>{g.name} — {g.note}</li>
        ))}
      </ul>
    )}
  </div>
);`,
    think_prompt: `Before adding any filter, the full catalog itself needs to render correctly — every package, exactly as it's stored in state. Only once that's proven does it make sense to narrow what's shown. What two branches does this render need, and what goes in each?`,
    mc_options: [
      "branch on packages.length === 0 before mapping every package with a stable key",
      "always render the mapped rows, even when the array is empty",
      "check for empty only after mapping",
    ],
    mc_correct_option: "branch on packages.length === 0 before mapping every package with a stable key",
    mc_anchor: "branch on packages.length === 0 before m",
    why_this_matters: `Rendering the full list first, before any filtering, confirms your state and rows work before adding filter logic on top of them.`,
    answer_keywords: ["packages", "length", "map", "key"],
    seed_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: "Low" | "OK";
};

export function LowPackageBoard() {
  const [packages] = useState<ServicePackage[]>([
    { id: "1", client: "Riley", service: "Cut", status: "Low" },
    { id: "2", client: "Jordan", service: "Color", status: "OK" },
    { id: "3", client: "Sam", service: "Trim", status: "Low" },
  ]);
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: "Low" | "OK";
};

export function LowPackageBoard() {
  const [packages] = useState<ServicePackage[]>([
    { id: "1", client: "Riley", service: "Cut", status: "Low" },
    { id: "2", client: "Jordan", service: "Color", status: "OK" },
    { id: "3", client: "Sam", service: "Trim", status: "Low" },
  ]);
  return (
    <div>
      {/* empty or list */}
    </div>
  );
}
`,
    feedback_correct: "Correct — the full catalog renders, and the true-empty case has its own message.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Render every package for now — no filtering yet, just prove the list and empty state work.",
    pre_check_hint: `Before filtering anything, prove the full list renders: check packages.length === 0 for the true-empty case, otherwise map every package to a row with a stable key.`,
    expected: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: "Low" | "OK";
};

export function LowPackageBoard() {
  const [packages] = useState<ServicePackage[]>([
    { id: "1", client: "Riley", service: "Cut", status: "Low" },
    { id: "2", client: "Jordan", service: "Color", status: "OK" },
    { id: "3", client: "Sam", service: "Trim", status: "Low" },
  ]);
  return (
    <div>
      {packages.length === 0 ? (
        <p>No packages sold yet.</p>
      ) : (
        <ul>
          {packages.map((p) => (
            <li key={p.id}>{p.client} — {p.service} ({p.status})</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `return (
  <div>
    {guests.length === 0 ? (
      <p>No guests yet.</p>
    ) : (
      <ul>
        {guests.map((g) => (
          <li key={g.id}>{g.name} — {g.note}</li>
        ))}
      </ul>
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Rendering the full list first, before any filtering, confirms your state and rows work before adding filter logic on top of them.`,
      pain: "Adding a filter before the base render works makes it impossible to tell which part is actually broken.",
      mentalModel: MENTAL_MODEL,
      discover: `{packages.length === 0 ? (
  <p>No packages sold yet.</p>
) : (
  <ul>
    {packages.map((p) => (
      <li key={p.id}>{p.client} — {p.service} ({p.status})</li>
    ))}
  </ul>
)}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Check for empty: packages.length === 0.
2. Add the fallback: "No packages sold yet."
3. Loop through entries: .map() with key={p.id}.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Add a Status dropdown so staff can choose which packages the board shows.

Add a status filter state (defaulting to "Low", since this is the low-balance board) and a dropdown with options All/Low/OK wired to it.

WHAT YOUR LOGIC NEEDS
- A string state for the selected status, default "Low".
- A <select> with options All, Low, OK.
- value and onChange wired to that state.

Your task: add statusFilter state defaulting to "Low", and a <select> above the list with those three options, wired the same controlled way as any text input.`,
    hint: `1. Add the state: const [statusFilter, setStatusFilter] = useState("Low").
2. Add the dropdown: A <select> element with three <option> children — All, Low, OK.
3. Wire it up: value={statusFilter} and onChange={(e) => setStatusFilter(e.target.value)}.`,
    example_code: `const [role, setRole] = useState("All");

<select value={role} onChange={(e) => setRole(e.target.value)}>
  <option value="All">All</option>
  <option value="Admin">Admin</option>
  <option value="Member">Member</option>
</select>`,
    think_prompt: `A dropdown's selected value is just another piece of state — value reads it back, onChange writes new selections into it, the exact same controlled pattern as a text input, just with a fixed set of choices instead of free text. Where does the selected status need to live, and what should it default to on a board specifically about low balances?`,
    mc_options: [
      "useState defaulting to \"Low\"; a <select> with All/Low/OK wired via value and onChange",
      "read the selected option only when a button is clicked",
      "store the selection in a plain variable outside the component",
    ],
    mc_correct_option: "useState defaulting to \"Low\"; a <select> with All/Low/OK wired via value and onChange",
    mc_anchor: "useState defaulting to \"Low\"; a <select>",
    why_this_matters: `Defaulting the filter to Low means the board opens already showing what staff care about most, while a dropdown still lets them see everything when they need to.`,
    answer_keywords: ["useState", "statusFilter", "select", "option", "onChange"],
    seed_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: "Low" | "OK";
};

export function LowPackageBoard() {
  const [packages] = useState<ServicePackage[]>([
    { id: "1", client: "Riley", service: "Cut", status: "Low" },
    { id: "2", client: "Jordan", service: "Color", status: "OK" },
    { id: "3", client: "Sam", service: "Trim", status: "Low" },
  ]);
  return (
    <div>
      {packages.length === 0 ? (
        <p>No packages sold yet.</p>
      ) : (
        <ul>
          {packages.map((p) => (
            <li key={p.id}>{p.client} — {p.service} ({p.status})</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: "Low" | "OK";
};

export function LowPackageBoard() {
  const [packages] = useState<ServicePackage[]>([
    { id: "1", client: "Riley", service: "Cut", status: "Low" },
    { id: "2", client: "Jordan", service: "Color", status: "OK" },
    { id: "3", client: "Sam", service: "Trim", status: "Low" },
  ]);
  // status filter state + dropdown here
  return (
    <div>
      {packages.length === 0 ? (
        <p>No packages sold yet.</p>
      ) : (
        <ul>
          {packages.map((p) => (
            <li key={p.id}>{p.client} — {p.service} ({p.status})</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    feedback_correct: "Correct — the dropdown exists and is wired to state, defaulting to Low.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "A dropdown is a controlled input too — value from state, onChange writes back to it.",
    pre_check_hint: `A dropdown's selected value is just another piece of state — value reads it back out, and onChange is the only place that ever changes it, same controlled-input pattern as any text field.`,
    expected: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: "Low" | "OK";
};

export function LowPackageBoard() {
  const [packages] = useState<ServicePackage[]>([
    { id: "1", client: "Riley", service: "Cut", status: "Low" },
    { id: "2", client: "Jordan", service: "Color", status: "OK" },
    { id: "3", client: "Sam", service: "Trim", status: "Low" },
  ]);
  const [statusFilter, setStatusFilter] = useState("Low");
  return (
    <div>
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Low">Low</option>
        <option value="OK">OK</option>
      </select>
      {packages.length === 0 ? (
        <p>No packages sold yet.</p>
      ) : (
        <ul>
          {packages.map((p) => (
            <li key={p.id}>{p.client} — {p.service} ({p.status})</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [role, setRole] = useState("All");

<select value={role} onChange={(e) => setRole(e.target.value)}>
  <option value="All">All</option>
  <option value="Admin">Admin</option>
  <option value="Member">Member</option>
</select>`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Defaulting the filter to Low means the board opens already showing what staff care about most, while a dropdown still lets them see everything when they need to.`,
      pain: "A dropdown that isn't wired to state can't drive what the list shows — it would just be decoration.",
      mentalModel: MENTAL_MODEL,
      discover: `const [statusFilter, setStatusFilter] = useState("Low");

<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
  <option value="All">All</option>
  <option value="Low">Low</option>
  <option value="OK">OK</option>
</select>`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Add the state: useState("Low").
2. Add the dropdown: <select> with All/Low/OK options.
3. Wire it up: value={statusFilter}, onChange updates it.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Derive the visible rows from the selected status, without ever changing the full catalog in state.

Compute a filtered list from packages and statusFilter (show everything when statusFilter is "All"), and use that filtered list for both the empty check and the row rendering.

WHAT YOUR LOGIC NEEDS
- A derived array: packages filtered by statusFilter, showing everything when statusFilter is "All".
- The derived array's length driving the empty check.
- The derived array (not packages) used in the .map() render.
- A message specifically for "nothing matches the current filter".

Your task: compute visible from packages and statusFilter, and swap every packages.length/packages.map() reference over to visible so the board actually reacts to the dropdown.`,
    hint: `1. Compute the derived list: const visible = packages.filter((p) => statusFilter === "All" || p.status === statusFilter);
2. Update the empty check: use visible.length === 0 instead of packages.length === 0.
3. Update the render: map over visible instead of packages.
4. Update the message: something like "No packages match this filter." — distinct from the true-empty message from Step 2.`,
    example_code: `const visible = guests.filter((g) => tag === "All" || g.tag === tag);

return (
  <div>
    {visible.length === 0 ? (
      <p>No guests match this filter.</p>
    ) : (
      <ul>
        {visible.map((g) => (
          <li key={g.id}>{g.name}</li>
        ))}
      </ul>
    )}
  </div>
);`,
    think_prompt: `.filter() always returns a brand-new array and never touches the one it was called on — so the full catalog stays in state exactly as sold, and the array you check for "nothing matches" and then map over is the filtered one, never the original. Given that, what single expression turns packages + statusFilter into the rows the board should actually show?`,
    mc_options: [
      "packages.filter((p) => statusFilter === \"All\" || p.status === statusFilter), used for both the empty check and the map",
      "packages.forEach to hide non-matching rows with CSS",
      "mutate packages directly to remove rows that don't match",
    ],
    mc_correct_option: "packages.filter((p) => statusFilter === \"All\" || p.status === statusFilter), used for both the empty check and the map",
    mc_anchor: "packages.filter((p) => statusFilter ===",
    why_this_matters: `Deriving the visible rows on every render — instead of filtering once and storing the result — means the board always reflects the latest dropdown selection with no risk of showing stale data.`,
    answer_keywords: ["visible", "filter", "statusFilter", "length", "map"],
    seed_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: "Low" | "OK";
};

export function LowPackageBoard() {
  const [packages] = useState<ServicePackage[]>([
    { id: "1", client: "Riley", service: "Cut", status: "Low" },
    { id: "2", client: "Jordan", service: "Color", status: "OK" },
    { id: "3", client: "Sam", service: "Trim", status: "Low" },
  ]);
  const [statusFilter, setStatusFilter] = useState("Low");
  return (
    <div>
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Low">Low</option>
        <option value="OK">OK</option>
      </select>
      {packages.length === 0 ? (
        <p>No packages sold yet.</p>
      ) : (
        <ul>
          {packages.map((p) => (
            <li key={p.id}>{p.client} — {p.service} ({p.status})</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: "Low" | "OK";
};

export function LowPackageBoard() {
  const [packages] = useState<ServicePackage[]>([
    { id: "1", client: "Riley", service: "Cut", status: "Low" },
    { id: "2", client: "Jordan", service: "Color", status: "OK" },
    { id: "3", client: "Sam", service: "Trim", status: "Low" },
  ]);
  const [statusFilter, setStatusFilter] = useState("Low");
  // derive visible from packages + statusFilter here
  return (
    <div>
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Low">Low</option>
        <option value="OK">OK</option>
      </select>
      {packages.length === 0 ? (
        <p>No packages sold yet.</p>
      ) : (
        <ul>
          {packages.map((p) => (
            <li key={p.id}>{p.client} — {p.service} ({p.status})</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    feedback_correct: "Correct — the board now actually reacts to the dropdown, and the full catalog in state never changes.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Derive a filtered array from packages + statusFilter, and use that derived array everywhere the render currently reads packages.",
    pre_check_hint: `.filter() always returns a brand-new array and never touches the one it was called on — so the full catalog stays in state exactly as sold, and the array you check for "nothing matches" and then map over is the filtered one, never the original.`,
    expected: `import { useState } from "react";

export type ServicePackage = {
  id: string;
  client: string;
  service: string;
  status: "Low" | "OK";
};

export function LowPackageBoard() {
  const [packages] = useState<ServicePackage[]>([
    { id: "1", client: "Riley", service: "Cut", status: "Low" },
    { id: "2", client: "Jordan", service: "Color", status: "OK" },
    { id: "3", client: "Sam", service: "Trim", status: "Low" },
  ]);
  const [statusFilter, setStatusFilter] = useState("Low");
  const visible = packages.filter((p) => statusFilter === "All" || p.status === statusFilter);

  return (
    <div>
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Low">Low</option>
        <option value="OK">OK</option>
      </select>
      {visible.length === 0 ? (
        <p>No packages match this filter.</p>
      ) : (
        <ul>
          {visible.map((p) => (
            <li key={p.id}>{p.client} — {p.service} ({p.status})</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const visible = guests.filter((g) => tag === "All" || g.tag === tag);

return (
  <div>
    {visible.length === 0 ? (
      <p>No guests match this filter.</p>
    ) : (
      <ul>
        {visible.map((g) => (
          <li key={g.id}>{g.name}</li>
        ))}
      </ul>
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Deriving the visible rows on every render — instead of filtering once and storing the result — means the board always reflects the latest dropdown selection with no risk of showing stale data.`,
      pain: "Filtering into a second state variable instead of deriving it fresh each render risks the two falling out of sync the moment either one changes.",
      mentalModel: MENTAL_MODEL,
      discover: `const visible = packages.filter((p) => statusFilter === "All" || p.status === statusFilter);

{visible.length === 0 ? (
  <p>No packages match this filter.</p>
) : (
  <ul>
    {visible.map((p) => (
      <li key={p.id}>{p.client} — {p.service} ({p.status})</li>
    ))}
  </ul>
)}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Compute the derived list: packages.filter((p) => statusFilter === "All" || p.status === statusFilter).
2. Update the empty check: visible.length === 0.
3. Update the render: map over visible.
4. Update the message: "No packages match this filter."`,
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
