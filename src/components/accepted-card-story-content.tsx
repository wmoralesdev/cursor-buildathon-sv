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

export function AcceptedCardStoryContent({
  handle,
  imageUrl,
  eventName = "Buildathon",
  eventLocation = "San Salvador",
}: AcceptedCardProps) {
  const handleForLine = formatHandle(handle);

  const firstRowCount = Math.ceil(SPONSOR_LOGOS.length / 2);
  const firstRow = SPONSOR_LOGOS.slice(0, firstRowCount);
  const secondRow = SPONSOR_LOGOS.slice(firstRowCount);

  return (
    <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col p-6 sm:p-7">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <EventHeader eventName={eventName} eventLocation={eventLocation} />
        <CursorLogo className="h-5 w-auto shrink-0 opacity-80" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 py-6">
        <span className={`${ACCEPTED_LABEL_CLASS} text-center`}>Accepted builder</span>
        <PhotoFrame
          imageUrl={imageUrl}
          className="h-56 w-56 shrink-0 sm:h-64 sm:w-64"
        />
        <span
          className={`${ACCEPTED_LABEL_CLASS} max-w-[80%] truncate text-center text-[0.7rem] tracking-[0.06em]`}
        >
          {handleForLine}
        </span>
      </div>

      <div className="shrink-0 space-y-5 pt-2">
        <EventInfoBlock />
        <div className="space-y-3">
          <div className="flex flex-nowrap items-center justify-center gap-x-4">
            {firstRow.map((asset) => (
              <SponsorLogo key={asset.src} asset={asset} />
            ))}
          </div>
          <div className="flex flex-nowrap items-center justify-center gap-x-4">
            {secondRow.map((asset) => (
              <SponsorLogo key={asset.src} asset={asset} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
