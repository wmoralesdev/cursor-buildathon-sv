const stats = [
  {
    value: "79+",
    label: "Registrados",
    sub: "y creciendo",
  },
  {
    value: "2–4",
    label: "Por equipo",
    sub: "personas",
  },
  {
    value: "7h",
    label: "De hackathon",
    sub: "10:30–17:30",
  },
  {
    value: "CA",
    label: "Alcance",
    sub: "Toda Centroamérica",
  },
  /* was: value: "5", sub: "categorías temáticas" */
  {
    value: "???",
    label: "Tracks",
    sub: "???",
  },
  {
    value: "1",
    label: "Día",
    sub: "07 · 03 · 2026",
  },
];

export function NumbersSection() {
  return (
    <section
      id="numbers"
      className="relative py-24 sm:py-32 section-padding bg-bg-alt"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-14">
          <span className="tag mb-4 inline-block">// 02 — en números</span>
          <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
            EL EVENTO<br />EN CIFRAS
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`reveal relative overflow-hidden text-center border-r border-t border-b border-border px-5 py-7 ${i === 0 ? "border-l" : ""}`}
              style={{ "--delay": `${i * 0.07}s` } as React.CSSProperties}
            >
              {/* Faint bg value */}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center font-display text-[5rem] font-bold tracking-[-0.04em] select-none pointer-events-none text-accent/[0.04]"
              >
                {stat.value}
              </div>

              <div className="font-display text-[clamp(2rem,4vw,2.8rem)] font-bold text-accent leading-none mb-2 tracking-[-0.02em]">
                {stat.value}
              </div>

              <div className="font-display text-[0.75rem] font-semibold text-fg uppercase tracking-[0.06em] mb-1">
                {stat.label}
              </div>

              <div className="font-mono text-[0.58rem] tracking-[0.1em] text-fg-5 uppercase">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
