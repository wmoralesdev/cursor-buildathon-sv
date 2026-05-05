import { useRef, type FormEvent } from "react";
import { useFormContext } from "react-hook-form";

import type { WelcomeFormValues } from "../pages/buildathon-welcome-types";
import { useTranslation } from "../context/language-context";
import { WelcomeFormFields } from "./welcome-form-fields";
import {
  type WelcomeVideoRenderActionsHandle,
  WelcomeVideoRenderActions,
} from "./welcome-video-render-actions";

type Props = {
  inviteToken: string | null;
};

export function BuildathonWelcomeForm({ inviteToken }: Props) {
  const { t } = useTranslation();
  const { getValues } = useFormContext<WelcomeFormValues>();
  const videoActionsRef = useRef<WelcomeVideoRenderActionsHandle | null>(null);

  function onFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = getValues();
    if (!values.handle.trim() || !values.photo) {
      return;
    }
    void videoActionsRef.current?.start(values);
  }

  return (
    <header className="w-full max-w-xl">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-fg-4 sm:text-[0.65rem] sm:tracking-[0.2em]">
        {t("welcome.kicker")}
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-fg leading-[1.08] sm:mt-3 sm:text-4xl md:text-5xl sm:leading-[1.05]">
        {t("welcome.title")}
      </h1>
      <p className="mt-3 max-w-[55ch] text-sm leading-snug text-fg-3 sm:mt-4 sm:text-base sm:leading-relaxed">
        {t("welcome.lead")}
      </p>

      <form className="mt-8 space-y-5 sm:mt-10 sm:space-y-6" onSubmit={onFormSubmit} noValidate>
        <WelcomeFormFields />

        {!inviteToken ? (
          <p className="text-xs leading-snug text-fg-4 sm:text-sm sm:leading-relaxed">{t("welcome.invite.emailLink")}</p>
        ) : null}

        <WelcomeVideoRenderActions ref={videoActionsRef} />

        <p className="text-[0.65rem] leading-snug text-fg-5 sm:text-xs sm:leading-normal">{t("welcome.footer")}</p>
      </form>
    </header>
  );
}
