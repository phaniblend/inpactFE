import { COHORT_PROJECT_ID } from "../cohort-matching/matching.js";

/**
 * Real teammates matched onto the same product — names + task titles only.
 * Audit P02 (2026-11-01): previously listed every tracker issue via /api/onedev (including
 * Application emails). Now uses /api/recruit/team-roster.
 */
export async function fetchTeamRoster(projectName) {
  const res = await fetch(`/api/recruit/team-roster?project=${encodeURIComponent(projectName)}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const data = await res.json();
  return data.roster || [];
}

/** The signed-in aspirant's own current project — read the same way ProductOverview.jsx already
 * does via /api/recruit/my-tasks, so "which team is this person even on" isn't guessed. Returns
 * null for anyone not yet matched to a task (staff, or a visitor who hasn't applied). */
export async function fetchMyProjectName() {
  const res = await fetch("/api/recruit/my-tasks");
  if (!res.ok) return null;
  const { tasks } = await res.json();
  return tasks?.[0]?.project ?? null;
}

// Re-export so callers that imported the cohort id from this module keep working.
export { COHORT_PROJECT_ID };
