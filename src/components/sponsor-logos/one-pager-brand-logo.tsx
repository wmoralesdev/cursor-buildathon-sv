import type { BrandLogoProps } from "./logo-props";
import { CodexLogo } from "./codex-logo";
import { CursorLockup } from "./cursor-lockup";
import { N8nLogo } from "./n8n-logo";
import { NubiworkLogo } from "./nubiwork-logo";
import { YonjobLogo } from "./yonjob-logo";
import type { OnePagerSponsorLogoId } from "./sponsor-logo-ids";

/** Single component for ESLint/static-components compliance (avoid dynamic component lookups). */
export function OnePagerBrandLogo({
  id,
  ...props
}: BrandLogoProps & { id: OnePagerSponsorLogoId }) {
  switch (id) {
    case "cursor":
      return <CursorLockup {...props} />;
    case "n8n":
      return <N8nLogo {...props} />;
    case "codex":
      return <CodexLogo {...props} />;
    case "yonjob":
      return <YonjobLogo {...props} />;
    case "nubiwork":
      return <NubiworkLogo {...props} />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
