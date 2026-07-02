import { useCallback, useEffect, useState } from "react";

import {
  type BuilderHubSectionId,
  type BuilderHubTabId,
  resolveBuilderHubTarget,
} from "../lib/builder-hub-tabs";
import { scrollToBuilderSection } from "../lib/builder-section-scroll";

function readHashTarget() {
  if (typeof window === "undefined") {
    return resolveBuilderHubTarget("");
  }
  return resolveBuilderHubTarget(window.location.hash);
}

function writeHash(tabId: BuilderHubTabId, sectionId: BuilderHubSectionId | null) {
  const hash = sectionId ? `#${sectionId}` : `#${tabId}`;
  if (window.location.hash !== hash) {
    window.history.pushState(null, "", hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
}

export function useBuilderHubTab() {
  const [activeTabId, setActiveTabId] = useState<BuilderHubTabId>(() => readHashTarget().tabId);

  useEffect(() => {
    const syncFromHash = () => {
      const { tabId } = readHashTarget();
      setActiveTabId(tabId);
    };

    const onFocusTab = (event: Event) => {
      const detail = (event as CustomEvent<{ tabId: BuilderHubTabId }>).detail;
      if (detail?.tabId) {
        setActiveTabId(detail.tabId);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("builder-hub:focus-tab", onFocusTab);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("builder-hub:focus-tab", onFocusTab);
    };
  }, []);

  const selectTab = useCallback((tabId: BuilderHubTabId) => {
    setActiveTabId(tabId);
    writeHash(tabId, null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const selectSection = useCallback((sectionId: BuilderHubSectionId) => {
    const { tabId } = resolveBuilderHubTarget(sectionId);
    setActiveTabId(tabId);
    writeHash(tabId, sectionId);
    scrollToBuilderSection(sectionId);
  }, []);

  return {
    activeTabId,
    selectTab,
    selectSection,
  };
}
