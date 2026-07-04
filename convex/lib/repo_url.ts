import { normalizeHttpUrl } from "./profileValidation";

export type RepoHost = "github" | "gitlab";

export type ParsedRepoUrl = {
  host: RepoHost;
  normalizedUrl: string;
  owner: string;
  repo: string;
  /** GitLab namespace path, e.g. `group/sub/project`. Same as `owner/repo` for GitHub. */
  projectPath: string;
};

export type RepoValidationErrorCode =
  | "INVALID_URL"
  | "UNSUPPORTED_HOST"
  | "NOT_FOUND"
  | "TOO_MANY_COMMITS"
  | "HAS_NON_README_FILES"
  | "API_ERROR";

export const REPO_VALIDATION_PREFIX = "REPO_VALIDATION:";

export function repoValidationError(code: RepoValidationErrorCode): Error {
  return new Error(`${REPO_VALIDATION_PREFIX}${code}`);
}

export function isReadmeFileName(name: string): boolean {
  const base = name.trim();
  return /^readme(\.(md|txt|rst|adoc|markdown))?$/i.test(base);
}

function stripGitSuffix(segment: string): string {
  return segment.endsWith(".git") ? segment.slice(0, -4) : segment;
}

function isGithubHost(hostname: string): boolean {
  const host = hostname.replace(/^www\./i, "").toLowerCase();
  return host === "github.com";
}

function isGitlabHost(hostname: string): boolean {
  const host = hostname.replace(/^www\./i, "").toLowerCase();
  return host === "gitlab.com";
}

export function parseRepoUrl(value: string): ParsedRepoUrl {
  const normalized = normalizeHttpUrl(value, "Repository URL");
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw repoValidationError("INVALID_URL");
  }

  const segments = parsed.pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment));

  if (segments.length < 2) {
    throw repoValidationError("INVALID_URL");
  }

  const blockedSegments = new Set(["tree", "blob", "commits", "pull", "issues", "settings"]);
  if (blockedSegments.has(segments[1]?.toLowerCase() ?? "")) {
    throw repoValidationError("INVALID_URL");
  }

  if (isGithubHost(parsed.hostname)) {
    const owner = segments[0] ?? "";
    const repo = stripGitSuffix(segments[1] ?? "");
    if (!owner || !repo) {
      throw repoValidationError("INVALID_URL");
    }

    return {
      host: "github",
      normalizedUrl: `https://github.com/${owner}/${repo}`,
      owner,
      repo,
      projectPath: `${owner}/${repo}`,
    };
  }

  if (isGitlabHost(parsed.hostname)) {
    const projectSegments = segments.map(stripGitSuffix);
    const projectPath = projectSegments.join("/");
    const repo = projectSegments[projectSegments.length - 1] ?? "";
    const owner = projectSegments[0] ?? "";
    if (!owner || !repo) {
      throw repoValidationError("INVALID_URL");
    }

    return {
      host: "gitlab",
      normalizedUrl: `https://gitlab.com/${projectPath}`,
      owner,
      repo,
      projectPath,
    };
  }

  throw repoValidationError("UNSUPPORTED_HOST");
}

export function normalizeRepoHttpUrl(value: string): string {
  return parseRepoUrl(value).normalizedUrl;
}
