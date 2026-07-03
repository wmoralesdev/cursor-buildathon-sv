import { lazy, Suspense } from "react";
import { useAuth } from "@clerk/react";

import { BUILDER_TEAM_SECTION_ENABLED } from "../constants";
import { useBuilderActiveSection } from "../hooks/use-builder-active-section";
import type { BuilderSectionId } from "../lib/builder-sections";
import { isClerkConfigured } from "../lib/convex-clerk-provider";
import { BuilderAnnouncementBanner } from "../components/builder/builder-announcement-banner";
import { BuilderHeroHeader, BuilderTabNav } from "../components/builder/builder-page-hero";
import { BuilderLogisticsSection } from "../components/builder/builder-logistics-section";
import { BuilderSubmitSection } from "../components/builder/builder-submit-section";
import { BuilderTabPanel } from "../components/builder/builder-tab-panel";
import { BuilderTracksSection } from "../components/builder/builder-tracks-section";
import { HubDashboard } from "../components/hub/hub-dashboard";

const BuilderMentorsSection = lazy(() =>
  import("../components/builder/builder-mentors-section").then((m) => ({
    default: m.BuilderMentorsSection,
  })),
);
const BuilderPrizesSection = lazy(() =>
  import("../components/builder/builder-prizes-section").then((m) => ({
    default: m.BuilderPrizesSection,
  })),
);
const BuilderCreditsHelpSection = lazy(() =>
  import("../components/builder/builder-credits-help-section").then((m) => ({
    default: m.BuilderCreditsHelpSection,
  })),
);
const BuilderFaqSection = lazy(() =>
  import("../components/builder/builder-faq-section").then((m) => ({
    default: m.BuilderFaqSection,
  })),
);
const BuilderSponsorCarousel = lazy(() =>
  import("../components/builder/builder-sponsor-carousel").then((m) => ({
    default: m.BuilderSponsorCarousel,
  })),
);
const BuilderTeamSectionLazy = lazy(() =>
  import("../components/builder/builder-team-section").then((m) => ({
    default: m.BuilderTeamSection,
  })),
);

const BUILDER_MAIN_CLASS =
  "builder-page flex h-[calc(100dvh-var(--site-nav-height))] max-h-[calc(100dvh-var(--site-nav-height))] min-h-0 flex-col overflow-hidden pb-20 sm:pb-[4.75rem]";

function BuilderSectionSkeleton({
  sectionId,
  minHeight = "14rem",
}: {
  sectionId: string;
  minHeight?: string;
}) {
  return (
    <div
      id={sectionId}
      className="py-16 sm:py-20"
      style={{ minHeight }}
      aria-hidden
    >
      <div className="h-32 border border-border-faint bg-surface/40 sm:h-40" />
    </div>
  );
}

function BuilderSponsorRail() {
  return (
    <Suspense fallback={null}>
      <BuilderSponsorCarousel />
    </Suspense>
  );
}

function BuilderGuestPage() {
  return (
    <>
      <main className={BUILDER_MAIN_CLASS}>
        <BuilderAnnouncementBanner />
        <BuilderHeroHeader />
      </main>
      <BuilderSponsorRail />
    </>
  );
}

function BuilderAuthedPage() {
  const { activeSection, visitedSections, setActiveSection, paneRef } = useBuilderActiveSection({
    enabled: true,
  });
  const hasVisited = (sectionId: BuilderSectionId) => visitedSections.has(sectionId);

  return (
    <>
      <main className={BUILDER_MAIN_CLASS}>
        <BuilderAnnouncementBanner />
        <BuilderTabNav activeSection={activeSection} onSectionChange={setActiveSection} />

        <div
          ref={paneRef}
          className="builder-tab-pane min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
        >
          <BuilderTabPanel
            sectionId="hub"
            activeSection={activeSection}
            visited={hasVisited("hub")}
          >
            <HubDashboard />
          </BuilderTabPanel>

          {BUILDER_TEAM_SECTION_ENABLED ? (
            <BuilderTabPanel
              sectionId="team"
              activeSection={activeSection}
              visited={hasVisited("team")}
              fallback={<BuilderSectionSkeleton sectionId="team" minHeight="12rem" />}
            >
              <BuilderTeamSectionLazy />
            </BuilderTabPanel>
          ) : null}

          <BuilderTabPanel
            sectionId="logistics"
            activeSection={activeSection}
            visited={hasVisited("logistics")}
          >
            <BuilderLogisticsSection />
          </BuilderTabPanel>

          <BuilderTabPanel
            sectionId="mentors"
            activeSection={activeSection}
            visited={hasVisited("mentors")}
            fallback={<BuilderSectionSkeleton sectionId="mentors" minHeight="28rem" />}
          >
            <BuilderMentorsSection />
          </BuilderTabPanel>

          <BuilderTabPanel
            sectionId="submit"
            activeSection={activeSection}
            visited={hasVisited("submit")}
          >
            <BuilderSubmitSection />
          </BuilderTabPanel>

          <BuilderTabPanel
            sectionId="tracks"
            activeSection={activeSection}
            visited={hasVisited("tracks")}
          >
            <BuilderTracksSection />
          </BuilderTabPanel>

          <BuilderTabPanel
            sectionId="premios"
            activeSection={activeSection}
            visited={hasVisited("premios")}
            fallback={<BuilderSectionSkeleton sectionId="premios" minHeight="20rem" />}
          >
            <BuilderPrizesSection />
          </BuilderTabPanel>

          <BuilderTabPanel
            sectionId="credits"
            activeSection={activeSection}
            visited={hasVisited("credits")}
            fallback={<BuilderSectionSkeleton sectionId="credits" minHeight="22rem" />}
          >
            <BuilderCreditsHelpSection />
          </BuilderTabPanel>

          <BuilderTabPanel
            sectionId="faq"
            activeSection={activeSection}
            visited={hasVisited("faq")}
            fallback={<BuilderSectionSkeleton sectionId="faq" minHeight="12rem" />}
          >
            <BuilderFaqSection />
          </BuilderTabPanel>
        </div>
      </main>

      <BuilderSponsorRail />
    </>
  );
}

/**
 * Participant hub (/builder): guests see hero + sponsors; signed-in users see tabs and panes.
 */
export function BuilderPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const showAuthedHub = isClerkConfigured && isLoaded && isSignedIn;

  if (!showAuthedHub) {
    return <BuilderGuestPage />;
  }

  return <BuilderAuthedPage />;
}
