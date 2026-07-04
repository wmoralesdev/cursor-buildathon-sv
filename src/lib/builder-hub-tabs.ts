import { BUILDER_TEAM_SECTION_ENABLED } from "../constants";
import type { TranslationKey } from "../i18n/translations";

export type BuilderHubTabId = "event" | "build" | "compete" | "help";

export type BuilderHubSectionId =
  | "logistics"
  | "team"
  | "mentors"
  | "submit"
  | "credits"
  | "judges"
  | "premios"
  | "faq"
  | "sponsors";

export interface BuilderHubTabSection {
  id: BuilderHubSectionId;
  labelKey: TranslationKey;
}

export interface BuilderHubTabDef {
  id: BuilderHubTabId;
  labelKey: TranslationKey;
  descriptionKey: TranslationKey;
  sections: BuilderHubTabSection[];
}

const EVENT_SECTIONS: BuilderHubTabSection[] = [
  { id: "logistics", labelKey: "builder.nav.logistics" },
  ...(BUILDER_TEAM_SECTION_ENABLED
    ? [{ id: "team" as const, labelKey: "builder.nav.team" as TranslationKey }]
    : []),
];

const BUILD_SECTIONS: BuilderHubTabSection[] = [
  { id: "mentors", labelKey: "builder.nav.mentors" },
  { id: "submit", labelKey: "builder.nav.submit" },
  { id: "credits", labelKey: "builder.nav.credits" },
];

const COMPETE_SECTIONS: BuilderHubTabSection[] = [
  { id: "judges", labelKey: "builder.nav.judges" },
  { id: "premios", labelKey: "builder.nav.premios" },
];

const HELP_SECTIONS: BuilderHubTabSection[] = [
  { id: "faq", labelKey: "builder.nav.faq" },
];

export const BUILDER_HUB_TABS: BuilderHubTabDef[] = [
  {
    id: "event",
    labelKey: "builder.tabs.event",
    descriptionKey: "builder.tabs.eventDesc",
    sections: EVENT_SECTIONS,
  },
  {
    id: "build",
    labelKey: "builder.tabs.build",
    descriptionKey: "builder.tabs.buildDesc",
    sections: BUILD_SECTIONS,
  },
  {
    id: "compete",
    labelKey: "builder.tabs.compete",
    descriptionKey: "builder.tabs.competeDesc",
    sections: COMPETE_SECTIONS,
  },
  {
    id: "help",
    labelKey: "builder.tabs.help",
    descriptionKey: "builder.tabs.helpDesc",
    sections: HELP_SECTIONS,
  },
];

const SECTION_TO_TAB = new Map<BuilderHubSectionId | BuilderHubTabId, BuilderHubTabId>();

for (const tab of BUILDER_HUB_TABS) {
  SECTION_TO_TAB.set(tab.id, tab.id);
  for (const section of tab.sections) {
    SECTION_TO_TAB.set(section.id, tab.id);
  }
}

SECTION_TO_TAB.set("sponsors", "event");

export function isBuilderHubTabId(value: string): value is BuilderHubTabId {
  return BUILDER_HUB_TABS.some((tab) => tab.id === value);
}

export function resolveBuilderHubTarget(hash: string): {
  tabId: BuilderHubTabId;
  sectionId: BuilderHubSectionId | null;
} {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) {
    return { tabId: "event", sectionId: null };
  }

  const tabId = SECTION_TO_TAB.get(raw as BuilderHubSectionId | BuilderHubTabId);
  if (!tabId) {
    return { tabId: "event", sectionId: null };
  }

  if (isBuilderHubTabId(raw)) {
    return { tabId: raw, sectionId: null };
  }

  return { tabId, sectionId: raw as BuilderHubSectionId };
}

export function getBuilderHubTab(tabId: BuilderHubTabId): BuilderHubTabDef {
  const tab = BUILDER_HUB_TABS.find((entry) => entry.id === tabId);
  if (!tab) {
    return BUILDER_HUB_TABS[0]!;
  }
  return tab;
}
