import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { ensureHubUser, requireHubUser, requireTeamMembership } from "../lib/hubAuth";
import { hubSponsorIdValidator } from "../lib/hubSponsorIds";

const pendingItemValidator = v.object({
  sponsorId: hubSponsorIdValidator,
  sponsorName: v.string(),
  submitted: v.boolean(),
  feedback: v.optional(v.string()),
});

export const getMyPendingFeedback = query({
  args: {},
  returns: v.object({
    pending: v.array(pendingItemValidator),
    allComplete: v.boolean(),
  }),
  handler: async (ctx) => {
    const user = await requireHubUser(ctx).catch(() => null);
    if (!user) {
      return { pending: [], allComplete: true };
    }
    const membership = await ctx.db
      .query("hub_team_members")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!membership) {
      return { pending: [], allComplete: true };
    }

    const project = await ctx.db
      .query("hub_projects")
      .withIndex("by_team", (q) => q.eq("teamId", membership.teamId))
      .unique();

    if (!project || project.sponsorsUsed.length === 0) {
      return { pending: [], allComplete: true };
    }

    const pending = await Promise.all(
      project.sponsorsUsed.map(async (sponsorId) => {
        const entry = await ctx.db
          .query("hub_sponsor_feedback")
          .withIndex("by_user_team_sponsor", (q) =>
            q
              .eq("userId", user._id)
              .eq("teamId", membership.teamId)
              .eq("sponsorId", sponsorId),
          )
          .unique();

        return {
          sponsorId,
          sponsorName: sponsorId,
          submitted: Boolean(entry?.feedback.trim()),
          feedback: entry?.feedback,
        };
      }),
    );

    return {
      pending,
      allComplete: pending.every((item) => item.submitted),
    };
  },
});

export const submitFeedback = mutation({
  args: {
    sponsorId: hubSponsorIdValidator,
    feedback: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ensureHubUser(ctx);
    const { team } = await requireTeamMembership(ctx, user._id);

    const project = await ctx.db
      .query("hub_projects")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();
    if (!project) {
      throw new Error("Create your project first");
    }
    if (!project.sponsorsUsed.includes(args.sponsorId)) {
      throw new Error("This sponsor is not used by your project");
    }

    const feedback = args.feedback.trim();
    if (feedback.length < 10) {
      throw new Error("Feedback must be at least 10 characters");
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("hub_sponsor_feedback")
      .withIndex("by_user_team_sponsor", (q) =>
        q
          .eq("userId", user._id)
          .eq("teamId", team._id)
          .eq("sponsorId", args.sponsorId),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { feedback, updatedAt: now });
      return null;
    }

    await ctx.db.insert("hub_sponsor_feedback", {
      userId: user._id,
      teamId: team._id,
      sponsorId: args.sponsorId,
      feedback,
      createdAt: now,
    });
    return null;
  },
});

export const getTeamFeedbackStatus = query({
  args: {},
  returns: v.union(
    v.object({
      sponsorsUsed: v.array(hubSponsorIdValidator),
      members: v.array(
        v.object({
          userId: v.id("hub_users"),
          name: v.string(),
          completed: v.boolean(),
          missingSponsors: v.array(hubSponsorIdValidator),
        }),
      ),
      allComplete: v.boolean(),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const user = await requireHubUser(ctx).catch(() => null);
    if (!user) return null;

    let team;
    try {
      ({ team } = await requireTeamMembership(ctx, user._id));
    } catch {
      return null;
    }

    const project = await ctx.db
      .query("hub_projects")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();
    if (!project) return null;

    const memberships = await ctx.db
      .query("hub_team_members")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .collect();

    const members = await Promise.all(
      memberships.map(async (membership) => {
        const memberUser = await ctx.db.get(membership.userId);
        const missingSponsors: (typeof project.sponsorsUsed)[number][] = [];

        for (const sponsorId of project.sponsorsUsed) {
          const entry = await ctx.db
            .query("hub_sponsor_feedback")
            .withIndex("by_user_team_sponsor", (q) =>
              q
                .eq("userId", membership.userId)
                .eq("teamId", team._id)
                .eq("sponsorId", sponsorId),
            )
            .unique();
          if (!entry?.feedback.trim()) {
            missingSponsors.push(sponsorId);
          }
        }

        return {
          userId: membership.userId,
          name: memberUser?.name ?? "Unknown",
          completed: missingSponsors.length === 0,
          missingSponsors,
        };
      }),
    );

    return {
      sponsorsUsed: project.sponsorsUsed,
      members,
      allComplete: members.every((member) => member.completed),
    };
  },
});
