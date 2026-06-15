import type { Ref } from "react";

import { PARTNER_RAIL } from "./hero-partner-config";

interface SponsorRailGroupProps {
  ariaHidden?: boolean;
  groupRef?: Ref<HTMLDivElement>;
}

export function SponsorRailGroup({ ariaHidden = false, groupRef }: SponsorRailGroupProps) {
  return (
    <div
      ref={groupRef}
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={ariaHidden || undefined}
    >
      {PARTNER_RAIL.map((p) => {
        const Logo = p.Logo;
        return (
          <a
            key={p.id}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            role={ariaHidden ? undefined : "listitem"}
            aria-label={ariaHidden ? undefined : `${p.label} — product partner`}
            tabIndex={ariaHidden ? -1 : 0}
            onPointerDown={(event) => event.stopPropagation()}
            className="relative z-20 shrink-0 origin-center motion-reduce:snap-start opacity-90 transition-[opacity,transform] duration-300 ease-out hover:z-30 hover:opacity-100 hover:scale-[1.1] active:scale-[0.98]"
          >
            <Logo alt={ariaHidden ? "" : p.label} className={p.className} />
          </a>
        );
      })}
    </div>
  );
}
