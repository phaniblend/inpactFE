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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");
const PORT = Number(process.env.PORT) || 3000;

// Set on Railway to the API service's private-network address, e.g.
// http://inpact-api.railway.internal:3000 — keeps this hop off the public internet entirely.
// Defaults to localhost so `npm run build && npm start` still works for a local smoke test
// against `node server/index.js` from the inpact_services checkout running on the default port.
const API_TARGET = (process.env.API_INTERNAL_URL || "http://127.0.0.1:3000").replace(/\/+$/, "");

const app = express();
app.use(express.json());

// Manual proxy, not http-proxy-middleware: two path-mounting attempts (`app.use("/api", ...)`
// with plain middleware and with pathFilter) both silently dropped or mismatched the /api prefix
// in production, found live twice. This is the exact pattern already proven working in
// server/index.js's /api/onedev and /api/mattermost routes — plain fetch, full control over the
// forwarded path.
app.use("/api", async (req, res) => {
  try {
    const target = `${API_TARGET}/api${req.url}`;
    const hasBody = !["GET", "HEAD"].includes(req.method);
    const upstream = await fetch(target, {
      method: req.method,
      // fetch()'s default redirect:"follow" silently followed the API's 302s itself and handed
      // back the *destination's* body with a 200 — found live on /auth/google/start: instead of
      // sending the browser to accounts.google.com, this proxy fetched Google's sign-in page
      // server-side and served its raw HTML from our own origin, breaking Google sign-in outright
      // (wrong origin for Google's relative assets/cookies/CSRF, no real Google session ever
      // established). "manual" makes fetch hand back the 3xx itself so we can forward it as a
      // real redirect below.
      redirect: "manual",
      headers: {
        Accept: "application/json",
        "Content-Type": req.headers["content-type"] || "application/json",
        // Session auth (auth-router.js's ipf_session cookie) rides on this — without forwarding
        // it, every signed-in request through this proxy would silently look logged-out.
        ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}),
      },
      body: hasBody ? JSON.stringify(req.body ?? {}) : undefined,
    });
    // Forward every Set-Cookie the upstream sends back (login, logout, refresh) — a single
    // res.setHeader would only keep the last one if there's more than one.
    const setCookie = typeof upstream.headers.getSetCookie === "function" ? upstream.headers.getSetCookie() : [];
    if (setCookie.length) res.setHeader("Set-Cookie", setCookie);

    const location = upstream.headers.get("location");
    if (upstream.status >= 300 && upstream.status < 400 && location) {
      res.status(upstream.status);
      res.setHeader("Location", location);
      return res.end();
    }

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    res.send(text);
  } catch (err) {
    console.error("[api-proxy] upstream error:", err.message);
    res.status(502).json({ error: "API upstream error" });
  }
});

app.use(express.static(distDir));

app.get("/", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`inpactFE static + /api proxy listening on :${PORT} -> ${API_TARGET}`);
});
