const MAX_LENGTH = 48;

/**
 * Produce a slug safe for filenames (Windows/macOS/Linux), from a social/app handle.
 */
export function sanitizeHandleForFilename(raw: string): string {
  const trimmed = raw.trim().replace(/^@+/, "").toLowerCase();
  let s = trimmed
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (s.length > MAX_LENGTH) {
    s = s.slice(0, MAX_LENGTH).replace(/-+$/, "");
  }

  return s.length > 0 ? s : "guest";
}

export function welcomeVideoDownloadBasename(kind: "post" | "story", handleRaw: string): string {
  const slug = sanitizeHandleForFilename(handleRaw);
  return `cursor-buildathon-welcome-${slug}-${kind}.mp4`;
}
