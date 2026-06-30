import { BuilderProgressChecklist } from "./builder-progress-checklist";
import { BuilderTeamOnboarding } from "./builder-team-onboarding";
import { BuilderTeamPanel } from "./builder-team-panel";
import { useBuilderTeam } from "../../hooks/use-builder-team";
import { isConvexConfigured } from "../../lib/convex-client";
import { useTranslation } from "../../context/language-context";

export function BuilderTeamSection() {
  if (!isConvexConfigured) return null;
  return <BuilderTeamSectionInner />;
}

function BuilderTeamSectionInner() {
  const { t } = useTranslation();
  const { sessionId, team, isLoading, canSubmit, minSubmitMembers } = useBuilderTeam();

  return (
    <section id="team" className="relative scroll-mt-20 section-padding pb-4 pt-12 sm:pt-16">
      <div className="mx-auto max-w-[1400px]">
        <span className="tag mb-5 inline-block">{t("builder.team.tag")}</span>

        {isLoading || !sessionId ? (
          <div className="border border-border bg-surface p-6 sm:p-8">
            <div className="h-5 w-40 animate-pulse rounded-none bg-border-faint" />
          </div>
        ) : team ? (
          <>
            <BuilderProgressChecklist
              team={team}
              canSubmit={canSubmit}
              minSubmitMembers={minSubmitMembers}
            />
            <BuilderTeamPanel
              team={team}
              sessionId={sessionId}
              canSubmit={canSubmit}
              minSubmitMembers={minSubmitMembers}
            />
          </>
        ) : (
          <BuilderTeamOnboarding sessionId={sessionId} />
        )}
      </div>
    </section>
  );
}
