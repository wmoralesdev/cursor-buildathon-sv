import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const SRC = "/sponsors/from021.svg";

export function From021Logo({ className, alt = "Zero Two One" }: BrandLogoProps) {
  return <ThemedLogoImg lightSrc={SRC} alt={alt} className={className} />;
}
