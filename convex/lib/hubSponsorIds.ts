import { v } from "convex/values";

export const HUB_SPONSOR_IDS = [
  "n8n",
  "codex",
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

export type HubSponsorId = (typeof HUB_SPONSOR_IDS)[number];

export const hubSponsorIdValidator = v.union(
  ...HUB_SPONSOR_IDS.map((id) => v.literal(id)),
);
