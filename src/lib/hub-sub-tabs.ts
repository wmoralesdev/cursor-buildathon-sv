import type { TranslationKey } from "../i18n/translations";

export type HubSubTabId = "equipo" | "proyecto" | "tracks" | "envio" | "posts" | "reservas";

export const HUB_DEFAULT_SUB_TAB: HubSubTabId = "equipo";

/** Legacy hash/session ids mapped to the current sub-tab ids. */
const LEGACY_HUB_SUB_TAB_IDS: Record<string, HubSubTabId> = {
  overview: "equipo",
  build: "proyecto",
  submit: "envio",
  book: "reservas",
};

export const HUB_SUB_TAB_STORAGE_KEY = "hub-sub-tab";

export interface HubSubTabDef {
  id: HubSubTabId;
  labelKey: TranslationKey;
  descriptionKey: TranslationKey;
}

export const HUB_SUB_TABS: HubSubTabDef[] = [
  {
    id: "equipo",
    labelKey: "hub.subTabs.equipo",
    descriptionKey: "hub.subTabs.equipoDesc",
  },
  {
    id: "proyecto",
    labelKey: "hub.subTabs.proyecto",
    descriptionKey: "hub.subTabs.proyectoDesc",
  },
  {
    id: "tracks",
    labelKey: "hub.subTabs.tracks",
    descriptionKey: "hub.subTabs.tracksDesc",
  },
  {
    id: "envio",
    labelKey: "hub.subTabs.envio",
    descriptionKey: "hub.subTabs.envioDesc",
  },
  {
    id: "posts",
    labelKey: "hub.subTabs.posts",
    descriptionKey: "hub.subTabs.postsDesc",
  },
  {
    id: "reservas",
    labelKey: "hub.subTabs.reservas",
    descriptionKey: "hub.subTabs.reservasDesc",
  },
];

const HUB_SUB_TAB_IDS = new Set<string>(HUB_SUB_TABS.map((tab) => tab.id));

export function isHubSubTabId(value: string): value is HubSubTabId {
  return HUB_SUB_TAB_IDS.has(value);
}

function normalizeHubSubTabId(value: string): HubSubTabId | null {
  if (isHubSubTabId(value)) {
    return value;
  }
  return LEGACY_HUB_SUB_TAB_IDS[value] ?? null;
}

export function getHubSubTab(tabId: HubSubTabId): HubSubTabDef {
  return HUB_SUB_TABS.find((tab) => tab.id === tabId) ?? HUB_SUB_TABS[0]!;
}

/** Parse `#hub`, `#hub/proyecto`, or legacy `#tracks` into a sub-tab id. */
export function resolveHubSubTabFromHash(hash: string): HubSubTabId {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const parts = raw.split("/");
  if (parts[0] === "tracks") {
    return "tracks";
  }
  if (parts[0] !== "hub") {
    return readStoredHubSubTab();
  }
  const subTab = parts[1];
  if (subTab) {
    const normalized = normalizeHubSubTabId(subTab);
    if (normalized) {
      return normalized;
    }
  }
  return readStoredHubSubTab();
}

export function readStoredHubSubTab(): HubSubTabId {
  if (typeof window === "undefined") {
    return HUB_DEFAULT_SUB_TAB;
  }
  try {
    const stored = sessionStorage.getItem(HUB_SUB_TAB_STORAGE_KEY);
    if (stored) {
      const normalized = normalizeHubSubTabId(stored);
      if (normalized) {
        return normalized;
      }
    }
  } catch {
    // sessionStorage unavailable
  }
  return HUB_DEFAULT_SUB_TAB;
}

export function persistHubSubTab(tabId: HubSubTabId): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(HUB_SUB_TAB_STORAGE_KEY, tabId);
  } catch {
    // sessionStorage unavailable
  }
}

export function hubSubTabHash(tabId: HubSubTabId): string {
  return `#hub/${tabId}`;
}
