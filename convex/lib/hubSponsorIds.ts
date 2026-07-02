import { v } from "convex/values";

/** Product partners that grant builder credits or API access at the event. */
export const HUB_CREDIT_SPONSOR_IDS = [
  "cursor",
  "codex",
  "n8n",
  "zavu",
  "elevenlabs",
  "firecrawl",
  "datamcp",
  "exa",
  "fal",
  "netlify",
  "wispr",
] as const;

export type HubCreditSponsorId = (typeof HUB_CREDIT_SPONSOR_IDS)[number];

/** Hub project + feedback sponsor ids (credit tech partners only). */
export const HUB_SPONSOR_IDS = HUB_CREDIT_SPONSOR_IDS;

export type HubSponsorId = HubCreditSponsorId;

export const hubSponsorIdValidator = v.union(
  ...HUB_SPONSOR_IDS.map((id) => v.literal(id)),
);

export function isHubCreditSponsorId(id: string): id is HubSponsorId {
  return (HUB_CREDIT_SPONSOR_IDS as readonly string[]).includes(id);
}
