import { Link, useLocation } from "react-router-dom";
import InpactLogo from "./components/InpactLogo.jsx";
import "./GlobalHeader.css";

// Routes that already render their own logo as part of their own page header — showing this one
// too on top of them is a real duplicate, not a safe default (user report, live, on /join:
// "two logos and also the top log is cramped top left" — JsExperienceHome.jsx already renders its
// own InpactLogo at the top of its header). "/", "/lessons/*", and "/register" all route through
// App.jsx, which shows either CinematicLanding.jsx or LandingPage.jsx — both carry their own logo
// too. Grepped every InpactLogo usage in src/ to build this list rather than guessing; the ~12
// other top-level routes (Workbench, Apply, PDStudio, MatchingQueue, and the rest — plus the
// core-team sign-in screen they fall back to when signed out) have none today, which is the actual
// gap this component is for.
const ALREADY_BRANDED_PREFIXES = ["/lessons", "/join", "/try"];
const ALREADY_BRANDED_EXACT = new Set(["/", "/register"]);

function isAlreadyBranded(pathname) {
  return ALREADY_BRANDED_EXACT.has(pathname) || ALREADY_BRANDED_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * Persistent brand mark on every page that doesn't already have one (user request, 2026-09-08:
 * "all our pages shud carry our logo too so i think we need a global header/menu/nav"). Scoped to
 * just the logo for now, not a full nav menu — this app has ~15 routes gated to different roles
 * (PD/PMGT/ID/CD/JS applicants/core admins), and guessing at what links a real nav should hold
 * risks shipping a wrong menu on every single page at once, a much bigger blast radius than
 * getting one page's copy wrong.
 *
 * Fixed-position, not a full-width bar — this never affects any existing page's own
 * layout/padding math, so it's safe to mount above every route without touching each page.
 */
export default function GlobalHeader() {
  const location = useLocation();
  if (isAlreadyBranded(location.pathname)) return null;

  return (
    <Link to="/" className="gh-logo-link" aria-label="Inpact home">
      <InpactLogo height={36} />
    </Link>
  );
}
