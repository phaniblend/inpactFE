import { useCallback, useEffect, useState } from "react";
import { readAllFiles } from "./gitOps.js";
import { findEntryPoint, buildPreviewDocument } from "./previewBundler.js";
import "./LivePreview.css";

/**
 * Live, browser-only preview of the workspace's current frontend (React+TS) state — see
 * previewBundler.js's file header for exactly what this can and can't do (no real bundler, no
 * npm-installed dependencies beyond react/react-dom, plain CSS/JSON imports only, and — the reason
 * all compiling happens inside the generated iframe rather than here — Babel Standalone conflicts
 * with Monaco's own AMD loader if loaded into this parent page). Backend (Express/Node) tasks have
 * no live-run preview; this is deliberately frontend-only for now.
 *
 * Props: fs, dir (the LightningFS working directory), flushPendingWrites (from DevWorkspace, so a
 * preview taken right after typing reflects the latest keystrokes, not a stale disk read).
 */
export default function LivePreview({ fs, dir, flushPendingWrites }) {
  const [open, setOpen] = useState(false);
  const [html, setHtml] = useState("");
  // Bumped on every build and used as the iframe's `key` — found live testing this: updating
  // `srcDoc` on an *already-mounted* iframe doesn't reliably re-run its scripts in every browser
  // (confirmed here by comparing a freshly-created iframe with srcdoc set before insertion, which
  // worked, against React re-rendering the same iframe node with a new srcDoc prop, which stayed
  // blank). Changing `key` forces React to mount a brand-new iframe per build instead of mutating
  // the existing one, which is the version of this that's actually reliable.
  const [buildVersion, setBuildVersion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buildAndShow = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await flushPendingWrites();
      const fileMap = await readAllFiles(fs, dir);
      const entry = findEntryPoint(fileMap);
      setHtml(buildPreviewDocument(fileMap, entry));
      setBuildVersion((v) => v + 1);
    } catch (err) {
      setError(err?.message || "Could not build the preview.");
    } finally {
      setLoading(false);
    }
  }, [fs, dir, flushPendingWrites]);

  useEffect(() => {
    if (open) buildAndShow();
  }, [open, buildAndShow]);

  return (
    <>
      <button type="button" className="lp-open-btn" onClick={() => setOpen(true)}>
        🖥️ Preview
      </button>
      {open && (
        <div className="lp-overlay" role="presentation" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="lp-modal" role="dialog" aria-modal="true" aria-label="Live preview">
            <div className="lp-header">
              <span>🖥️ Live preview — frontend only, no real bundler (see note below if something's missing)</span>
              <div className="lp-header-actions">
                <button type="button" className="lp-refresh-btn" onClick={buildAndShow} disabled={loading}>
                  {loading ? "Building…" : "↻ Refresh"}
                </button>
                <button type="button" className="lp-close-btn" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
            </div>
            <div className="lp-body">
              {error ? (
                <div className="lp-error">{error}</div>
              ) : html ? (
                <iframe key={buildVersion} title="Live preview" srcDoc={html} className="lp-iframe" sandbox="allow-scripts" />
              ) : (
                <div className="lp-loading">Building preview…</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
