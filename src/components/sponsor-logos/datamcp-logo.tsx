import type { BrandLogoProps } from "./logo-props";
import { ThemedLogoImg } from "./themed-logo";

const SRC = "/sponsors/datamcp.svg";

export function DatamcpLogo({ className, alt = "DataMCP" }: BrandLogoProps) {
  return <ThemedLogoImg lightSrc={SRC} alt={alt} className={className} />;
}
