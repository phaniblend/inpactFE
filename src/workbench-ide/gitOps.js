/**
 * Thin isomorphic-git wrapper around the real OneDev remote, proxied same-origin through
 * server/git-proxy-router.js (mounted at /api/git). Verified against the real OneDev server before
 * any of this was written — see the git-proxy-router.js file header for the verification note.
 *
 * Every call here goes to a relative `/api/git/${projectPath}.git` URL, so the session cookie
 * (ipf_session) rides along automatically as a normal same-origin request — no separate auth
 * wiring needed on the client.
 */
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import { ENTRY_CANDIDATES } from "./previewBundler.js";

/**
 * isomorphic-git requires an absolute URL (it parses the remote with `new URL(...)` internally
 * and throws `UrlParseError` on a bare path) — found live testing this against the real browser,
 * not assumed. `window.location.origin` keeps this same-origin regardless of environment (dev
 * Vite server or a production build served by the same Express app), so the session cookie still
 * rides along exactly as it does for every other same-origin fetch in this app.
 */
function remoteUrl(projectPath) {
  return `${window.location.origin}/api/git/${projectPath}.git`;
}

async function pathExists(fs, path) {
  try {
    await fs.promises.stat(path);
    return true;
  } catch {
    return false;
  }
}

/** mkdir -p — LightningFS doesn't create parent directories for a nested writeFile on its own. */
async function ensureDir(fs, dir) {
  const parts = dir.split("/").filter(Boolean);
  let cur = "";
  for (const part of parts) {
    cur += `/${part}`;
    if (!(await pathExists(fs, cur))) {
      await fs.promises.mkdir(cur).catch(() => {});
    }
  }
}

/** rm -rf a single path — file or directory, recursing into children first. Missing path is a
 * silent no-op (matches rm -f semantics; nothing left to delete isn't an error here). */
async function rmrf(fs, path) {
  let stat;
  try {
    stat = await fs.promises.stat(path);
  } catch {
    return;
  }
  if (stat.isDirectory()) {
    const entries = await fs.promises.readdir(path);
    for (const entry of entries) await rmrf(fs, `${path}/${entry}`);
    await fs.promises.rmdir(path);
  } else {
    await fs.promises.unlink(path);
  }
}

/** Recursively copies a file or directory from one absolute path to another, creating destination
 * directories as needed. Used only by repairBacktickFolders below. */
async function copyTree(fs, fromAbs, toAbs) {
  const stat = await fs.promises.stat(fromAbs);
  if (stat.isDirectory()) {
    await ensureDir(fs, toAbs);
    const entries = await fs.promises.readdir(fromAbs);
    for (const entry of entries) await copyTree(fs, `${fromAbs}/${entry}`, `${toAbs}/${entry}`);
  } else {
    const content = await fs.promises.readFile(fromAbs);
    await ensureDir(fs, toAbs.slice(0, toAbs.lastIndexOf("/")));
    await fs.promises.writeFile(toAbs, content);
  }
}

/**
 * One-time repair for a real bug (fixed at the source in FileTree.jsx's submitNewFile): a learner
 * pasting a path straight out of chat or instruction text — which writes paths as `` `src/App.tsx` ``
 * in markdown — could carry the backtick characters into the "new file" input, producing a real
 * folder literally named "`src" alongside the correctly-named "src". Everything built before the
 * fix landed in the broken one, so a later file seeded into the correctly-named folder (e.g.
 * ensureBoilerplate's src/main.tsx) split a single project across two sibling folders — confirmed
 * live: main.tsx's `import App from "./App"` had nothing to resolve to, because App.tsx was sitting
 * in the other "`src" folder.
 *
 * Merges any root-level folder whose name contains a backtick into its backtick-stripped sibling
 * (creating that sibling first if it doesn't exist), then removes the now-empty broken folder.
 * Idempotent — a no-op once no backtick-named folder remains.
 */
export async function repairBacktickFolders(fs, dir) {
  let entries;
  try {
    entries = await fs.promises.readdir(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (name === ".git" || !name.includes("`")) continue;
    const cleanName = name.replace(/`/g, "");
    if (!cleanName) continue; // a name that was ALL backticks — nothing sane to merge into
    await copyTree(fs, `${dir}/${name}`, `${dir}/${cleanName}`);
    await rmrf(fs, `${dir}/${name}`);
  }
}

/** Clones once; a second call against an already-cloned dir is a cheap no-op. */
export async function ensureCloned({ fs, dir, projectPath, onProgress }) {
  if (await pathExists(fs, `${dir}/.git`)) return { cloned: false };
  await ensureDir(fs, dir);
  await git.clone({
    fs,
    http,
    dir,
    url: remoteUrl(projectPath),
    singleBranch: true,
    depth: 100,
    onProgress,
  });
  return { cloned: true };
}

export async function currentBranch({ fs, dir }) {
  return (await git.currentBranch({ fs, dir, fullname: false })) || "main";
}

export async function checkoutOrCreateBranch({ fs, dir, branch }) {
  const existing = await git.listBranches({ fs, dir });
  if (existing.includes(branch)) {
    await git.checkout({ fs, dir, ref: branch });
  } else {
    await git.branch({ fs, dir, ref: branch, checkout: true });
  }
}

/** [{ filepath, status: "added"|"modified"|"deleted" }] — unstaged + staged working-tree changes. */
export async function listChangedFiles({ fs, dir }) {
  const matrix = await git.statusMatrix({ fs, dir });
  // Row shape: [filepath, headStatus, workdirStatus, stageStatus]. Unchanged is [_,1,1,1].
  return matrix
    .filter(([, head, workdir, stage]) => !(head === 1 && workdir === 1 && stage === 1))
    .map(([filepath, head, workdir]) => ({
      filepath,
      status: workdir === 0 ? "deleted" : head === 0 ? "added" : "modified",
    }));
}

export async function readFile(fs, dir, filepath) {
  const buf = await fs.promises.readFile(`${dir}/${filepath}`, "utf8");
  return buf;
}

export async function writeFile(fs, dir, filepath, content) {
  const full = `${dir}/${filepath}`;
  const parentDir = full.slice(0, full.lastIndexOf("/"));
  await ensureDir(fs, parentDir);
  await fs.promises.writeFile(full, content, "utf8");
}

const DEFAULT_MAIN_TSX = `import { createRoot } from "react-dom/client";
import App from "./App";

// Real project boilerplate — the entry point that mounts your top-level component onto the page.
// A real Vite/CRA project ships this already, before you write a single component; it's here for
// the same reason, not something this task asks you to build. If App.tsx doesn't exist yet (or
// hasn't been given a default export yet), Preview shows a friendly placeholder instead of a
// crash — come back once your App component is ready.
const root = createRoot(document.getElementById("root")!);
root.render(
  typeof App === "function" ? (
    <App />
  ) : (
    <div style={{ padding: 24, fontFamily: "sans-serif", color: "#94a3b8" }}>
      Waiting for App.tsx to export a component…
    </div>
  )
);
`;

/**
 * Seeds src/main.tsx into a fresh working tree if the project has no real entry point yet, so
 * Live Preview works from the very first step instead of requiring the learner to build the entry
 * point themselves (user request, 2026-09-08: "make these default boilerplate load as soon as the
 * task is opened" — writing an app's mount point is real-project boilerplate you'd never actually
 * build by hand on the job, not a skill worth its own graded step). Idempotent and safe to call on
 * every boot: a no-op once any real entry point exists, whether auto-seeded earlier or written by
 * the learner themselves. Skipped for backend-only tasks, which have no frontend to mount.
 */
export async function ensureBoilerplate({ fs, dir, codingFocus }) {
  if (codingFocus === "backend") return;
  for (const candidate of ENTRY_CANDIDATES) {
    if (await pathExists(fs, `${dir}/${candidate}`)) return;
  }
  await writeFile(fs, dir, "src/main.tsx", DEFAULT_MAIN_TSX);
}

/** Deletes a single file or directory (recursively) from the working tree — e.g. junk created by
 * mistyping a path into "New file" (user report, 2026-09-07: pasting a URL into that field created
 * an `https:` folder no one could get rid of). Does NOT touch git history — an already-committed
 * file just shows as "deleted" in the Git panel's changed-files list until the learner commits, same
 * as any other real delete. */
export async function deletePath(fs, dir, filepath) {
  await rmrf(fs, `${dir}/${filepath}`);
}

/** Stages every changed file (including deletes) and commits; returns null if nothing changed. */
export async function commitAll({ fs, dir, message, author }) {
  const changed = await listChangedFiles({ fs, dir });
  if (!changed.length) return null;
  for (const { filepath, status } of changed) {
    if (status === "deleted") await git.remove({ fs, dir, filepath });
    else await git.add({ fs, dir, filepath });
  }
  return git.commit({ fs, dir, message, author });
}

export async function pushBranch({ fs, dir, projectPath, branch }) {
  return git.push({ fs, http, dir, url: remoteUrl(projectPath), ref: branch, remoteRef: branch });
}

const BUNDLABLE_EXT = /\.(tsx?|jsx?|css|json)$/;

/**
 * Reads every bundlable file (js/ts/jsx/tsx/css/json — the extensions previewBundler.js actually
 * understands) into a flat `{ [projectRelativePath]: content }` map, e.g. `{"src/App.tsx": "..."}`
 * — for the live preview, which needs the whole current project in memory at once rather than one
 * file at a time. Skips `.git` and anything not text-like enough to be part of a bundle (images,
 * lockfiles, etc.) so a binary file never hits `readFile(..., "utf8")`.
 */
export async function readAllFiles(fs, dir) {
  const out = {};
  async function walk(sub) {
    const full = sub ? `${dir}/${sub}` : dir;
    const entries = await fs.promises.readdir(full);
    for (const name of entries) {
      if (name === ".git") continue;
      const rel = sub ? `${sub}/${name}` : name;
      const stat = await fs.promises.stat(`${full}/${name}`);
      if (stat.isDirectory()) {
        await walk(rel);
      } else if (BUNDLABLE_EXT.test(name)) {
        out[rel] = await fs.promises.readFile(`${full}/${name}`, "utf8");
      }
    }
  }
  await walk("");
  return out;
}

/** Safety valve — deletes the local clone entirely so the next "Start developing" re-clones fresh. */
export async function deleteLocalClone(fs, dir) {
  await rmrf(fs, dir);
}
