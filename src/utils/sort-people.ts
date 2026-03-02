import type { PersonCardData } from "../components/brief/person-card";

export function sortPeopleByName(people: PersonCardData[]): PersonCardData[] {
  return [...people].sort((a, b) => a.name.localeCompare(b.name, "es"));
}
