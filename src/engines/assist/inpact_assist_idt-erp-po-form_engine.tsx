import createINPACTEngine from "../inpact_engine_shared";

const MENTAL_MODEL = `Build the purchasing panel that triggers a real receipt against the real ledger:

  Props    →  orders + onReceive come from the parent — this component owns no PO data itself
  List     →  every purchase order, its number, total, and status
  Action   →  a "Receive Goods" button on anything not yet RECEIVED
  Receive  →  POST /api/po/:id/receive — real stock + real cost + real GL posting happen there
  Refresh  →  call onReceive() so the parent reloads and every other panel sees the update
`;

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-erp-po-form",
      title: "Procurement panel: purchase orders + receiving",
      body: MENTAL_MODEL,
      usecase: "Receiving goods for real recomputes cost via Moving Average Cost and posts a real Inventory/AP journal entry — this panel is the one-click trigger for that.",
      designMock: {"kind":"list-and-form","screenTitle":"Purchase Orders","caption":"This is the screen you are building — each row is a real purchase order; clicking Receive Goods really posts to the ledger.","listCaption":"LIST — real purchase orders","emptyCaption":"EMPTY — when there are no purchase orders","emptyMessage":"No purchase orders yet.","rows":[{"title":"PO-1001","subtitle":"$150.00","meta":"DRAFT"},{"title":"PO-1002","subtitle":"$90.00","meta":"RECEIVED"}],"fields":[{"label":"Status","options":["All","DRAFT","RECEIVED"]}],"formMode":"filter","submitLabel":"Filter"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Create the component file, define the props shape (orders + onReceive), and export the empty shell.",
      "Render the list of purchase orders — number, total, and status.",
      "Add a Receive Goods button on any order that isn't RECEIVED yet, wired to the real receive endpoint.",
      "Handle the response — success reloads the parent's data, failure (already received) shows the real error.",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal: `Create the component file at src/components/ProcurementPanel.tsx, define its props, and export the shell.

Create src/components/ProcurementPanel.tsx. This component doesn't own any purchase-order data itself — it receives the list and a refresh callback as props from the parent page.

WHAT YOUR CODE NEEDS
- A PurchaseOrder type: id, poNumber, totalAmount, status (all matching the real /api/po response).
- A props type: orders: PurchaseOrder[]; onReceive: () => void.

Your task: define PurchaseOrder and ProcurementPanelProps, then export ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) returning <div /> — every step from here on edits this same file.`,
    hint: `1. Create file: Add a new file at src/components/ProcurementPanel.tsx.
2. Define PurchaseOrder: id, poNumber, totalAmount, status — matching the real POST/GET /api/po response shape.
3. Define props: type ProcurementPanelProps = { orders: PurchaseOrder[]; onReceive: () => void; }.
4. Export shell: export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) { return <div />; }.`,
    example_code: `// src/components/POManager.tsx
export type PO = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type POManagerProps = {
  orders: PO[];
  onReceive: () => void;
};

export function POManager({ orders, onReceive }: POManagerProps) {
  return <div />;
}`,
    think_prompt: `This panel never fetches its own purchase orders — the parent page owns that list and hands it down, the same way the parent will also own items and sales orders. What does this component need to accept from outside, rather than manage on its own?`,
    mc_options: [
      "define PurchaseOrder and a props type ({ orders, onReceive }), then export ProcurementPanel accepting both as props",
      "fetch /api/po itself inside this component",
      "hardcode a fixed list of sample purchase orders",
    ],
    mc_correct_option: "define PurchaseOrder and a props type ({ orders, onReceive }), then export ProcurementPanel accepting both as props",
    mc_anchor: "define PurchaseOrder and a props type ({",
    why_this_matters: `A panel that only renders what it's handed — never fetching on its own — is what lets the parent page keep every panel showing the same, consistent data.`,
    answer_keywords: ["PurchaseOrder", "poNumber", "totalAmount", "status", "orders", "onReceive", "ProcurementPanel"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — the shape and the props-only shell both exist now.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "This panel takes orders and onReceive as props — it doesn't fetch or own the list itself.",
    pre_check_hint: `A props type is a contract naming what a component needs handed to it from outside — orders to render, and a callback to ask for a refresh once something changes.`,
    expected: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  return <div />;
}
`,
    analog_example: `export type PO = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type POManagerProps = {
  orders: PO[];
  onReceive: () => void;
};

export function POManager({ orders, onReceive }: POManagerProps) {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A panel that only renders what it's handed — never fetching on its own — is what lets the parent page keep every panel showing the same, consistent data.`,
      pain: "A component that fetches its own copy of shared data can drift out of sync the moment another panel changes that same data.",
      mentalModel: MENTAL_MODEL,
      discover: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  return <div />;
}
`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not fetch /api/po from inside this component — that's the parent page's job.",
      dryRun: "Write the same props-only shell for a different list + action pair.",
      build: `1. Define PurchaseOrder.\n2. Define props (orders, onReceive).\n3. Export the shell accepting both.`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal: `Render the list of purchase orders — number, total, and status.

Loop over the orders prop and display each one's PO number, formatted total, and current status, or a message when there are none.

WHAT YOUR LOGIC NEEDS
- A conditional check for orders.length === 0.
- An empty message: "No purchase orders yet."
- A .map() rendering each order's poNumber, totalAmount (formatted), and status.

Your task: render "No purchase orders yet." when orders.length === 0, otherwise one row per order (key={po.id}) showing poNumber, totalAmount formatted with $ and 2 decimals, and status.`,
    hint: `1. Check for empty: orders.length === 0 ? <p>No purchase orders yet.</p> : (...)
2. Loop orders: orders.map((po) => <div key={po.id}>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</div>)`,
    example_code: `{orders.length === 0 ? (
  <p>No purchase orders yet.</p>
) : (
  orders.map((po) => (
    <div key={po.id} className="flex justify-between p-2 border-b">
      <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
    </div>
  ))
)}`,
    think_prompt: `Same list-or-empty-message pattern as every other list you've built — the only difference here is what each row actually shows. What three fields does a purchase-order row need to display?`,
    mc_options: [
      "branch on orders.length === 0, otherwise map each order to a row showing poNumber, totalAmount, and status",
      "always render the rows even when orders is empty",
      "only show the order count, not each order",
    ],
    mc_correct_option: "branch on orders.length === 0, otherwise map each order to a row showing poNumber, totalAmount, and status",
    mc_anchor: "branch on orders.length === 0, otherwise",
    why_this_matters: `Showing the real order number and status gives procurement staff the same information a paper PO file would, at a glance.`,
    answer_keywords: ["orders", "length", "map", "poNumber", "totalAmount", "status", "key"],
    seed_code: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  return <div />;
}
`,
    starter_code: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  return (
    <div>
      <h3>Purchase Orders</h3>
      {/* empty or list */}
    </div>
  );
}
`,
    feedback_correct: "Correct — every real purchase order now renders, or an honest empty message.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Branch on orders.length === 0 first, then map each order into a row with a stable key.",
    pre_check_hint: `List all purchase orders. For each, this is just the familiar length-check-then-map pattern, showing poNumber, totalAmount, and status per row.`,
    expected: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  return (
    <div>
      <h3>Purchase Orders</h3>
      {orders.length === 0 ? (
        <p>No purchase orders yet.</p>
      ) : (
        orders.map((po) => (
          <div key={po.id} className="flex justify-between p-2 border-b">
            <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
          </div>
        ))
      )}
    </div>
  );
}
`,
    analog_example: `{orders.length === 0 ? (
  <p>No purchase orders yet.</p>
) : (
  orders.map((po) => (
    <div key={po.id} className="flex justify-between p-2 border-b">
      <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
    </div>
  ))
)}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Showing the real order number and status gives procurement staff the same information a paper PO file would, at a glance.`,
      pain: "Skipping the empty check leaves a blank panel with no explanation before any PO has ever been created.",
      mentalModel: MENTAL_MODEL,
      discover: `orders.map((po) => (
  <div key={po.id}>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</div>
))`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not turn a single import or interface into its own lesson.",
      dryRun: "Render the same kind of list for a different resource with the same shape.",
      build: `1. Check length.\n2. Empty message.\n3. Map rows with key={po.id}.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal: `Add a Receive Goods button on any order that isn't RECEIVED yet, wired to the real receive endpoint.

For any order whose status isn't RECEIVED, show a "Receive Goods" button that calls the real receipt endpoint for that specific order.

WHAT YOUR LOGIC NEEDS
- A conditional render: only show the button when po.status !== "RECEIVED".
- An onClick handler calling fetch(\`/api/po/\${po.id}/receive\`, { method: "POST" }).
- The handler is async so it can await the response.

Your task: add the button per row, calling POST /api/po/:id/receive for that exact order's id when clicked.`,
    hint: `1. Conditional button: {po.status !== "RECEIVED" && (<button onClick={() => handleReceive(po.id)}>Receive Goods</button>)}
2. Handler: async function handleReceive(id: string) { await fetch(\`/api/po/\${id}/receive\`, { method: "POST" }); }
3. Place the handler above the return statement, inside the component.`,
    example_code: `async function handleReceive(id: string) {
  await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
}

{po.status !== "RECEIVED" && (
  <button
    onClick={() => handleReceive(po.id)}
    className="bg-blue-600 text-white px-3 py-1 rounded"
  >
    Receive Goods
  </button>
)}`,
    think_prompt: `Every order needs its OWN button pointed at its OWN id — clicking Receive Goods on PO-1001 must never accidentally receive PO-1002. What does the URL for this fetch need to include, and which orders should the button even appear on?`,
    mc_options: [
      "a button per non-RECEIVED order, calling fetch with that exact order's id in the URL",
      "one global Receive Goods button that receives every order at once",
      "a button that's always visible, even on already-RECEIVED orders",
    ],
    mc_correct_option: "a button per non-RECEIVED order, calling fetch with that exact order's id in the URL",
    mc_anchor: "a button per non-RECEIVED order, calling",
    why_this_matters: `One-click receiving makes warehouse processing straightforward while triggering a real, atomic stock + cost + ledger update behind the scenes.`,
    answer_keywords: ["handleReceive", "fetch", "po.id", "receive", "POST", "status"],
    seed_code: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  return (
    <div>
      <h3>Purchase Orders</h3>
      {orders.length === 0 ? (
        <p>No purchase orders yet.</p>
      ) : (
        orders.map((po) => (
          <div key={po.id} className="flex justify-between p-2 border-b">
            <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
          </div>
        ))
      )}
    </div>
  );
}
`,
    starter_code: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  // handleReceive goes here

  return (
    <div>
      <h3>Purchase Orders</h3>
      {orders.length === 0 ? (
        <p>No purchase orders yet.</p>
      ) : (
        orders.map((po) => (
          <div key={po.id} className="flex justify-between p-2 border-b">
            <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
            {/* Receive Goods button goes here */}
          </div>
        ))
      )}
    </div>
  );
}
`,
    feedback_correct: "Correct — each order gets its own button, targeting its own id.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "The button must only show on non-RECEIVED orders and must call receive with that exact order's id.",
    pre_check_hint: `The button's onClick calls an async function that posts to /api/po/:id/receive using this specific row's po.id, not a fixed value.`,
    expected: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  async function handleReceive(id: string) {
    await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
  }

  return (
    <div>
      <h3>Purchase Orders</h3>
      {orders.length === 0 ? (
        <p>No purchase orders yet.</p>
      ) : (
        orders.map((po) => (
          <div key={po.id} className="flex justify-between p-2 border-b">
            <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
            {po.status !== "RECEIVED" && (
              <button onClick={() => handleReceive(po.id)} className="bg-blue-600 text-white px-3 py-1 rounded">
                Receive Goods
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    analog_example: `async function handleReceive(id: string) {
  await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
}

{po.status !== "RECEIVED" && (
  <button onClick={() => handleReceive(po.id)} className="bg-blue-600 text-white px-3 py-1 rounded">
    Receive Goods
  </button>
)}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `One-click receiving makes warehouse processing straightforward while triggering a real, atomic stock + cost + ledger update behind the scenes.`,
      pain: "A button not scoped to its own row's id risks receiving the wrong purchase order entirely.",
      mentalModel: MENTAL_MODEL,
      discover: `async function handleReceive(id: string) {
  await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not hardcode a single PO id — always use the row's own po.id.",
      dryRun: "Wire the same per-row action button for a different resource and endpoint.",
      build: `1. Conditional button on status !== "RECEIVED".\n2. Handler posts to /api/po/\${id}/receive.`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal: `Handle the response — success reloads the parent's data, failure (already received) shows the real error.

After the receive request resolves, call onReceive() to tell the parent to reload everything, or surface the real error message when the API rejects the request.

WHAT YOUR LOGIC NEEDS
- Check res.ok after the fetch resolves.
- On success, call the onReceive() prop so the parent refetches items/orders/reports.
- On failure, read the real error body and show it (e.g. via alert or inline state) instead of failing silently.

Your task: after fetch resolves, call onReceive() if res.ok; otherwise parse the JSON error body and surface it to the user.`,
    hint: `1. Capture the response: const res = await fetch(...).
2. Branch on res.ok: if (res.ok) { onReceive(); } else { const body = await res.json(); alert(body.error); }
3. Keep the fetch call itself unchanged — only what happens after it resolves is new.`,
    example_code: `async function handleReceive(id: string) {
  const res = await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
  if (res.ok) {
    onReceive();
  } else {
    const body = await res.json();
    alert(body.error || "Could not receive this order.");
  }
}`,
    think_prompt: `A real API can genuinely fail — someone else already received this exact order a second ago, and the server correctly says 409. Silently doing nothing on failure would leave staff clicking a dead button with no idea why. What has to happen in each of the two outcomes?`,
    mc_options: [
      "check res.ok: call onReceive() on success, read and show the real error body on failure",
      "always call onReceive(), whether or not the request actually succeeded",
      "ignore the response entirely once the fetch call is made",
    ],
    mc_correct_option: "check res.ok: call onReceive() on success, read and show the real error body on failure",
    mc_anchor: "check res.ok: call onReceive() on success",
    why_this_matters: `Refreshing on success keeps every panel on screen in sync with what the ledger actually did; surfacing a real failure keeps staff from believing an order was received when it wasn't.`,
    answer_keywords: ["res.ok", "onReceive", "alert", "body.error", "json"],
    seed_code: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  async function handleReceive(id: string) {
    await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
  }

  return (
    <div>
      <h3>Purchase Orders</h3>
      {orders.length === 0 ? (
        <p>No purchase orders yet.</p>
      ) : (
        orders.map((po) => (
          <div key={po.id} className="flex justify-between p-2 border-b">
            <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
            {po.status !== "RECEIVED" && (
              <button onClick={() => handleReceive(po.id)} className="bg-blue-600 text-white px-3 py-1 rounded">
                Receive Goods
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    starter_code: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  async function handleReceive(id: string) {
    const res = await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
    // handle res.ok / error here
  }

  return (
    <div>
      <h3>Purchase Orders</h3>
      {orders.length === 0 ? (
        <p>No purchase orders yet.</p>
      ) : (
        orders.map((po) => (
          <div key={po.id} className="flex justify-between p-2 border-b">
            <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
            {po.status !== "RECEIVED" && (
              <button onClick={() => handleReceive(po.id)} className="bg-blue-600 text-white px-3 py-1 rounded">
                Receive Goods
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    feedback_correct: "Correct — a real success reloads everything, and a real failure is never silent.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Branch on res.ok — call onReceive() only on success, and show the real error body on failure.",
    pre_check_hint: `res.ok tells you whether the server actually accepted the request. On success, tell the parent to reload (onReceive()); on failure, read the JSON body's error field and show it.`,
    expected: `export type PurchaseOrder = {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: string;
};

type ProcurementPanelProps = {
  orders: PurchaseOrder[];
  onReceive: () => void;
};

export function ProcurementPanel({ orders, onReceive }: ProcurementPanelProps) {
  async function handleReceive(id: string) {
    const res = await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
    if (res.ok) {
      onReceive();
    } else {
      const body = await res.json();
      alert(body.error || "Could not receive this order.");
    }
  }

  return (
    <div>
      <h3>Purchase Orders</h3>
      {orders.length === 0 ? (
        <p>No purchase orders yet.</p>
      ) : (
        orders.map((po) => (
          <div key={po.id} className="flex justify-between p-2 border-b">
            <span>{po.poNumber} - \${po.totalAmount.toFixed(2)} ({po.status})</span>
            {po.status !== "RECEIVED" && (
              <button onClick={() => handleReceive(po.id)} className="bg-blue-600 text-white px-3 py-1 rounded">
                Receive Goods
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
`,
    analog_example: `async function handleReceive(id: string) {
  const res = await fetch(\`/api/po/\${id}/receive\`, { method: "POST" });
  if (res.ok) {
    onReceive();
  } else {
    const body = await res.json();
    alert(body.error || "Could not receive this order.");
  }
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Refreshing on success keeps every panel on screen in sync with what the ledger actually did; surfacing a real failure keeps staff from believing an order was received when it wasn't.`,
      pain: "Ignoring the response leaves staff clicking a button that looks like it worked, even on a real 409 rejection.",
      mentalModel: MENTAL_MODEL,
      discover: `if (res.ok) {
  onReceive();
} else {
  const body = await res.json();
  alert(body.error);
}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not assume every fetch succeeds — always branch on res.ok.",
      dryRun: "Handle success/failure the same way for a different action button.",
      build: `1. Capture res.\n2. if (res.ok) onReceive().\n3. else read + show body.error.`,
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
  title: "Procurement panel: purchase orders + receiving",
  shortName: "Procurement",
});
