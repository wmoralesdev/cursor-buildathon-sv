import { Composition } from "remotion";

import "../index.css";

import {
  EXPORT_DIMENSIONS,
  EXPORT_VIDEO_DURATION_FRAMES,
  VIDEO_FPS,
} from "../components/welcome-card-canvas-spec";
import {
  WelcomeCardComposition,
  type WelcomeCardCompositionProps,
} from "./welcome-card-composition";

const DEFAULT_PROPS: WelcomeCardCompositionProps = {
  handle: "@yourhandle",
  imageUrl: null,
  aspectFormat: "post",
  isLeadOrganizer: false,
};

export function RemotionRoot() {
  const post = EXPORT_DIMENSIONS.post;
  const story = EXPORT_DIMENSIONS.story;

  return (
    <>
      <Composition
        id="welcome-card-post"
        component={WelcomeCardComposition}
        durationInFrames={EXPORT_VIDEO_DURATION_FRAMES}
        fps={VIDEO_FPS}
        width={post.width}
        height={post.height}
        defaultProps={{ ...DEFAULT_PROPS, aspectFormat: "post" }}
      />
      <Composition
        id="welcome-card-story"
        component={WelcomeCardComposition}
        durationInFrames={EXPORT_VIDEO_DURATION_FRAMES}
        fps={VIDEO_FPS}
        width={story.width}
        height={story.height}
        defaultProps={{ ...DEFAULT_PROPS, aspectFormat: "story" }}
      />
    </>
  );
}
