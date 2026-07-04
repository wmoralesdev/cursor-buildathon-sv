import type { TranslationKey } from "../i18n/translations";
import {
  BUILDER_PERK_TOTAL,
  CREDIT_PARTNERS,
  formatCreditPartnerValue,
  type CreditPartnerId,
} from "../lib/credits-sponsor-sections";

export type PrizeLogo =
  | "cursor"
  | "codex"
  | "elevenlabs"
  | "n8n"
  | "zavu"
  | "firecrawl"
  | "datamcp"
  | "cognition"
  | "exa"
  | "fal"
  | "wispr"
  | null;

/** Per-builder perk pack total (excludes per-team Fal). */
export const CREDITS_TOTAL = `$${BUILDER_PERK_TOTAL}`;

/** Solo-team baseline: cash $1,000 + Codex 10K×3 + n8n 720 + EL Scale 990 + EL Pro 297 + Cursor credits 500 */
export const PRIZES_TOTAL = "$33K+";

/** Example team size for projected overall-winner totals (teams are 2–5). */
export const OVERALL_PRIZE_PROJECTION_MEMBERS = 4;

export type ParticipantPerkId =
  | "cursor"
  | "codex"
  | "elevenlabs"
  | "n8n"
  | "zavu"
  | "firecrawl"
  | "datamcp"
  | "devin"
  | "exa"
  | "fal"
  | "wispr";

export interface ParticipantPerkDef {
  id: ParticipantPerkId;
  logo: PrizeLogo;
  sponsor: string;
  value: string;
  perTeam?: boolean;
}

const PARTICIPANT_PERK_SPONSOR: Record<Exclude<CreditPartnerId, "netlify">, string> = {
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

const PARTICIPANT_PERK_LOGO: Record<Exclude<CreditPartnerId, "netlify">, PrizeLogo> = {
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
};

/** Translation key suffix under `onePager.prizes.perk.*` */
const PARTICIPANT_PERK_I18N_ID: Record<Exclude<CreditPartnerId, "netlify">, ParticipantPerkId> = {
  codex: "codex",
  n8n: "n8n",
  zavu: "zavu",
  cursor: "cursor",
  elevenlabs: "elevenlabs",
  firecrawl: "firecrawl",
  cognition: "devin",
  datamcp: "datamcp",
  exa: "exa",
  fal: "fal",
  wispr: "wispr",
};

export const PARTICIPANT_PERK_DEFS: ParticipantPerkDef[] = CREDIT_PARTNERS.filter(
  (partner): partner is (typeof CREDIT_PARTNERS)[number] & {
    id: Exclude<CreditPartnerId, "netlify">;
  } => partner.id !== "netlify",
).map((partner) => ({
  id: PARTICIPANT_PERK_I18N_ID[partner.id],
  logo: PARTICIPANT_PERK_LOGO[partner.id],
  sponsor: PARTICIPANT_PERK_SPONSOR[partner.id],
  value: formatCreditPartnerValue(partner),
  perTeam: partner.perTeam,
}));

export type TrackPrizeId = "codex" | "elevenlabs" | "n8n";

export interface TrackPrizeDef {
  id: TrackPrizeId;
  logo: PrizeLogo;
  sponsor: string;
  value: string;
}

export const TRACK_PRIZE_DEFS: TrackPrizeDef[] = [
  { id: "codex", logo: "codex", sponsor: "Codex", value: "$10K / member" },
  { id: "elevenlabs", logo: "elevenlabs", sponsor: "ElevenLabs", value: "$990 / member" },
  { id: "n8n", logo: "n8n", sponsor: "n8n", value: "$720 / member" },
];

export interface OverallCreditLine {
  labelKey: TranslationKey;
  value: string;
}

export interface OverallPrizeDef {
  placeId: "1st" | "2nd" | "3rd";
  cash: string;
  credits: OverallCreditLine[];
}

export const OVERALL_PRIZE_DEFS: OverallPrizeDef[] = [
  {
    placeId: "1st",
    cash: "$500",
    credits: [
      {
        labelKey: "onePager.prizes.overall.1st.credit.cursor.label",
        value: "$250",
      },
      {
        labelKey: "onePager.prizes.overall.1st.credit.elevenlabs.label",
        value: "$297",
      },
    ],
  },
  {
    placeId: "2nd",
    cash: "$300",
    credits: [
      {
        labelKey: "onePager.prizes.overall.2nd.credit.cursor.label",
        value: "$150",
      },
    ],
  },
  {
    placeId: "3rd",
    cash: "$200",
    credits: [
      {
        labelKey: "onePager.prizes.overall.3rd.credit.cursor.label",
        value: "$100",
      },
    ],
  },
];
