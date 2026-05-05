import { memo, useCallback, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Crop, ImagePlus, X } from "lucide-react";

import type { WelcomeFormValues } from "../pages/buildathon-welcome-types";
import { isLocalhostHostname } from "../lib/is-localhost";
import { useTranslation } from "../context/language-context";
import { WelcomePhotoCropDialog } from "./welcome-photo-crop-dialog";

const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
const PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";

const inputClass =
  "w-full rounded-none border border-border bg-bg-raised px-3 py-2.5 text-sm text-fg placeholder:text-fg-5 outline-none transition-[border-color,box-shadow] focus:border-accent/60 focus:ring-2 focus:ring-accent/20 sm:px-4 sm:py-3 sm:text-base";

const labelClass =
  "block font-mono text-[0.65rem] uppercase tracking-[0.12em] text-fg-4 sm:text-xs sm:tracking-[0.14em]";

function fileBaseWithoutExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(0, i) : name;
}

type PendingCrop = {
  objectUrl: string;
  outputBaseName: string;
};

export const WelcomeFormFields = memo(function WelcomeFormFields() {
  const { t } = useTranslation();
  const { control, register } = useFormContext<WelcomeFormValues>();
  const [photoError, setPhotoError] = useState<"bad-type" | "too-large" | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [pendingCrop, setPendingCrop] = useState<PendingCrop | null>(null);

  const clearPendingCrop = useCallback(() => {
    setPendingCrop((prev) => {
      if (prev?.objectUrl) URL.revokeObjectURL(prev.objectUrl);
      return null;
    });
  }, []);

  return (
    <>
      <div className="space-y-1.5 sm:space-y-2">
        <label htmlFor="welcome-handle" className={labelClass}>
          {t("welcome.field.handle")}
        </label>
        <input
          id="welcome-handle"
          autoComplete="nickname"
          maxLength={40}
          required
          aria-required="true"
          className={inputClass}
          placeholder={t("welcome.field.handlePlaceholder")}
          {...register("handle")}
        />
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <span id="welcome-photo-label" className={labelClass}>
          {t("welcome.field.photo")}
        </span>
        <Controller
          name="photo"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5 sm:gap-2">
              {pendingCrop ? (
                <WelcomePhotoCropDialog
                  imageSrc={pendingCrop.objectUrl}
                  outputBaseName={pendingCrop.outputBaseName}
                  onCancel={() => {
                    clearPendingCrop();
                    if (photoInputRef.current) photoInputRef.current.value = "";
                    setPhotoError(null);
                  }}
                  onComplete={(file) => {
                    clearPendingCrop();
                    field.onChange(file);
                  }}
                />
              ) : null}
              <div className="flex flex-wrap items-stretch gap-1.5 sm:gap-2">
                <label
                  htmlFor="welcome-photo-input"
                  className="inline-flex min-h-[2.75rem] flex-1 min-w-[10rem] cursor-pointer items-center justify-center gap-2 rounded-none border border-border bg-bg-raised px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-fg-2 transition-[border-color,background-color] hover:border-accent/40 hover:text-fg sm:min-h-0 sm:min-w-[12rem] sm:px-4 sm:py-3 sm:text-xs sm:tracking-[0.12em]"
                >
                  <ImagePlus className="size-[14px] shrink-0 sm:size-4" strokeWidth={1.75} aria-hidden />
                  {t("welcome.field.chooseImage")}
                </label>
                {field.value ? (
                  <>
                    <button
                      type="button"
                      className="inline-flex min-h-[2.75rem] items-center justify-center gap-1 rounded-none border border-border-faint bg-bg-deep px-2.5 py-2 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-fg-3 transition-[border-color,color] hover:border-fg-5 hover:text-fg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 sm:min-h-0 sm:px-3 sm:py-3 sm:text-xs sm:tracking-[0.12em]"
                      onClick={() => {
                        const fv = field.value;
                        if (!(fv instanceof File)) return;
                        setPendingCrop((prev) => {
                          if (prev?.objectUrl) URL.revokeObjectURL(prev.objectUrl);
                          const objectUrl = URL.createObjectURL(fv);
                          return {
                            objectUrl,
                            outputBaseName: fileBaseWithoutExtension(fv.name),
                          };
                        });
                      }}
                      aria-label={t("welcome.field.adjustPhoto")}
                      disabled={!!pendingCrop}
                      title={t("welcome.field.adjustPhoto")}
                    >
                      <Crop className="size-[14px] sm:size-4" strokeWidth={1.75} aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="inline-flex min-h-[2.75rem] items-center justify-center gap-1 rounded-none border border-border-faint bg-bg-deep px-2.5 py-2 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-fg-3 transition-[border-color,color] hover:border-fg-5 hover:text-fg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 sm:min-h-0 sm:px-3 sm:py-3 sm:text-xs sm:tracking-[0.12em]"
                      onClick={() => {
                        clearPendingCrop();
                        field.onChange(null);
                        setPhotoError(null);
                        if (photoInputRef.current) photoInputRef.current.value = "";
                      }}
                      aria-label={t("welcome.field.removePhotoAria")}
                      disabled={!!pendingCrop}
                    >
                      <X className="size-[14px] sm:size-4" strokeWidth={1.75} aria-hidden />
                    </button>
                  </>
                ) : null}
                <input
                  ref={(el) => {
                    photoInputRef.current = el;
                  }}
                  id="welcome-photo-input"
                  key={
                    typeof field.value === "object" && field.value instanceof File
                      ? `${field.value.name}-${field.value.size}`
                      : "photo-empty"
                  }
                  type="file"
                  accept={PHOTO_ACCEPT}
                  required={!field.value}
                  aria-required="true"
                  className="sr-only"
                  aria-labelledby="welcome-photo-label"
                  disabled={!!pendingCrop}
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    e.target.value = "";
                    if (!file) return;
                    if (!file.type.startsWith("image/")) {
                      setPhotoError("bad-type");
                      return;
                    }
                    if (file.size > PHOTO_MAX_BYTES) {
                      setPhotoError("too-large");
                      return;
                    }
                    setPhotoError(null);
                    setPendingCrop((prev) => {
                      if (prev?.objectUrl) URL.revokeObjectURL(prev.objectUrl);
                      return {
                        objectUrl: URL.createObjectURL(file),
                        outputBaseName: fileBaseWithoutExtension(file.name),
                      };
                    });
                  }}
                />
              </div>
              {typeof field.value === "object" && field.value instanceof File ? (
                <p className="truncate text-[0.65rem] text-fg-4 sm:text-xs" title={field.value.name}>
                  {field.value.name}
                </p>
              ) : null}
              {photoError ? (
                <p className="text-[0.65rem] text-accent sm:text-xs" role="alert">
                  {photoError === "bad-type"
                    ? t("welcome.field.photoErrorType")
                    : t("welcome.field.photoErrorSize")}
                </p>
              ) : (
                <p className="text-[0.65rem] text-fg-5 sm:text-xs">{t("welcome.field.photoHint")}</p>
              )}
            </div>
          )}
        />
      </div>

      {isLocalhostHostname() ? (
        <label className="flex cursor-pointer items-start gap-2.5 sm:gap-3">
          <input
            type="checkbox"
            className="mt-1 size-4 shrink-0 rounded-sm border border-border bg-bg-raised text-accent focus:ring-2 focus:ring-accent/25"
            {...register("isOrganizer")}
          />
          <span className="font-mono text-[0.65rem] leading-snug text-fg-3 sm:text-xs">{t("welcome.field.organizer")}</span>
        </label>
      ) : null}
    </>
  );
});
