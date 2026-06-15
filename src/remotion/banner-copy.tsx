import type { CSSProperties } from "react";

import { BANNER_FONT_FAMILY } from "./banner-fonts";
import {
  BANNER_HEADLINE_FONT_SIZE,
  BANNER_SUBLINE_FONT_SIZE,
} from "./banner-spec";

export type BannerCopyProps = {
  headline: string;
  subline?: string;
};

const HEADLINE_STYLE: CSSProperties = {
  fontFamily: `"${BANNER_FONT_FAMILY}", sans-serif`,
  fontWeight: 400,
  fontSize: BANNER_HEADLINE_FONT_SIZE,
  lineHeight: 1.05,
  letterSpacing: "-0.02em",
  color: "#f4f2eb",
  margin: 0,
};

const SUBLINE_STYLE: CSSProperties = {
  fontFamily: `"${BANNER_FONT_FAMILY}", sans-serif`,
  fontWeight: 400,
  fontSize: BANNER_SUBLINE_FONT_SIZE,
  lineHeight: 1.2,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "rgba(244, 242, 235, 0.62)",
  margin: 0,
};

export function BannerCopy({ headline, subline }: BannerCopyProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: subline ? 12 : 0,
        minWidth: 0,
      }}
    >
      <p style={HEADLINE_STYLE}>{headline}</p>
      {subline ? <p style={SUBLINE_STYLE}>{subline}</p> : null}
    </div>
  );
}
