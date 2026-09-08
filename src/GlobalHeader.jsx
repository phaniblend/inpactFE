import { Link, useLocation } from "react-router-dom";
import InpactLogo from "./components/InpactLogo.jsx";
import "./GlobalHeader.css";

/**
 * Persistent brand mark on every page (user request, 2026-09-08: "all our pages shud carry our
 * logo too so i think we need a global header/menu/nav"). Scoped to just the logo for now, not a
 * full nav menu — this app has ~15 routes gated to different roles (PD/PMGT/ID/CD/JS applicants/
 * core admins), and guessing at what links a real nav should hold risks shipping a wrong menu on
 * every single page at once, a much bigger blast radius than getting one page's copy wrong.
 *
 * Fixed-position and small, not a full-width bar — this never affects any existing page's own
 * layout/padding math, so it's safe to mount above every route without touching each page.
 * Skipped on "/" specifically: CinematicLanding.jsx already shows its own (much larger) logo
 * there — the one confirmed place this would otherwise double up.
 */
export default function GlobalHeader() {
  const location = useLocation();
  if (location.pathname === "/") return null;

  return (
    <Link to="/" className="gh-logo-link" aria-label="Inpact home">
      <InpactLogo height={28} />
    </Link>
  );
}
