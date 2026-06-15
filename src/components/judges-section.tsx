import { JUDGES } from "../data/judges";
import { EventRosterSection } from "./event-roster-section";

export function JudgesSection() {
  return (
    <EventRosterSection
      id="judges"
      tagKey="judges.tag"
      title1Key="judges.title1"
      title2Key="judges.title2"
      asideKey="judges.aside"
      placeholderNameKey="judges.placeholderName"
      entries={JUDGES}
    />
  );
}
