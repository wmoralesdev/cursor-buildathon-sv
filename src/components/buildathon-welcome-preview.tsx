import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { motion } from "motion/react";

import type { WelcomeFormValues } from "../pages/buildathon-welcome-types";
import { WelcomeCardCanvas } from "./welcome-card-canvas";
import {
  DESIGN_DIMENSIONS,
  VIDEO_DURATION_SECONDS,
} from "./welcome-card-canvas-spec";

type PreviewCardProps = {
  handle: string;
  imageUrl: string | null;
  aspectFormat: WelcomeFormValues["aspectFormat"];
};

const BuildathonWelcomePreviewCard = memo(function BuildathonWelcomePreviewCard({
  handle,
  imageUrl,
  aspectFormat,
}: PreviewCardProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [progressSeconds, setProgressSeconds] = useState(0);

  const design = DESIGN_DIMENSIONS[aspectFormat];

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / design.width);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [design.width]);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      setProgressSeconds(Math.min(elapsed, VIDEO_DURATION_SECONDS));
      if (elapsed < VIDEO_DURATION_SECONDS) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [aspectFormat, handle, imageUrl]);

  const aspectStyle =
    aspectFormat === "post"
      ? { aspectRatio: "1 / 1", maxWidth: "min(100%, 28rem)" }
      : { aspectRatio: "9 / 16", maxWidth: "min(100%, 24rem)" };

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden"
      style={{ ...aspectStyle, maxHeight: "min(88vh, 40rem)" }}
    >
      <WelcomeCardCanvas
        handle={handle}
        imageUrl={imageUrl}
        aspectFormat={aspectFormat}
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
  const { control } = useFormContext<WelcomeFormValues>();
  const watched = useWatch({ control, name: ["handle", "photo", "aspectFormat"] });

  const [wHandle, wPhoto, wAspect] = watched ?? [];

  const preview: WelcomeFormValues = {
    handle: typeof wHandle === "string" ? wHandle : defaultSnapshot.handle,
    photo: wPhoto !== undefined ? wPhoto : defaultSnapshot.photo,
    aspectFormat: wAspect ?? defaultSnapshot.aspectFormat,
  };

  const photoPreviewUrl = useMemo(() => {
    if (!preview.photo) return null;
    return URL.createObjectURL(preview.photo);
  }, [preview.photo]);

  useEffect(() => {
    if (!photoPreviewUrl) return;
    return () => URL.revokeObjectURL(photoPreviewUrl);
  }, [photoPreviewUrl]);

  return (
    <section aria-label="Congrats preview" className="lg:sticky lg:top-[calc(var(--site-nav-height)+1.5rem)]">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-fg-4">Live preview</p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        className="relative mt-4"
      >
        <BuildathonWelcomePreviewCard
          handle={preview.handle}
          imageUrl={photoPreviewUrl}
          aspectFormat={preview.aspectFormat}
        />

        <p className="mt-4 text-xs text-fg-5 leading-relaxed">
          The frame ratio matches the format you choose—post (1:1) or story (9:16). Generated video is exactly
          what you see here.
        </p>
      </motion.div>
    </section>
  );
}
