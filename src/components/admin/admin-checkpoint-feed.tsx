import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { HUB_EVENT_TIMEZONE } from "../../data/hub-progress-steps";
import { useTranslation } from "../../context/language-context";
import { HubButton, HubCard } from "../hub/hub-ui-primitives";

type CheckpointFeedTeam = {
  teamId: Id<"hub_teams">;
  name: string;
  windows: Array<{
    checkpointId: string;
    label: string;
    submitted: boolean;
    submittedAt?: number;
    note?: string;
    snapshot?: {
      projectName: string;
      projectDescription: string;
      repoUrl: string;
      projectUrl: string;
      sponsorsUsed: string[];
      socialPostCount: number;
      deliverablesSubmitted: boolean;
    };
  }>;
};

type CheckpointFeedWindow = CheckpointFeedTeam["windows"][number];

function formatCheckpointTime(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: HUB_EVENT_TIMEZONE,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function WindowCell({
  window,
  checkedInLabel,
  missingLabel,
  submittedAtLabel,
}: {
  window: CheckpointFeedWindow;
  checkedInLabel: string;
  missingLabel: string;
  submittedAtLabel: (time: string) => string;
}) {
  if (!window.submitted) {
    return (
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-fg-3">
        {missingLabel}
      </span>
    );
  }

  return (
    <div className="space-y-0.5">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.08em] text-accent">
        {checkedInLabel}
      </span>
      {window.submittedAt ? (
        <p className="font-display text-[0.75rem] text-fg-2">
          {submittedAtLabel(formatCheckpointTime(window.submittedAt))}
        </p>
      ) : null}
    </div>
  );
}

function SnapshotDetails({
  window,
  t,
}: {
  window: CheckpointFeedWindow;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  if (!window.snapshot) {
    return (
      <p className="font-display text-[0.85rem] text-fg-3">{t("admin.checkpointFeed.noSnapshot")}</p>
    );
  }

  const snapshot = window.snapshot;

  return (
    <dl className="mt-3 grid gap-2 font-display text-[0.85rem] text-fg-2">
      <div>
        <dt className="text-fg-3">{t("admin.checkpointFeed.projectName")}</dt>
        <dd>{snapshot.projectName || "—"}</dd>
      </div>
      <div>
        <dt className="text-fg-3">{t("admin.description")}</dt>
        <dd>{snapshot.projectDescription || "—"}</dd>
      </div>
      <div>
        <dt className="text-fg-3">{t("admin.checkpointFeed.repo")}</dt>
        <dd>
          {snapshot.repoUrl ? (
            <a href={snapshot.repoUrl} target="_blank" rel="noreferrer" className="text-accent underline">
              {snapshot.repoUrl}
            </a>
          ) : (
            "—"
          )}
        </dd>
      </div>
      <div>
        <dt className="text-fg-3">{t("admin.checkpointFeed.demo")}</dt>
        <dd>
          {snapshot.projectUrl ? (
            <a href={snapshot.projectUrl} target="_blank" rel="noreferrer" className="text-accent underline">
              {snapshot.projectUrl}
            </a>
          ) : (
            "—"
          )}
        </dd>
      </div>
      <div>
        <dt className="text-fg-3">{t("admin.checkpointFeed.sponsors")}</dt>
        <dd>
          {snapshot.sponsorsUsed.length > 0 ? snapshot.sponsorsUsed.join(", ") : t("admin.checkpointFeed.none")}
        </dd>
      </div>
      <div>
        <dt className="text-fg-3">{t("admin.checkpointFeed.socialPosts")}</dt>
        <dd>{snapshot.socialPostCount}</dd>
      </div>
      <div>
        <dt className="text-fg-3">{t("admin.checkpointFeed.deliverablesSubmitted")}</dt>
        <dd>
          {snapshot.deliverablesSubmitted
            ? t("admin.checkpointFeed.yes")
            : t("admin.checkpointFeed.no")}
        </dd>
      </div>
    </dl>
  );
}

export function AdminCheckpointFeed() {
  const { t } = useTranslation();
  const feed = useQuery(api.hub.adminLogistics.listCheckpointFeed, {});
  const [selectedTeamId, setSelectedTeamId] = useState<Id<"hub_teams"> | null>(null);

  const checkpointLabels = feed?.[0]?.windows.map((window) => window.label) ?? [];
  const selectedTeam =
    feed?.find((team) => team.teamId === selectedTeamId) ?? feed?.[0] ?? null;

  if (feed === undefined) {
    return (
      <HubCard title={t("admin.checkpointFeed.title")}>
        <div className="h-24 animate-pulse bg-border-faint" />
      </HubCard>
    );
  }

  if (feed.length === 0) {
    return (
      <HubCard title={t("admin.checkpointFeed.title")}>
        <p className="font-display text-[0.875rem] text-fg-2">{t("admin.checkpointFeed.noTeams")}</p>
      </HubCard>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
      <HubCard title={t("admin.checkpointFeed.title")}>
        <p className="mb-4 font-display text-[0.875rem] text-fg-2">
          {t("admin.checkpointFeed.subtitle")}
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-faint text-fg-3">
                <th className="py-2 pr-4">{t("admin.checkpointFeed.team")}</th>
                {checkpointLabels.map((label) => (
                  <th key={label} className="py-2 pr-4">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {feed.map((team) => (
                <tr
                  key={team.teamId}
                  className={`border-b border-border-faint/60 ${
                    selectedTeam?.teamId === team.teamId ? "bg-border-faint/20" : ""
                  }`}
                >
                  <td className="py-2 pr-4">
                    <HubButton
                      variant={selectedTeam?.teamId === team.teamId ? "primary" : "ghost"}
                      onClick={() => setSelectedTeamId(team.teamId)}
                    >
                      {team.name}
                    </HubButton>
                  </td>
                  {team.windows.map((window) => (
                    <td key={window.checkpointId} className="py-2 pr-4 align-top">
                      <WindowCell
                        window={window}
                        checkedInLabel={t("admin.checkpointFeed.checkedIn")}
                        missingLabel={t("admin.checkpointFeed.missing")}
                        submittedAtLabel={(time) =>
                          t("admin.checkpointFeed.submittedAt").replace("{time}", time)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </HubCard>

      <HubCard title={selectedTeam?.name ?? t("admin.checkpointFeed.title")}>
        {selectedTeam ? (
          <div className="space-y-4">
            {selectedTeam.windows.map((window) => (
              <div key={window.checkpointId} className="border border-border-faint p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-[0.95rem] text-fg">{window.label}</p>
                  <span className={window.submitted ? "text-accent" : "text-fg-3"}>
                    {window.submitted
                      ? t("admin.checkpointFeed.checkedIn")
                      : t("admin.checkpointFeed.missing")}
                  </span>
                </div>
                {window.submitted ? (
                  <>
                    {window.submittedAt ? (
                      <p className="mt-1 font-display text-[0.8rem] text-fg-2">
                        {t("admin.checkpointFeed.submittedAt").replace(
                          "{time}",
                          formatCheckpointTime(window.submittedAt),
                        )}
                      </p>
                    ) : null}
                    <p className="mt-3 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-3">
                      {t("admin.checkpointFeed.note")}
                    </p>
                    <p className="mt-1 font-display text-[0.85rem] text-fg">
                      {window.note?.trim() ? window.note : t("admin.checkpointFeed.noNote")}
                    </p>
                    <p className="mt-4 font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-3">
                      {t("admin.checkpointFeed.snapshot")}
                    </p>
                    <SnapshotDetails window={window} t={t} />
                  </>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="font-display text-[0.875rem] text-fg-2">
            {t("admin.checkpointFeed.selectTeam")}
          </p>
        )}
      </HubCard>
    </div>
  );
}
