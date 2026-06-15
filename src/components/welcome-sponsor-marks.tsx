import { memo, type CSSProperties, type ReactNode } from "react";
import { staticFile } from "remotion";

/** Remotion and Studio need `staticFile()` for `public/` assets; paths are relative to the project root. */
const SPONSOR_SRC = {
  n8n: staticFile("sponsors/n8n-logo-dark.svg"),
  codex: staticFile("sponsors/codex-logo.svg"),
  yonjob: staticFile("sponsors/yonjob-dark.svg"),
  nubiwork: staticFile("sponsors/nubiwork-dark.svg"),
  zavu: staticFile("sponsors/zavu-dark.svg"),
  abaco: staticFile("sponsors/abaco-dark.svg"),
  from021: staticFile("sponsors/from021.svg"),
  elevenlabs: staticFile("sponsors/elevenlabs-dark.svg"),
  simov: staticFile("sponsors/simov-dark.svg"),
  kreali: staticFile("sponsors/kreali-dark.svg"),
  weris: staticFile("sponsors/weris_dark.svg"),
  boxful: staticFile("sponsors/boxful-dark.svg"),
  gamesquad: staticFile("sponsors/gamesquad-dark.svg"),
  drop: staticFile("sponsors/drop-dark.svg"),
  searchyou: staticFile("sponsors/searchyou-dark.svg"),
  dma: staticFile("sponsors/dma-dark.svg"),
  netlify: staticFile("sponsors/netlify-dark.svg"),
  wispr: staticFile("sponsors/wispr-dark.svg"),
  fal: staticFile("sponsors/fal-dark.svg"),
  exa: staticFile("sponsors/exa-dark.svg"),
} as const;

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
  "boxful",
  "gamesquad",
  "searchyou",
  "dma",
  "netlify",
  "wispr",
  "fal",
  "exa",
  "drop",
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
        src={SPONSOR_SRC.n8n}
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
        src={SPONSOR_SRC.codex}
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
        src={SPONSOR_SRC.yonjob}
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
        src={SPONSOR_SRC.nubiwork}
        alt="Nub;Work"
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
        src={SPONSOR_SRC.zavu}
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
        src={SPONSOR_SRC.abaco}
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
        src={SPONSOR_SRC.from021}
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
        src={SPONSOR_SRC.elevenlabs}
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
        src={SPONSOR_SRC.simov}
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
        src={SPONSOR_SRC.kreali}
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
        src={SPONSOR_SRC.weris}
        alt="Weris"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkBoxful(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.85}>
      <img
        src={SPONSOR_SRC.boxful}
        alt="Boxful"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkGamesquad(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={1.65}>
      <img
        src={SPONSOR_SRC.gamesquad}
        alt="GameSquad"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkDrop(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.85}>
      <img
        src={SPONSOR_SRC.drop}
        alt="Drop"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkSearchyou(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.85}>
      <img
        src={SPONSOR_SRC.searchyou}
        alt="SearchYou"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkDma(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.72}>
      <img
        src={SPONSOR_SRC.dma}
        alt="DMA"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkNetlify(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.85}>
      <img
        src={SPONSOR_SRC.netlify}
        alt="Netlify"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkWispr(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.85}>
      <img
        src={SPONSOR_SRC.wispr}
        alt="Wispr"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkFal(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.72}>
      <img
        src={SPONSOR_SRC.fal}
        alt="Fal"
        draggable={false}
        style={slateLogoImgStyle()}
      />
    </SponsorMarkSlot>
  );
}

export function SponsorMarkExa(props: SponsorMarkProps) {
  return (
    <SponsorMarkSlot {...props} innerScale={0.85}>
      <img
        src={SPONSOR_SRC.exa}
        alt="Exa"
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
