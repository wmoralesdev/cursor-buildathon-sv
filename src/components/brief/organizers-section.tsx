import { PersonCard } from "./person-card";
import type { PersonCardData } from "./person-card";
import { sortPeopleByName } from "../../utils/sort-people";

const organizers: PersonCardData[] = [
  {
    initials: "OM",
    name: "Oscar Morales",
    photo: "/staff/oscar.jpeg",
    role: "Lead Organizer",
    blurb:
      "Founding AI Engineer en Finny, startup que mejora el bienestar financiero en LatAm; fundador de the502project, comunidad de +300 builders y founders en Guatemala. Cursor Ambassador, creador de contenido en CL y Notion — conectando talento tech y emprendedores en toda la región. Builder y community founder comprometido con hacer crecer el ecosistema de IA en Centroamérica.",
    hasCursorBadge: true,
  },
  {
    initials: "WM",
    name: "Walter Morales",
    photo: "/staff/walter.png",
    role: "Lead Organizer",
    blurb:
      "Fundador de AI Labs SV, comunidad de 500+ builders en El Salvador. Cursor Ambassador para El Salvador y Centroamérica — organiza eventos, talleres universitarios y hackathons en toda la región. 6+ años como software engineer en SOUTHWORKS (partner de AWS y Microsoft); colabora con universidades de El Salvador para elevar la educación tech en Centroamérica.",
    hasCursorBadge: true,
  },
];

export function OrganizersSection() {
  return (
    <section
      id="organizers"
      className="relative py-24 sm:py-32 section-padding bg-bg-alt"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-14">
          <div className="lg:col-span-5 reveal">
            <span className="tag mb-4 inline-block">// 04 — organizadores</span>
            <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
              ORGANIZADORES
            </h2>
            <p className="mt-4 font-display text-sm text-fg-3 leading-[1.7]">
              El equipo detrás del Cursor Hackathon Guatemala. Líderes de la comunidad que hacen posible este evento.
            </p>
          </div>

          <div className="lg:col-span-7 reveal reveal-delay-1 flex items-center">
            <div className="border-b border-b-border-faint border-l-2 border-l-accent/30 px-6 py-5 bg-accent/[0.02]">
              <p className="font-mono text-[0.65rem] tracking-[0.12em] text-fg-3 uppercase leading-[1.8]">
                // lead organizers del equipo
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {sortPeopleByName(organizers).map((person, i) => (
            <PersonCard key={person.name} {...person} size="lg" index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
