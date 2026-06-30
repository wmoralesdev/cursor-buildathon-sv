import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/gad-dev-light.svg";
const DARK_SRC = "/sponsors/gad-dev.svg";

export function GadDevLogo({ className, alt = "GAD Dev" }: BrandLogoProps) {
  return (
    <ThemedLogoImg lightSrc={LIGHT_SRC} darkSrc={DARK_SRC} alt={alt} className={className} />
  );
}
