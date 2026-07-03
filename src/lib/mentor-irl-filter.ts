import type { EventPersonRosterEntry } from "../types/event-person-roster";

/** First names (case-insensitive, accent-insensitive) for on-site mentors. */
const IRL_FIRST_NAMES = new Set([
  "walter",
  "daniela",
  "andre",
  "ben",
  "carol",
  "cristian",
  "daniel",
  "fernando",
  "frank",
  "gabriel",
  "jaime",
  "maria",
  "nelson",
  "oscar",
  "nestor",
  "pablo",
]);

function normalizeFirstName(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return first
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function isIrlMentor(entry: EventPersonRosterEntry): boolean {
  return IRL_FIRST_NAMES.has(normalizeFirstName(entry.name));
}

export function partitionMentorsByPresence(entries: EventPersonRosterEntry[]) {
  const irl: EventPersonRosterEntry[] = [];
  const online: EventPersonRosterEntry[] = [];
  for (const entry of entries) {
    if (isIrlMentor(entry)) irl.push(entry);
    else online.push(entry);
  }
  return { irl, online };
}
