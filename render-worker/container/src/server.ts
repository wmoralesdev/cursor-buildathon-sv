import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { renderMedia, selectComposition } from "@remotion/renderer";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const PORT = Number(process.env.PORT ?? 8080);
const BUNDLE_DIR = process.env.REMOTION_BUNDLE_DIR ?? "/app/bundle";

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET;

type StartJobInput = {
  jobId: string;
  cacheKey: string;
  handle: string;
  aspectFormat: "post" | "story";
  imageDataUrl: string | null;
};

type JobStatus = {
  jobId: string;
  status: "pending" | "rendering" | "uploading" | "ready" | "error";
  progress: number;
  downloadUrl?: string;
};

const state: { current: JobStatus | null } = { current: null };

const s3 =
  R2_ENDPOINT && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET
    ? new S3Client({
        region: "auto",
        endpoint: R2_ENDPOINT,
        credentials: {
          accessKeyId: R2_ACCESS_KEY_ID,
          secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
      })
    : null;

createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/start") {
      const body = await readJson<StartJobInput>(req);
      respondJson(res, 202, { ok: true });
      void runJob(body).catch((error) => {
        console.error("[render-job] failed", error);
        state.current = {
          jobId: body.jobId,
          status: "error",
          progress: state.current?.progress ?? 0,
        };
      });
      return;
    }

    if (req.method === "GET" && req.url === "/status") {
      respondJson(
        res,
        200,
        state.current ?? {
          jobId: "",
          status: "pending",
          progress: 0,
        },
      );
      return;
    }

    if (req.method === "GET" && req.url === "/healthz") {
      respondJson(res, 200, { ok: true });
      return;
    }

    res.writeHead(404).end();
  } catch (error) {
    console.error("[server] error", error);
    respondJson(res, 500, { error: "internal_error" });
  }
}).listen(PORT, () => {
  console.log(`render container listening on :${PORT}`);
});

async function runJob(input: StartJobInput): Promise<void> {
  state.current = {
    jobId: input.jobId,
    status: "rendering",
    progress: 0,
  };

  const compositionId =
    input.aspectFormat === "story" ? "welcome-card-story" : "welcome-card-post";

  const composition = await selectComposition({
    serveUrl: BUNDLE_DIR,
    id: compositionId,
    inputProps: {
      handle: input.handle,
      imageUrl: input.imageDataUrl,
      aspectFormat: input.aspectFormat,
    },
  });

  const workDir = await mkdtemp(join(tmpdir(), "render-"));
  const outFile = join(workDir, `${input.jobId}.mp4`);

  try {
    await renderMedia({
      composition,
      serveUrl: BUNDLE_DIR,
      codec: "h264",
      outputLocation: outFile,
      inputProps: {
        handle: input.handle,
        imageUrl: input.imageDataUrl,
        aspectFormat: input.aspectFormat,
      },
      onProgress: ({ progress }) => {
        state.current = {
          jobId: input.jobId,
          status: "rendering",
          progress: Math.min(95, Math.round(progress * 95)),
        };
      },
      chromiumOptions: {
        gl: "angle",
      },
      logLevel: "warn",
    });

    state.current = {
      jobId: input.jobId,
      status: "uploading",
      progress: 96,
    };

    if (!s3 || !R2_BUCKET) {
      throw new Error("R2 storage is not configured");
    }
    const body = await readFile(outFile);
    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: input.cacheKey,
        Body: body,
        ContentType: "video/mp4",
      }),
    );

    state.current = {
      jobId: input.jobId,
      status: "ready",
      progress: 100,
      downloadUrl: `/api/render/download/${input.jobId}.mp4`,
    };
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

function readJson<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")) as T);
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function respondJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}
