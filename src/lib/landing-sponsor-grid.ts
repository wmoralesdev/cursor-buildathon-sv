import { PARTNER_RAIL, type RailEntry } from "../components/hero-section/hero-partner-config";
import type { HeroPartnerId } from "../components/hero-section/hero-partner-config";

const PRIORITY_GROUP: readonly HeroPartnerId[] = ["codex", "n8n", "zavu"];

/** Landing grid order: Codex · n8n · Zavu first, then remaining rail partners. */
export function landingSponsorGridEntries(): RailEntry[] {
  const byId = new Map(PARTNER_RAIL.map((entry) => [entry.id, entry]));
  const priority = PRIORITY_GROUP.map((id) => {
    const entry = byId.get(id);
    if (!entry) throw new Error(`landing sponsor grid: missing partner "${id}"`);
    return entry;
  });
  const rest = PARTNER_RAIL.filter((entry) => !PRIORITY_GROUP.includes(entry.id));
  return [...priority, ...rest];
}

export const CURSOR_HOST_URL = "https://cursor.com";
