import { Link, useParams } from "react-router-dom";
import ProductWalkthrough from "./ProductWalkthrough.jsx";
import { PRODUCT_WALKTHROUGHS } from "./productWalkthroughConfigs.jsx";
import "./ProductOverview.css";

// Public, shareable copy per product — the plain-English pitch a pilot audience or a prospective
// aspirant reads before the animated walkthrough gets into the real engineering. Kept separate from
// productWalkthroughConfigs.jsx's phases/logs since this is marketing copy, not simulator data.
const PRODUCT_COPY = {
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

export default function ProductOverview() {
  const { slug } = useParams();
  const copy = PRODUCT_COPY[slug];
  const walkthrough = PRODUCT_WALKTHROUGHS[slug];
  const title = walkthrough?.title || slug;

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
          <Link className="po-cta-primary" to="/apply">
            Apply to build this →
          </Link>
        </div>

        {walkthrough ? (
          <section className="po-walkthrough-section">
            <h2 className="po-section-h2">How it really works</h2>
            <ProductWalkthrough key={slug} productKey={slug} />
          </section>
        ) : null}
      </div>
    </div>
  );
}
