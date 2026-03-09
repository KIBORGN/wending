"use client";
import ScrollReveal from "./ScrollReveal";
import { useLang } from "@/context/LanguageContext";
import { ReactNode } from "react";

const icons: Record<string, ReactNode> = {
  clock: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke="var(--dusty-rose)" strokeWidth="1.5" />
      <path d="M14 8v6.5l4 2.5" stroke="var(--dusty-rose)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  ceremony: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 22c0 0-9-5.5-9-11a9 9 0 0 1 18 0c0 5.5-9 11-9 11z" stroke="var(--dusty-rose)" strokeWidth="1.5" />
      <path d="M10 11c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="var(--dusty-rose)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  banquet: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M9 6v8a5 5 0 0 0 10 0V6" stroke="var(--dusty-rose)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 19v4M11 23h6" stroke="var(--dusty-rose)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 6v4" stroke="var(--dusty-rose)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 6v4" stroke="var(--dusty-rose)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  cake: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="5" y="14" width="18" height="9" rx="3" stroke="var(--dusty-rose)" strokeWidth="1.5" />
      <rect x="8" y="10" width="12" height="5" rx="2" stroke="var(--dusty-rose)" strokeWidth="1.3" />
      <path d="M14 10V7M11 8c0-1.5 6-1.5 6 0" stroke="var(--dusty-rose)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  end: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke="var(--dusty-rose)" strokeWidth="1.5" />
      <path d="M14 8v6.5l4 2.5" stroke="var(--dusty-rose)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export default function Timeline() {
  const { t, cfg } = useLang();
  const tl = t("timeline") as {
    subtitle: string;
    title: string;
    events: { title: string; desc: string }[];
  };

  const eventsMerged = cfg.timeline.events.map((ev, i) => ({
    ...ev,
    title: tl.events[i]?.title ?? "",
    desc: tl.events[i]?.desc ?? "",
    iconNode: icons[ev.icon] ?? icons.clock,
  }));

  return (
    <section className="ribbon-section" style={{ position: "relative" }}>
      {/* Decorative flowers - right side */}
      <div
        style={{
          position: "absolute",
          right: "-60px",
          top: "120px",
          width: "220px",
          height: "220px",
          opacity: 0.38,
          zIndex: 15,
          pointerEvents: "none",
          maskImage: "url('/1.png')",
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskImage: "url('/1.png')",
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          backgroundColor: "var(--dusty-rose)",
        }}
      />

      <div>
        <ScrollReveal stagger>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
              {tl.subtitle}
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "clamp(28px, 7vw, 44px)",
                fontWeight: 400,
                color: "var(--text-dark)",
              }}
            >
              {tl.title}
            </h2>
            <div className="divider" style={{ marginTop: "1.2rem" }} />
          </div>
        </ScrollReveal>

        <ScrollReveal stagger>
          {eventsMerged.map((ev, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
                padding: "20px 0",
                borderBottom: i < eventsMerged.length - 1 ? "1px solid var(--champagne)" : "none",
              }}
            >
              <div style={{ minWidth: 56, textAlign: "right", paddingTop: 2 }}>
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "clamp(18px, 5vw, 22px)",
                    fontWeight: 400,
                    color: "var(--dusty-rose)",
                  }}
                >
                  {ev.time}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--blush)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {ev.iconNode}
                </div>
                {i < eventsMerged.length - 1 && (
                  <div style={{ width: 1, height: 32, background: "var(--champagne)", marginTop: 4 }} />
                )}
              </div>

              <div style={{ flex: 1, paddingTop: 6 }}>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "clamp(17px, 4.5vw, 21px)",
                    fontWeight: 500,
                    color: "var(--text-dark)",
                    marginBottom: "0.3rem",
                  }}
                >
                  {ev.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: "clamp(12px, 3vw, 14px)",
                    color: "var(--text-mid)",
                    lineHeight: 1.6,
                  }}
                >
                  {ev.desc}
                </p>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
