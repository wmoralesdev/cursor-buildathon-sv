import { Composition } from "remotion";

import "../index.css";

import {
  BannerComposition,
  type BannerCompositionProps,
} from "./banner-composition";
import {
  BANNER_COPY_VARIANTS,
  BANNER_DIMENSIONS,
  BANNER_DURATION_FRAMES,
  BANNER_FPS,
  bannerCompositionId,
} from "./banner-spec";

export function BannerRoot() {
  return (
    <>
      {BANNER_COPY_VARIANTS.map((variant) => {
        const defaultProps: BannerCompositionProps = {
          headline: variant.headline,
          subline: variant.subline,
        };

        return (
          <Composition
            key={variant.id}
            id={bannerCompositionId(variant.id)}
            component={BannerComposition}
            durationInFrames={BANNER_DURATION_FRAMES}
            fps={BANNER_FPS}
            width={BANNER_DIMENSIONS.width}
            height={BANNER_DIMENSIONS.height}
            defaultProps={defaultProps}
          />
        );
      })}
    </>
  );
}
