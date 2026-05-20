import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/gamesquad-light.svg";
const DARK_SRC = "/sponsors/gamesquad-dark.svg";

export function GamesquadLogo({ className, alt = "GameSquad" }: BrandLogoProps) {
  return (
    <ThemedLogoImg lightSrc={LIGHT_SRC} darkSrc={DARK_SRC} alt={alt} className={className} />
  );
}
