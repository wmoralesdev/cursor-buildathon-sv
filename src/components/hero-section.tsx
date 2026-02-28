import { CountdownTimer } from "./countdown-timer";

const LUMA_URL = "https://lu.ma/935r7zp6";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Grid lines background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(30,30,30,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,30,30,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      {/* Radial orange glow from top */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "600px",
          background: "radial-gradient(ellipse at center, rgba(255,75,0,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 sm:px-12 md:px-16 lg:px-24 py-8">
        <div className="flex items-center gap-3">
          {/* Cursor hexagonal logo mark */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14 2L25.2 8.5V21.5L14 28L2.8 21.5V8.5L14 2Z"
              fill="#f5f0e8"
              fillOpacity="0.05"
              stroke="#f5f0e8"
              strokeWidth="1.2"
            />
            <path d="M14 7L20.6 11V19L14 23L7.4 19V11L14 7Z" fill="#f5f0e8" fillOpacity="0.9" />
          </svg>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#555555",
            }}
          >
            cursor / gt
          </span>
        </div>
        <a
          href={LUMA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-phosphor text-xs hidden sm:inline-block"
          style={{ padding: "10px 28px" }}
        >
          Registrate →
        </a>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-24 pt-12 pb-24">
        {/* Event label */}
        <div className="mb-10" style={{ animationDelay: "0.1s" }}>
          <span className="tag">
            07 · 03 · 2026 &nbsp;·&nbsp; 10AM–5PM &nbsp;·&nbsp; UVG Z15
          </span>
        </div>

        {/* Giant headline with glitch */}
        <div className="relative mb-6" style={{ animation: "flicker 8s ease-in-out infinite" }}>
          <h1
            className="relative font-bold uppercase leading-none select-none"
            style={{
              fontFamily: "Chakra Petch, sans-serif",
              fontSize: "clamp(3.5rem, 12vw, 10rem)",
              color: "#f5f0e8",
              letterSpacing: "-0.02em",
              lineHeight: 0.9,
            }}
          >
            {/* Glitch layers */}
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                color: "#ff4b00",
                animation: "glitch-1 6s ease-in-out infinite",
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "clamp(3.5rem, 12vw, 10rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 0.9,
                userSelect: "none",
              }}
            >
              CURSOR<br />HACKATHON
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                color: "#00ffcc",
                animation: "glitch-2 6s ease-in-out infinite",
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "clamp(3.5rem, 12vw, 10rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 0.9,
                userSelect: "none",
              }}
            >
              CURSOR<br />HACKATHON
            </span>
            CURSOR<br />HACKATHON
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className="mb-14"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "clamp(0.85rem, 2vw, 1.1rem)",
            color: "#555555",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Ciudad de Guatemala &nbsp;·&nbsp; 2026
        </p>

        {/* Countdown */}
        <div className="mb-14">
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "#ff4b00",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            // tiempo restante
          </p>
          <CountdownTimer />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
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
        <div
          className="mt-16 flex flex-wrap gap-8"
          style={{ borderTop: "1px solid #1e1e1e", paddingTop: "24px" }}
        >
          {[
            { value: "79+", label: "registrados" },
            { value: "2–4", label: "por equipo" },
            { value: "7h", label: "de hackathon" },
            { value: "GT", label: "Guatemala City" },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontFamily: "Chakra Petch, sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#f5f0e8",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: "#555555",
                  textTransform: "uppercase",
                  marginTop: "4px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* City skyline silhouette */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: "220px" }}
      >
        <svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ opacity: 0.15 }}
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
            fill="#f5f0e8"
          />
        </svg>
        {/* Gradient fade at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, #080808 100%)",
          }}
        />
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        style={{ animation: "float-up 2.5s ease-in-out infinite" }}
      >
        <div
          style={{
            width: "1px",
            height: "48px",
            background: "linear-gradient(to bottom, rgba(255,75,0,0.8), transparent)",
          }}
        />
      </div>
    </section>
  );
}
