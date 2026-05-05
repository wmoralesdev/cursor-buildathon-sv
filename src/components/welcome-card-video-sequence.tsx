import type { CSSProperties } from "react";
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import { AcceptedCardContent } from "./accepted-card-content";
import { WelcomeCardVideoBackground } from "./welcome-card-video-background";
import {
  DESIGN_DIMENSIONS,
  SEQUENCE_TIMELINE,
  introOpacity,
  introTranslateY,
} from "./welcome-card-canvas-spec";
import { WelcomeCardSponsorSlate } from "./welcome-card-sponsor-slate";

const PREVIEW_FRAME_BORDER = "1px solid rgba(255, 75, 0, 0.4)";
const PREVIEW_FRAME_SHADOW =
  "0 0 0 1px rgba(255,75,0,0.2), 0 24px 80px -24px rgba(255,75,0,0.35)";

type Phase = "default" | "glitchOut" | "sponsor" | "glitchBack" | "finalHold";

type SequenceState = {
  phase: Phase;
  defaultAlpha: number;
  sponsorAlpha: number;
  jitter: number;
  slateProgress: number;
};

type BaseProps = {
  handle: string;
  imageUrl: string | null;
  aspectFormat: AspectFormat;
  isLeadOrganizer?: boolean;
  scale?: number;
};

export type WelcomeCardVideoSequenceHandle = {
  applyFrame: (t: number) => void;
};

type ControlledProps = BaseProps & {
  imperativePlayback?: false | undefined;
  progressSeconds: number;
};

type ImperativeProps = BaseProps & {
  imperativePlayback: true;
};

export type WelcomeCardVideoSequenceProps = ControlledProps | ImperativeProps;

type ImperativeEls = {
  outer: HTMLDivElement | null;
  defaultLayer: HTMLDivElement | null;
  sponsorLayer: HTMLDivElement | null;
  glitch: HTMLDivElement | null;
  slateRoot: HTMLDivElement | null;
};

function applySequenceFrame(
  t: number,
  scale: number,
  aspectFormat: AspectFormat,
  els: ImperativeEls,
): void {
  const { width, height } = DESIGN_DIMENSIONS[aspectFormat];
  const state = computeSequenceState(t);
  const opacity = introOpacity(t);
  const translateY = introTranslateY(t);
  const jitterX = state.jitter
    ? Math.sin(t * 47) * 6 * state.jitter
    : 0;
  const jitterY = state.jitter
    ? Math.cos(t * 61) * 4 * state.jitter
    : 0;

  const o = els.outer;
  if (o) {
    o.style.containerType = "size";
    o.style.width = `${width}px`;
    o.style.height = `${height}px`;
    o.style.transform = `scale(${scale})`;
    o.style.transformOrigin = "top left";
    o.style.border = PREVIEW_FRAME_BORDER;
    o.style.boxShadow = PREVIEW_FRAME_SHADOW;
    o.style.opacity = String(opacity);
    o.style.translate = `0 ${translateY}px`;
    o.style.backgroundColor = "#14120b";
    o.style.position = "relative";
    o.style.overflow = "hidden";
    o.style.isolation = "isolate";
  }

  const d = els.defaultLayer;
  if (d) {
    d.style.position = "absolute";
    d.style.inset = "0";
    d.style.opacity = String(state.defaultAlpha);
    d.style.transform = `translate3d(${jitterX * 0.6}px, ${jitterY * 0.6}px, 0)`;
    d.style.pointerEvents = "none";
    d.style.display = "flex";
    d.style.flexDirection = "column";
  }

  const s = els.sponsorLayer;
  if (s) {
    s.style.position = "absolute";
    s.style.inset = "0";
    s.style.opacity = String(state.sponsorAlpha);
    s.style.transform = `translate3d(${-jitterX * 0.6}px, ${-jitterY * 0.6}px, 0)`;
    s.style.pointerEvents = "none";
    s.style.display = "flex";
    s.style.flexDirection = "column";
  }

  const g = els.glitch;
  if (g) {
    if (state.jitter > 0) {
      g.style.opacity = String(state.jitter * 0.6);
    } else {
      g.style.opacity = "0";
    }
  }

  const slate = els.slateRoot;
  if (slate) {
    const next = state.sponsorAlpha > 0 ? "true" : "false";
    if (slate.getAttribute("data-slate-active") !== next) {
      slate.setAttribute("data-slate-active", next);
    }
  }
}

export const WelcomeCardVideoSequence = forwardRef<
  WelcomeCardVideoSequenceHandle,
  WelcomeCardVideoSequenceProps
>(function WelcomeCardVideoSequence(props, ref) {
  const imperative = props.imperativePlayback === true;
  const { handle, imageUrl, aspectFormat, isLeadOrganizer, scale = 1 } = props;
  const progressSeconds = imperative ? 0 : props.progressSeconds;

  const outerRef = useRef<HTMLDivElement | null>(null);
  const defaultRef = useRef<HTMLDivElement | null>(null);
  const sponsorRef = useRef<HTMLDivElement | null>(null);
  const glitchRef = useRef<HTMLDivElement | null>(null);
  const slateRootRef = useRef<HTMLDivElement | null>(null);
  const scaleRef = useRef(scale);
  const lastTimeRef = useRef(0);

  useLayoutEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  const getEls = (): ImperativeEls => ({
    outer: outerRef.current,
    defaultLayer: defaultRef.current,
    sponsorLayer: sponsorRef.current,
    glitch: glitchRef.current,
    slateRoot: slateRootRef.current,
  });

  const paint = (t: number) => {
    lastTimeRef.current = t;
    applySequenceFrame(t, scaleRef.current, aspectFormat, getEls());
  };

  useImperativeHandle(
    ref,
    () => ({
      applyFrame: (t: number) => paint(t),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- aspectFormat/isLeadOrganizer affect layout refs
    [aspectFormat, isLeadOrganizer],
  );

  useLayoutEffect(() => {
    if (!imperative) return;
    paint(lastTimeRef.current);
  });

  const state = imperative ? null : computeSequenceState(progressSeconds);
  const slateActiveControlled = imperative
    ? false
    : (state?.sponsorAlpha ?? 0) > 0;

  const outerStyle: CSSProperties = (() => {
    const opacity = introOpacity(progressSeconds);
    const translateY = introTranslateY(progressSeconds);
    const { width, height } = DESIGN_DIMENSIONS[aspectFormat];
    return {
      containerType: "size",
      width,
      height,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      border: PREVIEW_FRAME_BORDER,
      boxShadow: PREVIEW_FRAME_SHADOW,
      opacity,
      translate: `0 ${translateY}px`,
      backgroundColor: "#14120b",
      position: "relative",
      overflow: "hidden",
      isolation: "isolate",
    };
  })();

  const defaultLayerStyle: CSSProperties | undefined = imperative
    ? undefined
    : (() => {
        const jitterX =
          state!.jitter !== 0
            ? Math.sin(progressSeconds * 47) * 6 * state!.jitter
            : 0;
        const jitterY =
          state!.jitter !== 0
            ? Math.cos(progressSeconds * 61) * 4 * state!.jitter
            : 0;
        return {
          position: "absolute",
          inset: 0,
          opacity: state!.defaultAlpha,
          transform: `translate3d(${jitterX * 0.6}px, ${jitterY * 0.6}px, 0)`,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
        };
      })();

  const sponsorLayerStyle: CSSProperties | undefined = imperative
    ? undefined
    : (() => {
        const jitterX =
          state!.jitter !== 0
            ? Math.sin(progressSeconds * 47) * 6 * state!.jitter
            : 0;
        const jitterY =
          state!.jitter !== 0
            ? Math.cos(progressSeconds * 61) * 4 * state!.jitter
            : 0;
        return {
          position: "absolute",
          inset: 0,
          opacity: state!.sponsorAlpha,
          transform: `translate3d(${-jitterX * 0.6}px, ${-jitterY * 0.6}px, 0)`,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
        };
      })();

  return (
    <div
      ref={outerRef}
      style={
        imperative
          ? {
              containerType: "size",
              width: DESIGN_DIMENSIONS[aspectFormat].width,
              height: DESIGN_DIMENSIONS[aspectFormat].height,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              border: PREVIEW_FRAME_BORDER,
              boxShadow: PREVIEW_FRAME_SHADOW,
              backgroundColor: "#14120b",
              position: "relative",
              overflow: "hidden",
              isolation: "isolate",
            }
          : outerStyle
      }
    >
      <WelcomeCardVideoBackground aspectFormat={aspectFormat} />

      <div ref={defaultRef} style={defaultLayerStyle}>
        <div className="relative z-10 flex min-h-0 h-full w-full flex-col">
          <AcceptedCardContent
            handle={handle}
            imageUrl={imageUrl}
            format={aspectFormat}
            isLeadOrganizer={isLeadOrganizer}
          />
        </div>
      </div>

      <div ref={sponsorRef} style={sponsorLayerStyle}>
        <WelcomeCardSponsorSlate
          ref={slateRootRef}
          aspectFormat={aspectFormat}
          slateActive={slateActiveControlled}
          omitSlateActiveAttribute={imperative}
        />
      </div>

      <div
        ref={glitchRef}
        className="pointer-events-none"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 30,
          background: "rgba(255,75,0,0.18)",
          opacity: imperative
            ? 0
            : state!.jitter > 0
              ? state!.jitter * 0.6
              : 0,
        }}
        aria-hidden
      />
    </div>
  );
});

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
