/** Buildathon window — America/El_Salvador (UTC−6). */
export const HUB_EVENT_START_MS = Date.parse("2026-07-04T08:00:00-06:00");

/** Call booth reservations end Sunday July 5, 2026 at 6:00 AM local. */
export const BOOTH_RESERVATION_END_MS = Date.parse("2026-07-05T06:00:00-06:00");

export const BOOTH_SLOT_DURATION_MS = 30 * 60 * 1000;

export const DEFAULT_HUB_BOOTHS = [
  { name: "Booth A", location: "Main floor", sortOrder: 0 },
  { name: "Booth B", location: "Side hall", sortOrder: 1 },
] as const;

/** 30-minute booth slots from event start through Sunday 6:00 AM. */
export function buildBoothSlotStarts(
  startMs: number = HUB_EVENT_START_MS,
  endMs: number = BOOTH_RESERVATION_END_MS,
  durationMs: number = BOOTH_SLOT_DURATION_MS,
): number[] {
  const slots: number[] = [];
  for (let t = startMs; t + durationMs <= endMs; t += durationMs) {
    slots.push(t);
  }
  return slots;
}
