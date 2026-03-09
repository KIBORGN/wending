"use client";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { useLang } from "@/context/LanguageContext";

export default function Contacts() {
  const { t, cfg } = useLang();
  const c = t("contacts") as Record<string, string>;
  const hero = t("hero") as Record<string, string>;
  const couple = cfg.couple;

  return (
    <section className="ribbon-section ribbon-section--alt" style={{ position: "relative" }}>

      <div style={{ textAlign: "center" }}>
        <ScrollReveal stagger>
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
            {c.subtitle}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(28px, 7vw, 44px)",
              fontWeight: 400,
              color: "var(--text-dark)",
              marginBottom: "2rem",
            }}
          >
            {c.title}
          </h2>
          <div className="divider" style={{ marginBottom: "2.5rem" }} />

          {/* Single combined card */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "26px 24px",
              boxShadow: "0 2px 16px rgba(107,79,58,0.07)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Single couple photo */}
            {couple.couplePhoto && (
              <div
                style={{
                  width: "100%",
                  height: 280,
                  borderRadius: 12,
                  overflow: "hidden",
                  position: "relative",
                  marginBottom: 4,
                }}
              >
                <Image
                  src={couple.couplePhoto}
                  alt={`${hero.name1} & ${hero.name2}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}

            {/* Combined names */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(20px, 5vw, 26px)",
                  fontWeight: 500,
                  color: "var(--text-dark)",
                }}
              >
                {hero.name1}&nbsp;&amp;&nbsp;{hero.name2}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--dusty-rose)",
                  marginTop: 4,
                }}
              >
                {c.role1}&nbsp;&amp;&nbsp;{c.role2}
              </p>
            </div>

            {/* Two call buttons — stacked */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                width: "100%",
                marginTop: 8,
              }}
            >
              <a
                href={couple.phone1}
                className="btn-outline"
                style={{
                  textDecoration: "none",
                  fontSize: 11,
                  padding: "9px 14px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                📞 {hero.name1}
              </a>
              <a
                href={couple.phone2}
                className="btn-outline"
                style={{
                  textDecoration: "none",
                  fontSize: 11,
                  padding: "9px 14px",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                📞 {hero.name2}
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
