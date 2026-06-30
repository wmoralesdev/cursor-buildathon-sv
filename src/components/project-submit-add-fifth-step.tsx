import { UserPlus, UserRound } from "lucide-react";

import { useTranslation } from "../context/language-context";
import { projectSubmitHintClass } from "./project-submit-form-fields";

type ProjectSubmitAddFifthStepProps = {
  stepNumber: number;
  onAddFifth: () => void;
  onSkip: () => void;
};

export function ProjectSubmitAddFifthStep({
  stepNumber,
  onAddFifth,
  onSkip,
}: ProjectSubmitAddFifthStepProps) {
  const { t } = useTranslation();

  return (
    <div className="submit-flow-step space-y-8">
      <div className="space-y-3">
        <p className="font-mono text-[0.65rem] tabular-nums uppercase tracking-[0.18em] text-accent">
          {String(stepNumber).padStart(2, "0")}
        </p>
        <h2 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-semibold leading-tight tracking-tight text-fg">
          {t("submit.members.addFifthQuestion")}
        </h2>
        <p className={`max-w-prose text-sm leading-relaxed sm:text-base ${projectSubmitHintClass}`}>
          {t("submit.members.addFifthHint")}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <button
          type="button"
          onClick={onAddFifth}
          className="submit-add-fifth-choice group flex flex-1 items-center gap-4 border border-accent/35 bg-accent/[0.06] px-4 py-4 text-left transition-colors hover:border-accent/55 hover:bg-accent/[0.1]"
        >
          <span className="inline-flex size-10 shrink-0 items-center justify-center border border-accent/30 bg-accent/10 text-accent">
            <UserPlus className="size-4" strokeWidth={1.75} aria-hidden />
          </span>
          <span>
            <span className="block font-display text-base font-semibold text-fg">
              {t("submit.members.addFifthYes")}
            </span>
            <span className={`mt-1 block text-xs ${projectSubmitHintClass}`}>
              {t("submit.members.addFifthYesHint")}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="submit-add-fifth-choice group flex flex-1 items-center gap-4 border border-border-faint bg-bg-raised/40 px-4 py-4 text-left transition-colors hover:border-border hover:bg-bg-raised/70"
        >
          <span className="inline-flex size-10 shrink-0 items-center justify-center border border-border-faint bg-bg-deep text-fg-3">
            <UserRound className="size-4" strokeWidth={1.75} aria-hidden />
          </span>
          <span>
            <span className="block font-display text-base font-semibold text-fg">
              {t("submit.members.addFifthNo")}
            </span>
            <span className={`mt-1 block text-xs ${projectSubmitHintClass}`}>
              {t("submit.members.addFifthNoHint")}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
