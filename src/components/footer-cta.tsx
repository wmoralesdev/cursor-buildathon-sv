import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";

import { AnchorHeading } from "./anchor-heading";
import { SPONSOR_MAILTO } from "../constants";
import { useTranslation } from "../context/language-context";
import type { TranslationKey } from "../i18n/translations";

export function FooterCTA() {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();

  const navLinks = useMemo(
    () =>
      [
        { href: "#about", labelKey: "footer.nav.audience" as const },
        { href: "#people", labelKey: "footer.nav.credibility" as const },
        { href: "#benefits", labelKey: "footer.nav.benefits" as const },
        { href: "#tiers", labelKey: "footer.nav.packages" as const },
        { href: "#faq", labelKey: "footer.nav.faq" as const },
        { href: "#overview", labelKey: "footer.nav.event" as const },
        { href: "#details", labelKey: "footer.nav.details" as const },
        { href: "#numbers", labelKey: "footer.nav.numbers" as const },
        { href: "#sponsors", labelKey: "footer.nav.host" as const },
        { href: "#partners", labelKey: "footer.nav.partners" as const },
        { href: "#schedule", labelKey: "footer.nav.schedule" as const },
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
      <section id="cta" className="group relative py-36 sm:py-48 section-padding overflow-hidden bg-bg">
        <div className="absolute pointer-events-none glow-center" />

        <div className="h-rule mb-20 max-w-7xl mx-auto" />

        <div className="max-w-7xl mx-auto text-center reveal">
          <span className="tag mb-8 inline-block">{t("footer.ctaTag")}</span>
          <AnchorHeading id="cta">
            <h2 className="font-bold uppercase mb-6 font-display text-[clamp(3rem,10vw,8rem)] text-fg tracking-[-0.03em] leading-[0.9]">
              {t("footer.ctaTitle1")}
              <br />
              <span className="text-accent">{t("footer.ctaTitle2")}</span>
            </h2>
          </AnchorHeading>
          <p className="mx-auto mb-12 font-display text-[1.05rem] text-fg-3 leading-[1.7] max-w-[520px]">
            {t("footer.ctaBody")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
            <a
              href={SPONSOR_MAILTO}
              className="btn-phosphor inline-block text-base px-14 py-[18px] no-underline"
            >
              {t("footer.ctaPrimary")}
            </a>
            <Link
              to={{ pathname: "/", hash: "tiers" }}
              className="btn-ghost inline-block text-base px-10 py-[18px] no-underline"
            >
              {t("footer.ctaSecondary")}
            </Link>
          </div>

          <div className="mt-8 font-mono text-[0.65rem] text-fg-5 tracking-widest uppercase">
            {t("footer.ctaWhenWhere")}
          </div>
        </div>
      </section>

      <footer className="relative py-24 section-padding border-t border-border bg-bg-deep">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 mb-12">
            <div>
              <div className="mb-5">
                <img
                  src={resolvedTheme === "light" ? "/lockup-light.png" : "/lockup-dark.png"}
                  alt="Cursor"
                  className="h-10 w-auto object-contain"
                />
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
              <p className="font-mono text-[0.55rem] text-fg-4 tracking-[0.2em] uppercase mb-3.5">
                {t("footer.navTitle")}
              </p>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="footer-nav-link font-display text-[0.82rem] text-fg-3 no-underline tracking-[0.04em] transition-colors duration-200"
                    >
                      {t(link.labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[0.55rem] text-fg-4 tracking-[0.2em] uppercase mb-3.5">
                {t("footer.hostsTitle")}
              </p>
              <ul className="space-y-2">
                {hosts.map((host) => (
                  <li key={host.name} className="flex flex-col">
                    <span className="font-display text-[0.82rem] text-fg-2 tracking-[0.04em]">{host.name}</span>
                    <span className="font-mono text-[0.6rem] text-fg-4 tracking-[0.06em]">{host.handle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border-dim pt-5">
            <span className="font-mono text-[0.6rem] text-fg-5 tracking-[0.08em]">{t("footer.copyright")}</span>
            <a
              href="#tiers"
              className="font-mono text-[0.6rem] text-accent tracking-[0.12em] uppercase no-underline"
            >
              {t("footer.toTiers")}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
