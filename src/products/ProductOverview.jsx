import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";
import ProductWalkthrough from "./ProductWalkthrough.jsx";
import { PRODUCT_WALKTHROUGHS, slugForProjectName } from "./productWalkthroughConfigs.jsx";
import GuidedTour from "./GuidedTour.jsx";
import { GUIDED_TOURS } from "./guidedTours.jsx";
import "./ProductOverview.css";

// Public, shareable copy per product — the plain-English pitch a pilot audience or a prospective
// aspirant reads before the animated walkthrough gets into the real engineering. Kept separate from
// productWalkthroughConfigs.jsx's phases/logs since this is marketing copy, not simulator data.
const PRODUCT_COPY = {
  minierp: {
    tagline: "Real double-entry books that close themselves, not a spreadsheet pretending to.",
    description:
      "Every stock move — a purchase order received, an order fulfilled — posts a real, balanced journal entry in the same transaction, automatically. Moving Average Cost recalculates on every receipt. A background worker watches for low stock and drafts its own replenishment orders. Revenue, COGS, and net profit are never a month-end reconciliation — they're always already correct.",
  },
  sentinelpos: {
    tagline: "Retail loss-prevention that actually watches the register, not just the cameras.",
    description:
      "Every POS terminal streams its own void, discount, and no-sale events in real time. SentinelPOS scores each cashier's shift against their own rolling baseline — not a store-wide average — and opens a real incident the moment a shift crosses into statistically abnormal territory. A loss-prevention analyst reviews the real evidence and resolves it, confirmed or dismissed, in one screen.",
  },
  routematrix: {
    tagline: "Delivery routing that fits the truck before it fits the map.",
    description:
      "RouteMatrix builds every driver's route against their vehicle's real weight and volume limits first, then sequences the stops for the shortest real path. A driver works one real, ordered stop list; the moment the last stop is marked delivered, the whole route closes itself out — no separate step, no forgotten paperwork.",
  },
  batchcraft: {
    tagline: "Recipe costing that knows what trim loss actually costs you.",
    description:
      "A recipe's true cost isn't its ingredients' sticker price — it's what's left after trim, shrinkage, and cook-down, recursed all the way through every nested sub-recipe. BatchCraft computes that real edible-portion cost per serving, flags any dish quietly drifting over its own target margin, and depletes real pantry stock the moment a scaled prep batch actually runs.",
  },
};

const PRODUCT_TITLES = { minierp: "MiniERP" };

export default function ProductOverview() {
  const { slug } = useParams();
  const { session, status: authStatus } = useAuth();
  const copy = PRODUCT_COPY[slug];
  const guidedTour = GUIDED_TOURS[slug];
  const walkthrough = PRODUCT_WALKTHROUGHS[slug];
  const title = PRODUCT_TITLES[slug] || walkthrough?.title || slug;

  // "Apply" only makes sense for someone who isn't already building this — e.g. a visitor who
  // reached this page from inside their own assigned task's curiosity nudge (WalkthroughNudge)
  // shouldn't be told to go apply for the very thing they're already signed in and working on
  // (user report, 2026-09-10). Checked against the same /api/recruit/my-tasks Workbench itself
  // reads, not a guess — only actually skips the CTA once a real matching task is confirmed.
  const [alreadyAssigned, setAlreadyAssigned] = useState(false);
  useEffect(() => {
    if (authStatus !== "signedIn") {
      setAlreadyAssigned(false);
      return;
    }
    let cancelled = false;
    fetch("/api/recruit/my-tasks")
      .then((r) => (r.ok ? r.json() : { tasks: [] }))
      .then(({ tasks }) => {
        if (cancelled) return;
        setAlreadyAssigned((tasks || []).some((t) => slugForProjectName(t.project) === slug));
      })
      .catch(() => {
        if (!cancelled) setAlreadyAssigned(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authStatus, slug]);

  if (!copy) {
    return (
      <div className="po-page">
        <div className="po-container">
          <p className="po-notfound">
            No overview yet for "{slug}". <Link to="/apply">Go to Apply</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="po-page">
      <div className="po-container">
        <header className="po-header">
          <p className="po-kicker">Product overview</p>
          <h1 className="po-title">{title}</h1>
          <p className="po-tagline">{copy.tagline}</p>
        </header>

        <p className="po-description">{copy.description}</p>

        <div className="po-cta-row">
          {alreadyAssigned ? (
            <Link className="po-cta-primary" to="/workbench">
              You're already building this — go to your task →
            </Link>
          ) : (
            <Link className="po-cta-primary" to="/apply">
              Apply to build this →
            </Link>
          )}
        </div>

        {guidedTour ? (
          <section className="po-walkthrough-section">
            <h2 className="po-section-h2">How it really works</h2>
            <GuidedTour key={slug} renderStage={guidedTour.renderStage} chapters={guidedTour.chapters} />
          </section>
        ) : walkthrough ? (
          <section className="po-walkthrough-section">
            <h2 className="po-section-h2">How it really works</h2>
            <ProductWalkthrough key={slug} productKey={slug} />
          </section>
        ) : null}
      </div>
    </div>
  );
}
