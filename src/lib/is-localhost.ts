/** True when the page is served from a local dev hostname (not production on a real domain). */
export function isLocalhostHostname(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
}
