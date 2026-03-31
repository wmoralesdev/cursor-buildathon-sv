const eligibilityRules = [
  "Equipos de 2–4 personas",
  "Todos los miembros deben registrarse individualmente en Luma",
  "Asistencia presencial obligatoria el día del evento",
  "Abierto a toda Centroamérica",
  "Participantes de cualquier nivel de experiencia son bienvenidos",
];

const participationRules = [
  "Sin código preescrito — proyectos se construyen desde cero el día del evento",
  "Cursor es la herramienta principal requerida para construir",
  "Un proyecto por equipo",
  "El código debe ser nuevo; no se permiten proyectos preexistentes",
  "Puedes llegar con ideas y referencias, no con código",
  "Repositorio o enlace compartido requerido al finalizar",
];

export function RulesSection() {
  return (
    <section
      id="rules"
      className="relative py-24 sm:py-32 section-padding bg-bg"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-12">
          <span className="tag mb-4 inline-block">// 01 — reglas</span>
          <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
            ELEGIBILIDAD &amp; PARTICIPACIÓN
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Eligibility */}
          <div className="reveal border border-border p-8 bg-surface">
            <div className="flex items-center gap-3 mb-6 border-b border-border-faint pb-4">
              <span className="font-mono text-[0.6rem] tracking-[0.15em] text-accent uppercase">
                A.
              </span>
              <h3 className="font-display text-[0.85rem] font-semibold text-fg tracking-[0.05em] uppercase">
                Elegibilidad
              </h3>
            </div>
            <ul className="list-none p-0 m-0">
              {eligibilityRules.map((rule, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-3 ${i < eligibilityRules.length - 1 ? "mb-4" : ""}`}
                >
                  <span className="font-mono text-[0.65rem] text-accent mt-[3px] shrink-0">
                    →
                  </span>
                  <span className="font-display text-[0.875rem] text-fg-2 leading-[1.6]">
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Participation Rules */}
          <div className="reveal reveal-delay-1 border border-border p-8 bg-surface">
            <div className="flex items-center gap-3 mb-6 border-b border-border-faint pb-4">
              <span className="font-mono text-[0.6rem] tracking-[0.15em] text-accent uppercase">
                B.
              </span>
              <h3 className="font-display text-[0.85rem] font-semibold text-fg tracking-[0.05em] uppercase">
                Reglas de Participación
              </h3>
            </div>
            <ul className="list-none p-0 m-0">
              {participationRules.map((rule, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-3 ${i < participationRules.length - 1 ? "mb-4" : ""}`}
                >
                  <span className="font-mono text-[0.65rem] text-accent mt-[3px] shrink-0">
                    →
                  </span>
                  <span className="font-display text-[0.875rem] text-fg-2 leading-[1.6]">
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
