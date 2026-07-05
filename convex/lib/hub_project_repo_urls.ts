import type { Doc } from "../_generated/dataModel";
import { normalizeRepoHttpUrl } from "./repo_url";

type HubProjectRepoSource = Pick<Doc<"hub_projects">, "repoUrl" | "repoUrls">;

export function resolveProjectRepoUrls(project: HubProjectRepoSource): string[] {
  if (project.repoUrls !== undefined) {
    return project.repoUrls;
  }

  const legacy = project.repoUrl?.trim();
  return legacy ? [legacy] : [];
}

export function normalizeProjectRepoUrls(values: string[]): string[] {
  const normalized: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) continue;
    normalized.push(normalizeRepoHttpUrl(trimmed));
  }

  return normalized;
}

export function projectRepoUrlsEqual(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((url, index) => url === right[index]);
}

export function serializeProjectRepoUrls(repoUrls: string[]): string {
  return JSON.stringify(repoUrls);
}
