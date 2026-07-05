import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";
import {
  projectRepoUrlsEqual,
  resolveProjectRepoUrls,
} from "../lib/hub_project_repo_urls";

const integrityResultValidator = v.object({
  scanned: v.number(),
  needsMigration: v.number(),
  emptyWithLegacy: v.number(),
  alreadyOk: v.number(),
  bothEmpty: v.number(),
  problemProjectIds: v.array(v.id("hub_projects")),
});

export const verifyProjectRepoUrlsIntegrity = internalQuery({
  args: {},
  returns: integrityResultValidator,
  handler: async (ctx) => {
    const projects = await ctx.db.query("hub_projects").collect();

    let needsMigration = 0;
    let emptyWithLegacy = 0;
    let alreadyOk = 0;
    let bothEmpty = 0;
    const problemProjectIds: Array<(typeof projects)[number]["_id"]> = [];

    for (const project of projects) {
      const expected = resolveProjectRepoUrls(project);
      const stored = project.repoUrls;
      const legacy = project.repoUrl?.trim() ?? "";

      if (stored === undefined && legacy) {
        needsMigration += 1;
        problemProjectIds.push(project._id);
        continue;
      }

      if (stored !== undefined && stored.length === 0 && legacy) {
        emptyWithLegacy += 1;
        problemProjectIds.push(project._id);
        continue;
      }

      if (expected.length === 0) {
        bothEmpty += 1;
        continue;
      }

      if (stored !== undefined && projectRepoUrlsEqual(stored, expected)) {
        alreadyOk += 1;
        continue;
      }

      if (stored !== undefined && !projectRepoUrlsEqual(stored, expected)) {
        needsMigration += 1;
        problemProjectIds.push(project._id);
        continue;
      }

      bothEmpty += 1;
    }

    return {
      scanned: projects.length,
      needsMigration,
      emptyWithLegacy,
      alreadyOk,
      bothEmpty,
      problemProjectIds,
    };
  },
});

export const migrateProjectRepoUrls = internalMutation({
  args: { dryRun: v.optional(v.boolean()) },
  returns: v.object({
    scanned: v.number(),
    migrated: v.number(),
    alreadyMigrated: v.number(),
  }),
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? false;
    const projects = await ctx.db.query("hub_projects").collect();

    let migrated = 0;
    let alreadyMigrated = 0;

    for (const project of projects) {
      const expected = resolveProjectRepoUrls(project);
      const stored = project.repoUrls;

      const needsPatch =
        stored === undefined ||
        (stored.length === 0 && expected.length > 0) ||
        !projectRepoUrlsEqual(stored ?? [], expected);

      if (!needsPatch) {
        alreadyMigrated += 1;
        continue;
      }

      if (!dryRun) {
        await ctx.db.patch(project._id, { repoUrls: expected });
      }
      migrated += 1;
    }

    return {
      scanned: projects.length,
      migrated,
      alreadyMigrated,
    };
  },
});
