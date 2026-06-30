import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import {
  BuilderTeamProfileFields,
  type TeamProfileDraft,
} from "./builder-team-profile-fields";
import {
  projectSubmitHintClass,
  projectSubmitInputClass,
  projectSubmitLabelClass,
} from "../project-submit-form-fields";
import { useTranslation } from "../../context/language-context";
import { validateTeamProfile } from "../../../convex/lib/profileValidation";

type Props = {
  sessionId: string;
  onBack: () => void;
};

const EMPTY_PROFILE: TeamProfileDraft = { name: "", xProfile: "", linkedInProfile: "" };

export function BuilderTeamJoinForm({ sessionId, onBack }: Props) {
  const { t } = useTranslation();
  const joinTeam = useMutation(api.eventTeams.joinTeam);

  const [code, setCode] = useState("");
  const [profile, setProfile] = useState<TeamProfileDraft>(EMPTY_PROFILE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedCode = code.trim().toUpperCase();
  const preview = useQuery(
    api.eventTeams.previewTeamByCode,
    normalizedCode.length >= 4 ? { inviteCode: normalizedCode } : "skip",
  );
  const joinBlocked = Boolean(preview && (preview.full || preview.submitted));

  async function handleSubmit() {
    if (submitting) return;
    setError(null);

    const profileError = validateTeamProfile(profile);
    if (profileError) {
      setError(profileError);
      return;
    }

    setSubmitting(true);
    try {
      await joinTeam({
        memberSessionId: sessionId,
        inviteCode: normalizedCode,
        name: profile.name,
        xProfile: profile.xProfile,
        linkedInProfile: profile.linkedInProfile,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("submit.error.generic"));
      setSubmitting(false);
    }
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-lg font-semibold tracking-tight text-fg sm:text-xl">
          {t("builder.team.joinForm.title")}
        </h3>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-mono text-[0.725rem] uppercase tracking-[0.12em] text-fg-4 transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden />
          {t("builder.team.back")}
        </button>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="join-code" className={projectSubmitLabelClass}>
          {t("builder.team.joinForm.code")}
        </label>
        <input
          id="join-code"
          autoCapitalize="characters"
          className={`${projectSubmitInputClass} font-mono uppercase tracking-[0.3em]`}
          placeholder={t("builder.team.joinForm.codePlaceholder")}
          value={code}
          maxLength={6}
          onChange={(e) => setCode(e.target.value)}
        />
        <p className={projectSubmitHintClass}>{t("builder.team.joinForm.codeHint")}</p>
        {preview ? (
          <div className="space-y-1">
            <p className="font-mono text-[0.725rem] uppercase tracking-[0.12em] text-accent">
              {t("builder.team.joinForm.foundTeam")}: {preview.name} · {preview.memberCount}/
              {preview.maxMembers}
            </p>
            {preview.submitted ? (
              <p className="font-mono text-[0.725rem] uppercase tracking-[0.12em] text-fg-4">
                {t("builder.team.joinForm.submitted")}
              </p>
            ) : preview.full ? (
              <p className="font-mono text-[0.725rem] uppercase tracking-[0.12em] text-fg-4">
                {t("builder.team.joinForm.full")}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        <p className={projectSubmitLabelClass}>{t("builder.team.joinForm.yourProfile")}</p>
        <BuilderTeamProfileFields value={profile} onChange={setProfile} idPrefix="join" />
      </div>

      {error ? (
        <p
          className="rounded-none border border-red-500/40 bg-red-500/10 px-3 py-2 text-base text-red-300"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting || joinBlocked}
        className="btn-phosphor inline-flex w-full items-center justify-center px-6 py-3 text-base disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? t("builder.team.joinForm.submitting") : t("builder.team.joinForm.submit")}
      </button>
    </form>
  );
}
