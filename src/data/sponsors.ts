import type { TranslationKey } from "../i18n/translations";

export type SponsorTier = "gold" | "silver" | "bronze" | "product";

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  logoDark?: string;
  url: string;
  tier: SponsorTier;
  perkKey?: TranslationKey;
}

export const sponsors: Sponsor[] = [
  {
    id: "n8n",
    name: "n8n",
    logo: "/sponsors/n8n-logo.svg",
    logoDark: "/sponsors/n8n-logo-dark.svg",
    url: "https://n8n.io",
    tier: "product",
    perkKey: "sponsors.n8n.perk",
  },
];

export function sponsorsByTier(tier: SponsorTier): Sponsor[] {
  return sponsors.filter((s) => s.tier === tier);
}

/** Print one-pagers only; does not change main site tier grouping. */
export type OnePagerSponsorBadge = "host" | "gold";

export interface OnePagerSponsorEntry {
  id: string;
  name: string;
  logo: string;
  url: string;
  badge: OnePagerSponsorBadge;
}

const n8nSponsor = sponsors.find((s) => s.id === "n8n");
if (!n8nSponsor) {
  throw new Error("sponsors: n8n entry required for onePagerSponsors");
}

export const onePagerSponsors: readonly OnePagerSponsorEntry[] = [
  {
    id: "cursor",
    name: "Cursor",
    logo: "/lockup-light.png",
    url: "https://cursor.com",
    badge: "host",
  },
  {
    id: n8nSponsor.id,
    name: n8nSponsor.name,
    logo: n8nSponsor.logo,
    url: n8nSponsor.url,
    badge: "gold",
  },
];
