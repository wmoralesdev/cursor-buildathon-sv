import { useMemo } from "react";

import { AnchorHeading } from "./anchor-heading";
import { PersonCard } from "./brief/person-card";
import type { EventPersonRosterEntry } from "../types/event-person-roster";
import { useTranslation } from "../context/language-context";
import type { TranslationKey } from "../i18n/translations";

interface EventRosterSectionProps {
  id: "mentors" | "judges";
  tagKey: TranslationKey;
  title1Key: TranslationKey;
  title2Key: TranslationKey;
  asideKey: TranslationKey;
  placeholderNameKey: TranslationKey;
  entries: EventPersonRosterEntry[];
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function EventRosterSection({
  id,
  tagKey,
  title1Key,
  title2Key,
  asideKey,
  placeholderNameKey,
  entries,
}: EventRosterSectionProps) {
  const { t } = useTranslation();

  const cards = useMemo(
    () =>
      entries.map((entry) => ({
        initials: entry.placeholder ? "—" : initialsFromName(entry.name),
        name: entry.placeholder ? t(placeholderNameKey) : entry.name,
        role: entry.title,
        photo: entry.photo,
        placeholder: entry.placeholder,
      })),
    [entries, placeholderNameKey, t],
  );

  return (
    <section
      id={id}
      className="relative py-24 sm:py-32 lg:py-40 section-padding bg-bg"
    >
      <div className="max-w-[1400px] mx-auto">
        <header className="reveal mb-12 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="tag mb-4 inline-block">{t(tagKey)}</span>
            <AnchorHeading id={id}>
              <h2 className="font-display font-medium text-fg tracking-[-0.02em] leading-[1] text-[clamp(2rem,4.4vw,3.4rem)]">
                {t(title1Key)}
                <br />
                <span className="text-accent">{t(title2Key)}</span>
              </h2>
            </AnchorHeading>
          </div>
          <p className="md:col-span-5 font-display text-base text-fg-3 leading-[1.7] max-w-[40ch] md:text-right md:ml-auto">
            {t(asideKey)}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((person, i) => (
            <PersonCard key={`${id}-${person.name}-${i}`} {...person} size="sm" index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
