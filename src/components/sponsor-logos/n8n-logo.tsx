import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/n8n-logo.svg";
const DARK_SRC = "/sponsors/n8n-logo-dark.svg";

export function N8nLogo({ className, alt = "n8n" }: BrandLogoProps) {
  return (
    <ThemedLogoImg
      lightSrc={LIGHT_SRC}
      darkSrc={DARK_SRC}
      alt={alt}
      className={className}
    />
  );
}
