import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-quote-accepted-board",
      title: "Accepted board: filter quotes by status",
      body: `Build a screen that lists quotes and a form to add one:

  List     →  each row is one Quote
  Empty    →  a message when the list has no items
  Form     →  Client, Total, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
  Accept   →  one click moves a quote onto the accepted board
`,
      usecase: "Owners want to see won work. Filter for display; keep the full quote list in state.",
      designMock: {"kind":"list-and-form","screenTitle":"Accepted quotes","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No accepted quotes.","rows":[{"title":"Patel Home","subtitle":"1800","meta":"accepted"},{"title":"Second row","subtitle":"Another","meta":"accepted"}],"fields":[{"label":"Client","sample":"Patel Home"},{"label":"Total","sample":"1800"},{"label":"Status","sample":"accepted"}],"submitLabel":"Create"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Lay the foundation with a blueprint and a container",
      "Show only the quotes you want — and handle empty searches gracefully",
      "Connect text boxes so the computer remembers every keystroke",
      "Save the new quote, add it to the list, and reset the form",
      "Add an \"Accept\" button to move quotes into the accepted board",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

This file doesn't exist yet — you're the first to touch it. Create it at \`src/components/AcceptedBoard.tsx\` before anything else. Every step from here on edits that same file.

Lay the foundation with a blueprint and a container

MOCK ROW — Accepted quotes
  Client: "Patel Home"
  Total: "1800"
  Status: "accepted"

Every row also needs a unique \`id\` — not shown in the mock, but required to track, update, and key each item.

Your task: design a blueprint for one quote, then create the empty container that will display it — write \`type Quote\` with \`id\` plus client, total, status, then define and export AcceptedBoard as a function component returning <div />. Every step from here on edits this same file.`,
    hint: `type Quote = { id: string; client: string; total: string; status: string; }

export function AcceptedBoard() {
  return <div />;
}`,
    example_code: `export type Guest = {
  id: string;
  name: string;
  note: string;
};

export function GuestList() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Accepted quotes
  Client: "Patel Home"
  Total: "1800"
  Status: "accepted"
\`\`\`

Before building a house, you need the floor plan; before drawing a screen, the computer needs to know what an item looks like and where it sits. Looking at the mock row above, what does the blueprint need to name — including a field the mock never shows on screen at all — and what does the container that will hold it need to be called?`,
    mc_options: ["Define type Quote (id + client, total, status), then export function AcceptedBoard() returning <div />", "Skip the type and write JSX directly against untyped objects", "Wait until every backend endpoint exists before modeling the row or the container"],
    mc_correct_option: "Define type Quote (id + client, total, status), then export function AcceptedBoard() returning <div />",
    mc_anchor: "Define type Quote (id + client, total, s",
    why_this_matters: `Setting this up first gives your editor superpowers to spot typos before they cause headaches — think of the type as a blank form with required lines (like client and total). The component is simply a custom building block that will eventually hold those forms. Owners want to see won work; filtering for display only works once the shape of one row is settled.`,
    answer_keywords: ["export","type","Quote","client","total","status","export","function","AcceptedBoard","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the blueprint and the container both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a blueprint for one record, then the empty container that will display it.",
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  return <div />;
}
`,
    analog_example: `export type Guest = {
  id: string;
  name: string;
  note: string;
};

export function GuestList() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Setting this up first gives your editor superpowers to spot typos before they cause headaches — think of the type as a blank form with required lines (like client and total). The component is simply a custom building block that will eventually hold those forms.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists quotes and a form to add one:

  List     →  each row is one Quote
  Empty    →  a message when the list has no items
  Form     →  Client, Total, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
  Accept   →  one click moves a quote onto the accepted board
`,
      discover: `export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `type Quote = { id: string; client: string; total: string; status: string; }

export function AcceptedBoard() {
  return <div />;
}`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Show only the quotes you want — and handle empty searches gracefully

LIST (filtered) — Accepted quotes
  Patel Home
  1800

EMPTY — "No accepted quotes."

Your task: keep your full collection safe in state while displaying only the rows matching "accepted" — hold quotes in state typed as Quote[], render quotes.filter((a) => a.status === "accepted") mapped to rows (key={item.id}), and show the friendly empty message when that filtered result has zero items.`,
    hint: `const [quotes, setQuotes] = useState<Quote[]>([]);
const visible = quotes.filter((a) => a.status === "accepted");
return visible.length === 0 ? <p>No accepted quotes.</p> : <ul>{visible.map((a) => <li key={a.id}>{a.client}</li>)}</ul>;`,
    example_code: `const visible = guests.filter((g) => g.status === "active");
return visible.length === 0 ? (
  <p>No matches.</p>
) : (
  <ul>
    {visible.map((g) => (
      <li key={g.id}>{g.name}</li>
    ))}
  </ul>
);`,
    think_prompt: `\`\`\`text
LIST (filtered) — Accepted quotes
  Patel Home
  1800   (only rows where status is "accepted")

EMPTY — "No accepted quotes."
\`\`\`

Ever search an online store and see an ugly broken page or nothing at all? Think of filtering like looking through a pair of tinted sunglasses — you only see the items that match, but your original master list stays completely untouched in the background. How do you keep the complete quotes list in state, render only the subset above, and still show a clear message when that subset is empty?`,
    mc_options: ["keep the full list in state; filter before map; branch on the filtered length for the empty message", "delete non-matching rows from state permanently", "hide the whole list whenever any filter is active"],
    mc_correct_option: "keep the full list in state; filter before map; branch on the filtered length for the empty message",
    mc_anchor: "keep the full list in state; filter befo",
    why_this_matters: `Showing a clean "No results found" instead of a blank page makes your app feel polished, trustworthy, and pleasant to use. Filtering in render lets users scan what matters without deleting other rows from state — an empty filtered view should not look like a broken screen.`,
    answer_keywords: ["useState","quotes","filter","map","length"],
    seed_code: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  // list state here
  return (
    <div>
      {/* filter, then empty or list */}
    </div>
  );
}
`,
    feedback_correct: "Correct — the full list stays in state, and only the matching rows (or an honest empty message) render.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Filter for display only — state keeps every row, and the empty check runs on the filtered result, not the original.",
    pre_check_hint: `.filter() always returns a brand-new array and never touches the one it was called on — so the full list stays in state, and the array you check for "empty" and then map is the filtered one, not the original.`,
    expected: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const visible = quotes.filter((a) => a.status === "accepted");
  return (
    <div>
      {visible.length === 0 ? (
        <p>No accepted quotes.</p>
      ) : (
        <ul>
          {visible.map((a) => (
            <li key={a.id}>{a.client}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const visible = guests.filter((g) => g.status === "active");
return visible.length === 0 ? (
  <p>No matches.</p>
) : (
  <ul>
    {visible.map((g) => (
      <li key={g.id}>{g.name}</li>
    ))}
  </ul>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `.filter() followed by .map() is a pipeline, not a special React trick: narrow the array down to what should render, then turn what's left into rows. Checking the narrowed array's length — not the original's — is what keeps the empty state honest about the current view instead of the whole dataset.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists quotes and a form to add one:

  List     →  each row is one Quote
  Empty    →  a message when the list has no items
  Form     →  Client, Total, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
  Accept   →  one click moves a quote onto the accepted board
`,
      discover: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const visible = quotes.filter((a) => a.status === "accepted");
  return (
    <div>
      {visible.length === 0 ? (
        <p>No accepted quotes.</p>
      ) : (
        <ul>
          {visible.map((a) => (
            <li key={a.id}>{a.client}</li>
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
      build: `const [quotes, setQuotes] = useState<Quote[]>([]);
const visible = quotes.filter((a) => a.status === "accepted");
return visible.length === 0 ? <p>No accepted quotes.</p> : <ul>{visible.map((a) => <li key={a.id}>{a.client}</li>)}</ul>;`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Connect text boxes so the computer remembers every keystroke

FORM — Accepted quotes
  [ Client ]  [ Total ]  [ Status ]   → Create

Your task: tie your input boxes directly to your app's memory — add one state value per field (client, total, status), then wire each input's value and onChange to it.`,
    hint: `useState("") per field; value={...} onChange sets that state.`,
    example_code: `const [name, setName] = useState("");
<input value={name} onChange={(e) => setName(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Accepted quotes
  [ Client ]  [ Total ]  [ Status ]   → Create
\`\`\`

It's a two-way street: the text box asks the app's memory "What should I display?", and every key press immediately whispers "Update the memory with this letter." Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state", "read the input only on submit via document.getElementById", "store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Forms are how users talk to your app. When your app remembers what someone types character by character, you stay in total control of the data — ready to validate words, limit lengths, or disable buttons instantly.`,
    answer_keywords: ["useState","value=","onChange","client","total","status"],
    seed_code: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
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
    pre_check_hint: `In a functional component, a piece of typed text is just another value that can live in state — the input's value prop reads it back out, and onChange is the only place that ever changes it.`,
    expected: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
    </form>
  );
}
`,
    analog_example: `const [name, setName] = useState("");
<input value={name} onChange={(e) => setName(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Controlled vs. uncontrolled is a real, ongoing choice in React forms, not just boilerplate — a controlled input makes React the single source of truth for what is on screen, so validation, clearing, and reading the value on submit are all just state reads, not DOM queries.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists quotes and a form to add one:

  List     →  each row is one Quote
  Empty    →  a message when the list has no items
  Form     →  Client, Total, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
  Accept   →  one click moves a quote onto the accepted board
`,
      discover: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState("");
  return (
    <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `useState("") per field; value={...} onChange sets that state.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Save the new quote, add it to the list, and reset the form

FORM — Accepted quotes
  [ Client ]  [ Total ]  [ Status ]   → Create

Your task: stop the page from refreshing on click, drop the new entry into your list, and wipe the input boxes clean for next time — call preventDefault, build a new Quote from the field state, add it to quotes without mutating the old array, then clear the fields.`,
    hint: `e.preventDefault(); setQuotes((prev) => [...prev, { id: String(Date.now()), client, total, status }]); then clear fields.`,
    example_code: `setGuests((prev) => [...prev, { id: String(Date.now()), name, note }]);`,
    think_prompt: `\`\`\`text
FORM — Accepted quotes
  [ Client ]  [ Total ]  [ Status ]   → Create
  (stays on the page — the new row appears in the list above)
\`\`\`

Standard web forms try to reload the entire web page on submit. You hit the brakes on that reload, package the typed text into a shiny new card, stack it on top of your existing list, and wipe the board clean. Given that, what has to happen, in order, when Create is used?`,
    mc_options: ["preventDefault, append one item, clear fields", "window.location.reload after every submit", "only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `Nothing feels better than hitting "Save" and watching your item pop onto the screen with zero flickers, leaving a clean slate for the next thought. preventDefault stops navigation; copying the old list plus one new item, then clearing fields, matches the design mock behavior.`,
    answer_keywords: ["preventDefault","setQuotes","prev","client","total","status"],
    seed_code: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState("");
  return (
    <div>
      {quotes.length === 0 ? <p>No accepted quotes.</p> : <ul>{quotes.map((a) => <li key={a.id}>{a.client} · {a.total} · {a.status}</li>)}</ul>}
      <form>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {quotes.length === 0 ? <p>No accepted quotes.</p> : <ul>{quotes.map((a) => <li key={a.id}>{a.client} · {a.total} · {a.status}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
`,
    feedback_correct: "Correct — submit updates list state without a reload.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Stay on the page, grow the list, reset the form.",
    pre_check_hint: `A submit handler runs in a fixed order: stop the default page reload, build the new record from the current field values, add it to state without mutating the old array, then clear the fields for the next entry.`,
    expected: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Quote = { id: String(Date.now()), client, total, status };
    setQuotes((prev) => [...prev, next]);
    setClient("");
    setTotal("");
    setStatus("");
  }
  return (
    <div>
      {quotes.length === 0 ? (
        <p>No accepted quotes.</p>
      ) : (
        <ul>
          {quotes.map((a) => (
            <li key={a.id}>{a.client} · {a.total} · {a.status}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
`,
    analog_example: `setGuests((prev) => [...prev, { id: String(Date.now()), name, note }]);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Every controlled form in React follows the same submit shape — cancel the default, derive the new record, update state immutably, reset the inputs — regardless of what the record actually contains. Learning that shape once means every future "add to a list" form is the same four moves with different field names.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists quotes and a form to add one:

  List     →  each row is one Quote
  Empty    →  a message when the list has no items
  Form     →  Client, Total, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
  Accept   →  one click moves a quote onto the accepted board
`,
      discover: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Quote = { id: String(Date.now()), client, total, status };
    setQuotes((prev) => [...prev, next]);
    setClient("");
    setTotal("");
    setStatus("");
  }
  return (
    <div>
      {quotes.length === 0 ? (
        <p>No accepted quotes.</p>
      ) : (
        <ul>
          {quotes.map((a) => (
            <li key={a.id}>{a.client} · {a.total} · {a.status}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `e.preventDefault(); setQuotes((prev) => [...prev, { id: String(Date.now()), client, total, status }]); then clear fields.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Add an "Accept" button to move quotes into the accepted board

Your task: write a click handler that updates one quote's status to "accepted" by id, split the list into a Pending section (status !== "accepted", each row with an Accept button) and an Accepted section (status === "accepted"), and wire each Accept button to call it.`,
    hint: `function acceptQuote(id: string) {
  setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status: "accepted" } : q)));
}`,
    example_code: `function markDone(id: string) {
  setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: true } : t)));
}`,
    think_prompt: `Creating a quote is only half the battle — approving it should not require retyping the whole record. Given a quote's id, how do you flip just that one row's status while leaving every other quote in the array completely untouched?`,
    mc_options: ["Find the matching quote by id inside .map(), return a copy with status set to \"accepted\", and return every other quote unchanged", "Delete the quote and re-create it with status accepted", "Directly mutate quote.status = \"accepted\" on the object already sitting in state"],
    mc_correct_option: "Find the matching quote by id inside .map(), return a copy with status set to \"accepted\", and return every other quote unchanged",
    mc_anchor: "Find the matching quote by id inside .ma",
    why_this_matters: `Creating a quote is only half the battle; giving users a one-click action to approve it lets them watch the board update dynamically. Find the quote by its ID, flip its status tag, and the Step 2 filter automatically pulls it into the accepted list — no extra wiring needed there.`,
    answer_keywords: ["acceptQuote","map","status","accepted","id"],
    seed_code: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Quote = { id: String(Date.now()), client, total, status };
    setQuotes((prev) => [...prev, next]);
    setClient("");
    setTotal("");
    setStatus("");
  }

  return (
    <div>
      {quotes.length === 0 ? (
        <p>No accepted quotes.</p>
      ) : (
        <ul>
          {quotes.map((a) => (
            <li key={a.id}>{a.client} · {a.total} · {a.status}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Quote = { id: String(Date.now()), client, total, status };
    setQuotes((prev) => [...prev, next]);
    setClient("");
    setTotal("");
    setStatus("");
  }

  // accept handler here

  return (
    <div>
      {/* Pending section (with Accept buttons) and Accepted section */}
      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
`,
    feedback_correct: "Correct — accepting a quote moves it straight onto the accepted board.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Use .map() to return a new array where only the matching id gets status: \"accepted\" — everything else stays as-is.",
    pre_check_hint: `Array.prototype.map() rebuilds the whole array, one item at a time — returning a changed copy only for the matching id (and the original object for everything else) is what updates one row without touching the rest.`,
    expected: `import { useState } from "react";

export type Quote = {
  id: string;
  client: string;
  total: string;
  status: string;
};

export function AcceptedBoard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Quote = { id: String(Date.now()), client, total, status };
    setQuotes((prev) => [...prev, next]);
    setClient("");
    setTotal("");
    setStatus("");
  }

  function acceptQuote(id: string) {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status: "accepted" } : q)));
  }

  const pending = quotes.filter((q) => q.status !== "accepted");
  const accepted = quotes.filter((q) => q.status === "accepted");

  return (
    <div>
      <h3>Pending</h3>
      {pending.length === 0 ? (
        <p>Nothing waiting on you.</p>
      ) : (
        <ul>
          {pending.map((q) => (
            <li key={q.id}>
              {q.client} · {q.total}
              <button type="button" onClick={() => acceptQuote(q.id)}>
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3>Accepted</h3>
      {accepted.length === 0 ? (
        <p>No accepted quotes.</p>
      ) : (
        <ul>
          {accepted.map((q) => (
            <li key={q.id}>
              {q.client} · {q.total}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={onSubmit}>
        <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client" />
        <input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total" />
        <input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function markDone(id: string) {
  setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: true } : t)));
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Updating one record by id inside an array is the same map-and-replace shape you will reuse for approve/reject, archive/restore, or any single-row action — not a special case just for quotes.`,
      pain: "Mutating state directly (or rebuilding the array by hand) breaks React's ability to detect the change and skips every other quote's untouched data.",
      mentalModel: `Build a screen that lists quotes and a form to add one:

  List     →  each row is one Quote
  Empty    →  a message when the list has no items
  Form     →  Client, Total, Status
  Submit   →  the new row appears on the list
  Filter   →  only matching rows render — the full list stays in state
  Accept   →  one click moves a quote onto the accepted board
`,
      discover: `function acceptQuote(id: string) {
  setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status: "accepted" } : q)));
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not mutate the found quote object in place — always return a new object for the matching id.",
      dryRun: "Write the same by-id update-in-place pattern for a different one-click status change.",
      build: `function acceptQuote(id: string) {
  setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status: "accepted" } : q)));
}`,
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
  title: "Accepted board: filter quotes by status",
  shortName: "Accepted board",
});
