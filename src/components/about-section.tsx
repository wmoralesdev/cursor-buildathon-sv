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
    <section id="about" className="relative py-28 sm:py-36 lg:py-48 section-padding bg-bg">
      {/* Subtle left border accent */}
      <div className="absolute left-0 top-0 bottom-0 w-px border-accent-left" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-start">
          {/* Left: Heading block */}
          <div className="reveal min-w-0">
            <span className="tag mb-6 inline-block">// sobre el evento</span>
            <h2
              className="font-bold uppercase leading-[0.92] mb-8 font-display text-[clamp(2.5rem,6vw,4.5rem)] text-fg tracking-[-0.02em]"
            >
              CONSTRUYE CON <span className="text-accent">IA.</span>
              <br />
              SIN LÍMITES.
            </h2>
            <p className="mb-6 font-display text-[1.05rem] text-fg-2 leading-[1.7] max-w-[min(480px,100%)]">
              El Cursor Hackathon Guatemala es un espacio para builders de toda Centroamérica.
              En 7 horas, tu equipo construirá algo real usando las herramientas de IA más avanzadas.
            </p>
            <p className="font-display text-[1.05rem] text-fg-2 leading-[1.7] max-w-[min(480px,100%)]">
              Aquí no importa si sabes programar o no. Lo que importa es la idea,
              la ejecución y el equipo. Cursor nivela el campo de juego.
            </p>

            {/* Central America tag */}
            <div className="mt-8 inline-flex items-center gap-3 border border-border px-5 py-3 bg-accent/[0.04]">
              <span className="text-accent text-base">▸</span>
              <span className="font-mono text-[0.7rem] tracking-[0.1em] text-fg-2 uppercase">
                Builders de toda Centroamérica son bienvenidos
              </span>
            </div>
          </div>

          {/* Right: Profile cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-w-0">
            {profiles.map((p, i) => (
              <div
                key={p.title}
                className="reveal group min-w-0 break-words p-7 border border-border bg-bg-raised cursor-default profile-card-hover"
                style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}
              >
                <div className="text-[1.4rem] mb-3 text-accent font-mono">
                  {p.icon}
                </div>
                <h3 className="font-semibold mb-2 font-display text-[0.95rem] text-fg tracking-[0.05em] uppercase">
                  {p.title}
                </h3>
                <p className="font-display text-[0.82rem] text-fg-3 leading-[1.6]">
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
