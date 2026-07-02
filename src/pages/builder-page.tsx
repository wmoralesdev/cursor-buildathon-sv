import { lazy, Suspense } from "react";

import { BuilderAnnouncementBanner } from "../components/builder/builder-announcement-banner";
import { BuilderDeferredSection } from "../components/builder/builder-deferred-section";
import { BuilderHubTabNav } from "../components/builder/builder-hub-tab-nav";
import { BuilderHubTabPanel } from "../components/builder/builder-hub-tab-panel";
import { BuilderLogisticsSection } from "../components/builder/builder-logistics-section";
import { BuilderPageHero } from "../components/builder/builder-page-hero";
import { BuilderSubmitSection } from "../components/builder/builder-submit-section";
import { BuilderTracksSection } from "../components/builder/builder-tracks-section";
import { BUILDER_TEAM_SECTION_ENABLED } from "../constants";
import { useBuilderHubTab } from "../hooks/use-builder-hub-tab";

const BuilderMentorsSection = lazy(() =>
  import("../components/builder/builder-mentors-section").then((m) => ({
    default: m.BuilderMentorsSection,
  })),
);
const BuilderJudgesSection = lazy(() =>
  import("../components/builder/builder-judges-section").then((m) => ({
    default: m.BuilderJudgesSection,
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
      className="scroll-mt-32 py-14 sm:py-16 lg:py-20"
      style={{ minHeight }}
      aria-hidden
    >
      <div className="h-32 border border-border-faint bg-surface/40 sm:h-40" />
    </div>
  );
}

/**
 * Participant hub (/builder): countdown, sponsors, team progress, day-of logistics,
 * mentors, judges, submission instructions, tracks, prizes, credit redemption, and FAQ.
 */
export function BuilderPage() {
  const { activeTabId, selectTab, selectSection } = useBuilderHubTab();
  const tabActive = (tab: typeof activeTabId) => activeTabId === tab;

  return (
    <>
      <main className="builder-page pb-20 sm:pb-[4.75rem]">
        <BuilderAnnouncementBanner />
        <BuilderPageHero />
        <BuilderHubTabNav
          activeTabId={activeTabId}
          onSelectTab={selectTab}
          onSelectSection={selectSection}
        />

        <BuilderHubTabPanel tabId="event" activeTabId={activeTabId}>
          <BuilderLogisticsSection layout="tab" />
          {BUILDER_TEAM_SECTION_ENABLED ? (
            <BuilderDeferredSection sectionId="team" minHeight="12rem" active={tabActive("event")}>
              <Suspense fallback={<BuilderSectionSkeleton sectionId="team" minHeight="12rem" />}>
                <BuilderTeamSectionLazy layout="tab" />
              </Suspense>
            </BuilderDeferredSection>
          ) : null}
        </BuilderHubTabPanel>

        <BuilderHubTabPanel tabId="build" activeTabId={activeTabId}>
          <BuilderDeferredSection sectionId="mentors" minHeight="28rem" active={tabActive("build")}>
            <Suspense fallback={<BuilderSectionSkeleton sectionId="mentors" minHeight="28rem" />}>
              <BuilderMentorsSection layout="tab" />
            </Suspense>
          </BuilderDeferredSection>

          <BuilderSubmitSection layout="tab" />

          <BuilderDeferredSection sectionId="credits" minHeight="22rem" active={tabActive("build")}>
            <Suspense fallback={<BuilderSectionSkeleton sectionId="credits" minHeight="22rem" />}>
              <BuilderCreditsHelpSection layout="tab" />
            </Suspense>
          </BuilderDeferredSection>
        </BuilderHubTabPanel>

        <BuilderHubTabPanel tabId="compete" activeTabId={activeTabId}>
          <BuilderTracksSection layout="tab" />

          <BuilderDeferredSection sectionId="judges" minHeight="18rem" active={tabActive("compete")}>
            <Suspense fallback={<BuilderSectionSkeleton sectionId="judges" minHeight="18rem" />}>
              <BuilderJudgesSection layout="tab" />
            </Suspense>
          </BuilderDeferredSection>

          <BuilderDeferredSection sectionId="premios" minHeight="20rem" active={tabActive("compete")}>
            <Suspense fallback={<BuilderSectionSkeleton sectionId="premios" minHeight="20rem" />}>
              <BuilderPrizesSection layout="tab" />
            </Suspense>
          </BuilderDeferredSection>
        </BuilderHubTabPanel>

        <BuilderHubTabPanel tabId="help" activeTabId={activeTabId}>
          <BuilderDeferredSection sectionId="faq" minHeight="12rem" active={tabActive("help")}>
            <Suspense fallback={<BuilderSectionSkeleton sectionId="faq" minHeight="12rem" />}>
              <BuilderFaqSection layout="tab" />
            </Suspense>
          </BuilderDeferredSection>
        </BuilderHubTabPanel>
      </main>

      <Suspense fallback={null}>
        <BuilderSponsorCarousel />
      </Suspense>
    </>
  );
}
