import { useMemo } from "react";

import { AnchorHeading } from "./anchor-heading";
import { EVENT_VENUE_FULL } from "../constants";
import { useTranslation } from "../context/language-context";

export function DetailsSection() {
  const { t } = useTranslation();

  const rows = useMemo(
    () => [
      {
        glyph: "01",
        label: t("details.start.label"),
        value: t("details.start.value"),
        sub: t("details.start.sub"),
        accent: true,
      },
      {
        glyph: "02",
        label: t("details.end.label"),
        value: t("details.end.value"),
        sub: t("details.end.sub"),
        accent: false,
      },
      {
        glyph: "03",
        label: t("details.venue.label"),
        value: t("details.venue.value"),
        sub: EVENT_VENUE_FULL,
        accent: false,
      },
      {
        glyph: "04",
        label: t("details.city.label"),
        value: t("details.city.value"),
        sub: t("details.country.sub"),
        accent: false,
      },
    ],
    [t],
  );

  return (
    <section
      id="details"
      className="group relative py-28 sm:py-36 lg:py-48 section-padding bg-bg-alt"
    >
      <div className="h-rule mb-20 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 reveal">
          <div>
            <span className="tag mb-4 inline-block">{t("details.tag")}</span>
            <AnchorHeading id="details">
              <h2 className="font-bold uppercase leading-none font-display text-[clamp(2rem,5vw,3.5rem)] text-fg tracking-[-0.02em]">
                {t("details.title")}
              </h2>
            </AnchorHeading>
          </div>
          <p className="font-mono text-[0.7rem] text-fg-2 tracking-[0.1em] max-w-[240px] text-right leading-[1.6]">
            {t("details.note")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rows.map((d, i) => (
            <div
              key={d.glyph}
              className={`reveal py-9 px-7 relative overflow-hidden border ${d.accent ? "border-accent/50 bg-accent/[0.06]" : "border-border bg-bg-raised"}`}
              style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
            >
              <span
                className={`absolute top-4 right-4 font-mono text-[0.55rem] tracking-[0.1em] ${d.accent ? "text-accent/50" : "text-fg-6"}`}
              >
                {d.glyph}
              </span>

              {d.accent && <div className="absolute top-0 left-0 w-0.5 h-10 bg-accent" />}

              <p
                className={`font-mono text-[0.6rem] tracking-[0.18em] uppercase mb-3 ${d.accent ? "text-accent" : "text-fg-3"}`}
              >
                {d.label}
              </p>

              <p
                className={`font-display text-[clamp(1.3rem,3vw,1.8rem)] font-bold leading-[1.1] mb-2 ${d.accent ? "text-accent tracking-normal" : "text-fg tracking-[-0.02em]"}`}
              >
                {d.value}
              </p>

              <p className="font-mono text-[0.65rem] text-fg-4 tracking-[0.05em] leading-[1.5]">{d.sub}</p>
            </div>
          ))}
        </div>

        <div className="reveal mt-6 flex items-center justify-between flex-wrap gap-3 py-6 px-8 border border-border bg-bg-raised">
          <div className="flex items-center gap-4">
            <span className="text-accent text-[0.9rem]">◎</span>
            <span className="font-mono text-[0.7rem] text-fg-2 tracking-[0.08em]">{t("details.venueLine")}</span>
          </div>
          <a
            href="https://maps.google.com/?q=Universidad+Francisco+Gavidia+San+Salvador"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.65rem] text-accent tracking-[0.12em] uppercase no-underline border-b border-accent/30 pb-px transition-[border-color] duration-200 hover:border-accent"
          >
            {t("details.mapCta")}
          </a>
        </div>
      </div>
    </section>
  );
}
