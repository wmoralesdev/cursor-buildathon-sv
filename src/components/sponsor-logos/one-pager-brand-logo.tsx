import type { BrandLogoProps } from "./logo-props";
import { AbacoLogo } from "./abaco-logo";
import { CodexLogo } from "./codex-logo";
import { CursorLockup } from "./cursor-lockup";
import { ElevenLabsLogo } from "./elevenlabs-logo";
import { BoxfulLogo } from "./boxful-logo";
import { DropLogo } from "./drop-logo";
import { GamesquadLogo } from "./gamesquad-logo";
import { SearchyouLogo } from "./searchyou-logo";
import { KrealiLogo } from "./kreali-logo";
import { SimovLogo } from "./simov-logo";
import { WerisLogo } from "./weris-logo";
import { N8nLogo } from "./n8n-logo";
import { NubiworkLogo } from "./nubiwork-logo";
import { YonjobLogo } from "./yonjob-logo";
import { DmaLogo } from "./dma-logo";
import { NetlifyLogo } from "./netlify-logo";
import { WisprLogo } from "./wispr-logo";
import { FalLogo } from "./fal-logo";
import { ExaLogo } from "./exa-logo";
import { SvnetLogo } from "./svnet-logo";
import { FirecrawlLogo } from "./firecrawl-logo";
import { DatamcpLogo } from "./datamcp-logo";
import { RcnsLogo } from "./rcns-logo";
import type { OnePagerSponsorLogoId } from "./sponsor-logo-ids";

/** Single component for ESLint/static-components compliance (avoid dynamic component lookups). */
export function OnePagerBrandLogo({
  id,
  ...props
}: BrandLogoProps & { id: OnePagerSponsorLogoId }) {
  switch (id) {
    case "cursor":
      return <CursorLockup {...props} />;
    case "n8n":
      return <N8nLogo {...props} />;
    case "codex":
      return <CodexLogo {...props} />;
    case "yonjob":
      return <YonjobLogo {...props} />;
    case "nubiwork":
      return <NubiworkLogo {...props} />;
    case "abaco":
      return <AbacoLogo {...props} />;
    case "elevenlabs":
      return <ElevenLabsLogo {...props} />;
    case "simov":
      return <SimovLogo {...props} />;
    case "kreali":
      return <KrealiLogo {...props} />;
    case "weris":
      return <WerisLogo {...props} />;
    case "boxful":
      return <BoxfulLogo {...props} />;
    case "drop":
      return <DropLogo {...props} />;
    case "gamesquad":
      return <GamesquadLogo {...props} />;
    case "searchyou":
      return <SearchyouLogo {...props} />;
    case "dma":
      return <DmaLogo {...props} />;
    case "netlify":
      return <NetlifyLogo {...props} />;
    case "wispr":
      return <WisprLogo {...props} />;
    case "fal":
      return <FalLogo {...props} />;
    case "exa":
      return <ExaLogo {...props} />;
    case "svnet":
      return <SvnetLogo {...props} />;
    case "firecrawl":
      return <FirecrawlLogo {...props} />;
    case "datamcp":
      return <DatamcpLogo {...props} />;
    case "rcns":
      return <RcnsLogo {...props} />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
