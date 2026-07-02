import type { ReactElement } from "react";

import { ExportZeroTwoOneLogo } from "./export-logo-marks";
import { OnePagerBrandLogo, ZavuLogo } from "./sponsor-logos";
import type { SponsorSpotKey } from "./sponsor-spot-logo";
import { WELCOME_CARD_SPONSOR_MARK_KEYS } from "./welcome-sponsor-marks";

const PARTNER_LABELS: Record<SponsorSpotKey, string> = {
  codex: "Codex",
  n8n: "n8n",
  zavu: "Zavu",
  elevenlabs: "ElevenLabs",
  simov: "Simov",
  abaco: "Abaco",
  "021": "Zero Two One",
  yonjob: "Yonjob",
  nubiwork: "Nub;Work",
  kreali: "Kreali",
  weris: "Weris",
  boxful: "Boxful",
  gamesquad: "GameSquad",
  searchyou: "SearchYou",
  dma: "DMA",
  netlify: "Netlify",
  wispr: "Wispr",
  fal: "Fal",
  exa: "Exa",
  svnet: "SVNet",
  firecrawl: "Firecrawl",
  datamcp: "DataMCP",
  rcns: "RCNS",
  cognition: "Cognition",
  drop: "Drop",
};

/** Compact one-pager footer sizing — tuned for 6×3 grid on US Letter. */
const ONE_PAGER_PARTNER_LOGO_CLASS: Record<SponsorSpotKey, string> = {
  codex: "h-[1.21rem] w-auto max-w-[4.43rem] object-contain",
  n8n: "h-[1.15rem] w-auto max-w-[3.97rem] object-contain",
  zavu: "h-[1.04rem] w-auto max-w-[3.62rem] object-contain",
  elevenlabs: "h-[1.04rem] w-auto max-w-[4.26rem] object-contain",
  simov: "h-[1.04rem] w-auto max-w-[3.97rem] object-contain",
  abaco: "h-[0.98rem] w-auto max-w-[3.62rem] object-contain",
  "021": "h-[0.98rem] w-auto max-w-[4.08rem] object-contain",
  yonjob: "h-[1.09rem] w-auto max-w-[4.26rem] object-contain",
  nubiwork: "h-[1.29rem] w-auto max-w-[5.18rem] object-contain",
  kreali: "h-[1.04rem] w-auto max-w-[4.08rem] object-contain",
  weris: "h-[1.04rem] w-auto max-w-[4.08rem] object-contain",
  boxful: "h-[1.04rem] w-auto max-w-[4.08rem] object-contain",
  gamesquad: "h-[1.36rem] w-auto max-w-[5.18rem] object-contain",
  searchyou: "h-[1.04rem] w-auto max-w-[4.26rem] object-contain",
  dma: "h-[1.01rem] w-auto max-w-[4.43rem] object-contain",
  netlify: "h-[1.21rem] w-auto max-w-[5.18rem] object-contain",
  wispr: "h-[1.04rem] w-auto max-w-[4.43rem] object-contain",
  fal: "h-[1.15rem] w-auto max-w-[3.62rem] object-contain",
  exa: "h-[1.04rem] w-auto max-w-[3.97rem] object-contain",
  svnet: "h-[1.04rem] w-auto max-w-[4.08rem] object-contain",
  firecrawl: "h-[1.04rem] w-auto max-w-[4.26rem] object-contain",
  datamcp: "h-[1.04rem] w-auto max-w-[4.08rem] object-contain",
  rcns: "h-[1.04rem] w-auto max-w-[4.08rem] object-contain",
  cognition: "h-[1.04rem] w-auto max-w-[4.43rem] object-contain",
  drop: "h-[1.01rem] w-auto max-w-[3.62rem] object-contain",
};

function isProductSponsorId(key: SponsorSpotKey): key is Exclude<SponsorSpotKey, "zavu" | "021"> {
  return key !== "zavu" && key !== "021";
}

function OnePagerPartnerLogo({ id }: { id: SponsorSpotKey }): ReactElement {
  const className = ONE_PAGER_PARTNER_LOGO_CLASS[id];
  const alt = PARTNER_LABELS[id];

  if (id === "zavu") {
    return <ZavuLogo alt={alt} className={className} />;
  }

  if (id === "021") {
    return (
      <ExportZeroTwoOneLogo className={className} style={{ color: "var(--fg)" }} />
    );
  }

  if (!isProductSponsorId(id)) {
    throw new Error(`one-pager partner logo: unsupported id "${id}"`);
  }

  return <OnePagerBrandLogo id={id} alt={alt} className={className} />;
}

type OnePagerPartnerLogosRowProps = {
  label: string;
  ariaLabel: string;
};

export function OnePagerPartnerLogosRow({ label, ariaLabel }: OnePagerPartnerLogosRowProps) {
  return (
    <div
      className="one-pager-partner-logos-row one-pager-avoid-break mb-1.5 border-t border-border pt-1.5"
      aria-label={ariaLabel}
    >
      <p className="mb-1 font-mono text-[0.48rem] font-bold uppercase tracking-wider text-fg">
        {label}
      </p>
      <ul className="one-pager-partner-logos-grid m-0 grid list-none grid-cols-6 gap-x-2.5 gap-y-2 p-0">
        {WELCOME_CARD_SPONSOR_MARK_KEYS.map((id) => (
          <li
            key={id}
            className="flex min-h-[1.38rem] items-center justify-center"
          >
            <OnePagerPartnerLogo id={id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
