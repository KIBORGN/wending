"use client";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { useLang } from "@/context/LanguageContext";

export default function Contacts() {
  const { lang, t, cfg } = useLang();
  const c = t("contacts") as Record<string, string>;
  const contacts = cfg.contacts;

  return (
    <section style={{ padding: "72px 20px", background: "var(--blush)" }}>
      <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {contacts.map((ct: { name: Record<string, string>; role: Record<string, string>; emoji: string; photo?: string; telegram: string; phone: string }, i: number) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: "32px 16px",
                  boxShadow: "0 2px 16px rgba(107,79,58,0.07)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {/* Photo or Avatar */}
                {ct.photo ? (
                  <div
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: 12,
                      overflow: "hidden",
                      marginTop: "-8px",
                      marginBottom: "8px",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={ct.photo}
                      alt={ct.name[lang]}
                      width={150}
                      height={150}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--champagne), var(--rose))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                    }}
                  >
                    {ct.emoji}
                  </div>
                )}

                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "clamp(18px, 5vw, 22px)",
                      fontWeight: 500,
                      color: "var(--text-dark)",
                    }}
                  >
                    {ct.name[lang]}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--dusty-rose)",
                    }}
                  >
                    {ct.role[lang]}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                  <a
                    href={ct.phone}
                    className="btn-outline"
                    style={{
                      textDecoration: "none",
                      fontSize: 11,
                      padding: "9px 14px",
                      width: "90%",
                      marginTop: "8px",
                    }}
                  >
                    {c.call}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
