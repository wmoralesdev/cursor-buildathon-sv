import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/abaco-light.svg";
const DARK_SRC = "/sponsors/abaco-dark.svg";

export function AbacoLogo({ className, alt = "Abaco" }: BrandLogoProps) {
  return (
    <ThemedLogoImg
      lightSrc={LIGHT_SRC}
      darkSrc={DARK_SRC}
      alt={alt}
      className={className}
    />
  );
}
