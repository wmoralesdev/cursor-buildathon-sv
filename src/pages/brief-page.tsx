import { Link } from "react-router-dom";
import { BriefHeader } from "../components/brief/brief-header";
import { EventOverview } from "../components/brief/event-overview";
import { NumbersSection } from "../components/brief/numbers-section";
import { TracksSection } from "../components/brief/tracks-section";
import { OrganizersSection } from "../components/brief/organizers-section";
import { JurySection } from "../components/brief/jury-section";
import { MentorsSection } from "../components/brief/mentors-section";
import { SponsorBenefitsSection } from "../components/brief/sponsor-benefits-section";
import { LUMA_URL } from "../constants";

function BriefFooter() {
  return (
    <footer className="section-padding border-t border-border bg-bg pt-12 pb-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="font-mono text-[0.6rem] tracking-[0.15em] text-fg-5 uppercase mb-1.5">
            DOC-002 · v1.0 · 07.03.2026
          </div>
          <div className="font-display text-[0.85rem] text-fg-3">
            Cursor Hackathon Guatemala · Universidad del Valle de Guatemala
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
          <Link
            to="/"
            className="font-mono text-[0.65rem] tracking-[0.12em] text-fg-3 no-underline uppercase transition-colors duration-200"
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-3)")}
          >
            ← Volver al sitio
          </Link>
          <a
            href="mailto:hello@wmorales.dev"
            className="font-mono text-[0.65rem] tracking-[0.12em] text-fg-3 no-underline uppercase transition-colors duration-200"
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-3)")}
          >
            Patrocinar →
          </a>
          <a
            href={LUMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-phosphor px-7 py-3"
          >
            Registrate →
          </a>
        </div>
      </div>
    </footer>
  );
}

export function BriefPage() {
  return (
    <main>
      <BriefHeader />
      <EventOverview />
      <NumbersSection />
      <TracksSection />
      <OrganizersSection />
      <JurySection />
      <MentorsSection />
      <SponsorBenefitsSection />
      <BriefFooter />
    </main>
  );
}
