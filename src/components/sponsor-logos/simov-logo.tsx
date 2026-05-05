import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/simov-light.svg";
const DARK_SRC = "/sponsors/simov-dark.svg";

export function SimovLogo({ className, alt = "Simov" }: BrandLogoProps) {
  return (
    <ThemedLogoImg lightSrc={LIGHT_SRC} darkSrc={DARK_SRC} alt={alt} className={className} />
  );
}
