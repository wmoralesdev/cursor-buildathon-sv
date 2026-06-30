import { memo, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Film, X } from "lucide-react";

import type { ProjectSubmitFormValues } from "../pages/project-submit-types";
import { useTranslation } from "../context/language-context";
import { formatVideoFileSize } from "../lib/project-submit-upload";
import {
  PROJECT_SUBMIT_VIDEO_ACCEPT,
  PROJECT_SUBMIT_VIDEO_MAX_BYTES,
  projectSubmitHintClass,
  projectSubmitLabelClass,
  projectSubmitUploadButtonClass,
  projectSubmitVideoFileClass,
  projectSubmitVideoRemoveClass,
} from "./project-submit-form-fields";

type VideoError = "bad-type" | "too-large" | null;

export const ProjectSubmitVideoField = memo(function ProjectSubmitVideoField() {
  const { t } = useTranslation();
  const { control } = useFormContext<ProjectSubmitFormValues>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [videoError, setVideoError] = useState<VideoError>(null);

  return (
    <Controller
      name="video"
      control={control}
      rules={{ required: false }}
      render={({ field }) => (
        <div className="space-y-2">
          <span id="submit-video-label" className={projectSubmitLabelClass}>
            {t("submit.project.video")}
          </span>

          <div className="flex flex-col gap-2">
            <label htmlFor="submit-video-input" className={projectSubmitUploadButtonClass}>
              <Film className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
              {field.value ? t("submit.project.videoReplace") : t("submit.project.videoChoose")}
            </label>

            {field.value ? (
              <div className={projectSubmitVideoFileClass}>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg" title={field.value.name}>
                    {field.value.name}
                  </p>
                  <p className={`mt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] ${projectSubmitHintClass}`}>
                    {formatVideoFileSize(field.value.size)}
                  </p>
                </div>
                <button
                  type="button"
                  className={projectSubmitVideoRemoveClass}
                  aria-label={t("submit.project.videoRemove")}
                  onClick={() => {
                    field.onChange(null);
                    setVideoError(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  <X className="size-4" strokeWidth={1.75} aria-hidden />
                </button>
              </div>
            ) : null}

            <input
              ref={inputRef}
              id="submit-video-input"
              type="file"
              accept={PROJECT_SUBMIT_VIDEO_ACCEPT}
              aria-required="false"
              className="sr-only"
              aria-labelledby="submit-video-label"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                e.target.value = "";
                if (!file) return;

                const isVideo =
                  file.type.startsWith("video/") ||
                  /\.(mp4|webm|mov|avi)$/i.test(file.name);

                if (!isVideo) {
                  setVideoError("bad-type");
                  field.onChange(null);
                  return;
                }

                if (file.size > PROJECT_SUBMIT_VIDEO_MAX_BYTES) {
                  setVideoError("too-large");
                  field.onChange(null);
                  return;
                }

                setVideoError(null);
                field.onChange(file);
              }}
            />
          </div>

          <p className={projectSubmitHintClass}>{t("submit.project.videoHint")}</p>

          {videoError ? (
            <p className="text-xs text-accent" role="alert">
              {videoError === "bad-type"
                ? t("submit.project.videoErrorType")
                : t("submit.project.videoErrorSize")}
            </p>
          ) : null}
        </div>
      )}
    />
  );
});
