"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  domainsConfig,
  getWeddingByDomain,
  type WeddingConfig,
} from "@/config";

type Lang = "ru" | "ro";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (section: string) => Record<string, unknown>;
  cfg: WeddingConfig;
  settings: typeof domainsConfig.settings;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const settings = domainsConfig.settings;
  const defaultLang = (settings.defaultLanguage || "ru") as Lang;
  const [lang, setLang] = useState<Lang>(defaultLang);

  // Resolve wedding config from hostname (runs once on client mount)
  const [wedding] = useState<WeddingConfig>(() =>
    getWeddingByDomain(
      typeof window !== "undefined" ? window.location.hostname : "localhost"
    )
  );

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "ru" ? "ro" : "ru"));
  }, []);

  const t = useCallback(
    (section: string) => {
      const content = wedding.content[lang as keyof typeof wedding.content];
      return (
        (content as Record<string, Record<string, unknown>>)[section] ?? {}
      );
    },
    [lang, wedding]
  );

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, toggleLang, t, cfg: wedding, settings }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
