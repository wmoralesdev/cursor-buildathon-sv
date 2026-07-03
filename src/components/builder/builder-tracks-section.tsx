import { BuilderSectionHeader } from "./builder-section-header";
import { CodexLogo, ElevenLabsLogo, N8nLogo } from "../sponsor-logos";
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
    <section id="tracks" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40 bg-bg">
      <BuilderSectionHeader
          id="tracks"
          tagKey="builder.tracks.tag"
          title1Key="builder.tracks.title1"
          title2Key="builder.tracks.title2"
          asideKey="builder.tracks.aside"
        />

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
    </section>
  );
}
