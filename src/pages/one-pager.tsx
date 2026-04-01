import { Printer } from "lucide-react";

import { AILABS_URL, SPONSOR_MAILTO } from "../constants";
import "../styles/one-pager-print.css";

const UFG_URL = "https://ufg.edu.sv/";

/** Proof images in `public/onepager/` (Jan 2026 Cursor Hackathon El Salvador) */
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

export function OnePagerPage() {
  return (
    <div className="one-pager-root one-pager-white" data-theme="light">
      {/* Screen-only print button */}
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

      <div
        id="one-pager-sheet"
        className="one-pager-sheet bg-bg text-[9pt] leading-snug text-fg"
      >
        {/* Faint grid atmosphere */}
        <div className="one-pager-grid" aria-hidden />

        {/* Accent top bar */}
        <div className="relative">
          <div className="mb-2 h-1 w-full bg-accent" />

          {/* Header — titles left, date/venue meta right (saves vertical space) */}
          <header className="one-pager-avoid-break mb-3">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <img src="/lockup-light.png" alt="Cursor" className="h-5 w-auto object-contain" />
                <span className="font-mono text-[0.5rem] uppercase tracking-[0.15em] text-fg-3">
                  Sponsor brief
                </span>
              </div>
              <span className="shrink-0 font-mono text-[0.5rem] uppercase tracking-[0.15em] text-fg-4">
                July 2026
              </span>
            </div>
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
                <p className="mt-0.5">continuous build</p>
              </div>
            </div>
          </header>
        </div>

        {/* Stats strip */}
        <section
          className="one-pager-stats one-pager-avoid-break mb-3 grid grid-cols-5 border border-border bg-bg-raised text-center"
          aria-label="Key numbers"
        >
          <StatCell value="~200" label="attendee target" sub="July 4-5" />
          <StatCell value="145" label="attended Jan 31" sub="Cursor Hackathon SV" />
          <StatCell value="45" label="groups built" sub="last hackathon" />
          <StatCell value="500+" label="builders reached" sub="Ai /abs community" />
          <StatCell value="24h" label="product usage" sub="continuous build" />
        </section>

        {/* Two columns */}
        <div className="grid grid-cols-[1.15fr_0.95fr] gap-4">
          {/* Left: pitch + how it works */}
          <div className="space-y-3">
            {/* Hero callout */}
            <div className="one-pager-avoid-break border-l-4 border-accent pl-3">
              <h2 className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-accent">
                What your brand gets
              </h2>
              <p className="text-[9pt] leading-relaxed text-fg">
                Put your product in front of ~200 builders during a 24-hour buildathon built for
                hands-on adoption, not passive logo placement. Best-fit partners are AI, API, and
                cloud-devtools teams that want product usage, project demos, and direct feedback
                from builders who ship fast.
              </p>
              <p className="mt-2 text-[7.5pt] leading-relaxed text-fg-2">
                Audience mix: 50% developers, 20% designers, 10% marketing, 10% founders, and
                10% students. Most attendees come from El Salvador, with open reach across Central
                America and balanced experience levels in the room.
              </p>
            </div>

            {/* Support request */}
            <div className="one-pager-avoid-break rounded border border-accent/30 bg-accent/[0.02] p-2.5">
              <h2 className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-fg">
                What we need from you
              </h2>
              <ul className="space-y-1 text-[7.5pt] leading-relaxed text-fg-2">
                <li>API credits, licenses, trials, or extended plans for teams building on your tool</li>
                <li>A short warm-up session or starter resources so attendees arrive ready to build</li>
                <li>Logo files plus one clear product message for your named track or bounty</li>
                <li>Optional swag or separate prize support if you want a larger sponsor award</li>
              </ul>
              <p className="mt-2 text-[7pt] leading-relaxed text-fg-3">
                Judges must attend in person. Mentors can join online. Tooling support and bounty
                prizes can be handled separately when needed.
              </p>
            </div>

            {/* How it works */}
            <div className="one-pager-avoid-break rounded border border-border bg-bg-raised p-2.5">
              <h2 className="mb-2 font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-fg">
                Before / during / after
              </h2>
              <div className="space-y-2">
                <Step n={1} title="Before the event">
                  <li>Warm-up session and sponsor activation plan locked in writing</li>
                  <li>Track name, prize mechanics, logo usage, and redemption flow approved early</li>
                </Step>

                <Step n={2} title="During the 24h build">
                  <li>Named track or bounty: &ldquo;Best use of [Your Product]&rdquo;</li>
                  <li>Your brand on event assets, venue screens, and communications</li>
                  <li>In-person judge option for your team, with remote mentors welcome online</li>
                </Step>

                <Step n={3} title="After the event">
                  <li>Recap with winning builds, sponsor mentions, and usage highlights</li>
                  <li>Feedback summary plus social posts featuring teams that built with your tool</li>
                </Step>
              </div>
            </div>
          </div>

          {/* Right: audience + warm-up + proof */}
          <div className="space-y-3">
            <SectionTitle>Why this audience matters</SectionTitle>
            <div className="grid grid-cols-2 gap-2 text-[7.5pt]">
              <AudienceCard
                title="50% developers"
                body="Primary users for AI, infra, and devtools products. Strong fit for hands-on adoption."
              />
              <AudienceCard
                title="20% designers"
                body="Product and UX collaborators shaping workflows, prompts, and user-facing demos in real time."
              />
              <AudienceCard
                title="20% founders + marketing"
                body="Decision-makers who care about shipping, storytelling, demos, and distribution after the event."
              />
              <AudienceCard
                title="10% students"
                body="Early-career builders and future hires getting first exposure to professional developer tooling."
              />
            </div>
            <p className="text-[7pt] leading-relaxed text-fg-3">
              Experience levels are intentionally mixed, so sponsors reach both emerging builders
              and experienced operators in the same room.
            </p>

            <div className="one-pager-avoid-break rounded border border-accent/30 bg-accent/[0.03] p-2.5">
              <h3 className="mb-1 font-mono text-[0.55rem] font-bold uppercase tracking-[0.12em] text-accent">
                Proof this is real
              </h3>
              <div className="space-y-1 text-[7.3pt] leading-relaxed text-fg-2">
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

            <div className="one-pager-avoid-break">
              <SectionTitle>Who is organizing</SectionTitle>
              <div className="grid grid-cols-2 gap-2 text-[6.9pt] leading-relaxed">
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

            <div className="one-pager-avoid-break">
              <SectionTitle>Event photos</SectionTitle>
              <div className="grid grid-cols-3 gap-1.5">
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
                Sponsor names and logos stay off-page until each sponsor is confirmed.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="one-pager-footer-block mt-4">
          {/* Organizers */}
          <div className="mb-2 flex items-start justify-between border-t border-border pt-2 text-[7.5pt] text-fg-2">
            <div>
              <p className="mb-0.5 font-mono text-[0.5rem] font-bold uppercase tracking-wider text-fg">Organizers</p>
              <p>
                <a href={AILABS_URL} className="font-semibold text-fg underline">Ai /abs</a> with{" "}
                <a href={UFG_URL} className="text-fg underline">UFG</a> and Cursor Community support.
              </p>
              <p>Built for sponsor activations that turn into usage, demos, and follow-up relationships.</p>
            </div>
            <div className="text-right text-fg-3">
              <p>San Salvador, 2026.</p>
              <p>Mostly El Salvador, open to Central America.</p>
            </div>
          </div>

          {/* Accent CTA bar */}
          <div className="one-pager-cta-bar rounded px-4 py-2.5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <a
                  href={SPONSOR_MAILTO}
                  className="font-display text-[11pt] font-bold tracking-tight"
                >
                  hello@wmorales.dev
                </a>
                <p className="mt-1 text-[7.5pt] leading-relaxed">
                  Tell us what your product can offer and we&apos;ll send back a named track,
                  activation plan, and sponsor scope within 48h.
                </p>
              </div>
              <span className="shrink-0 font-mono text-[0.5rem] font-bold uppercase tracking-wider">
                Get the sponsor brief →
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

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mb-1.5 border-b border-border pb-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-fg">
      {children}
    </h2>
  );
}

function StatCell({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="one-pager-stat-cell border-r border-bg-alt px-0.5 py-1.5 last:border-r-0 md:py-2">
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
    <div className="rounded border border-border bg-bg-raised p-2">
      <p className="one-pager-dot flex items-start gap-1.5 font-semibold leading-tight text-fg">
        {title}
      </p>
      <p className="mt-0.5 leading-relaxed text-fg-2">{body}</p>
    </div>
  );
}

function CredibilityCard({ name, body }: { name: string; body: string }) {
  return (
    <div className="rounded border border-border bg-bg-raised p-1.5">
      <p className="font-semibold leading-tight text-fg">{name}</p>
      <p className="mt-0.5 leading-relaxed text-fg-2">{body}</p>
    </div>
  );
}

function ProofItem({ children }: { children: React.ReactNode }) {
  return <p className="one-pager-dot flex items-start gap-1.5">{children}</p>;
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="one-pager-step-num mt-px">{n}</span>
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-[8pt] font-bold uppercase tracking-wide text-fg">{title}</p>
        <ul className="space-y-1 text-[7.5pt] leading-relaxed text-fg-2">
          {children}
        </ul>
      </div>
    </div>
  );
}
