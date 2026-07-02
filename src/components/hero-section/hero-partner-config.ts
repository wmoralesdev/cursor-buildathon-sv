import type { ComponentType } from "react";

import type { BrandLogoProps, ProductSponsorId } from "../sponsor-logos";
import { AilabsLogo, productSponsorLogoById, ZavuLogo } from "../sponsor-logos";
import { sponsors, type Sponsor } from "../../data/sponsors";
import { AILABS_URL } from "../../constants";

export type HeroPartnerId = ProductSponsorId | "zavu" | "ailabs";

const ZAVU_URL = "https://zavu.dev";

const RAIL_LOGO_CLASS: Record<HeroPartnerId, string> = {
  cursor: "h-6 w-auto max-w-32 object-contain object-left",
  zavu: "h-5.5 w-auto max-w-28 object-contain object-left",
  n8n: "h-7 w-auto max-w-32 object-contain object-left",
  codex: "h-9 w-auto max-w-36 object-contain object-left",
  yonjob: "h-8 w-auto max-w-36 object-contain object-left",
  nubiwork: "h-11 w-auto max-w-48 object-contain object-left",
  abaco: "h-6 w-auto max-w-32 object-contain object-left",
  elevenlabs: "h-6 w-auto max-w-36 object-contain object-left",
  simov: "h-6 w-auto max-w-32 object-contain object-left",
  kreali: "h-6 w-auto max-w-36 object-contain object-left",
  maca: "h-6 w-auto max-w-36 object-contain object-left",
  weris: "h-6 w-auto max-w-36 object-contain object-left",
  boxful: "h-6 w-auto max-w-36 object-contain object-left",
  crafter: "h-6 w-auto max-w-36 object-contain object-left",
  drop: "h-6 w-auto max-w-32 object-contain object-left",
  gamesquad: "h-10 w-auto max-w-48 object-contain object-left",
  searchyou: "h-6 w-auto max-w-36 object-contain object-left",
  dma: "h-6 w-auto max-w-36 object-contain object-left",
  netlify: "h-6 w-auto max-w-36 object-contain object-left",
  wispr: "h-6 w-auto max-w-36 object-contain object-left",
  fal: "h-7 w-auto max-w-28 object-contain object-left",
  exa: "h-6 w-auto max-w-32 object-contain object-left",
  svnet: "h-6 w-auto max-w-32 object-contain object-left",
  firecrawl: "h-6 w-auto max-w-36 object-contain object-left",
  esrobotica: "h-6 w-auto max-w-36 object-contain object-left",
  datamcp: "h-6 w-auto max-w-32 object-contain object-left",
  rcns: "h-6 w-auto max-w-32 object-contain object-left",
  cognition: "h-6 w-auto max-w-36 object-contain object-left",
  from021: "h-6 w-auto max-w-28 object-contain object-left",
  "gad-dev": "h-6 w-auto max-w-32 object-contain object-left",
  mistral: "h-6 w-auto max-w-36 object-contain object-left",
  supabase: "h-6 w-auto max-w-36 object-contain object-left",
  ieee: "h-7 w-auto max-w-24 object-contain object-left",
  ufg: "h-7 w-auto max-w-32 object-contain object-left",
  ailabs: "h-6 w-auto max-w-36 object-contain object-left",
};

const PARTNER_ORDER: readonly HeroPartnerId[] = [
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
  "ailabs",
  "zavu",
] as const;

export interface RailEntry {
  id: HeroPartnerId;
  href: string;
  label: string;
  Logo: ComponentType<BrandLogoProps>;
  className: string;
}

function buildRail(): RailEntry[] {
  return PARTNER_ORDER.map((id) => {
    if (id === "zavu") {
      return {
        id,
        href: ZAVU_URL,
        label: "Zavu",
        Logo: ZavuLogo,
        className: RAIL_LOGO_CLASS[id],
      };
    }
    if (id === "ailabs") {
      return {
        id,
        href: AILABS_URL,
        label: "Ai /abs",
        Logo: AilabsLogo,
        className: RAIL_LOGO_CLASS[id],
      };
    }
    const s = sponsors.find((x) => x.id === id);
    if (!s) throw new Error(`hero: sponsor "${id}" missing`);
    return {
      id,
      href: s.url,
      label: s.name,
      Logo: productSponsorLogoById[id],
      className: RAIL_LOGO_CLASS[id],
    };
  });
}

export const PARTNER_RAIL = buildRail();

function requireSponsor(id: ProductSponsorId): Sponsor {
  const s = sponsors.find((x) => x.id === id);
  if (!s) throw new Error(`hero: sponsor "${id}" missing`);
  return s;
}

export type LeadPartnerId =
  | "codex"
  | "elevenlabs"
  | "netlify"
  | "wispr"
  | "fal"
  | "exa";

const LEAD_PARTNER_ROW_1: readonly LeadPartnerId[] = [
  "codex",
  "elevenlabs",
  "netlify",
] as const;

const LEAD_PARTNER_ROW_2: readonly LeadPartnerId[] = ["wispr", "fal", "exa"] as const;

const LEAD_PARTNER_ORDER: readonly LeadPartnerId[] = [
  ...LEAD_PARTNER_ROW_1,
  ...LEAD_PARTNER_ROW_2,
] as const;

const LEAD_LOGO_CLASS: Record<LeadPartnerId, string> = {
  codex: "h-10 w-auto max-w-44 sm:h-12 sm:max-w-52 object-contain object-left",
  elevenlabs: "h-6 w-auto max-w-32 sm:h-8 sm:max-w-36 object-contain object-left",
  netlify: "h-9 w-auto max-w-48 sm:h-12 sm:max-w-56 object-contain object-left",
  wispr: "h-4 w-auto max-w-20 sm:h-5 sm:max-w-24 object-contain object-left",
  fal: "h-5 w-auto max-w-16 sm:h-6 sm:max-w-20 object-contain object-left",
  exa: "h-4 w-auto max-w-20 sm:h-5 sm:max-w-20 object-contain object-left",
};

export type LeadPartnerEntry = {
  id: LeadPartnerId;
  href: string;
  label: string;
  Logo: ComponentType<BrandLogoProps>;
  className: string;
};

function buildLeadPartners(ids: readonly LeadPartnerId[]): LeadPartnerEntry[] {
  return ids.map((id) => {
    const entry = requireSponsor(id);
    return {
      id,
      href: entry.url,
      label: entry.name,
      Logo: productSponsorLogoById[id],
      className: LEAD_LOGO_CLASS[id],
    };
  });
}

export const LEAD_PARTNERS = buildLeadPartners(LEAD_PARTNER_ORDER);
export const LEAD_PARTNERS_ROW_1 = buildLeadPartners(LEAD_PARTNER_ROW_1);
export const LEAD_PARTNERS_ROW_2 = buildLeadPartners(LEAD_PARTNER_ROW_2);
