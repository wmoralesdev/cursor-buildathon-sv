import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsert = mutation({
  args: {
    name: v.string(),
    members: v.array(
      v.object({
        name: v.string(),
        email: v.optional(v.string()),
      })
    ),
    leaderIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (args.members.length < 2 || args.members.length > 4) {
      throw new Error("Team must have 2–4 members");
    }
    if (args.leaderIndex < 0 || args.leaderIndex >= args.members.length) {
      throw new Error("Invalid leader index");
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

    const existing = await ctx.db
      .query("teams")
      .withIndex("by_creator", (q) => q.eq("createdBy", user._id))
      .unique();

    const now = Date.now();
    const doc = {
      name: args.name.trim(),
      members: args.members.map((m) => ({
        name: m.name.trim(),
        email: m.email?.trim() || undefined,
      })),
      leaderIndex: args.leaderIndex,
      createdBy: user._id,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, doc);
      return existing._id;
    }

    return await ctx.db.insert("teams", {
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

    return await ctx.db
      .query("teams")
      .withIndex("by_creator", (q) => q.eq("createdBy", user._id))
      .unique();
  },
});
