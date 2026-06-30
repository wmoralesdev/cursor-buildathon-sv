import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/mistral-light.svg";
const DARK_SRC = "/sponsors/mistral.svg";

export function MistralLogo({ className, alt = "Mistral" }: BrandLogoProps) {
  return (
    <ThemedLogoImg lightSrc={LIGHT_SRC} darkSrc={DARK_SRC} alt={alt} className={className} />
  );
}
