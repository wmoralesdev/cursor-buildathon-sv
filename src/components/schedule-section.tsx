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
      className="group relative py-28 sm:py-36 lg:py-48 section-padding bg-bg"
    >
      <div className="h-rule mb-20 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          <div className="lg:col-span-4 reveal">
            <span className="tag mb-4 inline-block">{t("schedule.tag")}</span>
            <AnchorHeading id="schedule">
              <h2 className="font-bold uppercase leading-none mb-6 font-display text-[clamp(2rem,4vw,3rem)] text-fg tracking-[-0.02em]">
                {t("schedule.title1")}
                <br />
                <span className="text-accent">{t("schedule.title2")}</span>
              </h2>
            </AnchorHeading>
            <p className="font-display text-[0.9rem] text-fg-3 leading-[1.7] max-w-[300px]">{t("schedule.intro")}</p>

            <div className="mt-8 inline-flex flex-col border border-border px-5 py-4">
              <span className="font-mono text-[0.55rem] tracking-[0.18em] uppercase text-fg-3 mb-1.5">
                {t("schedule.durationLabel")}
              </span>
              <span className="font-display text-[2rem] font-bold text-accent tracking-[-0.02em] leading-none">
                ~24 h
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 relative">
            <div className="absolute left-0 top-0 bottom-0 w-px timeline-line" />

            <div className="space-y-0 pl-8">
              {schedule.map((item, i) => (
                <div
                  key={item.time}
                  className={`reveal relative ${i === 0 ? "pt-0 pb-8" : i === schedule.length - 1 ? "pt-8 pb-0" : "py-8"} ${i < schedule.length - 1 ? "border-b border-border-dim" : ""}`}
                  style={{ "--delay": `${i * 0.07}s` } as React.CSSProperties}
                >
                  <div
                    className={`absolute rounded-full timeline-dot ${item.highlight ? "timeline-dot--highlight" : ""} ${i === 0 ? "timeline-dot--first" : ""}`}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                    <span
                      className={`font-mono text-[0.75rem] tracking-[0.08em] min-w-[52px] shrink-0 ${item.highlight ? "text-accent" : "text-fg-4"}`}
                    >
                      {item.time}
                    </span>
                    <div>
                      <h3
                        className={`font-display text-base uppercase tracking-[0.03em] mb-1 ${item.highlight ? "font-semibold text-fg" : "font-medium text-fg-2"}`}
                      >
                        {item.title}
                      </h3>
                      <p className="font-display text-[0.82rem] text-fg-4 leading-[1.6]">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
