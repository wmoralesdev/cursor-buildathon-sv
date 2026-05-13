import { memo, type CSSProperties } from "react";
import { staticFile } from "remotion";

import type { AspectFormat } from "../pages/buildathon-welcome-types";
import { ACCEPTED_LABEL_CLASS, EventInfoBlock } from "./accepted-card-shared";
import { ExportCursorLogo } from "./export-logo-marks";
import type { SponsorSpotKey } from "./sponsor-spot-logo";
import { SponsorSpotChatWindow } from "./sponsor-spot-chat-window";

export type SponsorSpotExportContentProps = {
  sponsorKey: SponsorSpotKey;
  format: AspectFormat;
  eventName?: string;
};

const ACCENT_DIVIDER: CSSProperties = {
  height: 1,
  background: "rgba(255, 75, 0, 0.32)",
  width: "100%",
};

export const SponsorSpotExportContent = memo(function SponsorSpotExportContent(
  props: SponsorSpotExportContentProps,
) {
  return props.format === "post" ? (
    <SponsorSpotExportPostContent {...props} />
  ) : (
    <SponsorSpotExportStoryContent {...props} />
  );
});

function SponsorSpotCornerHeader({
  compact,
  eventName,
}: {
  compact?: boolean;
  eventName: string;
}) {
  const titleClamp = compact
    ? "text-[clamp(0.625rem,2.15cqmin,3.05cqmin)]"
    : "text-[clamp(0.6875rem,2.42cqmin,3.45cqmin)]";
  const sponsorEyebrowClamp = compact
    ? "text-[clamp(0.4875rem,1.62cqmin,2.35cqmin)]"
    : "text-[clamp(0.53rem,1.85cqmin,2.7cqmin)]";

  return (
    <div className="min-w-0 flex-1">
      <p
        className={`font-mono ${titleClamp} font-medium uppercase tracking-[0.18em] text-[#f5f0e8] leading-snug`}
      >
        Cursor {eventName}
      </p>
      <p className={`mt-0.5 ${ACCEPTED_LABEL_CLASS} ${sponsorEyebrowClamp}`}>
        Official sponsor
      </p>
    </div>
  );
}

const SponsorSpotExportPostContent = memo(function SponsorSpotExportPostContent({
  sponsorKey,
  format,
  eventName = "Buildathon",
}: SponsorSpotExportContentProps) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col px-[clamp(1.35rem,3.85cqmin,5.65cqmin)]">
      <div className="shrink-0 py-[clamp(1.35rem,3.85cqmin,5.65cqmin)]">
        <div className="flex items-center justify-between gap-3">
          <SponsorSpotCornerHeader compact eventName={eventName} />
          <ExportCursorLogo className="h-[clamp(0.9rem,4.1cqmin,5.75cqmin)] w-auto shrink-0 opacity-80" />
        </div>
      </div>
      <div style={ACCENT_DIVIDER} />

      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center relative">
        <SponsorSpotChatWindow sponsorKey={sponsorKey} format={format} />
      </div>

      <div style={ACCENT_DIVIDER} />
      <div className="shrink-0 py-[clamp(1.35rem,3.85cqmin,5.65cqmin)]">
        <EventInfoBlock
          compact
          poweredByLogoSrc={staticFile("sponsors/ailabs.svg")}
        />
      </div>
    </div>
  );
});

const SponsorSpotExportStoryContent = memo(function SponsorSpotExportStoryContent({
  sponsorKey,
  format,
  eventName = "Buildathon",
}: SponsorSpotExportContentProps) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col px-[clamp(1.25rem,4.75cqmin,6.75cqmin)]">
      <div className="shrink-0 py-[clamp(1.1rem,4.2cqmin,6cqmin)]">
        <div className="flex items-center justify-between gap-3">
          <SponsorSpotCornerHeader eventName={eventName} />
          <ExportCursorLogo className="h-[clamp(1.05rem,5.8cqmin,8.5cqmin)] w-auto shrink-0 opacity-80" />
        </div>
      </div>
      <div style={ACCENT_DIVIDER} />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center relative">
        <SponsorSpotChatWindow sponsorKey={sponsorKey} format={format} />
      </div>

      <div style={ACCENT_DIVIDER} />
      <div className="shrink-0 py-[clamp(1.1rem,4.2cqmin,6cqmin)]">
        <EventInfoBlock poweredByLogoSrc={staticFile("sponsors/ailabs.svg")} />
      </div>
    </div>
  );
});