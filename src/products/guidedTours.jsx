import { renderMiniERPStage, miniErpChapters } from "./MiniERPTour.jsx";

/**
 * Registry of cinematic guided tours (GuidedTour.jsx) — the richer format (animated cursor,
 * measured highlight boxes, live data mutations, chapter navigation, spoken narration) that
 * replaces ProductWalkthrough.jsx's simpler console-log stepper wherever a product has one.
 * MiniERP is the first; SentinelPOS/RouteMatrix/BatchCraft still use ProductWalkthrough until (if)
 * the same treatment is built for them too — see productWalkthroughConfigs.jsx.
 */
export const GUIDED_TOURS = {
  minierp: { renderStage: renderMiniERPStage, chapters: miniErpChapters },
};
