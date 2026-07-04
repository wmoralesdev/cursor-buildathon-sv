import type { TranslationKey } from "../i18n/translations";

export const REPO_VALIDATION_PREFIX = "REPO_VALIDATION:";

const REPO_VALIDATION_KEYS: Record<string, TranslationKey> = {
  INVALID_URL: "hub.project.repoValidation.invalidUrl",
  UNSUPPORTED_HOST: "hub.project.repoValidation.unsupportedHost",
  NOT_FOUND: "hub.project.repoValidation.notFound",
  TOO_MANY_COMMITS: "hub.project.repoValidation.tooManyCommits",
  HAS_NON_README_FILES: "hub.project.repoValidation.hasNonReadmeFiles",
  API_ERROR: "hub.project.repoValidation.apiError",
};

function resolveRepoValidationCode(message: string): string | null {
  if (message.startsWith(REPO_VALIDATION_PREFIX)) {
    return message.slice(REPO_VALIDATION_PREFIX.length).trim();
  }

  const embeddedPrefixIndex = message.indexOf(REPO_VALIDATION_PREFIX);
  if (embeddedPrefixIndex !== -1) {
    const code = message
      .slice(embeddedPrefixIndex + REPO_VALIDATION_PREFIX.length)
      .split(/[\s\n\r]/)[0];
    return code || null;
  }

  if (/Repository URL must be a valid URL/i.test(message)) {
    return "INVALID_URL";
  }

  return null;
}

export function translateRepoValidationError(
  message: string,
  t: (key: TranslationKey) => string,
): string {
  const code = resolveRepoValidationCode(message);
  if (!code) {
    return message;
  }

  const key = REPO_VALIDATION_KEYS[code];
  return key ? t(key) : message;
}
