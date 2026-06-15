import type { CSSProperties, ReactNode } from "react";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";

import { ExportZeroTwoOneLogo } from "./export-logo-marks";
import {
  EXPORT_CHALK_GLOW_PRIMARY,
  EXPORT_CHALK_GLOW_SECONDARY,
} from "./export-chalk-accent";
import { SPONSOR_SPOT_TIMELINE } from "./welcome-card-canvas-spec";
import type { AspectFormat } from "../pages/buildathon-welcome-types";
import { WELCOME_CARD_SPONSOR_MARK_KEYS } from "./welcome-sponsor-marks";

export type SponsorSpotKey = (typeof WELCOME_CARD_SPONSOR_MARK_KEYS)[number];

function sponsorPublicAsset(fileName: string): string {
  return staticFile(`sponsors/${fileName}`);
}

/**
 * Logos that ship as monochrome brand assets (no color version available or
 * intentionally mono per brand). For these we keep grayscale through the bloom
 * and only ramp opacity / brightness to give the beat presence.
 */
const KEEP_MONO_THROUGH_BLOOM: ReadonlySet<SponsorSpotKey> = new Set([
  "codex",
  "021",
]);

type RevealState = {
  entryOpacity: number;
  entryY: number;
  entryScale: number;
  bloomProgress: number;
  glowOpacity: number;
  exitProgress: number;
};

function useSponsorSpotReveal(): RevealState {
  const frame = useCurrentFrame();

  const entryProgress = interpolate(
    frame,
    [
      SPONSOR_SPOT_TIMELINE.heroBurst.startFrame,
      SPONSOR_SPOT_TIMELINE.heroBurst.endFrame,
    ],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  const bloomProgress = interpolate(
    frame,
    [
      SPONSOR_SPOT_TIMELINE.colorBloom.startFrame,
      SPONSOR_SPOT_TIMELINE.colorBloom.endFrame,
    ],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  const exitProgress = interpolate(
    frame,
    [
      SPONSOR_SPOT_TIMELINE.exit.startFrame,
      SPONSOR_SPOT_TIMELINE.exit.endFrame,
    ],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 0.6, 1),
    },
  );

  const entryY = (1 - entryProgress) * 8;
  const entryScale = 0.96 + 0.04 * entryProgress;
  const entryOpacity = entryProgress * (1 - exitProgress);

  const glowBase = 0.045 + (0.22 - 0.045) * bloomProgress;
  const glowOpacity = glowBase * (1 - exitProgress);

  return {
    entryOpacity,
    entryY,
    entryScale,
    bloomProgress,
    glowOpacity,
    exitProgress,
  };
}

function logoStyle({
  bloomProgress,
  invert,
  baseOpacity = 0.85,
  keepMono,
}: {
  bloomProgress: number;
  invert?: boolean;
  baseOpacity?: number;
  keepMono?: boolean;
}): CSSProperties {
  const opacity = baseOpacity + (1 - baseOpacity) * bloomProgress;
  if (invert) {
    return {
      maxHeight: "100%",
      maxWidth: "100%",
      height: "auto",
      width: "auto",
      objectFit: "contain",
      filter: "brightness(0) invert(1) grayscale(1)",
      opacity,
    };
  }
  if (keepMono) {
    return {
      maxHeight: "100%",
      maxWidth: "100%",
      height: "auto",
      width: "auto",
      objectFit: "contain",
      filter: `grayscale(1) brightness(${1 + 0.06 * bloomProgress})`,
      opacity,
    };
  }
  const grayscale = 1 - bloomProgress;
  const saturate = 0.85 + 0.5 * bloomProgress;
  const brightness = 1 + 0.04 * bloomProgress;
  return {
    maxHeight: "100%",
    maxWidth: "100%",
    height: "auto",
    width: "auto",
    objectFit: "contain",
    filter: `grayscale(${grayscale}) saturate(${saturate}) brightness(${brightness})`,
    opacity,
  };
}

/** Extra scale on top of welcome-slate innerScale so hero marks read larger in sponsor spots. */
const SPONSOR_SPOT_MARK_BOOST = 1.18 as const;

function LogoWrap({
  innerScale,
  children,
}: {
  innerScale: number;
  children: ReactNode;
}) {
  const s = innerScale * SPONSOR_SPOT_MARK_BOOST;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: s !== 1 ? `scale(${s})` : undefined,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
}

type Props = {
  sponsorKey: SponsorSpotKey;
  format: AspectFormat;
};

function renderSponsorMark(
  sponsorKey: SponsorSpotKey,
  format: AspectFormat,
  bloomProgress: number,
) {
  const keepMono = KEEP_MONO_THROUGH_BLOOM.has(sponsorKey);

  switch (sponsorKey) {
    case "codex":
      return (
        <LogoWrap innerScale={1.58}>
          <img
            src={sponsorPublicAsset("codex-logo.svg")}
            alt="Codex"
            draggable={false}
            style={logoStyle({ bloomProgress, invert: true })}
          />
        </LogoWrap>
      );
    case "n8n":
      return (
        <LogoWrap innerScale={format === "story" ? 4.65 : 3.65}>
          <img
            src={sponsorPublicAsset("n8n-logo-dark.svg")}
            alt="n8n"
            draggable={false}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              height: "auto",
              width: "auto",
              objectFit: "contain",
              filter: `grayscale(${1 - bloomProgress}) saturate(${
                0.85 + 0.5 * bloomProgress
              }) brightness(${1 + 0.04 * bloomProgress})`,
              opacity: 0.85 + 0.15 * bloomProgress,
            }}
          />
        </LogoWrap>
      );
    case "zavu":
      return (
        <LogoWrap innerScale={format === "story" ? 2 : 1.52}>
          <img
            src={sponsorPublicAsset("zavu-dark.svg")}
            alt="Zavu"
            draggable={false}
            style={logoStyle({ bloomProgress })}
          />
        </LogoWrap>
      );
    case "elevenlabs":
      return (
        <LogoWrap innerScale={0.72}>
          <img
            src={sponsorPublicAsset("elevenlabs-dark.svg")}
            alt="ElevenLabs"
            draggable={false}
            style={logoStyle({ bloomProgress })}
          />
        </LogoWrap>
      );
    case "simov":
      return (
        <LogoWrap innerScale={0.7}>
          <img
            src={sponsorPublicAsset("simov-dark.svg")}
            alt="Simov"
            draggable={false}
            style={logoStyle({ bloomProgress })}
          />
        </LogoWrap>
      );
    case "abaco":
      return (
        <LogoWrap innerScale={format === "story" ? 1.1 : 0.85}>
          <img
            src={sponsorPublicAsset("abaco-dark.svg")}
            alt="Abaco"
            draggable={false}
            style={logoStyle({ bloomProgress })}
          />
        </LogoWrap>
      );
    case "021":
      return (
        <LogoWrap innerScale={format === "story" ? 0.38 : 0.4}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: `brightness(${1 + 0.08 * bloomProgress})`,
              opacity: 0.85 + 0.15 * bloomProgress,
            }}
          >
            <ExportZeroTwoOneLogo
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                height: "auto",
                width: "auto",
              }}
            />
          </div>
        </LogoWrap>
      );
    case "yonjob":
      return (
        <LogoWrap innerScale={format === "story" ? 0.6 : 0.4}>
          <img
            src={sponsorPublicAsset("yonjob-dark.svg")}
            alt="Yonjob"
            draggable={false}
            style={logoStyle({ bloomProgress })}
          />
        </LogoWrap>
      );
    case "nubiwork":
      return (
        <LogoWrap innerScale={format === "story" ? 0.4 : 0.5}>
          <img
            src={sponsorPublicAsset("nubiwork-dark.svg")}
            alt="Nubiwork"
            draggable={false}
            style={logoStyle({ bloomProgress })}
          />
        </LogoWrap>
      );
    case "kreali":
      return (
        <LogoWrap innerScale={0.6}>
          <img
            src={sponsorPublicAsset("kreali-dark.svg")}
            alt="Kreali"
            draggable={false}
            style={logoStyle({ bloomProgress })}
          />
        </LogoWrap>
      );
    case "weris":
      return (
        <LogoWrap innerScale={0.6}>
          <img
            src={sponsorPublicAsset("weris_dark.svg")}
            alt="Weris"
            draggable={false}
            style={logoStyle({ bloomProgress })}
          />
        </LogoWrap>
      );
    case "boxful":
      return (
        <LogoWrap innerScale={0.6}>
          <img
            src={sponsorPublicAsset("boxful-dark.svg")}
            alt="Boxful"
            draggable={false}
            style={logoStyle({ bloomProgress })}
          />
        </LogoWrap>
      );
    case "gamesquad":
      return (
        <LogoWrap innerScale={0.6}>
          <img
            src={sponsorPublicAsset("gamesquad-dark.svg")}
            alt="GameSquad"
            draggable={false}
            style={logoStyle({ bloomProgress })}
          />
        </LogoWrap>
      );
    case "searchyou":
      return (
        <LogoWrap innerScale={0.6}>
          <img
            src={sponsorPublicAsset("searchyou-dark.svg")}
            alt="SearchYou"
            draggable={false}
            style={logoStyle({ bloomProgress })}
          />
        </LogoWrap>
      );
    case "dma":
      return (
        <LogoWrap innerScale={0.52}>
          <img
            src={sponsorPublicAsset("dma-dark.svg")}
            alt="DMA"
            draggable={false}
            style={logoStyle({ bloomProgress })}
          />
        </LogoWrap>
      );
    case "drop":
      return (
        <LogoWrap innerScale={0.6}>
          <img
            src={sponsorPublicAsset("drop-dark.svg")}
            alt="Drop"
            draggable={false}
            style={logoStyle({ bloomProgress })}
          />
        </LogoWrap>
      );
  }

  // Defensive fallback (should be unreachable thanks to the exhaustive switch).
  void keepMono;
  return null;
}

export function SponsorSpotLogo({ sponsorKey, format }: Props) {
  const reveal = useSponsorSpotReveal();
  const compositeScale = reveal.entryScale;

  return (
    <>
      {/* Primary tight glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${EXPORT_CHALK_GLOW_PRIMARY} 0%, transparent 65%)`,
          opacity: reveal.glowOpacity,
          pointerEvents: "none",
          willChange: "opacity",
        }}
      />
      {/* Secondary massive soft glow (bleeds out of the terminal) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-100%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${EXPORT_CHALK_GLOW_SECONDARY} 0%, transparent 70%)`,
          opacity: reveal.glowOpacity * 0.6,
          pointerEvents: "none",
          willChange: "opacity",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translate3d(0, ${reveal.entryY}px, 0) scale(${compositeScale})`,
          transformOrigin: "center center",
          opacity: reveal.entryOpacity,
          willChange: "transform, opacity",
        }}
      >
        {renderSponsorMark(sponsorKey, format, reveal.bloomProgress)}
      </div>
    </>
  );
}
