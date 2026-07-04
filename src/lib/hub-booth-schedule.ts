import { BOOTH_RESERVATION_END_ISO, EVENT_START_ISO } from "../constants";

export const BOOTH_SLOT_DURATION_MS = 30 * 60 * 1000;

export function buildBoothSlotStarts(
  startMs: number = Date.parse(EVENT_START_ISO),
  endMs: number = Date.parse(BOOTH_RESERVATION_END_ISO),
  durationMs: number = BOOTH_SLOT_DURATION_MS,
): number[] {
  const slots: number[] = [];
  for (let t = startMs; t + durationMs <= endMs; t += durationMs) {
    slots.push(t);
  }
  return slots;
}
