/* eslint-disable react-refresh/only-export-components -- Provider and hook are coupled; splitting would require exporting context separately */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { translations, type TranslationKey, type Language } from "../i18n/translations";

const STORAGE_KEY = "cursor-buildathon-lang";

function readStoredLanguage(): Language | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "en" || raw === "es") return raw;
  } catch {
    /* ignore */
  }
  return null;
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => readStoredLanguage() ?? "en");

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === "en" ? "es" : "en";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[key]?.[language] ?? key;
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
