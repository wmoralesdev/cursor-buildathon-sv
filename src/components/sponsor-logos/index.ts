import type { BrandLogoProps } from "./logo-props";
import type { ComponentType } from "react";
import type { ProductSponsorId } from "./sponsor-logo-ids";
import { CodexLogo } from "./codex-logo";
import { N8nLogo } from "./n8n-logo";
import { NubiworkLogo } from "./nubiwork-logo";
import { YonjobLogo } from "./yonjob-logo";

export type { BrandLogoProps } from "./logo-props";
export type { OnePagerSponsorLogoId, ProductSponsorId } from "./sponsor-logo-ids";
export { OnePagerBrandLogo } from "./one-pager-brand-logo";
export { buildThemedLogoSrc } from "./build-themed-logo-src";
export { ThemedLogoImg } from "./themed-logo";
export type { ThemedLogoImgProps } from "./themed-logo";
export { CursorLockup } from "./cursor-lockup";
export { CodexLogo } from "./codex-logo";
export { N8nLogo } from "./n8n-logo";
export { NubiworkLogo } from "./nubiwork-logo";
export { YonjobLogo } from "./yonjob-logo";
export { ZavuLogo } from "./zavu-logo";

export const productSponsorLogoById: Record<ProductSponsorId, ComponentType<BrandLogoProps>> = {
  n8n: N8nLogo,
  codex: CodexLogo,
  yonjob: YonjobLogo,
  nubiwork: NubiworkLogo,
};
