/**
 * Applies the same review-cycle rewrite used by write-smb-assist-engines.mjs onto the 4
 * hand-authored MiniERP engine files (they have no generator, so this does surgical text
 * replacement directly on the .tsx source instead of rebuilding the file from a template).
 *
 * For each step, replaces (leaving everything else byte-identical):
 *  - paal          -> catalog title + WHAT YOU'LL NEED bullets + "Your task: " + guide goal
 *  - hint          -> guide's numbered HOW TO MAP THE PATTERN steps
 *  - example_code  -> guide's LOOK AT THIS PATTERN (ANALOGY) block
 *  - why_this_matters -> guide's WHY THIS HELPS YOU paragraph
 *  - analog_example   -> same ANALOGY block (mirrors example_code, as buildEngine's output does)
 *  - deepDive.hook -> same WHY THIS HELPS YOU paragraph
 *
 * Run: node scripts/apply-review-content-minierp.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseAssistGuides, parseCatalog } from "./parse-review-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSIST_DIR = path.resolve(__dirname, "../src/engines/assist");

const LANGUAGE_LINE =
  "You're writing this in TypeScript + React — a `.tsx` file (TypeScript types alongside JSX markup).";

const FILES = [
  { file: "inpact_assist_idt-erp-inventory-table_engine.tsx", title: "Inventory master table", filePath: "src/components/InventoryTable.tsx" },
  { file: "inpact_assist_idt-erp-po-form_engine.tsx", title: "Purchase order form & receive modal", filePath: "src/components/PurchaseOrderForm.tsx" },
  { file: "inpact_assist_idt-erp-reports-dashboard_engine.tsx", title: "Financial reporting dashboard", filePath: "src/components/ReportsDashboard.tsx" },
  { file: "inpact_assist_idt-erp-so-pipeline_engine.tsx", title: "Sales order pipeline view", filePath: "src/components/SalesOrderPipeline.tsx" },
];

const guides = parseAssistGuides();
const catalog = parseCatalog();

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function buildTaskPanel(catalogText, guide, filePath, isFirstStep) {
  const needsBlock = guide.needs.length ? `\n\nWHAT YOU'LL NEED\n${guide.needs.map((n) => `- ${n}`).join("\n")}` : "";
  const createFileLine =
    isFirstStep && filePath
      ? `This file doesn't exist yet — you're the first to touch it. Create it at \`${filePath}\` before anything else. Every step from here on edits that same file.\n\n`
      : "";
  return `${LANGUAGE_LINE}\n\n${createFileLine}${catalogText}${needsBlock}\n\nYour task: ${guide.goal}`;
}

function replaceField(text, fieldName, endMarker, newValue) {
  const startMarker = `    ${fieldName}: \``;
  const startIdx = text.indexOf(startMarker);
  if (startIdx === -1) throw new Error(`field "${fieldName}" not found`);
  const contentStart = startIdx + startMarker.length;
  const endIdx = text.indexOf(endMarker, contentStart);
  if (endIdx === -1) throw new Error(`end marker for "${fieldName}" not found`);
  return text.slice(0, contentStart) + esc(newValue) + text.slice(endIdx);
}

// All deepDive.hook occurrences, in document order (one per step) — replaced back-to-front so
// earlier splice points are never invalidated by a length change from a later replacement.
function replaceAllDeepDiveHooks(text, newValuesInOrder) {
  const startMarker = "      hook: `";
  const endMarker = "`,\n      pain:";
  const occurrences = [];
  let searchFrom = 0;
  while (true) {
    const startIdx = text.indexOf(startMarker, searchFrom);
    if (startIdx === -1) break;
    const contentStart = startIdx + startMarker.length;
    const endIdx = text.indexOf(endMarker, contentStart);
    if (endIdx === -1) throw new Error("deepDive.hook end marker not found");
    occurrences.push({ contentStart, endIdx });
    searchFrom = endIdx + endMarker.length;
  }
  if (occurrences.length !== newValuesInOrder.length) {
    throw new Error(`deepDive.hook count mismatch: found ${occurrences.length}, expected ${newValuesInOrder.length}`);
  }
  for (let i = occurrences.length - 1; i >= 0; i--) {
    const { contentStart, endIdx } = occurrences[i];
    text = text.slice(0, contentStart) + esc(newValuesInOrder[i]) + text.slice(endIdx);
  }
  return text;
}

for (const { file, title, filePath: taskFilePath } of FILES) {
  const guideSteps = guides.get(title);
  const catalogSteps = catalog.get(title);
  if (!guideSteps || !catalogSteps) {
    console.error(`NO OVERRIDE for "${title}" — skipping ${file}`);
    continue;
  }
  const filePath = path.join(ASSIST_DIR, file);
  let text = fs.readFileSync(filePath, "utf8");

  // Objectives items array: replace with the catalog's step titles, in order.
  const objMatch = text.match(/(items:\s*)\[([\s\S]*?)\](,[\s\S]*?id: "step1")/);
  if (!objMatch) throw new Error(`${file}: objectives items array not found`);
  const newItems = JSON.stringify(catalogSteps);
  text = text.replace(objMatch[0], `${objMatch[1]}${newItems}${objMatch[3]}`);

  if (guideSteps.length !== catalogSteps.length) {
    throw new Error(`${file}: guide/catalog step count mismatch (${guideSteps.length} vs ${catalogSteps.length})`);
  }

  // Locate each step's start offset (id: "stepN") plus one past-the-end sentinel, so every
  // per-step edit below operates on a slice scoped to that one step — otherwise a field-name
  // search like "paal:" would always hit step 1's (already-rewritten) occurrence first.
  const n = guideSteps.length;
  const stepStarts = [];
  for (let i = 1; i <= n; i++) {
    const marker = `id: "step${i}"`;
    const idx = text.indexOf(marker);
    if (idx === -1) throw new Error(`${file}: ${marker} not found`);
    stepStarts.push(idx);
  }
  stepStarts.push(text.length); // sentinel: end of file covers the last step's slice

  // Process last-to-first so earlier offsets in `stepStarts` stay valid as later slices are
  // spliced back in with a different length.
  for (let i = n - 1; i >= 0; i--) {
    const guide = guideSteps[i];
    const catalogText = catalogSteps[i];
    const sliceStart = stepStarts[i];
    const sliceEnd = stepStarts[i + 1];
    let stepText = text.slice(sliceStart, sliceEnd);

    const taskPanel = buildTaskPanel(catalogText, guide, taskFilePath, i === 0);
    const hintText = guide.howToMap.map((line, n2) => `${n2 + 1}. ${line}`).join("\n");

    stepText = replaceField(stepText, "paal", "`,\n    hint:", taskPanel);
    stepText = replaceField(stepText, "hint", "`,\n    example_code:", hintText);
    stepText = replaceField(stepText, "example_code", "`,\n    think_prompt:", guide.pattern);
    stepText = replaceField(stepText, "why_this_matters", "`,\n    answer_keywords:", guide.why);
    stepText = replaceField(stepText, "analog_example", "`,\n    deepDiveLabel:", guide.pattern);
    stepText = replaceAllDeepDiveHooks(stepText, [guide.why]);

    text = text.slice(0, sliceStart) + stepText + text.slice(sliceEnd);
  }

  fs.writeFileSync(filePath, text, "utf8");
  console.log("updated", file);
}
