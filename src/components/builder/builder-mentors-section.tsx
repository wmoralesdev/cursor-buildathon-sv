import { useMemo, useState } from "react";

import { BuilderSectionHeader } from "./builder-section-header";
import { EventRosterCard } from "../event-roster-card";
import { MENTORS } from "../../data/mentors";
import type { EventPersonRosterEntry } from "../../types/event-person-roster";
import { useTranslation } from "../../context/language-context";
import { partitionMentorsByPresence } from "../../lib/mentor-irl-filter";
import type { TranslationKey } from "../../i18n/translations";

type MentorPresenceTab = "irl" | "online";

const MENTOR_SUBTABS: {
  id: MentorPresenceTab;
  labelKey: TranslationKey;
  hintKey: TranslationKey;
  emptyKey: TranslationKey;
  panelId: string;
}[] = [
  {
    id: "irl",
    labelKey: "builder.mentors.onsiteTitle",
    hintKey: "builder.mentors.onsiteHint",
    emptyKey: "builder.mentors.onsiteEmpty",
    panelId: "builder-mentors-panel-irl",
  },
  {
    id: "online",
    labelKey: "builder.mentors.remoteTitle",
    hintKey: "builder.mentors.remoteHint",
    emptyKey: "builder.mentors.remoteEmpty",
    panelId: "builder-mentors-panel-online",
  },
];

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function BuilderMentorsSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<MentorPresenceTab>("irl");

  const { irl, online } = useMemo(() => partitionMentorsByPresence(MENTORS), []);

  const entries = activeTab === "irl" ? irl : online;
  const activeSubtab = MENTOR_SUBTABS.find((tab) => tab.id === activeTab)!;

  return (
    <section id="mentors" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40 bg-bg">
      <BuilderSectionHeader
        id="mentors"
        tagKey="builder.mentors.tag"
        title1Key="builder.mentors.title1"
        title2Key="builder.mentors.title2"
        asideKey="builder.mentors.aside"
      />

      <div className="reveal">
        <nav aria-label={t("builder.mentors.subtabNav")}>
          <ul
            role="tablist"
            className="flex flex-wrap gap-1 border-b border-border-faint pb-2"
          >
            {MENTOR_SUBTABS.map(({ id, labelKey, panelId }) => {
              const isActive = activeTab === id;
              return (
                <li key={id} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    id={`builder-mentors-tab-${id}`}
                    aria-selected={isActive}
                    aria-controls={panelId}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveTab(id)}
                    className={`inline-flex items-center rounded-none border px-3 py-1 font-mono text-[0.675rem] uppercase tracking-[0.12em] transition-colors sm:text-[0.725rem] ${
                      isActive
                        ? "border-accent/50 bg-accent/10 text-accent"
                        : "border-transparent text-fg-4 hover:border-accent/40 hover:text-accent"
                    }`}
                  >
                    {t(labelKey)}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          role="tabpanel"
          id={activeSubtab.panelId}
          aria-labelledby={`builder-mentors-tab-${activeTab}`}
          className="mt-4"
        >
          <p className="font-mono text-[0.675rem] uppercase tracking-[0.14em] text-fg-4">
            {t(activeSubtab.hintKey)}
          </p>

          {entries.length > 0 ? (
            <MentorGrid entries={entries} showBookingCta={activeTab === "online"} />
          ) : (
            <p className="mt-4 border border-dashed border-border-faint bg-surface px-5 py-6 font-mono text-[0.775rem] uppercase tracking-[0.12em] text-fg-5">
              {t(activeSubtab.emptyKey)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function MentorGrid({
  entries,
  showBookingCta,
}: {
  entries: EventPersonRosterEntry[];
  showBookingCta: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
      {entries.map((entry, i) => (
        <div key={entry.id} className="flex min-w-0 flex-col gap-2">
          <EventRosterCard
            kind="mentors"
            index={i}
            name={entry.name}
            role={entry.title}
            initials={initialsFromName(entry.name)}
            company={entry.company}
            companyHref={entry.companyHref}
            companyLogo={entry.companyLogo}
            brief={entry.bio}
            photo={entry.photo}
            placeholder={entry.placeholder}
            confirmedLabel={t("roster.confirmed")}
            incomingLabel={t("roster.incoming")}
            unconfirmedRoleLabel={t("roster.unconfirmedRole")}
            legible
          />
          {showBookingCta && entry.bookingUrl && (
            <a
              href={entry.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-border-faint px-3 py-2 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-3 no-underline transition-colors hover:border-accent/50 hover:text-accent"
            >
              {t("builder.mentors.bookSlot")}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
