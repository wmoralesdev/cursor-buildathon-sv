import { useState } from "react";
import { useMutation } from "convex/react";
import { ArrowLeft } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import {
  BuilderTeamProfileFields,
  type TeamProfileDraft,
} from "./builder-team-profile-fields";
import { BuilderSponsorTrackField } from "./builder-sponsor-track-field";
import {
  projectSubmitInputClass,
  projectSubmitLabelClass,
} from "../project-submit-form-fields";
import { useTranslation } from "../../context/language-context";
import { trimOrThrow, validateTeamProfile } from "../../../convex/lib/profileValidation";
import type { TrackPrizeId } from "../../data/prizes";

type Props = {
  sessionId: string;
  onBack: () => void;
};

const EMPTY_PROFILE: TeamProfileDraft = { name: "", xProfile: "", linkedInProfile: "" };

export function BuilderTeamLeaderForm({ sessionId, onBack }: Props) {
  const { t } = useTranslation();
  const createTeam = useMutation(api.eventTeams.createTeam);

  const [teamName, setTeamName] = useState("");
  const [profile, setProfile] = useState<TeamProfileDraft>(EMPTY_PROFILE);
  const [sponsorTrack, setSponsorTrack] = useState<TrackPrizeId | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (submitting) return;
    setError(null);

    try {
      trimOrThrow(teamName, "Team name");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("submit.error.generic"));
      return;
    }

    const profileError = validateTeamProfile(profile);
    if (profileError) {
      setError(profileError);
      return;
    }

    setSubmitting(true);
    try {
      await createTeam({
        leaderSessionId: sessionId,
        teamName,
        ...(sponsorTrack ? { sponsorTrack } : {}),
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
          {t("builder.team.leaderForm.title")}
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
        <label htmlFor="leader-team-name" className={projectSubmitLabelClass}>
          {t("builder.team.leaderForm.teamName")}
        </label>
        <input
          id="leader-team-name"
          autoComplete="organization"
          className={projectSubmitInputClass}
          placeholder={t("builder.team.leaderForm.teamNamePlaceholder")}
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <p className={projectSubmitLabelClass}>{t("builder.team.leaderForm.yourProfile")}</p>
        <BuilderTeamProfileFields value={profile} onChange={setProfile} idPrefix="leader" />
      </div>

      <BuilderSponsorTrackField
        value={sponsorTrack}
        onChange={setSponsorTrack}
        idPrefix="leader"
      />

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
        disabled={submitting}
        className="btn-phosphor inline-flex w-full items-center justify-center px-6 py-3 text-base disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? t("builder.team.leaderForm.submitting") : t("builder.team.leaderForm.submit")}
      </button>
    </form>
  );
}
