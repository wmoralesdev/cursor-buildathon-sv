import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { requireHubRole } from "../lib/hub_auth";
import { hubSponsorIdValidator } from "../lib/hubSponsorIds";
import { getPublicUrl } from "../lib/r2";
import { resolveProjectRepoUrls } from "../lib/hub_project_repo_urls";

const CRITERION_WEIGHTS = [0.25, 0.2, 0.25, 0.2, 0.1] as const;

function computeWeightedTotal(
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number,
): number {
  const weighted =
    c1 * CRITERION_WEIGHTS[0] +
    c2 * CRITERION_WEIGHTS[1] +
    c3 * CRITERION_WEIGHTS[2] +
    c4 * CRITERION_WEIGHTS[3] +
    c5 * CRITERION_WEIGHTS[4];
  return Math.round(weighted * 20);
}

const teamForScoringValidator = v.object({
  _id: v.id("hub_teams"),
  name: v.string(),
  track: v.optional(v.string()),
  project: v.union(
    v.object({
      name: v.string(),
      description: v.string(),
      url: v.string(),
      repoUrls: v.array(v.string()),
      sponsorsUsed: v.array(hubSponsorIdValidator),
    }),
    v.null(),
  ),
  deliverables: v.union(
    v.object({
      slidesUrl: v.optional(v.string()),
      videoUrl: v.optional(v.string()),
      videoPlaybackUrl: v.optional(v.string()),
      testUsers: v.optional(v.string()),
      submittedAt: v.optional(v.number()),
    }),
    v.null(),
  ),
  socialPosts: v.array(
    v.object({
      platform: v.union(v.literal("x"), v.literal("linkedin")),
      url: v.string(),
    }),
  ),
  feedbackComplete: v.boolean(),
  myScore: v.union(
    v.object({
      criterion1: v.number(),
      criterion2: v.number(),
      criterion3: v.number(),
      criterion4: v.number(),
      criterion5: v.number(),
      comment: v.optional(v.string()),
    }),
    v.null(),
  ),
});

export const listTeamsForScoring = query({
  args: {},
  returns: v.array(teamForScoringValidator),
  handler: async (ctx) => {
    const user = await requireHubRole(ctx, ["logistics", "jury"]);
    const teams = await ctx.db.query("hub_teams").collect();

    return await Promise.all(
      teams.map(async (team) => {
        const project = await ctx.db
          .query("hub_projects")
          .withIndex("by_team", (q) => q.eq("teamId", team._id))
          .unique();
        const deliverables = await ctx.db
          .query("hub_deliverables")
          .withIndex("by_team", (q) => q.eq("teamId", team._id))
          .unique();
        const posts = await ctx.db
          .query("hub_social_posts")
          .withIndex("by_team", (q) => q.eq("teamId", team._id))
          .collect();

        const videoPlaybackUrl = deliverables?.videoR2Key
          ? getPublicUrl(deliverables.videoR2Key)
          : deliverables?.videoUrl;

        const memberships = await ctx.db
          .query("hub_team_members")
          .withIndex("by_team", (q) => q.eq("teamId", team._id))
          .collect();

        let feedbackComplete = !project || project.sponsorsUsed.length === 0;
        if (project && project.sponsorsUsed.length > 0) {
          feedbackComplete = true;
          for (const member of memberships) {
            for (const sponsorId of project.sponsorsUsed) {
              const entry = await ctx.db
                .query("hub_sponsor_feedback")
                .withIndex("by_user_team_sponsor", (q) =>
                  q
                    .eq("userId", member.userId)
                    .eq("teamId", team._id)
                    .eq("sponsorId", sponsorId),
                )
                .unique();
              if (!entry?.feedback.trim()) {
                feedbackComplete = false;
                break;
              }
            }
            if (!feedbackComplete) break;
          }
        }

        const myScore = await ctx.db
          .query("hub_scores")
          .withIndex("by_jury_and_team", (q) =>
            q.eq("juryUserId", user._id).eq("teamId", team._id),
          )
          .unique();

        return {
          _id: team._id,
          name: team.name,
          track: team.track,
          project: project
            ? {
                name: project.name,
                description: project.description,
                url: project.url,
                repoUrls: resolveProjectRepoUrls(project),
                sponsorsUsed: project.sponsorsUsed,
              }
            : null,
          deliverables: deliverables
            ? {
                slidesUrl: deliverables.slidesUrl,
                videoUrl: deliverables.videoUrl,
                videoPlaybackUrl,
                testUsers: deliverables.testUsers,
                submittedAt: deliverables.submittedAt,
              }
            : null,
          socialPosts: posts.map((post) => ({
            platform: post.platform,
            url: post.url,
          })),
          feedbackComplete,
          myScore: myScore
            ? {
                criterion1: myScore.criterion1,
                criterion2: myScore.criterion2,
                criterion3: myScore.criterion3,
                criterion4: myScore.criterion4,
                criterion5: myScore.criterion5,
                comment: myScore.comment,
              }
            : null,
        };
      }),
    );
  },
});

export const submitScore = mutation({
  args: {
    teamId: v.id("hub_teams"),
    criterion1: v.number(),
    criterion2: v.number(),
    criterion3: v.number(),
    criterion4: v.number(),
    criterion5: v.number(),
    comment: v.optional(v.string()),
  },
  returns: v.id("hub_scores"),
  handler: async (ctx, args) => {
    const user = await requireHubRole(ctx, ["logistics", "jury"]);

    const criteria = [
      args.criterion1,
      args.criterion2,
      args.criterion3,
      args.criterion4,
      args.criterion5,
    ];
    for (const value of criteria) {
      if (value < 1 || value > 5 || !Number.isInteger(value)) {
        throw new Error("Each criterion must be an integer between 1 and 5");
      }
    }

    const team = await ctx.db.get(args.teamId);
    if (!team) throw new Error("Team not found");

    const now = Date.now();
    const existing = await ctx.db
      .query("hub_scores")
      .withIndex("by_jury_and_team", (q) =>
        q.eq("juryUserId", user._id).eq("teamId", args.teamId),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        criterion1: args.criterion1,
        criterion2: args.criterion2,
        criterion3: args.criterion3,
        criterion4: args.criterion4,
        criterion5: args.criterion5,
        comment: args.comment?.trim() || undefined,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("hub_scores", {
      teamId: args.teamId,
      juryUserId: user._id,
      criterion1: args.criterion1,
      criterion2: args.criterion2,
      criterion3: args.criterion3,
      criterion4: args.criterion4,
      criterion5: args.criterion5,
      comment: args.comment?.trim() || undefined,
      createdAt: now,
    });
  },
});

export const getRankings = query({
  args: {},
  returns: v.array(
    v.object({
      teamId: v.id("hub_teams"),
      teamName: v.string(),
      averageTotal: v.number(),
      jurorCount: v.number(),
    }),
  ),
  handler: async (ctx) => {
    await requireHubRole(ctx, ["logistics", "jury"]);

    const teams = await ctx.db.query("hub_teams").collect();
    const allScores = await ctx.db.query("hub_scores").collect();

    const rankings = teams.map((team) => {
      const scores = allScores.filter((score) => score.teamId === team._id);
      if (scores.length === 0) {
        return {
          teamId: team._id,
          teamName: team.name,
          averageTotal: 0,
          jurorCount: 0,
        };
      }

      const totals = scores.map((score) =>
        computeWeightedTotal(
          score.criterion1,
          score.criterion2,
          score.criterion3,
          score.criterion4,
          score.criterion5,
        ),
      );
      const averageTotal = totals.reduce((sum, value) => sum + value, 0) / totals.length;

      return {
        teamId: team._id,
        teamName: team.name,
        averageTotal,
        jurorCount: scores.length,
      };
    });

    return rankings.sort((a, b) => b.averageTotal - a.averageTotal);
  },
});
