import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { motion } from "motion/react";
import { Copy } from "lucide-react";

import type { AspectFormat, WelcomeFormValues } from "../pages/buildathon-welcome-types";
import { useTranslation } from "../context/language-context";
import { isLocalhostHostname } from "../lib/is-localhost";
import {
  DESIGN_DIMENSIONS,
  INTRO_DURATION_SECONDS,
  SPONSOR_SLATE_HOLD_PREVIEW_SECONDS,
} from "./welcome-card-canvas-spec";
import { WelcomeCardVideoSequence } from "./welcome-card-video-sequence";

const PREVIEW_HANDLE_DEBOUNCE_MS = 300;

const DEFAULT_PUBLIC_PREVIEW_ASPECT: AspectFormat = "post";

type PreviewCardProps = {
  handle: string;
  imageUrl: string | null;
  isLeadOrganizer: boolean;
  aspectFormat: AspectFormat;
};

type ScaledCardProps = PreviewCardProps & {
  progressSecondsOverride?: number;
};

function previewWrapperStyle(aspectFormat: AspectFormat): CSSProperties {
  if (aspectFormat === "post") {
    return {
      aspectRatio: "1 / 1",
      width: "100%",
      maxWidth: "min(100%, 36rem)",
      maxHeight: "min(92vh, 42rem)",
    };
  }
  return {
    aspectRatio: "9 / 16",
    width: "100%",
    maxWidth: "min(100%, 26rem)",
    maxHeight: "min(88vh, 52rem)",
  };
}

const WelcomeCardPreviewScaled = memo(function WelcomeCardPreviewScaled({
  handle,
  imageUrl,
  isLeadOrganizer,
  progressSecondsOverride,
  aspectFormat,
}: ScaledCardProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [animatedProgressSeconds, setAnimatedProgressSeconds] = useState(0);

  const progressSeconds = progressSecondsOverride ?? animatedProgressSeconds;

  const design = DESIGN_DIMENSIONS[aspectFormat];

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w <= 0 || h <= 0) return;
      const sx = w / design.width;
      const sy = h / design.height;
      setScale(Math.min(sx, sy));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [design.width, design.height]);

  useEffect(() => {
    if (progressSecondsOverride !== undefined) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const clamped = Math.min(elapsed, INTRO_DURATION_SECONDS);
      setAnimatedProgressSeconds(clamped);
      if (elapsed < INTRO_DURATION_SECONDS) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [handle, imageUrl, isLeadOrganizer, progressSecondsOverride, aspectFormat]);

  return (
    <div
      ref={wrapperRef}
      className="relative mx-auto w-full overflow-hidden"
      style={previewWrapperStyle(aspectFormat)}
    >
      <WelcomeCardVideoSequence
        handle={handle}
        imageUrl={imageUrl}
        aspectFormat={aspectFormat}
        isLeadOrganizer={isLeadOrganizer}
        progressSeconds={progressSeconds}
        scale={scale}
      />
    </div>
  );
});

type Props = {
  defaultSnapshot: WelcomeFormValues;
};

export function BuildathonWelcomePreview({ defaultSnapshot }: Props) {
  const { t } = useTranslation();
  const { control } = useFormContext<WelcomeFormValues>();
  const watchedHandle = useWatch({ control, name: "handle" });
  const watchedPhoto = useWatch({ control, name: "photo" });
  const watchedOrganizer = useWatch({ control, name: "isOrganizer" });

  const devPreview = isLocalhostHostname();
  const [localhostPreviewAspect, setLocalhostPreviewAspect] =
    useState<AspectFormat>(DEFAULT_PUBLIC_PREVIEW_ASPECT);

  const previewAspect = devPreview ? localhostPreviewAspect : DEFAULT_PUBLIC_PREVIEW_ASPECT;

  const [blurbCopied, setBlurbCopied] = useState(false);
  const blurbCopiedTimerRef = useRef<number>(0);

  useEffect(() => {
    return () => window.clearTimeout(blurbCopiedTimerRef.current);
  }, []);

  const blurbText = t("welcome.share.blurb");

  async function copyBlurb() {
    try {
      await navigator.clipboard.writeText(blurbText);
      setBlurbCopied(true);
      window.clearTimeout(blurbCopiedTimerRef.current);
      blurbCopiedTimerRef.current = window.setTimeout(() => setBlurbCopied(false), 2200);
    } catch {
      // Clipboard may be unavailable
    }
  }
  const handleLive =
    typeof watchedHandle === "string" ? watchedHandle : defaultSnapshot.handle;

  const [previewHandle, setPreviewHandle] = useState(handleLive);

  useEffect(() => {
    const id = window.setTimeout(() => setPreviewHandle(handleLive), PREVIEW_HANDLE_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [handleLive]);

  const previewPhoto = watchedPhoto !== undefined ? watchedPhoto : defaultSnapshot.photo;
  const previewLeadOrganizer =
    watchedOrganizer !== undefined ? watchedOrganizer : defaultSnapshot.isOrganizer;

  const photoPreviewUrl = useMemo(() => {
    if (!previewPhoto) return null;
    return URL.createObjectURL(previewPhoto);
  }, [previewPhoto]);

  useEffect(() => {
    if (!photoPreviewUrl) return;
    return () => URL.revokeObjectURL(photoPreviewUrl);
  }, [photoPreviewUrl]);

  const aspectToggleBtnClass =
    "min-h-[2.25rem] flex-1 min-w-[5.5rem] px-2.5 py-2 font-mono text-[0.6rem] uppercase tracking-[0.1em] transition-[border-color,background-color,color] sm:min-h-0 sm:px-3 sm:py-2 sm:text-[0.65rem] sm:tracking-[0.12em]";

  return (
    <section
      aria-label={t("welcome.preview.ariaLabel")}
      className="min-w-0 w-full lg:sticky lg:top-[calc(var(--site-nav-height)+1.5rem)]"
    >
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-fg-4 sm:text-[0.65rem] sm:tracking-[0.18em]">
        {t("welcome.preview.kicker")}
      </p>

      {devPreview ? (
        <div className="mt-2 space-y-1.5 sm:mt-2.5">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-fg-3 sm:text-[0.65rem] sm:tracking-[0.14em]">
            {t("welcome.preview.devAspectLabel")}
          </p>
          <div
            className="inline-flex max-w-full border border-border-faint bg-bg-raised"
            role="group"
            aria-label={t("welcome.preview.devAspectLabel")}
          >
            <button
              type="button"
              className={`${aspectToggleBtnClass} rounded-none ${previewAspect === "post" ? "border border-accent/50 bg-accent/15 text-fg" : "border border-transparent text-fg-3 hover:bg-bg-deep hover:text-fg"}`}
              aria-pressed={previewAspect === "post"}
              onClick={() => setLocalhostPreviewAspect("post")}
            >
              {t("welcome.field.post")}
            </button>
            <button
              type="button"
              className={`${aspectToggleBtnClass} rounded-none ${previewAspect === "story" ? "border border-accent/50 bg-accent/15 text-fg" : "border border-transparent text-fg-3 hover:bg-bg-deep hover:text-fg"}`}
              aria-pressed={previewAspect === "story"}
              onClick={() => setLocalhostPreviewAspect("story")}
            >
              {t("welcome.field.story")}
            </button>
          </div>
          <p className="text-[0.62rem] leading-snug text-fg-5 sm:text-xs sm:leading-relaxed">
            {t("welcome.preview.devAspectNote")}
          </p>
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        className="relative mt-3 sm:mt-4"
      >
        <WelcomeCardPreviewScaled
          handle={previewHandle}
          imageUrl={photoPreviewUrl}
          isLeadOrganizer={previewLeadOrganizer}
          aspectFormat={previewAspect}
        />

        <p className="mt-3 text-[0.65rem] leading-snug text-fg-5 sm:mt-4 sm:text-xs sm:leading-relaxed">
          {t("welcome.preview.hint")}
        </p>
        <p className="mt-2 text-[0.65rem] leading-snug text-fg-4 sm:mt-3 sm:text-xs sm:leading-relaxed">
          {t("welcome.shareWhenPosting")}
        </p>

        {devPreview ? (
          <>
            <p className="mt-8 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent/90 sm:text-[0.65rem] sm:tracking-[0.18em]">
              {t("welcome.preview.devSponsorKicker")}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="relative mt-3 sm:mt-4"
            >
              <WelcomeCardPreviewScaled
                handle={previewHandle}
                imageUrl={photoPreviewUrl}
                isLeadOrganizer={previewLeadOrganizer}
                aspectFormat={previewAspect}
                progressSecondsOverride={SPONSOR_SLATE_HOLD_PREVIEW_SECONDS}
              />
              <p className="mt-3 text-[0.65rem] leading-snug text-fg-5 sm:mt-4 sm:text-xs sm:leading-relaxed">
                {t("welcome.preview.devSponsorHint")}
              </p>
            </motion.div>
          </>
        ) : null}

        <div className="mt-4 border border-border-faint bg-bg-raised p-3 sm:mt-5 sm:p-4">
          <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-fg-4 sm:text-[0.65rem] sm:tracking-[0.14em]">
              {t("welcome.share.blurbLabel")}
            </p>
            <button
              type="button"
              onClick={() => void copyBlurb()}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-none border border-border-faint bg-bg-deep px-2.5 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-fg-2 transition-[border-color,color] hover:border-accent/40 hover:text-fg active:scale-[0.98] sm:gap-2 sm:px-3 sm:py-2 sm:text-[0.65rem] sm:tracking-[0.12em]"
              aria-label={blurbCopied ? t("welcome.share.copied") : t("welcome.share.copy")}
            >
              <Copy className="size-3 shrink-0 sm:size-3.5" strokeWidth={1.75} aria-hidden />
              {blurbCopied ? t("welcome.share.copied") : t("welcome.share.copy")}
            </button>
          </div>
          <p className="mt-2.5 select-all text-xs leading-snug text-fg sm:mt-3 sm:text-sm sm:leading-relaxed">{blurbText}</p>
        </div>
      </motion.div>
    </section>
  );
}
