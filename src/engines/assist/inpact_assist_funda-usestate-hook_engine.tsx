import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "funda-usestate-hook",
      title: "Managing UI State with useState",
      body: `Modern web applications are highly interactive, constantly responding to user input and changing data. To achieve this dynamism, components need a way to "remember" information that can change over time and affect what's displayed on the screen. This internal memory, or "state," is crucial for building user interfaces that feel alive and responsive. Without a mechanism to manage state, a component would simply render once with static data, unable to update its appearance or behavior based on user actions like clicks, form submissions, or data fetching. The \`useState\` hook provides the fundamental building block for giving functional components this essential memory.

This pattern is ubiquitous across all interactive UI development. You'll use \`useState\` to manage the visibility of elements (like a dropdown menu or a modal dialog), track the input values in a form field, control the active tab in a navigation bar, or keep track of whether a button is enabled or disabled. Any piece of data that can change and needs to trigger a re-render of your component is a candidate for \`useState\`. Mastering this hook is a prerequisite for building any non-trivial interactive user interface.`,
      usecase: "A settings panel where a user can toggle various options on and off, such as 'Enable Dark Mode' or 'Show Notifications'.",
      designMock: {"kind":"list-and-form","screenTitle":"Content Toggle","caption":"Toggle the visibility of sample content.","listCaption":"Content Items","emptyCaption":"No Content","emptyMessage":"No content to display. Add some below.","rows":[{"title":"Sample Content","subtitle":"Status","meta":"Hidden"}],"fields":[{"label":"Content Message","sample":"Hello World!"}],"submitLabel":"Add Content","rowToggle":{"values":["Hidden","Visible"],"labels":{"Hidden":"Show Content","Visible":"Hide Content"}},"metaFromField":{"index":0,"whenFilled":"Hidden","whenEmpty":"Hidden"}}
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Understand the purpose of the `useState` hook for managing component state.",
      "Declare a state variable and its setter function using `useState`.",
      "Initialize state with a default value.",
      "Update state in response to user interactions.",
      "Conditionally render UI elements based on state.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 7",
    paal: "To use the `useState` hook, you first need to import it from the `react` library. This makes the `useState` function available for use in your component.",
    hint: "Remember that hooks like `useState` are named exports from the `react` package.",
    example_code: `import { useState } from 'react';`,
    think_prompt: "Which line correctly imports the `useState` hook?",
    mc_options: [
      "import useState from 'react';",
      "import { useState } from 'react';",
      "import { Hook, useState } from 'react';",
    ],
    mc_correct_option: "import { useState } from 'react';",
    mc_anchor: "import-statement",
    why_this_matters: "Correctly importing `useState` is the first step to enabling state management in your functional components. Without it, your application won't recognize the hook.",
    answer_keywords: ["import", "useState", "react", "named export"],
    seed_code: ``,
    starter_code: `// Add the import statement for useState here
`,
    feedback_correct: "That's right! `useState` is a named export, so it needs to be destructured from 'react'.",
    feedback_partial: "You're close, but `useState` is a named export, not a default export. Check the curly braces.",
    feedback_wrong: "This is incorrect. `useState` is a named export from the 'react' library, not a default export or part of a larger `Hook` object.",
    expected: `import { useState } from 'react';`,
    analog_example: `// In Node.js, if you wanted to use a specific utility function 'readFile'
// from the 'fs' (file system) module, you'd import it like this:
import { readFile } from 'node:fs/promises';

async function loadFileContent(filePath: string) {
  try {
    const content = await readFile(filePath, { encoding: 'utf8' });
    console.log('File content:', content);
  } catch (error) {
    console.error('Failed to read file:', error);
  }
}

// This is similar to how you import specific functions (like useState)
// from a library (like React) to use them in your code.`,
    deepDiveLabel: "Why do we `import { useState }s from 'react';`?",
    deepDive: {
      hook: `Imagine you're building a custom toolbox. You don't want to carry the entire factory that makes tools; you just need a specific wrench for a specific job. In programming, libraries like 'react' are like those factories, containing many different functions and components. If you just wrote \`useState()\` without importing it, your JavaScript environment would have no idea what \`useState\` refers to. It's like asking for "the wrench" without specifying which toolbox it's in or where to find it. This leads to frustrating "useState is not defined" errors, halting your development before you even start.`,
      pain: `⚠️ **Lesson:** JavaScript modules require explicit imports for functions or variables exported from other files or libraries. Symptom: "ReferenceError: useState is not defined" or similar errors, indicating that the function you're trying to use hasn't been brought into the current scope.`,
      mentalModel: `**Mental model:** The Library Card. Think of the 'react' library as a vast public library. To borrow a specific book (like the \`useState\` hook), you need a library card and you must explicitly request that book by name. If the book is a popular, standalone title, you might just ask for "useState." If it's part of a collection, you might ask for "the useState book from the Hooks collection." The \`import { useState } from 'react';\` syntax is your library card and specific request, telling your program exactly where to find and how to use the 'useState' book.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
-   ✅ Use \`import { Name } from 'module';\` for named exports.
-   ✅ Place import statements at the top of your file for clarity.
-   ✅ Ensure the name inside the curly braces exactly matches the exported name.
-   ✅ Import only what you need to keep your bundle size smaller.
-   ❌ Never use \`import Name from 'module';\` for named exports (that's for default exports).
-   ❌ Don't forget the \`from 'module-name'\` part.
-   ❌ Avoid importing unused modules or functions.`,
      watchOut: `👀 **Watch out:** There's a difference between named exports (\`export const myFunc = ...;\`) and default exports (\`export default myFunc;\`). \`useState\` is a named export. If it were a default export, you'd write \`import MyFunc from 'react';\` (without curly braces, and you could name it anything). Using the wrong import syntax will lead to errors or undefined behavior.`,
      dryRun: `🔁 **Think:** If I write \`useState()\` in my component without the import:
    1.  The JavaScript engine encounters \`useState()\`.
    2.  It looks for a variable or function named \`useState\` in the current scope.
    3.  It doesn't find one.
    4.  Result: A "ReferenceError: useState is not defined" error occurs, and the application crashes.
    (Hint: Imports make external code available locally.)`,
      build: `**Learning focus:** Understand the syntax and necessity of importing named exports like \`useState\` to make them accessible in your code.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 7",
    paal: "Next, create a functional component. This component will house our state and render the UI that interacts with it. For this module, we'll create a simple `ToggleContent` component.",
    hint: "A functional component is a JavaScript function that returns JSX.",
    example_code: `function ToggleContent() {
  return (
    <div>
      {/* Content will go here */}
    </div>
  );
}`,
    think_prompt: "Which code snippet correctly defines a basic functional component named `ToggleContent`?",
    mc_options: [
      "const ToggleContent = () => { return <div></div>; };",
      "function ToggleContent() { return <div></div>; }",
      "class ToggleContent extends React.Component { render() { return <div></div>; } }",
    ],
    mc_correct_option: "function ToggleContent() { return <div></div>; }",
    mc_anchor: "component-shell",
    why_this_matters: "The functional component is the container for your UI logic and state. It's where you'll use `useState` and define how your UI behaves.",
    answer_keywords: ["function", "component", "JSX", "return"],
    seed_code: `import { useState } from 'react';`,
    starter_code: `import { useState } from 'react';

// Define your functional component here
`,
    feedback_correct: "Correct! A `function` declaration is a standard way to define a functional component.",
    feedback_partial: "This is a valid functional component using an arrow function, but the prompt asked for a `function` declaration. Both are common, but let's stick to the prompt's style for now.",
    feedback_wrong: "This defines a class component, which is an older way to write React components. We are focusing on functional components and hooks.",
    expected: `import { useState } from 'react';

function ToggleContent() {
  return (
    <div>
      {/* Content will go here */}
    </div>
  );
}`,
    analog_example: `// In plain JavaScript, you might define a function that generates a DOM element:
function createGreetingElement(name: string) {
  const div = document.createElement('div');
  div.textContent = \`Hello, \${name}!\`;
  return div;
}

// This is similar to a React functional component, which is a function
// that takes props (like 'name') and returns a description of UI (JSX,
// which React then turns into actual DOM elements).`,
    deepDiveLabel: "What makes a function a 'functional component'?",
    deepDive: {
      hook: `You've written many JavaScript functions before. They take inputs, perform operations, and return values. But in React, some functions have a special role: they describe what the user sees. If you just write a regular function that returns a string or a number, React won't know how to display it as part of your application's interface. It needs a specific kind of output to understand how to build the UI tree. What is that special output, and how does a function signal to React that it's meant to be a UI building block?`,
      pain: `⚠️ **Lesson:** Not all functions are React components. For a function to be recognized as a component, it must adhere to specific conventions. Symptom: React errors like "Objects are not valid as a React child" or your function's return value simply not appearing on screen.`,
      mentalModel: `**Mental model:** The UI Blueprint. Imagine a functional component as a blueprint for a small part of a building. It's a set of instructions that, when followed, constructs a specific section of the user interface. Just like a blueprint needs to be drawn in a specific format (e.g., architectural symbols, dimensions), a functional component needs to return a specific type of data (JSX) for React, the builder, to understand and construct the UI. It also needs to start with a capital letter to distinguish it from regular HTML elements.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", \`p\`).
-   **Return JSX:** A functional component must return JSX, which is a syntax extension for JavaScript that looks like HTML. This JSX describes the UI that React should render.
-   **Props:** Components can accept a single argument, typically called \`props\`, which is an object containing data passed from a parent component.`,
      quickRules: `**Quick rules:**
-   ✅ Name components with PascalCase (e.g., \`MyComponent\`).
-   ✅ Always return JSX from a component.
-   ✅ Components are just JavaScript functions.
-   ✅ Use \`props\` as the argument to receive data from parents.
-   ❌ Never name components with lowercase letters (e.g., \`myComponent\`).
-   ❌ Don't return plain strings, numbers, or objects directly (unless they are valid React children like null or booleans for conditional rendering).
-   ❌ Avoid side effects (like direct DOM manipulation) in the component body during rendering.`,
      watchOut: `👀 **Watch out:** While you can define components using either \`function MyComponent() {}\` or \`const MyComponent = () => {};\`, stick to one style for consistency. The key is the return value (JSX) and the naming convention (PascalCase). If you return something other than JSX (or \`null\`, \`undefined\`, \`true\`, \`false\`), React will likely throw an error or simply render nothing.`,
      dryRun: `🔁 **Think:** If I define \`function myComponent() { return 'Hello'; }\`:
    1.  React sees a function named \`myComponent\` (lowercase).
    2.  React treats it as a regular HTML element, not a component.
    3.  When used as \`<myComponent />\`, React tries to render a non-existent HTML tag, leading to a warning or error.
    (Hint: Capitalization matters for React to distinguish components from native elements.)`,
      build: `**Learning focus:** Understand the basic structure and naming conventions for creating a functional React component that can host state.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 7",
    paal: "Now, let's declare our state variable using `useState`. We want to track the visibility of some content, so a boolean state variable, `isVisible`, initialized to `false`, is perfect. `useState` returns an array: the current state value and a function to update it. We use array destructuring to get these two values.",
    hint: "The `useState` hook takes the initial state as an argument and returns a pair of values.",
    example_code: `const [isVisible, setIsVisible] = useState(false);`,
    think_prompt: "Which line correctly declares a state variable `isVisible` initialized to `false` and its setter `setIsVisible`?",
    mc_options: [
      "let isVisible = false;",
      "const [isVisible, setIsVisible] = useState(false);",
      "const isVisible = useState(false);",
    ],
    mc_correct_option: "const [isVisible, setIsVisible] = useState(false);",
    mc_anchor: "declare-state",
    why_this_matters: "This is the core of state management. `isVisible` will hold the current visibility status, and `setIsVisible` is the *only* way to change it and trigger a re-render.",
    answer_keywords: ["useState", "state variable", "setter function", "array destructuring", "initial state"],
    seed_code: `import { useState } from 'react';

function ToggleContent() {
  return (
    <div>
      {/* Content will go here */}
    </div>
  );
}`,
    starter_code: `import { useState } from 'react';

function ToggleContent() {
  // Declare your state variable here
  return (
    <div>
      {/* Content will go here */}
    </div>
  );
}`,
    feedback_correct: "Excellent! You've correctly used array destructuring to declare `isVisible` and `setIsVisible`, initializing `isVisible` to `false`.",
    feedback_partial: "You're on the right track with `useState(false)`, but you need to use array destructuring `[]` to get both the state variable and its setter function.",
    feedback_wrong: "This is incorrect. `let isVisible = false;` declares a regular JavaScript variable, not a React state variable. It won't trigger re-renders when changed.",
    expected: `import { useState } from 'react';

function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div>
      {/* Content will go here */}
    </div>
  );
}`,
    analog_example: `// In plain JavaScript, you might have a variable that tracks a status:
let isMenuOpen = false;

function toggleMenu() {
  isMenuOpen = !isMenuOpen; // Directly modify the variable
  // You would then manually update the DOM based on isMenuOpen
  const menuElement = document.getElementById('menu');
  if (menuElement) {
    menuElement.style.display = isMenuOpen ? 'block' : 'none';
  }
}

// With useState, React handles the DOM updates automatically when setIsVisible is called.
// You don't directly manipulate the DOM like 'menuElement.style.display = ...'`,
    deepDiveLabel: "What does `useState` return, and why `[value, setValue]`?",
    deepDive: {
      hook: `You want your component to "remember" a piece of data, like whether a menu is open or closed. You could just declare a regular JavaScript variable, like \`let isOpen = false;\`. But if you change \`isOpen\` to \`true\`, nothing on your screen updates. Your component doesn't know it needs to re-render. How do you tell React, "Hey, this piece of data changed, and now you need to update the UI to reflect it"? This is where the special return value of \`useState\` comes in.`,
      pain: `⚠️ **Lesson:** Directly modifying a regular JavaScript variable within a component will not trigger a re-render. Symptom: Your data changes, but the UI remains static, leading to a desynchronized view for the user.`,
      mentalModel: `**Mental model:** The State Register and Notifier. Imagine \`useState\` as a special register at a post office. When you call \`useState(false)\`, you're asking for a new entry in this register, initially marked 'false'. The post office gives you two things: a copy of the current entry's value (the 'false' itself) and a special pen (the 'setter function') that *only* works on this register entry. When you use the special pen to change the entry (e.g., to 'true'), the post office automatically sends a notification to everyone who needs to know (triggering a component re-render) so they can get the updated value.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
-   ✅ Always use the setter function (e.g., \`setIsVisible\`) to update state.
-   ✅ The initial value passed to \`useState\` is only used on the first render.
-   ✅ State variables are immutable; you replace them with new values, not modify them in place.
-   ✅ Use descriptive names for your state variables and their setters (e.g., \`isVisible\` and \`setIsVisible\`).
-   ❌ Never directly assign to the state variable (e.g., \`isVisible = true;\`).
-   ❌ Don't call \`useState\` inside loops, conditionals, or nested functions.
-   ❌ Avoid complex logic inside the \`useState\` argument; keep initializers simple.`,
      watchOut: `👀 **Watch out:** The initial value you pass to \`useState\` is only used once, during the component's very first render. If your component re-renders for other reasons (e.g., parent component updates), the \`useState(initialValue)\` call will *not* reset the state to \`initialValue\`. React remembers the current state value between renders.`,
      dryRun: `🔁 **Think:** Let's say we have \`const [count, setCount] = useState(0);\`.
    1.  **First render:** \`useState(0)\` is called. \`count\` is \`0\`. \`setCount\` is the function to update it.
    2.  **User clicks button, \`setCount(1)\` is called:** React schedules a re-render.
    3.  **Second render:** \`useState(0)\` is called again. React *ignores* the \`0\` because it remembers the state was updated to \`1\`. So, \`count\` is \`1\`.
    (Hint: The initial value is a one-time setup.)`,
      build: `**Learning focus:** Understand the \`useState\` hook's return signature and how to declare a state variable with its corresponding setter function.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 7",
    paal: "Now that we have our `isVisible` state, let's add a button to our component. This button will be responsible for triggering the state change. For now, we'll give it a static label.",
    hint: "Use a standard HTML `<button>` element inside your JSX.",
    example_code: `<button>Toggle Visibility</button>`,
    think_prompt: "Which JSX snippet correctly adds a button with the text 'Toggle Visibility'?",
    mc_options: [
      "<Button>Toggle Visibility</Button>",
      "<button>Toggle Visibility</button>",
      "<div>Toggle Visibility</div>",
    ],
    mc_correct_option: "<button>Toggle Visibility</button>",
    mc_anchor: "add-button",
    why_this_matters: "Buttons are common interactive elements. This step establishes the UI element that will initiate our state change, even before we wire up the logic.",
    answer_keywords: ["button", "JSX", "element"],
    seed_code: `import { useState } from 'react';

function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div>
      {/* Content will go here */}
    </div>
  );
}`,
    starter_code: `import { useState } from 'react';

function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div>
      {/* Add your button here */}
    </div>
  );
}`,
    feedback_correct: "Perfect! A standard `<button>` element is exactly what we need.",
    feedback_partial: "You've got the text right, but `<Button>` (with a capital B) would imply a custom React component, not a native HTML button. Let's use the native HTML tag for now.",
    feedback_wrong: "This is incorrect. A `<div>` is a generic container, not an interactive button. It won't respond to clicks in the same way.",
    expected: `import { useState } from 'react';

function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div>
      <button>Toggle Visibility</button>
      {/* Content will go here */}
    </div>
  );
}`,
    analog_example: `// In a simple HTML file, you'd add a button like this:
// <button id="myButton">Click Me</button>
// And then use JavaScript to add an event listener:
// document.getElementById('myButton')?.addEventListener('click', () => {
//   console.log('Button clicked!');
// });

// In React, you define the button directly in JSX, and the event handling
// will be attached using props like 'onClick'.`,
    deepDiveLabel: "Why use `<button>` instead of a `<div>` with an `onClick`?",
    deepDive: {
      hook: `You've probably seen many interactive elements on websites. Some look like buttons, some are links, and others might just be text that changes when you click it. While you *could* technically make almost any HTML element clickable using JavaScript, not all clickable elements are created equal. If you use a generic \`<div>\` and attach a click handler, it might look like a button, but it won't behave like one for everyone. What crucial aspects are you missing by not using the semantically correct element?`,
      pain: `⚠️ **Lesson:** Using semantically appropriate HTML elements is critical for accessibility, SEO, and default browser behavior. Symptom: Users relying on keyboard navigation or screen readers might struggle to interact with your UI, or your site might perform poorly in search engine rankings.`,
      mentalModel: `**Mental model:** The Right Tool for the Job. Imagine building a house. You wouldn't use a hammer to turn a screw, even if you could force it. You'd use a screwdriver. Similarly, in web development, HTML provides specific elements like \`<button>\`, \`<a>\`, \`<input>\` because they come with built-in behaviors, accessibility features, and semantic meaning. Using the right element (a \`<button>\` for an action) ensures your UI is robust, accessible, and understood by browsers and assistive technologies without extra effort.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
-   ✅ Use \`<button>\` for actions that trigger changes or submissions.
-   ✅ Use \`<a>\` for navigation to different pages or sections.
-   ✅ Consider accessibility from the start by using semantic HTML.
-   ✅ Leverage browser's built-in behaviors for interactive elements.
-   ❌ Never use a \`<div>\` or \`<span>\` when a more semantic element like \`<button>\` or \`<a>\` is appropriate.
-   ❌ Don't rely solely on visual cues for interactivity; ensure keyboard and screen reader support.
-   ❌ Avoid removing default button styles without providing clear visual feedback for interaction.`,
      watchOut: `👀 **Watch out:** While you can add an \`onClick\` handler to almost any HTML element in React, doing so for non-interactive elements like \`<div>\` or \`<span>\` creates accessibility issues. Users who navigate with a keyboard or use screen readers won't be able to interact with these "fake" buttons. Always prefer semantic HTML elements for their intended purpose.`,
      dryRun: `🔁 **Think:** If I use \`<div onClick={doSomething}>Click Me</div>\` instead of \`<button onClick={doSomething}>Click Me</button>\`:
    1.  **Keyboard User:** Tries to tab through the page. The \`<div>\` is skipped because it's not a naturally focusable element. The user cannot activate it.
    2.  **Screen Reader User:** Hears "Click Me" (just text), not "Click Me, button." They don't know it's interactive.
    3.  **Browser:** Doesn't apply default button styling or behavior (e.g., cursor change on hover).
    (Hint: Semantic HTML provides built-in accessibility and behavior.)`,
      build: `**Learning focus:** Understand the importance of using the correct semantic HTML element, like \`<button>\`, for interactive UI elements.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 7",
    paal: "Now, let's create a function that will update our `isVisible` state. This function, `handleToggle`, will simply flip the boolean value of `isVisible` using its setter, `setIsVisible`.",
    hint: "The setter function `setIsVisible` takes the new state value as an argument. To flip a boolean, use the `!` operator.",
    example_code: `const handleToggle = () => {
  setIsVisible(!isVisible);
};`,
    think_prompt: "Which code snippet correctly defines a function `handleToggle` that flips the `isVisible` state?",
    mc_options: [
      "function handleToggle() { isVisible = !isVisible; }",
      "const handleToggle = () => { setIsVisible(isVisible === false ? true : false); };",
      "const handleToggle = () => { setIsVisible(!isVisible); };",
    ],
    mc_correct_option: "const handleToggle = () => { setIsVisible(!isVisible); };",
    mc_anchor: "define-handler",
    why_this_matters: "This handler function encapsulates the logic for changing our state. It's a clean way to define what happens when a user interacts with our UI.",
    answer_keywords: ["handler", "function", "setIsVisible", "toggle", "boolean"],
    seed_code: `import { useState } from 'react';

function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button>Toggle Visibility</button>
      {/* Content will go here */}
    </div>
  );
}`,
    starter_code: `import { useState } from 'react';

function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);

  // Define your state update handler here

  return (
    <div>
      <button>Toggle Visibility</button>
      {/* Content will go here */}
    </div>
  );
}`,
    feedback_correct: "Exactly! `setIsVisible(!isVisible)` is the most concise and correct way to flip a boolean state.",
    feedback_partial: "This works, but `setIsVisible(!isVisible)` is a more concise and idiomatic way to toggle a boolean. Let's aim for that.",
    feedback_wrong: "This is incorrect. Directly assigning to `isVisible` will not trigger a re-render. You *must* use the `setIsVisible` function to update state.",
    expected: `import { useState } from 'react';

function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <button>Toggle Visibility</button>
      {/* Content will go here */}
    </div>
  );
}`,
    analog_example: `// In a simple web page, you might have a JavaScript function to toggle a CSS class:
const myElement = document.getElementById('myElement');
let isActive = false;

function toggleActiveState() {
  isActive = !isActive; // Update local variable
  if (myElement) {
    if (isActive) {
      myElement.classList.add('active');
    } else {
      myElement.classList.remove('active');
    }
  }
}

// In React, setIsVisible handles the 'isActive = !isActive' part AND
// automatically triggers the re-render to update the UI based on the new state.`,
    deepDiveLabel: "Why must we use `setIsVisible` instead of `isVisible = true`?",
    deepDive: {
      hook: `You've declared \`const [isVisible, setIsVisible] = useState(false);\`. It seems intuitive to just write \`isVisible = true;\` when you want to change the state. After all, that's how you change regular JavaScript variables. But if you try this, your UI won't update. The button will be clicked, the code will run, but the content will remain stubbornly hidden or visible. Why does React enforce this specific way of updating state, and what magic does \`setIsVisible\` perform that a direct assignment doesn't?`,
      pain: `⚠️ **Lesson:** Directly modifying a state variable (e.g., \`isVisible = true;\`) bypasses React's rendering mechanism. Symptom: State changes in your code, but the UI does not update, leading to a desynchronized application state and a broken user experience.`,
      mentalModel: `**Mental model:** The State's Gatekeeper. Imagine your component's state as a guarded vault. You can look at the contents (read \`isVisible\`), but you can't just walk in and change them directly. \`setIsVisible\` is the only authorized gatekeeper. When you hand a new value to \`setIsVisible\`, it not only updates the value in the vault but also sends a signal to React's central control tower, saying, "Hey, something important in this component's vault changed! It needs to be re-rendered to show the new contents." A direct assignment is like trying to sneak into the vault through a back door – the value might change, but no one gets notified, and the UI remains unaware.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
-   ✅ Always use the setter function returned by \`useState\` to update state.
-   ✅ Treat state variables as immutable; pass new values to the setter.
-   ✅ Use the functional update form (\`setCount(prev => prev + 1)\`) when the new state depends on the previous state.
-   ✅ Understand that calling a setter triggers a re-render of the component.
-   ❌ Never directly modify the state variable (e.g., \`myArray.push(item)\` or \`myObject.property = value\`).
-   ❌ Don't expect immediate state updates after calling a setter (they are asynchronous).
-   ❌ Avoid complex logic or side effects directly within the setter call.`,
      watchOut: `👀 **Watch out:** When your new state depends on the *previous* state (like \`count + 1\` or \`!isVisible\`), it's often safer to use the functional update form: \`setIsVisible(prevIsVisible => !prevIsVisible);\`. This ensures you're always working with the most up-to-date state value, especially if multiple updates happen in quick succession. While \`setIsVisible(!isVisible)\` works for simple toggles, the functional form prevents potential bugs in more complex scenarios.`,
      dryRun: `🔁 **Think:** Consider \`const [count, setCount] = useState(0);\` and a button that calls \`count = count + 1;\`.
    1.  **Initial:** \`count\` is \`0\`.
    2.  **Click:** \`count = count + 1;\` executes. \`count\` becomes \`1\`.
    3.  **Result:** The component *does not re-render*. The UI still shows \`0\`. The internal \`count\` variable is \`1\`, but React is unaware of the change.
    (Hint: React needs to be explicitly told to re-render.)`,
      build: `**Learning focus:** Understand that state *must* be updated using its setter function to trigger a re-render and maintain UI synchronization.`,
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 7",
    paal: "Now, let's wire our `handleToggle` function to the button's `onClick` event. Additionally, we'll make the button's label dynamic, so it says 'Hide' when content is visible and 'Show' when it's hidden.",
    hint: "Use the `onClick` prop for event handling and a ternary operator (`condition ? valueIfTrue : valueIfFalse`) for conditional text.",
    example_code: `<button onClick={handleToggle}>
  {isVisible ? 'Hide Content' : 'Show Content'}
</button>`,
    think_prompt: "Which code snippet correctly wires `handleToggle` to the button and dynamically sets its label?",
    mc_options: [
      `<button onclick="handleToggle()">{isVisible ? 'Hide Content' : 'Show Content'}</button>`,
      `<button onClick={handleToggle}>{isVisible ? 'Hide Content' : 'Show Content'}</button>`,
      `<button onClick={handleToggle}>Toggle Content</button>`,
    ],
    mc_correct_option: `<button onClick={handleToggle}>{isVisible ? 'Hide Content' : 'Show Content'}</button>`,
    mc_anchor: "wire-handler",
    why_this_matters: "Connecting user actions to state updates is how we make our UI interactive. Dynamic labels provide immediate feedback to the user about the current state.",
    answer_keywords: ["onClick", "event handler", "ternary operator", "dynamic label", "JSX expression"],
    seed_code: `import { useState } from 'react';

function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <button>Toggle Visibility</button>
      {/* Content will go here */}
    </div>
  );
}`,
    starter_code: `import { useState } from 'react';

function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      {/* Update this button to wire the handler and set the dynamic label */}
      <button>Toggle Visibility</button>
      {/* Content will go here */}
    </div>
  );
}`,
    feedback_correct: "Spot on! You've correctly used `onClick` with a JSX expression for the handler and a ternary for the dynamic label.",
    feedback_partial: "You've correctly wired the `onClick` handler, but the button label is still static. Use a ternary operator to make it dynamic based on `isVisible`.",
    feedback_wrong: "This is incorrect. In React JSX, event handlers use camelCase (`onClick`) and are passed a JavaScript function reference (not a string) within curly braces. Also, the label needs to be dynamic.",
    expected: `import { useState } from 'react';

function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <button onClick={handleToggle}>
        {isVisible ? 'Hide Content' : 'Show Content'}
      </button>
      {/* Content will go here */}
    </div>
  );
}`,
    analog_example: `// In plain HTML/JavaScript, you'd typically set up an event listener:
// <button id="toggleButton">Show Content</button>
//
// const toggleButton = document.getElementById('toggleButton');
// let isContentVisible = false;
//
// toggleButton.addEventListener('click', () => {
//   isContentVisible = !isContentVisible;
//   toggleButton.textContent = isContentVisible ? 'Hide Content' : 'Show Content';
//   // ... then manually update content visibility
// });

// React's 'onClick' prop abstracts away the 'addEventListener' part,
// and state updates automatically trigger re-renders for dynamic text.`,
    deepDiveLabel: "How does `onClick={handleToggle}` work in JSX?",
    deepDive: {
      hook: `You've written a function, \`handleToggle\`, that changes your state. Now you need to connect it to a button so that when a user clicks, your function runs. In traditional HTML, you might use \`<button onclick="someFunction()">\`. But in React JSX, you write \`onClick={someFunction}\`. Why the difference in syntax, and what's happening behind the scenes when you use curly braces with an event prop? It's not just a string; it's something more powerful.`,
      pain: `⚠️ **Lesson:** React's event system is a synthetic layer over native browser events, requiring specific JSX syntax. Symptom: Event handlers not firing, "function is not defined" errors, or unexpected behavior if you try to use plain HTML event attributes.`,
      mentalModel: `**Mental model:** The Event Dispatcher. Imagine React as a sophisticated event dispatcher sitting between your components and the browser's native events. When you write \`onClick={handleToggle}\`, you're not directly attaching a native \`onclick\` attribute. Instead, you're telling React, "When a click event bubbles up to this element, please call this JavaScript function, \`handleToggle\`." React normalizes these events across different browsers and manages their lifecycle, providing you with a consistent and performant event system. The curly braces \`{}\` signal that you're passing a JavaScript expression (in this case, a function reference), not a literal string.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", \`onChange\`, \`onSubmit\`), unlike their lowercase HTML equivalents (\`onclick\`, \`onchange\`).
-   **Function Reference:** You pass a *reference* to a JavaScript function (e.g., \`handleToggle\`) directly within curly braces \`{}\`. You do *not* call the function (e.g., \`handleToggle()\`) directly in the \`onClick\` prop, as that would execute it immediately during rendering.
-   **Synthetic Events:** React wraps native browser events in a "SyntheticEvent" object, which provides a consistent cross-browser API.`,
      quickRules: `**Quick rules:**
-   ✅ Use camelCase for all React event handlers (e.g., \`onClick\`, \`onMouseEnter\`).
-   ✅ Pass a function *reference* to the event handler prop (e.g., \`onClick={myFunction}\`).
-   ✅ Use curly braces \`{}\` to embed JavaScript expressions in JSX, including function references.
-   ✅ For dynamic text, use a ternary operator \`{condition ? 'True' : 'False'}\` inside JSX.
-   ❌ Never use lowercase HTML event attributes (e.g., \`onclick\`).
-   ❌ Don't call the function directly in the prop (e.g., \`onClick={myFunction()}\`).
-   ❌ Avoid complex logic or side effects directly within the JSX event handler; extract to a separate function.`,
      watchOut: `👀 **Watch out:** A common mistake is writing \`onClick={handleToggle()}\`. This immediately calls \`handleToggle\` when the component renders, not when the button is clicked. The result of \`handleToggle()\` (which is \`undefined\` in our case) is then assigned to \`onClick\`, meaning nothing happens when the button is actually clicked. Always pass the function reference, not the result of calling it.`,
      dryRun: `🔁 **Think:** Consider \`<button onClick={handleToggle}>\`.
    1.  **Initial Render:** React sees \`onClick={handleToggle}\`. It registers \`handleToggle\` as the function to call when a click event occurs on this button. It does *not* execute \`handleToggle\` at this point.
    2.  **User Clicks Button:** The browser's native click event fires. React's synthetic event system catches it.
    3.  **React calls \`handleToggle\`:** The \`handleToggle\` function is executed, which then calls \`setIsVisible(!isVisible)\`.
    4.  **Re-render:** \`setIsVisible\` triggers a re-render of the component with the updated \`isVisible\` state.
    (Hint: The function is passed as a reference, not executed immediately.)`,
      build: `**Learning focus:** Learn how to connect user interaction events (like clicks) to state update functions using JSX event props and how to display dynamic text.`,
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 7",
    paal: "Finally, let's conditionally render some content based on the `isVisible` state. We'll display a simple paragraph only when `isVisible` is `true`.",
    hint: "You can use the logical AND operator (`&&`) in JSX for conditional rendering, or a ternary operator.",
    example_code: `{isVisible && <p>This is the secret message!</p>}`,
    think_prompt: "Which code snippet correctly renders a paragraph with 'This is the secret message!' only when `isVisible` is `true`?",
    mc_options: [
      `{isVisible ? <p>This is the secret message!</p> : null}`,
      `{isVisible && <p>This is the secret message!</p>}`,
      `if (isVisible) { <p>This is the secret message!</p> }`,
    ],
    mc_correct_option: `{isVisible && <p>This is the secret message!</p>}`,
    mc_anchor: "conditional-render",
    why_this_matters: "Conditional rendering is fundamental for dynamic UIs. It allows parts of your component to appear or disappear based on state, props, or other conditions.",
    answer_keywords: ["conditional rendering", "logical AND", "JSX", "boolean state"],
    seed_code: `import { useState } from 'react';

function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <button onClick={handleToggle}>
        {isVisible ? 'Hide Content' : 'Show Content'}
      </button>
      {/* Content will go here */}
    </div>
  );
}`,
    starter_code: `import { useState } from 'react';

function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <button onClick={handleToggle}>
        {isVisible ? 'Hide Content' : 'Show Content'}
      </button>
      {/* Add your conditional content here */}
    </div>
  );
}`,
    feedback_correct: "Excellent! The `&&` operator is a concise way to conditionally render elements in JSX.",
    feedback_partial: "This works, but the `&&` operator is a more common and concise way to achieve this in JSX when you only want to render something if a condition is true, and nothing otherwise.",
    feedback_wrong: "This is incorrect. You cannot use `if` statements directly inside JSX. Conditional logic within JSX needs to be expressed using JavaScript expressions like the ternary operator or logical AND.",
    expected: `import { useState } from 'react';

function ToggleContent() {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <button onClick={handleToggle}>
        {isVisible ? 'Hide Content' : 'Show Content'}
      </button>
      {isVisible && <p>This is the secret message!</p>}
    </div>
  );
}`,
    analog_example: `// In plain JavaScript, you might conditionally add/remove an element from the DOM:
// const contentDiv = document.getElementById('content');
// let showContent = false;
//
// function updateContentVisibility() {
//   if (showContent) {
//     const p = document.createElement('p');
//     p.textContent = 'This is the secret message!';
//     contentDiv?.appendChild(p);
//   } else {
//     // Manually remove the element if it exists
//     while (contentDiv?.firstChild) {
//       contentDiv.removeChild(contentDiv.firstChild);
//     }
//   }
// }

// In React, the conditional JSX expression handles the creation/destruction
// of elements automatically when the state changes.`,
    deepDiveLabel: "How does `isVisible && <p>...</p>` work for conditional rendering?",
    deepDive: {
      hook: `You have a piece of content that should only appear when a certain condition is met – for instance, a secret message that only shows when a "Show" button is clicked. You can't just use a regular \`if\` statement directly inside your JSX, because JSX is a declarative syntax for describing UI, not a place for imperative control flow. So, how do you tell React, "Only render this part of the UI *if* this state variable is true, otherwise render nothing"?`,
      pain: `⚠️ **Lesson:** Standard JavaScript control flow statements (like \`if/else\`) cannot be used directly inside JSX. Symptom: Syntax errors or unexpected behavior when trying to embed \`if\` statements within your component's return JSX.`,
      mentalModel: `**Mental model:** The JSX Gatekeeper. Imagine JSX as a special language that only understands expressions – things that evaluate to a single value. An \`if\` statement is a statement, not an expression. The logical AND operator (\`&&\`) acts as a gatekeeper. If the condition on the left (\`isVisible\`) is false, the gatekeeper immediately stops and returns \`false\` (which React knows how to render as nothing). If the condition is true, the gatekeeper lets the right side (\`<p>...</p>\`) through, and that JSX element is rendered. It's a concise way to say, "If this is true, then render that; otherwise, render nothing."`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", the expression evaluates to the right-hand side. If the left-hand side is \`false\`, the expression evaluates to \`false\`.
-   **React's Handling of \`false\`:** React treats \`false\`, \`null\`, \`undefined\`, and \`0\` as "nothing to render" in JSX. So, \`false && <p>...</p>\` results in \`false\`, and React renders nothing.
-   **Ternary Operator (\`? :\`):** For cases where you need to render one thing if a condition is true and *another* thing if it's false, the ternary operator is more appropriate (\`condition ? trueValue : falseValue\`).`,
      quickRules: `**Quick rules:**
-   ✅ Use \`{condition && <Element />}\` to render an element only if the condition is true.
-   ✅ Use \`{condition ? <TrueElement /> : <FalseElement />}\` to render one of two elements based on a condition.
-   ✅ Embed JavaScript expressions within JSX using curly braces \`{}\`.
-   ✅ For lists, use \`map()\` for conditional rendering of multiple items.
-   ❌ Never use \`if/else\` statements directly inside JSX.
-   ❌ Don't forget the curly braces when embedding JavaScript expressions.
-   ❌ Avoid overly complex conditional logic directly in JSX; extract to helper functions or separate components if needed.`,
      watchOut: `👀 **Watch out:** While \`0 && <p>...</p>\` will correctly render nothing (because \`0\` is a falsy value), if you intend to display \`0\` itself, this pattern can be problematic. For example, \`count && <p>Count: {count}</p>\` would render nothing if \`count\` is \`0\`. In such cases, explicitly convert to a boolean (\`!!count && <p>...</p>\`) or use a ternary (\`count !== 0 ? <p>...</p> : null\`).`,
      dryRun: `🔁 **Think:** Let's trace \`{isVisible && <p>This is the secret message!</p>}\`.
    1.  **\`isVisible\` is \`false\`:** The expression becomes \`false && <p>...</p>\`.
    2.  **JavaScript evaluation:** The \`&&\` operator sees \`false\` on the left and immediately returns \`false\`.
    3.  **React rendering:** React receives \`false\` and renders nothing for that part of the UI.
    4.  **\`isVisible\` is \`true\`:** The expression becomes \`true && <p>...</p>\`.
    5.  **JavaScript evaluation:** The \`&&\` operator sees \`true\` on the left, so it evaluates and returns the right-hand side, which is the \`<p>...</p>\` JSX element.
    6.  **React rendering:** React receives the \`<p>...</p>\` element and renders it on the screen.
    (Hint: The \`&&\` operator's short-circuiting behavior is key.)`,
      build: `**Learning focus:** Understand how to use logical operators within JSX to conditionally display or hide UI elements based on state.`,
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Import useState", id: "step1" },
  { label: "Step 2: Component Shell", id: "step2" },
  { label: "Step 3: Declare State", id: "step3" },
  { label: "Step 4: Add Button", id: "step4" },
  { label: "Step 5: Define Handler", id: "step5" },
  { label: "Step 6: Wire Handler & Label", id: "step6" },
  { label: "Step 7: Conditional Render", id: "step7" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Fundamental: The useState Hook",
  shortName: "useState Hook",
});
