"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLang } from "@/context/LanguageContext";

const ADMIN_KEY = "wedding_admin";

export function useIsAdmin() {
  const searchParams = useSearchParams();
  const adminParam = searchParams.get("admin");

  useEffect(() => {
    // ?admin=1 activates admin mode, ?admin=0 deactivates
    if (adminParam === "1") {
      localStorage.setItem(ADMIN_KEY, "1");
      return;
    }

    if (adminParam === "0") {
      localStorage.removeItem(ADMIN_KEY);
    }
  }, [adminParam]);

  if (adminParam === "1") return true;
  if (adminParam === "0") return false;
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_KEY) === "1";
}
export default function LanguageToggle() {
  const { lang, toggleLang, settings } = useLang();
  const pathname = usePathname();
  const isConstructorPage = pathname === "/constructor";
  const isAdmin = useIsAdmin();

  // Toggle can be disabled in domains.json -> settings.languageToggle = false
  if (!settings.languageToggle) return null;

  return (
    <>
      {!isConstructorPage && isAdmin ? (
        <a
          href="/constructor"
          aria-label="Go to constructor"
          style={{
            position: "fixed",
            top: 16,
            right: 70,
            zIndex: 1000,
            padding: "8px 12px",
            borderRadius: 50,
            border: "1.5px solid rgba(184,134,122,0.35)",
            background: "rgba(250,247,242,0.9)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            cursor: "pointer",
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.08em",
            color: "var(--dusty-rose)",
            transition: "background 0.25s, box-shadow 0.25s",
            display: "flex",
            alignItems: "center",
            gap: 6,
            minHeight: 44,
            minWidth: 44,
            justifyContent: "center",
            boxShadow: "0 2px 12px rgba(107,79,58,0.1)",
            textDecoration: "none",
          }}
        >
          ⚙️
        </a>
      ) : (
        <a
          href="/"
          aria-label="Back to invite"
          style={{
            position: "fixed",
            top: 16,
            right: 70,
            zIndex: 1000,
            padding: "8px 12px",
            borderRadius: 50,
            border: "1.5px solid rgba(184,134,122,0.35)",
            background: "rgba(250,247,242,0.9)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            cursor: "pointer",
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.08em",
            color: "var(--dusty-rose)",
            transition: "background 0.25s, box-shadow 0.25s",
            display: "flex",
            alignItems: "center",
            gap: 6,
            minHeight: 44,
            minWidth: 44,
            justifyContent: "center",
            boxShadow: "0 2px 12px rgba(107,79,58,0.1)",
            textDecoration: "none",
          }}
        >
          ←
        </a>
      )}

      <button
        onClick={toggleLang}
        aria-label="Toggle language"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1000,
          padding: "8px 14px",
          borderRadius: 50,
          border: "1.5px solid rgba(184,134,122,0.35)",
          background: "rgba(250,247,242,0.9)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          cursor: "pointer",
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.08em",
          color: "var(--dusty-rose)",
          transition: "background 0.25s, box-shadow 0.25s",
          display: "flex",
          alignItems: "center",
          gap: 6,
          minHeight: 44,
          minWidth: 44,
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(107,79,58,0.1)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="var(--dusty-rose)" strokeWidth="1.2" />
          <ellipse cx="7" cy="7" rx="3" ry="6" stroke="var(--dusty-rose)" strokeWidth="1" />
          <path d="M1 7h12" stroke="var(--dusty-rose)" strokeWidth="1" />
        </svg>
        {lang === "ru" ? "RO" : "RU"}
      </button>
    </>
  );
}

