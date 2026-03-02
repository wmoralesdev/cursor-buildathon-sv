import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin, getCurrentUserOrNull } from "./lib/auth";

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const adminEmails = process.env.ADMIN_EMAILS ?? "";
    const allowed = adminEmails
      .split(",")
      .map((e: string) => e.trim().toLowerCase())
      .filter(Boolean);
    const identityEmail = (identity.email ?? "").toLowerCase();

    if (!identityEmail || !allowed.includes(identityEmail)) return null;

    const user = await getCurrentUserOrNull(ctx);
    if (!user) return null;

    return { email: identity.email!, name: user.name };
  },
});

export const listProjectsForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const projects = await ctx.db.query("projects").collect();

    return await Promise.all(
      projects.map(async (project) => {
        const team = await ctx.db.get(project.teamId);
        return { ...project, team };
      })
    );
  },
});

const CRITERION_WEIGHTS = [0.25, 0.2, 0.25, 0.2, 0.1] as const;

function computeWeightedTotal(
  c1: number,
  c2: number,
  c3: number,
  c4: number,
  c5: number
): number {
  const weighted =
    c1 * CRITERION_WEIGHTS[0] +
    c2 * CRITERION_WEIGHTS[1] +
    c3 * CRITERION_WEIGHTS[2] +
    c4 * CRITERION_WEIGHTS[3] +
    c5 * CRITERION_WEIGHTS[4];
  return Math.round(weighted * 20);
}

export const submitScore = mutation({
  args: {
    projectId: v.id("projects"),
    criterion1: v.number(),
    criterion2: v.number(),
    criterion3: v.number(),
    criterion4: v.number(),
    criterion5: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);

    const criteria = [
      args.criterion1,
      args.criterion2,
      args.criterion3,
      args.criterion4,
      args.criterion5,
    ];
    for (const val of criteria) {
      if (val < 1 || val > 5 || !Number.isInteger(val)) {
        throw new Error("Each criterion must be an integer between 1 and 5");
      }
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    const now = Date.now();
    const existing = await ctx.db
      .query("project_scores")
      .withIndex("by_project_and_user", (q) =>
        q.eq("projectId", args.projectId).eq("userId", user._id)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        criterion1: args.criterion1,
        criterion2: args.criterion2,
        criterion3: args.criterion3,
        criterion4: args.criterion4,
        criterion5: args.criterion5,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("project_scores", {
      projectId: args.projectId,
      userId: user._id,
      criterion1: args.criterion1,
      criterion2: args.criterion2,
      criterion3: args.criterion3,
      criterion4: args.criterion4,
      criterion5: args.criterion5,
      createdAt: now,
    });
  },
});

export const getScoresByCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAdmin(ctx);
    return await ctx.db
      .query("project_scores")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const getScoresForProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("project_scores")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const getRankings = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const projects = await ctx.db.query("projects").collect();
    const allScores = await ctx.db.query("project_scores").collect();

    const rankings = await Promise.all(
      projects.map(async (project) => {
        const team = await ctx.db.get(project.teamId);
        const scores = allScores.filter((s) => s.projectId === project._id);

        if (scores.length === 0) {
          return {
            project,
            team,
            averageTotal: 0,
            jurorCount: 0,
            onesCount: 0,
          };
        }

        const totals = scores.map((s) => {
          const c5 = s.criterion5 ?? 3;
          return computeWeightedTotal(
            s.criterion1,
            s.criterion2,
            s.criterion3,
            s.criterion4,
            c5
          );
        });
        const averageTotal = totals.reduce((a, b) => a + b, 0) / totals.length;

        const onesCount = scores.reduce(
          (acc, s) =>
            acc +
            [
              s.criterion1,
              s.criterion2,
              s.criterion3,
              s.criterion4,
              s.criterion5 ?? 3,
            ].filter((v) => v === 1).length,
          0
        );

        return { project, team, averageTotal, jurorCount: scores.length, onesCount };
      })
    );

    return rankings.sort((a, b) => {
      if (b.averageTotal !== a.averageTotal) return b.averageTotal - a.averageTotal;
      return a.onesCount - b.onesCount;
    });
  },
});
