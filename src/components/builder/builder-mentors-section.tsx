import { useMemo } from "react";

import { BuilderSectionHeader } from "./builder-section-header";
import { EventRosterCard } from "../event-roster-card";
import { MENTORS } from "../../data/mentors";
import type { EventPersonRosterEntry } from "../../types/event-person-roster";
import { useTranslation } from "../../context/language-context";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function BuilderMentorsSection() {
  const { t } = useTranslation();

  const { onsite, remote } = useMemo(() => {
    const onsite: EventPersonRosterEntry[] = [];
    const remote: EventPersonRosterEntry[] = [];
    for (const entry of MENTORS) {
      if (entry.presence === "remote") remote.push(entry);
      else onsite.push(entry);
    }
    return { onsite, remote };
  }, []);

  return (
    <section id="mentors" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40 section-padding bg-bg">
      <div className="max-w-[1400px] mx-auto">
        <BuilderSectionHeader
          id="mentors"
          tagKey="builder.mentors.tag"
          title1Key="builder.mentors.title1"
          title2Key="builder.mentors.title2"
          asideKey="builder.mentors.aside"
        />

        <MentorGroup
          titleKey="builder.mentors.onsiteTitle"
          hintKey="builder.mentors.onsiteHint"
          entries={onsite}
        />

        <div className="mt-14">
          <MentorGroup
            titleKey="builder.mentors.remoteTitle"
            hintKey="builder.mentors.remoteHint"
            entries={remote}
          />
          {remote.length === 0 && (
            <p className="reveal mt-4 border border-dashed border-border-faint bg-surface px-5 py-6 font-mono text-[0.775rem] uppercase tracking-[0.12em] text-fg-5">
              {t("builder.mentors.remoteEmpty")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function MentorGroup({
  titleKey,
  hintKey,
  entries,
}: {
  titleKey: "builder.mentors.onsiteTitle" | "builder.mentors.remoteTitle";
  hintKey: "builder.mentors.onsiteHint" | "builder.mentors.remoteHint";
  entries: EventPersonRosterEntry[];
}) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="reveal mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border-faint pb-3">
        <h3 className="font-display text-[1.025rem] font-semibold uppercase tracking-[0.08em] text-fg">
          {t(titleKey)}
        </h3>
        <span className="font-mono text-[0.675rem] uppercase tracking-[0.14em] text-fg-4">
          {t(hintKey)}
        </span>
      </div>

      {entries.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
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
              {entry.bookingUrl && (
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
      )}
    </div>
  );
}
