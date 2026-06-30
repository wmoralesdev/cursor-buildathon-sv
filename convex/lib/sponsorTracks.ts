import { v } from "convex/values";

export const SPONSOR_TRACK_IDS = ["codex", "elevenlabs", "n8n"] as const;
export type SponsorTrackId = (typeof SPONSOR_TRACK_IDS)[number];

export const sponsorTrackValidator = v.union(
  v.literal("codex"),
  v.literal("elevenlabs"),
  v.literal("n8n"),
);
