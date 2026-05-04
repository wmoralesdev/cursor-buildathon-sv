import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Check, Download, Film, ImagePlus, Loader2, X } from "lucide-react";

import type { WelcomeFormValues } from "../pages/buildathon-welcome-types";
import { useWelcomeVideoRender } from "../hooks/use-welcome-video-render";

const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
const PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";

const inputClass =
  "w-full rounded-none border border-border bg-bg-raised px-4 py-3 text-fg placeholder:text-fg-5 outline-none transition-[border-color,box-shadow] focus:border-accent/60 focus:ring-2 focus:ring-accent/20";

const toggleBaseClass =
  "inline-flex items-center justify-center gap-2 rounded-none border px-3 py-2.5 font-mono text-xs font-medium uppercase tracking-[0.12em] transition-[transform,border-color,background-color,color] active:scale-[0.98]";
const toggleIdleClass = "border-border-faint text-fg-4 hover:border-accent/35 hover:text-fg-2";
const toggleOnClass = "border-accent/50 bg-accent/15 text-accent";

function clampInviteToken(token: string | null): string {
  if (!token) return "";
  const t = token.trim();
  if (t.length <= 24) return t;
  return `${t.slice(0, 23)}…`;
}

type Props = {
  inviteToken: string | null;
};

export function BuildathonWelcomeForm({ inviteToken }: Props) {
  const { control, register, handleSubmit, watch } =
    useFormContext<WelcomeFormValues>();
  const [photoError, setPhotoError] = useState<string | null>(null);

  const { state: renderState, start, reset } = useWelcomeVideoRender();
  const formValues = watch();

  // Reset render state if inputs change after a finished render so the user
  // can regenerate cleanly.
  useEffect(() => {
    if (renderState.phase === "ready" || renderState.phase === "error") {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.handle, formValues.aspectFormat, formValues.photo]);

  const inviteHint = inviteToken
    ? `Confirmation code: ${clampInviteToken(inviteToken)}`
    : "Use the welcome link from your acceptance email so we can verify your invite.";

  const onSubmit = handleSubmit((values) => {
    if (!values.handle.trim()) {
      return;
    }
    void start(values);
  });

  const isBusy =
    renderState.phase === "preparing" || renderState.phase === "rendering";

  return (
    <header className="max-w-xl">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-fg-4">Accepted builders</p>
      <h1 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-fg leading-[1.05]">
        You’re in. Lock in how you’ll show up.
      </h1>
      <p className="mt-4 max-w-[55ch] text-fg-3 leading-relaxed">
        Add your handle, photo, and export format for your acceptance video. Your personalized welcome link may
        prefill your handle—adjust anything before you generate. The preview updates as you go.
      </p>

      <form className="mt-10 space-y-6" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <label htmlFor="welcome-handle" className="block text-xs font-mono uppercase tracking-[0.14em] text-fg-4">
            Handle
          </label>
          <input
            id="welcome-handle"
            autoComplete="nickname"
            maxLength={40}
            className={inputClass}
            placeholder="@yourhandle"
            {...register("handle")}
          />
        </div>

        <div className="space-y-2">
          <span id="welcome-photo-label" className="block text-xs font-mono uppercase tracking-[0.14em] text-fg-4">
            Photo
          </span>
          <Controller
            name="photo"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-stretch gap-2">
                  <label
                    htmlFor="welcome-photo-input"
                    className="inline-flex flex-1 min-w-[12rem] cursor-pointer items-center justify-center gap-2 rounded-none border border-border bg-bg-raised px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-fg-2 transition-[border-color,background-color] hover:border-accent/40 hover:text-fg"
                  >
                    <ImagePlus size={16} strokeWidth={1.75} aria-hidden />
                    Choose image
                  </label>
                  {field.value ? (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-1 rounded-none border border-border-faint bg-bg-deep px-3 py-3 font-mono text-xs uppercase tracking-[0.12em] text-fg-3 transition-[border-color,color] hover:border-fg-5 hover:text-fg active:scale-[0.98]"
                      onClick={() => {
                        field.onChange(null);
                        setPhotoError(null);
                      }}
                      aria-label="Remove photo"
                    >
                      <X size={16} strokeWidth={1.75} aria-hidden />
                    </button>
                  ) : null}
                  <input
                    id="welcome-photo-input"
                    key={field.value ? `${field.value.name}-${field.value.size}` : "photo-empty"}
                    type="file"
                    accept={PHOTO_ACCEPT}
                    className="sr-only"
                    aria-labelledby="welcome-photo-label"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (!file) {
                        field.onChange(null);
                        setPhotoError(null);
                        return;
                      }
                      if (!file.type.startsWith("image/")) {
                        setPhotoError("Use a JPEG, PNG, or WebP image.");
                        field.onChange(null);
                        e.target.value = "";
                        return;
                      }
                      if (file.size > PHOTO_MAX_BYTES) {
                        setPhotoError("Image must be 5 MB or smaller.");
                        field.onChange(null);
                        e.target.value = "";
                        return;
                      }
                      setPhotoError(null);
                      field.onChange(file);
                    }}
                  />
                </div>
                {field.value ? (
                  <p className="text-xs text-fg-4 truncate" title={field.value.name}>
                    {field.value.name}
                  </p>
                ) : null}
                {photoError ? (
                  <p className="text-xs text-accent" role="alert">
                    {photoError}
                  </p>
                ) : (
                  <p className="text-xs text-fg-5">JPEG, PNG, or WebP. Max 5 MB.</p>
                )}
              </div>
            )}
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="block text-xs font-mono uppercase tracking-[0.14em] text-fg-4">Format</legend>
          <Controller
            name="aspectFormat"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Video aspect ratio">
                <button
                  type="button"
                  className={`${toggleBaseClass} ${field.value === "post" ? toggleOnClass : toggleIdleClass}`}
                  aria-checked={field.value === "post"}
                  role="radio"
                  onClick={() => field.onChange("post")}
                >
                  Post · 1:1
                </button>
                <button
                  type="button"
                  className={`${toggleBaseClass} ${field.value === "story" ? toggleOnClass : toggleIdleClass}`}
                  aria-checked={field.value === "story"}
                  role="radio"
                  onClick={() => field.onChange("story")}
                >
                  Story · 9:16
                </button>
              </div>
            )}
          />
        </fieldset>

        <p className="text-sm text-fg-4 leading-relaxed">{inviteHint}</p>

        <RenderActionRow
          renderState={renderState}
          isBusy={isBusy}
          handleEmpty={!formValues.handle?.trim()}
        />

        <p className="text-xs text-fg-5">
          Keep the welcome link from your email—you’ll need it to confirm your invite.
        </p>
      </form>
    </header>
  );
}

type RenderActionRowProps = {
  renderState: ReturnType<typeof useWelcomeVideoRender>["state"];
  isBusy: boolean;
  handleEmpty: boolean;
};

function RenderActionRow({ renderState, isBusy, handleEmpty }: RenderActionRowProps) {
  if (renderState.phase === "ready" && renderState.downloadUrl) {
    return (
      <div className="space-y-3">
        <a
          href={renderState.downloadUrl}
          download="cursor-buildathon-welcome.mp4"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-none border border-accent/60 bg-accent px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-bg transition-[transform,opacity] hover:opacity-90 active:scale-[0.98]"
        >
          <Download size={16} strokeWidth={1.75} aria-hidden />
          Download video
        </a>
        <p className="inline-flex items-center gap-1.5 text-xs text-fg-3">
          <Check size={14} strokeWidth={2} className="text-accent" aria-hidden />
          Your video is ready.
        </p>
      </div>
    );
  }

  if (isBusy) {
    return (
      <div className="space-y-2" aria-live="polite">
        <div className="flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.14em] text-fg-3">
          <span className="inline-flex items-center gap-2">
            <Loader2 size={14} strokeWidth={1.75} className="animate-spin text-accent" aria-hidden />
            Preparing your video
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
            style={{ width: `${Math.max(2, Math.min(100, renderState.progress))}%` }}
          />
        </div>
        <p className="text-xs text-fg-5">
          This usually takes under a minute. Keep this tab open.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="submit"
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-none border border-border-faint bg-fg px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-bg transition-[transform,opacity] hover:opacity-90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
        disabled={handleEmpty}
      >
        <Film size={16} strokeWidth={1.75} aria-hidden />
        Generate video
      </button>
      {renderState.phase === "error" && renderState.error ? (
        <p className="text-xs text-accent" role="alert">
          {renderState.error}
        </p>
      ) : null}
    </div>
  );
}
