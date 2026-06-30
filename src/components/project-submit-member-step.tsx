import { useFormContext } from "react-hook-form";

import type { ProjectSubmitFormValues } from "../pages/project-submit-types";
import { useTranslation } from "../context/language-context";
import {
  projectSubmitHintClass,
  projectSubmitInputClass,
  projectSubmitLabelClass,
  projectSubmitSecondaryButtonClass,
} from "./project-submit-form-fields";

type ProjectSubmitMemberStepProps = {
  memberIndex: number;
  stepNumber: number;
  onRemoveFifth: () => void;
};

export function ProjectSubmitMemberStep({
  memberIndex,
  stepNumber,
  onRemoveFifth,
}: ProjectSubmitMemberStepProps) {
  const { t } = useTranslation();
  const { register, watch } = useFormContext<ProjectSubmitFormValues>();
  const members = watch("members");
  const isFifthMember = memberIndex === 4 && members.length === 5;

  return (
    <div className="submit-flow-step space-y-6">
      <div className="space-y-3">
        <p className="font-mono text-[0.65rem] tabular-nums uppercase tracking-[0.18em] text-accent">
          {String(stepNumber).padStart(2, "0")}
        </p>
        <h2 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-semibold leading-tight tracking-tight text-fg">
          {t("submit.members.memberLabel")} {memberIndex + 1}
        </h2>
        <p className={`font-mono text-[0.65rem] uppercase tracking-[0.12em] ${projectSubmitHintClass}`}>
          {t("submit.members.countHint")}
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor={`member-name-${memberIndex}`} className={projectSubmitLabelClass}>
            {t("submit.members.name")}
          </label>
          <input
            id={`member-name-${memberIndex}`}
            autoComplete="name"
            className={`${projectSubmitInputClass} submit-flow-input text-lg sm:text-xl`}
            placeholder={t("submit.members.namePlaceholder")}
            {...register(`members.${memberIndex}.name`)}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`member-x-${memberIndex}`} className={projectSubmitLabelClass}>
            {t("submit.members.xProfile")}
          </label>
          <input
            id={`member-x-${memberIndex}`}
            className={`${projectSubmitInputClass} submit-flow-input text-lg sm:text-xl`}
            placeholder={t("submit.members.xPlaceholder")}
            {...register(`members.${memberIndex}.xProfile`)}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`member-linkedin-${memberIndex}`} className={projectSubmitLabelClass}>
            {t("submit.members.linkedInProfile")}
          </label>
          <input
            id={`member-linkedin-${memberIndex}`}
            className={`${projectSubmitInputClass} submit-flow-input text-lg sm:text-xl`}
            placeholder={t("submit.members.linkedInPlaceholder")}
            {...register(`members.${memberIndex}.linkedInProfile`)}
          />
        </div>
      </div>

      {isFifthMember ? (
        <button
          type="button"
          onClick={onRemoveFifth}
          className={projectSubmitSecondaryButtonClass}
        >
          {t("submit.members.removeFifth")}
        </button>
      ) : null}
    </div>
  );
}
