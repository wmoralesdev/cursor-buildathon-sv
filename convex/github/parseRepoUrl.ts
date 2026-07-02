export type ParsedGitHubRepo = {
  owner: string;
  repo: string;
  canonicalUrl: string;
};

const GITHUB_HOSTS = new Set(["github.com", "www.github.com"]);

export function parseGitHubRepoUrl(input: string): ParsedGitHubRepo {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Repository URL is required");
  }

  let url: URL;
  try {
    url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    throw new Error("Repository URL must be a valid URL");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Repository URL must use http or https");
  }

  const host = url.hostname.toLowerCase();
  if (!GITHUB_HOSTS.has(host)) {
    throw new Error("Only public GitHub repository URLs are supported");
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length < 2) {
    throw new Error("Use a repository URL like https://github.com/owner/repo");
  }

  const blocked = new Set(["settings", "pulls", "issues", "actions", "wiki", "security"]);
  if (blocked.has(segments[0]!)) {
    throw new Error("Use the repository root URL, not a sub-page");
  }

  const owner = segments[0]!;
  const repo = segments[1]!.replace(/\.git$/i, "");
  if (!owner || !repo) {
    throw new Error("Could not parse owner and repository name from URL");
  }

  return {
    owner,
    repo,
    canonicalUrl: `https://github.com/${owner}/${repo}`,
  };
}
