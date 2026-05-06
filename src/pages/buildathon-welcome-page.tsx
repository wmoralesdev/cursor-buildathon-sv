import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";

import { BuildathonWelcomeForm } from "../components/buildathon-welcome-form";
import { BuildathonWelcomePreview } from "../components/buildathon-welcome-preview";
import { WelcomeOnboardingModal } from "../components/welcome-onboarding-modal";
import type { WelcomeFormValues } from "./buildathon-welcome-types";

const WELCOME_ONBOARDING_SEEN_KEY = "welcome-onboarding-seen";

function readInitialParam(raw: string | null): string {
  if (!raw) return "";
  try {
    return decodeURIComponent(raw).trim();
  } catch {
    return raw.trim();
  }
}

export function BuildathonWelcomePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t");

  const [welcomeOnboardingOpen, setWelcomeOnboardingOpen] = useState(() => {
    try {
      return typeof window !== "undefined" && sessionStorage.getItem(WELCOME_ONBOARDING_SEEN_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [welcomeOnboardingNonce, setWelcomeOnboardingNonce] = useState(0);

  const reopenWelcomeOnboarding = useCallback(() => {
    setWelcomeOnboardingNonce((n) => n + 1);
    setWelcomeOnboardingOpen(true);
  }, []);

  const dismissWelcomeOnboarding = useCallback(() => {
    try {
      sessionStorage.setItem(WELCOME_ONBOARDING_SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setWelcomeOnboardingOpen(false);
  }, []);

  const defaultValues = useMemo<WelcomeFormValues>(
    () => ({
      handle: readInitialParam(searchParams.get("handle")),
      photo: null,
      isOrganizer: false,
    }),
    [searchParams],
  );

  const methods = useForm<WelcomeFormValues>({
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <WelcomeOnboardingModal
        key={welcomeOnboardingNonce}
        open={welcomeOnboardingOpen}
        onDismiss={dismissWelcomeOnboarding}
      />
      <main className="relative mx-auto w-full max-w-[1400px] overflow-x-hidden section-padding pb-[max(6rem,env(safe-area-inset-bottom,0px))] pt-6 sm:pt-10 lg:pb-24">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[min(90vw,48rem)] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,min(36rem,100%))_minmax(0,1fr)] lg:items-start lg:gap-x-10 xl:gap-x-14">
          <div className="min-w-0">
            <BuildathonWelcomeForm inviteToken={token} onReplayWelcome={reopenWelcomeOnboarding} />
          </div>
          <div className="min-w-0">
            <BuildathonWelcomePreview defaultSnapshot={defaultValues} />
          </div>
        </div>
      </main>
    </FormProvider>
  );
}
