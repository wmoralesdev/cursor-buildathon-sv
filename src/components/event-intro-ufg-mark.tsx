import { memo, type CSSProperties } from "react";
import { staticFile } from "remotion";

type Props = {
  slotWidth: string;
  slotHeight: string;
  innerScale?: number;
};

export const EventIntroUfgMark = memo(function EventIntroUfgMark({
  slotWidth,
  slotHeight,
  innerScale = 1.14,
}: Props) {
  const imgStyle: CSSProperties = {
    maxHeight: "100%",
    maxWidth: "100%",
    height: "auto",
    width: "auto",
    objectFit: "contain",
    filter: "grayscale(1)",
    opacity: 0.85,
  };

  return (
    <div
      className="sponsor-slot flex items-center justify-center"
      style={{
        flex: `0 0 ${slotWidth}`,
        width: slotWidth,
        height: slotHeight,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${innerScale})`,
          transformOrigin: "center center",
        }}
      >
        <img
          src={staticFile("sponsors/ufg-dark.svg")}
          alt="UFG"
          draggable={false}
          style={imgStyle}
        />
      </div>
    </div>
  );
});
