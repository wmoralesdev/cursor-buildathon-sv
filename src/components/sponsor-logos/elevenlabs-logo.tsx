import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/elevenlabs-light.svg";
const DARK_SRC = "/sponsors/elevenlabs-dark.svg";

export function ElevenLabsLogo({ className, alt = "ElevenLabs" }: BrandLogoProps) {
  return (
    <ThemedLogoImg
      lightSrc={LIGHT_SRC}
      darkSrc={DARK_SRC}
      alt={alt}
      className={className}
    />
  );
}
