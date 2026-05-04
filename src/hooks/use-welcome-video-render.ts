import { useCallback, useEffect, useRef, useState } from "react";

import type { WelcomeFormValues } from "../pages/buildathon-welcome-types";

const RENDER_API_BASE =
  (import.meta.env.VITE_RENDER_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "";

const FRIENDLY_ERROR =
  "We couldn’t finish your video. Try again in a moment.";

type RenderPhase = "idle" | "preparing" | "rendering" | "ready" | "error";

export type RenderState = {
  phase: RenderPhase;
  progress: number;
  downloadUrl: string | null;
  error: string | null;
};

const INITIAL_STATE: RenderState = {
  phase: "idle",
  progress: 0,
  downloadUrl: null,
  error: null,
};

const POLL_INTERVAL_MS = 1500;

export function useWelcomeVideoRender() {
  const [state, setState] = useState<RenderState>(INITIAL_STATE);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    return () => {
      cancelled.current = true;
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, []);

  const reset = useCallback(() => {
    cancelled.current = false;
    if (pollTimer.current) {
      clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
    setState(INITIAL_STATE);
  }, []);

  const start = useCallback(async (values: WelcomeFormValues) => {
    reset();
    setState({
      phase: "preparing",
      progress: 5,
      downloadUrl: null,
      error: null,
    });

    const form = new FormData();
    form.set("handle", values.handle);
    form.set("aspectFormat", values.aspectFormat);
    if (values.photo) form.set("photo", values.photo);

    let initial: RenderApiResponse;
    try {
      const res = await fetch(`${RENDER_API_BASE}/api/render`, {
        method: "POST",
        body: form,
      });
      if (!res.ok && res.status !== 202) {
        throw new Error(`unexpected status ${res.status}`);
      }
      initial = (await res.json()) as RenderApiResponse;
    } catch (error) {
      console.error("[render] submit failed", error);
      setState({
        phase: "error",
        progress: 0,
        downloadUrl: null,
        error: FRIENDLY_ERROR,
      });
      return;
    }

    if (initial.status === "ready" && initial.downloadUrl) {
      setState({
        phase: "ready",
        progress: 100,
        downloadUrl: absoluteUrl(initial.downloadUrl),
        error: null,
      });
      return;
    }

    setState({
      phase: "rendering",
      progress: Math.max(10, initial.progress ?? 10),
      downloadUrl: null,
      error: null,
    });

    pollJob(initial.jobId, setState, pollTimer, cancelled);
  }, [reset]);

  return { state, start, reset };
}

type RenderApiResponse = {
  jobId: string;
  status: "pending" | "rendering" | "uploading" | "ready" | "error";
  progress?: number;
  downloadUrl?: string;
};

function absoluteUrl(maybeRelative: string): string {
  if (/^https?:/i.test(maybeRelative)) return maybeRelative;
  if (RENDER_API_BASE) return `${RENDER_API_BASE}${maybeRelative}`;
  return maybeRelative;
}

function pollJob(
  jobId: string,
  setState: (updater: (prev: RenderState) => RenderState) => void,
  timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>,
  cancelledRef: React.MutableRefObject<boolean>,
): void {
  const poll = async () => {
    if (cancelledRef.current) return;
    try {
      const res = await fetch(
        `${RENDER_API_BASE}/api/render/job/${encodeURIComponent(jobId)}`,
      );
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = (await res.json()) as RenderApiResponse;

      if (cancelledRef.current) return;

      if (data.status === "ready" && data.downloadUrl) {
        setState(() => ({
          phase: "ready",
          progress: 100,
          downloadUrl: absoluteUrl(data.downloadUrl!),
          error: null,
        }));
        return;
      }

      if (data.status === "error") {
        setState(() => ({
          phase: "error",
          progress: 0,
          downloadUrl: null,
          error: FRIENDLY_ERROR,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        phase: "rendering",
        progress: Math.max(prev.progress, Math.min(99, data.progress ?? prev.progress)),
      }));
      timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
    } catch (error) {
      if (cancelledRef.current) return;
      console.error("[render] poll failed", error);
      timerRef.current = setTimeout(poll, POLL_INTERVAL_MS * 2);
    }
  };

  timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
}
