import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const LIGHT_SRC = "/sponsors/yonjob-light.svg";
const DARK_SRC = "/sponsors/yonjob-dark.svg";

export function YonjobLogo({ className, alt = "Yonjob" }: BrandLogoProps) {
  return (
    <ThemedLogoImg
      lightSrc={LIGHT_SRC}
      darkSrc={DARK_SRC}
      alt={alt}
      className={className}
    />
  );
}
