import {
  projectSubmitInputClass,
  projectSubmitLabelClass,
} from "../project-submit-form-fields";
import { useTranslation } from "../../context/language-context";

export type TeamProfileDraft = {
  name: string;
  xProfile: string;
  linkedInProfile: string;
};

type Props = {
  value: TeamProfileDraft;
  onChange: (next: TeamProfileDraft) => void;
  idPrefix: string;
};

export function BuilderTeamProfileFields({ value, onChange, idPrefix }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-name`} className={projectSubmitLabelClass}>
          {t("builder.team.field.name")}
        </label>
        <input
          id={`${idPrefix}-name`}
          autoComplete="name"
          className={projectSubmitInputClass}
          placeholder={t("builder.team.field.namePlaceholder")}
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-x`} className={projectSubmitLabelClass}>
          {t("builder.team.field.xProfile")}
        </label>
        <input
          id={`${idPrefix}-x`}
          className={projectSubmitInputClass}
          placeholder={t("builder.team.field.xPlaceholder")}
          value={value.xProfile}
          onChange={(e) => onChange({ ...value, xProfile: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-linkedin`} className={projectSubmitLabelClass}>
          {t("builder.team.field.linkedIn")}
        </label>
        <input
          id={`${idPrefix}-linkedin`}
          className={projectSubmitInputClass}
          placeholder={t("builder.team.field.linkedInPlaceholder")}
          value={value.linkedInProfile}
          onChange={(e) => onChange({ ...value, linkedInProfile: e.target.value })}
        />
      </div>
    </div>
  );
}
