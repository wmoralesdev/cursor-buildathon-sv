import { v } from "convex/values";
import { action, internalQuery, mutation, query } from "../_generated/server";
import { internal } from "../_generated/api";
import { ensureHubUser, requireHubUser, requireTeamMembership } from "../lib/hubAuth";
import {
  canonicalTeamRepoUrl,
  prepareTeamRepoLink,
  scheduleTeamRepoSync,
} from "./linkTeamRepo";

const SYNC_COOLDOWN_MS = 60_000;

const snapshotValidator = v.object({
  syncedAt: v.number(),
  repoCreatedAt: v.string(),
  firstCommitAt: v.union(v.string(), v.null()),
  lastPushAt: v.union(v.string(), v.null()),
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
});

export const getRepoDashboard = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      repoUrl: v.union(v.string(), v.null()),
      repoLinkedAt: v.union(v.number(), v.null()),
      repoOwner: v.union(v.string(), v.null()),
      repoName: v.union(v.string(), v.null()),
      repoUrlChangeCount: v.number(),
      repoUrlHistory: v.array(
        v.object({
          url: v.string(),
          owner: v.string(),
          repo: v.string(),
          changedAt: v.number(),
        }),
      ),
      syncCooldownMs: v.number(),
      complianceStatus: v.union(
        v.literal("ok"),
        v.literal("review"),
        v.literal("violation"),
        v.literal("unknown"),
      ),
      complianceFlags: v.array(v.string()),
      snapshot: v.union(snapshotValidator, v.null()),
      syncJob: v.union(
        v.object({
          lastSyncAt: v.number(),
          lastSyncStatus: v.union(v.literal("ok"), v.literal("error")),
          lastError: v.union(v.string(), v.null()),
        }),
        v.null(),
      ),
      isCaptain: v.boolean(),
    }),
  ),
  handler: async (ctx) => {
    const user = await requireHubUser(ctx).catch(() => null);
    if (!user) return null;

    const membership = await requireTeamMembership(ctx, user._id).catch(() => null);
    if (!membership) return null;

    const { team } = membership;

    const project = await ctx.db
      .query("hub_projects")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();

    const snapshot = await ctx.db
      .query("hub_repo_sync_snapshots")
      .withIndex("by_hub_team", (q) => q.eq("hubTeamId", team._id))
      .order("desc")
      .first();

    const syncJob = await ctx.db
      .query("hub_repo_sync_jobs")
      .withIndex("by_hub_team", (q) => q.eq("hubTeamId", team._id))
      .first();

    return {
      repoUrl: project?.repoUrl ?? canonicalTeamRepoUrl(team),
      repoLinkedAt: team.repoLinkedAt ?? null,
      repoOwner: team.repoOwner ?? null,
      repoName: team.repoName ?? null,
      repoUrlChangeCount: team.repoUrlChangeCount ?? 0,
      repoUrlHistory: team.repoUrlHistory ?? [],
      syncCooldownMs: SYNC_COOLDOWN_MS,
      complianceStatus: team.repoComplianceStatus ?? "unknown",
      complianceFlags: team.repoComplianceFlags ?? [],
      snapshot: snapshot
        ? {
            syncedAt: snapshot.syncedAt,
            repoCreatedAt: snapshot.repoCreatedAt,
            firstCommitAt: snapshot.firstCommitAt ?? null,
            lastPushAt: snapshot.lastPushAt ?? null,
            commitCountInEventWindow: snapshot.commitCountInEventWindow,
            commitCountBeforeEvent: snapshot.commitCountBeforeEvent,
            contributors: snapshot.contributors,
            recentCommits: snapshot.recentCommits,
            checkpointSummaries: snapshot.checkpointSummaries,
            flags: snapshot.flags,
          }
        : null,
      syncJob: syncJob
        ? {
            lastSyncAt: syncJob.lastSyncAt,
            lastSyncStatus: syncJob.lastSyncStatus,
            lastError: syncJob.lastError ?? null,
          }
        : null,
      isCaptain: team.captainId === user._id,
    };
  },
});

export const linkTeamRepository = mutation({
  args: { repoUrl: v.string() },
  returns: v.object({ repoUrl: v.string() }),
  handler: async (ctx, args) => {
    const user = await ensureHubUser(ctx);
    const { team } = await requireTeamMembership(ctx, user._id);

    const project = await ctx.db
      .query("hub_projects")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();

    const deliverables = await ctx.db
      .query("hub_deliverables")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();

    const link = await prepareTeamRepoLink(ctx, {
      team,
      captainId: team.captainId,
      actorId: user._id,
      repoUrlInput: args.repoUrl,
      currentProjectRepoUrl: project?.repoUrl,
      blockChangesAfterFinalSubmit: Boolean(deliverables?.submittedAt),
    });

    if (project && project.repoUrl !== link.canonicalUrl) {
      await ctx.db.patch(project._id, {
        repoUrl: link.canonicalUrl,
        updatedAt: Date.now(),
      });
    }

    if (link.shouldSync) {
      await scheduleTeamRepoSync(ctx, team._id, link.isBaseline);
    }

    return { repoUrl: link.canonicalUrl };
  },
});

export const requestSync = action({
  args: {},
  returns: v.object({ ok: v.literal(true) }),
  handler: async (ctx) => {
    const access = await ctx.runQuery(internal.hub.repoTracking.getSyncAccess, {});
    if (!access) {
      throw new Error("Team not found or access denied");
    }
    if (!access.repoOwner || !access.repoName) {
      throw new Error("Link a repository first");
    }

    const job = await ctx.runQuery(internal.hub.repoTracking.getSyncJob, {
      hubTeamId: access.hubTeamId,
    });
    if (job && Date.now() - job.lastSyncAt < SYNC_COOLDOWN_MS) {
      throw new Error("Please wait a minute before refreshing again");
    }

    await ctx.runAction(internal.hub.repoSync.syncTeamRepo, {
      hubTeamId: access.hubTeamId,
      isBaseline: false,
    });

    return { ok: true as const };
  },
});

export const getSyncAccess = internalQuery({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      hubTeamId: v.id("hub_teams"),
      repoOwner: v.union(v.string(), v.null()),
      repoName: v.union(v.string(), v.null()),
    }),
  ),
  handler: async (ctx) => {
    const user = await requireHubUser(ctx).catch(() => null);
    if (!user) return null;

    const membership = await requireTeamMembership(ctx, user._id).catch(() => null);
    if (!membership) return null;

    const { team } = membership;
    return {
      hubTeamId: team._id,
      repoOwner: team.repoOwner ?? null,
      repoName: team.repoName ?? null,
    };
  },
});

export const getSyncJob = internalQuery({
  args: { hubTeamId: v.id("hub_teams") },
  returns: v.union(
    v.null(),
    v.object({
      lastSyncAt: v.number(),
      lastSyncStatus: v.union(v.literal("ok"), v.literal("error")),
      lastError: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("hub_repo_sync_jobs")
      .withIndex("by_hub_team", (q) => q.eq("hubTeamId", args.hubTeamId))
      .first();
  },
});
