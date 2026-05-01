import { useMemo } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";

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
        sub:   t("details.start.sub"),
        accent: true,
      },
      {
        glyph: "02",
        label: t("details.end.label"),
        value: t("details.end.value"),
        sub:   t("details.end.sub"),
        accent: false,
      },
      {
        glyph: "03",
        label: t("details.venue.label"),
        value: t("details.venue.value"),
        sub:   EVENT_VENUE_FULL,
        accent: false,
      },
      {
        glyph: "04",
        label: t("details.city.label"),
        value: t("details.city.value"),
        sub:   t("details.country.sub"),
        accent: false,
      },
    ],
    [t],
  );

  return (
    <section
      id="details"
      className="relative py-24 sm:py-32 lg:py-40 section-padding bg-bg-alt"
    >
      <div className="max-w-[1400px] mx-auto">
        <header className="reveal mb-12 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="tag mb-4 inline-block">{t("details.tag")}</span>
            <AnchorHeading id="details">
              <h2 className="font-display font-medium text-fg tracking-[-0.02em] leading-[1] text-[clamp(2rem,4.4vw,3.4rem)]">
                {t("details.title")}
              </h2>
            </AnchorHeading>
          </div>
          <p className="md:col-span-5 font-mono text-xs text-fg-3 tracking-[0.08em] max-w-[36ch] md:text-right md:ml-auto leading-[1.7]">
            {t("details.note")}
          </p>
        </header>

        {/* Data band — borderless rows, divided by 1px lines */}
        <ul className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border-faint border-y border-border-faint mb-6">
          {rows.map((d, i) => (
            <li
              key={d.glyph}
              className={`reveal relative flex flex-col gap-2 px-6 py-7 ${
                d.accent ? "bg-accent/[0.05]" : ""
              }`}
              style={{ "--delay": `${i * 0.07}s` } as React.CSSProperties}
            >
              <span
                className={`font-mono text-[0.65rem] tracking-[0.16em] tabular-nums absolute top-3 right-4 ${
                  d.accent ? "text-accent/70" : "text-fg-5"
                }`}
              >
                {d.glyph}
              </span>
              {d.accent && (
                <span aria-hidden className="absolute top-0 left-0 h-8 w-0.5 bg-accent" />
              )}
              <p
                className={`font-mono text-[0.65rem] tracking-[0.18em] uppercase ${
                  d.accent ? "text-accent" : "text-fg-3"
                }`}
              >
                {d.label}
              </p>
              <p
                className={`font-display font-semibold leading-[1.1] tabular-nums text-[clamp(1.3rem,2.6vw,1.7rem)] ${
                  d.accent ? "text-accent tracking-normal" : "text-fg tracking-[-0.02em]"
                }`}
              >
                {d.value}
              </p>
              <p className="font-mono text-[0.65rem] text-fg-4 tracking-[0.05em] leading-[1.5]">
                {d.sub}
              </p>
            </li>
          ))}
        </ul>

        {/* Venue + map */}
        <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border-faint bg-bg-raised/70">
          <div className="flex items-center justify-between flex-wrap gap-3 py-6 px-7">
            <div className="flex items-center gap-3 min-w-0">
              <MapPin className="h-4 w-4 text-accent shrink-0" strokeWidth={1.5} aria-hidden />
              <span className="font-mono text-xs text-fg-2 tracking-[0.08em] truncate">
                {t("details.venueLine")}
              </span>
            </div>
            <a
              href="https://maps.google.com/?q=Universidad+Francisco+Gavidia+San+Salvador"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 font-mono text-[0.65rem] text-accent tracking-[0.14em] uppercase no-underline border-b border-accent/40 pb-px transition-[border-color] duration-200 hover:border-accent"
            >
              {t("details.mapCta")}
              <ArrowUpRight
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.75}
                aria-hidden
              />
            </a>
          </div>
          <div className="relative h-[220px] lg:h-auto lg:min-h-[200px] border-t lg:border-t-0 lg:border-l border-border-faint">
            <iframe
              title="Universidad Francisco Gavidia, San Salvador"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.2!2d-89.19!3d13.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f6331!2sUniversidad+Francisco+Gavidia!5e0!3m2!1ses!2ssv!4v1"
              className="absolute inset-0 w-full h-full grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
