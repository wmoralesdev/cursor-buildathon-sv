import {
  CodexLogo,
  CursorLockup,
  DatamcpLogo,
  ElevenLabsLogo,
  FirecrawlLogo,
  N8nLogo,
  ZavuLogo,
} from "../sponsor-logos";
import { CREDIT_REDEMPTION_GUIDES } from "../../data/credit-redemption";
import { PARTICIPANT_PERK_DEFS, type PrizeLogo } from "../../data/prizes";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";
import { BuilderSectionHeader } from "./builder-section-header";

const PERK_LOGO_CLASS = "h-4 w-auto max-w-[6rem] shrink-0 object-contain";

function PerkMark({ logo, sponsor }: { logo: PrizeLogo; sponsor: string }) {
  switch (logo) {
    case "cursor":
      return <CursorLockup alt={sponsor} className={PERK_LOGO_CLASS} />;
    case "codex":
      return <CodexLogo alt={sponsor} className="h-4.5 w-auto max-w-[6.5rem] shrink-0 object-contain" />;
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
        <span className="font-display text-[0.925rem] font-bold uppercase leading-none tracking-tight text-fg">
          {sponsor}
        </span>
      );
    default: {
      const _exhaustive: never = logo;
      return _exhaustive;
    }
  }
}

export function BuilderCreditsHelpSection() {
  const { t } = useTranslation();

  return (
    <section id="credits" className="relative scroll-mt-20 py-24 sm:py-32 lg:py-40 section-padding bg-bg">
      <div className="mx-auto max-w-[1400px]">
        <BuilderSectionHeader
          id="credits"
          tagKey="builder.credits.tag"
          title1Key="builder.credits.title1"
          title2Key="builder.credits.title2"
          asideKey="builder.credits.aside"
        />

        <div className="reveal mb-10 border border-accent/30 bg-accent/[0.04] px-5 py-4 sm:px-6">
          <p className="font-display text-[1rem] leading-[1.65] text-fg-2">
            {t("builder.credits.intro")}
          </p>
        </div>

        <ol className="reveal mb-12 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <li key={i} className="border border-border bg-surface p-5">
              <span className="font-mono text-[0.675rem] font-bold uppercase tracking-[0.14em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-display text-[0.95rem] font-semibold leading-[1.35] text-fg">
                {t(`builder.credits.general.i${i}.title` as TranslationKey)}
              </p>
              <p className="mt-1.5 font-display text-[0.9rem] leading-[1.55] text-fg-3">
                {t(`builder.credits.general.i${i}.body` as TranslationKey)}
              </p>
            </li>
          ))}
        </ol>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {CREDIT_REDEMPTION_GUIDES.map((guide, i) => {
            const perk = PARTICIPANT_PERK_DEFS.find((p) => p.id === guide.perkId);
            if (!perk) return null;

            return (
              <article
                key={guide.perkId}
                className="reveal flex min-w-0 flex-col border border-border bg-surface p-5 sm:p-6"
                style={{ "--delay": `${i * 0.04}s` } as React.CSSProperties}
              >
                <div className="flex items-start justify-between gap-3 border-b border-border-faint pb-4">
                  <div className="min-w-0">
                    <PerkMark logo={perk.logo} sponsor={perk.sponsor} />
                    <p className="mt-2 font-display text-[0.925rem] leading-[1.45] text-fg-3">
                      {t(`onePager.prizes.perk.${perk.id}` as TranslationKey)}
                    </p>
                  </div>
                  <span className="shrink-0 font-display text-[1.025rem] font-bold tabular-nums text-accent">
                    {perk.value}
                  </span>
                </div>
                <ol className="mt-4 space-y-2.5">
                  {Array.from({ length: guide.stepCount }, (_, stepIdx) => (
                    <li key={stepIdx} className="flex gap-3">
                      <span className="mt-0.5 shrink-0 font-mono text-[0.675rem] font-bold uppercase tracking-[0.1em] text-fg-4">
                        {stepIdx + 1}.
                      </span>
                      <span className="font-display text-[0.9rem] leading-[1.5] text-fg-2">
                        {t(
                          `builder.credits.redeem.${guide.perkId}.s${stepIdx}` as TranslationKey,
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </article>
            );
          })}
        </div>

        <p className="reveal mt-6 font-mono text-[0.675rem] leading-relaxed text-fg-4">
          {t("builder.credits.footer")}
        </p>
      </div>
    </section>
  );
}
