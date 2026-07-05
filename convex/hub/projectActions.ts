import { action } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import type { HubProjectPublic } from "../lib/hub_projections";
import { hubSponsorIdValidator } from "../lib/hubSponsorIds";
import { normalizeProjectRepoUrls } from "../lib/hub_project_repo_urls";
import { normalizeRepoHttpUrl } from "../lib/repo_url";

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

const upsertProjectArgs = {
  name: v.string(),
  description: v.optional(v.string()),
  url: v.optional(v.string()),
  repoUrls: v.array(v.string()),
  sponsorsUsed: v.optional(v.array(hubSponsorIdValidator)),
};

export const validateRepoUrl = action({
  args: { repoUrl: v.string() },
  returns: v.object({ normalizedUrl: v.string() }),
  handler: async (_ctx, args) => {
    return { normalizedUrl: normalizeRepoHttpUrl(args.repoUrl) };
  },
});

export const upsertProject = action({
  args: upsertProjectArgs,
  returns: projectValidator,
  handler: async (ctx, args): Promise<HubProjectPublic> => {
    const normalizedRepoUrls = normalizeProjectRepoUrls(args.repoUrls);
    if (normalizedRepoUrls.length === 0) {
      throw new Error("At least one repository URL is required");
    }

    return await ctx.runMutation(internal.hub.projects.upsertProjectInternal, {
      name: args.name,
      description: args.description,
      url: args.url,
      repoUrls: normalizedRepoUrls,
      sponsorsUsed: args.sponsorsUsed,
    });
  },
});
