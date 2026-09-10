import createINPACTEngine from "../inpact_engine_shared";

const MENTAL_MODEL = `Build the stop board a driver actually works their route from:

  Fetch     ->  the driver's real active route, live from GET /api/v1/routes/active
  Ordered   ->  stops rendered in their real delivery sequence, not arrival order
  Empty     ->  a message when there's no active route assigned
  Status    ->  a completed stop looks done; a pending one still needs action
  Complete  ->  mark a real stop delivered — POST /api/v1/routes/stops/:id/complete
`;

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-routematrix-stopboard",
      title: "RouteMatrix: driver stop board",
      body: MENTAL_MODEL,
      usecase: "The real RouteMatrix backend already solves each driver's route (a capacity-checked, distance-minimized stop order) and already closes a route out automatically once its last stop is complete — this task builds the screen a driver actually works their real deliveries from, stop by stop.",
      designMock: {"kind":"list-and-form","screenTitle":"My Route","caption":"This is the screen you are building — every stop is a real delivery in the driver's real assigned sequence.","listCaption":"STOPS — in real delivery sequence","emptyCaption":"EMPTY — if no route is currently assigned","emptyMessage":"No active route assigned.","rows":[{"title":"1. Maria Chen — 480 Elm St","subtitle":"PENDING","meta":"Mark Delivered"},{"title":"2. Devon Ruiz — 12 Birch Ave","subtitle":"COMPLETED","meta":"✓"}],"fields":[{"label":"Signed by","placeholder":"e.g. M. Chen"}],"formMode":"filter","submitLabel":"Mark Delivered"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Create the component file, define the stop and route types matching the real API's response shape, and export the empty shell.",
      "Fetch the driver's real active route on mount and hold it in state, with a loading message while the request is in flight.",
      "Render the route's real stops in their real delivery sequence, or an empty-state message when no route is assigned.",
      "Style a completed stop distinctly from one still pending, and only offer the complete action on stops that still need it.",
      "Add a Mark Delivered action that completes the real stop and refreshes the route.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    file: "src/components/RouteStopBoard.tsx",
    paal: `Create the component file at src/components/RouteStopBoard.tsx, define the stop and route types, and export the RouteStopBoard component.

Create src/components/RouteStopBoard.tsx, declare a type for one stop and a type for the active route that holds them, then export an empty RouteStopBoard component.

WHAT YOUR BLUEPRINT NEEDS
- A stop needs: id (text), sequence (number — its position in the delivery order), status (text), customerName (text), customerAddress (text).
- The active route needs: id (text), routeCode (text), status (text), and stops — a list of that stop type.

Your task: write type RouteStopView (id, sequence, status, customerName, customerAddress) and type ActiveRoute (id, routeCode, status, stops: RouteStopView[]), then define and export RouteStopBoard as a function component returning <div /> — every step from here on edits this same file.`,
    hint: `1. Create the file: Add a new file at src/components/RouteStopBoard.tsx.
2. Mirror the declaration: a stop's sequence is what real delivery order it's in, separate from its own id.
3. Component shell: Declare export function RouteStopBoard() { return <div />; }.`,
    example_code: `// src/components/PickupQueueBoard.tsx
export type PickupStopView = {
  id: string;
  sequence: number;
  status: string;
  clientName: string;
  clientAddress: string;
};

export type ActiveRun = {
  id: string;
  runCode: string;
  status: string;
  stops: PickupStopView[];
};

export function PickupQueueBoard() {
  return <div />;
}`,
    think_prompt: `A stop's real delivery position — first, second, third — is its own fact, separate from which stop it is or whether it's done yet. What does the blueprint need to name for one stop, and what wraps a list of them into one active route?`,
    mc_options: [
      "type RouteStopView (id, sequence, status, customerName, customerAddress) and type ActiveRoute (id, routeCode, status, stops: RouteStopView[]), then export function RouteStopBoard() returning <div />",
      "a single flat type mixing route fields and stop fields together with no list",
      "wait until the fetch step to decide what a stop looks like",
    ],
    mc_correct_option: "type RouteStopView (id, sequence, status, customerName, customerAddress) and type ActiveRoute (id, routeCode, status, stops: RouteStopView[]), then export function RouteStopBoard() returning <div />",
    mc_anchor: "type RouteStopView (id, sequence, status",
    why_this_matters: `A stop type that names sequence as its own field is what lets the board trust the real delivery order instead of guessing it from array position.`,
    answer_keywords: ["export", "type", "RouteStopView", "sequence", "status", "customerName", "customerAddress", "ActiveRoute", "stops", "export", "function", "RouteStopBoard"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the blueprint matches the real API, and the component shell exists.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Define a stop type with its own sequence field, wrap it in an ActiveRoute type holding a list of stops, then add the empty shell.",
    pre_check_hint: `Every stop on the board describes the same kind of thing — one delivery in a real sequence — so before writing any list code, standardize what one stop looks like as a type, then what a whole active route looks like.

Picture two real stops on one route:
- Stop 1 — Maria Chen, 480 Elm St, PENDING.
- Stop 2 — Devon Ruiz, 12 Birch Ave, COMPLETED.

Every stop needs a property for each of these real facts:
- a unique identifier for that one stop
- its real position in the delivery order — first, second, third
- how far along it is
- who it's for — the customer's name
- where it's going — the customer's address

And the route that holds them needs:
- a unique identifier for the route itself
- a human-readable route code, the kind a dispatcher would actually read off a report
- how far along the whole route is
- the real list of stops, in the shape you just defined

Name each fact as its own property, camelCase, giving each the kind it actually is — the sequence is a number, everything else here is text (except the stops list, which is a list of the stop type).`,
    expected: `export type RouteStopView = {
  id: string;
  sequence: number;
  status: string;
  customerName: string;
  customerAddress: string;
};

export type ActiveRoute = {
  id: string;
  routeCode: string;
  status: string;
  stops: RouteStopView[];
};

export function RouteStopBoard() {
  return <div />;
}
`,
    analog_example: `export type PickupStopView = {
  id: string;
  sequence: number;
  status: string;
  clientName: string;
  clientAddress: string;
};

export type ActiveRun = {
  id: string;
  runCode: string;
  status: string;
  stops: PickupStopView[];
};

export function PickupQueueBoard() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A stop type that names sequence as its own field is what lets the board trust the real delivery order instead of guessing it from array position.`,
      pain: "A type that skips sequence forces the UI to assume array order matches delivery order, which breaks the moment the API ever returns stops unsorted.",
      mentalModel: MENTAL_MODEL,
      discover: `export type RouteStopView = {
  id: string;
  sequence: number;
  status: string;
  customerName: string;
  customerAddress: string;
};

export type ActiveRoute = {
  id: string;
  routeCode: string;
  status: string;
  stops: RouteStopView[];
};

export function RouteStopBoard() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not fold route fields and stop fields into one flat type — a route holds a list of stops, it isn't one.",
      dryRun: "Write the same nested-list type for a different real ordered sequence you haven't modeled before.",
      build: `1. Create the file.\n2. Define RouteStopView, then ActiveRoute wrapping a list of it.\n3. Export the empty shell.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    file: "src/components/RouteStopBoard.tsx",
    paal: `Fetch the driver's real active route on mount and hold it in state, with a loading message while the request is in flight.

Set up state for the active route and a loading flag, fetch from the real API inside useEffect, and show a loading message until the first response arrives.

WHAT YOUR LOGIC NEEDS
- useState<ActiveRoute | null>(null) for the fetched route.
- useState(true) for a loading flag, set to false once the fetch resolves.
- useEffect with an empty dependency array running the fetch exactly once, on mount.
- A relative fetch("/api/v1/routes/active") call — same origin as the app, no hardcoded host.

Your task: fetch("/api/v1/routes/active") inside useEffect, store the response in route, set loading to false when it resolves, and render "Loading…" while loading is true.`,
    hint: `1. Declare state: const [route, setRoute] = useState<ActiveRoute | null>(null); const [loading, setLoading] = useState(true);
2. Fetch on mount: useEffect(() => { fetch("/api/v1/routes/active").then((r) => r.json()).then((data) => { setRoute(data); setLoading(false); }); }, []);
3. Render loading: return loading ? <p>Loading…</p> : <div />; for now.`,
    example_code: `const [run, setRun] = useState<ActiveRun | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/v1/runs/active")
    .then((res) => res.json())
    .then((data) => {
      setRun(data);
      setLoading(false);
    });
}, []);`,
    think_prompt: `fetch() returns a Promise, not the data itself — the real response only exists inside .then(). A useEffect with an empty dependency array runs exactly once, right when the component first appears. Right after mount, route is null for the exact same reason it would be null if the driver genuinely had nothing assigned — what tells those two situations apart until the real data arrives?`,
    mc_options: [
      "a loading flag, true until the fetch resolves, checked before deciding what to render",
      "assume route === null always means nothing is assigned",
      "call fetch directly inside the JSX return",
    ],
    mc_correct_option: "a loading flag, true until the fetch resolves, checked before deciding what to render",
    mc_anchor: "a loading flag, true until the fetch res",
    why_this_matters: `Running fetch inside useEffect with a loading flag means the request fires exactly once, and a driver sees an honest "still loading" instead of a false "nothing assigned" for a moment.`,
    answer_keywords: ["useState", "loading", "useEffect", "fetch", "route", "setRoute", "setLoading"],
    seed_code: `export type RouteStopView = {
  id: string;
  sequence: number;
  status: string;
  customerName: string;
  customerAddress: string;
};

export type ActiveRoute = {
  id: string;
  routeCode: string;
  status: string;
  stops: RouteStopView[];
};

export function RouteStopBoard() {
  return <div />;
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type RouteStopView = {
  id: string;
  sequence: number;
  status: string;
  customerName: string;
  customerAddress: string;
};

export type ActiveRoute = {
  id: string;
  routeCode: string;
  status: string;
  stops: RouteStopView[];
};

export function RouteStopBoard() {
  // route + loading state, and the fetch, go here
  return <div />;
}
`,
    feedback_correct: "Correct — real data now flows into state on mount, with an honest loading state.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "fetch has to run inside useEffect([]), and its result only exists inside .then() — set loading false there too.",
    pre_check_hint: `fetch() returns a Promise; the real response only exists inside .then() (or after an await). A useEffect with an empty array makes that chain run exactly once, right when the component first appears.

- Fetch from the real endpoint: \`/api/v1/routes/active\`.
- Once that response resolves, hand it straight to your \`route\` state setter.
- Then flip your loading flag to false, now that the real data has arrived.

Until that response comes back, the loading flag stays true — that's what tells a route that's genuinely still loading apart from one that's genuinely unassigned.`,
    expected: `import { useState, useEffect } from "react";

export type RouteStopView = {
  id: string;
  sequence: number;
  status: string;
  customerName: string;
  customerAddress: string;
};

export type ActiveRoute = {
  id: string;
  routeCode: string;
  status: string;
  stops: RouteStopView[];
};

export function RouteStopBoard() {
  const [route, setRoute] = useState<ActiveRoute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/routes/active")
      .then((res) => res.json())
      .then((data) => {
        setRoute(data);
        setLoading(false);
      });
  }, []);

  return loading ? <p>Loading…</p> : <div />;
}
`,
    analog_example: `const [run, setRun] = useState<ActiveRun | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/v1/runs/active")
    .then((res) => res.json())
    .then((data) => {
      setRun(data);
      setLoading(false);
    });
}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Running fetch inside useEffect with a loading flag means the request fires exactly once, and a driver sees an honest "still loading" instead of a false "nothing assigned" for a moment.`,
      pain: "Without a loading flag, a genuinely unassigned driver and one whose route just hasn't loaded yet look identical.",
      mentalModel: MENTAL_MODEL,
      discover: `useEffect(() => {
  fetch("/api/v1/routes/active")
    .then((res) => res.json())
    .then((data) => {
      setRoute(data);
      setLoading(false);
    });
}, []);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not call fetch() directly inside the component body (outside useEffect) — that refetches on every render.",
      dryRun: "Write the same fetch-on-mount step for a different real endpoint on this same backend.",
      build: `useState<ActiveRoute | null>(null) + useState(true) for loading, then fetch("/api/v1/routes/active") inside useEffect([]).`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    file: "src/components/RouteStopBoard.tsx",
    paal: `Render the route's real stops in their real delivery sequence, or an empty-state message when no route is assigned.

Once loading is false, check whether a route was actually returned, then list its stops in their real sequence order.

WHAT YOUR LOGIC NEEDS
- A check for route === null (after loading finishes) rendering "No active route assigned."
- Otherwise, sort the real stops by their own sequence field before rendering (never trust array order alone).
- One row per stop showing sequence, customerName, customerAddress, status.

Your task: after the loading branch, check route === null for "No active route assigned.", otherwise render the route's stops sorted by sequence, one row each showing sequence, customerName, customerAddress, and status.`,
    hint: `1. Empty check: route === null ? <p>No active route assigned.</p> : (...)
2. Sort first: [...route.stops].sort((a, b) => a.sequence - b.sequence) — spread first so you don't mutate the original array.
3. Render rows: .map((stop) => <div key={stop.id}>{stop.sequence}. {stop.customerName} — {stop.customerAddress} ({stop.status})</div>).`,
    example_code: `if (run === null) return <p>No active run assigned.</p>;

const sorted = [...run.stops].sort((a, b) => a.sequence - b.sequence);

return (
  <div>
    {sorted.map((stop) => (
      <div key={stop.id}>
        {stop.sequence}. {stop.clientName} — {stop.clientAddress} ({stop.status})
      </div>
    ))}
  </div>
);`,
    think_prompt: `A real delivery sequence is a fact about each stop, not the order the array happens to arrive in — the API isn't promising to always send stops pre-sorted. What has to happen to the stops list before it's rendered, and what shows when there's genuinely no route at all?`,
    mc_options: [
      "check route === null first for the empty state, then sort a copy of stops by sequence before rendering one row each",
      "render route.stops directly in whatever order the API happened to send them",
      "sort stops by customerName instead of sequence",
    ],
    mc_correct_option: "check route === null first for the empty state, then sort a copy of stops by sequence before rendering one row each",
    mc_anchor: "check route === null first for the empty",
    why_this_matters: `Sorting by the real sequence field is what guarantees a driver always sees their actual delivery order, even if the API ever changes how it lists stops.`,
    answer_keywords: ["route", "null", "sort", "sequence", "map", "key"],
    seed_code: `import { useState, useEffect } from "react";

export type RouteStopView = {
  id: string;
  sequence: number;
  status: string;
  customerName: string;
  customerAddress: string;
};

export type ActiveRoute = {
  id: string;
  routeCode: string;
  status: string;
  stops: RouteStopView[];
};

export function RouteStopBoard() {
  const [route, setRoute] = useState<ActiveRoute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/routes/active")
      .then((res) => res.json())
      .then((data) => {
        setRoute(data);
        setLoading(false);
      });
  }, []);

  return loading ? <p>Loading…</p> : <div />;
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type RouteStopView = {
  id: string;
  sequence: number;
  status: string;
  customerName: string;
  customerAddress: string;
};

export type ActiveRoute = {
  id: string;
  routeCode: string;
  status: string;
  stops: RouteStopView[];
};

export function RouteStopBoard() {
  const [route, setRoute] = useState<ActiveRoute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/routes/active")
      .then((res) => res.json())
      .then((data) => {
        setRoute(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  // empty check + sorted stop list go here
  return <div />;
}
`,
    feedback_correct: "Correct — real stops, real sequence order, one row per stop.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Check route === null first, then sort a copy of stops by sequence before rendering.",
    pre_check_hint: `Once loading is done, this is the same list-render pattern you've used before — check for the empty case, then sort and map instead of rendering raw array order.

- Check route === null and render "No active route assigned." when true.
- Otherwise, make a sorted copy of route.stops ordered by each stop's own sequence.
- Render one row per stop, keyed by stop.id, showing sequence, customerName, customerAddress, and status.`,
    expected: `import { useState, useEffect } from "react";

export type RouteStopView = {
  id: string;
  sequence: number;
  status: string;
  customerName: string;
  customerAddress: string;
};

export type ActiveRoute = {
  id: string;
  routeCode: string;
  status: string;
  stops: RouteStopView[];
};

export function RouteStopBoard() {
  const [route, setRoute] = useState<ActiveRoute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/routes/active")
      .then((res) => res.json())
      .then((data) => {
        setRoute(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (route === null) return <p>No active route assigned.</p>;

  const sortedStops = [...route.stops].sort((a, b) => a.sequence - b.sequence);

  return (
    <div>
      {sortedStops.map((stop) => (
        <div key={stop.id}>
          {stop.sequence}. {stop.customerName} — {stop.customerAddress} ({stop.status})
        </div>
      ))}
    </div>
  );
}
`,
    analog_example: `if (run === null) return <p>No active run assigned.</p>;

const sorted = [...run.stops].sort((a, b) => a.sequence - b.sequence);

return (
  <div>
    {sorted.map((stop) => (
      <div key={stop.id}>
        {stop.sequence}. {stop.clientName} — {stop.clientAddress} ({stop.status})
      </div>
    ))}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Sorting by the real sequence field is what guarantees a driver always sees their actual delivery order, even if the API ever changes how it lists stops.`,
      pain: "Trusting raw array order instead of the sequence field would send a driver to stop 3 before stop 1 the moment the API's ordering ever shifts.",
      mentalModel: MENTAL_MODEL,
      discover: `const sortedStops = [...route.stops].sort((a, b) => a.sequence - b.sequence);
{sortedStops.map((stop) => <div key={stop.id}>...</div>)}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not sort route.stops in place — spread it into a new array first so state stays untouched.",
      dryRun: "Draw the same sorted-list-plus-empty-state pattern for a different real ordered sequence.",
      build: `1. Empty check: route === null.\n2. Sort a copy of stops by sequence.\n3. Render one row per stop, keyed by stop.id.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    file: "src/components/RouteStopBoard.tsx",
    paal: `Style a completed stop distinctly from one still pending, and only offer the complete action on stops that still need it.

Give a COMPLETED stop a visibly different look from one still pending, and reserve the (upcoming) complete button for stops that genuinely aren't done yet.

WHAT YOUR LOGIC NEEDS
- A per-row conditional: stop.status === "COMPLETED" ? done styling : not-done styling.
- A separate boolean, readable per row, for "this stop still needs action" — stop.status !== "COMPLETED".
- The styling itself can be inline style or a className — the decision must come from each row's own status, not a fixed look for the whole list.

Your task: wrap each row's status text in a <span> styled muted/struck-through when COMPLETED and left plain otherwise, and compute a needsAction boolean per row (status !== "COMPLETED") for the next step to use.`,
    hint: `1. Compare each row's own status: stop.status === "COMPLETED".
2. Style the completed ones: <span style={{color:"#64748b", textDecoration:"line-through"}}>{stop.status}</span> vs a plain <span>{stop.status}</span>.
3. Compute needsAction per row: const needsAction = stop.status !== "COMPLETED"; — you'll use this in the next step to decide whether to show the button.`,
    example_code: `{sorted.map((stop) => {
  const needsAction = stop.status !== "COMPLETED";
  return (
    <div key={stop.id}>
      {stop.sequence}. {stop.clientName} —{" "}
      {stop.status === "COMPLETED" ? (
        <span style={{ color: "#64748b", textDecoration: "line-through" }}>{stop.status}</span>
      ) : (
        <span>{stop.status}</span>
      )}
    </div>
  );
})}`,
    think_prompt: `A driver scanning a long route needs the done stops to visually fade out of the way, and needs to know at a glance which ones still need a tap. What single per-row comparison decides both the look and whether the action applies?`,
    mc_options: [
      "compare each row's own status to \"COMPLETED\" for both the styling and a needsAction flag",
      "style every row the same regardless of status",
      "decide needsAction from the stop's position in the list instead of its actual status",
    ],
    mc_correct_option: "compare each row's own status to \"COMPLETED\" for both the styling and a needsAction flag",
    mc_anchor: "compare each row's own status to \"COMP",
    why_this_matters: `A completed stop that visibly fades out, and a plain needsAction flag driving the button, is what keeps the board honest about what's actually still left to do.`,
    answer_keywords: ["status", "COMPLETED", "needsAction", "style"],
    seed_code: `import { useState, useEffect } from "react";

export type RouteStopView = {
  id: string;
  sequence: number;
  status: string;
  customerName: string;
  customerAddress: string;
};

export type ActiveRoute = {
  id: string;
  routeCode: string;
  status: string;
  stops: RouteStopView[];
};

export function RouteStopBoard() {
  const [route, setRoute] = useState<ActiveRoute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/routes/active")
      .then((res) => res.json())
      .then((data) => {
        setRoute(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (route === null) return <p>No active route assigned.</p>;

  const sortedStops = [...route.stops].sort((a, b) => a.sequence - b.sequence);

  return (
    <div>
      {sortedStops.map((stop) => (
        <div key={stop.id}>
          {stop.sequence}. {stop.customerName} — {stop.customerAddress} ({stop.status})
        </div>
      ))}
    </div>
  );
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type RouteStopView = {
  id: string;
  sequence: number;
  status: string;
  customerName: string;
  customerAddress: string;
};

export type ActiveRoute = {
  id: string;
  routeCode: string;
  status: string;
  stops: RouteStopView[];
};

export function RouteStopBoard() {
  const [route, setRoute] = useState<ActiveRoute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/routes/active")
      .then((res) => res.json())
      .then((data) => {
        setRoute(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (route === null) return <p>No active route assigned.</p>;

  const sortedStops = [...route.stops].sort((a, b) => a.sequence - b.sequence);

  return (
    <div>
      {sortedStops.map((stop) => {
        // needsAction + status styling go here
        return (
          <div key={stop.id}>
            {stop.sequence}. {stop.customerName} — {stop.customerAddress} ({stop.status})
          </div>
        );
      })}
    </div>
  );
}
`,
    feedback_correct: "Correct — completed stops now visually fade, and each row knows whether it still needs action.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Compare each row's own status to \"COMPLETED\" for both the styling and the needsAction flag.",
    pre_check_hint: `This is the same per-row ternary pattern as any other conditional styling — both the look and the needsAction flag come from that one row's own status, evaluated fresh for every row.

- Compute needsAction as true when a row's status is not "COMPLETED".
- Show muted, struck-through styling on the status text when a row is COMPLETED.
- Leave the status text plain otherwise.
- Base every decision on that row's own \`stop.status\`, never a fixed look for the whole list.`,
    expected: `import { useState, useEffect } from "react";

export type RouteStopView = {
  id: string;
  sequence: number;
  status: string;
  customerName: string;
  customerAddress: string;
};

export type ActiveRoute = {
  id: string;
  routeCode: string;
  status: string;
  stops: RouteStopView[];
};

export function RouteStopBoard() {
  const [route, setRoute] = useState<ActiveRoute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/routes/active")
      .then((res) => res.json())
      .then((data) => {
        setRoute(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (route === null) return <p>No active route assigned.</p>;

  const sortedStops = [...route.stops].sort((a, b) => a.sequence - b.sequence);

  return (
    <div>
      {sortedStops.map((stop) => {
        const needsAction = stop.status !== "COMPLETED";
        return (
          <div key={stop.id}>
            {stop.sequence}. {stop.customerName} — {stop.customerAddress}{" "}
            {stop.status === "COMPLETED" ? (
              <span style={{ color: "#64748b", textDecoration: "line-through" }}>{stop.status}</span>
            ) : (
              <span>{stop.status}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
`,
    analog_example: `{sorted.map((stop) => {
  const needsAction = stop.status !== "COMPLETED";
  return (
    <div key={stop.id}>
      {stop.sequence}. {stop.clientName} —{" "}
      {stop.status === "COMPLETED" ? (
        <span style={{ color: "#64748b", textDecoration: "line-through" }}>{stop.status}</span>
      ) : (
        <span>{stop.status}</span>
      )}
    </div>
  );
})}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A completed stop that visibly fades out, and a plain needsAction flag driving the button, is what keeps the board honest about what's actually still left to do.`,
      pain: "Without a needsAction flag tied to the real status, a completed stop could end up with a button that lets a driver \"complete\" it again.",
      mentalModel: MENTAL_MODEL,
      discover: `const needsAction = stop.status !== "COMPLETED";
{stop.status === "COMPLETED" ? (
  <span style={{ color: "#64748b", textDecoration: "line-through" }}>{stop.status}</span>
) : (
  <span>{stop.status}</span>
)}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not compute needsAction from position in the list — always compare that row's own status.",
      dryRun: "Add the same kind of done/pending distinction to a different list with a different pair of states.",
      build: `Style the status muted+struck-through when COMPLETED, plain otherwise; compute needsAction from each row's own status.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    file: "src/components/RouteStopBoard.tsx",
    paal: `Add a Mark Delivered action that completes the real stop and refreshes the route.

Show a Mark Delivered button on any stop that still needs action, and wire it to post the real completion to the server, then refresh the whole route.

WHAT YOUR LOGIC NEEDS
- An async handler that posts to /api/v1/routes/stops/:stopId/complete with a signatureData string.
- A button, shown only when needsAction is true, that calls that handler for its own row's stop.
- On a successful response, refetch /api/v1/routes/active so the board reflects the real, current state (including the backend's own auto-closeout if that was the last stop).

Your task: write handleComplete(stopId, signatureData), show a Mark Delivered button only on rows where needsAction is true, and on success reload the real active route.`,
    hint: `1. Handler: async function handleComplete(stopId: string, signatureData: string) { await fetch(\`/api/v1/routes/stops/\${stopId}/complete\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ signatureData }) }); fetch("/api/v1/routes/active").then((r) => r.json()).then(setRoute); }
2. Button: {needsAction && <button onClick={() => handleComplete(stop.id, "Signed on device")}>Mark Delivered</button>}`,
    example_code: `async function handleComplete(stopId: string, signatureData: string) {
  await fetch(\`/api/v1/runs/stops/\${stopId}/complete\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signatureData }),
  });
  fetch("/api/v1/runs/active").then((r) => r.json()).then(setRun);
}

{needsAction && (
  <button onClick={() => handleComplete(stop.id, "Signed on device")}>Mark Delivered</button>
)}`,
    think_prompt: `Completing a stop changes something real on the server — and per the backend's own auto-closeout rule, it might even complete the whole route if it was the last one. What has to happen to the local view once the real POST actually succeeds?`,
    mc_options: [
      "post the real signature to the complete endpoint, then reload the real active route from the server",
      "just remove the row locally without ever telling the server anything changed",
      "reload the whole page after every completion",
    ],
    mc_correct_option: "post the real signature to the complete endpoint, then reload the real active route from the server",
    mc_anchor: "post the real signature to the complete e",
    why_this_matters: `Reloading the real active route after completing a stop is what lets the board pick up the backend's own auto-closeout the moment the last stop is done — not a guess made client-side.`,
    answer_keywords: ["handleComplete", "fetch", "complete", "signatureData", "setRoute", "needsAction"],
    seed_code: `import { useState, useEffect } from "react";

export type RouteStopView = {
  id: string;
  sequence: number;
  status: string;
  customerName: string;
  customerAddress: string;
};

export type ActiveRoute = {
  id: string;
  routeCode: string;
  status: string;
  stops: RouteStopView[];
};

export function RouteStopBoard() {
  const [route, setRoute] = useState<ActiveRoute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/routes/active")
      .then((res) => res.json())
      .then((data) => {
        setRoute(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (route === null) return <p>No active route assigned.</p>;

  const sortedStops = [...route.stops].sort((a, b) => a.sequence - b.sequence);

  return (
    <div>
      {sortedStops.map((stop) => {
        const needsAction = stop.status !== "COMPLETED";
        return (
          <div key={stop.id}>
            {stop.sequence}. {stop.customerName} — {stop.customerAddress}{" "}
            {stop.status === "COMPLETED" ? (
              <span style={{ color: "#64748b", textDecoration: "line-through" }}>{stop.status}</span>
            ) : (
              <span>{stop.status}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
`,
    starter_code: `import { useState, useEffect } from "react";

export type RouteStopView = {
  id: string;
  sequence: number;
  status: string;
  customerName: string;
  customerAddress: string;
};

export type ActiveRoute = {
  id: string;
  routeCode: string;
  status: string;
  stops: RouteStopView[];
};

export function RouteStopBoard() {
  const [route, setRoute] = useState<ActiveRoute | null>(null);
  const [loading, setLoading] = useState(true);
  // handleComplete goes here

  useEffect(() => {
    fetch("/api/v1/routes/active")
      .then((res) => res.json())
      .then((data) => {
        setRoute(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (route === null) return <p>No active route assigned.</p>;

  const sortedStops = [...route.stops].sort((a, b) => a.sequence - b.sequence);

  return (
    <div>
      {sortedStops.map((stop) => {
        const needsAction = stop.status !== "COMPLETED";
        return (
          <div key={stop.id}>
            {stop.sequence}. {stop.customerName} — {stop.customerAddress}{" "}
            {stop.status === "COMPLETED" ? (
              <span style={{ color: "#64748b", textDecoration: "line-through" }}>{stop.status}</span>
            ) : (
              <span>{stop.status}</span>
            )}
            {/* Mark Delivered button goes here */}
          </div>
        );
      })}
    </div>
  );
}
`,
    feedback_correct: "Correct — the whole stop board is now real: fetch, review, and complete.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Post the real signature to the complete endpoint, then reload the real active route so any auto-closeout shows up.",
    pre_check_hint: `Completing a stop is a real POST with a real signature; once it succeeds, reload the whole active route rather than guessing locally what changed — the backend may have also just closed out the entire route.

- Write an async function that posts to the real complete endpoint for a given stop id, with a signatureData string.
- On success, re-fetch the real active route and update state with it.
- Show a Mark Delivered button only on rows where needsAction is true, calling that function with that row's own stop id.`,
    expected: `import { useState, useEffect } from "react";

export type RouteStopView = {
  id: string;
  sequence: number;
  status: string;
  customerName: string;
  customerAddress: string;
};

export type ActiveRoute = {
  id: string;
  routeCode: string;
  status: string;
  stops: RouteStopView[];
};

export function RouteStopBoard() {
  const [route, setRoute] = useState<ActiveRoute | null>(null);
  const [loading, setLoading] = useState(true);

  async function handleComplete(stopId: string, signatureData: string) {
    await fetch(\`/api/v1/routes/stops/\${stopId}/complete\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signatureData }),
    });
    fetch("/api/v1/routes/active").then((r) => r.json()).then(setRoute);
  }

  useEffect(() => {
    fetch("/api/v1/routes/active")
      .then((res) => res.json())
      .then((data) => {
        setRoute(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading…</p>;
  if (route === null) return <p>No active route assigned.</p>;

  const sortedStops = [...route.stops].sort((a, b) => a.sequence - b.sequence);

  return (
    <div>
      {sortedStops.map((stop) => {
        const needsAction = stop.status !== "COMPLETED";
        return (
          <div key={stop.id}>
            {stop.sequence}. {stop.customerName} — {stop.customerAddress}{" "}
            {stop.status === "COMPLETED" ? (
              <span style={{ color: "#64748b", textDecoration: "line-through" }}>{stop.status}</span>
            ) : (
              <span>{stop.status}</span>
            )}
            {needsAction && (
              <button onClick={() => handleComplete(stop.id, "Signed on device")}>Mark Delivered</button>
            )}
          </div>
        );
      })}
    </div>
  );
}
`,
    analog_example: `async function handleComplete(stopId: string, signatureData: string) {
  await fetch(\`/api/v1/runs/stops/\${stopId}/complete\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signatureData }),
  });
  fetch("/api/v1/runs/active").then((r) => r.json()).then(setRun);
}

{needsAction && (
  <button onClick={() => handleComplete(stop.id, "Signed on device")}>Mark Delivered</button>
)}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Reloading the real active route after completing a stop is what lets the board pick up the backend's own auto-closeout the moment the last stop is done — not a guess made client-side.`,
      pain: "Removing the row locally without reloading would miss the backend's own auto-closeout, leaving the board out of sync with what's actually true.",
      mentalModel: MENTAL_MODEL,
      discover: `async function handleComplete(stopId: string, signatureData: string) {
  await fetch(\`/api/v1/routes/stops/\${stopId}/complete\`, { method: "POST", ... });
  fetch("/api/v1/routes/active").then((r) => r.json()).then(setRoute);
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not mark the stop complete only in local state — reload the real route so any backend auto-closeout is reflected.",
      dryRun: "Wire the same complete-then-reload pattern for a different single-action list.",
      build: `handleComplete posts real stopId+signatureData, then reloads the active route from the real endpoint.`,
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
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "RouteMatrix: driver stop board",
  shortName: "Route stops",
});
