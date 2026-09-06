/**
 * Generate ~20 IDT Assist modules for the 4 SMB products.
 *
 * Pedagogy (from ID review):
 *  - Objectives = transferable skills (not product nouns / IDT jargon)
 *  - why_this_matters = developer career/product rationale
 *  - THINK references first Lesson screen DESIGN MOCK
 *  - UI lessons include interactive list+form designMock
 *  - Everyday analogies in EXAMPLE panes
 *
 * Run: node scripts/write-smb-assist-engines.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { assertValidModule } from "../src/id-module/generateModule.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSIST_DIR = path.resolve(__dirname, "../src/engines/assist");

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** @typedef {{ name: string, label: string, sample: string, ts: string }} Field */

// ——— Fix 1: collision-safe id helper ———
// `String(Date.now())` collides when two records are created in the same millisecond. A
// module-scoped counter is unique per process for every BE module that used this template.
const NEXT_ID_HELPER = `let nextIdCounter = 1;\nfunction nextId() { return String(nextIdCounter++); }`;
const NEXT_ID_HELPER_ANALOG = `let guests = [];\nlet nextIdCounter = 1;\nfunction nextId() { return String(nextIdCounter++); }`;

// ——— Fix 4/6: scoped mock snippets reused in Think modals (fenced, rendered as code) and
// task panels (plain, indented — the task panel does not parse fences). ———
function sampleRowLines(fields) {
  return fields.map((f) => `  ${f.label}: ${JSON.stringify(f.sample)}`).join("\n");
}
function formFieldsLine(fields, submitLabel) {
  return `  [ ${fields.map((f) => f.label).join(" ]  [ ")} ]   → ${submitLabel}`;
}
function apiSampleBlock(designMock) {
  return `${designMock.getSample}\n\n${designMock.postSample}`;
}

/** Builds node.paal (task panel text): short skill label + scoped mock snippet (plain, no
 * fencing) + an optional implicit-fields callout + an explicit "Your task:" callout, which
 * `EditorTaskBlock` splits on to render the highlighted YOUR TASK box. */
function taskPanelText({ paal, mockLabel, mockBody, implicitNote, task }) {
  const mock = mockBody ? `${mockLabel}\n${mockBody}\n\n` : "";
  const implicit = implicitNote ? `${implicitNote}\n\n` : "";
  return `${paal}\n\n${mock}${implicit}Your task: ${task}`;
}

/** Builds step.think (Think modal prompt): mechanism first, then the choice — with the scoped
 * mock inlined as a fenced code block (the Think modal renders think_prompt with
 * contentMode="blocks", so fences render as real code, not literal backticks). */
function thinkPrompt({ mockLabel, mockBody, mechanism, question }) {
  const mock = mockBody ? `\`\`\`text\n${mockLabel}\n${mockBody}\n\`\`\`\n\n` : "";
  return `${mock}${mechanism} ${question}`;
}

function listFormModule(cfg) {
  const {
    tag,
    title,
    shortName,
    Type,
    component,
    listVar,
    setList,
    emptyMsg,
    submitLabel,
    screenTitle,
    fields,
    usecase,
    conceptExtra = "",
  } = cfg;
  const typeFields = fields.map((f) => `  ${f.name}: ${f.ts};`).join("\n");
  const typeBody = `export type ${Type} = {\n  id: string;\n${typeFields}\n};`;
  const fieldDecls = fields
    .map((f) => `  const [${f.name}, set${cap(f.name)}] = useState("");`)
    .join("\n");
  const inputs = fields
    .map(
      (f) =>
        `        <input value={${f.name}} onChange={(e) => set${cap(f.name)}(e.target.value)} placeholder="${f.label}" />`,
    )
    .join("\n");
  const clear = fields.map((f) => `    set${cap(f.name)}("");`).join("\n");
  const nextObj = `{ id: String(Date.now()), ${fields.map((f) => f.name).join(", ")} }`;
  const rowShow = fields.map((f) => `{a.${f.name}}`).join(" · ");
  const keywordsType = ["export", "type", Type, ...fields.map((f) => f.name)];
  const analogType = `export type Guest = {\n  id: string;\n  name: string;\n  note: string;\n};`;

  return {
    tag,
    title,
    shortName,
    // Absolute-beginner orientation — which language/file type this task is written in, and
    // (for step 1 specifically, the first time this file is touched) exactly where to create it.
    // Injected into every step's task panel by apply-review-content.mjs's buildTaskPanel().
    language: "You're writing this in TypeScript + React — a `.tsx` file (TypeScript types alongside JSX markup).",
    filePath: `src/components/${component}.tsx`,
    analog: "Name list (list + add form)",
    concept: `Build a screen that lists ${listVar} and a form to add one:

  List     →  each row is one ${Type}
  Empty    →  a message when the list has no items
  Form     →  ${fields.map((f) => f.label).join(", ")}
  Submit   →  the new row appears on the list
${conceptExtra}`,
    usecase,
    designMock: {
      kind: "list-and-form",
      screenTitle,
      caption:
        "This is the screen you are building. Match the pieces — list, empty message, form, submit — not the brand colors. Try typing and submitting.",
      listCaption: "LIST — sample rows",
      emptyCaption: "EMPTY — when there are no rows",
      emptyMessage: emptyMsg,
      rows: [
        {
          title: fields[0]?.sample || "Row A",
          subtitle: fields[1]?.sample || "Detail",
          meta: fields[2]?.sample || "",
        },
        {
          title: fields[0]?.sample === fields[0]?.sample ? "Second row" : "Row B",
          subtitle: "Another",
          meta: fields[2]?.sample || "",
        },
      ],
      fields: fields.map((f) => ({ label: f.label, sample: f.sample })),
      submitLabel,
    },
    steps: [
      {
        // Redesign (per ID review): the old template opened with two pure-scaffolding steps —
        // an empty exported shell, then a type in isolation. Neither is a move in the actual
        // algorithm. This step merges them: the real content is modeling the record's shape
        // (including the implicit id field, matching real data), and the component shell is
        // just the container that decision needs to live in — not a lesson of its own.
        paal: `Model one list item as a type, then set up the component around it`,
        think: thinkPrompt({
          mockLabel: `MOCK ROW — ${screenTitle}`,
          mockBody: sampleRowLines(fields),
          mechanism: `Every value with a shape needs one type to describe that shape before any component can safely hold or render it — and that type has to sit alongside the function that will actually use it.`,
          question: `Looking at the mock row above, what does the shared type need to name — including a field the mock never shows on screen at all — and what does the component that will render it need to be called?`,
        }),
        why: `${usecase} If list rows and form fields do not share one shape, some rows end up missing a field, or the form saves a field the list can never display — a type names that shared shape once, so the compiler catches the mismatch before a user does. Naming and exporting the component next to it is what lets every later step, and a real pull request, attach real behavior to something that already exists.`,
        hint: `type ${Type} = { id: string; ${fields.map((f) => `${f.name}: ${f.ts};`).join(" ")} }\n\nexport function ${component}() {\n  return <div />;\n}`,
        analog: `export type Guest = {\n  id: string;\n  name: string;\n  note: string;\n};\n\nexport function GuestList() {\n  return <div />;\n}`,
        seed: ``,
        starter: ``,
        expected: `${typeBody}\n\nexport function ${component}() {\n  return <div />;\n}\n`,
        keywords: [...keywordsType, "export", "function", component, "return"],
        mc: [
          `Define type ${Type} (id + ${fields.map((f) => f.name).join(", ")}), then export function ${component}() returning <div />`,
          "Skip the type and write JSX directly against untyped objects",
          "Wait until every backend endpoint exists before modeling the row or the component",
        ],
        correct: `Define type ${Type} (id + ${fields.map((f) => f.name).join(", ")}), then export function ${component}() returning <div />`,
        wrong: "Start with a type for one record, then the component shell that will use it — layout and APIs come after the data shape exists.",
        ok: "Correct — the data shape and the component both exist now; every later step builds inside this.",
        preCheckHint:
          "A TypeScript type is a contract naming every field a value must have; a component is a function that returns JSX. Before either holds or renders real data, the type just needs its fields right and the component just needs to exist.",
        deepDiveHook: `One shared type is a single source of truth for what a record looks like — when the list, the form, and the API all reference it, a renamed or removed field breaks the build immediately instead of failing silently in production. Pairing that with the component's own shell in the same step is what turns this from "a type file" into a real, mergeable start on the actual screen.`,
        taskPanel: taskPanelText({
          paal: `Model one list item as a type, then set up the component around it`,
          mockLabel: `MOCK ROW — ${screenTitle}`,
          mockBody: sampleRowLines(fields),
          implicitNote: `Every row also needs a unique \`id\` — not shown in the mock, but required to track, update, and key each item.`,
          task: `write \`type ${Type}\` with \`id\` plus ${fields.map((f) => f.name).join(", ")}, then define and export ${component} as a function component returning <div /> — every step from here on edits this same file.`,
        }),
      },
      {
        // Redesign: the old template spent three separate steps on useState, map+key, and the
        // empty branch. All three are one real decision — where the array lives, and how the
        // render splits into its two genuine cases (nothing yet vs. some rows) — so they merge
        // into one step instead of three trivial ones.
        paal: `Hold ${listVar} in state and render it — rows when present, a message when empty`,
        think: thinkPrompt({
          mockLabel: `LIST — ${screenTitle}`,
          mockBody: `  ${fields[0]?.sample || "Row A"}\n  ${fields[1]?.sample || "Row B"}\n\nEMPTY — "${emptyMsg}"`,
          mechanism: `React only redraws a component when the value it reads changes through React's own state — a plain variable can change without React ever finding out — and a zero-length array is a normal, common state that a bare map() renders as nothing at all, with no explanation for the user.`,
          question: `Given both the sample rows and the empty case above, where does this growing array need to live, and what two branches does the render need to cover?`,
        }),
        why: `${usecase} A plain array in a variable will not make React redraw, and a list that renders as literally nothing when empty looks broken — useState gives the screen something to watch, and branching on length before mapping is what keeps a brand-new list from looking like a bug.`,
        hint: `const [${listVar}, ${setList}] = useState<${Type}[]>([]);\nreturn ${listVar}.length === 0 ? <p>${emptyMsg}</p> : <ul>{${listVar}.map((a) => <li key={a.id}>{a.${fields[0].name}}</li>)}</ul>;`,
        analog: `const [guests, setGuests] = useState<Guest[]>([]);\nreturn guests.length === 0 ? (\n  <p>No names yet.</p>\n) : (\n  <ul>\n    {guests.map((g) => (\n      <li key={g.id}>{g.name}</li>\n    ))}\n  </ul>\n);`,
        seed: `import { useState } from "react";\n\n${typeBody}\n\nexport function ${component}() {\n  return <div />;\n}\n`,
        starter: `import { useState } from "react";\n\n${typeBody}\n\nexport function ${component}() {\n  // list state here\n  return (\n    <div>\n      {/* empty or list */}\n    </div>\n  );\n}\n`,
        expected: `import { useState } from "react";\n\n${typeBody}\n\nexport function ${component}() {\n  const [${listVar}, ${setList}] = useState<${Type}[]>([]);\n  return (\n    <div>\n      {${listVar}.length === 0 ? (\n        <p>${emptyMsg}</p>\n      ) : (\n        <ul>\n          {${listVar}.map((a) => (\n            <li key={a.id}>{a.${fields[0].name}}</li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}\n`,
        keywords: ["useState", listVar, setList, "length", "map", "key"],
        mc: [
          "useState for the array; branch on length === 0 before mapping rows with a stable key",
          `let ${listVar} = [] and mutate it directly on every update`,
          "always render the mapped rows, even when the array is empty",
        ],
        correct: "useState for the array; branch on length === 0 before mapping rows with a stable key",
        wrong: "List data must live in useState, and the render has to branch on length before mapping.",
        ok: "Correct — the list is real state, and both the empty and populated cases are covered.",
        preCheckHint:
          "To re-render on change, the array has to live in a hook that both holds the value and gives you a setter. Once it does, checking its length before deciding what to render is just an ordinary conditional — the empty case and the list case are two branches of one render.",
        deepDiveHook: `A plain variable and a piece of React state can hold the identical value yet behave completely differently — mutating a variable is invisible to React, while calling a state setter schedules a re-render. And an empty array is not a missing feature to handle later; it is one of exactly two branches every list render has from the very first render.`,
        taskPanel: taskPanelText({
          paal: `Hold ${listVar} in state and render it — rows when present, a message when empty`,
          mockLabel: `LIST — ${screenTitle}`,
          mockBody: `  ${fields[0]?.sample || "Row A"}\n  ${fields[1]?.sample || "Row B"}\n\nEMPTY — "${emptyMsg}"`,
          task: `hold ${listVar} in state typed as ${Type}[], starting empty, then render the empty message when ${listVar}.length === 0 and the mapped rows (key={item.id}) otherwise.`,
        }),
      },
      {
        paal: "Wire controlled inputs so form fields live in React state",
        think: thinkPrompt({
          mockLabel: `FORM — ${screenTitle}`,
          mockBody: formFieldsLine(fields, submitLabel),
          mechanism: `A form field's text can live in the DOM itself (uncontrolled) or in React state (controlled) — a controlled input reads its value from state and writes every keystroke back into that same state.`,
          question: `Where does each field's typed text need to live so what you type is exactly what submit will save?`,
        }),
        why: `Controlled inputs use value from state and onChange to write back, keeping the form and the submit payload in sync. ${usecase}`,
        hint: `useState("") per field; value={...} onChange sets that state.`,
        analog: `const [name, setName] = useState("");\n<input value={name} onChange={(e) => setName(e.target.value)} />`,
        seed: `import { useState } from "react";\n\n${typeBody}\n\nexport function ${component}() {\n  const [${listVar}, ${setList}] = useState<${Type}[]>([]);\n  return <form />;\n}\n`,
        starter: `import { useState } from "react";\n\n${typeBody}\n\nexport function ${component}() {\n  const [${listVar}, ${setList}] = useState<${Type}[]>([]);\n  // field state\n  return (\n    <form>\n      {/* inputs */}\n    </form>\n  );\n}\n`,
        expected: `import { useState } from "react";\n\n${typeBody}\n\nexport function ${component}() {\n  const [${listVar}, ${setList}] = useState<${Type}[]>([]);\n${fieldDecls}\n  return (\n    <form>\n${inputs}\n    </form>\n  );\n}\n`,
        keywords: ["useState", "value=", "onChange", ...fields.map((f) => f.name)],
        mc: [
          "value from state, onChange writes back to state",
          "read the input only on submit via document.getElementById",
          "store the DOM node in a global",
        ],
        correct: "value from state, onChange writes back to state",
        wrong: "Controlled inputs: value and onChange both talk to React state.",
        preCheckHint:
          "In a functional component, a piece of typed text is just another value that can live in state — the input's value prop reads it back out, and onChange is the only place that ever changes it.",
        deepDiveHook: `Controlled vs. uncontrolled is a real, ongoing choice in React forms, not just boilerplate — a controlled input makes React the single source of truth for what is on screen, so validation, clearing, and reading the value on submit are all just state reads, not DOM queries.`,
        taskPanel: taskPanelText({
          paal: "Wire controlled inputs so form fields live in React state",
          mockLabel: `FORM — ${screenTitle}`,
          mockBody: formFieldsLine(fields, submitLabel),
          task: `add one state value per field (${fields.map((f) => f.name).join(", ")}), then wire each input's value and onChange to it.`,
        }),
      },
      {
        paal: "On submit, preventDefault, append one item to the list, and clear the form",
        think: thinkPrompt({
          mockLabel: `FORM — ${screenTitle}`,
          mockBody: `${formFieldsLine(fields, submitLabel)}\n  (stays on the page — the new row appears in the list above)`,
          mechanism: `Submitting an HTML form reloads the page by default; canceling that default lets your own handler run instead, and adding to a list in state means building a new array rather than mutating the old one.`,
          question: `Given that, what has to happen, in order, when ${submitLabel} is used?`,
        }),
        why: `preventDefault stops navigation; copying the old list plus one new item, then clearing fields, matches the design mock behavior. ${usecase}`,
        hint: `e.preventDefault(); ${setList}((prev) => [...prev, ${nextObj}]); then clear fields.`,
        analog: `setGuests((prev) => [...prev, { id: String(Date.now()), name, note }]);`,
        seed: `import { useState } from "react";\n\n${typeBody}\n\nexport function ${component}() {\n  const [${listVar}, ${setList}] = useState<${Type}[]>([]);\n${fieldDecls}\n  return (\n    <div>\n      {${listVar}.length === 0 ? <p>${emptyMsg}</p> : <ul>{${listVar}.map((a) => <li key={a.id}>${rowShow}</li>)}</ul>}\n      <form>\n${inputs}\n      </form>\n    </div>\n  );\n}\n`,
        starter: `import { useState } from "react";\n\n${typeBody}\n\nexport function ${component}() {\n  const [${listVar}, ${setList}] = useState<${Type}[]>([]);\n${fieldDecls}\n  function onSubmit(e: React.FormEvent) {\n    // submit\n  }\n  return (\n    <div>\n      {${listVar}.length === 0 ? <p>${emptyMsg}</p> : <ul>{${listVar}.map((a) => <li key={a.id}>${rowShow}</li>)}</ul>}\n      <form onSubmit={onSubmit}>\n${inputs}\n        <button type="submit">${submitLabel}</button>\n      </form>\n    </div>\n  );\n}\n`,
        expected: `import { useState } from "react";\n\n${typeBody}\n\nexport function ${component}() {\n  const [${listVar}, ${setList}] = useState<${Type}[]>([]);\n${fieldDecls}\n  function onSubmit(e: React.FormEvent) {\n    e.preventDefault();\n    const next: ${Type} = ${nextObj};\n    ${setList}((prev) => [...prev, next]);\n${clear}\n  }\n  return (\n    <div>\n      {${listVar}.length === 0 ? (\n        <p>${emptyMsg}</p>\n      ) : (\n        <ul>\n          {${listVar}.map((a) => (\n            <li key={a.id}>${rowShow}</li>\n          ))}\n        </ul>\n      )}\n      <form onSubmit={onSubmit}>\n${inputs}\n        <button type="submit">${submitLabel}</button>\n      </form>\n    </div>\n  );\n}\n`,
        keywords: ["preventDefault", setList, "prev", ...fields.map((f) => f.name)],
        mc: [
          "preventDefault, append one item, clear fields",
          "window.location.reload after every submit",
          "only console.log the form values",
        ],
        correct: "preventDefault, append one item, clear fields",
        wrong: "Stay on the page, grow the list, reset the form.",
        ok: "Correct — submit updates list state without a reload.",
        preCheckHint:
          "A submit handler runs in a fixed order: stop the default page reload, build the new record from the current field values, add it to state without mutating the old array, then clear the fields for the next entry.",
        deepDiveHook: `Every controlled form in React follows the same submit shape — cancel the default, derive the new record, update state immutably, reset the inputs — regardless of what the record actually contains. Learning that shape once means every future "add to a list" form is the same four moves with different field names.`,
        taskPanel: taskPanelText({
          paal: "On submit, preventDefault, append one item to the list, and clear the form",
          mockLabel: `FORM — ${screenTitle}`,
          mockBody: formFieldsLine(fields, submitLabel),
          task: `on submit: call preventDefault, build a new ${Type} from the field state, add it to ${listVar} without mutating the old array, then clear the fields.`,
        }),
      },
    ],
  };
}

function conflictApiModule(cfg) {
  const {
    tag,
    title,
    shortName,
    Type,
    store,
    validateFn,
    overlapFn,
    resourcePath,
    fields,
    conflictHint,
    usecase,
    // Which two fields actually make two rows conflict — defaults to first+last, but that's a
    // guess: several conflictHints name first+*middle* (e.g. "same leadId + same body"), which
    // first+last silently gets wrong (caught live 2026-09-06 building the real backend — it was
    // comparing leadId+channel there, not leadId+body as the hint itself says). Pass explicit
    // names whenever the conflict fields aren't literally the first and last in `fields`.
    conflictFields = null,
  } = cfg;
  const [conflictFieldA, conflictFieldB] = conflictFields || [fields[0].name, fields[fields.length - 1].name];
  const validateChecks = fields
    .map((f) => {
      if (f.ts === "number") {
        return `  if (typeof input?.${f.name} !== "number" || input.${f.name} <= 0) return "${f.name} must be > 0";`;
      }
      return `  if (typeof input?.${f.name} !== "string" || !input.${f.name}.trim()) return "${f.name} is required";`;
    })
    .join("\n");
  const rowAssign = fields.map((f) => `${f.name}: req.body.${f.name}`).join(", ");

  return {
    tag,
    title,
    shortName,
    language: "You're writing this in TypeScript — a `.ts` file for a small backend API module (no JSX here).",
    filePath: `server/routes/${resourcePath.replace(/^\/api\//, "")}.ts`,
    // Raw spec for scripts/generate-smb-backend-routes.mjs — the *real*, deployed implementation
    // of this resource (see that script's header for why this exists as its own real Express
    // router now instead of only ever being a lesson spec).
    apiConfig: { kind: "conflict", store, validateFn, overlapFn, resourcePath, fields, conflictHint, conflictFields: [conflictFieldA, conflictFieldB] },
    concept: `Implement ${resourcePath} with persistence and a conflict rule:

  Store    →  in-memory array of ${Type}
  Validate →  required fields before insert
  Conflict →  ${conflictHint}
  Routes   →  GET list, POST create (400 on bad/conflict)`,
    usecase,
    designMock: {
      kind: "api-sample",
      screenTitle: resourcePath,
      caption: "Sample requests/responses — the server owns the conflict rule.",
      getSample: `GET ${resourcePath}\n→ [ { "id": "1", ${fields.map((f) => `"${f.name}": ${JSON.stringify(f.sample)}`).join(", ")} } ]`,
      postSample: `POST ${resourcePath}\n{ ${fields.map((f) => `"${f.name}": ${JSON.stringify(f.sample)}`).join(", ")} }\n→ 201 created  OR  409 conflict`,
    },
    steps: [
      {
        paal: "Keep an in-memory store and a helper that creates unique ids",
        think: thinkPrompt({
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: `GET ${resourcePath}\n→ [ { "id": "1", ${fields.map((f) => `"${f.name}": ${JSON.stringify(f.sample)}`).join(", ")} } ]`,
          mechanism: `A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created.`,
          question: `Where do the rows above live between one request and the next in a simple lesson server, and how does each new row get an id nothing else already has?`,
        }),
        why: `${usecase} APIs need a single place to read and write; an array plus a real id generator is enough for the lesson, and the same shape carries over once ${store} becomes a database table.`,
        hint: `let ${store} = []; ${NEXT_ID_HELPER}`,
        analog: NEXT_ID_HELPER_ANALOG,
        seed: `// store + ids\n`,
        starter: `// store + ids\n`,
        expected: `let ${store} = [];\n${NEXT_ID_HELPER}\nexport function getStore() { return ${store}; }\n`,
        keywords: [store, "nextId", "nextIdCounter"],
        mc: [
          "module-level array + a counter-based nextId helper",
          "store only in the browser localStorage",
          "ask the client to send the full database each time",
        ],
        correct: "module-level array + a counter-based nextId helper",
        wrong: "Server owns the store.",
        preCheckHint:
          "Two requests that arrive close together must never be handed the same id — a counter that only ever increases guarantees each new record gets a value nothing before it used, which a timestamp alone cannot promise.",
        deepDiveHook: `An id generator only has one job: never repeat. A timestamp looks unique but isn't — two requests in the same millisecond produce the same value and silently overwrite each other's row. A counter that only increases is a small, boring fix for a bug that is otherwise invisible until real traffic hits it.`,
        taskPanel: taskPanelText({
          paal: "Keep an in-memory store and a helper that creates unique ids",
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: `GET ${resourcePath}\n→ [ { "id": "1", ${fields.map((f) => `"${f.name}": ${JSON.stringify(f.sample)}`).join(", ")} } ]`,
          implicitNote: `Every stored row needs a unique \`id\` generated by the server — it's never sent by the client, but every GET/POST sample above includes it.`,
          task: `declare \`let ${store} = []\` and a \`nextId()\` helper backed by a counter (not Date.now()).`,
        }),
      },
      {
        paal: "Validate required fields before creating a record",
        think: thinkPrompt({
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: `POST ${resourcePath}\n{ ${fields.map((f) => `"${f.name}": ${JSON.stringify(f.sample)}`).join(", ")} }\n→ 201 created  OR  400 bad request`,
          mechanism: `Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage.`,
          question: `Looking at the POST body above, which checks have to pass before you push a row?`,
        }),
        why: `Bad payloads must fail early with a clear error — validation is how ${resourcePath} protects the store. ${usecase}`,
        hint: `${validateFn}(input) returns a string error or null.`,
        analog: `if (!input?.name?.trim()) return "name is required";`,
        seed: `let ${store} = [];\n${NEXT_ID_HELPER}\n`,
        starter: `let ${store} = [];\n${NEXT_ID_HELPER}\nexport function ${validateFn}(input) {}\n`,
        expected: `let ${store} = [];\n${NEXT_ID_HELPER}\nexport function getStore() { return ${store}; }\nexport function ${validateFn}(input) {\n${validateChecks}\n  return null;\n}\n`,
        keywords: [validateFn, ...fields.map((f) => f.name)],
        mc: [
          "return an error string for missing/invalid fields, else null",
          "always return null and trust the client",
          "throw and crash the process on bad input",
        ],
        correct: "return an error string for missing/invalid fields, else null",
        wrong: "Validate, then create.",
        preCheckHint:
          "A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.",
        deepDiveHook: `Validation that returns an error string (instead of throwing, or silently coercing) is what lets a route reply with a specific 400 message instead of crashing the process or quietly storing garbage. The check runs once, in one function, so every route into this resource gets the same guarantee.`,
        taskPanel: taskPanelText({
          paal: "Validate required fields before creating a record",
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: `POST ${resourcePath}\n{ ${fields.map((f) => `"${f.name}": ${JSON.stringify(f.sample)}`).join(", ")} }`,
          task: `write ${validateFn}(input) that returns an error string when a required field is missing/invalid, else null.`,
        }),
      },
      {
        paal: "Detect overlapping records so two bookings cannot claim the same slot",
        think: thinkPrompt({
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: `POST ${resourcePath}\n→ 201 created  OR  409 conflict\n\nRule: ${conflictHint}`,
          mechanism: `Two requests can describe the same resource at the same moment — before inserting one, you compare it against everything already stored to decide whether it collides.`,
          question: `Given the rule above, how should the server decide "conflict" before insert?`,
        }),
        why: `Clients can race — the server must refuse overlaps so the record stays trustworthy. ${usecase}`,
        hint: `${overlapFn}(candidate) returns true when an existing row conflicts.`,
        analog: `function seatTaken(seat, holds) {\n  return holds.some((h) => h.seat === seat);\n}`,
        seed: `let ${store} = [];\nexport function ${validateFn}(input) { return null; }\n`,
        starter: `let ${store} = [];\nexport function ${validateFn}(input) { return null; }\nexport function ${overlapFn}(candidate) {}\n`,
        expected: `let ${store} = [];\nexport function ${validateFn}(input) { return null; }\nexport function ${overlapFn}(candidate) {\n  return ${store}.some((row) => row.${conflictFieldA} === candidate.${conflictFieldA} && row.${conflictFieldB} === candidate.${conflictFieldB});\n}\n`,
        keywords: [overlapFn, "some", fields[0].name],
        mc: [
          "compare candidate against existing rows; true means conflict",
          "always allow POST and fix conflicts in the UI later",
          "delete the older row silently",
        ],
        correct: "compare candidate against existing rows; true means conflict",
        wrong: "Server detects conflict before insert.",
        preCheckHint:
          "Checking one candidate record against a list of existing ones for a matching combination of fields is exactly what Array.prototype.some() is for — it stops at the first match and returns true or false.",
        deepDiveHook: `Conflict detection is a search, not a special case: does any existing row match this candidate on the fields the business rule cares about? Once framed that way, "no double-booking a provider" and "no duplicate template name" are the same one-liner over different fields.`,
        taskPanel: taskPanelText({
          paal: "Detect overlapping records so two bookings cannot claim the same slot",
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: `Conflict rule: ${conflictHint}`,
          task: `write ${overlapFn}(candidate) that returns true when an existing row already matches the conflict rule above.`,
        }),
      },
      {
        paal: "Implement GET to list records and POST to create with 400/409 errors",
        think: thinkPrompt({
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: apiSampleBlock({ getSample: `GET ${resourcePath}\n→ [ ...rows ]`, postSample: `POST ${resourcePath}\n→ 201 created  OR  400/409 error` }),
          mechanism: `A route handler is where validation, conflict-checking, and storage come together — it should call the helpers you already wrote, in order, not re-implement any of their logic inline.`,
          question: `How do GET and POST above use ${store}, ${validateFn}, and ${overlapFn} together?`,
        }),
        why: `GET returns the store; POST validates (400), checks conflict (409), then inserts (201) — keep rules in helpers, not duplicated in the route. ${usecase}`,
        hint: `create: validate → overlap → push; list: res.json(${store})`,
        analog: `if (seatTaken(body.seat, holds)) return res.status(409).json({ error: "taken" });`,
        seed: `let ${store} = [];\n${NEXT_ID_HELPER}\nexport function ${validateFn}(input) { return null; }\nexport function ${overlapFn}(c) { return false; }\n`,
        starter: `let ${store} = [];\n${NEXT_ID_HELPER}\nexport function ${validateFn}(input) { return null; }\nexport function ${overlapFn}(c) { return false; }\nexport function createHandlers() {\n  return { list() {}, create() {} };\n}\n`,
        expected: `let ${store} = [];\n${NEXT_ID_HELPER}\nexport function ${validateFn}(input) { return null; }\nexport function ${overlapFn}(candidate) {\n  return ${store}.some((row) => row.${conflictFieldA} === candidate.${conflictFieldA} && row.${conflictFieldB} === candidate.${conflictFieldB});\n}\nexport function createHandlers() {\n  return {\n    list(_req, res) {\n      res.json(${store});\n    },\n    create(req, res) {\n      const err = ${validateFn}(req.body);\n      if (err) return res.status(400).json({ error: err });\n      if (${overlapFn}(req.body)) return res.status(409).json({ error: "conflict" });\n      const row = { id: nextId(), ${rowAssign} };\n      ${store}.push(row);\n      res.status(201).json(row);\n    },\n  };\n}\n`,
        keywords: ["409", "400", "201", validateFn, overlapFn],
        mc: [
          "GET lists store; POST validates, rejects conflict, else 201",
          "POST always 201 even on overlap",
          "GET returns HTML instead of JSON",
        ],
        correct: "GET lists store; POST validates, rejects conflict, else 201",
        wrong: "Wire helpers into GET/POST with the right status codes.",
        ok: "Correct — list and create with validation and conflict.",
        preCheckHint:
          "A route handler's job is to call helpers in the right order and translate their answers into HTTP status codes — the actual rules already live in the functions written in earlier steps.",
        deepDiveHook: `Keeping validate/overlap/store as separate, named functions — instead of inlining their logic into the route — is what makes a route handler stay readable as a short sequence of checks: 400 if invalid, 409 if conflicting, 201 otherwise. The same three helpers can be unit-tested without ever touching HTTP.`,
        taskPanel: taskPanelText({
          paal: "Implement GET to list records and POST to create with 400/409 errors",
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: `GET → list  ·  POST → 201 / 400 / 409`,
          task: `wire list() to return ${store}, and create() to call ${validateFn} (400 on error), then ${overlapFn} (409 on conflict), then push and return 201.`,
        }),
      },
    ],
  };
}

function derivedApiModule(cfg) {
  const {
    tag,
    title,
    shortName,
    Type,
    store,
    validateFn,
    deriveFn,
    resourcePath,
    fields,
    deriveHint,
    usecase,
    paidField = null,
    statusDone = "paid",
    statusLate = "overdue",
    statusOpen = "open",
    remainingPair = null,
    // A genuinely two-state flag (e.g. held/applied) has no "late" branch at all — forcing the
    // generic paidField+dateField shape onto it picks whatever field happens to be last as a fake
    // "date" to compare against (caught live 2026-09-06 building the real backend: idt-booking-
    // deposits-api's fields have no date at all, so the fallback silently grabbed appointmentId).
    twoState = false,
    // "if claimedBy set -> filled; else open" is a presence check, not a strict === true boolean
    // (claimedBy holds who claimed it, not a flag) — distinct from paidField/twoState. The field
    // is never part of the create payload (nobody claims a request at creation time), so the real
    // backend also gets a POST <resourcePath>/:id/claim endpoint that sets it — see
    // generate-smb-backend-routes.mjs.
    presenceField = null,
    claimActionName = "claim",
    // The plain "no paidField at all" branch used to be `new Date(dateField) < now ? stale :
    // fresh` — for a capture/creation timestamp that's *always* true (nothing gets captured in
    // the future), so every row was stale from the instant it existed (caught live 2026-09-06:
    // idt-lead-stale-api's own deriveHint says "older than N days", never implemented as such).
    // staleAfterDays makes that a real elapsed-time threshold instead.
    staleAfterDays = null,
  } = cfg;
  const validateChecks = fields
    .map((f) => {
      if (f.ts === "number") {
        if (/^used/i.test(f.name)) {
          return `  if (typeof input?.${f.name} !== "number" || input.${f.name} < 0) return "${f.name} must be >= 0";`;
        }
        return `  if (typeof input?.${f.name} !== "number" || input.${f.name} <= 0) return "${f.name} must be > 0";`;
      }
      return `  if (typeof input?.${f.name} !== "string" || !input.${f.name}.trim()) return "${f.name} is required";`;
    })
    .join("\n");
  const rowAssign = fields.map((f) => `${f.name}: req.body.${f.name}`).join(", ");
  const extraCreate = paidField
    ? `, ${paidField}: false`
    : remainingPair
      ? `, ${remainingPair.used}: 0`
      : "";
  const dateField =
    fields.find((f) => /date|At|at|Due|due|When|when|Until|until/i.test(f.name))?.name ||
    fields[fields.length - 1].name;
  const deriveExpected = remainingPair
    ? `let ${store} = [];\nexport function ${validateFn}(input) { return null; }\nexport function ${deriveFn}(row) {\n  if ((row.${remainingPair.used} || 0) >= row.${remainingPair.total}) return "${remainingPair.emptyStatus || "empty"}";\n  return "${remainingPair.activeStatus || "active"}";\n}\n`
    : presenceField
      ? `let ${store} = [];\nexport function ${validateFn}(input) { return null; }\nexport function ${deriveFn}(row) {\n  return row.${presenceField} ? "${statusDone}" : "${statusOpen}";\n}\n`
      : twoState
        ? `let ${store} = [];\nexport function ${validateFn}(input) { return null; }\nexport function ${deriveFn}(row) {\n  return row.${paidField} === true ? "${statusDone}" : "${statusOpen}";\n}\n`
        : paidField
          ? `let ${store} = [];\nexport function ${validateFn}(input) { return null; }\nexport function ${deriveFn}(row, now = new Date()) {\n  if (row.${paidField} === true) return "${statusDone}";\n  if (new Date(row.${dateField}) < now) return "${statusLate}";\n  return "${statusOpen}";\n}\n`
          : staleAfterDays
            ? `let ${store} = [];\nexport function ${validateFn}(input) { return null; }\nexport function ${deriveFn}(row, now = new Date()) {\n  const staleMs = ${staleAfterDays} * 24 * 60 * 60 * 1000;\n  if (now.getTime() - new Date(row.${dateField}).getTime() > staleMs) return "stale";\n  return "fresh";\n}\n`
            : `let ${store} = [];\nexport function ${validateFn}(input) { return null; }\nexport function ${deriveFn}(row, now = new Date()) {\n  if (new Date(row.${dateField}) < now) return "stale";\n  return "fresh";\n}\n`;

  return {
    tag,
    title,
    shortName,
    language: "You're writing this in TypeScript — a `.ts` file for a small backend API module (no JSX here).",
    filePath: `server/routes/${resourcePath.replace(/^\/api\//, "")}.ts`,
    // Raw spec for scripts/generate-smb-backend-routes.mjs — see that script's header.
    apiConfig: {
      kind: "derived",
      store,
      validateFn,
      deriveFn,
      resourcePath,
      fields,
      deriveHint,
      paidField,
      statusDone,
      statusLate,
      statusOpen,
      remainingPair,
      twoState,
      presenceField,
      claimActionName,
      staleAfterDays,
    },
    concept: `Implement ${resourcePath} with a derived status:

  Store    →  in-memory ${Type} rows
  Validate →  required fields
  Derive   →  ${deriveHint}
  Routes   →  GET/POST attach computed status (do not trust client status)`,
    usecase,
    designMock: {
      kind: "api-sample",
      screenTitle: resourcePath,
      caption: "Status is computed on the way out — clients cannot fake it.",
      getSample: `GET ${resourcePath}\n→ [ { "id": "1", "status": "…" } ]`,
      postSample: `POST ${resourcePath}\n{ …fields… }\n→ 201 { …row, "status": "…" }`,
    },
    steps: [
      {
        paal: "Keep an in-memory store and a helper that creates unique ids",
        think: thinkPrompt({
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: `GET ${resourcePath}\n→ [ { "id": "1", "status": "…" } ]`,
          mechanism: `A server that must remember data across requests needs one place to keep it that persists between calls, plus a way to generate a new identifier every time a record is created.`,
          question: `Where do the rows above live between one request and the next, and how does each new row get an id nothing else already has?`,
        }),
        why: `${usecase} One store is the single source of truth for list and create — every ${Type} row created through ${resourcePath} has to still be there on the next GET, or the desk would be lying about what's actually owed, booked, or open.`,
        hint: `let ${store} = []; ${NEXT_ID_HELPER}`,
        analog: NEXT_ID_HELPER_ANALOG.replace("guests", "tasks"),
        seed: `// store\n`,
        starter: `// store\n`,
        expected: `let ${store} = [];\n${NEXT_ID_HELPER}\nexport function getStore() { return ${store}; }\n`,
        keywords: [store, "nextId", "nextIdCounter"],
        mc: [
          "module-level array + a counter-based nextId",
          "no store — recompute from logs only",
          "client sends the whole catalog every GET",
        ],
        correct: "module-level array + a counter-based nextId",
        wrong: "Server owns the array.",
        preCheckHint:
          "Two requests that arrive close together must never be handed the same id — a counter that only ever increases guarantees each new record gets a value nothing before it used, which a timestamp alone cannot promise.",
        deepDiveHook: `An id generator only has one job: never repeat. A timestamp looks unique but isn't — two requests in the same millisecond produce the same value and silently overwrite each other's row. A counter that only increases is a small, boring fix for a bug that is otherwise invisible until real traffic hits it.`,
        taskPanel: taskPanelText({
          paal: "Keep an in-memory store and a helper that creates unique ids",
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: `GET ${resourcePath}\n→ [ { "id": "1", "status": "…" } ]`,
          implicitNote: `Every stored row needs a unique \`id\` generated by the server — never sent by the client, but present on every row above.`,
          task: `declare \`let ${store} = []\` and a \`nextId()\` helper backed by a counter (not Date.now()).`,
        }),
      },
      {
        paal: "Validate required fields before creating a record",
        think: thinkPrompt({
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: `POST ${resourcePath}\n{ …fields… }\n→ 201 created  OR  400 bad request`,
          mechanism: `Whatever a client sends in a request body can never be assumed well-formed — checking for missing or malformed fields before anything else runs is what keeps bad data from ever reaching storage.`,
          question: `What must be true about the fields above before you insert a row?`,
        }),
        why: `Validation keeps junk out of the store before status is ever derived from it. ${usecase}`,
        hint: `${validateFn} returns error string or null.`,
        analog: `if (!input?.title?.trim()) return "title is required";`,
        seed: `let ${store} = [];\n${NEXT_ID_HELPER}\n`,
        starter: `let ${store} = [];\n${NEXT_ID_HELPER}\nexport function ${validateFn}(input) {}\n`,
        expected: `let ${store} = [];\n${NEXT_ID_HELPER}\nexport function getStore() { return ${store}; }\nexport function ${validateFn}(input) {\n${validateChecks}\n  return null;\n}\n`,
        keywords: [validateFn, ...fields.map((f) => f.name)],
        mc: [
          "error string for bad fields, else null",
          "accept any JSON",
          "coerce everything to strings silently",
        ],
        correct: "error string for bad fields, else null",
        wrong: "Validate first.",
        preCheckHint:
          "A validator is just a function that inspects the fields it was given and returns either a short error message or nothing at all — the caller decides what to do with that answer.",
        deepDiveHook: `Validation that returns an error string (instead of throwing, or silently coercing) is what lets a route reply with a specific 400 message instead of crashing or quietly storing garbage. Run it once, in one function, so every route into this resource gets the same guarantee.`,
        taskPanel: taskPanelText({
          paal: "Validate required fields before creating a record",
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: `POST ${resourcePath}\n{ …fields… }`,
          task: `write ${validateFn}(input) that returns an error string when a required field is missing/invalid, else null.`,
        }),
      },
      {
        paal: "Derive a status from stored data instead of trusting the request body",
        think: thinkPrompt({
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: `GET ${resourcePath}\n→ [ { "id": "1", "status": "…" } ]\n\nRule: ${deriveHint}`,
          mechanism: `A status label describing a record can always be recalculated from that record's own stored facts — comparing dates, or checking a boolean flag — rather than being sent by the client and simply trusted.`,
          question: `Given the rule above, should the browser send status, or should the server compute it — and from what?`,
        }),
        why: `The browser can send anything; computing status from facts you already trust is what keeps it from being faked. ${usecase}`,
        hint: `${deriveFn}(row, now) returns the status string.`,
        analog: `function taskStatus(item, today) {\n  if (item.done) return "done";\n  if (new Date(item.due) < today) return "late";\n  return "open";\n}`,
        seed: `let ${store} = [];\nexport function ${validateFn}(input) { return null; }\n`,
        starter: `let ${store} = [];\nexport function ${validateFn}(input) { return null; }\nexport function ${deriveFn}(row, now = new Date()) {}\n`,
        expected: deriveExpected,
        keywords: [deriveFn],
        mc: [
          "server derives status from stored facts; ignore client status",
          "save req.body.status as-is",
          "randomize status on every GET",
        ],
        correct: "server derives status from stored facts; ignore client status",
        wrong: "Status is computed on the server.",
        preCheckHint:
          "A derive function takes one stored row (plus, optionally, the current time) and returns a label computed purely from that row's own fields — it never reads anything the client sent in the current request.",
        deepDiveHook: `A derived field only stays honest if it is recomputed from source facts every single time it's read, not stored and trusted. The moment a status is written once and reused, it can drift from the facts that produced it — a client-sent status has that problem from the very first request.`,
        taskPanel: taskPanelText({
          paal: "Derive a status from stored data instead of trusting the request body",
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: `Rule: ${deriveHint}`,
          task: `write ${deriveFn}(row, now) that returns the status string computed from the rule above — never from req.body.`,
        }),
      },
      {
        paal: "Implement GET to list records and POST to create, attaching the derived status",
        think: thinkPrompt({
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: apiSampleBlock({ getSample: `GET ${resourcePath}\n→ [ …rows with status ]`, postSample: `POST ${resourcePath}\n→ 201 { …row, "status": "…" }` }),
          mechanism: `Attaching a computed field to data on its way out of a route means running the derive function once per record, every time that record is returned — never once at write time and then reused.`,
          question: `How do GET and POST above reuse ${validateFn} and ${deriveFn} to guarantee status is never stale?`,
        }),
        why: `Always attach derive on the way out — POST validates, inserts, then attaches status, exactly like GET does. ${usecase}`,
        hint: `list: ${store}.map(r => ({...r, status: ${deriveFn}(r)}))`,
        analog: `res.json(tasks.map((t) => ({ ...t, status: taskStatus(t) })));`,
        seed: `let ${store} = [];\n${NEXT_ID_HELPER}\nexport function ${validateFn}(input) { return null; }\nexport function ${deriveFn}(row, now = new Date()) { return "open"; }\n`,
        starter: `let ${store} = [];\n${NEXT_ID_HELPER}\nexport function ${validateFn}(input) { return null; }\nexport function ${deriveFn}(row, now = new Date()) { return "open"; }\nexport function createHandlers() {\n  return { list() {}, create() {} };\n}\n`,
        expected: `let ${store} = [];\n${NEXT_ID_HELPER}\nexport function ${validateFn}(input) { return null; }\nexport function ${deriveFn}(row, now = new Date()) { return "open"; }\nexport function createHandlers() {\n  return {\n    list(_req, res) {\n      res.json(${store}.map((r) => ({ ...r, status: ${deriveFn}(r) })));\n    },\n    create(req, res) {\n      const err = ${validateFn}(req.body);\n      if (err) return res.status(400).json({ error: err });\n      const row = { id: nextId(), ${rowAssign}${extraCreate} };\n      ${store}.push(row);\n      res.status(201).json({ ...row, status: ${deriveFn}(row) });\n    },\n  };\n}\n`,
        keywords: [deriveFn, validateFn, "201"],
        mc: [
          "GET/POST attach derived status; POST validates first",
          "POST stores client status verbatim",
          "GET omits status",
        ],
        correct: "GET/POST attach derived status; POST validates first",
        wrong: "Always derive on the way out.",
        ok: "Correct — list and create attach derived status.",
        preCheckHint:
          "A route handler's job is to call helpers in the right order and translate their answers into HTTP responses — validate first, then map the derive function over whatever gets returned.",
        deepDiveHook: `The rule "always derive on the way out" means the same map-over-derive call appears in both GET and POST — there is no separate code path where status could accidentally be skipped or hard-coded. Consistency here is what keeps the API honest under every route that touches this resource.`,
        taskPanel: taskPanelText({
          paal: "Implement GET to list records and POST to create, attaching the derived status",
          mockLabel: `SAMPLE — ${resourcePath}`,
          mockBody: `GET → rows + status  ·  POST → 201 + status`,
          task: `wire list() to map ${deriveFn} over ${store}, and create() to validate, push, then return the row with ${deriveFn} attached.`,
        }),
      },
    ],
  };
}

function filterListModule(cfg) {
  // FE: list already exists — teach filter + detail selection (still list+form family).
  // Fix 5: the Lesson-page bullets must say this module filters, not just the generic
  // list+form template — Objectives already lists the filter skill; Lesson copy has to match.
  const base = listFormModule(cfg);
  base.concept = `${base.concept.trimEnd()}\n  Filter   →  only matching rows render — the full list stays in state\n`;
  const { Type, component, listVar, setList, emptyMsg, screenTitle, fields, usecase } = cfg;
  const typeFields = fields.map((f) => `  ${f.name}: ${f.ts};`).join("\n");
  const typeBody = `export type ${Type} = {\n  id: string;\n${typeFields}\n};`;
  // A concrete filter, not a placeholder "...": most boards already carry a status field whose
  // sample is exactly the target state this board narrows to (e.g. "accepted", "overdue") — use
  // it. The one board with no status field (day-board, filtered by provider) falls back to its
  // first field, which is exactly what it filters by.
  const filterField = (fields.find((f) => f.name === "status") || fields[0]).name;
  const filterValue = (fields.find((f) => f.name === "status") || fields[0]).sample;
  // Redesign: since listFormModule now merges state + render + empty into one step (index 1),
  // the filter folds into that same step instead of getting a step of its own — it's the same
  // rendering decision, just narrowed by one extra .filter() call before the map.
  base.steps[1] = {
    ...base.steps[1],
    paal: `Hold ${listVar} in state and render only the matching rows — filtered, with an empty state`,
    think: thinkPrompt({
      mockLabel: `LIST (filtered) — ${screenTitle}`,
      mockBody: `  ${fields[0]?.sample || "Row A"}\n  ${fields[1]?.sample || "Row B"}   (only rows where ${filterField} is ${JSON.stringify(filterValue)})\n\nEMPTY — "${emptyMsg}"`,
      mechanism: `Filtering for display means computing a smaller array from the full one with .filter() before mapping — the state array itself never loses any rows, and a zero-length filtered result is still an empty case worth its own message.`,
      question: `How do you keep the complete ${listVar} list in state, render only the subset above, and still show a clear message when that subset is empty?`,
    }),
    why: `${usecase} Filtering in render lets users scan what matters without deleting other rows from state, and the empty case still needs its own message — an empty filtered view should not look like a broken screen.`,
    hint: `const [${listVar}, ${setList}] = useState<${Type}[]>([]);\nconst visible = ${listVar}.filter((a) => a.${filterField} === ${JSON.stringify(filterValue)});\nreturn visible.length === 0 ? <p>${emptyMsg}</p> : <ul>{visible.map((a) => <li key={a.id}>{a.${fields[0].name}}</li>)}</ul>;`,
    analog: `const visible = guests.filter((g) => g.status === "active");\nreturn visible.length === 0 ? (\n  <p>No matches.</p>\n) : (\n  <ul>\n    {visible.map((g) => (\n      <li key={g.id}>{g.name}</li>\n    ))}\n  </ul>\n);`,
    seed: `import { useState } from "react";\n\n${typeBody}\n\nexport function ${component}() {\n  return <div />;\n}\n`,
    starter: `import { useState } from "react";\n\n${typeBody}\n\nexport function ${component}() {\n  // list state here\n  return (\n    <div>\n      {/* filter, then empty or list */}\n    </div>\n  );\n}\n`,
    expected: `import { useState } from "react";\n\n${typeBody}\n\nexport function ${component}() {\n  const [${listVar}, ${setList}] = useState<${Type}[]>([]);\n  const visible = ${listVar}.filter((a) => a.${filterField} === ${JSON.stringify(filterValue)});\n  return (\n    <div>\n      {visible.length === 0 ? (\n        <p>${emptyMsg}</p>\n      ) : (\n        <ul>\n          {visible.map((a) => (\n            <li key={a.id}>{a.${fields[0].name}}</li>\n          ))}\n        </ul>\n      )}\n    </div>\n  );\n}\n`,
    keywords: ["useState", listVar, "filter", "map", "length"],
    mc: [
      "keep the full list in state; filter before map; branch on the filtered length for the empty message",
      "delete non-matching rows from state permanently",
      "hide the whole list whenever any filter is active",
    ],
    correct: "keep the full list in state; filter before map; branch on the filtered length for the empty message",
    wrong: "Filter for display only — state keeps every row, and the empty check runs on the filtered result, not the original.",
    ok: "Correct — the full list stays in state, and only the matching rows (or an honest empty message) render.",
    preCheckHint:
      ".filter() always returns a brand-new array and never touches the one it was called on — so the full list stays in state, and the array you check for \"empty\" and then map is the filtered one, not the original.",
    deepDiveHook: `.filter() followed by .map() is a pipeline, not a special React trick: narrow the array down to what should render, then turn what's left into rows. Checking the narrowed array's length — not the original's — is what keeps the empty state honest about the current view instead of the whole dataset.`,
    taskPanel: taskPanelText({
      paal: `Hold ${listVar} in state and render only the matching rows — filtered, with an empty state`,
      mockLabel: `LIST (filtered) — ${screenTitle}`,
      mockBody: `  ${fields[0]?.sample || "Row A"}\n  ${fields[1]?.sample || "Row B"}\n\nEMPTY — "${emptyMsg}"`,
      task: `hold ${listVar} in state typed as ${Type}[], render ${listVar}.filter((a) => a.${filterField} === ${JSON.stringify(filterValue)}) mapped to rows (key={item.id}), and show the empty message when that filtered result has zero items.`,
    }),
  };
  return base;
}

// ——— 20 module specs (5 Coding × 4 products) ———

const MODULES = [
  // BookingDepositDesk
  listFormModule({
    tag: "idt-booking-appointment-list-form",
    title: "Appointment list + book form",
    shortName: "Book list+form",
    Type: "Appointment",
    component: "BookingDesk",
    listVar: "appointments",
    setList: "setAppointments",
    emptyMsg: "No appointments yet.",
    submitLabel: "Book",
    screenTitle: "Bookings",
    fields: [
      { name: "provider", label: "Provider", sample: "Maya", ts: "string" },
      { name: "service", label: "Service", sample: "Color & cut", ts: "string" },
      { name: "startsAt", label: "Starts at", sample: "Tue 2:00 PM", ts: "string" },
    ],
    usecase:
      "Most web apps need a screen that lists data as rows you can scan — people, orders, tickets. You also need a form to add a new row, and a clear message when the list is empty.",
  }),
  conflictApiModule({
    tag: "idt-booking-appointments-api",
    title: "Appointments API with slot conflicts",
    shortName: "Book API",
    Type: "Appointment",
    store: "appointments",
    validateFn: "validateAppointment",
    overlapFn: "hasSlotConflict",
    resourcePath: "/api/appointments",
    conflictHint: "same provider + same startsAt is a conflict",
    fields: [
      { name: "provider", label: "Provider", sample: "Maya", ts: "string" },
      { name: "service", label: "Service", sample: "Color & cut", ts: "string" },
      { name: "startsAt", label: "Starts at", sample: "2026-08-20T14:00:00Z", ts: "string" },
    ],
    usecase:
      "Service businesses cannot double-book a provider. The API must refuse overlapping slots so the calendar stays trustworthy.",
  }),
  listFormModule({
    tag: "idt-booking-deposit-list-form",
    title: "Deposit list + take-deposit form",
    shortName: "Deposit FE",
    Type: "Deposit",
    component: "DepositDesk",
    listVar: "deposits",
    setList: "setDeposits",
    emptyMsg: "No deposits yet.",
    submitLabel: "Take deposit",
    screenTitle: "Deposits",
    fields: [
      { name: "client", label: "Client", sample: "Priya", ts: "string" },
      { name: "amount", label: "Amount", sample: "40", ts: "string" },
      { name: "appointmentId", label: "Appointment id", sample: "a-100", ts: "string" },
    ],
    usecase:
      "Taking a deposit is the same list+form skill as booking — different fields, same React pattern you will reuse on every product desk.",
  }),
  derivedApiModule({
    tag: "idt-booking-deposits-api",
    title: "Deposits API with held/applied status",
    shortName: "Deposit API",
    Type: "Deposit",
    store: "deposits",
    validateFn: "validateDeposit",
    deriveFn: "deriveDepositStatus",
    resourcePath: "/api/deposits",
    deriveHint: "if applied is true → applied; else held",
    paidField: "applied",
    statusDone: "applied",
    statusOpen: "held",
    twoState: true,
    fields: [
      { name: "client", label: "Client", sample: "Priya", ts: "string" },
      { name: "amount", label: "Amount", sample: 40, ts: "number" },
      { name: "appointmentId", label: "Appointment id", sample: "a-100", ts: "string" },
    ],
    usecase:
      "Money states must be derived from facts (held vs applied), not from a status string the browser invents.",
  }),
  filterListModule({
    tag: "idt-booking-day-board-filter",
    title: "Day board: filter appointments by provider",
    shortName: "Day board FE",
    Type: "Appointment",
    component: "DayBoard",
    listVar: "appointments",
    setList: "setAppointments",
    emptyMsg: "No appointments for this filter.",
    submitLabel: "Add",
    screenTitle: "Day board",
    fields: [
      { name: "provider", label: "Provider", sample: "Maya", ts: "string" },
      { name: "service", label: "Service", sample: "Cut", ts: "string" },
      { name: "startsAt", label: "Starts at", sample: "10:00", ts: "string" },
    ],
    usecase:
      "Operators scan one provider's day. Filtering a list without destroying the full dataset is a core frontend skill.",
  }),

  // InvoiceFollowUpTracker
  listFormModule({
    tag: "idt-invoice-list-form",
    title: "Invoice list + create form",
    shortName: "Invoice FE",
    Type: "Invoice",
    component: "InvoiceDesk",
    listVar: "invoices",
    setList: "setInvoices",
    emptyMsg: "No invoices yet.",
    submitLabel: "Create",
    screenTitle: "Invoices",
    fields: [
      { name: "client", label: "Client", sample: "River Co", ts: "string" },
      { name: "amount", label: "Amount", sample: "250", ts: "string" },
      { name: "dueDate", label: "Due date", sample: "2026-09-01", ts: "string" },
    ],
    usecase:
      "Cash-flow tools always start as a list of what is owed plus a form to add the next invoice.",
  }),
  derivedApiModule({
    tag: "idt-invoice-overdue-api",
    title: "Invoices API with overdue status",
    shortName: "Invoice API",
    Type: "Invoice",
    store: "invoices",
    validateFn: "validateInvoice",
    deriveFn: "deriveStatus",
    resourcePath: "/api/invoices",
    deriveHint: "paid → paid; else dueDate in the past → overdue; else open",
    paidField: "paid",
    fields: [
      { name: "client", label: "Client", sample: "River Co", ts: "string" },
      { name: "amount", label: "Amount", sample: 250, ts: "number" },
      { name: "dueDate", label: "Due date", sample: "2026-09-01", ts: "string" },
    ],
    usecase:
      "Overdue must be computed from due date and paid — never trusted from the client body.",
  }),
  listFormModule({
    tag: "idt-invoice-reminder-list-form",
    title: "Reminder log list + schedule form",
    shortName: "Reminder FE",
    Type: "Reminder",
    component: "ReminderDesk",
    listVar: "reminders",
    setList: "setReminders",
    emptyMsg: "No reminders yet.",
    submitLabel: "Schedule",
    screenTitle: "Reminders",
    fields: [
      { name: "invoiceId", label: "Invoice id", sample: "inv-9", ts: "string" },
      { name: "channel", label: "Channel", sample: "email", ts: "string" },
      { name: "sendAt", label: "Send at", sample: "Fri 9:00", ts: "string" },
    ],
    usecase:
      "Collections work is a second list+form: who gets nudged, how, and when.",
  }),
  conflictApiModule({
    tag: "idt-invoice-reminder-api",
    title: "Reminders API — one pending nudge per invoice per channel",
    shortName: "Reminder API",
    Type: "Reminder",
    store: "reminders",
    validateFn: "validateReminder",
    overlapFn: "hasPendingReminder",
    resourcePath: "/api/reminders",
    conflictHint: "same invoiceId + channel already pending → conflict",
    // "channel" is the *middle* field here, not the last one — the generic first+last guess
    // silently checked invoiceId+sendAt instead of invoiceId+channel until this was caught
    // building the real backend (2026-09-06). Name the real two fields explicitly.
    conflictFields: ["invoiceId", "channel"],
    fields: [
      { name: "invoiceId", label: "Invoice id", sample: "inv-9", ts: "string" },
      { name: "channel", label: "Channel", sample: "email", ts: "string" },
      { name: "sendAt", label: "Send at", sample: "2026-08-22T09:00:00Z", ts: "string" },
    ],
    usecase:
      "Do not spam: one pending reminder per invoice/channel is a server rule, not a UI hope.",
  }),
  filterListModule({
    tag: "idt-invoice-overdue-board",
    title: "Overdue board: filter invoices by status label",
    shortName: "Overdue board",
    Type: "InvoiceRow",
    component: "OverdueBoard",
    listVar: "invoices",
    setList: "setInvoices",
    emptyMsg: "No overdue invoices.",
    submitLabel: "Add",
    screenTitle: "Overdue board",
    fields: [
      { name: "client", label: "Client", sample: "River Co", ts: "string" },
      { name: "amount", label: "Amount", sample: "250", ts: "string" },
      { name: "status", label: "Status", sample: "overdue", ts: "string" },
    ],
    usecase:
      "Finance desks filter to overdue. Same list skill — filter for display, keep full state.",
  }),

  // LeadFollowUpInbox
  listFormModule({
    tag: "idt-lead-list-form",
    title: "Lead inbox list + capture form",
    shortName: "Lead FE",
    Type: "Lead",
    component: "LeadInbox",
    listVar: "leads",
    setList: "setLeads",
    emptyMsg: "No leads yet.",
    submitLabel: "Capture",
    screenTitle: "Leads",
    fields: [
      { name: "name", label: "Name", sample: "Jordan", ts: "string" },
      { name: "source", label: "Source", sample: "Instagram", ts: "string" },
      { name: "note", label: "Note", sample: "Wants quote", ts: "string" },
    ],
    usecase:
      "Leads die in DMs. A capture list+form is the light CRM screen SMBs need before they can afford a full suite.",
  }),
  derivedApiModule({
    tag: "idt-lead-stale-api",
    title: "Leads API with fresh/stale status",
    shortName: "Lead API",
    Type: "Lead",
    store: "leads",
    validateFn: "validateLead",
    deriveFn: "deriveLeadStatus",
    resourcePath: "/api/leads",
    deriveHint: "if capturedAt older than 7 days → stale; else fresh",
    staleAfterDays: 7,
    fields: [
      { name: "name", label: "Name", sample: "Jordan", ts: "string" },
      { name: "source", label: "Source", sample: "Instagram", ts: "string" },
      { name: "capturedAt", label: "Captured at", sample: "2026-08-01T12:00:00Z", ts: "string" },
    ],
    usecase:
      "Stale leads must be computed from capture time so the inbox stays honest.",
  }),
  listFormModule({
    tag: "idt-lead-reply-list-form",
    title: "Reply notes list + add-note form",
    shortName: "Reply FE",
    Type: "ReplyNote",
    component: "ReplyDesk",
    listVar: "notes",
    setList: "setNotes",
    emptyMsg: "No replies yet.",
    submitLabel: "Add note",
    screenTitle: "Replies",
    fields: [
      { name: "leadId", label: "Lead id", sample: "L-1", ts: "string" },
      { name: "body", label: "Body", sample: "Sent price sheet", ts: "string" },
      { name: "channel", label: "Channel", sample: "sms", ts: "string" },
    ],
    usecase:
      "Follow-up is a second list: what we said, on which channel — still list+form.",
  }),
  conflictApiModule({
    tag: "idt-lead-notes-api",
    title: "Notes API — block duplicate notes per lead",
    shortName: "Notes API",
    Type: "ReplyNote",
    store: "notes",
    validateFn: "validateNote",
    overlapFn: "isDuplicateNote",
    resourcePath: "/api/lead-notes",
    conflictHint: "same leadId + same body already stored → conflict",
    // "body" is the middle field, not the last — see the invoice-reminder-api note above.
    conflictFields: ["leadId", "body"],
    fields: [
      { name: "leadId", label: "Lead id", sample: "L-1", ts: "string" },
      { name: "body", label: "Body", sample: "Sent price sheet", ts: "string" },
      { name: "channel", label: "Channel", sample: "sms", ts: "string" },
    ],
    usecase:
      "APIs should reject obvious duplicate notes so the timeline stays readable.",
  }),
  filterListModule({
    tag: "idt-lead-stale-board",
    title: "Stale board: filter leads that need a nudge",
    shortName: "Stale board",
    Type: "Lead",
    component: "StaleBoard",
    listVar: "leads",
    setList: "setLeads",
    emptyMsg: "No stale leads.",
    submitLabel: "Capture",
    screenTitle: "Stale leads",
    fields: [
      { name: "name", label: "Name", sample: "Jordan", ts: "string" },
      { name: "source", label: "Source", sample: "Web", ts: "string" },
      { name: "status", label: "Status", sample: "stale", ts: "string" },
    ],
    usecase:
      "Owners open a board of cold leads. Filter for display — keep the full inbox in state.",
  }),

  // ShiftCoverageBoard
  listFormModule({
    tag: "idt-shift-list-form",
    title: "Shift board list + publish form",
    shortName: "Shift FE",
    Type: "Shift",
    component: "ShiftBoard",
    listVar: "shifts",
    setList: "setShifts",
    emptyMsg: "No shifts yet.",
    submitLabel: "Publish",
    screenTitle: "Shifts",
    fields: [
      { name: "worker", label: "Worker", sample: "Ana", ts: "string" },
      { name: "role", label: "Role", sample: "Barista", ts: "string" },
      { name: "startsAt", label: "Starts at", sample: "Sat 8:00", ts: "string" },
    ],
    usecase:
      "Small teams still run on group chats. A shift list+form is the staffing desk they can actually use.",
  }),
  conflictApiModule({
    tag: "idt-shift-overlap-api",
    title: "Shifts API with worker overlap conflicts",
    shortName: "Shift API",
    Type: "Shift",
    store: "shifts",
    validateFn: "validateShift",
    overlapFn: "hasWorkerOverlap",
    resourcePath: "/api/shifts",
    conflictHint: "same worker + same startsAt → conflict",
    fields: [
      { name: "worker", label: "Worker", sample: "Ana", ts: "string" },
      { name: "role", label: "Role", sample: "Barista", ts: "string" },
      { name: "startsAt", label: "Starts at", sample: "2026-08-23T08:00:00Z", ts: "string" },
    ],
    usecase:
      "One person cannot work two stations at once. Overlap belongs in the API.",
  }),
  listFormModule({
    tag: "idt-coverage-list-form",
    title: "Open coverage list + request form",
    shortName: "Coverage FE",
    Type: "CoverageRequest",
    component: "CoverageDesk",
    listVar: "requests",
    setList: "setRequests",
    emptyMsg: "No open coverage requests.",
    submitLabel: "Request cover",
    screenTitle: "Coverage",
    fields: [
      { name: "shiftId", label: "Shift id", sample: "s-3", ts: "string" },
      { name: "reason", label: "Reason", sample: "Sick", ts: "string" },
      { name: "neededBy", label: "Needed by", sample: "Fri noon", ts: "string" },
    ],
    usecase:
      "Last-minute coverage is another list+form — request goes up, teammates claim later.",
  }),
  derivedApiModule({
    tag: "idt-coverage-api",
    title: "Coverage API with open/filled status",
    shortName: "Coverage API",
    Type: "CoverageRequest",
    store: "coverage",
    validateFn: "validateCoverage",
    deriveFn: "deriveCoverageStatus",
    resourcePath: "/api/coverage",
    deriveHint: "if claimedBy set → filled; else open",
    presenceField: "claimedBy",
    statusDone: "filled",
    statusOpen: "open",
    fields: [
      { name: "shiftId", label: "Shift id", sample: "s-3", ts: "string" },
      { name: "reason", label: "Reason", sample: "Sick", ts: "string" },
      { name: "neededBy", label: "Needed by", sample: "2026-08-22T12:00:00Z", ts: "string" },
    ],
    usecase:
      "Open vs filled must come from whether someone claimed the request — not from a client-sent label.",
  }),
  filterListModule({
    tag: "idt-open-shift-board",
    title: "Open-shift board: filter unfilled coverage",
    shortName: "Open board",
    Type: "CoverageRequest",
    component: "OpenShiftBoard",
    listVar: "requests",
    setList: "setRequests",
    emptyMsg: "No open coverage.",
    submitLabel: "Request",
    screenTitle: "Open shifts",
    fields: [
      { name: "shiftId", label: "Shift id", sample: "s-3", ts: "string" },
      { name: "reason", label: "Reason", sample: "Sick", ts: "string" },
      { name: "status", label: "Status", sample: "open", ts: "string" },
    ],
    usecase:
      "Managers filter to open coverage only. Same filter-before-map skill as other desks.",
  }),

  // QuoteEstimateDesk
  listFormModule({
    tag: "idt-quote-list-form",
    title: "Quote list + create-estimate form",
    shortName: "Quote FE",
    Type: "Quote",
    component: "QuoteDesk",
    listVar: "quotes",
    setList: "setQuotes",
    emptyMsg: "No quotes yet.",
    submitLabel: "Create quote",
    screenTitle: "Quotes",
    fields: [
      { name: "client", label: "Client", sample: "Patel Home", ts: "string" },
      { name: "total", label: "Total", sample: "1800", ts: "string" },
      { name: "validUntil", label: "Valid until", sample: "2026-09-15", ts: "string" },
    ],
    usecase:
      "Trades lose jobs between estimate and acceptance. A quote list+form is the bridge from lead to cash.",
  }),
  derivedApiModule({
    tag: "idt-quote-expiry-api",
    title: "Quotes API with open/expired/accepted status",
    shortName: "Quote API",
    Type: "Quote",
    store: "quotes",
    validateFn: "validateQuote",
    deriveFn: "deriveQuoteStatus",
    resourcePath: "/api/quotes",
    deriveHint: "accepted → accepted; else validUntil in the past → expired; else open",
    paidField: "accepted",
    statusDone: "accepted",
    statusLate: "expired",
    statusOpen: "open",
    fields: [
      { name: "client", label: "Client", sample: "Patel Home", ts: "string" },
      { name: "total", label: "Total", sample: 1800, ts: "number" },
      { name: "validUntil", label: "Valid until", sample: "2026-09-15", ts: "string" },
    ],
    usecase:
      "Expired vs open must be derived from validUntil and accepted — never trusted from the client body.",
  }),
  listFormModule({
    tag: "idt-quote-line-list-form",
    title: "Quote line-items list + add-line form",
    shortName: "Line FE",
    Type: "QuoteLine",
    component: "QuoteLines",
    listVar: "lines",
    setList: "setLines",
    emptyMsg: "No line items yet.",
    submitLabel: "Add line",
    screenTitle: "Quote lines",
    fields: [
      { name: "quoteId", label: "Quote id", sample: "q-1", ts: "string" },
      { name: "label", label: "Label", sample: "Labor", ts: "string" },
      { name: "amount", label: "Amount", sample: "900", ts: "string" },
    ],
    usecase:
      "Estimates are built from lines. Same list+form skill — different nouns.",
  }),
  conflictApiModule({
    tag: "idt-quote-lines-api",
    title: "Quote lines API — no duplicate label on a quote",
    shortName: "Lines API",
    Type: "QuoteLine",
    store: "lines",
    validateFn: "validateLine",
    overlapFn: "hasDuplicateLine",
    resourcePath: "/api/quote-lines",
    conflictHint: "same quoteId + same label → conflict",
    // "label" is the middle field, not the last ("amount") — see the invoice-reminder-api note.
    conflictFields: ["quoteId", "label"],
    fields: [
      { name: "quoteId", label: "Quote id", sample: "q-1", ts: "string" },
      { name: "label", label: "Label", sample: "Labor", ts: "string" },
      { name: "amount", label: "Amount", sample: 900, ts: "number" },
    ],
    usecase:
      "Two Labor lines on one quote confuse totals. The API rejects duplicate labels.",
  }),
  filterListModule({
    tag: "idt-quote-accepted-board",
    title: "Accepted board: filter quotes by status",
    shortName: "Accepted board",
    Type: "Quote",
    component: "AcceptedBoard",
    listVar: "quotes",
    setList: "setQuotes",
    emptyMsg: "No accepted quotes.",
    submitLabel: "Create",
    screenTitle: "Accepted quotes",
    fields: [
      { name: "client", label: "Client", sample: "Patel Home", ts: "string" },
      { name: "total", label: "Total", sample: "1800", ts: "string" },
      { name: "status", label: "Status", sample: "accepted", ts: "string" },
    ],
    usecase:
      "Owners want to see won work. Filter for display; keep the full quote list in state.",
  }),

  // ReviewReplyInbox
  listFormModule({
    tag: "idt-review-list-form",
    title: "Review inbox list + log-review form",
    shortName: "Review FE",
    Type: "Review",
    component: "ReviewInbox",
    listVar: "reviews",
    setList: "setReviews",
    emptyMsg: "No reviews yet.",
    submitLabel: "Log review",
    screenTitle: "Reviews",
    fields: [
      { name: "author", label: "Author", sample: "Sam", ts: "string" },
      { name: "rating", label: "Rating", sample: "5", ts: "string" },
      { name: "body", label: "Body", sample: "Great cut", ts: "string" },
    ],
    usecase:
      "Unanswered reviews cost trust. A list+form inbox is the light alternative to reputation suites.",
  }),
  derivedApiModule({
    tag: "idt-review-needs-reply-api",
    title: "Reviews API with needs-reply status",
    shortName: "Review API",
    Type: "Review",
    store: "reviews",
    validateFn: "validateReview",
    deriveFn: "deriveReviewStatus",
    resourcePath: "/api/reviews",
    deriveHint: "if replied true → answered; else needs-reply",
    paidField: "replied",
    statusDone: "answered",
    statusOpen: "needs-reply",
    // Genuinely two-state (no "late" branch exists for a review) — statusLate used to be set to
    // the same value as statusOpen as a workaround, which still ran a nonsensical date check
    // against `rating` (a number, not a date) every time. twoState skips that branch entirely.
    twoState: true,
    fields: [
      { name: "author", label: "Author", sample: "Sam", ts: "string" },
      { name: "rating", label: "Rating", sample: 5, ts: "number" },
      { name: "body", label: "Body", sample: "Great cut", ts: "string" },
      { name: "postedAt", label: "Posted at", sample: "2026-08-20T12:00:00Z", ts: "string" },
    ],
    usecase:
      "Needs-reply must come from whether a reply exists — not from a client-sent flag.",
  }),
  listFormModule({
    tag: "idt-review-reply-list-form",
    title: "Review replies list + write-reply form",
    shortName: "Reply FE",
    Type: "ReviewReply",
    component: "ReviewReplyDesk",
    listVar: "replies",
    setList: "setReplies",
    emptyMsg: "No replies yet.",
    submitLabel: "Post reply",
    screenTitle: "Replies",
    fields: [
      { name: "reviewId", label: "Review id", sample: "r-1", ts: "string" },
      { name: "body", label: "Body", sample: "Thanks Sam!", ts: "string" },
      { name: "channel", label: "Channel", sample: "google", ts: "string" },
    ],
    usecase:
      "Replies are a second list+form — what we said, on which channel.",
  }),
  conflictApiModule({
    tag: "idt-review-replies-api",
    title: "Replies API — one reply per review channel",
    shortName: "Replies API",
    Type: "ReviewReply",
    store: "replies",
    validateFn: "validateReply",
    overlapFn: "hasReplyAlready",
    resourcePath: "/api/review-replies",
    conflictHint: "same reviewId + channel already replied → conflict",
    fields: [
      { name: "reviewId", label: "Review id", sample: "r-1", ts: "string" },
      { name: "body", label: "Body", sample: "Thanks Sam!", ts: "string" },
      { name: "channel", label: "Channel", sample: "google", ts: "string" },
    ],
    usecase:
      "Double-posting the same reply looks unprofessional. The API enforces one per channel.",
  }),
  filterListModule({
    tag: "idt-review-unanswered-board",
    title: "Unanswered board: filter reviews needing a reply",
    shortName: "Unanswered",
    Type: "Review",
    component: "UnansweredBoard",
    listVar: "reviews",
    setList: "setReviews",
    emptyMsg: "No unanswered reviews.",
    submitLabel: "Log",
    screenTitle: "Needs reply",
    fields: [
      { name: "author", label: "Author", sample: "Sam", ts: "string" },
      { name: "rating", label: "Rating", sample: "2", ts: "string" },
      { name: "status", label: "Status", sample: "needs-reply", ts: "string" },
    ],
    usecase:
      "Owners open a board of unanswered reviews first. Filter for display; keep full inbox in state.",
  }),

  // ClientReminderHub
  listFormModule({
    tag: "idt-reminder-schedule-list-form",
    title: "Reminder schedule list + create form",
    shortName: "Reminder FE",
    Type: "ScheduledReminder",
    component: "ReminderHub",
    listVar: "reminders",
    setList: "setReminders",
    emptyMsg: "No reminders scheduled.",
    submitLabel: "Schedule",
    screenTitle: "Reminders",
    fields: [
      { name: "client", label: "Client", sample: "Alex", ts: "string" },
      { name: "channel", label: "Channel", sample: "sms", ts: "string" },
      { name: "sendAt", label: "Send at", sample: "Fri 9:00", ts: "string" },
    ],
    usecase:
      "No-shows and forgotten nudges cost money. A reminder list+form is the light desk before SMS suites.",
  }),
  derivedApiModule({
    tag: "idt-reminder-due-api",
    title: "Reminders API with due/sent status",
    shortName: "Reminder due API",
    Type: "ScheduledReminder",
    store: "reminders",
    validateFn: "validateScheduledReminder",
    deriveFn: "deriveReminderStatus",
    resourcePath: "/api/scheduled-reminders",
    deriveHint: "sent → sent; else sendAt in the past → due; else scheduled",
    paidField: "sent",
    statusDone: "sent",
    statusLate: "due",
    statusOpen: "scheduled",
    fields: [
      { name: "client", label: "Client", sample: "Alex", ts: "string" },
      { name: "channel", label: "Channel", sample: "sms", ts: "string" },
      { name: "sendAt", label: "Send at", sample: "2026-08-22T09:00:00Z", ts: "string" },
    ],
    usecase:
      "Due vs scheduled must be derived from sendAt and sent — not invented by the browser.",
  }),
  listFormModule({
    tag: "idt-reminder-template-list-form",
    title: "Reminder templates list + save-template form",
    shortName: "Template FE",
    Type: "ReminderTemplate",
    component: "TemplateDesk",
    listVar: "templates",
    setList: "setTemplates",
    emptyMsg: "No templates yet.",
    submitLabel: "Save template",
    screenTitle: "Templates",
    fields: [
      { name: "name", label: "Name", sample: "Appt tomorrow", ts: "string" },
      { name: "body", label: "Body", sample: "See you at {time}", ts: "string" },
      { name: "channel", label: "Channel", sample: "sms", ts: "string" },
    ],
    usecase:
      "Reusable wording is another list+form — same React skill, different nouns.",
  }),
  conflictApiModule({
    tag: "idt-reminder-templates-api",
    title: "Templates API — unique name per channel",
    shortName: "Templates API",
    Type: "ReminderTemplate",
    store: "templates",
    validateFn: "validateTemplate",
    overlapFn: "hasTemplateName",
    resourcePath: "/api/reminder-templates",
    conflictHint: "same name + channel → conflict",
    fields: [
      { name: "name", label: "Name", sample: "Appt tomorrow", ts: "string" },
      { name: "body", label: "Body", sample: "See you at {time}", ts: "string" },
      { name: "channel", label: "Channel", sample: "sms", ts: "string" },
    ],
    usecase:
      "Two templates with the same name on one channel confuse staff. The API rejects duplicates.",
  }),
  filterListModule({
    tag: "idt-reminder-due-board",
    title: "Due board: filter reminders that should send now",
    shortName: "Due board",
    Type: "ScheduledReminder",
    component: "DueBoard",
    listVar: "reminders",
    setList: "setReminders",
    emptyMsg: "Nothing due.",
    submitLabel: "Schedule",
    screenTitle: "Due now",
    fields: [
      { name: "client", label: "Client", sample: "Alex", ts: "string" },
      { name: "channel", label: "Channel", sample: "sms", ts: "string" },
      { name: "status", label: "Status", sample: "due", ts: "string" },
    ],
    usecase:
      "Owners open a due board first. Filter for display; keep the full schedule in state.",
  }),

  // PackagePunchCard
  listFormModule({
    tag: "idt-package-list-form",
    title: "Package punch-card list + sell form",
    shortName: "Package FE",
    Type: "ServicePackage",
    component: "PackageDesk",
    listVar: "packages",
    setList: "setPackages",
    emptyMsg: "No packages sold yet.",
    submitLabel: "Sell package",
    screenTitle: "Packages",
    fields: [
      { name: "client", label: "Client", sample: "Riley", ts: "string" },
      { name: "service", label: "Service", sample: "Cut", ts: "string" },
      { name: "totalPunches", label: "Total punches", sample: "5", ts: "string" },
    ],
    usecase:
      "Prepaid packages are cash up front. A punch-card list+form replaces the paper card that gets lost.",
  }),
  derivedApiModule({
    tag: "idt-package-remaining-api",
    title: "Packages API with remaining / empty status",
    shortName: "Package API",
    Type: "ServicePackage",
    store: "packages",
    validateFn: "validatePackage",
    deriveFn: "derivePackageStatus",
    resourcePath: "/api/packages",
    deriveHint: "used >= total → empty; else active (expose remaining)",
    remainingPair: { used: "usedPunches", total: "totalPunches", emptyStatus: "empty", activeStatus: "active" },
    // usedPunches used to also sit in `fields` — validated as required client input, then
    // immediately overwritten to 0 by remainingPair's extraCreate right after, producing a
    // literal duplicate `usedPunches` key in the created row (caught live 2026-09-06 building the
    // real backend). It's purely server-managed (starts at 0, climbs via /redeem below) — a
    // client was never meant to set it at creation.
    fields: [
      { name: "client", label: "Client", sample: "Riley", ts: "string" },
      { name: "service", label: "Service", sample: "Cut", ts: "string" },
      { name: "totalPunches", label: "Total punches", sample: 5, ts: "number" },
    ],
    usecase:
      "Remaining punches must be computed from totals — clients cannot invent free punches.",
  }),
  listFormModule({
    tag: "idt-punch-log-list-form",
    title: "Punch log list + redeem form",
    shortName: "Punch FE",
    Type: "Punch",
    component: "PunchDesk",
    listVar: "punches",
    setList: "setPunches",
    emptyMsg: "No punches yet.",
    submitLabel: "Redeem",
    screenTitle: "Punches",
    fields: [
      { name: "packageId", label: "Package id", sample: "p-1", ts: "string" },
      { name: "note", label: "Note", sample: "Visit 3", ts: "string" },
      { name: "at", label: "At", sample: "Sat 11:00", ts: "string" },
    ],
    usecase:
      "Each visit is a punch row — same list+form skill as every other desk.",
  }),
  conflictApiModule({
    tag: "idt-punch-redeem-api",
    title: "Punches API — reject redeem when empty",
    shortName: "Punch API",
    Type: "Punch",
    store: "punches",
    validateFn: "validatePunch",
    overlapFn: "isPackageEmpty",
    resourcePath: "/api/punches",
    conflictHint: "package already at totalPunches used → conflict",
    fields: [
      { name: "packageId", label: "Package id", sample: "p-1", ts: "string" },
      { name: "note", label: "Note", sample: "Visit 3", ts: "string" },
      { name: "at", label: "At", sample: "2026-08-23T11:00:00Z", ts: "string" },
    ],
    usecase:
      "You cannot punch an empty card. The API owns that rule so the UI cannot cheat.",
  }),
  filterListModule({
    tag: "idt-package-low-board",
    title: "Low-balance board: filter packages almost empty",
    shortName: "Low board",
    Type: "ServicePackage",
    component: "LowPackageBoard",
    listVar: "packages",
    setList: "setPackages",
    emptyMsg: "No low-balance packages.",
    submitLabel: "Sell",
    screenTitle: "Almost empty",
    fields: [
      { name: "client", label: "Client", sample: "Riley", ts: "string" },
      { name: "service", label: "Service", sample: "Cut", ts: "string" },
      { name: "status", label: "Status", sample: "low", ts: "string" },
    ],
    usecase:
      "Owners upsell when a card is almost empty. Filter for display; keep full packages in state.",
  }),
];

function buildEngine(mod) {
  const stepNodes = mod.steps.map((step, i) => {
    const n = i + 1;
    const total = mod.steps.length;
    return `{
    id: "step${n}",
    type: "question",
    phase: "Step ${n} of ${total}",
    paal: \`${esc(step.taskPanel || step.paal)}\`,
    hint: \`${esc(step.hint)}\`,
    example_code: \`${esc(step.analog || step.expected)}\`,
    think_prompt: \`${esc(step.think || step.paal)}\`,
    mc_options: ${JSON.stringify(step.mc)},
    mc_correct_option: ${JSON.stringify(step.correct)},
    mc_anchor: ${JSON.stringify(String(step.correct).slice(0, 40))},
    why_this_matters: \`${esc(step.why || mod.concept)}\`,
    answer_keywords: ${JSON.stringify(step.keywords)},
    seed_code: \`${esc(step.seed)}\`,
    starter_code: \`${esc(step.starter)}\`,
    feedback_correct: ${JSON.stringify(step.ok || "Correct — keep going.")},
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: ${JSON.stringify(step.wrong || "Not quite — re-read the question and pick the matching option.")},
    // Fix 2: shown pre-check (before CHECK MY CODE has run on this step) instead of the
    // generic fallback feedback text — a lightweight, non-answer-revealing conceptual hint.
    pre_check_hint: \`${esc(step.preCheckHint || "")}\`,
    expected: \`${esc(step.expected)}\`,
    analog_example: \`${esc(step.analog || "// same pattern, different nouns")}\`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      // Fix 7: lead with the general concept (why a shared pattern matters), not the task
      // instruction restated verbatim.
      hook: \`${esc(step.deepDiveHook || step.paal)}\`,
      pain: "Skipping this step leaves later code with no data shape or no source of truth.",
      mentalModel: \`${esc(mod.concept)}\`,
      discover: \`${esc(step.expected)}\`,
      quickRules: "- One skill per step\\n- Name the skill, not the product noun\\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Write the same step for a different resource with the same shape.",
      build: \`${esc(step.hint)}\`,
    },
  }`;
  });

  const side = [
    `{ label: "Lesson", id: "intro" }`,
    `{ label: "Objectives", id: "objectives" }`,
    ...mod.steps.map((_, i) => `{ label: "Step ${i + 1}", id: "step${i + 1}" }`),
  ];

  return `import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: ${JSON.stringify(mod.tag)},
      title: ${JSON.stringify(mod.title)},
      body: \`${esc(mod.concept)}\`,
      usecase: ${JSON.stringify(mod.usecase)},
      ${mod.designMock ? `designMock: ${JSON.stringify(mod.designMock)},` : ""}
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: ${JSON.stringify(mod.steps.map((s) => s.paal))},
  },
  ${stepNodes.join(",\n  ")},
];

const sideItems = [
  ${side.join(",\n  ")},
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: ${JSON.stringify(mod.title)},
  shortName: ${JSON.stringify(mod.shortName)},
});
`;
}

// Everything below only runs when this file is executed directly (`node
// scripts/write-smb-assist-engines.mjs`) — guarded so other scripts can `import { MODULES }` (or
// API_RESOURCE_CONFIGS) from this file to reuse the same specs without re-triggering every write.
// Windows path/URL comparisons (drive-letter casing, slash direction) are unreliable for an exact
// import.meta.url === file://argv[1] match — comparing basenames is enough here since this file is
// never invoked under a different name.
const isMain = process.argv[1] && path.basename(process.argv[1]) === path.basename(fileURLToPath(import.meta.url));
if (isMain) {
  fs.mkdirSync(ASSIST_DIR, { recursive: true });

  // Review-cycle rewrite (beginner-friendly step titles + ASSIST GUIDE content, from
  // docs/task-catalog-beginner-rewrite.txt + "docs/assistguides for all 40 tasks.txt") — applied to
  // every module's steps before rendering. idt-quote-accepted-board got a bespoke, richer rewrite
  // (a 5th "Accept" step with real new logic) that this generator doesn't produce, so its file is
  // hand-maintained and skipped here entirely — never overwritten by this script.
  const { applyReviewOverrides } = await import("./apply-review-content.mjs");
  const HAND_MAINTAINED_TAGS = new Set([
    "idt-quote-accepted-board",
    // Per-task review pass (2026-09-06 onward) — bespoke content replacing the generic template's
    // output, matching the user's own written Assist Guide for this specific task exactly
    // (including its own OpenCoverage/CoverageSlot naming). Never overwrite with the generic
    // listFormModule/filterListModule output.
    "idt-coverage-list-form",
    // Design-mock fix (2026-09-06): the real task is a fixed filter ("Filter to low for display;
    // keep full packages in state") — not an add-a-row form. Hand-set to formMode:"filter" with a
    // Status dropdown (found live: the generic template gave it a "Sell" button that fabricated
    // brand-new packages, which has nothing to do with what this task actually builds).
    "idt-package-low-board",
  ]);

  let ok = 0;
  for (const mod of MODULES) {
    if (HAND_MAINTAINED_TAGS.has(mod.tag)) {
      console.log("skipped (hand-maintained)", `inpact_assist_${mod.tag}_engine.tsx`);
      ok += 1;
      continue;
    }
    applyReviewOverrides(mod);
    const code = buildEngine(mod);
    try {
      assertValidModule(code);
    } catch (err) {
      console.error("INVALID", mod.tag, err.message);
      process.exitCode = 1;
      continue;
    }
    const file = path.join(ASSIST_DIR, `inpact_assist_${mod.tag}_engine.tsx`);
    fs.writeFileSync(file, code, "utf8");
    console.log("wrote", path.basename(file), "steps=", mod.steps.length);
    ok += 1;
  }

  // Companion data file: tag -> designMock, extracted from the same MODULES array that just wrote
  // the .tsx engines. Lets Workbench's "Try the mock" button render a task's DesignMockPreview
  // (src/id-module/DesignMockPreview.jsx) by AssistModule tag alone, without importing the full
  // lesson-engine bundle for every wired task just to read one field off it.
  const mocksByTag = {};
  for (const mod of MODULES) {
    if (mod.designMock) mocksByTag[mod.tag] = mod.designMock;
  }
  const mocksFile = path.resolve(__dirname, "../src/id-module/designMocks.generated.js");
  fs.writeFileSync(
    mocksFile,
    `// Generated by scripts/write-smb-assist-engines.mjs — do not hand-edit.\n// tag (AssistModule: value on a task's OneDev issue) -> that module's design mock config.\nexport const DESIGN_MOCKS = ${JSON.stringify(mocksByTag, null, 2)};\n`,
    "utf8",
  );
  console.log(`wrote ${path.basename(mocksFile)} (${Object.keys(mocksByTag).length} mocks)`);

  console.log(`\n${ok}/${MODULES.length} assist engines written.`);
}

export { MODULES };
