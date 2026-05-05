import { Composition } from "remotion";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import {
  WELCOME_BACKGROUND_LOOP_FRAMES,
  WELCOME_BACKGROUND_SCALES,
  welcomeBackgroundDimensions,
} from "../components/welcome-background-video-spec";
import { VIDEO_FPS } from "../components/welcome-card-canvas-spec";
import {
  WelcomeBackgroundLoopComposition,
  type WelcomeBackgroundLoopCompositionProps,
} from "./welcome-background-loop-composition";

const FORMATS: AspectFormat[] = ["post", "story"];

export function BackgroundLoopRoot() {
  return (
    <>
      {FORMATS.flatMap((format) =>
        WELCOME_BACKGROUND_SCALES.map((scale) => {
          const dimensions = welcomeBackgroundDimensions(format, scale);
          const defaultProps: WelcomeBackgroundLoopCompositionProps = {
            aspectFormat: format,
          };

          return (
            <Composition
              key={`${format}-${scale}x`}
              id={`welcome-bg-${format}-${scale}x`}
              component={WelcomeBackgroundLoopComposition}
              durationInFrames={WELCOME_BACKGROUND_LOOP_FRAMES}
              fps={VIDEO_FPS}
              width={dimensions.width}
              height={dimensions.height}
              defaultProps={defaultProps}
            />
          );
        }),
      )}
    </>
  );
}
