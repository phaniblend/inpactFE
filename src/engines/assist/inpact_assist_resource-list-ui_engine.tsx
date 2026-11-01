import createINPACTEngine from "../inpact_engine_shared";
import { useState, useEffect } from 'react'; // Assuming this specific import pattern is allowed as it's not explicitly banned.

// Module-scope types
type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "resource-list-ui",
      title: "Building a Dynamic Resource List UI",
      body: `
        • A list screen has to handle three states: loading (fetching), empty (nothing to show), and populated (real rows).
        • You might have noticed that in Gmail, your inbox shows a spinner while messages load, and a friendly empty state when you've got zero unread mail.
        • Same idea here: fetch the data, show a loading state until it arrives, then render real rows — or the empty message if there aren't any.
      `,
      usecase: "A dashboard component that displays a list of recent system events, allowing users to filter by event type (e.g., 'Error', 'Warning', 'Info') and showing a loading spinner while new events are fetched.",
      designMock: {"kind":"list-and-form","screenTitle":"Resource List","caption":"View and filter a list of available resources.","listCaption":"Available Resources","emptyCaption":"No Resources","emptyMessage":"No resources match your current filters. Try adjusting them.","rows":[{"title":"API Reference","subtitle":"Detailed guide for integration.","meta":"Status: Active"},{"title":"Getting Started Guide","subtitle":"Quick introduction for new users.","meta":"Status: Draft"}],"fields":[{"label":"Filter by Status","sample":"Active"}],"submitLabel":"Apply Filters"}
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Understand how to fetch data from an API when a component mounts.",
      "Learn to manage loading, error, and empty states for a list.",
      "Implement a controlled dropdown for filtering list items.",
      "Dynamically render a list of items based on fetched data and filters.",
    ],
  },
  {
    id: "prereq-fundamentals",
    type: "funda-gate",
    phase: "Prerequisites",
    fundas: [
      {
        name: "React hooks (useState / useEffect)",
        blurb: "Fetching on mount and tracking loading/empty/error state — the whole point of this lesson — is built entirely on these two hooks.",
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
        name: "Array methods (map / forEach)",
        blurb: "Turning the fetched list into rendered rows uses .map() — used directly in the rendering step of this lesson.",
        videoUrl: "https://www.youtube.com/watch?v=A2spRrsRl3Y",
        quiz: {
          question: "Which of these returns a brand-new array instead of just running code per item?",
          options: ["forEach", "map", "Both return a new array"],
          correctIndex: 1,
        },
      },
    ],
  },
  {
    id: "step1_imports_types",
    type: "question",
    phase: "Step 1 of 7",
    paal: "To begin, we need to set up our component's environment. This involves importing necessary hooks for state management and side effects, and defining the data types we'll be working with. These types ensure our code is robust and predictable.",
    hint: "Think about which hooks are essential for managing state and performing actions like data fetching in a functional component. Also, define the structure for a single resource item and the possible filter values.",
    example_code: `
type Item = {
  id: string;
  name: string;
  category: 'A' | 'B';
};

function MyComponent() {
  const [data, setData] = useState<Item[]>([]);
  // ...
}
    `,
    think_prompt: "Which hooks do you need for state and effects, and what types define a resource and its filter status?",
    mc_options: [
      "import { useEffect } from 'react'; type Resource = { name: string; }; type Filter = 'all' | 'active';",
      "import { useState, useEffect } from 'react'; type Resource = { id: string; title: string; status: 'active' | 'draft'; }; type FilterStatus = 'all' | 'active' | 'draft';",
      "import { useRef } from 'react'; type Resource = { id: number; label: string; }; type Status = 'open' | 'closed';",
    ],
    mc_correct_option: "import { useState, useEffect } from 'react'; type Resource = { id: string; title: string; status: 'active' | 'draft' | 'archived'; createdAt: string; }; type FilterStatus = 'all' | 'active' | 'draft' | 'archived';",
    mc_anchor: "import-and-types",
    why_this_matters: "Defining types upfront provides clarity and enables TypeScript to catch errors early, improving code quality and maintainability. Importing `useState` and `useEffect` are foundational for building dynamic, interactive components that manage their own state and interact with external systems.",
    answer_keywords: ["useState", "useEffect", "type definition", "Resource", "FilterStatus"],
    seed_code: ``,
    starter_code: `
// Add your imports and type definitions here
    `,
    feedback_correct: "Excellent! Importing `useState` and `useEffect` is crucial for managing component state and side effects, and defining `Resource` and `FilterStatus` types provides strong typing for our data.",
    feedback_partial: "You're on the right track with some imports or types, but ensure you have both `useState` and `useEffect` imported, and that your `Resource` and `FilterStatus` types are fully defined with all necessary properties and literal values.",
    feedback_wrong: "Review the fundamental hooks for state and side effects in functional components. Also, ensure your type definitions are comprehensive, including all expected properties and specific string literal unions for statuses.",
    expected: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';`,
    analog_example: `
// For a simple counter component
import { useState } from 'react';

type CounterState = {
  value: number;
  max: number;
};

function SimpleCounter() {
  const [count, setCount] = useState<CounterState>({ value: 0, max: 10 });
  // ...
}
    `,
    deepDiveLabel: "Why are types and hooks so important?",
    deepDive: {
      hook: `
        Imagine you're building a complex machine, but you don't have a blueprint or a clear list of parts. You'd constantly be guessing which piece fits where, what it's supposed to do, and how it interacts with other parts. This is similar to writing JavaScript without types or understanding fundamental hooks. You might get something working, but it's fragile, hard to debug, and a nightmare to extend or collaborate on. Without a clear structure for your data (types) and predictable ways to manage dynamic behavior (hooks), your application becomes a tangled mess of assumptions and potential runtime errors. You'll spend more time fixing unexpected bugs than building new features, and every change feels like walking through a minefield.
      `,
      pain: `
        ⚠️ **Lesson:** Without explicit type definitions, JavaScript code can be prone to runtime errors due to unexpected data shapes, making refactoring and collaboration difficult. Similarly, without understanding core hooks like \`useState\` and \`useEffect\`, managing component lifecycle and reactive data becomes convoluted, leading to inefficient updates and unpredictable UI behavior. Symptom: Frequent \`undefined is not a function\` or \`cannot read property 'x' of undefined\` errors, components that don't update correctly, or side effects that run too often or not at all.
      `,
      mentalModel: `
        **Mental model:** The Component's Blueprint and Life Support System. Think of types as the blueprint for your data – they define the exact shape and properties of every piece of information your component handles, preventing miscommunications. Hooks, on the other hand, are the component's life support system. \`useState\` provides the component's memory, allowing it to remember things that change over time (like user input or fetched data). \`useEffect\` gives the component the ability to perform actions that interact with the outside world (like fetching data from an API or setting up event listeners) and clean up after itself, ensuring it behaves correctly throughout its existence.
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `
        **Quick rules:**
        - ✅ Always define types for complex data structures and props to improve readability and catch errors.
        - ✅ Use \`useState\` for any data that changes over time and should trigger a re-render.
        - ✅ Use \`useEffect\` for operations that interact with the outside world or need to run after render.
        - ✅ Be specific with union types (e.g., \`'active' | 'draft'\`) to constrain possible values.
        - ❌ Never forget to import hooks you intend to use.
        - ❌ Don't use \`any\` as a type unless absolutely necessary; it defeats the purpose of TypeScript.
        - ❌ Avoid defining types that are too generic or too specific, find a balance for reusability.
      `,
      watchOut: `
        👀 **Watch out:** While \`useState\` and \`useEffect\` are powerful, misusing them can lead to problems. Forgetting to include dependencies in \`useEffect\` can cause stale closures or infinite loops. Over-using \`useState\` for every small piece of data can make components harder to reason about. Always consider if a piece of data truly needs to be state, or if it can be derived from props or other state.
      `,
      dryRun: `
        🔁 **Think:** If we define \`type Resource = { id: string; name: string; };\` and then try to access \`resource.title\` in our component, TypeScript will immediately flag an error because \`title\` is not part of the \`Resource\` type. If we then change the type to include \`title\`, the error disappears. This demonstrates how types act as a compile-time check, preventing potential runtime crashes. (Hint: The type system validates your code before it even runs.)
      `,
      build: `**Learning focus:** Set up the foundational imports and type definitions required for our dynamic resource list component.`,
    },
  },
  {
    id: "step2_component_shell",
    type: "question",
    phase: "Step 2 of 7",
    paal: "Now that we have our types and imports, let's create the basic functional component shell. This will be the container for all our logic and UI elements.",
    hint: "Define a simple functional component that returns some basic JSX, like a `div` with a title.",
    example_code: `
function MyCard() {
  return (
    <div>
      <h3>My Card</h3>
    </div>
  );
}
    `,
    think_prompt: "How do you define a functional component named `ResourceList` that returns a root `div`?",
    mc_options: [
      "const ResourceList = () => { return <div>Resource List</div>; };",
      "function ResourceList() { return <div>Resource List</div>; }",
      "class ResourceList extends Component { render() { return <div>Resource List</div>; } }",
    ],
    mc_correct_option: "function ResourceList() { return <div>Resource List</div>; }",
    mc_anchor: "component-shell",
    why_this_matters: "The component shell is the entry point for our UI. Defining it correctly as a functional component is the standard practice in modern applications, providing a clear structure for state, effects, and rendering logic.",
    answer_keywords: ["functional component", "JSX", "return statement"],
    seed_code: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';`,
    starter_code: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

// Add your component shell here
`,
    feedback_correct: "Perfect! A functional component `ResourceList` is the correct way to start, returning a root `div` to contain our UI.",
    feedback_partial: "You've defined a component, but ensure it's a standard functional component declaration, not an arrow function or a class component, and returns a simple `div`.",
    feedback_wrong: "Remember that modern applications primarily use functional components. Review how to declare a basic functional component that returns JSX.",
    expected: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  return (
    <div>
      <h2>Resource List</h2>
    </div>
  );
}`,
    analog_example: `
// A simple button component
function ActionButton() {
  return (
    <button>Click Me</button>
  );
}
    `,
    deepDiveLabel: "Why functional components?",
    deepDive: {
      hook: `
        For years, building interactive UIs often meant dealing with complex class components, where \`this\` context was a constant source of confusion, and logic was spread across various lifecycle methods. Imagine trying to understand a component's behavior when its data fetching, event handling, and cleanup logic are scattered across \`componentDidMount\`, \`componentDidUpdate\`, and \`componentWillUnmount\`. It felt like solving a puzzle every time you looked at a component, especially for beginners. This complexity often led to bugs, made code harder to read, and slowed down development.
      `,
      pain: `
        ⚠️ **Lesson:** Relying on older class component patterns can lead to verbose code, confusing \`this\` context, and scattered logic across multiple lifecycle methods, making components harder to understand, test, and maintain. Symptom: Difficulty in reusing stateful logic, boilerplate code for simple interactions, and a steep learning curve for new developers.
      `,
      mentalModel: `
        **Mental model:** The Pure Function with Superpowers. Think of a functional component as a mathematical function: it takes inputs (props) and reliably produces an output (JSX). It's inherently simpler and easier to reason about because it doesn't have its own internal instance or complex lifecycle. Hooks are the "superpowers" that allow these pure functions to manage state, perform side effects, and tap into the component's lifecycle *without* becoming a class. This keeps the component's core logic focused on rendering, while hooks handle the dynamic behavior in a modular way.
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `
        **Quick rules:**
        - ✅ Use functional components for all new components.
        - ✅ Components should always return JSX.
        - ✅ Keep components focused on a single responsibility.
        - ✅ Use props to pass data down from parent components.
        - ❌ Avoid class components unless you're working with legacy code.
        - ❌ Don't put complex business logic directly in the render return.
        - ❌ Never modify props directly within a component.
      `,
      watchOut: `
        👀 **Watch out:** While functional components are simpler, it's easy to accidentally introduce performance issues if you create new functions or objects on every render without memoization (using \`useCallback\` or \`useMemo\`). For beginners, focus on correctness first, but be aware that these tools exist for optimization later.
      `,
      dryRun: `
        🔁 **Think:** When the \`ResourceList\` component is rendered, its function body executes. It encounters the \`return\` statement and immediately produces the JSX structure: \`<div><h2>Resource List</h2></div>\`. This JSX is then translated into actual DOM elements by the rendering engine. If the component were to receive props, those props would be available as arguments to the function, influencing the returned JSX. (Hint: The function is called, and its return value dictates the UI.)
      `,
      build: `**Learning focus:** Create the foundational functional component structure for our resource list.`,
    },
  },
  {
    id: "step3_state_variables",
    type: "question",
    phase: "Step 3 of 7",
    paal: "Our list needs to manage several pieces of dynamic information: the actual resources, whether data is currently loading, if an error occurred, and the user's selected filter status. We'll use `useState` for each of these.",
    hint: "Declare state variables for `resources` (an array of `Resource`), `loading` (boolean), `error` (string or null), and `filterStatus` (of type `FilterStatus`), providing appropriate initial values.",
    example_code: `
function Counter() {
  const [count, setCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  // ...
}
    `,
    think_prompt: "What `useState` declarations are needed for `resources`, `loading`, `error`, and `filterStatus`?",
    mc_options: [
      "const [resources, setResources] = useState([]); const [loading, setLoading] = useState(false); const [error, setError] = useState(null); const [filterStatus, setFilterStatus] = useState('all');",
      "let resources = []; let loading = false; let error = null; let filterStatus = 'all';",
      "const [data, setData] = useState<Resource[]>([]); const [isLoading, setIsLoading] = useState(true); const [errorMessage, setErrorMessage] = useState<string | null>(null); const [currentFilter, setCurrentFilter] = useState<FilterStatus>('active');",
    ],
    mc_correct_option: "const [resources, setResources] = useState<Resource[]>([]); const [loading, setLoading] = useState<boolean>(false); const [error, setError] = useState<string | null>(null); const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');",
    mc_anchor: "state-variables",
    why_this_matters: "State variables are the memory of our component. They allow the UI to react to changes in data, user input, and asynchronous operations like API calls. Proper initialization ensures our component starts in a predictable and safe state.",
    answer_keywords: ["useState", "state initialization", "resources", "loading", "error", "filterStatus"],
    seed_code: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  return (
    <div>
      <h2>Resource List</h2>
    </div>
  );
}`,
    starter_code: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  // Add your state variables here

  return (
    <div>
      <h2>Resource List</h2>
    </div>
  );
}`,
    feedback_correct: "Spot on! You've correctly declared and initialized all the necessary state variables, including their types, which is crucial for a robust list component.",
    feedback_partial: "You've declared some state variables, but ensure you have all four (`resources`, `loading`, `error`, `filterStatus`) with their correct types and initial values. Pay attention to the type for `error` and `filterStatus`.",
    feedback_wrong: "Remember that `useState` is a hook that returns a pair: the current state value and a function to update it. Ensure you're using `useState` for all dynamic data and providing appropriate initial values and types.",
    expected: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  return (
    <div>
      <h2>Resource List</h2>
    </div>
  );
}`,
    analog_example: `
// For a form input
import { useState } from 'react';

function TextInput() {
  const [inputValue, setInputValue] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
}
    `,
    deepDiveLabel: "How does `useState` work?",
    deepDive: {
      hook: `
        Imagine you have a simple counter on a webpage. Every time you click a button, the number goes up. How does the webpage "remember" the current number? If you just used a regular JavaScript variable, it would reset to zero every time the component re-rendered, making your counter useless. This is the core problem \`useState\` solves. Without it, any dynamic interaction, from toggling a menu to displaying fetched data, would be impossible to maintain across renders, leading to static, unresponsive user interfaces.
      `,
      pain: `
        ⚠️ **Lesson:** Without a mechanism to persist and update values across component re-renders, any dynamic data or user interaction would be lost, resulting in static UIs that cannot respond to user input or external changes. Symptom: Variables resetting to initial values, UI not updating when data changes, or complex workarounds involving global variables or direct DOM manipulation.
      `,
      mentalModel: `
        **Mental model:** The Component's Short-Term Memory. Think of \`useState\` as giving your functional component a small, dedicated notepad. When your component first renders, it writes an initial value on the notepad. When you want to change that value, you don't erase it directly; instead, you use a special "setter" function (like \`setResources\`) which tells the component, "Hey, this value on the notepad has changed, and you need to re-read it and update your display." The component then re-renders, sees the new value on the notepad, and updates the UI accordingly, preserving the state across renders.
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `
        **Quick rules:**
        - ✅ Always use \`useState\` for data that changes and affects the UI.
        - ✅ Provide a meaningful initial value that matches the state's type.
        - ✅ Use the setter function (\`setX\`) to update state; never modify state variables directly.
        - ✅ Declare state variables at the top level of your functional component.
        - ❌ Don't call \`useState\` inside loops, conditionals, or nested functions.
        - ❌ Avoid putting complex objects directly into state if only a small part changes frequently.
        - ❌ Never modify the state object directly; always create a new object/array for updates.
      `,
      watchOut: `
        👀 **Watch out:** When updating state based on the *previous* state (e.g., incrementing a counter), always use the functional update form: \`setCount(prevCount => prevCount + 1)\`. This prevents issues with stale closures if updates are batched or happen rapidly. Also, remember that state updates are asynchronous, meaning the state value might not be immediately updated after calling the setter function.
      `,
      dryRun: `
        🔁 **Think:**
        1.  Initial render: \`loading\` is \`false\`. The UI shows "Not Loading".
        2.  User clicks "Fetch Data": A handler calls \`setLoading(true)\`.
        3.  Component re-renders: \`loading\` is now \`true\`. The UI shows "Loading...".
        4.  Data fetch completes: The handler calls \`setLoading(false)\`.
        5.  Component re-renders: \`loading\` is now \`false\`. The UI shows "Not Loading" again, but now with data.
        (Hint: Each call to a setter function triggers a re-render with the new state value.)
      `,
      build: `**Learning focus:** Implement state variables to manage the dynamic data, loading status, error messages, and filter selection for the resource list.`,
    },
  },
  {
    id: "step4_structure_skeleton",
    type: "question",
    phase: "Step 4 of 7",
    paal: "With our state variables ready, let's build the basic JSX structure for our component. This includes a title, a filter dropdown, and placeholders for our loading, error, empty, and resource list displays.",
    hint: "Add a `select` element for filtering, and `div`s with conditional comments for loading, error, empty, and the actual list. Don't wire up state or handlers yet.",
    example_code: `
function ProductDisplay() {
  return (
    <div>
      <h3>Products</h3>
      <select>
        <option value="all">All</option>
      </select>
      {/* Product List */}
      {/* Loading State */}
    </div>
  );
}
    `,
    think_prompt: "How do you structure the JSX with a filter dropdown and placeholders for different display states?",
    mc_options: [
      `<div><h2>Resource List</h2><select><option value="all">All</option></select>{/* Loading */} {/* Error */} {/* Empty */} {/* Resources */}</div>`,
      `<div><h2>Resource List</h2><input type="text" placeholder="Filter..." />{/* List */}</div>`,
      `<div><h2>Resource List</h2><select><option value="all">All</option><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></select>{/* Conditional rendering for loading, error, empty, and resource list */}</div>`,
    ],
    mc_correct_option: `<div><h2>Resource List</h2><label htmlFor="status-filter">Filter by Status:</label><select id="status-filter"><option value="all">All</option><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></select>{/* Conditional rendering for loading, error, empty, and resource list */}</div>`,
    mc_anchor: "structure-skeleton",
    why_this_matters: "A clear structural skeleton helps visualize the component's layout and ensures all necessary UI elements have a place. Using comments for conditional areas makes it easy to integrate the dynamic logic in later steps.",
    answer_keywords: ["JSX structure", "select dropdown", "option", "conditional comments"],
    seed_code: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  return (
    <div>
      <h2>Resource List</h2>
    </div>
  );
}`,
    starter_code: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  return (
    <div>
      <h2>Resource List</h2>
      {/* Add filter dropdown and conditional rendering placeholders here */}
    </div>
  );
}`,
    feedback_correct: "Great job! You've laid out the essential UI elements, including the filter dropdown and clear placeholders for our dynamic content. This sets us up perfectly for the next steps.",
    feedback_partial: "You have the main structure, but ensure you include all filter options in the `select` dropdown and distinct comments for loading, error, empty, and the resource list itself.",
    feedback_wrong: "Remember to include a `select` element with `option` tags for each filter status. Also, use JSX comments (`{/* ... */}`) to mark where the different conditional UI states will go.",
    expected: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  return (
    <div>
      <h2>Resource List</h2>
      <label htmlFor="status-filter">Filter by Status:</label>
      <select id="status-filter">
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>

      {/* Conditional rendering for loading, error, empty, and resource list */}
    </div>
  );
}`,
    analog_example: `
// For a user profile card
function UserProfile() {
  return (
    <div className="user-card">
      <img src="/placeholder.png" alt="User Avatar" />
      <h3>{/* User Name */}</h3>
      <p>{/* User Bio */}</p>
      <button>{/* Edit Profile Button */}</button>
    </div>
  );
}
    `,
    deepDiveLabel: "How do we plan UI layout with JSX?",
    deepDive: {
      hook: `
        Imagine trying to build a house without a floor plan. You'd just start putting up walls and rooms, hoping they connect correctly. The result would be chaotic, inefficient, and likely unstable. Similarly, when building a UI, jumping straight into complex logic without first sketching out the basic structure in JSX can lead to a disorganized component that's hard to read, debug, and expand. You might find yourself constantly refactoring, moving elements around, and struggling to visualize the final output.
      `,
      pain: `
        ⚠️ **Lesson:** Without a well-defined JSX structure, components become visually disorganized, difficult to reason about, and prone to layout issues. Integrating dynamic content and conditional rendering becomes a challenge when there's no clear "slot" for each piece of information. Symptom: Messy, unreadable render functions, unexpected UI overlaps, and difficulty in applying styling or responsive design.
      `,
      mentalModel: `
        **Mental model:** The UI Blueprint. Think of the JSX skeleton as the architectural blueprint for your component's user interface. It defines the main sections, their hierarchy, and where dynamic content or interactive elements will eventually reside. By starting with static placeholders and comments, you're creating clear "slots" for future logic. This allows you to focus on the visual layout and accessibility first, ensuring a solid foundation before you introduce the complexities of state and data. It's like drawing the wireframe of your UI directly in code.
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", \`<label>\`, and \`<select>\` provides meaning to the structure and improves accessibility.
        -   **\`id\` and \`htmlFor\`**: Linking labels to their input elements with \`id\` and \`htmlFor\` is crucial for accessibility.
        -   **\`select\` and \`option\`**: These elements create a standard dropdown menu, allowing users to choose from predefined options.
        -   **JSX Comments (\`{/* ... */}\`)**: These are used to mark sections where dynamic content or conditional rendering logic will be inserted later, keeping the structure clean.
      `,
      quickRules: `
        **Quick rules:**
        - ✅ Start with the highest-level container and progressively add nested elements.
        - ✅ Use semantic HTML elements where appropriate (e.g., \`h1\` for titles, \`label\` for inputs).
        - ✅ Use comments to clearly mark sections for future dynamic content.
        - ✅ Ensure accessibility by linking labels to their inputs (e.g., \`htmlFor\` and \`id\`).
        - ❌ Don't prematurely optimize or add complex logic before the basic structure is solid.
        - ❌ Avoid deeply nested \`div\`s without clear purpose; prefer semantic elements.
        - ❌ Never leave unclosed tags or invalid HTML structure in JSX.
      `,
      watchOut: `
        👀 **Watch out:** While comments are helpful, don't rely on them as a substitute for clear, self-documenting code. As you add logic, replace comments with actual conditional rendering or mapped lists. Also, be mindful of styling; a good structure makes applying CSS much easier.
      `,
      dryRun: `
        🔁 **Think:** When the component renders, the browser receives the raw HTML structure defined by the JSX. It first sees the \`div\`, then the \`h2\`, then the \`label\` and \`select\` elements. The browser then renders these elements sequentially. The comments are ignored by the browser and serve only as developer notes. If the \`select\` has three \`option\` tags, the user will see a dropdown with three choices. (Hint: The JSX is a direct representation of the initial static DOM structure.)
      `,
      build: `**Learning focus:** Construct the fundamental JSX layout, including a filter dropdown and placeholders for various display states.`,
    },
  },
  {
    id: "step5_fetching_logic",
    type: "question",
    phase: "Step 5 of 7",
    paal: "Now, let's implement the core logic for fetching our resources. We'll use `useEffect` to perform an asynchronous API call when the component mounts and whenever the `filterStatus` changes. This effect will update our `resources`, `loading`, and `error` states.",
    hint: "Inside `useEffect`, set `loading` to true, fetch data (simulate with `setTimeout`), handle success/error, and set `loading` back to false. Remember to include `filterStatus` in the dependency array.",
    example_code: `
function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/data')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []); // Empty dependency array means run once on mount
  // ...
}
    `,
    think_prompt: "How do you use `useEffect` to fetch data based on `filterStatus`, managing `loading` and `error` states?",
    mc_options: [
      `useEffect(() => { setLoading(true); // Simulate API call setTimeout(() => { if (filterStatus === 'active') setResources([{ id: '1', title: 'Active Resource', description: '', status: 'active', createdAt: '' }]); else setResources([]); setLoading(false); }, 1000); }, [filterStatus]);`,
      `function fetchData() { setLoading(true); // ... }`,
      `useEffect(() => { const fetchResources = async () => { setLoading(true); setError(null); try { const response = await fetch(\`/api/resources?status=\${filterStatus}\`); if (!response.ok) throw new Error('Failed to fetch resources'); const data: Resource[] = await response.json(); setResources(data); } catch (err) { setError('Failed to load resources.'); setResources([]); } finally { setLoading(false); } }; fetchResources(); }, [filterStatus]);`,
    ],
    mc_correct_option: `useEffect(() => { const fetchResources = async () => { setLoading(true); setError(null); try { const response = await new Promise<Resource[]>((resolve, reject) => { setTimeout(() => { if (Math.random() > 0.9) { reject(new Error('Network error or API unavailable.')); return; } const allResources: Resource[] = [ { id: 'res1', title: 'Getting Started Guide', description: 'Quick intro for new users.', status: 'active', createdAt: '2023-01-15T10:00:00Z' }, { id: 'res2', title: 'Advanced API Usage', description: 'Deep dive into API endpoints.', status: 'draft', createdAt: '2023-02-20T11:30:00Z' }, { id: 'res3', title: 'Troubleshooting Common Issues', description: 'Solutions for frequent problems.', status: 'active', createdAt: '2023-03-01T14:00:00Z' }, { id: 'res4', title: 'Archived Release Notes', description: 'Historical release information.', status: 'archived', createdAt: '2022-12-01T09:00:00Z' }, { id: 'res5', title: 'Security Best Practices', description: 'Guidelines for secure development.', status: 'active', createdAt: '2023-04-05T16:00:00Z' }, ]; const filtered = allResources.filter(r => filterStatus === 'all' || r.status === filterStatus); resolve(filtered); }, 700); }); setResources(response); } catch (err) { setError(err.message || 'An unknown error occurred.'); setResources([]); } finally { setLoading(false); } }; fetchResources(); }, [filterStatus]);`,
    mc_anchor: "fetching-logic",
    why_this_matters: "`useEffect` is the standard way to perform side effects like data fetching in functional components. By including `filterStatus` in its dependency array, we ensure the data is re-fetched whenever the filter changes, keeping our UI synchronized with the backend and user input.",
    answer_keywords: ["useEffect", "data fetching", "async/await", "loading state", "error handling", "dependency array"],
    seed_code: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  return (
    <div>
      <h2>Resource List</h2>
      <label htmlFor="status-filter">Filter by Status:</label>
      <select id="status-filter">
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>

      {/* Conditional rendering for loading, error, empty, and resource list */}
    </div>
  );
}`,
    starter_code: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  // Add your data fetching logic using useEffect here

  return (
    <div>
      <h2>Resource List</h2>
      <label htmlFor="status-filter">Filter by Status:</label>
      <select id="status-filter">
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>

      {/* Conditional rendering for loading, error, empty, and resource list */}
    </div>
  );
}`,
    feedback_correct: "Excellent! You've correctly implemented the data fetching logic using `useEffect`, handling loading and error states, and ensuring re-fetching when the filter changes. This is a robust approach!",
    feedback_partial: "You've started the `useEffect` for data fetching, but ensure you handle both success and error cases, set `loading` state correctly at the beginning and end, and include `filterStatus` in the dependency array.",
    feedback_wrong: "Review how `useEffect` works for side effects. Remember to use `async/await` for asynchronous operations, manage `loading` and `error` states, and specify dependencies to control when the effect re-runs.",
    expected: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        // Simulate API call
        const response = await new Promise<Resource[]>((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.9) { // 10% chance of error
              reject(new Error('Network error or API unavailable.'));
              return;
            }
            const allResources: Resource[] = [
              { id: 'res1', title: 'Getting Started Guide', description: 'Quick intro for new users.', status: 'active', createdAt: '2023-01-15T10:00:00Z' },
              { id: 'res2', title: 'Advanced API Usage', description: 'Deep dive into API endpoints.', status: 'draft', createdAt: '2023-02-20T11:30:00Z' },
              { id: 'res3', title: 'Troubleshooting Common Issues', description: 'Solutions for frequent problems.', status: 'active', createdAt: '2023-03-01T14:00:00Z' },
              { id: 'res4', title: 'Archived Release Notes', description: 'Historical release information.', status: 'archived', createdAt: '2022-12-01T09:00:00Z' },
              { id: 'res5', title: 'Security Best Practices', description: 'Guidelines for secure development.', status: 'active', createdAt: '2023-04-05T16:00:00Z' },
            ];

            const filtered = allResources.filter(r => filterStatus === 'all' || r.status === filterStatus);
            resolve(filtered);
          }, 700); // Simulate network delay
        });
        setResources(response);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        setResources([]); // Clear resources on error
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [filterStatus]); // Re-run effect when filterStatus changes

  return (
    <div>
      <h2>Resource List</h2>
      <label htmlFor="status-filter">Filter by Status:</label>
      <select id="status-filter">
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>

      {/* Conditional rendering for loading, error, empty, and resource list */}
    </div>
  );
}`,
    analog_example: `
// For fetching user details based on a user ID
import { useState, useEffect } from 'react';

type User = { id: string; name: string; email: string; };

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const response = await fetch(\`https://api.example.com/users/\${userId}\`);
        if (!response.ok) throw new Error('User not found or API error.');
        const userData: User = await response.json();
        setUser(userData);
      } catch (err: any) {
        setFetchError(err.message);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [userId]); // Re-run when userId prop changes

  if (isLoading) return <p>Loading user profile...</p>;
  if (fetchError) return <p>Error: {fetchError}</p>;
  if (!user) return <p>No user data available.</p>;

  return (
    <div>
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
    </div>
  );
}
    `,
    deepDiveLabel: "Mastering `useEffect` for data fetching",
    deepDive: {
      hook: `
        Imagine you've built a beautiful UI, but it's completely static. It looks great, but it doesn't *do* anything. It can't get data from a server, save user input, or interact with the browser's API. This is where side effects come in. Without a way to perform these "outside world" operations, your application is just a fancy picture. \`useEffect\` is the bridge that connects your component's rendering logic to the dynamic world of data, network requests, and browser APIs. Trying to fetch data directly in the render function would lead to infinite loops and performance nightmares, making your application unusable.
      `,
      pain: `
        ⚠️ **Lesson:** Without \`useEffect\`, performing asynchronous operations like data fetching, subscriptions, or DOM manipulations directly within the component's render cycle leads to infinite loops, performance issues, and unpredictable behavior. Symptom: Components re-rendering endlessly, stale data, memory leaks from uncleaned-up subscriptions, or difficulty synchronizing UI with external state.
      `,
      mentalModel: `
        **Mental model:** The Component's Watchdog and Task Manager. Think of \`useEffect\` as a vigilant watchdog that observes specific values (its dependencies) and, when they change, triggers a set of tasks. For data fetching, it's like saying, "Hey, whenever the \`filterStatus\` changes, go fetch new data from the API." It also acts as a task manager, ensuring that tasks like setting loading states, handling errors, and updating the UI are performed in a controlled and predictable manner, preventing race conditions and ensuring proper cleanup. The cleanup function (returned by \`useEffect\`) is like telling the watchdog, "If you're interrupted, stop what you're doing cleanly."
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `
        **Quick rules:**
        - ✅ Use \`useEffect\` for all side effects (data fetching, subscriptions, manual DOM changes).
        - ✅ Always include all values from the component scope that the effect depends on in the dependency array.
        - ✅ Handle loading and error states within your data fetching logic.
        - ✅ Define \`async\` functions inside \`useEffect\` and call them immediately.
        - ❌ Don't fetch data directly in the component body (outside \`useEffect\`).
        - ❌ Never forget the dependency array; omitting it causes infinite loops.
        - ❌ Avoid putting complex, non-primitive objects directly into the dependency array without memoization.
      `,
      watchOut: `
        👀 **Watch out:** Common pitfalls include forgetting to include all dependencies in the \`useEffect\` array, leading to stale closures where the effect uses an outdated value of a variable. Another is not handling cleanup for subscriptions or timers, which can cause memory leaks. For data fetching, ensure you have a mechanism to cancel ongoing requests if the component unmounts or the dependencies change before the fetch completes, though this is an advanced topic for beginners.
      `,
      dryRun: `
        🔁 **Think:**
        1.  Initial render: \`filterStatus\` is 'all'. \`useEffect\` runs.
        2.  Inside \`useEffect\`: \`setLoading(true)\`, \`setError(null)\`.
        3.  Component re-renders: UI shows "Loading...".
        4.  Simulated fetch completes (e.g., after 700ms): \`setResources([...])\` with 'all' resources. \`setLoading(false)\`.
        5.  Component re-renders: UI shows the list of all resources.
        6.  User changes filter to 'active': \`setFilterStatus('active')\` is called.
        7.  Component re-renders: \`filterStatus\` is now 'active'.
        8.  \`useEffect\` detects \`filterStatus\` change, re-runs.
        9.  Inside \`useEffect\`: \`setLoading(true)\`, \`setError(null)\`.
        10. Component re-renders: UI shows "Loading..." again.
        11. Simulated fetch completes: \`setResources([...])\` with 'active' resources. \`setLoading(false)\`.
        12. Component re-renders: UI shows the list of active resources.
        (Hint: The dependency array dictates when the effect's logic is re-executed.)
      `,
      build: `**Learning focus:** Implement the data fetching logic using \`useEffect\`, including handling loading, error, and filtering based on state changes.`,
    },
  },
  {
    id: "step6_filter_handler",
    type: "question",
    phase: "Step 6 of 7",
    paal: "To make our filter dropdown interactive, we need a handler function that updates the `filterStatus` state whenever the user selects a new option. This will then trigger our `useEffect` to re-fetch data.",
    hint: "Create a function `handleFilterChange` that takes an event, extracts the selected value, and uses `setFilterStatus` to update the state. Remember to cast the event target value to `FilterStatus`.",
    example_code: `
function MyForm() {
  const [name, setName] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  return <input value={name} onChange={handleChange} />;
}
    `,
    think_prompt: "How do you write `handleFilterChange` to update `filterStatus` from a select element's change event?",
    mc_options: [
      `const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setFilterStatus(e.target.value as FilterStatus); };`,
      `function handleFilterChange(value: string) { setFilterStatus(value); }`,
      `const handleFilterChange = (e) => { filterStatus = e.target.value; };`,
    ],
    mc_correct_option: `const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setFilterStatus(e.target.value as FilterStatus); };`,
    mc_anchor: "filter-handler",
    why_this_matters: "Event handlers are the bridge between user interaction and component state. By creating a dedicated handler for our filter dropdown, we ensure that user selections are captured and correctly update our application's state, driving the data re-fetching process.",
    answer_keywords: ["event handler", "onChange", "setFilterStatus", "type casting", "HTMLSelectElement"],
    seed_code: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        // Simulate API call
        const response = await new Promise<Resource[]>((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.9) { // 10% chance of error
              reject(new Error('Network error or API unavailable.'));
              return;
            }
            const allResources: Resource[] = [
              { id: 'res1', title: 'Getting Started Guide', description: 'Quick intro for new users.', status: 'active', createdAt: '2023-01-15T10:00:00Z' },
              { id: 'res2', title: 'Advanced API Usage', description: 'Deep dive into API endpoints.', status: 'draft', createdAt: '2023-02-20T11:30:00Z' },
              { id: 'res3', title: 'Troubleshooting Common Issues', description: 'Solutions for frequent problems.', status: 'active', createdAt: '2023-03-01T14:00:00Z' },
              { id: 'res4', title: 'Archived Release Notes', description: 'Historical release information.', status: 'archived', createdAt: '2022-12-01T09:00:00Z' },
              { id: 'res5', title: 'Security Best Practices', description: 'Guidelines for secure development.', status: 'active', createdAt: '2023-04-05T16:00:00Z' },
            ];

            const filtered = allResources.filter(r => filterStatus === 'all' || r.status === filterStatus);
            resolve(filtered);
          }, 700); // Simulate network delay
        });
        setResources(response);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        setResources([]); // Clear resources on error
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [filterStatus]); // Re-run effect when filterStatus changes

  return (
    <div>
      <h2>Resource List</h2>
      <label htmlFor="status-filter">Filter by Status:</label>
      <select id="status-filter">
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>

      {/* Conditional rendering for loading, error, empty, and resource list */}
    </div>
  );
}`,
    starter_code: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        // Simulate API call
        const response = await new Promise<Resource[]>((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.9) { // 10% chance of error
              reject(new Error('Network error or API unavailable.'));
              return;
            }
            const allResources: Resource[] = [
              { id: 'res1', title: 'Getting Started Guide', description: 'Quick intro for new users.', status: 'active', createdAt: '2023-01-15T10:00:00Z' },
              { id: 'res2', title: 'Advanced API Usage', description: 'Deep dive into API endpoints.', status: 'draft', createdAt: '2023-02-20T11:30:00Z' },
              { id: 'res3', title: 'Troubleshooting Common Issues', description: 'Solutions for frequent problems.', status: 'active', createdAt: '2023-03-01T14:00:00Z' },
              { id: 'res4', title: 'Archived Release Notes', description: 'Historical release information.', status: 'archived', createdAt: '2022-12-01T09:00:00Z' },
              { id: 'res5', title: 'Security Best Practices', description: 'Guidelines for secure development.', status: 'active', createdAt: '2023-04-05T16:00:00Z' },
            ];

            const filtered = allResources.filter(r => filterStatus === 'all' || r.status === filterStatus);
            resolve(filtered);
          }, 700); // Simulate network delay
        });
        setResources(response);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        setResources([]); // Clear resources on error
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [filterStatus]); // Re-run effect when filterStatus changes

  // Add your filter change handler here

  return (
    <div>
      <h2>Resource List</h2>
      <label htmlFor="status-filter">Filter by Status:</label>
      <select id="status-filter">
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>

      {/* Conditional rendering for loading, error, empty, and resource list */}
    </div>
  );
}`,
    feedback_correct: "Perfect! Your `handleFilterChange` function correctly captures the selected value and updates the `filterStatus` state, which will now trigger the data fetching.",
    feedback_partial: "You've started the handler, but ensure it correctly extracts the value from the event object and uses `setFilterStatus` to update the state. Don't forget the type annotation for the event.",
    feedback_wrong: "Remember that event handlers receive an event object. You need to access `e.target.value` to get the selected option from a `select` element and then use the state setter function to update `filterStatus`.",
    expected: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        // Simulate API call
        const response = await new Promise<Resource[]>((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.9) { // 10% chance of error
              reject(new Error('Network error or API unavailable.'));
              return;
            }
            const allResources: Resource[] = [
              { id: 'res1', title: 'Getting Started Guide', description: 'Quick intro for new users.', status: 'active', createdAt: '2023-01-15T10:00:00Z' },
              { id: 'res2', title: 'Advanced API Usage', description: 'Deep dive into API endpoints.', status: 'draft', createdAt: '2023-02-20T11:30:00Z' },
              { id: 'res3', title: 'Troubleshooting Common Issues', description: 'Solutions for frequent problems.', status: 'active', createdAt: '2023-03-01T14:00:00Z' },
              { id: 'res4', title: 'Archived Release Notes', description: 'Historical release information.', status: 'archived', createdAt: '2022-12-01T09:00:00Z' },
              { id: 'res5', title: 'Security Best Practices', description: 'Guidelines for secure development.', status: 'active', createdAt: '2023-04-05T16:00:00Z' },
            ];

            const filtered = allResources.filter(r => filterStatus === 'all' || r.status === filterStatus);
            resolve(filtered);
          }, 700); // Simulate network delay
        });
        setResources(response);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        setResources([]); // Clear resources on error
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [filterStatus]); // Re-run effect when filterStatus changes

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value as FilterStatus);
  };

  return (
    <div>
      <h2>Resource List</h2>
      <label htmlFor="status-filter">Filter by Status:</label>
      <select id="status-filter">
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>

      {/* Conditional rendering for loading, error, empty, and resource list */}
    </div>
  );
}`,
    analog_example: `
// For a checkbox toggle
import { useState } from 'react';

function ToggleSwitch() {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsOn(e.target.checked);
  };

  return (
    <label>
      <input type="checkbox" checked={isOn} onChange={handleToggle} />
      {isOn ? 'On' : 'Off'}
    </label>
  );
}
    `,
    deepDiveLabel: "How do event handlers update state?",
    deepDive: {
      hook: `
        Imagine a light switch that doesn't actually turn on or off the light. You flip it, but nothing happens. This is what happens in a UI when you have interactive elements (buttons, inputs, dropdowns) but no event handlers to respond to user actions. The user clicks, types, or selects, but the application remains unresponsive, leading to a frustrating and broken experience. Without event handlers, your UI is just a static display, unable to react to the very interactions it's designed for.
      `,
      pain: `
        ⚠️ **Lesson:** Without proper event handlers, user interactions with UI elements (like clicks, input changes, or selections) will not trigger any state updates or corresponding changes in the application's logic or display. Symptom: Unresponsive UI elements, data not being captured from forms, or interactive components failing to perform their intended actions.
      `,
      mentalModel: `
        **Mental model:** The UI's Listener and Messenger. Think of an event handler as a dedicated listener attached to a specific UI element (like our filter dropdown). When a user interacts with that element (e.g., selects an option), the listener "hears" the event. The handler then acts as a messenger, taking information from the event (like the new selected value) and delivering it to the component's state management system (e.g., calling \`setFilterStatus\`). This message then triggers a re-render, updating the UI to reflect the user's action and potentially initiating other processes like data fetching.
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `
        **Quick rules:**
        - ✅ Always define event handlers as functions within your component.
        - ✅ Use the appropriate event type (e.g., \`React.ChangeEvent<HTMLSelectElement>\`) for strong typing.
        - ✅ Access the input's value via \`e.target.value\` for most form elements.
        - ✅ Use the state setter function (\`setX\`) to update state in response to events.
        - ❌ Don't call the setter function directly in JSX (e.g., \`onChange={setFilterStatus('active')}\`).
        - ❌ Avoid direct DOM manipulation; let state updates drive UI changes.
        - ❌ Never forget to bind the handler to the JSX element (e.g., \`onChange={handleFilterChange}\`).
      `,
      watchOut: `
        👀 **Watch out:** Be careful with the \`this\` context if you're using regular function declarations instead of arrow functions for handlers (though less common in modern functional components). Also, ensure you're extracting the correct property from \`e.target\` (\`.value\` for text inputs/selects, \`.checked\` for checkboxes). Incorrect type assertions (\`as FilterStatus\`) can hide runtime errors if the value doesn't actually match the type.
      `,
      dryRun: `
        🔁 **Think:**
        1.  Initial render: \`filterStatus\` is 'all'. The \`select\` element displays "All".
        2.  User selects "Active" from the dropdown.
        3.  The browser fires an \`onChange\` event.
        4.  \`handleFilterChange\` is called with the event.
        5.  Inside \`handleFilterChange\`, \`e.target.value\` is 'active'.
        6.  \`setFilterStatus('active')\` is called.
        7.  Component re-renders: \`filterStatus\` is now 'active'. The \`select\` element now visually shows "Active" as selected, and the \`useEffect\` for data fetching is triggered.
        (Hint: The event handler updates state, which then drives the UI and other effects.)
      `,
      build: `**Learning focus:** Create an event handler to update the filter status state based on user selection in the dropdown.`,
    },
  },
  {
    id: "step7_wire_handlers_render",
    type: "question",
    phase: "Step 7 of 7",
    paal: "Finally, let's connect our filter handler to the dropdown and implement the conditional rendering logic for loading, error, empty, and the actual list of resources. This brings our dynamic UI to life!",
    hint: "Wire `filterStatus` to the `select`'s `value` and `handleFilterChange` to `onChange`. Use conditional `if` statements or ternary operators to display loading, error, empty, or map over `resources` to render each item.",
    example_code: `
function ItemList() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) return <p>Loading items...</p>;
  if (items.length === 0) return <p>No items found.</p>;

  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}
    `,
    think_prompt: "How do you connect the filter dropdown and render the different states (loading, error, empty, list)?",
    mc_options: [
      `return (<div>...<select value={filterStatus} onChange={handleFilterChange}>...</select>{loading && <p>Loading...</p>}{error && <p>Error: {error}</p>}{!loading && !error && resources.length === 0 && <p>No resources found.</p>}{!loading && !error && resources.length > 0 && (<ul>{resources.map(r => <li key={r.id}>{r.title}</li>)}</ul>)}</div>);`,
      `return (<div>...<select onChange={handleFilterChange}>...</select>{loading ? <p>Loading...</p> : resources.map(r => <p>{r.title}</p>)}</div>);`,
      `return (<div><h2>Resource List</h2><label htmlFor="status-filter">Filter by Status:</label><select id="status-filter" value={filterStatus} onChange={handleFilterChange}><option value="all">All</option><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></select>{loading && <p>Loading resources...</p>}{error && <p style={{ color: 'red' }}>Error: {error}</p>}{!loading && !error && resources.length === 0 && <p>No resources found for current filter.</p>}{!loading && !error && resources.length > 0 && (<div><h3>Resources:</h3><ul>{resources.map(resource => (<li key={resource.id}><strong>{resource.title}</strong> - {resource.status} ({new Date(resource.createdAt).toLocaleDateString()})<p>{resource.description}</p></li>))}</ul></div>)}</div>);`,
    ],
    mc_correct_option: `return (<div><h2>Resource List</h2><label htmlFor="status-filter">Filter by Status:</label><select id="status-filter" value={filterStatus} onChange={handleFilterChange}><option value="all">All</option><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></select>{loading && <p>Loading resources...</p>}{error && <p style={{ color: 'red' }}>Error: {error}</p>}{!loading && !error && resources.length === 0 && <p>No resources found for current filter.</p>}{!loading && !error && resources.length > 0 && (<div><h3>Resources:</h3><ul>{resources.map(resource => (<li key={resource.id}><strong>{resource.title}</strong> - {resource.status} ({new Date(resource.createdAt).toLocaleDateString()})<p>{resource.description}</p></li>))}</ul></div>)}</div>);`,
    mc_anchor: "wire-handlers-render",
    why_this_matters: "This step brings all previous pieces together. Wiring the handler makes the UI interactive, and conditional rendering ensures the user always sees appropriate feedback, whether data is loading, an error occurred, or the list is empty, creating a complete and user-friendly experience.",
    answer_keywords: ["conditional rendering", "map function", "key prop", "onChange", "value prop", "loading state", "error state", "empty state"],
    seed_code: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        // Simulate API call
        const response = await new Promise<Resource[]>((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.9) { // 10% chance of error
              reject(new Error('Network error or API unavailable.'));
              return;
            }
            const allResources: Resource[] = [
              { id: 'res1', title: 'Getting Started Guide', description: 'Quick intro for new users.', status: 'active', createdAt: '2023-01-15T10:00:00Z' },
              { id: 'res2', title: 'Advanced API Usage', description: 'Deep dive into API endpoints.', status: 'draft', createdAt: '2023-02-20T11:30:00Z' },
              { id: 'res3', title: 'Troubleshooting Common Issues', description: 'Solutions for frequent problems.', status: 'active', createdAt: '2023-03-01T14:00:00Z' },
              { id: 'res4', title: 'Archived Release Notes', description: 'Historical release information.', status: 'archived', createdAt: '2022-12-01T09:00:00Z' },
              { id: 'res5', title: 'Security Best Practices', description: 'Guidelines for secure development.', status: 'active', createdAt: '2023-04-05T16:00:00Z' },
            ];

            const filtered = allResources.filter(r => filterStatus === 'all' || r.status === filterStatus);
            resolve(filtered);
          }, 700); // Simulate network delay
        });
        setResources(response);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        setResources([]); // Clear resources on error
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [filterStatus]); // Re-run effect when filterStatus changes

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value as FilterStatus);
  };

  return (
    <div>
      <h2>Resource List</h2>
      <label htmlFor="status-filter">Filter by Status:</label>
      <select id="status-filter">
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>

      {/* Conditional rendering for loading, error, empty, and resource list */}
    </div>
  );
}`,
    starter_code: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        // Simulate API call
        const response = await new Promise<Resource[]>((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.9) { // 10% chance of error
              reject(new Error('Network error or API unavailable.'));
              return;
            }
            const allResources: Resource[] = [
              { id: 'res1', title: 'Getting Started Guide', description: 'Quick intro for new users.', status: 'active', createdAt: '2023-01-15T10:00:00Z' },
              { id: 'res2', title: 'Advanced API Usage', description: 'Deep dive into API endpoints.', status: 'draft', createdAt: '2023-02-20T11:30:00Z' },
              { id: 'res3', title: 'Troubleshooting Common Issues', description: 'Solutions for frequent problems.', status: 'active', createdAt: '2023-03-01T14:00:00Z' },
              { id: 'res4', title: 'Archived Release Notes', description: 'Historical release information.', status: 'archived', createdAt: '2022-12-01T09:00:00Z' },
              { id: 'res5', title: 'Security Best Practices', description: 'Guidelines for secure development.', status: 'active', createdAt: '2023-04-05T16:00:00Z' },
            ];

            const filtered = allResources.filter(r => filterStatus === 'all' || r.status === filterStatus);
            resolve(filtered);
          }, 700); // Simulate network delay
        });
        setResources(response);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        setResources([]); // Clear resources on error
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [filterStatus]); // Re-run effect when filterStatus changes

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value as FilterStatus);
  };

  return (
    <div>
      <h2>Resource List</h2>
      <label htmlFor="status-filter">Filter by Status:</label>
      <select
        id="status-filter"
        // Wire up value and onChange here
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>

      {/* Implement conditional rendering for loading, error, empty, and resource list here */}
    </div>
  );
}`,
    feedback_correct: "Fantastic! You've successfully wired up the filter and implemented robust conditional rendering for all states. Your resource list is now fully dynamic and user-friendly!",
    feedback_partial: "You've made good progress, but ensure the `select` element's `value` prop is correctly bound to `filterStatus` and that all four conditional states (loading, error, empty, and the actual list) are handled with clear messages and proper rendering logic.",
    feedback_wrong: "Remember to bind the `select` element's `value` to the `filterStatus` state and its `onChange` to `handleFilterChange`. For conditional rendering, use logical AND (`&&`) or ternary operators (`? :`) to display the correct message or list based on `loading`, `error`, and `resources.length`.",
    expected: `import { useState, useEffect } from 'react';

type Resource = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  createdAt: string; // ISO date string
};

type FilterStatus = 'all' | 'active' | 'draft' | 'archived';

function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        // Simulate API call
        const response = await new Promise<Resource[]>((resolve, reject) => {
          setTimeout(() => {
            if (Math.random() > 0.9) { // 10% chance of error
              reject(new Error('Network error or API unavailable.'));
              return;
            }
            const allResources: Resource[] = [
              { id: 'res1', title: 'Getting Started Guide', description: 'Quick intro for new users.', status: 'active', createdAt: '2023-01-15T10:00:00Z' },
              { id: 'res2', title: 'Advanced API Usage', description: 'Deep dive into API endpoints.', status: 'draft', createdAt: '2023-02-20T11:30:00Z' },
              { id: 'res3', title: 'Troubleshooting Common Issues', description: 'Solutions for frequent problems.', status: 'active', createdAt: '2023-03-01T14:00:00Z' },
              { id: 'res4', title: 'Archived Release Notes', description: 'Historical release information.', status: 'archived', createdAt: '2022-12-01T09:00:00Z' },
              { id: 'res5', title: 'Security Best Practices', description: 'Guidelines for secure development.', status: 'active', createdAt: '2023-04-05T16:00:00Z' },
            ];

            const filtered = allResources.filter(r => filterStatus === 'all' || r.status === filterStatus);
            resolve(filtered);
          }, 700); // Simulate network delay
        });
        setResources(response);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        setResources([]); // Clear resources on error
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [filterStatus]); // Re-run effect when filterStatus changes

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value as FilterStatus);
  };

  return (
    <div>
      <h2>Resource List</h2>
      <label htmlFor="status-filter">Filter by Status:</label>
      <select
        id="status-filter"
        value={filterStatus} // Controlled component: value reflects state
        onChange={handleFilterChange} // Update state on change
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>

      {loading && <p>Loading resources...</p>}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && resources.length === 0 && (
        <p>No resources found for current filter.</p>
      )}

      {!loading && !error && resources.length > 0 && (
        <div>
          <h3>Resources:</h3>
          <ul>
            {resources.map(resource => (
              <li key={resource.id}>
                <strong>{resource.title}</strong> - {resource.status} ({new Date(resource.createdAt).toLocaleDateString()})
                <p>{resource.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}`,
    analog_example: `
// For a simple todo list with conditional empty state
import { useState } from 'react';

type Todo = { id: string; text: string; completed: boolean; };

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 't1', text: 'Learn INPACT', completed: false },
    { id: 't2', text: 'Build a module', completed: true },
  ]);

  const handleToggleComplete = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  return (
    <div>
      <h3>My Todos</h3>
      {todos.length === 0 ? (
        <p>No todos yet! Add some.</p>
      ) : (
        <ul>
          {todos.map(todo => (
            <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
              />
              {todo.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
    `,
    deepDiveLabel: "Mastering conditional rendering and list mapping",
    deepDive: {
      hook: `
        Imagine a website where you always see "Loading..." even after the data arrives, or an error message that never disappears, or an empty list that just shows a blank screen without telling you why. This creates a confusing and broken user experience. Without conditional rendering, your UI can't adapt to different states of your application (loading, error, empty, data available). Without list mapping, you'd have to manually write out each item, making dynamic lists impossible and leading to repetitive, unmaintainable code.
      `,
      pain: `
        ⚠️ **Lesson:** Failing to implement conditional rendering leads to static, unresponsive UIs that don't provide feedback for loading, errors, or empty states. Not using list mapping results in repetitive, unscalable code for displaying dynamic collections of data. Symptom: Poor user experience, redundant JSX, difficulty in updating or sorting lists, and a lack of clear communication about the application's current status.
      `,
      mentalModel: `
        **Mental model:** The UI's Dynamic Director and Assembly Line. Conditional rendering is like a director on a movie set, deciding which scene (loading spinner, error message, empty state, or the actual list) should be shown based on the current script (your component's state). It ensures only the relevant UI is visible. List mapping, on the other hand, is like an efficient assembly line. You provide a blueprint for a single item (e.g., a resource card), and the \`map\` function automatically replicates that blueprint for every piece of data in your collection, assembling a full list without manual repetition.
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `
        **Quick rules:**
        - ✅ Use \`value\` and \`onChange\` props to make form elements (like \`select\`) controlled components.
        - ✅ Use \`&&\` for simple conditional rendering (show if true).
        - ✅ Use \`map()\` to render lists of items from an array.
        - ✅ Always provide a unique and stable \`key\` prop for each item rendered in a list.
        - ❌ Don't render multiple top-level elements without wrapping them in a fragment (\`<>...</>\`) or a single \`div\`.
        - ❌ Avoid using array index as \`key\` if the list items can change order, be added, or removed.
        - ❌ Never forget to handle all possible UI states (loading, error, empty, data).
      `,
      watchOut: `
        👀 **Watch out:** Incorrect \`key\` props can lead to subtle bugs, especially with input fields or animations in lists. If keys are not stable, the rendering engine might reuse components incorrectly. Also, ensure your conditional rendering logic covers all mutually exclusive states. For example, if \`loading\` is true, you typically don't want to show the empty state or the actual list. Order matters in conditional rendering.
      `,
      dryRun: `
        🔁 **Think:**
        1.  Initial render: \`loading\` is \`true\`. The condition \`loading && <p>Loading...</p>\` evaluates to \`true && <p>Loading...</p>\`, so "Loading..." is displayed. Other conditions are false.
        2.  Fetch completes successfully: \`loading\` becomes \`false\`, \`error\` is \`null\`, \`resources\` has 3 items.
        3.  Component re-renders:
            *   \`loading && ...\` is \`false && ...\`, so nothing.
            *   \`error && ...\` is \`null && ...\`, so nothing.
            *   \`!loading && !error && resources.length === 0 && ...\` is \`true && true && false && ...\`, so nothing.
            *   \`!loading && !error && resources.length > 0 && ...\` is \`true && true && true && ...\`, so the \`map\` function runs, rendering 3 \`<li>\` elements.
        (Hint: JSX conditions are evaluated sequentially, and the first true condition often dictates what is rendered.)
      `,
      build: `**Learning focus:** Connect the filter dropdown to state and implement comprehensive conditional rendering for all possible UI states of the resource list.`,
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Imports & Types", id: "step1_imports_types" },
  { label: "Component Shell", id: "step2_component_shell" },
  { label: "State Variables", id: "step3_state_variables" },
  { label: "Structure Skeleton", id: "step4_structure_skeleton" },
  { label: "Fetching Logic", id: "step5_fetching_logic" },
  { label: "Filter Handler", id: "step6_filter_handler" },
  { label: "Wire & Render", id: "step7_wire_handlers_render" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Building a Dynamic Resource List UI",
  shortName: "Resource List",
});
