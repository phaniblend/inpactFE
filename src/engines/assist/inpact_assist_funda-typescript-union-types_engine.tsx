import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "funda-typescript-union-types",
      title: "Understanding TypeScript Union Types",
      body: `Software often deals with data that can take on one of several distinct forms or states. Without a clear way to express these possibilities, your code can become fragile, prone to errors, and difficult to understand. TypeScript's union types provide a powerful mechanism to declare that a variable or property can hold a value that belongs to one of several specified types, ensuring type safety and improving code clarity when dealing with such scenarios. This pattern is fundamental for building robust applications that handle diverse data gracefully.

This pattern appears frequently across many parts of an application. You'll encounter union types when defining the possible states of a UI component (e.g., 'loading' | 'success' | 'error'), specifying the allowed values for a configuration setting (e.g., 'light' | 'dark' theme), or describing different kinds of events that an application can process (e.g., 'click' | 'submit' | 'change'). Mastering union types allows you to write more expressive and safer code, making your applications more resilient to unexpected data and easier for other developers to maintain.`,
      usecase: "A settings panel where a theme can be 'light', 'dark', or 'system', and a function needs to apply the correct styling based on the chosen theme.",
      designMock: {"kind":"list-and-form","screenTitle":"Item Status","caption":"Manage items and their statuses. Use the form to add new items or update existing ones.","listCaption":"Current Items","emptyCaption":"No Items Yet","emptyMessage":"Add an item using the form below to get started.","rows":[{"title":"Widget A","subtitle":"ID: 101","meta":"active"},{"title":"Gadget B","subtitle":"ID: 102","meta":"pending"}],"fields":[{"label":"Item Name","sample":"New Item"},{"label":"Item ID","sample":"103"},{"label":"Status","options":["active","inactive","pending"]}],"submitLabel":"Add Item","rowToggle":{"values":["active","inactive"],"labels":{"active":"Deactivate","inactive":"Activate"}}}
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Define a TypeScript union type using the `|` operator.",
      "Apply union types to properties within interfaces or type aliases.",
      "Implement type narrowing to safely work with union-typed values.",
      "Understand the benefits of using union types for type safety and code clarity."
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: "The first step is to define a union type for the possible statuses an item can have. This tells TypeScript exactly which string literals are valid for this concept.",
    hint: "Use the `type` keyword followed by the name of your type, then assign it a combination of string literals separated by the `|` operator.",
    example_code: `type ItemStatus = 'active' | 'inactive' | 'pending';`,
    think_prompt: "Which syntax correctly defines a union type named `ItemStatus` that can be 'active', 'inactive', or 'pending'?",
    mc_options: [
      "type ItemStatus = ['active', 'inactive', 'pending'];",
      "type ItemStatus = 'active' | 'inactive' | 'pending';",
      "enum ItemStatus { Active, Inactive, Pending }"
    ],
    mc_correct_option: "type ItemStatus = 'active' | 'inactive' | 'pending';",
    mc_anchor: "type ItemStatus = 'active' | 'inactive' | 'pending';",
    why_this_matters: "Defining a union type upfront creates a single source of truth for all possible states, preventing typos and ensuring consistency across your application. It also makes your code self-documenting, clearly communicating the expected values.",
    answer_keywords: ["type", "union", "string literal", "pipe"],
    seed_code: ``,
    starter_code: `// Define a union type for item statuses here
`,
    feedback_correct: "Exactly! The `|` (pipe) symbol is used to create a union, meaning the type can be any one of the listed string literals. This is the foundation for type-safe state management.",
    feedback_partial: "You're close, but the syntax for defining a union of string literals uses the `|` operator, not an array. Arrays define a list of items, not a choice of types for a single item.",
    feedback_wrong: "That's an enum, which is a different concept for a set of named constants. For a type that can be one of several specific string values, you need a union type using the `|` operator.",
    expected: `type ItemStatus = 'active' | 'inactive' | 'pending';`,
    analog_example: `// In a different context, like user roles:
type UserRole = 'admin' | 'editor' | 'viewer';

function assignRole(userId: string, role: UserRole): void {
  console.log(\`Assigning role \${role} to user \${userId}\`);
}

assignRole('user-123', 'editor'); // Valid
// assignRole('user-456', 'guest'); // TypeScript error: 'guest' is not assignable to type 'UserRole'
`,
    deepDiveLabel: "Why not just use `string`?",
    deepDive: {
      hook: `Imagine you're building a system where an item can have a status: 'active', 'inactive', or 'pending'. If you simply declare a variable \`itemStatus: string;\`, TypeScript will happily let you assign \`'active'\`, \`'inactive'\`, \`'pending'\`, but also \`'typo'\`, \`'finished'\`, or even an empty string \`''\`. Your code might then try to perform actions based on these statuses, leading to runtime errors or unexpected behavior because it's expecting one of the three specific values. You'd have to write extensive runtime checks everywhere, which is tedious, error-prone, and doesn't catch issues until the code actually runs. This lack of compile-time safety means you could ship bugs that only surface when a user enters an unexpected status, making debugging a nightmare.`,
      pain: `⚠️ **Lesson:** Without union types, you lose compile-time safety for discrete sets of values. Symptom: Runtime errors due to unexpected string values, verbose runtime validation, and difficulty understanding what values are truly allowed.`,
      mentalModel: `**Mental model:** The "Either/Or" Switch. Think of a union type like a physical switch that can only be in one of several clearly labeled positions. It can't be 'half-on' or in a position that isn't explicitly marked. Each label ('active', 'inactive', 'pending') is a distinct, valid state. TypeScript ensures that when you interact with this switch, you only ever try to set it to one of its predefined positions, preventing you from trying to set it to a non-existent 'off-off' position.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use union types for properties that can only take a specific, finite set of values (e.g., 'red' | 'green' | 'blue').
- ✅ Combine different primitive types (e.g., \`string | number\`) when a value could genuinely be either.
- ✅ Use union types to define distinct shapes for objects that share a common purpose but have different structures (e.g., different event types).
- ✅ Define union types at a module scope to ensure reusability and consistency.
- ❌ Do not use union types when a variable can truly be *any* string; use \`string\` instead.
- ❌ Avoid overly broad union types like \`any | string | number\` as they defeat the purpose of type safety.
- ❌ Do not use an array type (e.g., \`string[]\`) when you mean a single value that can be one of several types.`,
      watchOut: `👀 **Watch out:** While union types are powerful, they don't automatically provide runtime validation. TypeScript checks types at compile time. If data comes from an external source (like an API or user input), you'll still need runtime checks to ensure it conforms to your union type before TypeScript can guarantee its safety. Forgetting this can lead to runtime errors even with strong TypeScript definitions.`,
      dryRun: `🔁 **Think:** If we define \`type Color = 'red' | 'green';\` and then declare \`let myColor: Color;\`.
1.  \`myColor = 'red';\` -> This is valid because 'red' is one of the types in the union.
2.  \`myColor = 'blue';\` -> This would cause a TypeScript error because 'blue' is not part of the 'red' | 'green' union.
3.  \`myColor = 'green';\` -> This is valid, similar to 'red'.
(Hint: The type system enforces membership in the union.)`,
      build: "The learning focus for this step is to correctly define a TypeScript union type using string literals and the `|` operator."
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: "Now that we have our `ItemStatus` union type, let's use it within an interface to define the structure of an `Item` object. This ensures that any `Item` created will have a `status` property that adheres to our defined union.",
    hint: "Create an `interface Item` and give it `id`, `name`, and `status` properties. For `status`, use the `ItemStatus` type you just defined.",
    example_code: `interface Item {
  id: string;
  name: string;
  status: ItemStatus;
}`,
    think_prompt: "How would you define an `Item` interface that includes `id` (string), `name` (string), and `status` (using the `ItemStatus` union type)?",
    mc_options: [
      `interface Item { id: string; name: string; status: string[]; }`,
      `interface Item { id: string; name: string; status: ItemStatus; }`,
      `type Item = { id: string, name: string, status: 'active' | 'inactive' | 'pending' };`
    ],
    mc_correct_option: `interface Item { id: string; name: string; status: ItemStatus; }`,
    mc_anchor: `interface Item { id: string; name: string; status: ItemStatus; }`,
    why_this_matters: "Integrating union types into interfaces or type aliases ensures that data structures consistently use the defined set of allowed values. This makes your data models more precise and prevents invalid states from being represented.",
    answer_keywords: ["interface", "property", "type alias", "consistency"],
    seed_code: `type ItemStatus = 'active' | 'inactive' | 'pending';
`,
    starter_code: `type ItemStatus = 'active' | 'inactive' | 'pending';

// Define the Item interface here
`,
    feedback_correct: "Excellent! By assigning `ItemStatus` to the `status` property, you've ensured that any `Item` object will have a `status` that is one of 'active', 'inactive', or 'pending'.",
    feedback_partial: "You've correctly defined an interface, but using `string[]` for `status` means it expects an array of strings, not a single string that is one of the `ItemStatus` values. Remember to reuse the `ItemStatus` type you just created.",
    feedback_wrong: "While using a type alias with an inline union type is technically correct, it's better practice to reuse the `ItemStatus` type you already defined. This keeps your code DRY (Don't Repeat Yourself) and easier to update.",
    expected: `type ItemStatus = 'active' | 'inactive' | 'pending';

interface Item {
  id: string;
  name: string;
  status: ItemStatus;
}`,
    analog_example: `// Defining different types of notifications
type NotificationType = 'info' | 'warning' | 'error';

interface Notification {
  id: string;
  message: string;
  type: NotificationType; // Using the union type here
  timestamp: Date;
}

const myNotification: Notification = {
  id: 'notif-001',
  message: 'Disk space low!',
  type: 'warning', // Must be 'info', 'warning', or 'error'
  timestamp: new Date()
};
`,
    deepDiveLabel: "How do interfaces and type aliases relate to union types?",
    deepDive: {
      hook: `You've just seen how to define a standalone union type and then use it within an interface. But what if you wanted to define a complex object that itself could be one of several distinct shapes? For instance, a 'User' object might have different properties depending on whether they are 'authenticated' or 'guest'. Without a clear way to combine these distinct object structures, you'd end up with a single, massive interface full of optional properties, leading to confusing code where you'd constantly have to check if a property exists before using it, or worse, type assertions that bypass type safety entirely.`,
      pain: `⚠️ **Lesson:** Union types are crucial for defining data structures that can take on distinct, mutually exclusive forms. Symptom: Overly complex interfaces with many optional properties, requiring constant runtime checks, or unsafe type assertions to handle different object shapes.`,
      mentalModel: `**Mental model:** The "Blueprint with Flexible Parts." Imagine an interface as a blueprint for a specific kind of machine. When you use a union type within that blueprint, it's like saying, "For this particular part of the machine, you can either install Component A OR Component B OR Component C." The blueprint itself is fixed, but one of its internal components has a predefined set of interchangeable options, all of which are valid for that slot. TypeScript ensures that whatever component you put in that slot is one of the allowed options.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", allowing a variable to hold one of several distinct object structures.
- This approach makes your data models more precise and easier to reason about, especially when dealing with polymorphic data.`,
      quickRules: `**Quick rules:**
- ✅ Use union types for properties that have a limited set of discrete values.
- ✅ Apply union types directly to properties in interfaces or type aliases.
- ✅ Create union types of object interfaces when a variable can hold one of several distinct object shapes.
- ✅ Reuse named union types (like \`ItemStatus\`) to keep your code clean and maintainable.
- ❌ Do not use \`any\` for properties that should have a union type; this defeats type safety.
- ❌ Avoid defining the same union type inline multiple times; use a type alias.
- ❌ Do not use a union type if the property can truly be *any* string, number, etc.`,
      watchOut: `👀 **Watch out:** When you define a union type for a property, TypeScript will enforce that at compile time. However, if you're receiving data from an external source (like an API), that data might not conform. You'll need to validate incoming data *at runtime* to ensure it matches your \`ItemStatus\` union before assigning it, otherwise, you might still encounter issues even with a strong type definition.`,
      dryRun: `🔁 **Think:** Given \`interface Product { id: string; category: 'electronics' | 'books'; }\`.
1.  \`const laptop: Product = { id: 'L1', category: 'electronics' };\` -> Valid, 'electronics' is in the union.
2.  \`const novel: Product = { id: 'N1', category: 'books' };\` -> Valid, 'books' is in the union.
3.  \`const toy: Product = { id: 'T1', category: 'toys' };\` -> TypeScript error, 'toys' is not in the union.
(Hint: The interface property's type is strictly enforced by the union.)`,
      build: "The learning focus for this step is to correctly apply a previously defined union type to a property within an interface definition."
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: "Now, let's create a function that takes an `Item` as an argument. This function will be responsible for processing the item based on its status. By typing the parameter as `Item`, TypeScript will ensure that any object passed to this function conforms to our `Item` interface, including its `ItemStatus` property.",
    hint: "Define a function named `processItem` that accepts one parameter, `item`, typed as `Item`. For now, just add a `console.log` inside.",
    example_code: `function processItem(item: Item): void {
  console.log(\`Processing item \${item.name} with status \${item.status}\`);
}`,
    think_prompt: "Which function signature correctly defines `processItem` to accept an `Item` object?",
    mc_options: [
      `function processItem(item: any) { }`,
      `function processItem(item: { id: string; name: string; status: string; }) { }`,
      `function processItem(item: Item): void { }`
    ],
    mc_correct_option: `function processItem(item: Item): void { }`,
    mc_anchor: `function processItem(item: Item): void { }`,
    why_this_matters: "Typing function parameters with interfaces that incorporate union types ensures that the function receives valid data. This improves the reliability of your functions and makes their expected inputs clear.",
    answer_keywords: ["function", "parameter", "type safety", "interface"],
    seed_code: `type ItemStatus = 'active' | 'inactive' | 'pending';

interface Item {
  id: string;
  name: string;
  status: ItemStatus;
}
`,
    starter_code: `type ItemStatus = 'active' | 'inactive' | 'pending';

interface Item {
  id: string;
  name: string;
  status: ItemStatus;
}

// Define the processItem function here
`,
    feedback_correct: "Spot on! By typing the `item` parameter as `Item`, you've leveraged TypeScript's power to ensure that only valid `Item` objects, with their correctly typed `status`, can be passed to this function.",
    feedback_partial: "You're close, but using `any` defeats the purpose of TypeScript's type safety. The goal is to ensure the function receives a specific `Item` type, not just any value.",
    feedback_wrong: "This signature uses `string` for `status`, which is too broad. It doesn't enforce the `ItemStatus` union. You should use the `Item` interface directly to ensure full type safety.",
    expected: `type ItemStatus = 'active' | 'inactive' | 'pending';

interface Item {
  id: string;
  name: string;
  status: ItemStatus;
}

function processItem(item: Item): void {
  console.log(\`Processing item \${item.name} with status \${item.status}\`);
}`,
    analog_example: `// A function to handle different types of user feedback
type FeedbackType = 'bug' | 'feature_request' | 'general_inquiry';

interface Feedback {
  id: string;
  type: FeedbackType;
  message: string;
  userId?: string;
}

function handleFeedback(feedback: Feedback): void {
  console.log(\`Received \${feedback.type} feedback from \${feedback.userId || 'anonymous'}: \${feedback.message}\`);
}

const bugReport: Feedback = {
  id: 'fb-001',
  type: 'bug',
  message: 'App crashes on login.',
  userId: 'user-alpha'
};

handleFeedback(bugReport);
`,
    deepDiveLabel: "What happens if a function parameter isn't typed?",
    deepDive: {
      hook: `Imagine you've meticulously defined your \`ItemStatus\` and \`Item\` types, ensuring every piece of data in your application is perfectly structured. Then, you write a function \`processItem(item)\` but forget to add \`: Item\` to the parameter. TypeScript, in its default configuration, might infer \`item\` as \`any\`. Now, inside your function, you could accidentally try to access \`item.nonExistentProperty\` or assign \`item.status = 'invalid-status'\`, and TypeScript wouldn't warn you. All the careful type definitions you made would be bypassed, leading to potential runtime errors that could have been caught at compile time.`,
      pain: `⚠️ **Lesson:** Untyped function parameters can undermine your entire type system. Symptom: Loss of compile-time safety within the function body, allowing invalid property access or assignments that lead to runtime errors.`,
      mentalModel: `**Mental model:** The "Untrusted Gatekeeper." Think of a function as a gatekeeper for a specific operation. If you don't give the gatekeeper clear instructions (type annotations) about what kind of data is allowed through the gate, it will let anything pass. Even if you've carefully prepared the data outside the gate, once it's inside, the gatekeeper (the function) won't enforce any rules, potentially allowing corrupted or unexpected data to proceed and cause problems.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Always type your function parameters with the most specific type possible (e.g., an interface or union type).
- ✅ Use interfaces or type aliases for complex object parameters to keep signatures clean.
- ✅ Add a return type annotation to functions for clarity and type safety.
- ✅ Leverage type inference for simple cases, but be explicit for complex or critical parameters.
- ❌ Never use \`any\` for parameters unless absolutely necessary and understood.
- ❌ Do not omit type annotations for parameters if the inferred type is too broad or incorrect.
- ❌ Avoid repeating complex type definitions directly in function signatures; use type aliases or interfaces instead.`,
      watchOut: `👀 **Watch out:** While typing parameters is crucial, remember that TypeScript's type checking happens at compile time. If your function receives data from an external source (like a network request) that *claims* to be an \`Item\` but is actually malformed, TypeScript won't catch that at runtime. You might need additional runtime validation (e.g., using a validation library) to ensure incoming data truly matches your types before processing it.`,
      dryRun: `🔁 **Think:** Given \`function greet(name: string): void { console.log(\`Hello, \${name}!\`); }\`.
1.  \`greet('Alice');\` -> Valid, 'Alice' is a string. Output: "Hello, Alice!"
2.  \`greet(123);\` -> TypeScript error, 123 is a number, not a string.
3.  \`greet(true);\` -> TypeScript error, true is a boolean, not a string.
(Hint: The parameter type annotation strictly controls what can be passed.)`,
      build: "The learning focus for this step is to correctly define a function that accepts an object typed with a custom interface, ensuring type safety for its properties."
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: "Inside our `processItem` function, we need to perform different actions based on the `item.status`. TypeScript's type narrowing (or type guards) allows us to check the value of `item.status` and, within that conditional block, TypeScript will know the exact type of `status`, enabling specific logic for each case.",
    hint: "Use `if/else if` statements to check the value of `item.status`. Inside each block, add a `console.log` specific to that status.",
    example_code: `function processItem(item: Item): void {
  if (item.status === 'active') {
    console.log(\`Item \${item.name} is active. Ready for use.\`);
  } else if (item.status === 'inactive') {
    console.log(\`Item \${item.name} is inactive. Requires activation.\`);
  } else if (item.status === 'pending') {
    console.log(\`Item \${item.name} is pending review. Awaiting approval.\`);
  } else {
    // This 'else' block is often used for exhaustive checking with union types
    // If ItemStatus ever gets a new type, TypeScript would warn if this isn't handled.
    console.log(\`Item \${item.name} has an unknown status: \${item.status}\`);
  }
}`,
    think_prompt: "How would you add logic to `processItem` to log a different message for 'active', 'inactive', and 'pending' statuses using type narrowing?",
    mc_options: [
      `if (item.status === 'active') { /* ... */ } else { /* ... */ }`,
      `switch (item.status) { case 'active': /* ... */ case 'inactive': /* ... */ default: /* ... */ }`,
      `if (item.status === 'active') { /* ... */ } else if (item.status === 'inactive') { /* ... */ } else if (item.status === 'pending') { /* ... */ }`
    ],
    mc_correct_option: `if (item.status === 'active') { /* ... */ } else if (item.status === 'inactive') { /* ... */ } else if (item.status === 'pending') { /* ... */ }`,
    mc_anchor: `if (item.status === 'active') { /* ... */ } else if (item.status === 'inactive') { /* ... */ } else if (item.status === 'pending') { /* ... */ }`,
    why_this_matters: "Type narrowing allows you to write specific, type-safe logic for each variant within a union type. This eliminates the need for unsafe type assertions and ensures that your code correctly handles all possible states, leading to more robust and predictable behavior.",
    answer_keywords: ["type narrowing", "type guard", "conditional logic", "if/else if"],
    seed_code: `type ItemStatus = 'active' | 'inactive' | 'pending';

interface Item {
  id: string;
  name: string;
  status: ItemStatus;
}

function processItem(item: Item): void {
  console.log(\`Processing item \${item.name} with status \${item.status}\`);
}
`,
    starter_code: `type ItemStatus = 'active' | 'inactive' | 'pending';

interface Item {
  id: string;
  name: string;
  status: ItemStatus;
}

function processItem(item: Item): void {
  // Add conditional logic here to handle different item statuses
  console.log(\`Processing item \${item.name} with status \${item.status}\`);
}
`,
    feedback_correct: "Perfect! By using `if/else if` statements, you've successfully narrowed the type of `item.status` within each block. TypeScript now understands that inside the first `if`, `item.status` is definitely `'active'`, and so on.",
    feedback_partial: "Using a `switch` statement is also a valid way to narrow types, but the prompt specifically asked for `if/else if`. The key is to ensure each distinct status is handled separately.",
    feedback_wrong: "While an `if/else` structure is a start, it only handles two cases. For three distinct statuses, you need `else if` to cover all possibilities explicitly. Otherwise, the `else` block would catch both 'inactive' and 'pending' without distinguishing them.",
    expected: `type ItemStatus = 'active' | 'inactive' | 'pending';

interface Item {
  id: string;
  name: string;
  status: ItemStatus;
}

function processItem(item: Item): void {
  if (item.status === 'active') {
    console.log(\`Item \${item.name} is active. Ready for use.\`);
  } else if (item.status === 'inactive') {
    console.log(\`Item \${item.name} is inactive. Requires activation.\`);
  } else if (item.status === 'pending') {
    console.log(\`Item \${item.name} is pending review. Awaiting approval.\`);
  } else {
    // This 'else' block is often used for exhaustive checking with union types
    // If ItemStatus ever gets a new type, TypeScript would warn if this isn't handled.
    console.log(\`Item \${item.name} has an unknown status: \${item.status}\`);
  }
}`,
    analog_example: `// Handling different types of user input events
type InputEvent = { type: 'text'; value: string } | { type: 'checkbox'; checked: boolean };

function handleInput(event: InputEvent): void {
  if (event.type === 'text') {
    console.log(\`Text input: \${event.value}\`); // 'event' is narrowed to { type: 'text'; value: string }
  } else if (event.type === 'checkbox') {
    console.log(\`Checkbox checked: \${event.checked}\`); // 'event' is narrowed to { type: 'checkbox'; checked: boolean }
  }
}

handleInput({ type: 'text', value: 'Hello' });
handleInput({ type: 'checkbox', checked: true });
`,
    deepDiveLabel: "What is 'type narrowing' and why is it important?",
    deepDive: {
      hook: `You've defined an \`Item\` with a \`status\` that can be 'active', 'inactive', or 'pending'. Now, inside your \`processItem\` function, you want to do something specific for each status. If you just try to access a property that only exists on, say, an 'active' item (if your union type was more complex, like \`{ status: 'active', readyDate: Date } | { status: 'inactive' }\`), TypeScript would complain that the property might not exist on all union members. You'd be stuck, unable to write specific logic without resorting to unsafe \`any\` casts or ignoring compiler errors, which defeats the entire purpose of using TypeScript.`,
      pain: `⚠️ **Lesson:** Without type narrowing, TypeScript cannot guarantee safety when accessing properties or methods specific to one member of a union. Symptom: Compiler errors when trying to access specific properties on a union-typed variable, or resorting to unsafe type assertions.`,
      mentalModel: `**Mental model:** The "Specialized Lens." Imagine you have a box of mixed items (your union type). You can't use a tool designed only for 'active' items on the whole box, because some items might be 'inactive' or 'pending'. Type narrowing is like putting on a specialized lens that lets you clearly see *only* the 'active' items. While wearing that lens, you can safely use your 'active'-item tool, knowing that everything you're looking at is indeed 'active'. When you switch to the 'inactive' lens, you can use the 'inactive'-item tool, and so on.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use \`if\` statements with equality checks (\`===\`) for narrowing string or number literal union types.
- ✅ Employ \`typeof\` checks (e.g., \`typeof value === 'string'\`) for unions of primitive types.
- ✅ Utilize \`instanceof\` checks (e.g., \`value instanceof MyClass\`) for unions involving class instances.
- ✅ Consider a \`switch\` statement for exhaustive checks on string or number literal unions.
- ❌ Do not rely on runtime behavior without explicit type guards; TypeScript won't infer types magically.
- ❌ Avoid using \`any\` to bypass type narrowing; it defeats the purpose of type safety.
- ❌ Do not forget to handle all possible cases in a union, especially when dealing with complex object unions.`,
      watchOut: `👀 **Watch out:** When using \`if/else if\` for exhaustive checks on a union type, it's good practice to include a final \`else\` block (or a \`default\` case in a \`switch\`) that handles any unhandled cases. For example, you can use a helper function like \`const assertNever = (x: never): never => { throw new Error("Unexpected object: " + x); };\` and call it in the \`else\` block. If you later add a new member to your union type and forget to update your \`if/else if\` chain, TypeScript will give an error in the \`assertNever\` call, reminding you to handle the new case.`,
      dryRun: `🔁 **Think:** Given \`type Fruit = 'apple' | 'banana'; function describeFruit(fruit: Fruit) { if (fruit === 'apple') { console.log('Red and round.'); } else { console.log('Yellow and curved.'); } }\`.
1.  \`describeFruit('apple');\` -> \`fruit\` is 'apple'. The \`if\` condition \`fruit === 'apple'\` is true. Logs "Red and round."
2.  \`describeFruit('banana');\` -> \`fruit\` is 'banana'. The \`if\` condition \`fruit === 'apple'\` is false. The \`else\` block executes. Logs "Yellow and curved."
(Hint: The conditional check narrows the type within its block.)`,
      build: "The learning focus for this step is to implement type narrowing using `if/else if` statements to execute specific logic based on the value of a union-typed property."
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: "Finally, let's create a few `Item` objects with different statuses and call our `processItem` function with them. This will demonstrate how the union type and type narrowing work together to ensure type-safe and correct behavior.",
    hint: "Declare three `const` variables, each an `Item` with a different `status` ('active', 'inactive', 'pending'). Then, call `processItem` for each of them.",
    example_code: `const activeItem: Item = { id: 'A1', name: 'Laptop', status: 'active' };
const inactiveItem: Item = { id: 'I2', name: 'Monitor', status: 'inactive' };
const pendingItem: Item = { id: 'P3', name: 'Keyboard', status: 'pending' };

processItem(activeItem);
processItem(inactiveItem);
processItem(pendingItem);`,
    think_prompt: "How would you create three `Item` objects with different statuses and then call `processItem` for each?",
    mc_options: [
      `const item1 = { id: '1', name: 'A', status: 'active' }; processItem(item1);`,
      `const activeItem: Item = { id: 'A1', name: 'Laptop', status: 'active' };
const inactiveItem: Item = { id: 'I2', name: 'Monitor', status: 'inactive' };
const pendingItem: Item = { id: 'P3', name: 'Keyboard', status: 'pending' };

processItem(activeItem);
processItem(inactiveItem);
processItem(pendingItem);`,
      `const items = [{ id: '1', name: 'A', status: 'active' }, { id: '2', name: 'B', status: 'inactive' }]; items.forEach(processItem);`
    ],
    mc_correct_option: `const activeItem: Item = { id: 'A1', name: 'Laptop', status: 'active' };
const inactiveItem: Item = { id: 'I2', name: 'Monitor', status: 'inactive' };
const pendingItem: Item = { id: 'P3', name: 'Keyboard', status: 'pending' };

processItem(activeItem);
processItem(inactiveItem);
processItem(pendingItem);`,
    mc_anchor: `const activeItem: Item = { id: 'A1', name: 'Laptop', status: 'active' };
const inactiveItem: Item = { id: 'I2', name: 'Monitor', status: 'inactive' };
const pendingItem: Item = { id: 'P3', name: 'Keyboard', status: 'pending' };

processItem(activeItem);
processItem(inactiveItem);
processItem(pendingItem);`,
    why_this_matters: "Demonstrating the usage of union types with concrete examples solidifies understanding. It shows how the type system guides you to create valid data and how functions can safely operate on that data based on its specific type.",
    answer_keywords: ["instantiation", "function call", "demonstration", "type-safe"],
    seed_code: `type ItemStatus = 'active' | 'inactive' | 'pending';

interface Item {
  id: string;
  name: string;
  status: ItemStatus;
}

function processItem(item: Item): void {
  if (item.status === 'active') {
    console.log(\`Item \${item.name} is active. Ready for use.\`);
  } else if (item.status === 'inactive') {
    console.log(\`Item \${item.name} is inactive. Requires activation.\`);
  } else if (item.status === 'pending') {
    console.log(\`Item \${item.name} is pending review. Awaiting approval.\`);
  } else {
    // This 'else' block is often used for exhaustive checking with union types
    // If ItemStatus ever gets a new type, TypeScript would warn if this isn't handled.
    console.log(\`Item \${item.name} has an unknown status: \${item.status}\`);
  }
}
`,
    starter_code: `type ItemStatus = 'active' | 'inactive' | 'pending';

interface Item {
  id: string;
  name: string;
  status: ItemStatus;
}

function processItem(item: Item): void {
  if (item.status === 'active') {
    console.log(\`Item \${item.name} is active. Ready for use.\`);
  } else if (item.status === 'inactive') {
    console.log(\`Item \${item.name} is inactive. Requires activation.\`);
  } else if (item.status === 'pending') {
    console.log(\`Item \${item.name} is pending review. Awaiting approval.\`);
  } else {
    // This 'else' block is often used for exhaustive checking with union types
    // If ItemStatus ever gets a new type, TypeScript would warn if this isn't handled.
    console.log(\`Item \${item.name} has an unknown status: \${item.status}\`);
  }
}

// Create item objects and call processItem here
`,
    feedback_correct: "Fantastic! You've successfully created items with various statuses and processed them. This demonstrates the full power of union types in defining strict states and safely handling them with type narrowing.",
    feedback_partial: "You've created one item and called the function, but the goal is to demonstrate how different statuses are handled. Create two more items, one for each remaining status, and call `processItem` for them too.",
    feedback_wrong: "While iterating through an array is a valid way to process multiple items, the prompt asked for individual `const` declarations and separate function calls to clearly show each status being passed. Also, ensure your items are explicitly typed as `Item`.",
    expected: `type ItemStatus = 'active' | 'inactive' | 'pending';

interface Item {
  id: string;
  name: string;
  status: ItemStatus;
}

function processItem(item: Item): void {
  if (item.status === 'active') {
    console.log(\`Item \${item.name} is active. Ready for use.\`);
  } else if (item.status === 'inactive') {
    console.log(\`Item \${item.name} is inactive. Requires activation.\`);
  } else if (item.status === 'pending') {
    console.log(\`Item \${item.name} is pending review. Awaiting approval.\`);
  } else {
    // This 'else' block is often used for exhaustive checking with union types
    // If ItemStatus ever gets a new type, TypeScript would warn if this isn't handled.
    console.log(\`Item \${item.name} has an unknown status: \${item.status}\`);
  }
}

const activeItem: Item = { id: 'A1', name: 'Laptop', status: 'active' };
const inactiveItem: Item = { id: 'I2', name: 'Monitor', status: 'inactive' };
const pendingItem: Item = { id: 'P3', name: 'Keyboard', status: 'pending' };

processItem(activeItem);
processItem(inactiveItem);
processItem(pendingItem);`,
    analog_example: `// Simulating different payment methods
type PaymentMethod = { type: 'creditCard'; cardNumber: string } | { type: 'paypal'; email: string };

function processPayment(amount: number, method: PaymentMethod): void {
  if (method.type === 'creditCard') {
    console.log(\`Processing \$\${amount} via Credit Card: **** \${method.cardNumber.slice(-4)}\`);
  } else if (method.type === 'paypal') {
    console.log(\`Processing \$\${amount} via PayPal to: \${method.email}\`);
  }
}

const cardPayment: PaymentMethod = { type: 'creditCard', cardNumber: '1234-5678-9012-3456' };
const paypalPayment: PaymentMethod = { type: 'paypal', email: 'user@example.com' };

processPayment(100.50, cardPayment);
processPayment(25.00, paypalPayment);
`,
    deepDiveLabel: "How do union types improve code maintainability?",
    deepDive: {
      hook: `Imagine your application grows, and you need to add a new item status, say 'archived'. Without union types, you might have scattered string literals like \`'active'\`, \`'inactive'\`, \`'pending'\` throughout your codebase. To add 'archived', you'd have to manually find every place where statuses are checked or assigned and update them. This is a tedious, error-prone process, and it's easy to miss a spot, leading to inconsistent behavior or runtime bugs that are hard to track down. The lack of a single, central definition makes refactoring a nightmare.`,
      pain: `⚠️ **Lesson:** Without a centralized definition, evolving discrete states in your application becomes error-prone and difficult to maintain. Symptom: Scattered string literals, missed updates when adding new states, and inconsistent behavior across the application.`,
      mentalModel: `**Mental model:** The "Centralized Dictionary." Think of a union type as a specialized dictionary that lists all the *only* valid words for a particular concept (like item status). When you need to add a new word, you only update this one dictionary. Every part of your application that uses this concept refers to the dictionary. If you try to use a word not in the dictionary, TypeScript immediately flags it. This ensures consistency and makes updates incredibly efficient and safe, as the compiler guides you to all necessary changes.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Define all discrete states for a concept using a single union type alias.
- ✅ Leverage TypeScript's compiler errors to guide you when adding new states to a union.
- ✅ Use union types to clearly document the expected values for properties and parameters.
- ✅ Prefer union types over loose \`string\` types for finite sets of values to enhance maintainability.
- ❌ Do not hardcode string literals for states in multiple places; use a union type.
- ❌ Avoid \`any\` as a workaround for unhandled union members; address the missing logic instead.
- ❌ Do not create separate, disconnected type definitions for the same set of states.`,
      watchOut: `👀 **Watch out:** While union types greatly improve maintainability, they don't automatically update your *runtime* logic. If you add a new status to \`ItemStatus\`, TypeScript will tell you where your \`processItem\` function needs updating. However, if you forget to actually *implement* the logic for the new status (e.g., adding the \`else if (item.status === 'archived')\` block), your code will still compile but might behave unexpectedly for the new status at runtime. Always ensure your runtime logic matches your type definitions.`,
      dryRun: `🔁 **Think:** If \`type Status = 'open' | 'closed';\` is updated to \`type Status = 'open' | 'closed' | 'pending';\`
1.  A function \`function displayStatus(s: Status) { if (s === 'open') { /* ... */ } else { /* ... */ } }\` will now show a TypeScript error in the \`else\` block if it was previously assumed to only be 'closed'.
2.  The error indicates that 'pending' is not handled.
3.  You would then add \`else if (s === 'closed') { /* ... */ } else if (s === 'pending') { /* ... */ }\` to resolve the error and correctly handle the new state.
(Hint: The compiler acts as a guide for necessary updates.)`,
      build: "The learning focus for this step is to understand how defining and using union types centrally improves code maintainability and guides future development."
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
  title: "Understanding TypeScript Union Types",
  shortName: "Union Types",
});
