import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-lead-reply-list-form",
      title: "Reply notes list + add-note form",
      body: `Build a screen that lists notes and a form to add one:

  List     →  each row is one ReplyNote
  Empty    →  a message when the list has no items
  Form     →  Lead id, Body, Channel
  Submit   →  the new row appears on the list
`,
      usecase: "Follow-up is a second list: what we said, on which channel — still list+form.",
      designMock: {"kind":"list-and-form","screenTitle":"Replies","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No replies yet.","rows":[{"title":"L-1","subtitle":"Sent price sheet","meta":"sms"},{"title":"Second row","subtitle":"Another","meta":"sms"}],"fields":[{"label":"Lead id","sample":"L-1"},{"label":"Body","sample":"Sent price sheet"},{"label":"Channel","sample":"sms"}],"submitLabel":"Add note"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Outline the blueprint for a customer reply note and build the container component.","Store notes in memory; display the conversation thread row by row, or a \"No replies logged yet\" note if empty.","Connect the reply textarea to state so typed thoughts are saved on every key press.","Prevent form submission refresh, append the note to the thread, and clear the text area."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

This file doesn't exist yet — you're the first to touch it. Create it at \`src/components/ReplyDesk.tsx\` before anything else. Every step from here on edits that same file.

Outline the blueprint for a customer reply note and build the container component.

WHAT YOU'LL NEED
- id (text)
- author (text)
- body (text)

Your task: Define the shape of a reply note and create the component shell.`,
    hint: `1. Blueprint declaration: Rename ReplyNote to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    example_code: `export type ReplyNote = {
  id: string;
  author: string;
  body: string;
};

export function ReplySection() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Replies
  Lead id: "L-1"
  Body: "Sent price sheet"
  Channel: "sms"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type ReplyNote (id + leadId, body, channel), then export function ReplyDesk() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type ReplyNote (id + leadId, body, channel), then export function ReplyDesk() returning <div />",
    mc_anchor: "Define type ReplyNote (id + leadId, body",
    why_this_matters: `Defining the reply shape ensures conversation messages share a consistent data structure.`,
    answer_keywords: ["export","type","ReplyNote","leadId","body","channel","export","function","ReplyDesk","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type ReplyNote = {
  id: string;
  leadId: string;
  body: string;
  channel: string;
};

export function ReplyDesk() {
  return <div />;
}
`,
    analog_example: `export type ReplyNote = {
  id: string;
  author: string;
  body: string;
};

export function ReplySection() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Defining the reply shape ensures conversation messages share a consistent data structure.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists notes and a form to add one:

  List     →  each row is one ReplyNote
  Empty    →  a message when the list has no items
  Form     →  Lead id, Body, Channel
  Submit   →  the new row appears on the list
`,
      discover: `export type ReplyNote = {
  id: string;
  leadId: string;
  body: string;
  channel: string;
};

export function ReplyDesk() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Blueprint declaration: Rename ReplyNote to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Store notes in memory; display the conversation thread row by row, or a "No replies logged yet" note if empty.

WHAT YOU'LL NEED
- State array holding reply notes.
- Conditional empty check.
- Map loop rendering notes.

Your task: Store reply notes in state and display them, showing a placeholder if no replies exist.`,
    hint: `1. Set up state: Use useState<ReplyNote[]>([]).
2. Check for empty: Use replies.length === 0 to render the empty message.
3. Render entries: Map through replies, passing key={r.id}.`,
    example_code: `const [replies, setReplies] = useState<ReplyNote[]>([]);

return (
  <div>
    {replies.length === 0 ? (
      <p>No replies yet</p>
    ) : (
      replies.map((r) => (
        <div key={r.id}>
          <strong>{r.author}:</strong> {r.body}
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST — Replies
  L-1
  Sent price sheet

EMPTY — "No replies yet."
\`\`\`

React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user. Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
    mc_options: ["useState for the array; branch on length === 0 before mapping rows with a stable key","let notes = [] and mutate it directly on every update","always render the mapped rows, even when the array is empty"],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `A clear empty state prevents users from wondering whether comments failed to load.`,
    answer_keywords: ["useState","notes","setNotes","length","map","key"],
    seed_code: `import { useState } from "react";

export type ReplyNote = {
  id: string;
  leadId: string;
  body: string;
  channel: string;
};

export function ReplyDesk() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type ReplyNote = {
  id: string;
  leadId: string;
  body: string;
  channel: string;
};

export function ReplyDesk() {
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

export type ReplyNote = {
  id: string;
  leadId: string;
  body: string;
  channel: string;
};

export function ReplyDesk() {
  const [notes, setNotes] = useState<ReplyNote[]>([]);
  return (
    <div>
      {notes.length === 0 ? (
        <p>No replies yet.</p>
      ) : (
        <ul>
          {notes.map((a) => (
            <li key={a.id}>{a.leadId}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [replies, setReplies] = useState<ReplyNote[]>([]);

return (
  <div>
    {replies.length === 0 ? (
      <p>No replies yet</p>
    ) : (
      replies.map((r) => (
        <div key={r.id}>
          <strong>{r.author}:</strong> {r.body}
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `A clear empty state prevents users from wondering whether comments failed to load.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists notes and a form to add one:

  List     →  each row is one ReplyNote
  Empty    →  a message when the list has no items
  Form     →  Lead id, Body, Channel
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type ReplyNote = {
  id: string;
  leadId: string;
  body: string;
  channel: string;
};

export function ReplyDesk() {
  const [notes, setNotes] = useState<ReplyNote[]>([]);
  return (
    <div>
      {notes.length === 0 ? (
        <p>No replies yet.</p>
      ) : (
        <ul>
          {notes.map((a) => (
            <li key={a.id}>{a.leadId}</li>
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
      build: `1. Set up state: Use useState<ReplyNote[]>([]).
2. Check for empty: Use replies.length === 0 to render the empty message.
3. Render entries: Map through replies, passing key={r.id}.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Connect the reply textarea to state so typed thoughts are saved on every key press.

WHAT YOU'LL NEED
- State hooks for author and body.
- Value and onChange props wired on inputs.

Your task: Connect reply input fields to React state.`,
    hint: `1. Initialize states: Call useState("") for author and body.
2. Wire inputs: Connect value and onChange to each state variable.`,
    example_code: `const [author, setAuthor] = useState("");
const [body, setBody] = useState("");

<input value={author} onChange={(e) => setAuthor(e.target.value)} />
<textarea value={body} onChange={(e) => setBody(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Replies
  [ Lead id ]  [ Body ]  [ Channel ]   → Add note
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure reply text is tracked cleanly as the user types.`,
    answer_keywords: ["useState","value=","onChange","leadId","body","channel"],
    seed_code: `import { useState } from "react";

export type ReplyNote = {
  id: string;
  leadId: string;
  body: string;
  channel: string;
};

export function ReplyDesk() {
  const [notes, setNotes] = useState<ReplyNote[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type ReplyNote = {
  id: string;
  leadId: string;
  body: string;
  channel: string;
};

export function ReplyDesk() {
  const [notes, setNotes] = useState<ReplyNote[]>([]);
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

export type ReplyNote = {
  id: string;
  leadId: string;
  body: string;
  channel: string;
};

export function ReplyDesk() {
  const [notes, setNotes] = useState<ReplyNote[]>([]);
  const [leadId, setLeadId] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("");
  return (
    <form>
        <input value={leadId} onChange={(e) => setLeadId(e.target.value)} placeholder="Lead id" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
    </form>
  );
}
`,
    analog_example: `const [author, setAuthor] = useState("");
const [body, setBody] = useState("");

<input value={author} onChange={(e) => setAuthor(e.target.value)} />
<textarea value={body} onChange={(e) => setBody(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure reply text is tracked cleanly as the user types.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists notes and a form to add one:

  List     →  each row is one ReplyNote
  Empty    →  a message when the list has no items
  Form     →  Lead id, Body, Channel
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type ReplyNote = {
  id: string;
  leadId: string;
  body: string;
  channel: string;
};

export function ReplyDesk() {
  const [notes, setNotes] = useState<ReplyNote[]>([]);
  const [leadId, setLeadId] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("");
  return (
    <form>
        <input value={leadId} onChange={(e) => setLeadId(e.target.value)} placeholder="Lead id" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize states: Call useState("") for author and body.
2. Wire inputs: Connect value and onChange to each state variable.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Prevent form submission refresh, append the note to the thread, and clear the text area.

WHAT YOU'LL NEED
- Form interceptor using e.preventDefault().
- New reply object creation.
- Spread update to state.
- Form reset calls.

Your task: Append the new reply note to state without a page refresh and reset the form.`,
    hint: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, author, and body into an object.
3. Append item: Use setReplies((prev) => [...prev, entry]).
4. Clear form: Reset input states to "".`,
    example_code: `function submitReply(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), author, body };
  setReplies((prev) => [...prev, entry]);
  setAuthor("");
  setBody("");
}`,
    think_prompt: `\`\`\`text
FORM — Replies
  [ Lead id ]  [ Body ]  [ Channel ]   → Add note
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Add note is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `Replies appear instantly in the conversation thread without page reloads.


================================================================================`,
    answer_keywords: ["preventDefault","setNotes","prev","leadId","body","channel"],
    seed_code: `import { useState } from "react";

export type ReplyNote = {
  id: string;
  leadId: string;
  body: string;
  channel: string;
};

export function ReplyDesk() {
  const [notes, setNotes] = useState<ReplyNote[]>([]);
  const [leadId, setLeadId] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("");
  return (
    <div>
      {notes.length === 0 ? <p>No replies yet.</p> : <ul>{notes.map((a) => <li key={a.id}>{a.leadId} · {a.body} · {a.channel}</li>)}</ul>}
      <form>
        <input value={leadId} onChange={(e) => setLeadId(e.target.value)} placeholder="Lead id" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type ReplyNote = {
  id: string;
  leadId: string;
  body: string;
  channel: string;
};

export function ReplyDesk() {
  const [notes, setNotes] = useState<ReplyNote[]>([]);
  const [leadId, setLeadId] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {notes.length === 0 ? <p>No replies yet.</p> : <ul>{notes.map((a) => <li key={a.id}>{a.leadId} · {a.body} · {a.channel}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={leadId} onChange={(e) => setLeadId(e.target.value)} placeholder="Lead id" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <button type="submit">Add note</button>
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

export type ReplyNote = {
  id: string;
  leadId: string;
  body: string;
  channel: string;
};

export function ReplyDesk() {
  const [notes, setNotes] = useState<ReplyNote[]>([]);
  const [leadId, setLeadId] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: ReplyNote = { id: String(Date.now()), leadId, body, channel };
    setNotes((prev) => [...prev, next]);
    setLeadId("");
    setBody("");
    setChannel("");
  }
  return (
    <div>
      {notes.length === 0 ? (
        <p>No replies yet.</p>
      ) : (
        <ul>
          {notes.map((a) => (
            <li key={a.id}>{a.leadId} · {a.body} · {a.channel}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={leadId} onChange={(e) => setLeadId(e.target.value)} placeholder="Lead id" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <button type="submit">Add note</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function submitReply(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), author, body };
  setReplies((prev) => [...prev, entry]);
  setAuthor("");
  setBody("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Replies appear instantly in the conversation thread without page reloads.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists notes and a form to add one:

  List     →  each row is one ReplyNote
  Empty    →  a message when the list has no items
  Form     →  Lead id, Body, Channel
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type ReplyNote = {
  id: string;
  leadId: string;
  body: string;
  channel: string;
};

export function ReplyDesk() {
  const [notes, setNotes] = useState<ReplyNote[]>([]);
  const [leadId, setLeadId] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: ReplyNote = { id: String(Date.now()), leadId, body, channel };
    setNotes((prev) => [...prev, next]);
    setLeadId("");
    setBody("");
    setChannel("");
  }
  return (
    <div>
      {notes.length === 0 ? (
        <p>No replies yet.</p>
      ) : (
        <ul>
          {notes.map((a) => (
            <li key={a.id}>{a.leadId} · {a.body} · {a.channel}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={leadId} onChange={(e) => setLeadId(e.target.value)} placeholder="Lead id" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel" />
        <button type="submit">Add note</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, author, and body into an object.
3. Append item: Use setReplies((prev) => [...prev, entry]).
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
  title: "Reply notes list + add-note form",
  shortName: "Reply FE",
});
