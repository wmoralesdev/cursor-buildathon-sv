export type BuilderSectionLayout = "page" | "tab";

export function builderSectionSurfaceClass(
  layout: BuilderSectionLayout,
  pageSurfaceClass: string,
): string {
  if (layout === "tab") {
    return "relative scroll-mt-32 border-t border-border-faint bg-transparent py-14 sm:py-16 lg:py-20 [&:first-child]:border-t-0 [&:first-child]:pt-0";
  }

  return `relative scroll-mt-24 section-padding py-24 sm:py-32 lg:py-40 ${pageSurfaceClass}`;
}
