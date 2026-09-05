import { useState } from "react";
import "./GitPanel.css";

const STATUS_LABEL = { added: "A", modified: "M", deleted: "D" };

/**
 * Real git status + commit + push against the real OneDev remote (via server/git-proxy-router.js).
 * No PR-creation reimplementation here — opening the actual PR stays on OneDev's own `~pulls` UI
 * via `pullsUrl`, matching how learners already do it today (see Workbench.jsx's existing
 * pullsUrl/branchHint computation).
 */
export default function GitPanel({ branch, changedFiles, onCommitPush, pushing, pushError, lastPushedBranch, pullsUrl, onClearLocalWorkspace }) {
  const [message, setMessage] = useState("");

  function submit() {
    const trimmed = message.trim();
    if (!trimmed || changedFiles.length === 0 || pushing) return;
    onCommitPush(trimmed);
    setMessage("");
  }

  return (
    <div className="gp-root">
      <div className="gp-header">
        <span className="gp-branch" title={branch}>
          🌿 {branch}
        </span>
      </div>

      <div className="gp-changes">
        <div className="gp-changes-label">CHANGES ({changedFiles.length})</div>
        {changedFiles.length === 0 ? (
          <div className="gp-empty">No changes yet — edit a file to see it here.</div>
        ) : (
          changedFiles.map((f) => (
            <div key={f.filepath} className={`gp-file gp-file-${f.status}`} title={f.filepath}>
              <span className="gp-file-badge">{STATUS_LABEL[f.status] || "?"}</span>
              <span className="gp-file-path">{f.filepath}</span>
            </div>
          ))
        )}
      </div>

      <textarea
        className="gp-message"
        placeholder="Commit message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
        }}
      />
      <button type="button" className="gp-commit-btn" disabled={!message.trim() || changedFiles.length === 0 || pushing} onClick={submit}>
        {pushing ? "Pushing…" : "Commit & Push"}
      </button>

      {pushError ? <div className="gp-error">{pushError}</div> : null}
      {lastPushedBranch ? (
        <div className="gp-success">
          Pushed to <code>{lastPushedBranch}</code>.{" "}
          <a href={pullsUrl} target="_blank" rel="noreferrer">
            Open a Pull Request on OneDev →
          </a>
        </div>
      ) : null}

      <button type="button" className="gp-clear-btn" onClick={onClearLocalWorkspace} title="Delete the local clone — the next 'Start developing' re-clones from scratch">
        Clear local workspace
      </button>
    </div>
  );
}
