import { internalMutation, mutation, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { requireHubUser, requireTeamMembership } from "../lib/hub_auth";
import {
  assertReadyForFinalSubmit,
  diffAndLogProjectChanges,
  getMissingProjectDetails,
  isProjectDetailsComplete,
  isTeamFeedbackComplete,
  logProjectEvent,
} from "../lib/hub_project_events";
import { hubSponsorIdValidator } from "../lib/hubSponsorIds";
import { normalizeProjectRepoUrls, resolveProjectRepoUrls } from "../lib/hub_project_repo_urls";
import {
  toHubDeliverablesPublic,
  toHubProjectPublic,
} from "../lib/hub_projections";
import {
  normalizeOptionalHttpUrl,
  trimOrThrow,
} from "../lib/profileValidation";

const projectValidator = v.object({
  _id: v.id("hub_projects"),
  teamId: v.id("hub_teams"),
  name: v.string(),
  description: v.string(),
  url: v.string(),
  repoUrls: v.array(v.string()),
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

const timelineActorValidator = v.object({
  _id: v.id("hub_users"),
  name: v.string(),
  avatarUrl: v.optional(v.string()),
});

const timelineEventValidator = v.object({
  _id: v.id("hub_project_events"),
  kind: v.union(
    v.literal("project_created"),
    v.literal("title_changed"),
    v.literal("description_changed"),
    v.literal("url_changed"),
    v.literal("repo_changed"),
    v.literal("sponsor_added"),
    v.literal("sponsor_removed"),
    v.literal("deliverables_saved"),
    v.literal("sponsor_feedback_submitted"),
    v.literal("final_submitted"),
  ),
  meta: v.optional(
    v.object({
      from: v.optional(v.string()),
      to: v.optional(v.string()),
      sponsorId: v.optional(hubSponsorIdValidator),
    }),
  ),
  createdAt: v.number(),
  actor: timelineActorValidator,
});

export const getMyProject = query({
  args: {},
  returns: v.union(
    v.object({
      project: v.union(projectValidator, v.null()),
      deliverables: v.union(deliverablesValidator, v.null()),
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

    const project = await ctx.db
      .query("hub_projects")
      .withIndex("by_team", (q) => q.eq("teamId", membership.teamId))
      .unique();

    if (!project) {
      return { project: null, deliverables: null };
    }

    const deliverables = await ctx.db
      .query("hub_deliverables")
      .withIndex("by_team", (q) => q.eq("teamId", membership.teamId))
      .unique();

    return {
      project: toHubProjectPublic(project),
      deliverables: deliverables ? toHubDeliverablesPublic(deliverables) : null,
    };
  },
});

export const getCompletionStatus = query({
  args: {},
  returns: v.union(
    v.object({
      detailsComplete: v.boolean(),
      missingDetails: v.array(v.string()),
      feedbackComplete: v.boolean(),
      deliverablesReady: v.boolean(),
      canFinalize: v.boolean(),
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

    const project = await ctx.db
      .query("hub_projects")
      .withIndex("by_team", (q) => q.eq("teamId", membership.teamId))
      .unique();
    if (!project) return null;

    const deliverables = await ctx.db
      .query("hub_deliverables")
      .withIndex("by_team", (q) => q.eq("teamId", membership.teamId))
      .unique();

    const snapshot = {
      name: project.name,
      description: project.description,
      url: project.url,
      repoUrls: resolveProjectRepoUrls(project),
      sponsorsUsed: project.sponsorsUsed,
    };

    const detailsComplete = isProjectDetailsComplete(snapshot);
    const missingDetails = getMissingProjectDetails(snapshot);
    const feedbackComplete = await isTeamFeedbackComplete(
      ctx,
      membership.teamId,
      project.sponsorsUsed,
    );
    const deliverablesReady = Boolean(
      deliverables?.slidesUrl &&
        (deliverables.videoR2Key || deliverables.videoUrl),
    );

    return {
      detailsComplete,
      missingDetails,
      feedbackComplete,
      deliverablesReady,
      canFinalize: detailsComplete && feedbackComplete && deliverablesReady,
    };
  },
});

export const listTimeline = query({
  args: { paginationOpts: paginationOptsValidator },
  returns: v.object({
    page: v.array(timelineEventValidator),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
  handler: async (ctx, args) => {
    const user = await requireHubUser(ctx).catch(() => null);
    if (!user) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const membership = await ctx.db
      .query("hub_team_members")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();
    if (!membership) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const result = await ctx.db
      .query("hub_project_events")
      .withIndex("by_team_created", (q) => q.eq("teamId", membership.teamId))
      .order("desc")
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      result.page.map(async (event) => {
        const actorDoc = await ctx.db.get(event.actorId);
        const actor = actorDoc
          ? {
              _id: actorDoc._id,
              name: actorDoc.name,
              avatarUrl: actorDoc.avatarUrl,
            }
          : {
              _id: event.actorId,
              name: "Unknown",
              avatarUrl: undefined,
            };

        return {
          _id: event._id,
          kind: event.kind,
          meta: event.meta,
          createdAt: event.createdAt,
          actor,
        };
      }),
    );

    return {
      page,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

export const upsertProjectInternal = internalMutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    repoUrls: v.array(v.string()),
    sponsorsUsed: v.optional(v.array(hubSponsorIdValidator)),
  },
  returns: projectValidator,
  handler: async (ctx, args) => {
    const user = await requireHubUser(ctx);
    const { team } = await requireTeamMembership(ctx, user._id);

    const name = trimOrThrow(args.name, "Project name");
    const description = (args.description ?? "").trim();

    const url = normalizeOptionalHttpUrl(args.url ?? "", "Project URL");
    const repoUrls = normalizeProjectRepoUrls(args.repoUrls);
    if (repoUrls.length === 0) {
      throw new Error("At least one repository URL is required");
    }
    const sponsorsUsed = args.sponsorsUsed ?? [];
    const now = Date.now();

    const snapshot = { name, description, url, repoUrls, sponsorsUsed };

    const existing = await ctx.db
      .query("hub_projects")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...snapshot,
        updatedAt: now,
      });
      await diffAndLogProjectChanges(ctx, existing, snapshot, user._id, team._id);
      const updated = await ctx.db.get(existing._id);
      if (!updated) throw new Error("Project update failed");
      return toHubProjectPublic(updated);
    }

    const projectId = await ctx.db.insert("hub_projects", {
      teamId: team._id,
      ...snapshot,
      createdAt: now,
    });

    await diffAndLogProjectChanges(ctx, null, snapshot, user._id, team._id);

    const created = await ctx.db.get(projectId);
    if (!created) throw new Error("Project creation failed");
    return toHubProjectPublic(created);
  },
});

export const upsertDeliverables = mutation({
  args: {
    slidesUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    testUsers: v.optional(v.string()),
    finalize: v.optional(v.boolean()),
  },
  returns: deliverablesValidator,
  handler: async (ctx, args) => {
    const user = await requireHubUser(ctx);
    const { team } = await requireTeamMembership(ctx, user._id);

    const project = await ctx.db
      .query("hub_projects")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();
    if (!project) {
      throw new Error("Create your project before adding deliverables");
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("hub_deliverables")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();

    const slidesUrl = args.slidesUrl?.trim()
      ? normalizeOptionalHttpUrl(args.slidesUrl, "Slides URL")
      : undefined;
    const videoUrl = args.videoUrl?.trim()
      ? normalizeOptionalHttpUrl(args.videoUrl, "Video URL")
      : undefined;

    const mergedSlidesUrl = slidesUrl ?? existing?.slidesUrl;
    const mergedVideoUrl = videoUrl ?? existing?.videoUrl;

    if (args.finalize) {
      await assertReadyForFinalSubmit(ctx, team._id, project, {
        slidesUrl: mergedSlidesUrl,
        videoR2Key: existing?.videoR2Key,
        videoUrl: mergedVideoUrl,
      });
    }

    const payload = {
      slidesUrl,
      videoUrl,
      testUsers: args.testUsers?.trim() || undefined,
      updatedAt: now,
      ...(args.finalize ? { submittedAt: now } : {}),
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
    } else {
      await ctx.db.insert("hub_deliverables", {
        teamId: team._id,
        ...payload,
      });
    }

    await logProjectEvent(ctx, {
      teamId: team._id,
      actorId: user._id,
      kind: "deliverables_saved",
    });

    if (args.finalize) {
      await logProjectEvent(ctx, {
        teamId: team._id,
        actorId: user._id,
        kind: "final_submitted",
      });
    }

    const deliverables = await ctx.db
      .query("hub_deliverables")
      .withIndex("by_team", (q) => q.eq("teamId", team._id))
      .unique();
    if (!deliverables) throw new Error("Deliverables update failed");
    return toHubDeliverablesPublic(deliverables);
  },
});
