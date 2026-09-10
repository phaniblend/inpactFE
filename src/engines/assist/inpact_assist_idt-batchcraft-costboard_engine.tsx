import createINPACTEngine from "../inpact_engine_shared";

const MENTAL_MODEL = `Build the menu-costing board a kitchen manager actually watches margins from:

  Fetch    ->  every recipe's real live cost, from GET /api/v1/recipes/costs
  Table    ->  real rows, one per recipe — code, name, cost per serving, food-cost %
  Loading  ->  a message while the fetch is in flight
  Empty    ->  a message when there's nothing costed yet
  Alert    ->  a recipe over its own target cost % reads differently at a glance
  Prep     ->  scale and run a real batch — POST /api/v1/recipes/:id/prep-batches
`;

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-batchcraft-costboard",
      title: "BatchCraft: recipe cost board",
      body: MENTAL_MODEL,
      usecase: "The real BatchCraft backend already recursively solves every recipe's true plate cost — factoring in raw trim-loss yield and nested sub-recipes — and already depletes real pantry stock when a prep batch runs. This task builds the screen a kitchen manager actually watches margins and runs prep from.",
      walkthroughProduct: "batchcraft",
      designMock: {"kind":"list-and-form","screenTitle":"Recipe Cost Board","caption":"This is the screen you are building — every row is a real recipe with its real, backend-computed cost.","listCaption":"TABLE — real recipes, live from the API","emptyCaption":"EMPTY — if nothing has been costed yet","emptyMessage":"No recipes costed yet.","rows":[{"title":"Marinara Sauce","subtitle":"$1.84 / serving","meta":"38% (over 30% target)"},{"title":"Lasagna","subtitle":"$4.20 / serving","meta":"27%"}],"fields":[{"label":"Batch multiplier","placeholder":"e.g. 3.5"},{"label":"Prepared by","placeholder":"e.g. J. Alvarez"}],"formMode":"filter","submitLabel":"Run Prep Batch"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Create the component file and export the empty RecipeCostBoard shell — nothing else yet.",
      "Define type RecipeCostSummary, above the component, matching the real API's response shape.",
      "Add the recipes and loading state variables, inside the component.",
      "Wire the real fetch-on-mount effect, inside the component.",
      "Render the fetched recipes as a real table.",
      "Style a recipe whose real food-cost % is over its own target distinctly.",
      "Add the selected/multiplier/preparedBy state variables, inside the component.",
      "Add the PREP_ITEM-gated Run Prep Batch button and its inline form.",
      "Add the handleRunBatch function, inside the component.",
      "Wire the Submit button to run a real prep batch and refresh the table.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 10",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Create the component file at src/components/RecipeCostBoard.tsx and export the empty RecipeCostBoard component. Nothing else — no type, no fields, no imports. Just the file and the exported shell.

WHAT YOUR CODE NEEDS
- The file to exist at exactly this path.
- One exported function component, named RecipeCostBoard, returning <div />.

Your task: create the file, then write only export function RecipeCostBoard() { return <div />; } — every step from here on adds exactly one more thing to this same file.`,
    hint: `1. Create the file: Add a new file at src/components/RecipeCostBoard.tsx.
2. Component shell: Declare export function RecipeCostBoard() { return <div />; }. That's the whole step — no type, no state, no imports yet.`,
    example_code: `// src/components/JobCostBoard.tsx
export function JobCostBoard() {
  return <div />;
}`,
    think_prompt: `Every later step in this task adds exactly one more piece to this file — a type, a state variable, an effect, a render. None of that can exist yet without one thing existing first: the component itself. What's the smallest possible version of this file that's still a real, exported component?`,
    mc_options: [
      "export function RecipeCostBoard() { return <div />; } — nothing else",
      "export function RecipeCostBoard() { return <div />; } plus the RecipeCostSummary type in the same step",
      "Wait until the type and state are known before creating the file at all",
    ],
    mc_correct_option: "export function RecipeCostBoard() { return <div />; } — nothing else",
    mc_anchor: "export function RecipeCostBoard() { return",
    why_this_matters: `Keeping this step to only the file and the export is what makes every later step addable one at a time — a type, then state, then an effect — instead of guessing which of several new things changed at once.`,
    answer_keywords: ["export", "function", "RecipeCostBoard", "div"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the file exists and exports an empty component. Nothing more was needed yet.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "This step is only the file and the exported empty shell — no type, no state, no imports yet.",
    pre_check_hint: `This step checks for exactly one thing: a real, exported RecipeCostBoard component in this file, returning <div />. No type, no state, no imports belong here yet — those are separate steps coming next.`,
    expected: `export function RecipeCostBoard() {
  return <div />;
}
`,
    analog_example: `export function JobCostBoard() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Keeping this step to only the file and the export is what makes every later step addable one at a time.`,
      pain: "Bundling the type or state into this same step means the next step has no single, clear thing to check — was it the type that broke, or the export?",
      mentalModel: MENTAL_MODEL,
      discover: `export function RecipeCostBoard() {
  return <div />;
}
`,
      quickRules: "- One action per step\n- Name the location relative to the component (above it, inside it)\n- Nothing here yet but the shell itself",
      watchOut: "Do not add the type or any state in this step — those are their own steps next.",
      dryRun: "Write the same one-line shell for a different component you haven't built yet.",
      build: `Create the file, export function RecipeCostBoard() { return <div />; } — done.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 10",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Define type RecipeCostSummary, above the component definition, matching the real API's response shape.

WHAT YOUR BLUEPRINT NEEDS
- id (text)
- code (text)
- name (text)
- type (text — PREP_ITEM or MENU_ITEM)
- costPerServing (number — the real, backend-computed cost)
- foodCostPct (number — that cost as a percentage of the selling price)
- targetCostPct (number — the recipe's own acceptable ceiling)
- sellingPrice (number)

Your task: write type RecipeCostSummary with all eight fields, placed above export function RecipeCostBoard() in the same file — the component itself doesn't change in this step.`,
    hint: `1. Location: the type goes ABOVE the component definition, before export function RecipeCostBoard().
2. Mirror the real shape: GET /api/v1/recipes/costs returns costPerServing, foodCostPct, targetCostPct, and sellingPrice as numbers.
3. Leave the component untouched this step — just add the type above it.`,
    example_code: `// above the component
export type JobCostSummary = {
  id: string;
  code: string;
  name: string;
  category: string;
  costPerUnit: number;
  laborCostPct: number;
  targetLaborPct: number;
  billRate: number;
};

export function JobCostBoard() {
  return <div />;
}`,
    think_prompt: `A type is only honest if it matches what the real endpoint actually sends back — not a guess. The real /api/v1/recipes/costs response already carries the finished percentages, computed server-side. Where does a type declaration belong relative to the component that uses it?`,
    mc_options: [
      "type RecipeCostSummary with all eight fields, placed above the component definition",
      "the same type, but declared inside the component function body",
      "Recompute foodCostPct client-side from raw ingredient prices instead of trusting the API's own value",
    ],
    mc_correct_option: "type RecipeCostSummary with all eight fields, placed above the component definition",
    mc_anchor: "type RecipeCostSummary with all eight",
    why_this_matters: `A type declared above the component — not inside it — is what lets TypeScript check every use of RecipeCostSummary in this file against one single source of truth.`,
    answer_keywords: ["export", "type", "RecipeCostSummary", "code", "name", "costPerServing", "foodCostPct", "targetCostPct", "sellingPrice"],
    seed_code: `export function RecipeCostBoard() {
  return <div />;
}
`,
    starter_code: `// type goes here, above the component

export function RecipeCostBoard() {
  return <div />;
}
`,
    feedback_correct: "Correct — the type is in place, above the component, matching the real API.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Place the type above the component, matching what GET /api/v1/recipes/costs actually returns.",
    pre_check_hint: `Every row in the cost board describes the same kind of thing — one recipe's real, already-computed cost — so standardize what one recipe's cost summary looks like as a type, above the component.

Picture two real recipes:
- Marinara Sauce (code MAR-01), a PREP_ITEM, real cost $1.84/serving, that's 38% of its $4.85 selling price, against a 30% target.
- Lasagna (code LAS-01), a MENU_ITEM, real cost $4.20/serving, that's 27% of its $15.50 selling price, against a 30% target.

Every recipe's cost summary needs a property for each of these real facts: a unique identifier; a human-readable code; its name; whether it's a sub-recipe prep item or a finished menu item; its real cost per serving; that cost as a real percentage of its selling price; the target percentage; its selling price.

Name each fact as its own property, camelCase — the four cost/price/percentage facts are numbers, everything else here is text.`,
    expected: `export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  return <div />;
}
`,
    analog_example: `export type JobCostSummary = {
  id: string;
  code: string;
  name: string;
  category: string;
  costPerUnit: number;
  laborCostPct: number;
  targetLaborPct: number;
  billRate: number;
};

export function JobCostBoard() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A type declared above the component is what lets TypeScript check every use of it in this file against one single source of truth.`,
      pain: "A type declared inside the component body would be redeclared on every render and unusable as a prop or return type anywhere else.",
      mentalModel: MENTAL_MODEL,
      discover: `export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};
`,
      quickRules: "- One action per step\n- The type goes above the component, never inside it\n- Match the real API's shape, not a guess",
      watchOut: "Do not declare the type inside the component function — it belongs above it, at module scope.",
      dryRun: "Write the same above-the-component type declaration for a different real endpoint.",
      build: `Add type RecipeCostSummary (8 fields) directly above export function RecipeCostBoard().`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 10",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Add the recipes and loading state variables, inside the component.

WHAT YOUR LOGIC NEEDS
- import { useState } from "react", at the top of the file.
- useState<RecipeCostSummary[]>([]) for the fetched recipes, inside the component.
- useState(true) for a loading flag, inside the component.

Your task: add the react import, then declare const [recipes, setRecipes] and const [loading, setLoading] as the first two lines inside RecipeCostBoard's body — the fetch and the render both come in later steps.`,
    hint: `1. Import: import { useState } from "react"; at the top of the file.
2. Inside the component: const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
3. Inside the component: const [loading, setLoading] = useState(true);
4. Leave the return statement as return <div />; for now — the fetch and render come next.`,
    example_code: `import { useState } from "react";

export type JobCostSummary = { /* ... */ };

export function JobCostBoard() {
  const [jobs, setJobs] = useState<JobCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  return <div />;
}`,
    think_prompt: `State that lives across renders — the fetched data, whether it's still loading — has to be declared with useState, and it has to live inside the component so React tracks it per instance. What goes where: the import, and the two state declarations?`,
    mc_options: [
      "import useState from \"react\" at the top, then declare recipes and loading state as the first lines inside the component",
      "declare the state variables above the component, next to the type",
      "skip loading state and just check recipes.length === 0",
    ],
    mc_correct_option: "import useState from \"react\" at the top, then declare recipes and loading state as the first lines inside the component",
    mc_anchor: "import useState from \"react\" at the top",
    why_this_matters: `Declaring state inside the component — not above it — is what gives React a value it can track and re-render on; a variable declared outside the component would be shared and stale across every instance.`,
    answer_keywords: ["import", "useState", "react", "recipes", "setRecipes", "loading", "setLoading"],
    seed_code: `export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  return <div />;
}
`,
    starter_code: `// react import goes here

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  // state variables go here, inside the component
  return <div />;
}
`,
    feedback_correct: "Correct — the component now holds real state for its fetched data and loading flag.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Import useState at the top of the file, then declare both state variables as the first lines inside the component body.",
    pre_check_hint: `State declared inside the component is what React tracks and re-renders on — state declared outside it would be shared across every instance of this component, which is never what you want here.

- Add the react import for useState at the top of the file.
- Inside the component, as its first line, hold the fetched recipes in state, starting as an empty array.
- Right after it, hold a loading flag in state, starting as true.`,
    expected: `import { useState } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  return <div />;
}
`,
    analog_example: `import { useState } from "react";

export type JobCostSummary = { /* ... */ };

export function JobCostBoard() {
  const [jobs, setJobs] = useState<JobCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Declaring state inside the component is what gives React a value it can track and re-render on.`,
      pain: "State declared above the component (at module scope) would be one shared value for every instance of this component ever rendered, not per-instance.",
      mentalModel: MENTAL_MODEL,
      discover: `const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
const [loading, setLoading] = useState(true);`,
      quickRules: "- One action per step\n- State goes inside the component, never above it\n- Import first, then declare",
      watchOut: "Do not declare useState calls outside the component function.",
      dryRun: "Add the same import-then-declare-state pattern for a different component's own data.",
      build: `import { useState } from "react"; then two useState calls as the first lines inside RecipeCostBoard.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 10",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Wire the real fetch-on-mount effect, inside the component.

WHAT YOUR LOGIC NEEDS
- import { useEffect } from "react", added to the existing react import.
- useEffect with an empty dependency array, inside the component, running the fetch exactly once on mount.
- A relative fetch("/api/v1/recipes/costs") call inside that effect.

Your task: add useEffect to the react import, then add the effect itself (right after the two state declarations) that fetches the real recipes and calls setRecipes and setLoading(false) when the response resolves.`,
    hint: `1. Import: import { useState, useEffect } from "react";
2. Effect, inside the component: useEffect(() => { fetch("/api/v1/recipes/costs").then((r) => r.json()).then((data) => { setRecipes(data); setLoading(false); }); }, []);
3. Leave the return statement as return <div />; — rendering the real data comes in the next step.`,
    example_code: `useEffect(() => {
  fetch("/api/v1/jobs/costs")
    .then((res) => res.json())
    .then((data) => {
      setJobs(data);
      setLoading(false);
    });
}, []);`,
    think_prompt: `fetch() returns a Promise, not the data itself — the real response only exists inside .then(). A useEffect with an empty dependency array runs exactly once, right when the component first appears. Where does this effect belong relative to the state you just declared?`,
    mc_options: [
      "right after the two state declarations, inside the component, using the setters already in scope",
      "above the component, next to the type",
      "inside the return statement's JSX",
    ],
    mc_correct_option: "right after the two state declarations, inside the component, using the setters already in scope",
    mc_anchor: "right after the two state declarations",
    why_this_matters: `Running fetch inside useEffect, right where the state it updates already lives, is what keeps the request tied to this exact component instance and firing exactly once.`,
    answer_keywords: ["useEffect", "fetch", "recipes", "setRecipes", "setLoading"],
    seed_code: `import { useState } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  // fetch effect goes here
  return <div />;
}
`,
    feedback_correct: "Correct — real data now flows into state on mount.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Add useEffect to the react import, then wire the effect right after the state declarations, inside the component.",
    pre_check_hint: `fetch() returns a Promise; the real response only exists inside .then(). A useEffect with an empty array makes that chain run exactly once, right when the component first appears — placed right where the state it updates already lives.

- Add useEffect to the existing react import.
- Fetch from the real endpoint: /api/v1/recipes/costs.
- Once that response resolves, hand it to your recipes state setter, then flip loading to false.`,
    expected: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  return <div />;
}
`,
    analog_example: `useEffect(() => {
  fetch("/api/v1/jobs/costs")
    .then((res) => res.json())
    .then((data) => {
      setJobs(data);
      setLoading(false);
    });
}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Running fetch inside useEffect, right where the state it updates already lives, is what keeps the request tied to this exact component instance and firing exactly once.`,
      pain: "Calling fetch() directly in the component body (outside useEffect) would refetch on every single render.",
      mentalModel: MENTAL_MODEL,
      discover: `useEffect(() => {
  fetch("/api/v1/recipes/costs")
    .then((res) => res.json())
    .then((data) => {
      setRecipes(data);
      setLoading(false);
    });
}, []);`,
      quickRules: "- One action per step\n- The effect goes inside the component, right after the state it updates\n- Empty dependency array means \"run once, on mount\"",
      watchOut: "Do not call fetch() outside useEffect — that refetches on every render.",
      dryRun: "Write the same fetch-on-mount effect for a different real endpoint on this same backend.",
      build: `Add useEffect to the react import, then wire the fetch effect right after the state declarations.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 10",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Render the fetched recipes as a real table.

WHAT YOUR LOGIC NEEDS
- A check for loading, rendering "Loading…" while the fetch is in flight.
- A check for recipes.length === 0 (after loading finishes) rendering "No recipes costed yet."
- A real <table> with a <thead> row (Code, Name, Cost/Serving, Food Cost %) and a <tbody> row per recipe.

Your task: replace the component's return statement with the loading check, the empty check, then a real table mapping recipes to rows showing code, name, costPerServing, and foodCostPct.`,
    hint: `1. Loading check: if (loading) return <p>Loading…</p>;
2. Empty check: if (recipes.length === 0) return <p>No recipes costed yet.</p>;
3. Table head: <thead><tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th></tr></thead>
4. Table body: recipes.map((r) => <tr key={r.id}><td>{r.code}</td>...</tr>), formatting costPerServing with .toFixed(2) and appending "%" to foodCostPct.`,
    example_code: `if (loading) return <p>Loading…</p>;
if (jobs.length === 0) return <p>No jobs costed yet.</p>;

return (
  <table>
    <thead>
      <tr><th>Code</th><th>Name</th><th>Cost/Unit</th><th>Labor %</th></tr>
    </thead>
    <tbody>
      {jobs.map((j) => (
        <tr key={j.id}>
          <td>{j.code}</td>
          <td>{j.name}</td>
          <td>\${j.costPerUnit.toFixed(2)}</td>
          <td>{j.laborCostPct}%</td>
        </tr>
      ))}
    </tbody>
  </table>
);`,
    think_prompt: `A real table needs a header row naming each column and a body row per record — the same list-and-empty-state pattern as any other list, drawn as <table>/<thead>/<tbody>. What are the three states this return statement now needs to handle, in order?`,
    mc_options: [
      "loading first, then the empty case, then a real table with one <tr> per recipe",
      "the table first, falling back to loading only if the table is empty",
      "skip the loading state and only check recipes.length === 0",
    ],
    mc_correct_option: "loading first, then the empty case, then a real table with one <tr> per recipe",
    mc_anchor: "loading first, then the empty case",
    why_this_matters: `Checking loading, then empty, then rendering the real table — in that order — is what stops a genuinely-still-loading board from ever flashing "No recipes costed yet." for a moment.`,
    answer_keywords: ["loading", "table", "thead", "tbody", "map", "key", "toFixed"],
    seed_code: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  return <div />;
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  // loading check, empty check, and the real table go here
  return <div />;
}
`,
    feedback_correct: "Correct — real rows, real columns, one per fetched recipe.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Check loading first, then recipes.length === 0, then render a real <table> with one <tr> per recipe.",
    pre_check_hint: `This is the same list-render pattern you've used before — check loading, then check length for the empty case, then .map() into table rows.

- While loading is true, render "Loading…".
- Otherwise, if recipes.length === 0, render "No recipes costed yet."
- Otherwise, render a real <table> with a header row naming each column, and one <tr> per recipe, keyed by recipe.id, reading code, name, costPerServing (formatted as currency), and foodCostPct (with a percent sign).`,
    expected: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Cost/Serving</th>
          <th>Food Cost %</th>
        </tr>
      </thead>
      <tbody>
        {recipes.map((r) => (
          <tr key={r.id}>
            <td>{r.code}</td>
            <td>{r.name}</td>
            <td>\${r.costPerServing.toFixed(2)}</td>
            <td>{r.foodCostPct}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    analog_example: `if (loading) return <p>Loading…</p>;
if (jobs.length === 0) return <p>No jobs costed yet.</p>;

return (
  <table>
    <thead>
      <tr><th>Code</th><th>Name</th><th>Cost/Unit</th><th>Labor %</th></tr>
    </thead>
    <tbody>
      {jobs.map((j) => (
        <tr key={j.id}>
          <td>{j.code}</td>
          <td>{j.name}</td>
          <td>\${j.costPerUnit.toFixed(2)}</td>
          <td>{j.laborCostPct}%</td>
        </tr>
      ))}
    </tbody>
  </table>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Checking loading, then empty, then the real table — in that order — is what stops a still-loading board from flashing a false "nothing here" for a moment.`,
      pain: "Skipping the loading check would show \"No recipes costed yet\" for a moment on every single page load, even when data is on its way.",
      mentalModel: MENTAL_MODEL,
      discover: `if (loading) return <p>Loading…</p>;
if (recipes.length === 0) return <p>No recipes costed yet.</p>;
return (
  <table>...</table>
);`,
      quickRules: "- One action per step\n- Order matters: loading, then empty, then real content\n- Table goes in the component's return, nowhere else",
      watchOut: "Do not skip the loading check — a still-loading board and a genuinely empty one must read differently.",
      dryRun: "Draw the same three-state return (loading/empty/table) for a different real dataset.",
      build: `if (loading) ...; if (recipes.length === 0) ...; then the real <table>.`,
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 10",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Style a recipe whose real food-cost % is over its own target distinctly, so it stands out at a glance.

WHAT YOUR LOGIC NEEDS
- A per-row conditional inside the table's Food Cost % cell: r.foodCostPct > r.targetCostPct ? red/bold styling : plain.
- The comparison must be that row's own two fields against each other — never a fixed threshold.

Your task: inside the table body you just wrote, replace the Food Cost % cell's plain text with a <span> styled red and bold when a row's foodCostPct is over its own targetCostPct, plain otherwise.`,
    hint: `1. Wrap the value: <td>{r.foodCostPct > r.targetCostPct ? <span style={{color:"red", fontWeight:700}}>{r.foodCostPct}%</span> : <span>{r.foodCostPct}%</span>}</td>.
2. Compare each row to its OWN targetCostPct — never a hardcoded number like 30.
3. This edit only touches the Food Cost % cell — nothing else in the table changes.`,
    example_code: `<td>
  {j.laborCostPct > j.targetLaborPct ? (
    <span style={{ color: "red", fontWeight: 700 }}>{j.laborCostPct}%</span>
  ) : (
    <span>{j.laborCostPct}%</span>
  )}
</td>`,
    think_prompt: `A kitchen manager scanning fifty recipes needs the ones actually over budget to jump out — and "over budget" means different things for different recipes, since each carries its own target. What single per-row comparison decides which color a cell gets?`,
    mc_options: [
      "compare each row's own foodCostPct to that same row's own targetCostPct",
      "compare every row's foodCostPct to a single fixed number like 30",
      "color rows based on their position in the list, not their actual percentages",
    ],
    mc_correct_option: "compare each row's own foodCostPct to that same row's own targetCostPct",
    mc_anchor: "compare each row's own foodCostPct to t",
    why_this_matters: `Comparing each recipe's own two real fields against each other — instead of one fixed number — is what makes the alert honest even when different recipes carry different real targets.`,
    answer_keywords: ["foodCostPct", "targetCostPct", "style", "color"],
    seed_code: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <table>
      <thead>
        <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th></tr>
      </thead>
      <tbody>
        {recipes.map((r) => (
          <tr key={r.id}>
            <td>{r.code}</td>
            <td>{r.name}</td>
            <td>\${r.costPerServing.toFixed(2)}</td>
            <td>{r.foodCostPct}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <table>
      <thead>
        <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th></tr>
      </thead>
      <tbody>
        {recipes.map((r) => (
          <tr key={r.id}>
            <td>{r.code}</td>
            <td>{r.name}</td>
            <td>\${r.costPerServing.toFixed(2)}</td>
            <td>{/* style over-target here */}{r.foodCostPct}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    feedback_correct: "Correct — recipes over their own target now visually stand out.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Compare each row's own foodCostPct to that same row's own targetCostPct — never a fixed number.",
    pre_check_hint: `This is the same per-row ternary pattern as any other conditional styling — the cell's content depends on comparing that row's own two fields to each other.

- Show a red, bolded percentage when a row's foodCostPct is greater than that same row's targetCostPct.
- Show a plain percentage otherwise.
- This is the only cell that changes in this step.`,
    expected: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <table>
      <thead>
        <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th></tr>
      </thead>
      <tbody>
        {recipes.map((r) => (
          <tr key={r.id}>
            <td>{r.code}</td>
            <td>{r.name}</td>
            <td>\${r.costPerServing.toFixed(2)}</td>
            <td>
              {r.foodCostPct > r.targetCostPct ? (
                <span style={{ color: "red", fontWeight: 700 }}>{r.foodCostPct}%</span>
              ) : (
                <span>{r.foodCostPct}%</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    analog_example: `<td>
  {j.laborCostPct > j.targetLaborPct ? (
    <span style={{ color: "red", fontWeight: 700 }}>{j.laborCostPct}%</span>
  ) : (
    <span>{j.laborCostPct}%</span>
  )}
</td>`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Comparing each recipe's own two real fields against each other — instead of one fixed number — is what makes the alert honest even when different recipes carry different real targets.`,
      pain: "A fixed threshold like 30 would flag the wrong recipes the moment any one of them carries a different real target.",
      mentalModel: MENTAL_MODEL,
      discover: `{r.foodCostPct > r.targetCostPct ? (
  <span style={{ color: "red", fontWeight: 700 }}>{r.foodCostPct}%</span>
) : (
  <span>{r.foodCostPct}%</span>
)}`,
      quickRules: "- One action per step\n- This step touches only the Food Cost % cell\n- Compare each row to its own target, never a hardcoded number",
      watchOut: "Do not hardcode a threshold percentage — always compare that row's own two fields.",
      dryRun: "Add the same per-row-target comparison to a different table with a different pair of fields.",
      build: `Style the Food Cost % cell red+bold when foodCostPct > targetCostPct, based on each row's own two values.`,
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 10",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Add the selected, multiplier, and preparedBy state variables, inside the component.

WHAT YOUR LOGIC NEEDS
- useState<RecipeCostSummary | null>(null) for the currently selected recipe.
- useState(1) for the batch multiplier.
- useState("") for who's preparing it.

Your task: add these three state variables right after the existing recipes/loading state, inside the component — the table's JSX doesn't change in this step; these three values just aren't used yet.`,
    hint: `1. Add all three, inside the component, right after the loading state: const [selected, setSelected] = useState<RecipeCostSummary | null>(null); const [multiplier, setMultiplier] = useState(1); const [preparedBy, setPreparedBy] = useState("");
2. Nothing in the return statement changes this step — these are declared but not yet used.`,
    example_code: `const [selectedJob, setSelectedJob] = useState<JobCostSummary | null>(null);
const [multiplier, setMultiplier] = useState(1);
const [preparedBy, setPreparedBy] = useState("");`,
    think_prompt: `Three new pieces of state are all needed for the same upcoming feature — which recipe is selected, how much to scale it by, and who's running it — but none of them touch the table you just built. Where do new state variables always go, regardless of when they'll first be used in the JSX?`,
    mc_options: [
      "inside the component, alongside the existing state — even before anything in the JSX uses them",
      "above the component, next to the type",
      "wait to declare them until the JSX that uses them is written",
    ],
    mc_correct_option: "inside the component, alongside the existing state — even before anything in the JSX uses them",
    mc_anchor: "inside the component, alongside the exist",
    why_this_matters: `Declaring state before the JSX that reads it is what keeps a component's state declarations grouped together and easy to find, rather than scattered wherever they first got used.`,
    answer_keywords: ["selected", "useState", "multiplier", "preparedBy"],
    seed_code: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <table>
      <thead>
        <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th></tr>
      </thead>
      <tbody>
        {recipes.map((r) => (
          <tr key={r.id}>
            <td>{r.code}</td>
            <td>{r.name}</td>
            <td>\${r.costPerServing.toFixed(2)}</td>
            <td>
              {r.foodCostPct > r.targetCostPct ? (
                <span style={{ color: "red", fontWeight: 700 }}>{r.foodCostPct}%</span>
              ) : (
                <span>{r.foodCostPct}%</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  // selected / multiplier / preparedBy state go here

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <table>
      <thead>
        <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th></tr>
      </thead>
      <tbody>
        {recipes.map((r) => (
          <tr key={r.id}>
            <td>{r.code}</td>
            <td>{r.name}</td>
            <td>\${r.costPerServing.toFixed(2)}</td>
            <td>
              {r.foodCostPct > r.targetCostPct ? (
                <span style={{ color: "red", fontWeight: 700 }}>{r.foodCostPct}%</span>
              ) : (
                <span>{r.foodCostPct}%</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    feedback_correct: "Correct — the three new state variables are in place, ready for the next steps to use.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Add all three state variables inside the component, right after the existing state — the table doesn't change yet.",
    pre_check_hint: `These three values are all state, so they all go the same place the existing state lives: inside the component, before the return statement. Nothing in the table changes this step.

- Add state for the currently selected recipe, starting as nothing selected.
- Add state for the batch multiplier, starting at 1.
- Add state for preparedBy, starting empty.`,
    expected: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RecipeCostSummary | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [preparedBy, setPreparedBy] = useState("");

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <table>
      <thead>
        <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th></tr>
      </thead>
      <tbody>
        {recipes.map((r) => (
          <tr key={r.id}>
            <td>{r.code}</td>
            <td>{r.name}</td>
            <td>\${r.costPerServing.toFixed(2)}</td>
            <td>
              {r.foodCostPct > r.targetCostPct ? (
                <span style={{ color: "red", fontWeight: 700 }}>{r.foodCostPct}%</span>
              ) : (
                <span>{r.foodCostPct}%</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    analog_example: `const [selectedJob, setSelectedJob] = useState<JobCostSummary | null>(null);
const [multiplier, setMultiplier] = useState(1);
const [preparedBy, setPreparedBy] = useState("");`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Declaring state before the JSX that reads it is what keeps a component's state declarations grouped and easy to find.`,
      pain: "Scattering new useState calls throughout the JSX wherever they're first read makes a component's actual state hard to see at a glance.",
      mentalModel: MENTAL_MODEL,
      discover: `const [selected, setSelected] = useState<RecipeCostSummary | null>(null);
const [multiplier, setMultiplier] = useState(1);
const [preparedBy, setPreparedBy] = useState("");`,
      quickRules: "- One action per step\n- All new state goes inside the component, grouped with existing state\n- It's fine to declare state before anything reads it",
      watchOut: "Do not touch the table's JSX in this step — that comes next.",
      dryRun: "Add the same three-state-variable group for a different upcoming form.",
      build: `Add selected/multiplier/preparedBy state, inside the component, right after the existing state.`,
    },
  },
  {
    id: "step8",
    type: "question",
    phase: "Step 8 of 10",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Add the PREP_ITEM-gated Run Prep Batch button and its inline form.

WHAT YOUR LOGIC NEEDS
- Wrap the table in a <div>, since a sibling form now needs to render alongside it.
- A 5th, unlabeled column in the table, showing a "Run Prep Batch" button — only when a row's own type is "PREP_ITEM".
- Below the table, inside that same <div>, an inline form that only renders when selected is set — showing the selected recipe's name plus a multiplier input and a preparedBy input.

Your task: wrap the return in a <div>, add the PREP_ITEM-only button column to the table, and add the conditional form below it — the button sets selected; the form's inputs aren't wired to their state setters yet, that's the next-but-one step.`,
    hint: `1. Wrap in a div: return (<div><table>...</table>{selected && (<div>...</div>)}</div>);
2. New column: add <th></th> to the header row, and <td>{r.type === "PREP_ITEM" && <button onClick={() => setSelected(r)}>Run Prep Batch</button>}</td> to each row.
3. Conditional form: {selected && (<div><h4>{selected.name}</h4><input type="number" value={multiplier} /><input value={preparedBy} /></div>)} — the onChange handlers come in the very next step.`,
    example_code: `<td>
  {j.category === "SUB_ASSEMBLY" && (
    <button onClick={() => setSelectedJob(j)}>Run Batch</button>
  )}
</td>

{selectedJob && (
  <div>
    <h4>{selectedJob.name}</h4>
    <input type="number" value={multiplier} />
    <input value={preparedBy} />
  </div>
)}`,
    think_prompt: `Only a PREP_ITEM — a sub-recipe like dough or sauce — is ever prepped in a scaled batch; a finished MENU_ITEM is assembled and served, not prepped. What decides whether a row even offers this button, and where does the form that opens beneath the table belong?`,
    mc_options: [
      "a button shown only on PREP_ITEM rows, and a form rendered below the table, both inside a wrapping <div>",
      "show the Run Prep Batch button on every row regardless of type",
      "put the form inside the table, as an extra row",
    ],
    mc_correct_option: "a button shown only on PREP_ITEM rows, and a form rendered below the table, both inside a wrapping <div>",
    mc_anchor: "a button shown only on PREP_ITEM rows",
    why_this_matters: `Gating the button to PREP_ITEM rows is what keeps the board from ever offering to "prep a batch" of a dish that was never meant to be prepped.`,
    answer_keywords: ["PREP_ITEM", "setSelected", "selected", "multiplier", "preparedBy"],
    seed_code: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RecipeCostSummary | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [preparedBy, setPreparedBy] = useState("");

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <table>
      <thead>
        <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th></tr>
      </thead>
      <tbody>
        {recipes.map((r) => (
          <tr key={r.id}>
            <td>{r.code}</td>
            <td>{r.name}</td>
            <td>\${r.costPerServing.toFixed(2)}</td>
            <td>
              {r.foodCostPct > r.targetCostPct ? (
                <span style={{ color: "red", fontWeight: 700 }}>{r.foodCostPct}%</span>
              ) : (
                <span>{r.foodCostPct}%</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RecipeCostSummary | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [preparedBy, setPreparedBy] = useState("");

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <table>
      <thead>
        <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th></tr>
      </thead>
      <tbody>
        {recipes.map((r) => (
          <tr key={r.id}>
            <td>{r.code}</td>
            <td>{r.name}</td>
            <td>\${r.costPerServing.toFixed(2)}</td>
            <td>
              {r.foodCostPct > r.targetCostPct ? (
                <span style={{ color: "red", fontWeight: 700 }}>{r.foodCostPct}%</span>
              ) : (
                <span>{r.foodCostPct}%</span>
              )}
            </td>
            {/* Run Prep Batch button column goes here */}
          </tr>
        ))}
      </tbody>
    </table>
    // wrap in a div, add the 5th <th>, and add the conditional form below the table
  );
}
`,
    feedback_correct: "Correct — a PREP_ITEM row now opens a real form for its own scaled batch.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Gate the button to r.type === \"PREP_ITEM\", and render the selected-recipe form below the table, both inside a wrapping <div>.",
    pre_check_hint: `Only a sub-recipe (PREP_ITEM) is ever run through a scaled prep batch — a finished MENU_ITEM has no such action.

- Wrap the whole return in a <div> so the form can sit as a sibling below the table.
- Add a 5th column header (empty) and, on each row, only when that row's own type is "PREP_ITEM", a button that sets the selected recipe to that row's own recipe.
- Below the table, render a small block only when something is selected, showing that recipe's name plus a multiplier input and a preparedBy input — their values and onChange handlers come in a later step.`,
    expected: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RecipeCostSummary | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [preparedBy, setPreparedBy] = useState("");

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th><th></th></tr>
        </thead>
        <tbody>
          {recipes.map((r) => (
            <tr key={r.id}>
              <td>{r.code}</td>
              <td>{r.name}</td>
              <td>\${r.costPerServing.toFixed(2)}</td>
              <td>
                {r.foodCostPct > r.targetCostPct ? (
                  <span style={{ color: "red", fontWeight: 700 }}>{r.foodCostPct}%</span>
                ) : (
                  <span>{r.foodCostPct}%</span>
                )}
              </td>
              <td>
                {r.type === "PREP_ITEM" && (
                  <button onClick={() => setSelected(r)}>Run Prep Batch</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div>
          <h4>{selected.name}</h4>
          <input type="number" value={multiplier} />
          <input value={preparedBy} />
        </div>
      )}
    </div>
  );
}
`,
    analog_example: `<td>
  {j.category === "SUB_ASSEMBLY" && (
    <button onClick={() => setSelectedJob(j)}>Run Batch</button>
  )}
</td>

{selectedJob && (
  <div>
    <h4>{selectedJob.name}</h4>
    <input type="number" value={multiplier} />
    <input value={preparedBy} />
  </div>
)}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Gating the button to PREP_ITEM rows is what keeps the board from ever offering to "prep a batch" of a dish that was never meant to be prepped.`,
      pain: "Showing the button on every row would let someone try to prep-batch a finished dish, a request the real backend would reject anyway.",
      mentalModel: MENTAL_MODEL,
      discover: `{r.type === "PREP_ITEM" && <button onClick={() => setSelected(r)}>Run Prep Batch</button>}
{selected && <div><h4>{selected.name}</h4>...</div>}`,
      quickRules: "- One action per step\n- The button and its form are one coherent UI addition\n- Wiring the inputs' values comes next, not here",
      watchOut: "Do not show the Run Prep Batch button on MENU_ITEM rows — gate it strictly to r.type === \"PREP_ITEM\".",
      dryRun: "Wire the same type-gated select-and-show-form pattern for a different list with two distinct row kinds.",
      build: `Wrap in a <div>, add the PREP_ITEM-only button column, and the conditional form below the table.`,
    },
  },
  {
    id: "step9",
    type: "question",
    phase: "Step 9 of 10",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Add the handleRunBatch function, inside the component, above the return statement.

WHAT YOUR LOGIC NEEDS
- An async function that posts to /api/v1/recipes/:id/prep-batches with { multiplier, preparedBy }, using the selected recipe's own id.
- A guard at the very start: if there's no selected recipe, do nothing.
- On success, clear the selection, reset multiplier and preparedBy, and re-fetch the real recipes list.

Your task: write async function handleRunBatch() above the return statement — it isn't wired to any button yet, that's the final step.`,
    hint: `1. Location: define this function inside the component, after the state declarations, before the useEffect or the return — anywhere in that middle section is fine as long as it's inside the component.
2. Guard first: if (!selected) return;
3. Post the real request: await fetch(\`/api/v1/recipes/\${selected.id}/prep-batches\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ multiplier, preparedBy }) });
4. On success: setSelected(null); setMultiplier(1); setPreparedBy(""); fetch("/api/v1/recipes/costs").then((r) => r.json()).then(setRecipes);`,
    example_code: `async function handleRunBatch() {
  if (!selectedJob) return;
  await fetch(\`/api/v1/jobs/\${selectedJob.id}/batches\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ multiplier, preparedBy }),
  });
  setSelectedJob(null);
  setMultiplier(1);
  setPreparedBy("");
  fetch("/api/v1/jobs/costs").then((r) => r.json()).then(setJobs);
}`,
    think_prompt: `Running a prep batch changes something real on the server — real stock actually depletes, a real batch record gets created. What could go wrong if this function runs with no recipe actually selected, and what has to happen to the local view once the real POST succeeds?`,
    mc_options: [
      "guard on no-selection first, post the real multiplier and preparedBy, then clear the form and reload the real list",
      "skip the guard — selected will always be set by the time this runs",
      "just clear the form locally without ever telling the server anything changed",
    ],
    mc_correct_option: "guard on no-selection first, post the real multiplier and preparedBy, then clear the form and reload the real list",
    mc_anchor: "guard on no-selection first, post the rea",
    why_this_matters: `Guarding against a missing selection before this function does anything real is what stops a stray call from posting a prep-batch request with no real recipe id at all.`,
    answer_keywords: ["handleRunBatch", "selected", "fetch", "prep-batches", "multiplier", "preparedBy"],
    seed_code: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RecipeCostSummary | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [preparedBy, setPreparedBy] = useState("");

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th><th></th></tr>
        </thead>
        <tbody>
          {recipes.map((r) => (
            <tr key={r.id}>
              <td>{r.code}</td>
              <td>{r.name}</td>
              <td>\${r.costPerServing.toFixed(2)}</td>
              <td>
                {r.foodCostPct > r.targetCostPct ? (
                  <span style={{ color: "red", fontWeight: 700 }}>{r.foodCostPct}%</span>
                ) : (
                  <span>{r.foodCostPct}%</span>
                )}
              </td>
              <td>
                {r.type === "PREP_ITEM" && (
                  <button onClick={() => setSelected(r)}>Run Prep Batch</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div>
          <h4>{selected.name}</h4>
          <input type="number" value={multiplier} />
          <input value={preparedBy} />
        </div>
      )}
    </div>
  );
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RecipeCostSummary | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [preparedBy, setPreparedBy] = useState("");
  // handleRunBatch goes here

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th><th></th></tr>
        </thead>
        <tbody>
          {recipes.map((r) => (
            <tr key={r.id}>
              <td>{r.code}</td>
              <td>{r.name}</td>
              <td>\${r.costPerServing.toFixed(2)}</td>
              <td>
                {r.foodCostPct > r.targetCostPct ? (
                  <span style={{ color: "red", fontWeight: 700 }}>{r.foodCostPct}%</span>
                ) : (
                  <span>{r.foodCostPct}%</span>
                )}
              </td>
              <td>
                {r.type === "PREP_ITEM" && (
                  <button onClick={() => setSelected(r)}>Run Prep Batch</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div>
          <h4>{selected.name}</h4>
          <input type="number" value={multiplier} />
          <input value={preparedBy} />
        </div>
      )}
    </div>
  );
}
`,
    feedback_correct: "Correct — the real prep-batch handler exists now, guarded and ready to wire to the Submit button.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Guard on a missing selection first, post the real multiplier and preparedBy, then clear the form and reload the real list.",
    pre_check_hint: `This function is real: it changes real stock and creates a real batch record on the server. Write it, but don't wire a button to it yet — that's the final step.

- Guard the very start against there being no selected recipe.
- Post to the real prep-batches endpoint for the selected recipe's own id, with the real multiplier and preparedBy.
- On success, clear the selection, reset multiplier back to 1 and preparedBy back to empty, and re-fetch the real recipes list.`,
    expected: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RecipeCostSummary | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [preparedBy, setPreparedBy] = useState("");

  async function handleRunBatch() {
    if (!selected) return;
    await fetch(\`/api/v1/recipes/\${selected.id}/prep-batches\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ multiplier, preparedBy }),
    });
    setSelected(null);
    setMultiplier(1);
    setPreparedBy("");
    fetch("/api/v1/recipes/costs").then((r) => r.json()).then(setRecipes);
  }

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th><th></th></tr>
        </thead>
        <tbody>
          {recipes.map((r) => (
            <tr key={r.id}>
              <td>{r.code}</td>
              <td>{r.name}</td>
              <td>\${r.costPerServing.toFixed(2)}</td>
              <td>
                {r.foodCostPct > r.targetCostPct ? (
                  <span style={{ color: "red", fontWeight: 700 }}>{r.foodCostPct}%</span>
                ) : (
                  <span>{r.foodCostPct}%</span>
                )}
              </td>
              <td>
                {r.type === "PREP_ITEM" && (
                  <button onClick={() => setSelected(r)}>Run Prep Batch</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div>
          <h4>{selected.name}</h4>
          <input type="number" value={multiplier} />
          <input value={preparedBy} />
        </div>
      )}
    </div>
  );
}
`,
    analog_example: `async function handleRunBatch() {
  if (!selectedJob) return;
  await fetch(\`/api/v1/jobs/\${selectedJob.id}/batches\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ multiplier, preparedBy }),
  });
  setSelectedJob(null);
  setMultiplier(1);
  setPreparedBy("");
  fetch("/api/v1/jobs/costs").then((r) => r.json()).then(setJobs);
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Guarding against a missing selection before this function does anything real is what stops a stray call from posting a prep-batch request with no real recipe id at all.`,
      pain: "Skipping the guard would let this function run with selected still null, crashing on selected.id.",
      mentalModel: MENTAL_MODEL,
      discover: `async function handleRunBatch() {
  if (!selected) return;
  await fetch(\`/api/v1/recipes/\${selected.id}/prep-batches\`, { method: "POST", ... });
  setSelected(null);
  fetch("/api/v1/recipes/costs").then((r) => r.json()).then(setRecipes);
}`,
      quickRules: "- One action per step\n- The function is written but not yet wired to anything\n- Guard first, then the real request, then reset + reload",
      watchOut: "Do not wire this to the Submit button yet — that's the next step, kept separate on purpose.",
      dryRun: "Write the same guard-post-reset-reload function for a different real form submission.",
      build: `async function handleRunBatch() with the guard, the real POST, and the reset+reload — nothing wired to it yet.`,
    },
  },
  {
    id: "step10",
    type: "question",
    phase: "Step 10 of 10",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Wire the Submit button to run a real prep batch and refresh the table.

WHAT YOUR LOGIC NEEDS
- A <button> inside the selected-recipe form, calling handleRunBatch when clicked.
- The multiplier and preparedBy inputs should also get real onChange handlers now, so typing actually updates their state.

Your task: add onChange to both inputs (multiplier parses to a number, preparedBy stays a string), then add a Submit button below them calling handleRunBatch — this is the last piece of the whole component.`,
    hint: `1. Multiplier input: <input type="number" value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} />
2. PreparedBy input: <input value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} />
3. Submit button, right after them: <button onClick={handleRunBatch}>Submit</button>`,
    example_code: `<input type="number" value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} />
<input value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} />
<button onClick={handleRunBatch}>Submit</button>`,
    think_prompt: `An input with a value prop but no onChange is a read-only field pretending to be editable — typing into it would do nothing. What does each input need to actually respond to typing, and what triggers the real function you wrote last step?`,
    mc_options: [
      "onChange handlers on both inputs updating their own state, plus a Submit button calling handleRunBatch",
      "a button that calls handleRunBatch, but the inputs stay without onChange since their initial values are fine",
      "call handleRunBatch directly from each input's onChange instead of a separate button",
    ],
    mc_correct_option: "onChange handlers on both inputs updating their own state, plus a Submit button calling handleRunBatch",
    mc_anchor: "onChange handlers on both inputs updating",
    why_this_matters: `Wiring onChange on both inputs is what makes this a real, editable form instead of two fields that only ever show their starting values — and a dedicated Submit button is what stops a batch from running on every keystroke.`,
    answer_keywords: ["onChange", "setMultiplier", "setPreparedBy", "handleRunBatch", "Submit"],
    seed_code: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RecipeCostSummary | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [preparedBy, setPreparedBy] = useState("");

  async function handleRunBatch() {
    if (!selected) return;
    await fetch(\`/api/v1/recipes/\${selected.id}/prep-batches\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ multiplier, preparedBy }),
    });
    setSelected(null);
    setMultiplier(1);
    setPreparedBy("");
    fetch("/api/v1/recipes/costs").then((r) => r.json()).then(setRecipes);
  }

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th><th></th></tr>
        </thead>
        <tbody>
          {recipes.map((r) => (
            <tr key={r.id}>
              <td>{r.code}</td>
              <td>{r.name}</td>
              <td>\${r.costPerServing.toFixed(2)}</td>
              <td>
                {r.foodCostPct > r.targetCostPct ? (
                  <span style={{ color: "red", fontWeight: 700 }}>{r.foodCostPct}%</span>
                ) : (
                  <span>{r.foodCostPct}%</span>
                )}
              </td>
              <td>
                {r.type === "PREP_ITEM" && (
                  <button onClick={() => setSelected(r)}>Run Prep Batch</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div>
          <h4>{selected.name}</h4>
          <input type="number" value={multiplier} />
          <input value={preparedBy} />
        </div>
      )}
    </div>
  );
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RecipeCostSummary | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [preparedBy, setPreparedBy] = useState("");

  async function handleRunBatch() {
    if (!selected) return;
    await fetch(\`/api/v1/recipes/\${selected.id}/prep-batches\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ multiplier, preparedBy }),
    });
    setSelected(null);
    setMultiplier(1);
    setPreparedBy("");
    fetch("/api/v1/recipes/costs").then((r) => r.json()).then(setRecipes);
  }

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th><th></th></tr>
        </thead>
        <tbody>
          {recipes.map((r) => (
            <tr key={r.id}>
              <td>{r.code}</td>
              <td>{r.name}</td>
              <td>\${r.costPerServing.toFixed(2)}</td>
              <td>
                {r.foodCostPct > r.targetCostPct ? (
                  <span style={{ color: "red", fontWeight: 700 }}>{r.foodCostPct}%</span>
                ) : (
                  <span>{r.foodCostPct}%</span>
                )}
              </td>
              <td>
                {r.type === "PREP_ITEM" && (
                  <button onClick={() => setSelected(r)}>Run Prep Batch</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div>
          <h4>{selected.name}</h4>
          <input type="number" value={multiplier} />
          <input value={preparedBy} />
          {/* Submit button goes here */}
        </div>
      )}
    </div>
  );
}
`,
    feedback_correct: "Correct — the whole cost board is now real end to end: fetch, review, and prep.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Add onChange to both inputs, then a Submit button that calls handleRunBatch.",
    pre_check_hint: `An input with only a value prop and no onChange never actually updates — it just keeps re-rendering its original state value no matter what's typed.

- Give the multiplier input a real onChange that parses the typed value to a number and updates state.
- Give the preparedBy input a real onChange that updates state with the typed string.
- Add a Submit button right after them that calls handleRunBatch on click.`,
    expected: `import { useState, useEffect } from "react";

export type RecipeCostSummary = {
  id: string;
  code: string;
  name: string;
  type: string;
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export function RecipeCostBoard() {
  const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RecipeCostSummary | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [preparedBy, setPreparedBy] = useState("");

  async function handleRunBatch() {
    if (!selected) return;
    await fetch(\`/api/v1/recipes/\${selected.id}/prep-batches\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ multiplier, preparedBy }),
    });
    setSelected(null);
    setMultiplier(1);
    setPreparedBy("");
    fetch("/api/v1/recipes/costs").then((r) => r.json()).then(setRecipes);
  }

  useEffect(() => {
    fetch("/api/v1/recipes/costs")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (recipes.length === 0) return <p>No recipes costed yet.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th><th></th></tr>
        </thead>
        <tbody>
          {recipes.map((r) => (
            <tr key={r.id}>
              <td>{r.code}</td>
              <td>{r.name}</td>
              <td>\${r.costPerServing.toFixed(2)}</td>
              <td>
                {r.foodCostPct > r.targetCostPct ? (
                  <span style={{ color: "red", fontWeight: 700 }}>{r.foodCostPct}%</span>
                ) : (
                  <span>{r.foodCostPct}%</span>
                )}
              </td>
              <td>
                {r.type === "PREP_ITEM" && (
                  <button onClick={() => setSelected(r)}>Run Prep Batch</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div>
          <h4>{selected.name}</h4>
          <input
            type="number"
            value={multiplier}
            onChange={(e) => setMultiplier(Number(e.target.value))}
          />
          <input
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
          />
          <button onClick={handleRunBatch}>Submit</button>
        </div>
      )}
    </div>
  );
}
`,
    analog_example: `<input type="number" value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} />
<input value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} />
<button onClick={handleRunBatch}>Submit</button>`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Wiring onChange on both inputs is what makes this a real, editable form — and a dedicated Submit button is what stops a batch from running on every keystroke.`,
      pain: "An input with value but no onChange looks editable but silently ignores every keystroke — a classic React gotcha.",
      mentalModel: MENTAL_MODEL,
      discover: `<input value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} />
<button onClick={handleRunBatch}>Submit</button>`,
      quickRules: "- One action per step\n- Every controlled input needs both value and onChange\n- Submit is a deliberate click, not a side effect of typing",
      watchOut: "Do not call handleRunBatch from an input's onChange — only the Submit button should trigger it.",
      dryRun: "Wire the same value+onChange+Submit pattern for a different two-field real form.",
      build: `Add onChange to both inputs, then a Submit button calling handleRunBatch.`,
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
  { label: "Step 5", id: "step5" },
  { label: "Step 6", id: "step6" },
  { label: "Step 7", id: "step7" },
  { label: "Step 8", id: "step8" },
  { label: "Step 9", id: "step9" },
  { label: "Step 10", id: "step10" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "BatchCraft: recipe cost board",
  shortName: "Recipe costing",
});
