import createINPACTEngine from "../inpact_engine_shared";

const MENTAL_MODEL = `Build the fulfillment board that triggers a real 4-line ledger split:

  Props     →  orders + onFulfill come from the parent — this component owns no SO data itself
  List      →  every sales order, its number, total, and status
  Action    →  a "Fulfill & Ship" button on CONFIRMED orders
  Fulfill   →  POST /api/so/:id/fulfill — real stock decrement + real AR/Revenue/COGS/Inventory posting
  Guard     →  a real 409 INSUFFICIENT_STOCK response must be shown, not swallowed
`;

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-erp-so-pipeline",
      title: "Sales fulfillment board",
      body: MENTAL_MODEL,
      usecase: "Fulfilling an order for real decrements stock and posts a real 4-line AR/Revenue/COGS/Inventory journal entry — this board is the one-click trigger for that.",
      designMock: {"kind":"list-and-form","screenTitle":"Sales Orders","caption":"This is the screen you are building — each row is a real sales order; Fulfill & Ship really posts to the ledger and can really fail if stock is short.","listCaption":"LIST — real sales orders","emptyCaption":"EMPTY — when there are no sales orders","emptyMessage":"No sales orders yet.","rows":[{"title":"SO-2001","subtitle":"$125.00","meta":"CONFIRMED"},{"title":"SO-2002","subtitle":"$60.00","meta":"SHIPPED"}],"fields":[{"label":"Status","options":["All","CONFIRMED","SHIPPED"]}],"formMode":"filter","submitLabel":"Filter"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Create the component file, define the props shape (orders + onFulfill), and export the empty shell.",
      "Render the list of sales orders — number, customer's total, and status.",
      "Add a Fulfill & Ship button on CONFIRMED orders, wired to the real fulfillment endpoint.",
      "Handle the response — success reloads the parent's data, a real 409 (insufficient stock) is shown, not swallowed.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Create the component file at src/components/SalesFulfillmentBoard.tsx, define its props, and export the shell.

Create src/components/SalesFulfillmentBoard.tsx. Like the procurement panel, this component doesn't own any sales-order data itself — it receives the list and a refresh callback as props.

WHAT YOUR CODE NEEDS
- A SalesOrder type: id, soNumber, totalAmount, status (matching the real /api/so response).
- A props type: orders: SalesOrder[]; onFulfill: () => void.

Your task: define SalesOrder and SalesFulfillmentBoardProps, then export SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) returning <div /> — every step from here on edits this same file.`,
    hint: `1. Create file: Add a new file at src/components/SalesFulfillmentBoard.tsx.
2. Define SalesOrder: id, soNumber, totalAmount, status — matching the real POST/GET /api/so response shape.
3. Define props: type SalesFulfillmentBoardProps = { orders: SalesOrder[]; onFulfill: () => void; }.
4. Export shell: export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) { return <div />; }.`,
    example_code: `// src/components/SalesPipeline.tsx
export type SO = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesPipelineProps = {
  orders: SO[];
  onFulfill: () => void;
};

export function SalesPipeline({ orders, onFulfill }: SalesPipelineProps) {
  return <div />;
}`,
    think_prompt: `This board is the mirror image of the procurement panel you may have already built — same "props, not its own fetch" shape, but for the other side of the transaction: shipping instead of receiving. What does this component need handed to it from outside?`,
    mc_options: [
      "define SalesOrder and a props type ({ orders, onFulfill }), then export SalesFulfillmentBoard accepting both as props",
      "fetch /api/so itself inside this component",
      "hardcode a fixed list of sample sales orders",
    ],
    mc_correct_option: "define SalesOrder and a props type ({ orders, onFulfill }), then export SalesFulfillmentBoard accepting both as props",
    mc_anchor: "define SalesOrder and a props type ({ or",
    why_this_matters: `A board that only renders what it's handed keeps every panel on the page showing the same real, current data.`,
    answer_keywords: ["SalesOrder", "soNumber", "totalAmount", "status", "orders", "onFulfill", "SalesFulfillmentBoard"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the shape and the props-only shell both exist now.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "This board takes orders and onFulfill as props — it doesn't fetch or own the list itself.",
    pre_check_hint: `Same pattern as any props-driven list component: name what shape one order has, and what callback the board needs to ask for a refresh.`,
    expected: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  return <div />;
}
`,
    analog_example: `export type SO = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesPipelineProps = {
  orders: SO[];
  onFulfill: () => void;
};

export function SalesPipeline({ orders, onFulfill }: SalesPipelineProps) {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A board that only renders what it's handed keeps every panel on the page showing the same real, current data.`,
      pain: "A component that fetches its own copy of shared sales-order data can drift out of sync with what the procurement panel or inventory table just changed.",
      mentalModel: MENTAL_MODEL,
      discover: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not fetch /api/so from inside this component — that's the parent page's job.",
      dryRun: "Write the same props-only shell for a different list + action pair.",
      build: `1. Define SalesOrder.\n2. Define props (orders, onFulfill).\n3. Export the shell accepting both.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Render the list of sales orders — number, customer's total, and status.

Loop over the orders prop and display each one's SO number, formatted total, and current status, or a message when there are none.

WHAT YOUR LOGIC NEEDS
- A conditional check for orders.length === 0.
- An empty message: "No sales orders yet."
- A .map() rendering each order's soNumber, totalAmount (formatted), and status.

Your task: render "No sales orders yet." when orders.length === 0, otherwise one row per order (key={so.id}) showing soNumber, totalAmount formatted with $ and 2 decimals, and status.`,
    hint: `1. Check for empty: orders.length === 0 ? <p>No sales orders yet.</p> : (...)
2. Loop orders: orders.map((so) => <div key={so.id}>{so.soNumber} - \${so.totalAmount.toFixed(2)} ({so.status})</div>)`,
    example_code: `{orders.length === 0 ? (
  <p>No sales orders yet.</p>
) : (
  orders.map((so) => (
    <div key={so.id} className="p-3 border rounded mb-2">
      <div className="flex justify-between">
        <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
        <span className="uppercase text-sm">{so.status}</span>
      </div>
    </div>
  ))
)}`,
    think_prompt: `Same list-or-empty-message pattern you've used throughout this whole product. What three fields does a sales-order row need to display?`,
    mc_options: [
      "branch on orders.length === 0, otherwise map each order to a row showing soNumber, totalAmount, and status",
      "always render the rows even when orders is empty",
      "only show the order count, not each order",
    ],
    mc_correct_option: "branch on orders.length === 0, otherwise map each order to a row showing soNumber, totalAmount, and status",
    mc_anchor: "branch on orders.length === 0, otherwise",
    why_this_matters: `Showing the real order number and status gives warehouse staff exactly what they need to decide what to ship next.`,
    answer_keywords: ["orders", "length", "map", "soNumber", "totalAmount", "status", "key"],
    seed_code: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  return <div />;
}
`,
    starter_code: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  return (
    <div>
      <h3>Sales Orders</h3>
      {/* empty or list */}
    </div>
  );
}
`,
    feedback_correct: "Correct — every real sales order now renders, or an honest empty message.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Branch on orders.length === 0 first, then map each order into a row with a stable key.",
    pre_check_hint: `Render sales orders grouped by status. For each, this is the familiar length-check-then-map pattern, showing soNumber, totalAmount, and status per row.`,
    expected: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders yet.</p>
      ) : (
        orders.map((so) => (
          <div key={so.id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
              <span className="uppercase text-sm">{so.status}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
`,
    analog_example: `{orders.length === 0 ? (
  <p>No sales orders yet.</p>
) : (
  orders.map((so) => (
    <div key={so.id} className="p-3 border rounded mb-2">
      <div className="flex justify-between">
        <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
        <span className="uppercase text-sm">{so.status}</span>
      </div>
    </div>
  ))
)}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Showing the real order number and status gives warehouse staff exactly what they need to decide what to ship next.`,
      pain: "Skipping the empty check leaves a blank board with no explanation before any SO has ever been created.",
      mentalModel: MENTAL_MODEL,
      discover: `orders.map((so) => (
  <div key={so.id}>{so.soNumber} - \${so.totalAmount.toFixed(2)} ({so.status})</div>
))`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Render the same kind of list for a different resource with the same shape.",
      build: `1. Check length.\n2. Empty message.\n3. Map rows with key={so.id}.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Add a Fulfill & Ship button on CONFIRMED orders, wired to the real fulfillment endpoint.

For any order whose status is CONFIRMED, show a "Fulfill & Ship" button that calls the real fulfillment endpoint for that specific order.

WHAT YOUR LOGIC NEEDS
- A conditional render: only show the button when so.status === "CONFIRMED".
- An onClick handler calling fetch(\`/api/so/\${so.id}/fulfill\`, { method: "POST" }).
- The handler is async so it can await the response.

Your task: add the button per row, calling POST /api/so/:id/fulfill for that exact order's id when clicked.`,
    hint: `1. Conditional button: {so.status === "CONFIRMED" && (<button onClick={() => handleFulfill(so.id)}>Fulfill & Ship</button>)}
2. Handler: async function handleFulfill(id: string) { await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" }); }
3. Place the handler above the return statement, inside the component.`,
    example_code: `async function handleFulfill(id: string) {
  await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
}

{so.status === "CONFIRMED" && (
  <button
    onClick={() => handleFulfill(so.id)}
    className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded"
  >
    Fulfill & Ship
  </button>
)}`,
    think_prompt: `Only a CONFIRMED order is waiting to ship — an already-SHIPPED order should never show this button again. What decides whether the button even appears, and what must the fetch target?`,
    mc_options: [
      "a button only on CONFIRMED orders, calling fetch with that exact order's id in the URL",
      "one global Fulfill & Ship button that fulfills every order at once",
      "a button that's always visible, even on already-SHIPPED orders",
    ],
    mc_correct_option: "a button only on CONFIRMED orders, calling fetch with that exact order's id in the URL",
    mc_anchor: "a button only on CONFIRMED orders, calli",
    why_this_matters: `The pipeline view guides orders smoothly through each fulfillment stage while enforcing stock availability at the exact moment of dispatch.`,
    answer_keywords: ["handleFulfill", "fetch", "so.id", "fulfill", "POST", "CONFIRMED"],
    seed_code: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders yet.</p>
      ) : (
        orders.map((so) => (
          <div key={so.id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
              <span className="uppercase text-sm">{so.status}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
`,
    starter_code: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  // handleFulfill goes here

  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders yet.</p>
      ) : (
        orders.map((so) => (
          <div key={so.id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
              <span className="uppercase text-sm">{so.status}</span>
            </div>
            {/* Fulfill & Ship button goes here */}
          </div>
        ))
      )}
    </div>
  );
}
`,
    feedback_correct: "Correct — each order gets its own button, targeting its own id.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "The button must only show on CONFIRMED orders and must call fulfill with that exact order's id.",
    pre_check_hint: `The button's onClick calls an async function that posts to /api/so/:id/fulfill using this specific row's so.id, not a fixed value.`,
    expected: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  async function handleFulfill(id: string) {
    await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
  }

  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders yet.</p>
      ) : (
        orders.map((so) => (
          <div key={so.id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
              <span className="uppercase text-sm">{so.status}</span>
            </div>
            {so.status === "CONFIRMED" && (
              <button onClick={() => handleFulfill(so.id)} className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded">
                Fulfill & Ship
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    analog_example: `async function handleFulfill(id: string) {
  await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
}

{so.status === "CONFIRMED" && (
  <button onClick={() => handleFulfill(so.id)} className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded">
    Fulfill & Ship
  </button>
)}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `The pipeline view guides orders smoothly through each fulfillment stage while enforcing stock availability at the exact moment of dispatch.`,
      pain: "A button not scoped to its own row's id or its own status risks shipping the wrong order, or shipping one already shipped.",
      mentalModel: MENTAL_MODEL,
      discover: `async function handleFulfill(id: string) {
  await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not hardcode a single SO id — always use the row's own so.id.",
      dryRun: "Wire the same per-row action button for a different resource and endpoint.",
      build: `1. Conditional button on status === "CONFIRMED".\n2. Handler posts to /api/so/\${id}/fulfill.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Handle the response — success reloads the parent's data, a real 409 (insufficient stock) is shown, not swallowed.

After the fulfill request resolves, call onFulfill() to tell the parent to reload everything, or surface the real 409 INSUFFICIENT_STOCK error when the API rejects the request.

WHAT YOUR LOGIC NEEDS
- Check res.ok after the fetch resolves.
- On success, call the onFulfill() prop so the parent refetches items/orders/reports.
- On failure, read the real error body (e.g. "INSUFFICIENT_STOCK: WIDGET-01") and show it instead of failing silently.

Your task: after fetch resolves, call onFulfill() if res.ok; otherwise parse the JSON error body and surface it to the user.`,
    hint: `1. Capture the response: const res = await fetch(...).
2. Branch on res.ok: if (res.ok) { onFulfill(); } else { const body = await res.json(); alert(body.error); }
3. Keep the fetch call itself unchanged — only what happens after it resolves is new.`,
    example_code: `async function handleFulfill(id: string) {
  const res = await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
  if (res.ok) {
    onFulfill();
  } else {
    const body = await res.json();
    alert(body.error || "Could not fulfill this order.");
  }
}`,
    think_prompt: `A real fulfillment can genuinely fail — someone tries to ship 999 units of something with 25 in stock, and the server correctly says 409 INSUFFICIENT_STOCK. Silently doing nothing on failure would leave staff thinking the order shipped when it didn't. What has to happen in each of the two outcomes?`,
    mc_options: [
      "check res.ok: call onFulfill() on success, read and show the real error body on failure",
      "always call onFulfill(), whether or not the request actually succeeded",
      "ignore the response entirely once the fetch call is made",
    ],
    mc_correct_option: "check res.ok: call onFulfill() on success, read and show the real error body on failure",
    mc_anchor: "check res.ok: call onFulfill() on success",
    why_this_matters: `Refreshing on success keeps every panel synced with the ledger; surfacing a real 409 keeps staff from believing an order shipped when stock genuinely ran out.`,
    answer_keywords: ["res.ok", "onFulfill", "alert", "body.error", "json", "INSUFFICIENT_STOCK"],
    seed_code: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  async function handleFulfill(id: string) {
    await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
  }

  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders yet.</p>
      ) : (
        orders.map((so) => (
          <div key={so.id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
              <span className="uppercase text-sm">{so.status}</span>
            </div>
            {so.status === "CONFIRMED" && (
              <button onClick={() => handleFulfill(so.id)} className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded">
                Fulfill & Ship
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    starter_code: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  async function handleFulfill(id: string) {
    const res = await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
    // handle res.ok / error here
  }

  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders yet.</p>
      ) : (
        orders.map((so) => (
          <div key={so.id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
              <span className="uppercase text-sm">{so.status}</span>
            </div>
            {so.status === "CONFIRMED" && (
              <button onClick={() => handleFulfill(so.id)} className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded">
                Fulfill & Ship
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    feedback_correct: "Correct — a real success reloads everything, and a real 409 is never silent.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Branch on res.ok — call onFulfill() only on success, and show the real error body on failure.",
    pre_check_hint: `res.ok tells you whether the server actually accepted the request. On success, tell the parent to reload (onFulfill()); on failure, read the JSON body's error field (a real INSUFFICIENT_STOCK message) and show it.`,
    expected: `export type SalesOrder = {
  id: string;
  soNumber: string;
  totalAmount: number;
  status: string;
};

type SalesFulfillmentBoardProps = {
  orders: SalesOrder[];
  onFulfill: () => void;
};

export function SalesFulfillmentBoard({ orders, onFulfill }: SalesFulfillmentBoardProps) {
  async function handleFulfill(id: string) {
    const res = await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
    if (res.ok) {
      onFulfill();
    } else {
      const body = await res.json();
      alert(body.error || "Could not fulfill this order.");
    }
  }

  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders yet.</p>
      ) : (
        orders.map((so) => (
          <div key={so.id} className="p-3 border rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{so.soNumber} - \${so.totalAmount.toFixed(2)}</span>
              <span className="uppercase text-sm">{so.status}</span>
            </div>
            {so.status === "CONFIRMED" && (
              <button onClick={() => handleFulfill(so.id)} className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded">
                Fulfill & Ship
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    analog_example: `async function handleFulfill(id: string) {
  const res = await fetch(\`/api/so/\${id}/fulfill\`, { method: "POST" });
  if (res.ok) {
    onFulfill();
  } else {
    const body = await res.json();
    alert(body.error || "Could not fulfill this order.");
  }
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Refreshing on success keeps every panel synced with the ledger; surfacing a real 409 keeps staff from believing an order shipped when stock genuinely ran out.`,
      pain: "Ignoring the response leaves staff clicking a button that looks like it worked, even on a real 409 rejection.",
      mentalModel: MENTAL_MODEL,
      discover: `if (res.ok) {
  onFulfill();
} else {
  const body = await res.json();
  alert(body.error);
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not assume every fetch succeeds — always branch on res.ok.",
      dryRun: "Handle success/failure the same way for a different action button.",
      build: `1. Capture res.\n2. if (res.ok) onFulfill().\n3. else read + show body.error.`,
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
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 0,
  title: "Sales fulfillment board",
  shortName: "SO pipeline",
});
