import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/searchyou-light.svg";
const DARK_SRC = "/sponsors/searchyou-dark.svg";

export function SearchyouLogo({ className, alt = "SearchYou" }: BrandLogoProps) {
  return (
    <ThemedLogoImg lightSrc={LIGHT_SRC} darkSrc={DARK_SRC} alt={alt} className={className} />
  );
}
