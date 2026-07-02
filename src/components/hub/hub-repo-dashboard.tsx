import { useEffect, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { ExternalLink, RefreshCw } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import { REPO_SYNC_COOLDOWN_MS } from "../../constants";
import { HUB_CHECKPOINTS } from "../../data/hub-progress-steps";
import { useHubQueryReady } from "../../hooks/use-hub-query-ready";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";
import { HubButton, HubCard, HubError, HubField, HubInput } from "./hub-ui-primitives";

const FLAG_LABEL_KEYS: Record<string, TranslationKey> = {
  repo_created_before_event: "hub.repo.flag.repoCreatedBeforeEvent",
  pre_event_commits: "hub.repo.flag.preEventCommits",
  fork: "hub.repo.flag.fork",
  large_initial_commit: "hub.repo.flag.largeInitialCommit",
  no_commits_in_window: "hub.repo.flag.noCommitsInWindow",
  force_push_detected: "hub.repo.flag.forcePushDetected",
  repo_not_linked: "hub.repo.flag.repoNotLinked",
};

const STATUS_STYLES: Record<"ok" | "review" | "violation" | "unknown", string> = {
  ok: "border-accent/40 bg-accent/10 text-accent",
  review: "border-amber-600/35 bg-amber-600/10 text-amber-900 dark:text-amber-200",
  violation: "border-red-600/35 bg-red-600/10 text-red-900 dark:text-red-200",
  unknown: "border-border-faint bg-bg-raised/40 text-fg-3",
};

const CHECKPOINT_LABELS = Object.fromEntries(
  HUB_CHECKPOINTS.map((cp) => [cp.id, cp.label]),
) as Record<string, string>;

function getCooldownRemainingMs(lastSyncAt: number | undefined, cooldownMs: number, now = Date.now()) {
  if (!lastSyncAt) return 0;
  return Math.max(0, cooldownMs - (now - lastSyncAt));
}

export function HubRepoDashboard() {
  const { t } = useTranslation();
  const hubReady = useHubQueryReady();
  const dashboard = useQuery(api.hub.repoTracking.getRepoDashboard, hubReady ? {} : "skip");
  const linkTeamRepository = useMutation(api.hub.repoTracking.linkTeamRepository);
  const requestSync = useAction(api.hub.repoTracking.requestSync);

  const [repoInput, setRepoInput] = useState("");
  const [linking, setLinking] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const repoUrl = dashboard?.repoUrl;
  const status = dashboard?.complianceStatus ?? "unknown";
  const snapshot = dashboard?.snapshot;
  const flags = dashboard?.complianceFlags ?? [];
  const syncJob = dashboard?.syncJob;
  const syncCooldownMs = dashboard?.syncCooldownMs ?? REPO_SYNC_COOLDOWN_MS;
  const cooldownRemainingMs = getCooldownRemainingMs(syncJob?.lastSyncAt, syncCooldownMs, now);
  const cooldownActive = cooldownRemainingMs > 0;
  const isCaptain = dashboard?.isCaptain ?? false;

  useEffect(() => {
    if (!cooldownActive) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [cooldownActive]);

  if (dashboard === undefined) {
    return (
      <div id="hub-repo" className="scroll-mt-24">
        <HubCard title={t("hub.repo.title")} tag={t("hub.repo.tag")}>
          <div className="h-24 animate-pulse bg-border-faint" />
        </HubCard>
      </div>
    );
  }

  if (dashboard === null) {
    return null;
  }

  if (!repoUrl) {
    async function handleLinkRepo() {
      if (linking || !repoInput.trim()) return;
      setLinking(true);
      setError(null);
      try {
        await linkTeamRepository({ repoUrl: repoInput.trim() });
      } catch (err) {
        setError(err instanceof Error ? err.message : t("hub.repo.error.generic"));
      } finally {
        setLinking(false);
      }
    }

    return (
      <div id="hub-repo" className="scroll-mt-24">
        <HubCard title={t("hub.repo.title")} tag={t("hub.repo.tag")}>
          <p className="max-w-[56ch] font-display text-[0.925rem] leading-relaxed text-fg-2">
            {t("hub.repo.empty.intro")}
          </p>
          {isCaptain ? (
            <>
              <HubField label={t("hub.project.repo")}>
                <HubInput
                  id="hub-repo-link"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  placeholder={t("submit.project.repoPlaceholder")}
                />
                <p className="mt-1.5 font-display text-[0.75rem] text-fg-4">
                  {t("hub.repo.empty.captainHint")}
                </p>
              </HubField>
              <HubButton
                type="button"
                className="mt-2"
                disabled={linking || repoInput.trim().length < 8}
                onClick={() => void handleLinkRepo()}
              >
                {linking ? t("hub.repo.linking") : t("hub.repo.linkCta")}
              </HubButton>
            </>
          ) : (
            <p className="mt-4 font-display text-[0.875rem] text-fg-3">{t("hub.repo.empty.captainOnly")}</p>
          )}
          <HubError message={error} />
        </HubCard>
      </div>
    );
  }

  async function handleRefresh() {
    if (syncing) return;
    setSyncing(true);
    setError(null);
    try {
      await requestSync({});
    } catch (err) {
      setError(err instanceof Error ? err.message : t("hub.repo.error.generic"));
    } finally {
      setSyncing(false);
    }
  }

  function formatDate(iso: string | null | undefined) {
    if (!iso) return t("hub.repo.metric.unknown");
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const refreshDisabled = syncing || cooldownActive;

  return (
    <div id="hub-repo" className="scroll-mt-24">
    <HubCard title={t("hub.repo.title")} tag={t("hub.repo.tag")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-[56ch] font-display text-[0.925rem] leading-relaxed text-fg-2">
          {t("hub.repo.subtitle")}
        </p>
        <span
          className={`inline-flex shrink-0 rounded-sm border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
        >
          {t(`hub.repo.status.${status}` as TranslationKey)}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-sm border border-border-faint bg-surface/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-w-0 items-center gap-1.5 text-sm text-accent no-underline hover:underline"
        >
          <span className="truncate font-mono text-[0.8125rem]">
            {repoUrl.replace(/^https:\/\//, "")}
          </span>
          <ExternalLink className="size-3.5 shrink-0" aria-hidden />
        </a>
        <button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={refreshDisabled}
          className="inline-flex items-center gap-1.5 rounded-sm border border-border-faint px-2.5 py-1 text-xs text-fg-3 transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-60"
        >
          <RefreshCw className={`size-3.5 ${syncing ? "animate-spin" : ""}`} aria-hidden />
          {syncing ? t("hub.repo.refreshing") : t("hub.repo.refresh")}
        </button>
      </div>

      {cooldownActive && !error ? (
        <p className="mt-3 text-xs text-fg-4" role="status">
          {t("hub.repo.error.refreshCooldownRemaining").replace(
            "{seconds}",
            String(Math.ceil(cooldownRemainingMs / 1000)),
          )}
        </p>
      ) : null}

      {snapshot ? (
        <>
          <p className="mt-4 text-xs text-fg-5">
            {t("hub.repo.lastSynced").replace(
              "{time}",
              formatDate(new Date(snapshot.syncedAt).toISOString()),
            )}
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Metric label={t("hub.repo.metric.lastPush")} value={formatDate(snapshot.lastPushAt)} />
            <Metric
              label={t("hub.repo.metric.eventCommits")}
              value={String(snapshot.commitCountInEventWindow)}
            />
            <Metric
              label={t("hub.repo.metric.beforeEventCommits")}
              value={String(snapshot.commitCountBeforeEvent)}
            />
            <Metric
              label={t("hub.repo.metric.contributors")}
              value={String(snapshot.contributors.length)}
            />
          </dl>

          {snapshot.contributors.length > 0 ? (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-fg-4">{t("hub.repo.contributorsList")}</p>
              <p className="font-mono text-sm text-fg-2">{snapshot.contributors.join(", ")}</p>
            </div>
          ) : null}

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div>
              {flags.length > 0 ? (
                <ul className="flex flex-col gap-1 text-sm leading-relaxed text-fg-3">
                  {flags.map((flag) => (
                    <li key={flag}>
                      {t(FLAG_LABEL_KEYS[flag] ?? ("hub.repo.flag.unknown" as TranslationKey))}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-fg-3">{t("hub.repo.noFlags")}</p>
              )}
            </div>

            {snapshot.recentCommits.length > 0 ? (
              <div>
                <p className="mb-2 text-xs font-medium text-fg-4">{t("hub.repo.recentCommits")}</p>
                <ul className="flex flex-col gap-2">
                  {snapshot.recentCommits.map((commit) => (
                    <li
                      key={commit.sha}
                      className="rounded-sm border border-border-faint bg-surface/60 px-3 py-2"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-mono text-xs text-accent">{commit.sha}</span>
                        <span className="text-xs text-fg-5">{formatDate(commit.date)}</span>
                      </div>
                      <p className="mt-1 truncate text-sm text-fg-2">{commit.message}</p>
                      <p className="mt-0.5 text-xs text-fg-5">{commit.author}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {snapshot.checkpointSummaries.some((cp) => cp.commitCount > 0) ? (
            <div className="mt-6">
              <p className="mb-3 text-xs font-medium text-fg-4">{t("hub.repo.checkpointSummaries")}</p>
              <div className="space-y-3">
                {snapshot.checkpointSummaries.map((cp) => (
                  <div
                    key={cp.checkpointId}
                    className="rounded-sm border border-border-faint bg-surface/40 px-3 py-2"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-fg">
                        {CHECKPOINT_LABELS[cp.checkpointId] ?? cp.checkpointId}
                      </span>
                      <span className="text-xs text-fg-4">
                        {t("hub.repo.checkpointCommitCount").replace(
                          "{count}",
                          String(cp.commitCount),
                        )}
                      </span>
                    </div>
                    {cp.contributors.length > 0 ? (
                      <p className="mt-1 text-xs text-fg-5">
                        {t("hub.repo.checkpointContributors")}: {cp.contributors.join(", ")}
                      </p>
                    ) : null}
                    {cp.commits.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {cp.commits.map((commit) => (
                          <li key={commit.sha} className="truncate text-xs text-fg-3">
                            <span className="font-mono text-accent">{commit.sha}</span> {commit.message}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-5 text-sm text-fg-3">
          {syncing
            ? t("hub.repo.syncing")
            : syncJob?.lastSyncStatus === "error"
              ? t("hub.repo.syncFailed")
              : t("hub.repo.syncPending")}
        </p>
      )}

      {error ? (
        <p
          className="mt-4 rounded-sm border border-red-600/35 bg-red-600/10 px-3 py-2 text-sm text-red-900 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </HubCard>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-border-faint bg-surface/60 px-3 py-2.5">
      <dt className="text-xs text-fg-5">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-fg">{value}</dd>
    </div>
  );
}
