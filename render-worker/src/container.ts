import { Container } from "@cloudflare/containers";

import type { Env } from "./worker";

export type StartJobInput = {
  jobId: string;
  cacheKey: string;
  handle: string;
  aspectFormat: "post" | "story";
  imageDataUrl: string | null;
};

export type JobStatus = {
  jobId: string;
  status: "pending" | "rendering" | "uploading" | "ready" | "error";
  progress: number;
  downloadUrl?: string;
};

const STATE_KEY = "job-status";

export class RenderContainer extends Container<Env> {
  defaultPort = 8080;
  sleepAfter = "2m";

  override envVars = {
    NODE_ENV: "production",
  };

  async startJob(input: StartJobInput): Promise<void> {
    await this.ctx.storage.put<JobStatus>(STATE_KEY, {
      jobId: input.jobId,
      status: "pending",
      progress: 0,
    });

    await this.start();

    const response = await this.containerFetch(
      new Request("http://container/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      }),
    );

    if (!response.ok) {
      await this.ctx.storage.put<JobStatus>(STATE_KEY, {
        jobId: input.jobId,
        status: "error",
        progress: 0,
      });
    }
  }

  async getStatus(): Promise<JobStatus> {
    const stored = await this.ctx.storage.get<JobStatus>(STATE_KEY);
    if (stored && (stored.status === "ready" || stored.status === "error")) {
      return stored;
    }

    try {
      const res = await this.containerFetch(
        new Request("http://container/status"),
      );
      if (res.ok) {
        const fresh = (await res.json()) as JobStatus;
        await this.ctx.storage.put<JobStatus>(STATE_KEY, fresh);
        return fresh;
      }
    } catch {
      /* container may be sleeping; fall through */
    }

    return (
      stored ?? {
        jobId: "",
        status: "pending",
        progress: 0,
      }
    );
  }
}
