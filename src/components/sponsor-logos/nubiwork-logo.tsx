import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/nubiwork-light.png";
const DARK_SRC = "/sponsors/nubiwork-dark.svg";

export function NubiworkLogo({ className, alt = "NubiWork" }: BrandLogoProps) {
  return (
    <ThemedLogoImg
      lightSrc={LIGHT_SRC}
      darkSrc={DARK_SRC}
      alt={alt}
      className={className}
    />
  );
}
