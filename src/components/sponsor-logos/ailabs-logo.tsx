import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/ailabs-light.svg";
const DARK_SRC = "/sponsors/ailabs-dark.svg";

export function AilabsLogo({ className, alt = "Ai /abs" }: BrandLogoProps) {
  return (
    <ThemedLogoImg lightSrc={LIGHT_SRC} darkSrc={DARK_SRC} alt={alt} className={className} />
  );
}
