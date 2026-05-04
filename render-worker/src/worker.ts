import { RenderContainer } from "./container";
import { buildCacheKey } from "./cache-key";

export { RenderContainer };

export interface Env {
  VIDEO_BUCKET: R2Bucket;
  RENDER_CONTAINER: DurableObjectNamespace<RenderContainer>;
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Max-Age": "86400",
};

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...CORS_HEADERS,
      ...(init.headers ?? {}),
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (url.pathname === "/api/render" && request.method === "POST") {
      return handleRender(request, env);
    }

    const jobMatch = url.pathname.match(/^\/api\/render\/job\/([^/]+)$/);
    if (jobMatch && request.method === "GET") {
      return handleJobStatus(jobMatch[1], env);
    }

    const downloadMatch = url.pathname.match(
      /^\/api\/render\/download\/([\w-]+\.mp4)$/,
    );
    if (downloadMatch && request.method === "GET") {
      return handleDownload(downloadMatch[1], env);
    }

    return new Response("Not found", { status: 404, headers: CORS_HEADERS });
  },
};

async function handleRender(request: Request, env: Env): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse({ error: "invalid_request" }, { status: 400 });
  }

  const handle = String(form.get("handle") ?? "").trim();
  const aspectFormat = String(form.get("aspectFormat") ?? "post");
  if (aspectFormat !== "post" && aspectFormat !== "story") {
    return jsonResponse({ error: "invalid_format" }, { status: 400 });
  }
  if (!handle) {
    return jsonResponse({ error: "missing_handle" }, { status: 400 });
  }

  const photo = form.get("photo") as File | null;
  let imageBytes: ArrayBuffer | null = null;
  let imageContentType: string | null = null;
  if (photo && typeof photo === "object" && "arrayBuffer" in photo && photo.size > 0) {
    if (photo.size > 5 * 1024 * 1024) {
      return jsonResponse({ error: "image_too_large" }, { status: 400 });
    }
    imageBytes = await photo.arrayBuffer();
    imageContentType = photo.type || "image/jpeg";
  }

  const cacheKey = await buildCacheKey({
    handle,
    aspectFormat,
    imageBytes,
  });

  const jobId = cacheKey
    .replace(/^welcome-videos\//, "")
    .replace(/\.mp4$/, "");

  const head = await env.VIDEO_BUCKET.head(cacheKey);
  if (head) {
    return jsonResponse({
      jobId,
      status: "ready",
      progress: 100,
      downloadUrl: downloadUrlFor(request, jobId),
    });
  }

  const container = env.RENDER_CONTAINER.get(
    env.RENDER_CONTAINER.idFromName(jobId),
  );

  let imageDataUrl: string | null = null;
  if (imageBytes && imageContentType) {
    imageDataUrl = `data:${imageContentType};base64,${arrayBufferToBase64(
      imageBytes,
    )}`;
  }

  await container.startJob({
    jobId,
    cacheKey,
    handle,
    aspectFormat,
    imageDataUrl,
  });

  return jsonResponse(
    {
      jobId,
      status: "rendering",
      progress: 0,
    },
    { status: 202 },
  );
}

async function handleJobStatus(jobId: string, env: Env): Promise<Response> {
  if (!/^[a-f0-9]{8,}$/i.test(jobId)) {
    return jsonResponse({ error: "invalid_job_id" }, { status: 400 });
  }

  const cacheKey = `welcome-videos/${jobId}.mp4`;
  const head = await env.VIDEO_BUCKET.head(cacheKey);
  if (head) {
    return jsonResponse({
      jobId,
      status: "ready",
      progress: 100,
      downloadUrl: `/api/render/download/${jobId}.mp4`,
    });
  }

  const container = env.RENDER_CONTAINER.get(
    env.RENDER_CONTAINER.idFromName(jobId),
  );
  const status = await container.getStatus();
  return jsonResponse(status);
}

async function handleDownload(filename: string, env: Env): Promise<Response> {
  const key = `welcome-videos/${filename}`;
  const obj = await env.VIDEO_BUCKET.get(key);
  if (!obj) {
    return new Response("Not found", { status: 404, headers: CORS_HEADERS });
  }
  const headers = new Headers(CORS_HEADERS);
  headers.set("content-type", "video/mp4");
  headers.set(
    "content-disposition",
    `attachment; filename="cursor-buildathon-welcome.mp4"`,
  );
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(obj.body, { headers });
}

function downloadUrlFor(request: Request, jobId: string): string {
  const url = new URL(request.url);
  return `${url.origin}/api/render/download/${jobId}.mp4`;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, Math.min(i + chunk, bytes.length)),
    );
  }
  return btoa(binary);
}
