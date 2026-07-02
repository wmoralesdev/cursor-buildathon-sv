import { v } from "convex/values";

export const HUB_ROLES = ["logistics", "mentor", "jury"] as const;
export type HubRole = (typeof HUB_ROLES)[number];

export const hubRoleValidator = v.union(
  v.literal("logistics"),
  v.literal("mentor"),
  v.literal("jury"),
);
