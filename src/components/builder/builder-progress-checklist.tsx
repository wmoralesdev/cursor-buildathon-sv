import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

import type { BuilderTeam } from "../../hooks/use-builder-team";
import { COMPETITION_TRACK_DEFS } from "../../data/competition-tracks";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";

const CREDITS_REDEEMED_KEY = "builder_credits_redeemed_v1";

function readCreditsRedeemed(): boolean {
  try {
    return localStorage.getItem(CREDITS_REDEEMED_KEY) === "true";
  } catch {
    return false;
  }
}

type Props = {
  team: BuilderTeam;
  canSubmit: boolean;
  minSubmitMembers: number;
};

export function BuilderProgressChecklist({ team, canSubmit, minSubmitMembers }: Props) {
  const { t } = useTranslation();
  const [creditsRedeemed, setCreditsRedeemed] = useState(readCreditsRedeemed);

  function toggleCredits() {
    setCreditsRedeemed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(CREDITS_REDEEMED_KEY, String(next));
      } catch {
        /* localStorage unavailable */
      }
      return next;
    });
  }

  const rosterReady = team.memberCount >= minSubmitMembers;
  const needCount = Math.max(minSubmitMembers - team.memberCount, 0);

  const competitionTrackDef = team.competitionTrack
    ? COMPETITION_TRACK_DEFS.find((def) => def.id === team.competitionTrack)
    : undefined;

  const steps: StepProps[] = [
    {
      id: "team",
      done: true,
      titleKey: "builder.progress.team.title",
      detail: t("builder.progress.team.done"),
    },
    {
      id: "roster",
      done: rosterReady,
      titleKey: "builder.progress.roster.title",
      detail: rosterReady
        ? t("builder.progress.roster.done")
            .replace("{count}", String(team.memberCount))
            .replace("{max}", String(team.maxMembers))
        : t("builder.progress.roster.todo").replace("{count}", String(needCount)),
    },
    {
      id: "competition",
      done: Boolean(team.competitionTrack),
      titleKey: "builder.progress.competition.title",
      detail: competitionTrackDef
        ? t(competitionTrackDef.titleKey)
        : team.isLeader
          ? t("builder.progress.competition.todoLeader")
          : t("builder.progress.competition.todoMember"),
    },
    {
      id: "sponsor",
      done: Boolean(team.sponsorTrack),
      titleKey: "builder.progress.sponsor.title",
      detail: team.sponsorTrack
        ? t(`onePager.prizes.track.${team.sponsorTrack}.title` as TranslationKey)
        : t("builder.progress.sponsor.todo"),
    },
    {
      id: "credits",
      done: creditsRedeemed,
      titleKey: "builder.progress.credits.title",
      detail: creditsRedeemed
        ? t("builder.progress.credits.done")
        : t("builder.progress.credits.todo"),
      action: (
        <div className="flex shrink-0 items-center gap-3">
          <a
            href="#credits"
            className="font-mono text-[0.675rem] uppercase tracking-[0.12em] text-accent no-underline hover:underline"
          >
            {t("builder.progress.credits.howTo")}
          </a>
          <button
            type="button"
            onClick={toggleCredits}
            className="border border-border-faint px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-3 transition-colors hover:border-accent/50 hover:text-accent"
          >
            {creditsRedeemed
              ? t("builder.progress.credits.undo")
              : t("builder.progress.credits.markDone")}
          </button>
        </div>
      ),
    },
    {
      id: "submit",
      done: team.submitted,
      titleKey: "builder.progress.submit.title",
      detail: team.submitted
        ? t("builder.progress.submit.done")
        : canSubmit
          ? t("builder.progress.submit.ready")
          : t("builder.progress.submit.todo"),
      action:
        !team.submitted && canSubmit ? (
          <Link
            to="/submit"
            className="shrink-0 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-accent no-underline hover:underline"
          >
            {t("builder.team.panel.submitCta")}
          </Link>
        ) : undefined,
    },
  ];

  const doneCount = steps.filter((step) => step.done).length;

  return (
    <div className="mb-4 border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-faint pb-4">
        <div>
          <p className="font-mono text-[0.675rem] uppercase tracking-[0.14em] text-accent">
            {t("builder.progress.title")}
          </p>
          <p className="mt-1.5 font-display text-[0.925rem] leading-[1.5] text-fg-3">
            {t("builder.progress.subtitle")}
          </p>
        </div>
        <span className="font-mono text-[0.725rem] uppercase tracking-[0.12em] text-fg-3">
          {t("builder.progress.count")
            .replace("{done}", String(doneCount))
            .replace("{total}", String(steps.length))}
        </span>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {steps.map((step) => (
          <ChecklistRow key={step.id} {...step} />
        ))}
      </ul>
    </div>
  );
}

type StepProps = {
  id: string;
  done: boolean;
  titleKey: TranslationKey;
  detail: string;
  action?: React.ReactNode;
};

function ChecklistRow({ done, titleKey, detail, action }: StepProps) {
  const { t } = useTranslation();

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border border-border-faint bg-bg-raised/40 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex size-5 shrink-0 items-center justify-center border ${
            done ? "border-accent bg-accent/15 text-accent" : "border-border text-transparent"
          }`}
          aria-hidden
        >
          {done ? <Check className="size-3" strokeWidth={2.5} /> : null}
        </span>
        <div className="min-w-0">
          <p
            className={`font-display text-[0.975rem] leading-tight ${
              done ? "text-fg" : "text-fg-2"
            }`}
          >
            {t(titleKey)}
          </p>
          <p className="mt-0.5 font-display text-[0.85rem] leading-[1.4] text-fg-4">{detail}</p>
        </div>
      </div>
      {action}
    </li>
  );
}
