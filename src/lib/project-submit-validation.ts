import {
  isValidLinkedInProfile,
  isValidXProfile,
} from "../../convex/lib/profileValidation";

export { isValidLinkedInProfile, isValidXProfile };

export function isValidHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidDescription(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidMemberCount(count: number): boolean {
  return count === 4 || count === 5;
}
