import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const trackValidator = v.union(v.literal("ai_consumer"), v.literal("fintech_web3"));

export const upsert = mutation({
  args: {
    teamId: v.id("teams"),
    name: v.string(),
    track: trackValidator,
    description: v.string(),
    repoLink: v.optional(v.string()),
    demoLink: v.optional(v.string()),
    pitchSummary: v.string(),
    techStack: v.string(),
    teamRoles: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) {
      throw new Error("User not found");
    }

    const team = await ctx.db.get(args.teamId);
    if (!team || team.createdBy !== user._id) {
      throw new Error("Team not found or access denied");
    }

    const existing = await ctx.db
      .query("projects")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .unique();

    const now = Date.now();
    const doc = {
      teamId: args.teamId,
      name: args.name.trim(),
      track: args.track,
      description: args.description.trim(),
      repoLink: args.repoLink?.trim() || undefined,
      demoLink: args.demoLink?.trim() || undefined,
      pitchSummary: args.pitchSummary.trim(),
      techStack: args.techStack.trim(),
      teamRoles: args.teamRoles.trim(),
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, doc);
      return existing._id;
    }

    return await ctx.db.insert("projects", {
      ...doc,
      createdAt: now,
    });
  },
});

export const getByCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) {
      return null;
    }

    const team = await ctx.db
      .query("teams")
      .withIndex("by_creator", (q) => q.eq("createdBy", user._id))
      .unique();
    if (!team) {
      return null;
    }

    return await ctx.db
      .query("projects")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();
  },
});
