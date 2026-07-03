import { BuilderSectionHeader } from "./builder-section-header";
import {
  CodexLogo,
  CursorLockup,
  DatamcpLogo,
  ElevenLabsLogo,
  FirecrawlLogo,
  N8nLogo,
  ZavuLogo,
} from "../sponsor-logos";
import {
  CREDITS_TOTAL,
  OVERALL_PRIZE_DEFS,
  PARTICIPANT_PERK_DEFS,
  PRIZES_TOTAL,
  TRACK_PRIZE_DEFS,
  type PrizeLogo,
} from "../../data/prizes";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";
import {
  builderSectionSurfaceClass,
  type BuilderSectionLayout,
} from "../../lib/builder-section-layout";

const PERK_LOGO_CLASS = "h-3.5 w-auto max-w-[5.5rem] shrink-0 object-contain";

function PerkMark({ logo, sponsor }: { logo: PrizeLogo; sponsor: string }) {
  switch (logo) {
    case "cursor":
      return <CursorLockup alt={sponsor} className={PERK_LOGO_CLASS} />;
    case "codex":
      return <CodexLogo alt={sponsor} className="h-4 w-auto max-w-[6rem] shrink-0 object-contain" />;
    case "elevenlabs":
      return <ElevenLabsLogo alt={sponsor} className={PERK_LOGO_CLASS} />;
    case "n8n":
      return <N8nLogo alt={sponsor} className={PERK_LOGO_CLASS} />;
    case "zavu":
      return <ZavuLogo alt={sponsor} className={PERK_LOGO_CLASS} />;
    case "firecrawl":
      return <FirecrawlLogo alt={sponsor} className={PERK_LOGO_CLASS} />;
    case "datamcp":
      return <DatamcpLogo alt={sponsor} className={PERK_LOGO_CLASS} />;
    case null:
      return (
        <span className="font-display text-[0.875rem] font-bold uppercase leading-none tracking-tight text-fg">
          {sponsor}
        </span>
      );
    default: {
      const _exhaustive: never = logo;
      return _exhaustive;
    }
  }
}

export function BuilderPrizesSection({ layout = "page" }: { layout?: BuilderSectionLayout }) {
  const { t } = useTranslation();

  return (
    <section id="premios" className={builderSectionSurfaceClass(layout, "bg-bg-alt")}>
      <div className={layout === "page" ? "max-w-[1400px] mx-auto" : undefined}>
        <BuilderSectionHeader
          id="premios"
          tagKey="builder.premios.tag"
          title1Key="builder.premios.title1"
          title2Key="builder.premios.title2"
          asideKey="builder.premios.aside"
        />

        <div className="reveal grid grid-cols-1 overflow-hidden border border-accent bg-accent text-bg sm:grid-cols-2">
          <div className="border-b border-bg/20 px-6 py-6 sm:border-b-0 sm:border-r">
            <p className="font-display text-[2.5rem] font-bold leading-none tracking-tight">{CREDITS_TOTAL}</p>
            <p className="mt-2 max-w-[28ch] font-mono text-[0.675rem] font-bold uppercase tracking-[0.12em] text-bg/80">
              {t("builder.premios.creditsLabel")}
            </p>
          </div>
          <div className="px-6 py-6">
            <p className="font-display text-[2.5rem] font-bold leading-none tracking-tight">{PRIZES_TOTAL}</p>
            <p className="mt-2 max-w-[28ch] font-mono text-[0.675rem] font-bold uppercase tracking-[0.12em] text-bg/80">
              {t("builder.premios.prizesLabel")}
            </p>
          </div>
        </div>

        <div className="mt-14">
          <GroupHeading
            titleKey="builder.premios.allParticipantsTitle"
            hintKey="builder.premios.allParticipantsHint"
            badge={t("onePager.prizes.perBuilderBadge")}
          />
          <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
            {PARTICIPANT_PERK_DEFS.map((perk) => (
              <div
                key={perk.id}
                className="flex min-w-0 items-center justify-between gap-3 border-b border-border-faint py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <PerkMark logo={perk.logo} sponsor={perk.sponsor} />
                  <span className="min-w-0 truncate font-display text-[0.925rem] text-fg-3">
                    {t(`onePager.prizes.perk.${perk.id}` as TranslationKey)}
                  </span>
                </div>
                <span className="shrink-0 font-display text-[1.025rem] font-bold tabular-nums text-accent">
                  {perk.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <GroupHeading
            titleKey="builder.premios.sponsorTitle"
            hintKey="builder.premios.sponsorHint"
            badge={t("onePager.prizes.perMemberBadge")}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {TRACK_PRIZE_DEFS.map((track) => (
              <div key={track.id} className="reveal flex min-w-0 flex-col border border-border bg-surface p-6">
                <p className="font-display text-[1.4rem] font-bold leading-none tracking-tight text-accent">
                  {track.value}
                </p>
                <p className="mt-3 font-display text-[0.975rem] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-fg">
                  {t(`onePager.prizes.track.${track.id}.title` as TranslationKey)}
                </p>
                <p className="mt-2 font-display text-[0.9rem] leading-[1.5] text-fg-3">
                  {t(`onePager.prizes.track.${track.id}.prize` as TranslationKey)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <GroupHeading titleKey="builder.premios.overallTitle" hintKey="builder.premios.overallHint" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
            {OVERALL_PRIZE_DEFS.map((prize, i) => {
              const isFirst = i === 0;
              return (
                <div
                  key={prize.placeId}
                  className={`reveal flex min-w-0 flex-col p-6 ${
                    isFirst ? "bg-accent text-bg" : "border border-border bg-surface"
                  }`}
                  style={{ "--delay": `${i * 0.07}s` } as React.CSSProperties}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p
                      className={`font-mono text-[0.675rem] font-bold uppercase tracking-[0.14em] ${
                        isFirst ? "text-bg/75" : "text-fg-3"
                      }`}
                    >
                      {t(`onePager.prizes.place.${prize.placeId}` as TranslationKey)}
                    </p>
                    <p
                      className={`font-display text-[1.8rem] font-bold leading-none tracking-tight ${
                        isFirst ? "text-bg" : "text-accent"
                      }`}
                    >
                      {prize.cash}
                    </p>
                  </div>
                  <p
                    className={`mt-1 text-right font-mono text-[0.625rem] uppercase tracking-[0.12em] ${
                      isFirst ? "text-bg/70" : "text-fg-4"
                    }`}
                  >
                    {t("onePager.prizes.overall.cashLabel")}
                  </p>
                  <ul
                    className={`mt-5 space-y-2.5 border-t pt-4 ${
                      isFirst ? "border-bg/20" : "border-border-faint"
                    }`}
                  >
                    {prize.credits.map((credit) => (
                      <li key={credit.labelKey} className="flex items-start justify-between gap-3">
                        <span
                          className={`min-w-0 font-display text-[0.85rem] leading-[1.4] ${
                            isFirst ? "text-bg/90" : "text-fg-2"
                          }`}
                        >
                          {t(credit.labelKey)}
                        </span>
                        <span
                          className={`shrink-0 font-display text-[0.925rem] font-bold tabular-nums ${
                            isFirst ? "text-bg" : "text-accent"
                          }`}
                        >
                          {credit.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="mt-4 font-mono text-[0.675rem] leading-relaxed text-fg-4">
            {t("onePager.prizes.footerNote")}
          </p>
        </div>
      </div>
    </section>
  );
}

function GroupHeading({
  titleKey,
  hintKey,
  badge,
}: {
  titleKey: TranslationKey;
  hintKey: TranslationKey;
  badge?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="reveal mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border-faint pb-3">
      <h3 className="font-display text-[1.025rem] font-semibold uppercase tracking-[0.08em] text-fg">
        {t(titleKey)}
      </h3>
      <span className="font-mono text-[0.675rem] uppercase tracking-[0.14em] text-fg-4">{t(hintKey)}</span>
      {badge && (
        <span className="ml-auto font-mono text-[0.675rem] font-semibold uppercase tracking-[0.14em] text-accent">
          {badge}
        </span>
      )}
    </div>
  );
}
