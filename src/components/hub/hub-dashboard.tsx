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
  const { isSignedIn } = useAuth();
  const { role, isLoading } = useHubUser();

  if (!isConvexConfigured || !isClerkConfigured) {
    return (
      <section id="hub" className="scroll-mt-24 section-padding py-16 sm:py-20">
        <div className="mx-auto max-w-[1400px]">
          <HubCard title={t("hub.title")} tag={t("hub.tag")}>
            <p className="font-display text-[0.925rem] text-fg-2">{t("hub.setupRequired")}</p>
          </HubCard>
        </div>
      </section>
    );
  }

  return (
    <section id="hub" className="scroll-mt-24 section-padding py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px]">
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
        ) : isLoading ? (
          <div className="h-40 animate-pulse border border-border bg-surface" />
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
      </div>
    </section>
  );
}
