import type { ReactNode } from "react";

import { ORGANIZER_EMAIL } from "../constants";

export function OnePagerDeadlineBodyText({ text }: { text: string }): ReactNode {
  const parts = text.split(ORGANIZER_EMAIL);
  if (parts.length === 1) {
    return text;
  }

  return parts.flatMap((part, index) => {
    const nodes: ReactNode[] = [part];
    if (index < parts.length - 1) {
      nodes.push(
        <strong key={`email-${index}`} className="font-semibold">
          {ORGANIZER_EMAIL}
        </strong>,
      );
    }
    return nodes;
  });
}
