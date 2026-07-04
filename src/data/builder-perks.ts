import type { CreditPartnerId } from "../lib/credits-sponsor-sections";
import { CREDIT_PARTNERS, formatCreditPartnerValue } from "../lib/credits-sponsor-sections";
import type { ProductSponsorId } from "../components/sponsor-logos/sponsor-logo-ids";
import type { TranslationKey } from "../i18n/translations";

export type BuilderPerkId = Exclude<CreditPartnerId, "netlify">;

const LOGO_IDS = {
  codex: "codex",
  n8n: "n8n",
  zavu: "zavu",
  cursor: "cursor",
  elevenlabs: "elevenlabs",
  firecrawl: "firecrawl",
  cognition: "cognition",
  datamcp: "datamcp",
  exa: "exa",
  fal: "fal",
  wispr: "wispr",
} as const satisfies Record<BuilderPerkId, ProductSponsorId | "zavu">;

export type BuilderPerkLogoId = (typeof LOGO_IDS)[BuilderPerkId];

export interface BuilderPerkDef {
  id: BuilderPerkId;
  logo: BuilderPerkLogoId;
  sponsor: string;
  value: string;
  perTeam?: boolean;
  descriptionKey: TranslationKey;
  instructionKey: TranslationKey;
}

const SPONSOR_NAMES: Record<BuilderPerkId, string> = {
  codex: "Codex",
  n8n: "n8n",
  zavu: "Zavu",
  cursor: "Cursor",
  elevenlabs: "ElevenLabs",
  firecrawl: "Firecrawl",
  cognition: "Cognition",
  datamcp: "DataMCP",
  exa: "Exa",
  fal: "Fal",
  wispr: "Wispr Flow",
};

const DESCRIPTION_KEYS: Record<BuilderPerkId, TranslationKey> = {
  codex: "onePager.prizes.perk.codex",
  n8n: "onePager.prizes.perk.n8n",
  zavu: "onePager.prizes.perk.zavu",
  cursor: "onePager.prizes.perk.cursor",
  elevenlabs: "onePager.prizes.perk.elevenlabs",
  firecrawl: "onePager.prizes.perk.firecrawl",
  cognition: "onePager.prizes.perk.devin",
  datamcp: "onePager.prizes.perk.datamcp",
  exa: "onePager.prizes.perk.exa",
  fal: "onePager.prizes.perk.fal",
  wispr: "onePager.prizes.perk.wispr",
};

/** Deliverable builder perks in display order (excludes netlify). */
export const BUILDER_PERK_DEFS: BuilderPerkDef[] = CREDIT_PARTNERS.filter(
  (partner): partner is (typeof CREDIT_PARTNERS)[number] & { id: BuilderPerkId } =>
    partner.id !== "netlify",
).map((partner) => ({
  id: partner.id,
  logo: LOGO_IDS[partner.id],
  sponsor: SPONSOR_NAMES[partner.id],
  value: formatCreditPartnerValue(partner),
  perTeam: partner.perTeam,
  descriptionKey: DESCRIPTION_KEYS[partner.id],
  instructionKey: `builder.perks.instructions.${partner.id}` as TranslationKey,
}));

export function getBuilderPerkDef(id: BuilderPerkId): BuilderPerkDef | undefined {
  return BUILDER_PERK_DEFS.find((perk) => perk.id === id);
}
