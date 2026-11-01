import createINPACTEngine from "../inpact_engine_shared";
import express from 'express';

// Module-scope types
interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory seed data for demonstration
let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
  {
    id: 'res-104',
    name: 'Bug Fix for Module X',
    status: 'active',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-12T09:00:00Z'),
    updatedAt: new Date('2023-01-12T09:00:00Z'),
  },
  {
    id: 'res-105',
    name: 'Feature Design Review',
    status: 'pending',
    assignedTo: null,
    createdAt: new Date('2023-01-15T16:00:00Z'),
    updatedAt: new Date('2023-01-15T16:00:00Z'),
  },
];


export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "resource-crud-api",
      title: "Designing a REST API for Resource Management",
      body: `
        • A REST API is the contract between your app's screens and its data — a fixed set of URLs the frontend calls to list, fetch, or update something.
        • You might have noticed that Gmail responds instantly when you read, archive, or label an email — an API exactly like this one is doing that work behind the scenes.
        • The core moves: list everything, get one by id, update a field on it — every screen you've built so far calls into one of these.
      `,
      usecase: "A settings panel where users can manage their notification preferences, including listing existing preferences, updating a specific preference's status, or assigning a preference to a particular device.",
      designMock: {"kind":"api-request-response","caption":"Demonstrates listing, retrieving, updating, and assigning a generic resource.","getLabel":"GET /resources","getSample":"[\n  {\"id\":\"res-1\",\"name\":\"Resource Alpha\",\"status\":\"active\",\"assignedTo\":null},\n  {\"id\":\"res-2\",\"name\":\"Resource Beta\",\"status\":\"pending\",\"assignedTo\":\"user-456\"}\n]","postLabel":"PATCH /resources/{id}/status","postSample":"{\"status\":\"inactive\"}"}
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Set up a basic Express server and understand JSON body parsing.",
      "Define a data model using TypeScript interfaces and create in-memory seed data.",
      "Implement a GET endpoint for listing resources with filtering and pagination.",
      "Create a GET endpoint to retrieve a single resource by ID.",
      "Develop a PATCH endpoint to update a specific field of a resource.",
      "Implement a PATCH endpoint to manage relationships (assign/unassign a user).",
      "Integrate input validation and consistent error handling.",
      "Understand the importance and conceptual approach to API integration testing.",
    ],
  },
  {
    id: "prereq-fundamentals",
    type: "funda-gate",
    phase: "Prerequisites",
    fundas: [
      {
        name: "HTTP methods & status codes",
        blurb: "Every endpoint in this lesson maps a method (GET, PATCH) and a status code (200, 404, 400) to what actually happened — used from Step 3 onward.",
        videoUrl: "https://www.youtube.com/watch?v=hHLmb3OD7Mo",
        quiz: {
          question: "Which status code means \"the request succeeded but the specific resource wasn't found\"?",
          options: ["200", "404", "500"],
          correctIndex: 1,
        },
      },
      {
        name: "TypeScript interfaces",
        blurb: "Step 2 defines the data model this whole API works with — before any endpoint is built.",
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
    phase: "Step 1 of 8",
    paal: "To begin building your REST API, you'll first set up a basic server using Express. This involves importing the Express library and initializing your application, along with essential middleware to handle incoming JSON data.",
    hint: "Start by importing `express` and creating an `app` instance. Don't forget to add `express.json()` middleware.",
    example_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    think_prompt: "What is the very first thing you need to do to start an Express application?",
    mc_options: [
      "Initialize a new Express app",
      "Define a port for the server",
      "Add middleware to parse JSON bodies",
    ],
    mc_correct_option: "Initialize a new Express app",
    mc_anchor: "const app = express();",
    why_this_matters: "Setting up the server is the foundational step for any backend application. Express provides a minimalist framework for building web applications and APIs, and `express.json()` is crucial for your API to understand data sent by clients.",
    answer_keywords: ["express", "server", "json", "middleware"],
    seed_code: ``,
    starter_code: `import express from 'express';

// Your code here
`,
    feedback_correct: "Excellent! Initializing the Express app is the first step. The `app` instance is where you'll define all your routes and middleware.",
    feedback_partial: "You're on the right track with Express, but ensure you've correctly initialized the `app` instance before defining routes or middleware.",
    feedback_wrong: "While defining the port and adding middleware are important, you must first import Express and create an `app` instance to use them.",
    expected: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    analog_example: `// Analogous to setting up a basic Python Flask server
import { Flask, jsonify } from 'flask';

const app = new Flask(__name__);

// Middleware-like functionality for JSON parsing (often handled automatically or by extensions)
// In Flask, request.json handles JSON parsing by default for application/json

@app.route('/')
function hello_world() {
    return 'API is running!';
}

if (__name__ === '__main__') {
    app.run(debug=true, port=5000);
}`,
    deepDiveLabel: "Why use Express.json()?",
    deepDive: {
      hook: `Imagine you're building a backend for a mobile app. The app sends data to your server, like a user's new profile picture or a list of items to add to a cart. This data often comes as JSON, a structured text format. If your server doesn't know how to read this JSON, it's like receiving a letter written in a secret code – you have the letter, but you can't understand its content. Your server would just see a stream of raw bytes, making it impossible to extract meaningful information like "username" or "item_id." This inability to parse incoming data is a common source of frustration and bugs in API development, leading to empty request bodies or malformed data errors.`,
      pain: `⚠️ **Lesson:** Without proper body parsing middleware, your server cannot easily access data sent in the request body, especially for \`POST\`, \`PUT\`, or \`PATCH\` requests. Symptom: \`req.body\` is \`undefined\` or an empty object, even when the client sends data.`,
      mentalModel: `**Mental model:** The "API Translator." Think of \`express.json()\` as a universal translator for your API. When a client sends data to your server, it often speaks in JSON. Without the translator, your server hears gibberish. The \`express.json()\` translator intercepts the incoming message, understands the JSON, and then converts it into a structured JavaScript object that your server can easily read and use. It ensures that when you look at \`req.body\`, you see a neatly organized object, not raw, unreadable data.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.", \`PUT\`, and \`PATCH\` requests where clients send JSON data.`,
      quickRules: `**Quick rules:**
- ✅ Always include \`app.use(express.json());\` when expecting JSON request bodies.
- ✅ Place \`app.use(express.json());\` early in your middleware chain.
- ✅ Use it for APIs that receive data from web forms, mobile apps, or other services.
- ✅ It simplifies accessing structured data from \`req.body\`.
- ❌ Don't use it if your API only handles URL-encoded data (use \`express.urlencoded()\`).
- ❌ Don't forget it, or \`req.body\` will be empty for JSON requests.
- ❌ Don't try to manually parse \`req.body\` if \`express.json()\` is already in use.`,
      watchOut: `👀 **Watch out:** While \`express.json()\` is great for JSON, it won't parse other content types like \`application/x-www-form-urlencoded\` (for traditional HTML forms) or \`multipart/form-data\` (for file uploads). For those, you'd need \`express.urlencoded()\` or a library like \`multer\`, respectively. Using the wrong parser will still result in an empty \`req.body\`.`,
      dryRun: `🔁 **Think:** A client sends a \`POST\` request to \`/data\` with \`Content-Type: application/json\` and body \`{"message": "hello"}\`.
1.  The request hits the Express server.
2.  \`app.use(express.json())\` middleware intercepts it.
3.  It sees \`Content-Type: application/json\` and parses the raw request body \`{"message": "hello"}\`.
4.  It attaches the parsed JavaScript object \`{ message: "hello" }\` to \`req.body\`.
5.  The request proceeds to the \`/data\` route handler.
6.  Inside the handler, \`console.log(req.body)\` outputs \`{ message: "hello" }\`.
(Hint: What happens if \`express.json()\` is removed?)`,
      build: `**Learning focus:** Set up the foundational Express server, including essential middleware for parsing JSON request bodies.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 8",
    paal: "Before we build our API endpoints, let's define the structure of the data we'll be managing. This involves creating a TypeScript interface for our generic resource and populating some initial in-memory data to work with.",
    hint: "Define an `interface Resource` with `id`, `name`, `status`, `assignedTo`, `createdAt`, `updatedAt`. Then create an array `resources` of this type.",
    example_code: `interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];`,
    think_prompt: "What is the primary purpose of a TypeScript interface in this context?",
    mc_options: [
      "Define the `Resource` interface",
      "Create an array of `Resource` objects",
      "Initialize a database connection",
    ],
    mc_correct_option: "Define the `Resource` interface",
    mc_anchor: "interface Resource {",
    why_this_matters: "A well-defined data model is crucial for clarity and type safety. Interfaces provide a contract for your data, helping prevent bugs and making your code easier to understand and maintain, especially in larger projects.",
    answer_keywords: ["interface", "typescript", "data model", "seed data"],
    seed_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    starter_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// Your code here: Define Resource interface and seed data

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    feedback_correct: "Exactly! Defining the `Resource` interface first establishes the blueprint for your data, which is essential for type safety and clarity.",
    feedback_partial: "You've created the seed data, but ensure you've also defined the `Resource` interface to give that data a clear, type-checked structure.",
    feedback_wrong: "While a database connection is part of a full application, for this in-memory example, defining the data structure and seed data is the next logical step after server setup.",
    expected: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    analog_example: `// Analogous to defining a data structure in a C# console application
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public bool IsAvailable { get; set; }
}

public static class ProductData
{
    public static List<Product> GetProducts()
    {
        return new List<Product>
        {
            new Product { Id = 1, Name = "Laptop", Price = 1200.00m, IsAvailable = true },
            new Product { Id = 2, Name = "Mouse", Price = 25.50m, IsAvailable = true },
            new Product { Id = 3, Name = "Keyboard", Price = 75.00m, IsAvailable = false }
        };
    }
}
`,
    deepDiveLabel: "Why use interfaces for API data?",
    deepDive: {
      hook: `Imagine you're collaborating on a large software project. One team is building the frontend, another the backend, and a third is working on a mobile app. All these teams need to understand the exact shape of the data being exchanged. If the backend sends a "user" object with \`firstName\` and \`lastName\`, but the frontend expects \`first_name\` and \`last_name\`, or if a field is sometimes a string and sometimes a number, chaos ensues. Developers spend hours debugging "undefined" errors, type mismatches, and unexpected data formats. This lack of a clear contract for data leads to brittle code, constant communication overhead, and a high risk of introducing bugs whenever the data structure changes.`,
      pain: `⚠️ **Lesson:** Without a clear data contract (like a TypeScript interface), it's easy for different parts of your application (or different teams) to misunderstand the expected shape, types, and presence of data fields. Symptom: Runtime type errors, unexpected \`undefined\` values, and difficulty in refactoring data structures.`,
      mentalModel: `**Mental model:** The "Data Blueprint." Think of a TypeScript interface as a detailed architectural blueprint for your data. Just as a blueprint specifies the exact dimensions, materials, and layout of a building, an interface specifies the exact names, types, and optionality of properties within a data object. This blueprint acts as a contract, ensuring that everyone working on the project (frontend, backend, database) has a shared, unambiguous understanding of what a "Resource" or "User" object looks like. It allows tools to check for consistency *before* the code even runs.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use interfaces to define the expected shape of all data objects in your API.
- ✅ Be explicit about property types (e.g., \`string\`, \`number\`, \`boolean\`, \`Date\`).
- ✅ Mark optional properties with \`?\` (e.g., \`category?: string\`).
- ✅ Use them for request bodies, response bodies, and internal data models.
- ❌ Don't omit interfaces, especially in larger projects, to avoid type ambiguity.
- ❌ Don't use \`any\` as a substitute for a well-defined interface.
- ❌ Don't include implementation details (like methods) in simple data interfaces.`,
      watchOut: `👀 **Watch out:** While interfaces provide excellent compile-time checks, they don't enforce runtime validation. A client could still send malformed data to your API. You'll need additional runtime validation (e.g., using libraries like Zod or Joi) to ensure incoming data conforms to your interface at the API boundary.`,
      dryRun: `🔁 **Think:** You have an interface \`interface Item { id: string; value: number; }\`.
1.  You declare \`const myItem: Item = { id: "123", value: 42 };\`. This is valid.
2.  You then try \`const anotherItem: Item = { id: "456", value: "hello" };\`.
3.  TypeScript compiler checks \`anotherItem\` against the \`Item\` interface.
4.  It sees \`value: "hello"\` where \`value: number\` is expected.
5.  The compiler reports a type error, preventing the code from compiling.
(Hint: What if \`value\` was \`value: any\`?)`,
      build: `**Learning focus:** Define a clear data model using a TypeScript interface and populate initial in-memory data for your API.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 8",
    paal: "Now that we have our data, let's create an endpoint to retrieve a list of resources. This endpoint will also demonstrate how to handle query parameters for filtering and pagination, making your API more flexible.",
    hint: "Implement an `app.get('/resources', ...)` route. Use `req.query` to get `status`, `search`, `page`, and `limit`. Filter and slice the `resources` array.",
    example_code: `app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});`,
    think_prompt: "When a client sends a request like `/resources?status=active`, how do you access the `status` value in your Express route?",
    mc_options: [
      "Access query parameters from `req.query`",
      "Filter resources based on `status` and `search`",
      "Implement pagination using `page` and `limit`",
    ],
    mc_correct_option: "Access query parameters from `req.query`",
    mc_anchor: "const { status, search, page = '1', limit = '10' } = req.query;",
    why_this_matters: "Listing resources with filtering and pagination is a common requirement for almost any API. It allows clients to efficiently retrieve only the data they need, reducing network load and improving application performance.",
    answer_keywords: ["get", "query parameters", "filtering", "pagination", "req.query"],
    seed_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    starter_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

// Your code here: Implement GET /resources endpoint

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    feedback_correct: "Spot on! Accessing query parameters via `req.query` is the correct way to implement filtering and pagination for your list endpoint.",
    feedback_partial: "You've started the GET endpoint, but remember to use `req.query` to access parameters like `status`, `search`, `page`, and `limit` for filtering and pagination.",
    feedback_wrong: "Filtering and pagination are typically handled using query parameters, not by creating separate routes for each combination. Review how `req.query` works.",
    expected: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    analog_example: `// Analogous to filtering and paginating a list of items in a Python function
function get_items(items, category=None, max_price=None, page=1, limit=10):
    filtered_items = list(items)

    if category:
        filtered_items = [item for item in filtered_items if item['category'] == category]

    if max_price is not None:
        filtered_items = [item for item in filtered_items if item['price'] <= max_price]

    # Pagination
    start_index = (page - 1) * limit
    end_index = page * limit
    paginated_items = filtered_items[start_index:end_index]

    return {
        'total': len(filtered_items),
        'page': page,
        'limit': limit,
        'data': paginated_items
    }

const sample_items = [
    { 'id': 1, 'name': 'Shirt', 'category': 'clothing', 'price': 25.00 },
    { 'id': 2, 'name': 'Pants', 'category': 'clothing', 'price': 40.00 },
    { 'id': 3, 'name': 'Laptop', 'category': 'electronics', 'price': 1200.00 },
    { 'id': 4, 'name': 'Keyboard', 'category': 'electronics', 'price': 75.00 },
];

// Example usage:
// const result = get_items(sample_items, category='clothing', page=1, limit=2);
// console.log(result);
`,
    deepDiveLabel: "How do query parameters work for APIs?",
    deepDive: {
      hook: `Imagine you're browsing a large online store. You don't want to see *every* product; you want to see "laptops under $1000, sorted by price, on page 2." If the website had to create a completely new URL for every possible combination of filters, sorting, and pagination, it would be impossible to manage. How does the server know what you're looking for without creating an infinite number of distinct endpoints? Without a standardized way to pass these dynamic criteria, every client-server interaction would require custom logic, leading to rigid APIs that are hard to extend and maintain, and frustrating user experiences.`,
      pain: `⚠️ **Lesson:** Without query parameters, APIs struggle to provide flexible data retrieval, forcing clients to fetch all data and filter locally, or requiring an explosion of specific endpoints for every filtering need. Symptom: Inefficient data transfer, slow client-side processing, or an overly complex API design.`,
      mentalModel: `**Mental model:** The "API Request Form." Think of a URL with query parameters as filling out a specific request form for your API. The base URL (\`/resources\`) is like saying "I want resources." The \`?\` signifies the start of the form, and each \`key=value\` pair (like \`status=active\` or \`page=2\`) is like filling in a field on that form. The \`&\` separates different fields. Your API server then reads this "form" (\`req.query\`) and uses the provided information to customize the data it sends back, ensuring you get exactly what you asked for without needing a new form for every request.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use query parameters for filtering, sorting, pagination, and optional data inclusion.
- ✅ Ensure query parameter values are properly parsed (e.g., \`parseInt\`, \`JSON.parse\`).
- ✅ Document available query parameters and their expected values.
- ✅ Provide default values for optional parameters like \`page\` and \`limit\`.
- ❌ Don't use query parameters for sensitive data (use request body or headers).
- ❌ Don't use them for identifying a specific resource (use path parameters).
- ❌ Don't rely on client-side parsing; always validate and sanitize on the server.`,
      watchOut: `👀 **Watch out:** Query parameters are always strings. If you expect a number (\`page\`, \`limit\`) or a boolean, you *must* explicitly convert it using \`parseInt()\`, \`parseFloat()\`, or a custom boolean parser. Failing to do so will lead to unexpected behavior or errors when performing arithmetic or logical operations. Also, be mindful of potential SQL injection or XSS if you directly use query values without sanitization in database queries or responses.`,
      dryRun: `🔁 **Think:** A client requests \`/resources?status=pending&page=2&limit=5\`.
1.  \`req.query\` becomes \`{ status: "pending", page: "2", limit: "5" }\`.
2.  \`status\` filter is applied: \`filteredResources\` now contains only 'pending' resources.
3.  \`pageNum\` becomes \`parseInt("2", 10)\` which is \`2\`.
4.  \`limitNum\` becomes \`parseInt("5", 10)\` which is \`5\`.
5.  \`startIndex\` is \`(2 - 1) * 5 = 5\`.
6.  \`endIndex\` is \`2 * 5 = 10\`.
7.  \`paginatedResources\` will contain elements from index 5 up to (but not including) 10 of the \`filteredResources\` array.
(Hint: What would \`startIndex\` and \`endIndex\` be for \`page=1\`?)`,
      build: `**Learning focus:** Implement a GET endpoint to list resources, incorporating filtering and pagination using query parameters.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 8",
    paal: "Often, you'll need to fetch a specific resource rather than a list. This step focuses on creating an endpoint that uses a path parameter to identify and retrieve a single resource, returning a 404 if not found.",
    hint: "Create an `app.get('/resources/:id', ...)` route. Use `req.params.id` to get the ID. Find the resource and return it, or send a 404 if not found.",
    example_code: `app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.json(resource);
});`,
    think_prompt: "How do you extract the `id` from a URL like `/resources/res-101` in an Express route?",
    mc_options: [
      "Access path parameters from `req.params`",
      "Find the resource by ID",
      "Return a 404 status if the resource is not found",
    ],
    mc_correct_option: "Access path parameters from `req.params`",
    mc_anchor: "const { id } = req.params;",
    why_this_matters: "Retrieving a single resource by its unique identifier is a fundamental operation in any REST API. Using path parameters clearly indicates that you are requesting a specific instance of a resource, adhering to RESTful principles.",
    answer_keywords: ["get", "path parameters", "req.params", "404", "find"],
    seed_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    starter_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

// Your code here: Implement GET /resources/:id endpoint

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    feedback_correct: "Correct! `req.params` is exactly where Express stores path parameters, allowing you to identify the specific resource.",
    feedback_partial: "You're on the right track for fetching a single resource. Remember to use `req.params` to get the ID from the URL path.",
    feedback_wrong: "Path parameters are distinct from query parameters. `req.params` is used for segments of the URL path that identify a resource, like `:id`.",
    expected: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.json(resource);
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    analog_example: `// Analogous to fetching a single item by ID in a Ruby on Rails controller
// In Rails, params[:id] is used to access path parameters

/*
class ItemsController < ApplicationController
  def show
    item = Item.find_by(id: params[:id])
    if item
      render json: item, status: :ok
    else
      render json: { error: "Item not found" }, status: :not_found
    end
  end
end
*/

// Example of how it would be called:
// GET /items/123
// params[:id] would be "123"
`,
    deepDiveLabel: "Path vs. Query Parameters",
    deepDive: {
      hook: `Imagine you're trying to locate a specific book in a library. You wouldn't ask "give me a book where the title is 'Moby Dick' and the author is 'Herman Melville' and the genre is 'classic'." Instead, you'd go directly to its unique call number or ISBN. Similarly, in an API, when you want *one specific item* identified by its unique identifier, how do you tell the server which one? If you tried to use query parameters for this, your URLs would become clunky and less intuitive, like \`/resources?id=res-101\`. This isn't wrong, but it's less RESTful and less clear about the *identity* of the resource being requested, making your API harder to understand and use.`,
      pain: `⚠️ **Lesson:** Misusing query parameters for resource identification or path parameters for filtering leads to less intuitive, less RESTful, and harder-to-maintain API designs. Symptom: URLs that don't clearly represent the resource hierarchy or actions, or inconsistent API patterns.`,
      mentalModel: `**Mental model:** "Identity vs. Attributes." Think of path parameters as defining the *identity* of the resource you're interacting with, like a unique serial number for a product. The path \` /resources/res-101 \` says "I am talking about *this specific resource*, \`res-101\`." Query parameters, on the other hand, are like *attributes* or *filters* you apply to a collection, like asking "show me all resources that have the attribute \`status=active\`." Path parameters narrow down to a single entity or a specific sub-resource, while query parameters refine a collection.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use path parameters when the segment identifies a unique resource (e.g., \`/users/123\`).
- ✅ Use path parameters for hierarchical relationships (e.g., \`/users/123/posts/456\`).
- ✅ Use query parameters for optional filtering, sorting, or pagination of collections.
- ✅ Use query parameters for non-identifying attributes or flags.
- ❌ Don't use query parameters to identify a single, unique resource.
- ❌ Don't use path parameters for filtering a collection.
- ❌ Don't make path parameters optional; they define the resource.`,
      watchOut: `👀 **Watch out:** Path parameters are always strings, just like query parameters. If your resource IDs are numbers (e.g., \`123\`), you'll need to parse \`req.params.id\` using \`parseInt()\` before using it for comparison or database lookups. Also, ensure your route definitions are specific enough; \`/resources/:id\` should come before \`/resources/status\` if you have both, or Express might incorrectly interpret "status" as an ID.`,
      dryRun: `🔁 **Think:** A client requests \`/resources/res-102\`.
1.  The request matches \`app.get('/resources/:id')\`.
2.  \`req.params\` becomes \`{ id: "res-102" }\`.
3.  \`const id = req.params.id;\` sets \`id\` to \`"res-102"\`.
4.  \`resources.find(r => r.id === id)\` searches for a resource with \`id === "res-102"\`.
5.  It finds the resource \`{ id: 'res-102', name: 'Testing Scenario B', ... }\`.
6.  \`!resource\` is \`false\`, so the 404 block is skipped.
7.  \`res.json(resource)\` sends the found resource.
(Hint: What if the client requested \`/resources/non-existent-id\`?)`,
      build: `**Learning focus:** Create a GET endpoint to retrieve a single resource using a path parameter and handle the "not found" case.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 8",
    paal: "Updating resources is a core API operation. This step will guide you through creating a `PATCH` endpoint to modify a specific field (the `status`) of a resource, identified by its ID. We'll also ensure the new status is valid.",
    hint: "Implement an `app.patch('/resources/:id/status', ...)` route. Get `id` from `req.params` and `status` from `req.body`. Validate the `status` and update the resource, returning a 400 for invalid status or 404 if not found.",
    example_code: `app.patch('/resources/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['active', 'pending', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided. Must be active, pending, or inactive.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].status = status;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});`,
    think_prompt: "When updating a resource's status, where do you expect to find the new `status` value sent by the client?",
    mc_options: [
      "Access the resource ID from `req.params`",
      "Access the new status from `req.body`",
      "Validate the incoming status value",
    ],
    mc_correct_option: "Access the new status from `req.body`",
    mc_anchor: "const { status } = req.body;",
    why_this_matters: "The `PATCH` method is ideal for partial updates, allowing clients to modify specific fields without sending the entire resource. This is more efficient and less error-prone than a full `PUT` replacement when only a small change is needed.",
    answer_keywords: ["patch", "update", "status", "req.body", "validation", "400", "404"],
    seed_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.json(resource);
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    starter_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.json(resource);
});

// Your code here: Implement PATCH /resources/:id/status endpoint

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    feedback_correct: "Absolutely! For `PATCH` requests, the data to be updated is typically sent in the `req.body`, and `express.json()` ensures it's parsed correctly.",
    feedback_partial: "You've correctly identified the resource by ID. Now, focus on how to get the new `status` value from the request body to perform the update.",
    feedback_wrong: "While the ID comes from `req.params`, the actual data you want to change (like the new status) for a `PATCH` request is found in `req.body`.",
    expected: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.json(resource);
});

app.patch('/resources/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['active', 'pending', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided. Must be active, pending, or inactive.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].status = status;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    analog_example: `// Analogous to updating a specific field of an object in a Java Spring Boot controller
// In Spring, @PathVariable maps to path parameters, @RequestBody maps to the request body

/*
@RestController
@RequestMapping("/products")
public class ProductController {

    private List<Product> products = new ArrayList<>(); // In-memory list

    // ... constructor to populate products ...

    @PatchMapping("/{id}/price")
    public ResponseEntity<Product> updateProductPrice(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Product product = products.stream()
                                  .filter(p -> p.getId().equals(id))
                                  .findFirst()
                                  .orElse(null);

        if (product == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (updates.containsKey("price")) {
            try {
                double newPrice = Double.parseDouble(updates.get("price").toString());
                product.setPrice(newPrice);
                // product.setUpdatedAt(new Date()); // Update timestamp
                return new ResponseEntity<>(product, HttpStatus.OK);
            } catch (NumberFormatException e) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
*/
`,
    deepDiveLabel: "PATCH vs. PUT for updates",
    deepDive: {
      hook: `Imagine you have a complex user profile with dozens of fields: name, email, address, preferences, profile picture, bio, etc. If a user only wants to change their email address, should your API require them to send *all* their profile data back, even the fields that haven't changed? If you use \`PUT\` for this, you'd have to send the entire, potentially large, user object. This is inefficient, increases network traffic, and makes it easier to accidentally overwrite or omit other fields. How do you update just a small part of a resource without sending the whole thing? This is a common dilemma in API design, leading to bloated requests or complex client-side logic to reconstruct full objects.`,
      pain: `⚠️ **Lesson:** Using \`PUT\` for partial updates forces clients to send the entire resource representation, leading to inefficient requests and potential data loss if fields are accidentally omitted. Symptom: Large request bodies for minor changes, or accidental overwrites of unchanged data.`,
      mentalModel: `**Mental model:** "Full Replacement vs. Surgical Edit." Think of \`PUT\` as completely replacing a document on a shelf with a brand new one. Whatever you send in the \`PUT\` request body *becomes* the new state of the resource, overwriting everything that was there before. \`PATCH\`, on the other hand, is like making a surgical edit to that document. You only send the specific changes you want to apply, and the server intelligently merges those changes into the existing resource. \`PUT\` is for "here's the new complete version," while \`PATCH\` is for "here are the specific modifications."`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Use \`PATCH\` for partial updates where only a few fields are changing.
- ✅ Use \`PUT\` when the client sends the complete, updated representation of the resource.
- ✅ Design \`PATCH\` endpoints to merge changes into the existing resource.
- ✅ Validate that \`PATCH\` request bodies contain only allowed fields for partial updates.
- ❌ Don't use \`PUT\` for partial updates; it's semantically incorrect and inefficient.
- ❌ Don't use \`PATCH\` if you intend to replace the entire resource.
- ❌ Don't forget to handle \`400 Bad Request\` if \`PATCH\` body is malformed or invalid.`,
      watchOut: `👀 **Watch out:** While \`PATCH\` is semantically for partial updates, its implementation can be more complex than \`PUT\`. You need to carefully merge the incoming fields from \`req.body\` with the existing resource, ensuring that only allowed fields are updated and that data types are respected. For \`PUT\`, the logic is simpler: find the resource and replace it entirely with \`req.body\` (after validation). Always consider the idempotence of your operations: \`PUT\` is idempotent (multiple identical requests have the same effect as one), while \`PATCH\` is not inherently idempotent unless designed carefully.`,
      dryRun: `🔁 **Think:** A client sends a \`PATCH\` request to \`/resources/res-101/status\` with body \`{"status": "inactive"}\`.
1.  \`req.params.id\` is \`"res-101"\`.
2.  \`req.body.status\` is \`"inactive"\`.
3.  The \`status\` value \`"inactive"\` is valid.
4.  \`resourceIndex\` for \`res-101\` is found (e.g., \`0\`).
5.  \`resources[0].status\` changes from \`'active'\` to \`'inactive'\`.
6.  \`resources[0].updatedAt\` is updated to a new \`Date\`.
7.  The updated resource \`resources[0]\` is returned.
(Hint: What if the \`status\` in \`req.body\` was \`"invalid-status"\`?)`,
      build: `**Learning focus:** Implement a \`PATCH\` endpoint to update a specific field (\`status\`) of a resource, including input validation and error handling.`,
    },
  },
  {
    id: "step6",
    type: "question",
    phase: "Step 6 of 8",
    paal: "Beyond simple field updates, APIs often need to manage relationships between resources. This step demonstrates how to create a `PATCH` endpoint to assign or unassign a user to a resource, reflecting a common 'linking' operation in many applications.",
    hint: "Implement an `app.patch('/resources/:id/assign', ...)` route. Get `id` from `req.params` and `userId` from `req.body`. Validate `userId` (can be string or `null`). Update `assignedTo` and `updatedAt`.",
    example_code: `app.patch('/resources/:id/assign', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (userId !== null && typeof userId !== 'string') {
    return res.status(400).json({ message: 'Invalid userId provided. Must be a string or null.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].assignedTo = userId;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});`,
    think_prompt: "To assign a user to a resource, where should the `userId` be provided in the request?",
    mc_options: [
      "Access the resource ID from `req.params`",
      "Access the `userId` from `req.body`",
      "Update the `assignedTo` field of the resource",
    ],
    mc_correct_option: "Access the `userId` from `req.body`",
    mc_anchor: "const { userId } = req.body;",
    why_this_matters: "Managing relationships between resources is a crucial aspect of many APIs. This pattern demonstrates how to use `PATCH` to modify a resource's association, providing a clear and consistent way to link entities.",
    answer_keywords: ["patch", "assign", "unassign", "relationship", "req.body", "400", "404"],
    seed_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.json(resource);
});

app.patch('/resources/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['active', 'pending', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided. Must be active, pending, or inactive.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].status = status;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    starter_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.json(resource);
});

app.patch('/resources/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['active', 'pending', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided. Must be active, pending, or inactive.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].status = status;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

// Your code here: Implement PATCH /resources/:id/assign endpoint

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    feedback_correct: "You got it! The `userId` for assignment or unassignment should be sent in the `req.body` as part of the `PATCH` request.",
    feedback_partial: "You're correctly identifying the resource. Now, focus on how to extract the `userId` from the request body and apply it to the `assignedTo` field.",
    feedback_wrong: "The `userId` for an assignment operation is typically part of the request body, not a path parameter, as it's data being sent to modify the resource's state.",
    expected: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.json(resource);
});

app.patch('/resources/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['active', 'pending', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided. Must be active, pending, or inactive.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].status = status;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.patch('/resources/:id/assign', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (userId !== null && typeof userId !== 'string') {
    return res.status(400).json({ message: 'Invalid userId provided. Must be a string or null.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].assignedTo = userId;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    analog_example: `// Analogous to updating a foreign key relationship in a SQL database
// (Conceptual SQL, not executable code)

/*
-- To assign a user to a task
UPDATE Tasks
SET assigned_user_id = 'user-charlie', updated_at = NOW()
WHERE id = 'task-101';

-- To unassign a user from a task
UPDATE Tasks
SET assigned_user_id = NULL, updated_at = NOW()
WHERE id = 'task-101';
*/

// This demonstrates updating a single field (assigned_user_id)
// which represents a relationship, similar to the PATCH endpoint.
`,
    deepDiveLabel: "Designing relationship endpoints",
    deepDive: {
      hook: `Imagine you're building a project management tool. A task can be assigned to a user, and a user can be assigned to multiple tasks. How do you design your API endpoints to manage these relationships? Should you have \`/tasks/:taskId/assignUser\` or \`/users/:userId/assignTask\`? Or perhaps a completely separate endpoint like \`/assignments\`? If you don't have a clear strategy, your API can become confusing, with inconsistent URLs and redundant logic, making it hard for clients to understand how to link entities together. This often leads to developers guessing or implementing ad-hoc solutions, resulting in a messy and unmaintainable API.`,
      pain: `⚠️ **Lesson:** Without a consistent strategy for designing relationship endpoints, APIs become difficult to navigate, leading to inconsistent URL structures and ambiguous ways to manage connections between resources. Symptom: Confusing API documentation, redundant endpoint logic, or difficulty for clients to perform common linking operations.`,
      mentalModel: `**Mental model:** "Resource-Centric Actions." When designing relationship endpoints, think primarily about the *resource* that is being directly modified or acted upon. If you're assigning a user *to a task*, the task is the primary resource. So, the endpoint should typically be nested under the task, like \`/tasks/:taskId/assign\`. The \`userId\` then becomes part of the request body. This keeps the API intuitive: you're performing an action *on* a task, and that action involves a user. For many-to-many relationships, a dedicated "linking" resource (like \`/assignments\`) can also be appropriate, but for one-to-many or one-to-one, nesting under the primary resource is often cleaner.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Nest relationship actions under the primary resource being modified (e.g., \`/tasks/:taskId/assign\`).
- ✅ Use \`PATCH\` for updating a resource's relationship field (e.g., \`assignedTo\`).
- ✅ Send the ID of the related entity in the request body for \`PATCH\`/\`POST\`.
- ✅ Provide a way to "unassign" by sending \`null\` or a specific unassign action.
- ❌ Don't create overly complex, deeply nested URLs for simple relationships.
- ❌ Don't use \`GET\` for actions that modify state (e.g., \`/tasks/:taskId/assign?userId=...\`).
- ❌ Don't make the client guess how to manage relationships; be explicit in your design.`,
      watchOut: `👀 **Watch out:** When designing relationship endpoints, think about which resource "owns" the relationship. If a \`Resource\` can only have one \`assignedTo\` user, then updating \`resources/:id/assign\` makes sense. If a \`User\` can have many \`Resources\`, you might also consider an endpoint like \`/users/:userId/resources\` to list or manage the resources assigned to a user. Consistency is key across your API. Also, ensure you handle cases where the \`userId\` provided doesn't exist, returning an appropriate error (e.g., 404 or 400).`,
      dryRun: `🔁 **Think:** A client sends a \`PATCH\` request to \`/resources/res-101/assign\` with body \`{"userId": "user-charlie"}\`.
1.  \`req.params.id\` is \`"res-101"\`.
2.  \`req.body.userId\` is \`"user-charlie"\`.
3.  The \`userId\` value \`"user-charlie"\` is a valid string.
4.  \`resourceIndex\` for \`res-101\` is found (e.g., \`0\`).
5.  \`resources[0].assignedTo\` changes from \`null\` to \`"user-charlie"\`.
6.  \`resources[0].updatedAt\` is updated to a new \`Date\`.
7.  The updated resource \`resources[0]\` is returned.
(Hint: What if the client sent \`{"userId": null}\`?)`,
      build: `**Learning focus:** Implement a \`PATCH\` endpoint to manage the assignment of a user to a resource, demonstrating how to handle relationship updates.`,
    },
  },
  {
    id: "step7",
    type: "question",
    phase: "Step 7 of 8",
    paal: "A robust API must validate incoming data and provide clear error messages. This step focuses on integrating a simple validation check for all incoming requests and establishing a consistent error response structure, making your API more reliable and user-friendly.",
    hint: "Add a middleware using `app.use(...)` to check `Content-Type` for `POST`/`PATCH`/`PUT` requests. Then, add a global error handling middleware with four arguments (`err`, `req`, `res`, `next`) at the very end.",
    example_code: `// Add this validation middleware before your routes
app.use((req, res, next) => {
  // Simple example: check for valid JSON content type for POST/PATCH/PUT
  if (['POST', 'PATCH', 'PUT'].includes(req.method) && !req.is('application/json')) {
    return res.status(400).json({ message: 'Invalid Content-Type. Expected application/json.' });
  }
  next();
});

// Add a generic error handling middleware at the very end
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.', error: err.message });
});`,
    think_prompt: "Where should a global error handling middleware be placed in your Express application's setup?",
    mc_options: [
      "Add a middleware to validate `Content-Type` for relevant methods",
      "Implement a generic error handling middleware",
      "Use a dedicated validation library like Zod or Joi",
    ],
    mc_correct_option: "Implement a generic error handling middleware",
    mc_anchor: "app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {",
    why_this_matters: "Robust validation and error handling are critical for API reliability and user experience. They prevent bad data from corrupting your system and provide clear feedback to clients when something goes wrong, making your API easier to integrate with.",
    answer_keywords: ["validation", "error handling", "middleware", "400", "500", "content-type"],
    seed_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.json(resource);
});

app.patch('/resources/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['active', 'pending', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided. Must be active, pending, or inactive.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].status = status;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.patch('/resources/:id/assign', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (userId !== null && typeof userId !== 'string') {
    return res.status(400).json({ message: 'Invalid userId provided. Must be a string or null.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].assignedTo = userId;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    starter_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

// Add this validation middleware before your routes
app.use((req, res, next) => {
  // Simple example: check for valid JSON content type for POST/PATCH/PUT
  if (['POST', 'PATCH', 'PUT'].includes(req.method) && !req.is('application/json')) {
    return res.status(400).json({ message: 'Invalid Content-Type. Expected application/json.' });
  }
  next();
});

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.json(resource);
});

app.patch('/resources/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['active', 'pending', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided. Must be active, pending, or inactive.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].status = status;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.patch('/resources/:id/assign', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (userId !== null && typeof userId !== 'string') {
    return res.status(400).json({ message: 'Invalid userId provided. Must be a string or null.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].assignedTo = userId;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

// Your code here: Add a generic error handling middleware at the very end

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    feedback_correct: "Correct! A global error handling middleware should always be placed last, so it can catch errors from any preceding route or middleware.",
    feedback_partial: "You've added a validation middleware, which is great! Now, consider adding a *global* error handling middleware at the very end of your `app.use()` chain.",
    feedback_wrong: "While dedicated validation libraries are powerful, the question is about the placement of a global error handler. This middleware needs to be defined after all other routes and middleware to function correctly.",
    expected: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

// Add this validation middleware before your routes
app.use((req, res, next) => {
  // Simple example: check for valid JSON content type for POST/PATCH/PUT
  if (['POST', 'PATCH', 'PUT'].includes(req.method) && !req.is('application/json')) {
    return res.status(400).json({ message: 'Invalid Content-Type. Expected application/json.' });
  }
  next();
});

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.json(resource);
});

app.patch('/resources/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['active', 'pending', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided. Must be active, pending, or inactive.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].status = status;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.patch('/resources/:id/assign', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (userId !== null && typeof userId !== 'string') {
    return res.status(400).json({ message: 'Invalid userId provided. Must be a string or null.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].assignedTo = userId;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

// Add a generic error handling middleware at the very end
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.', error: err.message });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    analog_example: `// Analogous to adding validation and error handling in a Node.js HTTP server without Express
import http from 'http';

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.headers['content-type'] !== 'application/json') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid Content-Type. Expected application/json.' }));
    return;
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      // Simulate an error
      if (req.url === '/error') {
        throw new Error('Simulated internal server error');
      }

      // Process request (simplified)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Request processed', receivedBody: body }));
    } catch (error: any) {
      console.error(error.stack);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Something went wrong on the server.', error: error.message }));
    }
  });
});

// server.listen(3001, () => console.log('Raw HTTP server running on port 3001'));
`,
    deepDiveLabel: "The importance of API validation",
    deepDive: {
      hook: `Imagine you're building an API for a critical financial application. A client sends a request to transfer money, but instead of a valid account number, they send a random string, or instead of a positive amount, they send a negative number. If your API doesn't validate these inputs, it could lead to corrupted data, security vulnerabilities (like injection attacks), or even financial losses. Without proper validation, your backend becomes a "garbage in, garbage out" system, making it unreliable and dangerous. Developers spend countless hours debugging issues caused by unexpected data, and users experience frustrating errors or incorrect behavior.`,
      pain: `⚠️ **Lesson:** Lack of robust input validation exposes your API to invalid data, security risks, and unpredictable behavior, leading to data corruption, crashes, and a poor developer experience. Symptom: Unexpected server errors, inconsistent data states, or security vulnerabilities.`,
      mentalModel: `**Mental model:** The "API Security Checkpoint." Think of input validation as a security checkpoint at the entrance of your API. Every piece of data trying to enter your system must pass through this checkpoint. The checkpoint guards (your validation logic) inspect the data to ensure it meets all predefined rules: Is it the correct type? Is it within the expected range? Does it conform to the required format? Only data that passes all checks is allowed to proceed into your application logic. Any invalid data is immediately rejected with a clear explanation, protecting the integrity of your system.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Validate all incoming request bodies, query parameters, and path parameters.
- ✅ Use appropriate HTTP status codes for errors (e.g., 400, 404, 500).
- ✅ Provide clear, actionable error messages in your API responses.
- ✅ Implement a global error handling middleware to catch unhandled exceptions.
- ❌ Don't trust client-side data; always re-validate on the server.
- ❌ Don't return generic "An error occurred" messages; be specific.
- ❌ Don't let unhandled exceptions crash your server without a proper error response.`,
      watchOut: `👀 **Watch out:** While manual validation (if/else) is fine for simple cases, it can quickly become verbose and error-prone for complex schemas. Consider using a schema validation library like Zod or Joi for more robust and maintainable validation. Also, remember that your global error handler should be the *last* \`app.use()\` middleware defined, so it can catch errors from all preceding routes and middleware. Ensure your error handler distinguishes between operational errors (like validation failures) and programming errors (like unhandled exceptions) to provide appropriate responses.`,
      dryRun: `🔁 **Think:** A client sends a \`POST\` request to \`/resources\` with \`Content-Type: text/plain\` and body \`{"name": "New Resource"}\`.
1.  The request hits the \`app.use((req, res, next) => { ... })\` validation middleware.
2.  \`req.method\` is \`'POST'\`, and \`req.is('application/json')\` returns \`false\`.
3.  The condition \`['POST', 'PATCH', 'PUT'].includes(req.method) && !req.is('application/json')\` evaluates to \`true\`.
4.  The middleware immediately sends \`res.status(400).json({ message: 'Invalid Content-Type...' })\` and returns.
5.  The request *never* reaches the \`/resources\` route handler.
(Hint: What if the \`Content-Type\` was \`application/json\` but the body was \`{}\`?)`,
      build: `**Learning focus:** Integrate input validation middleware and a global error handling middleware to make your API more robust and user-friendly.`,
    },
  },
  {
    id: "step8",
    type: "question",
    phase: "Step 8 of 8",
    paal: "Building an API isn't complete without ensuring it works as expected. This step introduces the concept of integration testing, where you'll learn why and how to test your API endpoints to confirm they correctly interact with your application logic and return the right responses.",
    hint: "Think about what aspects of an API endpoint you would want to verify in an automated test. Consider status codes, response bodies, and side effects.",
    example_code: `// This is conceptual code, not executable in this environment.
// Example using 'supertest' and 'jest' for API integration testing.

/*
import request from 'supertest';
import app from '../src/app'; // Assuming your Express app is exported

describe('Resource API', () => {
  it('GET /resources should return a list of resources', async () => {
    const res = await request(app).get('/resources');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /resources/:id should return a single resource', async () => {
    const res = await request(app).get('/resources/res-101');
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual('res-101');
  });

  it('PATCH /resources/:id/status should update resource status', async () => {
    const res = await request(app)
      .patch('/resources/res-101/status')
      .send({ status: 'inactive' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('inactive');
  });

  it('PATCH /resources/:id/status with invalid status should return 400', async () => {
    const res = await request(app)
      .patch('/resources/res-101/status')
      .send({ status: 'invalid' });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
  });
});
*/`,
    think_prompt: "What is one of the most important things to verify when testing an API endpoint?",
    mc_options: [
      "Verify API endpoints return correct HTTP status codes",
      "Check if API responses match expected data structures",
      "Ensure API logic interacts correctly with underlying data",
    ],
    mc_correct_option: "Verify API endpoints return correct HTTP status codes",
    mc_anchor: "expect(res.statusCode).toEqual(200);",
    why_this_matters: "Automated integration tests are essential for maintaining the quality and reliability of your API. They provide confidence that your endpoints work as expected, catch regressions early, and allow you to refactor code with less fear of introducing bugs.",
    answer_keywords: ["integration testing", "api testing", "supertest", "jest", "status codes", "assertions"],
    seed_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

// Add this validation middleware before your routes
app.use((req, res, next) => {
  // Simple example: check for valid JSON content type for POST/PATCH/PUT
  if (['POST', 'PATCH', 'PUT'].includes(req.method) && !req.is('application/json')) {
    return res.status(400).json({ message: 'Invalid Content-Type. Expected application/json.' });
  }
  next();
});

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.json(resource);
});

app.patch('/resources/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['active', 'pending', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided. Must be active, pending, or inactive.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].status = status;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.patch('/resources/:id/assign', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (userId !== null && typeof userId !== 'string') {
    return res.status(400).json({ message: 'Invalid userId provided. Must be a string or null.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].assignedTo = userId;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

// Add a generic error handling middleware at the very end
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.', error: err.message });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    starter_code: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

// Add this validation middleware before your routes
app.use((req, res, next) => {
  // Simple example: check for valid JSON content type for POST/PATCH/PUT
  if (['POST', 'PATCH', 'PUT'].includes(req.method) && !req.is('application/json')) {
    return res.status(400).json({ message: 'Invalid Content-Type. Expected application/json.' });
  }
  next();
});

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.json(resource);
});

app.patch('/resources/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['active', 'pending', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided. Must be active, pending, or inactive.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].status = status;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.patch('/resources/:id/assign', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (userId !== null && typeof userId !== 'string') {
    return res.status(400).json({ message: 'Invalid userId provided. Must be a string or null.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].assignedTo = userId;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

// Add a generic error handling middleware at the very end
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.', error: err.message });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    feedback_correct: "Absolutely! Verifying HTTP status codes is fundamental to API testing, as it immediately tells you if the request was successful, not found, or had a client-side error.",
    feedback_partial: "You're thinking about important aspects of API testing. While checking data structures and logic are crucial, start by ensuring the API returns the correct HTTP status codes for different scenarios.",
    feedback_wrong: "While all options are important, the HTTP status code is the first indicator of an API's response success or failure. Always verify this first in your tests.",
    expected: `import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

interface Resource {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [
  {
    id: 'res-101',
    name: 'Development Task A',
    status: 'active',
    assignedTo: null,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 'res-102',
    name: 'Testing Scenario B',
    status: 'pending',
    assignedTo: 'user-alpha',
    createdAt: new Date('2023-01-05T11:30:00Z'),
    updatedAt: new Date('2023-01-05T11:30:00Z'),
  },
  {
    id: 'res-103',
    name: 'Deployment Checklist C',
    status: 'inactive',
    assignedTo: 'user-beta',
    createdAt: new Date('2023-01-10T14:00:00Z'),
    updatedAt: new Date('2023-01-10T14:00:00Z'),
  },
];

// Add this validation middleware before your routes
app.use((req, res, next) => {
  // Simple example: check for valid JSON content type for POST/PATCH/PUT
  if (['POST', 'PATCH', 'PUT'].includes(req.method) && !req.is('application/json')) {
    return res.status(400).json({ message: 'Invalid Content-Type. Expected application/json.' });
  }
  next();
});

app.get('/resources', (req, res) => {
  let filteredResources = [...resources];

  // Filtering by status
  const { status, search, page = '1', limit = '10' } = req.query;
  if (typeof status === 'string' && ['active', 'pending', 'inactive'].includes(status)) {
    filteredResources = filteredResources.filter(r => r.status === status);
  }

  // Basic search by name
  if (typeof search === 'string' && search.trim() !== '') {
    const searchTerm = search.toLowerCase();
    filteredResources = filteredResources.filter(r => r.name.toLowerCase().includes(searchTerm));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = pageNum * limitNum;

  const paginatedResources = filteredResources.slice(startIndex, endIndex);

  res.json({
    total: filteredResources.length,
    page: pageNum,
    limit: limitNum,
    data: paginatedResources,
  });
});

app.get('/resources/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.json(resource);
});

app.patch('/resources/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['active', 'pending', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided. Must be active, pending, or inactive.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].status = status;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.patch('/resources/:id/assign', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (userId !== null && typeof userId !== 'string') {
    return res.status(400).json({ message: 'Invalid userId provided. Must be a string or null.' });
  }

  const resourceIndex = resources.findIndex(r => r.id === id);

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  resources[resourceIndex].assignedTo = userId;
  resources[resourceIndex].updatedAt = new Date();

  res.json(resources[resourceIndex]);
});

app.get('/', (req, res) => {
  res.send('API is running!');
});

// Add a generic error handling middleware at the very end
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.', error: err.message });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});`,
    analog_example: `// Analogous to unit testing a function in JavaScript
function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Inputs must be numbers');
  }
  return a + b;
}

// Using a testing framework like Jest
/*
describe('sum function', () => {
  it('should add two numbers correctly', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('should return 0 for two zeros', () => {
    expect(sum(0, 0)).toBe(0);
  });

  it('should throw an error for non-numeric inputs', () => {
    expect(() => sum(1, '2')).toThrow('Inputs must be numbers');
  });
});
*/
`,
    deepDiveLabel: "Why test your API endpoints?",
    deepDive: {
      hook: `Imagine you've just finished building a complex API with many endpoints, filters, and update operations. You've manually tested a few requests with Postman or curl, and everything *seems* to work. But what happens when you add a new feature, refactor some code, or fix a bug? How can you be sure that your changes haven't broken existing functionality? Manually re-testing every single endpoint and every possible scenario after every change is tedious, error-prone, and unsustainable. This lack of automated verification leads to regressions, missed bugs, and a constant fear of deploying new code, ultimately slowing down development and eroding confidence in your system.`,
      pain: `⚠️ **Lesson:** Without automated integration tests, it's impossible to reliably verify that your API endpoints function correctly, leading to regressions, undetected bugs, and a lack of confidence in your deployed code. Symptom: Frequent production bugs, slow development cycles due to manual testing, or fear of making changes.`,
      mentalModel: `**Mental model:** The "API Quality Assurance Robot." Think of integration tests as a tireless robot that automatically sends requests to your API endpoints, just like a real client would. This robot then meticulously checks the responses: Is the status code correct (200 OK, 404 Not Found, 400 Bad Request)? Does the response body contain the expected data in the correct format? Did the database (or in-memory data) update as expected? This robot runs these checks repeatedly, every time you make a change, providing immediate feedback and ensuring that your API consistently meets its quality standards without human intervention.`,
      discover: "Re-read the WHAT / HOW for this step. The check verifies those requirements — not a pasted answer.",
      quickRules: `**Quick rules:**
- ✅ Write integration tests for all critical API endpoints.
- ✅ Test both success paths and various error conditions (e.g., invalid input, not found).
- ✅ Verify HTTP status codes, response body content, and headers.
- ✅ Use a dedicated testing framework and HTTP request library (e.g., Jest + Supertest).
- ❌ Don't rely solely on manual testing; it's slow and error-prone.
- ❌ Don't skip testing error paths; they are just as important as success paths.
- ❌ Don't write tests that are too brittle or dependent on exact data values that change frequently.`,
      watchOut: `👀 **Watch out:** When writing integration tests, ensure your tests are isolated and don't affect each other. This often means resetting your database or in-memory data before each test run. For in-memory data, you might re-initialize your \`resources\` array. For a real database, you'd typically use test-specific databases or transactions that are rolled back. Also, avoid testing internal implementation details; focus on the API's public contract (inputs and outputs).`,
      dryRun: `🔁 **Think:** A test runs \`request(app).get('/resources/non-existent-id')\`.
1.  The \`GET /resources/:id\` route handler is executed.
2.  \`resources.find(r => r.id === 'non-existent-id')\` returns \`undefined\`.
3.  The \`if (!resource)\` condition is \`true\`.
4.  \`res.status(404).json({ message: 'Resource not found' })\` is called.
5.  The test receives a response with \`statusCode: 404\` and \`body: { message: 'Resource not found' }\`.
6.  The test assertion \`expect(res.statusCode).toEqual(404)\` passes.
(Hint: What would happen if the route handler didn't explicitly return \`res.status(404)\`?)`,
      build: `**Learning focus:** Understand the importance of integration testing for APIs and how to conceptually structure tests to verify endpoint behavior.`,
    },
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "1. Server Setup", id: "step1" },
  { label: "2. Data Model", id: "step2" },
  { label: "3. List Resources", id: "step3" },
  { label: "4. Get Resource", id: "step4" },
  { label: "5. Update Status", id: "step5" },
  { label: "6. Assign User", id: "step6" },
  { label: "7. Validation & Errors", id: "step7" },
  { label: "8. API Testing", id: "step8" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Designing a REST API for Resource Management",
  shortName: "REST API Design",
});
