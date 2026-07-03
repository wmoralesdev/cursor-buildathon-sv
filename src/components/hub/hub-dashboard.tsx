import { useEffect } from "react";
import { SignInButton, useAuth } from "@clerk/react";
import { Link } from "react-router-dom";
import { useHubUser } from "../../hooks/use-hub-user";
import { isClerkConfigured } from "../../lib/convex-clerk-provider";
import { isConvexConfigured } from "../../lib/convex-client";
import { useTranslation } from "../../context/language-context";
import { HubBoothScheduler } from "./hub-booth-scheduler";
import { HubDeliverablesCard } from "./hub-deliverables-card";
import { HubMentorsGrid } from "./hub-mentors-grid";
import { HubProgressChecklist } from "./hub-progress-checklist";
import { HubProjectCard } from "./hub-project-card";
import { HubSocialPosts } from "./hub-social-posts";
import { HubSponsorFeedback } from "./hub-sponsor-feedback";
import { HubTeamCard } from "./hub-team-card";
import { HubButton, HubCard } from "./hub-ui-primitives";

export function HubDashboard() {
  const { t } = useTranslation();
  const { isSignedIn, isLoaded: isClerkLoaded } = useAuth();
  const { role, isHubConvexLoading, isReady, user } = useHubUser();

  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7524/ingest/ae7e5f7a-7927-4023-a554-d1b0cfb79922", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "73c77a" },
      body: JSON.stringify({
        sessionId: "73c77a",
        runId: "post-fix",
        hypothesisId: "C",
        location: "hub-dashboard.tsx:render-gate",
        message: "Hub dashboard render gate",
        data: {
          isClerkLoaded,
          isSignedIn,
          isHubConvexLoading,
          isReady,
          hasUser: Boolean(user),
          branch: !isSignedIn
            ? "sign-in"
            : isHubConvexLoading
              ? "convex-loading"
              : "grid",
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, [isClerkLoaded, isSignedIn, isHubConvexLoading, isReady, user]);
  // #endregion

  if (!isConvexConfigured || !isClerkConfigured) {
    return (
      <section id="hub" className="scroll-mt-24 py-16 sm:py-20">
        <HubCard title={t("hub.title")} tag={t("hub.tag")}>
          <p className="font-display text-[0.925rem] text-fg-2">{t("hub.setupRequired")}</p>
        </HubCard>
      </section>
    );
  }

  return (
    <section id="hub" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="tag mb-4 inline-block">{t("hub.tag")}</span>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold uppercase tracking-[0.04em] text-fg">
              {t("hub.title")}
            </h2>
            <p className="mt-3 max-w-2xl font-display text-[0.975rem] leading-relaxed text-fg-2">
              {t("hub.intro")}
            </p>
          </div>
          {isSignedIn && role ? (
            <Link to="/admin">
              <HubButton variant="ghost">{t("hub.openAdmin")}</HubButton>
            </Link>
          ) : null}
        </div>

        {!isSignedIn ? (
          <HubCard title={t("hub.signInTitle")}>
            <p className="mb-5 font-display text-[0.925rem] text-fg-2">{t("hub.signInIntro")}</p>
            <SignInButton mode="modal">
              <HubButton>{t("hub.signInCta")}</HubButton>
            </SignInButton>
          </HubCard>
        ) : isHubConvexLoading ? (
          <HubCard title={t("hub.title")} tag={t("hub.tag")}>
            <div className="h-24 animate-pulse bg-border-faint" />
            <p className="mt-4 font-display text-[0.925rem] text-fg-2">{t("hub.connecting")}</p>
          </HubCard>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            <HubTeamCard />
            <HubProgressChecklist />
            <HubProjectCard />
            <HubDeliverablesCard />
            <HubSponsorFeedback />
            <HubSocialPosts />
            <HubMentorsGrid />
            <HubBoothScheduler />
          </div>
        )}
    </section>
  );
}
