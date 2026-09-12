import { COHORT_PROJECT_ID } from "../cohort-matching/matching.js";

async function api(path) {
  const res = await fetch(`/api/onedev${path}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

/**
 * Real teammates matched onto the same product — the same "Matched: <name> → ... in <project>"
 * issues TeamIntro.jsx originally read on its own (server/recruit-router.js writes these). Pulled
 * out here so the global Team Chat widget (TeamChatProvider) can show the same live roster from
 * any page, not just the one-time post-apply screen — one real source of truth for "who's on my
 * team", not two copies of the same parsing logic (user report, 2026-09-12: team chat should be a
 * persistent, prominent affordance, not something buried on the post-apply screen alone).
 */
export async function fetchTeamRoster(projectName) {
  const issues = await api("/issues?offset=0&count=200");
  const matches = issues.filter((i) => i.projectId === COHORT_PROJECT_ID && i.title.startsWith("Matched:"));
  return matches
    .filter((m) => (m.description || "").includes(`in ${projectName}`))
    .map((m) => {
      const nameMatch = /Matched: (.+?) →/.exec(m.title);
      const taskMatch = /Task: #\d+ "(.+?)"/.exec(m.description || "");
      return { name: nameMatch?.[1] ?? "Teammate", taskTitle: taskMatch?.[1] ?? "" };
    });
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
