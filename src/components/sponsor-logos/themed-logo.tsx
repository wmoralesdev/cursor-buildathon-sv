import { useTheme } from "next-themes";
import type { ComponentPropsWithoutRef } from "react";

import { buildThemedLogoSrc } from "./build-themed-logo-src";

export type ThemedLogoImgProps = Omit<ComponentPropsWithoutRef<"img">, "src"> & {
  lightSrc: string;
  darkSrc?: string;
  /** White-on-transparent marks: force black in light UI via brightness filter. */
  invertInLightMode?: boolean;
};

export function ThemedLogoImg({
  lightSrc,
  darkSrc,
  invertInLightMode = false,
  alt = "",
  style,
  ...rest
}: ThemedLogoImgProps) {
  const { resolvedTheme } = useTheme();
  const src = buildThemedLogoSrc(resolvedTheme, lightSrc, darkSrc);
  const lightMarkStyle =
    invertInLightMode && resolvedTheme === "light"
      ? ({ filter: "brightness(0)", opacity: 0.72 } as const)
      : undefined;

  return <img src={src} alt={alt} style={{ ...lightMarkStyle, ...style }} {...rest} />;
}
