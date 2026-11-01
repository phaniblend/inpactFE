/**
 * One LightningFS (IndexedDB-backed virtual filesystem) instance per browser profile, shared by
 * every task's dev workspace. Each OneDev project gets its own directory so a learner's local
 * clone persists across reloads/sessions instead of re-cloning every time they reopen a task —
 * the whole point of a real filesystem over the old toy editor's throwaway buffer.
 */
import { Buffer } from "buffer";
import LightningFS from "@isomorphic-git/lightning-fs";

// isomorphic-git's browser build expects a global `Buffer` (a Node built-in Vite doesn't polyfill
// by default) — found live testing this in the browser ("Missing Buffer dependency"), not assumed
// up front. Setting it here guarantees it's in place before any git/LightningFS call runs, since
// every dev-workspace module imports getFs()/this file before touching git operations.
if (typeof window !== "undefined" && !window.Buffer) {
  window.Buffer = Buffer;
}

const fs = new LightningFS("ipf-workbench-fs");

export function getFs() {
  return fs;
}

/**
 * Sanitized working directory per project + task branch (audit P26, 2026-11-01).
 * One dir per project reused every task's dirty tree (prior learners' pasted answers, half-written
 * types, gym-pass examples). Keying by branchHint (includes task.id) gives each matched instance
 * a clean LightningFS path so checkout doesn't inherit someone else's working tree.
 */
export function projectDir(projectPath, branchHint = "") {
  const safeProject = String(projectPath || "unknown").replace(/[^a-zA-Z0-9/_-]/g, "-");
  const safeBranch = String(branchHint || "main")
    .replace(/[^a-zA-Z0-9/_-]/g, "-")
    .slice(0, 80);
  return `/projects/${safeProject}/${safeBranch}`;
}
