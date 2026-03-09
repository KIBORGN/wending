"use client";
import { useState, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";
import { useLang } from "@/context/LanguageContext";

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const { lang } = useLang();
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const [day, month, year] = targetDate.split(".").map(Number);
    const target = new Date(year, month - 1, day, 12, 0, 0).getTime();

    const update = () => {
      const now = Date.now();
      const delta = target - now;
      if (delta <= 0) {
        setIsPast(true);
        setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setDiff({
        days: Math.floor(delta / 86400000),
        hours: Math.floor((delta % 86400000) / 3600000),
        minutes: Math.floor((delta % 3600000) / 60000),
        seconds: Math.floor((delta % 60000) / 1000),
      });
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const labelsRu = ["дней", "часов", "минут", "секунд"];
  const labelsRo = ["zile", "ore", "minute", "secunde"];
  const labels = lang === "ro" ? labelsRo : labelsRu;

  if (isPast) {
    return (
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "clamp(24px, 7vw, 36px)",
          fontWeight: 400,
          color: "var(--dusty-rose)",
          margin: "2rem 0",
        }}
      >
        {lang === "ro" ? "Astăzi este ziua!" : "Уже сегодня!"}
      </p>
    );
  }

  const values = [diff.days, diff.hours, diff.minutes, diff.seconds];

  return (
    <div className="countdown-wrap">
      {values.map((v, i) => (
        <div key={i} className="countdown-unit">
          <span className="countdown-value">{String(v).padStart(2, "0")}</span>
          <span className="countdown-label">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function Final() {
  const { t, cfg } = useLang();
  const f = t("final") as Record<string, string>;
  const hero = t("hero") as Record<string, string>;

  return (
    <section
      className="ribbon-section"
      style={{
        position: "relative",
        background: "linear-gradient(160deg, #ede0d4 0%, #fdf6ef 100%)",
        textAlign: "center",
        borderRadius: 0,
        paddingBottom: "calc(64px + env(safe-area-inset-bottom))",
      }}
    >
      {/* Decorative flowers under timer */}
      <div
        style={{
          position: "absolute",
          left: "-30px",
          bottom: "150px",
          width: "150px",
          height: "150px",
          opacity: 0.38,
          zIndex: 15,
          pointerEvents: "none",
          maskImage: "url('/3.png')",
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskImage: "url('/3.png')",
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          backgroundColor: "var(--warm-brown)",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: "-30px",
          bottom: "150px",
          width: "160px",
          height: "160px",
          opacity: 0.38,
          zIndex: 15,
          pointerEvents: "none",
          transform: "scaleX(-1)",
          maskImage: "url('/3.png')",
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskImage: "url('/3.png')",
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          backgroundColor: "var(--warm-brown)",
        }}
      />

      <div>
        <ScrollReveal stagger>
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
              marginBottom: "0.5rem",
            }}
          >
            {cfg.couple.dateShort}
          </p>

          <CountdownTimer targetDate={cfg.couple.date} />

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
