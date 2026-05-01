/** Theme rule: dark UI uses `darkSrc` when provided; otherwise `lightSrc`. */
export function buildThemedLogoSrc(
  resolvedTheme: string | undefined,
  lightSrc: string,
  darkSrc?: string,
): string {
  return resolvedTheme === "dark" && darkSrc ? darkSrc : lightSrc;
}
