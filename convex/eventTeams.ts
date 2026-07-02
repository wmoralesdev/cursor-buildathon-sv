import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  normalizeLinkedInProfile,
  normalizeXProfile,
  trimOrThrow,
} from "./lib/profileValidation";
import { sponsorTrackValidator } from "./lib/sponsorTracks";
import { competitionTrackValidator } from "./lib/competitionTracks";

const MAX_TEAM_SIZE = 5;
const INVITE_CODE_LENGTH = 6;
/** No ambiguous characters (no O/0, I/1) so codes are easy to read aloud. */
const INVITE_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const profileArgs = {
  name: v.string(),
  xProfile: v.string(),
  linkedInProfile: v.string(),
} as const;

function randomInviteCode(): string {
  let code = "";
  for (let i = 0; i < INVITE_CODE_LENGTH; i += 1) {
    const index = Math.floor(Math.random() * INVITE_CODE_ALPHABET.length);
    code += INVITE_CODE_ALPHABET[index];
  }
  return code;
}

function normalizeProfile(input: {
  name: string;
  xProfile: string;
  linkedInProfile: string;
}) {
  return {
    name: trimOrThrow(input.name, "Name"),
    xProfile: normalizeXProfile(input.xProfile),
    linkedInProfile: normalizeLinkedInProfile(input.linkedInProfile),
  };
}

export const createTeam = mutation({
  args: {
    leaderSessionId: v.string(),
    teamName: v.string(),
    sponsorTrack: v.optional(sponsorTrackValidator),
    competitionTrack: v.optional(competitionTrackValidator),
    ...profileArgs,
  },
  handler: async (ctx, args) => {
    const leaderSessionId = trimOrThrow(args.leaderSessionId, "Session");
    const name = trimOrThrow(args.teamName, "Team name");

    const existing = await ctx.db
      .query("event_teams")
      .withIndex("by_leader_session", (q) => q.eq("leaderSessionId", leaderSessionId))
      .first();
    if (existing) {
      throw new Error("You have already created a team on this device");
    }

    const leader = normalizeProfile(args);

    let inviteCode = randomInviteCode();
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const clash = await ctx.db
        .query("event_teams")
        .withIndex("by_invite_code", (q) => q.eq("inviteCode", inviteCode))
        .first();
      if (!clash) break;
      inviteCode = randomInviteCode();
    }

    const now = Date.now();
    return await ctx.db.insert("event_teams", {
      name,
      inviteCode,
      leaderSessionId,
      ...(args.sponsorTrack ? { sponsorTrack: args.sponsorTrack } : {}),
      ...(args.competitionTrack ? { competitionTrack: args.competitionTrack } : {}),
      members: [
        {
          sessionId: leaderSessionId,
          ...leader,
          isLeader: true,
          joinedAt: now,
        },
      ],
      createdAt: now,
    });
  },
});

export const joinTeam = mutation({
  args: {
    memberSessionId: v.string(),
    inviteCode: v.string(),
    ...profileArgs,
  },
  handler: async (ctx, args) => {
    const memberSessionId = trimOrThrow(args.memberSessionId, "Session");
    const inviteCode = trimOrThrow(args.inviteCode, "Invite code").toUpperCase();

    const team = await ctx.db
      .query("event_teams")
      .withIndex("by_invite_code", (q) => q.eq("inviteCode", inviteCode))
      .first();
    if (!team) {
      throw new Error("That invite code is not valid");
    }
    if (team.submittedAt) {
      throw new Error("This team has already submitted a project");
    }
    if (team.members.length >= MAX_TEAM_SIZE) {
      throw new Error("This team is already full");
    }
    if (team.members.some((member) => member.sessionId === memberSessionId)) {
      throw new Error("You are already on this team");
    }

    const ownTeam = await ctx.db
      .query("event_teams")
      .withIndex("by_leader_session", (q) => q.eq("leaderSessionId", memberSessionId))
      .first();
    if (ownTeam) {
      throw new Error("You already lead a team on this device");
    }

    const member = normalizeProfile(args);
    const now = Date.now();

    await ctx.db.patch("event_teams", team._id, {
      members: [
        ...team.members,
        {
          sessionId: memberSessionId,
          ...member,
          isLeader: false,
          joinedAt: now,
        },
      ],
    });

    return team._id;
  },
});

export const getTeamBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const sessionId = args.sessionId.trim();
    if (!sessionId) return null;

    const ledTeam = await ctx.db
      .query("event_teams")
      .withIndex("by_leader_session", (q) => q.eq("leaderSessionId", sessionId))
      .first();
    const team =
      ledTeam ??
      (await ctx.db
        .query("event_teams")
        .collect()
        .then((teams) =>
          teams.find((t) => t.members.some((m) => m.sessionId === sessionId)),
        )) ??
      null;

    if (!team) return null;

    const isLeader = team.leaderSessionId === sessionId;
    return {
      teamId: team._id,
      name: team.name,
      inviteCode: isLeader ? team.inviteCode : null,
      sponsorTrack: team.sponsorTrack ?? null,
      competitionTrack: team.competitionTrack ?? null,
      isLeader,
      submitted: Boolean(team.submittedAt),
      memberCount: team.members.length,
      maxMembers: MAX_TEAM_SIZE,
      members: team.members.map((member) => ({
        name: member.name,
        xProfile: member.xProfile,
        linkedInProfile: member.linkedInProfile,
        isLeader: member.isLeader,
        isYou: member.sessionId === sessionId,
      })),
    };
  },
});

export const setCompetitionTrack = mutation({
  args: {
    leaderSessionId: v.string(),
    competitionTrack: competitionTrackValidator,
  },
  handler: async (ctx, args) => {
    const leaderSessionId = trimOrThrow(args.leaderSessionId, "Session");

    const team = await ctx.db
      .query("event_teams")
      .withIndex("by_leader_session", (q) => q.eq("leaderSessionId", leaderSessionId))
      .first();
    if (!team) {
      throw new Error("Only the team leader can set the competition track");
    }
    if (team.submittedAt) {
      throw new Error("This team has already submitted a project");
    }

    await ctx.db.patch("event_teams", team._id, { competitionTrack: args.competitionTrack });
    return team._id;
  },
});

export const previewTeamByCode = query({
  args: { inviteCode: v.string() },
  handler: async (ctx, args) => {
    const inviteCode = args.inviteCode.trim().toUpperCase();
    if (!inviteCode) return null;

    const team = await ctx.db
      .query("event_teams")
      .withIndex("by_invite_code", (q) => q.eq("inviteCode", inviteCode))
      .first();
    if (!team) return null;

    return {
      name: team.name,
      memberCount: team.members.length,
      maxMembers: MAX_TEAM_SIZE,
      submitted: Boolean(team.submittedAt),
      full: team.members.length >= MAX_TEAM_SIZE,
    };
  },
});
