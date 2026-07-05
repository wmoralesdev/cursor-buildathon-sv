export function resolveCheckpointRepoUrls(snapshot: {
  repoUrls?: string[];
  repoUrl?: string;
}): string[] {
  if (snapshot.repoUrls && snapshot.repoUrls.length > 0) {
    return snapshot.repoUrls;
  }

  const legacy = snapshot.repoUrl?.trim();
  return legacy ? [legacy] : [];
}
