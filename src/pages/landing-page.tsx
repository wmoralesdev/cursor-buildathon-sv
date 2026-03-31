import { SeoJsonLd } from "../components/seo-json-ld";
import { HeroSection } from "../components/hero-section";
import { AboutSection } from "../components/about-section";
import { EventOverview } from "../components/brief/event-overview";
import { DetailsSection } from "../components/details-section";
import { NumbersSection } from "../components/brief/numbers-section";
import { SponsorsSection } from "../components/sponsors-section";
import { SponsorBenefitsSection } from "../components/brief/sponsor-benefits-section";
import { SponsorTiersSection } from "../components/brief/sponsor-tiers-section";
import { PeopleSection } from "../components/people-section";
import { ScheduleSection } from "../components/schedule-section";
import { FAQSection } from "../components/faq-section";
import { FooterCTA } from "../components/footer-cta";

export function LandingPage() {
  return (
    <main>
      <SeoJsonLd />
      <HeroSection />
      <AboutSection />
      <PeopleSection />
      <SponsorBenefitsSection />
      <SponsorTiersSection />
      <FAQSection />
      <EventOverview />
      <DetailsSection />
      <NumbersSection />
      <SponsorsSection />
      <ScheduleSection />
      <FooterCTA />
    </main>
  );
}
