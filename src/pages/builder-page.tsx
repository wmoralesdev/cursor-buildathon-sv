import { lazy, Suspense } from "react";

import { BuilderAnnouncementBanner } from "../components/builder/builder-announcement-banner";
import { BuilderDeferredSection } from "../components/builder/builder-deferred-section";
import { BuilderLogisticsSection } from "../components/builder/builder-logistics-section";
import { BuilderPageHero } from "../components/builder/builder-page-hero";
import { BuilderSubmitSection } from "../components/builder/builder-submit-section";
import { BuilderTracksSection } from "../components/builder/builder-tracks-section";
import { BUILDER_TEAM_SECTION_ENABLED } from "../constants";

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
      className="scroll-mt-24 section-padding py-24 sm:py-32 lg:py-40"
      style={{ minHeight }}
      aria-hidden
    >
      <div className="mx-auto h-32 max-w-[1400px] border border-border-faint bg-surface/40 sm:h-40" />
    </div>
  );
}

/**
 * Participant hub (/builder): countdown, sponsors, team progress, day-of logistics,
 * mentors, judges, submission instructions, tracks, prizes, credit redemption, and FAQ.
 */
export function BuilderPage() {
  return (
    <>
      <main className="builder-page pb-20 sm:pb-[4.75rem]">
        <BuilderAnnouncementBanner />
        <BuilderPageHero />
        {BUILDER_TEAM_SECTION_ENABLED ? (
          <BuilderDeferredSection sectionId="team" minHeight="12rem">
            <Suspense fallback={<BuilderSectionSkeleton sectionId="team" minHeight="12rem" />}>
              <BuilderTeamSectionLazy />
            </Suspense>
          </BuilderDeferredSection>
        ) : null}
        <BuilderLogisticsSection />

        <BuilderDeferredSection sectionId="mentors" minHeight="28rem">
          <Suspense fallback={<BuilderSectionSkeleton sectionId="mentors" minHeight="28rem" />}>
            <BuilderMentorsSection />
          </Suspense>
        </BuilderDeferredSection>

        <BuilderDeferredSection sectionId="judges" minHeight="18rem">
          <Suspense fallback={<BuilderSectionSkeleton sectionId="judges" minHeight="18rem" />}>
            <BuilderJudgesSection />
          </Suspense>
        </BuilderDeferredSection>

        <BuilderSubmitSection />

        <BuilderTracksSection />

        <BuilderDeferredSection sectionId="premios" minHeight="20rem">
          <Suspense fallback={<BuilderSectionSkeleton sectionId="premios" minHeight="20rem" />}>
            <BuilderPrizesSection />
          </Suspense>
        </BuilderDeferredSection>

        <BuilderDeferredSection sectionId="credits" minHeight="22rem">
          <Suspense fallback={<BuilderSectionSkeleton sectionId="credits" minHeight="22rem" />}>
            <BuilderCreditsHelpSection />
          </Suspense>
        </BuilderDeferredSection>

        <BuilderDeferredSection sectionId="faq" minHeight="12rem">
          <Suspense fallback={<BuilderSectionSkeleton sectionId="faq" minHeight="12rem" />}>
            <BuilderFaqSection />
          </Suspense>
        </BuilderDeferredSection>
      </main>

      <Suspense fallback={null}>
        <BuilderSponsorCarousel />
      </Suspense>
    </>
  );
}
