import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/cognition-light.svg";
const DARK_SRC = "/sponsors/cognition-dark.svg";

export function CognitionLogo({ className, alt = "Cognition" }: BrandLogoProps) {
  return (
    <ThemedLogoImg lightSrc={LIGHT_SRC} darkSrc={DARK_SRC} alt={alt} className={className} />
  );
}
