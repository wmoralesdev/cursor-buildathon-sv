/** El Salvador (America/El_Salvador, UTC−6) — keep in sync with src/constants.ts */
export const EVENT_START_MS = Date.parse("2026-07-04T08:00:00-06:00");
export const SUBMISSION_DEADLINE_MS = Date.parse("2026-07-05T08:00:00-06:00");
/** Teams may link or change repo until two hours after kickoff. */
export const REPO_LINK_DEADLINE_MS = Date.parse("2026-07-04T10:00:00-06:00");
/** Flag teams with zero event-window commits after this many hours from kickoff. */
export const NO_COMMITS_GRACE_HOURS = 4;

export function isWithinEventWindow(now = Date.now()): boolean {
  return now >= EVENT_START_MS && now <= SUBMISSION_DEADLINE_MS;
}

export function canLinkOrChangeRepo(now = Date.now()): boolean {
  return now <= REPO_LINK_DEADLINE_MS;
}
