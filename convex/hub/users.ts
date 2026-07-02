import { mutation, query } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";
import { v } from "convex/values";
import { requireHubUser, syncHubUser } from "../lib/hubAuth";
import { hubProfileArgsValidator, hubProfileFromArgs } from "../lib/hubProfile";

const hubUserValidator = v.object({
  _id: v.id("hub_users"),
  clerkId: v.string(),
  name: v.string(),
  email: v.string(),
  avatarUrl: v.optional(v.string()),
  role: v.optional(
    v.union(v.literal("logistics"), v.literal("mentor"), v.literal("jury")),
  ),
  createdAt: v.number(),
});

function toHubUserPublic(user: {
  _id: Doc<"hub_users">["_id"];
  clerkId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: "logistics" | "mentor" | "jury";
  createdAt: number;
}) {
  return {
    _id: user._id,
    clerkId: user.clerkId,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export const ensureUser = mutation({
  args: hubProfileArgsValidator,
  returns: hubUserValidator,
  handler: async (ctx, args) => {
    const user = await syncHubUser(ctx, hubProfileFromArgs(args));
    return toHubUserPublic(user);
  },
});

export const getMe = query({
  args: {},
  returns: v.union(hubUserValidator, v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("hub_users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()
      .then((user) => (user ? toHubUserPublic(user) : null));
  },
});

export const getMyRole = query({
  args: {},
  returns: v.union(
    v.object({
      role: v.union(
        v.literal("logistics"),
        v.literal("mentor"),
        v.literal("jury"),
      ),
      name: v.string(),
      email: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const user = await requireHubUser(ctx).catch(() => null);
    if (!user?.role) return null;
    return { role: user.role, name: user.name, email: user.email };
  },
});
