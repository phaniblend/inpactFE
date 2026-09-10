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
      "Create the component file, define type RecipeCostSummary matching the real API's response shape, and export the empty shell.",
      "Fetch the real recipe costs on mount and hold them in state, with a loading message while the request is in flight.",
      "Render the fetched recipes as a real table — one row per recipe, correct columns.",
      "Style a recipe whose real food-cost % is over its own target distinctly, so it stands out at a glance.",
      "Selecting a PREP_ITEM row opens a real inline form to scale and name a prep run.",
      "Submitting the form runs a real prep batch and refreshes the table.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 6",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Create the component file at src/components/RecipeCostBoard.tsx, define type RecipeCostSummary, and export the RecipeCostBoard component.

Create src/components/RecipeCostBoard.tsx, declare the RecipeCostSummary type matching what the real API actually returns, and export an empty RecipeCostBoard component.

WHAT YOUR BLUEPRINT NEEDS
- id (text)
- code (text)
- name (text)
- type (text — PREP_ITEM or MENU_ITEM)
- costPerServing (number — the real, backend-computed cost)
- foodCostPct (number — that cost as a percentage of the selling price)
- targetCostPct (number — the recipe's own acceptable ceiling)
- sellingPrice (number)

Your task: write \`type RecipeCostSummary\` with all eight fields, then define and export RecipeCostBoard as a function component returning <div /> — every step from here on edits this same file.`,
    hint: `1. Create the file: Add a new file at src/components/RecipeCostBoard.tsx.
2. Mirror the declaration: match the real API's shape exactly — GET /api/v1/recipes/costs returns costPerServing, foodCostPct, targetCostPct, and sellingPrice as numbers.
3. Component shell: Declare export function RecipeCostBoard() { return <div />; }.`,
    example_code: `// src/components/JobCostBoard.tsx
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
    think_prompt: `A type is only honest if it matches what the real endpoint actually sends back — not a guess. The real /api/v1/recipes/costs response already carries the finished percentages, computed server-side by a recursive solver — this component never recalculates them itself. What does the blueprint need to name?`,
    mc_options: [
      "Define type RecipeCostSummary (id, code, name, type, costPerServing, foodCostPct, targetCostPct, sellingPrice), then export function RecipeCostBoard() returning <div />",
      "Recompute foodCostPct client-side from raw ingredient prices instead of trusting the API's own value",
      "Wait until the table is built before deciding the type",
    ],
    mc_correct_option: "Define type RecipeCostSummary (id, code, name, type, costPerServing, foodCostPct, targetCostPct, sellingPrice), then export function RecipeCostBoard() returning <div />",
    mc_anchor: "Define type RecipeCostSummary (id, code",
    why_this_matters: `Trusting the API's own already-computed cost fields, rather than re-deriving them client-side, is what keeps this screen honest about a calculation the real backend already recursively solved.`,
    answer_keywords: ["export", "type", "RecipeCostSummary", "code", "name", "type", "costPerServing", "foodCostPct", "targetCostPct", "sellingPrice", "export", "function", "RecipeCostBoard"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the blueprint matches the real API, and the component shell exists.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Match the type to what GET /api/v1/recipes/costs actually returns, then add the empty component shell.",
    pre_check_hint: `Every row in the cost board describes the same kind of thing — one recipe's real, already-computed cost — so before writing any table code, standardize what one recipe's cost summary looks like as a type.

Picture two real recipes:
- Marinara Sauce (code MAR-01), a PREP_ITEM, real cost $1.84/serving, that's 38% of its $4.85 selling price, against a 30% target.
- Lasagna (code LAS-01), a MENU_ITEM, real cost $4.20/serving, that's 27% of its $15.50 selling price, against a 30% target.

Every recipe's cost summary needs a property for each of these real facts:
- a unique identifier
- a human-readable code, the kind a kitchen manager would actually read off a report
- its name
- whether it's a sub-recipe prep item or a finished menu item
- its real, backend-computed cost per serving
- that cost as a real percentage of its selling price
- the target percentage this specific recipe is supposed to stay under
- its selling price

Name each fact as its own property, camelCase, giving each the kind it actually is — the four cost/price/percentage facts are numbers, everything else here is text.`,
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
      hook: `Trusting the API's own already-computed cost fields, rather than re-deriving them client-side, is what keeps this screen honest about a calculation the real backend already recursively solved.`,
      pain: "A type that guesses wrong about the real response shape produces confusing runtime bugs TypeScript should have caught.",
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

export function RecipeCostBoard() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not recompute foodCostPct on the client — the real backend's recursive solver already did that math.",
      dryRun: "Write the same step for a different real endpoint you haven't used before.",
      build: `1. Create the file.\n2. Match the type to the real API shape.\n3. Export the empty shell.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 6",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Fetch the real recipe costs on mount and hold them in state, with a loading message while the request is in flight.

Set up state for the recipes array and a loading flag, fetch from the real API inside useEffect, and show a loading message until the first response arrives.

WHAT YOUR LOGIC NEEDS
- useState<RecipeCostSummary[]>([]) for the fetched recipes.
- useState(true) for a loading flag, set to false once the fetch resolves.
- useEffect with an empty dependency array running the fetch exactly once, on mount.
- A relative fetch("/api/v1/recipes/costs") call — same origin as the app, no hardcoded host.

Your task: fetch("/api/v1/recipes/costs") inside useEffect, store the response in recipes, set loading to false when it resolves, and render "Loading…" while loading is true.`,
    hint: `1. Declare state: const [recipes, setRecipes] = useState<RecipeCostSummary[]>([]); const [loading, setLoading] = useState(true);
2. Fetch on mount: useEffect(() => { fetch("/api/v1/recipes/costs").then((r) => r.json()).then((data) => { setRecipes(data); setLoading(false); }); }, []);
3. Render loading: return loading ? <p>Loading…</p> : <div />; for now.`,
    example_code: `const [jobs, setJobs] = useState<JobCostSummary[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/v1/jobs/costs")
    .then((res) => res.json())
    .then((data) => {
      setJobs(data);
      setLoading(false);
    });
}, []);`,
    think_prompt: `fetch() returns a Promise, not the data itself — the real response only exists inside .then(). A useEffect with an empty dependency array runs exactly once, right when the component first appears. Right after mount, recipes is empty for the exact same reason it would be empty if nothing had genuinely been costed yet — what tells those two situations apart until the real data arrives?`,
    mc_options: [
      "a loading flag, true until the fetch resolves, checked before deciding what to render",
      "assume recipes.length === 0 always means nothing is costed",
      "call fetch directly inside the JSX return",
    ],
    mc_correct_option: "a loading flag, true until the fetch resolves, checked before deciding what to render",
    mc_anchor: "a loading flag, true until the fetch res",
    why_this_matters: `Running fetch inside useEffect with a loading flag means the request fires exactly once, and a kitchen manager sees an honest "still loading" instead of a false "nothing costed" for a moment.`,
    answer_keywords: ["useState", "loading", "useEffect", "fetch", "recipes", "setRecipes", "setLoading"],
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
  // recipes + loading state, and the fetch, go here
  return <div />;
}
`,
    feedback_correct: "Correct — real data now flows into state on mount, with an honest loading state.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "fetch has to run inside useEffect([]), and its result only exists inside .then() — set loading false there too.",
    pre_check_hint: `fetch() returns a Promise; the real response only exists inside .then() (or after an await). A useEffect with an empty array makes that chain run exactly once, right when the component first appears.

- Fetch from the real endpoint: \`/api/v1/recipes/costs\`.
- Once that response resolves, hand it straight to your \`recipes\` state setter.
- Then flip your loading flag to false, now that the real data has arrived.

Until that response comes back, the loading flag stays true — that's what tells a board that's genuinely still loading apart from one that's genuinely empty.`,
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

  return loading ? <p>Loading…</p> : <div />;
}
`,
    analog_example: `const [jobs, setJobs] = useState<JobCostSummary[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/v1/jobs/costs")
    .then((res) => res.json())
    .then((data) => {
      setJobs(data);
      setLoading(false);
    });
}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Running fetch inside useEffect with a loading flag means the request fires exactly once, and a kitchen manager sees an honest "still loading" instead of a false "nothing costed" for a moment.`,
      pain: "Without a loading flag, a genuinely empty board and a board that just hasn't loaded yet look identical.",
      mentalModel: MENTAL_MODEL,
      discover: `useEffect(() => {
  fetch("/api/v1/recipes/costs")
    .then((res) => res.json())
    .then((data) => {
      setRecipes(data);
      setLoading(false);
    });
}, []);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not call fetch() directly inside the component body (outside useEffect) — that refetches on every render.",
      dryRun: "Write the same fetch-on-mount step for a different real endpoint on this same backend.",
      build: `useState<RecipeCostSummary[]>([]) + useState(true) for loading, then fetch("/api/v1/recipes/costs") inside useEffect([]).`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 6",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Render the fetched recipes as a real table — one row per recipe, correct columns.

Once loading is false, draw an actual HTML table with one row per fetched recipe, or a message when nothing has been costed yet.

WHAT YOUR LOGIC NEEDS
- A check for recipes.length === 0 (after loading finishes) rendering "No recipes costed yet."
- A real <table> with a <thead> row (Code, Name, Cost/Serving, Food Cost %) and a <tbody> row per recipe.
- Formatted currency for costPerServing (toFixed(2)) and a percent sign after foodCostPct.

Your task: after the loading branch, check recipes.length === 0 for "No recipes costed yet.", otherwise render a table with one row per recipe showing code, name, costPerServing, and foodCostPct.`,
    hint: `1. Empty check: recipes.length === 0 ? <p>No recipes costed yet.</p> : (...)
2. Table head: <thead><tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th></tr></thead>
3. Table body: recipes.map((r) => <tr key={r.id}><td>{r.code}</td>...</tr>), formatting costPerServing with .toFixed(2) and appending "%" to foodCostPct.`,
    example_code: `if (jobs.length === 0) return <p>No jobs costed yet.</p>;

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
    think_prompt: `A real table needs a header row naming each column and a body row per record — the exact same list-and-empty-state pattern as any other list, just drawn as <table>/<thead>/<tbody> instead of <ul>/<li>. What goes in each column, and what's the key for each row?`,
    mc_options: [
      "a real <table> with header cells naming each column and one <tr> per recipe, keyed by recipe.id",
      "one giant string built with string concatenation and dangerouslySetInnerHTML",
      "render recipes directly as raw JSON text",
    ],
    mc_correct_option: "a real <table> with header cells naming each column and one <tr> per recipe, keyed by recipe.id",
    mc_anchor: "a real <table> with header cells naming",
    why_this_matters: `A real semantic table (not a styled <div> grid) is what screen readers and browser table features actually understand.`,
    answer_keywords: ["table", "thead", "tbody", "map", "key", "toFixed"],
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

  return loading ? <p>Loading…</p> : <div />;
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
  // empty check + table go here
  return <div />;
}
`,
    feedback_correct: "Correct — real rows, real columns, one per fetched recipe.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Check recipes.length === 0 first, then draw a real <table> with one <tr> per recipe.",
    pre_check_hint: `Once loading is done, this is the same list-render pattern you've used before — check length for the empty case, then .map() into table rows instead of list items.

- Check recipes.length === 0 first and render "No recipes costed yet." when true.
- Otherwise, render a real <table> with a header row naming each column.
- One <tr> per recipe, keyed by recipe.id, reading code, name, costPerServing (formatted as currency), and foodCostPct (with a percent sign).`,
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
    analog_example: `if (jobs.length === 0) return <p>No jobs costed yet.</p>;

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
      hook: `A real semantic table (not a styled <div> grid) is what screen readers and browser table features actually understand.`,
      pain: "Skipping the empty check leaves a permanently blank table with no explanation once the fetch resolves to nothing.",
      mentalModel: MENTAL_MODEL,
      discover: `<table>
  <thead><tr><th>Code</th><th>Name</th><th>Cost/Serving</th><th>Food Cost %</th></tr></thead>
  <tbody>
    {recipes.map((r) => <tr key={r.id}>...</tr>)}
  </tbody>
</table>`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not skip the empty-array check — a table with zero rows and no message reads as broken.",
      dryRun: "Draw the same table shape for a different real dataset with different columns.",
      build: `1. Empty check: recipes.length === 0.\n2. Table head: 4 columns.\n3. Table body: .map() with key={r.id}, costPerServing formatted with .toFixed(2), foodCostPct with a percent sign.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 6",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Style a recipe whose real food-cost % is over its own target distinctly, so it stands out at a glance.

Replace the plain Food Cost % text with a styled value — red and bold when a recipe's own foodCostPct exceeds its own targetCostPct, plain otherwise.

WHAT YOUR LOGIC NEEDS
- A per-row conditional: r.foodCostPct > r.targetCostPct ? red/bold styling : plain.
- The comparison must be that row's own two fields against each other — never a fixed threshold, since each recipe carries its own target.

Your task: replace the Food Cost % cell's plain text with a <span> styled red and bold when a row's foodCostPct is over its own targetCostPct, plain otherwise.`,
    hint: `1. Wrap the value: <td>{r.foodCostPct > r.targetCostPct ? <span style={{color:"red", fontWeight:700}}>{r.foodCostPct}%</span> : <span>{r.foodCostPct}%</span>}</td>.
2. Compare each row to its OWN targetCostPct — never a hardcoded number like 30.`,
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
    feedback_correct: "Correct — recipes over their own target now visually stand out from the rest.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Compare each row's own foodCostPct to that same row's own targetCostPct — never a fixed number.",
    pre_check_hint: `This is the same per-row ternary pattern as any other conditional styling — the cell's content depends on comparing that row's own two fields to each other, evaluated fresh for every row.

- Show a red, bolded percentage when a row's foodCostPct is greater than that same row's targetCostPct.
- Show a plain percentage otherwise.
- Base the comparison on that row's own \`r.foodCostPct\` against its own \`r.targetCostPct\` — never a hardcoded number.`,
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
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not hardcode a threshold percentage — always compare that row's own two fields.",
      dryRun: "Add the same kind of per-row-target comparison to a different table with a different pair of fields.",
      build: `Style the Food Cost % cell red+bold when foodCostPct > targetCostPct, based on each row's own two values.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 6",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Selecting a PREP_ITEM row opens a real inline form to scale and name a prep run.

Track which recipe is currently selected for prep, and when a PREP_ITEM row is clicked, show a small form below the table for entering a batch multiplier and who's preparing it.

WHAT YOUR LOGIC NEEDS
- A new piece of state holding the currently selected recipe (or nothing selected).
- A click handler on each PREP_ITEM row's own action element that sets that state to that row's own recipe — MENU_ITEM rows don't get this control, since you never run a prep batch of a finished dish.
- Two more pieces of state for the form's own inputs: a multiplier (starts at 1) and a preparedBy name (starts empty).
- A form that only renders when something is selected, showing the selected recipe's name plus the two inputs.

Your task: add useState for the selected recipe, a "Run Prep Batch" button shown only on PREP_ITEM rows that sets it, and render a small form below the table (with multiplier and preparedBy inputs) when something is selected.`,
    hint: `1. Add state: const [selected, setSelected] = useState<RecipeCostSummary | null>(null); const [multiplier, setMultiplier] = useState(1); const [preparedBy, setPreparedBy] = useState("");
2. Row action: {r.type === "PREP_ITEM" && <button onClick={() => setSelected(r)}>Run Prep Batch</button>}
3. Form: {selected && (<div><h4>{selected.name}</h4><input type="number" value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} /><input value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} /></div>)}`,
    example_code: `const [selectedJob, setSelectedJob] = useState<JobCostSummary | null>(null);
const [multiplier, setMultiplier] = useState(1);
const [preparedBy, setPreparedBy] = useState("");

{j.category === "SUB_ASSEMBLY" && (
  <button onClick={() => setSelectedJob(j)}>Run Batch</button>
)}

{selectedJob && (
  <div>
    <h4>{selectedJob.name}</h4>
    <input type="number" value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} />
    <input value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} />
  </div>
)}`,
    think_prompt: `Only a PREP_ITEM — a sub-recipe like dough or sauce — is ever prepped in a scaled batch; a finished MENU_ITEM is assembled and served, not prepped. What decides whether a row even offers this action, and what has to exist before the actual prep request can be submitted?`,
    mc_options: [
      "a button shown only on PREP_ITEM rows setting the selected recipe, plus separate state for the multiplier and preparedBy inputs",
      "show the Run Prep Batch button on every row regardless of type",
      "submit the prep batch immediately on row click, with no form for multiplier or preparedBy",
    ],
    mc_correct_option: "a button shown only on PREP_ITEM rows setting the selected recipe, plus separate state for the multiplier and preparedBy inputs",
    mc_anchor: "a button shown only on PREP_ITEM rows se",
    why_this_matters: `Gating the action to PREP_ITEM rows is what keeps the board from ever offering to "prep a batch" of a dish that was never meant to be prepped.`,
    answer_keywords: ["selected", "useState", "PREP_ITEM", "multiplier", "preparedBy", "onClick"],
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
  // selected recipe + multiplier + preparedBy state go here

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
              <td>{/* Run Prep Batch button (PREP_ITEM only) goes here */}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* prep-batch form goes here */}
    </div>
  );
}
`,
    feedback_correct: "Correct — a PREP_ITEM row now opens a real form for its own scaled batch.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Gate the button to r.type === \"PREP_ITEM\", and track selected recipe, multiplier, and preparedBy as their own state.",
    pre_check_hint: `Only a sub-recipe (PREP_ITEM) is ever run through a scaled prep batch — a finished MENU_ITEM has no such action.

- Add state for the currently selected recipe, starting as nothing selected.
- Add separate state for the batch multiplier (starting at 1) and preparedBy (starting empty).
- On each row, only when that row's own type is "PREP_ITEM", show a button that sets the selected recipe to that row's own recipe.
- Below the table, render a small form only when something is selected, showing that recipe's name and the two inputs.`,
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
          <input
            type="number"
            value={multiplier}
            onChange={(e) => setMultiplier(Number(e.target.value))}
          />
          <input
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
`,
    analog_example: `const [selectedJob, setSelectedJob] = useState<JobCostSummary | null>(null);
const [multiplier, setMultiplier] = useState(1);
const [preparedBy, setPreparedBy] = useState("");

{j.category === "SUB_ASSEMBLY" && (
  <button onClick={() => setSelectedJob(j)}>Run Batch</button>
)}

{selectedJob && (
  <div>
    <h4>{selectedJob.name}</h4>
    <input type="number" value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} />
    <input value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} />
  </div>
)}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Gating the action to PREP_ITEM rows is what keeps the board from ever offering to "prep a batch" of a dish that was never meant to be prepped.`,
      pain: "Showing the button on every row would let someone try to prep-batch a finished dish, a request the real backend would reject anyway.",
      mentalModel: MENTAL_MODEL,
      discover: `{r.type === "PREP_ITEM" && <button onClick={() => setSelected(r)}>Run Prep Batch</button>}
{selected && <div><input .../><input .../></div>}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not show the Run Prep Batch button on MENU_ITEM rows — gate it strictly to r.type === \"PREP_ITEM\".",
      dryRun: "Wire the same type-gated select-and-show-form pattern for a different list with two distinct row kinds.",
      build: `useState<RecipeCostSummary | null>(null) + multiplier/preparedBy state + a PREP_ITEM-only button + a conditional form.`,
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 6",
    file: "src/components/RecipeCostBoard.tsx",
    paal: `Submitting the form runs a real prep batch and refreshes the table.

Add a submit action to the prep-batch form that posts the real multiplier and preparedBy to the server, then clears the form and refreshes the real recipe list.

WHAT YOUR LOGIC NEEDS
- An async handler that posts to /api/v1/recipes/:id/prep-batches with { multiplier, preparedBy }.
- A submit button in the form calling that handler with the selected recipe's own id.
- On a successful response, clear the selection (and reset multiplier/preparedBy) and refetch the real recipes list.

Your task: write handleRunBatch(), wire it to the form's submit button, and on success clear the selection, reset the inputs, and reload the real recipe cost list.`,
    hint: `1. Handler: async function handleRunBatch() { if (!selected) return; await fetch(\`/api/v1/recipes/\${selected.id}/prep-batches\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ multiplier, preparedBy }) }); setSelected(null); setMultiplier(1); setPreparedBy(""); fetch("/api/v1/recipes/costs").then((r) => r.json()).then(setRecipes); }
2. Button: <button onClick={handleRunBatch}>Submit</button> inside the form.`,
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
}

<button onClick={handleRunBatch}>Submit</button>`,
    think_prompt: `Running a prep batch changes something real on the server — real stock actually depletes, a real batch record gets created. What has to happen to the local view once the real POST actually succeeds, and what could go wrong if there's no selected recipe when this runs?`,
    mc_options: [
      "post the real multiplier and preparedBy, guard against a missing selection, then clear the form and reload the real list",
      "just clear the form locally without ever telling the server anything changed",
      "reload the entire page after every batch submission",
    ],
    mc_correct_option: "post the real multiplier and preparedBy, guard against a missing selection, then clear the form and reload the real list",
    mc_anchor: "post the real multiplier and preparedBy,",
    why_this_matters: `Reloading from the real server after a prep run is what keeps this board honest about the stock the real backend just depleted — not a guess made client-side.`,
    answer_keywords: ["handleRunBatch", "fetch", "prep-batches", "multiplier", "preparedBy", "setSelected", "setRecipes"],
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
          <input
            type="number"
            value={multiplier}
            onChange={(e) => setMultiplier(Number(e.target.value))}
          />
          <input
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
          />
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
          <input
            type="number"
            value={multiplier}
            onChange={(e) => setMultiplier(Number(e.target.value))}
          />
          <input
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
          />
          {/* submit button goes here */}
        </div>
      )}
    </div>
  );
}
`,
    feedback_correct: "Correct — the whole cost board is now real: fetch, review, and prep.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Post the real multiplier and preparedBy, guard against a missing selection, then clear the form and reload the real recipes list.",
    pre_check_hint: `Running a prep batch is a real POST with a real multiplier and preparedBy — once it succeeds, the local view needs to catch up with what the server now actually has (real stock depleted, a real batch recorded).

- Write an async function that posts to the real prep-batches endpoint for the selected recipe's own id, with the real multiplier and preparedBy.
- Guard the very start of that function against there being no selected recipe.
- On success, clear the selection, reset multiplier back to 1 and preparedBy back to empty, and re-fetch the real recipes list.
- Wire a submit button inside the form to call that function.`,
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
}

<button onClick={handleRunBatch}>Submit</button>`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Reloading from the real server after a prep run is what keeps this board honest about the stock the real backend just depleted — not a guess made client-side.`,
      pain: "Skipping the guard on a missing selection would let a stray click post a batch request with no real recipe id at all.",
      mentalModel: MENTAL_MODEL,
      discover: `async function handleRunBatch() {
  if (!selected) return;
  await fetch(\`/api/v1/recipes/\${selected.id}/prep-batches\`, { method: "POST", ... });
  setSelected(null);
  fetch("/api/v1/recipes/costs").then((r) => r.json()).then(setRecipes);
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not skip the `if (!selected) return;` guard — without it the handler can fire with nothing actually selected.",
      dryRun: "Wire the same submit-then-reload pattern for a different real form-driven action.",
      build: `handleRunBatch guards on selected, posts real multiplier+preparedBy, then clears the form and reloads recipes.`,
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
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "BatchCraft: recipe cost board",
  shortName: "Recipe costing",
});
