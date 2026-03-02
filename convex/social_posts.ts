import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const platformValidator = v.union(v.literal("x"), v.literal("linkedin"));

export const add = mutation({
  args: {
    teamId: v.id("teams"),
    platform: platformValidator,
    url: v.string(),
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
      throw new Error("Access denied");
    }

    const trimmedUrl = args.url.trim();
    if (!trimmedUrl) {
      throw new Error("URL is required");
    }

    return await ctx.db.insert("social_posts", {
      teamId: args.teamId,
      platform: args.platform,
      url: trimmedUrl,
      createdAt: Date.now(),
    });
  },
});

export const listByTeam = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) {
      return [];
    }

    const team = await ctx.db.get(args.teamId);
    if (!team || team.createdBy !== user._id) {
      return [];
    }

    return await ctx.db
      .query("social_posts")
      .withIndex("by_team", (q) => q.eq("teamId", args.teamId))
      .collect();
  },
});

export const remove = mutation({
  args: { id: v.id("social_posts") },
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

    const post = await ctx.db.get(args.id);
    if (!post) {
      throw new Error("Post not found");
    }

    const team = await ctx.db.get(post.teamId);
    if (!team || team.createdBy !== user._id) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(args.id);
  },
});
