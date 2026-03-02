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
      className="relative py-28 sm:py-36 lg:py-48 section-padding bg-bg"
    >
      {/* Top rule */}
      <div className="h-rule mb-20 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Left sticky heading */}
          <div className="lg:col-span-4 reveal">
            <span className="tag mb-4 inline-block">// agenda</span>
            <h2 className="font-bold uppercase leading-none mb-6 font-display text-[clamp(2rem,4vw,3rem)] text-fg tracking-[-0.02em]">
              EL DÍA<br />
              <span className="text-accent">07.03</span>
            </h2>
            <p className="font-display text-[0.9rem] text-fg-3 leading-[1.7] max-w-[300px]">
              Un día completo de construcción, aprendizaje y conexiones con la comunidad tech de Centroamérica.
            </p>

            {/* Duration badge */}
            <div className="mt-8 inline-flex flex-col border border-border px-5 py-4">
              <span className="font-mono text-[0.55rem] tracking-[0.18em] uppercase text-fg-3 mb-1.5">
                duración total
              </span>
              <span className="font-display text-[2rem] font-bold text-accent tracking-[-0.02em] leading-none">
                7h
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-8 relative">
            {/* Vertical line */}
            <div className="absolute left-0 top-0 bottom-0 w-px timeline-line" />

            <div className="space-y-0 pl-8">
              {schedule.map((item, i) => (
                <div
                  key={item.time}
                  className={`reveal relative ${i === 0 ? "pt-0 pb-8" : i === schedule.length - 1 ? "pt-8 pb-0" : "py-8"} ${i < schedule.length - 1 ? "border-b border-border-dim" : ""}`}
                  style={{ "--delay": `${i * 0.07}s` } as React.CSSProperties}
                >
                  {/* Dot on timeline */}
                  <div
                    className={`absolute rounded-full timeline-dot ${item.highlight ? "timeline-dot--highlight" : ""} ${i === 0 ? "timeline-dot--first" : ""}`}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                    <span
                      className={`font-mono text-[0.75rem] tracking-[0.08em] min-w-[52px] shrink-0 ${item.highlight ? "text-accent" : "text-fg-4"}`}
                    >
                      {item.time}
                    </span>
                    <div>
                      <h3
                        className={`font-display text-base uppercase tracking-[0.03em] mb-1 ${item.highlight ? "font-semibold text-fg" : "font-medium text-fg-2"}`}
                      >
                        {item.title}
                      </h3>
                      <p className="font-display text-[0.82rem] text-fg-4 leading-[1.6]">
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
