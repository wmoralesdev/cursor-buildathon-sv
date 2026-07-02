import { useTheme } from "next-themes";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { createContext, useContext } from "react";

import { buildThemedLogoSrc } from "./build-themed-logo-src";

/** True on one-pager sheets that force light logo assets while next-themes may still be dark. */
const OnePagerCashLightLogoAssetsContext = createContext(false);

export function OnePagerCashLightLogoAssetsProvider({ children }: { children: ReactNode }) {
  return (
    <OnePagerCashLightLogoAssetsContext.Provider value={true}>{children}</OnePagerCashLightLogoAssetsContext.Provider>
  );
}

function useOnePagerCashLightLogoAssets(): boolean {
  return useContext(OnePagerCashLightLogoAssetsContext);
}

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
  const cashLightLocked = useOnePagerCashLightLogoAssets();
  const src = cashLightLocked ? lightSrc : buildThemedLogoSrc(resolvedTheme, lightSrc, darkSrc);
  const isLightUi = cashLightLocked || resolvedTheme === "light";
  const lightMarkStyle =
    invertInLightMode && isLightUi
      ? ({ filter: "brightness(0)", opacity: 0.72 } as const)
      : undefined;

  return <img src={src} alt={alt} style={{ ...lightMarkStyle, ...style }} {...rest} />;
}
