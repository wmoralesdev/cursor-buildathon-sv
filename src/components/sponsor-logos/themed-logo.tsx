import { useTheme } from "next-themes";
import type { ComponentPropsWithoutRef } from "react";

import { buildThemedLogoSrc } from "./build-themed-logo-src";

export type ThemedLogoImgProps = Omit<ComponentPropsWithoutRef<"img">, "src"> & {
  lightSrc: string;
  darkSrc?: string;
};

export function ThemedLogoImg({
  lightSrc,
  darkSrc,
  alt = "",
  ...rest
}: ThemedLogoImgProps) {
  const { resolvedTheme } = useTheme();
  const src = buildThemedLogoSrc(resolvedTheme, lightSrc, darkSrc);
  return <img src={src} alt={alt} {...rest} />;
}
