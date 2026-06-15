import { forwardRef, memo, type CSSProperties, type ReactNode } from "react";
import { staticFile } from "remotion";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import {
  ACCEPTED_LABEL_CLASS,
  EventInfoBlock,
} from "./accepted-card-shared";
import { EXPORT_CHALK_RULE } from "./export-chalk-accent";
import { ExportCursorLogo, ExportZeroTwoOneLogo } from "./export-logo-marks";
import {
  SponsorMarkAbaco,
  SponsorMarkCodex,
  SponsorMarkElevenLabs,
  SponsorMarkBoxful,
  SponsorMarkGamesquad,
  SponsorMarkSearchyou,
  SponsorMarkDma,
  SponsorMarkNetlify,
  SponsorMarkWispr,
  SponsorMarkFal,
  SponsorMarkExa,
  SponsorMarkDrop,
  SponsorMarkKreali,
  SponsorMarkWeris,
  SponsorMarkN8n,
  SponsorMarkNubiwork,
  SponsorMarkSimov,
  SponsorMarkYonjob,
  SponsorMarkZavu,
  WELCOME_CARD_SPONSOR_MARK_KEYS,
} from "./welcome-sponsor-marks";
import type { SponsorMarkProps } from "./welcome-sponsor-marks";
import { buildWelcomePostSponsorRowIndices, buildWelcomeStorySponsorDisplayIndices } from "../lib/welcome-post-sponsor-wall";

type Props = {
  aspectFormat: AspectFormat;
  slateActive: boolean;
};

const FORMAT_LAYOUT: Record<
  AspectFormat,
  {
    slotWidth: string;
    slotHeight: string;
    cellGap: string;
    wallMaxWidth: string;
    titleClamp: string;
    padClass: string;
    centerStackGap: string;
    centerStackPy: string;
  }
> = {
  post: {
    slotWidth: "clamp(5rem,18cqmin,22cqmin)",
    slotHeight: "clamp(1.5rem,5.85cqmin,7.75cqmin)",
    cellGap: "clamp(0.75rem,3cqmin,4cqmin)",
    wallMaxWidth: "min(94cqw,88cqmin)",
    titleClamp: "text-[clamp(0.9375rem,3.35cqmin,4.65cqmin)]",
    padClass:
      "px-[clamp(1.35rem,3.85cqmin,5.65cqmin)] pt-[clamp(1.1rem,3.6cqmin,5.2cqmin)] pb-[clamp(1rem,3.35cqmin,4.65cqmin)]",
    centerStackGap: "gap-[clamp(0.85rem,3.2cqmin,4.5cqmin)]",
    centerStackPy: "py-[clamp(0.5rem,1.75cqmin,2.5cqmin)]",
  },
  story: {
    slotWidth: "clamp(7rem,31cqmin,42cqmin)",
    slotHeight: "clamp(2.35rem,8.25cqmin,11.5cqmin)",
    cellGap: "clamp(1.55rem,5.5cqmin,7.75cqmin)",
    wallMaxWidth: "min(97cqw,94cqmin)",
    titleClamp: "text-[clamp(1rem,3.75cqmin,5.2cqmin)]",
    padClass:
      "px-[clamp(1.25rem,4.75cqmin,6.75cqmin)] pt-[clamp(1.1rem,4.2cqmin,6cqmin)] pb-[clamp(0.9rem,3.6cqmin,5cqmin)]",
    centerStackGap: "gap-[clamp(1.35rem,4.75cqmin,6.75cqmin)]",
    centerStackPy: "py-[clamp(0.75rem,2.5cqmin,3.75cqmin)]",
  },
};

export const EXPORT_SPONSOR_MARK_COMPONENTS = [
  SponsorMarkCodex,
  SponsorMarkN8n,
  SponsorMarkZavu,
  SponsorMarkElevenLabs,
  SponsorMarkSimov,
  SponsorMarkAbaco,
  SponsorMarkZeroTwoOneExport,
  SponsorMarkYonjob,
  SponsorMarkNubiwork,
  SponsorMarkKreali,
  SponsorMarkWeris,
  SponsorMarkBoxful,
  SponsorMarkGamesquad,
  SponsorMarkSearchyou,
  SponsorMarkDma,
  SponsorMarkNetlify,
  SponsorMarkWispr,
  SponsorMarkFal,
  SponsorMarkExa,
  SponsorMarkDrop,
] as const;

export const WelcomeCardExportSponsorSlate = memo(
  forwardRef<HTMLDivElement, Props>(function WelcomeCardExportSponsorSlate(
    { aspectFormat, slateActive },
    ref,
  ) {
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
    };

    const postWallOuterStyle: CSSProperties = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: layout.cellGap,
      width: "100%",
      maxWidth: layout.wallMaxWidth,
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

    return (
      <div
        ref={ref}
        data-slate-active={slateActive ? "true" : "false"}
        className="relative isolate flex h-full min-h-0 w-full flex-1 flex-col"
      >
        <div
          className={`relative z-10 flex min-h-0 w-full flex-1 flex-col ${layout.padClass}`}
        >
          <div className="flex shrink-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p
                className={`font-mono ${
                  aspectFormat === "post"
                    ? "text-[clamp(0.625rem,2.15cqmin,3.05cqmin)]"
                    : "text-[clamp(0.6875rem,2.42cqmin,3.45cqmin)]"
                } font-medium uppercase tracking-[0.18em] text-[#f5f0e8] leading-snug`}
              >
                Cursor Buildathon
              </p>
              <p
                className={`mt-0.5 font-mono ${
                  aspectFormat === "post"
                    ? "text-[clamp(0.5625rem,1.9cqmin,2.75cqmin)]"
                    : "text-[clamp(0.625rem,2.18cqmin,3.15cqmin)]"
                } uppercase tracking-[0.22em] text-[#888]`}
              >
                San Salvador
              </p>
            </div>
            <ExportCursorLogo
              className={
                aspectFormat === "post"
                  ? "h-[clamp(0.9375rem,4.15cqmin,5.85cqmin)] w-auto shrink-0 opacity-80"
                  : "h-[clamp(1.125rem,6.05cqmin,9cqmin)] w-auto shrink-0 opacity-80"
              }
            />
          </div>

          <div
            className={`flex min-h-0 flex-1 flex-col items-center justify-center ${layout.centerStackGap} ${layout.centerStackPy}`}
          >
            <div className="flex flex-col items-center gap-[clamp(0.3rem,1.25cqmin,1.8cqmin)] text-center">
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
                  style={{ backgroundColor: EXPORT_CHALK_RULE }}
                />
                <span>{countLabel} partners</span>
                <span
                  className="h-px w-[clamp(1.25rem,6cqmin,8.5cqmin)]"
                  style={{ backgroundColor: EXPORT_CHALK_RULE }}
                />
              </div>
            </div>

            {aspectFormat === "post" ? (
              <div style={postWallOuterStyle}>
                {postRowIndices.map((indices, rowIdx) => (
                  <div key={rowIdx} style={postRowStyle}>
                    {indices.map((index) => {
                      const Mark = EXPORT_SPONSOR_MARK_COMPONENTS[index];
                      return (
                        <Mark
                          key={WELCOME_CARD_SPONSOR_MARK_KEYS[index]}
                          index={index}
                          total={sponsorTotal}
                          slotWidth={layout.slotWidth}
                          slotHeight={layout.slotHeight}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div style={storyWallStyle}>
                {storyDisplayIndices.map((sourceIndex, displayIndex) => {
                  const Mark = EXPORT_SPONSOR_MARK_COMPONENTS[sourceIndex];
                  return (
                    <Mark
                      key={WELCOME_CARD_SPONSOR_MARK_KEYS[sourceIndex]}
                      index={displayIndex}
                      total={sponsorTotal}
                      slotWidth={layout.slotWidth}
                      slotHeight={layout.slotHeight}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="shrink-0">
            <EventInfoBlock
              compact={aspectFormat === "post"}
              poweredByLogoSrc={staticFile("sponsors/ailabs.svg")}
            />
          </div>
        </div>
      </div>
    );
  }),
);

export function SponsorMarkZeroTwoOneExport(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.72}>
      <ExportZeroTwoOneLogo
        style={{
          maxHeight: "100%",
          maxWidth: "100%",
          height: "auto",
          width: "auto",
          opacity: 0.85,
        }}
      />
    </SponsorMarkSlot>
  );
}

const SponsorMarkSlot = memo(function SponsorMarkSlot({
  index,
  slotWidth,
  slotHeight,
  innerScale = 1,
  children,
}: SponsorMarkProps & { innerScale?: number; children: ReactNode }) {
  const innerWrapStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: innerScale !== 1 ? `scale(${innerScale})` : undefined,
    transformOrigin: "center center",
  };

  return (
    <div
      className="sponsor-slot flex items-center justify-center"
      style={
        {
          flex: `0 0 ${slotWidth}`,
          width: slotWidth,
          height: slotHeight,
          "--sponsor-slot-index": index,
        } as CSSProperties & Record<string, string | number>
      }
    >
      <div style={innerWrapStyle}>{children}</div>
    </div>
  );
});
