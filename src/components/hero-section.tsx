import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { CountdownTimer } from "./countdown-timer";
import { EVENT_VENUE_SHORT } from "../constants";
import { useTranslation } from "../context/language-context";
import type { TranslationKey } from "../i18n/translations";

const HERO_TITLE = "CURSOR BUILDATHON";

const HERO_PARTNER_LOGOS = [
  {
    id: "n8n",
    href: "https://n8n.io",
    logo: "/sponsors/n8n-logo.svg",
    logoDark: "/sponsors/n8n-logo-dark.svg",
    label: "n8n",
    logoClassName: "h-6 w-auto max-h-6 max-w-[88px] object-contain sm:h-6 sm:max-h-6",
  },
  {
    id: "zavu",
    href: "https://zavu.dev",
    logo: "/sponsors/zavu-logo.svg",
    logoDark: "/sponsors/zavu-logo-dark.webp",
    label: "Zavu",
    logoClassName: "h-8 w-auto max-h-8 max-w-[132px] object-contain sm:h-9 sm:max-h-9",
  },
] as const;

export function HeroSection() {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();

  const stats = useMemo(
    () =>
      [
        { v: "~24h", labelKey: "hero.stat.build" },
        { v: "~200", labelKey: "hero.stat.capacity" },
        { v: "CA", labelKey: "hero.stat.region" },
        { v: t("hero.stat.editionValue"), labelKey: "hero.stat.edition" },
      ] as { v: string; labelKey: TranslationKey }[],
    [t],
  );

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden section-padding bg-bg"
    >
      <div className="absolute inset-0 pointer-events-none bg-grid mask-radial-hero" />

      <div className="absolute pointer-events-none glow-top-center" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-7xl mx-auto w-full pt-12 pb-24">
        <div className="mb-10 animate-delay-[0.1s]">
          <span className="tag">
            {t("hero.sponsorTagline")} {EVENT_VENUE_SHORT}
          </span>
        </div>

        <div className="relative mb-6 w-full max-w-6xl mx-auto px-1">
          <div className="flex flex-col items-center gap-5">
            <div className="relative mx-auto w-full max-w-[min(100%,42rem)] animate-[flicker_8s_ease-in-out_infinite]">
              <h1 className="relative select-none text-center font-display font-bold uppercase leading-[0.92] tracking-[-0.02em] text-[clamp(2.1rem,6.25vw,4.85rem)] text-fg whitespace-normal sm:whitespace-nowrap">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 font-display text-[clamp(2.1rem,6.25vw,4.85rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-accent animate-[glitch-1_6s_ease-in-out_infinite]"
                >
                  {HERO_TITLE}
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 font-display text-[clamp(2.1rem,6.25vw,4.85rem)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-[#00ffcc] animate-[glitch-2_6s_ease-in-out_infinite]"
                >
                  {HERO_TITLE}
                </span>
                {HERO_TITLE}
              </h1>
            </div>

            <div
              className="flex w-full max-w-xl shrink-0 flex-wrap items-center justify-center gap-7 border-t border-border/45 pt-6 sm:gap-9"
              aria-label="Partner logos"
            >
              {HERO_PARTNER_LOGOS.map((p) => {
                const src = resolvedTheme === "dark" ? p.logoDark : p.logo;
                return (
                  <a
                    key={p.id}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block opacity-95 transition-opacity hover:opacity-100"
                    aria-label={`${p.label} (opens in a new tab)`}
                  >
                    <img src={src} alt="" className={p.logoClassName} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mb-4 font-mono text-[clamp(0.85rem,2vw,1.1rem)] text-fg-3 tracking-[0.15em] uppercase">
          {t("hero.regionYear")}
        </p>
        <p className="mb-14 max-w-2xl mx-auto font-display text-[0.98rem] text-fg-2 leading-[1.75] px-2">
          {t("hero.pitch")}
        </p>

        <div className="mb-12">
          <p className="font-mono text-[0.55rem] tracking-[0.2em] text-accent uppercase mb-2.5">
            {t("hero.countdownLabel")}
          </p>
          <CountdownTimer />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
          <Link
            to={{ pathname: "/", hash: "tiers" }}
            className="btn-phosphor inline-block text-center text-[0.78rem] py-[11px] px-7 no-underline"
          >
            {t("hero.ctaTiers")}
          </Link>
          <a href="#about" className="btn-ghost inline-block text-center text-[0.78rem] py-[10px] px-7">
            {t("hero.ctaAbout")}
          </a>
        </div>

        <div className="mt-16 flex flex-wrap gap-8 justify-center border-t border-border pt-6">
          {stats.map((stat) => (
            <div key={stat.labelKey}>
              <div className="font-display text-[1.5rem] font-bold text-fg leading-none">{stat.v}</div>
              <div className="font-mono text-[0.6rem] tracking-[0.15em] text-fg-3 uppercase mt-1">
                {t(stat.labelKey)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none h-[220px]">
        <svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-15"
        >
          <path
            d="M0,220 L0,160 L40,160 L40,130 L55,130 L55,100 L70,100 L70,130 L85,130 L85,160
            L120,160 L120,110 L135,110 L135,80 L145,80 L145,60 L155,60 L155,80 L165,80 L165,110 L180,110 L180,160
            L210,160 L210,140 L225,140 L225,120 L240,120 L240,140 L255,140 L255,160
            L290,160 L290,100 L300,100 L300,70 L308,70 L308,50 L316,50 L316,70 L324,70 L324,100 L340,100 L340,160
            L370,160 L370,130 L385,130 L385,115 L395,115 L395,130 L410,130 L410,160
            L440,160 L440,120 L450,120 L450,90 L460,90 L460,70 L470,70 L470,55 L480,55 L480,70 L490,70 L490,90 L500,90 L500,120 L510,120 L510,160
            L540,160 L540,145 L555,145 L555,130 L570,130 L570,145 L585,145 L585,160
            L615,160 L615,110 L625,110 L625,85 L635,85 L635,65 L645,65 L645,85 L655,85 L655,110 L670,110 L670,160
            L700,160 L700,140 L715,140 L715,125 L725,125 L725,140 L740,140 L740,160
            L775,160 L775,105 L785,105 L785,80 L795,80 L795,60 L805,60 L805,45 L815,45 L815,60 L825,60 L825,80 L835,80 L835,105 L845,105 L845,160
            L875,160 L875,135 L890,135 L890,120 L900,120 L900,135 L915,135 L915,160
            L945,160 L945,115 L960,115 L960,90 L970,90 L970,115 L985,115 L985,160
            L1015,160 L1015,140 L1030,140 L1030,160
            L1060,160 L1060,120 L1070,120 L1070,95 L1080,95 L1080,75 L1090,75 L1090,60 L1100,60 L1100,75 L1110,75 L1110,95 L1120,95 L1120,120 L1135,120 L1135,160
            L1165,160 L1165,145 L1180,145 L1180,130 L1195,130 L1195,145 L1210,145 L1210,160
            L1240,160 L1240,110 L1255,110 L1255,85 L1265,85 L1265,110 L1280,110 L1280,160
            L1310,160 L1310,140 L1325,140 L1325,160
            L1355,160 L1355,120 L1365,120 L1365,95 L1375,95 L1375,120 L1390,120 L1390,160
            L1440,160 L1440,220 Z"
            fill={resolvedTheme === "light" ? "#1c1814" : "#f5f0e8"}
          />
        </svg>
        <div className="absolute inset-0 fade-to-bg-bottom" />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-[float-up_2.5s_ease-in-out_infinite]">
        <div className="w-px h-12 bg-[linear-gradient(to_bottom,rgba(255,75,0,0.8),transparent)]" />
      </div>
    </section>
  );
}
