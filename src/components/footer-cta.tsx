import { useMemo } from "react";
import { Link } from "react-router-dom";

import { AnchorHeading } from "./anchor-heading";
import { CursorLockup } from "./sponsor-logos";
import { SPONSOR_MAILTO } from "../constants";
import { useTranslation } from "../context/language-context";
import type { TranslationKey } from "../i18n/translations";

export function FooterCTA() {
  const { t } = useTranslation();

  const navLinks = useMemo(
    () =>
      [
        { href: "#about", labelKey: "footer.nav.audience" as const },
        { href: "#benefits", labelKey: "footer.nav.benefits" as const },
        { href: "#people", labelKey: "footer.nav.credibility" as const },
        { href: "#numbers", labelKey: "footer.nav.numbers" as const },
        { href: "#details", labelKey: "footer.nav.details" as const },
        { href: "#schedule", labelKey: "footer.nav.schedule" as const },
        { href: "#faq", labelKey: "footer.nav.faq" as const },
        { href: "#cta", labelKey: "footer.nav.contact" as const },
      ] satisfies { href: string; labelKey: TranslationKey }[],
    [],
  );

  const hosts = useMemo(
    () => [
      { name: "Daniela Huezo", handle: t("footer.host.daniela") },
      { name: "Walter Morales", handle: t("footer.host.walter") },
    ],
    [t],
  );

  const footerBlurbLines = t("footer.blurb").split("\n");

  return (
    <>
      <section id="cta" className="relative py-28 sm:py-36 section-padding overflow-hidden bg-bg">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[60%] glow-center opacity-70" />

        <div className="relative max-w-[1400px] mx-auto reveal grid gap-12 lg:grid-cols-12 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <span className="tag mb-6 inline-block">{t("footer.ctaTag")}</span>
            <AnchorHeading id="cta">
              <h2 className="font-display font-medium text-fg tracking-[-0.02em] leading-[0.95] text-[clamp(2.4rem,6vw,4.5rem)]">
                {t("footer.ctaTitle1")}
                <br />
                <span className="text-accent">{t("footer.ctaTitle2")}</span>
              </h2>
            </AnchorHeading>
            <p className="mt-6 font-display text-base text-fg-2 leading-[1.75] max-w-[55ch]">
              {t("footer.ctaBody")}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <a
              href={SPONSOR_MAILTO}
              className="btn-phosphor inline-flex items-center justify-center text-sm px-7 py-4 no-underline"
            >
              {t("footer.ctaPrimary")}
            </a>
            <Link
              to={{ pathname: "/", hash: "faq" }}
              className="btn-ghost inline-flex items-center justify-center text-sm px-7 py-4 no-underline"
            >
              {t("footer.ctaSecondary")}
            </Link>
            <div className="mt-3 font-mono text-[0.65rem] text-fg-5 tracking-[0.16em] uppercase text-center">
              {t("footer.ctaWhenWhere")}
            </div>
          </div>
        </div>
      </section>

      <footer className="relative py-24 section-padding border-t border-border bg-bg-deep">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 mb-12">
            <div>
              <div className="mb-5">
                <CursorLockup alt="Cursor" className="h-10 w-auto object-contain" />
              </div>
              <p className="font-mono text-[0.65rem] text-fg-4 tracking-[0.06em] leading-[1.8]">
                {footerBlurbLines.map((line, i) => (
                  <span key={line}>
                    {line}
                    {i < footerBlurbLines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            </div>

            <div>
              <p className="font-mono text-[0.65rem] text-fg-4 tracking-[0.2em] uppercase mb-3.5">
                {t("footer.navTitle")}
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-6 gap-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="footer-nav-link font-display text-sm text-fg-3 no-underline tracking-[0.04em] transition-colors duration-200"
                    >
                      {t(link.labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[0.65rem] text-fg-4 tracking-[0.2em] uppercase mb-3.5">
                {t("footer.hostsTitle")}
              </p>
              <ul className="space-y-2">
                {hosts.map((host) => (
                  <li key={host.name} className="flex flex-col">
                    <span className="font-display text-sm text-fg-2 tracking-[0.04em]">{host.name}</span>
                    <span className="font-mono text-[0.65rem] text-fg-4 tracking-[0.06em]">{host.handle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border-dim pt-5">
            <span className="font-mono text-[0.65rem] text-fg-5 tracking-[0.08em]">{t("footer.copyright")}</span>
            <a
              href="#cta"
              className="font-mono text-[0.65rem] text-accent tracking-[0.12em] uppercase no-underline"
            >
              {t("footer.toSponsor")}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
