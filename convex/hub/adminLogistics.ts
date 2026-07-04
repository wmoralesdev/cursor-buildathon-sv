import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { HUB_CHECKPOINTS } from "../lib/hub_checkpoints";
import { hubCheckpointSnapshotValidator } from "../lib/hub_checkpoint_snapshot";
import { requireHubRole } from "../lib/hub_auth";
import { hubRoleValidator } from "../lib/hubRoles";

const checkpointFeedWindowValidator = v.object({
  checkpointId: v.string(),
  label: v.string(),
  submitted: v.boolean(),
  submittedAt: v.optional(v.number()),
  note: v.optional(v.string()),
  snapshot: v.optional(hubCheckpointSnapshotValidator),
});

const checkpointFeedTeamValidator = v.object({
  teamId: v.id("hub_teams"),
  name: v.string(),
  windows: v.array(checkpointFeedWindowValidator),
});

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
    const rows = await ctx.db.query("hub_role_assignments").collect();
    return rows.map((row) => ({
      _id: row._id,
      email: row.email,
      role: row.role,
    }));
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

export const listCheckpointFeed = query({
  args: {},
  returns: v.array(checkpointFeedTeamValidator),
  handler: async (ctx) => {
    await requireHubRole(ctx, "logistics");
    const teams = await ctx.db.query("hub_teams").collect();

    return await Promise.all(
      teams.map(async (team) => {
        const checkpointRows = await ctx.db
          .query("hub_checkpoints")
          .withIndex("by_team", (q) => q.eq("teamId", team._id))
          .collect();

        return {
          teamId: team._id,
          name: team.name,
          windows: HUB_CHECKPOINTS.map((checkpoint) => {
            const row = checkpointRows.find((entry) => entry.checkpointId === checkpoint.id);
            return {
              checkpointId: checkpoint.id,
              label: checkpoint.label,
              submitted: Boolean(row),
              submittedAt: row?.submittedAt,
              note: row?.note,
              snapshot: row?.snapshot,
            };
          }),
        };
      }),
    );
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
