import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Sign-in gate for RequireRole (Workbench, Assist Me, ops).
 * Aspirants (Google) are first — that's who lands here from My tasks.
 * Core LDAP is secondary for PD/ID/CD/PMGT.
 */
export default function CoreLogin({ onSignedIn }) {
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [showCoreForm, setShowCoreForm] = useState(false);
  const location = useLocation();

  const googleReturnTo = `${location.pathname}${location.search || ""}`;
  const googleStartHref = `/api/auth/google/start?returnTo=${encodeURIComponent(
    googleReturnTo.startsWith("/") ? `#${googleReturnTo}` : googleReturnTo
  )}`;

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/core-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign-in failed");
      onSignedIn();
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        boxSizing: "border-box",
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
        background: "linear-gradient(180deg, #eef5f7 0%, #f8fafc 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#fff",
          borderRadius: 12,
          padding: "28px 28px 24px",
          boxShadow: "0 12px 40px rgba(15, 23, 42, 0.08)",
        }}
      >
        <div
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#0891b2",
            marginBottom: 8,
          }}
        >
          Sign in
        </div>
        <h1 style={{ fontSize: 22, margin: "0 0 8px", color: "#0f172a" }}>Welcome back</h1>
        <p style={{ margin: "0 0 22px", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
          Aspirants: continue with the same Google account you used to apply. Core team: use your
          username below.
        </p>

        <a
          href={googleStartHref}
          style={{
            ...buttonStyle,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            textDecoration: "none",
            background: "#fff",
            color: "#0f172a",
            border: "2px solid #0e7490",
            marginBottom: 8,
          }}
        >
          <GoogleMark />
          Continue with Google
        </a>
        <p style={{ margin: "0 0 18px", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
          Same Gmail you used on Apply
        </p>

        {import.meta.env.DEV && (
          <a
            href={`/api/auth/dev-js-login?returnTo=${encodeURIComponent(
              googleReturnTo.startsWith("/") ? `#${googleReturnTo}` : googleReturnTo
            )}`}
            style={{
              ...buttonStyle,
              display: "block",
              textAlign: "center",
              textDecoration: "none",
              background: "#fff",
              color: "#94a3b8",
              border: "1px dashed #cbd5e1",
              marginBottom: 16,
              fontSize: 12,
            }}
          >
            Dev: sign in as test aspirant
          </a>
        )}

        {!showCoreForm ? (
          <button
            type="button"
            onClick={() => setShowCoreForm(true)}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              color: "#64748b",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              padding: "8px 0",
            }}
          >
            Core team? Sign in with username →
          </button>
        ) : (
          <>
            <div
              style={{
                margin: "8px 0 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#cbd5e1",
                fontSize: 12,
              }}
            >
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              core team
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
                Username
                <input
                  required
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="priya_sharma"
                  style={inputStyle}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
                Password
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                />
              </label>
              <button type="submit" disabled={status === "loading"} style={buttonStyle}>
                {status === "loading" ? "Signing in…" : "Sign in"}
              </button>
              {error && <div style={{ color: "#991b1b", fontSize: 13 }}>{error}</div>}
            </form>
          </>
        )}

        <p style={{ marginTop: 20, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
          First time? <Link to="/apply">Apply</Link>
          {" · "}
          <Link to="/join">How it works</Link>
        </p>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

const inputStyle = { padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 14 };
const buttonStyle = {
  padding: "11px 14px",
  background: "#0891b2",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};
