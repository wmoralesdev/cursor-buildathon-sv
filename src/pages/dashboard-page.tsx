import { useState, useEffect, useCallback } from "react";
import { Navigate, useLocation, useBlocker } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTranslation } from "../context/language-context";
import { TeamFormTab } from "../components/dashboard/team-form-tab";
import { ProjectFormTab } from "../components/dashboard/project-form-tab";
import { SocialPostsTab } from "../components/dashboard/social-posts-tab";

type TabId = "team" | "project" | "social";

export function DashboardPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const team = useQuery(api.teams.getByCurrentUser);

  const [activeTab, setActiveTab] = useState<TabId>("team");
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [projectFormDirty, setProjectFormDirty] = useState(false);

  const hasNoTeam = team !== undefined && !team;
  const effectiveTab = hasNoTeam ? "team" : activeTab;
  const effectiveIsEditingTeam = hasNoTeam ? true : isEditingTeam;

  const shouldBlockRoute =
    location.pathname === "/dashboard" &&
    effectiveTab === "project" &&
    projectFormDirty;

  const blocker = useBlocker(shouldBlockRoute);

  useEffect(() => {
    if (!shouldBlockRoute) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [shouldBlockRoute]);

  const handleTabClick = useCallback(
    (tab: TabId) => {
      if (effectiveTab === "project" && projectFormDirty) {
        const confirmed = window.confirm(t("dashboard.unsavedChanges.message"));
        if (confirmed) {
          setProjectFormDirty(false);
          setActiveTab(tab);
        }
      } else {
        setActiveTab(tab);
      }
    },
    [effectiveTab, projectFormDirty, t]
  );

  const handleBlockerStay = useCallback(() => {
    blocker.reset?.();
  }, [blocker]);

  const handleBlockerLeave = useCallback(() => {
    blocker.proceed?.();
  }, [blocker]);

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const teamId = team?._id ?? null;
  const leaderName =
    team && team.members[team.leaderIndex]
      ? team.members[team.leaderIndex].name
      : null;

  const showTeamForm = !team || effectiveIsEditingTeam;

  return (
    <main className="relative min-h-screen section-padding bg-bg">
      <div className="max-w-2xl mx-auto pt-12 pb-24">
        <span className="tag mb-6 inline-block">// panel</span>
        <h1 className="font-bold uppercase leading-none font-display text-[2rem] text-fg tracking-[-0.02em]">
          {t("dashboard.title")}
        </h1>

        <div className="mt-8 flex gap-1 border-b border-border">
          <button
            type="button"
            onClick={() => handleTabClick("team")}
            className={`px-4 py-3 font-mono text-[0.7rem] tracking-wider uppercase transition-colors ${
              effectiveTab === "team"
                ? "text-accent border-b-2 border-accent -mb-px"
                : "text-fg-3 hover:text-fg"
            }`}
          >
            {t("dashboard.tabs.team")}
          </button>
          <button
            type="button"
            onClick={() => handleTabClick("project")}
            disabled={!team}
            aria-disabled={!team}
            className={`px-4 py-3 font-mono text-[0.7rem] tracking-wider uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-fg-3 ${
              effectiveTab === "project"
                ? "text-accent border-b-2 border-accent -mb-px"
                : "text-fg-3 hover:text-fg"
            }`}
          >
            {t("dashboard.tabs.project")}
          </button>
          <button
            type="button"
            onClick={() => handleTabClick("social")}
            disabled={!team}
            aria-disabled={!team}
            className={`px-4 py-3 font-mono text-[0.7rem] tracking-wider uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-fg-3 ${
              effectiveTab === "social"
                ? "text-accent border-b-2 border-accent -mb-px"
                : "text-fg-3 hover:text-fg"
            }`}
          >
            {t("dashboard.tabs.social")}
          </button>
        </div>

        <div className="mt-8 border border-border bg-surface px-6 py-8 sm:px-9 sm:py-10">
          {effectiveTab === "team" && (
            <>
              <span className="tag mb-6 inline-block">
                {t("dashboard.teamForm.title")}
              </span>
              {showTeamForm ? (
                <TeamFormTab />
              ) : (
                <div className="space-y-4">
                  <div className="font-display text-fg-2">
                    <p className="font-semibold text-fg">{team?.name}</p>
                    <p className="text-[0.85rem] text-fg-3 mt-1">
                      {team?.members.length} {t("dashboard.teamForm.membersCount")}
                      {leaderName && ` · ${t("dashboard.teamForm.leader")}: ${leaderName}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingTeam(true)}
                    className="font-mono text-[0.65rem] tracking-wider text-accent hover:text-accent-dim uppercase transition-colors"
                  >
                    {t("dashboard.teamForm.editTeam")}
                  </button>
                </div>
              )}
            </>
          )}

          {effectiveTab === "project" && (
            <>
              <span className="tag mb-6 inline-block">
                {t("dashboard.projectForm.title")}
              </span>
              <ProjectFormTab
                teamId={teamId}
                onDirtyChange={setProjectFormDirty}
              />
            </>
          )}

          {effectiveTab === "social" && (
            <>
              <span className="tag mb-6 inline-block">
                {t("dashboard.socialForm.title")}
              </span>
              <SocialPostsTab teamId={teamId} />
            </>
          )}
        </div>
      </div>

      {blocker.state === "blocked" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          role="dialog"
          aria-modal="true"
          aria-labelledby="unsaved-changes-title"
        >
          <div className="mx-4 w-full max-w-md border border-border bg-surface px-6 py-6 shadow-lg">
            <h2
              id="unsaved-changes-title"
              className="font-display text-lg font-semibold text-fg"
            >
              {t("dashboard.unsavedChanges.title")}
            </h2>
            <p className="mt-2 text-[0.9rem] text-fg-3">
              {t("dashboard.unsavedChanges.message")}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleBlockerStay}
                className="btn-phosphor text-sm px-6 py-2.5"
              >
                {t("dashboard.unsavedChanges.stay")}
              </button>
              <button
                type="button"
                onClick={handleBlockerLeave}
                className="border border-border bg-bg px-6 py-2.5 font-mono text-[0.7rem] tracking-wider text-fg-3 uppercase transition-colors hover:border-accent/60 hover:text-fg"
              >
                {t("dashboard.unsavedChanges.leave")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
