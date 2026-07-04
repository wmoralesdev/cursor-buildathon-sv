"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import type { HubProjectPublic } from "../lib/hub_projections";
import { hubSponsorIdValidator } from "../lib/hubSponsorIds";
import { normalizeRepoHttpUrl } from "../lib/repo_url";
import { validateEmptyRepo } from "../lib/validate_empty_repo";

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

const upsertProjectArgs = {
  name: v.string(),
  description: v.optional(v.string()),
  url: v.optional(v.string()),
  repoUrl: v.string(),
  sponsorsUsed: v.optional(v.array(hubSponsorIdValidator)),
};

export const validateRepoUrl = action({
  args: { repoUrl: v.string() },
  returns: v.object({ normalizedUrl: v.string() }),
  handler: async (_ctx, args) => {
    const normalizedUrl = await validateEmptyRepo(args.repoUrl);
    return { normalizedUrl };
  },
});

export const upsertProject = action({
  args: upsertProjectArgs,
  returns: projectValidator,
  handler: async (ctx, args): Promise<HubProjectPublic> => {
    const existingRepoUrl: string | null = await ctx.runQuery(
      internal.hub.projects.getExistingRepoUrlForUpsert,
      {},
    );

    const candidateNormalized = normalizeRepoHttpUrl(args.repoUrl);
    const normalizedRepoUrl: string =
      existingRepoUrl && existingRepoUrl === candidateNormalized
        ? existingRepoUrl
        : await validateEmptyRepo(args.repoUrl);

    return await ctx.runMutation(internal.hub.projects.upsertProjectInternal, {
      name: args.name,
      description: args.description,
      url: args.url,
      repoUrl: normalizedRepoUrl,
      sponsorsUsed: args.sponsorsUsed,
    });
  },
});
