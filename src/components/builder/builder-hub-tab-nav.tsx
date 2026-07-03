import { useTranslation } from "../../context/language-context";
import {
  BUILDER_HUB_TABS,
  getBuilderHubTab,
  type BuilderHubSectionId,
  type BuilderHubTabId,
} from "../../lib/builder-hub-tabs";

interface BuilderHubTabNavProps {
  activeTabId: BuilderHubTabId;
  onSelectTab: (tabId: BuilderHubTabId) => void;
  onSelectSection: (sectionId: BuilderHubSectionId) => void;
}

export function BuilderHubTabNav({
  activeTabId,
  onSelectTab,
  onSelectSection,
}: BuilderHubTabNavProps) {
  const { t } = useTranslation();
  const activeTab = getBuilderHubTab(activeTabId);

  return (
    <div className="sticky top-0 z-30 border-y border-border-faint bg-bg/95 backdrop-blur-sm">
      <div
        role="tablist"
        aria-label={t("builder.tabs.listLabel")}
        className="mx-auto flex max-w-[1400px] gap-1 overflow-x-auto section-padding py-2.5 sm:gap-2 sm:py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {BUILDER_HUB_TABS.map((tab) => {
          const selected = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`builder-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`builder-tabpanel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelectTab(tab.id)}
              className={`shrink-0 rounded-none border px-3 py-2 font-mono text-[0.725rem] uppercase tracking-[0.12em] transition-colors sm:px-4 sm:text-sm ${
                selected
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-transparent text-fg-4 hover:border-accent/40 hover:text-accent"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {activeTab.sections.length > 1 ? (
        <nav
          aria-label={t("builder.tabs.sectionsLabel")}
          className="border-t border-border-faint bg-bg/80"
        >
          <ul className="mx-auto flex max-w-[1400px] snap-x gap-1 overflow-x-auto section-padding py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {activeTab.sections.map(({ id, labelKey }) => (
              <li key={id} className="shrink-0 snap-start">
                <button
                  type="button"
                  onClick={() => onSelectSection(id)}
                  className="inline-flex items-center rounded-none border border-transparent px-2.5 py-1 font-mono text-[0.675rem] uppercase tracking-[0.1em] text-fg-4 transition-colors hover:border-border hover:text-fg-2 sm:px-3 sm:text-[0.725rem]"
                >
                  {t(labelKey)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
