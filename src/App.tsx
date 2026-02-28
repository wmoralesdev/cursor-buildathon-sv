import { Navigation } from "./components/navigation";
import { HeroSection } from "./components/hero-section";
import { AboutSection } from "./components/about-section";
import { WhoSection } from "./components/who-section";
import { DetailsSection } from "./components/details-section";
import { SponsorsSection } from "./components/sponsors-section";
import { RegisterCta } from "./components/register-cta";
import { NoiseOverlay } from "./components/noise-overlay";

function App() {
  return (
    <>
      <NoiseOverlay />
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <WhoSection />
        <DetailsSection />
        <SponsorsSection />
        <RegisterCta />
      </main>
    </>
  );
}

export default App;
