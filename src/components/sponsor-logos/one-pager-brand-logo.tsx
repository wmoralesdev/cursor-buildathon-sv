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
import { CognitionLogo } from "./cognition-logo";
import { MacaLogo } from "./maca-logo";
import { CrafterLogo } from "./crafter-logo";
import { EsroboticaLogo } from "./esrobotica-logo";
import { From021Logo } from "./from021-logo";
import { GadDevLogo } from "./gad-dev-logo";
import { MistralLogo } from "./mistral-logo";
import { SupabaseLogo } from "./supabase-logo";
import { IeeeLogo } from "./ieee-logo";
import { UfgLogo } from "./ufg-logo";
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
    case "cognition":
      return <CognitionLogo {...props} />;
    case "maca":
      return <MacaLogo {...props} />;
    case "crafter":
      return <CrafterLogo {...props} />;
    case "esrobotica":
      return <EsroboticaLogo {...props} />;
    case "from021":
      return <From021Logo {...props} />;
    case "gad-dev":
      return <GadDevLogo {...props} />;
    case "mistral":
      return <MistralLogo {...props} />;
    case "supabase":
      return <SupabaseLogo {...props} />;
    case "ieee":
      return <IeeeLogo {...props} />;
    case "ufg":
      return <UfgLogo {...props} />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
