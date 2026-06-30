import type { TranslationKey } from "../i18n/translations";

/** Competition categories mirror the Convex `projects.track` union. */
export type CompetitionTrackId = "ai_consumer" | "fintech_web3";

export interface CompetitionTrackDef {
  id: CompetitionTrackId;
  code: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}

export const COMPETITION_TRACK_DEFS: CompetitionTrackDef[] = [
  {
    id: "ai_consumer",
    code: "T-01",
    titleKey: "builder.tracks.competition.ai_consumer.title",
    descriptionKey: "builder.tracks.competition.ai_consumer.description",
  },
  {
    id: "fintech_web3",
    code: "T-02",
    titleKey: "builder.tracks.competition.fintech_web3.title",
    descriptionKey: "builder.tracks.competition.fintech_web3.description",
  },
];
