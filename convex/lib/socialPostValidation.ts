import { normalizeHttpUrl } from "./profileValidation";

function hostnameKey(hostname: string): string {
  return hostname.replace(/^www\./i, "").toLowerCase();
}

function isLinkedInHost(hostname: string): boolean {
  const host = hostnameKey(hostname);
  return host === "linkedin.com" || host.endsWith(".linkedin.com");
}

function isXHost(hostname: string): boolean {
  const host = hostnameKey(hostname);
  return host === "x.com" || host === "twitter.com" || host === "mobile.twitter.com";
}

function isXPostPath(pathname: string): boolean {
  return (
    /^\/[^/]+\/status\/\d+/i.test(pathname) ||
    /^\/i\/web\/status\/\d+/i.test(pathname)
  );
}

function isLinkedInPostPath(pathname: string, hostname: string): boolean {
  if (hostnameKey(hostname) === "lnkd.in") {
    return pathname.length > 1;
  }

  return (
    pathname.includes("/feed/update/") ||
    pathname.includes("/posts/") ||
    pathname.includes("/pulse/") ||
    /\/activity-\d+/i.test(pathname)
  );
}

export function validateSocialPostUrl(platform: "x" | "linkedin", url: string): string {
  const normalized = normalizeHttpUrl(url, "Post URL");
  const parsed = new URL(normalized);
  const host = hostnameKey(parsed.hostname);
  const pathname = parsed.pathname;

  if (platform === "x") {
    if (!isXHost(parsed.hostname)) {
      throw new Error("X posts must use x.com or twitter.com URLs");
    }
    if (!isXPostPath(pathname)) {
      throw new Error("X URL must be a post link (include /status/...)");
    }
    return normalized;
  }

  if (host === "lnkd.in") {
    return normalized;
  }

  if (!isLinkedInHost(parsed.hostname)) {
    throw new Error("LinkedIn posts must use linkedin.com or lnkd.in URLs");
  }

  if (/^\/in\//i.test(pathname)) {
    throw new Error("LinkedIn profile links are not allowed — use a post URL");
  }

  if (!isLinkedInPostPath(pathname, parsed.hostname)) {
    throw new Error("LinkedIn URL must be a post link (/posts/..., /feed/update/..., or lnkd.in)");
  }

  return normalized;
}
