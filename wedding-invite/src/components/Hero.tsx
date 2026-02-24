"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";

export default function Hero() {
  const titleRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();
  const hero = t("hero") as { preTitle: string; name1: string; name2: string; date: string; scrollHint: string };

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    setTimeout(() => el.classList.add("visible"), 100);
  }, []);

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center overflow-hidden"
      style={{
        minHeight: "100svh",
        backgroundImage: `
          linear-gradient(160deg, rgba(253, 246, 239, 0.45) 0%, rgba(245, 232, 220, 0.45) 50%, rgba(237, 224, 212, 0.45) 100%),
          url("/back.jpg")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center 70%",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Floating decorative circles */}
      <div
        className="float-anim absolute rounded-full opacity-30"
        style={{
          width: 220,
          height: 220,
          background: "radial-gradient(circle, #e8c4b0 0%, transparent 70%)",
          top: "8%",
          left: "-8%",
          animationDelay: "0s",
        }}
      />
      <div
        className="float-anim absolute rounded-full opacity-20"
        style={{
          width: 160,
          height: 160,
          background: "radial-gradient(circle, #c9a89a 0%, transparent 70%)",
          bottom: "12%",
          right: "-4%",
          animationDelay: "3s",
        }}
      />
      <div
        className="float-anim absolute rounded-full opacity-15"
        style={{
          width: 100,
          height: 100,
          background: "radial-gradient(circle, #9aab93 0%, transparent 70%)",
          top: "35%",
          right: "6%",
          animationDelay: "1.5s",
        }}
      />

      {/* Main content */}
      <div
        ref={titleRef}
        className="stagger-children relative z-10 px-5"
        style={{ maxWidth: 420 }}
      >
        <p
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "clamp(10px, 2.5vw, 13px)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--dusty-rose)",
            marginBottom: "1.2rem",
          }}
        >
          {hero.preTitle}
        </p>

        <h1
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(48px, 14vw, 88px)",
            fontWeight: 300,
            lineHeight: 1.05,
            color: "var(--text-dark)",
            letterSpacing: "0.02em",
          }}
        >
          {hero.name1}
          <br />
          <span style={{ color: "var(--dusty-rose)" }}>&amp;</span>
          <br />
          {hero.name2}
        </h1>

        <div className="divider" style={{ margin: "1.8rem auto" }} />

        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(18px, 5vw, 26px)",
            fontWeight: 400,
            color: "var(--text-mid)",
            letterSpacing: "0.12em",
            marginBottom: "2.5rem",
          }}
        >
          {hero.date}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: 0.55,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--text-mid)",
            }}
          >
            {hero.scrollHint}
          </p>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4v12M4 10l6 6 6-6"
              stroke="var(--dusty-rose)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
