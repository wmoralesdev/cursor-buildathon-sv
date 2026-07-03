import { type ReactNode, Suspense } from "react";

import type { BuilderSectionId } from "../../lib/builder-sections";

type BuilderTabPanelProps = {
  sectionId: BuilderSectionId;
  activeSection: BuilderSectionId;
  visited: boolean;
  fallback?: ReactNode;
  children: ReactNode;
};

export function BuilderTabPanel({
  sectionId,
  activeSection,
  visited,
  fallback = null,
  children,
}: BuilderTabPanelProps) {
  const isActive = activeSection === sectionId;

  if (!visited) return null;

  return (
    <div
      id={`builder-tabpanel-${sectionId}`}
      role="tabpanel"
      aria-labelledby={`builder-tab-${sectionId}`}
      hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
    >
      <div className="mx-auto w-full max-w-[1400px] section-padding">
        <Suspense fallback={fallback}>{children}</Suspense>
      </div>
    </div>
  );
}
