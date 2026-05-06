import { forwardRef, memo, useEffect, useImperativeHandle } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Check, Download, Film, Loader2 } from "lucide-react";

import {
  type RenderState,
  useWelcomeVideoRender,
} from "../hooks/use-welcome-video-render";
import type { WelcomeFormValues } from "../pages/buildathon-welcome-types";
import { welcomeVideoDownloadBasename } from "../lib/sanitize-handle-for-filename";
import { useTranslation } from "../context/language-context";

export type WelcomeVideoRenderActionsHandle = {
  start: (values: WelcomeFormValues) => void;
};

const RenderActionRow = memo(function RenderActionRow({
  renderState,
  isBusy,
  submitBlocked,
  handleRaw,
}: {
  renderState: RenderState;
  isBusy: boolean;
  submitBlocked: boolean;
  handleRaw: string;
}) {
  const { t } = useTranslation();
  if (renderState.phase === "ready" && renderState.downloads) {
    const { post, story } = renderState.downloads;
    return (
      <div className="space-y-2 sm:space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <a
            href={post}
            download={welcomeVideoDownloadBasename("post", handleRaw)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-none border border-accent/60 bg-accent px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-bg transition-[transform,opacity] hover:opacity-90 active:scale-[0.98] sm:w-auto sm:px-6 sm:py-3 sm:text-xs sm:tracking-[0.14em]"
          >
            <Download className="size-[14px] shrink-0 sm:size-4" strokeWidth={1.75} aria-hidden />
            {t("welcome.video.downloadPost")}
          </a>
          <a
            href={story}
            download={welcomeVideoDownloadBasename("story", handleRaw)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-none border border-accent/60 bg-accent px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-bg transition-[transform,opacity] hover:opacity-90 active:scale-[0.98] sm:w-auto sm:px-6 sm:py-3 sm:text-xs sm:tracking-[0.14em]"
          >
            <Download className="size-[14px] shrink-0 sm:size-4" strokeWidth={1.75} aria-hidden />
            {t("welcome.video.downloadStory")}
          </a>
        </div>
        <p className="inline-flex items-center gap-1.5 text-[0.65rem] text-fg-3 sm:text-xs">
          <Check className="size-3 shrink-0 text-accent sm:size-3.5" strokeWidth={2} aria-hidden />
          {t("welcome.video.ready")}
        </p>
        <p className="text-[0.65rem] leading-snug text-fg-4 sm:text-xs sm:leading-relaxed">
          {t("welcome.shareWhenPosting")}
        </p>
        <ul className="list-inside list-disc space-y-1 text-[0.65rem] leading-snug text-fg-3 sm:text-xs sm:leading-relaxed">
          <li>{t("welcome.share.linkedInTags")}</li>
          <li>{t("welcome.share.xTags")}</li>
        </ul>
      </div>
    );
  }

  if (isBusy) {
    const busyLabel =
      renderState.phase === "preparing"
        ? t("welcome.video.preparing")
        : t("welcome.video.working");
    return (
      <div className="space-y-2" aria-live="polite">
        <div className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.12em] text-fg-3 sm:text-[0.65rem] sm:tracking-[0.14em]">
          <span className="inline-flex items-center gap-1.5 sm:gap-2">
            <Loader2
              className="size-3 shrink-0 animate-spin text-accent sm:size-3.5"
              strokeWidth={1.75}
              aria-hidden
            />
            {busyLabel}
          </span>
          <span>{Math.round(renderState.progress)}%</span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden border border-border-faint bg-bg-deep"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(renderState.progress)}
        >
          <div
            className="h-full bg-accent transition-[width] duration-300"
            style={{
              width: `${Math.max(2, Math.min(100, renderState.progress))}%`,
            }}
          />
        </div>
        <p className="text-[0.65rem] leading-snug text-fg-5 sm:text-xs sm:leading-normal">{t("welcome.video.waitHint")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-none border border-border-faint bg-fg px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-bg transition-[transform,opacity] hover:opacity-90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 sm:w-auto sm:px-6 sm:py-3 sm:text-xs sm:tracking-[0.14em]"
        disabled={submitBlocked}
      >
        <Film className="size-[14px] shrink-0 sm:size-4" strokeWidth={1.75} aria-hidden />
        {t("welcome.video.create")}
      </button>
      {renderState.phase === "error" && renderState.error ? (
        <p className="text-[0.65rem] leading-snug text-accent sm:text-xs sm:leading-normal" role="alert">
          {renderState.error}
        </p>
      ) : null}
    </div>
  );
});

export const WelcomeVideoRenderActions = forwardRef<
  WelcomeVideoRenderActionsHandle,
  object
>(function WelcomeVideoRenderActions(_, ref) {
  const { control } = useFormContext();
  const { state, start, reset } = useWelcomeVideoRender();

  useImperativeHandle(ref, () => ({ start }), [start]);

  const handle = useWatch({ control, name: "handle" });
  const photo = useWatch({ control, name: "photo" });
  const isOrganizer = useWatch({ control, name: "isOrganizer" });

  useEffect(() => {
    if (state.phase === "ready" || state.phase === "error") {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- match prior behavior: react only to input edits, not phase transitions (e.g. entering "ready" must not reset the blob URL)
  }, [handle, photo, isOrganizer, reset]);

  const submitBlocked = !String(handle ?? "").trim() || !photo;
  const isBusy =
    state.phase === "preparing" || state.phase === "rendering";

  return (
    <RenderActionRow
      renderState={state}
      isBusy={isBusy}
      submitBlocked={submitBlocked}
      handleRaw={typeof handle === "string" ? handle : ""}
    />
  );
});
