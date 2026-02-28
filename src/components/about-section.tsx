const profiles = [
  {
    icon: "⌨",
    title: "Desarrolladores",
    desc: "Lleva tus skills de código al siguiente nivel con las herramientas de IA más potentes.",
  },
  {
    icon: "◈",
    title: "Diseñadores",
    desc: "Materializa interfaces y productos sin límites. La IA amplifica tu visión creativa.",
  },
  {
    icon: "◉",
    title: "Emprendedores",
    desc: "Valida y construye tu MVP en un solo día. Desde la idea al prototipo funcional.",
  },
  {
    icon: "◎",
    title: "Curiosos",
    desc: "No necesitas experiencia técnica. Si tienes una idea y ganas de crear, este es tu lugar.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-28 sm:py-36 lg:py-40 px-8 sm:px-12 md:px-16 lg:px-24">
      {/* Subtle left border accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{ background: "linear-gradient(to bottom, transparent, #ff4b00, transparent)" }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-start">
          {/* Left: Heading block */}
          <div className="reveal min-w-0">
            <span className="tag mb-6 inline-block">// sobre el evento</span>
            <h2
              className="font-bold uppercase leading-none mb-8"
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                color: "#f5f0e8",
                letterSpacing: "-0.02em",
                lineHeight: 0.92,
              }}
            >
              CONSTRUYE CON <span style={{ color: "#ff4b00" }}>IA.</span>
              <br />
              SIN LÍMITES.
            </h2>
            <p
              className="mb-6"
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "1.05rem",
                color: "#888888",
                lineHeight: 1.7,
                maxWidth: "min(480px, 100%)",
              }}
            >
              El Cursor Hackathon Guatemala es un espacio para builders de toda Centroamérica. 
              En 7 horas, tu equipo construirá algo real usando las herramientas de IA más avanzadas.
            </p>
            <p
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "1.05rem",
                color: "#888888",
                lineHeight: 1.7,
                maxWidth: "min(480px, 100%)",
              }}
            >
              Aquí no importa si sabes programar o no. Lo que importa es la idea, 
              la ejecución y el equipo. Cursor nivela el campo de juego.
            </p>

            {/* Central America tag */}
            <div
              className="mt-8 inline-flex items-center gap-3"
              style={{
                border: "1px solid #1e1e1e",
                padding: "12px 20px",
                background: "rgba(255,75,0,0.04)",
              }}
            >
              <span style={{ color: "#ff4b00", fontSize: "1rem" }}>▸</span>
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  color: "#888888",
                  textTransform: "uppercase",
                }}
              >
                Builders de toda Centroamérica son bienvenidos
              </span>
            </div>
          </div>

          {/* Right: Profile cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-w-0">
            {profiles.map((p, i) => (
              <div
                key={p.title}
                className="reveal group min-w-0 break-words p-7"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  transitionDelay: `${i * 0.1}s`,
                  border: "1px solid #1e1e1e",
                  background: "#0e0e0e",
                  transition: "border-color 0.3s ease, background 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,75,0,0.4)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,75,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#1e1e1e";
                  (e.currentTarget as HTMLDivElement).style.background = "#0e0e0e";
                }}
              >
                <div
                  style={{
                    fontSize: "1.4rem",
                    marginBottom: "12px",
                    color: "#ff4b00",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {p.icon}
                </div>
                <h3
                  className="font-semibold mb-2"
                  style={{
                    fontFamily: "Chakra Petch, sans-serif",
                    fontSize: "0.95rem",
                    color: "#f5f0e8",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontFamily: "Chakra Petch, sans-serif",
                    fontSize: "0.82rem",
                    color: "#555555",
                    lineHeight: 1.6,
                  }}
                >
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
