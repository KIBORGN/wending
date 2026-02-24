"use client";
import ScrollReveal from "./ScrollReveal";
import { useLang } from "@/context/LanguageContext";

export default function Venue() {
  const { t, cfg } = useLang();
  const v = t("venue") as {
    subtitle: string;
    description: string;
    address: string;
    mapButton: string;
  };

  return (
    <section
      style={{
        padding: "72px 20px",
        background: "var(--blush)",
      }}
    >
      <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
        <ScrollReveal stagger>
          <p
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "clamp(10px, 2.5vw, 12px)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--dusty-rose)",
              marginBottom: "1.4rem",
            }}
          >
            {v.subtitle}
          </p>

          <h2
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(30px, 8vw, 48px)",
              fontWeight: 400,
              color: "var(--text-dark)",
              lineHeight: 1.15,
              marginBottom: "0.6rem",
            }}
          >
            {cfg.venue.name}
          </h2>

          <div className="divider" style={{ marginBottom: "1.5rem" }} />

          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "18px 14px",
              boxShadow: "0 4px 24px rgba(107,79,58,0.08)",
              marginBottom: "2rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* <div style={{ marginBottom: "1rem" }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="14" r="7" stroke="var(--dusty-rose)" strokeWidth="1.8" />
                <circle cx="16" cy="14" r="3" fill="var(--dusty-rose)" fillOpacity="0.35" />
                <path d="M16 21c-4 4-9 5-9 9h18c0-4-5-5-9-9z" stroke="var(--dusty-rose)" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div> */}
            <div style={{display: "flex", flexDirection: "column"}}>
              <p
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "clamp(13px, 3.2vw, 15px)",
                  color: "var(--text-mid)",
                  lineHeight: 1.6,
                  marginBottom: "0.5rem"
                }}
              >
                {v.description}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "clamp(12px, 3vw, 14px)",
                  color: "var(--rose)",
                  lineHeight: 1.5,
                  whiteSpace: "pre-line",
                }}
              >
                {v.address}
              </p>
            </div>
          </div>

          <a
            href={cfg.venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-rose"
            style={{ textDecoration: "none" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5a5 5 0 0 1 5 5c0 3.5-5 8-5 8S3 10 3 6.5a5 5 0 0 1 5-5z" stroke="#fff" strokeWidth="1.4" />
              <circle cx="8" cy="6.5" r="1.8" fill="#fff" />
            </svg>
            {v.mapButton}
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
