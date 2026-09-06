import createINPACTEngine from "../inpact_engine_shared";

const MENTAL_MODEL = `Build a screen that lists open coverage requests and a form to add one:

  List     →  each row is one CoverageSlot
  Empty    →  a message when the list has no items
  Form     →  Shift, Role
  Submit   →  the new row appears on the list
`;

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-coverage-list-form",
      title: "Open coverage list + request form",
      body: MENTAL_MODEL,
      usecase: "Last-minute coverage is another list+form — request goes up, teammates claim later.",
      designMock: {"kind":"list-and-form","screenTitle":"Coverage","caption":"This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.","listCaption":"LIST — sample rows","emptyCaption":"EMPTY — when there are no rows","emptyMessage":"All shifts covered","rows":[{"title":"Fri 8am","subtitle":"Barista","meta":""},{"title":"Second row","subtitle":"Another","meta":""}],"fields":[{"label":"Shift","sample":"Fri 8am"},{"label":"Role","sample":"Barista"}],"submitLabel":"Request cover"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Create a new component file (.tsx), define a TypeScript blueprint for one shift request, and set up an empty component shell.",
      "Store your shift requests in app memory and render either the list of open shifts or a friendly fallback message.",
      "Wire your text input fields directly to memory so every keystroke is tracked live.",
      "On form submit, stop the default page reload, append the new request to your list, and clear the input boxes.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Create a new component file (.tsx), define a TypeScript blueprint for one shift request, and set up an empty component shell.

Create a new file named OpenCoverage.tsx, define a blueprint named CoverageSlot, and export an empty shell component named OpenCoverage.

WHAT YOUR BLUEPRINT NEEDS
- id (text identifier)
- shift (text describing the shift time or block)
- role (text describing the role needed)

Your task: write \`type CoverageSlot\` with id, shift, and role, then define and export OpenCoverage as a function component returning <div /> — every step from here on edits this same file.`,
    hint: `1. Create the file: Create a new file named OpenCoverage.tsx in your components folder.
2. Mirror the declaration: Look at "export type Guest = {". Swap Guest with your blueprint name: CoverageSlot.
3. Fill the properties: Add id, shift, and role on separate lines following that exact pattern (name, colon, type string, semicolon).
4. Close the blueprint: End with "};" on a new line.
5. Mirror the component shell: Look at "export function GuestList() { return <div />; }". Replace GuestList with your component name: OpenCoverage.`,
    example_code: `// GuestList.tsx
export type Guest = {
  id: string;
  name: string;
  note: string;
};

export function GuestList() {
  return <div />;
}`,
    think_prompt: `Web apps combine visual layout (React) and strict data rules (TypeScript) into a single .tsx file. Before displaying anything, create OpenCoverage.tsx — inside it, write a TypeScript type (an itemized checklist of fields every shift must have) and a basic React function (the empty display box) so your code editor can catch typos early. Looking at the pattern, what does your blueprint need to name, and what does the component need to be called?`,
    mc_options: [
      "Create OpenCoverage.tsx, define type CoverageSlot (id, shift, role), then export function OpenCoverage() returning <div />",
      "Skip the type and write JSX directly against untyped objects",
      "Wait until every backend endpoint exists before modeling the row or the component",
    ],
    mc_correct_option: "Create OpenCoverage.tsx, define type CoverageSlot (id, shift, role), then export function OpenCoverage() returning <div />",
    mc_anchor: "Create OpenCoverage.tsx, define type Cov",
    why_this_matters: `The .tsx extension tells your editor that you are mixing TypeScript rules with visual React code. Declaring the blueprint first turns on autocomplete and helps catch typos before you ever run the code.`,
    answer_keywords: ["export", "type", "CoverageSlot", "shift", "role", "export", "function", "OpenCoverage", "return"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the blueprint and the component both exist now; every later step builds inside this.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Start with a blueprint for one record, then the empty component shell that will use it.",
    pre_check_hint: `Web apps combine visual layout (React) and strict data rules (TypeScript) into a single .tsx file. Before displaying anything, create OpenCoverage.tsx. Inside it, write a TypeScript type (an itemized checklist of fields every shift must have) and a basic React function (the empty display box) so your code editor can catch typos early.`,
    expected: `export type CoverageSlot = {
  id: string;
  shift: string;
  role: string;
};

export function OpenCoverage() {
  return <div />;
}
`,
    analog_example: `// GuestList.tsx
export type Guest = {
  id: string;
  name: string;
  note: string;
};

export function GuestList() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `The .tsx extension tells your editor that you are mixing TypeScript rules with visual React code. Declaring the blueprint first turns on autocomplete and helps catch typos before you ever run the code.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: MENTAL_MODEL,
      discover: `export type CoverageSlot = {
  id: string;
  shift: string;
  role: string;
};

export function OpenCoverage() {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `type CoverageSlot = { id: string; shift: string; role: string; }

export function OpenCoverage() {
  return <div />;
}`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Store your shift requests in app memory and render either the list of open shifts or a friendly fallback message.

Store your coverage requests in a React state array and display each request, or show a polite note when no requests exist.

WHAT YOUR LOGIC NEEDS
- An array state hook initialized to an empty array typed with CoverageSlot.
- A conditional check looking at your list's length.
- A fallback message when length is 0.
- A .map() loop returning rows when items exist.

Your task: hold requests in state typed as CoverageSlot[], render "All shifts covered" when requests.length === 0, and the mapped rows (key={item.id}) otherwise.`,
    hint: `1. Initialize memory: Set up your state hook using useState<CoverageSlot[]>([]), importing useState from "react".
2. Check for empty: Write a ternary condition checking if your state array's .length === 0.
3. Add the fallback: In the first branch, provide your empty state message (e.g., <p>All shifts covered</p>).
4. Loop through entries: In the second branch, use .map() to return a row for each item, making sure to assign key={item.id} to the root element.`,
    example_code: `const [items, setItems] = useState<Guest[]>([]);

return (
  <div>
    {items.length === 0 ? (
      <p>No open coverage requests</p>
    ) : (
      items.map((item) => (
        <div key={item.id}>
          {item.name} - {item.note}
        </div>
      ))
    )}
  </div>
);`,
    think_prompt: `Standard variables disappear when a page updates, so we use a React memory hook (useState) to track the list. We then check if the collection is empty: if it has 0 items, display a clear "All shifts covered" note; if it has items, loop through and display each shift row. Where does this array need to live, and what two branches does the render need to cover?`,
    mc_options: [
      "useState for the array; branch on length === 0 before mapping rows with a stable key",
      "let requests = [] and mutate it directly on every update",
      "always render the mapped rows, even when the array is empty",
    ],
    mc_correct_option: "useState for the array; branch on length === 0 before mapping rows with a stable key",
    mc_anchor: "useState for the array; branch on length",
    why_this_matters: `Checking if the list is empty ensures that first-time users see a helpful status message rather than a confusing, blank screen.`,
    answer_keywords: ["useState", "requests", "setRequests", "length", "map", "key"],
    seed_code: `export type CoverageSlot = {
  id: string;
  shift: string;
  role: string;
};

export function OpenCoverage() {
  return <div />;
}
`,
    starter_code: `import { useState } from "react";

export type CoverageSlot = {
  id: string;
  shift: string;
  role: string;
};

export function OpenCoverage() {
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
    pre_check_hint: `Standard variables disappear when a page updates, so we use a React memory hook (useState) to track the list. We then check if the collection is empty: if it has 0 items, display a clear "All shifts covered" note; if it has items, loop through and display each shift row.`,
    expected: `import { useState } from "react";

export type CoverageSlot = {
  id: string;
  shift: string;
  role: string;
};

export function OpenCoverage() {
  const [requests, setRequests] = useState<CoverageSlot[]>([]);
  return (
    <div>
      {requests.length === 0 ? (
        <p>All shifts covered</p>
      ) : (
        <ul>
          {requests.map((r) => (
            <li key={r.id}>{r.shift} — {r.role}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`,
    analog_example: `const [items, setItems] = useState<Guest[]>([]);

return (
  <div>
    {items.length === 0 ? (
      <p>No open coverage requests</p>
    ) : (
      items.map((item) => (
        <div key={item.id}>
          {item.name} - {item.note}
        </div>
      ))
    )}
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Checking if the list is empty ensures that first-time users see a helpful status message rather than a confusing, blank screen.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: MENTAL_MODEL,
      discover: `import { useState } from "react";

export type CoverageSlot = {
  id: string;
  shift: string;
  role: string;
};

export function OpenCoverage() {
  const [requests, setRequests] = useState<CoverageSlot[]>([]);
  return (
    <div>
      {requests.length === 0 ? (
        <p>All shifts covered</p>
      ) : (
        <ul>
          {requests.map((r) => (
            <li key={r.id}>{r.shift} — {r.role}</li>
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
      build: `1. Initialize memory: useState<CoverageSlot[]>([]).
2. Check for empty: .length === 0.
3. Add the fallback: <p>All shifts covered</p>.
4. Loop through entries: .map() with key={item.id}.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Wire your text input fields directly to memory so every keystroke is tracked live.

Create text boxes for the shift timing and the required role, wiring both directly to individual React state variables.

WHAT YOUR LOGIC NEEDS
- Two separate string state hooks (one for shift, one for role).
- Inputs with value bound to their matching state variable.
- Inputs with onChange updating their state variable using e.target.value.

Your task: add state values for shift and role, then wire each input's value and onChange to it.`,
    hint: `1. Initialize field states: Declare const [shift, setShift] = useState("") and const [role, setRole] = useState("").
2. Connect the display: Add two <input /> elements inside your form, setting value={shift} on the first and value={role} on the second.
3. Capture keystrokes: On each input, provide onChange={(e) => setYourField(e.target.value)} to forward user typing directly into state.`,
    example_code: `const [name, setName] = useState("");
const [note, setNote] = useState("");

return (
  <form>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Name"
    />
    <input
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Note"
    />
  </form>
);`,
    think_prompt: `Instead of letting the browser manage inputs on its own, React uses "controlled inputs." Each text box reads its displayed characters directly from memory (value) and immediately saves new keystrokes into memory (onChange), ensuring you always have total control over the typed data. Where does each field's typed text need to live?`,
    mc_options: [
      "value from state, onChange writes back to state",
      "read the input only on submit via document.getElementById",
      "store the DOM node in a global",
    ],
    mc_correct_option: "value from state, onChange writes back to state",
    mc_anchor: "value from state, onChange writes back t",
    why_this_matters: `Controlled inputs keep the screen and memory in sync at all times, making it easy to validate text, enable buttons, or package the data on submit.`,
    answer_keywords: ["useState", "value=", "onChange", "shift", "role"],
    seed_code: `import { useState } from "react";

export type CoverageSlot = {
  id: string;
  shift: string;
  role: string;
};

export function OpenCoverage() {
  const [requests, setRequests] = useState<CoverageSlot[]>([]);
  return <form />;
}
`,
    starter_code: `import { useState } from "react";

export type CoverageSlot = {
  id: string;
  shift: string;
  role: string;
};

export function OpenCoverage() {
  const [requests, setRequests] = useState<CoverageSlot[]>([]);
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
    pre_check_hint: `Instead of letting the browser manage inputs on its own, React uses "controlled inputs." Each text box reads its displayed characters directly from memory (value) and immediately saves new keystrokes into memory (onChange).`,
    expected: `import { useState } from "react";

export type CoverageSlot = {
  id: string;
  shift: string;
  role: string;
};

export function OpenCoverage() {
  const [requests, setRequests] = useState<CoverageSlot[]>([]);
  const [shift, setShift] = useState("");
  const [role, setRole] = useState("");
  return (
    <form>
      <input value={shift} onChange={(e) => setShift(e.target.value)} placeholder="Shift" />
      <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
    </form>
  );
}
`,
    analog_example: `const [name, setName] = useState("");
const [note, setNote] = useState("");

return (
  <form>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Name"
    />
    <input
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Note"
    />
  </form>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Controlled inputs keep the screen and memory in sync at all times, making it easy to validate text, enable buttons, or package the data on submit.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: MENTAL_MODEL,
      discover: `const [shift, setShift] = useState("");
const [role, setRole] = useState("");

<input value={shift} onChange={(e) => setShift(e.target.value)} />
<input value={role} onChange={(e) => setRole(e.target.value)} />`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Declare states: useState("") for shift and role.
2. Connect the display: value={shift} / value={role}.
3. Capture keystrokes: onChange={(e) => setYourField(e.target.value)}.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `On form submit, stop the default page reload, append the new request to your list, and clear the input boxes.

Intercept the form submission, build a new CoverageSlot item, add it to your requests list in state, and clear the input fields.

WHAT YOUR LOGIC NEEDS
- A submit handler attached to the form's onSubmit prop.
- A call to e.preventDefault() to halt full page reloads.
- A new object combining a unique id with the values from your input states.
- A state update appending the object using spread syntax (...prev).
- Cleanup calls resetting input states to "".

Your task: on submit, call preventDefault, build a new CoverageSlot from the field state, add it to requests without mutating the old array, then clear the fields.`,
    hint: `1. Stop browser reload: Create your submit handler function and place e.preventDefault() on the first line.
2. Package the item: Build an object containing id: String(Date.now()), shift, and role.
3. Append to state: Update your list state using the spread pattern: setRequests((prev) => [...prev, nextItem]).
4. Clear inputs: Call setShift("") and setRole("") right after updating the list so the text boxes empty out.
5. Wire to form: Add onSubmit={yourHandlerName} to your <form> element.`,
    example_code: `function handleAdd(e: React.FormEvent) {
  e.preventDefault();
  const nextItem = {
    id: String(Date.now()),
    name,
    note,
  };
  setItems((prev) => [...prev, nextItem]);
  setName("");
  setNote("");
}

return (
  <form onSubmit={handleAdd}>
    {/* input fields */}
    <button type="submit">Submit</button>
  </form>
);`,
    think_prompt: `Normal web forms try to refresh the entire browser tab on submit. We hit the brakes with e.preventDefault(), assemble the newly typed values into a single shift object, stack it onto the existing list without erasing older entries, and reset the input boxes to blank for the next request. What has to happen, in order, when Request cover is used?`,
    mc_options: [
      "preventDefault, append one item, clear fields",
      "window.location.reload after every submit",
      "only console.log the form values",
    ],
    mc_correct_option: "preventDefault, append one item, clear fields",
    mc_anchor: "preventDefault, append one item, clear f",
    why_this_matters: `Stopping page refresh keeps the application state intact, allowing the new shift request to appear instantly on screen without a jarring flicker.`,
    answer_keywords: ["preventDefault", "setRequests", "prev", "shift", "role"],
    seed_code: `import { useState } from "react";

export type CoverageSlot = {
  id: string;
  shift: string;
  role: string;
};

export function OpenCoverage() {
  const [requests, setRequests] = useState<CoverageSlot[]>([]);
  const [shift, setShift] = useState("");
  const [role, setRole] = useState("");
  return (
    <div>
      {requests.length === 0 ? <p>All shifts covered</p> : <ul>{requests.map((r) => <li key={r.id}>{r.shift} — {r.role}</li>)}</ul>}
      <form>
        <input value={shift} onChange={(e) => setShift(e.target.value)} placeholder="Shift" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
      </form>
    </div>
  );
}
`,
    starter_code: `import { useState } from "react";

export type CoverageSlot = {
  id: string;
  shift: string;
  role: string;
};

export function OpenCoverage() {
  const [requests, setRequests] = useState<CoverageSlot[]>([]);
  const [shift, setShift] = useState("");
  const [role, setRole] = useState("");
  function handleAdd(e: React.FormEvent) {
    // submit
  }
  return (
    <div>
      {requests.length === 0 ? <p>All shifts covered</p> : <ul>{requests.map((r) => <li key={r.id}>{r.shift} — {r.role}</li>)}</ul>}
      <form onSubmit={handleAdd}>
        <input value={shift} onChange={(e) => setShift(e.target.value)} placeholder="Shift" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
        <button type="submit">Request cover</button>
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

export type CoverageSlot = {
  id: string;
  shift: string;
  role: string;
};

export function OpenCoverage() {
  const [requests, setRequests] = useState<CoverageSlot[]>([]);
  const [shift, setShift] = useState("");
  const [role, setRole] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const nextItem: CoverageSlot = { id: String(Date.now()), shift, role };
    setRequests((prev) => [...prev, nextItem]);
    setShift("");
    setRole("");
  }

  return (
    <div>
      {requests.length === 0 ? (
        <p>All shifts covered</p>
      ) : (
        <ul>
          {requests.map((r) => (
            <li key={r.id}>{r.shift} — {r.role}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleAdd}>
        <input value={shift} onChange={(e) => setShift(e.target.value)} placeholder="Shift" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" />
        <button type="submit">Request cover</button>
      </form>
    </div>
  );
}
`,
    analog_example: `function handleAdd(e: React.FormEvent) {
  e.preventDefault();
  const nextItem = {
    id: String(Date.now()),
    name,
    note,
  };
  setItems((prev) => [...prev, nextItem]);
  setName("");
  setNote("");
}

return (
  <form onSubmit={handleAdd}>
    {/* input fields */}
    <button type="submit">Submit</button>
  </form>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Stopping page refresh keeps the application state intact, allowing the new shift request to appear instantly on screen without a jarring flicker.`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: MENTAL_MODEL,
      discover: `function handleAdd(e: React.FormEvent) {
  e.preventDefault();
  const nextItem: CoverageSlot = { id: String(Date.now()), shift, role };
  setRequests((prev) => [...prev, nextItem]);
  setShift("");
  setRole("");
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: `1. Stop browser reload: e.preventDefault() first.
2. Package the item: { id: String(Date.now()), shift, role }.
3. Append to state: setRequests((prev) => [...prev, nextItem]).
4. Clear inputs: setShift(""); setRole("").
5. Wire to form: onSubmit={handleAdd}.`,
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
  title: "Open coverage list + request form",
  shortName: "Coverage FE",
});
