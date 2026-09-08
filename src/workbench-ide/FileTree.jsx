import { useEffect, useState, useCallback } from "react";
import "./FileTree.css";

/** .git is deliberately skipped — nothing a learner should browse or open as a "file." */
async function readDirRecursive(fs, dir, base = "") {
  const entries = await fs.promises.readdir(dir);
  const nodes = [];
  for (const name of entries) {
    if (name === ".git") continue;
    const full = `${dir}/${name}`;
    const relPath = base ? `${base}/${name}` : name;
    const stat = await fs.promises.stat(full);
    if (stat.isDirectory()) {
      nodes.push({ type: "dir", name, path: relPath, children: await readDirRecursive(fs, full, relPath) });
    } else {
      nodes.push({ type: "file", name, path: relPath });
    }
  }
  // Directories first, then alphabetical within each group — standard file-tree convention.
  nodes.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "dir" ? -1 : 1));
  return nodes;
}

/** Shared by both row types — a hover-revealed delete button, deliberately its own element (not
 * baked into the row's own onClick) so a click on it never also opens the file or toggles the
 * folder. Confirms first: this is a real recursive delete for a folder, and undoing a mistake here
 * means retyping the file, not an undo stack (user report, 2026-09-07: no way at all to remove a
 * junk file/folder created by mistyping a path — this closes that gap). */
function DeleteButton({ label, onDelete }) {
  return (
    <button
      type="button"
      className="ft-delete-btn"
      title={`Delete ${label}`}
      aria-label={`Delete ${label}`}
      onClick={(e) => {
        e.stopPropagation();
        if (window.confirm(`Delete "${label}"? This can't be undone here — you'd have to recreate it.`)) {
          onDelete();
        }
      }}
    >
      🗑
    </button>
  );
}

/** Per-folder "+" (2026-09-07, user report: typing a full path by hand created a sibling `src`
 * folder instead of landing inside the existing one — a learner shouldn't have to get a path
 * exactly right by typing it blind). Opens the scoped new-file input for that folder specifically;
 * the input only ever needs a name/relative-subpath from there, not the whole project-root path. */
function NewFileButton({ label, onClick }) {
  return (
    <button type="button" className="ft-newhere-btn" title={`New file in ${label}`} aria-label={`New file in ${label}`} onClick={onClick}>
      +
    </button>
  );
}

function NewFileInputRow({ depth, value, onChange, onSubmit, onCancel, placeholder }) {
  return (
    <div className="ft-new-row" style={{ paddingLeft: 10 + depth * 14 }}>
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
          if (e.key === "Escape") onCancel();
        }}
        placeholder={placeholder}
      />
    </div>
  );
}

function TreeNode({
  node,
  depth,
  activePath,
  dirtyPaths,
  onOpenFile,
  onDeletePath,
  expanded,
  onToggle,
  newFileParent,
  newFileName,
  onNewFileNameChange,
  onStartNewFile,
  onSubmitNewFile,
  onCancelNewFile,
}) {
  if (node.type === "file") {
    const isDirty = dirtyPaths.has(node.path);
    return (
      <div
        className={`ft-row ft-file${activePath === node.path ? " ft-active" : ""}`}
        style={{ paddingLeft: 10 + depth * 14 }}
        onClick={() => onOpenFile(node.path)}
        title={node.path}
      >
        <span className="ft-icon" aria-hidden>
          📄
        </span>
        <span className="ft-name">{node.name}</span>
        {isDirty && <span className="ft-dirty-dot" aria-hidden />}
        <DeleteButton label={node.path} onDelete={() => onDeletePath(node.path)} />
      </div>
    );
  }
  const isOpen = expanded.has(node.path);
  return (
    <div>
      <div className="ft-row ft-dir" style={{ paddingLeft: 10 + depth * 14 }} onClick={() => onToggle(node.path)}>
        <span className="ft-icon" aria-hidden>
          {isOpen ? "📂" : "📁"}
        </span>
        <span className="ft-name">{node.name}</span>
        <NewFileButton
          label={`${node.path}/`}
          onClick={(e) => {
            e.stopPropagation();
            onStartNewFile(node.path);
          }}
        />
        <DeleteButton label={`${node.path}/`} onDelete={() => onDeletePath(node.path)} />
      </div>
      {isOpen && (
        <>
          {newFileParent === node.path && (
            <NewFileInputRow
              depth={depth + 1}
              value={newFileName}
              onChange={onNewFileNameChange}
              onSubmit={onSubmitNewFile}
              onCancel={onCancelNewFile}
              placeholder="NewFile.tsx"
            />
          )}
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              activePath={activePath}
              dirtyPaths={dirtyPaths}
              onOpenFile={onOpenFile}
              onDeletePath={onDeletePath}
              expanded={expanded}
              onToggle={onToggle}
              newFileParent={newFileParent}
              newFileName={newFileName}
              onNewFileNameChange={onNewFileNameChange}
              onStartNewFile={onStartNewFile}
              onSubmitNewFile={onSubmitNewFile}
              onCancelNewFile={onCancelNewFile}
            />
          ))}
        </>
      )}
    </div>
  );
}

/**
 * Real recursive file explorer over a LightningFS working directory (not a mock/flat list — see
 * the dev-workspace plan for why: the old MultiFileEditor's flat filename-button sidebar isn't a
 * real filesystem and doesn't reflect what will actually be committed).
 *
 * Props:
 *   fs, dir        — LightningFS instance + the cloned project's working directory
 *   activePath     — currently-open file, for highlighting
 *   dirtyPaths     — Set<string> of paths with unsaved changes, for the dot indicator
 *   onOpenFile     — (path) => void
 *   onCreateFile   — (path) => void — full relative path from the project root, e.g. "src/NewThing.tsx"
 *   onDeletePath   — (path) => void — a file's own path, or a whole folder's path (recursive)
 *   refreshToken   — bump this after a commit/checkout to force a re-read of the tree
 */
export default function FileTree({ fs, dir, activePath, dirtyPaths, onOpenFile, onCreateFile, onDeletePath, refreshToken }) {
  const [tree, setTree] = useState(null);
  const [expanded, setExpanded] = useState(() => new Set());
  const [error, setError] = useState("");
  // null = closed; "" = creating at the project root; a folder path = creating scoped to that
  // folder (2026-09-07, user report: typing "src/App.tsx" by hand created a sibling `src` folder
  // instead of landing in the existing one — a learner shouldn't have to get a path right by
  // typing it blind. The scoped input only ever needs the name/subpath from that folder down).
  const [newFileParent, setNewFileParent] = useState(null);
  const [newFileName, setNewFileName] = useState("");

  const reload = useCallback(async () => {
    try {
      const nodes = await readDirRecursive(fs, dir);
      setTree(nodes);
      setError("");
    } catch (err) {
      setError(err?.message || "Could not read files.");
    }
  }, [fs, dir]);

  useEffect(() => {
    reload();
  }, [reload, refreshToken]);

  // Whenever the open file changes — including right after creating one — make sure every folder
  // on its path is expanded, not just present in the tree data. Found live 2026-09-06: creating
  // `src/components/LowPackageBoard.tsx` via the + button wrote the file and opened its tab
  // correctly, but `src` stayed collapsed (a brand-new folder is never in `expanded` on its own),
  // so the tree looked exactly like nothing had happened — a learner had no way to tell the file
  // creation had actually worked.
  useEffect(() => {
    if (!activePath) return;
    const segments = activePath.split("/").slice(0, -1); // drop the filename itself
    if (segments.length === 0) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      let cur = "";
      for (const seg of segments) {
        cur = cur ? `${cur}/${seg}` : seg;
        next.add(cur);
      }
      return next;
    });
  }, [activePath]);

  function toggle(path) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  function startNewFileAt(folderPath) {
    setExpanded((prev) => (prev.has(folderPath) ? prev : new Set(prev).add(folderPath)));
    setNewFileParent(folderPath);
    setNewFileName("");
  }

  function cancelNewFile() {
    setNewFileParent(null);
    setNewFileName("");
  }

  function submitNewFile() {
    // Strips stray backticks along with slashes — a learner pasting a path straight out of a chat
    // message or instruction text (which writes paths as `` `src/App.tsx` `` in markdown) carries
    // the backtick characters along with it if they select the whole span, producing a real folder
    // literally named "`src" (confirmed live — a task's FILES tree showing both "`src" and "src" as
    // separate sibling folders, one holding the actual work and the other empty apart from an
    // auto-seeded file, which broke main.tsx's relative import of App.tsx across the split).
    const typed = newFileName.trim().replace(/^\/+/, "").replace(/`/g, "");
    if (!typed) return;
    const full = newFileParent ? `${newFileParent}/${typed}` : typed;
    onCreateFile(full);
    setNewFileName("");
    setNewFileParent(null);
  }

  return (
    <div className="ft-root">
      <div className="ft-header">
        <span>FILES</span>
        <button
          type="button"
          className="ft-new-btn"
          onClick={() => (newFileParent === "" ? cancelNewFile() : startNewFileAt(""))}
          title="New file at project root"
        >
          +
        </button>
      </div>
      {newFileParent === "" && (
        <NewFileInputRow
          depth={0}
          value={newFileName}
          onChange={setNewFileName}
          onSubmit={submitNewFile}
          onCancel={cancelNewFile}
          placeholder="src/NewFile.tsx"
        />
      )}
      {error ? (
        <div className="ft-error">{error}</div>
      ) : tree === null ? (
        <div className="ft-loading">Loading files…</div>
      ) : tree.length === 0 ? (
        <div className="ft-loading">No files yet.</div>
      ) : (
        tree.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            depth={0}
            activePath={activePath}
            dirtyPaths={dirtyPaths}
            onOpenFile={onOpenFile}
            onDeletePath={onDeletePath}
            expanded={expanded}
            onToggle={toggle}
            newFileParent={newFileParent}
            newFileName={newFileName}
            onNewFileNameChange={setNewFileName}
            onStartNewFile={startNewFileAt}
            onSubmitNewFile={submitNewFile}
            onCancelNewFile={cancelNewFile}
          />
        ))
      )}
    </div>
  );
}
