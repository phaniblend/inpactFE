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
const TEAM_OPS_PROJECT_ID = 3;
const MODULE_LIBRARY_PROJECT_ID = 4;
// Only cohort / team-ops / module-library — product id 5 may be a desk on older boards.
const RESERVED_PROJECT_IDS = new Set([
  COHORT_PROJECT_ID,
  TEAM_OPS_PROJECT_ID,
  MODULE_LIBRARY_PROJECT_ID,
]);

/** Set when /ops/assign-live-fe runs so My tasks can list desk+live matches (API still filters LIVE-only). */
let runtimeOnedevCreds = null;

const app = express();

function field(desc, key) {
  return new RegExp(`^${key}:\\s*(.+)$`, "m").exec(desc || "")?.[1]?.trim() || "";
}

function isFrontendCodingTask(issue) {
  if (issue.state && issue.state !== "Open") return false;
  if (/^NeedsTutorial:\s*true/m.test(issue.description || "")) return false;
  if (/^Match(ed)?:/i.test(issue.title || "")) return false;
  if (/^(Application|Matched|Unassigned|Module|Cohort|Proposal):/i.test(issue.title || "")) return false;
  const trade = field(issue.description, "Trade").toLowerCase();
  if (trade !== "coding") return false;
  const focus = field(issue.description, "CodingFocus").toLowerCase();
  return !focus || focus === "frontend" || focus === "both" || focus.includes("front");
}

async function onedevFetch(creds, apiPath, opts = {}) {
  const auth = "Basic " + Buffer.from(`${creds.user}:${creds.pass}`).toString("base64");
  const r = await fetch(`${ONEDEV_BASE}/~api${apiPath}`, {
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
    throw new Error(`OneDev ${r.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`);
  }
  return data;
}

async function listAllIssues(creds) {
  const all = [];
  for (let offset = 0; offset < 5000; offset += 200) {
    const batch = await onedevFetch(creds, `/issues?query=&offset=${offset}&count=200`);
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 200) break;
  }
  return all;
}

/**
 * Assign every open FE Coding task (desk products + live products) to an aspirant.
 * POST /ops/assign-live-fe  header X-Bootstrap-Token + JSON { email, name?, user?, pass?, allFe?: true }
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
  const allFe = req.body?.allFe !== false; // default: every FE board, not just LIVE ids
  const takeOver = req.body?.takeOver !== false; // unassign others' Matched: so this email can own them
  if (!user || !pass) {
    return res.status(400).json({ error: "ONEDEV_API_USER/PASS missing (body or env)." });
  }
  const creds = { user, pass };
  runtimeOnedevCreds = creds;
  const log = [];

  try {
    const [projects, issues] = await Promise.all([
      onedevFetch(creds, "/projects?offset=0&count=100"),
      listAllIssues(creds),
    ]);
    const pname = (id) => projects.find((p) => p.id === id)?.name || `project-${id}`;
    log.push(`onedev=${ONEDEV_BASE} projects=${projects.length} issues=${issues.length} allFe=${allFe}`);

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
      const id = await onedevFetch(creds, "/issues", {
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
            `Note: bulk FE assign via inpactFE /ops/assign-live-fe`,
          ].join("\n"),
        }),
      });
      application = { id: typeof id === "number" ? id : id?.id };
      log.push(`created Application #${application.id}`);
    } else {
      log.push(`reusing Application #${application.id}`);
    }

    let matches = issues.filter(
      (i) => i.projectId === COHORT_PROJECT_ID && String(i.title || "").startsWith("Matched:")
    );

    const feTasks = issues.filter((i) => {
      if (RESERVED_PROJECT_IDS.has(i.projectId)) return false;
      if (!allFe && ![13, 14, 15, 16].includes(i.projectId)) return false;
      return isFrontendCodingTask(i);
    });

    const byProduct = {};
    for (const t of feTasks) {
      const n = pname(t.projectId);
      byProduct[n] = (byProduct[n] || 0) + 1;
    }
    log.push(`FE Coding open: ${feTasks.length} → ${JSON.stringify(byProduct)}`);

    let assigned = 0;
    let skipped = 0;
    let tookOver = 0;
    const alreadyOurs = new Set();

    for (const task of feTasks) {
      const existing = matches.find((m) => Number(/TaskId:\s*(\d+)/.exec(m.description || "")?.[1]) === task.id);
      if (existing) {
        const appId = Number(/ApplicationId:\s*(\d+)/.exec(existing.description || "")?.[1]);
        if (appId === application.id) {
          alreadyOurs.add(task.id);
          skipped++;
          continue;
        }
        if (!takeOver) {
          skipped++;
          log.push(`skip claimed #${task.number || task.id} [${pname(task.projectId)}]`);
          continue;
        }
        const newTitle = String(existing.title || "").replace(/^Matched:/, "Unassigned:");
        // OneDev wants raw text body (not JSON.stringify) on title/description routes.
        await onedevFetch(creds, `/issues/${existing.id}/title`, {
          method: "POST",
          body: newTitle,
        });
        tookOver++;
        log.push(`took over match #${existing.id} for task #${task.number || task.id}`);
        matches = matches.filter((m) => m.id !== existing.id);
      }

      await onedevFetch(creds, "/issues", {
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
      tookOver,
      matchesNow: alreadyOurs.size,
      byProduct,
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

/**
 * My tasks: API only returns LIVE_PRODUCT_IDS. After bulk desk+live assign, rebuild the list
 * from OneDev so every FE match for this session email shows up.
 */
app.get("/api/recruit/my-tasks", async (req, res) => {
  const creds =
    runtimeOnedevCreds ||
    (process.env.ONEDEV_API_USER && process.env.ONEDEV_API_PASS
      ? { user: process.env.ONEDEV_API_USER, pass: process.env.ONEDEV_API_PASS }
      : null);

  try {
    const meRes = await fetch(`${API_TARGET}/api/auth/me`, {
      headers: {
        Accept: "application/json",
        ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}),
      },
    });
    if (!meRes.ok) {
      return res.status(401).json({ error: "Not signed in" });
    }
    const me = await meRes.json();
    const email = String(me.email || "").trim().toLowerCase();
    if (!email) return res.status(401).json({ error: "Not signed in" });

    if (!creds) {
      // Fall through to API proxy behavior by forwarding.
      const upstream = await fetch(`${API_TARGET}/api/recruit/my-tasks`, {
        headers: {
          Accept: "application/json",
          ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}),
        },
      });
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.status(upstream.status);
      res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
      return res.send(buf);
    }

    const [projects, issues] = await Promise.all([
      onedevFetch(creds, "/projects?offset=0&count=100"),
      listAllIssues(creds),
    ]);
    const pname = (id) => projects.find((p) => p.id === id)?.name || `project-${id}`;
    const myAppIds = new Set(
      issues
        .filter(
          (i) =>
            i.projectId === COHORT_PROJECT_ID &&
            String(i.title || "").startsWith("Application:") &&
            String(i.description || "")
              .split("\n")
              .some((line) => line.trim().toLowerCase() === `email: ${email}`)
        )
        .map((i) => i.id)
    );
    const tasks = issues
      .filter(
        (i) =>
          i.projectId === COHORT_PROJECT_ID &&
          String(i.title || "").startsWith("Matched:") &&
          myAppIds.has(Number(/ApplicationId:\s*(\d+)/.exec(i.description || "")?.[1]))
      )
      .map((m) => {
        const taskId = Number(/TaskId:\s*(\d+)/.exec(m.description || "")?.[1]);
        const task = issues.find((i) => i.id === taskId);
        if (!task) return null;
        return {
          id: task.id,
          number: task.number,
          title: task.title,
          description: task.description,
          state: task.state,
          projectId: task.projectId,
          project: pname(task.projectId),
        };
      })
      .filter(Boolean);

    return res.json({ tasks });
  } catch (err) {
    console.error("[my-tasks override]", err.message);
    return res.status(500).json({ error: "Couldn't load your tasks — please try again." });
  }
});

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
