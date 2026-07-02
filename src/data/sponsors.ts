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
    id: "cursor",
    name: "Cursor",
    url: "https://cursor.com",
    tier: "product",
  },
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
    id: "zavu",
    name: "Zavu",
    url: "https://zavu.dev",
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
    url: "https://soydrop.com/",
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
    url: "https://from021.io/",
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
const krealiSponsor = sponsors.find((s) => s.id === "kreali");
const werisSponsor = sponsors.find((s) => s.id === "weris");
const boxfulSponsor = sponsors.find((s) => s.id === "boxful");
const dropSponsor = sponsors.find((s) => s.id === "drop");
const gamesquadSponsor = sponsors.find((s) => s.id === "gamesquad");
const searchyouSponsor = sponsors.find((s) => s.id === "searchyou");
const dmaSponsor = sponsors.find((s) => s.id === "dma");
const netlifySponsor = sponsors.find((s) => s.id === "netlify");
const wisprSponsor = sponsors.find((s) => s.id === "wispr");
const falSponsor = sponsors.find((s) => s.id === "fal");
const exaSponsor = sponsors.find((s) => s.id === "exa");
const svnetSponsor = sponsors.find((s) => s.id === "svnet");
const firecrawlSponsor = sponsors.find((s) => s.id === "firecrawl");
const datamcpSponsor = sponsors.find((s) => s.id === "datamcp");
const rcnsSponsor = sponsors.find((s) => s.id === "rcns");
if (
  !codexSponsor ||
  !yonjobSponsor ||
  !nubiworkSponsor ||
  !abacoSponsor ||
  !elevenlabsSponsor ||
  !simovSponsor ||
  !krealiSponsor ||
  !werisSponsor ||
  !boxfulSponsor ||
  !dropSponsor ||
  !gamesquadSponsor ||
  !searchyouSponsor ||
  !dmaSponsor ||
  !netlifySponsor ||
  !wisprSponsor ||
  !falSponsor ||
  !exaSponsor ||
  !svnetSponsor ||
  !firecrawlSponsor ||
  !datamcpSponsor ||
  !rcnsSponsor
) {
  throw new Error(
    "sponsors: codex, yonjob, nubiwork, abaco, elevenlabs, simov, kreali, weris, boxful, drop, gamesquad, searchyou, dma, netlify, wispr, fal, exa, svnet, firecrawl, datamcp, rcns required for onePagerSponsors",
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
  toOnePagerGold(krealiSponsor),
  toOnePagerGold(werisSponsor),
  toOnePagerGold(boxfulSponsor),
  toOnePagerGold(dropSponsor),
  toOnePagerGold(gamesquadSponsor),
  toOnePagerGold(searchyouSponsor),
  toOnePagerGold(dmaSponsor),
  toOnePagerGold(netlifySponsor),
  toOnePagerGold(wisprSponsor),
  toOnePagerGold(falSponsor),
  toOnePagerGold(exaSponsor),
  toOnePagerGold(svnetSponsor),
  toOnePagerGold(firecrawlSponsor),
  toOnePagerGold(datamcpSponsor),
  toOnePagerGold(rcnsSponsor),
];
