"use client";
import ScrollReveal from "./ScrollReveal";
import { useLang } from "@/context/LanguageContext";

export default function Message() {
  const { t } = useLang();
  const msg = t("message") as {
    subtitle: string;
    title: string;
    paragraphs: string[];
    signature: string;
  };

  const titleParts = msg.title.split("\n");

  return (
    <section
      className="text-center"
      style={{
        padding: "72px 20px",
        background: "var(--cream)",
        maxWidth: 540,
        margin: "0 auto",
      }}
    >
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
          {msg.subtitle}
        </p>

        <h2
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(28px, 7vw, 44px)",
            fontWeight: 400,
            color: "var(--text-dark)",
            lineHeight: 1.2,
            marginBottom: "2rem",
          }}
        >
          {titleParts.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h2>

        <div className="divider" style={{ marginBottom: "2rem" }} />

        {msg.paragraphs.map((p, i) => (
          <p
            key={i}
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "clamp(14px, 3.5vw, 16px)",
              lineHeight: 1.75,
              color: "var(--text-mid)",
              marginBottom: "1.4rem",
            }}
          >
            {p}
          </p>
        ))}

        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(18px, 5vw, 24px)",
            fontWeight: 400,
            color: "var(--dusty-rose)",
            letterSpacing: "0.04em",
          }}
        >
          {msg.signature}
        </p>
      </ScrollReveal>
    </section>
  );
}
