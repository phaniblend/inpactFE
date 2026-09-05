import { useEffect, useRef, useState } from "react";
import "./StepAssistPopup.css";

/**
 * `paal` (see the `whatFromPaal` comment in TaskStepsPanel.jsx) is written as: a goal sentence,
 * then a blank line, then an optional `MOCK ROW/LIST/FORM —` reference block copied verbatim from
 * the design mock, then optional extra prose, then a final "Your task: ..." line. Dumped as one flat
 * string (the old rendering) that whole shape collapses into a single wall-of-text paragraph — found
 * live 2026-09-02, the user pointing at exactly that next to a hand-built "Improved Revision" mock
 * showing what good looked like. This splits the same source string into those pieces instead of
 * asking every module's content to be rewritten.
 *
 * The "Your task: ..." closer was originally dropped here as an assumed restatement of the opening
 * goal sentence — wrong, caught live by the same user immediately after: for this exact step the
 * opener is generic ("Define a TypeScript type for one item in a list") while the closer is where
 * the type's actual name and full field list live (`type ScheduledReminder` with id/client/channel/
 * status). Dropping it silently removed the one piece of information a learner actually needs.
 * Every paragraph's content is now kept — only the literal "Your task:" lead-in text is trimmed
 * (and re-capitalized) so it doesn't read as a redundant label directly under the YOUR TASK eyebrow.
 */
function splitPaalSections(paal) {
  if (!paal) return { taskParagraphs: [], mockBlock: null };
  const paragraphs = paal
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const taskParagraphs = [];
  let mockBlock = null;
  for (const p of paragraphs) {
    if (/^MOCK\s+\S+/i.test(p)) {
      mockBlock = p;
      continue;
    }
    const stripped = p.replace(/^your task:\s*/i, "");
    taskParagraphs.push(stripped === p ? p : stripped.charAt(0).toUpperCase() + stripped.slice(1));
  }
  return { taskParagraphs, mockBlock };
}

/**
 * The mock block's field labels are UI display copy ("Client:", "Channel:", "Status:") — correct
 * for the design mock they were copied from, wrong for a code-naming reference, where a beginner
 * reading "Client:" has real reason to type `Client: string` and fail validation on casing alone
 * (flagged live 2026-09-02). Reformats the same block — no content invented, nothing dropped — as
 * an actual object literal with camelCased keys, which is what the field genuinely looks like in
 * code. Falls back to the raw block untouched if a line doesn't match the expected "Label: value"
 * shape, rather than risk mangling a module whose mock block looks different.
 *
 * `fields`, when given (see extractTypeSpec below), is the real field list this step's type needs —
 * if it names an `id` the mock block itself never shows (true for every list-and-form mock in this
 * app: the UI mock is display copy, `id` is a storage/lookup detail no screen renders), one is
 * synthesized and prepended. Flagged live 2026-09-02: the previous version left `id` out of the
 * reference object entirely because the source mock never had it — correct about *why*, but the
 * user's own follow-up made the call that showing a complete object (with an obviously-illustrative
 * id value) teaches better than an accurate-but-incomplete one. The placeholder is a generic
 * "row-1" — no real ID scheme is inferred or implied, since none is known here.
 */
function formatMockBlockAsObject(mockBlock, fields) {
  const lines = mockBlock.split("\n");
  const header = lines[0]?.trim();
  const toCamelKey = (label) =>
    label
      .trim()
      .split(/\s+/)
      .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
      .join("");
  const entries = [];
  for (const line of lines.slice(1)) {
    const m = line.match(/^\s*([A-Za-z][\w\s]*?):\s*(.+?)\s*$/);
    if (!m) continue;
    entries.push({ key: toCamelKey(m[1]), rendered: `  ${toCamelKey(m[1])}: ${m[2]},` });
  }
  if (entries.length === 0) return mockBlock;
  if (fields?.some((f) => f.name === "id") && !entries.some((e) => e.key === "id")) {
    entries.unshift({ key: "id", rendered: `  id: "row-1",` });
  }
  return `// ${header}\n{\n${entries.map((e) => e.rendered).join("\n")}\n}`;
}

/**
 * Ground-truth field list for a "define this type" step, read straight out of the step's own
 * `expected` code (the literal correct answer) rather than parsed from prose — flagged live
 * 2026-09-02 after a prose-based first pass (see splitPaalSections' history) already lost the type
 * name once. `expected` accumulates every prior step's code too, so this only trusts a block whose
 * name matches a `` `type Name` `` mention actually found in `paal` first — never "the first type
 * in the file," which would silently grab the wrong step's type on a later step. Returns null (and
 * the caller falls back to the plain paragraph rendering) whenever either half can't be confidently
 * found, rather than guess.
 */
function extractTypeSpec(paal, expected) {
  if (!paal || !expected) return null;
  const nameMatch = paal.match(/`type\s+(\w+)`/i);
  if (!nameMatch) return null;
  const typeName = nameMatch[1];
  const blockMatch = expected.match(new RegExp(`type\\s+${typeName}\\s*=\\s*\\{([^}]*)\\}`, "i"));
  if (!blockMatch) return null;
  const fields = blockMatch[1]
    .split(/[;\n]/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const m = l.match(/^(\w+)\s*:\s*([^;]+?)\s*$/);
      return m ? { name: m[1], type: m[2].trim() } : null;
    })
    .filter(Boolean);
  return fields.length > 0 ? { typeName, fields } : null;
}

/** Turns `` `token` `` spans into real <code> elements; everything else renders as plain text. */
function withInlineCode(text, keyPrefix) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={`${keyPrefix}-${i}`}>{part.slice(1, -1)}</code>
    ) : (
      <span key={`${keyPrefix}-${i}`}>{part}</span>
    )
  );
}

/**
 * Bite-sized "Assist me" for exactly one micro-task step — concept + a real-world analogy, no toy
 * editor. The old Assist Me lesson opened a whole separate lesson engine with its own sandboxed
 * Monaco editor to type the answer into again; that made sense when the real code lived somewhere
 * else entirely. Now the real code is right there in the same workspace's real editor, so this
 * popup's only job is explaining the one step, then getting out of the way.
 *
 * Props: moduleTag, node (the step's NODES entry — paal/hint/why_this_matters/analog_example/
 * deepDive), onClose.
 */
export default function StepAssistPopup({ moduleTag, node, onClose }) {
  const [thread, setThread] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  async function ask() {
    const question = draft.trim();
    if (!question) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/assist-me/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleTag, node, question, thread }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Mentor unavailable");
      setThread((t) => [...t, { role: "user", content: question }, { role: "assistant", content: data.reply }]);
      setDraft("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!node) return null;

  const { taskParagraphs, mockBlock } = splitPaalSections(node.paal);
  const typeSpec = extractTypeSpec(node.paal, node.expected);

  return (
    <div className="sap-overlay" role="presentation" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sap-panel" role="dialog" aria-modal="true" aria-label="Assist me">
        <div className="sap-header">
          <span>💡 Assist me</span>
          <button type="button" className="sap-close" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="sap-body">
          {typeSpec ? (
            <div className="sap-block">
              <div className="sap-label">YOUR TASK</div>
              <div className="sap-text">
                Define and export <code>{`type ${typeSpec.typeName}`}</code> with these fields:
              </div>
              <ul className="sap-fields">
                {typeSpec.fields.map((f) => (
                  <li key={f.name}>
                    <code>{`${f.name}: ${f.type}`}</code>
                    {f.name === "id" ? " (required unique identifier)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : taskParagraphs.length > 0 ? (
            <div className="sap-block">
              <div className="sap-label">YOUR TASK</div>
              {taskParagraphs.map((p, i) => (
                <div className="sap-text" key={i}>
                  {withInlineCode(p, `task-${i}`)}
                </div>
              ))}
            </div>
          ) : null}
          {mockBlock ? (
            <div className="sap-block">
              <div className="sap-label">MOCK DATA REFERENCE</div>
              <pre className="sap-code">{formatMockBlockAsObject(mockBlock, typeSpec?.fields)}</pre>
            </div>
          ) : null}
          {node.why_this_matters ? (
            <div className="sap-block">
              <div className="sap-label">WHY THIS MATTERS</div>
              <div className="sap-text">{withInlineCode(node.why_this_matters, "why")}</div>
            </div>
          ) : null}
          {node.analog_example ? (
            <div className="sap-block">
              <div className="sap-label">ANALOGOUS EXAMPLE</div>
              <pre className="sap-code">{node.analog_example}</pre>
            </div>
          ) : null}
          {node.deepDive?.mentalModel ? (
            <div className="sap-block">
              <div className="sap-label">MENTAL MODEL</div>
              <div className="sap-text">{withInlineCode(node.deepDive.mentalModel, "mm")}</div>
            </div>
          ) : null}

          {thread.length > 0 && (
            <div className="sap-thread">
              {thread.map((m, i) => (
                <div key={i} className={`sap-msg sap-msg-${m.role}`}>
                  <div className="sap-msg-role">{m.role === "user" ? "You" : "Mentor"}</div>
                  <div className="sap-msg-text">{m.content}</div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          )}
        </div>
        <div className="sap-compose">
          {error ? <div className="sap-error">{error}</div> : null}
          <textarea
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Still stuck? Ask the mentor about this step…"
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") ask();
            }}
          />
          <button type="button" disabled={loading || !draft.trim()} onClick={ask}>
            {loading ? "…" : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
}
