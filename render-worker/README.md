# buildathon-welcome-render

Cloudflare Worker + Container that renders the `/welcome` acceptance video with
Remotion and stores the resulting MP4 in R2 under a content-addressed key.

## Pieces

- `src/worker.ts` — HTTP entrypoint. Validates the multipart upload, computes
  the deterministic cache key, returns the cached MP4 download URL on hit, or
  spawns a render in the Container DO on miss.
- `src/container.ts` — `RenderContainer` Durable Object subclass (Cloudflare
  Containers). Forwards jobs to the Node server inside the container and
  caches the latest job status in DO storage.
- `container/src/server.ts` — Node HTTP server that runs Remotion (`bundle()`
  is pre-built into the image at `/app/bundle`) and uploads the resulting MP4
  to R2 via the S3 API.
- `Dockerfile` — Two-stage build: stage 1 bundles the Remotion entry from the
  monorepo, stage 2 produces a slim Node + Chromium runtime that serves
  renders.

## Required secrets / vars

Set on the Worker via `wrangler secret put` (the container picks them up
through `envVars` in `wrangler.jsonc`):

- `R2_ENDPOINT` — `https://<account>.r2.cloudflarestorage.com`
- `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` — R2 token scoped to the bucket
- `R2_BUCKET` — bucket name (matches `r2_buckets.bucket_name`)

## Local dev

```bash
pnpm --filter buildathon-welcome-render-worker dev
```

The build context for the Dockerfile is the repo root because stage 1 needs
access to `src/remotion/` and the shared canvas component.
