const SESSION_STORAGE_KEY = "builder_session_id";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `s_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

/** Stable per-device id used to associate a builder with their team. */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const id = createId();
    window.localStorage.setItem(SESSION_STORAGE_KEY, id);
    return id;
  } catch {
    return createId();
  }
}
