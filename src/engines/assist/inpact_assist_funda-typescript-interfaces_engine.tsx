import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "funda-typescript-interfaces",
      title: "Define Data Shapes with TypeScript Interfaces",
      body: `When building software, you often deal with structured data: a user object with a name and email, a product with a price and description, or a configuration setting with a key and value. Without a clear definition of what these objects should look like, it's easy for properties to be misspelled, omitted, or given the wrong type, leading to bugs that are hard to catch until runtime. TypeScript interfaces provide a powerful way to formally declare the expected shape of these objects, allowing the TypeScript compiler to catch these errors *before* your code even runs, saving significant debugging time and improving code reliability.

This pattern is fundamental to nearly all TypeScript development. You'll encounter interfaces when defining the structure of data coming from an API, the properties (props) that a UI component expects, the shape of state managed within an application, or even the contract for objects passed between different parts of your codebase. Understanding how to define and use interfaces is a prerequisite for effectively working with typed data in any JavaScript or TypeScript project, from simple form inputs and settings panels to complex data models and API integrations.`,
      usecase: "Defining the expected structure for a list of application configuration settings.",
      designMock: {"kind":"list-and-form","screenTitle":"Config Items","caption":"Add and view generic configuration items.","listCaption":"Current Configurations","emptyCaption":"No Configurations","emptyMessage":"Add a new configuration item using the form below.","rows":[{"title":"API_KEY","subtitle":"Value: abc123xyz","meta":"Active"},{"title":"FEATURE_FLAG_A","subtitle":"Value: true","meta":"Inactive"}],"fields":[{"label":"Name","sample":"API_KEY"},{"label":"Value","sample":"abc123xyz"},{"label":"Is Active?","options":["Active","Inactive"]}],"submitLabel":"Add Item","metaFromField":{"index":2,"whenFilled":"Active","whenEmpty":"Inactive"}}
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Define a basic TypeScript interface for an object's shape.",
      "Add optional properties to an interface.",
      "Specify read-only properties within an interface.",
      "Use an interface to type a variable, an array, and a function parameter.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 6",
    paal: "To begin, define a TypeScript interface named `ConfigurationItem`. This interface should specify two properties: `name` (a `string`) and `value` (also a `string`).",
    hint: "Use the `interface` keyword followed by the interface name and then curly braces to define its properties and their types.",
    example_code: `interface ConfigurationItem {
  name: string;
  value: string;
}`,
    think_prompt: "What keyword is used to declare a new interface in TypeScript?",
    mc_options: [
      "type ConfigurationItem =",
      "class ConfigurationItem {",
      "interface ConfigurationItem {"
    ],
    mc_correct_option: "interface ConfigurationItem {",
    mc_anchor: "interface ConfigurationItem {",
    why_this_matters: "Defining a clear interface early on establishes a contract for your data, making it easier to understand, maintain, and debug your code as the project grows.",
    answer_keywords: ["interface", "string", "type"],
    seed_code: ``,
    starter_code: `// Define your ConfigurationItem interface here
`,
    feedback_correct: "Excellent! You've correctly defined your first interface with `name` and `value` properties.",
    feedback_partial: "You're close! Remember to specify the type for each property, like `propertyName: type;`.",
    feedback_wrong: "Not quite. The `interface` keyword is specifically designed for declaring object shapes in TypeScript. `type` aliases can also define shapes but `interface` has specific features for extension and merging.",
    expected: `interface ConfigurationItem {
  name: string;
  value: string;
}`,
    analog_example: `interface Product {
  name: string;
  price: number;
}

const myProduct: Product = {
  name: "Laptop",
  price: 1200.00,
};`,
    deepDiveLabel: "Why use interfaces instead of just 'type' aliases?",
    deepDive: {
      hook: `Imagine you're building a complex application, perhaps a system that manages different types of items like 'books', 'movies', and 'music albums'. Each of these items shares some common properties, like a 'title' and 'releaseYear', but also has unique ones, like 'author' for books or 'director' for movies. As your application grows, you might find yourself needing to extend these definitions, combine them, or even have different parts of your system contribute to the same definition. If you're just using inline type annotations or simple type aliases, you might run into limitations when trying to merge or extend these types in a clean, declarative way. This is where the specific capabilities of interfaces shine, offering a more robust and flexible approach to defining object shapes, especially in large, collaborative codebases where type definitions might need to evolve or be composed from multiple sources.`,
      pain: `⚠️ **Lesson:** Without a clear, extensible way to define object shapes, managing complex data structures can lead to redundant type definitions, difficult-to-merge types, and less flexible code. Symptom: You find yourself copying and pasting type definitions or struggling to combine types from different modules.`,
      mentalModel: `**Mental model:** Interface as a Blueprint. Think of an interface as a detailed architectural blueprint for a building. It specifies exactly what rooms (properties) the building must have, what materials they're made of (types), and how they're connected. Just like a blueprint, an interface doesn't *build* the object itself; it only describes its required structure. Multiple contractors (different parts of your code) can then use this single blueprint to construct many identical buildings (objects), ensuring they all conform to the same design. This blueprint can also be extended (e.g., adding a new wing) or combined with other blueprints (e.g., a residential blueprint combined with a commercial one), providing flexibility for future development.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
-   ✅ Use \`interface\` to define the shape of objects.
-   ✅ Name interfaces using PascalCase (e.g., \`UserConfig\`).
-   ✅ Specify a type for every property in the interface.
-   ✅ Interfaces are excellent for defining contracts for classes or function parameters.
-   ❌ Do not use \`interface\` to define primitive types (like \`string\` or \`number\`) directly.
-   ❌ Avoid making all properties optional unless explicitly intended, as it reduces type safety.
-   ❌ Do not include implementation logic (functions, constructors) directly within an interface; interfaces describe *shape*, not *behavior*.`,
      watchOut: `👀 **Watch out:** While \`type\` aliases can also define object shapes, interfaces are generally preferred for object types because they can be 'augmented' (merged) by subsequent declarations in the same scope, and they are more idiomatic for class implementations. If you need to define a union or intersection type, or a primitive alias, \`type\` is the way to go. For object shapes, lean towards \`interface\`.`,
      dryRun: `🔁 **Think:** If you define \`interface Point { x: number; y: number; }\` and then try to create an object \`const p: Point = { x: 10 };\`, what happens? The TypeScript compiler will report an error because the \`y\` property is missing, even though \`x\` is correctly typed. If you then try \`const p2: Point = { x: 10, y: "twenty" };\`, the compiler will flag that \`y\` is expected to be a \`number\`, not a \`string\`. (Hint: The interface acts as a strict blueprint.)`,
      build: "**Learning focus:** Define a basic interface to establish the fundamental structure of your data.",
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 6",
    paal: "Now, let's make the `ConfigurationItem` more flexible. Add an optional property `isActive` of type `boolean` to the interface. This property might not always be present when an item is created.",
    hint: "To make a property optional, place a question mark (`?`) after its name but before the colon and type.",
    example_code: `interface ConfigurationItem {
  name: string;
  value: string;
  isActive?: boolean;
}`,
    think_prompt: "How do you mark a property as optional in a TypeScript interface?",
    mc_options: [
      "isActive: boolean | undefined;",
      "isActive?: boolean;",
      "optional isActive: boolean;"
    ],
    mc_correct_option: "isActive?: boolean;",
    mc_anchor: "isActive?: boolean;",
    why_this_matters: "Optional properties allow you to define flexible data structures where certain fields might not always be present, preventing unnecessary errors when working with partial data.",
    answer_keywords: ["optional", "boolean", "question mark"],
    seed_code: `interface ConfigurationItem {
  name: string;
  value: string;
}`,
    starter_code: `interface ConfigurationItem {
  name: string;
  value: string;
  // Add the optional 'isActive' property here
}`,
    feedback_correct: "Perfect! The `isActive?: boolean;` syntax correctly marks `isActive` as an optional boolean property.",
    feedback_partial: "You're on the right track with `boolean`, but remember the specific syntax for making a property optional.",
    feedback_wrong: "Using `| undefined` works, but the `?` syntax is more concise and idiomatic for optional properties in interfaces, clearly indicating its optional nature.",
    expected: `interface ConfigurationItem {
  name: string;
  value: string;
  isActive?: boolean;
}`,
    analog_example: `interface UserProfile {
  username: string;
  email: string;
  avatarUrl?: string; // Optional profile picture URL
}

const user1: UserProfile = { username: "alice", email: "alice@example.com" };
const user2: UserProfile = { username: "bob", email: "bob@example.com", avatarUrl: "http://example.com/bob.png" };`,
    deepDiveLabel: "When should I use 'optional' vs. 'union with undefined'?",
    deepDive: {
      hook: `Imagine you're designing a user profile interface. Every user *must* have a username and an email, but a profile picture URL might be optional – some users upload one, others don't. If you define \`avatarUrl: string | undefined;\`, it technically works, but it implies that \`undefined\` is a *valid value* that you might explicitly assign. In contrast, \`avatarUrl?: string;\` clearly communicates that the property itself *might not exist* on the object at all. This distinction becomes critical when you're working with data from external sources (like APIs) where fields might simply be omitted rather than explicitly set to \`undefined\`, or when you're destructuring objects and want to know if a property will even be present.`,
      pain: `⚠️ **Lesson:** Confusing optional properties with properties that can explicitly be \`undefined\` can lead to less precise type definitions and potential runtime errors if code expects a property to always exist, even if its value is \`undefined\`. Symptom: You're constantly checking \`if (obj.prop !== undefined)\` even when the property might not be on the object at all.`,
      mentalModel: `**Mental model:** Optional as a Missing Piece. Think of an optional property as a piece of a puzzle that *might* be included, but isn't strictly necessary for the puzzle to be complete. If the piece isn't there, the puzzle is still valid. If it *is* there, it must fit perfectly (i.e., have the correct type). A property that is a union with \`undefined\` (e.g., \`string | undefined\`) is like a puzzle piece that *must* be present, but its content could be blank. The \`?\` syntax is a more direct and semantically clear way to express that a property might simply be absent from the object's structure.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", which means the property *must* exist, but its value can be \`undefined\`.`,
      quickRules: `**Quick rules:**
-   ✅ Use \`propertyName?: Type;\` when the property might not exist on the object at all.
-   ✅ Use \`propertyName: Type | undefined;\` when the property *must* exist, but its value can be explicitly \`undefined\`.
-   ✅ Optional properties simplify object creation, as you don't need to provide a value for them.
-   ✅ Optional properties are common for configuration objects or API responses where fields might be omitted.
-   ❌ Don't use \`?\` if the property is always expected to be present, even if its value could be null or undefined.
-   ❌ Avoid making too many properties optional without good reason, as it can reduce type safety.
-   ❌ Do not confuse optional properties with properties that can be \`null\`; \`null\` is a distinct value that must be explicitly allowed in the type (e.g., \`string | null\`).`,
      watchOut: `👀 **Watch out:** When accessing an optional property, TypeScript's strict null checks will require you to handle the \`undefined\` case. You'll often use optional chaining (\`obj.optionalProp?.method()\`) or a nullish coalescing operator (\`obj.optionalProp ?? defaultValue\`) to safely work with them.`,
      dryRun: `🔁 **Think:** Consider \`interface User { name: string; age?: number; }\`. If you create \`const u1: User = { name: "Alice" };\`, this is valid because \`age\` is optional. If you then try to access \`u1.age\`, its type will be \`number | undefined\`. If you create \`const u2: User = { name: "Bob", age: 30 };\`, this is also valid, and \`u2.age\` will be \`number\`. The presence or absence of \`age\` is handled by the \`?\` modifier. (Hint: The \`?\` allows the property to be entirely absent.)`,
      build: "**Learning focus:** Add an optional property to an interface to accommodate varying data completeness.",
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 6",
    paal: "Configuration items often have an identifier that should not change after creation. Add a `readonly` property `id` of type `string` to the `ConfigurationItem` interface. This `id` should be set once and never modified.",
    hint: "The `readonly` keyword is placed before the property name.",
    example_code: `interface ConfigurationItem {
  readonly id: string;
  name: string;
  value: string;
  isActive?: boolean;
}`,
    think_prompt: "What keyword ensures a property can only be assigned a value during object creation?",
    mc_options: [
      "const id: string;",
      "static id: string;",
      "readonly id: string;"
    ],
    mc_correct_option: "readonly id: string;",
    mc_anchor: "readonly id: string;",
    why_this_matters: "Read-only properties enforce immutability for specific fields, preventing accidental modifications and making your data flow more predictable and easier to reason about.",
    answer_keywords: ["readonly", "id", "string", "immutable"],
    seed_code: `interface ConfigurationItem {
  name: string;
  value: string;
  isActive?: boolean;
}`,
    starter_code: `interface ConfigurationItem {
  // Add the readonly 'id' property here
  name: string;
  value: string;
  isActive?: boolean;
}`,
    feedback_correct: "Excellent! The `readonly` keyword correctly marks the `id` property as immutable after initialization.",
    feedback_partial: "You've got the type right, but remember the specific keyword for making a property read-only.",
    feedback_wrong: "The `const` keyword is for variables, not interface properties. `static` is for class members. `readonly` is the correct keyword for interface properties that cannot be reassigned.",
    expected: `interface ConfigurationItem {
  readonly id: string;
  name: string;
  value: string;
  isActive?: boolean;
}`,
    analog_example: `interface Book {
  readonly isbn: string; // ISBN cannot change after book creation
  title: string;
  author: string;
}

const myBook: Book = {
  isbn: "978-0321765723",
  title: "The Lord of the Rings",
  author: "J.R.R. Tolkien",
};

// myBook.isbn = "new-isbn"; // This would cause a TypeScript error`,
    deepDiveLabel: "How does 'readonly' differ from 'const'?",
    deepDive: {
      hook: `Imagine you're building a system for managing unique inventory items. Each item has a serial number that's assigned at the factory and should *never* change. If you just define a property as \`serialNumber: string;\`, nothing prevents another part of your code from accidentally reassigning it later, potentially corrupting your inventory data. You need a way to declare that this specific property, *within an object*, is immutable once the object is created. While \`const\` prevents a *variable* from being reassigned, it doesn't prevent the *properties of an object* assigned to that \`const\` variable from being modified. This is where \`readonly\` steps in, providing a crucial layer of immutability at the property level.`,
      pain: `⚠️ **Lesson:** Without explicit immutability declarations for object properties, critical identifiers or values can be accidentally overwritten, leading to data corruption and hard-to-trace bugs. Symptom: Important object properties are unexpectedly changing values during runtime.`,
      mentalModel: `**Mental model:** Readonly as a Sealed Label. Think of a \`readonly\` property like a sealed label on a product's packaging. Once the product is packaged, that label (e.g., a batch number or expiration date) is fixed and cannot be changed without breaking the seal. The product itself (the object) can still be moved around or used, and other parts of its packaging (other properties) might be modifiable, but the information on that specific sealed label is permanent. This contrasts with \`const\` on a variable, which is like putting the entire packaged product into a locked display case – you can't swap out the product for a different one, but you could still potentially modify the product *inside* the case if it wasn't sealed itself.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
-   ✅ Use \`readonly\` for properties that should be immutable after object creation.
-   ✅ It's ideal for identifiers, timestamps, or initial configuration values.
-   ✅ \`readonly\` applies to properties within an object or class.
-   ✅ It's a compile-time guarantee, caught by the TypeScript compiler.
-   ❌ Do not confuse \`readonly\` with \`const\`; \`const\` applies to variable reassignments, \`readonly\` to property reassignments.
-   ❌ \`readonly\` does not make nested objects immutable; only the reference to the nested object is read-only.
-   ❌ Avoid using \`readonly\` on properties that are expected to change during the object's lifecycle.`,
      watchOut: `👀 **Watch out:** While \`readonly\` prevents reassignment of the property itself, if the property's type is an object or array, the *contents* of that object or array can still be mutated. For deep immutability, you would need to use utility types like \`Readonly<T>\` or libraries that enforce deep immutability.`,
      dryRun: `🔁 **Think:** If you have \`interface Item { readonly id: string; value: number; }\` and create \`const myItem: Item = { id: "A1", value: 10 };\`. If you then try \`myItem.value = 20;\`, this is allowed. But if you try \`myItem.id = "B2";\`, the TypeScript compiler will immediately report an error, preventing this reassignment. (Hint: Only the \`id\` property is protected from reassignment.)`,
      build: "**Learning focus:** Add a `readonly` property to ensure an identifier remains constant after initialization.",
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 6",
    paal: "Now that our `ConfigurationItem` interface is defined, let's use it. Declare a `const` variable named `myConfig` and explicitly type it as `ConfigurationItem`. Assign it an object literal that conforms to the interface, including `id`, `name`, and `value`. You can omit `isActive` since it's optional.",
    hint: "After the variable name, use a colon followed by the interface name (`: ConfigurationItem`) to specify its type.",
    example_code: `interface ConfigurationItem {
  readonly id: string;
  name: string;
  value: string;
  isActive?: boolean;
}

const myConfig: ConfigurationItem = {
  id: "cfg-001",
  name: "API_ENDPOINT",
  value: "https://api.example.com",
};`,
    think_prompt: "How do you apply an interface to a variable declaration?",
    mc_options: [
      "const myConfig = <ConfigurationItem>{ ... };",
      "const myConfig: ConfigurationItem = { ... };",
      "const myConfig implements ConfigurationItem = { ... };"
    ],
    mc_correct_option: "const myConfig: ConfigurationItem = { ... };",
    mc_anchor: "const myConfig: ConfigurationItem = {",
    why_this_matters: "Explicitly typing variables with interfaces ensures that any object assigned to them adheres to the defined structure, providing immediate feedback on type mismatches and improving code clarity.",
    answer_keywords: ["type", "variable", "assignment", "object literal"],
    seed_code: `interface ConfigurationItem {
  readonly id: string;
  name: string;
  value: string;
  isActive?: boolean;
}`,
    starter_code: `interface ConfigurationItem {
  readonly id: string;
  name: string;
  value: string;
  isActive?: boolean;
}

// Declare and type 'myConfig' here, assigning a conforming object
`,
    feedback_correct: "Excellent! You've successfully declared `myConfig` with the `ConfigurationItem` type and assigned a valid object.",
    feedback_partial: "You're close! Remember the syntax for type annotation on a variable: `variableName: Type = value;`.",
    feedback_wrong: "The `<Type>` syntax is a type assertion, which tells TypeScript to *trust* you about the type. While it can work, explicitly annotating the variable type (`: Type`) is generally preferred for clarity and better type inference, especially for new declarations. `implements` is for classes.",
    expected: `interface ConfigurationItem {
  readonly id: string;
  name: string;
  value: string;
  isActive?: boolean;
}

const myConfig: ConfigurationItem = {
  id: "cfg-001",
  name: "API_ENDPOINT",
  value: "https://api.example.com",
};`,
    analog_example: `interface Coordinates {
  x: number;
  y: number;
}

const origin: Coordinates = { x: 0, y: 0 };
const point1: Coordinates = { x: 10, y: 25 };

// const invalidPoint: Coordinates = { x: "five", y: 10 }; // TypeScript error`,
    deepDiveLabel: "What happens if the assigned object doesn't match the interface?",
    deepDive: {
      hook: `Imagine you've meticulously defined an interface for a 'User' with properties like 'id', 'name', and 'email'. Later, another developer (or even yourself, after a long night) tries to create a user object but accidentally types 'emial' instead of 'email', or forgets to include the 'id'. Without the interface actively checking, this typo or omission would go unnoticed until runtime, potentially causing your application to crash or behave unexpectedly. The beauty of TypeScript is that it catches these kinds of structural mismatches *at compile time*, giving you immediate feedback and preventing a whole class of bugs from ever reaching production.`,
      pain: `⚠️ **Lesson:** Assigning objects that don't conform to their declared interface can introduce subtle bugs that are only discovered at runtime, leading to unexpected behavior or crashes. Symptom: Your code fails when trying to access properties that you expected to be present, or properties have unexpected types.`,
      mentalModel: `**Mental model:** Interface as a Mold. Think of an interface as a precise mold for casting objects. When you declare a variable with an interface type and assign an object to it, TypeScript tries to fit that object into the mold. If the object has all the required pieces (properties) and they are of the correct shape (types), it fits perfectly. If a piece is missing, or a piece is the wrong shape, TypeScript immediately tells you it doesn't fit the mold. This ensures that every object you create using that mold will consistently have the expected structure, making your code much more reliable.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
-   ✅ Always explicitly type variables with interfaces when their structure is important.
-   ✅ Ensure all required properties are present in the assigned object.
-   ✅ Verify that all property types in the assigned object match the interface.
-   ✅ Use optional properties (\`?\`) in the interface if a property might genuinely be absent.
-   ❌ Do not omit required properties when assigning an object to an interface type.
-   ❌ Avoid assigning objects with properties that have incompatible types.
-   ❌ Do not include extra properties in the assigned object that are not defined in the interface (unless using a type assertion or index signature, which are advanced topics).`,
      watchOut: `👀 **Watch out:** TypeScript uses 'structural typing'. This means if an object *looks like* an interface (has all the required properties with the correct types), it's considered compatible, even if it wasn't explicitly declared with that interface. This is powerful but can sometimes lead to unexpected compatibility if you're not careful.`,
      dryRun: `🔁 **Think:** Given \`interface Box { width: number; height: number; }\`. If you declare \`let smallBox: Box = { width: 10, height: 5 };\`, this is valid. If you then try to reassign \`smallBox = { width: 12 };\`, the compiler will error because \`height\` is missing. If you try \`smallBox = { width: 15, height: "ten" };\`, it will error because \`height\` is a \`string\` instead of a \`number\`. (Hint: The variable's type annotation acts as a continuous check.)`,
      build: "**Learning focus:** Apply an interface to a variable to ensure data consistency.",
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 6",
    paal: "Applications often deal with collections of data. Declare a `const` variable named `configItems` and type it as an array of `ConfigurationItem` objects. Initialize it as an empty array.",
    hint: "To type an array of a specific interface, use `InterfaceName[]` or `Array<InterfaceName>`.",
    example_code: `interface ConfigurationItem {
  readonly id: string;
  name: string;
  value: string;
  isActive?: boolean;
}

const myConfig: ConfigurationItem = {
  id: "cfg-001",
  name: "API_ENDPOINT",
  value: "https://api.example.com",
};

const configItems: ConfigurationItem[] = [];`,
    think_prompt: "How do you declare an array where every element must conform to a specific interface?",
    mc_options: [
      "const configItems: Array<any> = [];",
      "const configItems: ConfigurationItem[] = [];",
      "const configItems = [] as ConfigurationItem[];"
    ],
    mc_correct_option: "const configItems: ConfigurationItem[] = [];",
    mc_anchor: "const configItems: ConfigurationItem[] = [];",
    why_this_matters: "Typing arrays with interfaces ensures that every element in the collection adheres to the expected structure, preventing inconsistent data within lists and enabling safer iteration and manipulation.",
    answer_keywords: ["array", "collection", "type", "square brackets"],
    seed_code: `interface ConfigurationItem {
  readonly id: string;
  name: string;
  value: string;
  isActive?: boolean;
}

const myConfig: ConfigurationItem = {
  id: "cfg-001",
  name: "API_ENDPOINT",
  value: "https://api.example.com",
};`,
    starter_code: `interface ConfigurationItem {
  readonly id: string;
  name: string;
  value: string;
  isActive?: boolean;
}

const myConfig: ConfigurationItem = {
  id: "cfg-001",
  name: "API_ENDPOINT",
  value: "https://api.example.com",
};

// Declare and type 'configItems' as an array of ConfigurationItem
`,
    feedback_correct: "Fantastic! `ConfigurationItem[]` is the most common and readable way to type an array of interface objects.",
    feedback_partial: "You're close! Remember that `Array<Type>` or `Type[]` are the standard ways to define typed arrays.",
    feedback_wrong: "Using `Array<any>` defeats the purpose of TypeScript's type safety. While `as ConfigurationItem[]` works as a type assertion, explicitly annotating the variable (`: ConfigurationItem[]`) is generally preferred for clarity.",
    expected: `interface ConfigurationItem {
  readonly id: string;
  name: string;
  value: string;
  isActive?: boolean;
}

const myConfig: ConfigurationItem = {
  id: "cfg-001",
  name: "API_ENDPOINT",
  value: "https://api.example.com",
};

const configItems: ConfigurationItem[] = [];`,
    analog_example: `interface Task {
  id: string;
  description: string;
  isComplete: boolean;
}

const todoList: Task[] = [
  { id: "t1", description: "Buy groceries", isComplete: false },
  { id: "t2", description: "Walk the dog", isComplete: true },
];

// todoList.push({ id: "t3", desc: "Clean room" }); // TypeScript error: 'desc' not assignable to 'description'`,
    deepDiveLabel: "What are the advantages of typing arrays with interfaces?",
    deepDive: {
      hook: `Imagine you're building a dashboard that displays a list of user notifications. Each notification has a 'message', a 'timestamp', and a 'readStatus'. If your array of notifications is untyped (e.g., just \`const notifications = [];\`), you could accidentally push an object with a misspelled property like 'massege' or a 'timestamp' that's a string instead of a Date object. When you later try to display these notifications, your UI component might crash because it expects specific properties and types. Typing the array with an interface ensures that every single notification object in that array conforms to the expected structure, making your list reliable and preventing runtime errors during iteration or display.`,
      pain: `⚠️ **Lesson:** Untyped arrays of objects can lead to inconsistent data structures within collections, causing runtime errors when iterating or accessing properties. Symptom: Your loops or map functions fail because some elements in an array are missing expected properties or have incorrect types.`,
      mentalModel: `**Mental model:** Typed Array as a Homogeneous Container. Think of a typed array as a container that is specifically designed to hold only items of a particular shape, as defined by your interface. Just like a box labeled "Fragile Glassware" will only contain items that fit that description, an array typed as \`ConfigurationItem[]\` will only accept objects that perfectly match the \`ConfigurationItem\` interface. This ensures that when you pull an item out of the box, you always know exactly what kind of item it is and what properties it will have, making it safe to work with without constant runtime checks.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
-   ✅ Use \`InterfaceName[]\` or \`Array<InterfaceName>\` for arrays of objects.
-   ✅ This ensures every element in the array conforms to the interface.
-   ✅ Improves type safety when iterating over or manipulating array elements.
-   ✅ Catches errors at compile-time if an incompatible object is added.
-   ❌ Do not use \`any[]\` or \`Array<any>\` as it negates type safety.
-   ❌ Avoid creating arrays where elements have wildly different, untyped structures.
-   ❌ Do not forget to initialize the array, even if empty, to avoid runtime errors.`,
      watchOut: `👀 **Watch out:** While typing an array ensures its elements conform to the interface, methods like \`map\`, \`filter\`, and \`reduce\` can sometimes infer more general types if not explicitly typed. Always double-check the return types of array methods if you're chaining them to ensure the final result is what you expect.`,
      dryRun: `🔁 **Think:** If you have \`interface Fruit { name: string; color: string; }\` and declare \`const fruitBasket: Fruit[] = [];\`. If you then \`fruitBasket.push({ name: "Apple", color: "Red" });\`, this is valid. If you try \`fruitBasket.push({ name: "Banana" });\`, the compiler will error because \`color\` is missing. If you try \`fruitBasket.push({ name: "Orange", color: 123 });\`, it will error because \`color\` is a \`number\` instead of a \`string\`. (Hint: Each item added must fit the \`Fruit\` interface.)`,
      build: "**Learning focus:** Type an array to ensure all its elements adhere to a consistent interface.",
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 6",
    paal: "Finally, let's see how interfaces improve function parameters. Create a function named `logConfigurationItem` that accepts a single parameter, `item`, typed as `ConfigurationItem`. Inside the function, use `console.log` to print the item's `name` and `value`.",
    hint: "Type the function parameter just like you would a variable: `(parameterName: InterfaceName)`.",
    example_code: `interface ConfigurationItem {
  readonly id: string;
  name: string;
  value: string;
  isActive?: boolean;
}

const myConfig: ConfigurationItem = {
  id: "cfg-001",
  name: "API_ENDPOINT",
  value: "https://api.example.com",
};

const configItems: ConfigurationItem[] = [];

function logConfigurationItem(item: ConfigurationItem) {
  console.log(\`Config Name: \${item.name}, Value: \${item.value}\`);
}`,
    think_prompt: "How do you specify the type of a function parameter using an interface?",
    mc_options: [
      "function logConfigurationItem(item: any) {",
      "function logConfigurationItem(item: ConfigurationItem) {",
      "function logConfigurationItem(item as ConfigurationItem) {"
    ],
    mc_correct_option: "function logConfigurationItem(item: ConfigurationItem) {",
    mc_anchor: "function logConfigurationItem(item: ConfigurationItem) {",
    why_this_matters: "Typing function parameters with interfaces clearly defines the expected input structure, enabling TypeScript to validate arguments at compile-time and providing excellent autocompletion and documentation for developers.",
    answer_keywords: ["function", "parameter", "type", "console.log"],
    seed_code: `interface ConfigurationItem {
  readonly id: string;
  name: string;
  value: string;
  isActive?: boolean;
}

const myConfig: ConfigurationItem = {
  id: "cfg-001",
  name: "API_ENDPOINT",
  value: "https://api.example.com",
};

const configItems: ConfigurationItem[] = [];`,
    starter_code: `interface ConfigurationItem {
  readonly id: string;
  name: string;
  value: string;
  isActive?: boolean;
}

const myConfig: ConfigurationItem = {
  id: "cfg-001",
  name: "API_ENDPOINT",
  value: "https://api.example.com",
};

const configItems: ConfigurationItem[] = [];

// Define the 'logConfigurationItem' function here
`,
    feedback_correct: "Excellent! Typing function parameters with interfaces is a cornerstone of robust TypeScript applications.",
    feedback_partial: "You're close! Remember the standard syntax for typing function parameters: `(paramName: Type)`.",
    feedback_wrong: "Using `any` for parameters bypasses TypeScript's type checking, defeating its purpose. `as ConfigurationItem` is a type assertion, not a parameter type annotation.",
    expected: `interface ConfigurationItem {
  readonly id: string;
  name: string;
  value: string;
  isActive?: boolean;
}

const myConfig: ConfigurationItem = {
  id: "cfg-001",
  name: "API_ENDPOINT",
  value: "https://api.example.com",
};

const configItems: ConfigurationItem[] = [];

function logConfigurationItem(item: ConfigurationItem) {
  console.log(\`Config Name: \${item.name}, Value: \${item.value}\`);
}`,
    analog_example: `interface Customer {
  id: string;
  firstName: string;
  lastName: string;
}

function greetCustomer(customer: Customer) {
  console.log(\`Hello, \${customer.firstName} \${customer.lastName}!\`);
}

const newCustomer: Customer = {
  id: "cust-456",
  firstName: "Jane",
  lastName: "Doe",
};

greetCustomer(newCustomer);
// greetCustomer({ id: "cust-789", first: "John" }); // TypeScript error: 'first' not assignable to 'firstName'`,
    deepDiveLabel: "How do interfaces improve function signatures and reusability?",
    deepDive: {
      hook: `Imagine you're writing a utility function that processes different kinds of data, perhaps a function that calculates the total price of items in a shopping cart, or one that formats a user's address for display. Without interfaces, you might just accept a generic 'data' parameter, leaving you to guess what properties it might have. This means you'd have to add runtime checks (e.g., \`if (data && data.price)\`) and constantly refer to documentation to understand the expected input. This approach is fragile and error-prone. Interfaces, however, provide a clear, compile-time contract for your function's inputs, making your code self-documenting, safer, and much easier to reuse across your application.`,
      pain: `⚠️ **Lesson:** Functions with untyped or loosely typed parameters are difficult to use correctly, leading to runtime errors, poor autocompletion, and increased cognitive load for developers. Symptom: You frequently encounter 'undefined is not a function' or 'cannot read property of undefined' errors when calling functions.`,
      mentalModel: `**Mental model:** Function Parameter as a Gatekeeper. Think of an interface on a function parameter as a gatekeeper at the entrance of a VIP event. The gatekeeper (TypeScript) checks every guest (argument) trying to enter the event (function call). If a guest doesn't have the required credentials (properties) or their credentials are invalid (wrong types), the gatekeeper immediately denies entry (compile-time error). This ensures that only properly structured and valid guests ever make it inside the event, making the event itself (the function's logic) much smoother and safer, as it can trust that all its inputs are correct.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
-   ✅ Always type function parameters with interfaces when expecting structured objects.
-   ✅ This improves type safety, catching errors at the call site.
-   ✅ Enhances code readability and acts as self-documentation.
-   ✅ Provides robust autocompletion and refactoring capabilities in IDEs.
-   ❌ Do not use \`any\` for function parameters if a specific structure is expected.
-   ❌ Avoid creating functions that accept objects with unknown or inconsistent shapes.
-   ❌ Do not rely solely on runtime checks for parameter validation if an interface can define the shape.`,
      watchOut: `👀 **Watch out:** While interfaces ensure the *shape* of the object, they don't enforce *runtime validation* of the *values* (e.g., ensuring an email string is a valid email format). For that, you'd combine interfaces with runtime validation libraries (like Zod or Yup).`,
      dryRun: `🔁 **Think:** Given \`interface Report { title: string; author: string; pages: number; }\` and a function \`function printReport(report: Report) { console.log(report.title); }\`. If you call \`printReport({ title: "My Report", author: "Me", pages: 10 });\`, this is valid. If you try \`printReport({ title: "Another Report", author: "Someone" });\`, the compiler will error because \`pages\` is missing. If you try \`printReport({ title: "Final Report", author: "You", pages: "twenty" });\`, it will error because \`pages\` is a \`string\` instead of a \`number\`. (Hint: The function expects a complete and correctly typed \`Report\` object.)`,
      build: "**Learning focus:** Type a function parameter with an interface to ensure consistent input data.",
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
  { label: "Step 6", id: "step6" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "TypeScript Interfaces: Defining Data Shapes",
  shortName: "TS Interfaces",
});
