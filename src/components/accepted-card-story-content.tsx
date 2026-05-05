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

export const AcceptedCardStoryContent = memo(function AcceptedCardStoryContent({
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
        <CursorLogo className="h-[clamp(1.125rem,6.05cqmin,9cqmin)] w-auto shrink-0 opacity-80" />
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
