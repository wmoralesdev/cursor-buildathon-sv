import { SeoJsonLd } from "../components/seo-json-ld";
import { HeroSection } from "../components/hero-section";
import { AboutSection } from "../components/about-section";
import { EventStorySection } from "../components/event-story-section";
import { PeopleSection } from "../components/people-section";
import { SponsorsSection } from "../components/sponsors-section";
import { MentorsSection } from "../components/mentors-section";
import { JudgesSection } from "../components/judges-section";
import { NumbersSection } from "../components/brief/numbers-section";
import { DetailsSection } from "../components/details-section";
import { ScheduleSection } from "../components/schedule-section";
import { FAQSection } from "../components/faq-section";
import { FooterCTA } from "../components/footer-cta";

/**
 * Public event page narrative order:
 *   1. Hero            — unchanged; partner rail above the fold
 *   2. About           — what the buildathon is
 *   3. Story           — what to watch during the event
 *   4. Organizers      — who runs it
 *   5. Sponsors        — full partner grid
 *   6. Mentors         — advisor roster (skeleton until confirmed)
 *   7. Judges          — jury roster (skeleton until confirmed)
 *   8. Numbers         — facts band
 *   9. Details         — venue, dates, map
 *  10. Schedule        — opening / window / closing timeline
 *  11. FAQ             — public event answers
 *  12. Final CTA       — follow updates + press contact
 */
export function LandingPage() {
  return (
    <main>
      <SeoJsonLd />
      <HeroSection />
      <AboutSection />
      <EventStorySection />
      <PeopleSection />
      <SponsorsSection />
      <MentorsSection />
      <JudgesSection />
      <NumbersSection />
      <DetailsSection />
      <ScheduleSection />
      <FAQSection />
      <FooterCTA />
    </main>
  );
}
