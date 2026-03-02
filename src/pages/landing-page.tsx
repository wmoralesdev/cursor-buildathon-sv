import { HeroSection } from "../components/hero-section";
import { AboutSection } from "../components/about-section";
import { DetailsSection } from "../components/details-section";
import { SponsorsSection } from "../components/sponsors-section";
import { ScheduleSection } from "../components/schedule-section";
import { FAQSection } from "../components/faq-section";
import { FooterCTA } from "../components/footer-cta";

export function LandingPage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <DetailsSection />
      <SponsorsSection />
      <ScheduleSection />
      <FAQSection />
      <FooterCTA />
    </main>
  );
}
