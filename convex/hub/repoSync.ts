import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery } from "../_generated/server";
import { internal } from "../_generated/api";
import {
  fetchCommitDetail,
  fetchCommitsInRange,
  fetchContributors,
  fetchRepo,
  toRecentCommits,
} from "../github/client";
import { evaluateCompliance } from "../github/compliance";
import { EVENT_START_MS } from "../lib/eventDates";
import { summarizeCommitsByCheckpoint } from "../lib/hubCheckpointWindows";

const LARGE_INITIAL_ADDITIONS = 5000;

export const syncTeamRepo = internalAction({
  args: {
    hubTeamId: v.id("hub_teams"),
    isBaseline: v.optional(v.boolean()),
  },
  returns: v.union(
    v.null(),
    v.object({
      ok: v.literal(true),
      status: v.union(
        v.literal("ok"),
        v.literal("review"),
        v.literal("violation"),
        v.literal("unknown"),
      ),
      flags: v.array(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    const team = await ctx.runQuery(internal.hub.repoSync.getTeamForSync, {
      hubTeamId: args.hubTeamId,
    });
    if (!team?.repoOwner || !team.repoName) {
      return null;
    }

    try {
      const owner = team.repoOwner;
      const repo = team.repoName;
      const ghRepo = await fetchRepo(owner, repo);
      const eventStartIso = new Date(EVENT_START_MS).toISOString();

      const commitsBeforeEvent = await fetchCommitsInRange(owner, repo, ghRepo.default_branch, {
        until: eventStartIso,
        maxPages: 5,
      });
      const commitsInWindow = await fetchCommitsInRange(owner, repo, ghRepo.default_branch, {
        since: eventStartIso,
        maxPages: 5,
      });
      const contributors = await fetchContributors(owner, repo);

      const firstCommitAt =
        commitsInWindow.length > 0
          ? commitsInWindow[commitsInWindow.length - 1]!.commit.author.date
          : commitsBeforeEvent.length > 0
            ? commitsBeforeEvent[commitsBeforeEvent.length - 1]!.commit.author.date
            : null;

      let largeInitialCommit = false;
      if (commitsInWindow.length > 0) {
        const earliestInWindow = commitsInWindow[commitsInWindow.length - 1]!;
        try {
          const detail = await fetchCommitDetail(owner, repo, earliestInWindow.sha);
          if ((detail.stats?.additions ?? 0) >= LARGE_INITIAL_ADDITIONS) {
            largeInitialCommit = true;
          }
        } catch {
          /* stats unavailable — skip heuristic */
        }
      }

      const { flags, status } = evaluateCompliance({
        repoCreatedAt: ghRepo.created_at,
        firstCommitAt,
        commitCountBeforeEvent: commitsBeforeEvent.length,
        commitCountInEventWindow: commitsInWindow.length,
        isFork: ghRepo.fork,
        largeInitialCommit,
        baselineFirstCommitAt: team.repoBaselineFirstCommitAt ?? null,
        baselineCommitCountBeforeEvent: team.repoBaselineCommitCountBeforeEvent ?? null,
      });

      const recentCommits = toRecentCommits(commitsInWindow, 10);
      const checkpointSummaries = summarizeCommitsByCheckpoint(commitsInWindow);
      const syncedAt = Date.now();
      const isBaseline = args.isBaseline ?? !team.repoBaselineFirstCommitAt;

      await ctx.runMutation(internal.hub.repoSync.persistSnapshot, {
        hubTeamId: args.hubTeamId,
        syncedAt,
        repoCreatedAt: ghRepo.created_at,
        firstCommitAt: firstCommitAt ?? undefined,
        lastPushAt: ghRepo.pushed_at ?? undefined,
        commitCountInEventWindow: commitsInWindow.length,
        commitCountBeforeEvent: commitsBeforeEvent.length,
        contributors,
        recentCommits,
        checkpointSummaries,
        flags,
        complianceStatus: status,
        isBaseline,
        baselineFirstCommitAt: isBaseline ? firstCommitAt ?? undefined : undefined,
        baselineCommitCountBeforeEvent: isBaseline ? commitsBeforeEvent.length : undefined,
      });

      await ctx.runMutation(internal.hub.repoSync.upsertSyncJob, {
        hubTeamId: args.hubTeamId,
        lastSyncAt: syncedAt,
        lastSyncStatus: "ok" as const,
      });

      return { ok: true as const, status, flags };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sync failed";
      await ctx.runMutation(internal.hub.repoSync.upsertSyncJob, {
        hubTeamId: args.hubTeamId,
        lastSyncAt: Date.now(),
        lastSyncStatus: "error" as const,
        lastError: message,
      });
      throw error;
    }
  },
});

export const getTeamForSync = internalQuery({
  args: { hubTeamId: v.id("hub_teams") },
  returns: v.union(
    v.null(),
    v.object({
      repoOwner: v.union(v.string(), v.null()),
      repoName: v.union(v.string(), v.null()),
      repoBaselineFirstCommitAt: v.union(v.string(), v.null()),
      repoBaselineCommitCountBeforeEvent: v.union(v.number(), v.null()),
    }),
  ),
  handler: async (ctx, args) => {
    const team = await ctx.db.get(args.hubTeamId);
    if (!team) return null;
    return {
      repoOwner: team.repoOwner ?? null,
      repoName: team.repoName ?? null,
      repoBaselineFirstCommitAt: team.repoBaselineFirstCommitAt ?? null,
      repoBaselineCommitCountBeforeEvent: team.repoBaselineCommitCountBeforeEvent ?? null,
    };
  },
});

export const persistSnapshot = internalMutation({
  args: {
    hubTeamId: v.id("hub_teams"),
    syncedAt: v.number(),
    repoCreatedAt: v.string(),
    firstCommitAt: v.optional(v.string()),
    lastPushAt: v.optional(v.string()),
    commitCountInEventWindow: v.number(),
    commitCountBeforeEvent: v.number(),
    contributors: v.array(v.string()),
    recentCommits: v.array(
      v.object({
        sha: v.string(),
        message: v.string(),
        author: v.string(),
        date: v.string(),
      }),
    ),
    checkpointSummaries: v.array(
      v.object({
        checkpointId: v.string(),
        commitCount: v.number(),
        commits: v.array(
          v.object({
            sha: v.string(),
            message: v.string(),
            author: v.string(),
            date: v.string(),
          }),
        ),
        contributors: v.array(v.string()),
      }),
    ),
    flags: v.array(v.string()),
    complianceStatus: v.union(
      v.literal("ok"),
      v.literal("review"),
      v.literal("violation"),
      v.literal("unknown"),
    ),
    isBaseline: v.boolean(),
    baselineFirstCommitAt: v.optional(v.string()),
    baselineCommitCountBeforeEvent: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("hub_repo_sync_snapshots", {
      hubTeamId: args.hubTeamId,
      syncedAt: args.syncedAt,
      repoCreatedAt: args.repoCreatedAt,
      firstCommitAt: args.firstCommitAt,
      lastPushAt: args.lastPushAt,
      commitCountInEventWindow: args.commitCountInEventWindow,
      commitCountBeforeEvent: args.commitCountBeforeEvent,
      contributors: args.contributors,
      recentCommits: args.recentCommits,
      checkpointSummaries: args.checkpointSummaries,
      flags: args.flags,
      isBaseline: args.isBaseline ? true : undefined,
    });

    const patch: Record<string, unknown> = {
      repoComplianceStatus: args.complianceStatus,
      repoComplianceFlags: args.flags,
    };

    if (args.isBaseline) {
      if (args.baselineFirstCommitAt) {
        patch.repoBaselineFirstCommitAt = args.baselineFirstCommitAt;
      }
      if (args.baselineCommitCountBeforeEvent != null) {
        patch.repoBaselineCommitCountBeforeEvent = args.baselineCommitCountBeforeEvent;
      }
    }

    await ctx.db.patch(args.hubTeamId, patch);
    return null;
  },
});

export const upsertSyncJob = internalMutation({
  args: {
    hubTeamId: v.id("hub_teams"),
    lastSyncAt: v.number(),
    lastSyncStatus: v.union(v.literal("ok"), v.literal("error")),
    lastError: v.optional(v.string()),
  },
  returns: v.id("hub_repo_sync_jobs"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("hub_repo_sync_jobs")
      .withIndex("by_hub_team", (q) => q.eq("hubTeamId", args.hubTeamId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        lastSyncAt: args.lastSyncAt,
        lastSyncStatus: args.lastSyncStatus,
        lastError: args.lastSyncStatus === "ok" ? undefined : args.lastError,
      });
      return existing._id;
    }

    return await ctx.db.insert("hub_repo_sync_jobs", {
      hubTeamId: args.hubTeamId,
      lastSyncAt: args.lastSyncAt,
      lastSyncStatus: args.lastSyncStatus,
      lastError: args.lastError,
    });
  },
});

export const listTeamsWithRepos = internalQuery({
  args: {},
  returns: v.array(v.id("hub_teams")),
  handler: async (ctx) => {
    const teams = await ctx.db.query("hub_teams").collect();
    return teams
      .filter((team) => team.repoOwner && team.repoName)
      .map((team) => team._id);
  },
});
