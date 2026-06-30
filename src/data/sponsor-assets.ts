import { AILABS_URL } from "../constants";
import { sponsors } from "./sponsors";

export interface SponsorAsset {
  id: string;
  name: string;
  logo: string;
  href: string;
  /** Normalized tokens used to match mentor `company` strings from Notion. */
  aliases: string[];
}

function sponsorUrl(id: (typeof sponsors)[number]["id"]): string {
  const entry = sponsors.find((s) => s.id === id);
  if (!entry) throw new Error(`sponsor-assets: missing sponsors entry for "${id}"`);
  return entry.url;
}

/** Event sponsor marks synced with Notion — Buildathon SV Social Cards (Jun 2026). */
export const SPONSOR_ASSETS: readonly SponsorAsset[] = [
  {
    id: "n8n",
    name: "n8n",
    logo: "/sponsors/n8n-logo-dark.svg",
    href: sponsorUrl("n8n"),
    aliases: ["n8n"],
  },
  {
    id: "codex",
    name: "Codex",
    logo: "/sponsors/codex.svg",
    href: sponsorUrl("codex"),
    aliases: ["codex", "openai"],
  },
  {
    id: "yonjob",
    name: "Yonjob",
    logo: "/sponsors/yonjob-dark.svg",
    href: sponsorUrl("yonjob"),
    aliases: ["yonjob"],
  },
  {
    id: "nubiwork",
    name: "Nub;Work",
    logo: "/sponsors/nubiwork-dark.svg",
    href: sponsorUrl("nubiwork"),
    aliases: ["nubiwork", "nubwork"],
  },
  {
    id: "abaco",
    name: "Abaco",
    logo: "/sponsors/abaco-dark.svg",
    href: sponsorUrl("abaco"),
    aliases: ["abaco"],
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    logo: "/sponsors/elevenlabs-dark.svg",
    href: sponsorUrl("elevenlabs"),
    aliases: ["elevenlabs", "eleven labs"],
  },
  {
    id: "simov",
    name: "Simov",
    logo: "/sponsors/simov-dark.svg",
    href: sponsorUrl("simov"),
    aliases: ["simov", "simov labs", "simovlabs"],
  },
  {
    id: "kreali",
    name: "Kreali",
    logo: "/sponsors/kreali-dark.svg",
    href: sponsorUrl("kreali"),
    aliases: ["kreali", "krealistudio"],
  },
  {
    id: "maca",
    name: "Maca",
    logo: "/sponsors/maca-dark.svg",
    href: sponsorUrl("maca"),
    aliases: ["maca"],
  },
  {
    id: "weris",
    name: "Weris",
    logo: "/sponsors/weris_dark.svg",
    href: sponsorUrl("weris"),
    aliases: ["weris"],
  },
  {
    id: "boxful",
    name: "Boxful",
    logo: "/sponsors/boxful-dark.svg",
    href: sponsorUrl("boxful"),
    aliases: ["boxful", "goboxful"],
  },
  {
    id: "crafter",
    name: "Crafter",
    logo: "/sponsors/crafter-dark.svg",
    href: sponsorUrl("crafter"),
    aliases: ["crafter", "crafter station", "crafterstation"],
  },
  {
    id: "drop",
    name: "Drop",
    logo: "/sponsors/drop-dark.svg",
    href: sponsorUrl("drop"),
    aliases: ["drop"],
  },
  {
    id: "gamesquad",
    name: "GameSquad",
    logo: "/sponsors/gamesquad-dark.svg",
    href: sponsorUrl("gamesquad"),
    aliases: ["gamesquad", "game squad"],
  },
  {
    id: "searchyou",
    name: "SearchYou",
    logo: "/sponsors/searchyou-dark.svg",
    href: sponsorUrl("searchyou"),
    aliases: ["searchyou", "search you"],
  },
  {
    id: "dma",
    name: "DMA",
    logo: "/sponsors/dma-dark.svg",
    href: sponsorUrl("dma"),
    aliases: ["dma"],
  },
  {
    id: "netlify",
    name: "Netlify",
    logo: "/sponsors/netlify-dark.svg",
    href: sponsorUrl("netlify"),
    aliases: ["netlify"],
  },
  {
    id: "wispr",
    name: "Wispr",
    logo: "/sponsors/wispr-dark.svg",
    href: sponsorUrl("wispr"),
    aliases: ["wispr", "wisprflow"],
  },
  {
    id: "fal",
    name: "fal",
    logo: "/sponsors/fal-dark.svg",
    href: sponsorUrl("fal"),
    aliases: ["fal", "falai"],
  },
  {
    id: "exa",
    name: "Exa",
    logo: "/sponsors/exa-dark.svg",
    href: sponsorUrl("exa"),
    aliases: ["exa"],
  },
  {
    id: "zavu",
    name: "Zavu",
    logo: "/sponsors/zavu-dark.svg",
    href: "https://zavu.dev",
    aliases: ["zavu", "zavudev", "zavu dev"],
  },
  {
    id: "cursor",
    name: "Cursor",
    logo: "/sponsors/cursor-dark.svg",
    href: "https://cursor.com",
    aliases: ["cursor"],
  },
  {
    id: "firecrawl",
    name: "Firecrawl",
    logo: "/sponsors/firecrawl-dark.svg",
    href: sponsorUrl("firecrawl"),
    aliases: ["firecrawl"],
  },
  {
    id: "esrobotica",
    name: "EsRobotica",
    logo: "/sponsors/esrobotica-dark.svg",
    href: sponsorUrl("esrobotica"),
    aliases: ["esrobotica", "es robotica"],
  },
  {
    id: "rcns",
    name: "RCNS",
    logo: "/sponsors/rcns-dark.svg",
    href: sponsorUrl("rcns"),
    aliases: ["rcns"],
  },
  {
    id: "from021",
    name: "Zero Two One",
    logo: "/sponsors/from021.svg",
    href: sponsorUrl("from021"),
    aliases: ["from021", "021", "zero two one", "zerotwoone"],
  },
  {
    id: "datamcp",
    name: "DataMCP",
    logo: "/sponsors/datamcp.svg",
    href: sponsorUrl("datamcp"),
    aliases: ["datamcp", "data mcp"],
  },
  {
    id: "ailabs",
    name: "Ai /abs",
    logo: "/sponsors/ailabs-dark.svg",
    href: AILABS_URL,
    aliases: ["ailabs", "ai labs", "ai abs", "ai/abs"],
  },
  {
    id: "gad-dev",
    name: "GAD Dev",
    logo: "/sponsors/gad-dev.svg",
    href: sponsorUrl("gad-dev"),
    aliases: ["gaddev", "gad dev"],
  },
  {
    id: "mistral",
    name: "Mistral",
    logo: "/sponsors/mistral.svg",
    href: sponsorUrl("mistral"),
    aliases: ["mistral", "mistral ai"],
  },
  {
    id: "ufg",
    name: "UFG",
    logo: "/sponsors/ufg-dark.svg",
    href: "https://ufg.edu.sv/",
    aliases: ["ufg", "francisco gavidia"],
  },
  {
    id: "supabase",
    name: "Supabase",
    logo: "/sponsors/supabase.svg",
    href: sponsorUrl("supabase"),
    aliases: ["supabase"],
  },
  {
    id: "ieee",
    name: "IEEE",
    logo: "/sponsors/ieee.webp",
    href: sponsorUrl("ieee"),
    aliases: ["ieee", "ieee computer society", "ieee computersociety"],
  },
  {
    id: "svnet",
    name: "SVNet",
    logo: "/sponsors/svnet-dark.svg",
    href: sponsorUrl("svnet"),
    aliases: ["svnet"],
  },
] as const;

function normalizeCompanyKey(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const SPONSOR_LOOKUP = new Map<string, SponsorAsset>();

for (const asset of SPONSOR_ASSETS) {
  for (const alias of asset.aliases) {
    SPONSOR_LOOKUP.set(normalizeCompanyKey(alias), asset);
  }
}

/** Resolve a mentor company string to a known event sponsor mark, if any. */
export function resolveMentorCompanySponsor(
  company: string | undefined,
): Pick<SponsorAsset, "name" | "logo" | "href"> | undefined {
  if (!company?.trim()) return undefined;

  const key = normalizeCompanyKey(company);
  const direct = SPONSOR_LOOKUP.get(key);
  if (direct) {
    return { name: direct.name, logo: direct.logo, href: direct.href };
  }

  for (const asset of SPONSOR_ASSETS) {
    for (const alias of asset.aliases) {
      const aliasKey = normalizeCompanyKey(alias);
      if (key.includes(aliasKey) || aliasKey.includes(key)) {
        return { name: asset.name, logo: asset.logo, href: asset.href };
      }
    }
  }

  return undefined;
}

export function sponsorAssetById(id: string): SponsorAsset | undefined {
  return SPONSOR_ASSETS.find((asset) => asset.id === id);
}
