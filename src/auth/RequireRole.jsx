import { useLocation } from "react-router-dom";
import { useAuth, hasRole } from "./useAuth.js";
import { useConsumeLoginCode } from "./useConsumeLoginCode.js";
import CoreLogin from "./CoreLogin.jsx";

/** Wraps a screen so it's only reachable with a session holding one of `roles` — same check the
 * backend's own requireRole() middleware makes, so a UI that lets you in always means the API
 * will too. `roles={[]}` (or omitted) means "any signed-in session, role doesn't matter." Not
 * signed in at all -> shows the -core login form directly (no separate /login route to remember;
 * whatever screen you tried to reach is exactly where you land once you're in). */
export default function RequireRole({ roles = [], children }) {
  const { session, status, refresh, logout } = useAuth();
  const exchanging = useConsumeLoginCode(refresh);
  const location = useLocation();

  if (status === "loading" || exchanging) {
    return <div style={{ padding: 40, fontFamily: "monospace", color: "#64748b" }}>Checking session…</div>;
  }

  if (status === "signedOut") return <CoreLogin onSignedIn={refresh} />;

  if (roles.length > 0 && !hasRole(session, roles)) {
    return (
      <div style={{ padding: 40, maxWidth: 520, fontFamily: "-apple-system, sans-serif" }}>
        <h1 style={{ fontSize: 20 }}>Not authorized</h1>
        <p style={{ color: "#64748b" }}>
          Signed in as <strong>{session.name}</strong>
          {session.email ? <> ({session.email})</> : null}, but this screen needs one of:{" "}
          <code>{roles.join(", ")}</code>.
          {session.accountType === "core" && session.coreRole && (
            <>
              {" "}
              Your role is <strong>{session.coreRole}</strong>.
            </>
          )}
          {session.accountType === "js" && (
            <>
              {" "}
              Your current grants: <code>{(session.roles || []).join(", ") || "(none)"}</code>.
            </>
          )}
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => refresh()}
            style={{
              background: "#0891b2",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 16px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Refresh roles
          </button>
          <button
            type="button"
            onClick={() =>
              logout().then(() => {
                window.location.hash = `#${location.pathname}${location.search || ""}`;
              })
            }
            style={{
              background: "transparent",
              color: "#0e7490",
              border: "2px solid #67e8f9",
              borderRadius: 8,
              padding: "8px 16px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
          {session.accountType === "js" && (
            <a href="#/apply" style={{ alignSelf: "center", fontSize: 14, color: "#0891b2", fontWeight: 600 }}>
              Go to Apply →
            </a>
          )}
        </div>
      </div>
    );
  }

  return children;
}
