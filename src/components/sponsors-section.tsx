/* Sponsor + Partner logos as inline SVG/text marks to avoid external image deps */

function UVGLogo() {
  return (
    <span
      style={{
        fontFamily: "Chakra Petch, sans-serif",
        fontWeight: 700,
        fontSize: "1.8rem",
        letterSpacing: "0.05em",
        color: "currentColor",
      }}
    >
      UVG
    </span>
  );
}

function VudyLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="10" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="11" cy="11" r="5" fill="currentColor" opacity="0.5" />
        <circle cx="11" cy="11" r="2" fill="currentColor" />
      </svg>
      <span
        style={{
          fontFamily: "Chakra Petch, sans-serif",
          fontWeight: 600,
          fontSize: "1.3rem",
          letterSpacing: "0.08em",
          color: "currentColor",
        }}
      >
        Vudy
      </span>
    </div>
  );
}

function PAQWalletLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span
        style={{
          fontFamily: "Chakra Petch, sans-serif",
          fontWeight: 700,
          fontSize: "1.3rem",
          letterSpacing: "0.05em",
          color: "currentColor",
        }}
      >
        PAQ
      </span>
      <span
        style={{
          fontFamily: "Chakra Petch, sans-serif",
          fontWeight: 300,
          fontSize: "1.1rem",
          letterSpacing: "0.05em",
          color: "currentColor",
          opacity: 0.6,
        }}
      >
        wallet
      </span>
    </div>
  );
}

function V0Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      <span
        style={{
          fontFamily: "Chakra Petch, sans-serif",
          fontWeight: 700,
          fontSize: "1.8rem",
          letterSpacing: "-0.04em",
          color: "currentColor",
        }}
      >
        v0
      </span>
    </div>
  );
}

function The502Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="16" height="16" stroke="currentColor" strokeWidth="1.5" />
        <rect x="4" y="4" width="10" height="10" fill="currentColor" opacity="0.4" />
      </svg>
      <span
        style={{
          fontFamily: "Chakra Petch, sans-serif",
          fontWeight: 600,
          fontSize: "1rem",
          letterSpacing: "0.05em",
          color: "currentColor",
        }}
      >
        the502project
      </span>
    </div>
  );
}

function CCOTILogo() {
  return (
    <span
      style={{
        fontFamily: "Chakra Petch, sans-serif",
        fontWeight: 700,
        fontSize: "1.2rem",
        letterSpacing: "0.1em",
        color: "currentColor",
      }}
    >
      CCOTI
    </span>
  );
}

function CursorCommunityLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" fill="currentColor" />
      </svg>
      <span
        style={{
          fontFamily: "Chakra Petch, sans-serif",
          fontWeight: 500,
          fontSize: "0.9rem",
          letterSpacing: "0.05em",
          color: "currentColor",
        }}
      >
        Cursor Community
      </span>
    </div>
  );
}

interface LogoTileProps {
  children: React.ReactNode;
  size?: "lg" | "sm";
}

function LogoTile({ children, size = "lg" }: LogoTileProps) {
  return (
    <div
      style={{
        border: "1px solid #1e1e1e",
        background: "#0e0e0e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: size === "lg" ? "32px 40px" : "24px 32px",
        color: "#888888",
        transition: "border-color 0.3s ease, color 0.3s ease, background 0.3s ease",
        cursor: "default",
        minHeight: size === "lg" ? "100px" : "80px",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(255,75,0,0.5)";
        el.style.color = "#f5f0e8";
        el.style.background = "rgba(255,75,0,0.04)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "#1e1e1e";
        el.style.color = "#888888";
        el.style.background = "#0e0e0e";
      }}
    >
      {children}
    </div>
  );
}

export function SponsorsSection() {
  return (
    <section id="sponsors" className="relative py-28 sm:py-36 lg:py-40 px-8 sm:px-12 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Sponsors */}
        <div className="mb-24">
          <div className="reveal flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="tag mb-4 inline-block">// patrocinadores</span>
              <h2
                className="font-bold uppercase"
                style={{
                  fontFamily: "Chakra Petch, sans-serif",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  color: "#f5f0e8",
                  letterSpacing: "-0.02em",
                  lineHeight: 0.95,
                }}
              >
                SPONSORS
              </h2>
            </div>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.65rem",
                color: "#555555",
                letterSpacing: "0.08em",
                lineHeight: 1.6,
                maxWidth: "220px",
                textAlign: "right",
              }}
            >
              Hacen posible este evento
            </p>
          </div>

          <div className="reveal grid grid-cols-2 sm:grid-cols-4 gap-6">
            <LogoTile><UVGLogo /></LogoTile>
            <LogoTile><VudyLogo /></LogoTile>
            <LogoTile><PAQWalletLogo /></LogoTile>
            <LogoTile><V0Logo /></LogoTile>
          </div>
        </div>

        {/* Divider */}
        <div className="h-rule mb-24" />

        {/* Partners */}
        <div>
          <div className="reveal flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <span className="tag mb-4 inline-block">// aliados</span>
              <h2
                className="font-bold uppercase"
                style={{
                  fontFamily: "Chakra Petch, sans-serif",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  color: "#f5f0e8",
                  letterSpacing: "-0.02em",
                  lineHeight: 0.95,
                }}
              >
                PARTNERS
              </h2>
            </div>
          </div>

          <div className="reveal grid grid-cols-1 sm:grid-cols-3 gap-6">
            <LogoTile size="sm"><CCOTILogo /></LogoTile>
            <LogoTile size="sm"><The502Logo /></LogoTile>
            <LogoTile size="sm"><CursorCommunityLogo /></LogoTile>
          </div>
        </div>

        {/* Become a sponsor CTA */}
        <div
          className="reveal mt-12 flex items-center justify-between flex-wrap gap-4 py-8 px-10"
          style={{
            border: "1px dashed #2a2a2a",
            background: "rgba(255,75,0,0.02)",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "1rem",
                color: "#f5f0e8",
                fontWeight: 600,
                marginBottom: "4px",
              }}
            >
              ¿Quieres ser sponsor?
            </p>
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.65rem",
                color: "#555555",
                letterSpacing: "0.06em",
              }}
            >
              Conecta tu marca con los builders de Centroamérica
            </p>
          </div>
          <a
            href="mailto:wmoralesdev@gmail.com?subject=Cursor Hackathon GT - Patrocinio"
            className="btn-ghost text-sm"
            style={{ padding: "10px 24px", display: "inline-block", textDecoration: "none" }}
          >
            Contáctanos →
          </a>
        </div>
      </div>
    </section>
  );
}
