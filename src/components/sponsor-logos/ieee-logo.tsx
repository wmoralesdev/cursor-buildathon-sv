import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const SRC = "/sponsors/ieee.webp";

export function IeeeLogo({ className, alt = "IEEE" }: BrandLogoProps) {
  return (
    <ThemedLogoImg
      lightSrc={SRC}
      darkSrc={SRC}
      alt={alt}
      className={className ? `sponsor-logo-ieee ${className}` : "sponsor-logo-ieee"}
    />
  );
}
