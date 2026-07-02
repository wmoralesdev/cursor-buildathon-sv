import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import { ensureHubUser, requireHubUser, requireTeamMembership } from "../lib/hubAuth";
import { hubSponsorIdValidator, isHubCreditSponsorId } from "../lib/hubSponsorIds";
import { getPublicUrl, verifyVideoR2Key } from "../lib/r2";
import { normalizeHttpUrl, trimOrThrow } from "../lib/profileValidation";
import {
  canonicalTeamRepoUrl,
  prepareTeamRepoLink,
  scheduleTeamRepoSync,
} from "./linkTeamRepo";

const DESCRIPTION_MAX = 1000;

const projectValidator = v.object({
  _id: v.id("hub_projects"),
  teamId: v.id("hub_teams"),
  name: v.string(),
  description: v.string(),
  url: v.string(),
  repoUrl: v.string(),
  sponsorsUsed: v.array(hubSponsorIdValidator),
  createdAt: v.number(),
});

const deliverablesValidator = v.object({
  _id: v.id("hub_deliverables"),
  teamId: v.id("hub_teams"),
  slidesUrl: v.optional(v.string()),
  videoR2Key: v.optional(v.string()),
  videoUrl: v.optional(v.string()),
  videoPlaybackUrl: v.optional(v.string()),
  testUsers: v.optional(v.string()),
  submittedAt: v.optional(v.number()),
});

function deliverablesWithPlayback<T extends { videoR2Key?: string; videoUrl?: string }>(
  deliverables: T,
): T & { videoPlaybackUrl?: string } {
  const videoPlaybackUrl = deliverables.videoR2Key
    ? getPublicUrl(deliverables.videoR2Key)
    : deliverables.videoUrl;
  return { ...deliverables, videoPlaybackUrl };
}

function toProjectPublic(project: Doc<"hub_projects">) {
  return {
    _id: project._id,
    teamId: project.teamId,
    name: project.name,
    description: project.description ?? "",
    url: project.url,
    repoUrl: project.repoUrl,
    sponsorsUsed: project.sponsorsUsed.filter(isHubCreditSponsorId),
    createdAt: project.createdAt ?? project._creationTime,
  };
}

function toDeliverablesPublic(
  deliverables: Doc<"hub_deliverables"> & { videoPlaybackUrl?: string },
) {
  return {
    _id: deliverables._id,
    teamId: deliverables.teamId,
    slidesUrl: deliverables.slidesUrl,
    videoR2Key: deliverables.videoR2Key,
    videoUrl: deliverables.videoUrl,
    videoPlaybackUrl: deliverables.videoPlaybackUrl,
    testUsers: deliverables.testUsers,
    submittedAt: deliverables.submittedAt,
  };
}

export const getMyProject = query({
  args: {},
  returns: v.union(
    v.object({
      project: v.union(projectValidator, v.null()),
      deliverables: v.union(deliverablesValidator, v.null()),
      linkedRepoUrl: v.union(v.string(), v.null()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const user = await requireHubUser(ctx).catch(() => null);
    if (!user) return null;

    const membership = await ctx.db
      .query("hub_team_members")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!membership) return null;

    const team = await ctx.db.get(membership.teamId);
    if (!team) return null;

    const linkedRepoUrl = canonicalTeamRepoUrl(team);

    const project = await ctx.db
      .query("hub_projects")
      .withIndex("by_team", (q) => q.eq("teamId", membership.teamId))
      .unique();
    if (!project) {
      return { project: null, deliverables: null, linkedRepoUrl };
    }

    const deliverables = await ctx.db
      .query("hub_deliverables")
      .withIndex("by_team", (q) => q.eq("teamId", membership.teamId))
      .unique();

    return {
      project: toProjectPublic(project),
      deliverables: deliverables
        ? toDeliverablesPublic(deliverablesWithPlayback(deliverables))
        : null,
      linkedRepoUrl,
    };
  },
});

export const upsertProject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    url: v.string(),
    repoUrl: v.string(),
    sponsorsUsed: v.array(hubSponsorIdValidator),
  },
  returns: projectValidator,
  handler: async (ctx, args) => {
    const user = await ensureHubUser(ctx);
    const { team } = await requireTeamMembership(ctx, user._id);

    const name = trimOrThrow(args.name, "Project name");
    const description = trimOrThrow(args.description, "Description");
    if (description.length > DESCRIPTION_MAX) {
      throw new Error(`Description must be ${DESCRIPTION_MAX} characters or fewer`);
    }

    const url = normalizeHttpUrl(args.url, "Project URL");
    const now = Date.now();

    const existing = await ctx.db
      .query("hub_projects")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();

    const deliverables = await ctx.db
      .query("hub_deliverables")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();

    const link = await prepareTeamRepoLink(ctx, {
      team,
      captainId: team.captainId,
      actorId: user._id,
      repoUrlInput: args.repoUrl,
      currentProjectRepoUrl: existing?.repoUrl,
      blockChangesAfterFinalSubmit: Boolean(deliverables?.submittedAt),
    });
    const repoUrl = link.canonicalUrl;
    const sponsorsUsed = args.sponsorsUsed.filter(isHubCreditSponsorId);

    if (existing) {
      await ctx.db.patch(existing._id, {
        name,
        description,
        url,
        repoUrl,
        sponsorsUsed,
        updatedAt: now,
      });
      const updated = await ctx.db.get(existing._id);
      if (!updated) throw new Error("Project update failed");
      if (link.shouldSync) {
        await scheduleTeamRepoSync(ctx, team._id, link.isBaseline);
      }
      return toProjectPublic(updated);
    }

    const projectId = await ctx.db.insert("hub_projects", {
      teamId: team._id,
      name,
      description,
      url,
      repoUrl,
      sponsorsUsed,
      createdAt: now,
    });

    const created = await ctx.db.get(projectId);
    if (!created) throw new Error("Project creation failed");
    if (link.shouldSync) {
      await scheduleTeamRepoSync(ctx, team._id, link.isBaseline);
    }
    return toProjectPublic(created);
  },
});

export const upsertDeliverables = mutation({
  args: {
    slidesUrl: v.optional(v.string()),
    videoR2Key: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    testUsers: v.optional(v.string()),
    finalize: v.optional(v.boolean()),
  },
  returns: deliverablesValidator,
  handler: async (ctx, args) => {
    const user = await ensureHubUser(ctx);
    const { team } = await requireTeamMembership(ctx, user._id);

    const project = await ctx.db
      .query("hub_projects")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();
    if (!project) {
      throw new Error("Create your project before adding deliverables");
    }

    const slidesUrl = args.slidesUrl?.trim()
      ? normalizeHttpUrl(args.slidesUrl, "Slides URL")
      : undefined;
    const videoUrl = args.videoUrl?.trim()
      ? normalizeHttpUrl(args.videoUrl, "Video URL")
      : undefined;

    if (args.videoR2Key) {
      await verifyVideoR2Key(args.videoR2Key, "hub");
    }

    if (args.finalize) {
      if (!slidesUrl) throw new Error("Slides URL is required to submit");
      if (!args.videoR2Key && !videoUrl) {
        throw new Error("Video showcase is required to submit");
      }

      const members = await ctx.db
        .query("hub_team_members")
        .withIndex("by_team", (q) => q.eq("teamId", team._id))
        .collect();

      for (const member of members) {
        for (const sponsorId of project.sponsorsUsed) {
          const feedback = await ctx.db
            .query("hub_sponsor_feedback")
            .withIndex("by_user_team_sponsor", (q) =>
              q
                .eq("userId", member.userId)
                .eq("teamId", team._id)
                .eq("sponsorId", sponsorId),
            )
            .unique();
          if (!feedback?.feedback.trim()) {
            throw new Error("All team members must submit sponsor feedback before final submission");
          }
        }
      }
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("hub_deliverables")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();

    const payload = {
      slidesUrl,
      videoR2Key: args.videoR2Key,
      videoUrl,
      testUsers: args.testUsers?.trim() || undefined,
      updatedAt: now,
      ...(args.finalize ? { submittedAt: now } : {}),
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      const updated = await ctx.db.get(existing._id);
      if (!updated) throw new Error("Deliverables update failed");
      return toDeliverablesPublic(deliverablesWithPlayback(updated));
    }

    const deliverableId = await ctx.db.insert("hub_deliverables", {
      teamId: team._id,
      ...payload,
    });
    const created = await ctx.db.get(deliverableId);
    if (!created) throw new Error("Deliverables creation failed");
    return toDeliverablesPublic(deliverablesWithPlayback(created));
  },
});
