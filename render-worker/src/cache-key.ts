export const CACHE_KEY_VERSION = "v1";

export type RenderInputs = {
  handle: string;
  aspectFormat: "post" | "story";
  imageBytes: ArrayBuffer | null;
};

function normalizeHandle(handle: string): string {
  const trimmed = handle.trim().toLowerCase();
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

async function sha256Hex(data: ArrayBuffer | string): Promise<string> {
  const buf =
    typeof data === "string"
      ? (new TextEncoder().encode(data).buffer as ArrayBuffer)
      : data;
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function buildCacheKey(inputs: RenderInputs): Promise<string> {
  const imageHash = inputs.imageBytes
    ? await sha256Hex(inputs.imageBytes)
    : "no-image";
  const composite = [
    CACHE_KEY_VERSION,
    inputs.aspectFormat,
    normalizeHandle(inputs.handle),
    imageHash,
  ].join("|");
  const hash = await sha256Hex(composite);
  return `welcome-videos/${hash}.mp4`;
}
