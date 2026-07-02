import type { TranslationKey } from "../i18n/translations";

export type SocialPlatform = "x" | "linkedin";

type ValidationResult =
  | { ok: true; normalized: string }
  | { ok: false; messageKey: TranslationKey };

export function validateSocialPostUrlClient(
  platform: SocialPlatform,
  url: string,
): ValidationResult {
  const trimmed = url.trim();
  if (!trimmed) {
    return { ok: false, messageKey: "hub.social.error.urlRequired" };
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    return { ok: false, messageKey: "hub.social.error.urlInvalid" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, messageKey: "hub.social.error.urlInvalid" };
  }

  const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
  const pathname = parsed.pathname;

  if (platform === "x") {
    const isXHost =
      host === "x.com" || host === "twitter.com" || host === "mobile.twitter.com";
    if (!isXHost) {
      return { ok: false, messageKey: "hub.social.error.xHost" };
    }
    const isPost =
      /^\/[^/]+\/status\/\d+/i.test(pathname) ||
      /^\/i\/web\/status\/\d+/i.test(pathname);
    if (!isPost) {
      return { ok: false, messageKey: "hub.social.error.xPostPath" };
    }
    return { ok: true, normalized: parsed.toString() };
  }

  if (host === "lnkd.in") {
    if (pathname.length <= 1) {
      return { ok: false, messageKey: "hub.social.error.linkedinPostPath" };
    }
    return { ok: true, normalized: parsed.toString() };
  }

  const isLinkedInHost = host === "linkedin.com" || host.endsWith(".linkedin.com");
  if (!isLinkedInHost) {
    return { ok: false, messageKey: "hub.social.error.linkedinHost" };
  }

  if (/^\/in\//i.test(pathname)) {
    return { ok: false, messageKey: "hub.social.error.linkedinProfile" };
  }

  const isPost =
    pathname.includes("/feed/update/") ||
    pathname.includes("/posts/") ||
    pathname.includes("/pulse/") ||
    /\/activity-\d+/i.test(pathname);

  if (!isPost) {
    return { ok: false, messageKey: "hub.social.error.linkedinPostPath" };
  }

  return { ok: true, normalized: parsed.toString() };
}
