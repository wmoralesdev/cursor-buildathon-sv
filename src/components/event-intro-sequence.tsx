import { type CSSProperties } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig, staticFile } from "remotion";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import { DESIGN_DIMENSIONS } from "./welcome-card-canvas-spec";
import { WelcomeCardExportVideoBackground } from "./welcome-card-export-video-background";
import { EVENT_INTRO_TIMELINE } from "./event-intro-spec";
import { ExportCursorLogo } from "./export-logo-marks";
import { ACCEPTED_LABEL_CLASS, EventInfoBlock } from "./accepted-card-shared";
import { SponsorSpotCornerHeader } from "./sponsor-spot-export-content";
import { EXPORT_SPONSOR_MARK_COMPONENTS } from "./welcome-card-export-sponsor-slate";
import { buildWelcomePostSponsorRowIndices, buildWelcomeStorySponsorDisplayIndices } from "../lib/welcome-post-sponsor-wall";
import { WELCOME_CARD_SPONSOR_MARK_KEYS } from "./welcome-sponsor-marks";

const EXPORT_FRAME_BORDER = "1px solid rgba(255, 75, 0, 0.4)";
const EXPORT_FRAME_SHADOW =
  "0 0 0 1px rgba(255,75,0,0.2), 0 24px 80px -24px rgba(255,75,0,0.35)";

const ACCENT_LINE: CSSProperties = {
  height: 1,
  background: "rgba(255, 75, 0, 0.32)",
  width: "100%",
};

type Props = {
  aspectFormat: AspectFormat;
  scale?: number;
};

const FORMAT_LAYOUT: Record<
  AspectFormat,
  {
    slotWidth: string;
    slotHeight: string;
    cellGap: string;
    wallMaxWidth: string;
    titleClamp: string;
    centerStackGap: string;
    centerStackPy: string;
    outerColumnClass: string;
    chromeBandPy: string;
    titleToLogoGap: string;
  }
> = {
  post: {
    slotWidth: "clamp(5rem,18cqmin,22cqmin)",
    slotHeight: "clamp(1.5rem,5.85cqmin,7.75cqmin)",
    cellGap: "clamp(0.75rem,3cqmin,4cqmin)",
    wallMaxWidth: "min(94cqw,88cqmin)",
    titleClamp: "text-[clamp(0.9375rem,3.35cqmin,4.65cqmin)]",
    outerColumnClass:
      "relative z-10 flex h-full min-h-0 w-full flex-1 flex-col px-[clamp(1.35rem,3.85cqmin,5.65cqmin)]",
    chromeBandPy: "py-[clamp(1.35rem,3.85cqmin,5.65cqmin)]",
    /** Space between “Buildathon partners” / count row and first logo row */
    titleToLogoGap: "clamp(1.35rem, 4.5cqmin, 6.25cqmin)",
    centerStackGap: "gap-[clamp(0.85rem,3.2cqmin,4.5cqmin)]",
    centerStackPy: "py-[clamp(0.5rem,1.75cqmin,2.5cqmin)]",
  },
  story: {
    slotWidth: "clamp(7rem,31cqmin,42cqmin)",
    slotHeight: "clamp(2.35rem,8.25cqmin,11.5cqmin)",
    cellGap: "clamp(1.55rem,5.5cqmin,7.75cqmin)",
    wallMaxWidth: "min(97cqw,94cqmin)",
    titleClamp: "text-[clamp(1rem,3.75cqmin,5.2cqmin)]",
    outerColumnClass:
      "relative z-10 flex h-full min-h-0 w-full flex-1 flex-col px-[clamp(1.25rem,4.75cqmin,6.75cqmin)]",
    chromeBandPy: "py-[clamp(1.1rem,4.2cqmin,6cqmin)]",
    titleToLogoGap: "clamp(1.5rem, 5cqmin, 7.5cqmin)",
    centerStackGap: "gap-[clamp(1.35rem,4.75cqmin,6.75cqmin)]",
    centerStackPy: "py-[clamp(0.75rem,2.5cqmin,3.75cqmin)]",
  },
};

function chromeShowValue(
  frame: number,
  chromeIn: { startFrame: number; endFrame: number },
  loopClose: { startFrame: number; endFrame: number },
): number {
  if (frame < chromeIn.startFrame) return 0;
  if (frame < chromeIn.endFrame) {
    return interpolate(
      frame,
      [chromeIn.startFrame, chromeIn.endFrame],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      },
    );
  }
  if (frame < loopClose.startFrame) return 1;
  if (frame < loopClose.endFrame) {
    return interpolate(
      frame,
      [loopClose.startFrame, loopClose.endFrame],
      [1, 0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
      },
    );
  }
  return 0;
}

export function EventIntroSequence({ aspectFormat, scale = 1 }: Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, height } = DESIGN_DIMENSIONS[aspectFormat];

  const outerStyle: CSSProperties = {
    containerType: "size",
    width,
    height,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    border: EXPORT_FRAME_BORDER,
    boxShadow: EXPORT_FRAME_SHADOW,
    backgroundColor: "#14120b",
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
  };

  const { lockIn, lockOut, chromeIn, sponsorsIn, sponsorsOut, loopClose } = EVENT_INTRO_TIMELINE;

  const lockOpacity =
    frame < lockOut.startFrame
      ? interpolate(
          frame,
          [lockIn.startFrame, lockIn.endFrame],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          },
        )
      : interpolate(
          frame,
          [lockOut.startFrame, lockOut.endFrame],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.quad),
          },
        );

  const lockScale =
    frame < lockOut.startFrame
      ? interpolate(frame, [lockIn.startFrame, lockIn.endFrame], [0.92, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      : interpolate(frame, [lockOut.startFrame, lockOut.endFrame], [1, 0.96], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.cubic),
        });

  const chromeShow = chromeShowValue(frame, chromeIn, loopClose);

  const wallFadeOut = interpolate(
    frame,
    [sponsorsOut.startFrame, sponsorsOut.endFrame],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.quad),
    },
  );

  const layout = FORMAT_LAYOUT[aspectFormat];
  const sponsorTotal = EXPORT_SPONSOR_MARK_COMPONENTS.length;
  const countLabel = String(sponsorTotal).padStart(2, "0");

  const storyWallStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: layout.cellGap,
    width: "100%",
    maxWidth: layout.wallMaxWidth,
    marginTop: layout.titleToLogoGap,
  };

  const postWallOuterStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: layout.cellGap,
    width: "100%",
    maxWidth: layout.wallMaxWidth,
    marginTop: layout.titleToLogoGap,
  };

  const postRowStyle: CSSProperties = {
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    gap: layout.cellGap,
    width: "100%",
  };

  const postRowIndices = buildWelcomePostSponsorRowIndices(sponsorTotal);
  const storyDisplayIndices = buildWelcomeStorySponsorDisplayIndices(sponsorTotal);

  const staggerFrames = Math.max(1, Math.round(0.035 * fps));
  const slotRevealFrames = Math.max(6, Math.round(0.28 * fps));

  const columnClass = layout.outerColumnClass;

  const chromeBandPy = layout.chromeBandPy;
  const middleClass = `relative flex min-h-0 w-full flex-1 flex-col items-center justify-center ${layout.centerStackGap} ${layout.centerStackPy}`;

  return (
    <div style={outerStyle}>
      <WelcomeCardExportVideoBackground aspectFormat={aspectFormat} exportScale={scale} />

      <div className={columnClass} style={{ pointerEvents: "none" }}>
        {aspectFormat === "post" ? (
          <div
            className={`shrink-0 ${chromeBandPy}`}
            style={{
              opacity: chromeShow,
              transform: `translate3d(0, ${(1 - chromeShow) * -14}px, 0)`,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <SponsorSpotCornerHeader compact eventName="Buildathon" />
              <ExportCursorLogo className="h-[clamp(0.9rem,4.1cqmin,5.75cqmin)] w-auto shrink-0 opacity-80" />
            </div>
          </div>
        ) : (
          <div
            className={`shrink-0 ${chromeBandPy}`}
            style={{
              opacity: chromeShow,
              transform: `translate3d(0, ${(1 - chromeShow) * -14}px, 0)`,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <SponsorSpotCornerHeader eventName="Buildathon" />
              <ExportCursorLogo className="h-[clamp(1.05rem,5.8cqmin,8.5cqmin)] w-auto shrink-0 opacity-80" />
            </div>
          </div>
        )}

        <div style={{ ...ACCENT_LINE, opacity: chromeShow }} />

        <div className={middleClass}>
          {/* Center lockup */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: lockOpacity,
              transform: `scale(${lockScale})`,
              zIndex: 20,
            }}
          >
            <ExportCursorLogo
              className={
                aspectFormat === "post"
                  ? "h-[clamp(1.65rem,7.5cqmin,10.5cqmin)] w-auto shrink-0 opacity-80"
                  : "h-[clamp(1.85rem,9.5cqmin,13cqmin)] w-auto shrink-0 opacity-80"
              }
            />
          </div>

          {/* Partner wall */}
          <div
            data-event-intro-partner-wall="true"
            style={{
              opacity:
                frame < sponsorsIn.startFrame
                  ? 0
                  : chromeShow * wallFadeOut,
              width: "100%",
              minHeight: 0,
              flex: "1 1 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <div
              className="flex flex-col items-center gap-[clamp(0.3rem,1.25cqmin,1.8cqmin)] text-center"
              style={{
                opacity: interpolate(
                  frame,
                  [sponsorsIn.startFrame, sponsorsIn.startFrame + 10],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.out(Easing.quad),
                  },
                ),
                transform: `translate3d(0, ${interpolate(
                  frame,
                  [sponsorsIn.startFrame, sponsorsIn.startFrame + 10],
                  [8, 0],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.out(Easing.cubic),
                  },
                )}px, 0)`,
              }}
            >
              <p className="font-mono text-[clamp(0.5rem,1.85cqmin,2.6cqmin)] uppercase tracking-[0.32em] text-[#666]">
                Presented with
              </p>
              <p className={`${ACCEPTED_LABEL_CLASS} ${layout.titleClamp}`}>
                Buildathon partners
              </p>
              <div
                className="flex items-center gap-[clamp(0.45rem,1.6cqmin,2.15cqmin)] font-mono uppercase tracking-[0.28em] text-[#888] text-[clamp(0.4375rem,1.55cqmin,2.2cqmin)]"
                aria-hidden
              >
                <span
                  className="h-px w-[clamp(1.25rem,6cqmin,8.5cqmin)]"
                  style={{ backgroundColor: "rgba(255, 75, 0, 0.5)" }}
                />
                <span>{countLabel} partners</span>
                <span
                  className="h-px w-[clamp(1.25rem,6cqmin,8.5cqmin)]"
                  style={{ backgroundColor: "rgba(255, 75, 0, 0.5)" }}
                />
              </div>
            </div>

            {aspectFormat === "post" ? (
              <div style={postWallOuterStyle}>
                {postRowIndices.map((indices, rowIdx) => (
                  <div key={rowIdx} style={postRowStyle}>
                    {indices.map((index) => {
                      const Mark = EXPORT_SPONSOR_MARK_COMPONENTS[index];
                      const start = sponsorsIn.startFrame + index * staggerFrames;
                      const end = start + slotRevealFrames;
                      const itemOpacity = interpolate(frame, [start, end], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.out(Easing.cubic),
                      });
                      const itemTranslateY = interpolate(frame, [start, end], [6, 0], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.out(Easing.cubic),
                      });

                      return (
                        <div
                          key={WELCOME_CARD_SPONSOR_MARK_KEYS[index]}
                          style={{
                            opacity: itemOpacity,
                            transform: `translate3d(0, ${itemTranslateY}px, 0)`,
                          }}
                        >
                          <Mark
                            index={index}
                            total={sponsorTotal}
                            slotWidth={layout.slotWidth}
                            slotHeight={layout.slotHeight}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div style={storyWallStyle}>
                {storyDisplayIndices.map((sourceIndex, displayIndex) => {
                  const Mark = EXPORT_SPONSOR_MARK_COMPONENTS[sourceIndex];
                  const start = sponsorsIn.startFrame + displayIndex * staggerFrames;
                  const end = start + slotRevealFrames;
                  const itemOpacity = interpolate(frame, [start, end], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.out(Easing.cubic),
                  });
                  const itemTranslateY = interpolate(frame, [start, end], [6, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.out(Easing.cubic),
                  });

                  return (
                    <div
                      key={WELCOME_CARD_SPONSOR_MARK_KEYS[sourceIndex]}
                      style={{
                        opacity: itemOpacity,
                        transform: `translate3d(0, ${itemTranslateY}px, 0)`,
                      }}
                    >
                      <Mark
                        index={displayIndex}
                        total={sponsorTotal}
                        slotWidth={layout.slotWidth}
                        slotHeight={layout.slotHeight}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div style={{ ...ACCENT_LINE, opacity: chromeShow }} />

        {aspectFormat === "post" ? (
          <div
            className={`shrink-0 ${chromeBandPy}`}
            style={{
              opacity: chromeShow,
              transform: `translate3d(0, ${(1 - chromeShow) * 14}px, 0)`,
            }}
          >
            <EventInfoBlock compact poweredByLogoSrc={staticFile("sponsors/ailabs.svg")} />
          </div>
        ) : (
          <div
            className={`shrink-0 ${chromeBandPy}`}
            style={{
              opacity: chromeShow,
              transform: `translate3d(0, ${(1 - chromeShow) * 14}px, 0)`,
            }}
          >
            <EventInfoBlock poweredByLogoSrc={staticFile("sponsors/ailabs.svg")} />
          </div>
        )}
      </div>
    </div>
  );
}
