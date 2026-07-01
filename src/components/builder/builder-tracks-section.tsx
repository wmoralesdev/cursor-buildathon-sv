import { BuilderSectionHeader } from "./builder-section-header";
import { CodexLogo, ElevenLabsLogo, N8nLogo } from "../sponsor-logos";
import { COMPETITION_TRACK_DEFS } from "../../data/competition-tracks";
import { TRACK_PRIZE_DEFS, type TrackPrizeId } from "../../data/prizes";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";

const TRACK_LOGO_CLASS = "h-5 w-auto max-w-[7rem] shrink-0 object-contain";

function TrackSponsorMark({ id, sponsor }: { id: TrackPrizeId; sponsor: string }) {
  switch (id) {
    case "codex":
      return <CodexLogo alt={sponsor} className={TRACK_LOGO_CLASS} />;
    case "elevenlabs":
      return <ElevenLabsLogo alt={sponsor} className={TRACK_LOGO_CLASS} />;
    case "n8n":
      return <N8nLogo alt={sponsor} className={TRACK_LOGO_CLASS} />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export function BuilderTracksSection() {
  const { t } = useTranslation();

  return (
    <section id="tracks" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40 section-padding bg-bg">
      <div className="max-w-[1400px] mx-auto">
        <BuilderSectionHeader
          id="tracks"
          tagKey="builder.tracks.tag"
          title1Key="builder.tracks.title1"
          title2Key="builder.tracks.title2"
          asideKey="builder.tracks.aside"
        />

        <GroupHeading
          titleKey="builder.tracks.competitionTitle"
          hintKey="builder.tracks.competitionHint"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
          {COMPETITION_TRACK_DEFS.map((track, i) => (
            <article
              key={track.id}
              className="reveal group flex min-w-0 flex-col border border-border bg-surface p-6 transition-colors hover:border-accent/40 sm:p-7"
              style={{ "--delay": `${i * 0.07}s` } as React.CSSProperties}
            >
              <span className="font-mono text-[0.675rem] uppercase tracking-[0.16em] text-accent">
                {track.code}
              </span>
              <h4 className="mt-3 font-display text-[1.2rem] font-bold uppercase leading-[1.1] tracking-[-0.01em] text-fg">
                {t(track.titleKey)}
              </h4>
              <p className="mt-3 font-display text-[0.975rem] leading-[1.6] text-fg-3">
                {t(track.descriptionKey)}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-14">
          <GroupHeading titleKey="builder.tracks.sponsorTitle" hintKey="builder.tracks.sponsorHint" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {TRACK_PRIZE_DEFS.map((track, i) => (
              <article
                key={track.id}
                className="reveal group flex min-w-0 flex-col border border-border bg-surface p-6 transition-colors hover:border-accent/40"
                style={{ "--delay": `${i * 0.07}s` } as React.CSSProperties}
              >
                <div className="flex items-center justify-between gap-3 border-b border-border-faint pb-4">
                  <TrackSponsorMark id={track.id} sponsor={track.sponsor} />
                  <span className="shrink-0 font-display text-[1.025rem] font-bold tracking-tight text-accent">
                    {track.value}
                  </span>
                </div>
                <h4 className="mt-4 font-display text-[1rem] font-bold uppercase leading-[1.15] tracking-[-0.01em] text-fg">
                  {t(`onePager.prizes.track.${track.id}.title` as TranslationKey)}
                </h4>
                <p className="mt-2 font-display text-[0.925rem] leading-[1.55] text-fg-3">
                  {t(`onePager.prizes.track.${track.id}.prize` as TranslationKey)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GroupHeading({
  titleKey,
  hintKey,
}: {
  titleKey: TranslationKey;
  hintKey: TranslationKey;
}) {
  const { t } = useTranslation();

  return (
    <div className="reveal mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border-faint pb-3">
      <h3 className="font-display text-[1.025rem] font-semibold uppercase tracking-[0.08em] text-fg">
        {t(titleKey)}
      </h3>
      <span className="font-mono text-[0.675rem] uppercase tracking-[0.14em] text-fg-4">{t(hintKey)}</span>
    </div>
  );
}
