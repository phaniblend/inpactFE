import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../auth/useAuth.js";
import { getFs, projectDir } from "./gitFs.js";
import {
  ensureCloned,
  checkoutOrCreateBranch,
  currentBranch,
  listChangedFiles,
  readFile,
  writeFile,
  commitAll,
  pushBranch,
  deleteLocalClone,
} from "./gitOps.js";
import FileTree from "./FileTree.jsx";
import WorkspaceEditor from "./WorkspaceEditor.jsx";
import GitPanel from "./GitPanel.jsx";
import LivePreview from "./LivePreview.jsx";
import TaskStepsPanel from "./TaskStepsPanel.jsx";
import "./DevWorkspace.css";

/**
 * The real 3-pane dev environment for a task: file explorer | code editor | task/git sidebar, all
 * operating on a real local clone of the task's real OneDev project (via LightningFS +
 * isomorphic-git, proxied through server/git-proxy-router.js). Replaces the old static
 * "clone this URL and work in your own IDE" instruction block for tasks where a learner opts in
 * via "Start developing" — see Workbench.jsx.
 *
 * The right-hand sidebar is tabbed rather than git-only — found live 2026-09-02: showing the git
 * branch/changes panel as the *only* thing there buried the actual task-execution guidance (the
 * algorithm's own micro-steps, each with an "Assist me") behind nothing at all. "Steps" is the
 * default tab; "Git" is one click away, not gone.
 *
 * Props:
 *   projectPath  — OneDev project path, e.g. "OneInbox" (Workbench.jsx already computes this)
 *   branchHint   — suggested branch name, e.g. "js/build-assignment-ui" (Workbench.jsx already computes this)
 *   pullsUrl     — OneDev's own PR-list page for this project, for the "open a PR" link
 *   codingFocus  — "frontend" | "backend" | "both" | "" — picks WorkspaceEditor's compiler-options preset
 *   moduleTag    — the task's wired AssistModule tag, for TaskStepsPanel (null if none wired yet)
 */
export default function DevWorkspace({ projectPath, branchHint, pullsUrl, codingFocus, moduleTag }) {
  const { session } = useAuth();
  const [sidebarTab, setSidebarTab] = useState(moduleTag ? "steps" : "git");
  const fs = useMemo(() => getFs(), []);
  const dir = useMemo(() => projectDir(projectPath), [projectPath]);

  const [phase, setPhase] = useState("cloning"); // cloning | ready | error
  const [cloneProgress, setCloneProgress] = useState("");
  const [error, setError] = useState("");
  const [branch, setBranch] = useState(branchHint);
  const [refreshToken, setRefreshToken] = useState(0);

  const [openFiles, setOpenFiles] = useState([]);
  const [activePath, setActivePath] = useState(null);
  const [contents, setContents] = useState({});
  const [savedContents, setSavedContents] = useState({});
  const [changedFiles, setChangedFiles] = useState([]);

  const [pushing, setPushing] = useState(false);
  const [pushError, setPushError] = useState("");
  const [lastPushedBranch, setLastPushedBranch] = useState("");

  // StrictMode (see main.jsx) double-invokes effects in dev — mount, cleanup, mount again — as a
  // deliberate debugging aid. `useRef(true)`'s initializer only runs on the component's first
  // ever render, so the old version of this (cleanup-only, no setup) got permanently poisoned to
  // false by the first simulated cleanup and never recovered: every `refreshStatus()` call after
  // that silently no-opped its own `setChangedFiles`, forever, for the rest of that session. Found
  // live 2026-09-03 running the real end-to-end flow — the file was genuinely written and git
  // genuinely saw it as changed (confirmed by calling listChangedFiles directly), but the Git
  // panel stayed on "CHANGES (0)" and the Commit & Push button stayed disabled, a real dead end
  // for a learner trying to commit real work. Re-arming `mountedRef.current = true` in the setup
  // half (not just the cleanup) means the second, real mount recovers correctly.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  // Same StrictMode double-invoke as mountedRef above, but hitting actual git state instead of a
  // stale flag: the boot effect below does ensureCloned() then checkoutOrCreateBranch(). Under the
  // double-invoke, both mounts start their async work before either finishes, so two concurrent
  // ensureCloned() calls raced on the same dir — found live 2026-09-04 running the real end-to-end
  // flow a second time. The first invocation clones, creates the feature branch, and points HEAD at
  // it; the second invocation's ensureCloned also didn't see .git yet, so it ran its own full
  // git.clone() too — which, on completion, does what clone always does and resets HEAD to the
  // remote's default branch (main). That reset lands *after* the first invocation's checkout, so it
  // silently wins: every subsequent write and commit lands on local main, and pushing the (still
  // correctly-named) feature branch ref pushes its untouched original tip — a push that reports
  // success and shows the right branch name in the UI while the remote branch never actually
  // changes. This ref makes the actual clone+checkout work run only once no matter how many times
  // the effect fires — later invocations just await the same in-flight promise instead of racing it.
  const bootRef = useRef(null);
  // Per-path debounce timers for the disk write + status refresh triggered by typing (see
  // changeContent below for why this exists — found live testing this in the browser).
  const writeTimersRef = useRef({});
  useEffect(
    () => () => {
      for (const t of Object.values(writeTimersRef.current)) clearTimeout(t);
    },
    []
  );

  const dirtyPaths = useMemo(() => {
    const dirty = new Set();
    for (const path of openFiles) {
      if (contents[path] !== savedContents[path]) dirty.add(path);
    }
    return dirty;
  }, [openFiles, contents, savedContents]);

  const refreshStatus = useCallback(async () => {
    try {
      const changed = await listChangedFiles({ fs, dir });
      if (mountedRef.current) setChangedFiles(changed);
    } catch (err) {
      console.error("[dev-workspace] status refresh failed:", err.message);
    }
  }, [fs, dir]);

  // Clone (or reuse an existing local clone) then check out the task's suggested branch — real
  // git operations, not a toy sandbox. See gitOps.js/git-proxy-router.js for the plumbing.
  useEffect(() => {
    let cancelled = false;
    async function boot() {
      setPhase("cloning");
      setError("");
      try {
        if (!bootRef.current) {
          bootRef.current = (async () => {
            setCloneProgress("Cloning repository…");
            await ensureCloned({
              fs,
              dir,
              projectPath,
              onProgress: (evt) => {
                if (evt?.phase) setCloneProgress(`${evt.phase}${evt.loaded && evt.total ? ` (${evt.loaded}/${evt.total})` : ""}`);
              },
            });
            await checkoutOrCreateBranch({ fs, dir, branch: branchHint });
          })();
        }
        await bootRef.current;
        if (cancelled) return;
        const actual = await currentBranch({ fs, dir });
        if (cancelled) return;
        setBranch(actual);
        await refreshStatus();
        if (cancelled) return;
        setPhase("ready");
      } catch (err) {
        console.error("[dev-workspace] boot failed:", err);
        bootRef.current = null; // let a real retry actually re-attempt the clone, not replay this rejection
        if (!cancelled) {
          setError(err?.message || "Could not set up the workspace.");
          setPhase("error");
        }
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, [fs, dir, projectPath, branchHint, refreshStatus]);

  const openFile = useCallback(
    async (path) => {
      if (!(path in contents)) {
        try {
          const text = await readFile(fs, dir, path);
          setContents((prev) => ({ ...prev, [path]: text }));
          setSavedContents((prev) => ({ ...prev, [path]: text }));
        } catch (err) {
          console.error("[dev-workspace] read failed:", path, err.message);
          return;
        }
      }
      setOpenFiles((prev) => (prev.includes(path) ? prev : [...prev, path]));
      setActivePath(path);
    },
    [fs, dir, contents]
  );

  const closeTab = useCallback(
    (path) => {
      setOpenFiles((prev) => {
        const next = prev.filter((p) => p !== path);
        if (activePath === path) setActivePath(next[next.length - 1] || null);
        return next;
      });
    },
    [activePath]
  );

  const changeContent = useCallback(
    (path, value) => {
      // In-memory content updates immediately, every keystroke — Monaco's own `value` must track
      // exactly what was typed with no lag.
      setContents((prev) => ({ ...prev, [path]: value }));

      // The disk write + git-status refresh, however, is debounced per-path (400ms of no further
      // typing on that file) rather than firing on every keystroke. Found live testing this: an
      // un-debounced write-through fired dozens of concurrent `writeFile` + `statusMatrix` calls
      // against the same IndexedDB-backed LightningFS while typing a single sentence, and the
      // last one to resolve sometimes read back a stale/inconsistent status (git panel stuck
      // showing "no changes" despite the file genuinely differing from HEAD — confirmed the
      // underlying git logic was correct via a direct, single, non-concurrent call). Debouncing
      // is also just how a real editor's autosave behaves, not a per-keystroke toy submit.
      clearTimeout(writeTimersRef.current[path]);
      writeTimersRef.current[path] = setTimeout(() => {
        delete writeTimersRef.current[path];
        writeFile(fs, dir, path, value)
          .then(() => refreshStatus())
          .catch((err) => console.error("[dev-workspace] write failed:", path, err.message));
      }, 400);
    },
    [fs, dir, refreshStatus]
  );

  const createFile = useCallback(
    async (path) => {
      try {
        await writeFile(fs, dir, path, "");
        setRefreshToken((t) => t + 1);
        await openFile(path);
        await refreshStatus();
      } catch (err) {
        console.error("[dev-workspace] create failed:", path, err.message);
      }
    },
    [fs, dir, openFile, refreshStatus]
  );

  // Shared by commitPush, getCheckPayload, and the live preview — all three need whatever's on
  // disk to actually match the latest keystrokes, not whatever the 400ms debounce (see
  // changeContent) hasn't flushed yet. Found live 2026-09-03 testing the real end-to-end flow:
  // this clears the pending debounce timer and writes directly, bypassing the normal debounced
  // path's own `.then(() => refreshStatus())` — so a flush that races ahead of the 400ms window
  // (exactly what "Check my code" does, every time) wrote the file correctly but left the Git
  // panel's displayed change count stale at 0, right at the moment a learner is about to commit.
  // `listChangedFiles` itself was always correct — only the React state GitPanel reads from
  // wasn't being told to catch up.
  const flushPendingWrites = useCallback(async () => {
    const pending = Object.keys(writeTimersRef.current);
    for (const path of pending) {
      clearTimeout(writeTimersRef.current[path]);
      delete writeTimersRef.current[path];
      if (path in contents) await writeFile(fs, dir, path, contents[path]);
    }
    if (pending.length > 0) await refreshStatus();
  }, [fs, dir, contents, refreshStatus]);

  const commitPush = useCallback(
    async (message) => {
      setPushing(true);
      setPushError("");
      setLastPushedBranch("");
      try {
        await flushPendingWrites();
        const author = {
          name: session?.name || "IPF Learner",
          email: session?.email || "learner@inpact.local",
        };
        const sha = await commitAll({ fs, dir, message, author });
        if (!sha) {
          setPushError("Nothing to commit.");
          return;
        }
        // Commit-author vs. push-identity split, by design (see the dev-workspace plan doc):
        // the transport hop uses the same shared service credential every other OneDev call in
        // this app already uses (injected server-side, never exposed here); only the commit's
        // authored-by metadata reflects the real learner. OneDev's own "pushed by" attribution
        // will still show the shared account — a disclosed v1 limitation, not a hidden one.
        await pushBranch({ fs, dir, projectPath, branch });
        setSavedContents((prev) => ({ ...prev, ...contents }));
        setLastPushedBranch(branch);
        await refreshStatus();
      } catch (err) {
        console.error("[dev-workspace] commit/push failed:", err);
        setPushError(err?.message || "Push failed.");
      } finally {
        setPushing(false);
      }
    },
    [fs, dir, projectPath, branch, session, contents, refreshStatus, flushPendingWrites]
  );

  // Language signal for the code-check call: keyed off whatever file the learner is actually
  // looking at, same ext->language mapping WorkspaceEditor uses for Monaco itself.
  const LANGUAGE_BY_EXT = { ts: "typescript", tsx: "typescript", js: "javascript", jsx: "javascript", css: "css", html: "html" };
  function languageForActivePath(path) {
    const ext = path?.split(".").pop()?.toLowerCase();
    return LANGUAGE_BY_EXT[ext] || "typescript";
  }

  /**
   * Feeds "Check my code" (TaskStepsPanel): every file git considers changed from HEAD — not just
   * whatever's open in a tab right now — concatenated into one blob for /api/lessons/validate to
   * read against each not-yet-done step. Using git's own changed-file list (rather than `openFiles`)
   * means a step whose file the learner already closed still gets credited; flushing pending writes
   * first means the last few debounced keystrokes are actually on disk before we read them back.
   */
  const getCheckPayload = useCallback(async () => {
    await flushPendingWrites();
    const changed = await listChangedFiles({ fs, dir });
    const paths = changed.filter((f) => f.status !== "deleted").map((f) => f.filepath);
    const chunks = await Promise.all(
      paths.map(async (path) => {
        const text = path in contents ? contents[path] : await readFile(fs, dir, path).catch(() => "");
        return `// ---- ${path} ----\n${text}`;
      })
    );
    return {
      code: chunks.join("\n\n"),
      language: languageForActivePath(activePath),
      changedCount: paths.length,
    };
  }, [fs, dir, contents, activePath, flushPendingWrites]);

  const clearLocalWorkspace = useCallback(async () => {
    if (!window.confirm("Delete the local clone? Any uncommitted changes will be lost.")) return;
    try {
      await deleteLocalClone(fs, dir);
      setOpenFiles([]);
      setActivePath(null);
      setContents({});
      setSavedContents({});
      setChangedFiles([]);
      setRefreshToken((t) => t + 1);
      setPhase("cloning");
      bootRef.current = null; // the clone this guarded no longer exists on disk — let the boot effect redo it for real
      // Re-run the boot effect by forcing a dependency change is unnecessary — dir/projectPath
      // haven't changed, so trigger the same sequence directly.
      await ensureCloned({ fs, dir, projectPath });
      await checkoutOrCreateBranch({ fs, dir, branch: branchHint });
      setBranch(await currentBranch({ fs, dir }));
      await refreshStatus();
      setPhase("ready");
    } catch (err) {
      console.error("[dev-workspace] clear workspace failed:", err);
      setError(err?.message || "Could not clear the workspace.");
      setPhase("error");
    }
  }, [fs, dir, projectPath, branchHint, refreshStatus]);

  if (phase === "cloning") {
    return (
      <div className="dw-status">
        <div className="dw-spinner" aria-hidden />
        <div>{cloneProgress || "Setting up your workspace…"}</div>
      </div>
    );
  }
  if (phase === "error") {
    return (
      <div className="dw-status dw-status-error">
        <div>Could not set up the workspace: {error}</div>
      </div>
    );
  }

  return (
    <div className="dw-wrapper">
      <div className="dw-toolbar">
        <LivePreview fs={fs} dir={dir} flushPendingWrites={flushPendingWrites} />
      </div>
      <div className="dw-root">
        <FileTree
          fs={fs}
          dir={dir}
          activePath={activePath}
          dirtyPaths={dirtyPaths}
          onOpenFile={openFile}
          onCreateFile={createFile}
          refreshToken={refreshToken}
        />
        <WorkspaceEditor
          openFiles={openFiles}
          activePath={activePath}
          contents={contents}
          dirtyPaths={dirtyPaths}
          onActivate={setActivePath}
          onClose={closeTab}
          onChange={changeContent}
          codingFocus={codingFocus}
        />
        <div className="dw-sidebar">
          <div className="dw-sidebar-tabs">
            <button
              type="button"
              className={`dw-sidebar-tab${sidebarTab === "steps" ? " dw-sidebar-tab-active" : ""}`}
              onClick={() => setSidebarTab("steps")}
            >
              📋 Steps
            </button>
            <button
              type="button"
              className={`dw-sidebar-tab${sidebarTab === "git" ? " dw-sidebar-tab-active" : ""}`}
              onClick={() => setSidebarTab("git")}
            >
              🌿 Git{changedFiles.length ? ` (${changedFiles.length})` : ""}
            </button>
          </div>
          <div className="dw-sidebar-body">
            {sidebarTab === "steps" ? (
              <TaskStepsPanel moduleTag={moduleTag} getCheckPayload={getCheckPayload} />
            ) : (
              <GitPanel
                branch={branch}
                changedFiles={changedFiles}
                onCommitPush={commitPush}
                pushing={pushing}
                pushError={pushError}
                lastPushedBranch={lastPushedBranch}
                pullsUrl={pullsUrl}
                onClearLocalWorkspace={clearLocalWorkspace}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
