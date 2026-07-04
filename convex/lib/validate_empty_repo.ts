import {
  isReadmeFileName,
  parseRepoUrl,
  repoValidationError,
  type ParsedRepoUrl,
} from "./repo_url";

type FetchJson = (url: string, init?: RequestInit) => Promise<Response>;

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "cursor-hack-sv",
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function gitlabHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "User-Agent": "cursor-hack-sv",
  };
  const token = process.env.GITLAB_TOKEN?.trim();
  if (token) {
    headers["PRIVATE-TOKEN"] = token;
  }
  return headers;
}

function assertRootEntriesAreReadmeOnly(
  entries: Array<{ name?: string; type?: string }>,
): void {
  for (const entry of entries) {
    const name = entry.name ?? "";
    if (entry.type === "dir" || entry.type === "tree") {
      throw repoValidationError("HAS_NON_README_FILES");
    }
    if (entry.type === "file" || entry.type === "blob" || !entry.type) {
      if (!isReadmeFileName(name)) {
        throw repoValidationError("HAS_NON_README_FILES");
      }
    }
  }
}


async function validateGithubRepo(
  fetchImpl: FetchJson,
  parsed: ParsedRepoUrl,
): Promise<void> {
  const headers = githubHeaders();
  const repoBase = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`;

  const repoCheck = await fetchImpl(`${repoBase}`, { headers });
  if (repoCheck.status === 404) {
    throw repoValidationError("NOT_FOUND");
  }
  if (!repoCheck.ok) {
    throw repoValidationError("API_ERROR");
  }

  const commitsResponse = await fetchImpl(`${repoBase}/commits?per_page=2`, { headers });
  if (commitsResponse.status === 409) {
    return;
  }
  if (!commitsResponse.ok) {
    throw repoValidationError("API_ERROR");
  }

  const commits = (await commitsResponse.json()) as unknown;
  if (!Array.isArray(commits)) {
    throw repoValidationError("API_ERROR");
  }

  if (commits.length === 0) {
    return;
  }
  if (commits.length > 1) {
    throw repoValidationError("TOO_MANY_COMMITS");
  }

  const contentsResponse = await fetchImpl(`${repoBase}/contents/`, { headers });
  if (contentsResponse.status === 404) {
    return;
  }
  if (!contentsResponse.ok) {
    throw repoValidationError("API_ERROR");
  }

  const contents = (await contentsResponse.json()) as unknown;
  if (!Array.isArray(contents)) {
    throw repoValidationError("API_ERROR");
  }

  assertRootEntriesAreReadmeOnly(contents as Array<{ name?: string; type?: string }>);
}

async function validateGitlabRepo(
  fetchImpl: FetchJson,
  parsed: ParsedRepoUrl,
): Promise<void> {
  const headers = gitlabHeaders();
  const encodedPath = encodeURIComponent(parsed.projectPath);
  const projectUrl = `https://gitlab.com/api/v4/projects/${encodedPath}`;

  const projectResponse = await fetchImpl(projectUrl, { headers });
  if (projectResponse.status === 404) {
    throw repoValidationError("NOT_FOUND");
  }
  if (!projectResponse.ok) {
    throw repoValidationError("API_ERROR");
  }

  const project = (await projectResponse.json()) as { id?: number };
  const projectId = project.id;
  if (typeof projectId !== "number") {
    throw repoValidationError("API_ERROR");
  }

  const commitsResponse = await fetchImpl(
    `https://gitlab.com/api/v4/projects/${projectId}/repository/commits?per_page=2`,
    { headers },
  );
  if (!commitsResponse.ok) {
    throw repoValidationError("API_ERROR");
  }

  const commits = (await commitsResponse.json()) as unknown;
  if (!Array.isArray(commits)) {
    throw repoValidationError("API_ERROR");
  }

  if (commits.length === 0) {
    return;
  }
  if (commits.length > 1) {
    throw repoValidationError("TOO_MANY_COMMITS");
  }

  const treeResponse = await fetchImpl(
    `https://gitlab.com/api/v4/projects/${projectId}/repository/tree?path=&per_page=100`,
    { headers },
  );
  if (!treeResponse.ok) {
    throw repoValidationError("API_ERROR");
  }

  const tree = (await treeResponse.json()) as unknown;
  if (!Array.isArray(tree)) {
    throw repoValidationError("API_ERROR");
  }

  assertRootEntriesAreReadmeOnly(tree as Array<{ name?: string; type?: string }>);
}

export async function validateEmptyRepo(
  repoUrl: string,
  fetchImpl: FetchJson = fetch,
): Promise<string> {
  const parsed = parseRepoUrl(repoUrl);

  if (parsed.host === "github") {
    await validateGithubRepo(fetchImpl, parsed);
  } else {
    await validateGitlabRepo(fetchImpl, parsed);
  }

  return parsed.normalizedUrl;
}
