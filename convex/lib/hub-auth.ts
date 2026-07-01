import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";
import type { HubRole } from "./hubRoles";

export type HubUser = Doc<"hub_users">;

export async function getHubUserByClerkId(
  ctx: QueryCtx | MutationCtx,
  clerkId: string,
): Promise<HubUser | null> {
  return await ctx.db
    .query("hub_users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
}

export async function requireHubUser(ctx: QueryCtx | MutationCtx): Promise<HubUser> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const user = await getHubUserByClerkId(ctx, identity.subject);
  if (!user) {
    throw new Error("Hub user not found — sign in again");
  }

  return user;
}

export async function requireHubRole(
  ctx: QueryCtx | MutationCtx,
  allowed: HubRole | HubRole[],
): Promise<HubUser> {
  const user = await requireHubUser(ctx);
  const roles = Array.isArray(allowed) ? allowed : [allowed];

  if (user.role === "logistics" || (user.role && roles.includes(user.role))) {
    return user;
  }

  throw new Error("Insufficient permissions");
}

export async function requireTeamMembership(
  ctx: QueryCtx | MutationCtx,
  userId: HubUser["_id"],
): Promise<{ team: Doc<"hub_teams">; membership: Doc<"hub_team_members"> }> {
  const membership = await ctx.db
    .query("hub_team_members")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();

  if (!membership) {
    throw new Error("You are not on a team");
  }

  const team = await ctx.db.get(membership.teamId);
  if (!team) {
    throw new Error("Team not found");
  }

  return { team, membership };
}

export function generateInviteCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}
