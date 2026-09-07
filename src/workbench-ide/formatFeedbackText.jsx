/**
 * Lightweight markdown-lite renderer for Check my code feedback (2026-09-07, user report: "his
 * action (adding the import) is lost in the bulk of alert"). Handles exactly two things, both
 * needed to make a concrete fix ("add this import line") stand out from the sentence around it:
 *  - a paragraph that's an entire ``` fenced block becomes its own <pre> code block
 *  - `backtick` spans anywhere else become inline <code>
 * Anything else renders as plain paragraph text — free-form AI feedback prose (which rarely uses
 * either) looks exactly as it did before; only guard-authored messages that opt into this
 * structure (see reactHookImportGuard.js) get the richer layout.
 */
function withInlineCode(text, keyPrefix) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={`${keyPrefix}-c${i}`}>{part.slice(1, -1)}</code>
    ) : (
      <span key={`${keyPrefix}-s${i}`}>{part}</span>
    )
  );
}

/**
 * Renders "Annotate my code" output (the learner's code with coaching comments inserted on their
 * own lines above the code they refer to — see feedbackAnnotate.js's system prompt) as a real,
 * line-numbered code block, so a mistake reads as "line 9" instead of a plain description (user
 * report, 2026-09-07: "i know finanials is wrong but where? ... annotate will show me my mistake
 * at least by line# and line code"). A whole-line comment (// or #) is styled distinctly from real
 * code so the AI's own notes are visually separate from what the learner wrote.
 */
export function renderAnnotatedCode(code, keyPrefix = "ann") {
  const lines = String(code ?? "").split("\n");
  return (
    <div className="tsp-annotated-code">
      {lines.map((line, i) => {
        const isNote = /^\s*(\/\/|#)/.test(line);
        return (
          <div key={`${keyPrefix}-${i}`} className={`tsp-annotated-line${isNote ? " tsp-annotated-line-note" : ""}`}>
            <span className="tsp-annotated-lineno">{i + 1}</span>
            <span className="tsp-annotated-linecode">{line || " "}</span>
          </div>
        );
      })}
    </div>
  );
}

export function formatFeedbackText(text, keyPrefix = "fb") {
  if (!text) return null;
  const paragraphs = String(text)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paragraphs.map((p, i) => {
    const fenced = p.match(/^```(?:\w+)?\n?([\s\S]*?)\n?```$/);
    if (fenced) {
      return (
        <pre key={`${keyPrefix}-${i}`} className="tsp-feedback-code">
          {fenced[1]}
        </pre>
      );
    }
    return (
      <p key={`${keyPrefix}-${i}`} className="tsp-feedback-p">
        {withInlineCode(p, `${keyPrefix}-${i}`)}
      </p>
    );
  });
}
