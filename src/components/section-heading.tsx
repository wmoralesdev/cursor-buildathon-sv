import type { TranslationKey } from "../i18n/translations";
import { useTranslation } from "../context/language-context";

interface SectionHeadingProps {
  label: TranslationKey;
  title: TranslationKey;
  lineNumber?: string;
}

export function SectionHeading({ label, title, lineNumber = "01" }: SectionHeadingProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-12 md:mb-16">
      <p
        className="line-number mb-4 font-mono text-xs tracking-widest uppercase text-text-muted"
        data-line={lineNumber}
      >
        {t(label)}
      </p>
      <h2 className="font-display text-4xl leading-tight font-bold tracking-tight md:text-5xl lg:text-6xl whitespace-pre-line">
        {t(title)}
      </h2>
    </div>
  );
}
