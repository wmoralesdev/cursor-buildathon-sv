import React, { useMemo } from "react";

import { SPONSOR_MAILTO } from "../../constants";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";

const benefitDefs = [
  {
    code: "B-01",
    titleKey: "sponsorBenefits.b1.title" as const,
    bodyKey: "sponsorBenefits.b1.body" as const,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9" aria-hidden>
        <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
        <circle cx="10" cy="20" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="30" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="30" cy="28" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13.2 18.5l13.6-5M13.2 21.5l13.6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    code: "B-02",
    titleKey: "sponsorBenefits.b2.title" as const,
    bodyKey: "sponsorBenefits.b2.body" as const,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9" aria-hidden>
        <rect x="6" y="8" width="28" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
        <rect x="6" y="8" width="28" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 32h12M20 28v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15 16l7 4-7 4V16z" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
  {
    code: "B-03",
    titleKey: "sponsorBenefits.b3.title" as const,
    bodyKey: "sponsorBenefits.b3.body" as const,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9" aria-hidden>
        <circle cx="20" cy="14" r="5.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 33c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        <circle cx="32" cy="14" r="3.5" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
        <path d="M36 28c0-3.866-1.79-7-4-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
] satisfies { code: string; titleKey: TranslationKey; bodyKey: TranslationKey; icon: React.ReactNode }[];

export function SponsorBenefitsSection() {
  const { t } = useTranslation();

  const benefits = useMemo(
    () =>
      benefitDefs.map((b) => ({
        ...b,
        title: t(b.titleKey),
        body: t(b.bodyKey),
      })),
    [t],
  );

  return (
    <section
      id="benefits"
      className="relative py-24 sm:py-32 section-padding bg-bg-alt"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5 reveal">
            <span className="tag mb-4 inline-block">{t("sponsorBenefits.tag")}</span>
            <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
              {t("sponsorBenefits.title1")}
              <br />
              <span className="text-accent">{t("sponsorBenefits.title2")}</span>
            </h2>
          </div>

          <div className="lg:col-span-7 reveal reveal-delay-1 flex items-center">
            <p className="font-display text-[1.05rem] text-fg-2 leading-[1.8]">{t("sponsorBenefits.intro")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {benefits.map((b, i) => (
            <div
              key={b.code}
              className="reveal group border border-border p-8 bg-surface flex flex-col gap-5 relative overflow-hidden transition-colors duration-300 hover:bg-accent/2"
              style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
            >
              <span className="absolute top-0 right-0 w-8 h-8 border-t border-r border-accent/20 transition-colors duration-300 group-hover:border-accent/50" />

              <div className="text-fg-3 transition-colors duration-300 group-hover:text-accent/60">{b.icon}</div>

              <div>
                <div className="font-mono text-[0.58rem] tracking-[0.15em] text-accent uppercase mb-2">{b.code}</div>
                <h3 className="font-display text-base font-semibold text-fg uppercase tracking-[0.03em] mb-3">
                  {b.title}
                </h3>
                <p className="font-display text-sm text-fg-3 leading-[1.75]">{b.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal border border-accent/20 bg-accent/3 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="font-mono text-[0.6rem] tracking-[0.15em] text-accent uppercase mb-2">
              {t("sponsorBenefits.ctaLabel")}
            </div>
            <p className="font-display text-[0.95rem] text-fg-2 leading-[1.7] max-w-[480px]">{t("sponsorBenefits.ctaBody")}</p>
          </div>
          <a href={SPONSOR_MAILTO} className="btn-phosphor px-7 py-3 shrink-0">
            {t("sponsorBenefits.ctaButton")}
          </a>
        </div>
      </div>
    </section>
  );
}
