import createINPACTEngine from "../inpact_engine_shared";

const MENTAL_MODEL = `Build the triage cockpit loss-prevention staff actually work from:

  Fetch    ->  every open incident, live from GET /api/v1/incidents
  Table    ->  real rows, one per incident — case code, cashier, severity, Z-score, flagged loss
  Loading  ->  a message while the fetch is in flight
  Empty    ->  a message when there's nothing to triage
  Drawer   ->  click a row, see that incident's real raw evidence
  Resolve  ->  Confirm (lock evidence) or Dismiss — POST /api/v1/incidents/:id/resolve
`;

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-sentinelpos-triage",
      title: "SentinelPOS: incident triage cockpit",
      body: MENTAL_MODEL,
      usecase: "The real SentinelPOS backend already scores cashier shifts (a rolling Z-score against each store's own 30-day baseline) and opens a real Incident record once a shift crosses the threshold — this task builds the screen a loss-prevention analyst actually works from to review and resolve those real incidents.",
      walkthroughProduct: "sentinelpos",
      designMock: {"kind":"list-and-form","screenTitle":"Incident Triage","caption":"This is the screen you are building — every row is a real incident the backend's own scoring already flagged.","listCaption":"TABLE — real incidents, live from the API","emptyCaption":"EMPTY — if nothing is currently flagged","emptyMessage":"No open incidents.","rows":[{"title":"INC-Z-482910","subtitle":"Z = 2.8","meta":"CRITICAL"},{"title":"INC-Z-482844","subtitle":"Z = 2.1","meta":"HIGH"}],"fields":[{"label":"Severity","options":["All","CRITICAL","HIGH"]}],"formMode":"filter","submitLabel":"Filter"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Create the component file, define type Incident matching the real API's response shape, and export the empty shell.",
      "Fetch the real open incidents on mount and hold them in state, with a loading message while the request is in flight.",
      "Render the fetched incidents as a real table — one row per incident, correct columns.",
      "Style each incident's severity distinctly, so a CRITICAL case reads differently from a HIGH one at a glance.",
      "Clicking a row opens a real evidence drawer showing that exact incident's raw events.",
      "Add Confirm and Dismiss actions that resolve the real incident and refresh the table.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 6",
    file: "src/components/IncidentTriage.tsx",
    paal: `Create \`src/components/IncidentTriage.tsx\`, define the \`Incident\` type, and export the \`IncidentTriage\` component.

Create src/components/IncidentTriage.tsx, declare the Incident type matching what the real API actually returns, and export an empty IncidentTriage component.

WHAT YOUR BLUEPRINT NEEDS
- id (text)
- incidentCode (text)
- cashier: an object with name (text) and employeeNumber (text)
- severity (text)
- zScore (number)
- flaggedAmount (number)
- events (a list — the raw evidence records; their own shape isn't this component's concern)

Your task: write \`type Incident\` with all six fields (cashier as its own nested object), then define and export IncidentTriage as a function component returning <div /> — every step from here on edits this same file.`,
    hint: `1. Create the file: Add a new file at src/components/IncidentTriage.tsx.
2. Mirror the declaration: match the real API's shape exactly — GET /api/v1/incidents returns zScore and flaggedAmount as numbers, cashier as a nested object.
3. Component shell: Declare export function IncidentTriage() { return <div />; }.`,
    example_code: `// src/components/CaseQueue.tsx
export type Case = {
  id: string;
  caseCode: string;
  handler: { name: string; badgeNumber: string };
  priority: string;
  riskScore: number;
  disputedAmount: number;
  events: unknown[];
};

export function CaseQueue() {
  return <div />;
}`,
    think_prompt: `A type is only honest if it matches what the real endpoint actually sends back — not a guess. The real /api/v1/incidents response nests cashier as its own object rather than flattening it, even though the mock only shows a couple of fields on screen. What does the blueprint need to name?`,
    mc_options: [
      "Define type Incident (id, incidentCode, cashier as a nested object, severity, zScore, flaggedAmount, events), then export function IncidentTriage() returning <div />",
      "Flatten cashier into two top-level fields instead of nesting it",
      "Wait until the table is built before deciding the type",
    ],
    mc_correct_option: "Define type Incident (id, incidentCode, cashier as a nested object, severity, zScore, flaggedAmount, events), then export function IncidentTriage() returning <div />",
    mc_anchor: "Define type Incident (id, incidentCode, c",
    why_this_matters: `A blueprint that matches the real API's actual shape is what lets your editor catch a typo'd field name before you ever run the code.`,
    answer_keywords: ["export", "type", "Incident", "cashier", "severity", "zScore", "flaggedAmount", "events", "export", "function", "IncidentTriage"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the blueprint matches the real API, and the component shell exists.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Match the type to what GET /api/v1/incidents actually returns, then add the empty component shell.",
    pre_check_hint: `1. Create the file \`src/components/IncidentTriage.tsx\`.
2. Declare \`type Incident\` with the fields the real API actually returns: \`id\`, \`incidentCode\`, a nested \`cashier\` object (\`name\`, \`employeeNumber\`), \`severity\`, \`zScore\`, \`flaggedAmount\`, and \`events\`.
3. Export \`IncidentTriage\` as a function component returning a placeholder \`<div />\` — every step from here on edits this same file.

Every row in the triage table describes the same kind of thing — an incident — so this type is what standardizes what one incident looks like: money and the score are numbers, \`cashier\` is its own nested object (not two loose top-level fields), everything else is text.`,
    expected: `export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  return <div />;
}
`,
    analog_example: `export type Case = {
  id: string;
  caseCode: string;
  handler: { name: string; badgeNumber: string };
  priority: string;
  riskScore: number;
  disputedAmount: number;
  events: unknown[];
};

export function CaseQueue() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A blueprint that matches the real API's actual shape is what lets your editor catch a typo'd field name before you ever run the code.`,
      pain: "A type that guesses wrong about the real response shape produces confusing runtime bugs TypeScript should have caught.",
      mentalModel: MENTAL_MODEL,
      discover: `export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not flatten cashier into loose top-level fields — the real API nests it.",
      dryRun: "Write the same step for a different real endpoint you haven't used before.",
      build: `1. Create the file.\n2. Match the type to the real API shape, cashier nested.\n3. Export the empty shell.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 6",
    file: "src/components/IncidentTriage.tsx",
    paal: `Fetch the real open incidents on mount and hold them in state, with a loading message while the request is in flight.

Set up state for the incidents array and a loading flag, fetch from the real API inside useEffect, and show a loading message until the first response arrives.

WHAT YOUR LOGIC NEEDS
- useState<Incident[]>([]) for the fetched incidents.
- useState(true) for a loading flag, set to false once the fetch resolves.
- useEffect with an empty dependency array running the fetch exactly once, on mount.
- A relative fetch("/api/v1/incidents") call — same origin as the app, no hardcoded host.

Your task: fetch("/api/v1/incidents") inside useEffect, store the response in incidents, set loading to false when it resolves, and render "Loading…" while loading is true.`,
    hint: `1. Declare state: const [incidents, setIncidents] = useState<Incident[]>([]); const [loading, setLoading] = useState(true);
2. Fetch on mount: useEffect(() => { fetch("/api/v1/incidents").then((r) => r.json()).then((data) => { setIncidents(data); setLoading(false); }); }, []);
3. Render loading: return loading ? <p>Loading…</p> : <div />; for now.`,
    example_code: `const [cases, setCases] = useState<Case[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/v1/cases")
    .then((res) => res.json())
    .then((data) => {
      setCases(data);
      setLoading(false);
    });
}, []);`,
    think_prompt: `fetch() returns a Promise, not the data itself — the real response only exists inside .then(). A useEffect with an empty dependency array runs exactly once, right when the component first appears. Right after mount, incidents is empty for the exact same reason it would be empty if the store genuinely had nothing flagged — what tells those two situations apart until the real data arrives?`,
    mc_options: [
      "a loading flag, true until the fetch resolves, checked before deciding what to render",
      "assume incidents.length === 0 always means nothing is flagged",
      "call fetch directly inside the JSX return",
    ],
    mc_correct_option: "a loading flag, true until the fetch resolves, checked before deciding what to render",
    mc_anchor: "a loading flag, true until the fetch res",
    why_this_matters: `Running fetch inside useEffect with a loading flag means the request fires exactly once, and analysts see an honest "still loading" instead of a false "all clear" for a moment.`,
    answer_keywords: ["useState", "loading", "useEffect", "fetch", "incidents", "setIncidents", "setLoading"],
    seed_code: `export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  return <div />;
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  // incidents + loading state, and the fetch, go here
  return <div />;
}
`,
    feedback_correct: "Correct — real data now flows into state on mount, with an honest loading state.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "fetch has to run inside useEffect([]), and its result only exists inside .then() — set loading false there too.",
    pre_check_hint: `fetch() returns a Promise; the real response only exists inside .then() (or after an await). A useEffect with an empty array makes that chain run exactly once, right when the component first appears.

- Fetch from the real endpoint: \`/api/v1/incidents\`.
- Once that response resolves, hand it straight to your \`incidents\` state setter.
- Then flip your loading flag to false, now that the real data has arrived.

Until that response comes back, the loading flag stays true — that's what tells a triage list that's genuinely still loading apart from one that's genuinely clear.`,
    expected: `import { useState, useEffect } from "react";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  return loading ? <p>Loading…</p> : <div />;
}
`,
    analog_example: `const [cases, setCases] = useState<Case[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/v1/cases")
    .then((res) => res.json())
    .then((data) => {
      setCases(data);
      setLoading(false);
    });
}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Running fetch inside useEffect with a loading flag means the request fires exactly once, and analysts see an honest "still loading" instead of a false "all clear" for a moment.`,
      pain: "Without a loading flag, a genuinely clear queue and a queue that just hasn't loaded yet look identical to the analyst.",
      mentalModel: MENTAL_MODEL,
      discover: `useEffect(() => {
  fetch("/api/v1/incidents")
    .then((res) => res.json())
    .then((data) => {
      setIncidents(data);
      setLoading(false);
    });
}, []);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not call fetch() directly inside the component body (outside useEffect) — that refetches on every render.",
      dryRun: "Write the same fetch-on-mount step for a different real endpoint on this same backend.",
      build: `useState<Incident[]>([]) + useState(true) for loading, then fetch("/api/v1/incidents") inside useEffect([]).`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 6",
    file: "src/components/IncidentTriage.tsx",
    paal: `Render the fetched incidents as a real table — one row per incident, correct columns.

Once loading is false, draw an actual HTML table with one row per fetched incident, or a message when the queue is genuinely clear.

WHAT YOUR LOGIC NEEDS
- A check for incidents.length === 0 (after loading finishes) rendering "No open incidents."
- A real <table> with a <thead> row (Case, Cashier, Severity, Z-Score, Flagged) and a <tbody> row per incident.
- Formatted currency for flaggedAmount (toFixed(2)).

Your task: after the loading branch, check incidents.length === 0 for "No open incidents.", otherwise render a table with one row per incident showing incidentCode, cashier.name, severity, zScore, and flaggedAmount.`,
    hint: `1. Empty check: incidents.length === 0 ? <p>No open incidents.</p> : (...)
2. Table head: <thead><tr><th>Case</th><th>Cashier</th><th>Severity</th><th>Z-Score</th><th>Flagged</th></tr></thead>
3. Table body: incidents.map((inc) => <tr key={inc.id}><td>{inc.incidentCode}</td>...</tr>), formatting the flagged amount with .toFixed(2).`,
    example_code: `if (cases.length === 0) return <p>No open cases.</p>;

return (
  <table>
    <thead>
      <tr><th>Case</th><th>Handler</th><th>Priority</th><th>Risk</th></tr>
    </thead>
    <tbody>
      {cases.map((c) => (
        <tr key={c.id}>
          <td>{c.caseCode}</td>
          <td>{c.handler.name}</td>
          <td>{c.priority}</td>
          <td>{c.riskScore}</td>
        </tr>
      ))}
    </tbody>
  </table>
);`,
    think_prompt: `A real table needs a header row naming each column and a body row per record — the exact same list-and-empty-state pattern as any other list, just drawn as <table>/<thead>/<tbody> instead of <ul>/<li>. What goes in each column, and what's the key for each row?`,
    mc_options: [
      "a real <table> with header cells naming each column and one <tr> per incident, keyed by incident.id",
      "one giant string built with string concatenation and dangerouslySetInnerHTML",
      "render incidents directly as raw JSON text",
    ],
    mc_correct_option: "a real <table> with header cells naming each column and one <tr> per incident, keyed by incident.id",
    mc_anchor: "a real <table> with header cells naming",
    why_this_matters: `A real semantic table (not a styled <div> grid) is what screen readers and browser table features actually understand.`,
    answer_keywords: ["table", "thead", "tbody", "map", "key", "toFixed"],
    seed_code: `import { useState, useEffect } from "react";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  return loading ? <p>Loading…</p> : <div />;
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  // empty check + table go here
  return <div />;
}
`,
    feedback_correct: "Correct — real rows, real columns, one per fetched incident.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Check incidents.length === 0 first, then draw a real <table> with one <tr> per incident.",
    pre_check_hint: `Once loading is done, this is the same list-render pattern you've used before — check length for the empty case, then .map() into table rows instead of list items.

- Check incidents.length === 0 first and render "No open incidents." when true.
- Otherwise, render a real <table> with a header row naming each column.
- One <tr> per incident, keyed by incident.id, reading incidentCode, cashier.name, severity, zScore, and flaggedAmount.`,
    expected: `import { useState, useEffect } from "react";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (incidents.length === 0) return <p>No open incidents.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Case</th>
          <th>Cashier</th>
          <th>Severity</th>
          <th>Z-Score</th>
          <th>Flagged</th>
        </tr>
      </thead>
      <tbody>
        {incidents.map((inc) => (
          <tr key={inc.id}>
            <td>{inc.incidentCode}</td>
            <td>{inc.cashier.name}</td>
            <td>{inc.severity}</td>
            <td>{inc.zScore}</td>
            <td>\${inc.flaggedAmount.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    analog_example: `if (cases.length === 0) return <p>No open cases.</p>;

return (
  <table>
    <thead>
      <tr><th>Case</th><th>Handler</th><th>Priority</th><th>Risk</th></tr>
    </thead>
    <tbody>
      {cases.map((c) => (
        <tr key={c.id}>
          <td>{c.caseCode}</td>
          <td>{c.handler.name}</td>
          <td>{c.priority}</td>
          <td>{c.riskScore}</td>
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
  <thead><tr><th>Case</th><th>Cashier</th><th>Severity</th><th>Z-Score</th><th>Flagged</th></tr></thead>
  <tbody>
    {incidents.map((inc) => <tr key={inc.id}>...</tr>)}
  </tbody>
</table>`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not skip the empty-array check — a table with zero rows and no message reads as broken.",
      dryRun: "Draw the same table shape for a different real dataset with different columns.",
      build: `1. Empty check: incidents.length === 0.\n2. Table head: 5 columns.\n3. Table body: .map() with key={inc.id}, flaggedAmount formatted with .toFixed(2).`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 6",
    file: "src/components/IncidentTriage.tsx",
    paal: `Style each incident's severity distinctly, so a CRITICAL case reads differently from a HIGH one at a glance.

Replace the plain severity text with a small colored badge — red for CRITICAL, a lighter warning color for everything else.

WHAT YOUR LOGIC NEEDS
- A per-row conditional: inc.severity === "CRITICAL" ? red badge : amber badge.
- The badge itself can be a <span> with inline style or a className — either way, the color decision must come from each row's own severity, not a fixed color for the whole table.

Your task: replace the Severity cell's plain text with a <span> styled red when severity is CRITICAL, and amber otherwise.`,
    hint: `1. Wrap the value: <td>{inc.severity === "CRITICAL" ? <span style={{color:"red", fontWeight:700}}>{inc.severity}</span> : <span style={{color:"#b45309"}}>{inc.severity}</span>}</td>.
2. Compare each row to its OWN severity — never a hardcoded assumption about which row is which.`,
    example_code: `<td>
  {c.priority === "URGENT" ? (
    <span style={{ color: "red", fontWeight: 700 }}>{c.priority}</span>
  ) : (
    <span style={{ color: "#b45309" }}>{c.priority}</span>
  )}
</td>`,
    think_prompt: `An analyst scanning fifty rows needs the CRITICAL ones to jump out without reading every word. What single per-row comparison decides which color a badge gets?`,
    mc_options: [
      "compare each row's own severity to \"CRITICAL\" and style that row accordingly",
      "color every row the same regardless of severity",
      "color rows based on their position in the list, not their actual severity",
    ],
    mc_correct_option: "compare each row's own severity to \"CRITICAL\" and style that row accordingly",
    mc_anchor: "compare each row's own severity to \"CRI",
    why_this_matters: `A visually distinct CRITICAL badge is what lets an analyst triage the riskiest cases first instead of reading every row in order.`,
    answer_keywords: ["severity", "CRITICAL", "style", "color"],
    seed_code: `import { useState, useEffect } from "react";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (incidents.length === 0) return <p>No open incidents.</p>;

  return (
    <table>
      <thead>
        <tr><th>Case</th><th>Cashier</th><th>Severity</th><th>Z-Score</th><th>Flagged</th></tr>
      </thead>
      <tbody>
        {incidents.map((inc) => (
          <tr key={inc.id}>
            <td>{inc.incidentCode}</td>
            <td>{inc.cashier.name}</td>
            <td>{inc.severity}</td>
            <td>{inc.zScore}</td>
            <td>\${inc.flaggedAmount.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (incidents.length === 0) return <p>No open incidents.</p>;

  return (
    <table>
      <thead>
        <tr><th>Case</th><th>Cashier</th><th>Severity</th><th>Z-Score</th><th>Flagged</th></tr>
      </thead>
      <tbody>
        {incidents.map((inc) => (
          <tr key={inc.id}>
            <td>{inc.incidentCode}</td>
            <td>{inc.cashier.name}</td>
            <td>{/* style severity here */}{inc.severity}</td>
            <td>{inc.zScore}</td>
            <td>\${inc.flaggedAmount.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    feedback_correct: "Correct — CRITICAL cases now visually stand out from the rest.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Compare each row's own severity to \"CRITICAL\" — don't hardcode which rows are colored.",
    pre_check_hint: `This is the same per-row ternary pattern as any other conditional badge — the cell's content depends only on that row's own severity value, evaluated fresh for every row.

- Show a red, bolded badge when a row's severity is exactly "CRITICAL".
- Show a lighter warning-colored badge for every other severity.
- Base the choice on that row's own \`inc.severity\`, never a fixed color for the whole table.`,
    expected: `import { useState, useEffect } from "react";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (incidents.length === 0) return <p>No open incidents.</p>;

  return (
    <table>
      <thead>
        <tr><th>Case</th><th>Cashier</th><th>Severity</th><th>Z-Score</th><th>Flagged</th></tr>
      </thead>
      <tbody>
        {incidents.map((inc) => (
          <tr key={inc.id}>
            <td>{inc.incidentCode}</td>
            <td>{inc.cashier.name}</td>
            <td>
              {inc.severity === "CRITICAL" ? (
                <span style={{ color: "red", fontWeight: 700 }}>{inc.severity}</span>
              ) : (
                <span style={{ color: "#b45309" }}>{inc.severity}</span>
              )}
            </td>
            <td>{inc.zScore}</td>
            <td>\${inc.flaggedAmount.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    analog_example: `<td>
  {c.priority === "URGENT" ? (
    <span style={{ color: "red", fontWeight: 700 }}>{c.priority}</span>
  ) : (
    <span style={{ color: "#b45309" }}>{c.priority}</span>
  )}
</td>`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A visually distinct CRITICAL badge is what lets an analyst triage the riskiest cases first instead of reading every row in order.`,
      pain: "Leaving every severity the same plain color forces an analyst to read every row's text to find the urgent ones.",
      mentalModel: MENTAL_MODEL,
      discover: `{inc.severity === "CRITICAL" ? (
  <span style={{ color: "red", fontWeight: 700 }}>{inc.severity}</span>
) : (
  <span style={{ color: "#b45309" }}>{inc.severity}</span>
)}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not hardcode a color per row index — always compare that row's own severity.",
      dryRun: "Add the same kind of status badge to a different table with a different pair of states.",
      build: `Style the Severity cell red for CRITICAL, amber otherwise, based on each row's own value.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 6",
    file: "src/components/IncidentTriage.tsx",
    paal: `Clicking a row opens a real evidence drawer showing that exact incident's raw events.

Track which incident is currently selected, and when one is, render a panel below the table showing that specific incident's own raw evidence.

WHAT YOUR LOGIC NEEDS
- A new piece of state holding the currently selected incident (or nothing selected).
- A click handler on each row that sets that state to that row's own incident.
- A panel that only renders when something is selected, showing that incident's own events.

Your task: add useState for the selected incident, wire a click handler on each row, and render a drawer below the table showing the selected incident's case code and its raw events (formatted, not raw text).`,
    hint: `1. Add state: const [selected, setSelected] = useState<Incident | null>(null);
2. Row click: <tr key={inc.id} onClick={() => setSelected(inc)}>...</tr>
3. Drawer: {selected && (<div><h3>{selected.incidentCode}</h3><pre>{JSON.stringify(selected.events, null, 2)}</pre></div>)}`,
    example_code: `const [selectedCase, setSelectedCase] = useState<Case | null>(null);

<tr key={c.id} onClick={() => setSelectedCase(c)}>...</tr>

{selectedCase && (
  <div>
    <h3>{selectedCase.caseCode}</h3>
    <pre>{JSON.stringify(selectedCase.events, null, 2)}</pre>
  </div>
)}`,
    think_prompt: `Only one incident's evidence should show at a time, and it has to be the exact one that was clicked — not "the first one" or "whichever was selected last time by coincidence." What does the click handler need to pass along, and what decides whether the drawer renders at all?`,
    mc_options: [
      "state holding the clicked row's own incident object, and a click handler on each row that sets it",
      "a single global boolean that just toggles the drawer open or closed",
      "re-fetching the incident from the server on every click instead of using what's already in state",
    ],
    mc_correct_option: "state holding the clicked row's own incident object, and a click handler on each row that sets it",
    mc_anchor: "state holding the clicked row's own inc",
    why_this_matters: `Seeing the exact raw events behind a score is what lets an analyst confirm a real pattern of theft before locking it in as evidence — not just trust a number.`,
    answer_keywords: ["selected", "useState", "onClick", "events", "JSON.stringify"],
    seed_code: `import { useState, useEffect } from "react";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (incidents.length === 0) return <p>No open incidents.</p>;

  return (
    <table>
      <thead>
        <tr><th>Case</th><th>Cashier</th><th>Severity</th><th>Z-Score</th><th>Flagged</th></tr>
      </thead>
      <tbody>
        {incidents.map((inc) => (
          <tr key={inc.id}>
            <td>{inc.incidentCode}</td>
            <td>{inc.cashier.name}</td>
            <td>
              {inc.severity === "CRITICAL" ? (
                <span style={{ color: "red", fontWeight: 700 }}>{inc.severity}</span>
              ) : (
                <span style={{ color: "#b45309" }}>{inc.severity}</span>
              )}
            </td>
            <td>{inc.zScore}</td>
            <td>\${inc.flaggedAmount.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  // selected-incident state goes here

  useEffect(() => {
    fetch("/api/v1/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (incidents.length === 0) return <p>No open incidents.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr><th>Case</th><th>Cashier</th><th>Severity</th><th>Z-Score</th><th>Flagged</th></tr>
        </thead>
        <tbody>
          {incidents.map((inc) => (
            <tr key={inc.id} /* row click goes here */>
              <td>{inc.incidentCode}</td>
              <td>{inc.cashier.name}</td>
              <td>
                {inc.severity === "CRITICAL" ? (
                  <span style={{ color: "red", fontWeight: 700 }}>{inc.severity}</span>
                ) : (
                  <span style={{ color: "#b45309" }}>{inc.severity}</span>
                )}
              </td>
              <td>{inc.zScore}</td>
              <td>\${inc.flaggedAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* evidence drawer goes here */}
    </div>
  );
}
`,
    feedback_correct: "Correct — clicking a row now shows that exact incident's own real evidence.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "The drawer must show the exact incident that was clicked, tracked in its own state, not a fixed or re-fetched one.",
    pre_check_hint: `Nothing about the evidence needs a new fetch — the clicked row's incident object already has its own real events, right there in the array you already loaded.

- Add a state variable holding the currently selected incident, starting as nothing selected.
- Give each row a click handler that sets that state to its own incident object.
- Below the table, render a panel only when something is selected, showing that incident's case code and its events.`,
    expected: `import { useState, useEffect } from "react";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Incident | null>(null);

  useEffect(() => {
    fetch("/api/v1/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (incidents.length === 0) return <p>No open incidents.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr><th>Case</th><th>Cashier</th><th>Severity</th><th>Z-Score</th><th>Flagged</th></tr>
        </thead>
        <tbody>
          {incidents.map((inc) => (
            <tr key={inc.id} onClick={() => setSelected(inc)}>
              <td>{inc.incidentCode}</td>
              <td>{inc.cashier.name}</td>
              <td>
                {inc.severity === "CRITICAL" ? (
                  <span style={{ color: "red", fontWeight: 700 }}>{inc.severity}</span>
                ) : (
                  <span style={{ color: "#b45309" }}>{inc.severity}</span>
                )}
              </td>
              <td>{inc.zScore}</td>
              <td>\${inc.flaggedAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div>
          <h3>{selected.incidentCode}</h3>
          <pre>{JSON.stringify(selected.events, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
`,
    analog_example: `const [selectedCase, setSelectedCase] = useState<Case | null>(null);

<tr key={c.id} onClick={() => setSelectedCase(c)}>...</tr>

{selectedCase && (
  <div>
    <h3>{selectedCase.caseCode}</h3>
    <pre>{JSON.stringify(selectedCase.events, null, 2)}</pre>
  </div>
)}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Seeing the exact raw events behind a score is what lets an analyst confirm a real pattern of theft before locking it in as evidence — not just trust a number.`,
      pain: "Without tracking which specific incident was clicked, a drawer showing the wrong evidence would look like proof it isn't.",
      mentalModel: MENTAL_MODEL,
      discover: `const [selected, setSelected] = useState<Incident | null>(null);
// row: onClick={() => setSelected(inc)}
{selected && <pre>{JSON.stringify(selected.events, null, 2)}</pre>}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not re-fetch the incident on click — the row you clicked already has its own real data in state.",
      dryRun: "Wire the same select-and-show-detail pattern for a different list of real records.",
      build: `useState<Incident | null>(null) + row onClick + a conditional drawer showing selected.events.`,
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 6",
    file: "src/components/IncidentTriage.tsx",
    paal: `Add Confirm and Dismiss actions that resolve the real incident and refresh the table.

In the evidence drawer, add two real buttons: one that confirms the loss (and locks the evidence), one that dismisses the incident as a false positive — each posting to the real resolve endpoint.

WHAT YOUR LOGIC NEEDS
- An async handler that posts to /api/v1/incidents/:id/resolve with a status and resolutionNotes.
- Two buttons in the drawer, each calling that handler with a different status: RESOLVED_CONFIRMED_LOSS or RESOLVED_DISMISSED.
- On a successful response, clear the selected incident and refetch the incidents list so the resolved one drops off the table.

Your task: write handleResolve(id, status, notes), wire both buttons to call it with their own status, and on success clear the selection and reload the real incident list.`,
    hint: `1. Handler: async function handleResolve(id: string, status: string, notes: string) { await fetch(\`/api/v1/incidents/\${id}/resolve\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, resolutionNotes: notes }) }); setSelected(null); fetch("/api/v1/incidents").then((r) => r.json()).then(setIncidents); }
2. Buttons: <button onClick={() => handleResolve(selected.id, "RESOLVED_CONFIRMED_LOSS", "Verified via register audit")}>Confirm Shrink & Lock Evidence</button> and a second one passing "RESOLVED_DISMISSED".`,
    example_code: `async function handleResolve(id: string, status: string, notes: string) {
  await fetch(\`/api/v1/cases/\${id}/resolve\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, resolutionNotes: notes }),
  });
  setSelectedCase(null);
  fetch("/api/v1/cases").then((r) => r.json()).then(setCases);
}

<button onClick={() => handleResolve(selectedCase.id, "CONFIRMED", "Verified")}>Confirm</button>
<button onClick={() => handleResolve(selectedCase.id, "DISMISSED", "False positive")}>Dismiss</button>`,
    think_prompt: `Resolving an incident changes something real on the server — it shouldn't still be sitting in the open-incidents table afterward. What has to happen to the local UI once the real resolve request actually succeeds?`,
    mc_options: [
      "post the real status to the resolve endpoint, then clear the selection and reload the real list",
      "just hide the row locally without ever telling the server anything changed",
      "reload the page entirely after every resolve action",
    ],
    mc_correct_option: "post the real status to the resolve endpoint, then clear the selection and reload the real list",
    mc_anchor: "post the real status to the resolve endp",
    why_this_matters: `Reloading from the real server after a resolve is what keeps the table honest — a resolved incident actually disappears because the server actually resolved it, not because the UI just pretended to.`,
    answer_keywords: ["handleResolve", "fetch", "resolve", "RESOLVED_CONFIRMED_LOSS", "RESOLVED_DISMISSED", "setSelected", "setIncidents"],
    seed_code: `import { useState, useEffect } from "react";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Incident | null>(null);

  useEffect(() => {
    fetch("/api/v1/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (incidents.length === 0) return <p>No open incidents.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr><th>Case</th><th>Cashier</th><th>Severity</th><th>Z-Score</th><th>Flagged</th></tr>
        </thead>
        <tbody>
          {incidents.map((inc) => (
            <tr key={inc.id} onClick={() => setSelected(inc)}>
              <td>{inc.incidentCode}</td>
              <td>{inc.cashier.name}</td>
              <td>
                {inc.severity === "CRITICAL" ? (
                  <span style={{ color: "red", fontWeight: 700 }}>{inc.severity}</span>
                ) : (
                  <span style={{ color: "#b45309" }}>{inc.severity}</span>
                )}
              </td>
              <td>{inc.zScore}</td>
              <td>\${inc.flaggedAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div>
          <h3>{selected.incidentCode}</h3>
          <pre>{JSON.stringify(selected.events, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Incident | null>(null);
  // handleResolve goes here

  useEffect(() => {
    fetch("/api/v1/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (incidents.length === 0) return <p>No open incidents.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr><th>Case</th><th>Cashier</th><th>Severity</th><th>Z-Score</th><th>Flagged</th></tr>
        </thead>
        <tbody>
          {incidents.map((inc) => (
            <tr key={inc.id} onClick={() => setSelected(inc)}>
              <td>{inc.incidentCode}</td>
              <td>{inc.cashier.name}</td>
              <td>
                {inc.severity === "CRITICAL" ? (
                  <span style={{ color: "red", fontWeight: 700 }}>{inc.severity}</span>
                ) : (
                  <span style={{ color: "#b45309" }}>{inc.severity}</span>
                )}
              </td>
              <td>{inc.zScore}</td>
              <td>\${inc.flaggedAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div>
          <h3>{selected.incidentCode}</h3>
          <pre>{JSON.stringify(selected.events, null, 2)}</pre>
          {/* Confirm and Dismiss buttons go here */}
        </div>
      )}
    </div>
  );
}
`,
    feedback_correct: "Correct — the whole triage cockpit is now real: fetch, review, and resolve.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Post the real status to the resolve endpoint, then clear the selection and reload the real incidents list.",
    pre_check_hint: `Resolving is a real POST with a real status and real notes — once it succeeds, the local view needs to catch up with what the server now actually has.

- Write an async function that posts to the real resolve endpoint for a given incident id, with a status and notes.
- On success, clear the selected incident and re-fetch the real incidents list.
- Wire two buttons in the drawer to that same function, one passing the confirmed-loss status, one passing the dismissed status.`,
    expected: `import { useState, useEffect } from "react";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: string;
  zScore: number;
  flaggedAmount: number;
  events: unknown[];
};

export function IncidentTriage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Incident | null>(null);

  async function handleResolve(id: string, status: string, notes: string) {
    await fetch(\`/api/v1/incidents/\${id}/resolve\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, resolutionNotes: notes }),
    });
    setSelected(null);
    fetch("/api/v1/incidents").then((r) => r.json()).then(setIncidents);
  }

  useEffect(() => {
    fetch("/api/v1/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (incidents.length === 0) return <p>No open incidents.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr><th>Case</th><th>Cashier</th><th>Severity</th><th>Z-Score</th><th>Flagged</th></tr>
        </thead>
        <tbody>
          {incidents.map((inc) => (
            <tr key={inc.id} onClick={() => setSelected(inc)}>
              <td>{inc.incidentCode}</td>
              <td>{inc.cashier.name}</td>
              <td>
                {inc.severity === "CRITICAL" ? (
                  <span style={{ color: "red", fontWeight: 700 }}>{inc.severity}</span>
                ) : (
                  <span style={{ color: "#b45309" }}>{inc.severity}</span>
                )}
              </td>
              <td>{inc.zScore}</td>
              <td>\${inc.flaggedAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div>
          <h3>{selected.incidentCode}</h3>
          <pre>{JSON.stringify(selected.events, null, 2)}</pre>
          <button onClick={() => handleResolve(selected.id, "RESOLVED_CONFIRMED_LOSS", "Verified via register audit")}>
            Confirm Shrink & Lock Evidence
          </button>
          <button onClick={() => handleResolve(selected.id, "RESOLVED_DISMISSED", "False positive training event")}>
            Dismiss Incident
          </button>
        </div>
      )}
    </div>
  );
}
`,
    analog_example: `async function handleResolve(id: string, status: string, notes: string) {
  await fetch(\`/api/v1/cases/\${id}/resolve\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, resolutionNotes: notes }),
  });
  setSelectedCase(null);
  fetch("/api/v1/cases").then((r) => r.json()).then(setCases);
}

<button onClick={() => handleResolve(selectedCase.id, "CONFIRMED", "Verified")}>Confirm</button>
<button onClick={() => handleResolve(selectedCase.id, "DISMISSED", "False positive")}>Dismiss</button>`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Reloading from the real server after a resolve is what keeps the table honest — a resolved incident actually disappears because the server actually resolved it, not because the UI just pretended to.`,
      pain: "Hiding the row locally without telling the server would make the table lie about what's actually still open.",
      mentalModel: MENTAL_MODEL,
      discover: `async function handleResolve(id: string, status: string, notes: string) {
  await fetch(\`/api/v1/incidents/\${id}/resolve\`, { method: "POST", ... });
  setSelected(null);
  fetch("/api/v1/incidents").then((r) => r.json()).then(setIncidents);
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not just remove the row from local state — reload the real list so the table reflects what the server actually did.",
      dryRun: "Wire the same resolve-then-reload pattern for a different two-outcome action.",
      build: `handleResolve posts real status+notes, then clears selection and reloads incidents from the real endpoint.`,
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
  title: "SentinelPOS: incident triage cockpit",
  shortName: "Incident triage",
});
