"use client";
import ScrollReveal from "./ScrollReveal";
import { useLang } from "@/context/LanguageContext";

export default function Final() {
  const { t, cfg } = useLang();
  const f = t("final") as Record<string, string>;
  const hero = t("hero") as Record<string, string>;

  return (
    <section
      style={{
        padding: "80px 20px",
        background: "linear-gradient(160deg, #ede0d4 0%, #fdf6ef 100%)",
        textAlign: "center",
        paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
      }}
    >
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <ScrollReveal stagger>
          {/* Decorative top */}
          {/* <div style={{ marginBottom: "2rem", opacity: 0.6 }}>
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
              <path
                d="M30 36c0 0-20-12-20-24a20 20 0 0 1 40 0c0 12-20 24-20 24z"
                stroke="var(--dusty-rose)"
                strokeWidth="1.5"
                fill="var(--dusty-rose)"
                fillOpacity="0.15"
              />
            </svg>
          </div> */}

          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(13px, 3.5vw, 16px)",
              fontWeight: 400,
              color: "var(--dusty-rose)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            {f.withLove}
          </p>

          <h2
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(36px, 10vw, 58px)",
              fontWeight: 300,
              color: "var(--text-dark)",
              lineHeight: 1.1,
              letterSpacing: "0.03em",
              marginBottom: "1.5rem",
            }}
          >
            {hero.name1}
            <br />
            &amp;&nbsp;{hero.name2}
          </h2>

          <div className="divider" style={{ marginBottom: "1.5rem" }} />

          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(18px, 5vw, 24px)",
              fontWeight: 300,
              color: "var(--text-mid)",
              letterSpacing: "0.1em",
              marginBottom: "2rem",
            }}
          >
            {cfg.couple.dateShort}
          </p>

          <p
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "clamp(12px, 3vw, 14px)",
              color: "var(--rose)",
              lineHeight: 1.7,
              whiteSpace: "pre-line",
            }}
          >
            {f.message}
          </p>

          {/* Bottom decorative line */}
          <div
            style={{
              marginTop: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <div style={{ height: 1, width: 40, background: "var(--champagne)" }} />
            <span style={{ color: "var(--dusty-rose)", fontSize: 14 }}>♡</span>
            <div style={{ height: 1, width: 40, background: "var(--champagne)" }} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
