import type { AspectFormat } from "../pages/buildathon-welcome-types";

export type AcceptedCardProps = {
  handle: string;
  imageUrl: string | null;
  format: AspectFormat;
  eventName?: string;
  eventLocation?: string;
};

export const CURSOR_DARK_LOGO = "/sponsors/cursor-dark.svg";

export type SponsorAsset = {
  src: string;
  alt: string;
  invert?: boolean;
  heightClass: string;
  maxWidthClass?: string;
};

export const SPONSOR_LOGOS: SponsorAsset[] = [
  { src: "/sponsors/n8n-logo-dark.svg", alt: "n8n", heightClass: "h-3.5", maxWidthClass: "max-w-[4.5rem]" },
  { src: "/sponsors/codex-logo.svg", alt: "Codex", invert: true, heightClass: "h-5", maxWidthClass: "max-w-[5.5rem]" },
  { src: "/sponsors/yonjob-dark.svg", alt: "Yonjob", heightClass: "h-4.5", maxWidthClass: "max-w-[6rem]" },
  { src: "/sponsors/nubiwork-dark.svg", alt: "Nubiwork", heightClass: "h-4.5", maxWidthClass: "max-w-[6rem]" },
  { src: "/sponsors/zavu-dark.svg", alt: "Zavu", heightClass: "h-2.5", maxWidthClass: "max-w-[3rem]" },
  { src: "/sponsors/from021.svg", alt: "021", invert: true, heightClass: "h-2.5", maxWidthClass: "max-w-[2.5rem]" },
  { src: "/sponsors/ailabs.svg", alt: "AI Labs", invert: true, heightClass: "h-2.5", maxWidthClass: "max-w-[3rem]" },
];

export const ACCEPTED_LABEL_CLASS =
  "font-mono text-[0.6rem] font-medium uppercase leading-tight tracking-[0.04em] text-[#ff4b00]";

export function PhotoFrame({
  imageUrl,
  className,
}: {
  imageUrl: string | null;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden ${className ?? ""}`}
      style={{
        boxShadow:
          "inset 0 0 0 1px rgba(255, 75, 0, 0.25), 0 8px 40px -12px rgba(0, 0, 0, 0.6)",
      }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#111]">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[#555]">
            Your photo
          </p>
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
}: {
  eventName: string;
  eventLocation: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="font-mono text-[0.6rem] font-medium uppercase tracking-[0.18em] text-[#f5f0e8] leading-snug">
        Cursor {eventName}
      </p>
      <p className="mt-0.5 font-mono text-[0.55rem] uppercase tracking-[0.22em] text-[#888]">
        {eventLocation}
      </p>
    </div>
  );
}

export function EventInfoBlock() {
  return (
    <p className="text-center font-mono text-[0.55rem] leading-relaxed tracking-[0.12em] text-[#666] uppercase">
      Jul 4th · UFG
    </p>
  );
}

export function SponsorLogo({ asset }: { asset: SponsorAsset }) {
  const { src, alt, invert, heightClass, maxWidthClass } = asset;
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={`${heightClass} w-auto shrink-0 object-contain ${maxWidthClass ?? "max-w-[4.5rem]"}`}
      style={
        invert
          ? { filter: "brightness(0) invert(1) grayscale(1)", opacity: 0.55 }
          : { filter: "grayscale(1)", opacity: 0.55 }
      }
    />
  );
}

export function formatHandle(handle: string): string {
  const trimmed = handle.trim();
  if (!trimmed) return "@yourhandle";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}
