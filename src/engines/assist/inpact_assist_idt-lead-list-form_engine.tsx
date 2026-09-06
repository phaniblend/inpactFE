import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-lead-list-form",
      title: "Lead inbox list + capture form",
      body: `Build a screen that lists leads and a form to add one:

  List     →  each row is one Lead
  Empty    →  a message when the list has no items
  Form     →  Name, Source, Note
  Submit   →  the new row appears on the list
`,
      usecase: "Leads die in DMs. A capture list+form is the light CRM screen SMBs need before they can afford a full suite.",
      designMock: {"kind":"list-and-form","screenTitle":"Leads","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No leads yet.","rows":[{"title":"Jordan","subtitle":"Instagram","meta":"Wants quote"},{"title":"Second row","subtitle":"Another","meta":"Wants quote"}],"fields":[{"label":"Name","sample":"Jordan"},{"label":"Source","sample":"Instagram"},{"label":"Note","sample":"Wants quote"}],"submitLabel":"Capture"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Define the shape of a sales lead (name, email, company) and build the inbox frame.","Hold leads in state; render each contact card, or display \"Inbox zero — no new leads\" when empty.","Connect form fields to state so potential client details are captured live as you type.","Stop the submit button from reloading the page, stack the lead into your inbox, and reset the form fields."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Define the shape of a sales lead (name, email, company) and build the inbox frame.

WHAT YOU'LL NEED
- id (text)
- name (text)
- email (text)

Your task: Define the shape of a sales lead and create the component shell.`,
    hint: `1. Blueprint declaration: Rename Lead to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    example_code: `export type Lead = {
  id: string;
  name: string;
  email: string;
};

export function LeadInbox() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Leads
  Name: "Jordan"
  Source: "Instagram"
  Note: "Wants quote"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type Lead (id + name, source, note), then export function LeadInbox() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type Lead (id + name, source, note), then export function LeadInbox() returning <div />",
    mc_anchor: "Define type Lead (id + name, source, not",
    why_this_matters: `Modeling lead records ensures consistent contact fields across the app.`,
    answer_keywords: ["export","type","Lead","name","source","note","export","function","LeadInbox","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type Lead = {
  id: string;
  name: string;
  source: string;
  note: string;
};

export function LeadInbox() {
  return <div />;
}
`,
    analog_example: `export type Lead = {
  id: string;
  name: string;
  email: string;
};

export function LeadInbox() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Modeling lead records ensures consistent contact fields across the app.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists leads and a form to add one:

  List     →  each row is one Lead
  Empty    →  a message when the list has no items
  Form     →  Name, Source, Note
  Submit   →  the new row appears on the list
`,
      discover: `export type Lead = {
  id: string;
  name: string;
  source: string;
  note: string;
};

export function LeadInbox() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Blueprint declaration: Rename Lead to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Hold leads in state; render each contact card, or display "Inbox zero — no new leads" when empty.

WHAT YOU'LL NEED
- State array holding leads.
- Conditional empty check.
- Map loop rendering lead cards.

Your task: Store leads in state and display them, showing a placeholder if the inbox is empty.`,
    hint: `1. Set up state: Use useState<Lead[]>([]).
2. Check for empty: Use leads.length === 0 to render the empty message.
3. Render entries: Map through leads, passing key={lead.id}.`,
    example_code: `const [leads, setLeads] = useState<Lead[]>([]);

return (
  <div>
    {leads.length === 0 ? (
      <p>No leads in inbox</p>
    ) : (
      leads.map((lead) => (
        <div key={lead.id}>
          {lead.name} ({lead.email})
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST — Leads
  Jordan
  Instagram

EMPTY — "No leads yet."
\`\`\`

React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user. Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
    mc_options: ["useState for the array; branch on length === 0 before mapping rows with a stable key","let leads = [] and mutate it directly on every update","always render the mapped rows, even when the array is empty"],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `A clear empty state prevents users from wondering whether leads failed to load.`,
    answer_keywords: ["useState","leads","setLeads","length","map","key"],
    seed_code: `import { useState } from "react";

export type Lead = {
  id: string;
  name: string;
  source: string;
  note: string;
};

export function LeadInbox() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type Lead = {
  id: string;
  name: string;
  source: string;
  note: string;
};

export function LeadInbox() {
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

export type Lead = {
  id: string;
  name: string;
  source: string;
  note: string;
};

export function LeadInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  return (
    <div>
      {leads.length === 0 ? (
        <p>No leads yet.</p>
      ) : (
        <ul>
          {leads.map((a) => (
            <li key={a.id}>{a.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [leads, setLeads] = useState<Lead[]>([]);

return (
  <div>
    {leads.length === 0 ? (
      <p>No leads in inbox</p>
    ) : (
      leads.map((lead) => (
        <div key={lead.id}>
          {lead.name} ({lead.email})
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `A clear empty state prevents users from wondering whether leads failed to load.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists leads and a form to add one:

  List     →  each row is one Lead
  Empty    →  a message when the list has no items
  Form     →  Name, Source, Note
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Lead = {
  id: string;
  name: string;
  source: string;
  note: string;
};

export function LeadInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  return (
    <div>
      {leads.length === 0 ? (
        <p>No leads yet.</p>
      ) : (
        <ul>
          {leads.map((a) => (
            <li key={a.id}>{a.name}</li>
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
      build: `1. Set up state: Use useState<Lead[]>([]).
2. Check for empty: Use leads.length === 0 to render the empty message.
3. Render entries: Map through leads, passing key={lead.id}.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Connect form fields to state so potential client details are captured live as you type.

WHAT YOU'LL NEED
- State hooks for name and email.
- Value and onChange props wired on inputs.

Your task: Connect lead capture inputs to React state.`,
    hint: `1. Initialize states: Call useState("") for name and email.
2. Wire inputs: Connect value and onChange to each state variable.`,
    example_code: `const [name, setName] = useState("");
const [email, setEmail] = useState("");

<input value={name} onChange={(e) => setName(e.target.value)} />
<input value={email} onChange={(e) => setEmail(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Leads
  [ Name ]  [ Source ]  [ Note ]   → Capture
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure clean data capture when recording new leads.`,
    answer_keywords: ["useState","value=","onChange","name","source","note"],
    seed_code: `import { useState } from "react";

export type Lead = {
  id: string;
  name: string;
  source: string;
  note: string;
};

export function LeadInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type Lead = {
  id: string;
  name: string;
  source: string;
  note: string;
};

export function LeadInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
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

export type Lead = {
  id: string;
  name: string;
  source: string;
  note: string;
};

export function LeadInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  return (
    <form>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
    </form>
  );
}
`,
    analog_example: `const [name, setName] = useState("");
const [email, setEmail] = useState("");

<input value={name} onChange={(e) => setName(e.target.value)} />
<input value={email} onChange={(e) => setEmail(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure clean data capture when recording new leads.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists leads and a form to add one:

  List     →  each row is one Lead
  Empty    →  a message when the list has no items
  Form     →  Name, Source, Note
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Lead = {
  id: string;
  name: string;
  source: string;
  note: string;
};

export function LeadInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  return (
    <form>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize states: Call useState("") for name and email.
2. Wire inputs: Connect value and onChange to each state variable.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Stop the submit button from reloading the page, stack the lead into your inbox, and reset the form fields.

WHAT YOU'LL NEED
- Form interceptor using e.preventDefault().
- New lead object creation.
- Spread update to state.
- Form reset calls.

Your task: Append the new lead to your inbox without refreshing the page and reset the form.`,
    hint: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, name, and email into an object.
3. Append item: Use setLeads((prev) => [...prev, entry]).
4. Clear form: Reset input states to "".`,
    example_code: `function captureLead(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), name, email };
  setLeads((prev) => [...prev, entry]);
  setName("");
  setEmail("");
}`,
    think_prompt: `\`\`\`text
FORM — Leads
  [ Name ]  [ Source ]  [ Note ]   → Capture
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Capture is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `New leads appear in the list instantly, keeping your sales workflow responsive.


================================================================================`,
    answer_keywords: ["preventDefault","setLeads","prev","name","source","note"],
    seed_code: `import { useState } from "react";

export type Lead = {
  id: string;
  name: string;
  source: string;
  note: string;
};

export function LeadInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  return (
    <div>
      {leads.length === 0 ? <p>No leads yet.</p> : <ul>{leads.map((a) => <li key={a.id}>{a.name} · {a.source} · {a.note}</li>)}</ul>}
      <form>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type Lead = {
  id: string;
  name: string;
  source: string;
  note: string;
};

export function LeadInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {leads.length === 0 ? <p>No leads yet.</p> : <ul>{leads.map((a) => <li key={a.id}>{a.name} · {a.source} · {a.note}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
        <button type="submit">Capture</button>
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

export type Lead = {
  id: string;
  name: string;
  source: string;
  note: string;
};

export function LeadInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Lead = { id: String(Date.now()), name, source, note };
    setLeads((prev) => [...prev, next]);
    setName("");
    setSource("");
    setNote("");
  }
  return (
    <div>
      {leads.length === 0 ? (
        <p>No leads yet.</p>
      ) : (
        <ul>
          {leads.map((a) => (
            <li key={a.id}>{a.name} · {a.source} · {a.note}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
        <button type="submit">Capture</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function captureLead(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), name, email };
  setLeads((prev) => [...prev, entry]);
  setName("");
  setEmail("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `New leads appear in the list instantly, keeping your sales workflow responsive.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists leads and a form to add one:

  List     →  each row is one Lead
  Empty    →  a message when the list has no items
  Form     →  Name, Source, Note
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Lead = {
  id: string;
  name: string;
  source: string;
  note: string;
};

export function LeadInbox() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Lead = { id: String(Date.now()), name, source, note };
    setLeads((prev) => [...prev, next]);
    setName("");
    setSource("");
    setNote("");
  }
  return (
    <div>
      {leads.length === 0 ? (
        <p>No leads yet.</p>
      ) : (
        <ul>
          {leads.map((a) => (
            <li key={a.id}>{a.name} · {a.source} · {a.note}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
        <button type="submit">Capture</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, name, and email into an object.
3. Append item: Use setLeads((prev) => [...prev, entry]).
4. Clear form: Reset input states to "".`,
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
  title: "Lead inbox list + capture form",
  shortName: "Lead FE",
});
