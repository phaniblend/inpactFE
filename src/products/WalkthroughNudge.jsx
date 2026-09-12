import { useState } from "react";
import GuidedTour from "./GuidedTour.jsx";
import ProductWalkthrough from "./ProductWalkthrough.jsx";
import { GUIDED_TOURS } from "./guidedTours.jsx";
import { PRODUCT_WALKTHROUGHS } from "./productWalkthroughConfigs.jsx";
import "./WalkthroughNudge.css";

/**
 * A one-line curiosity hook, not a wall of chrome — replaces dropping the full walkthrough inline
 * into a dense screen (the task page, the lesson intro) that already has its own job to do (user
 * report, 2026-09-10: a huge always-expanded engine simulator was the first thing on the task page,
 * above the actual task). Clicking opens the real thing — GuidedTour or ProductWalkthrough,
 * whichever this product has — as a modal, auto-playing immediately; no second "Start" click. The
 * dedicated /products/:slug overview page is the one place that still embeds it directly (someone
 * who navigated there came specifically to see it, so there's nothing to entice them into).
 *
 * Each nudge line is written to name the product's actual "aha" — the one mechanism that's worth a
 * detour to go watch — not a generic "see how it works."
 */
const NUDGES = {
  minierp: "Curious how the books balance themselves before you write a line of code?",
  // Deliberately the plain, literal ask rather than one narrow scenario (user correction,
  // 2026-09-12: the task page's nudge should be straight about "understand SentinelPOS and its
  // features" — the fraud-catch moment is one chapter of seven, and leading with just that undersold
  // the rest of the tour).
  sentinelpos: "New to SentinelPOS? See exactly what it does — every feature, walked through — before you touch the code.",
  routematrix: "Curious how a route knows the exact moment it's actually done?",
  batchcraft: "Want to see what your recipe is really costing you, once the waste is counted?",
};

export default function WalkthroughNudge({ productKey }) {
  const [open, setOpen] = useState(false);
  const guidedTour = GUIDED_TOURS[productKey];
  const walkthrough = PRODUCT_WALKTHROUGHS[productKey];
  const nudgeText = NUDGES[productKey];

  if (!guidedTour && !walkthrough) return null;

  return (
    <>
      <button type="button" className="wn-nudge" onClick={() => setOpen(true)}>
        <span className="wn-nudge-icon">▶</span>
        <span>{nudgeText || "Want to see how this really works?"}</span>
      </button>

      {open && (
        <div className="wn-overlay" role="presentation" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="wn-modal" role="dialog" aria-modal="true" aria-label="Product walkthrough">
            <button type="button" className="wn-close" onClick={() => setOpen(false)} aria-label="Close">
              ✕ Close
            </button>
            <div className="wn-modal-body">
              {guidedTour ? (
                <GuidedTour renderStage={guidedTour.renderStage} chapters={guidedTour.chapters} autoStart />
              ) : (
                <ProductWalkthrough productKey={productKey} autoStart />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
