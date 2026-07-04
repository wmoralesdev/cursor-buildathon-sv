import { BUILDER_TEAM_SECTION_ENABLED } from "../constants";
import type { TranslationKey } from "../i18n/translations";

export const BUILDER_DEFAULT_SECTION = "hub" as const;

export type BuilderSectionId =
  | "hub"
  | "team"
  | "logistics"
  | "mentors"
  | "submit"
  | "premios"
  | "credits"
  | "faq";

const BUILDER_SECTION_IDS: BuilderSectionId[] = [
  "hub",
  "team",
  "logistics",
  "mentors",
  "submit",
  "premios",
  "credits",
  "faq",
];

export function isBuilderSectionId(id: string): id is BuilderSectionId {
  return (BUILDER_SECTION_IDS as string[]).includes(id);
}

export function resolveBuilderSectionFromHash(hash: string): BuilderSectionId {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const baseId = id.split("/")[0] ?? id;
  if (baseId === "judges" || baseId === "tracks") {
    return BUILDER_DEFAULT_SECTION;
  }
  if (baseId && isBuilderSectionId(baseId)) {
    if (baseId === "team" && !BUILDER_TEAM_SECTION_ENABLED) {
      return BUILDER_DEFAULT_SECTION;
    }
    return baseId;
  }
  return BUILDER_DEFAULT_SECTION;
}

export const BUILDER_NAV_SECTIONS: { id: BuilderSectionId; labelKey: TranslationKey }[] = [
  { id: "hub", labelKey: "builder.nav.hub" },
  ...(BUILDER_TEAM_SECTION_ENABLED
    ? [{ id: "team" as const, labelKey: "builder.nav.team" as TranslationKey }]
    : []),
  { id: "logistics", labelKey: "builder.nav.logistics" },
  { id: "mentors", labelKey: "builder.nav.mentors" },
  { id: "submit", labelKey: "builder.nav.submit" },
  { id: "premios", labelKey: "builder.nav.premios" },
  { id: "credits", labelKey: "builder.nav.credits" },
  { id: "faq", labelKey: "builder.nav.faq" },
];
