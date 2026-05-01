import { useMemo } from "react";

import { AnchorHeading } from "./anchor-heading";
import { useTranslation } from "../context/language-context";

export function ScheduleSection() {
  const { t } = useTranslation();

  const schedule = useMemo(
    () => [
      {
        time: t("schedule.item1.time"),
        title: t("schedule.item1.title"),
        desc: t("schedule.item1.desc"),
        highlight: true,
      },
      {
        time: t("schedule.item2.time"),
        title: t("schedule.item2.title"),
        desc: t("schedule.item2.desc"),
        highlight: false,
      },
      {
        time: t("schedule.item3.time"),
        title: t("schedule.item3.title"),
        desc: t("schedule.item3.desc"),
        highlight: true,
      },
    ],
    [t],
  );

  return (
    <section
      id="schedule"
      className="relative py-24 sm:py-32 lg:py-40 section-padding bg-bg"
    >
      <div className="max-w-[1400px] mx-auto">
        <header className="reveal mb-12 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="tag mb-4 inline-block">{t("schedule.tag")}</span>
            <AnchorHeading id="schedule">
              <h2 className="font-display font-medium text-fg tracking-[-0.02em] leading-[1] text-[clamp(2rem,4.4vw,3.4rem)]">
                {t("schedule.title1")}
                <br />
                <span className="text-accent">{t("schedule.title2")}</span>
              </h2>
            </AnchorHeading>
          </div>

          <div className="md:col-span-5 md:text-right md:ml-auto">
            <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-fg-3 block mb-1.5">
              {t("schedule.durationLabel")}
            </span>
            <span className="font-display text-2xl font-bold text-accent tracking-[-0.02em] leading-none tabular-nums">
              ~24 h
            </span>
          </div>
        </header>

        <p className="reveal mb-10 font-display text-base text-fg-3 leading-[1.75] max-w-[60ch]">
          {t("schedule.intro")}
        </p>

        {/* Timeline rail — single column on mobile, 3 columns on lg */}
        <ol className="grid gap-px bg-border-faint sm:grid-cols-3">
          {schedule.map((item, i) => (
            <li
              key={item.time}
              className={`reveal relative flex flex-col gap-3 px-7 py-8 sm:px-8 sm:py-10 ${
                item.highlight ? "bg-accent/[0.04]" : "bg-bg-raised"
              }`}
              style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
            >
              {item.highlight && (
                <span aria-hidden className="absolute top-0 left-0 h-10 w-0.5 bg-accent" />
              )}
              <span
                className={`font-mono text-[0.7rem] tracking-[0.18em] uppercase tabular-nums ${
                  item.highlight ? "text-accent" : "text-fg-4"
                }`}
              >
                {item.time}
              </span>
              <h3
                className={`font-display text-base sm:text-lg uppercase tracking-[0.02em] ${
                  item.highlight ? "font-semibold text-fg" : "font-medium text-fg-2"
                }`}
              >
                {item.title}
              </h3>
              <p className="font-display text-sm text-fg-4 leading-[1.7] max-w-[34ch]">
                {item.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
