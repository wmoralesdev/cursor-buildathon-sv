import { useCallback, useEffect, useId, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

import "react-easy-crop/react-easy-crop.css";

import { getCroppedImageJpegBlob } from "../lib/get-cropped-image-blob";
import { useTranslation } from "../context/language-context";

export type WelcomePhotoCropDialogProps = {
  imageSrc: string;
  outputBaseName: string;
  onCancel: () => void;
  onComplete: (file: File) => void;
};

export function WelcomePhotoCropDialog({
  imageSrc,
  outputBaseName,
  onCancel,
  onComplete,
}: WelcomePhotoCropDialogProps) {
  const { t } = useTranslation();
  const headingId = useId();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setPixels(areaPixels);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  async function apply() {
    if (!pixels || applying) return;
    setApplyError(null);
    setApplying(true);
    try {
      const blob = await getCroppedImageJpegBlob(imageSrc, pixels);
      if (blob.size > 5 * 1024 * 1024) {
        setApplying(false);
        setApplyError(t("welcome.photoCrop.errorTooLarge"));
        return;
      }
      const safeBase = outputBaseName.replace(/[^\w.-]+/g, "-").slice(0, 80) || "photo";
      const file = new File([blob], `${safeBase}.jpg`, { type: "image/jpeg" });
      onComplete(file);
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      if (code.includes("welcomePhotoCrop.imageLoadFailed")) {
        setApplyError(t("welcome.photoCrop.errorLoad"));
      } else {
        setApplyError(t("welcome.photoCrop.errorApply"));
      }
    } finally {
      setApplying(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-[#050505]/92 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="flex w-full max-w-lg flex-col gap-4 border border-border bg-bg-deep p-4 shadow-[0_28px_100px_-24px_rgba(255,75,0,0.35)] sm:gap-5 sm:p-5"
      >
        <div className="space-y-1">
          <h2 id={headingId} className="font-mono text-xs uppercase tracking-[0.14em] text-fg">
            {t("welcome.photoCrop.title")}
          </h2>
          <p className="text-[0.65rem] leading-snug text-fg-4 sm:text-xs">{t("welcome.photoCrop.hint")}</p>
        </div>

        <div className="relative aspect-square w-full max-h-[55vh] overflow-hidden bg-[#111]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            minZoom={1}
            maxZoom={3}
            cropShape="rect"
            objectFit="contain"
            restrictPosition={false}
            showGrid={false}
            zoomWithScroll
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-fg-3 sm:text-xs sm:tracking-[0.12em]">
            <span className="shrink-0">{t("welcome.photoCrop.zoom")}</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="min-w-0 flex-1 accent-accent"
            />
          </label>
        </div>

        {applyError ? (
          <p className="text-[0.65rem] leading-snug text-accent sm:text-xs" role="alert">
            {applyError}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center border border-border-faint px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-fg-2 transition-colors hover:border-fg-5 hover:text-fg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 sm:py-3 sm:text-xs"
            disabled={applying}
            onClick={() => onCancel()}
          >
            {t("welcome.photoCrop.cancel")}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center border border-accent/60 bg-accent px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-bg transition-opacity hover:opacity-90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 sm:py-3 sm:text-xs sm:tracking-[0.14em]"
            disabled={applying || !pixels}
            onClick={() => void apply()}
          >
            {applying ? t("welcome.photoCrop.applying") : t("welcome.photoCrop.apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
