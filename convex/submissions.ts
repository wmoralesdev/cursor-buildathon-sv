import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { verifyVideoR2Key } from "./lib/r2";
import { normalizeHttpUrl, trimOrThrow } from "./lib/profileValidation";

export const submit = mutation({
  args: {
    eventTeamId: v.id("event_teams"),
    leaderSessionId: v.string(),
    repoUrl: v.string(),
    description: v.string(),
    videoR2Key: v.string(),
    eventSocialPostUrl: v.string(),
    website: v.optional(v.string()),
  },
  returns: v.id("project_submissions"),
  handler: async (ctx, args) => {
    if (args.website?.trim()) {
      throw new Error("Submission rejected");
    }

    const team = await ctx.db.get("event_teams", args.eventTeamId);
    if (!team) {
      throw new Error("Team not found");
    }
    if (team.leaderSessionId !== args.leaderSessionId) {
      throw new Error("Only the team leader can submit");
    }
    if (team.submittedAt) {
      throw new Error("This team has already submitted a project");
    }

    const memberCount = team.members.length;
    if (memberCount !== 4 && memberCount !== 5) {
      throw new Error("Team must have 4 or 5 members");
    }

    const description = trimOrThrow(args.description, "Description");

    const repoUrl = normalizeHttpUrl(args.repoUrl, "Repository URL");
    const eventSocialPostUrl = normalizeHttpUrl(args.eventSocialPostUrl, "Event social post URL");

    await verifyVideoR2Key(args.videoR2Key, "submit");

    const teamName = trimOrThrow(team.name, "Team name");
    const members = team.members.map((member) => ({
      name: member.name,
      xProfile: member.xProfile,
      linkedInProfile: member.linkedInProfile,
    }));

    const submissionId = await ctx.db.insert("project_submissions", {
      teamName,
      members,
      repoUrl,
      description,
      videoR2Key: args.videoR2Key,
      eventSocialPostUrl,
      ...(team.competitionTrack ? { competitionTrack: team.competitionTrack } : {}),
      eventTeamId: args.eventTeamId,
      submittedAt: Date.now(),
    });

    await ctx.db.patch("event_teams", args.eventTeamId, { submittedAt: Date.now() });

    return submissionId;
  },
});

export const getSubmissionByTeam = query({
  args: {
    eventTeamId: v.id("event_teams"),
    leaderSessionId: v.string(),
  },
  returns: v.union(
    v.object({
      repoUrl: v.string(),
      description: v.string(),
      eventSocialPostUrl: v.string(),
      competitionTrack: v.union(v.string(), v.null()),
      submittedAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const team = await ctx.db.get("event_teams", args.eventTeamId);
    if (!team || team.leaderSessionId !== args.leaderSessionId.trim()) {
      return null;
    }

    const submission = await ctx.db
      .query("project_submissions")
      .withIndex("by_event_team", (q) => q.eq("eventTeamId", args.eventTeamId))
      .order("desc")
      .first();
    if (!submission) return null;

    return {
      repoUrl: submission.repoUrl,
      description: submission.description,
      eventSocialPostUrl: submission.eventSocialPostUrl,
      competitionTrack: submission.competitionTrack ?? null,
      submittedAt: submission.submittedAt,
    };
  },
});
