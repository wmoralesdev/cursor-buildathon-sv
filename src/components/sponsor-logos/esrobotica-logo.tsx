import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/esrobotica-light.svg";
const DARK_SRC = "/sponsors/esrobotica-dark.svg";

export function EsroboticaLogo({ className, alt = "EsRobotica" }: BrandLogoProps) {
  return (
    <ThemedLogoImg lightSrc={LIGHT_SRC} darkSrc={DARK_SRC} alt={alt} className={className} />
  );
}
