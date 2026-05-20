import { useTheme } from "next-themes";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { createContext, useContext } from "react";

import { buildThemedLogoSrc } from "./build-themed-logo-src";

/** True under `/onepager-niu` / `/onepager-boxful` sponsor grid: page is forced light while next-themes may still be dark. */
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
};

export function ThemedLogoImg({
  lightSrc,
  darkSrc,
  alt = "",
  ...rest
}: ThemedLogoImgProps) {
  const { resolvedTheme } = useTheme();
  const cashLightLocked = useOnePagerCashLightLogoAssets();
  const src = cashLightLocked ? lightSrc : buildThemedLogoSrc(resolvedTheme, lightSrc, darkSrc);
  return <img src={src} alt={alt} {...rest} />;
}
