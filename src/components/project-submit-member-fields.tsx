import { useFormContext, useFieldArray } from "react-hook-form";

import type { ProjectSubmitFormValues } from "../pages/project-submit-types";
import { useTranslation } from "../context/language-context";
import {
  projectSubmitHintClass,
  projectSubmitInputClass,
  projectSubmitLabelClass,
  projectSubmitMemberFieldsetClass,
  projectSubmitMemberLegendClass,
  projectSubmitSecondaryButtonClass,
  projectSubmitSectionClass,
  projectSubmitSectionTitleClass,
} from "./project-submit-form-fields";

export function ProjectSubmitMemberFields() {
  const { t } = useTranslation();
  const { register, control } = useFormContext<ProjectSubmitFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const canAddFifth = fields.length < 5;
  const canRemoveFifth = fields.length === 5;

  return (
    <section className={projectSubmitSectionClass} aria-labelledby="submit-members-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="submit-members-heading" className={projectSubmitSectionTitleClass}>
          {t("submit.members.title")}
        </h2>
        <p className={`font-mono text-[0.65rem] uppercase tracking-[0.12em] ${projectSubmitHintClass}`}>
          {t("submit.members.countHint")}
        </p>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <fieldset key={field.id} className={projectSubmitMemberFieldsetClass}>
            <legend className={projectSubmitMemberLegendClass}>
              {t("submit.members.memberLabel")} {index + 1}
            </legend>

            <div className="space-y-1.5">
              <label htmlFor={`member-name-${index}`} className={projectSubmitLabelClass}>
                {t("submit.members.name")}
              </label>
              <input
                id={`member-name-${index}`}
                required
                autoComplete="name"
                className={projectSubmitInputClass}
                placeholder={t("submit.members.namePlaceholder")}
                {...register(`members.${index}.name`)}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor={`member-x-${index}`} className={projectSubmitLabelClass}>
                {t("submit.members.xProfile")}
              </label>
              <input
                id={`member-x-${index}`}
                required
                className={projectSubmitInputClass}
                placeholder={t("submit.members.xPlaceholder")}
                {...register(`members.${index}.xProfile`)}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor={`member-linkedin-${index}`} className={projectSubmitLabelClass}>
                {t("submit.members.linkedInProfile")}
              </label>
              <input
                id={`member-linkedin-${index}`}
                required
                className={projectSubmitInputClass}
                placeholder={t("submit.members.linkedInPlaceholder")}
                {...register(`members.${index}.linkedInProfile`)}
              />
            </div>
          </fieldset>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {canAddFifth ? (
          <button
            type="button"
            onClick={() =>
              append({ name: "", xProfile: "", linkedInProfile: "" })
            }
            className={projectSubmitSecondaryButtonClass}
          >
            {t("submit.members.addFifth")}
          </button>
        ) : null}
        {canRemoveFifth ? (
          <button
            type="button"
            onClick={() => remove(4)}
            className={projectSubmitSecondaryButtonClass}
          >
            {t("submit.members.removeFifth")}
          </button>
        ) : null}
      </div>
    </section>
  );
}
