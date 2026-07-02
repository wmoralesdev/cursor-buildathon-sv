export type OnePagerId =
  | "prizes"
  | "sponsors"
  | "mentors"
  | "judges"
  | "sobrecupo"
  | "credits";

export type OnePagerNavLabelKey =
  | "onePager.nav.prizes"
  | "onePager.nav.sponsors"
  | "onePager.nav.mentors"
  | "onePager.nav.judges"
  | "onePager.nav.sobrecupo";

export interface OnePagerRoute {
  id: OnePagerId;
  path: string;
  labelKey: OnePagerNavLabelKey;
}

export const ONE_PAGER_ROUTES: readonly OnePagerRoute[] = [
  { id: "prizes", path: "/onepager-prizes", labelKey: "onePager.nav.prizes" },
  { id: "sponsors", path: "/onepager-sponsors", labelKey: "onePager.nav.sponsors" },
  { id: "mentors", path: "/onepager-mentors", labelKey: "onePager.nav.mentors" },
  { id: "judges", path: "/onepager-judges", labelKey: "onePager.nav.judges" },
  { id: "sobrecupo", path: "/onepager-sobrecupo", labelKey: "onePager.nav.sobrecupo" },
] as const;

export const ONE_PAGER_PREVIEW_SCALES = [1, 2, 3] as const;
export type OnePagerPreviewScale = (typeof ONE_PAGER_PREVIEW_SCALES)[number];

export function parseOnePagerEmbedScale(raw: string | null): OnePagerPreviewScale {
  const n = raw == null || raw === "" ? NaN : Number(raw);
  if (n === 2 || n === 3) return n;
  return 1;
}
