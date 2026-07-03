import { BUILDER_TEAM_SECTION_ENABLED } from "../constants";
import type { TranslationKey } from "../i18n/translations";

export const BUILDER_DEFAULT_SECTION = "hub" as const;

export type BuilderSectionId =
  | "hub"
  | "team"
  | "logistics"
  | "mentors"
  | "submit"
  | "tracks"
  | "premios"
  | "credits"
  | "faq";

const BUILDER_SECTION_IDS: BuilderSectionId[] = [
  "hub",
  "team",
  "logistics",
  "mentors",
  "submit",
  "tracks",
  "premios",
  "credits",
  "faq",
];

export function isBuilderSectionId(id: string): id is BuilderSectionId {
  return (BUILDER_SECTION_IDS as string[]).includes(id);
}

export function resolveBuilderSectionFromHash(hash: string): BuilderSectionId {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  if (id === "judges") {
    return BUILDER_DEFAULT_SECTION;
  }
  if (id && isBuilderSectionId(id)) {
    if (id === "team" && !BUILDER_TEAM_SECTION_ENABLED) {
      return BUILDER_DEFAULT_SECTION;
    }
    return id;
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
  { id: "tracks", labelKey: "builder.nav.tracks" },
  { id: "premios", labelKey: "builder.nav.premios" },
  { id: "credits", labelKey: "builder.nav.credits" },
  { id: "faq", labelKey: "builder.nav.faq" },
];
