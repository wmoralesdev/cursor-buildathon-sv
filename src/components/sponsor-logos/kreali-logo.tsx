import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/kreali-light.svg";
const DARK_SRC = "/sponsors/kreali-dark.svg";

export function KrealiLogo({ className, alt = "Kreali" }: BrandLogoProps) {
  return (
    <ThemedLogoImg lightSrc={LIGHT_SRC} darkSrc={DARK_SRC} alt={alt} className={className} />
  );
}
