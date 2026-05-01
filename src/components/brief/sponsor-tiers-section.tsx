import React from "react";
import { ArrowUpRight, Check } from "lucide-react";

import type { SponsorTierId } from "../../data/sponsor-tiers";
import { sponsorFinancialTierOrder } from "../../data/sponsor-tiers";
import { SPONSOR_MAILTO } from "../../constants";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";

interface TierVisual {
  index: string;
  rim: string;
  bar: string;
  text: string;
  emphasis?: string;
}

const TIER_VISUAL: Record<SponsorTierId, TierVisual> = {
  bronze: {
    index: "01",
    rim: "border-[#cd7f32]/35 hover:border-[#cd7f32]/65",
    bar: "from-[#cd7f32] to-[#8a4f20]",
    text: "text-[#cd7f32]",
  },
  silver: {
    index: "02",
    rim: "border-[#a7adb3]/35 hover:border-[#a7adb3]/65",
    bar: "from-[#d7dbdf] to-[#8f969e]",
    text: "text-[#a7adb3]",
  },
  gold: {
    index: "03",
    rim: "border-[#d4af37]/45 hover:border-[#d4af37]/75",
    bar: "from-[#d4af37] to-[#b8860b]",
    text: "text-[#d4af37]",
    emphasis: "lg:-my-2 lg:py-10 lg:bg-[#d4af37]/[0.04]",
  },
};

function tierBenefitKeys(tier: SponsorTierId): readonly TranslationKey[] {
  switch (tier) {
    case "bronze":
      return [
        "sponsorTiers.bronze.b1",
        "sponsorTiers.bronze.b2",
        "sponsorTiers.bronze.b3",
      ];
    case "silver":
      return [
        "sponsorTiers.silver.b1",
        "sponsorTiers.silver.b2",
        "sponsorTiers.silver.b3",
        "sponsorTiers.silver.b4",
      ];
    case "gold":
      return [
        "sponsorTiers.gold.b1",
        "sponsorTiers.gold.b2",
        "sponsorTiers.gold.b3",
        "sponsorTiers.gold.b4",
      ];
  }
}

const PRODUCT_BULLETS = [
  "sponsorTiers.product.p1",
  "sponsorTiers.product.p2",
  "sponsorTiers.product.p3",
  "sponsorTiers.product.p4",
] as const;

const PACKAGE_LANES = [
  { title: "sponsorTiers.lane1.title", body: "sponsorTiers.lane1.body" },
  { title: "sponsorTiers.lane2.title", body: "sponsorTiers.lane2.body" },
  { title: "sponsorTiers.lane3.title", body: "sponsorTiers.lane3.body" },
] as const;

const METAL_KEY: Record<SponsorTierId, TranslationKey> = {
  bronze: "sponsorTiers.metalSub.bronze",
  silver: "sponsorTiers.metalSub.silver",
  gold:   "sponsorTiers.metalSub.gold",
};

export function SponsorTiersSection() {
  const { t } = useTranslation();

  return (
    <section
      id="tiers"
      className="relative py-24 sm:py-32 lg:py-40 section-padding bg-bg overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 45% at 50% -10%, rgba(255,75,0,0.08), transparent 60%)",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto">
        <header className="reveal mb-14 lg:mb-20 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <span className="tag mb-4 inline-block">{t("sponsorTiers.tag")}</span>
            <h2 className="font-display font-semibold tracking-[-0.02em] leading-[1] text-[clamp(2rem,4.4vw,3.4rem)]">
              <span className={TIER_VISUAL.bronze.text}>{t("sponsorTiers.metalSub.bronze")}</span>
              <span className="text-fg-5 mx-3" aria-hidden>·</span>
              <span className={TIER_VISUAL.silver.text}>{t("sponsorTiers.metalSub.silver")}</span>
              <span className="text-fg-5 mx-3" aria-hidden>·</span>
              <span className={TIER_VISUAL.gold.text}>{t("sponsorTiers.metalSub.gold")}</span>
            </h2>
          </div>
          <p className="lg:col-span-6 font-display text-base text-fg-2 leading-[1.75] max-w-[60ch]">
            {t("sponsorTiers.intro")}
          </p>
        </header>

        {/* Three lanes — financial / product / hybrid */}
        <ul className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-faint border-y border-border-faint mb-16">
          {PACKAGE_LANES.map((lane, i) => (
            <li
              key={lane.title}
              className="reveal px-6 py-7 sm:px-8"
              style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
            >
              <p className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-accent mb-3">
                {t(lane.title)}
              </p>
              <p className="font-display text-sm text-fg-3 leading-[1.75] max-w-[34ch]">
                {t(lane.body)}
              </p>
            </li>
          ))}
        </ul>

        {/* Financial tier cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 mb-12">
          {sponsorFinancialTierOrder.map((tierId, i) => {
            const v = TIER_VISUAL[tierId];
            const benefits = tierBenefitKeys(tierId).map((key) => t(key));
            const metal = t(METAL_KEY[tierId]);
            return (
              <article
                key={tierId}
                className={`reveal group relative flex flex-col border bg-bg-raised/80 backdrop-blur-sm p-7 sm:p-8 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-px ${v.rim} ${v.emphasis ?? ""}`}
                style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
              >
                <header className="mb-7 flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <span className={`h-0.5 w-12 bg-linear-to-r ${v.bar}`} aria-hidden />
                    <h3 className={`font-display text-2xl sm:text-[1.75rem] font-semibold tracking-[-0.01em] ${v.text}`}>
                      {metal}
                    </h3>
                  </div>
                  <span className="font-mono text-[0.65rem] tracking-[0.2em] text-fg-5 tabular-nums">
                    {v.index}
                  </span>
                </header>

                <ul className="flex flex-1 flex-col gap-3.5">
                  {benefits.map((b) => (
                    <li key={b} className="flex gap-3 text-left">
                      <Check
                        className="mt-[3px] h-3.5 w-3.5 shrink-0 text-accent"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span className="font-display text-sm text-fg-3 leading-[1.7]">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>

                {tierId === "gold" && (
                  <p className="mt-6 pt-5 border-t border-border-faint font-mono text-[0.6rem] tracking-[0.16em] uppercase text-accent">
                    Premium · combinable
                  </p>
                )}
              </article>
            );
          })}
        </div>

        {/* Add-ons */}
        <div className="reveal mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 border-t border-border-faint pt-10">
          <div className="lg:col-span-4">
            <p className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-accent mb-3">
              {t("sponsorTiers.programAddons.title")}
            </p>
            <p className="font-display text-sm text-fg-2 leading-[1.75] max-w-[36ch]">
              {t("sponsorTiers.programAddons.intro")}
            </p>
          </div>
          <ul className="lg:col-span-8 grid gap-2 sm:grid-cols-3">
            {(
              [
                "sponsorTiers.programAddons.judges",
                "sponsorTiers.programAddons.mentors",
                "sponsorTiers.programAddons.training",
              ] as const
            ).map((key) => (
              <li
                key={key}
                className="border border-border-faint bg-surface px-5 py-4 font-display text-sm text-fg-3 leading-[1.7]"
              >
                {t(key)}
              </li>
            ))}
          </ul>
        </div>

        <p className="reveal mb-12 font-mono text-[0.65rem] text-fg-4 tracking-[0.06em] leading-[1.7] max-w-[60ch] border-l-2 border-accent/30 pl-4">
          {t("sponsorTiers.financialNote")}
        </p>

        {/* Product partner / hybrid panel */}
        <div className="reveal relative border border-border bg-bg-raised/80">
          <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-12 lg:gap-14 lg:items-start">
            <div className="lg:col-span-5">
              <span className="tag mb-4 inline-block">{t("sponsorTiers.productTag")}</span>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-fg tracking-[-0.01em] leading-[1.15]">
                {t("sponsorTiers.productTitle")}
              </h3>
              <p className="mt-4 font-display text-base text-fg-2 leading-[1.75] max-w-[44ch]">
                {t("sponsorTiers.productIntro")}
              </p>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-6">
              <ul className="divide-y divide-border-faint border-y border-border-faint">
                {PRODUCT_BULLETS.map((key, idx) => (
                  <li key={key} className="flex gap-5 py-4">
                    <span className="font-mono text-[0.65rem] text-accent tabular-nums pt-0.5 tracking-[0.18em]">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="font-display text-sm text-fg-3 leading-[1.75]">
                      {t(key)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="font-mono text-[0.65rem] text-fg-4 tracking-[0.06em] leading-[1.7]">
                {t("sponsorTiers.productFootnote")}
              </p>
              <a
                href={SPONSOR_MAILTO}
                className="btn-phosphor group inline-flex w-fit items-center gap-2 px-6 py-3 no-underline"
              >
                {t("sponsorTiers.emailCta")}
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
