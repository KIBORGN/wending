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
          linear-gradient(160deg, rgba(253,246,239,0.2) 0%, rgba(245,232,220,0.2) 50%, rgba(237,224,212,0.2) 100%),
          url("/back.png")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center 70%",
        borderRadius: 0,
        padding: "0 24px",
      }}
    >
      {/* Floating decorative circles */}
      <div
        className="float-anim absolute rounded-full opacity-25"
        style={{
          width: 180,
          height: 180,
          background: "radial-gradient(circle, #e8c4b0 0%, transparent 70%)",
          top: "8%",
          left: "-8%",
          animationDelay: "0s",
        }}
      />
      <div
        className="float-anim absolute rounded-full opacity-15"
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
        className="stagger-children relative z-10"
        style={{ maxWidth: 380 }}
      >
        <p
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "clamp(10px, 2.5vw, 12px)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#ebe3db",
            marginBottom: "1.2rem",
          }}
        >
          {hero.preTitle}
        </p>

        <h1
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(44px, 13vw, 80px)",
            fontWeight: 300,
            lineHeight: 1.05,
            color: "var(--text-dark)",
            letterSpacing: "0.02em",
          }}
        >
          {hero.name1}
          <br />
          <span
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "clamp(16px, 4vw, 20px)",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#ebe3db",
            }}
          >
            &amp;
          </span>
          <br />
          {hero.name2}
        </h1>

        <div className="divider" style={{ margin: "2rem auto" }} />

        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(18px, 5vw, 26px)",
            fontWeight: 400,
            color: "#ebe3db",
            letterSpacing: "0.15em",
            marginBottom: "3rem",
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
            opacity: 0.5,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#ebe3db",
            }}
          >
            {hero.scrollHint}
          </p>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4v12M4 10l6 6 6-6"
              stroke="#ebe3db"
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
