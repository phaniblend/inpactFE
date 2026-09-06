import { useState } from "react";

/**
 * Renders a task's "design mock" — a small interactive preview of the screen a task asks for
 * (list + form, or an API request/response pair), driven by a plain JSON config
 * (write-smb-assist-engines.mjs writes one per Coding task's Assist module, embedded as
 * NODES[0].content.designMock in the generated engine file — see designMocks.generated.js for
 * the same data extracted into a lightweight, engine-independent map).
 *
 * Originally lived only inside the Assist Me lesson engine (inpact_engine_shared.jsx) as
 * LessonDesignMock/LiveListFormDesignMock — extracted here, unchanged, so Workbench's "Try the
 * mock" modal can render the identical preview without pulling in the whole lesson-engine bundle
 * just to show a task's screen before someone has even started the lesson.
 */

const MOCK_SHELL = {
  fontFamily: "Segoe UI, system-ui, sans-serif",
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
};
const MOCK_CHROME = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 12px",
  background: "#f8fafc",
  borderBottom: "1px solid #e2e8f0",
};
const MOCK_DOT = { width: 8, height: 8, borderRadius: "50%", background: "#cbd5e1", display: "inline-block" };

export default function DesignMockPreview({ mock }) {
  if (!mock || typeof mock !== "object") return null;
  const kind = mock.kind || "list-and-form";
  const isApi = String(kind).includes("api");
  // "screen you're building" / "brand colors" is UI-mock language — wrong for a backend task with
  // no screen at all. Found live: a BE-only task showed this exact caption and read as nonsense.
  const caption =
    mock.caption ||
    (isApi
      ? "Sample request/response — implement the endpoint(s) to match this contract."
      : "This is the screen you are building. Match the pieces — not the brand colors.");

  if (isApi) {
    const getSample = mock.getSample || "";
    const postSample = mock.postSample || "";
    return (
      <div style={{ margin: "0 0 28px" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.12em", fontWeight: 800, color: "#64748b", marginBottom: 8 }}>API CONTRACT</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          <div style={MOCK_SHELL}>
            <div style={MOCK_CHROME}>
              <span style={MOCK_DOT} /><span style={MOCK_DOT} /><span style={MOCK_DOT} />
              <span style={{ fontSize: 11, color: "#64748b", marginLeft: 6 }}>{mock.getLabel || "GET"}</span>
            </div>
            <pre style={{ margin: 0, padding: 12, fontSize: 11, lineHeight: 1.45, color: "#0f172a", whiteSpace: "pre-wrap" }}>{getSample}</pre>
          </div>
          <div style={MOCK_SHELL}>
            <div style={MOCK_CHROME}>
              <span style={MOCK_DOT} /><span style={MOCK_DOT} /><span style={MOCK_DOT} />
              <span style={{ fontSize: 11, color: "#64748b", marginLeft: 6 }}>{mock.postLabel || "POST"}</span>
            </div>
            <pre style={{ margin: 0, padding: 12, fontSize: 11, lineHeight: 1.45, color: "#0f172a", whiteSpace: "pre-wrap" }}>{postSample}</pre>
          </div>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{caption}</p>
      </div>
    );
  }

  return <LiveListFormDesignMock mock={mock} caption={caption} />;
}

function rowFromFormValues(fields, values) {
  const by = {};
  fields.forEach((field, i) => {
    by[String(field.label || "").toLowerCase()] = String(values[i] || "").trim();
  });
  // "client" checked first: booking's own mock is the only one with "provider" and no "client"
  // field, so checking service/provider first (the original order) mislabeled every other mock
  // that happens to also have a "service" field alongside "client" — found live testing the
  // package-low-board mock, which showed the service value as the row's bold title instead of
  // the client name.
  if (by.client) {
    // "channel" added after finding it silently dropped: a client-facing form with a
    // communication-method field (sms/email/push) had no case here at all, so a submitted row's
    // channel just vanished instead of showing as the subtitle.
    return {
      title: by.client,
      subtitle: by.service || by.amount || by.channel,
      meta: by["due date"] || by.duedate || by["starts at"] || by.startsat || values[2],
    };
  }
  if (by.service || by.provider) {
    return { title: by.service || values[1], subtitle: by.provider || values[0], meta: by["starts at"] || by.startsat || values[2] };
  }
  return { title: values[0] || "", subtitle: values[1] || "", meta: values[2] || "" };
}

function LiveListFormDesignMock({ mock, caption }) {
  const sampleRows = Array.isArray(mock.rows) ? mock.rows : [];
  const fields = Array.isArray(mock.fields) ? mock.fields : [];
  const [rows, setRows] = useState(sampleRows);
  const [values, setValues] = useState(() => fields.map((f) => (f.options?.length ? f.options[0] : "")));

  // formMode "filter": the form's job is narrowing the existing list, not creating a new item —
  // found live 2026-09-01: a single-dropdown "Filter by Status" form was still wired to the default
  // add-a-row behavior, so clicking Apply added a nonsense row titled "Resolved" or "All" with no
  // other fields — exactly the kind of thing that reads as "the app is broken" to a total beginner.
  // Default (formMode absent or "add") is unchanged — every existing module keeps adding a row.
  const isFilterForm = mock.formMode === "filter";
  const [appliedFilter, setAppliedFilter] = useState(null);

  function onSubmit(e) {
    e.preventDefault();
    if (isFilterForm) {
      setAppliedFilter(values[0] || null);
      return;
    }
    if (values.every((v) => !String(v).trim())) return;
    const newRow = rowFromFormValues(fields, values);
    // Optional: derive meta from whether a specific field was filled in — found live 2026-09-01: a
    // form with no field for meta always left it blank on a new row, while every sample row had a
    // real status badge (e.g. "Assigned"/"Claim"). A row the form itself produces should look like
    // the ones already there, not visibly incomplete next to them.
    // mock.metaFromField: { index: <field index>, whenFilled: "...", whenEmpty: "..." }
    if (mock.metaFromField) {
      const { index, whenFilled, whenEmpty } = mock.metaFromField;
      newRow.meta = String(values[index] || "").trim() ? whenFilled : whenEmpty;
    }
    setRows((prev) => [...prev, newRow]);
    setValues(fields.map((f) => (f.options?.length ? f.options[0] : "")));
  }

  const visibleRows =
    isFilterForm && appliedFilter && appliedFilter.toLowerCase() !== "all"
      ? rows.filter((row) => row.meta === appliedFilter)
      : rows;

  // Optional per-row status toggle (e.g. "Mark Resolved" / "Mark Unresolved") — found live
  // 2026-09-01: a task whose whole point is "click a button to change a row's status" had no way
  // to show that in a mock that could only add new rows via a form, never mutate an existing one.
  // mock.rowToggle: { values: [v1, v2], labels: { [v1]: "label shown when meta === v1", ... } }
  // Matched by title+subtitle, not array index — visibleRows can be a filtered subset of rows, so
  // an index into one doesn't line up with the other.
  const toggle = mock.rowToggle;
  // Optional: also swap subtitle when meta toggles (e.g. "Unassigned" <-> "You") — found live
  // 2026-09-01: clicking "Claim" flipped the meta badge to "Assigned" but left subtitle reading
  // "Unassigned", visibly contradicting its own badge. subtitleValues pairs index-for-index with
  // values: subtitleValues[0] applies when meta becomes values[0], etc.
  const subtitleValues = Array.isArray(toggle?.subtitleValues) && toggle.subtitleValues.length === 2 ? toggle.subtitleValues : null;
  function toggleRow(target) {
    if (!toggle || !Array.isArray(toggle.values) || toggle.values.length !== 2) return;
    setRows((prev) =>
      prev.map((row) => {
        if (row.title !== target.title || row.subtitle !== target.subtitle) return row;
        const [a, b] = toggle.values;
        const nextMeta = row.meta === a ? b : a;
        const nextSubtitle = subtitleValues ? subtitleValues[nextMeta === a ? 0 : 1] : row.subtitle;
        return { ...row, meta: nextMeta, subtitle: nextSubtitle };
      })
    );
  }

  return (
    <div style={{ margin: "0 0 28px" }}>
      <div style={{ fontSize: 10, letterSpacing: "0.12em", fontWeight: 800, color: "#64748b", marginBottom: 8 }}>DESIGN MOCK — try it</div>
      <div style={{ ...MOCK_SHELL, maxWidth: 560 }}>
        <div style={MOCK_CHROME}>
          <span style={{ ...MOCK_DOT, background: "#f43f5e" }} />
          <span style={{ ...MOCK_DOT, background: "#f59e0b" }} />
          <span style={{ ...MOCK_DOT, background: "#22c55e" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginLeft: 8 }}>{mock.screenTitle || "App"}</span>
        </div>
        <div style={{ padding: 14, display: "grid", gap: 14 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.08em", color: "#64748b", marginBottom: 6 }}>{mock.listCaption || "LIST"}</div>
            {visibleRows.length === 0 ? (
              <div
                style={{
                  border: "1px dashed #cbd5e1",
                  borderRadius: 8,
                  padding: "16px 12px",
                  textAlign: "center",
                  fontSize: 13,
                  color: "#64748b",
                  background: "#f8fafc",
                }}
              >
                {mock.emptyMessage || "Nothing here yet."}
              </div>
            ) : (
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                {visibleRows.map((row, i) => (
                  <div
                    key={`${row.title}-${row.subtitle}-${row.meta}-${i}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "10px 12px",
                      borderTop: i ? "1px solid #f1f5f9" : "none",
                      background: "#fff",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{row.title}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{row.subtitle}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {/* Skip the plain-text badge when the toggle button already says the same
                          thing (e.g. meta "Claim" + a button also labeled "Claim") — found live
                          2026-09-01: showing both read as a duplicated label, not a status + an
                          action. Still shown for a pair like "Assigned" + "Unassign", where the
                          badge is real status info distinct from what clicking the button does. */}
                      {(!toggle || toggle.labels?.[row.meta] !== row.meta) && (
                        <span style={{ fontSize: 12, color: "#334155", whiteSpace: "nowrap" }}>{row.meta}</span>
                      )}
                      {toggle && (
                        <button
                          type="button"
                          onClick={() => toggleRow(row)}
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "4px 8px",
                            borderRadius: 6,
                            border: "1px solid #cbd5e1",
                            background: "#f8fafc",
                            color: "#0891b2",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {toggle.labels?.[row.meta] || "Toggle"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.08em", color: "#64748b" }}>FORM</div>
            {fields.map((field, i) => {
              const inputStyle = {
                border: "1px solid #cbd5e1",
                borderRadius: 6,
                padding: "8px 10px",
                fontSize: 13,
                color: "#0f172a",
                background: "#fff",
                fontFamily: "inherit",
              };
              const onChange = (e) => {
                const next = [...values];
                next[i] = e.target.value;
                setValues(next);
              };
              return (
                <label key={field.label} style={{ display: "grid", gap: 4, fontSize: 11, color: "#475569" }}>
                  {field.label}
                  {/* A dropdown field (e.g. a status filter with fixed options) is a real <select>,
                      not a free-text box standing in for one — found live 2026-09-01: the AC asked
                      for "All, Open, Resolved" but the mock only ever offered a blank text input. */}
                  {Array.isArray(field.options) && field.options.length > 0 ? (
                    <select value={values[i] || field.options[0]} onChange={onChange} style={inputStyle}>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input value={values[i] || ""} placeholder={field.sample || ""} onChange={onChange} style={inputStyle} />
                  )}
                </label>
              );
            })}
            <button
              type="submit"
              style={{
                marginTop: 4,
                justifySelf: "start",
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                background: "#0891b2",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {mock.submitLabel || "Submit"}
            </button>
          </form>
        </div>
      </div>
      <p style={{ margin: "8px 0 0", fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
        {caption}{" "}
        {isFilterForm
          ? `Pick a value and click ${mock.submitLabel || "Submit"} — the list narrows to matching rows. The empty message shows when nothing matches.`
          : `Type in the boxes and click ${mock.submitLabel || "Submit"} — a new row should appear. The empty message shows when the list has no rows.`}
      </p>
    </div>
  );
}
