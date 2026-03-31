import React from "react";

import type { SponsorTierId } from "../../data/sponsor-tiers";
import { sponsorFinancialTierOrder } from "../../data/sponsor-tiers";
import { SPONSOR_MAILTO } from "../../constants";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";

const tierVisual: Record<
  SponsorTierId,
  {
    index: string;
    borderClass: string;
    glowClass: string;
    barClass: string;
    cornerClass: string;
  }
> = {
  bronze: {
    index: "01",
    borderClass: "border-[#6b4423]/40 hover:border-[#8b5a2b]/70",
    glowClass:
      "shadow-[0_0_0_1px_rgba(139,90,43,0.12),inset_0_1px_0_rgba(255,255,255,0.04)] hover:shadow-[0_0_40px_-12px_rgba(139,90,43,0.35)]",
    barClass: "from-[#8b5a2b] to-[#5c3d1e]",
    cornerClass: "border-[#8b5a2b]/35 group-hover:border-[#8b5a2b]/60",
  },
  silver: {
    index: "02",
    borderClass: "border-[#6b7280]/35 hover:border-[#9ca3af]/65",
    glowClass:
      "shadow-[0_0_0_1px_rgba(156,163,175,0.08),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_0_36px_-10px_rgba(156,163,175,0.28)]",
    barClass: "from-[#9ca3af] to-[#6b7280]",
    cornerClass: "border-[#9ca3af]/30 group-hover:border-[#9ca3af]/55",
  },
  gold: {
    index: "03",
    borderClass: "border-accent/45 hover:border-accent/80",
    glowClass:
      "shadow-[0_0_0_1px_rgba(255,75,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_0_48px_-8px_rgba(255,75,0,0.45)]",
    barClass: "from-accent to-accent-dim",
    cornerClass: "border-accent/40 group-hover:border-accent/70",
  },
};

function tierBenefitKeys(tier: SponsorTierId): readonly TranslationKey[] {
  switch (tier) {
    case "bronze":
      return ["sponsorTiers.bronze.b1", "sponsorTiers.bronze.b2", "sponsorTiers.bronze.b3"];
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

const productBulletKeys = [
  "sponsorTiers.product.p1",
  "sponsorTiers.product.p2",
  "sponsorTiers.product.p3",
  "sponsorTiers.product.p4",
] as const;

const packageLaneKeys = [
  { title: "sponsorTiers.lane1.title", body: "sponsorTiers.lane1.body" },
  { title: "sponsorTiers.lane2.title", body: "sponsorTiers.lane2.body" },
  { title: "sponsorTiers.lane3.title", body: "sponsorTiers.lane3.body" },
] as const;

const metalSubKey: Record<SponsorTierId, TranslationKey> = {
  bronze: "sponsorTiers.metalSub.bronze",
  silver: "sponsorTiers.metalSub.silver",
  gold: "sponsorTiers.metalSub.gold",
};

export function SponsorTiersSection() {
  const { t } = useTranslation();

  return (
    <section id="tiers" className="relative py-24 sm:py-32 section-padding bg-bg overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45] dark:opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255, 75, 0, 0.12), transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 50%, rgba(139, 90, 43, 0.06), transparent 50%),
            radial-gradient(ellipse 50% 35% at 0% 80%, rgba(156, 163, 175, 0.05), transparent 45%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] mask-[linear-gradient(to_bottom,black,transparent_85%)]"
        aria-hidden
        style={{
          backgroundImage: `linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="h-rule mb-16" />

        <header className="reveal mb-14 md:mb-20 grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <span className="tag mb-4 inline-block">{t("sponsorTiers.tag")}</span>
            <h2 className="font-bold uppercase font-display text-[clamp(1.75rem,4vw,2.75rem)] text-fg tracking-[-0.02em] leading-[1.05] mb-4">
              {t("sponsorTiers.heading")}
            </h2>
          </div>
          <p className="md:col-span-6 font-display text-[1.05rem] text-fg-2 leading-[1.8]">{t("sponsorTiers.intro")}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {packageLaneKeys.map((lane, i) => (
            <div
              key={lane.title}
              className="reveal border border-border bg-bg-raised/70 px-6 py-7"
              style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
            >
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-accent mb-3">{t(lane.title)}</p>
              <p className="font-display text-sm text-fg-3 leading-[1.75]">{t(lane.body)}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-4 xl:gap-6 mb-12">
          {sponsorFinancialTierOrder.map((tierId, i) => {
            const v = tierVisual[tierId];
            const isGold = tierId === "gold";
            const benefits = tierBenefitKeys(tierId).map((key) => t(key));
            const metal = t(metalSubKey[tierId]);
            return (
              <article
                key={tierId}
                className={`reveal group relative flex flex-col border bg-bg-raised/80 backdrop-blur-sm p-7 sm:p-8 transition-all duration-500 ease-out hover:-translate-y-1 ${v.borderClass} ${v.glowClass} ${
                  isGold ? "lg:z-1 lg:ring-1 lg:ring-accent/25 lg:-my-1 lg:py-9" : ""
                }`}
                style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}
              >
                <span
                  className={`absolute top-0 right-0 h-10 w-10 border-t border-r transition-colors duration-300 ${v.cornerClass}`}
                  aria-hidden
                />
                <span
                  className={`absolute bottom-0 left-0 h-10 w-10 border-b border-l border-border/60 transition-colors duration-300 group-hover:border-fg-6/40`}
                  aria-hidden
                />

                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className={`h-1 w-12 shrink-0 rounded-full bg-linear-to-r ${v.barClass}`} aria-hidden />
                  <span className="font-mono text-[0.65rem] tracking-[0.2em] text-fg-5 tabular-nums">{v.index}</span>
                </div>

                <div className="mb-6">
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-fg-4 mb-1">{metal}</p>
                  <h3 className="font-bold uppercase font-display text-2xl sm:text-[1.65rem] text-fg tracking-[0.06em]">
                    {metal}
                  </h3>
                </div>

                <ul className="flex flex-1 flex-col gap-3.5">
                  {benefits.map((b) => (
                    <li key={b} className="flex gap-3 text-left">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-accent/80 shadow-[0_0_8px_rgba(255,75,0,0.45)]"
                        aria-hidden
                      />
                      <span className="font-display text-sm text-fg-3 leading-[1.7]">{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="reveal mb-12 border border-border bg-bg-raised/60 px-6 py-8 sm:px-8 sm:py-9">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-accent mb-3">
            {t("sponsorTiers.programAddons.title")}
          </p>
          <p className="font-display text-sm text-fg-2 leading-[1.75] mb-5 max-w-3xl">{t("sponsorTiers.programAddons.intro")}</p>
          <ul className="grid gap-3 sm:grid-cols-1 md:grid-cols-3">
            {(
              [
                "sponsorTiers.programAddons.judges",
                "sponsorTiers.programAddons.mentors",
                "sponsorTiers.programAddons.training",
              ] as const
            ).map((key) => (
              <li key={key} className="flex gap-3 text-left">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-accent/80 shadow-[0_0_8px_rgba(255,75,0,0.45)]"
                  aria-hidden
                />
                <span className="font-display text-sm text-fg-3 leading-[1.7]">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="reveal mb-16 font-mono text-[0.65rem] text-fg-4 tracking-[0.06em] leading-[1.7] max-w-2xl border-l-2 border-accent/30 pl-4">
          {t("sponsorTiers.financialNote")}
        </p>

        <div className="reveal relative border border-border bg-linear-to-br from-bg-raised/90 to-bg-deep/80 overflow-hidden">
          <div
            className="pointer-events-none absolute -right-24 top-1/2 h-[140%] w-48 -translate-y-1/2 rotate-12 bg-linear-to-b from-accent/8 via-transparent to-accent/5"
            aria-hidden
          />
          <div className="relative grid gap-10 p-8 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
            <div className="lg:col-span-5">
              <span className="tag mb-4 inline-block">{t("sponsorTiers.productTag")}</span>
              <h3 className="font-bold uppercase font-display text-xl sm:text-2xl text-fg tracking-[0.02em] leading-tight mb-4">
                {t("sponsorTiers.productTitle")}
              </h3>
              <p className="font-display text-[0.95rem] text-fg-2 leading-[1.75]">{t("sponsorTiers.productIntro")}</p>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-6">
              <ul className="space-y-4">
                {productBulletKeys.map((key, idx) => (
                  <li
                    key={key}
                    className="flex gap-4 border-b border-border-faint pb-4 last:border-0 last:pb-0"
                  >
                    <span className="font-mono text-[0.6rem] text-accent tabular-nums pt-0.5">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="font-display text-sm text-fg-3 leading-[1.75]">{t(key)}</span>
                  </li>
                ))}
              </ul>
              <p className="font-mono text-[0.65rem] text-fg-4 tracking-[0.06em]">{t("sponsorTiers.productFootnote")}</p>
              <a
                href={SPONSOR_MAILTO}
                className="btn-phosphor group inline-flex w-fit items-center gap-2 px-7 py-3 no-underline"
              >
                {t("sponsorTiers.emailCta")}
                <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
