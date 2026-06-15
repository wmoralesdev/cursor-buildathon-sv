import { useMemo } from "react";

import { AnchorHeading } from "./anchor-heading";
import { CursorLockup } from "./sponsor-logos";
import { CURSOR_HOST_URL, landingSponsorGridEntries } from "../lib/landing-sponsor-grid";
import { useTranslation } from "../context/language-context";

export function SponsorsSection() {
  const { t } = useTranslation();

  const entries = useMemo(() => landingSponsorGridEntries(), []);

  return (
    <section
      id="sponsors"
      className="relative py-24 sm:py-32 lg:py-40 section-padding bg-bg-alt"
    >
      <div className="max-w-[1400px] mx-auto">
        <header className="reveal mb-12 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="tag mb-4 inline-block">{t("sponsorsSection.tag")}</span>
            <AnchorHeading id="sponsors">
              <h2 className="font-display font-medium text-fg tracking-[-0.02em] leading-[1] text-[clamp(2rem,4.4vw,3.4rem)]">
                {t("sponsorsSection.title1")}
                <br />
                <span className="text-accent">{t("sponsorsSection.title2")}</span>
              </h2>
            </AnchorHeading>
          </div>
          <p className="md:col-span-5 font-display text-base text-fg-3 leading-[1.7] max-w-[40ch] md:text-right md:ml-auto">
            {t("sponsorsSection.intro")}
          </p>
        </header>

        <div className="reveal mb-8 flex flex-col items-center gap-3 border border-border bg-surface px-6 py-8 sm:px-10">
          <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-fg-4">
            {t("sponsorsSection.hostLabel")}
          </span>
          <a
            href={CURSOR_HOST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex opacity-90 transition-opacity duration-200 hover:opacity-100"
            aria-label="Cursor — event host"
          >
            <CursorLockup alt="Cursor" className="h-9 w-auto object-contain sm:h-10" />
          </a>
        </div>

        <ul className="reveal grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {entries.map((entry, i) => {
            const Logo = entry.Logo;
            return (
              <li
                key={entry.id}
                className="group flex min-h-[5.5rem] items-center justify-center border border-border bg-surface px-4 py-6 transition-[border-color,background] duration-300 hover:border-accent/35 hover:bg-accent/[0.02]"
                style={{ "--delay": `${i * 0.03}s` } as React.CSSProperties}
              >
                <a
                  href={entry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={entry.label}
                  className="flex h-full w-full items-center justify-center opacity-85 transition-opacity duration-200 group-hover:opacity-100"
                >
                  <Logo alt={entry.label} className={entry.className} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
