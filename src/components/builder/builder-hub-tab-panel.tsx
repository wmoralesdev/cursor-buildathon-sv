import { type ReactNode } from "react";

import { useTranslation } from "../../context/language-context";
import { getBuilderHubTab, type BuilderHubTabId } from "../../lib/builder-hub-tabs";

interface BuilderHubTabPanelProps {
  tabId: BuilderHubTabId;
  activeTabId: BuilderHubTabId;
  children: ReactNode;
}

export function BuilderHubTabPanel({
  tabId,
  activeTabId,
  children,
}: BuilderHubTabPanelProps) {
  const { t } = useTranslation();
  const tab = getBuilderHubTab(tabId);
  const active = tabId === activeTabId;

  if (!active) return null;

  return (
    <div
      role="tabpanel"
      id={`builder-tabpanel-${tabId}`}
      aria-labelledby={`builder-tab-${tabId}`}
      className="builder-tab-panel bg-bg-alt"
    >
      <div className="mx-auto max-w-[1400px] section-padding pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24">
        <p className="mb-8 max-w-[52ch] font-display text-base leading-[1.7] text-fg-3 sm:text-lg">
          {t(tab.descriptionKey)}
        </p>
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
}
