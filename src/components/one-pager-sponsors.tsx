import type { OnePagerSponsorBadge } from "../data/sponsors";
import { onePagerSponsors } from "../data/sponsors";

const BADGE_STYLES: Record<OnePagerSponsorBadge, string> = {
  host: "border-accent/50 bg-accent/[0.08] text-accent",
  gold: "border-[#c9a227]/55 bg-[#c9a227]/14 text-[#6b4f0a]",
};

function SponsorCell({
  name,
  logo,
  url,
  badge,
}: {
  name: string;
  logo: string;
  url: string;
  badge: OnePagerSponsorBadge;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-0 items-center justify-center gap-2 rounded border border-accent/20 bg-bg px-2.5 py-1.5 no-underline transition-colors hover:border-accent/40"
    >
      <img
        src={logo}
        alt={name}
        className="h-3.5 w-auto max-w-[82px] shrink-0 object-contain"
      />
      <span
        className={`shrink-0 rounded-sm border px-1.5 py-px font-mono text-[0.4rem] font-bold uppercase leading-none tracking-[0.12em] ${BADGE_STYLES[badge]}`}
      >
        {badge}
      </span>
    </a>
  );
}

function OpenSlot() {
  return (
    <div className="flex items-center justify-center rounded border border-dashed border-border-dim px-2.5 py-1.5">
      <span className="font-mono text-[0.42rem] font-semibold uppercase tracking-[0.1em] text-fg-4">
        Slots available
      </span>
    </div>
  );
}

export function OnePagerSponsors() {
  return (
    <section
      className="one-pager-avoid-break mb-3 rounded-md border border-accent/30 bg-accent/[0.015] px-2.5 py-2"
      aria-label="Confirmed sponsors"
    >
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <h2 className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-accent">
          Confirmed sponsors
        </h2>
        <span className="shrink-0 font-mono text-[0.42rem] uppercase tracking-[0.1em] text-fg-4">
          {onePagerSponsors.length} confirmed · limited availability
        </span>
      </div>
      <div className="grid auto-cols-fr grid-flow-col gap-2">
        {onePagerSponsors.map((s) => (
          <SponsorCell key={s.id} {...s} />
        ))}
        <OpenSlot />
      </div>
    </section>
  );
}
