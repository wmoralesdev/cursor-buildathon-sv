import { memo } from "react";

type Props = {
  className?: string;
};

export const DarkGrainyPosterBackground = memo(function DarkGrainyPosterBackground({
  className = "",
}: Props) {
  return (
    <div
      data-poster-bg=""
      className={`absolute inset-0 overflow-hidden isolate pointer-events-none ${className}`}
      aria-hidden
    >
      <div className="poster-bg__base" />
      <div className="poster-bg__bloom" />
      <div className="poster-bg__glow" />
      <div className="poster-bg__shadow" />
      <div className="poster-bg__sweep" />
      <div className="poster-bg__vignette" />
      <div className="poster-bg__grain-a" />
      <div className="poster-bg__grain-b" />
    </div>
  );
});
