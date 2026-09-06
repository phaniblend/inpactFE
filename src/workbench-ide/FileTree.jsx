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

function TreeNode({ node, depth, activePath, dirtyPaths, onOpenFile, expanded, onToggle }) {
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
      </div>
      {isOpen &&
        node.children.map((child) => (
          <TreeNode
            key={child.path}
            node={child}
            depth={depth + 1}
            activePath={activePath}
            dirtyPaths={dirtyPaths}
            onOpenFile={onOpenFile}
            expanded={expanded}
            onToggle={onToggle}
          />
        ))}
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
 *   onCreateFile   — (path) => void — learner-typed relative path, e.g. "src/NewThing.tsx"
 *   refreshToken   — bump this after a commit/checkout to force a re-read of the tree
 */
export default function FileTree({ fs, dir, activePath, dirtyPaths, onOpenFile, onCreateFile, refreshToken }) {
  const [tree, setTree] = useState(null);
  const [expanded, setExpanded] = useState(() => new Set());
  const [error, setError] = useState("");
  const [newFileOpen, setNewFileOpen] = useState(false);
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

  function submitNewFile() {
    const name = newFileName.trim().replace(/^\/+/, "");
    if (!name) return;
    onCreateFile(name);
    setNewFileName("");
    setNewFileOpen(false);
  }

  return (
    <div className="ft-root">
      <div className="ft-header">
        <span>FILES</span>
        <button type="button" className="ft-new-btn" onClick={() => setNewFileOpen((v) => !v)} title="New file">
          +
        </button>
      </div>
      {newFileOpen && (
        <div className="ft-new-row">
          <input
            autoFocus
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitNewFile();
              if (e.key === "Escape") setNewFileOpen(false);
            }}
            placeholder="src/NewFile.tsx"
          />
        </div>
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
            expanded={expanded}
            onToggle={toggle}
          />
        ))
      )}
    </div>
  );
}
