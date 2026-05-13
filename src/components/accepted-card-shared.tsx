import type { AspectFormat } from "../pages/buildathon-welcome-types";

export type AcceptedCardProps = {
  handle: string;
  imageUrl: string | null;
  format: AspectFormat;
  eventName?: string;
  eventLocation?: string;
  isLeadOrganizer?: boolean;
};

export const CURSOR_DARK_LOGO = "/sponsors/cursor-dark.svg";

export const ACCEPTED_LABEL_CLASS =
  "font-mono font-medium uppercase leading-tight tracking-[0.04em] text-[#ff4b00]";

export function PhotoFrame({
  imageUrl,
  className,
  compactEmptyLabel,
  organizerAccentGlow,
}: {
  imageUrl: string | null;
  className?: string;
  compactEmptyLabel?: boolean;
  organizerAccentGlow?: boolean;
}) {
  const emptyLabelClass = compactEmptyLabel
    ? "font-mono text-[clamp(0.75rem,2.85cqmin,4.05cqmin)] uppercase tracking-[0.18em] text-[#555]"
    : "font-mono text-[clamp(0.875rem,3.25cqmin,4.75cqmin)] uppercase tracking-[0.18em] text-[#555]";

  const defaultFrameShadow =
    "inset 0 0 0 1px rgba(255, 75, 0, 0.25), 0 8px 40px -12px rgba(0, 0, 0, 0.6)";

  return (
    <div
      className={`relative shrink-0 overflow-hidden ${organizerAccentGlow ? "photo-frame-organizer-glow" : ""} ${className ?? ""}`}
      style={organizerAccentGlow ? undefined : { boxShadow: defaultFrameShadow }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#111]">
          <p className={emptyLabelClass}>Your photo</p>
        </div>
      )}
    </div>
  );
}

export function CursorLogo({ className }: { className?: string }) {
  return (
    <img src={CURSOR_DARK_LOGO} alt="Cursor" className={className} draggable={false} />
  );
}

export function EventHeader({
  eventName,
  eventLocation,
  compact,
}: {
  eventName: string;
  eventLocation: string;
  compact?: boolean;
}) {
  const titleClamp = compact
    ? "text-[clamp(0.625rem,2.15cqmin,3.05cqmin)]"
    : "text-[clamp(0.6875rem,2.42cqmin,3.45cqmin)]";
  const subtitleClamp = compact
    ? "text-[clamp(0.5625rem,1.9cqmin,2.75cqmin)]"
    : "text-[clamp(0.625rem,2.18cqmin,3.15cqmin)]";

  return (
    <div className="min-w-0 flex-1">
      <p
        className={`font-mono ${titleClamp} font-medium uppercase tracking-[0.18em] text-[#f5f0e8] leading-snug`}
      >
        Cursor {eventName}
      </p>
      <p className={`mt-0.5 font-mono ${subtitleClamp} uppercase tracking-[0.22em] text-[#888]`}>
        {eventLocation}
      </p>
    </div>
  );
}

export function EventInfoBlock(
  {
    compact,
    poweredByLogoSrc = "/sponsors/ailabs.svg",
    poweredByLogoClassName = "h-[1.32em]",
  }: {
    compact?: boolean;
    /** Use `staticFile("sponsors/ailabs.svg")` in Remotion compositions. */
    poweredByLogoSrc?: string;
    /** Tailwind height/size classes for the powered-by mark (default sized for welcome card). */
    poweredByLogoClassName?: string;
  } = {},
) {
  const textClamp = compact
    ? "text-[clamp(0.6875rem,2.38cqmin,3.45cqmin)]"
    : "text-[clamp(0.75rem,2.65cqmin,3.85cqmin)]";
  const rowClass = `flex flex-wrap items-center justify-center gap-x-[clamp(0.35rem,1.35cqmin,1.85cqmin)] gap-y-1 text-center font-mono ${textClamp} leading-relaxed tracking-[0.12em] text-[#666] uppercase`;

  return (
    <div className={rowClass}>
      <span>Jul 4th · UFG</span>
      <span className="select-none opacity-45" aria-hidden>
        ·
      </span>
      <span className="inline-flex items-center gap-x-[clamp(0.3rem,1.15cqmin,1.55cqmin)]">
        <span>Powered by</span>
        <img
          src={poweredByLogoSrc}
          alt="AI Labs"
          draggable={false}
          className={`-translate-y-[0.19em] w-auto shrink-0 object-contain self-center ${poweredByLogoClassName}`}
          style={{
            filter: "brightness(0) invert(1)",
            opacity: 0.72,
          }}
        />
      </span>
    </div>
  );
}
