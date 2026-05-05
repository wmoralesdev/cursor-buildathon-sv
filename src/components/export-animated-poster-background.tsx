import { memo, type CSSProperties } from "react";

type Props = {
  progressSeconds: number;
  className?: string;
};

type Pose = {
  x: number;
  y: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
};

type PoseStop = {
  at: number;
  pose: Pose;
};

const BLOOM_STOPS: PoseStop[] = [
  { at: 0, pose: { x: -18, y: -10, rotate: -10, scaleX: 1.04, scaleY: 0.98 } },
  { at: 0.36, pose: { x: 20, y: -6, rotate: 12, scaleX: 1.08, scaleY: 1.02 } },
  { at: 0.7, pose: { x: -8, y: 18, rotate: -2, scaleX: 0.98, scaleY: 1.08 } },
  { at: 1, pose: { x: -18, y: -10, rotate: -10, scaleX: 1.04, scaleY: 0.98 } },
];

const GLOW_STOPS: PoseStop[] = [
  { at: 0, pose: { x: 20, y: 14, rotate: 12, scaleX: 1, scaleY: 1.04 } },
  { at: 0.38, pose: { x: -18, y: -8, rotate: -14, scaleX: 1.08, scaleY: 0.98 } },
  { at: 0.72, pose: { x: 10, y: -18, rotate: 4, scaleX: 0.98, scaleY: 1.08 } },
  { at: 1, pose: { x: 20, y: 14, rotate: 12, scaleX: 1, scaleY: 1.04 } },
];

const SHADOW_STOPS: PoseStop[] = [
  { at: 0, pose: { x: 16, y: 10, rotate: 14, scaleX: 1.08, scaleY: 1 } },
  { at: 0.4, pose: { x: -14, y: -8, rotate: -12, scaleX: 0.98, scaleY: 1.08 } },
  { at: 0.74, pose: { x: 6, y: -14, rotate: 0, scaleX: 1.04, scaleY: 1 } },
  { at: 1, pose: { x: 16, y: 10, rotate: 14, scaleX: 1.08, scaleY: 1 } },
];

const GRAIN_A_STEPS = [
  [0, 0],
  [-3, 2],
  [2, -3],
  [-2, -2],
  [3, 1],
  [-1, 3],
  [0, 0],
] as const;

const GRAIN_B_STEPS = [
  [0, 0],
  [2, -1],
  [-2, 2],
  [1, 3],
  [3, -2],
  [-3, 1],
  [-1, -3],
  [2, 2],
  [0, 0],
] as const;

export const ExportAnimatedPosterBackground = memo(
  function ExportAnimatedPosterBackground({
    progressSeconds,
    className = "",
  }: Props) {
    const bloomProgress = loopProgress(progressSeconds, 5);
    const glowProgress = loopProgress(progressSeconds, 5, -1.7);
    const glowBreatheProgress = loopProgress(progressSeconds, 5, -0.8);
    const shadowProgress = loopProgress(progressSeconds, 5, -2.3);
    const sweepProgress = easeInOut(loopProgress(progressSeconds, 10));

    return (
      <div
        className={`absolute inset-0 isolate overflow-hidden pointer-events-none ${className}`}
        style={{ background: "#14120b", contain: "paint" }}
        aria-hidden
      >
        <div
          style={{
            ...absoluteLayer(0),
            background:
              "radial-gradient(ellipse 86% 72% at 50% 52%, #1c1810 0%, transparent 58%), linear-gradient(135deg, #1a170f 0%, #14120b 40%, #0d0c08 100%)",
          }}
        />
        <div
          style={{
            ...absoluteLayer(1, "-40%"),
            opacity: breathe(loopProgress(progressSeconds, 5), 0.48, 0.72),
            background:
              "radial-gradient(ellipse 22% 18% at 18% 14%, rgba(255,122,43,0.48) 0%, transparent 72%), radial-gradient(ellipse 24% 20% at 62% 36%, rgba(255,122,43,0.42) 0%, transparent 74%), radial-gradient(ellipse 24% 20% at 38% 64%, rgba(255,75,0,0.38) 0%, transparent 74%), radial-gradient(ellipse 22% 18% at 82% 86%, rgba(255,75,0,0.34) 0%, transparent 72%)",
            mixBlendMode: "screen",
            filter: `blur(${breathe(loopProgress(progressSeconds, 5), 22, 30)}px)`,
            transform: poseTransform(interpolatePose(BLOOM_STOPS, bloomProgress)),
          }}
        />
        <div
          style={{
            ...absoluteLayer(2, "-44%"),
            opacity: breathe(glowBreatheProgress, 0.32, 0.5),
            background:
              "radial-gradient(ellipse 32% 24% at 20% 18%, rgba(255,75,0,0.28) 0%, transparent 76%), radial-gradient(ellipse 34% 26% at 62% 40%, rgba(255,122,43,0.24) 0%, transparent 78%), radial-gradient(ellipse 34% 26% at 40% 62%, rgba(255,122,43,0.22) 0%, transparent 78%), radial-gradient(ellipse 32% 24% at 80% 84%, rgba(255,75,0,0.2) 0%, transparent 76%)",
            mixBlendMode: "screen",
            filter: "blur(56px)",
            transform: poseTransform(interpolatePose(GLOW_STOPS, glowProgress)),
          }}
        />
        <div
          style={{
            ...absoluteLayer(3, "-38%"),
            opacity: 0.82,
            background:
              "radial-gradient(ellipse 22% 18% at 82% 14%, rgba(20,18,11,0.85) 0%, transparent 72%), radial-gradient(ellipse 24% 20% at 38% 38%, #14120b 0%, transparent 74%), radial-gradient(ellipse 24% 20% at 62% 62%, #14120b 0%, transparent 74%), radial-gradient(ellipse 22% 18% at 18% 86%, rgba(20,18,11,0.85) 0%, transparent 72%)",
            filter: "blur(28px)",
            transform: poseTransform(interpolatePose(SHADOW_STOPS, shadowProgress)),
          }}
        />
        <div
          style={{
            ...absoluteLayer(4, "-10%"),
            opacity: 0.34,
            background:
              "linear-gradient(112deg, transparent 30%, rgba(255,210,170,0.06) 46%, rgba(255,230,200,0.1) 52%, rgba(255,210,170,0.06) 58%, transparent 74%)",
            backgroundSize: "220% 100%",
            backgroundPosition: `${-60 + 220 * sweepProgress}% 0`,
            mixBlendMode: "soft-light",
          }}
        />
        <div
          style={{
            ...absoluteLayer(5),
            background:
              "radial-gradient(ellipse 112% 92% at 50% 50%, transparent 54%, rgba(0,0,0,0.6) 100%), linear-gradient(180deg, rgba(0,0,0,0.3), transparent 24%, transparent 70%, rgba(0,0,0,0.28))",
            mixBlendMode: "multiply",
          }}
        />
        <div
          style={{
            ...absoluteLayer(6, "-20%"),
            width: "140%",
            height: "140%",
            opacity: 0.62,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 260 260' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='1.6' intercept='-0.3'/%3E%3CfeFuncG type='linear' slope='1.6' intercept='-0.3'/%3E%3CfeFuncB type='linear' slope='1.6' intercept='-0.3'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23g)'/%3E%3C/svg%3E\")",
            backgroundSize: "180px 180px",
            mixBlendMode: "overlay",
            transform: grainTransform(progressSeconds, 0.48, GRAIN_A_STEPS),
          }}
        />
        <div
          style={{
            ...absoluteLayer(7, "-20%"),
            width: "140%",
            height: "140%",
            opacity: 0.36,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='2' seed='23' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='1.8' intercept='-0.4'/%3E%3CfeFuncG type='linear' slope='1.8' intercept='-0.4'/%3E%3CfeFuncB type='linear' slope='1.8' intercept='-0.4'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)'/%3E%3C/svg%3E\")",
            backgroundSize: "130px 130px",
            mixBlendMode: "soft-light",
            transform: grainTransform(progressSeconds, 0.66, GRAIN_B_STEPS),
          }}
        />
      </div>
    );
  },
);

function loopProgress(seconds: number, duration: number, delay = 0): number {
  const shifted = seconds - delay;
  return ((shifted % duration) + duration) % duration / duration;
}

function absoluteLayer(zIndex: number, inset: CSSProperties["inset"] = 0): CSSProperties {
  return {
    position: "absolute",
    inset,
    zIndex,
  };
}

function interpolatePose(stops: PoseStop[], progress: number): Pose {
  const nextIndex = stops.findIndex((stop) => progress <= stop.at);
  const endIndex = nextIndex <= 0 ? 1 : nextIndex;
  const start = stops[endIndex - 1];
  const end = stops[endIndex];
  const range = Math.max(0.0001, end.at - start.at);
  const local = easeInOut((progress - start.at) / range);

  return {
    x: lerp(start.pose.x, end.pose.x, local),
    y: lerp(start.pose.y, end.pose.y, local),
    rotate: lerp(start.pose.rotate, end.pose.rotate, local),
    scaleX: lerp(start.pose.scaleX, end.pose.scaleX, local),
    scaleY: lerp(start.pose.scaleY, end.pose.scaleY, local),
  };
}

function poseTransform(pose: Pose): string {
  return `translate3d(${pose.x}%, ${pose.y}%, 0) rotate(${pose.rotate}deg) scale(${pose.scaleX}, ${pose.scaleY})`;
}

function grainTransform(
  seconds: number,
  duration: number,
  steps: readonly (readonly [number, number])[],
): string {
  const index = Math.min(
    steps.length - 1,
    Math.floor(loopProgress(seconds, duration) * steps.length),
  );
  const [x, y] = steps[index];
  return `translate3d(${x}%, ${y}%, 0)`;
}

function breathe(progress: number, min: number, max: number): number {
  return lerp(min, max, Math.sin(progress * Math.PI));
}

function easeInOut(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
