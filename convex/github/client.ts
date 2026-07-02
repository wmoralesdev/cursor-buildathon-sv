export type GitHubRepo = {
  created_at: string;
  pushed_at: string | null;
  fork: boolean;
  default_branch: string;
  private: boolean;
};

export type GitHubCommitListItem = {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
  author: { login: string } | null;
};

export type GitHubCommitDetail = {
  stats?: { additions: number; deletions: number; total: number };
};

export type GitHubContributor = {
  login: string;
};

function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN?.trim();
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function githubFetch<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: githubHeaders(),
  });

  if (response.status === 404) {
    throw new Error("Repository not found — it must be public and accessible");
  }
  if (response.status === 403) {
    throw new Error("GitHub API rate limit reached — try again in a few minutes");
  }
  if (!response.ok) {
    throw new Error(`GitHub API error (${response.status})`);
  }

  return (await response.json()) as T;
}

export async function fetchRepo(owner: string, repo: string): Promise<GitHubRepo> {
  const data = await githubFetch<GitHubRepo>(`/repos/${owner}/${repo}`);
  if (data.private) {
    throw new Error("Repository must be public");
  }
  return data;
}

export async function fetchContributors(owner: string, repo: string): Promise<string[]> {
  const data = await githubFetch<GitHubContributor[]>(
    `/repos/${owner}/${repo}/contributors?per_page=100`,
  );
  return data.map((c) => c.login).filter(Boolean);
}

export async function fetchCommitsInRange(
  owner: string,
  repo: string,
  branch: string,
  options: { since?: string; until?: string; maxPages?: number },
): Promise<GitHubCommitListItem[]> {
  const maxPages = options.maxPages ?? 5;
  const commits: GitHubCommitListItem[] = [];
  let page = 1;

  while (page <= maxPages) {
    const params = new URLSearchParams({
      sha: branch,
      per_page: "100",
      page: String(page),
    });
    if (options.since) params.set("since", options.since);
    if (options.until) params.set("until", options.until);

    const batch = await githubFetch<GitHubCommitListItem[]>(
      `/repos/${owner}/${repo}/commits?${params.toString()}`,
    );
    if (batch.length === 0) break;
    commits.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }

  return commits;
}

export async function fetchCommitDetail(
  owner: string,
  repo: string,
  sha: string,
): Promise<GitHubCommitDetail> {
  return await githubFetch<GitHubCommitDetail>(`/repos/${owner}/${repo}/commits/${sha}`);
}

export function toRecentCommits(
  commits: GitHubCommitListItem[],
  limit = 10,
): { sha: string; message: string; author: string; date: string }[] {
  return commits.slice(0, limit).map((item) => ({
    sha: item.sha.slice(0, 7),
    message: item.commit.message.split("\n")[0]!.slice(0, 120),
    author: item.author?.login ?? item.commit.author.name,
    date: item.commit.author.date,
  }));
}

export function commitAuthorName(item: GitHubCommitListItem): string {
  return item.author?.login ?? item.commit.author.name;
}
