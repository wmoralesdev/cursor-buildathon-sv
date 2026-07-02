import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { requireHubRole, requireHubUser } from "../lib/hubAuth";

export const getMyMentorProfile = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("hub_mentors"),
      name: v.string(),
      role: v.string(),
      company: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
      bio: v.optional(v.string()),
      remote: v.boolean(),
      bookingUrl: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const user = await requireHubUser(ctx);
    if (user.role !== "mentor" && user.role !== "logistics") return null;

    const mentors = await ctx.db.query("hub_mentors").collect();
    const profile = mentors.find(
      (mentor) => mentor.email?.toLowerCase() === user.email.toLowerCase(),
    );
    if (!profile) return null;

    return {
      _id: profile._id,
      name: profile.name,
      role: profile.role,
      company: profile.company,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      remote: profile.remote,
      bookingUrl: profile.bookingUrl,
    };
  },
});

export const updateMyMentorProfile = mutation({
  args: {
    bio: v.optional(v.string()),
    bookingUrl: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await requireHubRole(ctx, ["logistics", "mentor"]);
    const mentors = await ctx.db.query("hub_mentors").collect();
    const profile = mentors.find(
      (mentor) => mentor.email?.toLowerCase() === user.email.toLowerCase(),
    );
    if (!profile) throw new Error("Mentor profile not found for your email");

    await ctx.db.patch(profile._id, {
      bio: args.bio?.trim() || profile.bio,
      bookingUrl: args.bookingUrl?.trim() || profile.bookingUrl,
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const listTeamsReadOnly = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("hub_teams"),
      name: v.string(),
      memberCount: v.number(),
      track: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    await requireHubRole(ctx, ["logistics", "mentor"]);
    const teams = await ctx.db.query("hub_teams").collect();

    return await Promise.all(
      teams.map(async (team) => {
        const members = await ctx.db
          .query("hub_team_members")
          .withIndex("by_team", (q) => q.eq("teamId", team._id))
          .collect();
        return {
          _id: team._id,
          name: team.name,
          memberCount: members.length,
          track: team.track,
        };
      }),
    );
  },
});
