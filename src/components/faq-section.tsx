import { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
}

const faqs: FAQItem[] = [
  {
    q: "¿Necesito saber programar para participar?",
    a: "No. Las herramientas de IA que usaremos (como Cursor) permiten que cualquier persona construya productos funcionales. Lo que buscamos es diversidad de perspectivas: diseñadores, marketers, emprendedores y curiosos son igual de bienvenidos que los desarrolladores.",
  },
  {
    q: "¿Puedo participar solo o necesito un equipo?",
    a: "Puedes registrarte sin equipo y serás asignado a uno equilibrado antes del evento. También puedes venir con tu equipo de 2 a 4 personas. Todos los miembros del equipo deben registrarse individualmente.",
  },
  {
    q: "¿El evento es gratuito?",
    a: "Sí, la participación no tiene costo. Solo necesitas registrarte en Luma y recibir aprobación. El cupo es limitado para garantizar calidad en la experiencia.",
  },
  {
    q: "¿Puedo participar si soy de fuera de Guatemala?",
    a: "Sí. Builders de toda Centroamérica son bienvenidos. El único requisito es asistir presencialmente al evento en la Universidad del Valle de Guatemala.",
  },
  {
    q: "¿Qué herramientas se usarán durante el hackathon?",
    a: "Cursor es la herramienta principal. Es un editor de código con IA integrada que permite construir aplicaciones completas sin experiencia técnica avanzada. El día del evento recibirás acceso y una introducción rápida.",
  },
  {
    q: "¿Habrá premios?",
    a: "Sí. Los detalles de premios se anunciarán próximamente. Los criterios de evaluación incluyen impacto, originalidad, ejecución técnica y presentación.",
  },
  {
    q: "¿Puedo empezar a trabajar en mi proyecto antes del evento?",
    a: "Los proyectos deben construirse el día del hackathon desde cero. Puedes llegar con ideas y referencias, pero el código y el producto deben ser nuevos.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative py-28 sm:py-36 lg:py-48 section-padding bg-bg"
    >
      {/* Top rule */}
      <div className="h-rule mb-20 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left heading */}
          <div className="lg:col-span-4 reveal">
            <span className="tag mb-4 inline-block">// preguntas frecuentes</span>
            <h2 className="font-bold uppercase leading-none font-display text-[clamp(2rem,4vw,3rem)] text-fg tracking-[-0.02em]">
              ¿TIENES<br />DUDAS?
            </h2>
            <p className="mt-4 font-display text-[0.85rem] text-fg-3 leading-[1.7] max-w-[260px]">
              Si no encuentras tu respuesta aquí, únete a nuestra comunidad de WhatsApp.
            </p>
            {/* TODO: Replace with actual WhatsApp community invite URL when available */}
            <a
              href="https://chat.whatsapp.com/"
              aria-label="Unirse a la comunidad de WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block font-mono text-[0.65rem] text-accent tracking-[0.12em] uppercase no-underline border-b border-accent/30 pb-0.5 transition-[border-color] duration-200 hover:border-accent"
            >
              Comunidad WhatsApp →
            </a>
          </div>

          {/* Right accordion */}
          <div className="lg:col-span-8">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="reveal border-b border-border-faint"
                style={{ "--delay": `${i * 0.05}s` } as React.CSSProperties}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left py-6 flex items-start justify-between gap-6 group bg-transparent border-none"
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <span
                    className={`font-display text-[0.95rem] font-medium leading-snug flex-1 transition-colors duration-200 ${open === i ? "text-fg" : "text-fg-2"}`}
                  >
                    {faq.q}
                  </span>
                  <span
                    className={`font-mono text-[0.9rem] shrink-0 flex items-center justify-center w-6 h-6 mt-0.5 transition-[color,transform] duration-200 ${open === i ? "text-accent rotate-45" : "text-fg-5"}`}
                  >
                    +
                  </span>
                </button>

                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  className="faq-accordion-content"
                  data-open={open === i ? "true" : "false"}
                >
                  <p className="pb-6 font-display text-sm text-fg-3 leading-[1.8] max-w-[600px]">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
