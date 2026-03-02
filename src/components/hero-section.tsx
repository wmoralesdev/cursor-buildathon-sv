import { useTheme } from "next-themes";
import { CountdownTimer } from "./countdown-timer";
import { LUMA_URL } from "../constants";

export function HeroSection() {
  const { resolvedTheme } = useTheme();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden section-padding bg-bg"
    >
      {/* Grid lines background */}
      <div className="absolute inset-0 pointer-events-none bg-grid mask-radial-hero" />

      {/* Radial orange glow from top */}
      <div className="absolute pointer-events-none glow-top-center" />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-7xl mx-auto w-full pt-12 pb-24">
        {/* Event label */}
        <div className="mb-10 animate-delay-[0.1s]">
          <span className="tag">
            07 · 03 · 2026 &nbsp;·&nbsp; 10AM–5PM &nbsp;·&nbsp; UVG Z15
          </span>
        </div>

        {/* Giant headline with glitch */}
        <div className="relative mb-6 animate-[flicker_8s_ease-in-out_infinite]">
          <h1
            className="relative font-bold uppercase leading-[0.9] select-none font-display text-[clamp(3.5rem,12vw,10rem)] text-fg tracking-[-0.02em]"
          >
            {/* Glitch layers */}
            <span
              aria-hidden="true"
              className="absolute inset-0 text-accent font-display text-[clamp(3.5rem,12vw,10rem)] font-bold tracking-[-0.02em] leading-[0.9] select-none animate-[glitch-1_6s_ease-in-out_infinite]"
            >
              CURSOR<br />HACKATHON
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 text-[#00ffcc] font-display text-[clamp(3.5rem,12vw,10rem)] font-bold tracking-[-0.02em] leading-[0.9] select-none animate-[glitch-2_6s_ease-in-out_infinite]"
            >
              CURSOR<br />HACKATHON
            </span>
            CURSOR<br />HACKATHON
          </h1>
        </div>

        {/* Subtitle */}
        <p className="mb-14 font-mono text-[clamp(0.85rem,2vw,1.1rem)] text-fg-3 tracking-[0.15em] uppercase">
          Ciudad de Guatemala &nbsp;·&nbsp; 2026
        </p>

        {/* Countdown */}
        <div className="mb-14">
          <p className="font-mono text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-3">
            // tiempo restante
          </p>
          <CountdownTimer />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-center">
          <a
            href={LUMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-phosphor inline-block text-center"
          >
            Registrate ahora →
          </a>
          <a href="#about" className="btn-ghost inline-block text-center">
            Conoce el evento
          </a>
        </div>

        {/* Stats bar */}
        <div className="mt-16 flex flex-wrap gap-8 justify-center border-t border-border pt-6">
          {[
            { value: "79+", label: "registrados" },
            { value: "2–4", label: "por equipo" },
            { value: "7h", label: "de hackathon" },
            { value: "GT", label: "Guatemala City" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-[1.5rem] font-bold text-fg leading-none">
                {stat.value}
              </div>
              <div className="font-mono text-[0.6rem] tracking-[0.15em] text-fg-3 uppercase mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* City skyline silhouette */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none h-[220px]">
        <svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-15"
        >
          {/* Guatemala City-inspired skyline */}
          <path
            d="M0,220 L0,160 L40,160 L40,130 L55,130 L55,100 L70,100 L70,130 L85,130 L85,160
            L120,160 L120,110 L135,110 L135,80 L145,80 L145,60 L155,60 L155,80 L165,80 L165,110 L180,110 L180,160
            L210,160 L210,140 L225,140 L225,120 L240,120 L240,140 L255,140 L255,160
            L290,160 L290,100 L300,100 L300,70 L308,70 L308,50 L316,50 L316,70 L324,70 L324,100 L340,100 L340,160
            L370,160 L370,130 L385,130 L385,115 L395,115 L395,130 L410,130 L410,160
            L440,160 L440,120 L450,120 L450,90 L460,90 L460,70 L470,70 L470,55 L480,55 L480,70 L490,70 L490,90 L500,90 L500,120 L510,120 L510,160
            L540,160 L540,145 L555,145 L555,130 L570,130 L570,145 L585,145 L585,160
            L615,160 L615,110 L625,110 L625,85 L635,85 L635,65 L645,65 L645,85 L655,85 L655,110 L670,110 L670,160
            L700,160 L700,140 L715,140 L715,125 L725,125 L725,140 L740,140 L740,160
            L775,160 L775,105 L785,105 L785,80 L795,80 L795,60 L805,60 L805,45 L815,45 L815,60 L825,60 L825,80 L835,80 L835,105 L845,105 L845,160
            L875,160 L875,135 L890,135 L890,120 L900,120 L900,135 L915,135 L915,160
            L945,160 L945,115 L960,115 L960,90 L970,90 L970,115 L985,115 L985,160
            L1015,160 L1015,140 L1030,140 L1030,160
            L1060,160 L1060,120 L1070,120 L1070,95 L1080,95 L1080,75 L1090,75 L1090,60 L1100,60 L1100,75 L1110,75 L1110,95 L1120,95 L1120,120 L1135,120 L1135,160
            L1165,160 L1165,145 L1180,145 L1180,130 L1195,130 L1195,145 L1210,145 L1210,160
            L1240,160 L1240,110 L1255,110 L1255,85 L1265,85 L1265,110 L1280,110 L1280,160
            L1310,160 L1310,140 L1325,140 L1325,160
            L1355,160 L1355,120 L1365,120 L1365,95 L1375,95 L1375,120 L1390,120 L1390,160
            L1440,160 L1440,220 Z"
            fill={resolvedTheme === "light" ? "#1c1814" : "#f5f0e8"}
          />
        </svg>
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 fade-to-bg-bottom" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-[float-up_2.5s_ease-in-out_infinite]">
        <div className="w-px h-12 bg-[linear-gradient(to_bottom,rgba(255,75,0,0.8),transparent)]" />
      </div>
    </section>
  );
}
