import { mutation, query } from "../_generated/server";
import type { MutationCtx } from "../_generated/server";
import { v } from "convex/values";
import {
  CLERK_EMAIL_CLAIM_SETUP_HINT,
  emailFromClerkIdentity,
} from "../lib/clerk_identity";
import { EventAccessDeniedError, requireHubUser } from "../lib/hub_auth";
import { getEventEligibilityForEmail } from "../lib/hub_event_eligibility";
import { toHubUserPublic } from "../lib/hub_projections";
import { claimPerksForUser } from "../lib/hub_perk_assign";

/** Public hub user shape — extra DB/system fields are stripped on return. */
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

async function getHubUserByClerkId(ctx: MutationCtx, clerkId: string) {
  const users = await ctx.db
    .query("hub_users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .collect();

  if (users.length === 0) return null;

  users.sort((a, b) => a.createdAt - b.createdAt);
  const [primary, ...duplicates] = users;
  for (const duplicate of duplicates) {
    await ctx.db.delete(duplicate._id);
  }
  return primary;
}

export const ensureUser = mutation({
  args: {},
  returns: hubUserValidator,
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const email = emailFromClerkIdentity(identity);
    if (!email) {
      throw new Error(`Email is required. ${CLERK_EMAIL_CLAIM_SETUP_HINT}`);
    }

    const now = Date.now();
    const existing = await getHubUserByClerkId(ctx, identity.subject);

    const roleAssignment = await ctx.db
      .query("hub_role_assignments")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    const role = roleAssignment?.role ?? existing?.role;

    if (!role) {
      const access = await getEventEligibilityForEmail(ctx, email);
      if (!access.eligible) {
        throw new EventAccessDeniedError();
      }
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: identity.name ?? existing.name,
        email,
        avatarUrl: identity.pictureUrl ?? existing.avatarUrl,
        role,
        updatedAt: now,
      });
      await claimPerksForUser(ctx, existing._id);
      const updated = await ctx.db.get(existing._id);
      if (!updated) throw new Error("User update failed");
      return toHubUserPublic(updated);
    }

    await ctx.db.insert("hub_users", {
      clerkId: identity.subject,
      name: identity.name ?? email.split("@")[0] ?? "Builder",
      email,
      avatarUrl: identity.pictureUrl,
      role,
      createdAt: now,
    });

    const created = await getHubUserByClerkId(ctx, identity.subject);
    if (!created) throw new Error("User creation failed");
    await claimPerksForUser(ctx, created._id);
    return toHubUserPublic(created);
  },
});

export const getMe = query({
  args: {},
  returns: v.union(hubUserValidator, v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("hub_users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    return user ? toHubUserPublic(user) : null;
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
