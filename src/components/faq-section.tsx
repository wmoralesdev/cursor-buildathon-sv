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
      className="relative py-28 sm:py-36 lg:py-40 px-8 sm:px-12 md:px-16 lg:px-24"
      style={{ background: "#080808" }}
    >
      {/* Top rule */}
      <div className="h-rule mb-20 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left heading */}
          <div className="lg:col-span-4 reveal">
            <span className="tag mb-4 inline-block">// preguntas frecuentes</span>
            <h2
              className="font-bold uppercase leading-none"
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#f5f0e8",
                letterSpacing: "-0.02em",
              }}
            >
              ¿TIENES<br />DUDAS?
            </h2>
            <p
              className="mt-4"
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                fontSize: "0.85rem",
                color: "#555555",
                lineHeight: 1.7,
                maxWidth: "260px",
              }}
            >
              Si no encuentras tu respuesta aquí, únete a nuestra comunidad de WhatsApp.
            </p>
            {/* TODO: Replace with actual WhatsApp community invite URL when available */}
            <a
              href="https://chat.whatsapp.com/"
              aria-label="Unirse a la comunidad de WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.65rem",
                color: "#ff4b00",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,75,0,0.3)",
                paddingBottom: "2px",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ff4b00")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,75,0,0.3)")}
            >
              Comunidad WhatsApp →
            </a>
          </div>

          {/* Right accordion */}
          <div className="lg:col-span-8">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="reveal"
                style={{
                  transitionDelay: `${i * 0.05}s`,
                  borderBottom: "1px solid #1a1a1a",
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left py-6 flex items-start justify-between gap-6 group"
                  style={{ background: "none", border: "none" }}
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <span
                    style={{
                      fontFamily: "Chakra Petch, sans-serif",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: open === i ? "#f5f0e8" : "#888888",
                      lineHeight: 1.4,
                      transition: "color 0.2s ease",
                      flex: 1,
                    }}
                  >
                    {faq.q}
                  </span>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "0.9rem",
                      color: open === i ? "#ff4b00" : "#333333",
                      transition: "color 0.2s ease, transform 0.2s ease",
                      transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                      marginTop: "2px",
                    }}
                  >
                    +
                  </span>
                </button>

                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  style={{
                    maxHeight: open === i ? "300px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <p
                    className="pb-6"
                    style={{
                      fontFamily: "Chakra Petch, sans-serif",
                      fontSize: "0.875rem",
                      color: "#555555",
                      lineHeight: 1.8,
                      maxWidth: "600px",
                    }}
                  >
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
