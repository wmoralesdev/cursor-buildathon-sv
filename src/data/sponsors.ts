import type { ProductSponsorId } from "../components/sponsor-logos";
import type { TranslationKey } from "../i18n/translations";

export type SponsorTier = "gold" | "silver" | "bronze" | "product";

export type { ProductSponsorId };

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
    name: "Nub;Work",
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
  {
    id: "kreali",
    name: "Kreali",
    url: "https://www.krealistudio.com/en",
    tier: "product",
  },
  {
    id: "weris",
    name: "Weris",
    url: "https://weris.app/en",
    tier: "product",
  },
  {
    id: "boxful",
    name: "Boxful",
    url: "https://goboxful.com/el-salvador/",
    tier: "product",
  },
  {
    id: "drop",
    name: "Drop",
    url: "https://drop.sv/",
    tier: "product",
  },
  {
    id: "gamesquad",
    name: "GameSquad",
    url: "https://www.gamesquad.online/",
    tier: "product",
  },
  {
    id: "searchyou",
    name: "SearchYou",
    url: "https://searchyou.lat/",
    tier: "product",
  },
  {
    id: "dma",
    name: "DMA",
    url: "https://www.dmaanalytics.com/",
    tier: "product",
  },
  {
    id: "netlify",
    name: "Netlify",
    url: "https://www.netlify.com/",
    tier: "product",
  },
  {
    id: "wispr",
    name: "Wispr",
    url: "https://wisprflow.ai/",
    tier: "product",
  },
  {
    id: "fal",
    name: "Fal",
    url: "https://fal.ai/",
    tier: "product",
  },
  {
    id: "exa",
    name: "Exa",
    url: "https://exa.ai/",
    tier: "product",
  },
  {
    id: "svnet",
    name: "SVNet",
    url: "https://svnet.sv/",
    tier: "product",
  },
  {
    id: "firecrawl",
    name: "Firecrawl",
    url: "https://www.firecrawl.dev/",
    tier: "product",
  },
  {
    id: "datamcp",
    name: "DataMCP",
    url: "https://datamcp.ai/",
    tier: "product",
  },
  {
    id: "rcns",
    name: "RCNS",
    url: "https://rcns.sv/",
    tier: "product",
  },
  {
    id: "maca",
    name: "Maca",
    url: "https://maca.sv/",
    tier: "product",
  },
  {
    id: "crafter",
    name: "Crafter",
    url: "https://crafter.studio/",
    tier: "product",
  },
  {
    id: "esrobotica",
    name: "EsRobotica",
    url: "https://esrobotica.com/",
    tier: "product",
  },
  {
    id: "from021",
    name: "Zero Two One",
    url: "https://from021.com/",
    tier: "product",
  },
  {
    id: "gad-dev",
    name: "GAD Dev",
    url: "https://gad.dev/",
    tier: "product",
  },
  {
    id: "mistral",
    name: "Mistral",
    url: "https://mistral.ai/",
    tier: "product",
  },
  {
    id: "supabase",
    name: "Supabase",
    url: "https://supabase.com/",
    tier: "product",
  },
  {
    id: "ieee",
    name: "IEEE",
    url: "https://www.computer.org/",
    tier: "product",
  },
  {
    id: "ufg",
    name: "UFG",
    url: "https://ufg.edu.sv/",
    tier: "product",
  },
];

export function sponsorsByTier(tier: SponsorTier): Sponsor[] {
  return sponsors.filter((s) => s.tier === tier);
}
