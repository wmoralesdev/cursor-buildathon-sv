export type SocialPlatform = "x" | "linkedin";

function parseUrl(value: string): URL | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed;
  } catch {
    return null;
  }
}

function hostnameOf(parsed: URL): string {
  return parsed.hostname.replace(/^www\./i, "").toLowerCase();
}

export function inferSocialPlatformFromUrl(value: string): SocialPlatform | null {
  const parsed = parseUrl(value);
  if (!parsed) return null;
  const host = hostnameOf(parsed);
  if (host === "x.com" || host === "twitter.com") return "x";
  if (host === "linkedin.com" || host === "lnkd.in" || host.endsWith(".linkedin.com")) {
    return "linkedin";
  }
  return null;
}

function extractLinkedInActivityUrn(value: string): string | null {
  const urnMatch = value.match(/urn:li:(?:activity|share|ugcPost):[\w-]+/i);
  if (urnMatch) return urnMatch[0];

  const activityMatch = value.match(/activity[-:](\d{8,})/i);
  if (activityMatch?.[1]) {
    return `urn:li:activity:${activityMatch[1]}`;
  }

  return null;
}

export function getSocialPostEmbedUrl(value: string): string | null {
  const platform = inferSocialPlatformFromUrl(value);
  const parsed = parseUrl(value);
  if (!platform || !parsed) return null;

  if (platform === "x") {
    return `https://platform.twitter.com/embed/Tweet.html?url=${encodeURIComponent(parsed.toString())}&theme=dark&dnt=true`;
  }

  const urn = extractLinkedInActivityUrn(parsed.toString());
  if (!urn) return null;
  return `https://www.linkedin.com/embed/feed/update/${encodeURIComponent(urn)}`;
}

export function socialPlatformLabel(platform: SocialPlatform): string {
  return platform === "x" ? "X" : "LinkedIn";
}
