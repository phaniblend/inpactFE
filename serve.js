/**
 * FE static host + `/api` reverse proxy — lets the built React app keep every existing relative
 * `fetch("/api/...")` call working unchanged even though the API now lives in a separate Railway
 * service (in a separate repo, inpact_services). No FE application code had to change for the
 * split: the browser only ever talks to this same origin; this process is the only thing that
 * knows the API lives somewhere else.
 *
 * App uses HashRouter (see src/main.jsx) — every real navigation the browser sends this server
 * is for a static asset or `/` itself (client-side routes live after the `#`, never sent to the
 * server), so no SPA "rewrite everything unmatched to index.html" fallback is needed.
 *
 * Run: npm run build && npm start
 */
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");
const PORT = Number(process.env.PORT) || 3000;

// Set on Railway to the API service's private-network address, e.g.
// http://inpact-api.railway.internal:3000 — keeps this hop off the public internet entirely.
// Defaults to localhost so `npm run build && npm start` still works for a local smoke test
// against `node server/index.js` from the inpact_services checkout running on the default port.
const API_TARGET = (process.env.API_INTERNAL_URL || "http://127.0.0.1:3000").replace(/\/+$/, "");

const app = express();

app.use(
  "/api",
  createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    // Keep the /api prefix on the outgoing request — the API service's own routes expect it
    // (server/index.js mounts everything under /api/...).
  }),
);

app.use(express.static(distDir));

app.get("/", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`inpactFE static + /api proxy listening on :${PORT} -> ${API_TARGET}`);
});
