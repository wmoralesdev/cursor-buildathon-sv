import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useHubQueryReady } from "../../hooks/use-hub-query-ready";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";
import { scrollToBuilderSection } from "../../lib/builder-section-scroll";

type StepId = "team" | "repo" | "project" | "feedback" | "deliverables";

const STEPS: { id: StepId; targetId: string; focusSelector?: string; labelKey: TranslationKey; hintKey: TranslationKey }[] = [
  {
    id: "team",
    targetId: "hub-team",
    labelKey: "hub.gettingStarted.step.team",
    hintKey: "hub.gettingStarted.step.teamHint",
  },
  {
    id: "repo",
    targetId: "hub-repo",
    focusSelector: "#hub-repo-link",
    labelKey: "hub.gettingStarted.step.repo",
    hintKey: "hub.gettingStarted.step.repoHint",
  },
  {
    id: "project",
    targetId: "hub-project",
    labelKey: "hub.gettingStarted.step.project",
    hintKey: "hub.gettingStarted.step.projectHint",
  },
  {
    id: "feedback",
    targetId: "hub-feedback",
    labelKey: "hub.gettingStarted.step.feedback",
    hintKey: "hub.gettingStarted.step.feedbackHint",
  },
  {
    id: "deliverables",
    targetId: "hub-deliverables",
    labelKey: "hub.gettingStarted.step.deliverables",
    hintKey: "hub.gettingStarted.step.deliverablesHint",
  },
];

const STEP_TOTAL = STEPS.length;

export function HubGettingStarted() {
  const { t } = useTranslation();
  const hubReady = useHubQueryReady();
  const team = useQuery(api.hub.teams.getMyTeam, hubReady ? {} : "skip");
  const repoDashboard = useQuery(api.hub.repoTracking.getRepoDashboard, hubReady ? {} : "skip");
  const projectData = useQuery(api.hub.projects.getMyProject, hubReady ? {} : "skip");
  const feedbackStatus = useQuery(
    api.hub.sponsorFeedback.getTeamFeedbackStatus,
    hubReady ? {} : "skip",
  );

  if (
    team === undefined ||
    repoDashboard === undefined ||
    projectData === undefined ||
    feedbackStatus === undefined
  ) {
    return (
      <div className="mb-8 h-28 animate-pulse border border-border-faint bg-surface/60" aria-hidden />
    );
  }

  const stepDone: Record<StepId, boolean> = {
    team: Boolean(team),
    repo: Boolean(repoDashboard?.repoUrl),
    project: Boolean(projectData?.project),
    feedback: feedbackStatus?.allComplete ?? false,
    deliverables: Boolean(projectData?.deliverables?.submittedAt),
  };

  const nextStep = STEPS.find((step) => !stepDone[step.id]);
  const doneCount = STEPS.filter((step) => stepDone[step.id]).length;

  return (
    <div className="mb-8 border border-accent/35 bg-surface p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[0.675rem] uppercase tracking-[0.14em] text-accent">
            {t("hub.gettingStarted.kicker")}
          </p>
          <h3 className="mt-1 font-display text-[1.15rem] font-semibold uppercase tracking-[0.04em] text-fg">
            {t("hub.gettingStarted.title")}
          </h3>
        </div>
        <p className="font-mono text-[0.675rem] uppercase tracking-[0.12em] text-fg-4">
          {t("hub.gettingStarted.progress")
            .replace("{done}", String(doneCount))
            .replace("{total}", String(STEP_TOTAL))}
        </p>
      </div>

      <p className="mb-5 max-w-[52ch] font-display text-[0.925rem] leading-relaxed text-fg-2">
        {nextStep ? t(nextStep.hintKey) : t("hub.gettingStarted.allDone")}
      </p>

      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, index) => {
          const done = stepDone[step.id];
          const isNext = nextStep?.id === step.id;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => scrollToBuilderSection(step.targetId, step.focusSelector)}
                className={`flex w-full items-start gap-3 border px-3 py-3 text-left transition-colors ${
                  isNext
                    ? "border-accent bg-accent/5 hover:bg-accent/10"
                    : "border-border-faint bg-bg/40 hover:border-accent/40"
                }`}
              >
                <span
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center font-mono text-[0.65rem] ${
                    done ? "bg-accent text-bg" : isNext ? "border border-accent text-accent" : "border border-border text-fg-4"
                  }`}
                >
                  {done ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[0.9rem] font-semibold uppercase tracking-[0.03em] text-fg">
                    {t(step.labelKey)}
                  </span>
                  <span className="mt-0.5 block font-mono text-[0.625rem] uppercase tracking-[0.1em] text-fg-4">
                    {done ? t("hub.gettingStarted.done") : isNext ? t("hub.gettingStarted.next") : t("hub.gettingStarted.pending")}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
