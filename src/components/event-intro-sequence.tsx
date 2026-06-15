import { type CSSProperties } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig, staticFile } from "remotion";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import { DESIGN_DIMENSIONS } from "./welcome-card-canvas-spec";
import { EXPORT_CHALK_DIVIDER, EXPORT_CHALK_RULE } from "./export-chalk-accent";
import { WelcomeCardExportVideoBackground } from "./welcome-card-export-video-background";
import { EVENT_INTRO_TIMELINE } from "./event-intro-spec";
import { EventIntroUfgMark } from "./event-intro-ufg-mark";
import { ExportCursorLogo } from "./export-logo-marks";
import { ACCEPTED_LABEL_CLASS, EventInfoBlock } from "./accepted-card-shared";
import { SponsorSpotCornerHeader } from "./sponsor-spot-export-content";
import { EXPORT_SPONSOR_MARK_COMPONENTS } from "./welcome-card-export-sponsor-slate";
import {
  buildEventIntroPostWallRows,
  buildEventIntroStoryWallRows,
  isEventIntroFeaturedRow,
  type EventIntroWallCell,
} from "../lib/event-intro-partner-wall";
import { WELCOME_CARD_SPONSOR_MARK_KEYS } from "./welcome-sponsor-marks";

const EVENT_INTRO_SPONSOR_LOGO_SCALE_BOOST: Partial<
  Record<(typeof WELCOME_CARD_SPONSOR_MARK_KEYS)[number], number>
> = {
  n8n: 1.21,
  yonjob: 1.1,
  weris: 0.95,
};

function eventIntroSponsorLogoScale(
  cell: EventIntroWallCell,
  baseScale: number | undefined,
): number {
  const scale = baseScale ?? 1;
  if (cell.kind !== "sponsor") {
    return scale;
  }
  const key = WELCOME_CARD_SPONSOR_MARK_KEYS[cell.index];
  return scale * (EVENT_INTRO_SPONSOR_LOGO_SCALE_BOOST[key] ?? 1);
}

const ACCENT_LINE: CSSProperties = {
  height: 1,
  background: EXPORT_CHALK_DIVIDER,
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
    rowGap?: string;
    firstRowCellGap?: string;
    leadRowSlotWidth?: string;
    leadRowSlotHeight?: string;
    logoScale?: number;
    leadRowLogoScale?: number;
    ufgInnerScale?: number;
    chromeScale?: number;
    safeInsetTop?: string;
    safeInsetBottom?: string;
  }
> = {
  post: {
    slotWidth: "clamp(4.5rem,16.35cqmin,19.35cqmin)",
    slotHeight: "clamp(1.32rem,5.17cqmin,6.99cqmin)",
    cellGap: "clamp(0.6rem,2.45cqmin,3.15cqmin)",
    rowGap: "clamp(1.4rem,5.75cqmin,7.35cqmin)",
    firstRowCellGap: "clamp(2.4rem,10.9cqmin,15.75cqmin)",
    leadRowSlotWidth: "clamp(6.1rem,22.35cqmin,25.75cqmin)",
    leadRowSlotHeight: "clamp(1.8rem,7.05cqmin,9.4cqmin)",
    logoScale: 1.09,
    leadRowLogoScale: 1.33,
    ufgInnerScale: 1.1,
    wallMaxWidth: "min(96cqw,94cqmin)",
    titleClamp: "text-[clamp(0.8125rem,2.95cqmin,4.1cqmin)]",
    outerColumnClass:
      "relative z-10 flex h-full min-h-0 w-full flex-1 flex-col px-[clamp(1.35rem,3.85cqmin,5.65cqmin)]",
    chromeBandPy: "py-[clamp(1.1rem,3.2cqmin,4.75cqmin)]",
    /** Space between “Buildathon partners” / count row and first logo row */
    titleToLogoGap: "clamp(0.85rem, 3.1cqmin, 4.5cqmin)",
    centerStackGap: "gap-[clamp(0.65rem,2.5cqmin,3.5cqmin)]",
    centerStackPy: "py-[clamp(0.35rem,1.25cqmin,1.85cqmin)]",
  },
  story: {
    slotWidth: "clamp(5.5rem,24.2cqmin,33cqmin)",
    slotHeight: "clamp(1.8rem,6.45cqmin,8.95cqmin)",
    leadRowSlotWidth: "clamp(7.7rem,34.1cqmin,46.2cqmin)",
    leadRowSlotHeight: "clamp(2.6rem,9.1cqmin,12.65cqmin)",
    cellGap: "clamp(1.4rem,5cqmin,6.65cqmin)",
    rowGap: "clamp(1.25rem,5.4cqmin,7.3cqmin)",
    firstRowCellGap: "clamp(2.4rem,10.9cqmin,15.75cqmin)",
    logoScale: 1.01,
    leadRowLogoScale: 1.1,
    ufgInnerScale: 1.05,
    chromeScale: 0.8,
    safeInsetTop: "clamp(3.5rem,11cqmin,14cqmin)",
    safeInsetBottom: "clamp(4.5rem,14cqmin,18cqmin)",
    wallMaxWidth: "min(97cqw,94cqmin)",
    titleClamp: "text-[clamp(1rem,3.75cqmin,5.2cqmin)]",
    outerColumnClass:
      "relative z-10 flex h-full min-h-0 w-full flex-1 flex-col px-[clamp(1.25rem,4.75cqmin,6.75cqmin)]",
    chromeBandPy: "py-[clamp(0.55rem,2cqmin,2.85cqmin)]",
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
    backgroundColor: "#14120b",
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
  };

  const { lockOut, chromeIn, sponsorsIn, sponsorsOut, loopClose, ailabsJoin } =
    EVENT_INTRO_TIMELINE;

  const lockOutOpacity =
    frame < lockOut.startFrame
      ? 1
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

  const lockOutScale =
    frame < lockOut.startFrame
      ? 1
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

  const storyWallOuterStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: layout.rowGap ?? layout.cellGap,
    width: "100%",
    maxWidth: layout.wallMaxWidth,
    marginTop: layout.titleToLogoGap,
  };

  const postWallOuterStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: layout.rowGap ?? layout.cellGap,
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

  const postWallRows = buildEventIntroPostWallRows(sponsorTotal);
  const storyWallRows = buildEventIntroStoryWallRows(sponsorTotal);
  const partnerWallRows = aspectFormat === "post" ? postWallRows : storyWallRows;
  const partnerWallOuterStyle =
    aspectFormat === "post" ? postWallOuterStyle : storyWallOuterStyle;

  const staggerFrames = Math.max(1, Math.round(0.035 * fps));
  const slotRevealFrames = Math.max(6, Math.round(0.28 * fps));

  const columnClass = layout.outerColumnClass;

  const chromeBandPy = layout.chromeBandPy;
  const storyChromeScale = layout.chromeScale ?? 1;
  const storyChromeBandTighten =
    aspectFormat === "story" && storyChromeScale < 1
      ? "clamp(-0.75rem,-2.75cqmin,-3.75cqmin)"
      : undefined;
  const columnStyle: CSSProperties | undefined =
    aspectFormat === "story" && (layout.safeInsetTop || layout.safeInsetBottom)
      ? {
          pointerEvents: "none",
          paddingTop: layout.safeInsetTop,
          paddingBottom: layout.safeInsetBottom,
        }
      : { pointerEvents: "none" };
  const middleClass = `relative flex min-h-0 w-full flex-1 flex-col items-center justify-center ${layout.centerStackGap} ${layout.centerStackPy}`;

  return (
    <div style={outerStyle}>
      <WelcomeCardExportVideoBackground aspectFormat={aspectFormat} />

      <div className={columnClass} style={columnStyle}>
        {aspectFormat === "post" ? (
          <div
            className={`shrink-0 ${chromeBandPy}`}
            style={{
              opacity: chromeShow,
              transform: `translate3d(0, ${(1 - chromeShow) * -14}px, 0)`,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <SponsorSpotCornerHeader
                compact
                eventName="Buildathon"
                sponsorEyebrow="Official sponsor lineup"
              />
              <ExportCursorLogo className="h-[clamp(0.9rem,4.1cqmin,5.75cqmin)] w-auto shrink-0 opacity-80" />
            </div>
          </div>
        ) : (
          <div
            className={`shrink-0 ${chromeBandPy}`}
            style={{
              opacity: chromeShow,
              transform: `translate3d(0, ${(1 - chromeShow) * -14}px, 0)`,
              marginBottom: storyChromeBandTighten,
            }}
          >
            <div
              style={{
                transform: `scale(${storyChromeScale})`,
                transformOrigin: "top center",
                width: "100%",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <SponsorSpotCornerHeader
                  eventName="Buildathon"
                  sponsorEyebrow="Official sponsor lineup"
                />
                <ExportCursorLogo className="h-[clamp(1.05rem,5.8cqmin,8.5cqmin)] w-auto shrink-0 opacity-80" />
              </div>
            </div>
          </div>
        )}

        {aspectFormat === "post" ? (
          <div style={{ ...ACCENT_LINE, opacity: chromeShow }} />
        ) : null}

        <div className={middleClass}>
          {/* Center lockup */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: lockOutOpacity,
              transform: `scale(${lockOutScale})`,
              zIndex: 20,
              overflow: "visible",
            }}
          >
            <EventIntroCenterLockup
              aspectFormat={aspectFormat}
              frame={frame}
              ailabsJoin={ailabsJoin}
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
              className="flex flex-col items-center gap-[clamp(0.22rem,0.95cqmin,1.35cqmin)] text-center"
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
              <p className="font-mono text-[clamp(0.4375rem,1.55cqmin,2.2cqmin)] uppercase tracking-[0.32em] text-[#666]">
                Presented with
              </p>
              <p className={`${ACCEPTED_LABEL_CLASS} ${layout.titleClamp}`}>
                Buildathon partners
              </p>
              <div
                className="flex items-center gap-[clamp(0.35rem,1.25cqmin,1.75cqmin)] font-mono uppercase tracking-[0.28em] text-[#888] text-[clamp(0.375rem,1.35cqmin,1.9cqmin)]"
                aria-hidden
              >
                <span
                  className="h-px w-[clamp(1.25rem,6cqmin,8.5cqmin)]"
                  style={{ backgroundColor: EXPORT_CHALK_RULE }}
                />
                <span>{countLabel} partners</span>
                <span
                  className="h-px w-[clamp(1.25rem,6cqmin,8.5cqmin)]"
                  style={{ backgroundColor: EXPORT_CHALK_RULE }}
                />
              </div>
            </div>

            <div style={partnerWallOuterStyle}>
              {partnerWallRows.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  style={{
                    ...postRowStyle,
                    gap:
                      rowIdx === 0 && layout.firstRowCellGap
                        ? layout.firstRowCellGap
                        : layout.cellGap,
                  }}
                >
                  {row.map((cell, cellIdx) => {
                    const flatIndex =
                      partnerWallRows
                        .slice(0, rowIdx)
                        .reduce((sum, r) => sum + r.length, 0) + cellIdx;
                    const isFeaturedRow = isEventIntroFeaturedRow(rowIdx);
                    return (
                      <EventIntroWallCellFrame
                        key={wallCellKey(cell, flatIndex)}
                        cell={cell}
                        frame={frame}
                        flatIndex={flatIndex}
                        sponsorsInStart={sponsorsIn.startFrame}
                        staggerFrames={staggerFrames}
                        slotRevealFrames={slotRevealFrames}
                        sponsorTotal={sponsorTotal}
                        slotWidth={
                          isFeaturedRow && layout.leadRowSlotWidth
                            ? layout.leadRowSlotWidth
                            : layout.slotWidth
                        }
                        slotHeight={
                          isFeaturedRow && layout.leadRowSlotHeight
                            ? layout.leadRowSlotHeight
                            : layout.slotHeight
                        }
                        logoScale={
                          isFeaturedRow
                            ? (layout.leadRowLogoScale ?? layout.logoScale)
                            : layout.logoScale
                        }
                        ufgInnerScale={layout.ufgInnerScale}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {aspectFormat === "post" ? (
          <div style={{ ...ACCENT_LINE, opacity: chromeShow }} />
        ) : null}

        {aspectFormat === "post" ? (
          <div
            className={`shrink-0 ${chromeBandPy}`}
            style={{
              opacity: chromeShow,
              transform: `translate3d(0, ${(1 - chromeShow) * 14}px, 0)`,
            }}
          >
            <EventInfoBlock
              compact
              showVenue={false}
              poweredByLogoSrc={staticFile("sponsors/ailabs.svg")}
            />
          </div>
        ) : (
          <div
            className={`shrink-0 ${chromeBandPy}`}
            style={{
              opacity: chromeShow,
              transform: `translate3d(0, ${(1 - chromeShow) * 14}px, 0)`,
              marginTop: storyChromeBandTighten,
            }}
          >
            <div
              style={{
                transform: `scale(${storyChromeScale})`,
                transformOrigin: "bottom center",
                width: "100%",
              }}
            >
              <EventInfoBlock
                showVenue={false}
                poweredByLogoSrc={staticFile("sponsors/ailabs.svg")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EventIntroCenterLockup({
  aspectFormat,
  frame,
  ailabsJoin,
}: {
  aspectFormat: AspectFormat;
  frame: number;
  ailabsJoin: { startFrame: number; endFrame: number };
}) {
  const cursorHeight =
    aspectFormat === "post"
      ? "clamp(1.2rem,5.15cqmin,7.25cqmin)"
      : "clamp(1.35rem,5.95cqmin,8.15cqmin)";
  const ailabsHeight =
    aspectFormat === "post"
      ? "clamp(1.18rem,4.85cqmin,6.85cqmin)"
      : "clamp(1.32rem,5.55cqmin,7.75cqmin)";
  const ailabsLift =
    aspectFormat === "post"
      ? "clamp(0.1rem,0.38cqmin,0.52cqmin)"
      : "clamp(0.12rem,0.44cqmin,0.6cqmin)";
  const partnerGap =
    aspectFormat === "post"
      ? "clamp(0.55rem,2.05cqmin,2.85cqmin)"
      : "clamp(0.65rem,2.35cqmin,3.25cqmin)";

  const joinProgress = interpolate(
    frame,
    [ailabsJoin.startFrame, ailabsJoin.endFrame],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
  const partnerOpacity = interpolate(
    frame,
    [ailabsJoin.startFrame, ailabsJoin.startFrame + 6],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const partnerSlideX = interpolate(joinProgress, [0, 1], [48, 0]);
  const partnerClipRight = interpolate(joinProgress, [0, 1], [100, 0]);
  const partnerMaxWidth = interpolate(
    joinProgress,
    [0, 1],
    [0, aspectFormat === "post" ? 28 : 32],
  );
  const partnerInFlow = joinProgress > 0;

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ opacity: 0.88 }}
    >
      <div className="inline-flex items-center justify-center">
        <ExportCursorLogo
          className="w-auto shrink-0 opacity-80"
          style={{ height: cursorHeight }}
        />
        <div
          style={{
            width: partnerInFlow ? undefined : 0,
            maxWidth: partnerInFlow ? `${partnerMaxWidth}cqmin` : 0,
            minWidth: 0,
            marginLeft: partnerInFlow ? partnerGap : 0,
            opacity: partnerOpacity,
            flexShrink: 0,
            overflowX: "clip",
            overflowY: "visible",
            display: "flex",
            alignItems: "center",
            paddingBlock: "0.2cqmin",
            clipPath: partnerInFlow
              ? `inset(-35% ${partnerClipRight}% -35% 0)`
              : undefined,
          }}
        >
          <div
            className="flex items-center whitespace-nowrap"
            style={{
              gap: partnerGap,
              transform: `translate3d(${partnerSlideX}px, 0, 0)`,
            }}
          >
            <span
              className="font-mono text-[clamp(0.75rem,2.65cqmin,3.75cqmin)] leading-none text-[#666]"
              aria-hidden
            >
              ×
            </span>
            <img
              src={staticFile("sponsors/ailabs.svg")}
              alt="AI Labs"
              draggable={false}
              className="block w-auto shrink-0 object-contain"
              style={{
                height: ailabsHeight,
                filter: "brightness(0) invert(1)",
                opacity: 0.82,
                transform: `translateY(calc(-1 * ${ailabsLift}))`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function wallCellKey(cell: EventIntroWallCell, cellIdx?: number): string {
  if (cell.kind === "ufg") {
    return cellIdx === undefined ? "ufg" : `ufg-${cellIdx}`;
  }
  return WELCOME_CARD_SPONSOR_MARK_KEYS[cell.index];
}

type WallCellFrameProps = {
  cell: EventIntroWallCell;
  frame: number;
  flatIndex: number;
  sponsorsInStart: number;
  staggerFrames: number;
  slotRevealFrames: number;
  sponsorTotal: number;
  slotWidth: string;
  slotHeight: string;
  displayIndex?: number;
  logoScale?: number;
  ufgInnerScale?: number;
};

function EventIntroWallCellFrame({
  cell,
  frame,
  flatIndex,
  sponsorsInStart,
  staggerFrames,
  slotRevealFrames,
  sponsorTotal,
  slotWidth,
  slotHeight,
  displayIndex,
  logoScale = 1,
  ufgInnerScale,
}: WallCellFrameProps) {
  const start = sponsorsInStart + flatIndex * staggerFrames;
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

  const resolvedLogoScale = eventIntroSponsorLogoScale(cell, logoScale);

  return (
    <div
      style={{
        opacity: itemOpacity,
        transform: `translate3d(0, ${itemTranslateY}px, 0)`,
      }}
    >
      <div
        style={
          resolvedLogoScale === 1
            ? undefined
            : {
                transform: `scale(${resolvedLogoScale})`,
                transformOrigin: "center center",
              }
        }
      >
        {cell.kind === "ufg" ? (
          <EventIntroUfgMark
            slotWidth={slotWidth}
            slotHeight={slotHeight}
            innerScale={ufgInnerScale}
          />
        ) : (
          (() => {
            const Mark = EXPORT_SPONSOR_MARK_COMPONENTS[cell.index];
            return (
              <Mark
                index={displayIndex ?? cell.index}
                total={sponsorTotal}
                slotWidth={slotWidth}
                slotHeight={slotHeight}
              />
            );
          })()
        )}
      </div>
    </div>
  );
}
