import type { ComponentType } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Calendar, MapPin, Users } from "lucide-react";

import { CountdownTimer } from "./countdown-timer";
import {
  LEAD_PARTNERS,
  LEAD_PARTNERS_ROW_1,
  LEAD_PARTNERS_ROW_2,
} from "./hero-section/hero-partner-config";
import { LeadPartnerLink } from "./hero-section/lead-partner-link";
import { SponsorRail } from "./hero-section/sponsor-rail";
import { SPONSOR_MAILTO } from "../constants";
import { useTranslation } from "../context/language-context";
import type { TranslationKey } from "../i18n/translations";

interface BriefRow {
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  labelKey: TranslationKey;
  valueKey: TranslationKey;
  subKey: TranslationKey;
}

function HeroCountdown() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center">
      <p className="font-mono text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-2 text-center">
        {t("hero.countdownLabel")}
      </p>
      <CountdownTimer />
    </div>
  );
}

const BRIEF_ROWS: BriefRow[] = [
  {
    Icon: Calendar,
    labelKey: "hero.brief.window.label",
    valueKey: "hero.brief.window.value",
    subKey: "hero.brief.window.sub",
  },
  {
    Icon: MapPin,
    labelKey: "hero.brief.venue.label",
    valueKey: "hero.brief.venue.value",
    subKey: "hero.brief.venue.sub",
  },
  {
    Icon: Users,
    labelKey: "hero.brief.audience.label",
    valueKey: "hero.brief.audience.value",
    subKey: "hero.brief.audience.sub",
  },
];

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100dvh_-_var(--site-nav-height))] flex-col overflow-hidden bg-bg"
    >
      <div className="absolute inset-0 pointer-events-none bg-grid mask-radial-hero opacity-70" />
      <div className="absolute inset-x-0 top-0 h-[60vh] pointer-events-none glow-top-center opacity-80" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center section-padding py-8 sm:py-10">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <motion.div
              className="lg:col-span-7 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="tag w-fit mb-7">{t("hero.eyebrow")}</span>

              <h1 className="font-display font-bold uppercase text-fg tracking-[-0.02em] leading-[0.95]">
                <span className="block text-[clamp(2.4rem,5.5vw,4.4rem)]">
                  {t("hero.title.line1")}
                </span>
                <span className="mt-1 block text-[clamp(1.4rem,3.2vw,2.4rem)] text-accent font-medium tracking-[0.02em]">
                  {t("hero.title.line2")}
                </span>
              </h1>

              <div className="mt-5 sm:mt-6">
                <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-fg-4 mb-3">
                  {t("hero.tierPartners.label")}
                </p>
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 sm:gap-x-5 lg:hidden">
                  {LEAD_PARTNERS.map((partner) => (
                    <LeadPartnerLink key={partner.id} partner={partner} />
                  ))}
                </div>
                <div className="hidden lg:flex lg:flex-col lg:gap-y-2">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    {LEAD_PARTNERS_ROW_1.map((partner) => (
                      <LeadPartnerLink key={partner.id} partner={partner} />
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    {LEAD_PARTNERS_ROW_2.map((partner) => (
                      <LeadPartnerLink key={partner.id} partner={partner} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:items-center lg:flex-row lg:items-center gap-5 sm:gap-7 lg:gap-0">
                <div className="lg:hidden">
                  <HeroCountdown />
                </div>
                <div className="hidden sm:block lg:hidden h-12 w-px bg-border-faint" />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-row lg:flex-nowrap">
                  <a
                    href={SPONSOR_MAILTO}
                    className="btn-phosphor inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm py-2.5 px-5 no-underline"
                  >
                    {t("hero.ctaTiers")}
                  </a>
                  <a
                    href="#about"
                    className="btn-ghost inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm py-2.5 px-5 no-underline"
                  >
                    {t("hero.ctaAbout")}
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.aside
              className="lg:col-span-5 flex w-full flex-col gap-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              aria-labelledby="hero-brief-title"
            >
              <div className="hidden lg:block">
                <HeroCountdown />
              </div>
              <div className="relative border border-border bg-bg-raised/80 backdrop-blur-sm">
                <span className="pointer-events-none absolute -top-px left-6 right-6 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent" />

                <header className="flex items-center justify-between border-b border-border-faint px-6 py-4">
                  <p
                    id="hero-brief-title"
                    className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-fg-3"
                  >
                    {t("hero.brief.title")}
                  </p>
                  <span className="font-mono text-[0.6rem] tracking-[0.2em] text-accent">
                    04 · 05 · JUL 26
                  </span>
                </header>

                <dl className="divide-y divide-border-faint">
                  {BRIEF_ROWS.map(({ Icon, labelKey, valueKey, subKey }) => (
                    <div
                      key={labelKey}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4"
                    >
                      <Icon
                        className="h-4 w-4 text-accent shrink-0"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <dt className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-fg-4">
                          {t(labelKey)}
                        </dt>
                        <dd className="mt-0.5 font-display text-sm text-fg-2 leading-snug">
                          {t(subKey)}
                        </dd>
                      </div>
                      <div className="text-right font-display text-sm font-semibold text-fg tracking-[-0.01em] tabular-nums">
                        {t(valueKey)}
                      </div>
                    </div>
                  ))}
                </dl>

                <a
                  href={SPONSOR_MAILTO}
                  className="group/cta flex items-center justify-between border-t border-border-faint px-6 py-4 no-underline transition-colors duration-200 hover:bg-accent/[0.04] focus-visible:bg-accent/[0.04]"
                >
                  <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-accent whitespace-nowrap">
                    {t("hero.ctaTiers")}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-accent transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </a>
              </div>
            </motion.aside>
          </div>

          <div className="mt-12 lg:mt-14">
            <SponsorRail />
          </div>
        </div>
      </div>
    </section>
  );
}
