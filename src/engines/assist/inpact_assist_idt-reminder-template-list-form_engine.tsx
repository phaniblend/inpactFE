import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-reminder-template-list-form",
      title: "Reminder templates list + save-template form",
      body: `Build a screen that lists templates and a form to add one:

  List     →  each row is one ReminderTemplate
  Empty    →  a message when the list has no items
  Form     →  Name, Body, Channel
  Submit   →  the new row appears on the list
`,
      usecase: "Reusable wording is another list+form — same React skill, different nouns.",
      designMock: {"kind":"list-and-form","screenTitle":"Templates","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No templates yet.","rows":[{"title":"Appt tomorrow","subtitle":"See you at {time}","meta":"sms"},{"title":"Second row","subtitle":"Another","meta":"sms"}],"fields":[{"label":"Name","sample":"Appt tomorrow"},{"label":"Body","sample":"See you at {time}"},{"label":"Channel","sample":"sms"}],"submitLabel":"Save template"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Model a template blueprint (template name, subject, body text) and build the template gallery shell.","Hold templates in memory; render each reusable template card, or show \"No saved templates found\" when empty.","Wire template name and message textareas to state so drafting happens in real time.","Intercept submission, save the new template to the gallery, and clear the inputs."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

This file doesn't exist yet — you're the first to touch it. Create it at \`src/components/TemplateDesk.tsx\` before anything else. Every step from here on edits that same file.

Model a template blueprint (template name, subject, body text) and build the template gallery shell.

WHAT YOU'LL NEED
- id (text)
- name (text)
- template (text)

Your task: Define the shape of a reminder template and create the component shell.`,
    hint: `1. Blueprint declaration: Rename ReminderTemplate to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    example_code: `export type ReminderTemplate = {
  id: string;
  name: string;
  template: string;
};

export function TemplateManager() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Templates
  Name: "Appt tomorrow"
  Body: "See you at {time}"
  Channel: "sms"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type ReminderTemplate (id + name, body, channel), then export function TemplateDesk() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type ReminderTemplate (id + name, body, channel), then export function TemplateDesk() returning <div />",
    mc_anchor: "Define type ReminderTemplate (id + name,",
    why_this_matters: `Defining the template shape ensures reusable message formats share consistent properties.`,
    answer_keywords: ["export","type","ReminderTemplate","name","body","channel","export","function","TemplateDesk","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type ReminderTemplate = {
  id: string;
  name: string;
  body: string;
  channel: string;
};

export function TemplateDesk() {
  return <div />;
}
`,
    analog_example: `export type ReminderTemplate = {
  id: string;
  name: string;
  template: string;
};

export function TemplateManager() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Defining the template shape ensures reusable message formats share consistent properties.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists templates and a form to add one:

  List     →  each row is one ReminderTemplate
  Empty    →  a message when the list has no items
  Form     →  Name, Body, Channel
  Submit   →  the new row appears on the list
`,
      discover: `export type ReminderTemplate = {
  id: string;
  name: string;
  body: string;
  channel: string;
};

export function TemplateDesk() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Blueprint declaration: Rename ReminderTemplate to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Hold templates in memory; render each reusable template card, or show "No saved templates found" when empty.

WHAT YOU'LL NEED
- State array holding template items.
- Conditional empty check.
- Map loop rendering template cards.

Your task: Store templates in state and display them, showing a placeholder if none exist.`,
    hint: `1. Set up state: Use useState<ReminderTemplate[]>([]).
2. Check for empty: Use templates.length === 0 to render the empty message.
3. Render entries: Map through templates, passing key={t.id}.`,
    example_code: `const [templates, setTemplates] = useState<ReminderTemplate[]>([]);

return (
  <div>
    {templates.length === 0 ? (
      <p>No templates saved</p>
    ) : (
      templates.map((t) => (
        <div key={t.id}>
          <strong>{t.name}:</strong> {t.template}
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST — Templates
  Appt tomorrow
  See you at {time}

EMPTY — "No templates yet."
\`\`\`

React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user. Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
    mc_options: ["useState for the array; branch on length === 0 before mapping rows with a stable key","let templates = [] and mutate it directly on every update","always render the mapped rows, even when the array is empty"],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `A clear empty state prevents users from wondering whether saved templates failed to load.`,
    answer_keywords: ["useState","templates","setTemplates","length","map","key"],
    seed_code: `import { useState } from "react";

export type ReminderTemplate = {
  id: string;
  name: string;
  body: string;
  channel: string;
};

export function TemplateDesk() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type ReminderTemplate = {
  id: string;
  name: string;
  body: string;
  channel: string;
};

export function TemplateDesk() {
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

export type ReminderTemplate = {
  id: string;
  name: string;
  body: string;
  channel: string;
};

export function TemplateDesk() {
  const [templates, setTemplates] = useState<ReminderTemplate[]>([]);
  return (
    <div>
      {templates.length === 0 ? (
        <p>No templates yet.</p>
      ) : (
        <ul>
          {templates.map((a) => (
            <li key={a.id}>{a.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [templates, setTemplates] = useState<ReminderTemplate[]>([]);

return (
  <div>
    {templates.length === 0 ? (
      <p>No templates saved</p>
    ) : (
      templates.map((t) => (
        <div key={t.id}>
          <strong>{t.name}:</strong> {t.template}
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `A clear empty state prevents users from wondering whether saved templates failed to load.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists templates and a form to add one:

  List     →  each row is one ReminderTemplate
  Empty    →  a message when the list has no items
  Form     →  Name, Body, Channel
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type ReminderTemplate = {
  id: string;
  name: string;
  body: string;
  channel: string;
};

export function TemplateDesk() {
  const [templates, setTemplates] = useState<ReminderTemplate[]>([]);
  return (
    <div>
      {templates.length === 0 ? (
        <p>No templates yet.</p>
      ) : (
        <ul>
          {templates.map((a) => (
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
      build: `1. Set up state: Use useState<ReminderTemplate[]>([]).
2. Check for empty: Use templates.length === 0 to render the empty message.
3. Render entries: Map through templates, passing key={t.id}.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Wire template name and message textareas to state so drafting happens in real time.

WHAT YOU'LL NEED
- State hooks for name and template text inputs.
- Value and onChange props wired on inputs.

Your task: Connect template creation inputs to React state.`,
    hint: `1. Initialize states: Call useState("") for name and template.
2. Wire inputs: Connect value and onChange to each state variable.`,
    example_code: `const [name, setName] = useState("");
const [template, setTemplate] = useState("");

<input value={name} onChange={(e) => setName(e.target.value)} />
<textarea value={template} onChange={(e) => setTemplate(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Templates
  [ Name ]  [ Body ]  [ Channel ]   → Save template
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure clean data capture when writing new templates.`,
    answer_keywords: ["useState","value=","onChange","name","body","channel"],
    seed_code: `import { useState } from "react";

export type ReminderTemplate = {
  id: string;
  name: string;
  body: string;
  channel: string;
};

export function TemplateDesk() {
  const [templates, setTemplates] = useState<ReminderTemplate[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type ReminderTemplate = {
  id: string;
  name: string;
  body: string;
  channel: string;
};

export function TemplateDesk() {
  const [templates, setTemplates] = useState<ReminderTemplate[]>([]);
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

export type ReminderTemplate = {
  id: string;
  name: string;
  body: string;
  channel: string;
};

export function TemplateDesk() {
  const [templates, setTemplates] = useState<ReminderTemplate[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("");
  return (
    <form>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
    </form>
  );
}
`,
    analog_example: `const [name, setName] = useState("");
const [template, setTemplate] = useState("");

<input value={name} onChange={(e) => setName(e.target.value)} />
<textarea value={template} onChange={(e) => setTemplate(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure clean data capture when writing new templates.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists templates and a form to add one:

  List     →  each row is one ReminderTemplate
  Empty    →  a message when the list has no items
  Form     →  Name, Body, Channel
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type ReminderTemplate = {
  id: string;
  name: string;
  body: string;
  channel: string;
};

export function TemplateDesk() {
  const [templates, setTemplates] = useState<ReminderTemplate[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("");
  return (
    <form>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize states: Call useState("") for name and template.
2. Wire inputs: Connect value and onChange to each state variable.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Intercept submission, save the new template to the gallery, and clear the inputs.

WHAT YOU'LL NEED
- Form interceptor using e.preventDefault().
- New template object creation.
- Spread update to state.
- Form reset calls.

Your task: Append the new template to state without a page refresh and reset the form.`,
    hint: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, name, and template into an object.
3. Append item: Use setTemplates((prev) => [...prev, entry]).
4. Clear form: Reset input states to "".`,
    example_code: `function saveTemplate(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), name, template };
  setTemplates((prev) => [...prev, entry]);
  setName("");
  setTemplate("");
}`,
    think_prompt: `\`\`\`text
FORM — Templates
  [ Name ]  [ Body ]  [ Channel ]   → Save template
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Save template is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `Templates appear instantly in the gallery without page reloads.


================================================================================`,
    answer_keywords: ["preventDefault","setTemplates","prev","name","body","channel"],
    seed_code: `import { useState } from "react";

export type ReminderTemplate = {
  id: string;
  name: string;
  body: string;
  channel: string;
};

export function TemplateDesk() {
  const [templates, setTemplates] = useState<ReminderTemplate[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("");
  return (
    <div>
      {templates.length === 0 ? <p>No templates yet.</p> : <ul>{templates.map((a) => <li key={a.id}>{a.name} · {a.body} · {a.channel}</li>)}</ul>}
      <form>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type ReminderTemplate = {
  id: string;
  name: string;
  body: string;
  channel: string;
};

export function TemplateDesk() {
  const [templates, setTemplates] = useState<ReminderTemplate[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {templates.length === 0 ? <p>No templates yet.</p> : <ul>{templates.map((a) => <li key={a.id}>{a.name} · {a.body} · {a.channel}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <button type="submit">Save template</button>
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

export type ReminderTemplate = {
  id: string;
  name: string;
  body: string;
  channel: string;
};

export function TemplateDesk() {
  const [templates, setTemplates] = useState<ReminderTemplate[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: ReminderTemplate = { id: String(Date.now()), name, body, channel };
    setTemplates((prev) => [...prev, next]);
    setName("");
    setBody("");
    setChannel("");
  }
  return (
    <div>
      {templates.length === 0 ? (
        <p>No templates yet.</p>
      ) : (
        <ul>
          {templates.map((a) => (
            <li key={a.id}>{a.name} · {a.body} · {a.channel}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <button type="submit">Save template</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function saveTemplate(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), name, template };
  setTemplates((prev) => [...prev, entry]);
  setName("");
  setTemplate("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Templates appear instantly in the gallery without page reloads.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists templates and a form to add one:

  List     →  each row is one ReminderTemplate
  Empty    →  a message when the list has no items
  Form     →  Name, Body, Channel
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type ReminderTemplate = {
  id: string;
  name: string;
  body: string;
  channel: string;
};

export function TemplateDesk() {
  const [templates, setTemplates] = useState<ReminderTemplate[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: ReminderTemplate = { id: String(Date.now()), name, body, channel };
    setTemplates((prev) => [...prev, next]);
    setName("");
    setBody("");
    setChannel("");
  }
  return (
    <div>
      {templates.length === 0 ? (
        <p>No templates yet.</p>
      ) : (
        <ul>
          {templates.map((a) => (
            <li key={a.id}>{a.name} · {a.body} · {a.channel}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <button type="submit">Save template</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, name, and template into an object.
3. Append item: Use setTemplates((prev) => [...prev, entry]).
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
  title: "Reminder templates list + save-template form",
  shortName: "Template FE",
});
