"use client";
import { useState, useRef } from "react";
import ScrollReveal from "./ScrollReveal";
import { useLang } from "@/context/LanguageContext";

interface FormData {
  name: string;
  attendance: "yes" | "no" | "later" | "";
  children: "no" | "yes" | "";
  childrenCount: string;
  drinks: string[];
  food: string[];
}

const INITIAL: FormData = {
  name: "",
  attendance: "",
  children: "no",
  childrenCount: "",
  drinks: [],
  food: [],
};

export default function RSVPForm() {
  const { lang, t, cfg } = useLang();
  const r = t("rsvp") as Record<string, string>;
  const drinks = cfg.rsvp.drinks;

  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = r.nameError;
    if (!form.attendance) e.attendance = r.attendanceError;
    if (form.drinks.length === 0) e.drinks = r.drinksError;
    return e;
  };

  const shakeField = (field: HTMLElement | null) => {
    if (!field) return;
    field.classList.remove("shake");
    void field.offsetWidth;
    field.classList.add("shake");
    setTimeout(() => field.classList.remove("shake"), 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (blocked) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      if (errs.name && nameRef.current) shakeField(nameRef.current);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("server error");
      setSuccess(true);
      setBlocked(true);
      setTimeout(() => setBlocked(false), 45000);
    } catch {
      alert(r.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleDrink = (idx: number) => {
    const drinkName = drinks[idx].name.ru;
    setForm((f) => ({
      ...f,
      drinks: f.drinks.includes(drinkName) ? f.drinks.filter((x) => x !== drinkName) : [...f.drinks, drinkName],
    }));
    setErrors((e) => ({ ...e, drinks: undefined }));
  };

  const foods = cfg.rsvp.food;

  const toggleFood = (idx: number) => {
    const foodName = foods[idx].name.ru;
    setForm((f) => ({
      ...f,
      food: f.food.includes(foodName) ? f.food.filter((x) => x !== foodName) : [...f.food, foodName],
    }));
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-montserrat), sans-serif",
    fontSize: "clamp(11px, 2.8vw, 13px)",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--text-mid)",
    display: "block",
    marginBottom: "0.6rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    border: "1.5px solid var(--champagne)",
    borderRadius: 12,
    background: "#fff",
    fontFamily: "var(--font-montserrat), sans-serif",
    fontSize: "clamp(13px, 3.5vw, 15px)",
    color: "var(--text-dark)",
    outline: "none",
    transition: "border-color 0.25s",
  };

  const radioStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
    border: "1.5px solid var(--champagne)",
    borderRadius: 12,
    background: "#fff",
    cursor: "pointer",
    transition: "border-color 0.25s, background 0.25s",
    fontFamily: "var(--font-montserrat), sans-serif",
    fontSize: "clamp(13px, 3.5vw, 15px)",
    color: "var(--text-dark)",
    marginBottom: 8,
  };

  if (success) {
    return (
      <section style={{ padding: "72px 20px", background: "var(--cream)" }}>
        <div
          className="modal-enter"
          style={{
            maxWidth: 400,
            margin: "0 auto",
            background: "#fff",
            borderRadius: 24,
            padding: "48px 32px",
            textAlign: "center",
            boxShadow: "0 8px 40px rgba(107,79,58,0.12)",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: "1rem" }}>🌸</div>
          <h3
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(24px, 7vw, 34px)",
              fontWeight: 400,
              color: "var(--text-dark)",
              marginBottom: "0.8rem",
            }}
          >
            {r.successTitle}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "clamp(13px, 3.5vw, 15px)",
              color: "var(--text-mid)",
              lineHeight: 1.7,
            }}
          >
            {r.successMessage}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "72px 20px", background: "var(--cream)" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
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
              {r.subtitle}
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "clamp(28px, 7vw, 44px)",
                fontWeight: 400,
                color: "var(--text-dark)",
              }}
            >
              {r.title}
            </h2>
            <div className="divider" style={{ marginTop: "1.2rem", marginBottom: "0.5rem" }} />
            <p
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "clamp(12px, 3vw, 14px)",
                color: "var(--text-mid)",
                marginTop: "1rem",
              }}
            >
              {r.description}
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
            noValidate
          >
            {/* Name */}
            <div>
              <label style={labelStyle}>{r.nameLabel}</label>
              <input
                ref={nameRef}
                style={{
                  ...inputStyle,
                  borderColor: errors.name ? "#e07070" : "var(--champagne)",
                }}
                placeholder={r.namePlaceholder}
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }));
                  setErrors((err) => ({ ...err, name: undefined }));
                }}
              />
              {errors.name && (
                <p style={{ color: "#e07070", fontSize: 12, marginTop: 4 }}>{errors.name}</p>
              )}
            </div>

            {/* Attendance */}
            <div>
              <label style={labelStyle}>{r.attendanceLabel}</label>
              {[
                { val: "yes", label: r.attendanceYes },
                { val: "no", label: r.attendanceNo },
                { val: "later", label: r.attendanceLater },
              ].map((opt) => (
                <div
                  key={opt.val}
                  onClick={() => {
                    setForm((f) => ({ ...f, attendance: opt.val as FormData["attendance"] }));
                    setErrors((e) => ({ ...e, attendance: undefined }));
                  }}
                  style={{
                    ...radioStyle,
                    borderColor:
                      form.attendance === opt.val ? "var(--dusty-rose)" : "var(--champagne)",
                    background: form.attendance === opt.val ? "#fdf4f1" : "#fff",
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `2px solid ${form.attendance === opt.val ? "var(--dusty-rose)" : "var(--champagne)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "border-color 0.2s",
                    }}
                  >
                    {form.attendance === opt.val && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "var(--dusty-rose)",
                        }}
                      />
                    )}
                  </div>
                  {opt.label}
                </div>
              ))}
              {errors.attendance && (
                <p style={{ color: "#e07070", fontSize: 12, marginTop: 4 }}>{errors.attendance}</p>
              )}
            </div>

            {/* Children */}
            <div>
              <label style={labelStyle}>{r.childrenLabel}</label>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { val: "no", label: r.childrenNo },
                  { val: "yes", label: r.childrenYes },
                ].map((opt) => (
                  <div
                    key={opt.val}
                    onClick={() => setForm((f) => ({ ...f, children: opt.val as "yes" | "no" }))}
                    style={{
                      ...radioStyle,
                      marginBottom: 0,
                      flex: 1,
                      justifyContent: "center",
                      borderColor:
                        form.children === opt.val ? "var(--dusty-rose)" : "var(--champagne)",
                      background: form.children === opt.val ? "#fdf4f1" : "#fff",
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
              {form.children === "yes" && (
                <input
                  style={{ ...inputStyle, marginTop: 10 }}
                  placeholder={r.childrenPlaceholder}
                  value={form.childrenCount}
                  onChange={(e) => setForm((f) => ({ ...f, childrenCount: e.target.value }))}
                />
              )}
            </div>

            {/* Drinks */}
            <div>
              <label style={labelStyle}>{r.drinksLabel}</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {drinks.map((d: { name: Record<string, string> }, idx: number) => {
                  const drinkName = d.name.ru;
                  const isSelected = form.drinks.includes(drinkName);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDrink(idx)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 50,
                        border: `1.5px solid ${isSelected ? "var(--dusty-rose)" : "var(--champagne)"}`,
                        background: isSelected ? "#fdf4f1" : "#fff",
                        color: isSelected ? "var(--dusty-rose)" : "var(--text-mid)",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "clamp(12px, 3vw, 13px)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        minHeight: 44,
                      }}
                    >
                      {d.name[lang]}
                    </button>
                  );
                })}
              </div>
              {errors.drinks && (
                <p style={{ color: "#e07070", fontSize: 12, marginTop: 4 }}>{errors.drinks}</p>
              )}
            </div>

            {/* Food (multi-select, like drinks) */}
            <div>
              <label style={labelStyle}>{r.foodLabel}</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {foods.map((f: { name: Record<string, string> }, idx: number) => {
                  const foodName = f.name.ru;
                  const isSelected = form.food.includes(foodName);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleFood(idx)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 50,
                        border: `1.5px solid ${isSelected ? "var(--dusty-rose)" : "var(--champagne)"}`,
                        background: isSelected ? "#fdf4f1" : "#fff",
                        color: isSelected ? "var(--dusty-rose)" : "var(--text-mid)",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "clamp(12px, 3vw, 13px)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        minHeight: 44,
                      }}
                    >
                      {f.name[lang]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-rose"
              disabled={loading || blocked}
              style={{
                marginTop: 8,
                opacity: loading ? 0.7 : 1,
                cursor: loading || blocked ? "not-allowed" : "pointer",
              }}
            >
              {loading ? r.submitting : r.submitButton}
            </button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
