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

export type { BrandLogoProps } from "./logo-props";
export type { OnePagerSponsorLogoId, ProductSponsorId } from "./sponsor-logo-ids";
export { OnePagerBrandLogo } from "./one-pager-brand-logo";
export { buildThemedLogoSrc } from "./build-themed-logo-src";
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
export { ZavuLogo } from "./zavu-logo";

export const productSponsorLogoById: Record<ProductSponsorId, ComponentType<BrandLogoProps>> = {
  n8n: N8nLogo,
  codex: CodexLogo,
  yonjob: YonjobLogo,
  nubiwork: NubiworkLogo,
  abaco: AbacoLogo,
  elevenlabs: ElevenLabsLogo,
  simov: SimovLogo,
  kreali: KrealiLogo,
  weris: WerisLogo,
  boxful: BoxfulLogo,
  drop: DropLogo,
  gamesquad: GamesquadLogo,
  searchyou: SearchyouLogo,
  dma: DmaLogo,
};
