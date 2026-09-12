import { useEffect, useMemo, useRef, useState } from "react";
import "./TaskPicker.css";

/**
 * Searchable, product-grouped task picker with a multi-select product filter — replaces a single
 * flat <select> that mixed every unassigned task from every product into one alphabet-less list
 * (user report, 2026-09-13, screenshot: MiniERP and PackagePunchCard tasks interleaved with no
 * grouping, and no way to narrow to one product or search before scrolling through all of them).
 *
 * Props: tasks (already-filtered-to-unassigned array of {id, number, title, projectId}),
 * projectName(projectId) -> string, value (selected task id or ""), onChange(taskId).
 */
export default function TaskPicker({ tasks, projectName, value, onChange, placeholder = "Choose an open task…" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState(() => new Set()); // empty = show all
  const rootRef = useRef(null);

  // Distinct products actually present, in first-seen order — only ones with a real open
  // unassigned task right now, not every product the platform has ever had.
  const products = useMemo(() => {
    const seen = new Map();
    for (const t of tasks) {
      if (!seen.has(t.projectId)) seen.set(t.projectId, projectName(t.projectId));
    }
    return [...seen.entries()].map(([id, name]) => ({ id, name }));
  }, [tasks, projectName]);

  const selectedTask = tasks.find((t) => String(t.id) === String(value));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (selectedProducts.size > 0 && !selectedProducts.has(t.projectId)) return false;
      if (!q) return true;
      return String(t.number).includes(q) || t.title.toLowerCase().includes(q);
    });
  }, [tasks, query, selectedProducts]);

  const grouped = useMemo(() => {
    const byProduct = new Map();
    for (const t of filtered) {
      const name = projectName(t.projectId);
      if (!byProduct.has(name)) byProduct.set(name, []);
      byProduct.get(name).push(t);
    }
    return [...byProduct.entries()];
  }, [filtered, projectName]);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  function toggleProduct(id) {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function pick(task) {
    onChange(String(task.id));
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="tp-root" ref={rootRef}>
      <button type="button" className="tp-trigger" onClick={() => setOpen((o) => !o)}>
        {selectedTask ? (
          <span className="tp-trigger-label">
            #{selectedTask.number} {selectedTask.title} — {projectName(selectedTask.projectId)}
          </span>
        ) : (
          <span className="tp-trigger-placeholder">{tasks.length === 0 ? "No unassigned open tasks…" : placeholder}</span>
        )}
        <span className="tp-trigger-caret" aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="tp-panel">
          <input
            type="text"
            className="tp-search"
            placeholder="Search by task # or title…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />

          {products.length > 1 && (
            <div className="tp-product-filter">
              {products.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  className={`tp-product-chip${selectedProducts.has(p.id) ? " active" : ""}`}
                  onClick={() => toggleProduct(p.id)}
                >
                  {p.name}
                </button>
              ))}
              {selectedProducts.size > 0 && (
                <button type="button" className="tp-product-clear" onClick={() => setSelectedProducts(new Set())}>
                  Clear
                </button>
              )}
            </div>
          )}

          <div className="tp-list">
            {grouped.length === 0 && <div className="tp-empty">No matching tasks.</div>}
            {grouped.map(([groupProductName, groupTasks]) => (
              <div className="tp-group" key={groupProductName}>
                <div className="tp-group-label">{groupProductName}</div>
                {groupTasks.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    className={`tp-option${String(t.id) === String(value) ? " active" : ""}`}
                    onClick={() => pick(t)}
                  >
                    #{t.number} {t.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
