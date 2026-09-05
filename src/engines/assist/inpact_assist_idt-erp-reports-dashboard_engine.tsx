import createINPACTEngine from "../inpact_engine_shared";

export const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "idt-erp-reports-dashboard",
      title: "Financial reporting dashboard",
      body: `Build the dashboard that pulls real numbers straight from the real general ledger:

  Trial balance    →  every account's real debits and credits — must tie out to the penny
  Income statement →  real revenue, cost of goods sold, and net income
  Fetch            →  two real reports, live from the real Mini ERP API
  Render           →  numbers a business owner could actually act on
`,
      usecase: "The backend computes both reports straight from posted ledger lines — never a separately-tracked balance that could drift. This task is frontend only, against real endpoints.",
      designMock: {"kind":"list-and-form","screenTitle":"Reports","caption":"This is the screen you are building — real trial balance rows and a real income statement, both computed from posted ledger entries.","listCaption":"TRIAL BALANCE — every account, live from the API","emptyCaption":"EMPTY — while the reports are loading","emptyMessage":"Loading reports…","rows":[{"title":"1000 Cash","subtitle":"Debit $4,200.00","meta":"balance $4,200.00"},{"title":"4000 Revenue","subtitle":"Credit $1,250.00","meta":"balance -$1,250.00"}],"fields":[{"label":"Net income","sample":"$312.50"}],"submitLabel":"Refresh","formMode":"filter"},
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Model the trial balance and income statement shapes, then set up the component around them",
      "Store both reports in React state",
      "Fetch the real trial balance and income statement from the Mini ERP API when the component mounts",
      "Render the trial balance as a real table, including whether it's balanced",
      "Render the income statement's revenue, expense, and net income",
    ],
  },
  {
    // Redesign: merges the old "create the file" + "empty shell" scaffolding steps into the real
    // data-modeling step — neither was a move in this task's actual algorithm on its own.
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: `Model the trial balance and income statement shapes, then set up the component around them

MOCK DATA
  Row:              { code: "1000", name: "Cash", type: "ASSET", debit: "4200.00", credit: "0.00", balance: "4200.00" }
  Trial balance:    { rows: [...], totalDebits: "4200.00", totalCredits: "4200.00", balanced: true }
  Income statement: { totalRevenue: "1250.00", totalExpense: "937.50", netIncome: "312.50" }

Every dollar figure here is a string, same reason as the inventory table's price fields — Prisma's exact decimal type serializes to JSON as a string so no precision is silently lost.

Your task: write \`type TrialBalanceRow\` (code, name, type, debit, credit, balance — all string), \`type TrialBalance\` (rows: TrialBalanceRow[], totalDebits, totalCredits — string, balanced — boolean), and \`type IncomeStatement\` (totalRevenue, totalExpense, netIncome — all string), then define and export ReportsDashboard as a function component returning <div /> — every step from here on edits this same file.`,
    hint: `type TrialBalanceRow = { code: string; name: string; type: string; debit: string; credit: string; balance: string; };\ntype TrialBalance = { rows: TrialBalanceRow[]; totalDebits: string; totalCredits: string; balanced: boolean; };\ntype IncomeStatement = { totalRevenue: string; totalExpense: string; netIncome: string; };\n\nexport function ReportsDashboard() {\n  return <div />;\n}`,
    example_code: `export type Item = {\n  id: string;\n  sku: string;\n  name: string;\n  costPrice: string;\n  sellingPrice: string;\n  stockOnHand: number;\n};\n\nexport function InventoryTable() {\n  return <div />;\n}`,
    think_prompt: `Same lesson as the inventory table's costPrice/sellingPrice fields, applied to every dollar figure a real accounting report produces — each one arrives as a string, never a number, because it's an exact decimal underneath. What's the one field in TrialBalance that genuinely is a boolean, not a string, and what does the component that will hold both reports need to be called?`,
    mc_options: ["All dollar figures as string, balanced as boolean, rows as TrialBalanceRow[], then export function ReportsDashboard() returning <div />", "All numeric-looking fields as number since they're dollar amounts", "One shared type reused for both reports"],
    mc_correct_option: "All dollar figures as string, balanced as boolean, rows as TrialBalanceRow[], then export function ReportsDashboard() returning <div />",
    mc_anchor: "All dollar figures as string, balanced",
    why_this_matters: `Getting a decimal field's type wrong here means TypeScript can't catch an accidental sum of two price strings that silently concatenates instead of adding — exactly the class of bug a real accounting screen cannot afford. Naming and exporting the component next to them is what lets both real report fetches attach to something real.`,
    answer_keywords: ["type", "TrialBalanceRow", "TrialBalance", "IncomeStatement", "balanced", "boolean", "string", "export", "function", "ReportsDashboard"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — every dollar figure stays a string, balanced stays a real boolean, and the component both exist now.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Every dollar amount is a string here, matching exactly what the real API sends — only balanced is a boolean — then the component shell that will use them.",
    pre_check_hint: `The real GET /api/reports/trial-balance and GET /api/reports/income-statement responses send every dollar figure as a string (Prisma Decimal serialized to JSON) — only \`balanced\` is a genuine boolean. The component just needs to exist before it can render anything.`,
    expected: `export type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  return <div />;\n}\n`,
    analog_example: `export type Item = {\n  id: string;\n  sku: string;\n  name: string;\n  costPrice: string;\n  sellingPrice: string;\n  stockOnHand: number;\n};\n\nexport function InventoryTable() {\n  return <div />;\n}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `An accounting report is the one place a "close enough" numeric type is genuinely unacceptable — typing every dollar figure as the string the real API actually sends is what makes this dashboard trustworthy instead of quietly wrong. Pairing that with the component's own shell in the same step turns this from "a types file" into a real, mergeable start on the actual screen.`,
      pain: "Typing a decimal string as number invites silent precision bugs the type system should have caught.",
      mentalModel: `Build the dashboard that pulls real numbers straight from the real general ledger.`,
      discover: `export type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport function ReportsDashboard() {\n  return <div />;\n}`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not type balanced as a string — it's the one genuinely boolean field in either report.",
      dryRun: "Write the same string-typed-decimal-plus-shell pattern for a different real financial report.",
      build: `TrialBalanceRow (all string), TrialBalance (rows + string totals + boolean balanced), IncomeStatement (all string).\n\nexport function ReportsDashboard() { return <div />; }`,
    },
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: `Store both reports in React state

Your task: hold trialBalance (TrialBalance | null) and incomeStatement (IncomeStatement | null) in useState, both starting null.`,
    hint: `const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\nconst [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);`,
    example_code: `const [items, setItems] = useState<Item[]>([]);`,
    think_prompt: `Unlike the inventory table's list (which starts as an empty array), each report here is a single object that simply doesn't exist yet before the fetch resolves. What's the honest starting value for something that isn't a list and isn't loaded yet?`,
    mc_options: ["const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null); const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);", "Start both as empty objects ({} as TrialBalance) to avoid the null check", "Use one shared useState holding both reports as a single merged object"],
    mc_correct_option: "const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null); const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);",
    mc_anchor: "const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null)",
    why_this_matters: `null honestly represents "not loaded yet" — an empty fake object would let rendering code silently show zeroes instead of a real loading state.`,
    answer_keywords: ["useState", "trialBalance", "incomeStatement", "null", "TrialBalance", "IncomeStatement"],
    seed_code: `import { useState } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  return <div />;\n}\n`,
    starter_code: `import { useState } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  // state here\n  return <div />;\n}\n`,
    feedback_correct: "Correct — null honestly means the report hasn't arrived yet.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Both reports start as null, not an empty array or a fake zeroed object.",
    pre_check_hint: `A single report object that doesn't exist yet is different from an empty list — null is the honest starting value, and the type union (TrialBalance | null) is what makes TypeScript force you to check before reading it.`,
    expected: `import { useState } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n  return <div />;\n}\n`,
    analog_example: `const [items, setItems] = useState<Item[]>([]);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `null | T is TypeScript refusing to let you read totalDebits off a report that might not exist yet — the type system forces the same loading check a real user needs to see anyway.`,
      pain: "A fake zeroed starting object lets a still-loading dashboard render as if the business had zero revenue.",
      mentalModel: `Build the dashboard that pulls real numbers straight from the real general ledger.`,
      discover: `const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not default a not-yet-loaded single object to an empty object literal — null is the honest signal.",
      dryRun: "Declare the same null-starting single-object state for a different real report.",
      build: `Two useState calls, each typed as \`T | null\`, both starting null.`,
    },
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: `Fetch the real trial balance and income statement from the Mini ERP API when the component mounts

Your task: inside a useEffect that runs once on mount, fetch("http://localhost:4100/api/reports/trial-balance") and fetch("http://localhost:4100/api/reports/income-statement"), read each response's \`data\`, and store them with setTrialBalance and setIncomeStatement.`,
    hint: `useEffect(() => {\n  fetch("http://localhost:4100/api/reports/trial-balance").then((r) => r.json()).then((b) => setTrialBalance(b.data));\n  fetch("http://localhost:4100/api/reports/income-statement").then((r) => r.json()).then((b) => setIncomeStatement(b.data));\n}, []);`,
    example_code: `useEffect(() => {\n  fetch("http://localhost:4100/api/customers")\n    .then((res) => res.json())\n    .then((body) => setCustomers(body.data));\n}, []);`,
    think_prompt: `Same fetch-on-mount pattern you've now used across every task in this product, aimed at two real report endpoints. What does firing both on mount look like here?`,
    mc_options: ["useEffect(() => { fetch(trialBalanceUrl).then(r=>r.json()).then(b=>setTrialBalance(b.data)); fetch(incomeStatementUrl).then(r=>r.json()).then(b=>setIncomeStatement(b.data)); }, [])", "Fetch both reports inside a Refresh button's onClick only, never on mount", "Call both fetches directly in the component body outside any effect"],
    mc_correct_option: "useEffect(() => { fetch(trialBalanceUrl).then(r=>r.json()).then(b=>setTrialBalance(b.data)); fetch(incomeStatementUrl).then(r=>r.json()).then(b=>setIncomeStatement(b.data)); }, [])",
    mc_anchor: "useEffect(() => { fetch(trialBalanceUrl)",
    why_this_matters: `A business owner opening this dashboard should see real numbers immediately, not after an extra click — mount-time fetch is what makes that true.`,
    answer_keywords: ["useEffect", "fetch", "trial-balance", "income-statement", "setTrialBalance", "setIncomeStatement"],
    seed_code: `import { useState } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n  return <div />;\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n  // fetch both reports here\n  return <div />;\n}\n`,
    feedback_correct: "Correct — both real reports now load on mount.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Both fetches belong inside one useEffect with an empty dependency array, each feeding its own setter via .then().",
    pre_check_hint: `Same dual-fetch shape you've used before — two independent fetch().then().then() chains inside one mount-once effect.`,
    expected: `import { useState, useEffect } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/reports/trial-balance")\n      .then((res) => res.json())\n      .then((body) => setTrialBalance(body.data));\n    fetch("http://localhost:4100/api/reports/income-statement")\n      .then((res) => res.json())\n      .then((body) => setIncomeStatement(body.data));\n  }, []);\n\n  return <div />;\n}\n`,
    analog_example: `useEffect(() => {\n  fetch("http://localhost:4100/api/customers")\n    .then((res) => res.json())\n    .then((body) => setCustomers(body.data));\n}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `By the fourth task using this same pattern, the real lesson isn't fetch-on-mount anymore — it's recognizing that almost every real screen in a real product boils down to this same three-move shape.`,
      pain: "Fetching only on a manual refresh means the dashboard opens empty by default.",
      mentalModel: `Build the dashboard that pulls real numbers straight from the real general ledger.`,
      discover: `fetch("http://localhost:4100/api/reports/trial-balance").then((r) => r.json()).then((b) => setTrialBalance(b.data));`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not nest the second fetch inside the first's .then() — they don't depend on each other.",
      dryRun: "Fetch two independent real reports on mount for a different dashboard.",
      build: `Two independent fetch().then().then() chains inside one useEffect(() => {...}, []).`,
    },
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: `Render the trial balance as a real table, plus the income statement's revenue, expense, and net income

Your task: show a loading message while either report is null. Once both exist, render a real <table> from trialBalance.rows (columns: code, name, debit, credit, balance) with a line showing whether it's balanced (trialBalance.balanced), and below it show incomeStatement's totalRevenue, totalExpense, and netIncome.`,
    hint: `if (!trialBalance || !incomeStatement) return <p>Loading…</p>;\nreturn (\n  <div>\n    <table>\n      <thead><tr><th>Code</th><th>Name</th><th>Debit</th><th>Credit</th><th>Balance</th></tr></thead>\n      <tbody>\n        {trialBalance.rows.map((row) => (\n          <tr key={row.code}>\n            <td>{row.code}</td><td>{row.name}</td><td>{row.debit}</td><td>{row.credit}</td><td>{row.balance}</td>\n          </tr>\n        ))}\n      </tbody>\n    </table>\n    <p>{trialBalance.balanced ? "Balanced" : "NOT balanced"}</p>\n    <p>Revenue: {incomeStatement.totalRevenue}</p>\n    <p>Expense: {incomeStatement.totalExpense}</p>\n    <p>Net income: {incomeStatement.netIncome}</p>\n  </div>\n);`,
    example_code: `loading ? <p>Loading…</p> : items.length === 0 ? <p>No items found.</p> : <table>...</table>`,
    think_prompt: `Two reports, two different reasons to still be "loading": either one being null means neither is ready to trust yet. Once both are real, what has to appear on screen for someone to actually judge the business's health — including the one flag that would tell them if the books themselves are wrong?`,
    mc_options: ["Check both reports for null first, then render a real table from trialBalance.rows plus its balanced flag and incomeStatement's three totals", "Render the table as soon as trialBalance exists, ignoring whether incomeStatement has loaded", "Skip the balanced flag — a trial balance is always balanced by definition"],
    mc_correct_option: "Check both reports for null first, then render a real table from trialBalance.rows plus its balanced flag and incomeStatement's three totals",
    mc_anchor: "Check both reports for null first",
    why_this_matters: `A trial balance that doesn't tie out is a real accounting error, not a hypothetical — surfacing \`balanced\` on screen is what makes this dashboard trustworthy rather than merely decorative.`,
    answer_keywords: ["trialBalance", "incomeStatement", "balanced", "rows", "totalRevenue", "totalExpense", "netIncome", "null"],
    seed_code: `import { useState, useEffect } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/reports/trial-balance")\n      .then((res) => res.json())\n      .then((body) => setTrialBalance(body.data));\n    fetch("http://localhost:4100/api/reports/income-statement")\n      .then((res) => res.json())\n      .then((body) => setIncomeStatement(body.data));\n  }, []);\n\n  return <div />;\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/reports/trial-balance")\n      .then((res) => res.json())\n      .then((body) => setTrialBalance(body.data));\n    fetch("http://localhost:4100/api/reports/income-statement")\n      .then((res) => res.json())\n      .then((body) => setIncomeStatement(body.data));\n  }, []);\n\n  // loading check, then table + balanced flag + income statement here\n\n  return <div />;\n}\n`,
    feedback_correct: "Correct — the dashboard is done.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Check both reports for null first, then draw the table from trialBalance.rows plus the balanced flag and the income statement's three totals.",
    pre_check_hint: `Two nullable pieces of state means two things to check before rendering the real content — once both exist, trialBalance.rows maps straight onto table rows, and the three income statement fields are already computed, just waiting to be shown.`,
    expected: `import { useState, useEffect } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/reports/trial-balance")\n      .then((res) => res.json())\n      .then((body) => setTrialBalance(body.data));\n    fetch("http://localhost:4100/api/reports/income-statement")\n      .then((res) => res.json())\n      .then((body) => setIncomeStatement(body.data));\n  }, []);\n\n  if (!trialBalance || !incomeStatement) return <p>Loading…</p>;\n\n  return (\n    <div>\n      <table>\n        <thead>\n          <tr>\n            <th>Code</th>\n            <th>Name</th>\n            <th>Debit</th>\n            <th>Credit</th>\n            <th>Balance</th>\n          </tr>\n        </thead>\n        <tbody>\n          {trialBalance.rows.map((row) => (\n            <tr key={row.code}>\n              <td>{row.code}</td>\n              <td>{row.name}</td>\n              <td>{row.debit}</td>\n              <td>{row.credit}</td>\n              <td>{row.balance}</td>\n            </tr>\n          ))}\n        </tbody>\n      </table>\n      <p>{trialBalance.balanced ? "Balanced" : "NOT balanced"}</p>\n      <p>Revenue: {incomeStatement.totalRevenue}</p>\n      <p>Expense: {incomeStatement.totalExpense}</p>\n      <p>Net income: {incomeStatement.netIncome}</p>\n    </div>\n  );\n}\n`,
    analog_example: `guests.length === 0 ? <p>No names yet.</p> : <table>...</table>`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Every number on this screen traces straight back to a real posted ledger line — nothing here is a spreadsheet someone updates by hand, which is the entire premise of Mini ERP replacing an expensive enterprise system.`,
      pain: "A dashboard that hides the balanced flag looks fine right up until the books genuinely don't tie out.",
      mentalModel: `Build the dashboard that pulls real numbers straight from the real general ledger.`,
      discover: `<p>{trialBalance.balanced ? "Balanced" : "NOT balanced"}</p>`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not render the table before checking both reports are non-null — trialBalance.rows would throw on a null trialBalance.",
      dryRun: "Render the same two-report, null-checked dashboard shape for a different pair of real reports.",
      build: `Loading check on both reports, then a real table from trialBalance.rows plus balanced, totalRevenue, totalExpense, netIncome.`,
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
  title: "Financial reporting dashboard",
  shortName: "Reports dashboard",
});
