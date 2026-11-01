import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "funda-http-methods-status-codes",
      title: "HTTP Methods and Status Codes: The API Language",
      body: `HTTP methods and status codes form the foundational language for communication between different parts of a software system over a network. They provide a standardized way for clients (like a frontend application) to tell servers (like a backend API) what action they intend to perform (e.g., create, read, update, delete) on a resource, and for servers to predictably communicate the outcome of that action. Without this common, agreed-upon language, every interaction would be a custom, fragile negotiation, making it incredibly difficult for disparate systems to interoperate and scale. Understanding these concepts is paramount for anyone building or interacting with web services.

This pattern is fundamental to almost all modern web applications and APIs. You'll encounter HTTP methods and status codes whenever you interact with a RESTful API, whether it's fetching data for a dashboard, submitting a form, uploading a file, or managing user accounts. Even when you're not directly writing API code, a solid grasp of these concepts helps you debug network requests in your browser's developer tools, interpret error messages, and build more robust and predictable client-side applications that interact seamlessly with backend services. It's the bedrock upon which scalable and maintainable distributed systems are built.`,
      usecase: "Building a simple API endpoint for managing a list of generic 'widgets' where clients can fetch, add, update, or remove them.",
      designMock: {"kind":"api-request-response","caption":"Demonstrates standard HTTP methods for fetching and creating generic resources, along with typical success responses.","getLabel":"GET /items","getSample":"[\n  {\"id\":\"a1\",\"name\":\"Widget Alpha\",\"status\":\"active\"},\n  {\"id\":\"b2\",\"name\":\"Gadget Beta\",\"status\":\"inactive\"}\n]","postLabel":"POST /items","postSample":"{\n  \"name\":\"New Item Gamma\",\n  \"status\":\"active\"\n}"}
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Understand the purpose of common HTTP methods (GET, POST, PUT, DELETE).",
      "Identify appropriate HTTP status codes for different API response scenarios.",
      "Implement basic API route handlers using a server framework.",
      "Recognize how interfaces improve data consistency in API development.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 6",
    paal: `To begin understanding HTTP communication, we'll set up a conceptual server environment. This initial code snippet imports a common library used for building web servers, laying the groundwork for defining our API endpoints.`,
    hint: `Think about what a server needs to do to receive and respond to web requests.`,
    example_code: `import express from 'express';`,
    think_prompt: `What is the primary purpose of importing the \`express\` library in a server-side application?`,
    mc_options: [
      "To define the application's user interface components.",
      "To handle routing, middleware, and HTTP requests/responses.",
      "To manage database connections and queries.",
    ],
    mc_correct_option: "To handle routing, middleware, and HTTP requests/responses.",
    mc_anchor: "import express from 'express';",
    why_this_matters: `Understanding the role of server-side frameworks is crucial for building APIs that respond to HTTP requests. \`express\` (or similar frameworks) abstracts away the low-level network details, allowing you to focus on defining your application's logic.`,
    answer_keywords: ["express", "server", "routing", "http"],
    seed_code: ``,
    starter_code: `// Add the server framework import here
`,
    feedback_correct: `Correct! \`express\` is a popular framework for building web applications and APIs, primarily handling how your server receives and responds to HTTP requests.`,
    feedback_partial: `You're close, but \`express\` is more focused on the web server's core functions rather than just database interactions. Think about how a web server processes incoming requests.`,
    feedback_wrong: `That's not quite right. \`express\` is a backend framework, not for frontend UI. Its purpose is to manage the server-side logic for handling web requests.`,
    expected: `import express from 'express';`,
    analog_example: `// Analogous to importing a tool for a specific task
import { createReadStream } from 'fs';

// This import allows us to efficiently read data from a file in chunks,
// similar to how 'express' helps manage incoming data streams (requests)
// for a web server. Both are specialized tools for handling data flow.`,
    deepDiveLabel: `Why do we need a framework like Express for HTTP?`,
    deepDive: {
      hook: `Imagine you're trying to build a complex machine, say, a car. If you had to forge every single bolt, weld every joint, and design every circuit from scratch, it would take an impossibly long time and require expertise in dozens of unrelated fields. Every time you wanted to add a new feature, like power windows or air conditioning, you'd have to reinvent fundamental components. This is similar to trying to build a web server without a framework. You'd be dealing with raw TCP/IP sockets, parsing HTTP headers byte by byte, managing connection states, and manually routing every incoming URL to the correct piece of code. It's a monumental task, prone to errors, and incredibly inefficient for developing modern applications. The sheer volume of boilerplate and low-level networking concerns would completely overshadow your actual application logic, making development slow and painful.`,
      pain: `⚠️ **Lesson:** Building web servers from scratch without frameworks is incredibly complex and inefficient. **Symptom:** Developers spend more time on low-level networking and parsing than on application logic, leading to slow development, increased bugs, and difficulty scaling.`,
      mentalModel: `**Mental model:** The "API Traffic Controller." Think of a city's traffic controller. Without one, cars (requests) would just drive anywhere, causing chaos. The controller (Express) provides a structured system of roads (routes), traffic lights (middleware), and designated parking spots (handlers) to ensure every car gets to its destination efficiently and safely. It manages the flow, directs traffic, and ensures that the right services are invoked at the right time, preventing gridlock and ensuring smooth operation.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use frameworks like Express to abstract away low-level HTTP details.
- ✅ Leverage framework routing capabilities to map URLs to specific functions.
- ✅ Utilize middleware for common tasks like parsing request bodies or authentication.
- ✅ Focus on application logic, not raw network protocols.
- ❌ Attempt to manually parse HTTP headers and manage TCP connections.
- ❌ Write custom routing logic for every single endpoint without framework assistance.
- ❌ Reinvent common server-side functionalities like body parsing or error handling.`,
      watchOut: `👀 **Watch out:** While frameworks simplify development, it's still important to understand the underlying HTTP concepts. Over-reliance on framework magic without grasping the fundamentals can lead to difficulties when debugging or optimizing performance, or when needing to work with different frameworks or languages.`,
      dryRun: `🔁 **Think:** A client sends a \`GET\` request to \`http://localhost:3000/\`. The \`express\` application, listening on port \`3000\`, receives this request. It checks its defined routes and finds a match for \`GET /\`. The associated handler function \`(req, res) => { res.send('Hello World!'); }\` is executed. The \`res.send()\` method then constructs an HTTP response with a \`200 OK\` status code and "Hello World!" as the body, which is sent back to the client. (Hint: What does \`app.get\` do when a matching request arrives?)`,
      build: `**Learning focus:** Understand that server frameworks provide the essential tools for handling HTTP requests and responses.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 6",
    paal: `Before we define our API endpoints, let's establish a clear structure for the data we'll be working with. Defining a type or interface for our generic "item" helps ensure consistency across our API.`,
    hint: `Consider how TypeScript helps define the shape of data.`,
    example_code: `interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}`,
    think_prompt: `Why is it beneficial to define an \`interface\` like \`Item\` for our data structure in a TypeScript project?`,
    mc_options: [
      "It automatically generates database tables for the `Item` type.",
      "It provides type checking and code completion, improving code reliability and developer experience.",
      "It directly controls the styling and layout of frontend components.",
    ],
    mc_correct_option: "It provides type checking and code completion, improving code reliability and developer experience.",
    mc_anchor: "interface Item {",
    why_this_matters: `Strong typing, even in conceptual examples, helps prevent common errors and makes code easier to understand and maintain. It's a best practice for API design to have clear data contracts.`,
    answer_keywords: ["interface", "type", "data structure", "consistency", "type checking"],
    seed_code: `import express from 'express';`,
    starter_code: `import express from 'express';

// Define the Item interface here
`,
    feedback_correct: `Exactly! Interfaces are crucial for defining the shape of data, which TypeScript then uses to validate your code and offer helpful suggestions.`,
    feedback_partial: `While interfaces don't directly manage databases or UI, they play a vital role in defining the *structure* of data that might eventually be stored in a database or displayed in a UI. Think about how this helps developers.`,
    feedback_wrong: `That's incorrect. Interfaces in TypeScript are about defining data shapes for type checking, not about database generation or UI styling.`,
    expected: `import express from 'express';

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}`,
    analog_example: `// Analogous to defining a blueprint for a physical object
interface CarSpecification {
  make: string;
  model: string;
  year: number;
  color: string;
  isElectric: boolean;
}

// This interface ensures that any 'Car' object created in our system
// will consistently have these properties, just as our 'Item' interface
// ensures consistency for our API resources.`,
    deepDiveLabel: `How do interfaces improve API development?`,
    deepDive: {
      hook: `Imagine working on a team where everyone describes the same "user" data differently. One developer expects \`firstName\` and \`lastName\`, another uses \`fullName\`, and a third expects \`first_name\` and \`last_name\`. When you try to integrate different parts of the system, or when a frontend developer tries to consume an API built by a backend developer, this inconsistency leads to constant confusion, bugs, and wasted time debugging "undefined property" errors. Without a clear, shared definition of what a "user" or an "item" looks like, communication breaks down, and the system becomes fragile, requiring endless manual checks and conversions. This lack of a contract makes collaboration incredibly difficult and slows down the entire development process.`,
      pain: `⚠️ **Lesson:** Undefined or inconsistent data structures lead to integration bugs and communication breakdowns. **Symptom:** Frequent "undefined property" errors, difficulty integrating different parts of a system, and wasted time on data mapping issues.`,
      mentalModel: `**Mental model:** The "Data Contract." Think of an interface as a legally binding contract between different parts of your codebase, or even between different teams (frontend and backend). This contract specifies exactly what properties a piece of data *must* have and what types those properties *must* be. When you adhere to this contract, both sides know exactly what to expect, eliminating ambiguity and ensuring smooth, predictable interactions, just like a real-world contract prevents disputes.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Define interfaces for all data structures exchanged between client and server.
- ✅ Use specific types (\`string\`, \`number\`, \`boolean\`, literal types) for properties.
- ✅ Leverage interfaces for function parameters and return types to enforce contracts.
- ✅ Use optional properties (\`?\`) for fields that might not always be present.
- ❌ Rely on implicit \`any\` types for API data.
- ❌ Allow different parts of the codebase to use inconsistent naming conventions for the same data.
- ❌ Skip defining interfaces, assuming data shapes will always be obvious.`,
      watchOut: `👀 **Watch out:** Interfaces only provide compile-time type checking. They do not enforce data validation at runtime. You still need server-side validation to ensure incoming data from clients conforms to your expected structure and constraints, as malicious or malformed requests can bypass client-side type checks.`,
      dryRun: `🔁 **Think:** A new \`Item\` object is created: \`{ id: "c3", name: "Tool Gamma", status: "pending" }\`. The \`Item\` interface expects \`status\` to be either \`"active"\` or \`"inactive"\`. When this object is assigned to a variable typed as \`Item\`, TypeScript will flag an error because \`"pending"\` is not one of the allowed literal types for \`status\`. If the object was \`{ id: "c3", name: "Tool Gamma", status: "active" }\`, it would pass type checking. (Hint: What does the \`status\` property's type definition allow?)`,
      build: `**Learning focus:** Understand how interfaces define the expected structure of data, improving code clarity and reliability.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 6",
    paal: `Now that we have our data structure, let's set up the basic shell for our server application. This involves initializing the \`express\` app, adding middleware to parse JSON, and defining the port it will listen on, creating the foundation for our API.`,
    hint: `Consider how a web server makes itself available and processes incoming data.`,
    example_code: `const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    think_prompt: `What is the purpose of \`app.use(express.json())\` in this server setup?`,
    mc_options: [
      "To serve static files like HTML, CSS, and JavaScript.",
      "To enable cross-origin resource sharing (CORS) for API requests.",
      "To automatically parse incoming request bodies with JSON payloads into JavaScript objects.",
    ],
    mc_correct_option: "To automatically parse incoming request bodies with JSON payloads into JavaScript objects.",
    mc_anchor: "app.use(express.json());",
    why_this_matters: `Middleware like \`express.json()\` is essential for handling common tasks in an API, such as parsing request bodies. This allows your route handlers to easily access data sent by clients.`,
    answer_keywords: ["express", "app", "port", "middleware", "json"],
    seed_code: `import express from 'express';

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}`,
    starter_code: `import express from 'express';

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

// Add the server application shell here
`,
    feedback_correct: `You got it! \`express.json()\` is a built-in middleware that makes it easy to work with JSON data sent in the request body.`,
    feedback_partial: `While \`express\` can handle static files and CORS, \`express.json()\` specifically deals with the *content* of incoming requests. Think about what kind of data is commonly sent to APIs.`,
    feedback_wrong: `That's not correct. \`express.json()\` is not for serving static files or CORS. It's about processing the data that comes *with* a request.`,
    expected: `import express from 'express';

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    analog_example: `// Analogous to setting up a basic command-line tool
import { program } from 'commander';

program
  .version('1.0.0')
  .description('A simple command-line utility');

// This sets up the basic structure and capabilities of our CLI tool,
// similar to how 'express()' and 'app.listen()' set up the basic
// structure and listening capability of our web server.`,
    deepDiveLabel: `Why is \`express.json()\` considered "middleware"?`,
    deepDive: {
      hook: `Imagine you've ordered a package online, but it arrives in a sealed, unlabeled box. Before you can use what's inside, you first need to open the box, identify its contents, and perhaps assemble a few pieces. If every single delivery required you to manually perform these steps, it would be incredibly tedious and error-prone. In web development, when a client sends data to your server, especially in a \`POST\` or \`PUT\` request, that data often arrives as a raw stream of bytes. Without a mechanism to automatically "open the box" and "identify the contents" (i.e., parse the JSON into a usable JavaScript object), your route handlers would have to manually read and parse this raw data for every single request, leading to repetitive, error-prone code and a significant drain on developer productivity.`,
      pain: `⚠️ **Lesson:** Manually parsing request bodies is repetitive, error-prone, and inefficient. **Symptom:** Route handlers are cluttered with boilerplate code for data extraction, leading to bugs and slower development.`,
      mentalModel: `**Mental model:** The "Assembly Line Pre-Processor." Think of \`express.json()\` as a station on an assembly line *before* your main product (the request) reaches its final processing stage (your route handler). This station's job is to take raw materials (the incoming JSON string), process them (parse into a JavaScript object), and attach the processed component (\`req.body\`) to the product. By the time the product reaches your specific handler, this common, repetitive task has already been completed, allowing your handler to focus solely on its unique role.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use \`express.json()\` for APIs expecting JSON request bodies.
- ✅ Place \`app.use(express.json())\` early in your middleware stack.
- ✅ Understand that middleware functions execute in order.
- ✅ Use \`next()\` to pass control to subsequent middleware or route handlers.
- ❌ Manually parse \`req\` stream for JSON data in every handler.
- ❌ Forget to include \`express.json()\` when expecting JSON payloads.
- ❌ Place \`express.json()\` after specific route handlers that need its functionality.`,
      watchOut: `👀 **Watch out:** \`express.json()\` only parses JSON. If your API expects other content types (like \`application/x-www-form-urlencoded\` for traditional HTML forms, or \`multipart/form-data\` for file uploads), you'll need different middleware (e.g., \`express.urlencoded()\` or a library like \`multer\`). Using \`express.json()\` for non-JSON requests will result in an empty \`req.body\`.`,
      dryRun: `🔁 **Think:** A client sends a \`POST\` request to \`/items\` with a \`Content-Type: application/json\` header and a body \`{"name": "New Item"}\`. The \`express\` application receives this. Before any specific \`/items\` route handler is called, \`app.use(express.json())\` intercepts the request. It detects the \`Content-Type\` header, parses the JSON body \`{"name": "New Item"}\`, and attaches it as a JavaScript object to \`req.body\`. When the \`/items\` handler eventually runs, \`req.body\` will already be \`{ name: "New Item" }\`. (Hint: What does \`express.json()\` do with the raw request body?)`,
      build: `**Learning focus:** Understand the role of middleware like \`express.json()\` in preparing request data for route handlers.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 6",
    paal: `Now, let's create a simple in-memory data store to simulate a database. This \`items\` array will hold our generic resources, allowing us to perform CRUD operations without needing a real database for this conceptual module.`,
    hint: `Think about where data would be stored temporarily in a simple server application.`,
    example_code: `let items: Item[] = [];`,
    think_prompt: `Why is it acceptable to use a simple \`let items: Item[] = [];\` for data storage in this learning module, rather than a full database?`,
    mc_options: [
      "Because full databases are too complex for any beginner to understand.",
      "Because the focus of this module is on HTTP methods and status codes, not database management.",
      "Because in-memory arrays are always more performant than databases.",
    ],
    mc_correct_option: "Because the focus of this module is on HTTP methods and status codes, not database management.",
    mc_anchor: "let items: Item[] = [];",
    why_this_matters: `For learning specific concepts, simplifying tangential complexities (like database setup) allows learners to focus entirely on the core topic. This isolation helps reinforce the intended lesson.`,
    answer_keywords: ["in-memory", "data store", "focus", "simplification", "learning"],
    seed_code: `import express from 'express';

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    starter_code: `import express from 'express';

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// Add the in-memory data store here

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    feedback_correct: `Exactly! For focused learning, it's best to remove unnecessary complexity. Here, the array serves our purpose perfectly without distracting from HTTP concepts.`,
    feedback_partial: `While databases can be complex, the main reason for using an array here is pedagogical: to keep the focus on HTTP methods and status codes.`,
    feedback_wrong: `That's incorrect. Databases are essential for real-world applications. The choice here is purely for simplifying the learning environment.`,
    expected: `import express from 'express';

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// In-memory "database" for demonstration purposes
let items: Item[] = [];

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    analog_example: `// Analogous to using a whiteboard for quick calculations instead of a spreadsheet
function calculateTotal(prices: number[]): number {
  let total = 0;
  for (const price of prices) {
    total += price;
  }
  return total;
}

// Just as a whiteboard is sufficient for simple calculations without
// needing the full power of a spreadsheet, an in-memory array is
// sufficient for demonstrating API concepts without a full database.`,
    deepDiveLabel: `What are the trade-offs of in-memory data?`,
    deepDive: {
      hook: `Imagine you're writing down important notes on a piece of paper, but every time you close your notebook, all the notes magically disappear. You'd quickly realize this isn't a sustainable way to store information you need to keep! In software, if your application stores all its data only in memory (like our \`items\` array), that data is lost as soon as the application restarts or crashes. This means any changes made by users, any new items created, or any settings configured would vanish, leading to a frustrating and unusable experience. While convenient for quick tests or simple calculations, relying solely on in-memory storage for persistent data is a critical flaw for most real-world applications.`,
      pain: `⚠️ **Lesson:** In-memory data is volatile and lost upon application restart. **Symptom:** User data, configurations, and any state changes are not preserved, leading to a non-persistent and frustrating user experience.`,
      mentalModel: `**Mental model:** The "Short-Term Memory Scratchpad." Think of in-memory data as a temporary scratchpad or a short-term memory. It's fast and easy to write to, but it has no permanence. As soon as the "brain" (the server process) shuts down or restarts, everything on the scratchpad is erased. For anything that needs to be remembered long-term, you need to transfer it to a more permanent storage solution, like a notebook (a database) or a hard drive (a file system).`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use in-memory data for temporary states, caches, or during development/learning.
- ✅ Leverage in-memory data for performance-critical, short-lived data.
- ✅ Understand that in-memory data is ideal for isolated, self-contained examples.
- ✅ Recognize that in-memory data is simple to set up and manage.
- ❌ Use in-memory data for any information that needs to persist across server restarts.
- ❌ Rely on in-memory data for critical application state in production.
- ❌ Expect in-memory data to be shared easily across multiple server instances.`,
      watchOut: `👀 **Watch out:** While convenient for learning, never use simple in-memory arrays for production data that needs to be persistent. Real-world applications require databases (SQL, NoSQL) or persistent file storage to ensure data integrity and availability, especially when scaling across multiple server instances.`,
      dryRun: `🔁 **Think:** The server starts, and \`items\` is initialized as \`[]\`. A client sends a \`POST\` request, adding \`{ id: "1", name: "Test Item", status: "active" }\` to \`items\`. Now \`items\` is \`[{ id: "1", name: "Test Item", status: "active" }]\`. If the server process is then stopped and restarted, \`items\` will reset back to \`[]\`, and the "Test Item" will be gone. (Hint: What happens to the \`items\` array when the server process is terminated and relaunched?)`,
      build: `**Learning focus:** Understand the purpose and limitations of in-memory data storage for conceptual examples.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 6",
    paal: `With our server initialized and a place to store data, we can now define the basic structure of our API endpoints. This involves setting up routes for our generic "items" resource, using different HTTP methods to represent different actions.`,
    hint: `Recall the standard HTTP methods and how Express maps them to URL paths.`,
    example_code: `// GET all items
app.get('/items', (req, res) => {
  // Logic to retrieve all items
});

// POST a new item
app.post('/items', (req, res) => {
  // Logic to create a new item
});

// GET a single item by ID
app.get('/items/:id', (req, res) => {
  // Logic to retrieve a specific item
});

// PUT (update) an item by ID
app.put('/items/:id', (req, res) => {
  // Logic to update an item
});

// DELETE an item by ID
app.delete('/items/:id', (req, res) => {
  // Logic to delete an item
});`,
    think_prompt: `What is the significance of \`/:id\` in routes like \`/items/:id\`?`,
    mc_options: [
      "It indicates that the route is only accessible to administrators.",
      "It defines a placeholder for a dynamic value (a route parameter) that can be extracted from the URL.",
      "It specifies that the route expects a query parameter named \`id\`.",
    ],
    mc_correct_option: "It defines a placeholder for a dynamic value (a route parameter) that can be extracted from the URL.",
    mc_anchor: "app.get('/items/:id', (req, res) => {",
    why_this_matters: `Route parameters are fundamental for building RESTful APIs, allowing you to target specific resources (e.g., a particular item) using a clean URL structure.`,
    answer_keywords: ["route", "parameter", "dynamic", "id", "resource"],
    seed_code: `import express from 'express';

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// In-memory "database" for demonstration purposes
let items: Item[] = [];

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    starter_code: `import express from 'express';

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// In-memory "database" for demonstration purposes
let items: Item[] = [];

// Add the API route structure here

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    feedback_correct: `Spot on! \`/:id\` is a route parameter, making the \`id\` part of the URL dynamic and accessible via \`req.params.id\`.`,
    feedback_partial: `You're thinking about dynamic values, but \`/:id\` is specifically a *route* parameter, part of the path itself, not a query parameter. Query parameters appear after a \`?\` in the URL.`,
    feedback_wrong: `That's not quite right. Route parameters are about identifying specific resources, not access control or query parameters.`,
    expected: `import express from 'express';

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// In-memory "database" for demonstration purposes
let items: Item[] = [];

// GET all items
app.get('/items', (req, res) => {
  // Logic to retrieve all items
});

// POST a new item
app.post('/items', (req, res) => {
  // Logic to create a new item
});

// GET a single item by ID
app.get('/items/:id', (req, res) => {
  // Logic to retrieve a specific item
});

// PUT (update) an item by ID
app.put('/items/:id', (req, res) => {
  // Logic to update an item
});

// DELETE an item by ID
app.delete('/items/:id', (req, res) => {
  // Logic to delete an item
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    analog_example: `// Analogous to defining commands in a command-line interface
import { program } from 'commander';

program
  .command('add <item>')
  .description('Adds a new item to the list');

program
  .command('remove <item-id>')
  .description('Removes an item by its ID');

// Here, '<item>' and '<item-id>' are placeholders for dynamic values
// provided by the user, similar to how '/:id' in an API route
// captures a dynamic ID from the URL path.`,
    deepDiveLabel: `What are the standard HTTP methods and their purposes?`,
    deepDive: {
      hook: `Imagine a library where every request to get, add, or remove a book was handled by a single, generic "request" form. You'd have to write lengthy, detailed instructions on the form for *every single action*: "Please find the book titled 'The Great Novel' by Author X and bring it to me," or "Please add this new book, 'My New Story,' to the fiction section." This approach is incredibly inefficient, prone to misinterpretation, and makes it hard to quickly understand what action is intended. Without standardized verbs, every interaction becomes a custom negotiation, leading to confusion, errors, and a system that's difficult to maintain or extend.`,
      pain: `⚠️ **Lesson:** Lack of standardized action verbs (HTTP methods) leads to ambiguous API requests and complex server-side logic. **Symptom:** API endpoints become overloaded with conditional logic to determine the intended action, making them hard to read, debug, and maintain.`,
      mentalModel: `**Mental model:** The "Standardized Library Verbs." Think of HTTP methods as a set of universally understood verbs for interacting with resources in a library.
*   \`GET\` is like "Read" or "Look up" a book.
*   \`POST\` is like "Add" a new book to the collection.
*   \`PUT\` is like "Replace" an existing book with an updated version.
*   \`PATCH\` (less common but important) is like "Edit" a specific detail of a book (e.g., update its genre).
*   \`DELETE\` is like "Remove" a book from the collection.
These verbs immediately convey the intent of the request, making the API intuitive and predictable.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use \`GET\` for fetching data without side effects.
- ✅ Use \`POST\` for creating new resources.
- ✅ Use \`PUT\` for full updates or creating resources with known IDs.
- ✅ Use \`DELETE\` for removing resources.
- ❌ Use \`GET\` to change data on the server.
- ❌ Use \`POST\` when \`PUT\` or \`PATCH\` would be more semantically appropriate for updates.
- ❌ Mix up \`PUT\` (full replacement) and \`PATCH\` (partial update) without understanding their differences.`,
      watchOut: `👀 **Watch out:** While HTTP methods have semantic meanings, servers can technically implement any logic for any method. However, deviating from these standard conventions (e.g., using \`GET\` to delete data) leads to confusing, non-RESTful APIs that are difficult for other developers to understand and interact with, and can cause issues with caching and proxies. Always strive for semantic correctness.`,
      dryRun: `🔁 **Think:** A client sends a \`GET\` request to \`/items/abc\`. The server's routing logic matches this to \`app.get('/items/:id')\`. The \`id\` parameter is extracted as \`"abc"\`. If the client then sends a \`DELETE\` request to \`/items/abc\`, the server's routing logic matches \`app.delete('/items/:id')\`, and again, \`id\` is \`"abc"\`, but the *intended action* is now deletion, not retrieval. (Hint: How do the methods \`GET\` and \`DELETE\` change the server's expected action for the same URL path?)`,
      build: `**Learning focus:** Understand the standard HTTP methods and how they map to common CRUD (Create, Read, Update, Delete) operations.`,
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 6",
    paal: `Now we'll fill in the logic for each of our API routes. This is where we'll introduce the concept of HTTP status codes, which the server uses to communicate the outcome of a request back to the client.`,
    hint: `Match the HTTP method's purpose (e.g., creating, retrieving, updating, deleting) to the most appropriate success or error status code.`,
    example_code: `// GET all items
app.get('/items', (req, res) => {
  res.status(200).json(items); // 200 OK
});

// POST a new item
app.post('/items', (req, res) => {
  const { name, status } = req.body;
  if (!name || !status) {
    return res.status(400).send('Name and status are required.'); // 400 Bad Request
  }
  const newItem: Item = { id: String(items.length + 1), name, status };
  items.push(newItem);
  res.status(201).json(newItem); // 201 Created
});

// GET a single item by ID
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const item = items.find(i => i.id === id);
  if (item) {
    res.status(200).json(item); // 200 OK
  } else {
    res.status(404).send('Item not found.'); // 404 Not Found
  }
});

// PUT (update) an item by ID
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  const itemIndex = items.findIndex(i => i.id === id);

  if (itemIndex > -1) {
    if (!name || !status) {
      return res.status(400).send('Name and status are required for update.'); // 400 Bad Request
    }
    items[itemIndex] = { ...items[itemIndex], name, status };
    res.status(200).json(items[itemIndex]); // 200 OK
  } else {
    // Optionally, create if not found (PUT is idempotent)
    // For this example, we'll just return 404
    res.status(404).send('Item not found for update.'); // 404 Not Found
  }
});

// DELETE an item by ID
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = items.length;
  items = items.filter(i => i.id !== id);
  if (items.length < initialLength) {
    res.status(204).send(); // 204 No Content
  } else {
    res.status(404).send('Item not found for deletion.'); // 404 Not Found
  }
});`,
    think_prompt: `When should an API response use a \`201 Created\` status code instead of a \`200 OK\`?`,
    mc_options: [
      "When the request resulted in an error on the server.",
      "When a new resource has been successfully created on the server.",
      "When an existing resource has been successfully retrieved or updated.",
    ],
    mc_correct_option: "When a new resource has been successfully created on the server.",
    mc_anchor: "res.status(201).json(newItem); // 201 Created",
    why_this_matters: `Using appropriate HTTP status codes is crucial for clear communication between client and server. It allows clients to programmatically understand the outcome of their requests without parsing response bodies.`,
    answer_keywords: ["status code", "200 OK", "201 Created", "400 Bad Request", "404 Not Found", "204 No Content"],
    seed_code: `import express from 'express';

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// In-memory "database" for demonstration purposes
let items: Item[] = [];

// GET all items
app.get('/items', (req, res) => {
  // Logic to retrieve all items
});

// POST a new item
app.post('/items', (req, res) => {
  // Logic to create a new item
});

// GET a single item by ID
app.get('/items/:id', (req, res) => {
  // Logic to retrieve a specific item
});

// PUT (update) an item by ID
app.put('/items/:id', (req, res) => {
  // Logic to update an item
});

// DELETE an item by ID
app.delete('/items/:id', (req, res) => {
  // Logic to delete an item
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    starter_code: `import express from 'express';

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// In-memory "database" for demonstration purposes
let items: Item[] = [];

// GET all items
app.get('/items', (req, res) => {
  // Add logic and status code here
});

// POST a new item
app.post('/items', (req, res) => {
  // Add logic and status code here
});

// GET a single item by ID
app.get('/items/:id', (req, res) => {
  // Add logic and status code here
});

// PUT (update) an item by ID
app.put('/items/:id', (req, res) => {
  // Add logic and status code here
});

// DELETE an item by ID
app.delete('/items/:id', (req, res) => {
  // Add logic and status code here
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    feedback_correct: `You're absolutely right! \`201 Created\` is the specific status code for successful resource creation, providing more precise information than a general \`200 OK\`.`,
    feedback_partial: `\`200 OK\` is a general success code, but \`201 Created\` is more specific and semantically correct when a *new* resource has been added. Think about the exact outcome of a \`POST\` request that successfully adds an item.`,
    feedback_wrong: `That's incorrect. \`201 Created\` indicates success, not an error. Error codes typically start with \`4xx\` or \`5xx\`.`,
    expected: `import express from 'express';

interface Item {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// In-memory "database" for demonstration purposes
let items: Item[] = [];

// GET all items
app.get('/items', (req, res) => {
  res.status(200).json(items); // 200 OK
});

// POST a new item
app.post('/items', (req, res) => {
  const { name, status } = req.body;
  if (!name || !status) {
    return res.status(400).send('Name and status are required.'); // 400 Bad Request
  }
  const newItem: Item = { id: String(items.length + 1), name, status };
  items.push(newItem);
  res.status(201).json(newItem); // 201 Created
});

// GET a single item by ID
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const item = items.find(i => i.id === id);
  if (item) {
    res.status(200).json(item); // 200 OK
  } else {
    res.status(404).send('Item not found.'); // 404 Not Found
  }
});

// PUT (update) an item by ID
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  const itemIndex = items.findIndex(i => i.id === id);

  if (itemIndex > -1) {
    if (!name || !status) {
      return res.status(400).send('Name and status are required for update.'); // 400 Bad Request
    }
    items[itemIndex] = { ...items[itemIndex], name, status };
    res.status(200).json(items[itemIndex]); // 200 OK
  } else {
    // Optionally, create if not found (PUT is idempotent)
    // For this example, we'll just return 404
    res.status(404).send('Item not found for update.'); // 404 Not Found
  }
});

// DELETE an item by ID
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = items.length;
  items = items.filter(i => i.id !== id);
  if (items.length < initialLength) {
    res.status(204).send(); // 204 No Content
  } else {
    res.status(404).send('Item not found for deletion.'); // 404 Not Found
  }
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    analog_example: `// Analogous to a vending machine providing specific feedback
function processVendingMachineRequest(itemCode: string, payment: number) {
  const availableItems = {
    'A1': { name: 'Soda', price: 1.50, stock: 5 },
    'B2': { name: 'Chips', price: 1.00, stock: 0 }
  };

  const item = availableItems[itemCode];

  if (!item) {
    console.log('Error: 404 Item Not Found'); // Similar to HTTP 404
    return;
  }

  if (item.stock === 0) {
    console.log('Error: 409 Conflict (Out of Stock)'); // Similar to HTTP 409
    return;
  }

  if (payment < item.price) {
    console.log('Error: 402 Payment Required'); // Similar to HTTP 402
    return;
  }

  // Simulate successful purchase
  item.stock--;
  console.log('Success: 200 OK (Item dispensed)'); // Similar to HTTP 200
}

// This example shows how different outcomes (item not found, out of stock,
// insufficient payment, successful purchase) lead to distinct, standardized
// feedback codes, just as HTTP status codes communicate API request outcomes.`,
    deepDiveLabel: `What do the different categories of HTTP status codes mean?`,
    deepDive: {
      hook: `Imagine trying to communicate with someone who only ever says "Okay" or "Not Okay," regardless of the situation. Did they understand you? Did they do what you asked? Was there a problem, and if so, what kind? Was it your fault or theirs? This vague feedback would make effective communication impossible, leading to frustration and constant guesswork. In the world of APIs, if a server only ever responded with a generic "Success" or "Failure," clients would have no way to programmatically understand *why* something failed, or even *how* it succeeded (e.g., was a new resource created, or was an existing one updated?). This lack of precise feedback makes debugging a nightmare and building robust, intelligent client applications incredibly difficult.`,
      pain: `⚠️ **Lesson:** Generic success/failure messages hinder programmatic understanding and debugging of API interactions. **Symptom:** Clients cannot differentiate between various success states or pinpoint the exact cause of an error, leading to fragile error handling and complex debugging.`,
      mentalModel: `**Mental model:** The "API Traffic Light System with Detailed Explanations." Think of HTTP status codes as a sophisticated traffic light system, but instead of just red, yellow, green, they have specific numbers that provide much more detail.
*   \`1xx (Informational)\`: "Hold on, I'm still working on it." (Like a flashing yellow light, indicating the request was received and processing continues).
*   \`2xx (Success)\`: "Everything went perfectly!" (Green light, with specific numbers like \`200 OK\` for general success, \`201 Created\` for new resources, \`204 No Content\` for successful deletion with no body).
*   \`3xx (Redirection)\`: "Go this way instead." (Like an arrow, telling the client to go to a different URL).
*   \`4xx (Client Error)\`: "It's your fault, client!" (Red light, with specific numbers like \`400 Bad Request\` for invalid input, \`401 Unauthorized\`, \`403 Forbidden\`, \`404 Not Found\`).
*   \`5xx (Server Error)\`: "It's my fault, server!" (Red light, indicating an issue on the server side, like \`500 Internal Server Error\`).
This system allows both sides to quickly and precisely understand the state of the interaction.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use \`200 OK\` for successful \`GET\` and \`PUT\` operations.
- ✅ Use \`201 Created\` for successful \`POST\` operations that create a new resource.
- ✅ Use \`204 No Content\` for successful \`DELETE\` operations (no response body).
- ✅ Use \`400 Bad Request\` for invalid client input (e.g., missing fields).
- ✅ Use \`404 Not Found\` when a requested resource does not exist.
- ✅ Use \`500 Internal Server Error\` for unexpected server-side issues.
- ❌ Use \`200 OK\` for every successful response, even when \`201\` or \`204\` is more specific.
- ❌ Return a \`4xx\` error for a server-side crash.
- ❌ Send sensitive error details directly to the client in production \`5xx\` responses.`,
      watchOut: `👀 **Watch out:** While \`200 OK\` is a valid success code, using more specific \`2xx\` codes like \`201 Created\` or \`204 No Content\` provides richer semantic information to clients. This allows client-side code to react more intelligently to API responses without needing to parse the response body, leading to more robust and maintainable applications. Always choose the most specific and accurate status code.`,
      dryRun: `🔁 **Think:**
1.  A client sends a \`POST\` request to \`/items\` with body \`{"name": "New Item", "status": "active"}\`. The server receives it, validates \`name\` and \`status\`, creates a new item, adds it to \`items\`, and responds with \`res.status(201).json(newItem)\`. The client receives a \`201 Created\` status code and the newly created item.
2.  The client then sends a \`GET\` request to \`/items/999\` (an ID that doesn't exist). The server searches \`items\` for \`id "999"\`, doesn't find it, and responds with \`res.status(404).send('Item not found.')\`. The client receives a \`404 Not Found\` status code.
(Hint: How do the status codes change based on whether an item is successfully created versus not found?)`,
      build: `**Learning focus:** Implement API logic to handle different HTTP methods and return appropriate HTTP status codes based on the operation's outcome.`,
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Imports", id: "step1" },
  { label: "Types", id: "step2" },
  { label: "Server Shell", id: "step3" },
  { label: "Data Store", id: "step4" },
  { label: "Route Structure", id: "step5" },
  { label: "Handlers & Codes", id: "step6" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "HTTP Methods and Status Codes",
  shortName: "HTTP Basics",
});
