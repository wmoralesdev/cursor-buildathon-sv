interface ScheduleItem {
  time: string;
  title: string;
  desc: string;
  highlight?: boolean;
}

const schedule: ScheduleItem[] = [
  {
    time: "09:30",
    title: "Check-in & Networking",
    desc: "Registro de participantes, bienvenida y formación de equipos sin team asignado.",
  },
  {
    time: "10:00",
    title: "Kickoff & Reglas",
    desc: "Presentación oficial, reglas del hackathon, criterios de evaluación y recursos disponibles.",
    highlight: true,
  },
  {
    time: "10:30",
    title: "¡Comienza el Hackathon!",
    desc: "Arranca el reloj. 6.5 horas para construir algo que nadie ha visto antes.",
    highlight: true,
  },
  {
    time: "13:00",
    title: "Almuerzo & Check-in Medio",
    desc: "Pausa para almorzar. Los mentores recorren los equipos para ofrecer orientación.",
  },
  {
    time: "15:30",
    title: "Congelamiento de Código",
    desc: "Las herramientas se cierran. Tiempo para pulir la presentación y el pitch.",
  },
  {
    time: "16:00",
    title: "Demos & Pitches",
    desc: "Cada equipo tiene 3 minutos para demostrar su proyecto al jurado y audiencia.",
    highlight: true,
  },
  {
    time: "17:00",
    title: "Premiación & Cierre",
    desc: "Anuncio de ganadores, networking final y celebración.",
    highlight: true,
  },
];

export function ScheduleSection() {
  return (
    <section
      id="schedule"
      className="relative py-28 sm:py-36 lg:py-40 px-8 sm:px-12 md:px-16 lg:px-24"
      style={{ background: "#090909" }}
    >
      {/* Top rule */}
      <div className="h-rule mb-20 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Left sticky heading */}
          <div className="lg:col-span-4 reveal">
            <span className="tag mb-4 inline-block">// agenda</span>
            <h2
              className="font-bold uppercase leading-none mb-6"
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#f5f0e8",
                letterSpacing: "-0.02em",
              }}
            >
              EL DÍA<br />
              <span style={{ color: "#ff4b00" }}>07.03</span>
            </h2>
            <p
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "0.9rem",
                color: "#555555",
                lineHeight: 1.7,
                maxWidth: "300px",
              }}
            >
              Un día completo de construcción, aprendizaje y conexiones con la comunidad tech de Centroamérica.
            </p>

            {/* Duration badge */}
            <div
              className="mt-8 inline-flex flex-col"
              style={{
                border: "1px solid #1e1e1e",
                padding: "16px 20px",
              }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#555555",
                  marginBottom: "6px",
                }}
              >
                duración total
              </span>
              <span
                style={{
                  fontFamily: "Chakra Petch, sans-serif",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#ff4b00",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                7h
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-8 relative">
            {/* Vertical line */}
            <div
              className="absolute left-0 top-0 bottom-0"
              style={{
                width: "1px",
                background: "linear-gradient(to bottom, #ff4b00, #1e1e1e 80%)",
                left: "0px",
              }}
            />

            <div className="space-y-0 pl-8">
              {schedule.map((item, i) => (
                <div
                  key={item.time}
                  className={`reveal relative ${i === 0 ? "pt-0 pb-8" : i === schedule.length - 1 ? "pt-8 pb-0" : "py-8"}`}
                  style={{
                    transitionDelay: `${i * 0.07}s`,
                    borderBottom: i < schedule.length - 1 ? "1px solid #111111" : "none",
                  }}
                >
                  {/* Dot on timeline */}
                  <div
                    className="absolute"
                    style={{
                      left: "-33px",
                      top: i === 0 ? "6px" : "30px",
                      width: item.highlight ? "10px" : "6px",
                      height: item.highlight ? "10px" : "6px",
                      borderRadius: "50%",
                      background: item.highlight ? "#ff4b00" : "#2a2a2a",
                      border: item.highlight ? "none" : "1px solid #333333",
                      boxShadow: item.highlight ? "0 0 10px rgba(255,75,0,0.5)" : "none",
                      transform: "translateX(-50%)",
                    }}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                    <span
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "0.75rem",
                        color: item.highlight ? "#ff4b00" : "#444444",
                        letterSpacing: "0.08em",
                        minWidth: "52px",
                        flexShrink: 0,
                      }}
                    >
                      {item.time}
                    </span>
                    <div>
                      <h3
                        style={{
                          fontFamily: "Chakra Petch, sans-serif",
                          fontSize: "1rem",
                          fontWeight: item.highlight ? 600 : 500,
                          color: item.highlight ? "#f5f0e8" : "#888888",
                          letterSpacing: "0.03em",
                          marginBottom: "4px",
                          textTransform: "uppercase",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "Chakra Petch, sans-serif",
                          fontSize: "0.82rem",
                          color: "#444444",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
