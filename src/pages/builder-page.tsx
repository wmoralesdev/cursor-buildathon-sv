import { BuilderAnnouncementBanner } from "../components/builder/builder-announcement-banner";
import { BuilderCreditsHelpSection } from "../components/builder/builder-credits-help-section";
import { BuilderJudgesSection } from "../components/builder/builder-judges-section";
import { BuilderLogisticsSection } from "../components/builder/builder-logistics-section";
import { BuilderMentorsSection } from "../components/builder/builder-mentors-section";
import { BuilderPageHero } from "../components/builder/builder-page-hero";
import { BuilderPrizesSection } from "../components/builder/builder-prizes-section";
import { BuilderSponsorCarousel } from "../components/builder/builder-sponsor-carousel";
import { BuilderSubmitSection } from "../components/builder/builder-submit-section";
import { BuilderTeamSection } from "../components/builder/builder-team-section";
import { BuilderTracksSection } from "../components/builder/builder-tracks-section";

/**
 * Participant hub (/builder): countdown, sponsors, team progress, day-of logistics,
 * mentors, judges, submission instructions, tracks, prizes, and credit redemption.
 */
export function BuilderPage() {
  return (
    <>
      <main className="builder-page pb-20 sm:pb-[4.75rem]">
        <BuilderAnnouncementBanner />
        <BuilderPageHero />
        <BuilderTeamSection />
        <BuilderLogisticsSection />
        <BuilderMentorsSection />
        <BuilderJudgesSection />
        <BuilderSubmitSection />
        <BuilderTracksSection />
        <BuilderPrizesSection />
        <BuilderCreditsHelpSection />
      </main>
      <BuilderSponsorCarousel />
    </>
  );
}
