"use client";
import { useEffect, useRef } from "react";
import ScrollReveal from "./ScrollReveal";
import { useLang } from "@/context/LanguageContext";

function PaletteSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { lang, cfg } = useLang();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const dots = container.querySelectorAll<HTMLElement>(".pop-in");
          dots.forEach((dot, i) => {
            setTimeout(() => dot.classList.add("visible"), i * 80);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        gap: 14,
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: "1.5rem",
      }}
    >
      {cfg.dresscode.palette.map((p, i) => (
        <div
          key={i}
          className="pop-in"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: p.color,
              border: "1.5px solid rgba(107,79,58,0.15)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 10,
              color: "var(--text-mid)",
              letterSpacing: "0.05em",
            }}
          >
            {p.name[lang as keyof typeof p.name]}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function DressCode() {
  const { t, cfg } = useLang();
  const dc = t("dresscode") as {
    subtitle: string;
    title: string;
    paletteTitle: string;
    wishes: { title: string; text: string }[];
  };

  return (
    <section className="ribbon-section ribbon-section--alt" style={{ position: "relative" }}>
      {/* Decorative flower - left side */}
      <div
        style={{
          position: "absolute",
          left: "-65px",
          top: "30px",
          width: "190px",
          height: "190px",
          opacity: 0.42,
          zIndex: 15,
          pointerEvents: "none",
          transform: "scaleX(-1)",
          maskImage: "url('/2.png')",
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskImage: "url('/2.png')",
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          backgroundColor: "var(--warm-brown)",
        }}
      />

      <div>
        <ScrollReveal stagger>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "clamp(10px, 2.5vw, 12px)",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--dusty-rose)",
                marginBottom: "1rem",
              }}
            >
              {dc.subtitle}
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "clamp(28px, 7vw, 44px)",
                fontWeight: 400,
                color: "var(--text-dark)",
              }}
            >
              {dc.title}
            </h2>
            <div className="divider" style={{ marginTop: "1.2rem" }} />
          </div>

          {dc.wishes.map((w, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "20px 20px",
                marginBottom: 14,
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                boxShadow: "0 2px 12px rgba(107,79,58,0.06)",
              }}
            >
              <span style={{ fontSize: 24, flexShrink: 0 }}>
                {cfg.dresscode.wishes[i]?.icon ?? "✨"}
              </span>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "clamp(16px, 4.5vw, 20px)",
                    fontWeight: 500,
                    color: "var(--text-dark)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {w.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: "clamp(12px, 3vw, 14px)",
                    color: "var(--text-mid)",
                    lineHeight: 1.65,
                  }}
                >
                  {w.text}
                </p>
              </div>
            </div>
          ))}
        </ScrollReveal>

        <ScrollReveal>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <p
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "clamp(10px, 2.5vw, 12px)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--dusty-rose)",
                marginBottom: "0.5rem",
              }}
            >
              {dc.paletteTitle}
            </p>
            <PaletteSection />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
