import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/firecrawl-light.svg";
const DARK_SRC = "/sponsors/firecrawl-dark.svg";

export function FirecrawlLogo({ className, alt = "Firecrawl" }: BrandLogoProps) {
  return (
    <ThemedLogoImg lightSrc={LIGHT_SRC} darkSrc={DARK_SRC} alt={alt} className={className} />
  );
}
