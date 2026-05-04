import {
  ACCEPTED_LABEL_CLASS,
  CursorLogo,
  EventHeader,
  EventInfoBlock,
  PhotoFrame,
  SPONSOR_LOGOS,
  SponsorLogo,
  formatHandle,
  type AcceptedCardProps,
} from "./accepted-card-shared";

export function AcceptedCardPostContent({
  handle,
  imageUrl,
  eventName = "Buildathon",
  eventLocation = "San Salvador",
}: AcceptedCardProps) {
  const handleForLine = formatHandle(handle);

  return (
    <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col p-5 sm:p-6">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <EventHeader eventName={eventName} eventLocation={eventLocation} />
        <CursorLogo className="h-5 w-auto shrink-0 opacity-80" />
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center py-2">
        <div className="flex w-full min-w-0 items-center justify-center gap-4 sm:gap-6">
          <span className={`${ACCEPTED_LABEL_CLASS} min-w-0 max-w-[28%] shrink truncate text-right`}>
            Accepted builder
          </span>
          <PhotoFrame
            imageUrl={imageUrl}
            className="h-40 w-40 shrink-0 sm:h-48 sm:w-48"
          />
          <span className={`${ACCEPTED_LABEL_CLASS} min-w-0 max-w-[28%] shrink truncate text-left`}>
            {handleForLine}
          </span>
        </div>
      </div>

      <div className="shrink-0 space-y-4 pt-2">
        <EventInfoBlock />
        <div className="flex flex-nowrap items-center justify-center gap-x-4 gap-y-2 pt-2">
          {SPONSOR_LOGOS.map((asset) => (
            <SponsorLogo key={asset.src} asset={asset} />
          ))}
        </div>
      </div>
    </div>
  );
}
