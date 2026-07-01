import type { TranslationKey } from "../i18n/translations";

/** Builder hub FAQ entries — add `{ q, a }` pairs as questions arrive. */
export const BUILDER_FAQ_KEYS = [
  { q: "builder.faq.globalPodium.q", a: "builder.faq.globalPodium.a" },
  { q: "builder.faq.codexBestUse.q", a: "builder.faq.codexBestUse.a" },
  { q: "builder.faq.ideaReplication.q", a: "builder.faq.ideaReplication.a" },
  { q: "builder.faq.lumaRegistration.q", a: "builder.faq.lumaRegistration.a" },
  { q: "builder.faq.teamFormation.q", a: "builder.faq.teamFormation.a" },
  { q: "builder.faq.codeFreeze.q", a: "builder.faq.codeFreeze.a" },
  { q: "builder.faq.twoTeams.q", a: "builder.faq.twoTeams.a" },
  { q: "builder.faq.leaveVenue.q", a: "builder.faq.leaveVenue.a" },
  { q: "builder.faq.githubMonitoring.q", a: "builder.faq.githubMonitoring.a" },
  { q: "builder.faq.socialMedia.q", a: "builder.faq.socialMedia.a" },
  { q: "builder.faq.socialPlatforms.q", a: "builder.faq.socialPlatforms.a" },
  { q: "builder.faq.plagiarismAndEmergency.q", a: "builder.faq.plagiarismAndEmergency.a" },
  { q: "builder.faq.missingTeammates.q", a: "builder.faq.missingTeammates.a" },
] as const satisfies {
  q: TranslationKey;
  a: TranslationKey;
}[];
