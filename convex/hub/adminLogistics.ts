import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { requireHubRole } from "../lib/hubAuth";
import { hubRoleValidator } from "../lib/hubRoles";
import { EVENT_START_MS } from "../lib/eventDates";

const snapshotSummaryValidator = v.object({
  syncedAt: v.number(),
  lastPushAt: v.union(v.string(), v.null()),
  commitCountInEventWindow: v.number(),
  commitCountBeforeEvent: v.number(),
  contributors: v.array(v.string()),
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
});

const complianceStatusValidator = v.union(
  v.literal("ok"),
  v.literal("review"),
  v.literal("violation"),
  v.literal("unknown"),
);

export const listRoleAssignments = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("hub_role_assignments"),
      email: v.string(),
      role: hubRoleValidator,
    }),
  ),
  handler: async (ctx) => {
    await requireHubRole(ctx, "logistics");
    return await ctx.db.query("hub_role_assignments").collect();
  },
});

export const upsertRoleAssignment = mutation({
  args: {
    email: v.string(),
    role: hubRoleValidator,
  },
  returns: v.id("hub_role_assignments"),
  handler: async (ctx, args) => {
    await requireHubRole(ctx, "logistics");
    const email = args.email.trim().toLowerCase();

    const existing = await ctx.db
      .query("hub_role_assignments")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { role: args.role });
      return existing._id;
    }

    return await ctx.db.insert("hub_role_assignments", {
      email,
      role: args.role,
      createdAt: Date.now(),
    });
  },
});

export const removeRoleAssignment = mutation({
  args: { assignmentId: v.id("hub_role_assignments") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireHubRole(ctx, "logistics");
    await ctx.db.delete(args.assignmentId);
    return null;
  },
});

export const listTeamsOverview = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("hub_teams"),
      name: v.string(),
      memberCount: v.number(),
      track: v.optional(v.string()),
      hasProject: v.boolean(),
      socialPostCount: v.number(),
      submitted: v.boolean(),
    }),
  ),
  handler: async (ctx) => {
    await requireHubRole(ctx, "logistics");
    const teams = await ctx.db.query("hub_teams").collect();

    return await Promise.all(
      teams.map(async (team) => {
        const members = await ctx.db
          .query("hub_team_members")
          .withIndex("by_team", (q) => q.eq("teamId", team._id))
          .collect();
        const project = await ctx.db
          .query("hub_projects")
          .withIndex("by_team", (q) => q.eq("teamId", team._id))
          .unique();
        const posts = await ctx.db
          .query("hub_social_posts")
          .withIndex("by_team", (q) => q.eq("teamId", team._id))
          .collect();
        const deliverables = await ctx.db
          .query("hub_deliverables")
          .withIndex("by_team", (q) => q.eq("teamId", team._id))
          .unique();

        return {
          _id: team._id,
          name: team.name,
          memberCount: members.length,
          track: team.track,
          hasProject: Boolean(project),
          socialPostCount: posts.length,
          submitted: Boolean(deliverables?.submittedAt),
        };
      }),
    );
  },
});

export const listTeamsRepoCompliance = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("hub_teams"),
      name: v.string(),
      repoUrl: v.union(v.string(), v.null()),
      repoLinkedAt: v.union(v.number(), v.null()),
      repoUrlChangeCount: v.number(),
      complianceStatus: complianceStatusValidator,
      complianceFlags: v.array(v.string()),
      snapshot: v.union(snapshotSummaryValidator, v.null()),
      lastSyncAt: v.union(v.number(), v.null()),
      lastSyncStatus: v.union(v.literal("ok"), v.literal("error"), v.null()),
      lastSyncError: v.union(v.string(), v.null()),
    }),
  ),
  handler: async (ctx) => {
    await requireHubRole(ctx, "logistics");
    const teams = await ctx.db.query("hub_teams").collect();
    const now = Date.now();

    return await Promise.all(
      teams.map(async (team) => {
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

        const flags = team.repoComplianceFlags ?? snapshot?.flags ?? [];
        const repoNotLinked =
          !project?.repoUrl && now > EVENT_START_MS + 2 * 60 * 60 * 1000
            ? ["repo_not_linked"]
            : [];

        return {
          _id: team._id,
          name: team.name,
          repoUrl: project?.repoUrl ?? null,
          repoLinkedAt: team.repoLinkedAt ?? null,
          repoUrlChangeCount: team.repoUrlChangeCount ?? 0,
          complianceStatus: team.repoComplianceStatus ?? "unknown",
          complianceFlags: [...flags, ...repoNotLinked],
          snapshot: snapshot
            ? {
                syncedAt: snapshot.syncedAt,
                lastPushAt: snapshot.lastPushAt ?? null,
                commitCountInEventWindow: snapshot.commitCountInEventWindow,
                commitCountBeforeEvent: snapshot.commitCountBeforeEvent,
                contributors: snapshot.contributors,
                checkpointSummaries: snapshot.checkpointSummaries,
              }
            : null,
          lastSyncAt: syncJob?.lastSyncAt ?? null,
          lastSyncStatus: syncJob?.lastSyncStatus ?? null,
          lastSyncError: syncJob?.lastError ?? null,
        };
      }),
    );
  },
});

export const getTeamRepoSnapshots = query({
  args: { hubTeamId: v.id("hub_teams") },
  returns: v.union(
    v.null(),
    v.object({
      team: v.object({
        name: v.string(),
        repoUrl: v.union(v.string(), v.null()),
        repoUrlChangeCount: v.number(),
        repoUrlHistory: v.array(
          v.object({
            url: v.string(),
            owner: v.string(),
            repo: v.string(),
            changedAt: v.number(),
          }),
        ),
        complianceStatus: complianceStatusValidator,
        complianceFlags: v.array(v.string()),
      }),
      snapshots: v.array(
        v.object({
          syncedAt: v.number(),
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
          isBaseline: v.optional(v.boolean()),
        }),
      ),
    }),
  ),
  handler: async (ctx, args) => {
    await requireHubRole(ctx, "logistics");

    const team = await ctx.db.get(args.hubTeamId);
    if (!team) return null;

    const project = await ctx.db
      .query("hub_projects")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();

    const snapshots = await ctx.db
      .query("hub_repo_sync_snapshots")
      .withIndex("by_hub_team", (q) => q.eq("hubTeamId", args.hubTeamId))
      .order("desc")
      .take(20);

    return {
      team: {
        name: team.name,
        repoUrl: project?.repoUrl ?? null,
        repoUrlChangeCount: team.repoUrlChangeCount ?? 0,
        repoUrlHistory: team.repoUrlHistory ?? [],
        complianceStatus: team.repoComplianceStatus ?? "unknown",
        complianceFlags: team.repoComplianceFlags ?? [],
      },
      snapshots: snapshots.map((snapshot) => ({
        syncedAt: snapshot.syncedAt,
        commitCountInEventWindow: snapshot.commitCountInEventWindow,
        commitCountBeforeEvent: snapshot.commitCountBeforeEvent,
        contributors: snapshot.contributors,
        recentCommits: snapshot.recentCommits,
        checkpointSummaries: snapshot.checkpointSummaries,
        flags: snapshot.flags,
        isBaseline: snapshot.isBaseline,
      })),
    };
  },
});

export const postAnnouncement = mutation({
  args: {
    message: v.string(),
    priority: v.union(v.literal("info"), v.literal("urgent")),
    locale: v.optional(v.union(v.literal("en"), v.literal("es"))),
    expiresAt: v.optional(v.number()),
  },
  returns: v.id("announcements"),
  handler: async (ctx, args) => {
    await requireHubRole(ctx, "logistics");
    const message = args.message.trim();
    if (message.length < 3) throw new Error("Message too short");

    return await ctx.db.insert("announcements", {
      message,
      priority: args.priority,
      locale: args.locale,
      createdAt: Date.now(),
      expiresAt: args.expiresAt,
    });
  },
});
