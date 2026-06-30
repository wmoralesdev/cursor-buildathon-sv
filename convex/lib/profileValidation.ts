export function trimOrThrow(value: string, label: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${label} is required`);
  }
  return trimmed;
}

export function normalizeHttpUrl(value: string, label: string): string {
  const trimmed = trimOrThrow(value, label);
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new Error(`${label} must be a valid URL`);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`${label} must be a valid URL`);
  }

  return parsed.toString();
}

const LINKEDIN_SLUG_PATTERN = /^[\w.-]+$/i;

function isLinkedInHost(hostname: string): boolean {
  const host = hostname.replace(/^www\./i, "").toLowerCase();
  return host === "linkedin.com" || host.endsWith(".linkedin.com");
}

function linkedInProfileUrl(slug: string): string {
  return `https://www.linkedin.com/in/${encodeURIComponent(slug)}`;
}

function extractLinkedInSlug(pathname: string): string | null {
  const match = pathname.match(/\/in\/([^/?#]+)/i);
  if (!match?.[1]) return null;
  return decodeURIComponent(match[1]);
}

export function normalizeXProfile(value: string): string {
  const trimmed = trimOrThrow(value, "X profile");
  if (trimmed.startsWith("@")) {
    const handle = trimmed.slice(1).trim();
    if (!handle) {
      throw new Error("X profile handle is required");
    }
    return `https://x.com/${handle}`;
  }

  if (/^[\w.-]+$/i.test(trimmed) && !trimmed.includes("/")) {
    return `https://x.com/${trimmed}`;
  }

  const normalized = normalizeHttpUrl(trimmed, "X profile");
  const host = new URL(normalized).hostname.replace(/^www\./i, "").toLowerCase();
  if (host !== "x.com" && host !== "twitter.com") {
    throw new Error("X profile must be an x.com or twitter.com URL");
  }
  return normalized;
}

export function normalizeLinkedInProfile(value: string): string {
  const trimmed = trimOrThrow(value, "LinkedIn profile");

  if (LINKEDIN_SLUG_PATTERN.test(trimmed) && !trimmed.includes("/")) {
    return linkedInProfileUrl(trimmed);
  }

  const pathMatch = trimmed.match(/^\/?in\/([^/?#]+)/i);
  if (pathMatch?.[1]) {
    return linkedInProfileUrl(pathMatch[1]);
  }

  const normalized = normalizeHttpUrl(trimmed, "LinkedIn profile");
  const parsed = new URL(normalized);

  if (!isLinkedInHost(parsed.hostname)) {
    throw new Error("LinkedIn profile must be a linkedin.com URL");
  }

  const slug = extractLinkedInSlug(parsed.pathname);
  if (!slug) {
    throw new Error("LinkedIn profile must include /in/");
  }

  return linkedInProfileUrl(slug);
}

export function isValidXProfile(value: string): boolean {
  try {
    normalizeXProfile(value);
    return true;
  } catch {
    return false;
  }
}

export function isValidLinkedInProfile(value: string): boolean {
  try {
    normalizeLinkedInProfile(value);
    return true;
  } catch {
    return false;
  }
}

export function validateTeamProfile(input: {
  name: string;
  xProfile: string;
  linkedInProfile: string;
}): string | null {
  try {
    trimOrThrow(input.name, "Name");
    normalizeXProfile(input.xProfile);
    normalizeLinkedInProfile(input.linkedInProfile);
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : "Invalid profile";
  }
}
