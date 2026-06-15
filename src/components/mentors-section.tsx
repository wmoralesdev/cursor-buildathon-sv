import { MENTORS } from "../data/mentors";
import { EventRosterSection } from "./event-roster-section";

export function MentorsSection() {
  return (
    <EventRosterSection
      id="mentors"
      tagKey="mentors.tag"
      title1Key="mentors.title1"
      title2Key="mentors.title2"
      asideKey="mentors.aside"
      placeholderNameKey="mentors.placeholderName"
      entries={MENTORS}
    />
  );
}
