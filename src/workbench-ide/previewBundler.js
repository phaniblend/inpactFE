/**
 * A minimal, honest in-browser "bundler" for live-previewing a real frontend (React+TS) project
 * straight out of the workspace's real files — no server, no real bundler (Vite/webpack), no
 * install of arbitrary npm packages. This is the multi-file extension of the same client-only
 * approach the lesson engine already uses for single-file previews (see `generateReactPreview` in
 * `src/engines/LessonEditorOutputTabs.jsx`): React/ReactDOM/Babel load from the CDN, and code runs
 * directly in an iframe.
 *
 * All compiling happens *inside* the generated iframe's own script, not in the parent app page —
 * found live testing this: `@monaco-editor/react` (already used throughout this app) sets up
 * Monaco's own AMD loader (`window.define`/`window.require`) on the parent page, and Babel
 * Standalone's UMD wrapper checks for an AMD loader before falling back to a plain global
 * (`window.Babel`) — so loading Babel into the parent page silently registers it as an anonymous
 * AMD module instead, and `window.Babel` never gets set (script `onload` fires normally; only the
 * global assignment is skipped). A fresh iframe has no such loader present, so this exact problem
 * is why `generateReactPreview` already does its Babel-loading and compiling inside the iframe, and
 * why this file follows the same pattern rather than pre-compiling in the parent page.
 *
 * Deliberately scoped to what a browser can actually do without a real bundler: local relative
 * imports (.ts/.tsx/.js/.jsx), plain global CSS imports, and JSON imports all resolve for real;
 * `react`/`react-dom`/`react-dom/client` map to the CDN globals; anything else (a real npm
 * package) is stubbed with a clear one-line note in the preview rather than a silent crash —
 * there's no bundler here to actually fetch and link a real dependency, and pretending otherwise
 * would just trade an honest limitation for a more confusing failure.
 */

const ENTRY_CANDIDATES = ["src/main.tsx", "src/main.ts", "src/main.jsx", "src/main.js", "src/index.tsx", "src/index.jsx"];

export function findEntryPoint(fileMap) {
  return ENTRY_CANDIDATES.find((p) => p in fileMap) || null;
}

/** JSON-safe embedding of a value into a generated <script> — avoids </script> breaking out. */
function jsonForScript(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * Builds the full preview HTML document. `fileMap` is `{ [projectRelativePath]: contents }` for
 * every real file currently in the workspace; `entryPath` is normally `findEntryPoint(fileMap)`.
 * The raw file map travels into the iframe as data — compiling and linking happen there, lazily,
 * only for files actually reached by following the entry point's real require graph.
 */
export function buildPreviewDocument(fileMap, entryPath) {
  if (!entryPath) {
    return simpleMessageHtml("No entry point found — expected one of: " + ENTRY_CANDIDATES.join(", "));
  }

  const fileMapJson = jsonForScript(fileMap);
  const entryJson = jsonForScript(entryPath);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #fff; font-family: "Comfortaa", system-ui, sans-serif; }
    .preview-error-box { background: #fff1f0; border: 1px solid #ffa39e; color: #c0392b; padding: 12px 16px; border-radius: 6px; font-family: ui-monospace, monospace; font-size: 12px; white-space: pre-wrap; margin: 16px; }
    .preview-note-box { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; padding: 8px 14px; font-size: 12px; font-family: "Comfortaa", system-ui, sans-serif; }
    .preview-loading { padding: 24px; color: #94a3b8; font-size: 13px; font-family: "Comfortaa", system-ui, sans-serif; }
  </style>
</head>
<body>
  <div id="preview-notes"></div>
  <div id="root"><div class="preview-loading">Loading preview…</div></div>
  <script src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.26.0/babel.min.js"
          onerror="document.getElementById('root').innerHTML='<div class=&quot;preview-error-box&quot;>Failed to load Babel from the CDN — check your network.</div>'"></script>
  <script>
    (function () {
      var fileMap = ${fileMapJson};
      var entry = ${entryJson};
      var moduleCache = {};   // resolved path -> { exports }
      var compiledCache = {}; // resolved path -> compiled CommonJS source
      var unsupportedNoted = {};

      function showError(title, detail) {
        var box = document.createElement("div");
        box.className = "preview-error-box";
        box.textContent = detail ? title + "\\n\\n" + detail : title;
        document.body.insertBefore(box, document.body.firstChild);
      }
      window.onerror = function (message, _src, _line, _col, error) {
        showError("Preview error: " + message, error && error.stack ? String(error.stack) : "");
        return true;
      };
      window.addEventListener("unhandledrejection", function (e) {
        var reason = e.reason;
        showError("Preview error: " + (reason && reason.message ? reason.message : String(reason)));
      });

      function noteUnsupported(spec) {
        if (unsupportedNoted[spec]) return;
        unsupportedNoted[spec] = true;
        var n = document.createElement("div");
        n.className = "preview-note-box";
        n.textContent = "Preview note: \\"" + spec + "\\" isn't available in the browser preview (no real npm install here) — using an empty stub.";
        document.getElementById("preview-notes").appendChild(n);
      }

      /** Resolves a relative import spec against fromPath, guessing common extensions/index files
       * — the same resolution a real bundler would do, just implemented by hand since there isn't
       * one here. Returns null for a bare (non-relative) spec. */
      function resolveRelative(fromPath, spec) {
        if (spec.charAt(0) !== ".") return null;
        var fromDir = fromPath.split("/").slice(0, -1);
        var stack = fromDir.slice();
        var parts = spec.split("/");
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          if (part === "" || part === ".") continue;
          if (part === "..") stack.pop();
          else stack.push(part);
        }
        var base = stack.join("/");
        var candidates = [
          base, base + ".tsx", base + ".ts", base + ".jsx", base + ".js", base + ".css", base + ".json",
          base + "/index.tsx", base + "/index.ts", base + "/index.jsx", base + "/index.js",
        ];
        for (var j = 0; j < candidates.length; j++) {
          if (Object.prototype.hasOwnProperty.call(fileMap, candidates[j])) return candidates[j];
        }
        return null;
      }

      function compile(path) {
        if (compiledCache[path] !== undefined) return compiledCache[path];
        var isTsx = /\\.(tsx|jsx)$/.test(path);
        var result = Babel.transform(fileMap[path], {
          filename: path,
          presets: [["typescript", { isTSX: isTsx, allExtensions: isTsx }], ["react", { runtime: "classic" }]],
          plugins: ["transform-modules-commonjs"],
        });
        compiledCache[path] = result.code;
        return result.code;
      }

      function requireModule(spec, fromPath) {
        if (spec === "react") return window.React;
        if (spec === "react-dom" || spec === "react-dom/client") return window.ReactDOM;

        var resolved = fromPath ? resolveRelative(fromPath, spec) : spec;
        if (!resolved || !Object.prototype.hasOwnProperty.call(fileMap, resolved)) {
          noteUnsupported(spec);
          return {}; // no real bundler to fetch/link a real dependency — an honest empty stub
        }
        if (moduleCache[resolved]) return moduleCache[resolved].exports;

        if (resolved.slice(-4) === ".css") {
          var style = document.createElement("style");
          style.setAttribute("data-preview-css", resolved);
          style.textContent = fileMap[resolved];
          document.head.appendChild(style);
          var empty = {};
          moduleCache[resolved] = { exports: empty };
          return empty;
        }
        if (resolved.slice(-5) === ".json") {
          var parsed = JSON.parse(fileMap[resolved]);
          moduleCache[resolved] = { exports: parsed };
          return parsed;
        }

        var mod = { exports: {} };
        moduleCache[resolved] = mod; // set before running, so circular requires see the in-progress object
        try {
          var code = compile(resolved);
          var fn = new Function("module", "exports", "require", code);
          fn(mod, mod.exports, function (s) {
            return requireModule(s, resolved);
          });
        } catch (err) {
          showError("Error compiling/running " + resolved + ": " + err.message, err.stack || "");
        }
        return mod.exports;
      }

      try {
        requireModule(entry, null);
      } catch (err) {
        showError("Preview failed to start: " + err.message, err.stack || "");
      }
    })();
  </script>
</body>
</html>`;
}

function simpleMessageHtml(message) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;font-family: "Comfortaa", system-ui, sans-serif;color:#64748b;font-size:14px;white-space:pre-wrap">${String(
    message
  ).replace(/</g, "&lt;")}</body></html>`;
}
