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
const ONEDEV_BASE = (
  process.env.ONEDEV_INTERNAL_URL ||
  process.env.ONEDEV_URL ||
  "http://onedev.railway.internal:6610"
).replace(/\/+$/, "");
const OPS_TOKEN = process.env.RECRUIT_BOOTSTRAP_TOKEN || "IPAAL-FE-BOOTSTRAP-20261031";
const COHORT_PROJECT_ID = 2;
const LIVE_PRODUCT_IDS = new Set([13, 14, 15, 16]);

const app = express();

/**
 * One-shot: assign every open LIVE-product FE Coding task to an aspirant email.
 * Hits the sibling OneDev on private networking (public OneDev domain is not provisioned).
 * POST /ops/assign-live-fe  header X-Bootstrap-Token + JSON { email, name?, user?, pass? }
 */
app.post("/ops/assign-live-fe", express.json({ limit: "1mb" }), async (req, res) => {
  const token = String(req.get("X-Bootstrap-Token") || req.body?.token || "");
  if (!token || token !== OPS_TOKEN) {
    return res.status(401).json({ error: "Invalid bootstrap token." });
  }
  const email = String(req.body?.email || "bsit.setty@gmail.com").trim().toLowerCase();
  const name = String(req.body?.name || 'Venkat "Phani" Bhushan').trim();
  const user = String(req.body?.user || process.env.ONEDEV_API_USER || "").trim();
  const pass = String(req.body?.pass || process.env.ONEDEV_API_PASS || "");
  if (!user || !pass) {
    return res.status(400).json({ error: "ONEDEV_API_USER/PASS missing (body or env)." });
  }
  const auth = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
  const log = [];

  async function od(path, opts = {}) {
    const r = await fetch(`${ONEDEV_BASE}/~api${path}`, {
      ...opts,
      headers: {
        Authorization: auth,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(opts.headers || {}),
      },
    });
    const text = await r.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!r.ok) {
      const err = new Error(`OneDev ${r.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`);
      err.status = r.status;
      throw err;
    }
    return data;
  }

  async function listAllIssues() {
    const all = [];
    for (let offset = 0; offset < 5000; offset += 200) {
      const batch = await od(`/issues?query=&offset=${offset}&count=200`);
      if (!Array.isArray(batch) || batch.length === 0) break;
      all.push(...batch);
      if (batch.length < 200) break;
    }
    return all;
  }

  function field(desc, key) {
    return new RegExp(`^${key}:\\s*(.+)$`, "m").exec(desc || "")?.[1]?.trim() || "";
  }

  try {
    const [projects, issues] = await Promise.all([
      od("/projects?offset=0&count=100"),
      listAllIssues(),
    ]);
    const pname = (id) => projects.find((p) => p.id === id)?.name || `project-${id}`;
    log.push(`onedev=${ONEDEV_BASE} projects=${projects.length} issues=${issues.length}`);

    const apps = issues.filter(
      (i) =>
        i.projectId === COHORT_PROJECT_ID &&
        String(i.title || "").startsWith("Application:") &&
        String(i.description || "")
          .split("\n")
          .some((line) => line.trim().toLowerCase() === `email: ${email}`)
    );
    let application = apps.sort((a, b) => b.id - a.id)[0] || null;
    if (!application) {
      const id = await od("/issues", {
        method: "POST",
        body: JSON.stringify({
          projectId: COHORT_PROJECT_ID,
          title: `Application: ${name} — Coding`,
          description: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Stated trade: Coding`,
            `SkillLevel: js`,
            `CodingFocus: frontend`,
            `OwnershipAck: true`,
            `OwnershipAckAt: ${new Date().toISOString()}`,
            `Note: bulk LIVE FE assign via inpactFE /ops/assign-live-fe`,
          ].join("\n"),
        }),
      });
      application = { id: typeof id === "number" ? id : id?.id };
      log.push(`created Application #${application.id}`);
    } else {
      log.push(`reusing Application #${application.id}`);
    }

    const matches = issues.filter(
      (i) => i.projectId === COHORT_PROJECT_ID && String(i.title || "").startsWith("Matched:")
    );
    const claimed = new Set(
      matches
        .map((m) => Number(/TaskId:\s*(\d+)/.exec(m.description || "")?.[1]))
        .filter((n) => Number.isFinite(n) && n > 0)
    );
    const alreadyOurs = new Set(
      matches
        .filter((m) => Number(/ApplicationId:\s*(\d+)/.exec(m.description || "")?.[1]) === application.id)
        .map((m) => Number(/TaskId:\s*(\d+)/.exec(m.description || "")?.[1]))
        .filter((n) => Number.isFinite(n) && n > 0)
    );

    const feTasks = issues.filter((i) => {
      if (!LIVE_PRODUCT_IDS.has(i.projectId)) return false;
      if (i.state && i.state !== "Open") return false;
      if (/^NeedsTutorial:\s*true/m.test(i.description || "")) return false;
      if (/^Match(ed)?:/i.test(i.title || "")) return false;
      const trade = field(i.description, "Trade").toLowerCase();
      if (trade !== "coding") return false;
      const focus = field(i.description, "CodingFocus").toLowerCase();
      return !focus || focus === "frontend" || focus === "both" || focus.includes("front");
    });

    let assigned = 0;
    let skipped = 0;
    for (const task of feTasks) {
      if (alreadyOurs.has(task.id) || claimed.has(task.id)) {
        skipped++;
        continue;
      }
      await od("/issues", {
        method: "POST",
        body: JSON.stringify({
          projectId: COHORT_PROJECT_ID,
          title: `Matched: ${name} → ${task.title}`,
          description: [
            `ApplicationId: ${application.id}`,
            `TaskId: ${task.id}`,
            `Task: #${task.number || task.id} "${task.title}" in ${pname(task.projectId)}`,
            `StatedTrade: Coding`,
            `AssignedByEmail: ${email}`,
            `— placed by inpactFE /ops/assign-live-fe`,
          ].join("\n"),
        }),
      });
      claimed.add(task.id);
      alreadyOurs.add(task.id);
      assigned++;
      log.push(`✓ #${task.number || task.id} [${pname(task.projectId)}] ${task.title}`);
    }

    res.json({
      ok: true,
      email,
      applicationId: application.id,
      feTaskCount: feTasks.length,
      assigned,
      skipped,
      matchesNow: alreadyOurs.size,
      log,
    });
  } catch (err) {
    console.error("[ops/assign-live-fe]", err.message);
    res.status(500).json({ error: err.message, log });
  }
});

// Raw byte capture, not express.json() — found live 2026-09-05: express.json() only parses
// application/json bodies, leaving req.body as {} for anything else (notably the binary
// application/x-git-upload-pack-request bodies the in-browser dev workspace's real git
// clone/commit/push sends through here). The old code below then did
// `JSON.stringify(req.body ?? {})`, silently replacing that entire binary negotiation payload
// with the two-byte string "{}" before forwarding it upstream — OneDev received a garbled/empty
// request and fell back to some default response instead of erroring, so the clone *looked*
// successful but was silently missing the exact commit the negotiation should have asked for
// (surfaced as "Failed to checkout main because commit X is not available locally" much later,
// nowhere near this file — traced end to end with a from-scratch repro before touching this line).
// `type: () => true` matches every request body regardless of Content-Type; GET/HEAD requests
// simply produce an empty Buffer. Raw bytes of a JSON body are still valid JSON once forwarded, so
// this doesn't change behavior for any existing JSON route — it only stops corrupting the ones
// that were never JSON to begin with.
app.use(express.raw({ type: () => true, limit: "80mb" }));

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
        Accept: req.headers["accept"] || "application/json",
        "Content-Type": req.headers["content-type"] || "application/json",
        // Session auth (auth-router.js's ipf_session cookie) rides on this — without forwarding
        // it, every signed-in request through this proxy would silently look logged-out.
        ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}),
      },
      body: hasBody ? req.body : undefined,
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

    // Buffered, not text-decoded — the old `.text()` here ran every response (git packfiles
    // included) through UTF-8 text decoding, which corrupts arbitrary binary bytes that aren't
    // valid UTF-8. Bytes in, bytes out, same as the git-proxy-router.js pattern this mirrors.
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    res.send(buf);
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
