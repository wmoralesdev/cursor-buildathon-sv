import { Link } from "react-router-dom";
import { SignInButton, UserButton, useAuth } from "@clerk/react";

import { CursorLockup } from "./sponsor-logos";
import { isClerkConfigured } from "../lib/convex-clerk-provider";
import { useTranslation } from "../context/language-context";

const loginButtonClassName =
  "shrink-0 rounded-none border border-border-faint px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-fg-4 transition-colors hover:border-accent/50 hover:text-accent sm:px-4 sm:py-2.5";

function SiteNavAuthActions() {
  const { isSignedIn } = useAuth();
  const { t } = useTranslation();

  if (isSignedIn) {
    return <UserButton />;
  }

  return (
    <SignInButton mode="modal">
      <button type="button" className={loginButtonClassName}>
        {t("builder.hero.ctaLogin")}
      </button>
    </SignInButton>
  );
}

export function SiteNav() {
  const { t } = useTranslation();

  return (
    <nav className="relative z-20 mx-auto flex w-full max-w-[1400px] flex-col gap-4 py-4 section-padding sm:flex-row sm:items-center sm:justify-between sm:gap-y-0 sm:py-6">
      <Link
        to="/"
        aria-label="Cursor Buildathon home"
        className="inline-flex shrink-0 self-start sm:self-auto"
      >
        <CursorLockup alt="Cursor" className="h-6 w-auto object-contain sm:h-7" />
      </Link>

      <div className="flex items-center justify-end">
        {isClerkConfigured ? (
          <SiteNavAuthActions />
        ) : (
          <button type="button" disabled className={`${loginButtonClassName} opacity-50`}>
            {t("builder.hero.ctaLogin")}
          </button>
        )}
      </div>
    </nav>
  );
}
