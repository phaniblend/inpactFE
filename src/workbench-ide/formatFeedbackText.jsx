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

// Matches the exact chunk header DevWorkspace.jsx's getCheckPayload() writes for every changed
// file before concatenating them all into one blob: `// ---- ${path} ----\n${text}`.
const FILE_MARKER_RE = /^\/\/ ---- (.+) ----$/;

/**
 * Renders "Annotate my code" output (the learner's code with coaching comments inserted on their
 * own lines above the code they refer to -- see feedbackAnnotate.js's system prompt) as a real,
 * line-numbered code block, so a mistake reads as "line 9" instead of a plain description (user
 * report, 2026-09-07: "i know finanials is wrong but where? ... annotate will show me my mistake
 * at least by line# and line code"). A whole-line comment (// or #) is styled distinctly from real
 * code so the AI's own notes are visually separate from what the learner wrote.
 *
 * `code` is the same multi-file blob getCheckPayload() built for the AI to read -- every changed
 * file concatenated together behind a `// ---- path ----` marker, not just the one file the
 * learner has open. Numbering every line of that whole blob sequentially put "line 9" of file B
 * at whatever huge number it actually sat at across every earlier file's content too (user report,
 * live, with a screenshot: "the annotation code line# is not matching with the actual file" -- line
 * 26 in the annotation pointed at line 1 of the real, much shorter file). Resets the count to 1 at
 * each marker and renders it as its own filename header row instead of a numbered code line, so
 * numbers match what the learner's editor actually shows for that file. Also never numbers a
 * coaching-comment line -- only real code lines count, so an inserted note doesn't shift every
 * real line below it up by one either.
 */
export function renderAnnotatedCode(code, keyPrefix = "ann") {
  const rawLines = String(code ?? "").split("\n");
  let realLineNo = 0;
  const rows = rawLines.map((line, i) => {
    const marker = FILE_MARKER_RE.exec(line.trim());
    if (marker) {
      realLineNo = 0;
      return { key: `${keyPrefix}-${i}`, isFileHeader: true, file: marker[1] };
    }
    const isNote = /^\s*(\/\/|#)/.test(line);
    if (!isNote) realLineNo += 1;
    return { key: `${keyPrefix}-${i}`, isNote, lineNo: isNote ? null : realLineNo, text: line };
  });
  return (
    <div className="tsp-annotated-code">
      {rows.map((row) =>
        row.isFileHeader ? (
          <div key={row.key} className="tsp-annotated-file">
            {row.file}
          </div>
        ) : (
          <div key={row.key} className={`tsp-annotated-line${row.isNote ? " tsp-annotated-line-note" : ""}`}>
            <span className="tsp-annotated-lineno">{row.lineNo ?? ""}</span>
            <span className="tsp-annotated-linecode">{row.text || " "}</span>
          </div>
        )
      )}
    </div>
  );
}

/** A paragraph is a bullet list when every one of its lines starts with "- " — a lump of
 * instructions read as one thing to parse, not a set of separate, checkable actions (user report,
 * 2026-09-07: "can we give instructions more formatted, bulleted may be instead of a lump of
 * text"). Each bullet still gets backtick spans converted to inline <code>. */
function isBulletParagraph(lines) {
  return lines.length > 0 && lines.every((l) => /^-\s+/.test(l.trim()));
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
    const lines = p.split("\n").map((l) => l.trim());
    if (isBulletParagraph(lines)) {
      return (
        <ul key={`${keyPrefix}-${i}`} className="tsp-feedback-list">
          {lines.map((l, j) => (
            <li key={`${keyPrefix}-${i}-${j}`}>{withInlineCode(l.replace(/^-\s+/, ""), `${keyPrefix}-${i}-${j}`)}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={`${keyPrefix}-${i}`} className="tsp-feedback-p">
        {withInlineCode(p, `${keyPrefix}-${i}`)}
      </p>
    );
  });
}
