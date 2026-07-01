import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { requireHubRole } from "../lib/hub-auth";
import { hubRoleValidator } from "../lib/hubRoles";

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
