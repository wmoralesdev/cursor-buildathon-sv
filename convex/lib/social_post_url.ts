import { normalizeHttpUrl } from "./profileValidation";

export type SocialPlatform = "x" | "linkedin";

function hostnameOf(url: string): string {
  return new URL(url).hostname.replace(/^www\./i, "").toLowerCase();
}

export function inferSocialPlatform(url: string): SocialPlatform | null {
  try {
    const normalized = normalizeHttpUrl(url, "Post URL");
    const host = hostnameOf(normalized);
    if (host === "x.com" || host === "twitter.com") return "x";
    if (host === "linkedin.com" || host === "lnkd.in" || host.endsWith(".linkedin.com")) {
      return "linkedin";
    }
    return null;
  } catch {
    return null;
  }
}

export function validateSocialPostUrl(url: string): { platform: SocialPlatform; url: string } {
  const normalized = normalizeHttpUrl(url, "Post URL");
  const platform = inferSocialPlatform(normalized);
  if (!platform) {
    throw new Error("Only X (x.com, twitter.com) and LinkedIn URLs are allowed");
  }
  return { platform, url: normalized };
}
