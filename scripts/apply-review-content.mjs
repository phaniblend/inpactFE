/**
 * Applies the review-cycle rewrite (beginner-friendly step titles + ASSIST GUIDE content) onto a
 * module's `steps` array in place, before buildEngine() turns it into NODES.
 *
 * What gets overridden per step (matched positionally — task title + step index):
 *  - paal          -> the beginner-rewritten short title (docs/task-catalog-beginner-rewrite.txt)
 *                     — this is what the Objectives list and phase panels show.
 *  - taskPanel     -> rebuilt from: the language/file-type line (every step, since a total
 *                     beginner can't assume what they're looking at) +, on step 1 only, exactly
 *                     where to create the file (nothing exists yet the first time this file is
 *                     touched) + the catalog title + the guide's "needs" list + its goal.
 *  - hint          -> the guide's numbered "HOW TO MAP THE PATTERN" steps.
 *  - analog        -> the guide's "LOOK AT THIS PATTERN (ANALOGY)" code block (feeds both
 *                     example_code and analog_example in buildEngine).
 *  - why           -> the guide's "WHY THIS HELPS YOU" paragraph.
 *  - deepDiveHook  -> same "WHY THIS HELPS YOU" paragraph.
 *
 * `mod.language` / `mod.filePath` are set by each template function in
 * write-smb-assist-engines.mjs (listFormModule/filterListModule/conflictApiModule/
 * derivedApiModule) — this file just threads them into the panel text.
 *
 * Deliberately NOT touched: think_prompt, mc_options/mc_correct_option/mc_anchor,
 * answer_keywords, seed_code/starter_code/expected, feedback_*, and the rest of deepDive
 * (pain/mentalModel/quickRules/watchOut/dryRun/discover) — none of the two source docs redefine
 * those, and expected/seed/starter are load-bearing for the code-correctness check.
 */
import { parseAssistGuides, parseCatalog } from "./parse-review-content.mjs";

const guides = parseAssistGuides();
const catalog = parseCatalog();

function buildTaskPanel(catalogText, guide, mod, isFirstStep) {
  const needsBlock = guide.needs.length ? `\n\nWHAT YOU'LL NEED\n${guide.needs.map((n) => `- ${n}`).join("\n")}` : "";
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
  mod.steps = mod.steps.map((step, i) => {
    const guide = guideSteps[i];
    const catalogText = catalogSteps[i];
    return {
      ...step,
      paal: catalogText,
      taskPanel: buildTaskPanel(catalogText, guide, mod, i === 0),
      hint: guide.howToMap.map((line, n) => `${n + 1}. ${line}`).join("\n"),
      analog: guide.pattern,
      why: guide.why,
      deepDiveHook: guide.why,
    };
  });
  return mod;
}
