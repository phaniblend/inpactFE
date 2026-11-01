import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "assignee-selection-ui",
      title: "Building Optimistic Assignee Selection UI",
      body: `
        • "Optimistic UI" means updating the screen the instant someone clicks — before the server has actually confirmed anything.
        • You might have noticed that in Instagram, tapping the heart fills it in immediately — it doesn't wait for the server to say "yes, liked" first.
        • Same idea here: clicking "Claim" should show it claimed right away, then quietly confirm with the server after.
        • If the server request fails, the UI has to roll back to what it was — the click isn't the end of the story.
      `,
      usecase: "A project management tool where users assign tasks to team members, mark tasks as complete, or update task priorities.",
      // Found live 2026-09-01, twice: (1) sample rows used two unrelated meta concepts (Status,
      // Priority) that the form below couldn't produce at all — clicking Create Task always
      // left meta blank, since neither field maps to it; (2) "Task" reads as generic-to-the-
      // point-of-ambiguous right next to "assignee" — renamed the mock's own wording to "Task"
      // (still generic, just a clearer noun for an assignment concept). Rows and fields now
      // describe the same thing.
      designMock: {
        "kind": "list-and-form",
        "screenTitle": "Task Assignments",
        "caption": "Add new tasks and assign them to a team member.",
        "listCaption": "Current Tasks",
        "emptyCaption": "No Tasks",
        "emptyMessage": "Add a task below to get started.",
        "rows": [
          { "title": "Project X", "subtitle": "Alice", "meta": "Assigned" },
          { "title": "Bug Fix 123", "subtitle": "Unassigned", "meta": "Claim" }
        ],
        // Found live 2026-09-01: the "Claim" badge was just static text — the real task's whole
        // point is that clicking it does something. subtitleValues keeps the assignee name honest
        // when toggling: claiming sets it to "You", unassigning sets it back to "Unassigned" —
        // never a real teammate name, since a mock can't know who else "assigned" really means.
        "rowToggle": {
          "values": ["Claim", "Assigned"],
          "labels": { "Claim": "Claim", "Assigned": "Unassign" },
          "subtitleValues": ["Unassigned", "You"]
        },
        "fields": [
          { "label": "Task Name", "sample": "New Task" },
          { "label": "Assign To", "sample": "Charlie" }
        ],
        "metaFromField": { "index": 1, "whenFilled": "Assigned", "whenEmpty": "Claim" },
        "submitLabel": "Create Task"
      }
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Implement optimistic UI updates for assignment actions.",
      "Manage local state to reflect pending and confirmed changes.",
      "Handle API responses to confirm or roll back optimistic updates.",
      "Create a reusable component for selecting and assigning tasks."
    ],
  },
  {
    id: "prereq-fundamentals",
    type: "funda-gate",
    phase: "Prerequisites",
    fundas: [
      {
        name: "React hooks (useState / useEffect)",
        blurb: "This lesson's own subject — optimistic UI — is built entirely on managing local state and reacting to it, used from Step 1 onward.",
        videoUrl: "https://www.youtube.com/watch?v=O6P86uwfdR0",
        quiz: {
          question: "What does calling the setter function returned by useState actually do?",
          options: [
            "Immediately mutates the variable in place, no re-render",
            "Schedules a re-render of the component with the new value",
            "Only works inside a useEffect callback",
          ],
          correctIndex: 1,
        },
      },
      {
        name: "TypeScript interfaces",
        blurb: "Steps 2 and 3 define the shape of the data this component works with — a User, then a Task — before any of the assignment logic is built.",
        videoUrl: "https://www.youtube.com/watch?v=VbW6vWTaHOY",
        quiz: {
          question: "Which correctly defines an interface for an object with an id and a name?",
          options: [
            "type Item = 'id' | 'name';",
            "interface Item { id: number; name: string; }",
            "const Item = { id: 0, name: '' };",
          ],
          correctIndex: 1,
        },
      },
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 11",
    paal: "To begin, import the necessary React hooks: `useState` for managing component state and `useEffect` for handling side effects like data fetching. You'll also need `useCallback` to memoize event handlers, preventing unnecessary re-renders.",
    hint: "Think about the core hooks needed for state management and side effects in a functional component.",
    example_code: `import { useState, useEffect, useCallback } from 'react';`,
    think_prompt: "Which React hooks are essential for managing state, performing side effects, and optimizing function references in a functional component?",
    mc_options: [
      "import { useContext, useReducer } from 'react';",
      "import { useState, useEffect, useCallback } from 'react';",
      "import { useRef, useMemo } from 'react';",
    ],
    mc_correct_option: "import { useState, useEffect, useCallback } from 'react';",
    mc_anchor: "The `useState` hook is crucial for managing component-specific data that changes over time, such as a list of items or selected values. `useEffect` is used for operations that interact with the outside world, like fetching data from an API when the component mounts. `useCallback` helps optimize performance by ensuring that functions passed down to child components don't cause unnecessary re-renders.",
    why_this_matters: "Properly importing hooks ensures you have the tools to build dynamic and efficient React components. `useState` is the foundation for any interactive UI, `useEffect` manages data flow and external interactions, and `useCallback` is key for performance optimization, especially in components with many children or frequent updates.",
    answer_keywords: ["useState", "useEffect", "useCallback", "imports", "hooks"],
    seed_code: "",
    starter_code: `// Add your React hook imports here
`,
    feedback_correct: "Excellent! `useState`, `useEffect`, and `useCallback` are the foundational hooks for building interactive and performant functional components.",
    feedback_partial: "You've identified some useful hooks, but `useState`, `useEffect`, and `useCallback` are specifically needed for state, side effects, and memoized callbacks in this scenario.",
    feedback_wrong: "While other hooks have their uses, `useState` for state, `useEffect` for side effects, and `useCallback` for memoizing functions are the core imports for this module.",
    expected: `import { useState, useEffect, useCallback } from 'react';`,
    analog_example: `import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
    deepDiveLabel: "Why are these specific hooks so common?",
    deepDive: {
      hook: `Imagine you're building a complex application, perhaps a dashboard with many interactive elements. Without hooks like \`useState\` and \`useEffect\`, managing component state and side effects would often involve class components, which can become verbose and harder to reason about, especially when dealing with lifecycle methods. You might find yourself writing repetitive code for data fetching, subscriptions, or manual DOM manipulation across different lifecycle stages (\`componentDidMount\`, \`componentDidUpdate\`, \`componentWillUnmount\`). This can lead to bugs, memory leaks, and a general feeling of "boilerplate fatigue." Furthermore, passing callback functions down through multiple layers of components without memoization can trigger unnecessary re-renders, slowing down your application and making it feel sluggish. The need for a more direct, functional, and performant way to handle these common patterns led to the introduction of hooks.`,
      pain: `⚠️ **Lesson:** Without a clear, concise way to manage state and side effects, components become bloated and difficult to maintain. Symptom: Class components with complex lifecycle methods, prop drilling callbacks, and performance issues due to unmemoized functions.`,
      mentalModel: `**Mental model:** The "Component's Toolkit." Think of \`useState\`, \`useEffect\`, and \`useCallback\` as the essential tools in a functional component's toolkit. \`useState\` is your workbench for holding dynamic data, \`useEffect\` is your automated assistant for tasks that need to run after rendering (like fetching data or setting up subscriptions), and \`useCallback\` is your efficiency expert, ensuring that your tools (functions) are only rebuilt when absolutely necessary, saving time and tasks.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use \`useState\` for any piece of data that needs to change and trigger a re-render.
- ✅ Use \`useEffect\` for operations that interact with the browser, network, or other external systems.
- ✅ Use \`useCallback\` to memoize event handlers and other functions passed as props to optimized child components.
- ✅ Always include a dependency array with \`useEffect\` and \`useCallback\` to control when they re-run or re-create.
- ❌ Avoid putting heavy computations directly in the render body; use \`useMemo\` or \`useCallback\` if necessary.
- ❌ Don't call hooks inside loops, conditions, or nested functions; always call them at the top level of your functional component.
- ❌ Never forget the dependency array for \`useEffect\` if you want to control its execution, or you might create infinite loops or stale closures.`,
      watchOut: `👀 **Watch out:** Incorrect dependency arrays for \`useEffect\` and \`useCallback\` are a common source of bugs. An empty array (\`[]\`) means the effect or callback runs/is created only once on mount. Omitting the array means it runs/is created on every render. Forgetting to include a dependency that the effect or callback relies on can lead to "stale closures," where the function uses an outdated value of a variable. Always ensure your dependency arrays are complete and accurate.`,
      dryRun: `🔁 **Think:** A component mounts.
1. \`useState(0)\` initializes \`count\` to \`0\` and \`setCount\` is available.
2. The component renders, showing "You clicked 0 times".
3. The \`useEffect\` runs for the first time. \`document.title\` becomes "Count: 0".
4. The user clicks the button. \`setCount(count + 1)\` is called. Since \`count\` is \`0\`, \`setCount(1)\` is triggered.
5. The component re-renders because \`count\` changed.
6. The \`useEffect\` runs again because \`count\` (a dependency) changed from \`0\` to \`1\`. \`document.title\` becomes "Count: 1".
7. The component now shows "You clicked 1 times".
(Hint: Trace how \`count\` changes and how \`useEffect\` reacts to those changes.)`,
      build: "**Learning focus:** Understand the purpose and basic usage of `useState`, `useEffect`, and `useCallback` for building interactive UIs.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 11",
    paal: "Next, define the TypeScript interface for the `User` data structure — the person a task can be assigned to.",
    hint: "Consider the essential properties for a user: a unique ID and a display name.",
    example_code: `interface User {
  id: string;
  name: string;
}`,
    think_prompt: "What properties would a `User` object need?",
    mc_options: [
      "type User = { userId: number; username: string; };",
      "interface User { id: string; name: string; };",
      "interface User { uuid: string; label: string; };",
    ],
    mc_correct_option: "interface User { id: string; name: string; };",
    mc_anchor: "Defining a clear interface like `User` with `id` and `name` provides strong typing — every other part of the component now knows exactly what shape a user is.",
    why_this_matters: "Type definitions are critical for maintainability and preventing bugs in large applications. They act as a contract for your data, making it clear what properties an object should have and what their types are.",
    answer_keywords: ["interface", "type safety", "User"],
    seed_code: `import { useState, useEffect, useCallback } from 'react';`,
    starter_code: `import { useState, useEffect, useCallback } from 'react';

// Define the User interface here
`,
    feedback_correct: "Perfect! This interface gives you strong typing for a user's data.",
    feedback_partial: "You've defined a shape, but make sure it includes a unique identifier (`id`) and a display `name`.",
    feedback_wrong: "Remember, a `User` needs a unique identifier (`id`) and a display `name` — that's all this step needs.",
    expected: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}`,
    analog_example: `interface Product {
  id: string;
  title: string;
  price: number;
  inStock: boolean;
}`,
    deepDiveLabel: "How do interfaces improve code quality and collaboration?",
    deepDive: {
      hook: `Imagine working on a large team project where multiple developers are interacting with the same data structures. Without clear definitions, one developer might assume a user object has a \`userId\` property (a number), while another expects an \`id\` property (a string). This ambiguity leads to constant communication overhead, runtime errors, and a significant amount of debugging time spent just figuring out what shape the data is supposed to be in. The lack of a contract makes it incredibly difficult to refactor code, onboard new team members, or even confidently make small changes without fear of breaking something elsewhere in the application.`,
      pain: `⚠️ **Lesson:** Undefined data shapes lead to ambiguity, runtime errors, and increased development friction. Symptom: Frequent \`undefined is not a function\` or \`Cannot read properties of undefined\` errors, inconsistent data access patterns, and difficulty in refactoring.`,
      mentalModel: `**Mental model:** The "Data Blueprint." Think of an interface as a detailed blueprint for a piece of data. Just as an architect's blueprint specifies the exact dimensions, materials, and layout of a building, a TypeScript interface specifies the exact properties, their types, and their optionality for an object. This blueprint ensures that everyone working on the project has a shared, unambiguous understanding of the data's structure, preventing miscommunications and structural errors before the code even runs.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use interfaces to define the shape of objects, especially for data fetched from APIs or passed as props.
- ✅ Be explicit with types (e.g., \`string\`, \`number\`, \`boolean\`, custom types).
- ✅ Mark optional properties with \`?\` to indicate they might not always be present.
- ❌ Avoid using \`any\` as a type unless absolutely necessary, as it defeats the purpose of TypeScript.
- ❌ Don't define interfaces with properties that are not actually part of the data structure.
- ❌ Never rely solely on runtime checks for data shape when TypeScript interfaces can provide compile-time safety.`,
      watchOut: `👀 **Watch out:** While interfaces provide compile-time safety, they don't exist at runtime. This means if you receive data from an external source (like an API) that doesn't conform to your interface, TypeScript won't catch it at runtime. You might still need runtime validation (e.g., using Zod or Yup) for incoming data, especially from untrusted sources, to ensure your application doesn't crash with unexpected data shapes.`,
      dryRun: `🔁 **Think:** You have a \`User\` object: \`{ id: "user-1", name: "Alice" }\`.
1. Somewhere else in the app, code reads \`user.name\` expecting a string.
2. Because \`User\` is a typed interface, TypeScript would flag it at compile time if any code tried to construct a user missing \`id\` or \`name\`.
3. This catches the mistake before the app ever runs, not after a customer hits a broken screen.
(Hint: Notice how the interface acts as a contract every part of the code agrees to.)`,
      build: "**Learning focus:** Define a type-safe interface for `User`.",
    },
  },
  {
    id: "step2b",
    type: "question",
    phase: "Step 3 of 11",
    paal: "Now define the TypeScript interface for `Task` — the item being assigned. It needs an `assigneeId` to record who it's assigned to, and an `isPending` flag so the UI can mark it as mid-update during an optimistic assignment.",
    hint: "Consider the essential properties for a task: a unique ID, a name, who it's assigned to (which can be nobody), and whether an assignment is still in flight.",
    example_code: `interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}`,
    think_prompt: "What properties would a `Task` object need, especially considering assignment and optimistic updates?",
    mc_options: [
      "type Task = { taskId: number; taskName: string; assignedTo: string; };",
      "interface Task { id: string; name: string; assigneeId: string | null; isPending?: boolean; };",
      "interface Task { key: string; title: string; currentAssignee: string | undefined; };",
    ],
    mc_correct_option: "interface Task { id: string; name: string; assigneeId: string | null; isPending?: boolean; };",
    mc_anchor: "Defining `Task` with `id`, `name`, `assigneeId`, and an optional `isPending` flag provides strong typing. The `isPending` flag is crucial for optimistic updates, allowing the UI to temporarily mark an item as being updated while waiting for the server response.",
    why_this_matters: "For optimistic updates, adding an `isPending` flag directly to the `Task` interface lets you easily track which items are currently undergoing an update, enabling visual feedback to the user the instant they click — before the server has actually confirmed anything.",
    answer_keywords: ["interface", "Task", "optimistic updates", "isPending", "assigneeId"],
    seed_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}`,
    starter_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

// Define the Task interface here
`,
    feedback_correct: "Perfect! This interface provides strong typing for your task data, and the `isPending` flag is exactly what you'll need for optimistic updates.",
    feedback_partial: "You've defined the basic structure, but consider adding an optional `isPending` flag to the `Task` interface to track optimistic updates.",
    feedback_wrong: "Make sure the `Task` interface includes a unique identifier (`id`), an `assigneeId` that can be `null`, and an optional `isPending` flag for optimistic updates.",
    expected: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}`,
    analog_example: `interface CartItem {
  productId: string;
  quantity: number;
  isSyncing?: boolean; // true while a quantity change is being saved to the server
}`,
    deepDiveLabel: "Why does a data shape need a pending flag at all?",
    deepDive: {
      hook: `Consider an e-commerce cart: the moment a shopper changes an item's quantity, the UI updates immediately — but the change hasn't reached the server yet. If the request later fails, the UI has to know which specific row to roll back. Without a field on the data itself marking "this one is still in flight," there's no reliable way to tell a confirmed value apart from an optimistic guess once several updates are happening close together.`,
      pain: `⚠️ **Lesson:** Optimistic UI without a pending marker on the data can't tell "confirmed" apart from "guessed" once a request fails or a second update starts before the first finishes. Symptom: rollbacks that revert the wrong row, or UI that looks confirmed when it silently failed.`,
      mentalModel: `**Mental model:** The "Sticky Note." An \`isPending\` flag is like a sticky note stuck to one row saying "still waiting to hear back." Once the server confirms, you peel the note off. If the server says no, you use the note to know exactly which value to restore.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Put the pending marker on the same record it describes, not in separate state.
- ✅ Make it optional — most records aren't mid-update most of the time.
- ✅ Clear it (or set it false) as soon as the server responds, success or failure.
- ❌ Don't track "which id is pending" in a separate list — it drifts out of sync with the data.`,
      watchOut: `👀 **Watch out:** If two assignments to the same task happen in quick succession, a naive rollback can restore the wrong prior value. Track enough (like the original value at the time of the click) to roll back correctly, not just a boolean.`,
      dryRun: `🔁 **Think:** You have a \`Task\` object: \`{ id: "task-1", name: "Task A", assigneeId: null }\`.
1. The UI optimistically updates it to \`{ id: "task-1", name: "Task A", assigneeId: "user-2", isPending: true }\`.
2. The UI renders, showing "Task A assigned to User 2 (pending)".
3. The API call fails.
4. The UI rolls back to \`{ id: "task-1", name: "Task A", assigneeId: null }\`, removing the \`isPending\` flag.
5. The UI renders, showing "Task A unassigned" again.
(Hint: Observe how the \`isPending\` flag and \`assigneeId\` change during the optimistic update and rollback.)`,
      build: "**Learning focus:** Define a type-safe interface for `Task`, including an `isPending` flag for optimistic updates.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 4 of 11",
    paal: "Now, create the functional component shell — the main component that will orchestrate the display and assignment of tasks. Give it a wrapping `div` with a descriptive class name and an `h2` heading, so there's something visible on screen as soon as it renders.",
    hint: "Define a functional component that returns a `div` (with a class name) wrapping an `h2` heading.",
    example_code: `function TaskAssignmentPanel() {
  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    think_prompt: "What is the basic structure for a functional React component that will house your assignment UI?",
    mc_options: [
      "const TaskAssignmentPanel = () => { return <div></div>; };",
      "function TaskAssignmentPanel() { return <div className=\"task-assignment-panel\"><h2>Task Assignments</h2></div>; }",
      "class TaskAssignmentPanel extends React.Component { render() { return <div></div>; } }",
    ],
    mc_correct_option: "function TaskAssignmentPanel() { return <div className=\"task-assignment-panel\"><h2>Task Assignments</h2></div>; }",
    mc_anchor: "A functional component is defined as a JavaScript function that returns JSX. This step specifically asks for a wrapper `div` with a class name and a heading — not just an empty shell — so there's a visible container to build the rest of the UI inside.",
    // Two genuinely different wrong options need one message that covers both without
    // misdiagnosing either — found live 2026-09-02: the generic `feedback_wrong` text below
    // ("avoid class components") is correct for option 3 but false for option 1, which IS a
    // functional component, just missing the div's class name and heading this step asks for.
    mc_think_feedback_incorrect: "Not quite. Make sure you're using a function (not a class) component, and that it returns a `div` with a class name wrapping an `h2` heading — an empty `div` alone isn't enough for this step.",
    why_this_matters: "Establishing the component shell early provides a clear container for all subsequent logic and UI elements. It's the entry point for your component's rendering and state management, ensuring that all parts of the assignment UI are encapsulated within a single, manageable unit.",
    answer_keywords: ["functional component", "JSX", "component shell", "return"],
    seed_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}`,
    starter_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

// Create your functional component here
`,
    feedback_correct: "Great! You've set up the basic functional component. This will be the container for all your assignment logic and UI.",
    feedback_partial: "You've created a functional component, but it's good practice to give it a descriptive name and a clear initial heading.",
    feedback_wrong: "Make sure it's a function (not a class) component, and that it returns a `div` with a class name wrapping an `h2` heading.",
    expected: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    analog_example: `function GreetingCard({ name }: { name: string }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      <h3>Hello, {name}!</h3>
      <p>Hope you have a wonderful day.</p>
    </div>
  );
}`,
    deepDiveLabel: "What are the advantages of functional components over class components?",
    deepDive: {
      hook: `Before the introduction of hooks, if you needed state or lifecycle methods, you had to use class components. This meant writing \`class MyComponent extends React.Component\`, dealing with \`this\` binding issues, and often having to refactor functional components into class components just to add a single piece of state. The code could become verbose, especially for simple components, and the logic related to a single feature (like data fetching) might be scattered across multiple lifecycle methods (\`componentDidMount\`, \`componentDidUpdate\`, \`componentWillUnmount\`), making it hard to follow and maintain. This complexity often led to larger bundles, slower development, and a steeper learning curve for new developers.`,
      pain: `⚠️ **Lesson:** Class components can introduce boilerplate, \`this\` binding complexities, and scattered logic. Symptom: Verbose code, difficulty in reusing stateful logic, and a higher cognitive load for understanding component behavior.`,
      mentalModel: `**Mental model:** The "Pure Function with Memory." Imagine a functional component as a pure mathematical function: given the same inputs (props), it always produces the same output (JSX). Hooks like \`useState\` and \`useEffect\` then act as a special kind of "memory" or "side-effect manager" that you can attach to these pure functions, allowing them to remember things between renders and interact with the outside world, without losing their functional simplicity.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use functional components for all new components.
- ✅ Pass data down to functional components via props.
- ✅ Use hooks (\`useState\`, \`useEffect\`, etc.) to add state and side effects.
- ✅ Keep components focused on a single responsibility.
- ❌ Avoid class components unless you're working with legacy code.
- ❌ Don't mutate props directly within a functional component.
- ❌ Never call hooks conditionally or inside nested functions.`,
      watchOut: `👀 **Watch out:** While functional components are powerful, it's easy to fall into traps like creating infinite re-renders if \`useEffect\` dependencies are not managed correctly, or passing new function references on every render if \`useCallback\` is not used for event handlers. Always be mindful of how state updates and dependency changes affect your component's render cycle.`,
      dryRun: `🔁 **Think:** A \`MyButton\` component is rendered with \`label="Click Me"\`.
1. \`useState(0)\` initializes \`clicks\` to \`0\`.
2. The component renders, displaying "<button>Click Me (0 clicks)</button>".
3. The user clicks the button. \`handleClick\` is called.
4. \`setClicks(prev => prev + 1)\` updates \`clicks\` from \`0\` to \`1\`.
5. The component re-renders because \`clicks\` state changed.
6. The component now displays "<button>Click Me (1 clicks)</button>".
(Hint: Trace how the \`clicks\` state changes and how it affects the rendered output.)`,
      build: "**Learning focus:** Create a basic functional component to serve as the container for the assignment UI.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 5 of 11",
    paal: "Now, declare state to hold the list of tasks this panel displays and assigns. Start it as an empty array — the real data will be fetched in a later step.",
    hint: "Use `useState<Task[]>` initialized to an empty array — this is the data the UI will render and later update.",
    example_code: `const [tasks, setTasks] = useState<Task[]>([]);`,
    think_prompt: "How would you declare state to hold the list of `Task` items, starting as an empty array?",
    mc_options: [
      "const tasks: Task[] = [];",
      "const [tasks, setTasks] = useState<Task[]>([]);",
      "let tasks = [];",
    ],
    mc_correct_option: "const [tasks, setTasks] = useState<Task[]>([]);",
    mc_anchor: "`useState<Task[]>([])` gives you a reactive array — calling `setTasks` later will trigger a re-render with the updated list.",
    why_this_matters: "The tasks list is the core data this whole component displays and updates. It needs to be state, not a plain variable, so the UI re-renders whenever it changes — like after fetching or an optimistic assignment.",
    answer_keywords: ["useState", "tasks", "Task[]"],
    seed_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    starter_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  // Declare state for the tasks list here

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    feedback_correct: "Right — `tasks` is now reactive state, ready to hold whatever the component fetches or updates.",
    feedback_partial: "You've got a `tasks` variable, but make sure it's declared with `useState` so updates trigger a re-render.",
    feedback_wrong: "This needs `useState<Task[]>([])` — a plain variable won't cause the UI to update when the list changes.",
    expected: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    analog_example: `function ShoppingCart() {
  const [items, setItems] = useState<CartItem[]>([]);
}`,
    deepDiveLabel: "How does `useState` work under the hood?",
    deepDive: {
      hook: `Have you ever wondered how React "remembers" the state of your functional components between renders? Without \`useState\`, every time your component function runs (which happens on every re-render), all local variables would be re-initialized, effectively wiping out any previous state. This would make it impossible to build interactive UIs where data persists and changes over time, like a counter that increments, a form input that holds its value, or a list that updates. The challenge is to give a pure function "memory" without turning it into a class or relying on global variables, which would break React's component model and make debugging a nightmare.`,
      pain: `⚠️ **Lesson:** Without a mechanism to persist state between renders, functional components would be stateless and non-interactive. Symptom: UI elements resetting to initial values on every re-render, inability to store user input or dynamic data.`,
      mentalModel: `**Mental model:** The "Component's Private Locker." Imagine each functional component instance has a small, private locker. When you call \`useState('initialValue')\`, React assigns a slot in that locker for this specific state variable and stores 'initialValue' there. On subsequent renders, when React sees the same \`useState\` call, it doesn't re-initialize; instead, it retrieves the current value from that locker slot. The setter function (\`setSomething\`) is the key to updating the value in the locker, which then tells React to re-render the component with the new value.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Call \`useState\` at the top level of your functional component.
- ✅ Use descriptive names for your state variables and their setters (e.g., \`[count, setCount]\`).
- ✅ Pass a function to the setter if the new state depends on the previous state (e.g., \`setCount(prevCount => prevCount + 1)\`).
- ✅ Initialize state with a sensible default value (empty array, null, false, etc.).
- ❌ Never call \`useState\` inside loops, conditions, or nested functions.
- ❌ Don't directly mutate state variables; always use the setter function.
- ❌ Avoid complex objects as initial state if simpler primitives suffice.`,
      watchOut: `👀 **Watch out:** When updating state that is an object or array, always create a *new* object or array. Mutating the existing state object directly (e.g., \`myArray.push(item)\` then \`setMyArray(myArray)\`) will not trigger a re-render because React performs a shallow comparison of the state reference. Instead, use spread syntax or array methods that return new arrays (e.g., \`setMyArray(prevArray => [...prevArray, item])\`).`,
      dryRun: `🔁 **Think:** A \`ToggleButton\` component is rendered.
1. \`useState(false)\` initializes \`isOn\` to \`false\`.
2. The component renders, displaying "<button>OFF</button>".
3. The user clicks the button. \`handleToggle\` is called.
4. \`setIsOn(!isOn)\` is called. Since \`isOn\` is \`false\`, \`!isOn\` is \`true\`, so \`setIsOn(true)\` is triggered.
5. The component re-renders because \`isOn\` state changed.
6. The component now displays "<button>ON</button>".
7. The user clicks again. \`setIsOn(!isOn)\` is called. Since \`isOn\` is \`true\`, \`!isOn\` is \`false\`, so \`setIsOn(false)\` is triggered.
8. The component re-renders.
9. The component now displays "<button>OFF</button>".
(Hint: Follow the value of \`isOn\` and how it toggles with each click.)`,
      build: "**Learning focus:** Declare and initialize the `tasks` list as reactive state using `useState`.",
    },
  },
  {
    id: "step4b",
    type: "question",
    phase: "Step 6 of 11",
    paal: "Now declare state for the list of users someone could assign a task to — the people your dropdown will list.",
    hint: "Same pattern as `tasks`: `useState<User[]>` initialized to an empty array.",
    example_code: `const [users, setUsers] = useState<User[]>([]);`,
    think_prompt: "How would you declare state to hold the list of `User` items, starting as an empty array?",
    mc_options: [
      "const [users, setUsers] = useState<User[]>([]);",
      "const users: User[] = [];",
      "const [users, setUsers] = useState<Task[]>([]);",
    ],
    mc_correct_option: "const [users, setUsers] = useState<User[]>([]);",
    mc_anchor: "Same pattern as `tasks` — `useState<User[]>([])` gives you a reactive list of users to populate the assignment dropdown. Note the type parameter: it's `User[]`, not `Task[]` — mixing them up compiles fine until you actually try to use the wrong shape.",
    why_this_matters: "The dropdown that lets someone pick who to assign a task to needs a live list of users to read from — this state is what populates it.",
    answer_keywords: ["useState", "users", "User[]"],
    seed_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    starter_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  // Declare state for the users list here

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    feedback_correct: "Right — `users` is now reactive state, ready to populate the assignment dropdown.",
    feedback_partial: "You've got a `users` variable, but make sure it's declared with `useState` so updates trigger a re-render.",
    feedback_wrong: "This needs `useState<User[]>([])` — check both that it's reactive state, and that the type is `User[]`, not `Task[]`.",
    expected: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    analog_example: `function ShoppingCart() {
  const [categories, setCategories] = useState<Category[]>([]);
}`,
  },
  {
    id: "step4c",
    type: "question",
    phase: "Step 7 of 11",
    paal: "Now declare state to hold an error message, in case fetching or assigning a task ever fails.",
    hint: "Use `useState<string | null>` initialized to `null` — there's no error until something actually goes wrong.",
    example_code: `const [error, setError] = useState<string | null>(null);`,
    think_prompt: "How would you declare state to hold an error message that starts out empty?",
    mc_options: [
      "const [error, setError] = useState<string | null>(null);",
      "const [error, setError] = useState<string>('');",
      "let error = null;",
    ],
    mc_correct_option: "const [error, setError] = useState<string | null>(null);",
    mc_anchor: "`string | null` is the honest type here: there either is an error message, or there is genuinely no error yet — an empty string would blur that distinction.",
    why_this_matters: "If a fetch or an optimistic assignment fails, this is what the UI reads to tell the user something went wrong, instead of failing silently.",
    answer_keywords: ["useState", "error", "string | null"],
    seed_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    starter_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  // Declare state for the error message here

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    feedback_correct: "Right — `error` starts as `null` and is ready to hold a message the moment something fails.",
    feedback_partial: "You've got an `error` variable, but make sure it's declared with `useState` so the UI updates when it's set.",
    feedback_wrong: "This needs `useState<string | null>(null)` — reactive state that starts as `null`, not an empty string.",
    expected: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    analog_example: `function ShoppingCart() {
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
}`,
  },
  {
    id: "step4d",
    type: "question",
    phase: "Step 8 of 11",
    paal: "Finally, declare state to track whether the initial data is still being fetched, so you can show a loading message instead of an empty list.",
    hint: "Use `useState<boolean>` initialized to `true` — loading starts out true, until the fetch finishes.",
    example_code: `const [isLoading, setIsLoading] = useState<boolean>(true);`,
    think_prompt: "How would you declare state to track whether data is still loading, starting as true?",
    mc_options: [
      "const [isLoading, setIsLoading] = useState<boolean>(true);",
      "const [isLoading, setIsLoading] = useState<boolean>(false);",
      "let isLoading = true;",
    ],
    mc_correct_option: "const [isLoading, setIsLoading] = useState<boolean>(true);",
    mc_anchor: "It starts as `true` because, the moment this component mounts, the fetch hasn't happened yet — the UI should show a loading state immediately, not a false 'no tasks yet' empty state.",
    why_this_matters: "Without this, the panel would briefly render as if there were zero tasks before the fetch completes — a flash of the wrong UI instead of an honest loading indicator.",
    answer_keywords: ["useState", "isLoading", "boolean"],
    seed_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    starter_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Declare state for the loading flag here

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    feedback_correct: "Excellent! You've now got all four pieces of state your component needs: tasks, users, error, and isLoading.",
    feedback_partial: "You've got an `isLoading` variable, but make sure it's declared with `useState` so the UI can react to it.",
    feedback_wrong: "This needs `useState<boolean>(true)` — reactive state that starts as `true`, since data hasn't loaded yet when the component first mounts.",
    expected: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    analog_example: `function ShoppingCart() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
}`,
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 9 of 11",
    paal: "Now, build the basic JSX structure for displaying the tasks and a loading/error message. You'll iterate over the `tasks` state to show each item.",
    hint: "Use conditional rendering for `isLoading` and `error`, and `map` over the `tasks` array to display each one.",
    example_code: `      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!isLoading && !error && tasks.length === 0 && (
        <p>No tasks available.</p>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={\`task-item \${task.isPending ? 'pending' : ''}\`}>
              <span>{task.name}</span>
              {/* Dropdown and assign button will go here */}
            </li>
          ))}
        </ul>
      )}`,
    think_prompt: "How would you display a loading message, an error message, a 'no tasks' message, and then a list of tasks, each with its name and a visual indicator for pending optimistic updates?",
    mc_options: [
      "Use `if` statements directly in JSX for conditional rendering and `forEach` for lists.",
      "Use `&&` for conditional rendering, `map` for lists, and apply a class based on `task.isPending`.",
      "Render all elements and hide them with CSS based on state variables.",
    ],
    mc_correct_option: "Use `&&` for conditional rendering, `map` for lists, and apply a class based on `task.isPending`.",
    mc_anchor: "Conditional rendering with `&&` is a concise way to show or hide elements based on boolean state. Mapping over the `tasks` array with `map` is the standard way to render lists in React, ensuring each item has a unique `key`. Adding a `pending` class based on `task.isPending` provides immediate visual feedback for optimistic updates.",
    why_this_matters: "A robust UI provides clear feedback to the user about the application's state. Showing loading indicators, error messages, and empty states prevents confusion. The `isPending` class is crucial for optimistic updates, giving users a visual cue that an action is in progress, even before server confirmation.",
    answer_keywords: ["conditional rendering", "map", "list rendering", "key", "isPending", "JSX structure"],
    seed_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
    </div>
  );
}`,
    starter_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
      {/* Add conditional rendering for loading, error, empty state, and task list here */}
    </div>
  );
}`,
    feedback_correct: "Excellent! Your JSX now correctly handles loading, error, and empty states, and displays tasks with a visual cue for pending updates.",
    feedback_partial: "You've got the conditional rendering and list mapping, but ensure you're applying a `pending` class based on `task.isPending` for optimistic feedback.",
    feedback_wrong: "Remember to use `&&` for conditional rendering and `map` for lists. Also, don't forget to add a `key` prop to list items and a class for pending states.",
    expected: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!isLoading && !error && tasks.length === 0 && (
        <p>No tasks available.</p>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={\`task-item \${task.isPending ? 'pending' : ''}\`}>
              <span>{task.name}</span>
              {/* Dropdown and assign button will go here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    analog_example: `function ItemList({ items, loading, error }: { items: { id: string; name: string; active?: boolean }[], loading: boolean, error: string | null }) {
  if (loading) {
    return <p>Fetching items...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Failed to load items: {error}</p>;
  }

  if (items.length === 0) {
    return <p>No items to display.</p>;
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id} style={{ color: item.active ? 'green' : 'gray' }}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}`,
    deepDiveLabel: "What are the best practices for rendering lists in React?",
    deepDive: {
      hook: `Imagine you have a list of items, perhaps a dozen, or even hundreds. If you just render them without a unique identifier, React struggles to efficiently update the UI when items are added, removed, or reordered. When a list changes, React needs to know *which* specific item has changed, rather than re-rendering the entire list from scratch. Without this crucial piece of information, React's reconciliation algorithm can become inefficient, leading to performance issues, incorrect component state (e.g., an input field losing its value), and unexpected visual glitches. This problem becomes particularly noticeable in dynamic lists where user interactions frequently modify the list's content or order.`,
      pain: `⚠️ **Lesson:** Missing or incorrect \`key\` props in lists lead to inefficient updates and potential UI bugs. Symptom: Slow list rendering, incorrect component state after updates, and console warnings about missing keys.`,
      mentalModel: `**Mental model:** The "Item's Identity Card." Think of the \`key\` prop as a unique identity card for each item in a list. When React renders a list, it uses these identity cards to track each individual item. If an item's identity card (its \`key\`) remains the same, React knows it's the same item, even if its position or other properties change. If an item with a new identity card appears, React knows it's a new item. This allows React to efficiently update only the necessary parts of the DOM, rather than rebuilding the entire list.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use \`map\` to render lists of elements from an array.
- ✅ Always provide a unique and stable \`key\` prop for each list item.
- ✅ The \`key\` should be a string or number.
- ✅ Use a database ID or a globally unique identifier for keys.
- ❌ Never use array index as a \`key\` if the list can change order or size.
- ❌ Don't use non-unique values for keys; they must be unique among siblings.
- ❌ Avoid complex objects or mutable values as keys.`,
      watchOut: `👀 **Watch out:** While using \`index\` as a \`key\` might seem convenient, it's generally an anti-pattern unless your list is static and will never change order, be filtered, or have items added/removed. If the list changes, using \`index\` as a \`key\` can cause React to incorrectly reuse or re-render components, leading to unexpected behavior, performance degradation, and even data corruption in input fields within list items. Always prioritize stable, unique IDs for your keys.`,
      dryRun: `🔁 **Think:** A list of two tasks: \`[{ id: "t1", desc: "Buy milk" }, { id: "t2", desc: "Walk dog" }]\`.
1. The component renders, mapping over the tasks.
2. \`<li>Buy milk</li>\` with \`key="t1"\` is rendered.
3. \`<li>Walk dog</li>\` with \`key="t2"\` is rendered.
4. A new task is added at the beginning: \`[{ id: "t3", desc: "Clean room" }, { id: "t1", desc: "Buy milk" }, { id: "t2", desc: "Walk dog" }]\`.
5. React sees \`key="t3"\` as new, renders a new \`<li>Clean room</li>\`.
6. React sees \`key="t1"\` and \`key="t2"\` still exist, but their positions changed. Because of the stable keys, React efficiently moves the existing DOM elements for "Buy milk" and "Walk dog" rather than re-creating them.
(Hint: Focus on how React uses the \`key\` to identify and reconcile items, not just their content or position.)`,
      build: "**Learning focus:** Implement conditional rendering for loading, error, and empty states, and render a list of tasks with a `pending` class for optimistic updates.",
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 10 of 11",
    paal: "Now, implement the data fetching logic using `useEffect` and define the `handleAssign` function. This function will perform the optimistic update, make the API call, and handle success or rollback on error.",
    hint: "Use `useEffect` to fetch initial data. For `handleAssign`, update state optimistically, then use `try/catch/finally` for the API call and state reconciliation.",
    example_code: `  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setIsLoading(true);
      try {
        // Simulate API calls
        const fetchedTasks: Task[] = [
          { id: 'res-1', name: 'Task A', assigneeId: null },
          { id: 'res-2', name: 'Task B', assigneeId: 'user-2' },
          { id: 'res-3', name: 'Task C', assigneeId: 'user-1' },
        ];
        const fetchedUsers: User[] = [
          { id: 'user-1', name: 'Alice' },
          { id: 'user-2', name: 'Bob' },
          { id: 'user-3', name: 'Charlie' },
        ];
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        setTasks(fetchedTasks);
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to load initial data.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const handleAssign = useCallback(async (taskId: string, newAssigneeId: string | null) => {
    setError(null); // Clear previous errors

    const originalTasks = tasks; // Store current state for rollback

    // Optimistic update: Update UI immediately
    setTasks(prevTasks =>
      prevTasks.map(res =>
        res.id === taskId
          ? { ...res, assigneeId: newAssigneeId, isPending: true }
          : res
      )
    );

    try {
      // Simulate API call to update assignment
      console.log(\`API: Assigning task \${taskId} to \${newAssigneeId || 'unassigned'}\`);
      // Simulate a random API failure for demonstration
      if (Math.random() < 0.3) { // 30% chance of failure
        throw new Error('API assignment failed!');
      }
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

      // API success: Confirm the update (remove isPending)
      setTasks(prevTasks =>
        prevTasks.map(res =>
          res.id === taskId
            ? { ...res, assigneeId: newAssigneeId, isPending: false }
            : res
        )
      );
    } catch (err: any) {
      // API failure: Rollback the UI to original state
      setError(err.message || 'Assignment failed.');
      setTasks(originalTasks); // Rollback
      console.error('Assignment API error:', err);
    }
  }, [tasks]); // Dependency on tasks for rollback`,
    think_prompt: "How would you fetch initial data when the component mounts, and how would you implement an `handleAssign` function that optimistically updates the UI, calls an API, and then either confirms or rolls back the UI state?",
    mc_options: [
      "Fetch data directly in the component body; `handleAssign` updates state after API success.",
      "Use `useEffect` for data fetching; `handleAssign` optimistically updates, then `try/catch` for API and rollback/confirm.",
      "Fetch data in a separate utility; `handleAssign` uses `setTimeout` to simulate optimistic updates.",
    ],
    mc_correct_option: "Use `useEffect` for data fetching; `handleAssign` optimistically updates, then `try/catch` for API and rollback/confirm.",
    mc_anchor: "The `useEffect` hook with an empty dependency array is perfect for fetching initial data once on mount. The `handleAssign` function demonstrates the core optimistic update pattern: immediate UI update, API call within `try/catch`, and then either confirming the `isPending` state or rolling back to the `originalTasks` on error. `useCallback` memoizes `handleAssign` to prevent unnecessary re-renders.",
    why_this_matters: "This step brings together data fetching and the core optimistic update logic. Efficient data fetching ensures your component has the necessary data, while the `handleAssign` function is the heart of the optimistic UI pattern. It provides instant feedback, handles network latency gracefully, and ensures data consistency through rollback mechanisms, significantly improving user experience.",
    answer_keywords: ["useEffect", "data fetching", "handleAssign", "optimistic update", "rollback", "try/catch", "useCallback"],
    seed_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!isLoading && !error && tasks.length === 0 && (
        <p>No tasks available.</p>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={\`task-item \${task.isPending ? 'pending' : ''}\`}>
              <span>{task.name}</span>
              {/* Dropdown and assign button will go here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    starter_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Add useEffect for data fetching and handleAssign function here

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!isLoading && !error && tasks.length === 0 && (
        <p>No tasks available.</p>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={\`task-item \${task.isPending ? 'pending' : ''}\`}>
              <span>{task.name}</span>
              {/* Dropdown and assign button will go here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    feedback_correct: "Fantastic! You've implemented the core logic for data fetching and the optimistic update pattern with rollback. This is the heart of the module!",
    feedback_partial: "You've got the data fetching, but double-check your `handleAssign` for the optimistic update, API call, and the crucial rollback logic on error.",
    feedback_wrong: "Remember, `useEffect` is for side effects like data fetching. For `handleAssign`, the key is to update the UI *before* the API call and handle both success and failure scenarios.",
    expected: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setIsLoading(true);
      try {
        // Simulate API calls
        const fetchedTasks: Task[] = [
          { id: 'res-1', name: 'Task A', assigneeId: null },
          { id: 'res-2', name: 'Task B', assigneeId: 'user-2' },
          { id: 'res-3', name: 'Task C', assigneeId: 'user-1' },
        ];
        const fetchedUsers: User[] = [
          { id: 'user-1', name: 'Alice' },
          { id: 'user-2', name: 'Bob' },
          { id: 'user-3', name: 'Charlie' },
        ];
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        setTasks(fetchedTasks);
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to load initial data.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const handleAssign = useCallback(async (taskId: string, newAssigneeId: string | null) => {
    setError(null); // Clear previous errors

    const originalTasks = tasks; // Store current state for rollback

    // Optimistic update: Update UI immediately
    setTasks(prevTasks =>
      prevTasks.map(res =>
        res.id === taskId
          ? { ...res, assigneeId: newAssigneeId, isPending: true }
          : res
      )
    );

    try {
      // Simulate API call to update assignment
      console.log(\`API: Assigning task \${taskId} to \${newAssigneeId || 'unassigned'}\`);
      // Simulate a random API failure for demonstration
      if (Math.random() < 0.3) { // 30% chance of failure
        throw new Error('API assignment failed!');
      }
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

      // API success: Confirm the update (remove isPending)
      setTasks(prevTasks =>
        prevTasks.map(res =>
          res.id === taskId
            ? { ...res, assigneeId: newAssigneeId, isPending: false }
            : res
        )
      );
    } catch (err: any) {
      // API failure: Rollback the UI to original state
      setError(err.message || 'Assignment failed.');
      setTasks(originalTasks); // Rollback
      console.error('Assignment API error:', err);
    }
  }, [tasks]); // Dependency on tasks for rollback

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!isLoading && !error && tasks.length === 0 && (
        <p>No tasks available.</p>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={\`task-item \${task.isPending ? 'pending' : ''}\`}>
              <span>{task.name}</span>
              {/* Dropdown and assign button will go here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    analog_example: `function LikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLike = useCallback(async () => {
    setError(null);
    setIsLiking(true); // Indicate pending action

    const originalLikes = likes;
    setLikes(prevLikes => prevLikes + 1); // Optimistic update

    try {
      // Simulate API call
      console.log(\`API: Liking post \${postId}\`);
      if (Math.random() < 0.2) throw new Error('Failed to like post!');
      await new Promise(resolve => setTimeout(resolve, 600));

      // API success: No further state change needed for likes, just remove pending
    } catch (err: any) {
      setError(err.message || 'Could not like post.');
      setLikes(originalLikes); // Rollback
    } finally {
      setIsLiking(false);
    }
  }, [likes, postId]);

  return (
    <div>
      <button onClick={handleLike} disabled={isLiking}>
        ❤️ {likes} {isLiking && '(pending)'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}`,
    deepDiveLabel: "What are the common pitfalls of optimistic updates?",
    deepDive: {
      hook: `Optimistic updates promise a faster, more responsive user experience, but they introduce a new layer of complexity. Imagine a scenario where a user rapidly clicks an "assign" button multiple times, or performs several optimistic actions in quick succession. What happens if the first API call succeeds, but the second one fails? How do you ensure the UI correctly reflects the final state, especially if the order of API responses doesn't match the order of user actions? Without careful planning, optimistic updates can lead to race conditions, inconsistent UI states, and a confusing experience for the user when the "optimism" doesn't match reality.`,
      pain: `⚠️ **Lesson:** Unmanaged optimistic updates can lead to race conditions, inconsistent UI, and difficult-to-debug state discrepancies. Symptom: UI "flashing" or reverting unexpectedly, actions appearing to succeed but not persisting, or multiple pending states conflicting.`,
      mentalModel: `**Mental model:** The "Temporary Ledger." Think of optimistic updates as maintaining a temporary ledger of changes in the UI. When an action occurs, you immediately record it in this temporary ledger and update the displayed balance. Simultaneously, you send the actual transaction to the bank (the API). If the bank confirms the transaction, you make it permanent in your ledger. If the bank rejects it, you "undo" the temporary entry, reverting to the last confirmed balance. The challenge is managing multiple temporary entries and ensuring the ledger always reflects the true state once all bank transactions are settled.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Always store the original state before an optimistic update for rollback.
- ✅ Provide clear visual feedback (e.g., a 'pending' spinner or dimmed state) for optimistic changes.
- ✅ Implement robust \`try/catch\` blocks for API calls to handle success and failure paths.
- ✅ On API failure, always roll back the UI to its previous confirmed state.
- ❌ Don't make optimistic updates for critical, irreversible actions without strong user confirmation.
- ❌ Avoid complex optimistic updates that involve cascading changes across many unrelated data points.
- ❌ Never ignore API errors; always provide user feedback and rollback.`,
      watchOut: `👀 **Watch out:** One common pitfall is managing multiple concurrent optimistic updates. If a user performs two optimistic actions on the same item rapidly, and the API responses come back out of order, you might accidentally roll back a successful update with an older, failed state. For complex scenarios, consider using a more sophisticated state management solution (like a global store with transaction IDs) or a library specifically designed for optimistic updates (e.g., React Query, SWR).`,
      dryRun: `🔁 **Think:** Task "Task A" (id: "res-1", assigneeId: "user-1") is displayed. User tries to reassign it to "user-2".
1. \`handleAssign("res-1", "user-2")\` is called.
2. \`originalTasks\` captures the current state (Task A assigned to user-1).
3. \`setTasks\` is called: Task A's \`assigneeId\` becomes "user-2" and \`isPending\` becomes \`true\`.
4. UI re-renders: "Task A assigned to User B (pending)".
5. API call starts.
6. **Scenario A: API succeeds.**
    a. API call resolves.
    b. \`setTasks\` is called: Task A's \`isPending\` becomes \`false\`.
    c. UI re-renders: "Task A assigned to User B".
7. **Scenario B: API fails.**
    a. API call rejects.
    b. \`catch\` block executes. \`setError\` is called.
    c. \`setTasks(originalTasks)\` is called: Task A's \`assigneeId\` reverts to "user-1" and \`isPending\` is removed (as it was not in originalTasks).
    d. UI re-renders: "Task A assigned to User A" and an error message is shown.
(Hint: Trace the \`assigneeId\` and \`isPending\` properties of "Task A" through both success and failure paths.)`,
      build: "**Learning focus:** Implement initial data fetching with `useEffect` and the core `handleAssign` function with optimistic updates and rollback.",
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 11 of 11",
    paal: "Finally, integrate the dropdown selection and the `handleAssign` function into your JSX. Each task item will have a dropdown to select an assignee and display the current assignee's name.",
    hint: "Inside the `map` for tasks, add a `select` element with `onChange` and an option for each user. Display the current assignee's name.",
    example_code: `              <span>{task.name}</span>
              <div className="assignment-controls">
                <select
                  value={task.assigneeId || ''}
                  onChange={(e) => handleAssign(task.id, e.target.value || null)}
                  disabled={task.isPending}
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                {task.assigneeId && (
                  <span className="current-assignee">
                    Assigned to: {users.find(u => u.id === task.assigneeId)?.name || 'Unknown'}
                    {task.isPending && ' (pending)'}
                  </span>
                )}
                {!task.assigneeId && (
                  <span className="current-assignee">Unassigned</span>
                )}
              </div>`,
    think_prompt: "How would you add a dropdown to each task item that allows selecting an assignee, displays the current assignee, and is disabled during an optimistic update?",
    mc_options: [
      "Use an `input` field for selection and update state on button click.",
      "Use a `select` element, bind its `value` to `task.assigneeId`, call `handleAssign` on `onChange`, and disable it if `isPending`.",
      "Display a list of users, and clicking a user assigns them to the task.",
    ],
    mc_correct_option: "Use a `select` element, bind its `value` to `task.assigneeId`, call `handleAssign` on `onChange`, and disable it if `isPending`.",
    mc_anchor: "A controlled `select` element, whose `value` is bound to `task.assigneeId`, is the correct pattern. The `onChange` event triggers `handleAssign`, passing the task ID and the new assignee ID. Crucially, disabling the `select` when `task.isPending` prevents further user interaction during an ongoing optimistic update, avoiding race conditions and ensuring a smooth experience.",
    why_this_matters: "Wiring the UI to your state and handlers is the final step in making your component interactive. This step demonstrates how to create a controlled dropdown, display dynamic data, and integrate the optimistic update logic directly into the user's interaction flow. Disabling the UI during pending operations is a key best practice for optimistic updates, preventing users from making conflicting changes.",
    answer_keywords: ["controlled component", "select", "onChange", "handleAssign", "disabled", "isPending", "JSX wiring"],
    seed_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setIsLoading(true);
      try {
        // Simulate API calls
        const fetchedTasks: Task[] = [
          { id: 'res-1', name: 'Task A', assigneeId: null },
          { id: 'res-2', name: 'Task B', assigneeId: 'user-2' },
          { id: 'res-3', name: 'Task C', assigneeId: 'user-1' },
        ];
        const fetchedUsers: User[] = [
          { id: 'user-1', name: 'Alice' },
          { id: 'user-2', name: 'Bob' },
          { id: 'user-3', name: 'Charlie' },
        ];
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        setTasks(fetchedTasks);
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to load initial data.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const handleAssign = useCallback(async (taskId: string, newAssigneeId: string | null) => {
    setError(null); // Clear previous errors

    const originalTasks = tasks; // Store current state for rollback

    // Optimistic update: Update UI immediately
    setTasks(prevTasks =>
      prevTasks.map(res =>
        res.id === taskId
          ? { ...res, assigneeId: newAssigneeId, isPending: true }
          : res
      )
    );

    try {
      // Simulate API call to update assignment
      console.log(\`API: Assigning task \${taskId} to \${newAssigneeId || 'unassigned'}\`);
      // Simulate a random API failure for demonstration
      if (Math.random() < 0.3) { // 30% chance of failure
        throw new Error('API assignment failed!');
      }
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

      // API success: Confirm the update (remove isPending)
      setTasks(prevTasks =>
        prevTasks.map(res =>
          res.id === taskId
            ? { ...res, assigneeId: newAssigneeId, isPending: false }
            : res
        )
      );
    } catch (err: any) {
      // API failure: Rollback the UI to original state
      setError(err.message || 'Assignment failed.');
      setTasks(originalTasks); // Rollback
      console.error('Assignment API error:', err);
    }
  }, [tasks]); // Dependency on tasks for rollback

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!isLoading && !error && tasks.length === 0 && (
        <p>No tasks available.</p>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={\`task-item \${task.isPending ? 'pending' : ''}\`}>
              <span>{task.name}</span>
              {/* Dropdown and assign button will go here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    starter_code: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setIsLoading(true);
      try {
        // Simulate API calls
        const fetchedTasks: Task[] = [
          { id: 'res-1', name: 'Task A', assigneeId: null },
          { id: 'res-2', name: 'Task B', assigneeId: 'user-2' },
          { id: 'res-3', name: 'Task C', assigneeId: 'user-1' },
        ];
        const fetchedUsers: User[] = [
          { id: 'user-1', name: 'Alice' },
          { id: 'user-2', name: 'Bob' },
          { id: 'user-3', name: 'Charlie' },
        ];
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        setTasks(fetchedTasks);
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to load initial data.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const handleAssign = useCallback(async (taskId: string, newAssigneeId: string | null) => {
    setError(null); // Clear previous errors

    const originalTasks = tasks; // Store current state for rollback

    // Optimistic update: Update UI immediately
    setTasks(prevTasks =>
      prevTasks.map(res =>
        res.id === taskId
          ? { ...res, assigneeId: newAssigneeId, isPending: true }
          : res
      )
    );

    try {
      // Simulate API call to update assignment
      console.log(\`API: Assigning task \${taskId} to \${newAssigneeId || 'unassigned'}\`);
      // Simulate a random API failure for demonstration
      if (Math.random() < 0.3) { // 30% chance of failure
        throw new Error('API assignment failed!');
      }
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

      // API success: Confirm the update (remove isPending)
      setTasks(prevTasks =>
        prevTasks.map(res =>
          res.id === taskId
            ? { ...res, assigneeId: newAssigneeId, isPending: false }
            : res
        )
      );
    } catch (err: any) {
      // API failure: Rollback the UI to original state
      setError(err.message || 'Assignment failed.');
      setTasks(originalTasks); // Rollback
      console.error('Assignment API error:', err);
    }
  }, [tasks]); // Dependency on tasks for rollback

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!isLoading && !error && tasks.length === 0 && (
        <p>No tasks available.</p>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={\`task-item \${task.isPending ? 'pending' : ''}\`}>
              <span>{task.name}</span>
              {/* Add dropdown and current assignee display here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    feedback_correct: "You've successfully wired up the UI! The dropdown now controls assignments with optimistic updates and provides clear feedback.",
    feedback_partial: "You've added the dropdown, but ensure it's a controlled component, calls `handleAssign` correctly, and is disabled when `isPending`.",
    feedback_wrong: "Remember to use a `select` element for dropdowns, bind its `value` to state, and use `onChange` to trigger your assignment logic. Don't forget to disable it during pending operations.",
    expected: `import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  assigneeId: string | null;
  isPending?: boolean; // For optimistic updates
}

function TaskAssignmentPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setIsLoading(true);
      try {
        // Simulate API calls
        const fetchedTasks: Task[] = [
          { id: 'res-1', name: 'Task A', assigneeId: null },
          { id: 'res-2', name: 'Task B', assigneeId: 'user-2' },
          { id: 'res-3', name: 'Task C', assigneeId: 'user-1' },
        ];
        const fetchedUsers: User[] = [
          { id: 'user-1', name: 'Alice' },
          { id: 'user-2', name: 'Bob' },
          { id: 'user-3', name: 'Charlie' },
        ];
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        setTasks(fetchedTasks);
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to load initial data.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const handleAssign = useCallback(async (taskId: string, newAssigneeId: string | null) => {
    setError(null); // Clear previous errors

    const originalTasks = tasks; // Store current state for rollback

    // Optimistic update: Update UI immediately
    setTasks(prevTasks =>
      prevTasks.map(res =>
        res.id === taskId
          ? { ...res, assigneeId: newAssigneeId, isPending: true }
          : res
      )
    );

    try {
      // Simulate API call to update assignment
      console.log(\`API: Assigning task \${taskId} to \${newAssigneeId || 'unassigned'}\`);
      // Simulate a random API failure for demonstration
      if (Math.random() < 0.3) { // 30% chance of failure
        throw new Error('API assignment failed!');
      }
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

      // API success: Confirm the update (remove isPending)
      setTasks(prevTasks =>
        prevTasks.map(res =>
          res.id === taskId
            ? { ...res, assigneeId: newAssigneeId, isPending: false }
            : res
        )
      );
    } catch (err: any) {
      // API failure: Rollback the UI to original state
      setError(err.message || 'Assignment failed.');
      setTasks(originalTasks); // Rollback
      console.error('Assignment API error:', err);
    }
  }, [tasks]); // Dependency on tasks for rollback

  return (
    <div className="task-assignment-panel">
      <h2>Task Assignments</h2>
      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="error">Error: {error}</p>}

      {!isLoading && !error && tasks.length === 0 && (
        <p>No tasks available.</p>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={\`task-item \${task.isPending ? 'pending' : ''}\`}>
              <span>{task.name}</span>
              <div className="assignment-controls">
                <select
                  value={task.assigneeId || ''}
                  onChange={(e) => handleAssign(task.id, e.target.value || null)}
                  disabled={task.isPending}
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                {task.assigneeId && (
                  <span className="current-assignee">
                    Assigned to: {users.find(u => u.id === task.assigneeId)?.name || 'Unknown'}
                    {task.isPending && ' (pending)'}
                  </span>
                )}
                {!task.assigneeId && (
                  <span className="current-assignee">Unassigned</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
    analog_example: `function SettingsToggle({ settingKey, initialValue }: { settingKey: string; initialValue: boolean }) {
  const [isEnabled, setIsEnabled] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = useCallback(async () => {
    setError(null);
    setIsUpdating(true);

    const originalValue = isEnabled;
    setIsEnabled(prev => !prev); // Optimistic update

    try {
      // Simulate API call to update setting
      console.log(\`API: Toggling \${settingKey} to \${!originalValue}\`);
      if (Math.random() < 0.2) throw new Error('Failed to update setting!');
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err: any) {
      setError(err.message || 'Update failed.');
      setIsEnabled(originalValue); // Rollback
    } finally {
      setIsUpdating(false);
    }
  }, [isEnabled, settingKey]);

  return (
    <div>
      <label>
        {settingKey}:
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={handleToggle}
          disabled={isUpdating}
        />
        {isUpdating && ' (updating...)'}
      </label>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}`,
    deepDiveLabel: "What are 'controlled components' and why are they important?",
    deepDive: {
      hook: `Imagine building a form with several input fields, dropdowns, or checkboxes. If you let each input manage its own state internally (an "uncontrolled component"), retrieving the form's data when the user clicks "submit" becomes a challenge. You'd have to manually query the DOM for each input's current value. Furthermore, if you want to programmatically set an input's value, validate it in real-time, or disable it based on other form data, it becomes incredibly difficult to synchronize the UI with your application's logic. This can lead to inconsistent data, complex event handling, and a brittle form experience.`,
      pain: `⚠️ **Lesson:** Uncontrolled form inputs lead to difficulty in data retrieval, real-time validation, and programmatic control. Symptom: Manual DOM queries for form values, complex event listeners, and inconsistent UI behavior.`,
      mentalModel: `**Mental model:** The "Puppeteer and Puppet." Think of a controlled component as a puppet (the input field) whose every movement (its value) is dictated by a puppeteer (your React state). The puppeteer holds the strings (the \`value\` prop) and listens for the puppet's signals (the \`onChange\` event). When the puppet signals a change, the puppeteer updates its own state, and then, in turn, pulls the strings to update the puppet's display. This ensures that your React state is always the single source of truth for the input's value.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Always bind an input's \`value\` prop to a piece of React state.
- ✅ Always provide an \`onChange\` handler that updates the bound state.
- ✅ Use controlled components for all form inputs (text, select, checkbox, radio).
- ✅ Initialize controlled components with appropriate default values from state.
- ❌ Never let an input manage its own state if you need to access or modify its value programmatically.
- ❌ Don't forget to provide both \`value\` and \`onChange\` for controlled inputs.
- ❌ Avoid directly manipulating the DOM to get or set input values in React.`,
      watchOut: `👀 **Watch out:** When using a controlled \`select\` element, the \`value\` prop on the \`<select>\` tag determines which \`<option>\` is selected. The \`value\` prop on the \`<option>\` tags should match the values you expect to receive. If your \`select\`'s \`value\` is \`null\` or \`undefined\`, and you don't have an \`<option value="">\` (or similar empty string option), React will treat it as an uncontrolled component and issue a warning. Always ensure your controlled \`select\` has a matching option for its current value, or a default empty option.`,
      dryRun: `🔁 **Think:** A \`NameInput\` component is rendered.
1. \`useState('')\` initializes \`name\` to an empty string.
2. The input renders with an empty value: \`<input value="" />\`.
3. The user types "A" into the input.
4. The \`onChange\` handler is called. \`event.target.value\` is "A".
5. \`setName("A")\` is called.
6. The component re-renders.
7. The input now renders with \`value="A"\`: \`<input value="A" />\`.
8. The user types "B".
9. The \`onChange\` handler is called. \`event.target.value\` is "AB".
10. \`setName("AB")\` is called.
11. The component re-renders.
12. The input now renders with \`value="AB"\`: \`<input value="AB" />\`.
(Hint: Trace how the \`name\` state variable directly dictates the input's displayed value.)`,
      build: "**Learning focus:** Integrate a controlled `select` dropdown for assignee selection and display current assignee information, including pending status.",
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Imports", id: "step1" },
  { label: "Step 2: User Type", id: "step2" },
  { label: "Step 3: Task Type", id: "step2b" },
  { label: "Step 4: Component Shell", id: "step3" },
  { label: "Step 5: Tasks State", id: "step4" },
  { label: "Step 6: Users State", id: "step4b" },
  { label: "Step 7: Error State", id: "step4c" },
  { label: "Step 8: Loading State", id: "step4d" },
  { label: "Step 9: Structure Skeleton", id: "step5" },
  { label: "Step 10: Handlers & Logic", id: "step6" },
  { label: "Step 11: Wire Handlers", id: "step7" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Optimistic Assignee Selection UI",
  shortName: "Optimistic Assign",
});
