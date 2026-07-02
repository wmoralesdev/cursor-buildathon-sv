import type { BrandLogoProps } from "./logo-props";
import type { ComponentType } from "react";
import type { ProductSponsorId } from "./sponsor-logo-ids";
import { AbacoLogo } from "./abaco-logo";
import { CodexLogo } from "./codex-logo";
import { ElevenLabsLogo } from "./elevenlabs-logo";
import { SimovLogo } from "./simov-logo";
import { N8nLogo } from "./n8n-logo";
import { NubiworkLogo } from "./nubiwork-logo";
import { BoxfulLogo } from "./boxful-logo";
import { DropLogo } from "./drop-logo";
import { GamesquadLogo } from "./gamesquad-logo";
import { SearchyouLogo } from "./searchyou-logo";
import { KrealiLogo } from "./kreali-logo";
import { WerisLogo } from "./weris-logo";
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
import { MacaLogo } from "./maca-logo";
import { CrafterLogo } from "./crafter-logo";
import { EsroboticaLogo } from "./esrobotica-logo";
import { From021Logo } from "./from021-logo";
import { GadDevLogo } from "./gad-dev-logo";
import { MistralLogo } from "./mistral-logo";
import { SupabaseLogo } from "./supabase-logo";
import { IeeeLogo } from "./ieee-logo";
import { UfgLogo } from "./ufg-logo";
import { CursorLockup } from "./cursor-lockup";
import { ZavuLogo } from "./zavu-logo";

export type { BrandLogoProps } from "./logo-props";
export type { OnePagerSponsorLogoId, ProductSponsorId } from "./sponsor-logo-ids";
export { OnePagerBrandLogo } from "./one-pager-brand-logo";
export { buildThemedLogoSrc, resolveThemedLogoPair } from "./build-themed-logo-src";
export type { ThemedLogoPair } from "./build-themed-logo-src";
export { OnePagerCashLightLogoAssetsProvider, ThemedLogoImg } from "./themed-logo";
export type { ThemedLogoImgProps } from "./themed-logo";
export { CursorLockup } from "./cursor-lockup";
export { AbacoLogo } from "./abaco-logo";
export { CodexLogo } from "./codex-logo";
export { ElevenLabsLogo } from "./elevenlabs-logo";
export { SimovLogo } from "./simov-logo";
export { N8nLogo } from "./n8n-logo";
export { NubiworkLogo } from "./nubiwork-logo";
export { BoxfulLogo } from "./boxful-logo";
export { DropLogo } from "./drop-logo";
export { GamesquadLogo } from "./gamesquad-logo";
export { SearchyouLogo } from "./searchyou-logo";
export { KrealiLogo } from "./kreali-logo";
export { WerisLogo } from "./weris-logo";
export { YonjobLogo } from "./yonjob-logo";
export { DmaLogo } from "./dma-logo";
export { NetlifyLogo } from "./netlify-logo";
export { WisprLogo } from "./wispr-logo";
export { FalLogo } from "./fal-logo";
export { ExaLogo } from "./exa-logo";
export { SvnetLogo } from "./svnet-logo";
export { FirecrawlLogo } from "./firecrawl-logo";
export { DatamcpLogo } from "./datamcp-logo";
export { RcnsLogo } from "./rcns-logo";
export { MacaLogo } from "./maca-logo";
export { CrafterLogo } from "./crafter-logo";
export { EsroboticaLogo } from "./esrobotica-logo";
export { From021Logo } from "./from021-logo";
export { GadDevLogo } from "./gad-dev-logo";
export { MistralLogo } from "./mistral-logo";
export { SupabaseLogo } from "./supabase-logo";
export { IeeeLogo } from "./ieee-logo";
export { UfgLogo } from "./ufg-logo";
export { AilabsLogo } from "./ailabs-logo";
export { ZavuLogo } from "./zavu-logo";

export const productSponsorLogoById: Record<ProductSponsorId, ComponentType<BrandLogoProps>> = {
  cursor: CursorLockup,
  zavu: ZavuLogo,
  n8n: N8nLogo,
  codex: CodexLogo,
  yonjob: YonjobLogo,
  nubiwork: NubiworkLogo,
  abaco: AbacoLogo,
  elevenlabs: ElevenLabsLogo,
  simov: SimovLogo,
  kreali: KrealiLogo,
  maca: MacaLogo,
  weris: WerisLogo,
  boxful: BoxfulLogo,
  crafter: CrafterLogo,
  drop: DropLogo,
  gamesquad: GamesquadLogo,
  searchyou: SearchyouLogo,
  dma: DmaLogo,
  netlify: NetlifyLogo,
  wispr: WisprLogo,
  fal: FalLogo,
  exa: ExaLogo,
  svnet: SvnetLogo,
  firecrawl: FirecrawlLogo,
  esrobotica: EsroboticaLogo,
  datamcp: DatamcpLogo,
  rcns: RcnsLogo,
  from021: From021Logo,
  "gad-dev": GadDevLogo,
  mistral: MistralLogo,
  supabase: SupabaseLogo,
  ieee: IeeeLogo,
  ufg: UfgLogo,
};
