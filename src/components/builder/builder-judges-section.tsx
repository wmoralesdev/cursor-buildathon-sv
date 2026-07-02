import { BuilderSectionHeader } from "./builder-section-header";
import { EventRosterCard } from "../event-roster-card";
import { JUDGES } from "../../data/judges";
import { useTranslation } from "../../context/language-context";
import {
  builderSectionSurfaceClass,
  type BuilderSectionLayout,
} from "../../lib/builder-section-layout";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function BuilderJudgesSection({ layout = "page" }: { layout?: BuilderSectionLayout }) {
  const { t } = useTranslation();

  return (
    <section id="judges" className={builderSectionSurfaceClass(layout, "bg-bg")}>
      <div className={layout === "page" ? "max-w-[1400px] mx-auto" : undefined}>
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
      </div>
    </section>
  );
}
