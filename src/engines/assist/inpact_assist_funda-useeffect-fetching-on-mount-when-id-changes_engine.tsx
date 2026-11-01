import createINPACTEngine from "../inpact_engine_shared";

// Define a generic interface for the item we'll be fetching.
interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "funda-useeffect-fetching-on-mount-when-id-changes",
      title: "Fetch Data on Mount or ID Change with useEffect",
      body: `When building interactive applications, you often need to load data from a server as soon as a component appears on the screen, or whenever a specific piece of information, like an item's ID, changes. This initial data fetching is crucial for displaying relevant content to the user, whether it's a list of items, details of a selected item, or configuration settings. Without a mechanism to trigger these data requests at the right time, your components would render empty or outdated information, leading to a poor user experience. The challenge lies in performing these "side effects" – operations that interact with the outside world, like network requests – without causing infinite loops or unnecessary re-renders.

      This pattern is fundamental across almost all modern web applications. You'll encounter it when building a user profile page that loads the user's details, a product detail page that fetches information for a specific product ID, or a dashboard that displays analytics based on a selected time range. Any time a component needs to synchronize its internal state with external data, especially when that data depends on props or other state variables, understanding how to manage these effects is essential. Mastering this technique allows you to create dynamic, data-driven UIs that respond intelligently to user interactions and application state changes.`,
      usecase: "A component that displays the details of a selected item, fetching new data whenever the item's unique identifier changes.",
      designMock: {"kind":"list-and-form","screenTitle":"Item Manager","caption":"Manage items: view a list, add new ones, and toggle their status. Toggling status implies fetching/updating details.","listCaption":"Current Items","emptyCaption":"No Items Yet","emptyMessage":"Add an item to get started.","rows":[{"title":"Widget Alpha","subtitle":"ID: w-001","meta":"Active"},{"title":"Gadget Beta","subtitle":"ID: g-002","meta":"Archived"}],"fields":[{"label":"Item Name","sample":"New Widget"},{"label":"Item ID","sample":"w-003"}],"submitLabel":"Add Item","rowToggle":{"values":["Active","Archived"],"labels":{"Active":"Archive Item","Archived":"Activate Item"},"subtitleValues":["ID: w-001","ID: g-002"]},"metaFromField":{"index":1,"whenFilled":"Active","whenEmpty":"Archived"}}
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Understand why `useEffect` is necessary for data fetching.",
      "Implement `useEffect` to fetch data when a component mounts.",
      "Configure `useEffect` to re-fetch data when a specific prop (like an ID) changes.",
      "Handle loading and error states during data fetching.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 7",
    paal: "To manage side effects like data fetching in a functional component, you need to import specific hooks. Which hooks are essential for managing state and performing effects?",
    hint: "Think about the hooks used for state management and side effects in React.",
    example_code: `import { useState, useEffect } from 'react';`,
    think_prompt: "Select the correct import statement for state and effect hooks.",
    mc_options: [
      "import { useState, useEffect } from 'react';",
      "import { useData, useMount } from 'react';",
      "import { useReducer, useCallback } from 'react';",
    ],
    mc_correct_option: "import { useState, useEffect } from 'react';",
    mc_anchor: "import-statement",
    why_this_matters: "Importing `useState` allows your component to hold and update data that changes over time, while `useEffect` provides a way to run code after every render, making it perfect for synchronizing with external systems like APIs.",
    answer_keywords: ["useState", "useEffect", "import"],
    seed_code: "",
    starter_code: `// Add the necessary imports here
`,
    feedback_correct: "Excellent! `useState` is for managing component-specific state, and `useEffect` is for handling side effects like data fetching, subscriptions, or manually changing the DOM.",
    feedback_partial: "You're on the right track with hooks, but ensure you're importing the standard hooks for state and effects. Double-check the exact names.",
    feedback_wrong: "`useData` and `useMount` are not standard React hooks. `useState` and `useEffect` are the correct ones for managing state and side effects.",
    expected: `import { useState, useEffect } from 'react';`,
    analog_example: `import { useState, useEffect } from 'react';

function DocumentTitleUpdater() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  }, [count]); // Re-run effect when count changes

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
    deepDiveLabel: "Why do we need special hooks for effects?",
    deepDive: {
      hook: `Imagine you're building a complex application, perhaps a social media feed. When a user logs in, you need to fetch their posts, their friends' updates, and their notifications. If you just put the data fetching logic directly inside your component's main body, it would run *every single time* the component re-renders. This means if a user types in a search bar, or clicks a like button, your app would unnecessarily re-fetch all the data again, even if it hasn't changed. This would be incredibly inefficient, slow down your application, and potentially hit API rate limits. You need a way to say, "Hey, only fetch this data when the component first appears, or when a specific piece of information (like the user's ID) changes, not on every single update."`,
      pain: `⚠️ **Lesson:** Running side effects directly in the component body leads to uncontrolled execution. Symptom: Infinite loops, excessive network requests, performance degradation, and unexpected behavior as effects re-run on every render.`,
      mentalModel: `**Mental model:** The "Effect Synchronizer." Think of \`useEffect\` as a dedicated manager that synchronizes your component with the outside world. It doesn't just run code; it *observes* specific values (its dependencies) and only triggers its "synchronization task" (the effect function) when those observed values change. This prevents unnecessary re-synchronization, much like a smart assistant only updates your calendar when a meeting actually changes, not every time you glance at it.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Always import \`useState\` and \`useEffect\` from 'react' when you need state or side effects.
- ✅ Use \`useState\` for any data that needs to persist across renders and trigger re-renders when it changes.
- ✅ Use \`useEffect\` for operations that interact with the browser, network, or other external systems.
- ❌ Never try to define state or effects without importing the corresponding hooks.
- ❌ Avoid using class component lifecycle methods (\`componentDidMount\`, \`componentDidUpdate\`) in functional components; \`useEffect\` replaces them.
- ❌ Do not import \`React.FC\` or \`JSX.Element\` as they are globally available or deprecated patterns.`,
      watchOut: `👀 **Watch out:** Forgetting to import hooks, or misspelling their names, will result in runtime errors like "useState is not defined" or "useEffect is not a function." Always ensure your import statement is correct and complete.`,
      dryRun: `🔁 **Think:** If I have a component that needs to display a user's name and also fetch their profile picture from an API, I'll need \`useState\` to hold the user's name and picture URL, and \`useEffect\` to perform the API call. Without these imports, the component wouldn't be able to manage its dynamic data or interact with the network. (Hint: The imports are the entry point to these capabilities.)`,
      build: `**Learning focus:** Add the necessary import statements for \`useState\` and \`useEffect\` to enable state management and side effects.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 7",
    paal: "To ensure type safety and clarity for the data we'll fetch, it's good practice to define an interface for our item. Create a simple `Item` interface with `id`, `name`, `description`, and `status` properties.",
    hint: "Interfaces define the shape of an object. Think about the basic types for each property.",
    example_code: `interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}`,
    think_prompt: "Define the `Item` interface with the specified properties and their types.",
    mc_options: [
      `interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}`,
      `type Item = {
  itemId: number;
  itemName: any;
  itemDesc: string;
  itemStatus: string;
}`,
      `interface Item {
  id: any;
  name: string;
  details: string;
  state: string;
}`,
    ],
    mc_correct_option: `interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}`,
    mc_anchor: "item-interface",
    why_this_matters: "Defining interfaces provides strong type checking, catching errors early and making your code easier to understand and maintain. It clearly communicates the expected structure of your data.",
    answer_keywords: ["interface", "Item", "type safety"],
    seed_code: `import { useState, useEffect } from 'react';`,
    starter_code: `import { useState, useEffect } from 'react';

// Define the Item interface here
`,
    feedback_correct: "Perfect! This `Item` interface clearly defines the structure of the data we expect to fetch, improving type safety and code readability.",
    feedback_partial: "You've started defining the interface, but ensure all properties (`id`, `name`, `description`, `status`) are present and have appropriate, specific types.",
    feedback_wrong: "The interface should use `id`, `name`, `description`, and `status` with precise types like `string` and a union type for `status`. Avoid `any` for better type safety.",
    expected: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}`,
    analog_example: `interface UserProfile {
  userId: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

function displayUser(user: UserProfile) {
  console.log(\`User: \${user.username} (\${user.email})\`);
  if (user.isAdmin) {
    console.log("Administrator privileges.");
  }
}
`,
    deepDiveLabel: "Why use interfaces instead of just inferring types?",
    deepDive: {
      hook: `Imagine you're working on a large team project. One developer builds the backend API that sends data, and another builds the frontend component that displays it. If the backend developer changes the name of a field from \`productName\` to \`title\`, how does the frontend developer know? Without a shared contract, the frontend code might silently break, displaying empty fields or crashing, and it could take hours to debug. This problem scales with the complexity of your data and the size of your team. You need a way to explicitly declare the expected shape of your data, making changes visible and errors immediate.`,
      pain: `⚠️ **Lesson:** Implicit data structures lead to runtime errors and difficult debugging. Symptom: Type mismatches, unexpected \`undefined\` values, and silent failures when data shapes change between backend and frontend.`,
      mentalModel: `**Mental model:** The "Data Blueprint." An interface is like a blueprint for a house. It specifies exactly what rooms (properties) the house will have, what materials they're made of (types), and how they connect. Anyone building or inspecting the house can refer to this blueprint to ensure consistency and catch deviations early. It doesn't *build* the house, but it defines its expected structure, making it easier to reason about and validate.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Define an interface for any complex object structure that your component expects to receive or manage.
- ✅ Use specific types like \`string\`, \`number\`, \`boolean\`, or union types (e.g., \`'active' | 'archived'\`) instead of \`any\`.
- ✅ Ensure property names in the interface match the actual data structure from your API or source.
- ❌ Avoid using \`any\` unless absolutely necessary, as it defeats the purpose of type safety.
- ❌ Don't skip interfaces for data structures that are used in multiple places or are critical to your application logic.
- ❌ Do not define interfaces inside the component function itself; they should be at the module scope or imported.`,
      watchOut: `👀 **Watch out:** While interfaces are powerful, they are a compile-time construct. They don't exist at runtime. This means if your backend sends data that doesn't match the interface, TypeScript won't catch it at runtime. You still need runtime validation (e.g., using Zod or Yup) for robust applications, especially when dealing with external data.`,
      dryRun: `🔁 **Think:** If I define an \`Item\` interface with \`name: string\` and then try to assign an object \`{ name: 123 }\` to a variable of type \`Item\`, TypeScript will immediately flag an error. If I then change the interface to \`name: number\`, the error will disappear, but if I still pass a string, a new error will appear. This ensures the data's shape is always consistent with its usage. (Hint: The interface acts as a contract.)`,
      build: `**Learning focus:** Define a type-safe interface for the item data we will be fetching.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 7",
    paal: "Now, create the functional component shell. It should be named `ItemDetailFetcher` and accept a single prop: `itemId` of type `string`.",
    hint: "Functional components are JavaScript functions that return JSX. Remember to destructure props.",
    example_code: `function ItemDetailFetcher({ itemId }: { itemId: string }) {
  // Component logic will go here
  return (
    <div>
      <h2>Item Details</h2>
      <p>Fetching details for ID: {itemId}</p>
    </div>
  );
}`,
    think_prompt: "Write the basic functional component `ItemDetailFetcher` that takes `itemId` as a prop.",
    mc_options: [
      `function ItemDetailFetcher({ itemId }: { itemId: string }) {
  return (
    <div>
      <h2>Item Details</h2>
      <p>Fetching details for ID: {itemId}</p>
    </div>
  );
}`,
      `const ItemDetailFetcher = (props: any) => {
  return <p>Details</p>;
};`,
      `function ItemDetailFetcher(itemId: string) {
  return <div></div>;
}`,
    ],
    mc_correct_option: `function ItemDetailFetcher({ itemId }: { itemId: string }) {
  return (
    <div>
      <h2>Item Details</h2>
      <p>Fetching details for ID: {itemId}</p>
    </div>
  );
}`,
    mc_anchor: "component-shell",
    why_this_matters: "Defining a clear component signature with typed props ensures that the component receives the correct data, making it reusable and predictable. The `itemId` prop is the key to fetching specific item details.",
    answer_keywords: ["functional component", "props", "itemId", "type"],
    seed_code: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}`,
    starter_code: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

// Create the ItemDetailFetcher component here
`,
    feedback_correct: "Excellent! The `ItemDetailFetcher` component is correctly defined, accepting `itemId` as a typed prop. This sets the stage for fetching specific data.",
    feedback_partial: "You've created a functional component, but ensure it's named `ItemDetailFetcher`, accepts `itemId` as a destructured prop, and has proper type annotation for the prop.",
    feedback_wrong: "The component should be a functional component named `ItemDetailFetcher`, accepting `itemId` as a destructured prop with a `string` type. Avoid `any` for props.",
    expected: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

function ItemDetailFetcher({ itemId }: { itemId: string }) {
  // Component logic will go here
  return (
    <div>
      <h2>Item Details</h2>
      <p>Fetching details for ID: {itemId}</p>
    </div>
  );
}`,
    analog_example: `function GreetingCard({ name, message }: { name: string; message: string }) {
  return (
    <div style={{ border: '1px solid gray', padding: '10px' }}>
      <h3>Hello, {name}!</h3>
      <p>{message}</p>
    </div>
  );
}

// Usage: <GreetingCard name="Alice" message="Welcome!" />
`,
    deepDiveLabel: "Why pass data as props instead of global variables?",
    deepDive: {
      hook: `Imagine you're building a library of reusable UI components. You have a \`Button\` component, a \`Card\` component, and a \`Modal\` component. If each of these components relied on global variables for their text, colors, or visibility, they would be incredibly difficult to reuse. Every time you wanted a different button text or a different card image, you'd have to change a global variable, which would affect *all* instances of that component simultaneously. This leads to unpredictable behavior, makes testing a nightmare, and prevents you from having multiple instances of the same component with different configurations on the same screen.`,
      pain: `⚠️ **Lesson:** Relying on global variables for component configuration leads to tightly coupled, inflexible, and unpredictable components. Symptom: Components that are hard to reuse, unexpected side effects when one component changes a global state, and difficulty in isolating component behavior for testing.`,
      mentalModel: `**Mental model:** The "Component Configuration Panel." Think of props as the configuration panel for a component. Just like a TV has buttons and inputs (props) to control its volume, channel, and input source, a component uses props to receive all the data it needs to render itself and behave correctly. Each instance of the component gets its own independent configuration panel, allowing it to be customized without affecting other instances.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Pass all data a component needs to render and function as props.
- ✅ Destructure props in the function signature for cleaner access.
- ✅ Use TypeScript to define the type of your props for better developer experience and error checking.
- ❌ Avoid using global variables or directly accessing parent component state from within a child component.
- ❌ Do not modify props directly inside the component; props are read-only.
- ❌ Never define a component inside another component's render method unless it's a very specific, controlled pattern (e.g., render props).`,
      watchOut: `👀 **Watch out:** While props are read-only, if a prop is an object or array, you can accidentally mutate its *contents*. Always treat props as immutable. If you need to modify data received via props, make a copy first.`,
      dryRun: `🔁 **Think:** If \`ItemDetailFetcher\` is rendered with \`itemId="alpha"\`, the \`itemId\` prop inside the component will be \`"alpha"\`. If it's then re-rendered with \`itemId="beta"\`, the prop will update to \`"beta"\`. The component's output will reflect these changes, always displaying the current \`itemId\`. (Hint: Props are how components receive their dynamic data.)`,
      build: `**Learning focus:** Create the functional component \`ItemDetailFetcher\` and define its \`itemId\` prop.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 7",
    paal: "Inside `ItemDetailFetcher`, declare state variables to hold the fetched `item` data, a `loading` status, and any `error` message. Initialize `item` to `null`, `loading` to `true`, and `error` to `null`.",
    hint: "Use the `useState` hook for each piece of state. Remember to specify the type for `item` using the `Item` interface.",
    example_code: `function ItemDetailFetcher({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Component logic will go here
  return (
    <div>
      <h2>Item Details</h2>
      <p>Fetching details for ID: {itemId}</p>
    </div>
  );
}`,
    think_prompt: "Add `useState` declarations for `item`, `loading`, and `error` with their initial values and types.",
    mc_options: [
      `  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);`,
      `  let item = null;
  let loading = true;
  let error = null;`,
      `  const item = useState<Item | null>(null);
  const loading = useState(true);
  const error = useState<string | null>(null);`,
    ],
    mc_correct_option: `  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);`,
    mc_anchor: "state-declarations",
    why_this_matters: "Managing loading, error, and data states explicitly provides clear feedback to the user during asynchronous operations. `useState` ensures these values persist across re-renders and trigger updates when they change.",
    answer_keywords: ["useState", "item", "loading", "error", "initial state"],
    seed_code: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

function ItemDetailFetcher({ itemId }: { itemId: string }) {
  // Component logic will go here
  return (
    <div>
      <h2>Item Details</h2>
      <p>Fetching details for ID: {itemId}</p>
    </div>
  );
}`,
    starter_code: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

function ItemDetailFetcher({ itemId }: { itemId: string }) {
  // Declare state variables here

  return (
    <div>
      <h2>Item Details</h2>
      <p>Fetching details for ID: {itemId}</p>
    </div>
  );
}`,
    feedback_correct: "Excellent! You've correctly set up the state variables for `item`, `loading`, and `error`, including their initial values and types. This is crucial for managing the data fetching lifecycle.",
    feedback_partial: "You're using `useState`, but ensure you're destructuring the array returned by `useState` into a state variable and its setter. Also, check initial values and types.",
    feedback_wrong: "Using `let` variables won't trigger re-renders when their values change. You need `useState` to manage state in functional components. Also, ensure the correct destructuring and types.",
    expected: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

function ItemDetailFetcher({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Component logic will go here
  return (
    <div>
      <h2>Item Details</h2>
      <p>Fetching details for ID: {itemId}</p>
    </div>
  );
}`,
    analog_example: `function Counter() {
  const [count, setCount] = useState(0);
  const [isEven, setIsEven] = useState(true);

  // ... logic to update count and isEven
  return (
    <div>
      <p>Count: {count}</p>
      <p>Is Even: {isEven ? 'Yes' : 'No'}</p>
      <button onClick={() => {
        setCount(prev => prev + 1);
        setIsEven(prev => !prev); // Simplified for example
      }}>Increment</button>
    </div>
  );
}
`,
    deepDiveLabel: "Why use `useState` instead of regular variables?",
    deepDive: {
      hook: `Imagine you have a simple counter in your component. You declare \`let count = 0;\` and a button that increments it. You click the button, \`count\` becomes 1, then 2, but the number displayed on your screen never changes! This is because React doesn't know that \`count\` has changed. It only re-renders components when their *state* or *props* change. A regular JavaScript variable, even if updated, won't signal to React that it needs to re-render the UI to reflect the new value. You'd be stuck with a static display, no matter how much your underlying data changes.`,
      pain: `⚠️ **Lesson:** Regular variables don't trigger UI updates. Symptom: Data changes in the background but the user interface remains static, leading to a broken or unresponsive application.`,
      mentalModel: `**Mental model:** The "Reactive Data Store." \`useState\` is like a special, observable data store for your component. When you update a value stored with \`useState\` (using its setter function), it not only changes the value but also *notifies* React that the component needs to be re-rendered with the new data. This makes your UI "reactive" – it automatically updates in response to changes in its underlying state, much like a spreadsheet automatically recalculates cells when input values change.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", \`loading\`, \`error\`).
- **Setter Function:** The second element is a function to update that state value (\`setItem\`, \`setLoading\`, \`setError\`). Calling this function triggers a re-render.
- **Initial State:** The argument passed to \`useState\` is the initial value for that state variable.
- **Type Annotation:** For TypeScript, you can explicitly define the type of the state, especially for nullable types like \`Item | null\` or \`string | null\`.`,
      quickRules: `**Quick rules:**
- ✅ Use \`useState\` for any data that needs to persist across re-renders and trigger UI updates when changed.
- ✅ Always use the setter function (e.g., \`setItem\`) to update state; never directly modify the state variable.
- ✅ Initialize state with a sensible default value that matches its expected type.
- ❌ Never declare state variables inside loops, conditionals, or nested functions; hooks must be called at the top level of your functional component.
- ❌ Do not use regular JavaScript variables if their changes need to be reflected in the UI.
- ❌ Avoid complex logic directly within the \`useState\` initial value; if it's expensive, use a function for lazy initialization.`,
      watchOut: `👀 **Watch out:** When updating state based on the *previous* state (e.g., incrementing a counter), always use the functional update form: \`setCount(prevCount => prevCount + 1)\`. This prevents issues with stale closures, especially in asynchronous operations or when updates are batched.`,
      dryRun: `🔁 **Think:** When \`ItemDetailFetcher\` first renders, \`item\` is \`null\`, \`loading\` is \`true\`, and \`error\` is \`null\`. If an API call later succeeds, \`setLoading(false)\` and \`setItem(fetchedData)\` are called. This causes the component to re-render, and now \`loading\` is \`false\` and \`item\` holds the fetched data, which the UI can then display. (Hint: State changes drive UI updates.)`,
      build: `**Learning focus:** Declare state variables for the fetched item, loading status, and error messages using \`useState\`.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 7",
    paal: "Before wiring up the fetching logic, let's set up the basic JSX structure to display loading, error, or item details. Use conditional rendering to show appropriate messages.",
    hint: "Think about `if` statements or ternary operators to render different JSX based on `loading`, `error`, and `item` state.",
    example_code: `function ItemDetailFetcher({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Component logic will go here

  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!item) {
    return <p>No item found for ID: {itemId}</p>;
  }

  return (
    <div>
      <h2>{item.name}</h2>
      <p>ID: {item.id}</p>
      <p>Description: {item.description}</p>
      <p>Status: {item.status}</p>
    </div>
  );
}`,
    think_prompt: "Implement the conditional rendering logic for loading, error, and item display.",
    mc_options: [
      `  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!item) {
    return <p>No item found for ID: {itemId}</p>;
  }

  return (
    <div>
      <h2>{item.name}</h2>
      <p>ID: {item.id}</p>
      <p>Description: {item.description}</p>
      <p>Status: {item.status}</p>
    </div>
  );`,
      `  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {item ? (
        <>
          <h2>{item.name}</h2>
          <p>ID: {item.id}</p>
        </>
      ) : (
        <p>No item.</p>
      )}
    </div>
  );`,
      `  // No conditional rendering yet
  return (
    <div>
      <h2>Item Details</h2>
      <p>Fetching details for ID: {itemId}</p>
    </div>
  );`,
    ],
    mc_correct_option: `  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!item) {
    return <p>No item found for ID: {itemId}</p>;
  }

  return (
    <div>
      <h2>{item.name}</h2>
      <p>ID: {item.id}</p>
      <p>Description: {item.description}</p>
      <p>Status: {item.status}</p>
    </div>
  );`,
    mc_anchor: "conditional-rendering",
    why_this_matters: "Clear conditional rendering ensures users always see relevant feedback. Showing a loading spinner, an error message, or the actual data improves the user experience and makes your application feel more robust.",
    answer_keywords: ["conditional rendering", "loading", "error", "item", "JSX"],
    seed_code: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

function ItemDetailFetcher({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Component logic will go here
  return (
    <div>
      <h2>Item Details</h2>
      <p>Fetching details for ID: {itemId}</p>
    </div>
  );
}`,
    starter_code: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

function ItemDetailFetcher({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add conditional rendering for loading, error, and item details here

  return (
    <div>
      <h2>Item Details</h2>
      <p>Fetching details for ID: {itemId}</p>
    </div>
  );
}`,
    feedback_correct: "Fantastic! The conditional rendering logic is correctly implemented, providing clear feedback for loading, error, and when the item data is available.",
    feedback_partial: "You're on the right track with conditional rendering, but ensure you're handling all three states (`loading`, `error`, `item`) and displaying the full item details when available.",
    feedback_wrong: "The current return statement doesn't implement conditional rendering. You need to use `if` statements or ternary operators to show different JSX based on the `loading`, `error`, and `item` states.",
    expected: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

function ItemDetailFetcher({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Component logic will go here

  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!item) {
    return <p>No item found for ID: {itemId}</p>;
  }

  return (
    <div>
      <h2>{item.name}</h2>
      <p>ID: {item.id}</p>
      <p>Description: {item.description}</p>
      <p>Status: {item.status}</p>
    </div>
  );
}`,
    analog_example: `function UserAvatar({ userId, imageUrl, isLoading }: { userId: string; imageUrl: string | null; isLoading: boolean }) {
  if (isLoading) {
    return <p>Loading avatar...</p>;
  }

  if (!imageUrl) {
    return <div style={{ width: '50px', height: '50px', backgroundColor: 'lightgray', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{userId.charAt(0).toUpperCase()}</div>;
  }

  return <img src={imageUrl} alt={\`Avatar for \${userId}\`} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />;
}
`,
    deepDiveLabel: "What are the best practices for conditional rendering?",
    deepDive: {
      hook: `Imagine a user clicks a button to load a complex report. For a few seconds, nothing happens on the screen. The user might think the app is frozen, click the button again, or even close the tab in frustration. This lack of feedback during asynchronous operations is a common pitfall. Similarly, if an error occurs during data fetching, and the app just shows a blank screen or crashes, the user is left completely in the dark about what went wrong. You need a way to gracefully guide the user through these different states, providing clear visual cues for loading, success, and failure.`,
      pain: `⚠️ **Lesson:** Lack of visual feedback during asynchronous operations or errors leads to a poor user experience. Symptom: Users perceive the application as slow or broken, leading to frustration and abandonment.`,
      mentalModel: `**Mental model:** The "UI Traffic Cop." Conditional rendering acts like a traffic cop for your UI. Based on the current state (loading, error, data available), it directs which parts of the UI are allowed to be displayed. It ensures that only one "lane" of the UI is open at a time, preventing conflicting messages and guiding the user smoothly through the application's different operational states.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use early \`return\` statements for critical states like \`loading\` or \`error\` to simplify logic.
- ✅ Provide clear, user-friendly messages for each state (e.g., "Loading...", "Error: ...", "No data found.").
- ✅ Ensure that the UI gracefully handles the absence of data (e.g., \`item === null\` or \`item === undefined\`).
- ❌ Avoid deeply nested ternary operators, which can become hard to read.
- ❌ Do not try to render \`item.name\` if \`item\` could be \`null\` or \`undefined\` without a check.
- ❌ Never leave the user without feedback during long-running operations.`,
      watchOut: `👀 **Watch out:** When using the logical AND operator (\`&&\`), be aware that if the left-hand side is \`0\`, \`false\`, \`null\`, or \`undefined\`, React will render that value directly. For example, \`{count === 0 && <p>Count is zero</p>}\` will render \`0\` if \`count\` is \`0\`. While often harmless, it can sometimes lead to unexpected output. Explicit \`if\` statements or ternaries are safer if you need to avoid rendering such values.`,
      dryRun: `🔁 **Think:** Initially, \`loading\` is \`true\`, so the component returns \`<p>Loading item details...</p>\`. If the fetch fails, \`setError("Network error")\` is called, \`loading\` becomes \`false\`. On the next render, \`loading\` is \`false\`, so the first \`if\` is skipped. \`error\` is now \`"Network error"\`, so the component returns \`<p style={{ color: 'red' }}>Error: Network error</p>\`. (Hint: The order of checks is crucial.)`,
      build: `**Learning focus:** Implement conditional rendering to display loading, error, or item details based on the component's state.`,
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 7",
    paal: "Now, let's create the asynchronous function `fetchItemDetail` that will simulate fetching data. This function should reset error/loading states, simulate an API call, and update the `item` state.",
    hint: "Use `async/await` for the function. Simulate a network delay with `setTimeout`. Remember to update `loading`, `error`, and `item` states using their setters.",
    example_code: `function ItemDetailFetcher({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItemDetail = async () => {
    setLoading(true);
    setError(null);
    setItem(null); // Clear previous item data

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate data based on itemId
      if (itemId === 'w-001') {
        setItem({ id: 'w-001', name: 'Widget Alpha', description: 'A versatile alpha widget.', status: 'active' });
      } else if (itemId === 'g-002') {
        setItem({ id: 'g-002', name: 'Gadget Beta', description: 'The next-gen beta gadget.', status: 'archived' });
      } else {
        setError('Item not found.');
      }
    } catch (err) {
      setError('Failed to fetch item details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!item) {
    return <p>No item found for ID: {itemId}</p>;
  }

  return (
    <div>
      <h2>{item.name}</h2>
      <p>ID: {item.id}</p>
      <p>Description: {item.description}</p>
      <p>Status: {item.status}</p>
    </div>
  );
}`,
    think_prompt: "Define the `fetchItemDetail` async function, including state updates for loading, error, and item data.",
    mc_options: [
      `  const fetchItemDetail = async () => {
    setLoading(true);
    setError(null);
    setItem(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (itemId === 'w-001') {
        setItem({ id: 'w-001', name: 'Widget Alpha', description: 'A versatile alpha widget.', status: 'active' });
      } else if (itemId === 'g-002') {
        setItem({ id: 'g-002', name: 'Gadget Beta', description: 'The next-gen beta gadget.', status: 'archived' });
      } else {
        setError('Item not found.');
      }
    } catch (err) {
      setError('Failed to fetch item details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };`,
      `  function fetchItemDetail() {
    // No async/await or state updates
    console.log('Fetching...');
  }`,
      `  const fetchItemDetail = () => {
    setLoading(true);
    // Missing async/await and error handling
    setItem({ id: 'test', name: 'Test Item', description: 'Test', status: 'active' });
    setLoading(false);
  };`,
    ],
    mc_correct_option: `  const fetchItemDetail = async () => {
    setLoading(true);
    setError(null);
    setItem(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (itemId === 'w-001') {
        setItem({ id: 'w-001', name: 'Widget Alpha', description: 'A versatile alpha widget.', status: 'active' });
      } else if (itemId === 'g-002') {
        setItem({ id: 'g-002', name: 'Gadget Beta', description: 'The next-gen beta gadget.', status: 'archived' });
      } else {
        setError('Item not found.');
      }
    } catch (err) {
      setError('Failed to fetch item details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };`,
    mc_anchor: "fetch-function",
    why_this_matters: "Encapsulating fetching logic in a dedicated function makes it reusable and testable. Properly managing loading, error, and data states within this function ensures a robust data flow.",
    answer_keywords: ["async", "await", "fetch", "try-catch-finally", "state update"],
    seed_code: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

function ItemDetailFetcher({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Component logic will go here

  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!item) {
    return <p>No item found for ID: {itemId}</p>;
  }

  return (
    <div>
      <h2>{item.name}</h2>
      <p>ID: {item.id}</p>
      <p>Description: {item.description}</p>
      <p>Status: {item.status}</p>
    </div>
  );
}`,
    starter_code: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

function ItemDetailFetcher({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define the fetchItemDetail async function here

  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!item) {
    return <p>No item found for ID: {itemId}</p>;
  }

  return (
    <div>
      <h2>{item.name}</h2>
      <p>ID: {item.id}</p>
      <p>Description: {item.description}</p>
      <p>Status: {item.status}</p>
    </div>
  );
}`,
    feedback_correct: "Excellent! The `fetchItemDetail` function correctly handles the asynchronous operation, updates loading and error states, and sets the item data. This is a robust pattern for data fetching.",
    feedback_partial: "You've started the `fetchItemDetail` function, but ensure it's `async`, uses `try-catch-finally` for error handling, and correctly updates all three state variables (`loading`, `error`, `item`).",
    feedback_wrong: "The `fetchItemDetail` function needs to be `async` and use `await` to simulate network requests. It also requires proper error handling with `try-catch-finally` and updates to all relevant state variables.",
    expected: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

function ItemDetailFetcher({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItemDetail = async () => {
    setLoading(true);
    setError(null);
    setItem(null); // Clear previous item data

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate data based on itemId
      if (itemId === 'w-001') {
        setItem({ id: 'w-001', name: 'Widget Alpha', description: 'A versatile alpha widget.', status: 'active' });
      } else if (itemId === 'g-002') {
        setItem({ id: 'g-002', name: 'Gadget Beta', description: 'The next-gen beta gadget.', status: 'archived' });
      } else {
        setError('Item not found.');
      }
    } catch (err) {
      setError('Failed to fetch item details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!item) {
    return <p>No item found for ID: {itemId}</p>;
  }

  return (
    <div>
      <h2>{item.name}</h2>
      <p>ID: {item.id}</p>
      <p>Description: {item.description}</p>
      <p>Status: {item.status}</p>
    </div>
  );
}`,
    analog_example: `function UserDataFetcher({ userId }: { userId: string }) {
  const [userData, setUserData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    setIsLoading(true);
    setUserData(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network
      const data = { id: userId, name: \`User \${userId}\`, email: \`\${userId}@example.com\` };
      setUserData(data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ... useEffect to call fetchUserData
  return isLoading ? <p>Loading user...</p> : <p>User: {userData?.name}</p>;
}
`,
    deepDiveLabel: "Why use `async/await` and `try-catch-finally` for data fetching?",
    deepDive: {
      hook: `Imagine you're trying to order food online. You click "Place Order," and the app sends your request to the restaurant. What happens if the restaurant's system is down? Or if your internet connection drops? If the app doesn't anticipate these problems, it might just freeze, crash, or show a confusing error message. You need a way to gracefully handle the waiting period, deal with potential failures, and ensure that regardless of success or failure, certain cleanup actions (like hiding a loading spinner) always happen. Without this, your app becomes fragile and frustrating to use.`,
      pain: `⚠️ **Lesson:** Unhandled asynchronous operations lead to unpredictable behavior and crashes. Symptom: Applications freezing, unexpected errors, and resources not being properly released after an operation.`,
      mentalModel: `**Mental model:** The "Reliable Courier Service." Think of \`async/await\` as hiring a reliable courier service for your data. You \`await\` their delivery, knowing they'll eventually return with the package (data) or a clear explanation of why they couldn't (error). The \`try-catch-finally\` block is like the courier's protocol: \`try\` to deliver, \`catch\` any problems (like a flat tire), and \`finally\` report back to the sender (e.g., update the loading status) regardless of success or failure. This ensures a predictable and robust delivery process.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Always use \`async/await\` for network requests and other Promise-based asynchronous operations.
- ✅ Wrap asynchronous code in a \`try-catch\` block to handle potential errors gracefully.
- ✅ Use a \`finally\` block for cleanup actions that must always run (e.g., hiding loading indicators).
- ❌ Never leave asynchronous operations without error handling; silent failures are hard to debug.
- ❌ Do not forget to set loading states to \`false\` in the \`finally\` block, or your UI might get stuck in a loading state.
- ❌ Avoid deeply nested callbacks (callback hell) by preferring \`async/await\` for sequential asynchronous logic.`,
      watchOut: `👀 **Watch out:** When an \`async\` function is called, it immediately returns a Promise. If you forget to \`await\` it, the code following the call will execute immediately, potentially before the asynchronous operation completes. This can lead to race conditions or incorrect state if not managed carefully.`,
      dryRun: `🔁 **Think:** When \`fetchItemDetail\` is called, \`setLoading(true)\` runs, making the UI show "Loading...". Then, \`setError(null)\` and \`setItem(null)\` clear previous states. The \`await\` pauses execution for 1 second. If \`itemId\` is 'w-001', \`setItem\` updates the item. Finally, \`setLoading(false)\` runs, hiding the loading message and displaying the fetched item. If an error occurred during the \`await\`, the \`catch\` block would run, setting an error message before \`finally\` sets \`loading\` to \`false\`. (Hint: The state updates control the UI flow.)`,
      build: `**Learning focus:** Implement the \`fetchItemDetail\` asynchronous function, including state management for loading, error, and data.`,
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 7",
    paal: "Finally, use the `useEffect` hook to call `fetchItemDetail` when the component mounts and whenever the `itemId` prop changes. Remember to include `itemId` in the dependency array.",
    hint: "The `useEffect` hook takes a function and a dependency array. An empty array means 'on mount', and including `itemId` means 'on mount and when `itemId` changes'.",
    example_code: `function ItemDetailFetcher({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItemDetail = async () => {
    setLoading(true);
    setError(null);
    setItem(null); // Clear previous item data

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate data based on itemId
      if (itemId === 'w-001') {
        setItem({ id: 'w-001', name: 'Widget Alpha', description: 'A versatile alpha widget.', status: 'active' });
      } else if (itemId === 'g-002') {
        setItem({ id: 'g-002', name: 'Gadget Beta', description: 'The next-gen beta gadget.', status: 'archived' });
      } else {
        setError('Item not found.');
      }
    } catch (err) {
      setError('Failed to fetch item details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetail();
  }, [itemId]); // Re-run effect when itemId changes

  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!item) {
    return <p>No item found for ID: {itemId}</p>;
  }

  return (
    <div>
      <h2>{item.name}</h2>
      <p>ID: {item.id}</p>
      <p>Description: {item.description}</p>
      <p>Status: {item.status}</p>
    </div>
  );
}`,
    think_prompt: "Add the `useEffect` hook to call `fetchItemDetail` with `itemId` as a dependency.",
    mc_options: [
      `  useEffect(() => {
    fetchItemDetail();
  }, [itemId]);`,
      `  useEffect(() => {
    fetchItemDetail();
  }, []); // Only on mount`,
      `  useEffect(() => {
    fetchItemDetail();
  }); // On every render`,
    ],
    mc_correct_option: `  useEffect(() => {
    fetchItemDetail();
  }, [itemId]);`,
    mc_anchor: "useeffect-wireup",
    why_this_matters: "The dependency array in `useEffect` is critical for controlling when side effects run. Including `itemId` ensures that new data is fetched only when the item being viewed actually changes, preventing unnecessary network requests and optimizing performance.",
    answer_keywords: ["useEffect", "dependency array", "itemId", "mount", "change"],
    seed_code: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

function ItemDetailFetcher({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItemDetail = async () => {
    setLoading(true);
    setError(null);
    setItem(null); // Clear previous item data

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate data based on itemId
      if (itemId === 'w-001') {
        setItem({ id: 'w-001', name: 'Widget Alpha', description: 'A versatile alpha widget.', status: 'active' });
      } else if (itemId === 'g-002') {
        setItem({ id: 'g-002', name: 'Gadget Beta', description: 'The next-gen beta gadget.', status: 'archived' });
      } else {
        setError('Item not found.');
      }
    } catch (err) {
      setError('Failed to fetch item details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!item) {
    return <p>No item found for ID: {itemId}</p>;
  }

  return (
    <div>
      <h2>{item.name}</h2>
      <p>ID: {item.id}</p>
      <p>Description: {item.description}</p>
      <p>Status: {item.status}</p>
    </div>
  );
}`,
    starter_code: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

function ItemDetailFetcher({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItemDetail = async () => {
    setLoading(true);
    setError(null);
    setItem(null); // Clear previous item data

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate data based on itemId
      if (itemId === 'w-001') {
        setItem({ id: 'w-001', name: 'Widget Alpha', description: 'A versatile alpha widget.', status: 'active' });
      } else if (itemId === 'g-002') {
        setItem({ id: 'g-002', name: 'Gadget Beta', description: 'The next-gen beta gadget.', status: 'archived' });
      } else {
        setError('Item not found.');
      }
    } catch (err) {
      setError('Failed to fetch item details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Use the useEffect hook here to call fetchItemDetail

  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!item) {
    return <p>No item found for ID: {itemId}</p>;
  }

  return (
    <div>
      <h2>{item.name}</h2>
      <p>ID: {item.id}</p>
      <p>Description: {item.description}</p>
      <p>Status: {item.status}</p>
    </div>
  );
}`,
    feedback_correct: "Excellent! By including `itemId` in the dependency array, `useEffect` will correctly re-run `fetchItemDetail` whenever the `itemId` prop changes, ensuring the component always displays the correct data.",
    feedback_partial: "You've added `useEffect`, but ensure the dependency array is correctly specified to re-run the effect when `itemId` changes. An empty array only runs on mount.",
    feedback_wrong: "An empty dependency array `[]` means the effect runs only once on mount. Omitting the array means it runs on every render. To re-fetch when `itemId` changes, you must include `itemId` in the dependency array.",
    expected: `import { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
}

function ItemDetailFetcher({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItemDetail = async () => {
    setLoading(true);
    setError(null);
    setItem(null); // Clear previous item data

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate data based on itemId
      if (itemId === 'w-001') {
        setItem({ id: 'w-001', name: 'Widget Alpha', description: 'A versatile alpha widget.', status: 'active' });
      } else if (itemId === 'g-002') {
        setItem({ id: 'g-002', name: 'Gadget Beta', description: 'The next-gen beta gadget.', status: 'archived' });
      } else {
        setError('Item not found.');
      }
    } catch (err) {
      setError('Failed to fetch item details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetail();
  }, [itemId]); // Re-run effect when itemId changes

  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!item) {
    return <p>No item found for ID: {itemId}</p>;
  }

  return (
    <div>
      <h2>{item.name}</h2>
      <p>ID: {item.id}</p>
      <p>Description: {item.description}</p>
      <p>Status: {item.status}</p>
    </div>
  );
}`,
    analog_example: `function AutoSaver({ data, saveIntervalMs }: { data: object; saveIntervalMs: number }) {
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Auto-saving data:', data);
      // In a real app, you'd call an API here: saveApi(data);
    }, saveIntervalMs);

    return () => {
      clearInterval(intervalId); // Cleanup on unmount or dependency change
    };
  }, [data, saveIntervalMs]); // Re-run effect if data or interval changes

  return <p>Auto-save enabled. Saving every {saveIntervalMs / 1000} seconds.</p>;
}
`,
    deepDiveLabel: "How does the `useEffect` dependency array prevent infinite loops?",
    deepDive: {
      hook: `Imagine you have a component that fetches data, and after fetching, it updates a piece of state. If you put that state update directly into the \`useEffect\` without a dependency array, or with an incorrect one, what happens? The state update causes a re-render. The re-render causes the \`useEffect\` to run again. The \`useEffect\` fetches data and updates state again. This creates a vicious cycle – an infinite loop of fetching and re-rendering, quickly crashing your application or exhausting your API limits. You need a precise way to tell React: "Only run this effect when *these specific values* have actually changed, not just any time the component re-renders."`,
      pain: `⚠️ **Lesson:** Incorrectly managed \`useEffect\` dependencies lead to infinite loops and performance issues. Symptom: Browser freezing, excessive network requests, and application crashes due to uncontrolled re-renders.`,
      mentalModel: `**Mental model:** The "Change Detector." The dependency array in \`useEffect\` is like a highly specialized change detector. It constantly monitors the values listed within it. The effect function (the first argument to \`useEffect\`) will *only* re-run if one or more of those monitored values have changed since the *last* render. If the array is empty, it means "don't monitor anything, just run once on mount." If it's omitted entirely, it means "monitor everything, run on every render." This precise control prevents unnecessary re-executions.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Include all values from the component's scope (props, state, functions) that are used inside your \`useEffect\` callback in the dependency array.
- ✅ Use an empty dependency array \`[]\` for effects that should only run once on component mount (e.g., initial data fetch that doesn't depend on props).
- ✅ If your effect returns a cleanup function, ensure it correctly reverses the side effect (e.g., clearing timers, unsubscribing).
- ❌ Never omit the dependency array for data fetching effects, as this will cause an infinite loop of fetching.
- ❌ Do not include values in the dependency array that don't change or are not used by the effect, as this can cause unnecessary re-runs.
- ❌ Avoid putting objects or functions directly into the dependency array if they are re-created on every render, as this will cause the effect to re-run unnecessarily. Use \`useCallback\` or \`useMemo\` if needed.`,
      watchOut: `👀 **Watch out:** If you use a function (like \`fetchItemDetail\` in this example) inside \`useEffect\`, and that function is defined *inside* the component, it will be re-created on every render. If you put it directly into the dependency array, it will cause the effect to re-run on every render, defeating the purpose. To fix this, either move the function outside the component, or wrap it in \`useCallback\` (and include its own dependencies in \`useCallback\`'s array). For simple cases like this module, where \`fetchItemDetail\` only depends on \`itemId\` (which is already in \`useEffect\`'s array), React's ESLint plugin often handles this warning gracefully, but it's a crucial concept for more complex effects.`,
      dryRun: `🔁 **Think:**
1. Component mounts with \`itemId="alpha"\`. \`useEffect\` runs, calling \`fetchItemDetail()\`.
2. \`fetchItemDetail\` sets \`loading=true\`, fetches data for "alpha", then sets \`loading=false\` and \`item={...alpha data}\`.
3. Parent component re-renders \`ItemDetailFetcher\` with \`itemId="beta"\`.
4. React compares \`itemId\` from the previous render (\`"alpha"\`) with the current render (\`"beta"\`). They are different.
5. \`useEffect\` detects the change in \`itemId\` and re-runs, calling \`fetchItemDetail()\` again.
6. \`fetchItemDetail\` sets \`loading=true\`, fetches data for "beta", then sets \`loading=false\` and \`item={...beta data}\`.
(Hint: The dependency array is the gatekeeper for effect re-execution.)`,
      build: `**Learning focus:** Wire the \`fetchItemDetail\` function to the \`useEffect\` hook, ensuring it runs on mount and when the \`itemId\` prop changes.`,
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Imports", id: "step1" },
  { label: "Step 2: Types", id: "step2" },
  { label: "Step 3: Component Shell", id: "step3" },
  { label: "Step 4: State Variables", id: "step4" },
  { label: "Step 5: Structure Skeleton", id: "step5" },
  { label: "Step 6: Fetching Logic", id: "step6" },
  { label: "Step 7: Wire Effect", id: "step7" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Fetch Data on Mount or ID Change with useEffect",
  shortName: "useEffect Fetching",
});
