import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { requireHubUser } from "../lib/hub-auth";

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

export const ensureUser = mutation({
  args: {},
  returns: hubUserValidator,
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const email = (identity.email ?? "").trim().toLowerCase();
    if (!email) {
      throw new Error("Email is required");
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("hub_users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    const roleAssignment = await ctx.db
      .query("hub_role_assignments")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    const role = roleAssignment?.role ?? existing?.role;

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: identity.name ?? existing.name,
        email,
        avatarUrl: identity.pictureUrl ?? existing.avatarUrl,
        role,
        updatedAt: now,
      });
      const updated = await ctx.db.get(existing._id);
      if (!updated) throw new Error("User update failed");
      return updated;
    }

    const userId = await ctx.db.insert("hub_users", {
      clerkId: identity.subject,
      name: identity.name ?? email.split("@")[0] ?? "Builder",
      email,
      avatarUrl: identity.pictureUrl,
      role,
      createdAt: now,
    });

    const created = await ctx.db.get(userId);
    if (!created) throw new Error("User creation failed");
    return created;
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
      .unique();
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
