import { v } from "convex/values";

export const COMPETITION_TRACK_IDS = ["ai_consumer", "fintech_web3"] as const;
export type CompetitionTrackId = (typeof COMPETITION_TRACK_IDS)[number];

export const competitionTrackValidator = v.union(
  v.literal("ai_consumer"),
  v.literal("fintech_web3"),
);
