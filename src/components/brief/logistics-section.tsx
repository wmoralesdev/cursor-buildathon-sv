const checklist = [
  { item: "Laptop con Cursor instalado y activo", required: true },
  { item: "Cargador de laptop", required: true },
  { item: "Audífonos (opcional, para concentración)", required: false },
  { item: "Cuenta en GitHub u otro repositorio", required: true },
];

const schedule = [
  { time: "4 jul", event: "Inicio del buildathon", note: "08:00 — UFG" },
  { time: "24h+", event: "Ventana continua de construcción", note: "Detalle por anunciar" },
  { time: "5 jul", event: "Cierre de ventana", note: "09:00 — formato por confirmar" },
];

export function LogisticsSection() {
  return (
    <section
      id="logistics"
      className="relative py-24 sm:py-32 section-padding bg-bg"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-12">
          <span className="tag mb-4 inline-block">// logística</span>
          <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
            EL BUILDATHON
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="reveal border border-border p-8 bg-surface">
            <h3 className="font-display text-[0.85rem] font-semibold text-fg tracking-[0.05em] uppercase mb-5 pb-4 border-b border-border-faint">
              Qué llevar
            </h3>
            <ul className="list-none p-0 m-0">
              {checklist.map((item, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-3 ${i < checklist.length - 1 ? "mb-[14px]" : ""}`}
                >
                  <span
                    className={`font-mono text-[0.7rem] mt-[2px] shrink-0 ${item.required ? "text-accent" : "text-fg-5"}`}
                  >
                    {item.required ? "■" : "□"}
                  </span>
                  <span
                    className={`font-display text-[0.875rem] leading-[1.6] ${item.required ? "text-fg-2" : "text-fg-4"}`}
                  >
                    {item.item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-border-faint">
              <p className="font-mono text-[0.6rem] tracking-[0.12em] text-accent uppercase mb-2">
                // provisto por organizadores
              </p>
              {["Wi‑Fi en sede", "Licencias de Cursor para el evento", "Comidas — detalle por anunciar"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 mb-2.5">
                  <span className="font-mono text-[0.65rem] text-accent">✓</span>
                  <span className="font-display text-[0.85rem] text-fg-3">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal reveal-delay-1 border border-border p-8 bg-surface">
            <h3 className="font-display text-[0.85rem] font-semibold text-fg tracking-[0.05em] uppercase mb-5 pb-4 border-b border-border-faint">
              Ubicación
            </h3>

            <div className="space-y-4">
              {[
                { label: "Venue", value: "Universidad Francisco Gavidia (UFG)" },
                { label: "Ciudad", value: "San Salvador" },
                { label: "País", value: "El Salvador" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="font-mono text-[0.58rem] tracking-[0.15em] text-fg-5 uppercase">
                    {label}
                  </span>
                  <span className="font-display text-[0.9rem] text-fg-2">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="reveal border border-border p-8 bg-surface">
          <h3 className="font-display text-[0.85rem] font-semibold text-fg tracking-[0.05em] uppercase mb-5 pb-4 border-b border-border-faint">
            Agenda (resumen)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
            {schedule.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 py-3 pr-4 border-b border-border-dim"
              >
                <span className="font-mono text-[0.75rem] font-semibold text-accent shrink-0 min-w-[48px]">
                  {item.time}
                </span>
                <div>
                  <div className="font-display text-[0.85rem] text-fg mb-0.5">
                    {item.event}
                  </div>
                  <div className="font-mono text-[0.6rem] tracking-[0.1em] text-fg-5 uppercase">
                    {item.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
