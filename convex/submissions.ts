import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { normalizeHttpUrl, trimOrThrow } from "./lib/profileValidation";

const DESCRIPTION_MAX_LENGTH = 500;
const VIDEO_MAX_BYTES = 100 * 1024 * 1024;
const ALLOWED_VIDEO_MIME_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
]);

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const submit = mutation({
  args: {
    eventTeamId: v.id("event_teams"),
    leaderSessionId: v.string(),
    repoUrl: v.string(),
    description: v.string(),
    videoStorageId: v.id("_storage"),
    eventSocialPostUrl: v.string(),
    website: v.optional(v.string()),
  },
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
    if (description.length > DESCRIPTION_MAX_LENGTH) {
      throw new Error(`Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer`);
    }

    const repoUrl = normalizeHttpUrl(args.repoUrl, "Repository URL");
    const eventSocialPostUrl = normalizeHttpUrl(args.eventSocialPostUrl, "Event social post URL");

    const videoMetadata = await ctx.db.system.get("_storage", args.videoStorageId);
    if (!videoMetadata) {
      throw new Error("Demo video upload failed — please try again");
    }
    if (videoMetadata.size > VIDEO_MAX_BYTES) {
      throw new Error("Demo video must be 100 MB or smaller");
    }
    if (videoMetadata.contentType && !ALLOWED_VIDEO_MIME_TYPES.has(videoMetadata.contentType)) {
      throw new Error("Demo video must be MP4, WebM, or MOV");
    }

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
      videoStorageId: args.videoStorageId,
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
