import { Link, useLocation } from "react-router-dom";
import InpactLogo from "./components/InpactLogo.jsx";
import { useAuth } from "./auth/useAuth.js";
import "./GlobalHeader.css";

// Routes that already render their own logo — we still show auth nav, but skip a second logo.
const ALREADY_BRANDED_PREFIXES = ["/lessons", "/join", "/try"];
const ALREADY_BRANDED_EXACT = new Set(["/", "/register"]);

function isAlreadyBranded(pathname) {
  return ALREADY_BRANDED_EXACT.has(pathname) || ALREADY_BRANDED_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * Persistent header chrome on every route: Log in (signed out) or Home / My tasks + Sign out (signed in).
 * Fixed so it never reflows page layouts; high z-index so cinematic / lesson chrome cannot cover it.
 */
export default function GlobalHeader() {
  const location = useLocation();
  const { status, session } = useAuth();
  const branded = isAlreadyBranded(location.pathname);
  const onHome = location.pathname === "/home";
  const onMyTasks = location.pathname === "/workbench";
  const signedIn = status === "signedIn";
  const signedOut = status === "signedOut";
  const isAspirant = session?.accountType === "js";
  // After Google OAuth, aspirants land on their desk — not the public cinematic.
  const googleHref = `/api/auth/google/start?returnTo=${encodeURIComponent("#/home")}`;

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.hash = "#/";
    window.location.reload();
  }

  return (
    <header className="gh-bar" aria-label="Inpact">
      {!branded ? (
        <Link to={signedIn && isAspirant ? "/home" : "/"} className="gh-logo-link" aria-label="Inpact home">
          <InpactLogo height={44} />
        </Link>
      ) : (
        <span className="gh-logo-spacer" aria-hidden />
      )}
      <nav className="gh-nav" aria-label="Account">
        {signedIn ? (
          <>
            {isAspirant ? (
              <Link to="/home" className={`gh-nav-link${onHome ? " gh-nav-link-active" : ""}`}>
                Home
              </Link>
            ) : null}
            <Link
              to="/workbench"
              className={`gh-nav-link${onMyTasks ? " gh-nav-link-active" : ""}`}
            >
              My tasks
            </Link>
            <button type="button" className="gh-nav-link gh-nav-btn" onClick={handleSignOut}>
              Sign out
            </button>
          </>
        ) : null}
        {signedOut ? (
          <a className="gh-nav-link gh-nav-link-primary" href={googleHref}>
            Log in
          </a>
        ) : null}
        {status === "loading" ? (
          <span className="gh-nav-link gh-nav-muted" aria-live="polite">
            …
          </span>
        ) : null}
      </nav>
    </header>
  );
}
