"use client";
import ScrollReveal from "./ScrollReveal";
import { useLang } from "@/context/LanguageContext";

/* ---- Mini Calendar ---- */
function MiniCalendar() {
  const { lang, cfg } = useLang();
  // Parse date from config (DD.MM.YYYY)
  const [day, month, year] = cfg.couple.date.split(".").map(Number);

  const monthNames: Record<string, string[]> = {
    ru: ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
    ro: ["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"],
  };
  const dayLabelsRu = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
  const dayLabelsRo = ["Lu","Ma","Mi","Jo","Vi","Sâ","Du"];
  const dayLabels = lang === "ro" ? dayLabelsRo : dayLabelsRu;

  // First day of month (0=Sun, adjust to Mon=0)
  const firstDate = new Date(year, month - 1, 1);
  let startDay = firstDate.getDay() - 1;
  if (startDay < 0) startDay = 6;

  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const mName = monthNames[lang]?.[month - 1] ?? monthNames.ru[month - 1];

  return (
    <div className="mini-calendar" style={{ marginTop: "2rem" }}>
      <div className="mini-calendar-header">
        {mName} {year}
      </div>
      <div className="mini-calendar-grid">
        {dayLabels.map((dl) => (
          <div key={dl} className="mini-calendar-day-label">{dl}</div>
        ))}
        {cells.map((c, i) => (
          <div
            key={i}
            className={`mini-calendar-day${c === day ? " mini-calendar-day--highlight" : ""}`}
          >
            {c ?? ""}
          </div>
        ))}
      </div>
    </div>
  );
}

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
      className="ribbon-section text-center"
      style={{ position: "relative" }}
    >
      {/* Decorative flower - left side */}
      <div
        style={{
          position: "absolute",
          left: "-60px",
          top: "80px",
          width: "200px",
          height: "200px",
          opacity: 0.45,
          zIndex: 15,
          pointerEvents: "none",
          transform: "rotate(30deg)",
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

      {/* Decorative flower - under calendar */}
      <div
        style={{
          position: "absolute",
          right: "-50px",
          bottom: "-80px",
          width: "180px",
          height: "180px",
          opacity: 0.4,
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
          backgroundColor: "var(--dusty-rose)",
        }}
      />

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
              fontSize: "clamp(13px, 3.5vw, 15px)",
              lineHeight: 1.75,
              color: "var(--text-mid)",
              marginBottom: "1.2rem",
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

        <MiniCalendar />
      </ScrollReveal>
    </section>
  );
}
