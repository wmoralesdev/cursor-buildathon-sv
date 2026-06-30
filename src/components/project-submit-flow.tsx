import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { useMutation } from "convex/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { ProjectSubmitFormValues } from "../pages/project-submit-types";
import { PROJECT_SUBMIT_DESCRIPTION_MAX } from "../pages/project-submit-types";
import type { BuilderTeam } from "../hooks/use-builder-team";
import { useTranslation } from "../context/language-context";
import { uploadProjectVideo } from "../lib/project-submit-upload";
import {
  buildProjectSubmitSteps,
  getProjectSubmitProgressSteps,
  type ProjectSubmitStep,
} from "../lib/project-submit-steps";
import { ProjectSubmitCover } from "./project-submit-cover";
import { ProjectSubmitAddFifthStep } from "./project-submit-add-fifth-step";
import { ProjectSubmitMemberStep } from "./project-submit-member-step";
import { ProjectSubmitVideoField } from "./project-submit-video-field";
import {
  projectSubmitHintClass,
  projectSubmitInputClass,
  projectSubmitLabelClass,
} from "./project-submit-form-fields";

type ProjectSubmitFlowProps = {
  onSuccess: (teamName: string) => void;
  team: BuilderTeam;
  leaderSessionId: string;
};

const easeOut = [0.16, 1, 0.3, 1] as const;

export function ProjectSubmitFlow({ onSuccess, team, leaderSessionId }: ProjectSubmitFlowProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { register, getValues, watch, control } = useFormContext<ProjectSubmitFormValues>();
  const { append, remove } = useFieldArray({ control, name: "members" });
  const submitMutation = useMutation(api.submissions.submit);
  const generateUploadUrl = useMutation(api.submissions.generateUploadUrl);

  const members = watch("members");
  const repoUrl = watch("repoUrl");
  const description = watch("description");
  const video = watch("video");
  const eventSocialPostUrl = watch("eventSocialPostUrl");

  const teamName = team.name;

  const steps = useMemo(
    () => buildProjectSubmitSteps(members.length, { skipTeamSteps: true }),
    [members.length],
  );
  const progressSteps = useMemo(() => getProjectSubmitProgressSteps(steps), [steps]);

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [pendingStepId, setPendingStepId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [submitPhase, setSubmitPhase] = useState<"idle" | "uploading-video" | "submitting">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const step = steps[stepIndex];
  const isCover = step?.kind === "cover";
  const isReview = step?.kind === "review";
  const isAddFifth = step?.kind === "add-fifth-member";

  const progressIndex = progressSteps.findIndex((item) => item.id === step?.id);
  const progressPercent =
    progressIndex <= 0
      ? 0
      : Math.round((progressIndex / Math.max(progressSteps.length - 1, 1)) * 100);

  const stepPanelRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    if (stepIndex >= steps.length - 1) return;

    setDirection(1);
    setStepIndex((index) => index + 1);
  }, [stepIndex, steps.length]);

  const goBack = useCallback(() => {
    if (stepIndex <= 0) return;
    setDirection(-1);
    setStepIndex((index) => index - 1);
  }, [stepIndex]);

  const handleAddFifthMember = useCallback(() => {
    append({ name: "", xProfile: "", linkedInProfile: "" });
    setPendingStepId("member-4");
    setDirection(1);
  }, [append]);

  const handleRemoveFifthMember = useCallback(() => {
    remove(4);
    setPendingStepId("add-fifth-member");
    setDirection(-1);
  }, [remove]);

  useEffect(() => {
    if (!pendingStepId) return;

    const targetIndex = steps.findIndex((item) => item.id === pendingStepId);
    if (targetIndex >= 0) {
      setStepIndex(targetIndex);
      setPendingStepId(null);
    }
  }, [members.length, pendingStepId, steps]);

  useEffect(() => {
    if (isCover || isReview) return;

    const timer = window.setTimeout(() => {
      const focusable = stepPanelRef.current?.querySelector<HTMLElement>(
        'input:not([type="hidden"]):not([tabindex="-1"]), textarea, button[type="button"]',
      );
      focusable?.focus();
    }, reduceMotion ? 0 : 320);

    return () => window.clearTimeout(timer);
  }, [step?.id, isCover, isReview, reduceMotion]);

  function handleStepKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (isAddFifth) return;
    if (event.key !== "Enter" || event.shiftKey || event.metaKey || event.ctrlKey) return;
    if (event.target instanceof HTMLTextAreaElement) return;
    if (event.target instanceof HTMLButtonElement && event.target.type === "button") return;

    event.preventDefault();
    if (isReview) {
      void handleSubmit();
      return;
    }
    goNext();
  }

  async function handleSubmit() {
    setSubmitError(null);
    const values = getValues();

    if (values.website.trim()) return;

    if (!values.video) {
      setSubmitError(t("submit.project.videoRequired"));
      return;
    }

    setIsSubmitting(true);
    setSubmitPhase("uploading-video");
    setUploadPercent(0);

    try {
      const videoStorageId = await uploadProjectVideo(
        values.video,
        () => generateUploadUrl(),
        setUploadPercent,
      );

      setSubmitPhase("submitting");
      await submitMutation({
        eventTeamId: team.teamId as Id<"event_teams">,
        leaderSessionId,
        repoUrl: values.repoUrl,
        description: values.description,
        videoStorageId,
        eventSocialPostUrl: values.eventSocialPostUrl,
        website: values.website,
      });
      onSuccess(team.name.trim());
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("submit.error.generic");
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
      setSubmitPhase("idle");
      setUploadPercent(0);
    }
  }

  async function onReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await handleSubmit();
  }

  const submitLabel =
    submitPhase === "uploading-video"
      ? t("submit.uploadingVideo")
      : submitPhase === "submitting"
        ? t("submit.submitting")
        : t("submit.submit");

  const descriptionLength = description?.length ?? 0;

  const stepVariants = reduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (navDirection: number) => ({
          x: navDirection > 0 ? 56 : -56,
          opacity: 0,
        }),
        center: { x: 0, opacity: 1 },
        exit: (navDirection: number) => ({
          x: navDirection > 0 ? -56 : 56,
          opacity: 0,
        }),
      };

  function renderStepContent(current: ProjectSubmitStep) {
    switch (current.kind) {
      case "team-name":
        return (
          <StepShell
            question={t("submit.team.name")}
            hint={t("submit.flow.teamHint")}
            stepNumber={progressIndex}
          >
            <input
              id="submit-team-name"
              autoComplete="organization"
              className={`${projectSubmitInputClass} submit-flow-input text-xl sm:text-2xl`}
              placeholder={t("submit.team.namePlaceholder")}
              {...register("teamName")}
            />
          </StepShell>
        );

      case "member":
        return (
          <ProjectSubmitMemberStep
            memberIndex={current.memberIndex ?? 0}
            stepNumber={progressIndex}
            onRemoveFifth={handleRemoveFifthMember}
          />
        );

      case "add-fifth-member":
        return (
          <ProjectSubmitAddFifthStep
            stepNumber={progressIndex}
            onAddFifth={handleAddFifthMember}
            onSkip={goNext}
          />
        );

      case "repo":
        return (
          <StepShell
            question={t("submit.project.repoUrl")}
            hint={t("submit.project.repoHint")}
            stepNumber={progressIndex}
          >
            <input
              id="submit-repo-url"
              type="url"
              className={`${projectSubmitInputClass} submit-flow-input text-lg sm:text-xl`}
              placeholder={t("submit.project.repoPlaceholder")}
              {...register("repoUrl")}
            />
          </StepShell>
        );

      case "description":
        return (
          <StepShell
            question={t("submit.project.description")}
            hint={t("submit.project.descriptionPlaceholder")}
            stepNumber={progressIndex}
          >
            <div className="space-y-2">
              <textarea
                id="submit-description"
                rows={5}
                maxLength={PROJECT_SUBMIT_DESCRIPTION_MAX}
                className={`${projectSubmitInputClass} submit-flow-input min-h-[8rem] resize-y text-base sm:text-lg`}
                placeholder={t("submit.project.descriptionPlaceholder")}
                {...register("description")}
              />
              <p className="submit-char-count text-right font-mono text-[0.6rem] tabular-nums text-fg-4">
                {descriptionLength}/{PROJECT_SUBMIT_DESCRIPTION_MAX}
              </p>
            </div>
          </StepShell>
        );

      case "video":
        return (
          <StepShell
            question={t("submit.project.video")}
            hint={t("submit.project.videoHint")}
            stepNumber={progressIndex}
          >
            <ProjectSubmitVideoField />
          </StepShell>
        );

      case "social":
        return (
          <StepShell
            question={t("submit.social.eventPostUrl")}
            hint={t("submit.social.eventPostHint")}
            stepNumber={progressIndex}
          >
            <input
              id="submit-event-post"
              type="url"
              className={`${projectSubmitInputClass} submit-flow-input text-lg sm:text-xl`}
              placeholder={t("submit.social.eventPostPlaceholder")}
              {...register("eventSocialPostUrl")}
            />
          </StepShell>
        );

      case "review":
        return (
          <StepShell
            question={t("submit.review.title")}
            hint={t("submit.review.subtitle")}
            stepNumber={progressIndex}
          >
            <ul className="submit-review-list space-y-3">
              <ReviewRow label={t("submit.team.name")} value={teamName} />
              <ReviewRow
                label={t("submit.members.title")}
                value={t("submit.review.memberCount").replace("{count}", String(team.memberCount))}
              />
              <ReviewRow label={t("submit.project.repoUrl")} value={repoUrl} />
              <ReviewRow label={t("submit.project.description")} value={description} multiline />
              <ReviewRow
                label={t("submit.project.video")}
                value={video?.name ?? t("submit.review.noVideo")}
              />
              <ReviewRow label={t("submit.social.eventPostUrl")} value={eventSocialPostUrl} />
            </ul>

            {isSubmitting && submitPhase === "uploading-video" ? (
              <div className="mt-6 space-y-2">
                <div className="h-1.5 overflow-hidden rounded-full bg-fg-7">
                  <div
                    className="h-full bg-accent transition-[width] duration-200"
                    style={{ width: `${uploadPercent}%` }}
                  />
                </div>
                <p className={`font-mono text-[0.65rem] uppercase tracking-[0.1em] ${projectSubmitHintClass}`}>
                  {t("submit.uploadProgress").replace("{percent}", String(uploadPercent))}
                </p>
              </div>
            ) : null}

            {submitError ? (
              <p
                className="submit-error mt-4 rounded-none border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                role="alert"
              >
                {submitError}
              </p>
            ) : null}
          </StepShell>
        );

      default:
        return null;
    }
  }

  if (isCover) {
    return <ProjectSubmitCover onStart={goNext} />;
  }

  return (
    <div className="submit-flow relative flex min-h-[calc(100dvh-var(--site-nav-height))] flex-col">
      <div
        className="submit-flow__progress pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 bg-border-faint"
        aria-hidden
      >
        <motion.div
          className="h-full bg-accent"
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: easeOut }}
        />
      </div>

      <div className="relative flex flex-1 flex-col section-padding pb-[max(5rem,env(safe-area-inset-bottom,0px))] pt-8 sm:pt-12">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-fg-4">
              {t("submit.flow.stepOf")
                .replace("{current}", String(Math.max(progressIndex, 1)))
                .replace("{total}", String(progressSteps.length - 1))}
            </p>
            <button
              type="button"
              onClick={goBack}
              className="submit-flow-back inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-fg-4 transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden />
              {t("submit.flow.back")}
            </button>
          </div>

          <form
            className="flex flex-1 flex-col"
            noValidate
            onSubmit={(event) => {
              void onReviewSubmit(event);
            }}
          >
            <div
              ref={stepPanelRef}
              className="flex flex-1 flex-col justify-center py-4 sm:py-8"
              onKeyDown={handleStepKeyDown}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step.id}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduceMotion ? 0.15 : 0.38, ease: easeOut }}
                  className="w-full"
                >
                  {renderStepContent(step)}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="submit-website">Website</label>
              <input
                id="submit-website"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            {!isReview && !isAddFifth ? (
              <div className="mt-auto flex flex-col gap-3 border-t border-border-faint pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-fg-5">
                  {t("submit.flow.pressEnter")}
                </p>
                <button
                  type="button"
                  onClick={goNext}
                  className="btn-phosphor group inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm sm:w-auto"
                >
                  {t("submit.flow.continue")}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    strokeWidth={2}
                    aria-hidden
                  />
                </button>
              </div>
            ) : (
              <div className="mt-auto border-t border-border-faint pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-phosphor inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <Check className="size-4" strokeWidth={2} aria-hidden />
                  {submitLabel}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

type StepShellProps = {
  question: string;
  hint?: string;
  stepNumber: number;
  children: ReactNode;
};

function StepShell({ question, hint, stepNumber, children }: StepShellProps) {
  return (
    <div className="submit-flow-step space-y-6">
      <div className="space-y-3">
        <p className="font-mono text-[0.65rem] tabular-nums uppercase tracking-[0.18em] text-accent">
          {String(stepNumber).padStart(2, "0")}
        </p>
        <h2 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-semibold leading-tight tracking-tight text-fg">
          {question}
        </h2>
        {hint ? (
          <p className={`max-w-prose text-sm leading-relaxed sm:text-base ${projectSubmitHintClass}`}>
            {hint}
          </p>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

type ReviewRowProps = {
  label: string;
  value: string;
  multiline?: boolean;
};

function ReviewRow({ label, value, multiline }: ReviewRowProps) {
  return (
    <li className="submit-review-row grid gap-1 border border-border-faint bg-bg-raised/50 px-4 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
      <span className={projectSubmitLabelClass}>{label}</span>
      <span
        className={`text-sm text-fg ${multiline ? "whitespace-pre-wrap break-words" : "truncate"}`}
        title={value}
      >
        {value || "—"}
      </span>
    </li>
  );
}
