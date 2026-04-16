import { Printer } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { OnePagerSponsors } from "../components/one-pager-sponsors";
import { AILABS_URL, CASH_SPONSOR_MAILTO } from "../constants";
import "../styles/one-pager-print.css";

const UFG_URL = "https://ufg.edu.sv/";

const ONEPAGER_PROOF_IMAGES = [
  {
    src: "/onepager/hackathon-cursor-amdp-labs.jpg",
    alt: "Cursor Hackathon El Salvador — wide shot at AMPD Labs",
  },
  {
    src: "/onepager/dsc-2329.jpg",
    alt: "Cursor Hackathon El Salvador — event photo",
  },
  {
    src: "/onepager/dsc-2457.jpg",
    alt: "Cursor Hackathon El Salvador — participants",
  },
] as const;

const siteDisplay =
  typeof import.meta.env.VITE_SITE_URL === "string" && import.meta.env.VITE_SITE_URL.length > 0
    ? import.meta.env.VITE_SITE_URL.replace(/^https?:\/\//, "").replace(/\/+$/, "")
    : "Event site";

type TierValue = string | boolean;

interface BenefitRow {
  label: string;
  bronze: TierValue;
  silver: TierValue;
  gold: TierValue;
}

interface BenefitGroup {
  category: string;
  rows: BenefitRow[];
}

const TIER_BENEFITS: BenefitGroup[] = [
  {
    category: "Talent access",
    rows: [
      { label: "Attendee profiles (LinkedIn + GitHub)", bronze: true, silver: true, gold: true },
      { label: "On-site team seats", bronze: "2", silver: "4", gold: "8" },
      { label: "Office hours slot with attendees", bronze: false, silver: "30 min", gold: "60 min" },
      { label: "Priority intros + early demo access", bronze: false, silver: false, gold: true },
    ],
  },
  {
    category: "Event presence",
    rows: [
      { label: "Discord channel + opening ceremony shout-out", bronze: true, silver: true, gold: true },
      { label: "Lead a session or panel", bronze: false, silver: "30 min", gold: "60 min" },
      { label: "Sponsor a side activity", bronze: false, silver: "1", gold: "2" },
      { label: "Co-host a meal or coffee break", bronze: false, silver: false, gold: true },
      { label: "Named award + stand + closing stage \u00B9", bronze: false, silver: false, gold: true },
    ],
  },
  {
    category: "Brand visibility",
    rows: [
      { label: "Logo on event site & slides", bronze: true, silver: true, gold: true },
      { label: "Posts on event social channels", bronze: true, silver: true, gold: true },
      { label: "Spotlight in pre-event comms", bronze: false, silver: true, gold: true },
      { label: "Hand out branded material + digital guide feature", bronze: false, silver: false, gold: true },
    ],
  },
  {
    category: "Post-event",
    rows: [
      { label: "Thank-you in post-event email", bronze: true, silver: true, gold: true },
      { label: "Opt-in attendee contact list", bronze: false, silver: true, gold: true },
      { label: "Talent report + content package", bronze: false, silver: false, gold: true },
    ],
  },
];

export function OnePagerCashPage() {
  const [searchParams] = useSearchParams();
  const embedOnly =
    searchParams.get("embed") === "1" || searchParams.get("embed") === "true";

  return (
    <div
      className={`one-pager-root one-pager-white${embedOnly ? " one-pager-embed" : ""}`}
      data-theme="light"
    >
      {!embedOnly && (
        <div className="one-pager-no-print flex justify-center border-b border-border bg-bg py-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded border border-border bg-bg-raised px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-fg shadow-sm hover:border-accent hover:text-accent"
          >
            <Printer className="size-3.5" aria-hidden />
            Print / Save PDF
          </button>
        </div>
      )}

      <div
        id="one-pager-sheet"
        className="one-pager-sheet bg-bg text-[9pt] leading-snug text-fg"
      >
        <div className="one-pager-grid" aria-hidden />

        <div className="relative">
          <div className="mb-2 h-1 w-full bg-accent" />

          <header className="one-pager-avoid-break mb-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <h1 className="font-display text-[1.4rem] font-bold uppercase leading-none tracking-tight">
                  Cursor Buildathon
                </h1>
                <p className="mt-1 font-display text-[0.95rem] font-semibold uppercase tracking-wide text-fg-2">
                  El Salvador 2026
                </p>
              </div>
              <div className="one-pager-header-meta shrink-0 text-right font-mono text-[0.58rem] leading-snug text-fg-2 sm:text-[0.6rem]">
                <p>04 · 05 · JUL 2026 · 8:00 → 9:00</p>
                <p className="mt-0.5">
                  <a href={UFG_URL} className="font-semibold text-fg underline underline-offset-2">
                    UFG
                  </a>
                  {" · Universidad Francisco Gavidia"}
                </p>
              </div>
            </div>
          </header>
        </div>

        <section
          className="one-pager-stats one-pager-avoid-break mb-3 grid grid-cols-5 overflow-hidden rounded-md border border-border bg-bg-raised text-center"
          aria-label="Key numbers"
        >
          <StatCell value="~200" label="attendee target" sub="July 4-5" />
          <StatCell value="145" label="attended Jan 31" sub="Cursor Hackathon SV" />
          <StatCell value="45" label="groups built" sub="last hackathon" />
          <StatCell value="500+" label="builders reached" sub="Ai /abs community" />
          <StatCell value="24h" label="continuous build" sub="non-stop event" />
        </section>

        <OnePagerSponsors />

        <div className="one-pager-cols-main grid grid-cols-[1.15fr_0.95fr] gap-4">
          {/* Left: why sponsor + tier table */}
          <div className="min-w-0 space-y-3">
            <div className="one-pager-avoid-break border-l-4 border-accent pl-3">
              <h2 className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-accent">
                Why sponsor this event
              </h2>
              <div className="space-y-1.5 text-[7.5pt] leading-relaxed text-fg-2">
                <WhyItem n={1} title="Reach active builders">
                  Your company lands in front of ~200 developers, designers, and founders
                  during a focused 24-hour build. No passive expo halls — attendees are
                  engaged and building the entire time.
                </WhyItem>
                <WhyItem n={2} title="See talent under pressure">
                  Watch people solve hard problems live. Identify who ships fast, collaborates
                  well, and thinks on their feet — then talk to them before anyone else does.
                </WhyItem>
                <WhyItem n={3} title="Hire before the job post">
                  Access attendee profiles, hold on-site conversations, and book private
                  interviews. The best candidates are found here, not on job boards.
                </WhyItem>
                <WhyItem n={4} title="Invest in the ecosystem">
                  Backing a local tech event builds long-term goodwill. Attendees remember
                  the companies that showed up early when it mattered.
                </WhyItem>
              </div>
            </div>

            {/* Tier comparison table — overflow visible so Figma does not clip wide rows */}
            <div className="one-pager-avoid-break min-w-0 rounded border border-border bg-bg-raised">
              <div className="border-b border-border px-2.5 py-2">
                <h2 className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-fg">
                  Sponsorship tiers
                </h2>
              </div>

              <table className="one-pager-tier-table w-full text-[6.8pt]">
                <thead>
                  <tr className="border-b border-border bg-bg text-center">
                    <th className="py-1.5 pl-2.5 pr-1 text-left font-mono text-[0.5rem] font-normal uppercase tracking-[0.1em] text-fg-3">
                      Benefit
                    </th>
                    <th className="px-1 py-1.5 font-mono text-[0.5rem] font-bold uppercase tracking-[0.1em] text-[#8b5a2b]">
                      Bronze
                      <span className="block text-[0.55rem] font-bold tabular-nums text-fg">$500+</span>
                    </th>
                    <th className="px-1 py-1.5 font-mono text-[0.5rem] font-bold uppercase tracking-[0.1em] text-[#6b7280]">
                      Silver
                      <span className="block text-[0.55rem] font-bold tabular-nums text-fg">$1,000+</span>
                    </th>
                    <th className="px-1 py-1.5 pr-2.5 font-mono text-[0.5rem] font-bold uppercase tracking-[0.1em] text-accent">
                      Gold
                      <span className="block text-[0.55rem] font-bold tabular-nums text-fg">$2,000+</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TIER_BENEFITS.map((group) => (
                    <TierGroup key={group.category} group={group} />
                  ))}
                </tbody>
              </table>

              <p className="border-t border-border px-2.5 py-1.5 text-[6pt] leading-relaxed text-fg-4">
                <sup>1</sup> Physical stand and named award subject to venue availability.
                All prices in USD. Custom packages available on request.
              </p>
            </div>
          </div>

          {/* Right: audience + proof + organizers + photos */}
          <div className="min-w-0 space-y-3">
            <SectionTitle>Who attends</SectionTitle>
            <div className="grid min-w-0 grid-cols-2 gap-2 text-[7.5pt]">
              <AudienceCard
                title="50% developers"
                body="Software engineers and full-stack builders across all experience levels. High-value hires for any tech team."
              />
              <AudienceCard
                title="20% designers"
                body="Product and UX professionals who collaborate closely with engineering. Hard-to-find cross-functional talent."
              />
              <AudienceCard
                title="20% founders + marketing"
                body="Decision-makers building startups or leading teams. Potential clients, partners, or senior hires."
              />
              <AudienceCard
                title="10% students"
                body="Early-career talent getting first exposure to professional tooling. Future interns and junior hires."
              />
            </div>
            <p className="text-[7pt] leading-relaxed text-fg-3">
              Experience levels are intentionally mixed, so sponsors reach both emerging builders
              and experienced operators in the same room.
            </p>

            <div className="one-pager-avoid-break min-w-0 max-w-full rounded border border-accent/30 bg-accent/[0.03] p-2.5">
              <h3 className="mb-1 font-mono text-[0.55rem] font-bold uppercase tracking-[0.12em] text-accent">
                Proof this is real
              </h3>
              <div className="min-w-0 space-y-1 text-[7.3pt] leading-relaxed text-fg-2">
                <ProofItem>
                  Cursor Hackathon El Salvador on Jan 31 brought 145 attendees and 45 groups.
                </ProofItem>
                <ProofItem>
                  Distribution runs through Cursor support, Ai /abs, UFG socials, WhatsApp, and
                  tech influencers in El Salvador.
                </ProofItem>
                <ProofItem>
                  UFG gives the event a real university venue plus local ecosystem credibility.
                </ProofItem>
              </div>
            </div>

            <div className="one-pager-avoid-break min-w-0">
              <SectionTitle>Who is organizing</SectionTitle>
              <div className="grid min-w-0 grid-cols-2 gap-2 text-[6.9pt] leading-relaxed">
                <CredibilityCard
                  name="Walter Morales"
                  body="Founder, Ai /abs · Cursor Ambassador (SV & CA) · 500+ builders · hackathons & university workshops · 6+ years software engineering."
                />
                <CredibilityCard
                  name="Daniela Huezo"
                  body="Co-Founder, Ai /abs · Cursor Ambassador · 5+ years leading software development and high-impact teams."
                />
              </div>
            </div>

            <div className="one-pager-avoid-break min-w-0">
              <SectionTitle>Event photos</SectionTitle>
              <div className="grid min-w-0 grid-cols-3 gap-1.5">
                {ONEPAGER_PROOF_IMAGES.map(({ src, alt }) => (
                  <figure
                    key={src}
                    className="one-pager-proof-photo relative aspect-[3/2] overflow-hidden rounded border border-border bg-bg-raised"
                  >
                    <img
                      src={src}
                      alt={alt}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                ))}
              </div>
              <p className="mt-1.5 text-[6.9pt] leading-relaxed text-fg-3">
                These images are documentary only and do not include sponsor logos or watermarks on
                the photos themselves.
              </p>
            </div>

            <div className="one-pager-avoid-break min-w-0 max-w-full rounded border border-accent/30 bg-accent/[0.02] p-2.5">
              <h2 className="mb-1 font-mono text-[0.55rem] font-bold uppercase tracking-[0.12em] text-accent">
                Where your sponsorship goes
              </h2>
              <p className="text-[7.5pt] leading-relaxed text-fg-2">
                Cash sponsorships fund the prize pool, event logistics (food and supplies),
                printed materials and signage, and pre-event marketing and promotion.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="one-pager-footer-block mt-4">
          <div className="mb-2 flex min-w-0 flex-wrap items-start justify-between gap-3 border-t border-border pt-2 text-[7.5pt] text-fg-2">
            <div className="min-w-0">
              <p className="mb-0.5 font-mono text-[0.5rem] font-bold uppercase tracking-wider text-fg">Organizers</p>
              <p>
                <a href={AILABS_URL} className="font-semibold text-fg underline">Ai /abs</a> with{" "}
                <a href={UFG_URL} className="text-fg underline">UFG</a> and Cursor Community support.
              </p>
              <p>Cash sponsorships fund venue, logistics, prizes, and a better experience for every attendee.</p>
            </div>
            <div className="shrink-0 text-right text-fg-3">
              <p>San Salvador, 2026.</p>
              <p>Mostly El Salvador, open to Central America.</p>
            </div>
          </div>

          <div className="one-pager-cta-bar rounded px-4 py-2.5">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <a
                  href={CASH_SPONSOR_MAILTO}
                  className="font-display text-[11pt] font-bold tracking-tight"
                >
                  hello@wmorales.dev
                </a>
                <p className="mt-1 text-[7.5pt] leading-relaxed">
                  Pick a tier or tell us what you have in mind. We&apos;ll send back a
                  custom activation plan within 48h.
                </p>
              </div>
              <span className="shrink-0 font-mono text-[0.5rem] font-bold uppercase tracking-wider">
                Become a sponsor →
              </span>
            </div>
          </div>

          <p className="mt-2 text-center font-mono text-[0.5rem] leading-relaxed text-fg-3">
            <a href="/" className="text-accent underline underline-offset-2">
              {siteDisplay}
            </a>
            {" · "}
            &copy; 2026 Cursor Buildathon El Salvador · Presented by Cursor Community
          </p>
        </footer>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-1.5 w-full max-w-full border-b border-border pb-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-fg">
      {children}
    </h2>
  );
}

function StatCell({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="one-pager-stat-cell min-w-0 border-r border-bg-alt px-0.5 py-1.5 last:border-r-0 md:py-2">
      <p className="text-[0.82rem] font-bold uppercase leading-none tracking-tight text-accent md:text-[0.88rem]">
        {value}
      </p>
      <p className="mt-0.5 font-mono text-[0.46rem] uppercase leading-tight text-fg-2 md:text-[0.5rem]">
        {label}
      </p>
      <p className="mt-px font-mono text-[0.42rem] leading-tight text-fg-3 md:text-[0.46rem]">
        {sub}
      </p>
    </div>
  );
}

function AudienceCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-w-0 rounded border border-border bg-bg-raised p-2">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-1.5 gap-y-0">
        <span className="one-pager-proof-dot mt-[0.35em] shrink-0" aria-hidden />
        <div className="min-w-0">
          <p className="font-semibold leading-tight text-fg">{title}</p>
          <p className="mt-0.5 break-words leading-relaxed text-fg-2">{body}</p>
        </div>
      </div>
    </div>
  );
}

function CredibilityCard({ name, body }: { name: string; body: string }) {
  return (
    <div className="min-w-0 rounded border border-border bg-bg-raised p-1.5">
      <p className="font-semibold leading-tight text-fg">{name}</p>
      <p className="mt-0.5 break-words leading-relaxed text-fg-2">{body}</p>
    </div>
  );
}

function ProofItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="one-pager-proof-line grid grid-cols-[auto_minmax(0,1fr)] gap-x-1.5 text-fg-2">
      <span className="one-pager-proof-dot mt-[0.35em] shrink-0" aria-hidden />
      <p className="m-0 min-w-0 break-words">{children}</p>
    </div>
  );
}

function WhyItem({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="one-pager-why-line grid grid-cols-[auto_minmax(0,1fr)] gap-x-2">
      <span className="one-pager-step-num mt-px shrink-0">{n}</span>
      <p className="m-0 min-w-0 break-words">
        <span className="font-semibold text-fg">{title}.</span> {children}
      </p>
    </div>
  );
}

function TierCell({ value }: { value: TierValue }) {
  if (value === true) {
    return <span className="text-accent">●</span>;
  }
  if (value === false) {
    return <span className="text-fg-4">—</span>;
  }
  return <span className="font-semibold tabular-nums text-fg">{value}</span>;
}

function TierGroup({ group }: { group: BenefitGroup }) {
  return (
    <>
      <tr>
        <td
          colSpan={4}
          className="border-b border-border bg-bg px-2.5 py-1 font-mono text-[0.48rem] font-bold uppercase tracking-[0.14em] text-accent"
        >
          {group.category}
        </td>
      </tr>
      {group.rows.map((row) => (
        <tr key={row.label} className="border-b border-border-faint last:border-border">
          <td className="min-w-0 break-words py-[3px] pl-2.5 pr-1 text-fg-2">{row.label}</td>
          <td className="px-1 py-[3px] text-center"><TierCell value={row.bronze} /></td>
          <td className="px-1 py-[3px] text-center"><TierCell value={row.silver} /></td>
          <td className="px-1 py-[3px] pr-2.5 text-center"><TierCell value={row.gold} /></td>
        </tr>
      ))}
    </>
  );
}
