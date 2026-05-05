import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
} from "react";

import {
  canRenderMediaOnWeb,
  renderMediaOnWeb,
} from "@remotion/web-renderer";

import {
  DESIGN_DIMENSIONS,
  EXPORT_DIMENSIONS,
  EXPORT_VIDEO_DURATION_FRAMES,
  VIDEO_FPS,
} from "../components/welcome-card-canvas-spec";
import type { AspectFormat, WelcomeFormValues } from "../pages/buildathon-welcome-types";
import { WelcomeCardComposition } from "../remotion/welcome-card-composition";

const UNSUPPORTED_BROWSER =
  "This browser can't create the video. Try the latest Chrome or Edge, or another device.";

const RENDER_FAILED = "Couldn't finish. Close other tabs and try again.";

const EXPORT_SEQUENCE: readonly AspectFormat[] = ["post", "story"];

type RenderPhase = "idle" | "preparing" | "rendering" | "ready" | "error";

export type RenderState = {
  phase: RenderPhase;
  progress: number;
  downloads: { post: string; story: string } | null;
  error: string | null;
};

const INITIAL_STATE: RenderState = {
  phase: "idle",
  progress: 0,
  downloads: null,
  error: null,
};

export function useWelcomeVideoRender() {
  const [state, setState] = useState<RenderState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);
  const blobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
      revokeAllBlobUrls(blobUrlsRef);
    };
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    revokeAllBlobUrls(blobUrlsRef);
    setState(INITIAL_STATE);
  }, []);

  const start = useCallback(
    async (values: WelcomeFormValues) => {
      reset();
      if (!String(values.handle ?? "").trim() || !values.photo) {
        return;
      }
      setState({
        phase: "preparing",
        progress: 3,
        downloads: null,
        error: null,
      });

      const abortController = new AbortController();
      abortRef.current = abortController;

      const imageUrl = values.photo ? await fileToDataUrl(values.photo) : null;

      if (abortController.signal.aborted) {
        return;
      }

      setState({
        phase: "rendering",
        progress: 8,
        downloads: null,
        error: null,
      });

      const urlsThisRun: string[] = [];

      document.documentElement.setAttribute("data-welcome-video-export", "true");
      try {
        for (let i = 0; i < EXPORT_SEQUENCE.length; i++) {
          const aspectFormat = EXPORT_SEQUENCE[i];
          const dims = await resolveExportDimensions(aspectFormat);
          if (abortController.signal.aborted) {
            revokeUrlsList(urlsThisRun);
            return;
          }
          if (dims === null) {
            revokeUrlsList(urlsThisRun);
            setState({
              phase: "error",
              progress: 0,
              downloads: null,
              error: UNSUPPORTED_BROWSER,
            });
            return;
          }

          const blob = await renderWelcomeMp4Blob({
            aspectFormat,
            handle: values.handle,
            imageUrl,
            isLeadOrganizer: values.isOrganizer,
            exportW: dims.exportW,
            exportH: dims.exportH,
            signal: abortController.signal,
            onLocalProgress: (local) => {
              if (abortController.signal.aborted) return;
              const combined =
                8 + Math.round(((i + local) / EXPORT_SEQUENCE.length) * 92);
              setState((prev) => ({
                ...prev,
                phase: "rendering",
                progress: Math.min(99, Math.max(prev.progress, combined)),
              }));
            },
          });

          if (abortController.signal.aborted) {
            revokeUrlsList(urlsThisRun);
            return;
          }

          urlsThisRun.push(URL.createObjectURL(blob));
        }

        blobUrlsRef.current = urlsThisRun;
        const [postUrl, storyUrl] = urlsThisRun;

        setState({
          phase: "ready",
          progress: 100,
          downloads: { post: postUrl, story: storyUrl },
          error: null,
        });
      } catch (error) {
        if (abortController.signal.aborted) {
          revokeUrlsList(urlsThisRun);
          return;
        }
        console.error("[render] client render failed", error);
        revokeUrlsList(urlsThisRun);
        setState({
          phase: "error",
          progress: 0,
          downloads: null,
          error: RENDER_FAILED,
        });
      } finally {
        document.documentElement.removeAttribute("data-welcome-video-export");
      }
    },
    [reset],
  );

  return { state, start, reset };
}

function revokeAllBlobUrls(ref: MutableRefObject<string[]>) {
  revokeUrlsList(ref.current);
  ref.current = [];
}

function revokeUrlsList(urls: string[]) {
  for (const u of urls) {
    URL.revokeObjectURL(u);
  }
}

async function resolveExportDimensions(
  aspectFormat: AspectFormat,
): Promise<{ exportW: number; exportH: number } | null> {
  const twoX = EXPORT_DIMENSIONS[aspectFormat];
  const oneX = DESIGN_DIMENSIONS[aspectFormat];

  let exportW = twoX.width;
  let exportH = twoX.height;

  const twoOk = await canRenderMediaOnWeb({
    width: twoX.width,
    height: twoX.height,
    container: "mp4",
    videoCodec: "h264",
    muted: true,
  });

  if (!twoOk.canRender) {
    const oneOk = await canRenderMediaOnWeb({
      width: oneX.width,
      height: oneX.height,
      container: "mp4",
      videoCodec: "h264",
      muted: true,
    });
    if (!oneOk.canRender) {
      return null;
    }
    exportW = oneX.width;
    exportH = oneX.height;
  }

  if (aspectFormat === "post") {
    exportW = Math.min(exportW, exportH);
    exportH = exportW;
  }

  const snapped = snapDimensionsForH264(exportW, exportH);
  return { exportW: snapped.w, exportH: snapped.h };
}

async function renderWelcomeMp4Blob(params: {
  aspectFormat: AspectFormat;
  handle: string;
  imageUrl: string | null;
  isLeadOrganizer: boolean;
  exportW: number;
  exportH: number;
  signal: AbortSignal;
  onLocalProgress: (localProgress01: number) => void;
}): Promise<Blob> {
  const {
    aspectFormat,
    handle,
    imageUrl,
    isLeadOrganizer,
    exportW,
    exportH,
    signal,
    onLocalProgress,
  } = params;

  const inputProps = {
    handle: normalizeHandle(handle),
    imageUrl,
    aspectFormat,
    isLeadOrganizer,
    exportWidth: exportW,
    exportHeight: exportH,
  };

  const { getBlob } = await renderMediaOnWeb({
    composition: {
      id: "welcome-card-export",
      component: WelcomeCardComposition,
      durationInFrames: EXPORT_VIDEO_DURATION_FRAMES,
      fps: VIDEO_FPS,
      width: exportW,
      height: exportH,
      calculateMetadata: null,
      defaultProps: inputProps,
    },
    inputProps,
    container: "mp4",
    videoCodec: "h264",
    muted: true,
    signal,
    onProgress: ({ progress }) => {
      onLocalProgress(progress);
    },
  });

  return getBlob();
}

function normalizeHandle(handle: string): string {
  const trimmed = handle.trim().toLowerCase();
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

function snapDimensionsForH264(w: number, h: number): { w: number; h: number } {
  const align = (n: number) => Math.max(16, Math.round(n / 16) * 16);
  const w2 = align(w);
  const h2 = align((h * w2) / w);
  return { w: w2, h: h2 };
}
