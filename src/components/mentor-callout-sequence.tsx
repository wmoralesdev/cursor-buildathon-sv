import { type CSSProperties, type ReactNode } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import { DESIGN_DIMENSIONS } from "./welcome-card-canvas-spec";
import { EXPORT_CHALK_DIVIDER, EXPORT_CHALK_RULE } from "./export-chalk-accent";
import { WelcomeCardExportVideoBackground } from "./welcome-card-export-video-background";
import { EventIntroUfgMark } from "./event-intro-ufg-mark";
import { ExportCursorLogo } from "./export-logo-marks";
import { ACCEPTED_LABEL_CLASS } from "./accepted-card-shared";
import { EXPORT_SPONSOR_MARK_COMPONENTS } from "./welcome-card-export-sponsor-slate";
import {
  buildEventIntroPostWallRows,
  buildEventIntroStoryWallRows,
  isEventIntroFeaturedRow,
  type EventIntroWallCell,
} from "../lib/event-intro-partner-wall";
import { WELCOME_CARD_SPONSOR_MARK_KEYS } from "./welcome-sponsor-marks";
import {
  MENTOR_CALLOUT_BEAT_INDEX_LABELS,
  MENTOR_CALLOUT_CORNER_EYEBROW,
  MENTOR_CALLOUT_CORNER_TITLE,
  MENTOR_CALLOUT_CTA_HEADLINE,
  MENTOR_CALLOUT_CTA_LINE,
  MENTOR_CALLOUT_DEADLINE,
  MENTOR_CALLOUT_EYEBROW,
  MENTOR_CALLOUT_EVENT_WINDOW,
  MENTOR_CALLOUT_HOOK_LINES,
  MENTOR_CALLOUT_HOW_COMMAND,
  MENTOR_CALLOUT_SPONSORS_EYEBROW,
  MENTOR_CALLOUT_SPONSORS_TITLE,
  MENTOR_CALLOUT_STEPS,
  MENTOR_CALLOUT_TIMELINE,
  MENTOR_CALLOUT_TRACKS,
  MENTOR_CALLOUT_TRACKS_EYEBROW,
  MENTOR_CALLOUT_WHY_HEADLINE,
  MENTOR_CALLOUT_WHY_SUB,
} from "./mentor-callout-spec";

type Props = {
  aspectFormat: AspectFormat;
  scale?: number;
};

const SPONSOR_LOGO_SCALE_BOOST = {
  n8n: 1.21,
  yonjob: 1.1,
  weris: 0.95,
} as const satisfies Partial<
  Record<(typeof WELCOME_CARD_SPONSOR_MARK_KEYS)[number], number>
>;

type FormatLayout = {
  outerColumnClass: string;
  chromePadX: string;
  chromePadY: string;
  cornerLogoClass: string;
  cornerEyebrowClamp: string;
  cornerTitleClamp: string;
  indexNumClamp: string;
  indexMetaClamp: string;
  eyebrowClamp: string;
  hookClamp: string;
  whyHeadlineClamp: string;
  whySubClamp: string;
  ledgerRowGap: string;
  ledgerNumClamp: string;
  ledgerLabelClamp: string;
  terminalWidth: string;
  terminalFontClamp: string;
  ctaClamp: string;
  ctaLineClamp: string;
  ctaTagClamp: string;
  centerGap: string;
  titleClamp: string;
  slotWidth: string;
  slotHeight: string;
  cellGap: string;
  rowGap: string;
  firstRowCellGap: string;
  leadRowSlotWidth: string;
  leadRowSlotHeight: string;
  wallMaxWidth: string;
  titleToLogoGap: string;
  logoScale: number;
  leadRowLogoScale: number;
  ufgInnerScale: number;
};

const FORMAT_LAYOUT: Record<AspectFormat, FormatLayout> = {
  post: {
    outerColumnClass:
      "relative z-10 flex h-full min-h-0 w-full flex-1 flex-col px-[clamp(1.35rem,3.85cqmin,5.65cqmin)]",
    chromePadX: "clamp(1.35rem,3.85cqmin,5.65cqmin)",
    chromePadY: "clamp(1.35rem,3.85cqmin,5.65cqmin)",
    cornerLogoClass: "h-[clamp(0.85rem,3.4cqmin,4.6cqmin)] w-auto opacity-80",
    cornerEyebrowClamp: "text-[clamp(0.44rem,1.5cqmin,2.1cqmin)]",
    cornerTitleClamp: "text-[clamp(0.6rem,2.1cqmin,2.95cqmin)]",
    indexNumClamp: "text-[clamp(0.85rem,3.1cqmin,4.2cqmin)]",
    indexMetaClamp: "text-[clamp(0.46rem,1.6cqmin,2.25cqmin)]",
    eyebrowClamp: "text-[clamp(0.5rem,1.75cqmin,2.5cqmin)]",
    hookClamp: "text-[clamp(1.6rem,7.2cqmin,9cqmin)]",
    whyHeadlineClamp: "text-[clamp(1.25rem,5.2cqmin,6.6cqmin)]",
    whySubClamp: "text-[clamp(0.78rem,2.75cqmin,3.8cqmin)]",
    ledgerRowGap: "clamp(0.5rem,1.9cqmin,2.6cqmin)",
    ledgerNumClamp: "text-[clamp(0.62rem,2.15cqmin,2.95cqmin)]",
    ledgerLabelClamp: "text-[clamp(1rem,4cqmin,5.1cqmin)]",
    terminalWidth: "min(86cqw,90cqmin)",
    terminalFontClamp: "clamp(0.7rem,2.2cqmin,2.9cqmin)",
    ctaClamp: "text-[clamp(1.3rem,5.6cqmin,7cqmin)]",
    ctaLineClamp: "text-[clamp(0.82rem,2.95cqmin,4.05cqmin)]",
    ctaTagClamp: "text-[clamp(0.58rem,1.95cqmin,2.7cqmin)]",
    centerGap: "gap-[clamp(0.85rem,3cqmin,4.2cqmin)]",
    titleClamp: "text-[clamp(0.8125rem,2.95cqmin,4.1cqmin)]",
    slotWidth: "clamp(4.5rem,16.35cqmin,19.35cqmin)",
    slotHeight: "clamp(1.32rem,5.17cqmin,6.99cqmin)",
    cellGap: "clamp(0.6rem,2.45cqmin,3.15cqmin)",
    rowGap: "clamp(1.4rem,5.75cqmin,7.35cqmin)",
    firstRowCellGap: "clamp(2.4rem,10.9cqmin,15.75cqmin)",
    leadRowSlotWidth: "clamp(6.1rem,22.35cqmin,25.75cqmin)",
    leadRowSlotHeight: "clamp(1.8rem,7.05cqmin,9.4cqmin)",
    wallMaxWidth: "min(96cqw,94cqmin)",
    titleToLogoGap: "clamp(0.85rem, 3.1cqmin, 4.5cqmin)",
    logoScale: 1.09,
    leadRowLogoScale: 1.33,
    ufgInnerScale: 1.1,
  },
  story: {
    outerColumnClass:
      "relative z-10 flex h-full min-h-0 w-full flex-1 flex-col px-[clamp(1.25rem,4.75cqmin,6.75cqmin)] py-[clamp(2.5rem,8cqmin,10cqmin)]",
    chromePadX: "clamp(1.25rem,4.75cqmin,6.75cqmin)",
    chromePadY: "clamp(1.9rem,6cqmin,8cqmin)",
    cornerLogoClass: "h-[clamp(1.05rem,4.6cqmin,6.4cqmin)] w-auto opacity-80",
    cornerEyebrowClamp: "text-[clamp(0.52rem,1.85cqmin,2.6cqmin)]",
    cornerTitleClamp: "text-[clamp(0.72rem,2.55cqmin,3.55cqmin)]",
    indexNumClamp: "text-[clamp(1.05rem,3.7cqmin,5cqmin)]",
    indexMetaClamp: "text-[clamp(0.56rem,1.95cqmin,2.7cqmin)]",
    eyebrowClamp: "text-[clamp(0.6rem,2.15cqmin,3cqmin)]",
    hookClamp: "text-[clamp(1.9rem,8.4cqmin,11cqmin)]",
    whyHeadlineClamp: "text-[clamp(1.5rem,6.2cqmin,8cqmin)]",
    whySubClamp: "text-[clamp(0.9rem,3.2cqmin,4.4cqmin)]",
    ledgerRowGap: "clamp(0.7rem,2.5cqmin,3.4cqmin)",
    ledgerNumClamp: "text-[clamp(0.72rem,2.55cqmin,3.55cqmin)]",
    ledgerLabelClamp: "text-[clamp(1.2rem,4.9cqmin,6.4cqmin)]",
    terminalWidth: "min(92cqw,94cqmin)",
    terminalFontClamp: "clamp(0.82rem,2.8cqmin,3.6cqmin)",
    ctaClamp: "text-[clamp(1.55rem,6.6cqmin,8.4cqmin)]",
    ctaLineClamp: "text-[clamp(0.95rem,3.4cqmin,4.7cqmin)]",
    ctaTagClamp: "text-[clamp(0.68rem,2.35cqmin,3.25cqmin)]",
    centerGap: "gap-[clamp(1.1rem,4cqmin,5.6cqmin)]",
    titleClamp: "text-[clamp(1rem,3.75cqmin,5.2cqmin)]",
    slotWidth: "clamp(5.5rem,24.2cqmin,33cqmin)",
    slotHeight: "clamp(1.8rem,6.45cqmin,8.95cqmin)",
    cellGap: "clamp(1.4rem,5cqmin,6.65cqmin)",
    rowGap: "clamp(1.25rem,5.4cqmin,7.3cqmin)",
    firstRowCellGap: "clamp(2.4rem,10.9cqmin,15.75cqmin)",
    leadRowSlotWidth: "clamp(7.7rem,34.1cqmin,46.2cqmin)",
    leadRowSlotHeight: "clamp(2.6rem,9.1cqmin,12.65cqmin)",
    wallMaxWidth: "min(97cqw,94cqmin)",
    titleToLogoGap: "clamp(1.5rem, 5cqmin, 7.5cqmin)",
    logoScale: 1.01,
    leadRowLogoScale: 1.1,
    ufgInnerScale: 1.05,
  },
};

function easeOut(frame: number, start: number, end: number): number {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

/** Signature entrance: exponential ease-out for the wipe + rise. */
function easeOutExp(frame: number, start: number, end: number): number {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
}

function hookShowValue(frame: number): number {
  const { hook, loopOut } = MENTOR_CALLOUT_TIMELINE;
  if (frame <= hook.endFrame - 10) return 1;
  if (frame < hook.endFrame) {
    return interpolate(frame, [hook.endFrame - 10, hook.endFrame], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.quad),
    });
  }
  if (frame < loopOut.startFrame) return 0;
  return easeOut(frame, loopOut.startFrame, loopOut.endFrame);
}

function midBeatShow(
  frame: number,
  window: { startFrame: number; endFrame: number },
): number {
  const inEnd = window.startFrame + 12;
  const outStart = window.endFrame - 10;
  const fadeIn = easeOut(frame, window.startFrame, inEnd);
  const fadeOut = interpolate(frame, [outStart, window.endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  return Math.min(fadeIn, fadeOut);
}

function sponsorsShowValue(frame: number): number {
  const { sponsorsIn, loopOut } = MENTOR_CALLOUT_TIMELINE;
  if (frame < sponsorsIn.startFrame) return 0;
  const fadeIn = easeOut(frame, sponsorsIn.startFrame, sponsorsIn.startFrame + 14);
  if (frame < loopOut.startFrame) return fadeIn;
  return Math.min(
    fadeIn,
    interpolate(frame, [loopOut.startFrame, loopOut.endFrame], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.quad),
    }),
  );
}

/**
 * Persistent chrome opacity. Held at full through the five copy beats, retired
 * as the sponsor wall takes the frame, and returned for the loop seam so the
 * piece reads as one continuous cut (matches `hookShowValue` at the loop edges).
 */
function chromeShowValue(frame: number): number {
  const { sponsorsIn, loopOut } = MENTOR_CALLOUT_TIMELINE;
  const beats = interpolate(
    frame,
    [sponsorsIn.startFrame, sponsorsIn.startFrame + 14],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.quad),
    },
  );
  if (frame < loopOut.startFrame) return beats;
  return Math.max(beats, easeOut(frame, loopOut.startFrame, loopOut.endFrame));
}

/** 0-based content-beat index for the running spine; collapses to the hook on the loop seam. */
function currentBeatIndex(frame: number): number {
  const { why, what, how, cta, sponsorsIn, loopOut } = MENTOR_CALLOUT_TIMELINE;
  if (frame >= loopOut.startFrame) return 0;
  if (frame < why.startFrame) return 0;
  if (frame < what.startFrame) return 1;
  if (frame < how.startFrame) return 2;
  if (frame < cta.startFrame) return 3;
  if (frame < sponsorsIn.startFrame) return 4;
  return 4;
}

export function MentorCalloutSequence({ aspectFormat, scale = 1 }: Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, height } = DESIGN_DIMENSIONS[aspectFormat];
  const layout = FORMAT_LAYOUT[aspectFormat];

  const { why, what, how, cta, sponsorsIn } = MENTOR_CALLOUT_TIMELINE;

  const hookShow = hookShowValue(frame);
  const whyShow = midBeatShow(frame, why);
  const whatShow = midBeatShow(frame, what);
  const howShow = midBeatShow(frame, how);
  const ctaShow = midBeatShow(frame, cta);
  const sponsorsShow = sponsorsShowValue(frame);
  const chromeShow = chromeShowValue(frame);
  const beatIndex = currentBeatIndex(frame);

  const sponsorTotal = EXPORT_SPONSOR_MARK_COMPONENTS.length;
  const countLabel = String(sponsorTotal).padStart(2, "0");
  const partnerWallRows =
    aspectFormat === "post"
      ? buildEventIntroPostWallRows(sponsorTotal)
      : buildEventIntroStoryWallRows(sponsorTotal);
  const staggerFrames = Math.max(1, Math.round(0.035 * fps));
  const slotRevealFrames = Math.max(6, Math.round(0.28 * fps));

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

  return (
    <div style={outerStyle}>
      <WelcomeCardExportVideoBackground aspectFormat={aspectFormat} />

      <Chrome
        layout={layout}
        show={chromeShow}
        beatIndex={beatIndex}
        totalBeats={MENTOR_CALLOUT_BEAT_INDEX_LABELS.length}
      />

      <div
        className="absolute inset-0 flex flex-col"
        style={{
          paddingLeft: layout.chromePadX,
          paddingRight: layout.chromePadX,
          pointerEvents: "none",
        }}
      >
        <div className="relative flex min-h-0 w-full flex-1 flex-col items-center justify-center">
          <HookFrame show={hookShow}>
            <HookBeat layout={layout} />
          </HookFrame>
          <TypeBeat show={whyShow} frame={frame} start={why.startFrame}>
            <WhyBeat layout={layout} />
          </TypeBeat>
          <TypeBeat show={whatShow} frame={frame} start={what.startFrame}>
            <TracksBeat layout={layout} />
          </TypeBeat>
          <TypeBeat show={howShow} frame={frame} start={how.startFrame}>
            <HowBeat layout={layout} frame={frame} />
          </TypeBeat>
          <TypeBeat show={ctaShow} frame={frame} start={cta.startFrame}>
            <CtaBeat layout={layout} />
          </TypeBeat>
          <FillBeat show={sponsorsShow}>
            <SponsorsBeat
              layout={layout}
              frame={frame}
              sponsorsInStart={sponsorsIn.startFrame}
              partnerWallRows={partnerWallRows}
              countLabel={countLabel}
              sponsorTotal={sponsorTotal}
              staggerFrames={staggerFrames}
              slotRevealFrames={slotRevealFrames}
            />
          </FillBeat>
        </div>
      </div>
    </div>
  );
}

function Chrome({
  layout,
  show,
  beatIndex,
  totalBeats,
}: {
  layout: FormatLayout;
  show: number;
  beatIndex: number;
  totalBeats: number;
}) {
  if (show <= 0) return null;
  const indexLabel = MENTOR_CALLOUT_BEAT_INDEX_LABELS[beatIndex] ?? "";
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingLeft: layout.chromePadX,
        paddingRight: layout.chromePadX,
        paddingTop: layout.chromePadY,
        paddingBottom: layout.chromePadY,
        opacity: show,
        pointerEvents: "none",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-[0.2em]">
          <span
            className={`font-mono ${layout.cornerEyebrowClamp} uppercase tracking-[0.34em] text-[#7c766b]`}
          >
            {MENTOR_CALLOUT_CORNER_EYEBROW}
          </span>
          <span className={`${ACCEPTED_LABEL_CLASS} ${layout.cornerTitleClamp}`}>
            {MENTOR_CALLOUT_CORNER_TITLE}
          </span>
        </div>
        <ExportCursorLogo className={`${layout.cornerLogoClass} shrink-0`} />
      </div>

      <div className="flex items-end gap-[0.7em]">
        <span
          className={`${ACCEPTED_LABEL_CLASS} ${layout.indexNumClamp} leading-none`}
        >
          {String(beatIndex + 1).padStart(2, "0")}
        </span>
        <span
          className={`font-mono ${layout.indexMetaClamp} uppercase tracking-[0.28em] text-[#6f6a60] pb-[0.15em]`}
        >
          / {String(totalBeats).padStart(2, "0")}
        </span>
        <span
          className="mb-[0.32em] h-px w-[clamp(1rem,3.5cqmin,5cqmin)] shrink-0"
          style={{ backgroundColor: EXPORT_CHALK_RULE }}
        />
        <span
          className={`font-mono ${layout.indexMetaClamp} uppercase tracking-[0.24em] text-[#9a948a] pb-[0.15em]`}
        >
          {indexLabel}
        </span>
      </div>
    </div>
  );
}

/** Hook: persistent at the loop seam, so it only fades (no wipe) to stay seamless. */
function HookFrame({ show, children }: { show: number; children: ReactNode }) {
  if (show <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        opacity: show,
      }}
    >
      {children}
    </div>
  );
}

/** Mid-sequence beats: left-anchored with the signature left-to-right wipe + rise. */
function TypeBeat({
  show,
  frame,
  start,
  children,
}: {
  show: number;
  frame: number;
  start: number;
  children: ReactNode;
}) {
  if (show <= 0) return null;
  const enter = easeOutExp(frame, start, start + 13);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        opacity: show,
      }}
    >
      <div
        style={{
          width: "100%",
          transform: `translate3d(0, ${(1 - enter) * 16}px, 0)`,
          clipPath: `inset(0 ${(1 - enter) * 100}% 0 0)`,
          WebkitClipPath: `inset(0 ${(1 - enter) * 100}% 0 0)`,
          willChange: "clip-path, transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function FillBeat({ show, children }: { show: number; children: ReactNode }) {
  if (show <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: show,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

function HookBeat({ layout }: { layout: FormatLayout }) {
  return (
    <div className="flex flex-col items-start gap-[clamp(0.7rem,2.6cqmin,3.4cqmin)] text-left">
      <p
        className={`font-mono ${layout.eyebrowClamp} uppercase tracking-[0.28em] text-[#9a948a]`}
      >
        {MENTOR_CALLOUT_EYEBROW}
      </p>
      <div className="flex flex-col items-start gap-[clamp(0.45rem,1.6cqmin,2.2cqmin)]">
        {MENTOR_CALLOUT_HOOK_LINES.map((line) => (
          <p
            key={line}
            className={`${ACCEPTED_LABEL_CLASS} ${layout.hookClamp} normal-case tracking-[-0.01em] leading-[1.02]`}
          >
            {line}
          </p>
        ))}
        <p
          className={`font-mono ${layout.whySubClamp} uppercase tracking-[0.06em] text-[#9a948a]`}
        >
          {MENTOR_CALLOUT_EVENT_WINDOW}
        </p>
      </div>
    </div>
  );
}

function WhyBeat({ layout }: { layout: FormatLayout }) {
  const [before, after] = MENTOR_CALLOUT_WHY_SUB.split("200");
  return (
    <div className="flex flex-col items-start gap-[clamp(0.7rem,2.5cqmin,3.2cqmin)] text-left">
      <p
        className={`${ACCEPTED_LABEL_CLASS} ${layout.whyHeadlineClamp} normal-case tracking-[-0.01em] leading-[1.06]`}
        style={{ maxWidth: "min(92cqw,90cqmin)" }}
      >
        {MENTOR_CALLOUT_WHY_HEADLINE}
      </p>
      <p
        className={`font-mono ${layout.whySubClamp} tracking-[0.02em] text-[#9a948a]`}
        style={{ maxWidth: "min(84cqw,82cqmin)" }}
      >
        {after !== undefined ? (
          <>
            {before}
            <span className="text-[#f4f2eb]">200</span>
            {after}
          </>
        ) : (
          MENTOR_CALLOUT_WHY_SUB
        )}
      </p>
    </div>
  );
}

function TracksBeat({ layout }: { layout: FormatLayout }) {
  return (
    <div className="flex w-full flex-col items-start gap-[clamp(0.9rem,3.2cqmin,4.4cqmin)] text-left">
      <p
        className={`font-mono ${layout.eyebrowClamp} uppercase tracking-[0.28em] text-[#9a948a]`}
      >
        {MENTOR_CALLOUT_TRACKS_EYEBROW}
      </p>
      <div
        className="flex w-full flex-col"
        style={{ maxWidth: "min(82cqw,80cqmin)" }}
      >
        {MENTOR_CALLOUT_TRACKS.map((track, idx) => (
          <div
            key={track}
            className="flex items-baseline"
            style={{
              gap: "clamp(0.85rem,3cqmin,4cqmin)",
              paddingTop: layout.ledgerRowGap,
              paddingBottom: layout.ledgerRowGap,
              borderTop:
                idx === 0 ? undefined : `1px solid ${EXPORT_CHALK_DIVIDER}`,
            }}
          >
            <span
              className={`font-mono ${layout.ledgerNumClamp} tracking-[0.1em] text-[#7c766b]`}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span
              className={`${ACCEPTED_LABEL_CLASS} ${layout.ledgerLabelClamp} normal-case tracking-[-0.005em]`}
            >
              {track}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Schedule beat: a flush command surface seated on the baseline grid, not a
 * floating glass window. No backdrop blur, no traffic-light chrome, no drop
 * shadow that detaches it from the frame.
 */
function HowBeat({ layout, frame }: { layout: FormatLayout; frame: number }) {
  const caretOn = Math.floor(frame / 14) % 2 === 0;

  const containerStyle: CSSProperties = {
    width: layout.terminalWidth,
    maxWidth: "100%",
    background: "#0c0b08",
    border: `1px solid ${EXPORT_CHALK_DIVIDER}`,
    borderRadius: "clamp(0.4rem, 1.2cqmin, 1.6cqmin)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const headerPadX = "clamp(0.85rem, 2.6cqmin, 3.4cqmin)";

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "clamp(1.9rem, 4.6cqmin, 5.6cqmin)",
          borderBottom: `1px solid ${EXPORT_CHALK_DIVIDER}`,
          background: "rgba(255,255,255,0.015)",
          padding: `0 ${headerPadX}`,
        }}
      >
        <span
          style={{
            color: "#7c766b",
            fontSize: "clamp(0.56rem, 1.7cqmin, 2.1cqmin)",
            fontFamily: "monospace",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
          }}
        >
          mentor — zsh
        </span>
        <span
          style={{
            width: "clamp(0.34rem, 1cqmin, 1.35cqmin)",
            height: "clamp(0.34rem, 1cqmin, 1.35cqmin)",
            borderRadius: "2px",
            backgroundColor: "#27c93f",
            opacity: 0.85,
          }}
        />
      </div>

      <div
        style={{
          padding: "clamp(1rem, 3.1cqmin, 4cqmin)",
          fontFamily: "monospace",
          fontSize: layout.terminalFontClamp,
          color: "#e8e4da",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.6rem, 1.9cqmin, 2.5cqmin)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.4em" }}>
          <span style={{ color: "#27c93f" }}>➜</span>
          <span style={{ color: "#44bcd8" }}>~</span>
          <span style={{ color: "#e8e4da" }}>{MENTOR_CALLOUT_HOW_COMMAND}</span>
          <span
            style={{
              display: "inline-block",
              width: "0.55em",
              height: "1.05em",
              transform: "translateY(0.12em)",
              backgroundColor: "#e8e4da",
              opacity: caretOn ? 0.9 : 0,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(0.45rem, 1.5cqmin, 2cqmin)",
          }}
        >
          {MENTOR_CALLOUT_STEPS.map((step, idx) => (
            <div
              key={step.label}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.65em",
              }}
            >
              <span style={{ color: "#7c766b" }}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span style={{ color: "#e8e4da" }}>{step.label}</span>
              {step.value ? (
                <span style={{ color: "#6f6a60" }}>{step.value}</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CtaBeat({ layout }: { layout: FormatLayout }) {
  return (
    <div className="flex flex-col items-start gap-[clamp(0.7rem,2.5cqmin,3.2cqmin)] text-left">
      <p
        className={`${ACCEPTED_LABEL_CLASS} ${layout.ctaClamp} normal-case tracking-[-0.01em] leading-[1.02]`}
      >
        {MENTOR_CALLOUT_CTA_HEADLINE}
      </p>
      <p
        className={`font-mono ${layout.ctaLineClamp} tracking-[0.02em] text-[#cfc9bf]`}
        style={{ maxWidth: "min(88cqw,86cqmin)" }}
      >
        {MENTOR_CALLOUT_CTA_LINE}
      </p>
      <span
        className={`font-mono ${layout.ctaTagClamp} uppercase tracking-[0.22em] text-[#cfc9bf]`}
        style={{
          marginTop: "clamp(0.3rem,1.1cqmin,1.5cqmin)",
          padding:
            "clamp(0.32rem,1.05cqmin,1.4cqmin) clamp(0.7rem,2.3cqmin,3.1cqmin)",
          border: `1px solid ${EXPORT_CHALK_DIVIDER}`,
          borderRadius: "999px",
        }}
      >
        {MENTOR_CALLOUT_DEADLINE}
      </span>
    </div>
  );
}

function SponsorsBeat({
  layout,
  frame,
  sponsorsInStart,
  partnerWallRows,
  countLabel,
  sponsorTotal,
  staggerFrames,
  slotRevealFrames,
}: {
  layout: FormatLayout;
  frame: number;
  sponsorsInStart: number;
  partnerWallRows: EventIntroWallCell[][];
  countLabel: string;
  sponsorTotal: number;
  staggerFrames: number;
  slotRevealFrames: number;
}) {
  const headerShow = easeOut(frame, sponsorsInStart, sponsorsInStart + 12);

  const postRowStyle: CSSProperties = {
    display: "flex",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    gap: layout.cellGap,
    width: "100%",
  };

  const wallOuterStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: layout.rowGap,
    width: "100%",
    maxWidth: layout.wallMaxWidth,
    marginTop: layout.titleToLogoGap,
  };

  return (
    <div
      data-event-intro-partner-wall="true"
      className="flex h-full w-full min-h-0 flex-col items-center justify-center"
    >
      <div
        className="flex flex-col items-center gap-[clamp(0.22rem,0.95cqmin,1.35cqmin)] text-center"
        style={{
          opacity: headerShow,
          transform: `translate3d(0, ${(1 - headerShow) * 8}px, 0)`,
        }}
      >
        <p className="font-mono text-[clamp(0.4375rem,1.55cqmin,2.2cqmin)] uppercase tracking-[0.32em] text-[#666]">
          {MENTOR_CALLOUT_SPONSORS_EYEBROW}
        </p>
        <p className={`${ACCEPTED_LABEL_CLASS} ${layout.titleClamp}`}>
          {MENTOR_CALLOUT_SPONSORS_TITLE}
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

      <div style={wallOuterStyle}>
        {partnerWallRows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              ...postRowStyle,
              gap: rowIdx === 0 ? layout.firstRowCellGap : layout.cellGap,
            }}
          >
            {row.map((cell, cellIdx) => {
              const flatIndex =
                partnerWallRows
                  .slice(0, rowIdx)
                  .reduce((sum, r) => sum + r.length, 0) + cellIdx;
              const isFeaturedRow = isEventIntroFeaturedRow(rowIdx);
              return (
                <WallCellFrame
                  key={wallCellKey(cell, flatIndex)}
                  cell={cell}
                  frame={frame}
                  flatIndex={flatIndex}
                  sponsorsInStart={sponsorsInStart}
                  staggerFrames={staggerFrames}
                  slotRevealFrames={slotRevealFrames}
                  sponsorTotal={sponsorTotal}
                  slotWidth={
                    isFeaturedRow ? layout.leadRowSlotWidth : layout.slotWidth
                  }
                  slotHeight={
                    isFeaturedRow ? layout.leadRowSlotHeight : layout.slotHeight
                  }
                  logoScale={
                    isFeaturedRow ? layout.leadRowLogoScale : layout.logoScale
                  }
                  ufgInnerScale={layout.ufgInnerScale}
                />
              );
            })}
          </div>
        ))}
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

function sponsorLogoScale(
  cell: EventIntroWallCell,
  baseScale: number,
): number {
  if (cell.kind !== "sponsor") return baseScale;
  const key = WELCOME_CARD_SPONSOR_MARK_KEYS[cell.index];
  const boost =
    SPONSOR_LOGO_SCALE_BOOST[key as keyof typeof SPONSOR_LOGO_SCALE_BOOST];
  return baseScale * (boost ?? 1);
}

function WallCellFrame({
  cell,
  frame,
  flatIndex,
  sponsorsInStart,
  staggerFrames,
  slotRevealFrames,
  sponsorTotal,
  slotWidth,
  slotHeight,
  logoScale,
  ufgInnerScale,
}: {
  cell: EventIntroWallCell;
  frame: number;
  flatIndex: number;
  sponsorsInStart: number;
  staggerFrames: number;
  slotRevealFrames: number;
  sponsorTotal: number;
  slotWidth: string;
  slotHeight: string;
  logoScale: number;
  ufgInnerScale: number;
}) {
  const start = sponsorsInStart + 10 + flatIndex * staggerFrames;
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

  const resolvedLogoScale = sponsorLogoScale(cell, logoScale);

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
                index={cell.index}
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
