import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { Check, Copy } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import type { BuilderTeam } from "../../hooks/use-builder-team";
import { COMPETITION_TRACK_DEFS } from "../../data/competition-tracks";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";

type Props = {
  team: BuilderTeam;
  sessionId: string;
  canSubmit: boolean;
  minSubmitMembers: number;
};

export function BuilderTeamPanel({ team, sessionId, canSubmit, minSubmitMembers }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const emptySlots = Math.max(team.maxMembers - team.memberCount, 0);
  const membersCountLabel = t("builder.team.panel.membersCount")
    .replace("{count}", String(team.memberCount))
    .replace("{max}", String(team.maxMembers));

  async function copyCode() {
    if (!team.inviteCode) return;
    try {
      await navigator.clipboard.writeText(team.inviteCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-faint pb-5">
        <div>
          <p className="font-mono text-[0.675rem] uppercase tracking-[0.14em] text-accent">
            {team.isLeader
              ? t("builder.team.panel.leaderBadge")
              : t("builder.team.panel.memberBadge")}
          </p>
          <h3 className="mt-1.5 font-display text-xl font-bold uppercase tracking-[-0.01em] text-fg sm:text-2xl">
            {team.name}
          </h3>
        </div>
        <span className="font-mono text-[0.725rem] uppercase tracking-[0.12em] text-fg-3">
          {membersCountLabel}
        </span>
      </div>

      {team.isLeader && team.inviteCode ? (
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border border-accent/30 bg-bg-raised/40 p-4">
          <div>
            <p className="font-mono text-[0.675rem] uppercase tracking-[0.14em] text-fg-4">
              {t("builder.team.panel.inviteCodeLabel")}
            </p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-[0.3em] text-fg">
              {team.inviteCode}
            </p>
            <p className="mt-2 max-w-[36ch] font-display text-[0.875rem] leading-[1.5] text-fg-3">
              {t("builder.team.panel.shareHint")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void copyCode()}
            className="inline-flex items-center gap-2 rounded-none border border-border-faint px-3 py-2 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-3 transition-colors hover:border-accent/50 hover:text-accent"
          >
            {copied ? (
              <Check className="size-3.5" strokeWidth={2} aria-hidden />
            ) : (
              <Copy className="size-3.5" strokeWidth={2} aria-hidden />
            )}
            {copied ? t("builder.team.panel.copied") : t("builder.team.panel.copy")}
          </button>
        </div>
      ) : null}

      {team.sponsorTrack ? (
        <div className="mt-5 border border-border-faint bg-bg-raised/40 p-4">
          <p className="font-mono text-[0.675rem] uppercase tracking-[0.14em] text-fg-4">
            {t("builder.team.panel.sponsorTrackLabel")}
          </p>
          <p className="mt-1.5 font-display text-[0.975rem] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-fg">
            {t(`onePager.prizes.track.${team.sponsorTrack}.title` as TranslationKey)}
          </p>
        </div>
      ) : null}

      <CompetitionTrackBlock team={team} sessionId={sessionId} />

      <div className="mt-5">
        <p className="mb-3 font-mono text-[0.675rem] uppercase tracking-[0.14em] text-fg-4">
          {t("builder.team.panel.rosterLabel")}
        </p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {team.members.map((member, i) => (
            <li
              key={`${member.name}-${i}`}
              className="flex flex-col gap-2 border border-border-faint bg-bg-raised/40 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate font-display text-[0.975rem] text-fg">
                  {member.name}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {member.isYou ? (
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-accent">
                      {t("builder.team.panel.youBadge")}
                    </span>
                  ) : null}
                  {member.isLeader ? (
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-4">
                      {t("builder.team.panel.leaderBadge")}
                    </span>
                  ) : null}
                </span>
              </div>
              {member.xProfile || member.linkedInProfile ? (
                <div className="flex flex-wrap items-center gap-3">
                  {member.xProfile ? (
                    <MemberLink href={member.xProfile} label={t("builder.team.panel.memberX")} />
                  ) : null}
                  {member.linkedInProfile ? (
                    <MemberLink
                      href={member.linkedInProfile}
                      label={t("builder.team.panel.memberLinkedIn")}
                    />
                  ) : null}
                </div>
              ) : null}
            </li>
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <li
              key={`empty-${i}`}
              className="flex items-center gap-3 border border-dashed border-border-faint px-4 py-3 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-5"
            >
              {t("builder.team.panel.emptySlot")}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">{renderStatus()}</div>
    </div>
  );

  function renderStatus() {
    if (team.submitted) {
      return (
        <div className="flex flex-col gap-4">
          <p className="border border-accent/30 bg-accent/10 px-4 py-3 font-display text-[0.975rem] text-fg-2">
            {t("builder.team.panel.submitted")}
          </p>
          {team.isLeader ? (
            <SubmissionSummary teamId={team.teamId} sessionId={sessionId} />
          ) : null}
        </div>
      );
    }

    if (!team.isLeader) {
      return (
        <p className="font-display text-[0.975rem] leading-[1.6] text-fg-3">
          {t("builder.team.panel.memberWait")}
        </p>
      );
    }

    if (!canSubmit) {
      return (
        <p className="font-display text-[0.975rem] leading-[1.6] text-fg-3">
          {t("builder.team.panel.needMore").replace("{count}", String(minSubmitMembers))}
        </p>
      );
    }

    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-[0.975rem] leading-[1.6] text-fg-3">
          {t("builder.team.panel.readyLeader")}
        </p>
        <Link to="/submit" className="btn-phosphor inline-flex shrink-0 justify-center no-underline">
          {t("builder.team.panel.submitCta")}
        </Link>
      </div>
    );
  }
}

function MemberLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-fg-4 no-underline transition-colors hover:text-accent"
    >
      {label}
      <span aria-hidden>↗</span>
    </a>
  );
}

function CompetitionTrackBlock({ team, sessionId }: { team: BuilderTeam; sessionId: string }) {
  const { t } = useTranslation();
  const setCompetitionTrack = useMutation(api.eventTeams.setCompetitionTrack);
  const [saving, setSaving] = useState(false);

  const selectedDef = team.competitionTrack
    ? COMPETITION_TRACK_DEFS.find((def) => def.id === team.competitionTrack)
    : undefined;

  // Members only see the chosen track; the leader owns the selection.
  if (!team.isLeader || team.submitted) {
    return (
      <div className="mt-5 border border-border-faint bg-bg-raised/40 p-4">
        <p className="font-mono text-[0.675rem] uppercase tracking-[0.14em] text-fg-4">
          {t("builder.team.panel.competitionTrackLabel")}
        </p>
        <p className="mt-1.5 font-display text-[0.975rem] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-fg">
          {selectedDef ? t(selectedDef.titleKey) : t("builder.team.panel.competitionTrackNone")}
        </p>
      </div>
    );
  }

  async function choose(id: BuilderTeam["competitionTrack"]) {
    if (saving || !id || id === team.competitionTrack) return;
    setSaving(true);
    try {
      await setCompetitionTrack({ leaderSessionId: sessionId, competitionTrack: id });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-5 border border-border-faint bg-bg-raised/40 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="font-mono text-[0.675rem] uppercase tracking-[0.14em] text-fg-4">
          {t("builder.team.panel.competitionTrackLabel")}
        </p>
        {saving ? (
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-accent">
            {t("builder.team.panel.competitionTrackSaving")}
          </span>
        ) : null}
      </div>
      <p className="mt-1.5 font-display text-[0.9rem] leading-[1.5] text-fg-3">
        {t("builder.team.panel.competitionTrackPrompt")}
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {COMPETITION_TRACK_DEFS.map((def) => {
          const checked = team.competitionTrack === def.id;
          return (
            <button
              key={def.id}
              type="button"
              onClick={() => void choose(def.id)}
              disabled={saving}
              className={`flex flex-col gap-1 border p-3 text-left transition-colors disabled:opacity-60 ${
                checked
                  ? "border-accent/60 bg-accent/10"
                  : "border-border bg-surface hover:border-accent/30"
              }`}
            >
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-accent">
                {def.code}
              </span>
              <span className="font-display text-[0.925rem] font-bold uppercase leading-[1.15] tracking-[-0.01em] text-fg">
                {t(def.titleKey)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SubmissionSummary({ teamId, sessionId }: { teamId: string; sessionId: string }) {
  const { t } = useTranslation();
  const submission = useQuery(api.submissions.getSubmissionByTeam, {
    eventTeamId: teamId as Id<"event_teams">,
    leaderSessionId: sessionId,
  });

  if (!submission) return null;

  const trackDef = submission.competitionTrack
    ? COMPETITION_TRACK_DEFS.find((def) => def.id === submission.competitionTrack)
    : undefined;

  return (
    <div className="border border-border-faint bg-bg-raised/40 p-4">
      <p className="font-mono text-[0.675rem] uppercase tracking-[0.14em] text-fg-4">
        {t("builder.team.panel.submission.title")}
      </p>
      <dl className="mt-3 flex flex-col gap-2.5">
        <SummaryRow label={t("builder.team.panel.submission.repo")}>
          <SummaryLink href={submission.repoUrl} />
        </SummaryRow>
        <SummaryRow label={t("builder.team.panel.submission.post")}>
          <SummaryLink href={submission.eventSocialPostUrl} />
        </SummaryRow>
        {trackDef ? (
          <SummaryRow label={t("builder.team.panel.submission.track")}>
            <span className="font-display text-[0.9rem] text-fg-2">{t(trackDef.titleKey)}</span>
          </SummaryRow>
        ) : null}
      </dl>
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-5">{label}</dt>
      <dd className="min-w-0 text-right">{children}</dd>
    </div>
  );
}

function SummaryLink({ href }: { href: string }) {
  const { t } = useTranslation();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-mono text-[0.725rem] uppercase tracking-[0.12em] text-accent no-underline hover:underline"
    >
      {t("builder.team.panel.submission.view")}
      <span aria-hidden>↗</span>
    </a>
  );
}
