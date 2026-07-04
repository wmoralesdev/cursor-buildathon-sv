import type { BuilderPerkId } from "./builder-perks";
import { sponsors } from "./sponsors";

export interface BuilderPerkSocialLinks {
  website: string;
  linkedin: string;
  x: string;
}

/** Product-site overrides when sponsors.ts differs from the perk redeem surface. */
const WEBSITE_OVERRIDES: Partial<Record<BuilderPerkId, string>> = {
  datamcp: "https://datamcp.app",
  zavu: "https://zavu.dev",
};

const LINKEDIN_BY_PERK: Record<BuilderPerkId, string> = {
  codex: "https://www.linkedin.com/company/openai",
  n8n: "https://www.linkedin.com/company/n8n-io",
  zavu: "https://www.linkedin.com/company/zavudev",
  cursor: "https://www.linkedin.com/company/cursorai",
  elevenlabs: "https://www.linkedin.com/company/elevenlabsio",
  firecrawl: "https://www.linkedin.com/company/firecrawl-dev",
  cognition: "https://www.linkedin.com/company/cognition-ai-labs",
  datamcp: "https://www.linkedin.com/in/mironovisa",
  exa: "https://www.linkedin.com/company/exa-ai",
  fal: "https://www.linkedin.com/company/features-and-labels",
  wispr: "https://www.linkedin.com/company/wisprflow",
};

const X_BY_PERK: Record<BuilderPerkId, string> = {
  codex: "https://x.com/OpenAI",
  n8n: "https://x.com/n8n_io",
  zavu: "https://x.com/zavudev",
  cursor: "https://x.com/cursor_ai",
  elevenlabs: "https://x.com/elevenlabsio",
  firecrawl: "https://x.com/firecrawl_dev",
  cognition: "https://x.com/cognition",
  datamcp: "https://x.com/mironovisa",
  exa: "https://x.com/ExaAILabs",
  fal: "https://x.com/fal",
  wispr: "https://x.com/WisprFlow",
};

function perkWebsite(id: BuilderPerkId): string {
  const override = WEBSITE_OVERRIDES[id];
  if (override) return override;

  const sponsor = sponsors.find((entry) => entry.id === id);
  if (!sponsor) {
    throw new Error(`builder-perk-social-links: missing sponsors entry for "${id}"`);
  }

  return sponsor.url;
}

export function getBuilderPerkSocialLinks(id: BuilderPerkId): BuilderPerkSocialLinks {
  return {
    website: perkWebsite(id),
    linkedin: LINKEDIN_BY_PERK[id],
    x: X_BY_PERK[id],
  };
}
