import { memo } from "react";

import { acceptedCardRoleLabel } from "../lib/accepted-card-role-label";
import { formatHandle } from "../lib/format-handle";
import type { AcceptedCardProps } from "./accepted-card-shared";
import {
  ACCEPTED_LABEL_CLASS,
  EventHeader,
  EventInfoBlock,
  PhotoFrame,
} from "./accepted-card-shared";
import { ExportCursorLogo } from "./export-logo-marks";

export const WelcomeCardExportContent = memo(function WelcomeCardExportContent(
  props: AcceptedCardProps,
) {
  return props.format === "post" ? (
    <WelcomeCardExportPostContent {...props} />
  ) : (
    <WelcomeCardExportStoryContent {...props} />
  );
});

const WelcomeCardExportPostContent = memo(function WelcomeCardExportPostContent({
  handle,
  imageUrl,
  eventName = "Buildathon",
  eventLocation = "San Salvador",
  isLeadOrganizer,
}: AcceptedCardProps) {
  const handleForLine = formatHandle(handle);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col p-[clamp(1.35rem,3.85cqmin,5.65cqmin)]">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <EventHeader eventName={eventName} eventLocation={eventLocation} compact />
        <ExportCursorLogo className="h-[clamp(0.9375rem,4.15cqmin,5.85cqmin)] w-auto shrink-0 opacity-80" />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-[clamp(0.75rem,2.8cqmin,3.85cqmin)] py-[clamp(0.5rem,1.9cqmin,2.85cqmin)]">
        <span
          className={`${ACCEPTED_LABEL_CLASS} text-center text-[clamp(0.8125rem,2.72cqmin,3.85cqmin)]`}
        >
          {acceptedCardRoleLabel(isLeadOrganizer)}
        </span>
        <PhotoFrame
          imageUrl={imageUrl}
          compactEmptyLabel
          organizerAccentGlow={isLeadOrganizer}
          className="aspect-square shrink-0 size-[clamp(15.5rem,min(42cqmin,50cqw),min(52cqmin,58cqw))]"
        />
        <span
          className={`${ACCEPTED_LABEL_CLASS} max-w-[min(92cqw,28rem)] truncate text-center tracking-[0.06em] text-[clamp(0.8125rem,2.72cqmin,3.85cqmin)]`}
        >
          {handleForLine}
        </span>
      </div>

      <div className="shrink-0 pt-0">
        <EventInfoBlock compact />
      </div>
    </div>
  );
});

const WelcomeCardExportStoryContent = memo(function WelcomeCardExportStoryContent({
  handle,
  imageUrl,
  eventName = "Buildathon",
  eventLocation = "San Salvador",
  isLeadOrganizer,
}: AcceptedCardProps) {
  const handleForLine = formatHandle(handle);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col px-[clamp(1.25rem,4.75cqmin,6.75cqmin)] pt-[clamp(1.1rem,4.2cqmin,6cqmin)] pb-[clamp(0.9rem,3.6cqmin,5cqmin)]">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <EventHeader eventName={eventName} eventLocation={eventLocation} />
        <ExportCursorLogo className="h-[clamp(1.125rem,6.05cqmin,9cqmin)] w-auto shrink-0 opacity-80" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[clamp(0.85rem,3cqmin,4.25cqmin)] py-[clamp(0.65rem,2.1cqmin,3cqmin)]">
        <span
          className={`${ACCEPTED_LABEL_CLASS} text-center text-[clamp(0.875rem,3.45cqmin,5cqmin)]`}
        >
          {acceptedCardRoleLabel(isLeadOrganizer)}
        </span>
        <PhotoFrame
          imageUrl={imageUrl}
          organizerAccentGlow={isLeadOrganizer}
          className="aspect-square shrink-0 size-[clamp(18rem,min(68cqmin,86cqw),min(82cqmin,88cqw))]"
        />
        <span
          className={`${ACCEPTED_LABEL_CLASS} max-w-[84%] truncate text-center tracking-[0.06em] text-[clamp(0.875rem,3.55cqmin,5.1cqmin)]`}
        >
          {handleForLine}
        </span>
      </div>

      <div className="shrink-0 pt-0">
        <EventInfoBlock />
      </div>
    </div>
  );
});
