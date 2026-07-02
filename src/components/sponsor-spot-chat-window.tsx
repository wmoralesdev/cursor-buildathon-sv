import { memo, type CSSProperties } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

import { SPONSOR_SPOT_TIMELINE } from "./welcome-card-canvas-spec";
import { SponsorSpotLogo, type SponsorSpotKey } from "./sponsor-spot-logo";
import type { AspectFormat } from "../pages/buildathon-welcome-types";

const SPONSOR_DISPLAY_NAME: Record<SponsorSpotKey, string> = {
  codex: "Codex",
  n8n: "n8n",
  zavu: "Zavu",
  elevenlabs: "ElevenLabs",
  simov: "Simov",
  abaco: "Abaco",
  "021": "Zero Two One",
  yonjob: "Yonjob",
  nubiwork: "Nub;Work",
  kreali: "Kreali",
  weris: "weris",
  boxful: "boxful",
  gamesquad: "gamesquad",
  searchyou: "searchyou",
  dma: "dma",
  netlify: "netlify",
  wispr: "wispr",
  fal: "fal",
  exa: "exa",
  svnet: "svnet",
  firecrawl: "firecrawl",
  datamcp: "datamcp",
  rcns: "rcns",
  cognition: "cognition",
  drop: "drop",
};

type Props = {
  sponsorKey: SponsorSpotKey;
  format: AspectFormat;
};

export const SponsorSpotChatWindow = memo(function SponsorSpotChatWindow({
  sponsorKey,
  format,
}: Props) {
  const frame = useCurrentFrame();

  const typeProgress = interpolate(
    frame,
    [
      SPONSOR_SPOT_TIMELINE.typeCommand.startFrame,
      SPONSOR_SPOT_TIMELINE.typeCommand.endFrame,
    ],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const logsFadeIn = interpolate(
    frame,
    [
      SPONSOR_SPOT_TIMELINE.terminalLogs.startFrame,
      SPONSOR_SPOT_TIMELINE.terminalLogs.endFrame,
    ],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const artifactFadeIn = interpolate(
    frame,
    [
      SPONSOR_SPOT_TIMELINE.heroBurst.startFrame,
      SPONSOR_SPOT_TIMELINE.heroBurst.endFrame,
    ],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
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
    }
  );

  const contentOpacity = 1 - exitProgress;

  const sponsorName = SPONSOR_DISPLAY_NAME[sponsorKey];
  const fullText = `buildathon sponsors add "${sponsorName}"`;
  const charsToShow = Math.round(typeProgress * fullText.length);
  const displayedText = fullText.slice(0, charsToShow);

  const windowWidth = format === "post" ? "clamp(20rem, 80cqw, 85cqw)" : "clamp(18rem, 85cqw, 92cqw)";
  const padding = format === "post" ? "clamp(1rem, 3cqmin, 4cqmin)" : "clamp(1.25rem, 4cqmin, 5cqmin)";
  const fontSize = format === "post" ? "clamp(0.8rem, 2.2cqmin, 2.8cqmin)" : "clamp(0.85rem, 2.8cqmin, 3.5cqmin)";
  const logoSize = format === "post" ? "clamp(12rem, 35cqmin, 40cqmin)" : "clamp(14rem, 45cqmin, 55cqmin)";

  const containerStyle: CSSProperties = {
    position: "relative",
    width: windowWidth,
    maxHeight: "100%",
    background: "rgba(10, 10, 10, 0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid #333",
    borderRadius: "clamp(0.5rem, 1.5cqmin, 2cqmin)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    overflow: "visible", // Let the glow bleed out
  };

  const headerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    height: "clamp(2rem, 5cqmin, 6cqmin)",
    borderBottom: "1px solid #333",
    background: "#111",
    borderTopLeftRadius: "inherit",
    borderTopRightRadius: "inherit",
    padding: `0 ${padding}`,
    gap: "clamp(0.5rem, 1.5cqmin, 2cqmin)",
  };

  const dotStyle: CSSProperties = {
    width: "clamp(0.5rem, 1.5cqmin, 2cqmin)",
    height: "clamp(0.5rem, 1.5cqmin, 2cqmin)",
    borderRadius: "50%",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", gap: "clamp(0.35rem, 1cqmin, 1.5cqmin)" }}>
          <div style={{ ...dotStyle, backgroundColor: "#ff5f56" }} />
          <div style={{ ...dotStyle, backgroundColor: "#ffbd2e" }} />
          <div style={{ ...dotStyle, backgroundColor: "#27c93f" }} />
        </div>
        <div style={{ 
          flex: 1, 
          textAlign: "center", 
          color: "#666", 
          fontSize: "clamp(0.6rem, 1.8cqmin, 2.2cqmin)", 
          fontFamily: "monospace" 
        }}>
          cursor-buildathon — zsh
        </div>
      </div>
      
      <div style={{ 
        padding, 
        fontFamily: "monospace", 
        fontSize, 
        color: "#eee", 
        display: "flex", 
        flexDirection: "column", 
        gap: "clamp(0.5rem, 1.5cqmin, 2cqmin)" 
      }}>
        {/* User Prompt */}
        <div>
          <span style={{ color: "#27c93f" }}>➜</span> <span style={{ color: "#44bcd8" }}>~</span>{" "}
          <span style={{ opacity: contentOpacity }}>
            {displayedText}
            <span style={{ 
              display: "inline-block", 
              width: "0.6em", 
              height: "1.2em", 
              background: "#fff", 
              verticalAlign: "middle",
              marginLeft: "4px",
              opacity: frame % 30 < 15 ? 1 : 0
            }} />
          </span>
        </div>

        {/* Terminal Logs */}
        {logsFadeIn > 0 && (
          <div style={{ 
            opacity: logsFadeIn * contentOpacity, 
            color: "#888", 
            display: "flex", 
            flexDirection: "column", 
            gap: "clamp(0.25rem, 0.75cqmin, 1cqmin)" 
          }}>
            <div>[+] Resolving partner assets...</div>
            {logsFadeIn > 0.5 && <div>[+] Compiling component...</div>}
            {logsFadeIn > 0.8 && <div>[+] Render:</div>}
          </div>
        )}

        {/* Artifact Block */}
        {artifactFadeIn > 0 && (
          <div style={{
            marginTop: "clamp(0.5rem, 1.5cqmin, 2cqmin)",
            opacity: artifactFadeIn * contentOpacity,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}>
            <div style={{ 
              width: logoSize, 
              height: logoSize, 
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <SponsorSpotLogo sponsorKey={sponsorKey} format={format} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});