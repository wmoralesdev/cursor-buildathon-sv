import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { generateInviteCode, requireHubUser, requireTeamMembership } from "../lib/hub-auth";
import { competitionTrackValidator } from "../lib/competitionTracks";

const memberValidator = v.object({
  userId: v.id("hub_users"),
  name: v.string(),
  email: v.string(),
  avatarUrl: v.optional(v.string()),
  isCaptain: v.boolean(),
  joinedAt: v.number(),
});

const teamValidator = v.object({
  _id: v.id("hub_teams"),
  name: v.string(),
  inviteCode: v.string(),
  track: v.optional(competitionTrackValidator),
  captainId: v.id("hub_users"),
  members: v.array(memberValidator),
  createdAt: v.number(),
});

async function buildTeamWithMembers(
  ctx: QueryCtx | MutationCtx,
  teamId: Id<"hub_teams">,
) {
  const team = await ctx.db.get(teamId);
  if (!team) return null;

  const memberships = await ctx.db
    .query("hub_team_members")
    .withIndex("by_team", (q) => q.eq("teamId", team._id))
    .collect();

  const members = await Promise.all(
    memberships.map(async (membership) => {
      const user = await ctx.db.get(membership.userId);
      return {
        userId: membership.userId,
        name: user?.name ?? "Unknown",
        email: user?.email ?? "",
        avatarUrl: user?.avatarUrl,
        isCaptain: team.captainId === membership.userId,
        joinedAt: membership.joinedAt,
      };
    }),
  );

  return { ...team, members };
}

export const createTeam = mutation({
  args: {
    name: v.string(),
    track: v.optional(competitionTrackValidator),
  },
  returns: teamValidator,
  handler: async (ctx, args) => {
    const user = await requireHubUser(ctx);
    const existingMembership = await ctx.db
      .query("hub_team_members")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (existingMembership) {
      throw new Error("You are already on a team");
    }

    const name = args.name.trim();
    if (name.length < 2 || name.length > 60) {
      throw new Error("Team name must be 2–60 characters");
    }

    const now = Date.now();
    let inviteCode = generateInviteCode();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const collision = await ctx.db
        .query("hub_teams")
        .withIndex("by_invite_code", (q) => q.eq("inviteCode", inviteCode))
        .unique();
      if (!collision) break;
      inviteCode = generateInviteCode();
    }

    const teamId = await ctx.db.insert("hub_teams", {
      name,
      inviteCode,
      track: args.track,
      captainId: user._id,
      createdAt: now,
    });

    await ctx.db.insert("hub_team_members", {
      teamId,
      userId: user._id,
      joinedAt: now,
    });

    const team = await buildTeamWithMembers(ctx, teamId);
    if (!team) throw new Error("Team creation failed");
    return team;
  },
});

export const joinByCode = mutation({
  args: { inviteCode: v.string() },
  returns: teamValidator,
  handler: async (ctx, args) => {
    const user = await requireHubUser(ctx);
    const existingMembership = await ctx.db
      .query("hub_team_members")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (existingMembership) {
      throw new Error("You are already on a team");
    }

    const inviteCode = args.inviteCode.trim().toUpperCase();
    const team = await ctx.db
      .query("hub_teams")
      .withIndex("by_invite_code", (q) => q.eq("inviteCode", inviteCode))
      .unique();
    if (!team) {
      throw new Error("Invalid invite code");
    }

    const members = await ctx.db
      .query("hub_team_members")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .collect();
    if (members.length >= 5) {
      throw new Error("Team is full (max 5 members)");
    }

    await ctx.db.insert("hub_team_members", {
      teamId: team._id,
      userId: user._id,
      joinedAt: Date.now(),
    });

    const fullTeam = await buildTeamWithMembers(ctx, team._id);
    if (!fullTeam) throw new Error("Team join failed");
    return fullTeam;
  },
});

export const leaveTeam = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const user = await requireHubUser(ctx);
    const { team, membership } = await requireTeamMembership(ctx, user._id);

    if (team.captainId === user._id) {
      const members = await ctx.db
        .query("hub_team_members")
        .withIndex("by_team", (q) => q.eq("teamId", team._id))
        .collect();
      if (members.length > 1) {
        throw new Error("Transfer captain role before leaving");
      }
      await ctx.db.delete(membership._id);
      await ctx.db.delete(team._id);
      return null;
    }

    await ctx.db.delete(membership._id);
    return null;
  },
});

export const setTrack = mutation({
  args: { track: competitionTrackValidator },
  returns: teamValidator,
  handler: async (ctx, args) => {
    const user = await requireHubUser(ctx);
    const { team } = await requireTeamMembership(ctx, user._id);
    if (team.captainId !== user._id) {
      throw new Error("Only the team captain can set the track");
    }

    await ctx.db.patch(team._id, {
      track: args.track,
      updatedAt: Date.now(),
    });

    const updated = await buildTeamWithMembers(ctx, team._id);
    if (!updated) throw new Error("Track update failed");
    return updated;
  },
});

export const getMyTeam = query({
  args: {},
  returns: v.union(teamValidator, v.null()),
  handler: async (ctx) => {
    const user = await requireHubUser(ctx).catch(() => null);
    if (!user) return null;

    const membership = await ctx.db
      .query("hub_team_members")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!membership) return null;

    return await buildTeamWithMembers(ctx, membership.teamId);
  },
});

export const previewTeamByCode = query({
  args: { inviteCode: v.string() },
  returns: v.union(
    v.object({ name: v.string(), memberCount: v.number() }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const team = await ctx.db
      .query("hub_teams")
      .withIndex("by_invite_code", (q) =>
        q.eq("inviteCode", args.inviteCode.trim().toUpperCase()),
      )
      .unique();
    if (!team) return null;

    const members = await ctx.db
      .query("hub_team_members")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .collect();

    return { name: team.name, memberCount: members.length };
  },
});
