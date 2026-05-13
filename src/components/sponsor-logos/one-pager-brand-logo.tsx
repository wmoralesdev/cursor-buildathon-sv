import type { BrandLogoProps } from "./logo-props";
import { AbacoLogo } from "./abaco-logo";
import { CodexLogo } from "./codex-logo";
import { CursorLockup } from "./cursor-lockup";
import { ElevenLabsLogo } from "./elevenlabs-logo";
import { KrealiLogo } from "./kreali-logo";
import { SimovLogo } from "./simov-logo";
import { WerisLogo } from "./weris-logo";
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
    case "abaco":
      return <AbacoLogo {...props} />;
    case "elevenlabs":
      return <ElevenLabsLogo {...props} />;
    case "simov":
      return <SimovLogo {...props} />;
    case "kreali":
      return <KrealiLogo {...props} />;
    case "weris":
      return <WerisLogo {...props} />;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}
