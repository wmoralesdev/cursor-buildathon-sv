import { BuilderSectionHeader } from "./builder-section-header";
import { EventRosterCard } from "../event-roster-card";
import { JUDGES } from "../../data/judges";
import { useTranslation } from "../../context/language-context";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function BuilderJudgesSection() {
  const { t } = useTranslation();

  return (
    <section id="judges" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40 bg-bg">
      <BuilderSectionHeader
          id="judges"
          tagKey="builder.judges.tag"
          title1Key="builder.judges.title1"
          title2Key="builder.judges.title2"
          asideKey="builder.judges.aside"
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {JUDGES.map((entry, i) => (
            <EventRosterCard
              key={entry.id}
              kind="judges"
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
          ))}
        </div>
    </section>
  );
}
