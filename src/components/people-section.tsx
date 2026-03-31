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
      className="group relative py-24 sm:py-32 section-padding bg-bg"
    >
      <div className="h-rule mb-16 max-w-7xl mx-auto" />

      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-16">
          <span className="tag mb-4 inline-block">{t("people.tag")}</span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <AnchorHeading id="people">
              <h2 className="font-bold uppercase leading-none font-display text-[clamp(1.8rem,4vw,2.8rem)] text-fg tracking-[-0.02em]">
                {t("people.title1")}
                <br />
                <span className="text-accent">{t("people.title2")}</span>
              </h2>
            </AnchorHeading>
            <p className="font-display text-sm text-fg-3 leading-[1.7] max-w-[360px] sm:text-right">
              {t("people.aside")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {proofPoints.map((point, i) => (
            <div
              key={point.label}
              className="reveal border border-border bg-bg-raised px-6 py-7"
              style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}
            >
              <div className="font-display text-[1.85rem] font-bold text-accent leading-none mb-2">
                {point.value}
              </div>
              <div className="font-mono text-[0.62rem] tracking-[0.12em] uppercase text-fg-4 leading-[1.6]">
                {point.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {organizers.map((person, i) => (
            <PersonCard key={person.name} {...person} size="lg" index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
