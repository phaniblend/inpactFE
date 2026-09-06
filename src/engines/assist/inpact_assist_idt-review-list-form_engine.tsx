import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-review-list-form",
      title: "Review inbox list + log-review form",
      body: `Build a screen that lists reviews and a form to add one:

  List     →  each row is one Review
  Empty    →  a message when the list has no items
  Form     →  Author, Rating, Body
  Submit   →  the new row appears on the list
`,
      usecase: "Unanswered reviews cost trust. A list+form inbox is the light alternative to reputation suites.",
      designMock: {"kind":"list-and-form","screenTitle":"Reviews","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"No reviews yet.","rows":[{"title":"Sam","subtitle":"5","meta":"Great cut"},{"title":"Second row","subtitle":"Another","meta":"Great cut"}],"fields":[{"label":"Author","sample":"Sam"},{"label":"Rating","sample":"5"},{"label":"Body","sample":"Great cut"}],"submitLabel":"Log review"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ["Create a customer review blueprint (reviewer, star rating, feedback text) and build the inbox view.","Store reviews in memory; display each review card, or show a \"No customer reviews yet\" message when empty.","Wire star rating and review comment fields to state for real-time tracking.","Block default page reload, drop the review into the inbox, and clear the form fields."],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Create a customer review blueprint (reviewer, star rating, feedback text) and build the inbox view.

WHAT YOU'LL NEED
- id (text)
- reviewer (text)
- comment (text)

Your task: Define the shape of a review and create the component shell.`,
    hint: `1. Blueprint declaration: Rename Review to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    example_code: `export type Review = {
  id: string;
  reviewer: string;
  comment: string;
};

export function ReviewInbox() {
  return <div />;
}`,
    think_prompt: `\`\`\`text
MOCK ROW — Reviews
  Author: "Sam"
  Rating: "5"
  Body: "Great cut"
\`\`\`

Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it. Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
    mc_options: ["Define type Review (id + author, rating, body), then export function ReviewInbox() returning <div />","Skip the type and write JSX directly against untyped objects","Wait until every backend endpoint exists before modeling the row or the component"],
    mc_correct_option: "Define type Review (id + author, rating, body), then export function ReviewInbox() returning <div />",
    mc_anchor: "Define type Review (id + author, rating,",
    why_this_matters: `Modeling review records ensures consistent feedback fields across the app.`,
    answer_keywords: ["export","type","Review","author","rating","body","export","function","ReviewInbox","return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the data shape and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: `A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.`,
    expected: `export type Review = {
  id: string;
  author: string;
  rating: string;
  body: string;
};

export function ReviewInbox() {
  return <div />;
}
`,
    analog_example: `export type Review = {
  id: string;
  reviewer: string;
  comment: string;
};

export function ReviewInbox() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Modeling review records ensures consistent feedback fields across the app.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists reviews and a form to add one:

  List     →  each row is one Review
  Empty    →  a message when the list has no items
  Form     →  Author, Rating, Body
  Submit   →  the new row appears on the list
`,
      discover: `export type Review = {
  id: string;
  author: string;
  rating: string;
  body: string;
};

export function ReviewInbox() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Blueprint declaration: Rename Review to your type name and define required fields.
2. Shell component: Declare your component returning an empty <div />.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Store reviews in memory; display each review card, or show a "No customer reviews yet" message when empty.

WHAT YOU'LL NEED
- State array holding reviews.
- Conditional empty check.
- Map loop rendering review entries.

Your task: Store reviews in state and display them, showing a placeholder if the inbox is empty.`,
    hint: `1. Set up state: Use useState<Review[]>([]).
2. Check for empty: Use reviews.length === 0 to render the empty message.
3. Render entries: Map through reviews, passing key={rev.id}.`,
    example_code: `const [reviews, setReviews] = useState<Review[]>([]);

return (
  <div>
    {reviews.length === 0 ? (
      <p>No customer reviews logged</p>
    ) : (
      reviews.map((rev) => (
        <div key={rev.id}>
          <strong>{rev.reviewer}:</strong> {rev.comment}
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `\`\`\`text
LIST — Reviews
  Sam
  5

EMPTY — "No reviews yet."
\`\`\`

React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user. Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
    mc_options: ["useState for the array; branch on length === 0 before mapping rows with a stable key","let reviews = [] and mutate it directly on every update","always render the mapped rows, even when the array is empty"],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `A clear empty state prevents users from wondering whether reviews failed to load.`,
    answer_keywords: ["useState","reviews","setReviews","length","map","key"],
    seed_code: `import { useState } from "react";

export type Review = {
  id: string;
  author: string;
  rating: string;
  body: string;
};

export function ReviewInbox() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type Review = {
  id: string;
  author: string;
  rating: string;
  body: string;
};

export function ReviewInbox() {
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

export type Review = {
  id: string;
  author: string;
  rating: string;
  body: string;
};

export function ReviewInbox() {
  const [reviews, setReviews] = useState<Review[]>([]);
  return (
    <div>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((a) => (
            <li key={a.id}>{a.author}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [reviews, setReviews] = useState<Review[]>([]);

return (
  <div>
    {reviews.length === 0 ? (
      <p>No customer reviews logged</p>
    ) : (
      reviews.map((rev) => (
        <div key={rev.id}>
          <strong>{rev.reviewer}:</strong> {rev.comment}
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `A clear empty state prevents users from wondering whether reviews failed to load.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists reviews and a form to add one:

  List     →  each row is one Review
  Empty    →  a message when the list has no items
  Form     →  Author, Rating, Body
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Review = {
  id: string;
  author: string;
  rating: string;
  body: string;
};

export function ReviewInbox() {
  const [reviews, setReviews] = useState<Review[]>([]);
  return (
    <div>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((a) => (
            <li key={a.id}>{a.author}</li>
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
      build: `1. Set up state: Use useState<Review[]>([]).
2. Check for empty: Use reviews.length === 0 to render the empty message.
3. Render entries: Map through reviews, passing key={rev.id}.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Wire star rating and review comment fields to state for real-time tracking.

WHAT YOU'LL NEED
- State hooks for reviewer and comment inputs.
- Value and onChange props wired on inputs.

Your task: Connect review logging inputs to React state.`,
    hint: `1. Initialize states: Call useState("") for reviewer and comment.
2. Wire inputs: Connect value and onChange to each state variable.`,
    example_code: `const [reviewer, setReviewer] = useState("");
const [comment, setComment] = useState("");

<input value={reviewer} onChange={(e) => setReviewer(e.target.value)} />
<textarea value={comment} onChange={(e) => setComment(e.target.value)} />`,
    think_prompt: `\`\`\`text
FORM — Reviews
  [ Author ]  [ Rating ]  [ Body ]   → Log review
\`\`\`

A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state. Where does each field's typed text need to live so what you type is exactly what submit will save?`,
    mc_options: ["value from state, onChange writes back to state","read the input only on submit via document.getElementById","store the DOM node in a global"],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs ensure clean data capture when recording new reviews.`,
    answer_keywords: ["useState","value=","onChange","author","rating","body"],
    seed_code: `import { useState } from "react";

export type Review = {
  id: string;
  author: string;
  rating: string;
  body: string;
};

export function ReviewInbox() {
  const [reviews, setReviews] = useState<Review[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type Review = {
  id: string;
  author: string;
  rating: string;
  body: string;
};

export function ReviewInbox() {
  const [reviews, setReviews] = useState<Review[]>([]);
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

export type Review = {
  id: string;
  author: string;
  rating: string;
  body: string;
};

export function ReviewInbox() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState("");
  const [body, setBody] = useState("");
  return (
    <form>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
        <input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
    </form>
  );
}
`,
    analog_example: `const [reviewer, setReviewer] = useState("");
const [comment, setComment] = useState("");

<input value={reviewer} onChange={(e) => setReviewer(e.target.value)} />
<textarea value={comment} onChange={(e) => setComment(e.target.value)} />`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Controlled inputs ensure clean data capture when recording new reviews.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists reviews and a form to add one:

  List     →  each row is one Review
  Empty    →  a message when the list has no items
  Form     →  Author, Rating, Body
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Review = {
  id: string;
  author: string;
  rating: string;
  body: string;
};

export function ReviewInbox() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState("");
  const [body, setBody] = useState("");
  return (
    <form>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
        <input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
    </form>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Initialize states: Call useState("") for reviewer and comment.
2. Wire inputs: Connect value and onChange to each state variable.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Block default page reload, drop the review into the inbox, and clear the form fields.

WHAT YOU'LL NEED
- Form interceptor using e.preventDefault().
- New review object creation.
- Spread update to state.
- Form reset calls.

Your task: Append the new review to state without a page refresh and reset the form.`,
    hint: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, reviewer, and comment into an object.
3. Append item: Use setReviews((prev) => [...prev, entry]).
4. Clear form: Reset input states to "".`,
    example_code: `function logReview(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), reviewer, comment };
  setReviews((prev) => [...prev, entry]);
  setReviewer("");
  setComment("");
}`,
    think_prompt: `\`\`\`text
FORM — Reviews
  [ Author ]  [ Rating ]  [ Body ]   → Log review
  (stays on the page — the new row appears in the list above)
\`\`\`

Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one. Given that, what has to happen, in order, when Log review is used?`,
    mc_options: ["preventDefault, append one item, clear fields","window.location.reload after every submit","only console.log the form values"],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `Reviews appear instantly in the inbox without page reloads.


================================================================================`,
    answer_keywords: ["preventDefault","setReviews","prev","author","rating","body"],
    seed_code: `import { useState } from "react";

export type Review = {
  id: string;
  author: string;
  rating: string;
  body: string;
};

export function ReviewInbox() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState("");
  const [body, setBody] = useState("");
  return (
    <div>
      {reviews.length === 0 ? <p>No reviews yet.</p> : <ul>{reviews.map((a) => <li key={a.id}>{a.author} · {a.rating} · {a.body}</li>)}</ul>}
      <form>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
        <input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type Review = {
  id: string;
  author: string;
  rating: string;
  body: string;
};

export function ReviewInbox() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState("");
  const [body, setBody] = useState("");
  function onSubmit(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {reviews.length === 0 ? <p>No reviews yet.</p> : <ul>{reviews.map((a) => <li key={a.id}>{a.author} · {a.rating} · {a.body}</li>)}</ul>}
      <form onSubmit={onSubmit}>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
        <input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <button type="submit">Log review</button>
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

export type Review = {
  id: string;
  author: string;
  rating: string;
  body: string;
};

export function ReviewInbox() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState("");
  const [body, setBody] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Review = { id: String(Date.now()), author, rating, body };
    setReviews((prev) => [...prev, next]);
    setAuthor("");
    setRating("");
    setBody("");
  }
  return (
    <div>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((a) => (
            <li key={a.id}>{a.author} · {a.rating} · {a.body}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
        <input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <button type="submit">Log review</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function logReview(e: React.FormEvent) {
  e.preventDefault();
  const entry = { id: String(Date.now()), reviewer, comment };
  setReviews((prev) => [...prev, entry]);
  setReviewer("");
  setComment("");
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: `Reviews appear instantly in the inbox without page reloads.


================================================================================`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: `Build a screen that lists reviews and a form to add one:

  List     →  each row is one Review
  Empty    →  a message when the list has no items
  Form     →  Author, Rating, Body
  Submit   →  the new row appears on the list
`,
      discover: `import { useState } from "react";

export type Review = {
  id: string;
  author: string;
  rating: string;
  body: string;
};

export function ReviewInbox() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState("");
  const [body, setBody] = useState("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Review = { id: String(Date.now()), author, rating, body };
    setReviews((prev) => [...prev, next]);
    setAuthor("");
    setRating("");
    setBody("");
  }
  return (
    <div>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((a) => (
            <li key={a.id}>{a.author} · {a.rating} · {a.body}</li>
          ))}
        </ul>
      )}
      <form onSubmit={onSubmit}>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
        <input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <button type="submit">Log review</button>
      </form>
    </div>
  );
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Halt refresh: Call e.preventDefault() first.
2. Build item: Package id, reviewer, and comment into an object.
3. Append item: Use setReviews((prev) => [...prev, entry]).
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
  title: "Review inbox list + log-review form",
  shortName: "Review FE",
});
