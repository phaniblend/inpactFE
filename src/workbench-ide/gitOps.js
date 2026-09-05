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
  async function rmrf(path) {
    let stat;
    try {
      stat = await fs.promises.stat(path);
    } catch {
      return;
    }
    if (stat.isDirectory()) {
      const entries = await fs.promises.readdir(path);
      for (const entry of entries) await rmrf(`${path}/${entry}`);
      await fs.promises.rmdir(path);
    } else {
      await fs.promises.unlink(path);
    }
  }
  await rmrf(dir);
}
