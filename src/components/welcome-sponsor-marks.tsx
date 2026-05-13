import { memo, type CSSProperties, type ReactNode } from "react";

export type SponsorMarkProps = {
  index: number;
  total: number;
  slotWidth: string;
  slotHeight: string;
};

export const WELCOME_CARD_SPONSOR_MARK_KEYS = [
  "codex",
  "n8n",
  "zavu",
  "elevenlabs",
  "simov",
  "abaco",
  "021",
  "yonjob",
  "nubiwork",
  "kreali",
  "weris",
] as const;

function slateLogoImgStyle(invert?: boolean, logoOpacity = 0.85): CSSProperties {
  return {
    maxHeight: "100%",
    maxWidth: "100%",
    height: "auto",
    width: "auto",
    objectFit: "contain",
    filter: invert
      ? "brightness(0) invert(1) grayscale(1)"
      : "grayscale(1)",
    opacity: logoOpacity,
  };
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

export function SponsorMarkN8n(props: SponsorMarkProps) {
  const imgStyle = slateLogoImgStyle(true, 1);
  return (
    <SponsorMarkSlot {...props} innerScale={1.65}>
      <img
        src="/sponsors/n8n-logo-dark.svg"
        alt="n8n"
        draggable={false}
        style={{
          ...imgStyle,
          filter: "brightness(0) invert(1)",
        }}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkCodex(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={1.08}>
      <img
        src="/sponsors/codex-logo.svg"
        alt="Codex"
        draggable={false}
        style={slateLogoImgStyle(true)}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkYonjob(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.97}>
      <img
        src="/sponsors/yonjob-dark.svg"
        alt="Yonjob"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkNubiwork(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={1.16}>
      <img
        src="/sponsors/nubiwork-dark.svg"
        alt="Nubiwork"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkZavu(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.86}>
      <img
        src="/sponsors/zavu-dark.svg"
        alt="Zavu"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkAbaco(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.72}>
      <img
        src="/sponsors/abaco-dark.svg"
        alt="Abaco"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkZeroTwoOne(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.72}>
      <img
        src="/sponsors/from021.svg"
        alt="Zero Two One"
        draggable={false}
        style={slateLogoImgStyle(true)}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkElevenLabs(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.92}>
      <img
        src="/sponsors/elevenlabs-dark.svg"
        alt="ElevenLabs"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkSimov(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.88}>
      <img
        src="/sponsors/simov-dark.svg"
        alt="Simov"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkKreali(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.85}>
      <img
        src="/sponsors/kreali-dark.svg"
        alt="Kreali"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkWeris(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.85}>
      <img
        src="/sponsors/weris_dark.svg"
        alt="Weris"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export const WELCOME_CARD_SPONSOR_MARK_COMPONENTS = [
  SponsorMarkCodex,
  SponsorMarkN8n,
  SponsorMarkZavu,
  SponsorMarkElevenLabs,
  SponsorMarkSimov,
  SponsorMarkAbaco,
  SponsorMarkZeroTwoOne,
  SponsorMarkYonjob,
  SponsorMarkNubiwork,
  SponsorMarkKreali,
  SponsorMarkWeris,
] as const;
