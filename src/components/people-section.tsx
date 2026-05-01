import { useMemo } from "react";

import { PersonCard } from "./brief/person-card";
import type { PersonCardData } from "./brief/person-card";
import { AnchorHeading } from "./anchor-heading";
import { AILABS_URL } from "../constants";
import { useTranslation } from "../context/language-context";

export function PeopleSection() {
  const { t } = useTranslation();

  const organizers = useMemo<PersonCardData[]>(
    () => [
      {
        initials: "WM",
        name: "Walter Morales",
        photo: "/staff/walter.png",
        role: t("people.walter.role"),
        company: t("people.walter.company"),
        companyHref: AILABS_URL,
        blurb: t("people.walter.blurb"),
        hasCursorBadge: true,
      },
      {
        initials: "DH",
        name: "Daniela Huezo",
        photo: "/staff/daniela.jpeg",
        role: t("people.daniela.role"),
        company: t("people.daniela.company"),
        companyHref: AILABS_URL,
        blurb: t("people.daniela.blurb"),
        hasCursorBadge: true,
      },
    ],
    [t],
  );

  const proofPoints = useMemo(
    () => [
      { value: t("people.proof1.value"), label: t("people.proof1.label") },
      { value: t("people.proof2.value"), label: t("people.proof2.label") },
      { value: t("people.proof3.value"), label: t("people.proof3.label") },
    ],
    [t],
  );

  return (
    <section
      id="people"
      className="relative py-24 sm:py-32 lg:py-40 section-padding bg-bg"
    >
      <div className="max-w-[1400px] mx-auto">
        <header className="reveal mb-12 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <span className="tag mb-4 inline-block">{t("people.tag")}</span>
            <AnchorHeading id="people">
              <h2 className="font-display font-medium text-fg tracking-[-0.02em] leading-[1] text-[clamp(2rem,4.4vw,3.4rem)]">
                {t("people.title1")}
                <br />
                <span className="text-accent">{t("people.title2")}</span>
              </h2>
            </AnchorHeading>
          </div>
          <p className="md:col-span-5 font-display text-base text-fg-3 leading-[1.7] max-w-[40ch] md:text-right md:ml-auto">
            {t("people.aside")}
          </p>
        </header>

        {/* Proof strip — borderless data band, not 3 boxed cards */}
        <ul className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border-faint border-y border-border-faint mb-12">
          {proofPoints.map((point, i) => (
            <li
              key={point.label}
              className="reveal px-4 py-7 sm:px-6"
              style={{ "--delay": `${i * 0.07}s` } as React.CSSProperties}
            >
              <div className="font-display text-[1.85rem] sm:text-[2rem] font-bold text-accent leading-none mb-2 tabular-nums tracking-[-0.02em]">
                {point.value}
              </div>
              <div className="font-mono text-[0.65rem] tracking-[0.14em] uppercase text-fg-4 leading-[1.6]">
                {point.label}
              </div>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {organizers.map((person, i) => (
            <PersonCard key={person.name} {...person} size="lg" index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
