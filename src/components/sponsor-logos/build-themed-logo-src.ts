export interface ThemedLogoPair {
  lightSrc: string;
  darkSrc: string;
  /** White-on-transparent marks that need `brightness(0)` in light UI (e.g. IEEE). */
  invertInLightMode?: boolean;
}

/** Theme rule: dark UI uses `darkSrc` when provided; otherwise `lightSrc`. */
export function buildThemedLogoSrc(
  resolvedTheme: string | undefined,
  lightSrc: string,
  darkSrc?: string,
): string {
  return resolvedTheme === "dark" && darkSrc ? darkSrc : lightSrc;
}

/** Map roster / sponsor-asset paths (often dark marks) to themed light+dark sources. */
export function resolveThemedLogoPair(assetLogo: string): ThemedLogoPair {
  const darkSrc = assetLogo;

  if (assetLogo.includes("-dark.")) {
    return { lightSrc: assetLogo.replace("-dark.", "-light."), darkSrc };
  }
  if (assetLogo.includes("_dark.")) {
    return { lightSrc: assetLogo.replace("_dark.", "_light."), darkSrc };
  }
  if (assetLogo.endsWith("/codex.svg")) {
    return { lightSrc: "/sponsors/codex-logo.svg", darkSrc };
  }
  if (assetLogo.endsWith("/gad-dev.svg")) {
    return { lightSrc: "/sponsors/gad-dev-light.svg", darkSrc };
  }
  if (assetLogo.endsWith("/mistral.svg")) {
    return { lightSrc: "/sponsors/mistral-light.svg", darkSrc };
  }
  if (assetLogo.endsWith("/supabase.svg")) {
    return { lightSrc: "/sponsors/supabase-light.svg", darkSrc };
  }
  if (assetLogo.endsWith("/n8n-logo-dark.svg")) {
    return { lightSrc: "/sponsors/n8n-logo.svg", darkSrc };
  }
  if (assetLogo.endsWith("/ieee.webp")) {
    return { lightSrc: assetLogo, darkSrc: assetLogo, invertInLightMode: true };
  }

  return { lightSrc: assetLogo, darkSrc: assetLogo };
}
