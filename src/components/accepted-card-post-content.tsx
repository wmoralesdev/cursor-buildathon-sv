import { memo } from "react";

import { acceptedCardRoleLabel } from "../lib/accepted-card-role-label";
import { formatHandle } from "../lib/format-handle";
import {
  ACCEPTED_LABEL_CLASS,
  CursorLogo,
  EventHeader,
  EventInfoBlock,
  PhotoFrame,
  type AcceptedCardProps,
} from "./accepted-card-shared";

export const AcceptedCardPostContent = memo(function AcceptedCardPostContent({
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
        <CursorLogo className="h-[clamp(0.9375rem,4.15cqmin,5.85cqmin)] w-auto shrink-0 opacity-80" />
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
