import { ArrowUpRight, MapPin } from "lucide-react";

import { BuilderSectionHeader } from "./builder-section-header";
import { CountdownTimer } from "../countdown-timer";
import { EVENT_VENUE_FULL, SUBMISSION_DEADLINE_ISO } from "../../constants";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";

const SCHEDULE_ITEMS: {
  timeKey: TranslationKey;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}[] = [
  {
    timeKey: "schedule.item1.time",
    titleKey: "schedule.item1.title",
    descKey: "schedule.item1.desc",
  },
  {
    timeKey: "schedule.item2.time",
    titleKey: "schedule.item2.title",
    descKey: "schedule.item2.desc",
  },
  {
    timeKey: "schedule.item3.time",
    titleKey: "schedule.item3.title",
    descKey: "schedule.item3.desc",
  },
];

export function BuilderLogisticsSection() {
  const { t } = useTranslation();

  return (
    <section id="logistics" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40 section-padding bg-bg-alt">
      <div className="max-w-[1400px] mx-auto">
        <BuilderSectionHeader
          id="logistics"
          tagKey="builder.logistics.tag"
          title1Key="builder.logistics.title1"
          title2Key="builder.logistics.title2"
          asideKey="builder.logistics.aside"
        />

        <div className="reveal mb-5 flex flex-col gap-5 border border-accent/30 bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="font-mono text-[0.675rem] uppercase tracking-[0.2em] text-accent">
              {t("builder.logistics.deadlineLabel")}
            </p>
            <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-4">
              {t("builder.logistics.deadlineWhen")}
            </p>
            <p className="mt-3 max-w-[40ch] font-display text-[0.975rem] leading-[1.6] text-fg-3">
              {t("builder.logistics.deadlineHint")}
            </p>
          </div>
          <div className="shrink-0">
            <CountdownTimer targetIso={SUBMISSION_DEADLINE_ISO} legible animate={false} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="reveal border border-border bg-surface p-6 sm:p-8">
            <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border-faint pb-3">
              <h3 className="font-display text-[1.025rem] font-semibold uppercase tracking-[0.08em] text-fg">
                {t("builder.logistics.scheduleTitle")}
              </h3>
              <span className="font-mono text-[0.675rem] uppercase tracking-[0.14em] text-fg-4">
                {t("builder.logistics.scheduleHint")}
              </span>
            </div>
            <ol className="m-0 list-none p-0">
              {SCHEDULE_ITEMS.map((item, i) => (
                <li
                  key={item.titleKey}
                  className={`flex items-start gap-4 ${i < SCHEDULE_ITEMS.length - 1 ? "mb-5" : ""}`}
                >
                  <span className="mt-[2px] w-14 shrink-0 font-mono text-[0.725rem] uppercase tracking-[0.12em] text-accent">
                    {t(item.timeKey)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[1.025rem] font-semibold text-fg">
                      {t(item.titleKey)}
                    </p>
                    <p className="mt-1 font-display text-[0.925rem] leading-[1.55] text-fg-3">
                      {t(item.descKey)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="reveal reveal-delay-1 flex flex-col border border-border bg-surface p-6 sm:p-8">
            <h3 className="mb-5 border-b border-border-faint pb-3 font-display text-[1.025rem] font-semibold uppercase tracking-[0.08em] text-fg">
              {t("builder.logistics.venueTitle")}
            </h3>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.5} aria-hidden />
              <span className="font-mono text-sm leading-[1.6] tracking-[0.06em] text-fg-2">
                {EVENT_VENUE_FULL}
              </span>
            </div>
            <a
              href="https://maps.google.com/?q=Universidad+Francisco+Gavidia+San+Salvador"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-1.5 self-start border-b border-accent/40 pb-px font-mono text-[0.725rem] uppercase tracking-[0.14em] text-accent no-underline transition-[border-color] duration-200 hover:border-accent"
            >
              {t("details.mapCta")}
              <ArrowUpRight
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.75}
                aria-hidden
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
