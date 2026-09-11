import { renderMiniERPStage, miniErpChapters } from "./MiniERPTour.jsx";
import { renderSentinelPOSStage, sentinelPOSChapters } from "./SentinelPOSTour.jsx";
import { renderRouteMatrixStage, routeMatrixChapters } from "./RouteMatrixTour.jsx";
import { renderBatchCraftStage, batchCraftChapters } from "./BatchCraftTour.jsx";

/**
 * Registry of cinematic guided tours (GuidedTour.jsx) — the richer format (animated cursor,
 * measured highlight boxes, live data mutations, chapter navigation, spoken narration) for every
 * catalog product now that all four have one, replacing productWalkthroughConfigs.jsx's simpler
 * console-log stepper (ProductWalkthrough.jsx) everywhere a product has a real tour.
 */
export const GUIDED_TOURS = {
  minierp: { renderStage: renderMiniERPStage, chapters: miniErpChapters },
  sentinelpos: { renderStage: renderSentinelPOSStage, chapters: sentinelPOSChapters },
  routematrix: { renderStage: renderRouteMatrixStage, chapters: routeMatrixChapters },
  batchcraft: { renderStage: renderBatchCraftStage, chapters: batchCraftChapters },
};
