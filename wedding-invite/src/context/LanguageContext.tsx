"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import siteConfig from "@/config/site.json";

type Lang = "ru" | "ro";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (section: string) => Record<string, unknown>;
  cfg: typeof siteConfig;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const defaultLang = (siteConfig.settings.defaultLanguage || "ru") as Lang;
  const [lang, setLang] = useState<Lang>(defaultLang);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "ru" ? "ro" : "ru"));
  }, []);

  const t = useCallback(
    (section: string) => {
      const content = siteConfig.content[lang];
      return (content as Record<string, Record<string, unknown>>)[section] ?? {};
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, cfg: siteConfig }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
