import { useCallback, useEffect, useRef, useState } from "react";

import {
  BUILDER_DEFAULT_SECTION,
  type BuilderSectionId,
  resolveBuilderSectionFromHash,
} from "../lib/builder-sections";
import { navigateToBuilderSection } from "../lib/builder-section-scroll";

function readSectionFromLocation(): BuilderSectionId {
  if (typeof window === "undefined") return BUILDER_DEFAULT_SECTION;
  return resolveBuilderSectionFromHash(window.location.hash);
}

type UseBuilderActiveSectionOptions = {
  enabled?: boolean;
};

/** Active builder hub tab synced with `#section` hash. */
export function useBuilderActiveSection({ enabled = true }: UseBuilderActiveSectionOptions = {}) {
  const [activeSection, setActiveSectionState] = useState<BuilderSectionId>(readSectionFromLocation);
  const [visitedSections, setVisitedSections] = useState<Set<BuilderSectionId>>(
    () => new Set([readSectionFromLocation()]),
  );
  const paneRef = useRef<HTMLDivElement>(null);

  const setActiveSection = useCallback(
    (sectionId: BuilderSectionId) => {
      if (!enabled) return;
      setActiveSectionState(sectionId);
      setVisitedSections((prev) => {
        if (prev.has(sectionId)) return prev;
        const next = new Set(prev);
        next.add(sectionId);
        return next;
      });
      navigateToBuilderSection(sectionId);
    },
    [enabled],
  );

  useEffect(() => {
    if (!enabled) return;

    const syncFromHash = () => {
      const sectionId = readSectionFromLocation();
      setActiveSectionState(sectionId);
      setVisitedSections((prev) => {
        if (prev.has(sectionId)) return prev;
        const next = new Set(prev);
        next.add(sectionId);
        return next;
      });
    };

    if (!window.location.hash) {
      navigateToBuilderSection(BUILDER_DEFAULT_SECTION);
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    paneRef.current?.scrollTo({ top: 0 });
  }, [activeSection, enabled]);

  return { activeSection, visitedSections, setActiveSection, paneRef };
}
