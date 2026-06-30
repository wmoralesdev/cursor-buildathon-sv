import { useState } from "react";
import { Link } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import { ProjectSubmitForm } from "../components/project-submit-form";
import { projectSubmitPanelClass } from "../components/project-submit-form-fields";
import { isConvexConfigured } from "../lib/convex-client";
import { useBuilderTeam } from "../hooks/use-builder-team";
import {
  DEFAULT_PROJECT_SUBMIT_VALUES,
  type ProjectSubmitFormValues,
} from "./project-submit-types";
import type { TranslationKey } from "../i18n/translations";
import { useTranslation } from "../context/language-context";

export function ProjectSubmitPage() {
  const { t } = useTranslation();

  if (!isConvexConfigured) {
    return (
      <main className="submit-page relative mx-auto w-full max-w-3xl section-padding pb-[max(6rem,env(safe-area-inset-bottom,0px))] pt-6 sm:pt-10">
        <div className={`${projectSubmitPanelClass} sm:p-8`}>
          <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
            {t("submit.unavailable.title")}
          </h1>
          <p className="submit-hint text-sm leading-relaxed">{t("submit.unavailable.body")}</p>
          <Link to="/" className="inline-flex text-sm text-accent underline-offset-2 hover:underline">
            {t("submit.success.home")}
          </Link>
        </div>
      </main>
    );
  }

  return <ProjectSubmitPageInner />;
}

function ProjectSubmitPageInner() {
  const { t } = useTranslation();
  const [submittedTeamName, setSubmittedTeamName] = useState<string | null>(null);
  const { sessionId, team, isLoading, canSubmit, minSubmitMembers } = useBuilderTeam();

  const methods = useForm<ProjectSubmitFormValues>({
    defaultValues: DEFAULT_PROJECT_SUBMIT_VALUES,
  });

  if (submittedTeamName) {
    return (
      <main className="submit-page relative mx-auto w-full max-w-3xl section-padding pb-[max(6rem,env(safe-area-inset-bottom,0px))] pt-6 sm:pt-10">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[min(90vw,48rem)] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div className={`submit-panel submit-panel--success relative space-y-4 rounded-none border border-accent/30 p-6 sm:p-8`}>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-accent">
            {t("submit.success.kicker")}
          </p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            {t("submit.success.title")}
          </h1>
          <p className="submit-hint text-sm leading-relaxed sm:text-base">
            {t("submit.success.body").replace("{teamName}", submittedTeamName)}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/" className="btn-phosphor inline-flex no-underline">
              {t("submit.success.home")}
            </Link>
            <Link
              to="/builder"
              className="inline-flex text-sm text-accent underline-offset-2 hover:underline"
            >
              {t("nav.builder")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading || !sessionId) {
    return (
      <main className="submit-page relative mx-auto w-full max-w-3xl section-padding pb-[max(6rem,env(safe-area-inset-bottom,0px))] pt-6 sm:pt-10">
        <div className={`${projectSubmitPanelClass} sm:p-8`}>
          <div className="h-5 w-40 animate-pulse rounded-none bg-border-faint" />
        </div>
      </main>
    );
  }

  if (!team || !team.isLeader || team.submitted || !canSubmit) {
    let messageKey: TranslationKey = "builder.team.gate.noTeam";
    if (team?.submitted) messageKey = "builder.team.gate.alreadySubmitted";
    else if (team && !team.isLeader) messageKey = "builder.team.gate.notLeader";
    else if (team && !canSubmit) messageKey = "builder.team.gate.needMore";

    const message = t(messageKey).replace("{count}", String(minSubmitMembers));

    return (
      <main className="submit-page relative mx-auto w-full max-w-3xl section-padding pb-[max(6rem,env(safe-area-inset-bottom,0px))] pt-6 sm:pt-10">
        <div className={`${projectSubmitPanelClass} sm:p-8`}>
          <h1 className="font-display text-2xl font-bold tracking-tight text-fg">
            {t("builder.team.gate.title")}
          </h1>
          <p className="submit-hint text-sm leading-relaxed">{message}</p>
          <Link
            to="/builder"
            className="inline-flex text-sm text-accent underline-offset-2 hover:underline"
          >
            {t("builder.team.gate.backToHub")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="submit-page relative w-full">
      <FormProvider {...methods}>
        <ProjectSubmitForm
          onSuccess={setSubmittedTeamName}
          team={team}
          leaderSessionId={sessionId}
        />
      </FormProvider>
    </main>
  );
}
