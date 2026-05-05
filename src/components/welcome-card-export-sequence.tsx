import type { CSSProperties } from "react";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import { WelcomeCardExportContent } from "./welcome-card-export-content";
import { WelcomeCardExportSponsorSlate } from "./welcome-card-export-sponsor-slate";
import { WelcomeCardExportVideoBackground } from "./welcome-card-export-video-background";
import { DESIGN_DIMENSIONS, SEQUENCE_TIMELINE } from "./welcome-card-canvas-spec";

const EXPORT_FRAME_BORDER = "1px solid rgba(255, 75, 0, 0.4)";
const EXPORT_FRAME_SHADOW =
  "0 0 0 1px rgba(255,75,0,0.2), 0 24px 80px -24px rgba(255,75,0,0.35)";

type Phase = "default" | "glitchOut" | "sponsor" | "glitchBack" | "finalHold";

type SequenceState = {
  phase: Phase;
  defaultAlpha: number;
  sponsorAlpha: number;
  jitter: number;
  slateProgress: number;
};

type Props = {
  handle: string;
  imageUrl: string | null;
  aspectFormat: AspectFormat;
  progressSeconds: number;
  scale?: number;
  isLeadOrganizer?: boolean;
};

export function WelcomeCardExportSequence({
  handle,
  imageUrl,
  aspectFormat,
  progressSeconds,
  scale = 1,
  isLeadOrganizer,
}: Props) {
  const state = computeSequenceState(progressSeconds);
  const jitterX =
    state.jitter !== 0 ? Math.sin(progressSeconds * 47) * 6 * state.jitter : 0;
  const jitterY =
    state.jitter !== 0 ? Math.cos(progressSeconds * 61) * 4 * state.jitter : 0;
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

  return (
    <div style={outerStyle}>
      <WelcomeCardExportVideoBackground
        aspectFormat={aspectFormat}
        exportScale={scale}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: state.defaultAlpha,
          transform: `translate3d(${jitterX * 0.6}px, ${jitterY * 0.6}px, 0)`,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="relative z-10 flex min-h-0 h-full w-full flex-col">
          <WelcomeCardExportContent
            handle={handle}
            imageUrl={imageUrl}
            format={aspectFormat}
            isLeadOrganizer={isLeadOrganizer}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: state.sponsorAlpha,
          transform: `translate3d(${-jitterX * 0.6}px, ${-jitterY * 0.6}px, 0)`,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <WelcomeCardExportSponsorSlate
          aspectFormat={aspectFormat}
          slateActive={state.sponsorAlpha > 0}
        />
      </div>

      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 30,
          background: "rgba(255,75,0,0.18)",
          opacity: state.jitter > 0 ? state.jitter * 0.6 : 0,
        }}
        aria-hidden
      />
    </div>
  );
}

function computeSequenceState(t: number): SequenceState {
  const { defaultEnd, glitchOutEnd, sponsorHoldEnd, glitchBackEnd, totalEnd } =
    SEQUENCE_TIMELINE;

  if (t < defaultEnd) {
    return {
      phase: "default",
      defaultAlpha: 1,
      sponsorAlpha: 0,
      jitter: 0,
      slateProgress: 0,
    };
  }

  if (t < glitchOutEnd) {
    const local = (t - defaultEnd) / (glitchOutEnd - defaultEnd);
    const eased = easeInOutCubic(local);
    return {
      phase: "glitchOut",
      defaultAlpha: 1 - eased,
      sponsorAlpha: eased,
      jitter: glitchEnvelope(local),
      slateProgress: 0,
    };
  }

  if (t < sponsorHoldEnd) {
    const local = (t - glitchOutEnd) / (sponsorHoldEnd - glitchOutEnd);
    return {
      phase: "sponsor",
      defaultAlpha: 0,
      sponsorAlpha: 1,
      jitter: 0,
      slateProgress: local,
    };
  }

  if (t < glitchBackEnd) {
    const local = (t - sponsorHoldEnd) / (glitchBackEnd - sponsorHoldEnd);
    const eased = easeInOutCubic(local);
    return {
      phase: "glitchBack",
      defaultAlpha: eased,
      sponsorAlpha: 1 - eased,
      jitter: glitchEnvelope(local),
      slateProgress: 1,
    };
  }

  const local = (t - glitchBackEnd) / Math.max(0.0001, totalEnd - glitchBackEnd);
  void local;
  return {
    phase: "finalHold",
    defaultAlpha: 1,
    sponsorAlpha: 0,
    jitter: 0,
    slateProgress: 0,
  };
}

function easeInOutCubic(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

function glitchEnvelope(local: number): number {
  const clamped = Math.min(1, Math.max(0, local));
  return Math.sin(clamped * Math.PI);
}
