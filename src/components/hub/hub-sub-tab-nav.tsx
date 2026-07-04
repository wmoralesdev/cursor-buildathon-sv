import { useTranslation } from "../../context/language-context";
import { useHubSubTab } from "../../hooks/use-hub-sub-tab";
import { getHubSubTab, HUB_SUB_TABS, type HubSubTabId } from "../../lib/hub-sub-tabs";

export function HubSubTabNav() {
  const { t } = useTranslation();
  const { activeSubTab, setActiveSubTab } = useHubSubTab();
  const activeTab = getHubSubTab(activeSubTab);

  return (
    <div className="mb-6 border-y border-border-faint">
      <div
        role="tablist"
        aria-label={t("hub.subTabs.listLabel")}
        className="flex gap-1 py-2.5"
      >
        {HUB_SUB_TABS.map((tab) => {
          const selected = tab.id === activeSubTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`hub-subtab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`hub-subtabpanel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveSubTab(tab.id as HubSubTabId)}
              className={`shrink-0 rounded-none border px-4 py-2 font-mono text-sm uppercase tracking-[0.12em] transition-colors ${
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
      <p className="border-t border-border-faint py-3 font-display text-[0.925rem] leading-relaxed text-fg-3">
        {t(activeTab.descriptionKey)}
      </p>
    </div>
  );
}
