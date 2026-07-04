import { v } from "convex/values";

/** Sponsors with redeemable builder perks (includes zavu, excludes netlify). */
export const PERK_SPONSOR_IDS = [
  "codex",
  "n8n",
  "zavu",
  "cursor",
  "elevenlabs",
  "firecrawl",
  "cognition",
  "datamcp",
  "exa",
  "fal",
  "wispr",
] as const;

export type PerkSponsorId = (typeof PERK_SPONSOR_IDS)[number];

export const perkSponsorIdValidator = v.union(
  ...PERK_SPONSOR_IDS.map((id) => v.literal(id)),
);

export const PERK_VARIANTS = ["default", "codex_api", "codex_link"] as const;
export type PerkVariant = (typeof PERK_VARIANTS)[number];

export const perkVariantValidator = v.union(
  v.literal("default"),
  v.literal("codex_api"),
  v.literal("codex_link"),
);

export const perkKindValidator = v.union(v.literal("link"), v.literal("code"));

export const perkInventoryStatusValidator = v.union(
  v.literal("available"),
  v.literal("assigned"),
);

export type PerkDeliveryMode =
  | "unique_link"
  | "unique_code"
  | "shared_link"
  | "shared_code"
  | "discord"
  | "pending";

export type PerkScope = "user" | "team";

export type PerkStatus = "ready" | "pending" | "needs_team" | "unavailable" | "locked";

/** ElevenLabs Discord server invite for #coupon-codes redemption bot. */
export const ELEVENLABS_DISCORD_CHANNEL_URL =
  "https://discord.com/invite/VnBvbbcdEC";

type InventoryDelivery = {
  mode: "inventory";
  sponsorId: PerkSponsorId;
  kind: "link" | "code";
  variant: PerkVariant;
  scope: PerkScope;
  redeemUrl?: string;
};

type SharedLinkDelivery = {
  mode: "shared_link";
  sponsorId: PerkSponsorId;
  url: string;
  scope: PerkScope;
  redeemUrl?: string;
};

type SharedCodeDelivery = {
  mode: "shared_code";
  sponsorId: PerkSponsorId;
  code?: string;
  pending?: boolean;
  scope: PerkScope;
  redeemUrl?: string;
};

type DiscordDelivery = {
  mode: "discord";
  sponsorId: PerkSponsorId;
  channelUrl: string;
  scope: PerkScope;
  redeemUrl?: string;
};

type SkipDelivery = {
  mode: "skip";
  sponsorId: PerkSponsorId;
};

export type PerkDeliveryConfig =
  | InventoryDelivery
  | SharedLinkDelivery
  | SharedCodeDelivery
  | DiscordDelivery
  | SkipDelivery;

/** Ordered perk delivery rules — one entry per redeemable perk. */
export const PERK_DELIVERY_CONFIG: PerkDeliveryConfig[] = [
  {
    mode: "inventory",
    sponsorId: "cursor",
    kind: "link",
    variant: "default",
    scope: "user",
    redeemUrl: "https://cursor.com",
  },
  {
    mode: "inventory",
    sponsorId: "cognition",
    kind: "code",
    variant: "default",
    scope: "user",
    redeemUrl: "https://devin.ai",
  },
  {
    mode: "inventory",
    sponsorId: "codex",
    kind: "link",
    variant: "codex_link",
    scope: "user",
    redeemUrl: "https://chatgpt.com/codex",
  },
  {
    mode: "inventory",
    sponsorId: "codex",
    kind: "code",
    variant: "codex_api",
    scope: "user",
    redeemUrl: "https://platform.openai.com",
  },
  {
    mode: "shared_link",
    sponsorId: "wispr",
    url: "https://ref.wisprflow.ai/cursor",
    scope: "user",
    redeemUrl: "https://wisprflow.ai",
  },
  {
    mode: "shared_code",
    sponsorId: "exa",
    code: "EXA50CURSOR",
    scope: "user",
    redeemUrl: "https://exa.ai",
  },
  {
    mode: "shared_code",
    sponsorId: "datamcp",
    code: "PUPUSABUILD2026",
    scope: "user",
  },
  {
    mode: "shared_code",
    sponsorId: "n8n",
    code: "2026-COMMUNITY-HACKATHON-ELSALVADOR-1D915C9B",
    scope: "user",
    redeemUrl: "https://n8n.notion.site/voucher-code",
  },
  {
    mode: "shared_code",
    sponsorId: "firecrawl",
    code: "CURSORBUILDATHON",
    scope: "user",
    redeemUrl: "https://www.firecrawl.dev/app/billing",
  },
  {
    mode: "shared_code",
    sponsorId: "zavu",
    code: "BUILDATHONSALVADOR",
    scope: "user",
    redeemUrl: "https://zavu.dev",
  },
  {
    mode: "shared_code",
    sponsorId: "fal",
    code: "FALXCURSOR50",
    scope: "team",
    redeemUrl: "https://fal.ai",
  },
  {
    mode: "discord",
    sponsorId: "elevenlabs",
    channelUrl: ELEVENLABS_DISCORD_CHANNEL_URL,
    scope: "user",
    redeemUrl: "https://elevenlabs.io",
  },
];

export function getInventoryDeliveries(): InventoryDelivery[] {
  return PERK_DELIVERY_CONFIG.filter(
    (entry): entry is InventoryDelivery => entry.mode === "inventory",
  );
}

export function perkConfigKey(
  sponsorId: PerkSponsorId,
  variant: PerkVariant,
): string {
  return `${sponsorId}:${variant}`;
}
