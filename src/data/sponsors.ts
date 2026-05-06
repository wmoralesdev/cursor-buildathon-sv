import type { OnePagerSponsorLogoId, ProductSponsorId } from "../components/sponsor-logos";
import type { TranslationKey } from "../i18n/translations";

export type SponsorTier = "gold" | "silver" | "bronze" | "product";

export type { OnePagerSponsorLogoId, ProductSponsorId };

export interface Sponsor {
  id: ProductSponsorId;
  name: string;
  url: string;
  tier: SponsorTier;
  perkKey?: TranslationKey;
}

export const sponsors: Sponsor[] = [
  {
    id: "n8n",
    name: "n8n",
    url: "https://n8n.io",
    tier: "product",
    perkKey: "sponsors.n8n.perk",
  },
  {
    id: "codex",
    name: "Codex",
    url: "https://openai.com/codex",
    tier: "product",
  },
  {
    id: "yonjob",
    name: "Yonjob",
    url: "https://yonjobsv.com/",
    tier: "product",
  },
  {
    id: "nubiwork",
    name: "NubiWork",
    url: "https://nubi.work/",
    tier: "product",
  },
  {
    id: "abaco",
    name: "Abaco",
    url: "https://www.abacocapital.co/",
    tier: "product",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    url: "https://elevenlabs.io/",
    tier: "product",
  },
  {
    id: "simov",
    name: "Simov",
    url: "https://simov.io/",
    tier: "product",
  },
];

export function sponsorsByTier(tier: SponsorTier): Sponsor[] {
  return sponsors.filter((s) => s.tier === tier);
}

/** Print one-pagers only; does not change main site tier grouping. */
export type OnePagerSponsorBadge = "host" | "gold";

export interface OnePagerSponsorEntry {
  id: OnePagerSponsorLogoId;
  name: string;
  url: string;
  badge: OnePagerSponsorBadge;
}

const n8nSponsor = sponsors.find((s) => s.id === "n8n");
if (!n8nSponsor) {
  throw new Error("sponsors: n8n entry required for onePagerSponsors");
}

const codexSponsor = sponsors.find((s) => s.id === "codex");
const yonjobSponsor = sponsors.find((s) => s.id === "yonjob");
const nubiworkSponsor = sponsors.find((s) => s.id === "nubiwork");
const abacoSponsor = sponsors.find((s) => s.id === "abaco");
const elevenlabsSponsor = sponsors.find((s) => s.id === "elevenlabs");
const simovSponsor = sponsors.find((s) => s.id === "simov");
if (
  !codexSponsor ||
  !yonjobSponsor ||
  !nubiworkSponsor ||
  !abacoSponsor ||
  !elevenlabsSponsor ||
  !simovSponsor
) {
  throw new Error(
    "sponsors: codex, yonjob, nubiwork, abaco, elevenlabs, simov required for onePagerSponsors",
  );
}

function toOnePagerGold(s: Sponsor): OnePagerSponsorEntry {
  return {
    id: s.id,
    name: s.name,
    url: s.url,
    badge: "gold",
  };
}

export const onePagerSponsors: readonly OnePagerSponsorEntry[] = [
  {
    id: "cursor",
    name: "Cursor",
    url: "https://cursor.com",
    badge: "host",
  },
  toOnePagerGold(n8nSponsor),
  toOnePagerGold(codexSponsor),
  toOnePagerGold(yonjobSponsor),
  toOnePagerGold(nubiworkSponsor),
  toOnePagerGold(abacoSponsor),
  toOnePagerGold(elevenlabsSponsor),
  toOnePagerGold(simovSponsor),
];
