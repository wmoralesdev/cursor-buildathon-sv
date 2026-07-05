import { normalizeHttpUrl } from "./profileValidation";

export function normalizeRepoHttpUrl(value: string): string {
  return normalizeHttpUrl(value, "Repository URL");
}
