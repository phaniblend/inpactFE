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
    items: ["Create data blueprints for trial balance lines and income statement summaries, setting up the dashboard grid.","Set up state slots to hold the trial balance entries and income statement figures.","Request the official trial balance and income statement reports from the API when the dashboard mounts.","Render the trial balance table with a visual badge confirming that debits equal credits.","Display the income statement cards showing total revenue, total costs, and final net profit."],
  },
  {
    // Redesign: merges the old "create the file" + "empty shell" scaffolding steps into the real
    // data-modeling step — neither was a move in this task's actual algorithm on its own.
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

This file doesn't exist yet — you're the first to touch it. Create it at \`src/components/ReportsDashboard.tsx\` before anything else. Every step from here on edits that same file.

Create data blueprints for trial balance lines and income statement summaries, setting up the dashboard grid.

WHAT YOU'LL NEED
- TrialBalanceLine type (account, debit, credit)
- IncomeStatement type (revenue, expenses, netIncome)

Your task: Define blueprints for trial balance records and income statement summaries, then build the dashboard shell.`,
    hint: `1. Balance blueprint: Create a type with account name and numeric debit/credit fields.
2. Statement blueprint: Create a type with numeric revenue, expenses, and netIncome fields.
3. Shell component: Initialize the container returning <div />.`,
    example_code: `export type BalanceLine = { account: string; debit: number; credit: number };
export type Statement = { revenue: number; expenses: number; netIncome: number };

export function FinancialDashboard() {
  return <div />;
}`,
    think_prompt: `Same lesson as the inventory table's costPrice/sellingPrice fields, applied to every dollar figure a real accounting report produces — each one arrives as a string, never a number, because it's an exact decimal underneath. What's the one field in TrialBalance that genuinely is a boolean, not a string, and what does the component that will hold both reports need to be called?`,
    mc_options: ["All dollar figures as string, balanced as boolean, rows as TrialBalanceRow[], then export function ReportsDashboard() returning <div />", "All numeric-looking fields as number since they're dollar amounts", "One shared type reused for both reports"],
    mc_correct_option: "All dollar figures as string, balanced as boolean, rows as TrialBalanceRow[], then export function ReportsDashboard() returning <div />",
    mc_anchor: "All dollar figures as string, balanced",
    why_this_matters: `Strict numeric types prevent formatting bugs when computing financial totals.`,
    answer_keywords: ["type", "TrialBalanceRow", "TrialBalance", "IncomeStatement", "balanced", "boolean", "string", "export", "function", "ReportsDashboard"],
    seed_code: ``,
    starter_code: ``,
    feedback_correct: "Correct — every dollar figure stays a string, balanced stays a real boolean, and the component both exist now.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Every dollar amount is a string here, matching exactly what the real API sends — only balanced is a boolean — then the component shell that will use them.",
    pre_check_hint: `The real GET /api/reports/trial-balance and GET /api/reports/income-statement responses send every dollar figure as a string (Prisma Decimal serialized to JSON) — only \`balanced\` is a genuine boolean. The component just needs to exist before it can render anything.`,
    expected: `export type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  return <div />;\n}\n`,
    analog_example: `export type BalanceLine = { account: string; debit: number; credit: number };
export type Statement = { revenue: number; expenses: number; netIncome: number };

export function FinancialDashboard() {
  return <div />;
}`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Strict numeric types prevent formatting bugs when computing financial totals.`,
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
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Set up state slots to hold the trial balance entries and income statement figures.

WHAT YOU'LL NEED
- State for the trial balance array.
- State for the income statement object (or null initially).

Your task: Create state hooks to hold the trial balance list and income statement data.`,
    hint: `1. Array state: Initialize balance lines with useState<TrialBalanceLine[]>([]).
2. Object state: Initialize statement summary with useState<IncomeStatement | null>(null).`,
    example_code: `const [balanceSheet, setBalanceSheet] = useState<BalanceLine[]>([]);
const [statement, setStatement] = useState<Statement | null>(null);`,
    think_prompt: `Unlike the inventory table's list (which starts as an empty array), each report here is a single object that simply doesn't exist yet before the fetch resolves. What's the honest starting value for something that isn't a list and isn't loaded yet?`,
    mc_options: ["const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null); const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);", "Start both as empty objects ({} as TrialBalance) to avoid the null check", "Use one shared useState holding both reports as a single merged object"],
    mc_correct_option: "const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null); const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);",
    mc_anchor: "const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null)",
    why_this_matters: `Using null for uninitialized objects lets you render clean loading indicators until data arrives.`,
    answer_keywords: ["useState", "trialBalance", "incomeStatement", "null", "TrialBalance", "IncomeStatement"],
    seed_code: `import { useState } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  return <div />;\n}\n`,
    starter_code: `import { useState } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  // state here\n  return <div />;\n}\n`,
    feedback_correct: "Correct — null honestly means the report hasn't arrived yet.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Both reports start as null, not an empty array or a fake zeroed object.",
    pre_check_hint: `A single report object that doesn't exist yet is different from an empty list — null is the honest starting value, and the type union (TrialBalance | null) is what makes TypeScript force you to check before reading it.`,
    expected: `import { useState } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n  return <div />;\n}\n`,
    analog_example: `const [balanceSheet, setBalanceSheet] = useState<BalanceLine[]>([]);
const [statement, setStatement] = useState<Statement | null>(null);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Using null for uninitialized objects lets you render clean loading indicators until data arrives.`,
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
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Request the official trial balance and income statement reports from the API when the dashboard mounts.

WHAT YOU'LL NEED
- useEffect with [] dependency.
- Parallel fetch calls for trial balance and income statement.

Your task: Fetch financial statements from the server on page mount.`,
    hint: `1. Mount hook: Set up useEffect with [].
2. Fetch endpoints: Target your reporting endpoints using Promise.all.
3. Store responses: Save results into your respective state setters.`,
    example_code: `useEffect(() => {
  Promise.all([
    fetch("/api/reports/trial-balance").then((r) => r.json()),
    fetch("/api/reports/income-statement").then((r) => r.json()),
  ]).then(([balanceData, statementData]) => {
    setBalanceSheet(balanceData);
    setStatement(statementData);
  });
}, []);`,
    think_prompt: `Same fetch-on-mount pattern you've now used across every task in this product, aimed at two real report endpoints. What does firing both on mount look like here?`,
    mc_options: ["useEffect(() => { fetch(trialBalanceUrl).then(r=>r.json()).then(b=>setTrialBalance(b.data)); fetch(incomeStatementUrl).then(r=>r.json()).then(b=>setIncomeStatement(b.data)); }, [])", "Fetch both reports inside a Refresh button's onClick only, never on mount", "Call both fetches directly in the component body outside any effect"],
    mc_correct_option: "useEffect(() => { fetch(trialBalanceUrl).then(r=>r.json()).then(b=>setTrialBalance(b.data)); fetch(incomeStatementUrl).then(r=>r.json()).then(b=>setIncomeStatement(b.data)); }, [])",
    mc_anchor: "useEffect(() => { fetch(trialBalanceUrl)",
    why_this_matters: `Loading financial data together avoids layout shifting while reports render.`,
    answer_keywords: ["useEffect", "fetch", "trial-balance", "income-statement", "setTrialBalance", "setIncomeStatement"],
    seed_code: `import { useState } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n  return <div />;\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n  // fetch both reports here\n  return <div />;\n}\n`,
    feedback_correct: "Correct — both real reports now load on mount.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Both fetches belong inside one useEffect with an empty dependency array, each feeding its own setter via .then().",
    pre_check_hint: `Same dual-fetch shape you've used before — two independent fetch().then().then() chains inside one mount-once effect.`,
    expected: `import { useState, useEffect } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/reports/trial-balance")\n      .then((res) => res.json())\n      .then((body) => setTrialBalance(body.data));\n    fetch("http://localhost:4100/api/reports/income-statement")\n      .then((res) => res.json())\n      .then((body) => setIncomeStatement(body.data));\n  }, []);\n\n  return <div />;\n}\n`,
    analog_example: `useEffect(() => {
  Promise.all([
    fetch("/api/reports/trial-balance").then((r) => r.json()),
    fetch("/api/reports/income-statement").then((r) => r.json()),
  ]).then(([balanceData, statementData]) => {
    setBalanceSheet(balanceData);
    setStatement(statementData);
  });
}, []);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Loading financial data together avoids layout shifting while reports render.`,
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
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Render the trial balance table with a visual badge confirming that debits equal credits.

WHAT YOU'LL NEED
- Calculations summing debits and credits.
- Equality check determining balance status.
- Table rendering account lines.

Your task: Render the trial balance rows in a table and display an indicator showing whether debits equal credits.`,
    hint: `1. Calculate totals: Use .reduce() to sum debit and credit columns.
2. Check balance: Compare totals (totalDebit === totalCredit).
3. Display badge: Render "Balanced" or "Out of Balance" based on the comparison.
4. Render rows: Map through lines to output table rows.`,
    example_code: `const totalDebit = balanceSheet.reduce((sum, row) => sum + row.debit, 0);
const totalCredit = balanceSheet.reduce((sum, row) => sum + row.credit, 0);
const isBalanced = totalDebit === totalCredit;

return (
  <div>
    <div>Status: {isBalanced ? "Balanced" : "Out of Balance"}</div>
    <table>
      {balanceSheet.map((r, i) => (
        <tr key={i}>
          <td>{r.account}</td>
          <td>{r.debit}</td>
          <td>{r.credit}</td>
        </tr>
      ))}
    </table>
  </div>
);`,
    think_prompt: `Two reports, two different reasons to still be "loading": either one being null means neither is ready to trust yet. Once both are real, what has to appear on screen for the trial balance half — including the one flag that would tell someone if the books themselves are wrong?`,
    mc_options: ["Check both reports for null first, then render a real table from trialBalance.rows plus its balanced flag", "Render the table as soon as trialBalance exists, ignoring whether incomeStatement has loaded", "Skip the balanced flag — a trial balance is always balanced by definition"],
    mc_correct_option: "Check both reports for null first, then render a real table from trialBalance.rows plus its balanced flag",
    mc_anchor: "Check both reports for null first",
    why_this_matters: `A clear balanced indicator provides instant verification of accounting integrity.`,
    answer_keywords: ["trialBalance", "incomeStatement", "balanced", "rows", "null"],
    seed_code: `import { useState, useEffect } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/reports/trial-balance")\n      .then((res) => res.json())\n      .then((body) => setTrialBalance(body.data));\n    fetch("http://localhost:4100/api/reports/income-statement")\n      .then((res) => res.json())\n      .then((body) => setIncomeStatement(body.data));\n  }, []);\n\n  return <div />;\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/reports/trial-balance")\n      .then((res) => res.json())\n      .then((body) => setTrialBalance(body.data));\n    fetch("http://localhost:4100/api/reports/income-statement")\n      .then((res) => res.json())\n      .then((body) => setIncomeStatement(body.data));\n  }, []);\n\n  // loading check, then trial balance table + balanced flag here\n\n  return <div />;\n}\n`,
    feedback_correct: "Correct — the trial balance half of the dashboard is real.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Check both reports for null first, then draw the table from trialBalance.rows plus the balanced flag.",
    pre_check_hint: `Two nullable pieces of state means two things to check before rendering the real content — once both exist, trialBalance.rows maps straight onto table rows.`,
    expected: `import { useState, useEffect } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/reports/trial-balance")\n      .then((res) => res.json())\n      .then((body) => setTrialBalance(body.data));\n    fetch("http://localhost:4100/api/reports/income-statement")\n      .then((res) => res.json())\n      .then((body) => setIncomeStatement(body.data));\n  }, []);\n\n  if (!trialBalance || !incomeStatement) return <p>Loading…</p>;\n\n  return (\n    <div>\n      <table>\n        <thead>\n          <tr>\n            <th>Code</th>\n            <th>Name</th>\n            <th>Debit</th>\n            <th>Credit</th>\n            <th>Balance</th>\n          </tr>\n        </thead>\n        <tbody>\n          {trialBalance.rows.map((row) => (\n            <tr key={row.code}>\n              <td>{row.code}</td>\n              <td>{row.name}</td>\n              <td>{row.debit}</td>\n              <td>{row.credit}</td>\n              <td>{row.balance}</td>\n            </tr>\n          ))}\n        </tbody>\n      </table>\n      <p>{trialBalance.balanced ? "Balanced" : "NOT balanced"}</p>\n    </div>\n  );\n}\n`,
    analog_example: `const totalDebit = balanceSheet.reduce((sum, row) => sum + row.debit, 0);
const totalCredit = balanceSheet.reduce((sum, row) => sum + row.credit, 0);
const isBalanced = totalDebit === totalCredit;

return (
  <div>
    <div>Status: {isBalanced ? "Balanced" : "Out of Balance"}</div>
    <table>
      {balanceSheet.map((r, i) => (
        <tr key={i}>
          <td>{r.account}</td>
          <td>{r.debit}</td>
          <td>{r.credit}</td>
        </tr>
      ))}
    </table>
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `A clear balanced indicator provides instant verification of accounting integrity.`,
      pain: "A dashboard that hides the balanced flag looks fine right up until the books genuinely don't tie out.",
      mentalModel: `Build the dashboard that pulls real numbers straight from the real general ledger.`,
      discover: `<p>{trialBalance.balanced ? "Balanced" : "NOT balanced"}</p>`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not render the table before checking both reports are non-null — trialBalance.rows would throw on a null trialBalance.",
      dryRun: "Render the same two-report, null-checked table for a different real report.",
      build: `Loading check on both reports, then a real table from trialBalance.rows plus balanced.`,
    },
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: `You're writing this in TypeScript + React — a \`.tsx\` file (TypeScript types alongside JSX markup).

Display the income statement cards showing total revenue, total costs, and final net profit.

WHAT YOU'LL NEED
- Null-check guard while statement data loads.
- Card display presenting revenue, expenses, and calculated net income.

Your task: Display income statement summary metrics on screen.`,
    hint: `1. Guard render: Return a loading message if your statement state is null.
2. Render metrics: Display revenue, expense, and netIncome values clearly inside cards or paragraphs.`,
    example_code: `if (!statement) return <p>Loading statement...</p>;

return (
  <div>
    <h3>Income Statement</h3>
    <p>Revenue: \${statement.revenue}</p>
    <p>Expenses: \${statement.expenses}</p>
    <p>Net Income: \${statement.netIncome}</p>
  </div>
);`,
    think_prompt: `Both reports are already loaded and null-checked by this point — the income statement's three fields are already computed by the server, just waiting to be shown. What has to appear for someone to read the business's bottom line at a glance?`,
    mc_options: ["Render incomeStatement's totalRevenue, totalExpense, and netIncome as plain text", "Recompute revenue minus expense on the client instead of using netIncome", "Only show netIncome and drop the other two figures"],
    mc_correct_option: "Render incomeStatement's totalRevenue, totalExpense, and netIncome as plain text",
    mc_anchor: "Render incomeStatement's totalRevenue",
    why_this_matters: `Presenting high-level totals alongside detailed ledgers provides both summary and detailed views.


================================================================================`,
    answer_keywords: ["incomeStatement", "totalRevenue", "totalExpense", "netIncome"],
    seed_code: `import { useState, useEffect } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/reports/trial-balance")\n      .then((res) => res.json())\n      .then((body) => setTrialBalance(body.data));\n    fetch("http://localhost:4100/api/reports/income-statement")\n      .then((res) => res.json())\n      .then((body) => setIncomeStatement(body.data));\n  }, []);\n\n  if (!trialBalance || !incomeStatement) return <p>Loading…</p>;\n\n  return (\n    <div>\n      <table>\n        <thead>\n          <tr>\n            <th>Code</th>\n            <th>Name</th>\n            <th>Debit</th>\n            <th>Credit</th>\n            <th>Balance</th>\n          </tr>\n        </thead>\n        <tbody>\n          {trialBalance.rows.map((row) => (\n            <tr key={row.code}>\n              <td>{row.code}</td>\n              <td>{row.name}</td>\n              <td>{row.debit}</td>\n              <td>{row.credit}</td>\n              <td>{row.balance}</td>\n            </tr>\n          ))}\n        </tbody>\n      </table>\n      <p>{trialBalance.balanced ? "Balanced" : "NOT balanced"}</p>\n    </div>\n  );\n}\n`,
    starter_code: `import { useState, useEffect } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/reports/trial-balance")\n      .then((res) => res.json())\n      .then((body) => setTrialBalance(body.data));\n    fetch("http://localhost:4100/api/reports/income-statement")\n      .then((res) => res.json())\n      .then((body) => setIncomeStatement(body.data));\n  }, []);\n\n  if (!trialBalance || !incomeStatement) return <p>Loading…</p>;\n\n  return (\n    <div>\n      <table>\n        <thead>\n          <tr>\n            <th>Code</th>\n            <th>Name</th>\n            <th>Debit</th>\n            <th>Credit</th>\n            <th>Balance</th>\n          </tr>\n        </thead>\n        <tbody>\n          {trialBalance.rows.map((row) => (\n            <tr key={row.code}>\n              <td>{row.code}</td>\n              <td>{row.name}</td>\n              <td>{row.debit}</td>\n              <td>{row.credit}</td>\n              <td>{row.balance}</td>\n            </tr>\n          ))}\n        </tbody>\n      </table>\n      <p>{trialBalance.balanced ? "Balanced" : "NOT balanced"}</p>\n      {/* income statement figures here */}\n    </div>\n  );\n}\n`,
    feedback_correct: "Correct — the dashboard is done.",
    feedback_partial: "Close — check the hint and try again.",
    feedback_wrong: "Render incomeStatement's totalRevenue, totalExpense, and netIncome, all already computed by the server.",
    pre_check_hint: `Both reports are already null-checked above this point — incomeStatement's three fields are plain strings ready to render as-is.`,
    expected: `import { useState, useEffect } from "react";\n\nexport type TrialBalanceRow = {\n  code: string;\n  name: string;\n  type: string;\n  debit: string;\n  credit: string;\n  balance: string;\n};\n\nexport type TrialBalance = {\n  rows: TrialBalanceRow[];\n  totalDebits: string;\n  totalCredits: string;\n  balanced: boolean;\n};\n\nexport type IncomeStatement = {\n  totalRevenue: string;\n  totalExpense: string;\n  netIncome: string;\n};\n\nexport function ReportsDashboard() {\n  const [trialBalance, setTrialBalance] = useState<TrialBalance | null>(null);\n  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);\n\n  useEffect(() => {\n    fetch("http://localhost:4100/api/reports/trial-balance")\n      .then((res) => res.json())\n      .then((body) => setTrialBalance(body.data));\n    fetch("http://localhost:4100/api/reports/income-statement")\n      .then((res) => res.json())\n      .then((body) => setIncomeStatement(body.data));\n  }, []);\n\n  if (!trialBalance || !incomeStatement) return <p>Loading…</p>;\n\n  return (\n    <div>\n      <table>\n        <thead>\n          <tr>\n            <th>Code</th>\n            <th>Name</th>\n            <th>Debit</th>\n            <th>Credit</th>\n            <th>Balance</th>\n          </tr>\n        </thead>\n        <tbody>\n          {trialBalance.rows.map((row) => (\n            <tr key={row.code}>\n              <td>{row.code}</td>\n              <td>{row.name}</td>\n              <td>{row.debit}</td>\n              <td>{row.credit}</td>\n              <td>{row.balance}</td>\n            </tr>\n          ))}\n        </tbody>\n      </table>\n      <p>{trialBalance.balanced ? "Balanced" : "NOT balanced"}</p>\n      <p>Revenue: {incomeStatement.totalRevenue}</p>\n      <p>Expense: {incomeStatement.totalExpense}</p>\n      <p>Net income: {incomeStatement.netIncome}</p>\n    </div>\n  );\n}\n`,
    analog_example: `if (!statement) return <p>Loading statement...</p>;

return (
  <div>
    <h3>Income Statement</h3>
    <p>Revenue: \${statement.revenue}</p>
    <p>Expenses: \${statement.expenses}</p>
    <p>Net Income: \${statement.netIncome}</p>
  </div>
);`,
    deepDiveLabel: "Why this step matters",
    deepDive: {
      hook: `Presenting high-level totals alongside detailed ledgers provides both summary and detailed views.


================================================================================`,
      pain: "A dashboard that stops at the ledger table leaves the actual profit-or-loss question unanswered.",
      mentalModel: `Build the dashboard that pulls real numbers straight from the real general ledger.`,
      discover: `<p>Net income: {incomeStatement.netIncome}</p>`,
      quickRules: "- One skill per step\n- Name the skill, not the product noun\n- Example uses the same pattern",
      watchOut: "Do not recompute revenue minus expense on the client — netIncome is already the server's computed figure.",
      dryRun: "Render the same three-figure summary for a different real report.",
      build: `<p>Revenue: {incomeStatement.totalRevenue}</p>\n<p>Expense: {incomeStatement.totalExpense}</p>\n<p>Net income: {incomeStatement.netIncome}</p>`,
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
  title: "Financial reporting dashboard",
  shortName: "Reports dashboard",
});
