const details = [
  {
    glyph: "01",
    label: "Fecha",
    value: "07/03/2026",
    sub: "Sábado",
    accent: false,
  },
  {
    glyph: "02",
    label: "Horario",
    value: "10AM — 5PM",
    sub: "7 horas de hackathon",
    accent: true,
  },
  {
    glyph: "03",
    label: "Sede",
    value: "UVG Z15",
    sub: "Universidad del Valle de Guatemala",
    accent: false,
  },
  {
    glyph: "04",
    label: "Ciudad",
    value: "Guatemala",
    sub: "Ciudad de Guatemala, GT",
    accent: false,
  },
];

export function DetailsSection() {
  return (
    <section
      id="details"
      className="relative py-28 sm:py-36 lg:py-40 px-8 sm:px-12 md:px-16 lg:px-24"
      style={{ background: "#0a0a0a" }}
    >
      {/* Top rule */}
      <div className="h-rule mb-20 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 reveal">
          <div>
            <span className="tag mb-4 inline-block">// detalles</span>
            <h2
              className="font-bold uppercase leading-none"
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "#f5f0e8",
                letterSpacing: "-0.02em",
              }}
            >
              DÓNDE &amp; CUÁNDO
            </h2>
          </div>
          <p
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.7rem",
              color: "#888888",
              letterSpacing: "0.1em",
              maxWidth: "240px",
              textAlign: "right",
              lineHeight: 1.6,
            }}
          >
            Asistencia presencial<br />requerida para participar
          </p>
        </div>

        {/* Detail cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {details.map((d, i) => (
            <div
              key={d.glyph}
              className="reveal py-9 px-7 relative overflow-hidden"
              style={{
                transitionDelay: `${i * 0.08}s`,
                border: `1px solid ${d.accent ? "rgba(255,75,0,0.5)" : "#1e1e1e"}`,
                background: d.accent ? "rgba(255,75,0,0.06)" : "#0e0e0e",
              }}
            >
              {/* Index glyph */}
              <span
                className="absolute top-4 right-4"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.55rem",
                  color: d.accent ? "rgba(255,75,0,0.5)" : "#2a2a2a",
                  letterSpacing: "0.1em",
                }}
              >
                {d.glyph}
              </span>

              {/* Corner accent for highlighted card */}
              {d.accent && (
                <div
                  className="absolute top-0 left-0"
                  style={{
                    width: "2px",
                    height: "40px",
                    background: "#ff4b00",
                  }}
                />
              )}

              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: d.accent ? "#ff4b00" : "#555555",
                  marginBottom: "12px",
                }}
              >
                {d.label}
              </p>

              <p
                style={{
                  fontFamily: "Chakra Petch, sans-serif",
                  fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                  fontWeight: 700,
                  color: d.accent ? "#ff4b00" : "#f5f0e8",
                  letterSpacing: d.accent ? "0" : "-0.02em",
                  lineHeight: 1.1,
                  marginBottom: "8px",
                }}
              >
                {d.value}
              </p>

              <p
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.65rem",
                  color: "#444444",
                  letterSpacing: "0.05em",
                  lineHeight: 1.5,
                }}
              >
                {d.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Map reference bar */}
        <div
          className="reveal mt-6 flex items-center justify-between flex-wrap gap-3 py-6 px-8"
          style={{
            border: "1px solid #1e1e1e",
            background: "#0e0e0e",
          }}
        >
          <div className="flex items-center gap-4">
            <span style={{ color: "#ff4b00", fontSize: "0.9rem" }}>◎</span>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.7rem",
                color: "#888888",
                letterSpacing: "0.08em",
              }}
            >
              18 Av. 11-95 Zona 15 Vista Hermosa III, Ciudad de Guatemala
            </span>
          </div>
          <a
            href="https://maps.google.com/?q=Universidad+del+Valle+de+Guatemala"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.65rem",
              color: "#ff4b00",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderBottom: "1px solid rgba(255,75,0,0.3)",
              paddingBottom: "1px",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ff4b00")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,75,0,0.3)")}
          >
            Ver en mapa →
          </a>
        </div>
      </div>
    </section>
  );
}
