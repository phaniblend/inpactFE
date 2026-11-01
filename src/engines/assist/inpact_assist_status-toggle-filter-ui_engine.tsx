import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "status-toggle-filter-ui",
      title: "Status Toggling and Filtering UI",
      body: `
        • Every item (a message, an order, a task) has one current status — and users need two things: a way to CHANGE that status, and a way to FILTER the list by it.
        • Amazon order history: you mark a package "Delivered", and you can filter your orders to show only "In Transit" ones.
        • Gmail: you mark an email "Read" or leave it "Unread", and you can filter your inbox to show only unread messages.
        • Same two moves, every time: a button that changes one item's status, and a dropdown that filters the whole list by status.
      `,
      usecase: "A dashboard displaying a list of user-generated content, where each piece of content has a 'published' or 'draft' status, and users need to toggle this status and filter the list to view only published or draft items.",
      designMock: {"kind":"list-and-form","screenTitle":"Inbox","caption":"This is the screen you are building. Match the pieces — not the brand colors.","listCaption":"MESSAGES","emptyMessage":"No messages match this filter.","rows":[{"title":"Can't reset my password","subtitle":"dana@example.com","meta":"Open"},{"title":"Billing question","subtitle":"raj@example.com","meta":"Resolved"}],"rowToggle":{"values":["Open","Resolved"],"labels":{"Open":"Mark Resolved","Resolved":"Mark Unresolved"}},"formMode":"filter","fields":[{"label":"Filter by Status","options":["All","Open","Resolved"]}],"submitLabel":"Apply filter"}
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Define module-scope types for structured data.",
      "Create a functional component shell for managing items.",
      "Manage local state for a list of items and the active filter.",
      "Implement the basic JSX structure for a filter dropdown and item list.",
      "Develop handler functions for fetching data, toggling item status, and applying filters.",
      "Wire the handler functions to the UI elements to enable interactivity.",
    ],
  },
  {
    id: "prereq-fundamentals",
    type: "funda-gate",
    phase: "Prerequisites",
    // One prereq check for the whole lesson, not one per step — found live 2026-09-01: a separate
    // gate before every step that happens to need something new fragments the same check across
    // the lesson. This is a single, specific list of exactly what this lesson's tasks require, not
    // a generic "types are values" primer — each item is named for how it's actually used below,
    // not textbook-broad.
    fundas: [
      {
        name: "TypeScript union types",
        blurb: "This lesson's StatusFilter and Item types both rely on union types ('a' | 'b') to restrict a value to a fixed set of options — used in Steps 1 and 3.",
        videoUrl: "https://www.youtube.com/watch?v=sgEKZzTCkiY",
        quiz: {
          question: "Which correctly defines a type that's only ever 'yes' or 'no'?",
          options: ["type Answer = 'yes' & 'no';", "type Answer = 'yes' | 'no';", "type Answer = ['yes', 'no'];"],
          correctIndex: 1,
        },
      },
      {
        name: "useState hook",
        blurb: "Managing a piece of data that changes over time and re-renders your component when it updates — used to hold the item list and the active filter in Step 5.",
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
        blurb: "This lesson renders the item list with .map() and updates item status with a per-item side effect — used in Steps 6 and 7.",
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
    id: "step1",
    type: "question",
    phase: "Step 1 of 8",
    // Split from a single combined "type + interface" step into two — found live 2026-09-01:
    // one THINK prompt covering two unrelated concepts (a union type AND an interface shape) at
    // once violates the platform's own one-tiny-task-at-a-time rule; a beginner has to hold both
    // in their head to answer a single MCQ. This step is ONLY the status union type.
    paal: "Before building our component, let's define the status values an item can have. We need a union type listing every possible status.",
    hint: "List each literal string status value, separated by |, plus an 'all' option for the filter itself.",
    example_code: `
type StatusFilter = 'all' | 'active' | 'archived';
`,
    think_prompt: "Which of the following correctly defines a union type for an item's status filter?",
    mc_options: [
      "type StatusFilter = 'all' | 'open' | 'resolved';",
      "type StatusFilter = string;",
      "type StatusFilter = ['all', 'open', 'resolved'];"
    ],
    mc_correct_option: "type StatusFilter = 'all' | 'open' | 'resolved';",
    mc_anchor: "type StatusFilter = 'all' | 'open' | 'resolved';",
    why_this_matters: "A union type establishes a contract for exactly which status values are ever valid, catching a typo'd status at compile time instead of silently failing at runtime.",
    answer_keywords: ["type", "union type", "status"],
    seed_code: "",
    starter_code: `
// Define your StatusFilter type here
`,
    feedback_correct: "Excellent! A union type of exact string literals is exactly how you constrain a status field to only its valid values.",
    feedback_partial: "You're close — make sure every value is a specific string literal, not a general type like string or an array.",
    feedback_wrong: "Review union type syntax: a set of specific string literals joined by |, not a general string type or an array.",
    expected: `
type StatusFilter = 'all' | 'open' | 'resolved';
`,
    analog_example: `
// In a system managing user roles:
type PermissionLevel = 'full' | 'limited' | 'none';
`,
    deepDiveLabel: "Why union types instead of a plain string?",
    deepDive: {
      hook: `
        Imagine a form field that's supposed to hold one of three states, but is typed as a plain string. Nothing stops a typo — "resolvd" instead of "resolved" — from compiling clean and only failing when a user notices the filter silently doesn't work. A union type turns that typo into a compile-time error instead of a support ticket.
      `,
      pain: `
        ⚠️ **Lesson:** An untyped status field. Symptom: a filter or badge silently does nothing because the stored value doesn't exactly match what the UI is comparing against, and nothing caught it before runtime.
      `,
      mentalModel: `
        **Mental model:** A union type is a guest list, not a suggestion. \`type StatusFilter = 'all' | 'open' | 'resolved'\` means exactly those three strings are welcome — anything else is rejected at the door, before the code ever runs.
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `
        **Quick rules:**
        - ✅ List every valid value as its own string literal.
        - ✅ Include an "all"/"none" catch-all member only if the UI actually needs one.
        - ❌ Don't fall back to a general \`string\` type — that defeats the whole point.
      `,
      watchOut: `
        👀 **Watch out:** A union type only checks values you assign in code — it does nothing for data arriving from a real API response, which still needs runtime validation.
      `,
      dryRun: `
        🔁 **Think:** If \`StatusFilter\` is \`'all' | 'open' | 'resolved'\` and you write \`const f: StatusFilter = 'closed'\`, the compiler flags it immediately — \`'closed'\` isn't a member of the union. (Hint: this is the compiler acting as an early warning system, before the code ever runs.)
      `,
      build: "**Learning focus:** Constrain a status field to only its valid values with a union type.",
    },
  },
  {
    id: "step1b",
    type: "question",
    phase: "Step 2 of 8",
    // Split again — found live 2026-09-01: the quiz options here invented a brand-new type name
    // ("ItemStatus", with values that don't even match what step 1 just defined) instead of
    // reusing StatusFilter. Confusing even to an expert reviewer, let alone a noob — this step is
    // now ONLY the interface's plain fields; the status field (reusing the real type from step 1)
    // is its own separate step right after.
    paal: "Let's define the basic shape of an individual item — just its id and name for now. We'll add the status field next.",
    hint: "Two fields: an id (a number) and a name (a string). No status field yet.",
    example_code: `
interface Item {
  id: number;
  name: string;
}
`,
    think_prompt: "Which of the following correctly defines a basic interface for an item with an id and a name?",
    mc_options: [
      "interface Item { id: number; name: string; }",
      "interface Item { id: string; }",
      "type Item = { id: number, name: string }[];"
    ],
    mc_correct_option: "interface Item { id: number; name: string; }",
    mc_anchor: "interface Item { id: number; name: string; }",
    why_this_matters: "Starting with the interface's plain fields, before adding anything that depends on another type, keeps each step to one new idea at a time.",
    answer_keywords: ["interface", "data structure"],
    seed_code: "",
    starter_code: `
// Define your Item interface here (id and name only, for now)
`,
    feedback_correct: "Excellent! That's the basic shape — next we'll add the status field.",
    feedback_partial: "You're close — check the field names and that id is a number, name is a string.",
    feedback_wrong: "Review interface syntax: id: number; name: string; — no status field yet, that's the next step.",
    expected: `
interface Item {
  id: number;
  name: string;
}
`,
    analog_example: `
// In a system managing user roles and permissions:
interface UserProfile {
  id: string;
  username: string;
}
`,
    deepDiveLabel: "Why are types so important in software engineering?",
    deepDive: {
      hook: `
        Imagine you're building a complex machine, but you don't have blueprints or clear labels for any of the parts. You might try to connect a square peg into a round hole, or expect a component to perform a function it wasn't designed for. In software, this is precisely the problem that arises without strong typing. You might pass a number where a string is expected, or try to access a property on an object that doesn't exist. The code might run, but then suddenly crash in production, leading to frustrating debugging sessions and unreliable software.
      `,
      pain: `
        ⚠️ **Lesson:** Unpredictable data structures. Symptom: Runtime errors like "Cannot read property 'x' of undefined" or unexpected behavior when data is passed between functions. This often occurs when data shapes are not explicitly defined, leading to assumptions that break when the actual data deviates.
      `,
      mentalModel: `
        **Mental model:** The "Contract Agreement." Think of an interface as a formal contract. When you define \`interface Item\`, you're saying "any object claiming to be an \`Item\` *must* fulfill these requirements" — preventing mismatches between different parts of your codebase.
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `
        **Quick rules:**
        - ✅ Define interfaces for object shapes to ensure consistency.
        - ✅ Add fields incrementally rather than all at once.
        - ❌ Avoid \`any\` type unless absolutely necessary, as it bypasses type checking.
      `,
      watchOut: `
        👀 **Watch out:** \`type Item = {...}[]\` describes an array of items, not one item — don't confuse the shape of one record with a list of them.
      `,
      dryRun: `
        🔁 **Think:** Imagine an \`Item\` object: \`{ id: 1, name: "Report" }\`. It matches this interface exactly — two fields, two matching types. (Hint: the compiler checks every field is present with the right type.)
      `,
      build: "**Learning focus:** Establish the basic, type-safe shape of an individual item.",
    },
  },
  {
    id: "step1c",
    type: "question",
    phase: "Step 3 of 8",
    paal: "Now let's add the status field to the Item interface — reusing the StatusFilter type we defined in step 1, not inventing a new one.",
    hint: "Add one more field, status, typed as StatusFilter (the type from step 1) — not a brand-new type, not a plain string.",
    example_code: `
interface Item {
  id: number;
  name: string;
  status: StatusFilter;
}
`,
    think_prompt: "Which of the following correctly adds a status field to Item, reusing the StatusFilter type from step 1?",
    mc_options: [
      "interface Item { id: number; name: string; status: StatusFilter; }",
      "interface Item { id: number; name: string; status: string; }",
      "interface Item { id: number; name: string; } type ItemWithStatus = Item & { status: 'new' | 'old' };"
    ],
    mc_correct_option: "interface Item { id: number; name: string; status: StatusFilter; }",
    mc_anchor: "interface Item { id: number; name: string; status: StatusFilter; }",
    why_this_matters: "Reusing StatusFilter (instead of a plain string, or a second unrelated type) keeps the interface and the union type it depends on always in sync — change StatusFilter once, and every place that reuses it updates with it.",
    answer_keywords: ["interface", "StatusFilter", "status"],
    seed_code: "",
    starter_code: `
// Add a status field to your Item interface, typed as StatusFilter
`,
    feedback_correct: "Excellent! Reusing StatusFilter keeps the interface and the union type it depends on always in sync.",
    feedback_partial: "You're close — make sure status is typed as StatusFilter specifically, not a plain string or a new type.",
    feedback_wrong: "Review: the status field should be typed as StatusFilter — the exact type from step 1, reused, not redefined.",
    expected: `
interface Item {
  id: number;
  name: string;
  status: StatusFilter;
}
`,
    analog_example: `
// Reusing an existing type rather than redefining it:
interface UserProfile {
  id: string;
  username: string;
  role: PermissionLevel;
}
`,
    deepDiveLabel: "Why reuse a type instead of redefining it?",
    deepDive: {
      hook: `
        Two places in your code both need "the set of valid statuses." Define it once as StatusFilter and reuse it everywhere, and there's exactly one place to update when a new status is added. Define it twice with different names, and they will eventually drift apart — one gets updated, the other doesn't, and now the compiler can't catch the mismatch because as far as it knows, they're unrelated types.
      `,
      pain: `
        ⚠️ **Lesson:** Duplicate type definitions. Symptom: two "the same concept" types silently drift apart, and the compiler has no way to know they were ever supposed to match.
      `,
      mentalModel: `
        **Mental model:** One source of truth. StatusFilter is defined once; every field that needs "a valid status" points back to that same definition instead of copying its values.
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `
        **Quick rules:**
        - ✅ Reuse an existing type by name wherever the same concept applies.
        - ❌ Don't redefine the same set of values under a second type name.
        - ❌ Don't fall back to a plain \`string\` — that loses the whole guarantee.
      `,
      watchOut: `
        👀 **Watch out:** StatusFilter includes \`'all'\`, which makes sense for a filter dropdown but not for a single item's actual status — a real product might split these into two related types. This lesson keeps one type for both to stay focused on the reuse pattern itself.
      `,
      dryRun: `
        🔁 **Think:** If \`StatusFilter\` gains a new value later (say \`'archived'\`), \`Item.status\` immediately allows it too — no separate edit needed, because it's the same type, not a copy. (Hint: this is the entire benefit of reusing a type instead of duplicating it.)
      `,
      build: "**Learning focus:** Reuse an existing type to keep related fields in sync by construction.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 4 of 8",
    paal: "Now that we have our types, let's set up the basic functional component that will manage our items. This component will be responsible for fetching data, holding state, and rendering the UI.",
    hint: "Start with a simple functional component definition. Remember, no explicit React imports are needed in the example code.",
    example_code: `
function ItemManager() {
  // State and logic will go here
  return (
    <div>
      <h1>Item Manager</h1>
      {/* UI elements will go here */}
    </div>
  );
}
`,
    think_prompt: "Which option correctly defines a basic functional component named 'ResourceList'?",
    mc_options: [
      "const ResourceList = () => { return <div>Resource List</div>; };",
      "function ResourceList() { return <div>Resource List</div>; }",
      "class ResourceList extends Component { render() { return <div>Resource List</div>; } }"
    ],
    mc_correct_option: "function ResourceList() { return <div>Resource List</div>; }",
    mc_anchor: "function ResourceList() { return <div>Resource List</div>; }",
    why_this_matters: "A functional component is the building block of modern React applications. It's a JavaScript function that returns JSX, allowing you to encapsulate UI logic and presentation in a reusable way.",
    answer_keywords: ["functional component", "JSX", "return statement"],
    seed_code: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];
`,
    starter_code: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];

// Define your ItemManager functional component here
`,
    feedback_correct: "Spot on! A functional component provides a clean and modern way to build UI elements.",
    feedback_partial: "You've got the component name, but double-check the syntax for defining a functional component that returns JSX.",
    feedback_wrong: "Review the basic structure of a functional component. Class components are an older pattern, and arrow functions need careful syntax.",
    expected: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];

function ItemManager() {
  // State and logic will go here
  return (
    <div>
      <h1>Item Manager</h1>
      {/* UI elements will go here */}
    </div>
  );
}
`,
    analog_example: `
// A simple component for displaying a greeting:
function GreetingDisplay() {
  const userName = "Guest";
  return (
    <p>Hello, {userName}!</p>
  );
}
`,
    deepDiveLabel: "What are the advantages of functional components?",
    deepDive: {
      hook: `
        For a long time, building interactive UIs in React meant using class components, which came with their own set of complexities: \`this\` binding issues, lifecycle methods that could become unwieldy, and difficulty in reusing stateful logic. Imagine trying to share a piece of logic that fetches data across multiple components – with class components, this often led to patterns like higher-order components or render props, which added layers of abstraction. This made components harder to read, test, and refactor, especially for beginners. The need for a simpler, more direct way to manage state and side effects in UI components became evident.
      `,
      pain: `
        ⚠️ **Lesson:** Complex state management and logic reuse. Symptom: Components become bloated with lifecycle methods, \`this\` context issues arise, and sharing stateful logic between components is cumbersome, leading to duplicated code or overly abstract patterns.
      `,
      mentalModel: `
        **Mental model:** The "Pure Function with Memory." Think of a functional component as a regular JavaScript function that, given some inputs (props), always produces the same output (JSX). The "memory" part comes from hooks like \`useState\` and \`useEffect\`. These hooks allow functional components to "remember" state between renders and perform "side effects" (like data fetching) without turning the function into a complex object with its own \`this\` context and lifecycle methods. It's like having a simple calculator that can also store a few numbers and perform actions outside its core calculation, all while remaining a simple function.
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", \`useEffect\`) enable state and side effects within these functions, making them powerful.
        - They are generally simpler to write, read, and test compared to class components.
      `,
      quickRules: `
        **Quick rules:**
        - ✅ Use functional components for all new UI development.
        - ✅ Pass data down to child components via props.
        - ✅ Use hooks for managing state and side effects.
        - ✅ Keep components focused on a single responsibility.
        - ❌ Avoid class components for new features.
        - ❌ Don't mutate props directly within a component.
        - ❌ Never call hooks inside loops, conditions, or nested functions.
      `,
      watchOut: `
        👀 **Watch out:** While functional components are powerful, improper use of hooks can lead to subtle bugs. Forgetting dependency arrays in \`useEffect\` can cause infinite loops or stale closures. Over-using \`useState\` for every small piece of data can make state management fragmented. Always consider the scope and dependencies of your hooks.
      `,
      dryRun: `
        🔁 **Think:** When \`ItemManager\` is first rendered, it executes its function body. It defines a return value, which is the JSX for a \`div\` containing an \`h1\`. No state has been initialized yet, and no side effects have run. If it were to re-render (e.g., due to parent state change), the function would execute again, re-evaluating the JSX. (Hint: Functional components execute their entire body on each render to produce new JSX.)
      `,
      build: "**Learning focus:** Create the foundational functional component that will house our item management logic and UI.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 5 of 8",
    paal: "A dynamic UI needs to manage its internal state. We'll use `useState` to hold our list of items and the currently selected filter status. We'll also use `useEffect` to fetch the initial list of items when the component mounts.",
    hint: "Declare two state variables: one for an array of `Item` objects, initialized as an empty array, and another for the `StatusFilter`, initialized to `'all'`. Then, add a `useEffect` hook for data fetching.",
    example_code: `
function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  useEffect(() => {
    // Simulate API call
    const fetchedItems: Item[] = [
      { id: 1, name: 'Review documentation', status: 'active' },
      { id: 2, name: 'Update dependencies', status: 'archived' },
      { id: 3, name: 'Plan next sprint', status: 'active' },
    ];
    setItems(fetchedItems);
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div>
      <h1>Item Manager</h1>
      {/* UI elements will go here */}
    </div>
  );
}
`,
    think_prompt: "Which code snippet correctly initializes state for a list of 'products' and a 'category' filter, and fetches initial data?",
    mc_options: [
      "const [products, setProducts] = useState([]); const [category, setCategory] = useState('all'); useEffect(() => { fetch('/api/products').then(res => res.json()).then(data => setProducts(data)); }, []);",
      "const products = []; const category = 'all'; // No state management or data fetching",
      "const [products, setProducts] = useState<Product[]>([]); const [category, setCategory] = useState<CategoryFilter>('all'); useEffect(() => { // fetch logic here }, [products]);"
    ],
    mc_correct_option: "const [products, setProducts] = useState([]); const [category, setCategory] = useState('all'); useEffect(() => { fetch('/api/products').then(res => res.json()).then(data => setProducts(data)); }, []);",
    mc_anchor: "const [products, setProducts] = useState([]); const [category, setCategory] = useState('all'); useEffect(() => { fetch('/api/products').then(res => res.json()).then(data => setProducts(data)); }, []);",
    why_this_matters: "`useState` allows functional components to manage mutable state, while `useEffect` handles side effects like data fetching, subscriptions, or manual DOM manipulations. Together, they enable dynamic and interactive component behavior.",
    answer_keywords: ["useState", "useEffect", "state initialization", "side effects", "data fetching"],
    seed_code: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];

function ItemManager() {
  // State and logic will go here
  return (
    <div>
      <h1>Item Manager</h1>
      {/* UI elements will go here */}
    </div>
  );
}
`,
    starter_code: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];

function ItemManager() {
  // Add state variables and useEffect for initial data fetching here

  return (
    <div>
      <h1>Item Manager</h1>
      {/* UI elements will go here */}
    </div>
  );
}
`,
    feedback_correct: "Perfect! You've correctly set up state for your items and filter, and initiated data fetching on component mount.",
    feedback_partial: "You've initialized state, but ensure your `useEffect` has an empty dependency array to run only once on mount, and that you're setting the fetched data correctly.",
    feedback_wrong: "Review the `useState` and `useEffect` hooks. `useState` returns a state variable and a setter function, and `useEffect` takes a function and a dependency array.",
    expected: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];

function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  useEffect(() => {
    // Simulate API call
    const fetchedItems: Item[] = [
      { id: 1, name: 'Review documentation', status: 'active' },
      { id: 2, name: 'Update dependencies', status: 'archived' },
      { id: 3, name: 'Plan next sprint', status: 'active' },
    ];
    setItems(fetchedItems);
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div>
      <h1>Item Manager</h1>
      {/* UI elements will go here */}
    </div>
  );
}
`,
    analog_example: `
// In a component displaying a countdown timer:
function CountdownTimer() {
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timerId = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId); // Cleanup on unmount
  }, [secondsLeft]); // Reruns when secondsLeft changes

  return (
    <p>Time remaining: {secondsLeft}s</p>
  );
}
`,
    deepDiveLabel: "How do `useState` and `useEffect` work together?",
    deepDive: {
      hook: `
        Imagine you're building a dynamic web page, like a stock ticker or a chat application. The data isn't static; it changes over time, and your UI needs to react to these changes. How do you tell your component to "remember" certain values between renders, and how do you perform actions that aren't directly part of rendering, like fetching data from a server or setting up a timer? Without a mechanism to manage this internal "memory" and these "side effects," your components would be purely presentational, unable to interact with the outside world or maintain any dynamic state, severely limiting their utility.
      `,
      pain: `
        ⚠️ **Lesson:** Disconnected UI and external interactions. Symptom: UI doesn't update when data changes, or external operations (like API calls) are performed inefficiently or at the wrong times, leading to performance issues or incorrect data display.
      `,
      mentalModel: `
        **Mental model:** The "Component's Brain and Hands." Think of \`useState\` as the component's "brain" – it allows the component to remember specific pieces of information (its state) across different renders. When the brain decides to change a piece of information (e.g., \`setItems\`), the component re-renders to reflect that new memory. \`useEffect\` acts as the component's "hands" – it allows the component to reach out and interact with the "outside world" (like an API, the browser's DOM, or timers) *after* rendering. The dependency array of \`useEffect\` is like a set of instructions for the hands: "Only perform this action if these specific memories (dependencies) have changed." An empty dependency array means, "Do this once when I first wake up."
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `
        **Quick rules:**
        - ✅ Use \`useState\` for any data that changes over time and affects rendering.
        - ✅ Use \`useEffect\` for operations that interact with the outside world.
        - ✅ Always provide a dependency array to \`useEffect\` to control its execution.
        - ✅ Return a cleanup function from \`useEffect\` for subscriptions or timers.
        - ❌ Never call \`useState\` or \`useEffect\` inside loops, conditions, or nested functions.
        - ❌ Don't put non-reactive values in \`useState\` if they don't trigger re-renders.
        - ❌ Avoid complex logic directly inside \`useEffect\` without proper cleanup.
      `,
      watchOut: `
        👀 **Watch out:** Incorrect dependency arrays in \`useEffect\` are a common source of bugs. An empty array \`[]\` means the effect runs only once, which can lead to stale closures if the effect uses variables that change later. Omitting the array means it runs on every render, potentially causing performance issues or infinite loops. Always ensure your dependency array accurately reflects all values from the component's scope that the effect relies on.
      `,
      dryRun: `
        🔁 **Think:** When \`ItemManager\` first renders, \`items\` is \`[]\` and \`filterStatus\` is \`'all'\`. The \`useEffect\` hook runs. It simulates fetching items and then calls \`setItems\` with the new array of items. This triggers a re-render. On the second render, \`items\` now holds the fetched data, and \`filterStatus\` is still \`'all'\`. The \`useEffect\` does not run again because its dependency array \`[]\` is empty. (Hint: \`useEffect\` with \`[]\` ensures initial data load without re-fetching on subsequent renders.)
      `,
      build: "**Learning focus:** Implement state management for items and filters, and fetch initial data using `useState` and `useEffect`.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 6 of 8",
    paal: "With our state set up, let's build the basic JSX structure. We'll need a dropdown for filtering by status and a list to display our items. For now, we'll just render the structure without wiring up any interactivity.",
    hint: "Add a `select` element for the filter with `option` tags for 'All', 'Active', and 'Archived'. Then, map over the `items` array to render a simple `div` for each item, showing its name and status.",
    example_code: `
function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  useEffect(() => {
    const fetchedItems: Item[] = [
      { id: 1, name: 'Review documentation', status: 'active' },
      { id: 2, name: 'Update dependencies', status: 'archived' },
      { id: 3, name: 'Plan next sprint', status: 'active' },
    ];
    setItems(fetchedItems);
  }, []);

  // Filter items based on filterStatus
  const filteredItems = items.filter(item =>
    filterStatus === 'all' || item.status === filterStatus
  );

  return (
    <div>
      <h1>Item Manager</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="status-filter">Filter by Status: </label>
        <select id="status-filter" value={filterStatus}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        {filteredItems.length === 0 ? (
          <p>No items to display.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.5rem 0' }}>
              <h3>{item.name}</h3>
              <p>Status: {item.status}</p>
              {/* Toggle button will go here */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
`,
    think_prompt: "Which JSX structure correctly renders a dropdown for 'priority' filtering and a list of 'tasks'?",
    mc_options: [
      `<div><select><option value="high">High</option></select>{tasks.map(t => <p>{t.name}</p>)}</div>`,
      `<div><label>Filter: </label><select value={priorityFilter}><option value="all">All</option><option value="low">Low</option></select>{tasks.map(task => (<div key={task.id}><span>{task.title}</span></div>))}</div>`,
      `<div><input type="text" /><button>Add</button></div>`
    ],
    mc_correct_option: `<div><label>Filter: </label><select value={priorityFilter}><option value="all">All</option><option value="low">Low</option></select>{tasks.map(task => (<div key={task.id}><span>{task.title}</span></div>))}</div>`,
    mc_anchor: `<div><label>Filter: </label><select value={priorityFilter}><option value="all">All</option><option value="low">Low</option></select>{tasks.map(task => (<div key={task.id}><span>{task.title}</span></div>))}</div>`,
    why_this_matters: "Structuring your UI with clear, semantic JSX elements makes your component readable and accessible. Using `map` for lists is standard practice, and `key` props are essential for efficient list rendering.",
    answer_keywords: ["JSX", "select", "option", "map", "key", "list rendering"],
    seed_code: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];

function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  useEffect(() => {
    const fetchedItems: Item[] = [
      { id: 1, name: 'Review documentation', status: 'active' },
      { id: 2, name: 'Update dependencies', status: 'archived' },
      { id: 3, name: 'Plan next sprint', status: 'active' },
    ];
    setItems(fetchedItems);
  }, []);

  return (
    <div>
      <h1>Item Manager</h1>
      {/* UI elements will go here */}
    </div>
  );
}
`,
    starter_code: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];

function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  useEffect(() => {
    const fetchedItems: Item[] = [
      { id: 1, name: 'Review documentation', status: 'active' },
      { id: 2, name: 'Update dependencies', status: 'archived' },
      { id: 3, name: 'Plan next sprint', status: 'active' },
    ];
    setItems(fetchedItems);
  }, []);

  // Filter items based on filterStatus
  const filteredItems = items.filter(item =>
    filterStatus === 'all' || item.status === filterStatus
  );

  return (
    <div>
      <h1>Item Manager</h1>
      {/* Add filter dropdown and item list structure here */}
    </div>
  );
}
`,
    feedback_correct: "Excellent! You've laid out the core UI structure for filtering and displaying items.",
    feedback_partial: "You've started the UI structure, but ensure you include both the filter dropdown and the mapped list of items, using a `key` prop for each list item.",
    feedback_wrong: "Review how to render lists in JSX using `map` and how to create `select` elements with `option` tags.",
    expected: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];

function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  useEffect(() => {
    const fetchedItems: Item[] = [
      { id: 1, name: 'Review documentation', status: 'active' },
      { id: 2, name: 'Update dependencies', status: 'archived' },
      { id: 3, name: 'Plan next sprint', status: 'active' },
    ];
    setItems(fetchedItems);
  }, []);

  // Filter items based on filterStatus
  const filteredItems = items.filter(item =>
    filterStatus === 'all' || item.status === filterStatus
  );

  return (
    <div>
      <h1>Item Manager</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="status-filter">Filter by Status: </label>
        <select id="status-filter" value={filterStatus}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        {filteredItems.length === 0 ? (
          <p>No items to display.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.5rem 0' }}>
              <h3>{item.name}</h3>
              <p>Status: {item.status}</p>
              {/* Toggle button will go here */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
`,
    analog_example: `
// Rendering a list of blog posts with a category filter:
function BlogPostList() {
  const posts = [{ id: 1, title: 'Intro to JS', category: 'web' }];
  const categoryFilter = 'all'; // Assume this comes from state

  const filteredPosts = posts.filter(post =>
    categoryFilter === 'all' || post.category === categoryFilter
  );

  return (
    <div>
      <select value={categoryFilter}>
        <option value="all">All Categories</option>
        <option value="web">Web Development</option>
      </select>
      {filteredPosts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>Category: {post.category}</p>
        </article>
      ))}
    </div>
  );
}
`,
    deepDiveLabel: "Why is the `key` prop important in lists?",
    deepDive: {
      hook: `
        Imagine you have a dynamic list of items on your screen, like a to-do list where items can be added, removed, or reordered. If you don't give React a stable way to identify each individual item, it struggles to efficiently update the UI. When an item is removed from the middle of the list, React might simply re-render all subsequent items, even if they haven't changed, leading to performance issues. Worse, if you have state associated with individual list items (like an input field's value or a checkbox's checked state), React might incorrectly apply that state to the wrong item after a reorder or deletion, causing visual glitches and data inconsistencies.
      `,
      pain: `
        ⚠️ **Lesson:** Inefficient and incorrect list updates. Symptom: Performance degradation when lists change, or UI state (e.g., input values) gets misapplied to the wrong list items after reordering or deletion.
      `,
      mentalModel: `
        **Mental model:** The "Unique ID Badge." Think of the \`key\` prop as a unique ID badge that you give to each item in a list. When React renders a list, it uses these ID badges to keep track of which specific item is which. If the list changes (items are added, removed, or reordered), React doesn't just look at the position; it looks at the ID badges. If an item with a specific ID badge moves, React knows it's the *same item* just in a new position, so it can efficiently move its corresponding DOM element and preserve its internal state. If an item with a new ID badge appears, React knows it's a new item and creates a new DOM element for it. This makes updates precise and performant.
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `
        **Quick rules:**
        - ✅ Always provide a \`key\` prop when rendering lists of elements.
        - ✅ Use a stable, unique identifier from your data (e.g., database ID).
        - ✅ Ensure keys are unique among sibling elements.
        - ✅ Keys help React optimize updates and preserve component state.
        - ❌ Never use array index as a \`key\` if list items can change order.
        - ❌ Don't use non-unique or unstable values for keys.
        - ❌ Forgetting keys leads to performance warnings and potential bugs.
      `,
      watchOut: `
        👀 **Watch out:** While using an item's database ID is ideal for keys, sometimes you might not have one immediately (e.g., when creating new items client-side). In such cases, you might generate a temporary unique ID (e.g., using a library like \`uuid\`) until the item is persisted and receives a permanent ID. However, ensure this temporary ID is truly unique and stable for the item's lifetime in the list.
      `,
      dryRun: `
        🔁 **Think:** Consider a list \`[A, B, C]\` with keys \`[1, 2, 3]\`. If item \`B\` is removed, the list becomes \`[A, C]\`. React sees keys \`[1, 3]\`. It knows item \`1\` (A) is still there, item \`2\` (B) is gone, and item \`3\` (C) is still there but has moved position. Without keys, React might just think item \`B\` changed to \`C\`, leading to incorrect updates. With keys, it accurately identifies that \`B\` was deleted and \`C\` shifted up. (Hint: Keys enable React to perform minimal, targeted DOM manipulations.)
      `,
      build: "**Learning focus:** Construct the JSX for the filter dropdown and the dynamic list of items.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 7 of 8",
    paal: "Now, let's implement the logic for our interactive elements. We'll create functions to handle changing the filter status and toggling an item's status. These functions will update our local state and simulate API calls.",
    hint: "Define `handleFilterChange` to update `filterStatus` state. Define `toggleItemStatus` which takes an `itemId` and the `newStatus`, simulates an API call, and then updates the `items` state by mapping over the existing array.",
    example_code: `
function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  // Function to fetch items (could be called from useEffect or on refresh)
  const fetchItems = async () => {
    // Simulate API call
    const fetchedItems: Item[] = [
      { id: 1, name: 'Review documentation', status: 'active' },
      { id: 2, name: 'Update dependencies', status: 'archived' },
      { id: 3, name: 'Plan next sprint', status: 'active' },
    ];
    setItems(fetchedItems);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handler for filter dropdown change
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value as StatusFilter);
  };

  // Handler for toggling item status
  const toggleItemStatus = async (itemId: number, currentStatus: Item['status']) => {
    const newStatus = currentStatus === 'active' ? 'archived' : 'active';
    // Simulate API call to update status
    console.log(\`Simulating API call: PUT /items/\${itemId}/status with status: \${newStatus}\`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

    // Update local state to reflect the change
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
  };

  const filteredItems = items.filter(item =>
    filterStatus === 'all' || item.status === filterStatus
  );

  return (
    <div>
      <h1>Item Manager</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="status-filter">Filter by Status: </label>
        <select id="status-filter" value={filterStatus}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        {filteredItems.length === 0 ? (
          <p>No items to display.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.5rem 0' }}>
              <h3>{item.name}</h3>
              <p>Status: {item.status}</p>
              {/* Toggle button will go here */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
`,
    think_prompt: "Which code snippet correctly defines a handler for a dropdown change and a function to update a 'task' status?",
    mc_options: [
      "const handleCategoryChange = (e) => setCategory(e.target.value); const updateTaskStatus = (id, newStatus) => setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));",
      "function handleCategoryChange(value) { category = value; } function updateTaskStatus(id, newStatus) { tasks[id].status = newStatus; }",
      "const handleCategoryChange = (e) => console.log(e.target.value); const updateTaskStatus = (id, newStatus) => { /* API call only */ };"
    ],
    mc_correct_option: "const handleCategoryChange = (e) => setCategory(e.target.value); const updateTaskStatus = (id, newStatus) => setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));",
    mc_anchor: "const handleCategoryChange = (e) => setCategory(e.target.value); const updateTaskStatus = (id, newStatus) => setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));",
    why_this_matters: "Event handlers are the bridge between user interaction and state changes. By defining clear functions for these actions, you encapsulate logic, making your component more modular and easier to debug. Updating state immutably (e.g., with `map`) is crucial for React's efficient rendering.",
    answer_keywords: ["event handler", "state update", "immutable update", "API simulation", "map"],
    seed_code: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];

function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  useEffect(() => {
    const fetchedItems: Item[] = [
      { id: 1, name: 'Review documentation', status: 'active' },
      { id: 2, name: 'Update dependencies', status: 'archived' },
      { id: 3, name: 'Plan next sprint', status: 'active' },
    ];
    setItems(fetchedItems);
  }, []);

  // Filter items based on filterStatus
  const filteredItems = items.filter(item =>
    filterStatus === 'all' || item.status === filterStatus
  );

  return (
    <div>
      <h1>Item Manager</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="status-filter">Filter by Status: </label>
        <select id="status-filter" value={filterStatus}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        {filteredItems.length === 0 ? (
          <p>No items to display.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.5rem 0' }}>
              <h3>{item.name}</h3>
              <p>Status: {item.status}</p>
              {/* Toggle button will go here */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
`,
    starter_code: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];

function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  const fetchItems = async () => {
    const fetchedItems: Item[] = [
      { id: 1, name: 'Review documentation', status: 'active' },
      { id: 2, name: 'Update dependencies', status: 'archived' },
      { id: 3, name: 'Plan next sprint', status: 'active' },
    ];
    setItems(fetchedItems);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Add handleFilterChange and toggleItemStatus functions here

  const filteredItems = items.filter(item =>
    filterStatus === 'all' || item.status === filterStatus
  );

  return (
    <div>
      <h1>Item Manager</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="status-filter">Filter by Status: </label>
        <select id="status-filter" value={filterStatus}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        {filteredItems.length === 0 ? (
          <p>No items to display.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.5rem 0' }}>
              <h3>{item.name}</h3>
              <p>Status: {item.status}</p>
              {/* Toggle button will go here */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
`,
    feedback_correct: "Excellent! You've successfully implemented the core logic for filtering and status toggling, including simulating API interaction and immutable state updates.",
    feedback_partial: "You've defined the handlers, but ensure `handleFilterChange` correctly updates `filterStatus` and `toggleItemStatus` updates the `items` array immutably after the simulated API call.",
    feedback_wrong: "Review how to handle events in React and how to update array state immutably using `map`. Direct mutation of state variables will not trigger re-renders.",
    expected: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];

function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  // Function to fetch items (could be called from useEffect or on refresh)
  const fetchItems = async () => {
    // Simulate API call
    const fetchedItems: Item[] = [
      { id: 1, name: 'Review documentation', status: 'active' },
      { id: 2, name: 'Update dependencies', status: 'archived' },
      { id: 3, name: 'Plan next sprint', status: 'active' },
    ];
    setItems(fetchedItems);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handler for filter dropdown change
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value as StatusFilter);
  };

  // Handler for toggling item status
  const toggleItemStatus = async (itemId: number, currentStatus: Item['status']) => {
    const newStatus = currentStatus === 'active' ? 'archived' : 'active';
    console.log(\`Simulating API call: PUT /items/\${itemId}/status with status: \${newStatus}\`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

    // Update local state to reflect the change
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
  };

  const filteredItems = items.filter(item =>
    filterStatus === 'all' || item.status === filterStatus
  );

  return (
    <div>
      <h1>Item Manager</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="status-filter">Filter by Status: </label>
        <select id="status-filter" value={filterStatus}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        {filteredItems.length === 0 ? (
          <p>No items to display.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.5rem 0' }}>
              <h3>{item.name}</h3>
              <p>Status: {item.status}</p>
              {/* Toggle button will go here */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
`,
    analog_example: `
// In a component managing a list of notifications:
function NotificationList() {
  const [notifications, setNotifications] = useState<{ id: number; message: string; read: boolean }[]>([]);

  const markAsRead = (notificationId: number) => {
    // Simulate API call
    console.log(\`Marking notification \${notificationId} as read\`);
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    // Simulate API call
    console.log("Clearing all notifications");
    setNotifications([]);
  };

  return (
    <div>
      <button onClick={clearAllNotifications}>Clear All</button>
      {notifications.map(n => (
        <div key={n.id}>
          <p>{n.message} {n.read ? '(Read)' : '(Unread)'}</p>
          {!n.read && <button onClick={() => markAsRead(n.id)}>Mark Read</button>}
        </div>
      ))}
    </div>
  );
}
`,
    deepDiveLabel: "Why is immutable state updating crucial in React?",
    deepDive: {
      hook: `
        Imagine you have a list of items displayed on your screen. A user interacts with one item, changing its status. If you directly modify the original array of items in your component's state, React won't necessarily detect that a change has occurred. It might compare the "old" array reference with the "new" array reference, find they are the same (because you mutated the original object), and decide not to re-render the component. This leads to a stale UI where the user's action appears to have no effect, causing confusion and a broken user experience. This problem is particularly insidious because it doesn't always throw an error; the UI just fails to update.
      `,
      pain: `
        ⚠️ **Lesson:** Stale UI due to direct state mutation. Symptom: User actions don't reflect visually in the UI, or unexpected behavior occurs because React's rendering optimizations are bypassed.
      `,
      mentalModel: `
        **Mental model:** The "New Edition Principle." Think of your component's state as a book. When you want to make a change, you don't scribble directly into the existing book (mutating state). Instead, you create a brand new edition of the book (a new state object or array) that incorporates your changes. You then tell React, "Here's the new edition!" React can then easily compare the old edition with the new one, quickly identify what has changed, and efficiently update only the necessary parts of the UI. If you just scribble in the old book, React might not realize anything is different, and the readers (users) will see the old content.
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", \`filter\`, \`slice\`, or the spread syntax (\`...\`) to create new copies.
        - For objects, use the object spread syntax (\`{ ...oldObject, newProp: value }\`) to create a new object with updated properties.
        - This allows React to detect changes by comparing references and optimize re-renders.
      `,
      quickRules: `
        **Quick rules:**
        - ✅ Always create new array or object references when updating state.
        - ✅ Use \`map\` for transforming array elements.
        - ✅ Use \`filter\` for removing array elements.
        - ✅ Use spread syntax (\`...\`) for adding elements or merging objects.
        - ❌ Never directly modify state objects or arrays.
        - ❌ Don't use methods like \`push\`, \`pop\`, \`splice\`, or direct assignment on state arrays.
        - ❌ Avoid reassigning properties of state objects directly.
      `,
      watchOut: `
        👀 **Watch out:** Deeply nested objects or arrays can be tricky. If you have an array of objects, and those objects themselves contain arrays, you might need to perform multiple levels of immutable updates. Libraries like Immer can simplify this process by allowing you to write "mutating" logic that internally produces immutable updates, making your code cleaner for complex state structures.
      `,
      dryRun: `
        🔁 **Think:** Initial \`items\` state: \`[{ id: 1, status: 'active' }]\`. When \`toggleItemStatus(1, 'active')\` is called, it calculates \`newStatus\` as \`'archived'\`. Then, \`setItems\` is called with a function: \`prevItems => prevItems.map(...)\`. The \`map\` function creates a *new array*. Inside \`map\`, for item with \`id: 1\`, it creates a *new object* \`{ ...item, status: 'archived' }\`. The final \`setItems\` receives \`[{ id: 1, status: 'archived' }]\`. React compares the *reference* of the old array with the *reference* of the new array. Since they are different, React knows the state has changed and triggers a re-render. (Hint: The key is creating new references for arrays and objects.)
      `,
      build: "**Learning focus:** Implement event handlers for filter changes and item status toggling, ensuring immutable state updates.",
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 8 of 8",
    paal: "Finally, let's connect our handler functions to the UI elements. We'll add `onChange` to the filter dropdown and a button with an `onClick` handler to each item for toggling its status.",
    hint: "Add `onChange={handleFilterChange}` to the `select` element. Inside the `map` for items, add a `button` with an `onClick` handler that calls `toggleItemStatus` with the item's ID and current status.",
    example_code: `
function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  const fetchItems = async () => {
    const fetchedItems: Item[] = [
      { id: 1, name: 'Review documentation', status: 'active' },
      { id: 2, name: 'Update dependencies', status: 'archived' },
      { id: 3, name: 'Plan next sprint', status: 'active' },
    ];
    setItems(fetchedItems);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value as StatusFilter);
  };

  const toggleItemStatus = async (itemId: number, currentStatus: Item['status']) => {
    const newStatus = currentStatus === 'active' ? 'archived' : 'active';
    console.log(\`Simulating API call: PUT /items/\${itemId}/status with status: \${newStatus}\`);
    await new Promise(resolve => setTimeout(resolve, 300));

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
  };

  const filteredItems = items.filter(item =>
    filterStatus === 'all' || item.status === filterStatus
  );

  return (
    <div>
      <h1>Item Manager</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="status-filter">Filter by Status: </label>
        <select id="status-filter" value={filterStatus} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        {filteredItems.length === 0 ? (
          <p>No items to display.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.5rem 0' }}>
              <h3>{item.name}</h3>
              <p>Status: {item.status}</p>
              <button onClick={() => toggleItemStatus(item.id, item.status)}>
                {item.status === 'active' ? 'Archive' : 'Activate'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
`,
    think_prompt: "Which option correctly wires a 'change' event to a 'handleInput' function and a 'click' event to a 'handleClick' function?",
    mc_options: [
      `<input onchange={handleInput} /><button onclick={handleClick}></button>`,
      `<input onChange={handleInput()} /><button onClick={handleClick()}></button>`,
      `<input onChange={handleInput} /><button onClick={handleClick}></button>`
    ],
    mc_correct_option: `<input onChange={handleInput} /><button onClick={handleClick}></button>`,
    mc_anchor: `<input onChange={handleInput} /><button onClick={handleClick}></button>`,
    why_this_matters: "Wiring event handlers to UI elements is how you make your application interactive. Correctly passing functions (not function calls) ensures that the handlers are executed only when the event occurs, not during rendering.",
    answer_keywords: ["event handling", "onChange", "onClick", "function reference", "callback"],
    seed_code: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];

function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  const fetchItems = async () => {
    const fetchedItems: Item[] = [
      { id: 1, name: 'Review documentation', status: 'active' },
      { id: 2, name: 'Update dependencies', status: 'archived' },
      { id: 3, name: 'Plan next sprint', status: 'active' },
    ];
    setItems(fetchedItems);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value as StatusFilter);
  };

  const toggleItemStatus = async (itemId: number, currentStatus: Item['status']) => {
    const newStatus = currentStatus === 'active' ? 'archived' : 'active';
    console.log(\`Simulating API call: PUT /items/\${itemId}/status with status: \${newStatus}\`);
    await new Promise(resolve => setTimeout(resolve, 300));

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
  };

  const filteredItems = items.filter(item =>
    filterStatus === 'all' || item.status === filterStatus
  );

  return (
    <div>
      <h1>Item Manager</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="status-filter">Filter by Status: </label>
        <select id="status-filter" value={filterStatus}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        {filteredItems.length === 0 ? (
          <p>No items to display.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.5rem 0' }}>
              <h3>{item.name}</h3>
              <p>Status: {item.status}</p>
              {/* Toggle button will go here */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
`,
    starter_code: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];

function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  const fetchItems = async () => {
    const fetchedItems: Item[] = [
      { id: 1, name: 'Review documentation', status: 'active' },
      { id: 2, name: 'Update dependencies', status: 'archived' },
      { id: 3, name: 'Plan next sprint', status: 'active' },
    ];
    setItems(fetchedItems);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value as StatusFilter);
  };

  const toggleItemStatus = async (itemId: number, currentStatus: Item['status']) => {
    const newStatus = currentStatus === 'active' ? 'archived' : 'active';
    console.log(\`Simulating API call: PUT /items/\${itemId}/status with status: \${newStatus}\`);
    await new Promise(resolve => setTimeout(resolve, 300));

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
  };

  const filteredItems = items.filter(item =>
    filterStatus === 'all' || item.status === filterStatus
  );

  return (
    <div>
      <h1>Item Manager</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="status-filter">Filter by Status: </label>
        {/* Wire handleFilterChange to the select element */}
        <select id="status-filter" value={filterStatus}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        {filteredItems.length === 0 ? (
          <p>No items to display.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.5rem 0' }}>
              <h3>{item.name}</h3>
              <p>Status: {item.status}</p>
              {/* Add a button and wire toggleItemStatus to its onClick */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
`,
    feedback_correct: "Fantastic! Your UI is now fully interactive, allowing users to filter items and toggle their statuses, with changes reflected in the UI and synchronized with simulated API calls.",
    feedback_partial: "You've wired some elements, but ensure both the `select` element has its `onChange` handler and each item's button has its `onClick` handler correctly assigned.",
    feedback_wrong: "Review the syntax for attaching event handlers in JSX. Remember to pass a function reference, and for `onClick` with arguments, use an arrow function wrapper.",
    expected: `
interface Item {
  id: number;
  name: string;
  status: 'active' | 'archived';
}

type StatusFilter = 'all' | Item['status'];

function ItemManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  const fetchItems = async () => {
    const fetchedItems: Item[] = [
      { id: 1, name: 'Review documentation', status: 'active' },
      { id: 2, name: 'Update dependencies', status: 'archived' },
      { id: 3, name: 'Plan next sprint', status: 'active' },
    ];
    setItems(fetchedItems);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value as StatusFilter);
  };

  const toggleItemStatus = async (itemId: number, currentStatus: Item['status']) => {
    const newStatus = currentStatus === 'active' ? 'archived' : 'active';
    console.log(\`Simulating API call: PUT /items/\${itemId}/status with status: \${newStatus}\`);
    await new Promise(resolve => setTimeout(resolve, 300));

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
  };

  const filteredItems = items.filter(item =>
    filterStatus === 'all' || item.status === filterStatus
  );

  return (
    <div>
      <h1>Item Manager</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="status-filter">Filter by Status: </label>
        <select id="status-filter" value={filterStatus} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        {filteredItems.length === 0 ? (
          <p>No items to display.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} style={{ border: '1px solid #ccc', padding: '0.5rem', margin: '0.5rem 0' }}>
              <h3>{item.name}</h3>
              <p>Status: {item.status}</p>
              <button onClick={() => toggleItemStatus(item.id, item.status)}>
                {item.status === 'active' ? 'Archive' : 'Activate'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
`,
    analog_example: `
// In a component managing a list of user preferences with a toggle:
function UserSettings() {
  const [settings, setSettings] = useState<{ id: string; label: string; enabled: boolean }[]>([
    { id: 'email-notifs', label: 'Email Notifications', enabled: true },
    { id: 'dark-mode', label: 'Dark Mode', enabled: false },
  ]);

  const toggleSetting = (settingId: string) => {
    // Simulate API call
    console.log(\`Toggling setting \${settingId}\`);
    setSettings(prev =>
      prev.map(s => (s.id === settingId ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div>
      <h2>User Preferences</h2>
      {settings.map(setting => (
        <div key={setting.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
          <span>{setting.label}: {setting.enabled ? 'On' : 'Off'}</span>
          <button onClick={() => toggleSetting(setting.id)}>
            Toggle
          </button>
        </div>
      ))}
    </div>
  );
}
`,
    deepDiveLabel: "What's the difference between `onClick={handler}` and `onClick={handler()}`?",
    deepDive: {
      hook: `
        It's a common pitfall for beginners: you've written a perfect event handler function, but when you try to attach it to a button or input, it either fires immediately when the component renders, or it doesn't fire at all when the user interacts with the element. This can lead to unexpected behavior, infinite loops, or simply a non-responsive UI. Imagine a button that's supposed to increment a counter, but instead, it increments it a thousand times as soon as the page loads, or a filter dropdown that never actually filters anything. The subtle difference in how you pass your event handler can make or break your component's interactivity.
      `,
      pain: `
        ⚠️ **Lesson:** Incorrect event handler binding. Symptom: Event handlers fire prematurely (on render) or not at all (on interaction), leading to broken interactivity, infinite loops, or unexpected side effects.
      `,
      mentalModel: `
        **Mental model:** The "Function Reference vs. Function Call." Think of an event handler like a doorbell. When you attach \`onClick={handler}\`, you're essentially telling the doorbell, "Here's the *name* of the person (the function) to call when someone presses me." The doorbell then waits for a press before making the call. When you attach \`onClick={handler()}\`, you're immediately *calling* the person (executing the function) *right now* and then giving the doorbell whatever that person *returns*. If the function returns nothing (like \`void\`), the doorbell has nothing to call later. If it returns a new function, that new function becomes the handler. The key is to provide the doorbell with a *reference* to the function, not the *result* of calling it immediately.
      `,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", \`onChange\`), not lowercase HTML attributes (e.g., \`onclick\`).
      `,
      quickRules: `
        **Quick rules:**
        - ✅ Pass a function reference for handlers without arguments: \`onClick={myHandler}\`.
        - ✅ Use an arrow function wrapper for handlers with arguments: \`onClick={() => myHandler(arg)}\`.
        - ✅ Ensure your handler functions are defined within the component or passed as props.
        - ✅ Use camelCase for event handler props (e.g., \`onChange\`, \`onInput\`).
        - ❌ Never call the handler function directly in JSX if it's meant to run on an event: \`onClick={myHandler()}\`.
        - ❌ Don't use lowercase HTML event attributes (e.g., \`onclick\`) in JSX.
        - ❌ Avoid complex logic directly inside the JSX event handler; extract it to a named function.
      `,
      watchOut: `
        👀 **Watch out:** When using an arrow function wrapper like \`onClick={() => myFunction(arg)}\` inside a list's \`map\` method, a new function is created on every render for each list item. For very large lists or performance-critical scenarios, this *can* sometimes be a minor optimization concern, though typically negligible. If it becomes an issue, you might consider memoizing the child component or lifting the handler definition. However, for most cases, the arrow function wrapper is perfectly acceptable and readable.
      `,
      dryRun: `
        🔁 **Think:** When the \`ItemManager\` component first renders, the \`select\` element's \`onChange\` prop is assigned the *reference* to the \`handleFilterChange\` function. The button's \`onClick\` prop is assigned a *new arrow function* \`() => toggleItemStatus(item.id, item.status)\` for each item. Neither \`handleFilterChange\` nor \`toggleItemStatus\` are executed at this point. When a user clicks a button, the associated arrow function executes, which then calls \`toggleItemStatus\` with the correct arguments. If we had written \`onClick={toggleItemStatus(item.id, item.status)}\`, \`toggleItemStatus\` would execute immediately during render, causing an infinite loop or an error. (Hint: The arrow function delays execution until the event occurs.)
      `,
      build: "**Learning focus:** Connect UI elements to their respective event handler functions to enable full interactivity.",
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Status Type", id: "step1" },
  { label: "Step 2: Item Interface", id: "step1b" },
  { label: "Step 3: Add Status Field", id: "step1c" },
  { label: "Step 4: Component Shell", id: "step2" },
  { label: "Step 5: State & Effects", id: "step3" },
  { label: "Step 6: UI Structure", id: "step4" },
  { label: "Step 7: Handlers & Logic", id: "step5" },
  { label: "Step 8: Wire UI", id: "step6" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Status Toggling and Filtering UI",
  shortName: "Status Toggle Filter",
});
