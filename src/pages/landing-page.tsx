import { SeoJsonLd } from "../components/seo-json-ld";
import { HeroSection } from "../components/hero-section";
import { AboutSection } from "../components/about-section";
import { SponsorBenefitsSection } from "../components/brief/sponsor-benefits-section";
import { PeopleSection } from "../components/people-section";
import { NumbersSection } from "../components/brief/numbers-section";
import { DetailsSection } from "../components/details-section";
import { ScheduleSection } from "../components/schedule-section";
import { FAQSection } from "../components/faq-section";
import { FooterCTA } from "../components/footer-cta";

/**
 * Sponsor-first narrative order:
 *   1. Hero            — value proposition + sponsor logo rail above the fold
 *   2. Audience        — who is in the room and why they matter
 *   3. Sponsor outcomes — what sponsors actually get
 *   4. Credibility     — organizers prime the social proof
 *   5. Numbers         — high-contrast data band that opens logistics
 *   6. Details         — venue, dates, map
 *   7. Schedule        — opening / window / closing timeline
 *   8. FAQ             — concrete answers before email
 *   9. Final CTA       — coordinate sponsorship
 */
export function LandingPage() {
  return (
    <main>
      <SeoJsonLd />
      <HeroSection />
      <AboutSection />
      <SponsorBenefitsSection />
      <PeopleSection />
      <NumbersSection />
      <DetailsSection />
      <ScheduleSection />
      <FAQSection />
      <FooterCTA />
    </main>
  );
}
