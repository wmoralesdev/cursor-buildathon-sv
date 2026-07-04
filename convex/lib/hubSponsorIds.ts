import { v } from "convex/values";

export const HUB_SPONSOR_IDS = [
  "n8n",
  "codex",
  "cognition",
  "cursor",
  "yonjob",
  "nubiwork",
  "abaco",
  "elevenlabs",
  "simov",
  "kreali",
  "maca",
  "weris",
  "boxful",
  "crafter",
  "drop",
  "gamesquad",
  "searchyou",
  "dma",
  "netlify",
  "wispr",
  "fal",
  "exa",
  "svnet",
  "firecrawl",
  "esrobotica",
  "datamcp",
  "rcns",
  "from021",
  "gad-dev",
  "mistral",
  "supabase",
  "ieee",
  "ufg",
] as const;

/** Tool sponsors selectable in hub project details (/builder → Build → Project details). */
export const HUB_PROJECT_TOOL_SPONSOR_IDS = [
  "n8n",
  "codex",
  "cognition",
  "elevenlabs",
  "netlify",
  "wispr",
  "fal",
  "exa",
  "firecrawl",
  "datamcp",
  "cursor",
] as const satisfies readonly HubSponsorId[];

export type HubProjectToolSponsorId = (typeof HUB_PROJECT_TOOL_SPONSOR_IDS)[number];

export type HubSponsorId = (typeof HUB_SPONSOR_IDS)[number];

export const hubSponsorIdValidator = v.union(
  ...HUB_SPONSOR_IDS.map((id) => v.literal(id)),
);
