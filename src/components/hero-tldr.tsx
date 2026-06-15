import { useMemo } from "react";

import { useTranslation } from "../context/language-context";
import type { TranslationKey } from "../i18n/translations";

const TLDR_ITEM_KEYS = [
  "hero.tldr.item1",
  "hero.tldr.item2",
  "hero.tldr.item3",
  "hero.tldr.item4",
] as const satisfies readonly TranslationKey[];

export function HeroTldr() {
  const { t } = useTranslation();
  const items = useMemo(() => TLDR_ITEM_KEYS.map((key) => t(key)), [t]);

  return (
    <aside
      className="mt-6 border border-border-faint border-l-2 border-l-accent/70 bg-bg-raised/35 px-4 py-4 sm:px-5 sm:py-5"
      aria-label={t("hero.tldr.aria")}
    >
      <p className="font-mono text-[0.6rem] tracking-[0.22em] uppercase text-accent mb-3">
        {t("hero.tldr.label")}
      </p>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={TLDR_ITEM_KEYS[i]} className="grid grid-cols-[auto_1fr] gap-x-3">
            <span aria-hidden className="font-mono text-[0.65rem] text-fg-5 pt-0.5">
              —
            </span>
            <span className="font-display text-sm text-fg-2 leading-[1.65]">{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
