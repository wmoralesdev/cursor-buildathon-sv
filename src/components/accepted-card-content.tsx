import { AcceptedCardPostContent } from "./accepted-card-post-content";
import { AcceptedCardStoryContent } from "./accepted-card-story-content";
import type { AcceptedCardProps } from "./accepted-card-shared";

export function AcceptedCardContent(props: AcceptedCardProps) {
  return props.format === "post" ? (
    <AcceptedCardPostContent {...props} />
  ) : (
    <AcceptedCardStoryContent {...props} />
  );
}
