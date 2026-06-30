import { CodexLogo, ElevenLabsLogo, N8nLogo } from "../sponsor-logos";
import { TRACK_PRIZE_DEFS, type TrackPrizeId } from "../../data/prizes";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";

const TRACK_LOGO_CLASS = "h-4 w-auto max-w-[5.5rem] shrink-0 object-contain";

type Props = {
  value: TrackPrizeId | null;
  onChange: (next: TrackPrizeId | null) => void;
  idPrefix: string;
};

function TrackLogo({ id, sponsor }: { id: TrackPrizeId; sponsor: string }) {
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

export function BuilderSponsorTrackField({ value, onChange, idPrefix }: Props) {
  const { t } = useTranslation();
  const groupName = `${idPrefix}-sponsor-track`;

  return (
    <fieldset className="space-y-3">
      <legend className="font-mono text-[0.725rem] uppercase tracking-[0.12em] text-fg-4 sm:text-sm sm:tracking-[0.14em]">
        {t("builder.team.field.sponsorTrackLegend")}
      </legend>
      <p className="font-display text-[0.925rem] leading-[1.55] text-fg-3">
        {t("builder.team.field.sponsorTrackHint")}
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {TRACK_PRIZE_DEFS.map((track) => {
          const inputId = `${groupName}-${track.id}`;
          const titleKey = `onePager.prizes.track.${track.id}.title` as TranslationKey;
          const checked = value === track.id;

          return (
            <label
              key={track.id}
              htmlFor={inputId}
              className={`flex cursor-pointer flex-col gap-3 border p-4 transition-colors ${
                checked
                  ? "border-accent/60 bg-accent/10"
                  : "border-border bg-bg-raised/40 hover:border-accent/30"
              }`}
            >
              <input
                id={inputId}
                type="radio"
                name={groupName}
                className="sr-only"
                checked={checked}
                onChange={() => onChange(track.id)}
              />
              <div className="flex items-center justify-between gap-3">
                <TrackLogo id={track.id} sponsor={track.sponsor} />
                <span className="shrink-0 font-display text-[0.925rem] font-bold tracking-tight text-accent">
                  {track.value}
                </span>
              </div>
              <span className="font-display text-[0.9rem] font-bold uppercase leading-[1.15] tracking-[-0.01em] text-fg">
                {t(titleKey)}
              </span>
            </label>
          );
        })}

        <label
          htmlFor={`${groupName}-none`}
          className={`flex cursor-pointer items-center border px-4 py-4 transition-colors sm:col-span-2 ${
            value === null
              ? "border-accent/60 bg-accent/10"
              : "border-border bg-bg-raised/40 hover:border-accent/30"
          }`}
        >
          <input
            id={`${groupName}-none`}
            type="radio"
            name={groupName}
            className="sr-only"
            checked={value === null}
            onChange={() => onChange(null)}
          />
          <span className="font-display text-[0.925rem] text-fg-2">
            {t("builder.team.field.sponsorTrackNone")}
          </span>
        </label>
      </div>
    </fieldset>
  );
}
