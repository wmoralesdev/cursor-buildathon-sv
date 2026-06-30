import type { TranslationKey } from "../i18n/translations";

export type PrizeLogo =
  | "cursor"
  | "codex"
  | "elevenlabs"
  | "n8n"
  | "zavu"
  | "firecrawl"
  | "datamcp"
  | null;

/** Sum of PARTICIPANT_PERK_DEFS values: 60+70+22+60+75+20+38+20 */
export const CREDITS_TOTAL = "$365";
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
  | "devin";

export interface ParticipantPerkDef {
  id: ParticipantPerkId;
  logo: PrizeLogo;
  sponsor: string;
  value: string;
}

export const PARTICIPANT_PERK_DEFS: ParticipantPerkDef[] = [
  { id: "cursor", logo: "cursor", sponsor: "Cursor", value: "$60" },
  { id: "codex", logo: "codex", sponsor: "Codex", value: "$70" },
  { id: "elevenlabs", logo: "elevenlabs", sponsor: "ElevenLabs", value: "$22" },
  { id: "n8n", logo: "n8n", sponsor: "n8n", value: "$60" },
  { id: "zavu", logo: "zavu", sponsor: "Zavu", value: "$75" },
  { id: "firecrawl", logo: "firecrawl", sponsor: "Firecrawl", value: "~$20" },
  { id: "datamcp", logo: "datamcp", sponsor: "DataMCP", value: "$38" },
  { id: "devin", logo: null, sponsor: "Devin", value: "$20" },
];

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
