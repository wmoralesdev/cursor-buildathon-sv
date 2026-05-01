import { SeoJsonLd } from "../components/seo-json-ld";
import { HeroSection } from "../components/hero-section";
import { AboutSection } from "../components/about-section";
import { SponsorBenefitsSection } from "../components/brief/sponsor-benefits-section";
import { SponsorTiersSection } from "../components/brief/sponsor-tiers-section";
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
 *   4. Packages        — financial / product / hybrid paths
 *   5. Credibility     — organizers prime the social proof
 *   6. Numbers         — high-contrast data band that opens logistics
 *   7. Details         — venue, dates, map
 *   8. Schedule        — opening / window / closing timeline
 *   9. FAQ             — concrete answers before email
 *  10. Final CTA       — coordinate sponsorship
 */
export function LandingPage() {
  return (
    <main>
      <SeoJsonLd />
      <HeroSection />
      <AboutSection />
      <SponsorBenefitsSection />
      <SponsorTiersSection />
      <PeopleSection />
      <NumbersSection />
      <DetailsSection />
      <ScheduleSection />
      <FAQSection />
      <FooterCTA />
    </main>
  );
}
