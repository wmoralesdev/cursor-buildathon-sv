import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/weris_light.svg";
const DARK_SRC = "/sponsors/weris_dark.svg";

export function WerisLogo({ className, alt = "Weris" }: BrandLogoProps) {
  return (
    <ThemedLogoImg lightSrc={LIGHT_SRC} darkSrc={DARK_SRC} alt={alt} className={className} />
  );
}
