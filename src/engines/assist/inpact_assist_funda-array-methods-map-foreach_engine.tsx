import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "funda-array-methods-map-foreach",
      title: "Array Methods: map() and forEach()",
      body: `Software applications frequently deal with collections of data, such as lists of users, products, or configuration settings. Efficiently processing, transforming, or displaying each item in these collections is a fundamental task. Without specialized tools, iterating over these arrays can become repetitive and prone to errors, especially when you need to create new data structures or render dynamic user interfaces based on the original data. Array methods like \`map()\` and \`forEach()\` provide concise, readable, and powerful ways to handle these common scenarios, abstracting away the boilerplate of traditional loop constructs.

This pattern is ubiquitous across almost all software engineering domains. You'll encounter it when populating a dropdown menu with options fetched from a server, rendering a list of tasks in a project management tool, generating a summary report from a dataset, or applying a consistent transformation to a batch of user inputs. Understanding these methods is a critical prerequisite for building dynamic and data-driven applications, as they form the backbone of how data is manipulated and presented in modern programming.`,
      usecase: "A settings panel displaying a list of configurable options.",
      designMock: {"kind":"list-and-form","screenTitle":"Item List","caption":"View and add items to the list.","listCaption":"Current Items","emptyCaption":"No Items","emptyMessage":"Add some items to get started.","rows":[{"title":"Widget A","subtitle":"Value: 10","meta":"Active"},{"title":"Gadget B","subtitle":"Value: 25","meta":"Inactive"}],"fields":[{"label":"Item Name","sample":"New Widget"},{"label":"Item Value","sample":"100"}],"submitLabel":"Add Item"}
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Define an array of structured data (objects).",
      "Use the `forEach()` method to perform an action for each item in an array.",
      "Use the `map()` method to transform an array into a new array of transformed items.",
      "Apply `map()` to generate a list of displayable elements from data.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: "To begin, define an array of objects. This array will represent a collection of data that needs to be processed or displayed. An `Item` interface will structure our data.",
    hint: "Define the `Item` interface first, then declare an array of `Item` objects.",
    example_code: `interface Item {
  id: string;
  name: string;
  value: number;
  isActive: boolean;
}

const items: Item[] = [
  { id: 'a1', name: 'Alpha', value: 10, isActive: true },
  { id: 'b2', name: 'Beta', value: 20, isActive: false },
  { id: 'c3', name: 'Gamma', value: 30, isActive: true },
];`,
    think_prompt: "Which code correctly defines an array of objects based on the `Item` interface?",
    mc_options: [
      `const items = [{ name: 'Alpha', value: 10 }]`,
      `interface Item { name: string; value: number; } const items: Item[] = [{ id: 'a1', name: 'Alpha', value: 10, isActive: true }]`,
      `interface Item { id: string; name: string; value: number; isActive: boolean; } const items: Item[] = [{ id: 'a1', name: 'Alpha', value: 10, isActive: true }, { id: 'b2', name: 'Beta', value: 20, isActive: false }]`,
    ],
    mc_correct_option: `interface Item { id: string; name: string; value: number; isActive: boolean; } const items: Item[] = [{ id: 'a1', name: 'Alpha', value: 10, isActive: true }, { id: 'b2', name: 'Beta', value: 20, isActive: false }]`,
    mc_anchor: `interface Item { id: string; name: string; value: number; isActive: boolean; }`,
    why_this_matters: "Defining clear data structures with types (like `interface`) makes code robust and easier to understand, especially when working with collections. Arrays are the primary way to manage lists of related data.",
    answer_keywords: ["interface", "array", "object literal"],
    seed_code: ``,
    starter_code: `// Define the Item interface and an array of items here
`,
    feedback_correct: "Excellent! You've correctly defined the `Item` interface and initialized an array of `Item` objects. This structured data is now ready for processing.",
    feedback_partial: "You're close! You've defined the interface, but the array initialization is either incomplete or doesn't fully match the interface's properties. Ensure all properties are present and correctly typed in each object.",
    feedback_wrong: "Not quite. The provided code either misses the `Item` interface definition, misdefines it, or the array initialization doesn't correctly create an array of objects matching the interface. Review how interfaces and arrays of objects are structured.",
    expected: `interface Item {
  id: string;
  name: string;
  value: number;
  isActive: boolean;
}

const items: Item[] = [
  { id: 'a1', name: 'Alpha', value: 10, isActive: true },
  { id: 'b2', name: 'Beta', value: 20, isActive: false },
  { id: 'c3', name: 'Gamma', value: 30, isActive: true },
];`,
    analog_example: `// Imagine a recipe with a list of ingredients
interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

const ingredients: Ingredient[] = [
  { name: 'Flour', quantity: '2', unit: 'cups' },
  { name: 'Sugar', quantity: '1', unit: 'cup' },
  { name: 'Eggs', quantity: '3', unit: 'large' },
];`,
    deepDiveLabel: "Why use interfaces and arrays for data?",
    deepDive: {
      hook: `Imagine you're building a simple application to manage a list of tasks. Each task has a title, a description, a due date, and a status (e.g., 'pending', 'completed'). If you had to manage each of these pieces of information as separate variables (e.g., \`task1Title\`, \`task1Description\`, \`task2Title\`, \`task2Description\`), your code would quickly become unmanageable and difficult to read. What if you had 100 tasks? Or if you needed to add a new property like 'priority'? This approach would lead to a maintenance nightmare, making it nearly impossible to keep track of related data or iterate over your collection of tasks efficiently. This is the problem that structured data in arrays solves.`,
      pain: `⚠️ **Lesson:** Without structured data and arrays, managing collections of related information becomes unwieldy, leading to verbose, error-prone, and unmaintainable code. Symptom: You find yourself creating many similarly named variables (e.g., \`item1Name\`, \`item2Name\`) instead of a single collection.`,
      mentalModel: `**Mental model:** The Data Container. Think of an array as a neatly organized box, and each object within it as a labeled folder. Each folder (object) contains all the related documents (properties) for a single item. This structure allows you to easily find, add, or remove folders, and to process all the documents within all folders in a systematic way. The interface acts as a blueprint, ensuring every folder has the same expected set of documents.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use an \`interface\` to define the consistent shape of objects within a collection.
- ✅ Use an array (\`[]\`) to group multiple related objects together.
- ✅ Ensure all objects in the array conform to the defined interface.
- ✅ Explicitly type your arrays (e.g., \`Item[]\`) for clarity and error prevention.
- ❌ Avoid creating individual variables for each item's property (e.g., \`item1Name\`, \`item1Value\`).
- ❌ Do not mix objects with entirely different structures within the same array without a common base interface.
- ❌ Forget to define the interface before trying to use it for type checking.`,
      watchOut: `👀 **Watch out:** While you *can* create arrays of mixed types in JavaScript, TypeScript encourages strong typing. If your array contains objects of different shapes, consider using a union type (e.g., \`(ItemA | ItemB)[]\`) or a more generic interface that covers common properties, rather than relying on \`any[]\`. This maintains type safety.`,
      dryRun: `🔁 **Think:** When the code runs, the TypeScript compiler will first check the \`Item\` interface, noting it requires \`id\` (string), \`name\` (string), \`value\` (number), and \`isActive\` (boolean). Then, it will examine each object in the \`items\` array. For the first object \`{ id: 'a1', name: 'Alpha', value: 10, isActive: true }\`, it confirms all properties are present and their types match the interface. It does the same for the second and third objects. If any property were missing or had a wrong type (e.g., \`value: 'ten'\`), TypeScript would flag an error. (Hint: The compiler ensures structural integrity.)`,
      build: "**Learning focus:** Define a clear data structure using an interface and populate an array with objects conforming to that structure.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: "The `forEach` method allows you to execute a function once for each element in an array. It's useful for performing side effects, like logging or updating an external variable, without creating a new array. Use `forEach` to log the name and value of each item.",
    hint: "The `forEach` method takes a callback function as an argument. This function will be executed for each item.",
    example_code: `items.forEach((item) => {
  console.log(\`Item: \${item.name}, Value: \${item.value}\`);
});`,
    think_prompt: "Which code snippet correctly uses `forEach` to log the name and value of each item?",
    mc_options: [
      `for (const item of items) { console.log(item.name); }`,
      `items.forEach(item => console.log(\`Item: \${item.name}, Value: \${item.value}\`));`,
      `items.map(item => console.log(item.name));`,
    ],
    mc_correct_option: `items.forEach(item => console.log(\`Item: \${item.name}, Value: \${item.value}\`));`,
    mc_anchor: `items.forEach(item => console.log(\`Item: \${item.name}, Value: \${item.value}\`));`,
    why_this_matters: "`forEach` is ideal for iterating over an array when you need to perform an action for each element but don't need to create a new array. This keeps your code clean and focused on side effects.",
    answer_keywords: ["forEach", "callback", "side effect", "log"],
    seed_code: `interface Item {
  id: string;
  name: string;
  value: number;
  isActive: boolean;
}

const items: Item[] = [
  { id: 'a1', name: 'Alpha', value: 10, isActive: true },
  { id: 'b2', name: 'Beta', value: 20, isActive: false },
  { id: 'c3', name: 'Gamma', value: 30, isActive: true },
];`,
    starter_code: `interface Item {
  id: string;
  name: string;
  value: number;
  isActive: boolean;
}

const items: Item[] = [
  { id: 'a1', name: 'Alpha', value: 10, isActive: true },
  { id: 'b2', name: 'Beta', value: 20, isActive: false },
  { id: 'c3', name: 'Gamma', value: 30, isActive: true },
];

// Use forEach to log each item's name and value here
`,
    feedback_correct: "Spot on! You've successfully used `forEach` to iterate through the `items` array and log the name and value of each one. Notice how `forEach` doesn't return a new array.",
    feedback_partial: "You're on the right track with `forEach`, but the logging statement isn't quite right or you might be missing a property. Double-check the string interpolation to include both `name` and `value`.",
    feedback_wrong: "That's not quite right. You either used a traditional `for...of` loop instead of `forEach`, or you attempted to use `map` for a side effect, which isn't its primary purpose. Remember, `forEach` is for performing actions on each item without creating a new array.",
    expected: `interface Item {
  id: string;
  name: string;
  value: number;
  isActive: boolean;
}

const items: Item[] = [
  { id: 'a1', name: 'Alpha', value: 10, isActive: true },
  { id: 'b2', name: 'Beta', value: 20, isActive: false },
  { id: 'c3', name: 'Gamma', value: 30, isActive: true },
];

items.forEach((item) => {
  console.log(\`Item: \${item.name}, Value: \${item.value}\`);
});`,
    analog_example: `// A chef checking each ingredient for freshness
interface Ingredient {
  name: string;
  freshness: 'fresh' | 'stale';
}

const ingredients: Ingredient[] = [
  { name: 'Milk', freshness: 'fresh' },
  { name: 'Bread', freshness: 'stale' },
];

ingredients.forEach((ingredient) => {
  if (ingredient.freshness === 'stale') {
    console.warn(\`Discarding \${ingredient.name} - it's stale!\`);
  } else {
    console.log(\`Using \${ingredient.name} - it's fresh.\`);
  }
});`,
    deepDiveLabel: "When should I use `forEach`?",
    deepDive: {
      hook: `Imagine you have a list of user accounts, and you need to send a welcome email to each new user. Or perhaps you need to update a counter for every completed task in a project. In these scenarios, your goal isn't to create a *new* list of emails or a *new* list of updated tasks; your goal is to *perform an action* for each existing user or task. Using a traditional \`for\` loop works, but \`forEach\` offers a more declarative and often cleaner way to express "do this for every item." It clearly communicates that you're iterating for side effects, not for transformation.`,
      pain: `⚠️ **Lesson:** Using a traditional \`for\` loop when a simple side effect is needed can lead to more verbose code than necessary. Attempting to use \`forEach\` when a new array is required (and then trying to capture its non-existent return value) indicates a misunderstanding of its purpose. Symptom: Your code is longer than it needs to be for simple iteration, or you're getting \`undefined\` when you expect a new array after using \`forEach\`.`,
      mentalModel: `**Mental model:** The Assembly Line Worker. Picture an assembly line where items (your array elements) pass by. A worker (your \`forEach\` callback function) stands at a station and performs a specific action on each item as it goes past – perhaps stamping it, inspecting it, or logging its details. The worker doesn't change the item's position on the line, nor do they create a new item to put on a *different* line. They simply act upon the item in place.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use \`forEach\` when you need to perform an action for each element in an array.
- ✅ Use \`forEach\` when the order of operations matters.
- ✅ Use \`forEach\` when you don't need to create a new array from the transformation.
- ✅ Use \`forEach\` for cleaner, more declarative iteration than a traditional \`for\` loop for simple side effects.
- ❌ Do not use \`forEach\` if you need to transform the array into a new array (use \`map\` instead).
- ❌ Do not expect \`forEach\` to return anything useful; it always returns \`undefined\`.
- ❌ Avoid using \`forEach\` if you need to break out of the loop early (use a traditional \`for\` loop or \`for...of\` instead).`,
      watchOut: `👀 **Watch out:** While you *can* modify the original array elements within a \`forEach\` callback (if they are objects), this can lead to unexpected side effects and make your code harder to reason about. It's generally better practice to treat \`forEach\` as a read-only iteration for side effects, and use \`map\` for transformations that produce new data.`,
      dryRun: `🔁 **Think:** When \`items.forEach()\` is called, the callback function \`(item) => { console.log(\`Item: \${item.name}, Value: \${item.value}\`); }\` is executed for each element.
1. For the first item \`{ id: 'a1', name: 'Alpha', value: 10, isActive: true }\`, \`item.name\` is 'Alpha' and \`item.value\` is 10. The console will output "Item: Alpha, Value: 10".
2. For the second item \`{ id: 'b2', name: 'Beta', value: 20, isActive: false }\`, \`item.name\` is 'Beta' and \`item.value\` is 20. The console will output "Item: Beta, Value: 20".
3. This continues until all items are processed. (Hint: The callback runs sequentially for each item.)`,
      build: "**Learning focus:** Implement `forEach` to iterate over an array and perform a side effect (logging) for each element.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: "When you need to transform each element in an array and create a *new* array with the results, the `map` method is the right tool. It always returns a new array of the same length as the original. Use `map` to create a new array containing only the names of the items.",
    hint: "The `map` method also takes a callback, but this callback must `return` the transformed value for each item.",
    example_code: `const itemNames: string[] = items.map((item) => {
  return item.name;
});
console.log('Item names:', itemNames);`,
    think_prompt: "Which code snippet correctly uses `map` to create a new array of item values, and then logs it?",
    mc_options: [
      `const itemValues = items.forEach(item => item.value); console.log(itemValues);`,
      `const itemValues: number[] = items.map((item) => item.value); console.log('Item values:', itemValues);`,
      `const itemValues = []; for (const item of items) { itemValues.push(item.value); } console.log(itemValues);`,
    ],
    mc_correct_option: `const itemValues: number[] = items.map((item) => item.value); console.log('Item values:', itemValues);`,
    mc_anchor: `const itemValues: number[] = items.map((item) => item.value);`,
    why_this_matters: "`map` is crucial for functional programming paradigms, enabling immutable transformations. It's the go-to method for preparing data for display or further processing without altering the original data source.",
    answer_keywords: ["map", "transform", "new array", "return"],
    seed_code: `interface Item {
  id: string;
  name: string;
  value: number;
  isActive: boolean;
}

const items: Item[] = [
  { id: 'a1', name: 'Alpha', value: 10, isActive: true },
  { id: 'b2', name: 'Beta', value: 20, isActive: false },
  { id: 'c3', name: 'Gamma', value: 30, isActive: true },
];

items.forEach((item) => {
  console.log(\`Item: \${item.name}, Value: \${item.value}\`);
});`,
    starter_code: `interface Item {
  id: string;
  name: string;
  value: number;
  isActive: boolean;
}

const items: Item[] = [
  { id: 'a1', name: 'Alpha', value: 10, isActive: true },
  { id: 'b2', name: 'Beta', value: 20, isActive: false },
  { id: 'c3', name: 'Gamma', value: 30, isActive: true },
];

items.forEach((item) => {
  console.log(\`Item: \${item.name}, Value: \${item.value}\`);
});

// Use map to create a new array of item names here
`,
    feedback_correct: "Fantastic! You've correctly used `map` to extract the item values into a new array. Notice how `map` always returns a new array, leaving the original `items` array unchanged.",
    feedback_partial: "You're close, but there's a small issue. You might have used `forEach` instead of `map`, or the `map` callback isn't correctly returning the `value`. Remember, `map` *must* return a value for each element.",
    feedback_wrong: "That's not the correct use of `map`. You either used `forEach` (which doesn't return a new array) or a traditional loop. The key distinction of `map` is that it creates a *new* array by transforming each element of the original.",
    expected: `interface Item {
  id: string;
  name: string;
  value: number;
  isActive: boolean;
}

const items: Item[] = [
  { id: 'a1', name: 'Alpha', value: 10, isActive: true },
  { id: 'b2', name: 'Beta', value: 20, isActive: false },
  { id: 'c3', name: 'Gamma', value: 30, isActive: true },
];

items.forEach((item) => {
  console.log(\`Item: \${item.name}, Value: \${item.value}\`);
});

const itemNames: string[] = items.map((item) => {
  return item.name;
});
console.log('Item names:', itemNames);`,
    analog_example: `// A chef listing just the names of ingredients needed for shopping
interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

const ingredients: Ingredient[] = [
  { name: 'Flour', quantity: '2', unit: 'cups' },
  { name: 'Sugar', quantity: '1', unit: 'cup' },
  { name: 'Eggs', quantity: '3', unit: 'large' },
];

const shoppingListNames: string[] = ingredients.map((ingredient) => {
  return ingredient.name;
});
console.log('Shopping list (names only):', shoppingListNames);
// Expected: ['Flour', 'Sugar', 'Eggs']`,
    deepDiveLabel: "How does `map` differ from `forEach`?",
    deepDive: {
      hook: `Imagine you have a list of raw sensor readings, each an object with a timestamp, a raw value, and a unit. For your display, you don't need the raw objects; you need a new list where each item is a formatted string like "Timestamp: [time], Value: [value] [unit]". If you tried to use \`forEach\` for this, you'd have to manually create an empty array and \`push\` each formatted string into it, which is cumbersome. This is where \`map\` shines, providing a direct, elegant way to transform an entire array into a new one, element by element.`,
      pain: `⚠️ **Lesson:** Misusing \`forEach\` when a new, transformed array is required leads to more verbose code and the need for manual array creation and population. Conversely, using \`map\` when only side effects are needed can be less efficient if the returned array is immediately discarded. Symptom: You're manually creating an empty array and pushing items into it inside a loop, or you're calling \`map\` and then ignoring its return value.`,
      mentalModel: `**Mental model:** The Data Transformer. Think of \`map\` as a specialized factory machine. It takes a conveyor belt of raw materials (your original array elements). For each raw material, it applies a specific transformation process (your callback function) and then places the *newly manufactured product* onto a *brand new conveyor belt*. The original raw materials remain untouched on their original belt. This new belt is the array that \`map\` returns.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use \`map\` when you need to transform each element of an array into a new value.
- ✅ Use \`map\` when you need a *new array* as the result of your iteration.
- ✅ Ensure your \`map\` callback function always returns a value.
- ✅ Use \`map\` for creating lists of UI components or formatted strings from data.
- ❌ Do not use \`map\` if you only need to perform side effects and don't care about the returned array (use \`forEach\` instead).
- ❌ Do not forget to assign the result of \`map\` to a new variable, as it returns a new array.
- ❌ Do not expect \`map\` to modify the original array in place.`,
      watchOut: `👀 **Watch out:** If your \`map\` callback doesn't explicitly return a value, it will implicitly return \`undefined\` for each element, resulting in an array of \`[undefined, undefined, ...]\`. Always ensure your \`map\` callback has a clear return statement or is an implicit return arrow function (e.g., \`item => item.name\`).`,
      dryRun: `🔁 **Think:** When \`items.map()\` is called, the callback function \`(item) => { return item.name; }\` is executed for each element, and its return value is collected into a new array.
1. For the first item \`{ id: 'a1', name: 'Alpha', value: 10, isActive: true }\`, \`item.name\` is 'Alpha'. The callback returns 'Alpha'.
2. For the second item \`{ id: 'b2', name: 'Beta', value: 20, isActive: false }\`, \`item.name\` is 'Beta'. The callback returns 'Beta'.
3. For the third item \`{ id: 'c3', name: 'Gamma', value: 30, isActive: true }\`, \`item.name\` is 'Gamma'. The callback returns 'Gamma'.
The \`itemNames\` array will then be \`['Alpha', 'Beta', 'Gamma']\`. (Hint: Each return value from the callback becomes an element in the new array.)`,
      build: "**Learning focus:** Apply `map` to transform an array of objects into a new array containing only specific properties (names).",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: "A common use case for `map` is to generate a list of displayable elements, such as strings or UI components, from an array of data. Each item in the original array becomes one element in the new display list. Use `map` to create an array of formatted strings for display, including the item's name and its active status.",
    hint: "Construct a template literal string inside the `map` callback to combine the `name` and `isActive` properties.",
    example_code: `const displayItems: string[] = items.map((item) => {
  const status = item.isActive ? 'Active' : 'Inactive';
  return \`Item: \${item.name} (Status: \${status})\`;
});
console.log('Display list:', displayItems);`,
    think_prompt: "Which code snippet correctly uses `map` to create an array of display strings, showing each item's name and value?",
    mc_options: [
      `const displayStrings = items.map(item => \`Name: \${item.name}, Value: \${item.value}\`); console.log(displayStrings);`,
      `const displayStrings = []; items.forEach(item => displayStrings.push(\`Name: \${item.name}\`)); console.log(displayStrings);`,
      `const displayStrings = items.map(item => item.name + item.value); console.log(displayStrings);`,
    ],
    mc_correct_option: `const displayStrings = items.map(item => \`Name: \${item.name}, Value: \${item.value}\`); console.log(displayStrings);`,
    mc_anchor: `const displayStrings = items.map(item => \`Name: \${item.name}, Value: \${item.value}\`);`,
    why_this_matters: "This pattern is fundamental for rendering dynamic lists in user interfaces. Whether it's a simple list of strings or complex UI components, `map` is the bridge between your raw data and what the user sees.",
    answer_keywords: ["map", "display", "render", "template literal", "UI"],
    seed_code: `interface Item {
  id: string;
  name: string;
  value: number;
  isActive: boolean;
}

const items: Item[] = [
  { id: 'a1', name: 'Alpha', value: 10, isActive: true },
  { id: 'b2', name: 'Beta', value: 20, isActive: false },
  { id: 'c3', name: 'Gamma', value: 30, isActive: true },
];

items.forEach((item) => {
  console.log(\`Item: \${item.name}, Value: \${item.value}\`);
});

const itemNames: string[] = items.map((item) => {
  return item.name;
});
console.log('Item names:', itemNames);`,
    starter_code: `interface Item {
  id: string;
  name: string;
  value: number;
  isActive: boolean;
}

const items: Item[] = [
  { id: 'a1', name: 'Alpha', value: 10, isActive: true },
  { id: 'b2', name: 'Beta', value: 20, isActive: false },
  { id: 'c3', name: 'Gamma', value: 30, isActive: true },
];

items.forEach((item) => {
  console.log(\`Item: \${item.name}, Value: \${item.value}\`);
});

const itemNames: string[] = items.map((item) => {
  return item.name;
});
console.log('Item names:', itemNames);

// Use map to create an array of formatted display strings here
`,
    feedback_correct: "Excellent work! You've successfully used `map` to transform your data into a list of formatted strings suitable for display. This is a core pattern for UI development.",
    feedback_partial: "You're close, but the display string isn't quite right. Ensure you're combining both the `name` and `value` properties into a single, readable string using a template literal.",
    feedback_wrong: "That's not the correct approach for generating display strings. You might have used `forEach` or concatenated strings without a template literal. Remember, `map` is for creating a *new* array of transformed elements, and template literals are best for readable string formatting.",
    expected: `interface Item {
  id: string;
  name: string;
  value: number;
  isActive: boolean;
}

const items: Item[] = [
  { id: 'a1', name: 'Alpha', value: 10, isActive: true },
  { id: 'b2', name: 'Beta', value: 20, isActive: false },
  { id: 'c3', name: 'Gamma', value: 30, isActive: true },
];

items.forEach((item) => {
  console.log(\`Item: \${item.name}, Value: \${item.value}\`);
});

const itemNames: string[] = items.map((item) => {
  return item.name;
});
console.log('Item names:', itemNames);

const displayItems: string[] = items.map((item) => {
  const status = item.isActive ? 'Active' : 'Inactive';
  return \`Item: \${item.name} (Status: \${status})\`;
});
console.log('Display list:', displayItems);`,
    analog_example: `// A chef writing out the full instructions for each step of a recipe
interface RecipeStep {
  description: string;
  durationMinutes: number;
  isOptional: boolean;
}

const recipeSteps: RecipeStep[] = [
  { description: 'Preheat oven', durationMinutes: 10, isOptional: false },
  { description: 'Mix dry ingredients', durationMinutes: 5, isOptional: false },
  { description: 'Add wet ingredients', durationMinutes: 3, isOptional: false },
  { description: 'Garnish (optional)', durationMinutes: 2, isOptional: true },
];

const formattedInstructions: string[] = recipeSteps.map((step) => {
  const optionalText = step.isOptional ? ' (Optional)' : '';
  return \`Step: \${step.description}. Duration: \${step.durationMinutes} min.\${optionalText}\`;
});
console.log('Full Recipe Instructions:', formattedInstructions);`,
    deepDiveLabel: "How is `map` used for UI rendering?",
    deepDive: {
      hook: `Imagine you're building a dashboard that displays a list of recent notifications. Each notification comes from your backend as an object with properties like \`id\`, \`message\`, \`timestamp\`, and \`type\`. You need to render these as a series of visual cards on the screen. Manually creating a card for each notification would be tedious and error-prone, especially if the list changes dynamically. How do you efficiently translate an array of data objects into an array of visual elements that your UI framework can render? This is a core challenge in front-end development.`,
      pain: `⚠️ **Lesson:** Manually creating and managing individual UI elements for each item in a data array is inefficient, unscalable, and leads to repetitive code. Symptom: You find yourself writing similar blocks of code for each item you want to display, or struggling to update the UI when the underlying data changes.`,
      mentalModel: `**Mental model:** The UI Renderer. Think of \`map\` as a specialized printing press for your user interface. You feed it a stack of data blueprints (your array of data objects). For each blueprint, the press applies a template (your callback function) to generate a finished, displayable page (a string or UI component). The output is a new stack of these finished pages, ready to be presented to the user. The original blueprints remain intact.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use \`map\` to generate a list of strings or UI elements from an array of data.
- ✅ Ensure each item in the original array results in one displayable element.
- ✅ Use template literals (\`\`\`) for clear and concise string formatting.
- ✅ Remember that \`map\` returns a new array, which is then used for rendering.
- ❌ Do not try to manually create individual display elements for each data item.
- ❌ Do not use \`forEach\` if you need to generate a new array of displayable elements.
- ❌ Do not forget to return a value (the display element) from the \`map\` callback.`,
      watchOut: `👀 **Watch out:** When using \`map\` to render lists in UI frameworks (like React), you often need to provide a unique \`key\` prop to each rendered item. While not directly part of the \`map\` method itself, it's a critical consideration for performance and correct rendering of dynamic lists. Forgetting keys can lead to unexpected behavior or performance issues in complex UIs.`,
      dryRun: `🔁 **Think:** When \`items.map()\` is called in this step, the callback function constructs a formatted string for each item.
1. For the first item \`{ id: 'a1', name: 'Alpha', value: 10, isActive: true }\`, \`item.name\` is 'Alpha' and \`item.isActive\` is \`true\`. The \`status\` variable becomes 'Active'. The callback returns "Item: Alpha (Status: Active)".
2. For the second item \`{ id: 'b2', name: 'Beta', value: 20, isActive: false }\`, \`item.name\` is 'Beta' and \`item.isActive\` is \`false\`. The \`status\` variable becomes 'Inactive'. The callback returns "Item: Beta (Status: Inactive)".
3. The \`displayItems\` array will then be \`["Item: Alpha (Status: Active)", "Item: Beta (Status: Inactive)", "Item: Gamma (Status: Active)"]\`. (Hint: The conditional logic within the callback determines part of the output string.)`,
      build: "**Learning focus:** Utilize `map` to transform an array of data into an array of formatted strings suitable for display, incorporating conditional logic.",
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1: Define Data", id: "step1" },
  { label: "Step 2: Use forEach()", id: "step2" },
  { label: "Step 3: Use map()", id: "step3" },
  { label: "Step 4: Display with map()", id: "step4" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Array Methods: map() and forEach()",
  shortName: "Array Methods",
});
