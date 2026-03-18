import type React from "react";
import { createContext, useContext, useState } from "react";
import translations, {
  type Language,
  type TranslationKey,
} from "../i18n/translations";

const LS_KEY = "iamthelaw_language";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(LS_KEY) as Language | null;
    return stored && ["en", "es", "pl", "mt"].includes(stored) ? stored : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LS_KEY, lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] ?? translations.en[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
