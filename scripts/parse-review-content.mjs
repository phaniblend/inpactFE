/**
 * Parses two review-cycle source docs into a single override table keyed by task title:
 *  - docs/task-catalog-beginner-rewrite.txt   -> per-step beginner-rewritten title/description
 *  - docs/assistguides for all 40 tasks.txt   -> per-step ASSIST GUIDE content (goal, needs,
 *    pattern/analogy, how-to-map, why)
 *
 * Marker-based, not blank-line-based: several ASSIST GUIDE "LOOK AT THIS PATTERN (ANALOGY)" code
 * blocks contain their own internal blank lines (e.g. a type declaration, a blank line, then a
 * function declaration) — stopping at the first blank line there silently truncates the pattern
 * and shifts every section after it. Instead, each section is sliced between two known marker
 * lines, so an internal blank line inside a code block is just part of that section's text.
 *
 * Run standalone to sanity-check parsing: node scripts/parse-review-content.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS = path.resolve(__dirname, "../docs");

function trimBlankEdges(linesArr) {
  let start = 0;
  let end = linesArr.length;
  while (start < end && linesArr[start].trim() === "") start++;
  while (end > start && linesArr[end - 1].trim() === "") end--;
  return linesArr.slice(start, end);
}

function findFrom(lines, from, predicate) {
  for (let i = from; i < lines.length; i++) {
    if (predicate(lines[i])) return i;
  }
  return -1;
}

export function parseAssistGuides() {
  const raw = fs.readFileSync(path.join(DOCS, "assistguides for all 40 tasks.txt"), "utf8");
  const allLines = raw.split(/\r?\n/);

  // Split into TASK blocks first (line index ranges).
  const taskStarts = [];
  allLines.forEach((line, i) => {
    const m = /^TASK:\s*(.+)$/.exec(line);
    if (m) taskStarts.push({ title: m[1].trim(), start: i });
  });

  const tasks = new Map();
  for (let t = 0; t < taskStarts.length; t++) {
    const { title, start } = taskStarts[t];
    const end = t + 1 < taskStarts.length ? taskStarts[t + 1].start : allLines.length;
    const lines = allLines.slice(start, end);

    // Step boundaries within this task block.
    const stepStarts = [];
    lines.forEach((line, i) => {
      if (/^--- STEP \d+ ---$/.test(line)) stepStarts.push(i);
    });

    const steps = [];
    for (let s = 0; s < stepStarts.length; s++) {
      const sStart = stepStarts[s];
      const sEnd = s + 1 < stepStarts.length ? stepStarts[s + 1] : lines.length;
      const block = lines.slice(sStart, sEnd);

      const idxStep = findFrom(block, 0, (l) => l.trim() === "STEP:");
      const idxGuide = findFrom(block, idxStep + 1, (l) => l.trim() === "ASSIST GUIDE:");
      const idxGoal = findFrom(block, idxGuide + 1, (l) => l.trim() === "YOUR GOAL");
      const idxNeeds = findFrom(block, idxGoal + 1, (l) => /^WHAT YOUR .+ NEEDS$/.test(l.trim()));
      const idxPattern = findFrom(block, idxNeeds + 1, (l) => l.trim() === "LOOK AT THIS PATTERN (ANALOGY)");
      const idxHowTo = findFrom(block, idxPattern + 1, (l) => l.trim() === "HOW TO MAP THE PATTERN");
      const idxWhy = findFrom(block, idxHowTo + 1, (l) => l.trim() === "WHY THIS HELPS YOU");

      if ([idxStep, idxGuide, idxGoal, idxNeeds, idxPattern, idxHowTo, idxWhy].some((x) => x < 0)) {
        console.warn(`[parse-review-content] malformed step block for "${title}" step ${s + 1} — skipping`);
        continue;
      }

      const oldTitle = trimBlankEdges(block.slice(idxStep + 1, idxGuide)).join("\n");
      const goal = trimBlankEdges(block.slice(idxGoal + 1, idxNeeds)).join("\n");
      const needsLabel = block[idxNeeds].trim();
      const needs = trimBlankEdges(block.slice(idxNeeds + 1, idxPattern))
        .map((l) => l.replace(/^\*\s*/, "").trim())
        .filter(Boolean);
      const pattern = trimBlankEdges(block.slice(idxPattern + 1, idxHowTo)).join("\n");
      const howToMap = trimBlankEdges(block.slice(idxHowTo + 1, idxWhy))
        .map((l) => l.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean);
      const why = trimBlankEdges(block.slice(idxWhy + 1)).join("\n");

      steps.push({ oldTitle, goal, needsLabel, needs, pattern, howToMap, why });
    }
    tasks.set(title, steps);
  }
  return tasks;
}

export function parseCatalog() {
  const raw = fs.readFileSync(path.join(DOCS, "task-catalog-beginner-rewrite.txt"), "utf8");
  const tasks = new Map(); // title -> [stepText, ...]
  const blocks = raw.split(/^#### \d+\.\s+/m).slice(1);
  for (const block of blocks) {
    const titleEnd = block.indexOf("\n");
    const title = block.slice(0, titleEnd).trim();
    const stepLines = [...block.matchAll(/^\*\s*\*\*Step \d+:\*\*\s*(.+)$/gm)].map((m) => m[1].trim());
    tasks.set(title, stepLines);
  }
  return tasks;
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`) {
  const guides = parseAssistGuides();
  const catalog = parseCatalog();
  console.log(`assistguides: ${guides.size} tasks`);
  for (const [title, steps] of guides) console.log(`  - ${title} (${steps.length} steps)`);
  console.log(`catalog: ${catalog.size} tasks`);
  for (const [title, steps] of catalog) console.log(`  - ${title} (${steps.length} steps)`);
}
