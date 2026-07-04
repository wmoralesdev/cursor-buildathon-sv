import { useCallback, useEffect, useState } from "react";

import {
  HUB_DEFAULT_SUB_TAB,
  hubSubTabHash,
  persistHubSubTab,
  resolveHubSubTabFromHash,
  type HubSubTabId,
} from "../lib/hub-sub-tabs";

function readSubTabFromLocation(): HubSubTabId {
  if (typeof window === "undefined") return HUB_DEFAULT_SUB_TAB;
  return resolveHubSubTabFromHash(window.location.hash);
}

/** Hub sub-tab state synced with `#hub/{tab}` hash and sessionStorage. */
export function useHubSubTab() {
  const [activeSubTab, setActiveSubTabState] = useState<HubSubTabId>(readSubTabFromLocation);

  const setActiveSubTab = useCallback((tabId: HubSubTabId) => {
    setActiveSubTabState(tabId);
    persistHubSubTab(tabId);
    const hash = hubSubTabHash(tabId);
    if (window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const tabId = readSubTabFromLocation();
      setActiveSubTabState(tabId);
      persistHubSubTab(tabId);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  return { activeSubTab, setActiveSubTab };
}
