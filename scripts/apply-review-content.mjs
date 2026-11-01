/**
 * Applies the review-cycle rewrite (beginner-friendly step titles + ASSIST GUIDE content) onto a
 * module's `steps` array in place, before buildEngine() turns it into NODES.
 *
 * Audit 2026-11-01 (P03 / P08 / P09 / P25): the assist guides used different field names and empty
 * messages than the module's `expected` / designMock. Overriding `analog` with near-task code also
 * handed learners the answer. Overrides now keep the generator's contract and different-domain
 * analog; guide text is rewritten to use the canonical fields and empty message.
 *
 * Deliberately NOT touched: think_prompt, mc_options/mc_correct_option/mc_anchor,
 * answer_keywords, seed_code/starter_code/expected, feedback_*, analog (kept from generator).
 */
import { parseAssistGuides, parseCatalog } from "./parse-review-content.mjs";

const guides = parseAssistGuides();
const catalog = parseCatalog();

/** Field names from the step's expected type body (single source of truth with the check). */
function fieldsFromExpected(expected) {
  const text = String(expected || "");
  const names = [];
  const re = /^\s*([A-Za-z_][\w]*)\s*:/gm;
  let m;
  while ((m = re.exec(text))) {
    if (m[1] === "export" || m[1] === "type" || m[1] === "function") continue;
    names.push(m[1]);
  }
  // Prefer fields inside the first `type X = { ... }` block only
  const typeBlock = /type\s+\w+\s*=\s*\{([\s\S]*?)\}/.exec(text);
  if (typeBlock) {
    const inner = [];
    const ir = /^\s*([A-Za-z_][\w]*)\s*:/gm;
    let im;
    while ((im = ir.exec(typeBlock[1]))) inner.push(im[1]);
    if (inner.length) return inner;
  }
  return names.filter((n) => n !== "id" || names.indexOf(n) === names.lastIndexOf(n));
}

function uniqueFields(fields) {
  const seen = new Set();
  const out = [];
  for (const f of fields) {
    if (seen.has(f)) continue;
    seen.add(f);
    out.push(f);
  }
  return out;
}

/**
 * Rewrite guide/catalog prose so field tokens and empty-state strings match the module contract.
 * Keeps beginner wording from the guide without teaching a second schema.
 */
function alignContractText(text, { fields, emptyMsg, alienFields }) {
  let out = String(text || "");
  if (emptyMsg) {
    // Common mismatched empty strings from the review docs → canonical designMock.emptyMessage
    out = out
      .replace(/No shifts (published for this week|scheduled)\.?/gi, emptyMsg)
      .replace(/All shifts covered\.?/gi, emptyMsg)
      .replace(/No open coverage requests\.?/gi, emptyMsg)
      .replace(/No estimates (created yet|recorded)\.?/gi, emptyMsg)
      .replace(/No quotes yet\.?/gi, emptyMsg);
  }
  // Drop alien field names the guide invented (e.g. shiftTime when contract is startsAt)
  for (const alien of alienFields || []) {
    if (!alien || (fields || []).includes(alien)) continue;
    const closest = (fields || []).find((f) => f.toLowerCase().includes("time") || f === "startsAt" || f === "sendAt")
      || (fields || []).find((f) => f !== "id")
      || alien;
    out = out.replace(new RegExp(`\\b${alien}\\b`, "g"), closest);
  }
  return out;
}

function buildTaskPanel(catalogText, guide, mod, isFirstStep, fields) {
  const needs = (fields && fields.length
    ? fields.map((n) => `${n} (${n === "id" ? "text — unique key, not always shown on screen" : "per contract"})`)
    : guide.needs);
  const needsBlock = needs.length ? `\n\nWHAT YOU'LL NEED\n${needs.map((n) => `- ${n}`).join("\n")}` : "";
  const languageLine = mod.language ? `${mod.language}\n\n` : "";
  const createFileLine =
    isFirstStep && mod.filePath
      ? `This file doesn't exist yet — you're the first to touch it. Create it at \`${mod.filePath}\` before anything else. Every step from here on edits that same file.\n\n`
      : "";
  return `${languageLine}${createFileLine}${catalogText}${needsBlock}\n\nYour task: ${guide.goal}`;
}

export function applyReviewOverrides(mod) {
  const guideSteps = guides.get(mod.title);
  const catalogSteps = catalog.get(mod.title);
  if (!guideSteps || !catalogSteps) {
    console.warn(`[apply-review-content] no override found for task "${mod.title}" — left as-is`);
    return mod;
  }
  if (guideSteps.length !== mod.steps.length || catalogSteps.length !== mod.steps.length) {
    console.warn(
      `[apply-review-content] step-count mismatch for "${mod.title}": module has ${mod.steps.length}, guide has ${guideSteps.length}, catalog has ${catalogSteps.length} — left as-is`,
    );
    return mod;
  }
  const emptyMsg = mod.designMock?.emptyMessage || "";
  // Tokens that appear in guides but must never disagree with expected (audit P25)
  const knownAliens = [
    "shiftTime",
    "estimate",
    "price",
    "reviewer",
    "comment",
    "response",
    "title",
    "scheduledFor",
    "template",
    "recipient",
    "project name",
    "quantity",
  ];

  mod.steps = mod.steps.map((step, i) => {
    const guide = guideSteps[i];
    const fields = uniqueFields(fieldsFromExpected(step.expected));
    const catalogText = alignContractText(catalogSteps[i], { fields, emptyMsg, alienFields: knownAliens });
    const why = alignContractText(guide.why, { fields, emptyMsg, alienFields: knownAliens });
    const goal = alignContractText(guide.goal, { fields, emptyMsg, alienFields: knownAliens });
    const howToMap = (guide.howToMap || []).map((line) =>
      alignContractText(line, { fields, emptyMsg, alienFields: knownAliens }),
    );
    const guideAligned = { ...guide, why, goal, howToMap };
    return {
      ...step,
      paal: catalogText,
      taskPanel: buildTaskPanel(catalogText, guideAligned, mod, i === 0, fields),
      hint: howToMap.map((line, n) => `${n + 1}. ${line}`).join("\n"),
      // Keep generator analog (different domain) — never the guide's near-answer (audit P03)
      why,
      deepDiveHook: why,
    };
  });
  return mod;
}
