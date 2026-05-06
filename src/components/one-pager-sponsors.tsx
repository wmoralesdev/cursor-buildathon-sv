import type { OnePagerSponsorLogoId } from "../data/sponsors";
import { onePagerSponsors } from "../data/sponsors";
import { OnePagerBrandLogo } from "./sponsor-logos";

/** Slightly taller + wider caps so wordmarks read clearly compared to SVG defaults. */
const ONE_PAGER_LOGO_LARGE_IDS = new Set<OnePagerSponsorLogoId>(["codex", "yonjob", "nubiwork"]);

function sponsorLogoClasses(id: OnePagerSponsorLogoId): string {
  if (ONE_PAGER_LOGO_LARGE_IDS.has(id)) {
    return "h-5 w-auto max-w-[112px] shrink-0 object-contain";
  }
  return "h-3.5 w-auto max-w-[82px] shrink-0 object-contain";
}

function SponsorCell({
  id,
  name,
  url,
  isHost,
}: {
  id: OnePagerSponsorLogoId;
  name: string;
  url: string;
  isHost?: boolean;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex min-h-0 items-center justify-center rounded px-2.5 py-1.5 no-underline transition-colors ${
        isHost
          ? "border border-accent/40 bg-accent/[0.07] hover:border-accent/60"
          : "border border-accent/20 bg-bg hover:border-accent/40"
      }`}
    >
      <OnePagerBrandLogo id={id} alt={name} className={sponsorLogoClasses(id)} />
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
      <div className="flex flex-wrap items-stretch justify-start gap-2">
        {onePagerSponsors.map((s) => (
          <SponsorCell key={s.id} id={s.id} name={s.name} url={s.url} isHost={s.badge === "host"} />
        ))}
        <OpenSlot />
      </div>
    </section>
  );
}
