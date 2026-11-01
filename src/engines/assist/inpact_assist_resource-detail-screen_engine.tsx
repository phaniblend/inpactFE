import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "resource-detail-screen",
      title: "Building a Detail Screen with Loading and Not-Found States",
      body: `
        • A detail screen shows everything about ONE item — fetched by its id, not the whole list.
        • You might have noticed that in Gmail, clicking one email opens its full body, sender, and timestamp on their own screen — separate from the inbox list.
        • It also needs to handle: still loading, the item doesn't exist (a "not found" page), and a real network error — not just the happy path.
      `,
      usecase: "A user profile page, showing a specific user's details.",
      designMock: {
        "kind": "list-and-form",
        "screenTitle": "Item Details",
        "caption": "View the full details of a single item, including its status and description.",
        "listCaption": "Item Details",
        "emptyCaption": "Item Not Found",
        "emptyMessage": "The requested item could not be located. It may have been removed or never existed.",
        "rows": [
          {
            "title": "Sample Item A",
            "subtitle": "Category: Widgets",
            "meta": "Active"
          }
        ],
        "fields": [
          {
            "label": "Name",
            "sample": "Sample Item A"
          },
          {
            "label": "Category",
            "sample": "Widgets"
          },
          {
            "label": "Description",
            "sample": "A detailed description of Sample Item A, highlighting its key features and benefits."
          },
          {
            "label": "Status",
            "options": ["Active", "Archived"]
          }
        ],
        "submitLabel": "Update",
        "rowToggle": {
          "values": ["Active", "Archived"],
          "labels": {
            "Active": "Archive Item",
            "Archived": "Activate Item"
          },
          "subtitleValues": ["Category: Widgets", "Category: Widgets"]
        }
      }
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Retrieve a resource ID from the URL using route parameters.",
      "Fetch a single resource from an API based on its ID.",
      "Manage and display loading, error, and 'not found' states.",
      "Conditionally render different UI elements based on fetch status.",
    ],
  },
  {
    id: "prereq-fundamentals",
    type: "funda-gate",
    phase: "Prerequisites",
    fundas: [
      {
        name: "React hooks (useState / useEffect)",
        blurb: "Fetching by id and tracking loading/not-found/error state — this whole lesson — is built entirely on these two hooks.",
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
        name: "useEffect (fetching on mount / when id changes)",
        blurb: "Fetching a specific item by id — and re-fetching if the id itself changes — is exactly what useEffect's dependency array is for.",
        videoUrl: "https://www.youtube.com/watch?v=0ZJgIjIuY7U",
        quiz: {
          question: "When does a useEffect with a dependency array [id] run again?",
          options: [
            "Only once, when the component first mounts",
            "Every single render, regardless of what changed",
            "On mount, and again whenever id changes between renders",
          ],
          correctIndex: 2,
        },
      },
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 7",
    paal: "To begin, we need to import the necessary hooks from React and a routing library. For accessing URL parameters, `useParams` is a common hook. We'll also need `useState` for managing component state and `useEffect` for side effects like data fetching.",
    hint: "Think about which hooks are essential for managing state, performing side effects, and reading URL parameters.",
    example_code: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Assuming a routing library like react-router-dom
    `,
    think_prompt: "Which imports are required to manage state, handle side effects, and extract dynamic parts from the URL?",
    mc_options: [
      "import { useState, useEffect } => from 'react'; import { useRouteMatch } from 'react-router-dom';",
      "import { useState, useEffect } from 'react'; import { useParams } from 'react-router-dom';",
      "import { useReducer, useCallback } from 'react'; import { useHistory } from 'react-router-dom';",
    ],
    mc_correct_option: "import { useState, useEffect } from 'react'; import { useParams } from 'react-router-dom';",
    mc_anchor: "import-hooks",
    why_this_matters: "Correctly importing hooks ensures your component has access to the fundamental tools for managing its lifecycle, data, and interactions with the URL. `useState` is for local state, `useEffect` for side effects (like data fetching), and `useParams` for reading dynamic segments of the URL.",
    answer_keywords: ["useState", "useEffect", "useParams", "imports"],
    seed_code: ``,
    starter_code: `// Add your imports here`,
    feedback_correct: "Excellent! `useState` for state, `useEffect` for effects, and `useParams` for route parameters are the correct imports.",
    feedback_partial: "You've got some of the imports right, but double-check which hook is specifically used for extracting dynamic parameters from the URL.",
    feedback_wrong: "Review the purpose of each hook. `useReducer` and `useCallback` are for more advanced scenarios, and `useHistory` is for navigation, not parameter extraction.",
    expected: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
    `,
    analog_example: `
// In a different context, like a simple counter component:
import { useState, useEffect } from 'react';

function SimpleCounter() {
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
}
    `,
    deepDiveLabel: "Why do we need different hooks for state and effects?",
    deepDive: {
      hook: `
Imagine you're building a complex machine, like a robot. This robot needs to remember things (its current task, its battery level) and it also needs to perform actions based on those memories or external triggers (move forward when a button is pressed, recharge when battery is low). If you just had one general-purpose "memory-and-action" system, it would quickly become a tangled mess. How would you know if a change in memory should trigger an action, or if an action should update a memory? The lines would blur, making the robot's behavior unpredictable and hard to debug.

In software, especially with components that render and re-render, we face a similar challenge. We need a clear way to distinguish between data that changes over time and affects what's displayed (state), and operations that interact with the outside world or respond to state changes *after* rendering (effects). Without this separation, every time your component updates, you might accidentally re-fetch data, re-subscribe to events, or cause infinite loops, leading to performance issues and bugs that are incredibly difficult to track down. You'd find yourself constantly battling unintended side effects and struggling to keep your UI in sync with your data.
      `,
      pain: `⚠️ **Lesson:** Without dedicated mechanisms for state and side effects, component logic becomes intertwined, leading to unpredictable behavior, performance problems, and difficult-to-debug issues. Symptom: Data fetching repeatedly, UI not updating correctly after an async operation, or infinite re-renders.`,
      mentalModel: `**Mental model:** The Component as a "Smart Display" and "Action Coordinator". Think of your component as a smart display that shows information (\`useState\`) and also has a dedicated "backstage crew" (\`useEffect\`) that handles all the non-display-related tasks. The display's job is to reflect the current data. The backstage crew's job is to fetch new data, set up timers, interact with the browser's DOM, or clean up resources. They communicate, but their roles are distinct. The display tells the crew what data it needs, and the crew updates the display's data when it's ready.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `
**Quick rules:**
- ✅ Use \`useState\` for any piece of data that needs to change and cause a UI update within your component.
- ✅ Use \`useEffect\` for operations that interact with the browser API, fetch data, set up subscriptions, or perform cleanup.
- ✅ Always specify a dependency array for \`useEffect\` to control when it re-runs; use \`[]\` for mount-only effects.
- ✅ Use \`useParams\` to extract dynamic values from the URL path, like an item ID.
- ❌ Never perform data fetching directly in the component body without \`useEffect\`; it will run on every render.
- ❌ Avoid putting complex logic or heavy computations directly into \`useState\` initializers unless they are truly static.
- ❌ Do not forget to include all external values used inside your \`useEffect\` callback in its dependency array.
      `,
      watchOut: `👀 **Watch out:** A common pitfall with \`useEffect\` is forgetting to include all dependencies in its dependency array. If a value used inside the effect (like a prop or state variable) changes but isn't in the array, the effect might run with a stale closure, leading to bugs where the effect doesn't react to the latest data. Conversely, putting too many dependencies can cause the effect to run more often than necessary.`,
      dryRun: `
🔁 **Think:** Imagine a component that needs to display a user's name based on an ID from the URL.
1.  **Initial Render:** Component mounts. \`useState\` initializes \`userName\` to \`null\`. \`useParams\` reads \`userId\` from the URL (e.g., \`'123'\`).
2.  **\`useEffect\` (Mount):** The effect runs. It calls an API to fetch user data for \`userId '123'\`. While fetching, \`userName\` is still \`null\`.
3.  **API Response:** The API returns \`{ name: 'Alice' }\`. The effect's callback updates \`userName\` to \`'Alice'\`.
4.  **Re-render:** Component re-renders because \`userName\` changed. Now, the UI displays "Alice".
(Hint: Trace how the \`userName\` state changes from \`null\` to \`'Alice'\` as the \`useEffect\` fetches data.)
      `,
      build: "**Learning focus:** Understand the purpose of `useState`, `useEffect`, and `useParams` for managing component state, side effects, and route parameters.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 7",
    paal: "Next, let's define the data structure for our resource and an enum to represent the different fetching states (loading, success, error, not found). This makes our code more readable and type-safe.",
    hint: "Consider what properties a generic resource might have and how to clearly define the possible states of an asynchronous operation.",
    example_code: `
interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}
    `,
    think_prompt: "What interface would best describe a generic resource, and what enum would clearly represent the states of an API fetch operation?",
    mc_options: [
      "interface Item { title: string; }; type Status = 'pending' | 'done';",
      "interface Resource { id: string; name: string; description: string; status: 'Active' | 'Archived'; }; enum FetchState { LOADING = 'LOADING', SUCCESS = 'SUCCESS', ERROR = 'ERROR', NOT_FOUND = 'NOT_FOUND', };",
      "type ResourceType = { id: number; data: any; }; const FetchStatus = { initial: 0, fetched: 1 };",
    ],
    mc_correct_option: "interface Resource { id: string; name: string; description: string; status: 'Active' | 'Archived'; }; enum FetchState { LOADING = 'LOADING', SUCCESS = 'SUCCESS', ERROR = 'ERROR', NOT_FOUND = 'NOT_FOUND', };",
    mc_anchor: "define-types",
    why_this_matters: "Defining types and enums upfront improves code clarity, maintainability, and helps catch errors during development. A `Resource` interface ensures consistency in how resource data is handled, and `FetchState` clearly delineates the stages of an asynchronous operation, making conditional rendering logic much cleaner.",
    answer_keywords: ["interface", "enum", "Resource", "FetchState", "type safety"],
    seed_code: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
    `,
    starter_code: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Define your types and enums here
    `,
    feedback_correct: "Exactly! Defining a clear `Resource` interface and `FetchState` enum sets a strong foundation for type-safe and readable code.",
    feedback_partial: "You've got the right idea for defining types, but ensure your `Resource` interface is comprehensive and your `FetchState` enum covers all necessary asynchronous states.",
    feedback_wrong: "The chosen types are too simplistic or not idiomatic for representing a detailed resource and distinct fetch states. Enums provide better clarity for a fixed set of states than generic numbers or simple string types.",
    expected: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}
    `,
    analog_example: `
// In a different context, like defining a user and their roles:
interface UserProfile {
  userId: string;
  username: string;
  email: string;
  roles: UserRole[];
}

enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

// Usage example:
const currentUser: UserProfile = {
  userId: 'u123',
  username: 'JaneDoe',
  email: 'jane@example.com',
  roles: [UserRole.EDITOR],
};
    `,
    deepDiveLabel: "Why use an enum for fetch states instead of booleans?",
    deepDive: {
      hook: `
Imagine you're trying to describe the weather. You could say "isSunny: true" or "isRainy: true". But what if it's both? Or neither? What if it's cloudy? Or snowing? Using multiple boolean flags like \`isLoading\`, \`isError\`, \`isNotFound\` can quickly lead to ambiguity and invalid states. For instance, could \`isLoading\` be true while \`isError\` is also true? Or what if all three are false? Does that mean success, or just an uninitialized state?

This ambiguity makes your code harder to reason about. You end up with complex conditional logic like \`if (isLoading && !isError && !isNotFound)\` or \`if (!isLoading && !isError && !isNotFound)\` to determine the true state. This complexity increases the chance of bugs, especially as your application grows and more states are introduced. It forces you to constantly validate combinations of flags, rather than simply checking a single, definitive status.
      `,
      pain: `⚠️ **Lesson:** Using multiple boolean flags for mutually exclusive states can lead to ambiguous or invalid state combinations, making conditional logic complex and error-prone. Symptom: Conflicting UI states being displayed, or unexpected behavior due to an undefined state combination.`,
      mentalModel: `**Mental model:** The "Traffic Light" for States. Think of an enum as a traffic light. A traffic light can only be RED, YELLOW, or GREEN at any given moment – never two at once, and never "off" in a way that implies an unknown state. Each color clearly and unambiguously dictates the action to be taken (stop, prepare to stop, go). Similarly, an enum for fetch states (LOADING, SUCCESS, ERROR, NOT_FOUND) ensures that your component is always in one, and only one, well-defined state, simplifying your conditional rendering logic.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `
**Quick rules:**
- ✅ Use enums when you have a fixed set of distinct, mutually exclusive states.
- ✅ Define clear, descriptive names for each enum member.
- ✅ Use enums to simplify conditional logic, checking against a single state variable.
- ✅ Leverage TypeScript enums for compile-time type safety and better developer experience.
- ❌ Avoid using multiple boolean flags for states that cannot logically be true simultaneously.
- ❌ Do not use enums for values that are not mutually exclusive or have a continuous range.
- ❌ Never rely on magic strings or numbers when an enum would provide better clarity and type safety.
      `,
      watchOut: `👀 **Watch out:** While enums are great for mutually exclusive states, be mindful of their overhead in JavaScript if you're not using TypeScript. In plain JavaScript, enums are typically implemented as objects, which can be slightly less performant than simple strings or numbers if used in extremely hot loops, though this is rarely a concern for UI state management. In TypeScript, they provide significant benefits.`,
      dryRun: `
🔁 **Think:** Consider a component fetching data.
1.  **Initial State:** \`fetchStatus\` is \`FetchState.IDLE\`. UI shows nothing or an initial message.
2.  **Start Fetching:** API call initiated. \`setFetchStatus(FetchState.LOADING)\`.
3.  **Re-render (Loading):** Component re-renders. \`fetchStatus\` is \`LOADING\`. UI now shows "Loading...".
4.  **API Success:** API returns data. \`setFetchStatus(FetchState.SUCCESS)\`.
5.  **Re-render (Success):** Component re-renders. \`fetchStatus\` is \`SUCCESS\`. UI now shows the fetched data.
6.  **API 404:** (Alternative path) API returns 404. \`setFetchStatus(FetchState.NOT_FOUND)\`.
7.  **Re-render (Not Found):** Component re-renders. \`fetchStatus\` is \`NOT_FOUND\`. UI now shows "Item Not Found".
(Hint: Observe how a single \`fetchStatus\` variable clearly dictates the UI at each stage, unlike managing multiple booleans.)
      `,
      build: "**Learning focus:** Define a `Resource` interface and `FetchState` enum for clear, type-safe data and state management.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 7",
    paal: "Now, let's create the basic functional component shell. This will be a simple function that returns JSX. We'll name it `ResourceDetail`.",
    hint: "Remember that a functional component is just a JavaScript function that returns JSX.",
    example_code: `
function ResourceDetail() {
  return (
    <div>
      <h1>Resource Detail</h1>
    </div>
  );
}
    `,
    think_prompt: "What is the minimal structure for a functional component named `ResourceDetail`?",
    mc_options: [
      "const ResourceDetail = () => { return <p>Detail</p>; };",
      "function ResourceDetail() { return (<div><h1>Resource Detail</h1></div>); }",
      "class ResourceDetail extends React.Component { render() { return <p>Detail</p>; } }",
    ],
    mc_correct_option: "function ResourceDetail() { return (<div><h1>Resource Detail</h1></div>); }",
    mc_anchor: "component-shell",
    why_this_matters: "Establishing the component shell early provides a clear container for all subsequent logic and UI. Using a functional component is the modern standard in React, offering simplicity and direct access to hooks.",
    answer_keywords: ["functional component", "JSX", "return", "function"],
    seed_code: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}
    `,
    starter_code: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

// Create your functional component here
    `,
    feedback_correct: "Perfect! A simple functional component returning JSX is the correct starting point.",
    feedback_partial: "You're close, but ensure you're using a standard function declaration for clarity and consistency, and returning valid JSX.",
    feedback_wrong: "Class components are an older pattern. Focus on functional components, which are the modern and recommended approach for new React development.",
    expected: `
import { useState, useEffect } => from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

function ResourceDetail() {
  return (
    <div>
      <h1>Resource Detail</h1>
    </div>
  );
}
    `,
    analog_example: `
// In a different context, like a simple greeting component:
function GreetingCard() {
  const name = "World";
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Hello, {name}!</h2>
      <p>Welcome to the component.</p>
    </div>
  );
}
    `,
    deepDiveLabel: "Why are functional components preferred over class components now?",
    deepDive: {
      hook: `
Imagine you're trying to manage a large, complex factory. In the past, you might have had a single, massive "master control room" (a class component) where all operations were handled. This room had many levers, buttons, and displays, and understanding how one part of the factory affected another required tracing wires across the entire room. Adding new features meant carefully integrating them into this already dense setup, often leading to unexpected interactions and bugs.

Now, imagine a modern factory where each small section has its own dedicated, independent control panel (a functional component). Each panel is simpler, focused on a single task, and can easily be swapped out or combined with others. If one panel needs to remember something, it has a small, local memory bank. If it needs to interact with another part of the factory, it uses a clear, defined communication channel. This modular approach makes the factory easier to build, understand, maintain, and scale.
      `,
      pain: `⚠️ **Lesson:** Class components can lead to complex logic, difficult state management, and challenges in reusing stateful logic. Symptom: Components with many lifecycle methods, 'this' binding issues, and difficulty extracting reusable logic.`,
      mentalModel: `**Mental model:** Functional Components as "Pure Functions with Memory and Effects". Think of functional components as mathematical functions: they take inputs (props) and return outputs (JSX). The magic of hooks (\`useState\`, \`useEffect\`, etc.) is that they give these "pure functions" the ability to have internal memory (state) and perform actions outside their immediate scope (side effects) *without* becoming complex, stateful objects like class components. This makes them easier to test, reason about, and compose.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", \`useEffect\`, \`useContext\`, etc.) provide a way to "hook into" React features from functional components, replacing lifecycle methods and \`this.state\`.
- They promote better separation of concerns by allowing stateful logic to be extracted into custom hooks.
- Avoids \`this\` binding issues common in class components.
      `,
      quickRules: `
**Quick rules:**
- ✅ Use functional components for all new React development.
- ✅ Manage component-specific state using \`useState\`.
- ✅ Handle side effects (data fetching, subscriptions) using \`useEffect\`.
- ✅ Extract reusable stateful logic into custom hooks.
- ❌ Avoid creating new class components; they are largely superseded by functional components and hooks.
- ❌ Do not use lifecycle methods like \`componentDidMount\` or \`componentDidUpdate\` in functional components.
- ❌ Never struggle with \`this\` binding in functional components, as they don't have their own \`this\` context.
      `,
      watchOut: `👀 **Watch out:** While functional components are powerful, understanding the dependency array of \`useEffect\` is crucial. Mismanaging it can lead to stale closures (effects using outdated values) or infinite loops. Always ensure all values from the component scope used within an effect are listed in its dependency array.`,
      dryRun: `
🔁 **Think:** Consider a simple button that increments a counter.
1.  **Class Component:**
    *   \`constructor\` runs, \`this.state.count\` is \`0\`.
    *   \`render\` runs, displays "Clicked 0 times".
    *   User clicks button. \`this.setState({ count: 1 })\` is called.
    *   \`render\` runs again, displays "Clicked 1 times".
2.  **Functional Component:**
    *   \`MyFunctionalComponent\` runs. \`useState(0)\` initializes \`count\` to \`0\`.
    *   \`useEffect\` runs (mount), sets document title to "You clicked 0 times".
    *   Returns JSX displaying "Clicked 0 times".
    *   User clicks button. \`setCount(1)\` is called.
    *   \`MyFunctionalComponent\` runs again. \`useState\` returns \`count\` as \`1\`.
    *   \`useEffect\` runs (because \`count\` changed), sets document title to "You clicked 1 times".
    *   Returns JSX displaying "Clicked 1 times".
(Hint: Notice how the functional component's state and effects are managed directly by the hooks, without needing \`this\` or separate lifecycle methods.)
      `,
      build: "**Learning focus:** Create a basic functional component `ResourceDetail` that returns a simple JSX structure.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 7",
    paal: "Inside our `ResourceDetail` component, we need to set up state variables to hold the fetched resource data and track the current fetching status. We'll use `useState` for both.",
    hint: "Think about what data needs to persist across renders and what state describes the API call's progress.",
    example_code: `
function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);

  return (
    <div>
      <h1>Resource Detail for ID: {id}</h1>
    </div>
  );
}
    `,
    think_prompt: "How do you declare state variables for the `resource` data and the `fetchStatus` using `useState`, and how do you get the `id` from the URL?",
    mc_options: [
      "const id = getUrlParam('id'); const [resource, setResource] = useState({}); const [status, setStatus] = useState('loading');",
      "const { id } = useParams<{ id: string }>(); const [resource, setResource] = useState<Resource | null>(null); const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);",
      "const id = props.match.params.id; const [data, setData] = useState(undefined); const [loading, setLoading] = useState(true);",
    ],
    mc_correct_option: "const { id } = useParams<{ id: string }>(); const [resource, setResource] = useState<Resource | null>(null); const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);",
    mc_anchor: "state-variables",
    why_this_matters: "Properly initialized state variables are crucial for a detail screen. `resource` will hold the actual data, while `fetchStatus` will drive the conditional rendering of loading, error, or success messages. Retrieving the `id` from `useParams` ensures the component knows which resource to fetch.",
    answer_keywords: ["useState", "useParams", "resource", "fetchStatus", "initial state"],
    seed_code: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

function ResourceDetail() {
  return (
    <div>
      <h1>Resource Detail</h1>
    </div>
  );
}
    `,
    starter_code: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

function ResourceDetail() {
  // Add state variables and get ID from URL here

  return (
    <div>
      <h1>Resource Detail</h1>
    </div>
  );
}
    `,
    feedback_correct: "Spot on! Using `useParams` for the ID and `useState` for `resource` and `fetchStatus` with correct initial values is the way to go.",
    feedback_partial: "You've correctly identified the need for state, but double-check the initial values and the type annotation for `resource` to allow for `null`.",
    feedback_wrong: "Avoid custom `getUrlParam` functions when `useParams` is available. Also, ensure your state variables are typed correctly and initialized to reflect the component's initial state (e.g., `null` for data, `LOADING` for status).",
    expected: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);

  return (
    <div>
      <h1>Resource Detail for ID: {id}</h1>
    </div>
  );
}
    `,
    analog_example: `
// In a different context, like a form for editing a user's profile:
import { useState } from 'react';

interface UserProfileData {
  name: string;
  email: string;
  isSubscribed: boolean;
}

function UserProfileEditor() {
  const [profile, setProfile] = useState<UserProfileData>({
    name: 'John Doe',
    email: 'john@example.com',
    isSubscribed: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <form>
      <label>Name: <input name="name" value={profile.name} onChange={handleChange} /></label>
      <label>Email: <input name="email" value={profile.email} onChange={handleChange} /></label>
      <label>Subscribe: <input type="checkbox" name="isSubscribed" checked={profile.isSubscribed} onChange={handleChange} /></label>
      <button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}
    `,
    deepDiveLabel: "What's the difference between `null` and `undefined` for initial state?",
    deepDive: {
      hook: `
Imagine you're packing a lunchbox. If you say "I'm putting nothing in the lunchbox," that could mean two things: either you haven't decided what to put in yet (it's 'undefined' – a concept without a value), or you've explicitly decided to put *no item* in it (it's 'null' – an intentional absence of a value). In programming, this distinction matters. If you try to access a property of something that's 'undefined', your program will crash because it doesn't even know what 'it' is. If you try to access a property of something that's 'null', it knows 'it' exists but has no value, and you can safely check for its presence.

This difference becomes critical when dealing with data that might or might not exist, especially when fetching from an API. If your initial state is \`undefined\`, and you try to render \`resource.name\`, you'll get an error. If it's \`null\`, you can safely check \`if (resource)\` before trying to access its properties, preventing runtime crashes and making your code more robust.
      `,
      pain: `⚠️ **Lesson:** Confusing \`null\` and \`undefined\` can lead to runtime errors when attempting to access properties of non-existent objects. Symptom: "Cannot read properties of undefined" errors, especially when dealing with optional data or API responses.`,
      mentalModel: `**Mental model:** \`undefined\` as "Unknown" and \`null\` as "Empty". Think of \`undefined\` as a variable that has been declared but not yet assigned any value – its content is "unknown" or "not yet defined". Conversely, \`null\` is an intentional assignment, meaning "empty" or "no value". When you explicitly set a state variable to \`null\`, you're saying, "I know this variable exists, but right now, it holds no meaningful data." This allows you to check for its presence (\`resource !== null\`) before attempting to use it.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", initializing with \`null\` is often preferred for data that will be fetched, as it clearly indicates that no data is present yet, but the variable itself exists.
- Checking \`if (variable !== null)\` is a common and safe way to ensure a variable holds a value before attempting to access its properties.
      `,
      quickRules: `
**Quick rules:**
- ✅ Use \`null\` as an intentional "empty" value for state that will eventually hold an object or complex data.
- ✅ Check for \`null\` explicitly (\`if (myVar !== null)\`) before accessing properties of potentially empty state.
- ✅ Understand that \`undefined\` typically means "not yet assigned" or "non-existent property".
- ✅ Use optional chaining (\`myVar?.property\`) to safely access properties of potentially \`null\` or \`undefined\` values.
- ❌ Avoid initializing state with \`undefined\` if you intend to later store an object; \`null\` is clearer.
- ❌ Never assume a variable has a value without checking if it could be \`null\` or \`undefined\`.
- ❌ Do not confuse \`null\` and \`undefined\` as interchangeable; they have distinct meanings and behaviors.
      `,
      watchOut: `👀 **Watch out:** While optional chaining (\`resource?.name\`) is a great way to safely access properties, it only prevents errors for \`null\` or \`undefined\` values. It doesn't tell you *why* the value is missing. For complex logic, explicitly checking \`fetchStatus\` (e.g., \`if (fetchStatus === FetchState.SUCCESS && resource)\`) provides more robust control over your UI.`,
      dryRun: `
🔁 **Think:** A component displays a user's email, which might not be available.
1.  **Initial State:** \`const [user, setUser] = useState<User | null>(null);\`. \`user\` is \`null\`.
2.  **Render Attempt 1:** JSX tries to render \`user.email\`. Since \`user\` is \`null\`, this would crash.
3.  **Corrected Render:** JSX uses \`user?.email\` or \`{user && <p>Email: {user.email}</p>}\`. No crash, nothing is displayed for email.
4.  **Data Fetched:** \`setUser({ name: 'Bob', email: 'bob@example.com' });\`. \`user\` is now an object.
5.  **Render Attempt 2:** JSX renders \`user?.email\` or \`{user && <p>Email: {user.email}</p>}\`. Now "Email: bob@example.com" is displayed.
(Hint: Trace how the presence of \`null\` or an object in \`user\` affects what is rendered, and how safe access patterns prevent errors.)
      `,
      build: "**Learning focus:** Declare state variables for the resource data and fetch status, and retrieve the resource ID from the URL.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 7",
    paal: "Before implementing the data fetching logic, let's set up the basic conditional rendering structure. We'll display different messages for loading, not found, and error states, and a placeholder for the actual resource content.",
    hint: "Use `if/else if` statements or conditional rendering in JSX to show different UI based on the `fetchStatus`.",
    example_code: `
function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);

  if (fetchStatus === FetchState.LOADING) {
    return <div>Loading resource...</div>;
  }

  if (fetchStatus === FetchState.NOT_FOUND) {
    return <div>Resource with ID '{id}' not found.</div>;
  }

  if (fetchStatus === FetchState.ERROR) {
    return <div>An error occurred while fetching the resource.</div>;
  }

  // Placeholder for successful content
  return (
    <div>
      <h1>Resource Detail for ID: {id}</h1>
      {resource && (
        <div>
          <p>Name: {resource.name}</p>
          <p>Description: {resource.description}</p>
          <p>Status: {resource.status}</p>
        </div>
      )}
    </div>
  );
}
    `,
    think_prompt: "How can you use the `fetchStatus` state to conditionally render different messages for loading, not found, and error, and then display the resource if successful?",
    mc_options: [
      "Use a switch statement on `fetchStatus` to return different JSX blocks.",
      "Use `if` statements at the top of the component to return early for loading, not found, and error states, then render resource details.",
      "Use ternary operators for all conditions within a single return statement.",
    ],
    mc_correct_option: "Use `if` statements at the top of the component to return early for loading, not found, and error states, then render resource details.",
    mc_anchor: "conditional-rendering-skeleton",
    why_this_matters: "Setting up the conditional rendering structure early ensures that your component can gracefully handle all possible states of an asynchronous operation. Returning early for loading, error, and not-found states simplifies the main success path, making the code easier to read and maintain.",
    answer_keywords: ["conditional rendering", "if statements", "return early", "fetchStatus", "loading", "not found", "error"],
    seed_code: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);

  return (
    <div>
      <h1>Resource Detail for ID: {id}</h1>
    </div>
  );
}
    `,
    starter_code: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);

  // Add conditional rendering logic here

  return (
    <div>
      <h1>Resource Detail for ID: {id}</h1>
    </div>
  );
}
    `,
    feedback_correct: "Excellent! Returning early for different `fetchStatus` values is a clean and effective way to manage conditional rendering.",
    feedback_partial: "You're on the right track with conditional rendering, but consider using early returns for the loading, not found, and error states to simplify the success path.",
    feedback_wrong: "While ternary operators can be used, for multiple distinct states that return entirely different JSX, early returns with `if` statements generally lead to more readable and maintainable code.",
    expected: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);

  if (fetchStatus === FetchState.LOADING) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading resource with ID '{id}'...</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.NOT_FOUND) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'orange' }}>
        <h2>Resource Not Found</h2>
        <p>The resource with ID '{id}' could not be located.</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.ERROR) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error</h2>
        <p>An unexpected error occurred while fetching the resource.</p>
      </div>
    );
  }

  // Render resource details if fetchStatus is SUCCESS and resource is not null
  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h1>Resource Details</h1>
      {resource && (
        <div>
          <p><strong>ID:</strong> {resource.id}</p>
          <p><strong>Name:</strong> {resource.name}</p>
          <p><strong>Description:</strong> {resource.description}</p>
          <p><strong>Status:</strong> {resource.status}</p>
        </div>
      )}
    </div>
  );
}
    `,
    analog_example: `
// In a different context, like displaying user authentication status:
import { useState } from 'react';

enum AuthStatus {
  CHECKING = 'CHECKING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
}

function AuthStatusDisplay() {
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.CHECKING);

  // Simulate async auth check
  useState(() => {
    setTimeout(() => {
      const isAuthenticated = Math.random() > 0.5; // Randomly authenticate
      setStatus(isAuthenticated ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED);
    }, 1500);
  }, []);

  if (status === AuthStatus.CHECKING) {
    return <p>Checking authentication status...</p>;
  }

  if (status === AuthStatus.UNAUTHENTICATED) {
    return <p style={{ color: 'red' }}>You are not logged in.</p>;
  }

  return <p style={{ color: 'green' }}>Welcome, you are authenticated!</p>;
}
    `,
    deepDiveLabel: "What are the advantages of 'early return' for conditional rendering?",
    deepDive: {
      hook: `
Imagine you're a bouncer at a club. Your job is to let people in, but only if they meet certain criteria (age, dress code, guest list). If you had to check *all* criteria for *everyone* before deciding anything, even for someone clearly underage, your job would be incredibly inefficient and confusing. Instead, you check the easiest criteria first: "Are you 18?" If not, "Sorry, you can't come in." You don't bother checking their dress code or if they're on the guest list. This "early exit" strategy makes your job much simpler and faster.

In component rendering, if you have multiple conditions (loading, error, not found) that prevent the main content from being displayed, checking them all and then nesting your main content deep inside \`if/else if/else\` blocks can lead to deeply indented, hard-to-read code. It forces you to mentally track many conditions simultaneously to understand the final rendering path.
      `,
      pain: `⚠️ **Lesson:** Deeply nested conditional logic for mutually exclusive states makes code harder to read, understand, and maintain. Symptom: Excessive indentation, complex boolean expressions, and difficulty tracing the rendering path for different scenarios.`,
      mentalModel: `**Mental model:** The "Guard Clause" for Rendering. Think of early returns as "guard clauses" at the beginning of your component's render logic. Each guard checks for a specific, critical state (like loading or an error) that prevents the component from rendering its primary content. If a guard condition is met, the component immediately returns the appropriate UI for that state, effectively "exiting early" from the render function. This leaves the remaining code path (after all guards) to deal *only* with the "happy path" – the successful rendering of the main content – making it much cleaner.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `
**Quick rules:**
- ✅ Use early returns for distinct, mutually exclusive states like loading, error, or empty data.
- ✅ Place guard clauses at the top of your component's render function.
- ✅ Ensure each guard returns a complete JSX element for its specific state.
- ✅ Reserve the final return statement for the "happy path" (successful rendering of main content).
- ❌ Avoid deeply nested \`if/else if/else\` structures when early returns can simplify the logic.
- ❌ Do not mix early returns with complex ternary chains for the same set of conditions.
- ❌ Never forget to return JSX from each guard clause; otherwise, the component will render nothing.
      `,
      watchOut: `👀 **Watch out:** While early returns are great, ensure that any state updates or effects that *must* run regardless of the render path are placed before these guards, or are handled within \`useEffect\` with appropriate dependencies. If a guard prevents an effect from running when it should, you might introduce bugs.`,
      dryRun: `
🔁 **Think:** A component needs to display a message based on its \`status\` prop.
1.  **Initial Render:** \`status\` is \`LOADING\`.
2.  **Guard 1 (\`if (status === 'LOADING')\`):** Condition is true. Component immediately returns \`<p>Loading...</p>\`. The rest of the function is skipped.
3.  **Next Render:** \`status\` changes to \`ERROR\`.
4.  **Guard 1 (\`if (status === 'LOADING')\`):** Condition is false.
5.  **Guard 2 (\`if (status === 'ERROR')\`):** Condition is true. Component immediately returns \`<p>Error!</p>\`. The rest of the function is skipped.
6.  **Next Render:** \`status\` changes to \`SUCCESS\`.
7.  **Guard 1:** False.
8.  **Guard 2:** False.
9.  **Final Return:** Component returns the main content, e.g., \`<p>Data loaded.</p>\`.
(Hint: Observe how the component exits immediately once a matching guard condition is met, preventing unnecessary checks.)
      `,
      build: "**Learning focus:** Implement conditional rendering using early returns for loading, not found, and error states.",
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 7",
    paal: "Now, let's implement the data fetching logic using `useEffect`. This effect will run when the component mounts or when the `id` from the URL changes. Inside it, we'll fetch the resource, handle success, 404 not found, and general error cases.",
    hint: "Remember to use an `async` function inside `useEffect` and handle `try/catch` for errors, and check `response.ok` for HTTP status codes.",
    example_code: `
function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);

  useEffect(() => {
    const fetchResource = async () => {
      setFetchStatus(FetchState.LOADING);
      setResource(null); // Clear previous resource data

      if (!id) {
        setFetchStatus(FetchState.NOT_FOUND); // Or ERROR, depending on desired behavior for missing ID
        return;
      }

      try {
        const response = await fetch(\`/api/resources/\${id}\`);

        if (response.status === 404) {
          setFetchStatus(FetchState.NOT_FOUND);
          return;
        }

        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }

        const data: Resource = await response.json();
        setResource(data);
        setFetchStatus(FetchState.SUCCESS);
      } catch (error) {
        console.error("Failed to fetch resource:", error);
        setFetchStatus(FetchState.ERROR);
      }
    };

    fetchResource();
  }, [id]); // Re-run effect when ID changes

  if (fetchStatus === FetchState.LOADING) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading resource with ID '{id}'...</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.NOT_FOUND) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'orange' }}>
        <h2>Resource Not Found</h2>
        <p>The resource with ID '{id}' could not be located.</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.ERROR) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error</h2>
        <p>An unexpected error occurred while fetching the resource.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h1>Resource Details</h1>
      {resource && (
        <div>
          <p><strong>ID:</strong> {resource.id}</p>
          <p><strong>Name:</strong> {resource.name}</p>
          <p><strong>Description:</strong> {resource.description}</p>
          <p><strong>Status:</strong> {resource.status}</p>
        </div>
      )}
    </div>
  );
}
    `,
    think_prompt: "How do you use `useEffect` to fetch data based on the `id` from `useParams`, handling loading, 404, and general error states?",
    mc_options: [
      "Call `fetch` directly in the component body, then update state with `setTimeout`.",
      "Use `useEffect` with an empty dependency array, and manually check `id` changes inside.",
      "Define an `async` function inside `useEffect`, call it, and update `fetchStatus` and `resource` based on `fetch` response, including 404 and `try/catch` for errors, with `[id]` as dependency.",
    ],
    mc_correct_option: "Define an `async` function inside `useEffect`, call it, and update `fetchStatus` and `resource` based on `fetch` response, including 404 and `try/catch` for errors, with `[id]` as dependency.",
    mc_anchor: "fetch-logic",
    why_this_matters: "This step is the core of the detail screen. `useEffect` ensures data fetching happens at the right time (on mount or ID change). Robust error handling, including specific checks for 404, provides a resilient and user-friendly experience, preventing crashes and giving clear feedback.",
    answer_keywords: ["useEffect", "fetch", "async/await", "try/catch", "response.status", "404", "dependency array", "id"],
    seed_code: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);

  if (fetchStatus === FetchState.LOADING) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading resource with ID '{id}'...</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.NOT_FOUND) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'orange' }}>
        <h2>Resource Not Found</h2>
        <p>The resource with ID '{id}' could not be located.</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.ERROR) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error</h2>
        <p>An unexpected error occurred while fetching the resource.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h1>Resource Details</h1>
      {resource && (
        <div>
          <p><strong>ID:</strong> {resource.id}</p>
          <p><strong>Name:</strong> {resource.name}</p>
          <p><strong>Description:</strong> {resource.description}</p>
          <p><strong>Status:</strong> {resource.status}</p>
        </div>
      )}
    </div>
  );
}
    `,
    starter_code: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);

  // Add data fetching logic using useEffect here

  if (fetchStatus === FetchState.LOADING) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading resource with ID '{id}'...</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.NOT_FOUND) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'orange' }}>
        <h2>Resource Not Found</h2>
        <p>The resource with ID '{id}' could not be located.</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.ERROR) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error</h2>
        <p>An unexpected error occurred while fetching the resource.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h1>Resource Details</h1>
      {resource && (
        <div>
          <p><strong>ID:</strong> {resource.id}</p>
          <p><strong>Name:</strong> {resource.name}</p>
          <p><strong>Description:</strong> {resource.description}</p>
          <p><strong>Status:</strong> {resource.status}</p>
        </div>
      )}
    </div>
  );
}
    `,
    feedback_correct: "Fantastic! This `useEffect` correctly fetches data, handles 404s, and catches general errors, updating the `fetchStatus` and `resource` states appropriately.",
    feedback_partial: "You've got the `useEffect` structure right, but ensure you're explicitly checking for a 404 status code and handling general fetch errors with `try/catch`.",
    feedback_wrong: "Calling `fetch` directly in the component body or with an empty dependency array will lead to infinite re-renders or stale data. `useEffect` with `async/await` and proper error handling is essential for robust data fetching.",
    expected: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);

  useEffect(() => {
    const fetchResource = async () => {
      setFetchStatus(FetchState.LOADING);
      setResource(null); // Clear previous resource data when ID changes

      if (!id) {
        setFetchStatus(FetchState.NOT_FOUND); // Or ERROR, depending on desired behavior for missing ID
        return;
      }

      try {
        const response = await fetch(\`/api/resources/\${id}\`);

        if (response.status === 404) {
          setFetchStatus(FetchState.NOT_FOUND);
          return;
        }

        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }

        const data: Resource = await response.json();
        setResource(data);
        setFetchStatus(FetchState.SUCCESS);
      } catch (error) {
        console.error("Failed to fetch resource:", error);
        setFetchStatus(FetchState.ERROR);
      }
    };

    fetchResource();
  }, [id]); // Re-run effect when ID changes

  if (fetchStatus === FetchState.LOADING) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading resource with ID '{id}'...</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.NOT_FOUND) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'orange' }}>
        <h2>Resource Not Found</h2>
        <p>The resource with ID '{id}' could not be located.</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.ERROR) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error</h2>
        <p>An unexpected error occurred while fetching the resource.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h1>Resource Details</h1>
      {resource && (
        <div>
          <p><strong>ID:</strong> {resource.id}</p>
          <p><strong>Name:</strong> {resource.name}</p>
          <p><strong>Description:</strong> {resource.description}</p>
          <p><strong>Status:</strong> {resource.status}</p>
        </div>
      )}
    </div>
  );
}
    `,
    analog_example: `
// In a different context, fetching a list of items with search:
import { useState, useEffect } from 'react';

interface Item {
  id: string;
  title: string;
}

function ItemList({ searchTerm }: { searchTerm: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const query = searchTerm ? \`?q=\${searchTerm}\` : '';
        const response = await fetch(\`/api/items\${query}\`);
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data: Item[] = await response.json();
        setItems(data);
      } catch (err) {
        setError('Could not load items.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [searchTerm]); // Re-fetch when search term changes

  if (isLoading) return <p>Loading items...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (items.length === 0) return <p>No items found.</p>;

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}
    `,
    deepDiveLabel: "How does `useEffect` handle race conditions in data fetching?",
    deepDive: {
      hook: `
Imagine you're ordering food from two different restaurants simultaneously. You send an order to Restaurant A, then immediately send another order to Restaurant B. Both restaurants start preparing your food. If Restaurant B is faster, its food might arrive first. But then, a moment later, Restaurant A's food arrives. If your goal was to eat *only* the food from the *last* restaurant you ordered from, you'd have a problem: the earlier, slower order "won" the race and delivered its food last, overriding your preference.

In data fetching, especially when a user quickly navigates between different detail pages (changing the ID in the URL), multiple \`fetch\` requests might be initiated. If an earlier request is slower than a later one, its response might arrive *after* the later request's response, inadvertently updating your component's state with outdated data. This is a "race condition," and it can lead to your UI displaying incorrect information, confusing users, and creating hard-to-debug inconsistencies.
      `,
      pain: `⚠️ **Lesson:** Multiple asynchronous operations triggered by rapidly changing dependencies can lead to race conditions, where an older, slower response overwrites newer, correct data. Symptom: UI displaying stale data after quick navigation or multiple rapid updates.`,
      mentalModel: `**Mental model:** The "Cancellation Token" for Effects. Think of \`useEffect\` as having an internal "cancellation token" or "cleanup mechanism." When the dependencies of an \`useEffect\` change (e.g., the \`id\` changes), React "cleans up" the *previous* effect before running the *new* one. This cleanup phase is where you can signal to any ongoing asynchronous operations from the *previous* effect that their results are no longer relevant. By using a cleanup function to set a flag, you can prevent state updates from older, slower fetches, ensuring only the most recent fetch's data is applied.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", \`setFetchStatus\`), the flag is checked. If \`isMounted\` is \`false\`, it means the current effect run is no longer the active one, and its results should be ignored.
- This pattern ensures that only the response from the *latest* active \`useEffect\` call updates the component's state.
      `,
      quickRules: `
**Quick rules:**
- ✅ Use a cleanup function in \`useEffect\` to prevent state updates from stale asynchronous operations.
- ✅ Declare a local flag (e.g., \`isMounted\`) within the \`useEffect\` callback.
- ✅ Set the flag to \`false\` in the cleanup function.
- ✅ Check the flag before calling any state setters within your async logic.
- ❌ Do not rely solely on the dependency array to prevent race conditions; cleanup is often necessary.
- ❌ Avoid updating state directly after an async call without checking if the component/effect is still relevant.
- ❌ Never forget to return the cleanup function from \`useEffect\` when dealing with async operations that might outlive the component's render cycle.
      `,
      watchOut: `👀 **Watch out:** While the \`isMounted\` flag pattern is effective, it's important to understand that it only prevents *state updates* from stale requests. It doesn't *cancel* the underlying network request itself. For true cancellation, you would need to use browser APIs like \`AbortController\` with your \`fetch\` calls, which is a more advanced technique.`,
      dryRun: `
🔁 **Think:** User navigates from /resource/1 to /resource/2 very quickly.
1.  **Mount /resource/1:** \`id\` is '1'. \`useEffect\` runs. \`isMounted\` = \`true\`. \`fetchResource('1')\` starts. \`setFetchStatus(LOADING)\`.
2.  **Navigate to /resource/2:** \`id\` changes to '2'.
3.  **Cleanup for /resource/1:** The cleanup function for the '1' effect runs. \`isMounted\` for the '1' effect becomes \`false\`.
4.  **Run /resource/2 effect:** \`useEffect\` runs again for \`id\` '2'. A *new* \`isMounted\` = \`true\` is created. \`fetchResource('2')\` starts. \`setFetchStatus(LOADING)\`.
5.  **Response for /resource/1 arrives (late):** The \`fetchResource('1')\` promise resolves. Inside its \`then\` block, it checks \`if (!isMounted) return;\`. Since \`isMounted\` for *that specific effect run* is now \`false\`, \`setResource\` and \`setFetchStatus\` are *not* called.
6.  **Response for /resource/2 arrives:** The \`fetchResource('2')\` promise resolves. Inside its \`then\` block, it checks \`if (!isMounted) return;\`. Since \`isMounted\` for *this specific effect run* is still \`true\`, \`setResource\` and \`setFetchStatus\` are called with the data for '2'.
(Hint: Notice how the \`isMounted\` flag, local to each effect run, prevents the stale response from '1' from updating the state.)
      `,
      build: "**Learning focus:** Implement the data fetching logic within `useEffect`, handling loading, 404, and general error states, and updating component state accordingly.",
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 7",
    paal: "Finally, let's ensure our component is fully wired up. The conditional rendering logic is already in place, but we need to make sure the `resource` data is correctly displayed when `fetchStatus` is `SUCCESS`.",
    hint: "Review the JSX in the 'success' path and ensure all `resource` properties are rendered correctly.",
    example_code: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);

  useEffect(() => {
    const fetchResource = async () => {
      setFetchStatus(FetchState.LOADING);
      setResource(null);

      if (!id) {
        setFetchStatus(FetchState.NOT_FOUND);
        return;
      }

      try {
        const response = await fetch(\`/api/resources/\${id}\`);

        if (response.status === 404) {
          setFetchStatus(FetchState.NOT_FOUND);
          return;
        }

        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }

        const data: Resource = await response.json();
        setResource(data);
        setFetchStatus(FetchState.SUCCESS);
      } catch (error) {
        console.error("Failed to fetch resource:", error);
        setFetchStatus(FetchState.ERROR);
      }
    };

    fetchResource();
  }, [id]);

  if (fetchStatus === FetchState.LOADING) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading resource with ID '{id}'...</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.NOT_FOUND) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'orange' }}>
        <h2>Resource Not Found</h2>
        <p>The resource with ID '{id}' could not be located.</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.ERROR) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error</h2>
        <p>An unexpected error occurred while fetching the resource.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h1>Resource Details</h1>
      {resource && (
        <div>
          <p><strong>ID:</strong> {resource.id}</p>
          <p><strong>Name:</strong> {resource.name}</p>
          <p><strong>Description:</strong> {resource.description}</p>
          <p><strong>Status:</strong> {resource.status}</p>
        </div>
      )}
    </div>
  );
}
    `,
    think_prompt: "Confirm that the JSX for the `SUCCESS` state correctly displays all properties of the `resource` object, ensuring it's not `null`.",
    mc_options: [
      "The JSX correctly uses `resource &&` to conditionally render details and accesses `resource.id`, `resource.name`, `resource.description`, and `resource.status`.",
      "The JSX only displays `resource.name` and `resource.id`, missing other details.",
      "The JSX attempts to access `resource.property` directly without checking if `resource` is `null`.",
    ],
    mc_correct_option: "The JSX correctly uses `resource &&` to conditionally render details and accesses `resource.id`, `resource.name`, `resource.description`, and `resource.status`.",
    mc_anchor: "wire-handlers",
    why_this_matters: "The final step is to ensure the UI accurately reflects the fetched data. By conditionally rendering `resource` properties only when `resource` is not `null` (which implies `fetchStatus` is `SUCCESS`), we prevent runtime errors and present a complete, accurate detail view to the user.",
    answer_keywords: ["JSX", "conditional rendering", "resource properties", "display data", "success state"],
    seed_code: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);

  useEffect(() => {
    const fetchResource = async () => {
      setFetchStatus(FetchState.LOADING);
      setResource(null);

      if (!id) {
        setFetchStatus(FetchState.NOT_FOUND);
        return;
      }

      try {
        const response = await fetch(\`/api/resources/\${id}\`);

        if (response.status === 404) {
          setFetchStatus(FetchState.NOT_FOUND);
          return;
        }

        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }

        const data: Resource = await response.json();
        setResource(data);
        setFetchStatus(FetchState.SUCCESS);
      } catch (error) {
        console.error("Failed to fetch resource:", error);
        setFetchStatus(FetchState.ERROR);
      }
    };

    fetchResource();
  }, [id]);

  if (fetchStatus === FetchState.LOADING) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading resource with ID '{id}'...</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.NOT_FOUND) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'orange' }}>
        <h2>Resource Not Found</h2>
        <p>The resource with ID '{id}' could not be located.</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.ERROR) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error</h2>
        <p>An unexpected error occurred while fetching the resource.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h1>Resource Details</h1>
      {resource && (
        <div>
          <p><strong>ID:</strong> {resource.id}</p>
          <p><strong>Name:</strong> {resource.name}</p>
          <p><strong>Description:</strong> {resource.description}</p>
          <p><strong>Status:</strong> {resource.status}</p>
        </div>
      )}
    </div>
  );
}
    `,
    starter_code: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);

  useEffect(() => {
    const fetchResource = async () => {
      setFetchStatus(FetchState.LOADING);
      setResource(null);

      if (!id) {
        setFetchStatus(FetchState.NOT_FOUND);
        return;
      }

      try {
        const response = await fetch(\`/api/resources/\${id}\`);

        if (response.status === 404) {
          setFetchStatus(FetchState.NOT_FOUND);
          return;
        }

        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }

        const data: Resource = await response.json();
        setResource(data);
        setFetchStatus(FetchState.SUCCESS);
      } catch (error) {
        console.error("Failed to fetch resource:", error);
        setFetchStatus(FetchState.ERROR);
      }
    };

    fetchResource();
  }, [id]);

  if (fetchStatus === FetchState.LOADING) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading resource with ID '{id}'...</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.NOT_FOUND) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'orange' }}>
        <h2>Resource Not Found</h2>
        <p>The resource with ID '{id}' could not be located.</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.ERROR) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error</h2>
        <p>An unexpected error occurred while fetching the resource.</p>
      </div>
    );
  }

  // Ensure resource details are correctly displayed here
  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h1>Resource Details</h1>
      {/* Add resource display logic */}
    </div>
  );
}
    `,
    feedback_correct: "Perfect! The resource details are correctly rendered, ensuring a complete and robust detail screen.",
    feedback_partial: "You're almost there! Double-check that all properties of the `resource` object are being displayed in the success state.",
    feedback_wrong: "The current JSX for the success state is incomplete or attempts to access `resource` properties without a null check, which could lead to errors. Ensure `resource &&` is used.",
    expected: `
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

enum FetchState {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  NOT_FOUND = 'NOT_FOUND',
}

function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [fetchStatus, setFetchStatus] = useState<FetchState>(FetchState.LOADING);

  useEffect(() => {
    const fetchResource = async () => {
      setFetchStatus(FetchState.LOADING);
      setResource(null);

      if (!id) {
        setFetchStatus(FetchState.NOT_FOUND);
        return;
      }

      try {
        const response = await fetch(\`/api/resources/\${id}\`);

        if (response.status === 404) {
          setFetchStatus(FetchState.NOT_FOUND);
          return;
        }

        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }

        const data: Resource = await response.json();
        setResource(data);
        setFetchStatus(FetchState.SUCCESS);
      } catch (error) {
        console.error("Failed to fetch resource:", error);
        setFetchStatus(FetchState.ERROR);
      }
    };

    fetchResource();
  }, [id]);

  if (fetchStatus === FetchState.LOADING) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading resource with ID '{id}'...</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.NOT_FOUND) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'orange' }}>
        <h2>Resource Not Found</h2>
        <p>The resource with ID '{id}' could not be located.</p>
      </div>
    );
  }

  if (fetchStatus === FetchState.ERROR) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error</h2>
        <p>An unexpected error occurred while fetching the resource.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <h1>Resource Details</h1>
      {resource && (
        <div>
          <p><strong>ID:</strong> {resource.id}</p>
          <p><strong>Name:</strong> {resource.name}</p>
          <p><strong>Description:</strong> {resource.description}</p>
          <p><strong>Status:</strong> {resource.status}</p>
        </div>
      )}
    </div>
  );
}
    `,
    analog_example: `
// In a different context, displaying user information after a successful login:
import { useState, useEffect } from 'react';

interface UserInfo {
  username: string;
  lastLogin: string;
}

function UserDashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Simulate checking login status and fetching user info
    const checkLogin = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      const user = { username: 'Alice', lastLogin: '2023-10-26 10:30 AM' }; // Mock data
      setUserInfo(user);
      setIsLoggedIn(true);
    };
    checkLogin();
  }, []);

  if (!isLoggedIn) {
    return <p>Please log in to view your dashboard.</p>;
  }

  return (
    <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '5px' }}>
      <h2>Welcome, {userInfo?.username || 'Guest'}!</h2>
      {userInfo && (
        <>
          <p>Your last login was: {userInfo.lastLogin}</p>
          <p>Here's your personalized content...</p>
        </>
      )}
    </div>
  );
}
    `,
    deepDiveLabel: "What is the significance of `resource &&` in JSX rendering?",
    deepDive: {
      hook: `
Imagine you're trying to read instructions from a manual, but you're not sure if you even *have* the manual. If you just blindly try to read "page 5" or "chapter 2," you'll get frustrated and potentially break something if the manual isn't there. Instead, you'd first check: "Do I have the manual?" If yes, *then* you'd proceed to read its contents.

In JSX, when you have a variable that might be \`null\` or \`undefined\` (like \`resource\` before data is fetched), trying to access its properties directly (e.g., \`resource.name\`) will cause a runtime error. This is a common pitfall for beginners, leading to "Cannot read properties of null" or "Cannot read properties of undefined" errors that crash the application. You need a safe way to ensure the data exists before attempting to render it.
      `,
      pain: `⚠️ **Lesson:** Attempting to access properties of a \`null\` or \`undefined\` object in JSX will cause runtime errors and crash the application. Symptom: "Cannot read properties of null (reading 'name')" or similar errors in the console, leading to a blank or broken UI.`,
      mentalModel: `**Mental model:** The "Conditional Gatekeeper" for Rendering. Think of \`resource && <JSX>\` as a gatekeeper. The \`&&\` (logical AND) operator in JavaScript works from left to right. If the left-hand side (\`resource\`) is a "falsy" value (like \`null\`, \`undefined\`, \`false\`, \`0\`, \`''\`), the expression short-circuits, and the right-hand side (\`<JSX>\`) is never evaluated or rendered. If the left-hand side is "truthy" (like an object or a non-empty string), then the right-hand side is evaluated and rendered. This effectively acts as a conditional gate, only allowing the JSX to pass through if \`resource\` actually holds data.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", \`undefined\`, \`false\`, \`0\`, \`""\`), the expression after \`&&\` is ignored, and nothing is rendered.
- If the expression before \`&&\` is truthy, the expression after \`&&\` is evaluated and rendered.
- This is a concise way to conditionally render blocks of JSX only when certain data is available.
      `,
      quickRules: `
**Quick rules:**
- ✅ Use \`{condition && <JSX>}\` to render JSX only when \`condition\` is truthy.
- ✅ Ensure the \`condition\` evaluates to a boolean or a truthy/falsy value.
- ✅ Use this pattern for optional elements or blocks that depend on data availability.
- ✅ Combine with optional chaining (\`resource?.name\`) for accessing properties within the conditionally rendered JSX.
- ❌ Avoid using \`{condition && 'string'}\` if \`condition\` can be \`0\`, as \`0\` will be rendered.
- ❌ Do not attempt to access properties of a variable directly if it might be \`null\` or \`undefined\` without a preceding check.
- ❌ Never rely on \`&&\` for complex \`if/else\` logic where multiple distinct UIs are needed; use early returns or ternary operators for that.
      `,
      watchOut: `👀 **Watch out:** While \`{condition && <JSX>}\` is common, be careful if \`condition\` can evaluate to \`0\`. For example, \`{itemCount && <p>Items: {itemCount}</p>}\` will render \`0\` if \`itemCount\` is \`0\`, which might not be desired. In such cases, explicitly convert to a boolean (\`!!itemCount && <JSX>\`) or use a comparison (\`itemCount > 0 && <JSX>\`).`,
      dryRun: `
🔁 **Think:** A component tries to display a user's name.
1.  **Initial State:** \`const user = null;\`.
2.  **JSX Evaluation:** \`{user && <p>Name: {user.name}</p>}\`.
    *   Left side (\`user\`) is \`null\` (falsy).
    *   The expression short-circuits. The right side (\`<p>Name: {user.name}</p>\`) is *not* evaluated. Nothing is rendered. No error.
3.  **State Update:** \`const user = { name: 'Bob' };\`.
4.  **JSX Re-evaluation:** \`{user && <p>Name: {user.name}</p>}\`.
    *   Left side (\`user\`) is \`{ name: 'Bob' }\` (truthy).
    *   The expression continues. The right side (\`<p>Name: {user.name}</p>\`) is evaluated.
    *   It renders \`<p>Name: Bob</p>\`.
(Hint: Trace how the \`&&\` operator acts as a gate, preventing the right-hand side from being processed when \`user\` is \`null\`.)
      `,
      build: "**Learning focus:** Ensure the `ResourceDetail` component correctly displays all fetched resource properties in the success state, using conditional rendering to prevent errors.",
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Imports", id: "step1" },
  { label: "Types & Enums", id: "step2" },
  { label: "Component Shell", id: "step3" },
  { label: "State Variables", id: "step4" },
  { label: "Conditional Render Skeleton", id: "step5" },
  { label: "Fetch Logic", id: "step6" },
  { label: "Wire to Structure", id: "step7" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Detail Screen with Loading and Not-Found States",
  shortName: "Detail Screen",
});
