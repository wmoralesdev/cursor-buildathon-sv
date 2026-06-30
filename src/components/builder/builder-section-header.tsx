import { AnchorHeading } from "../anchor-heading";
import { useTranslation } from "../../context/language-context";
import type { TranslationKey } from "../../i18n/translations";

interface BuilderSectionHeaderProps {
  id: string;
  tagKey: TranslationKey;
  title1Key: TranslationKey;
  title2Key: TranslationKey;
  asideKey: TranslationKey;
}

export function BuilderSectionHeader({
  id,
  tagKey,
  title1Key,
  title2Key,
  asideKey,
}: BuilderSectionHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="reveal mb-12 grid gap-6 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <span className="tag mb-4 inline-block">{t(tagKey)}</span>
        <AnchorHeading id={id}>
          <h2 className="font-display font-medium text-fg tracking-[-0.02em] leading-[1] text-[clamp(2rem,4.4vw,3.4rem)]">
            {t(title1Key)}
            <br />
            <span className="text-accent">{t(title2Key)}</span>
          </h2>
        </AnchorHeading>
      </div>
      <p className="md:col-span-5 font-display text-lg text-fg-3 leading-[1.7] max-w-[40ch] md:text-right md:ml-auto">
        {t(asideKey)}
      </p>
    </header>
  );
}
