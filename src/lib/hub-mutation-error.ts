import type { TranslationKey } from "../i18n/translations";

const SERVER_MESSAGE_KEYS: Record<string, TranslationKey> = {
  "Project name is required": "hub.project.error.nameRequired",
  "Description is required": "hub.project.error.descriptionRequired",
  "Project URL is required": "hub.project.error.urlRequired",
  "Project URL must be a valid URL": "hub.project.error.urlInvalid",
  "Repository URL is required": "hub.project.error.repoRequired",
  "Repository URL must be a valid URL": "hub.project.error.repoInvalid",
  "Only public GitHub repository URLs are supported": "hub.project.error.repoGithubOnly",
  "Only the team captain can link the repository": "hub.project.error.repoCaptainOnly",
  "Link a repository first": "hub.repo.error.linkFirst",
  "X posts must use x.com or twitter.com URLs": "hub.social.error.xHost",
  "X URL must be a post link (include /status/...)": "hub.social.error.xPostPath",
  "LinkedIn posts must use linkedin.com or lnkd.in URLs": "hub.social.error.linkedinHost",
  "LinkedIn profile links are not allowed — use a post URL": "hub.social.error.linkedinProfile",
  "LinkedIn URL must be a post link (/posts/..., /feed/update/..., or lnkd.in)":
    "hub.social.error.linkedinPostPath",
  "Post URL is required": "hub.social.error.urlRequired",
  "Post URL must be a valid URL": "hub.social.error.urlInvalid",
};

function extractServerMessage(message: string): string {
  const uncaught = message.match(/Uncaught Error: ([^\n]+)/);
  if (uncaught?.[1]) return uncaught[1];
  return message.split("\n")[0] ?? message;
}

export function formatHubMutationError(
  err: unknown,
  fallbackKey: TranslationKey,
  t: (key: TranslationKey) => string,
): string {
  if (!(err instanceof Error)) return t(fallbackKey);
  const message = err.message;
  if (message.includes("ReturnsValidationError") || /\bServer Error\b/.test(message)) {
    return t("hub.error.serverValidation");
  }
  const serverMessage = extractServerMessage(message);
  const key = SERVER_MESSAGE_KEYS[serverMessage];
  return key ? t(key) : serverMessage;
}
