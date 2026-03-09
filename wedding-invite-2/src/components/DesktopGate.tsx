"use client";
import { useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";

export default function DesktopGate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { lang } = useLang();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = window.location.href;
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Simple QR-like pattern (placeholder — use a proper lib in production)
    // We'll generate a real QR via a library-free approach
    generateQR(ctx, url, size);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #fdf6ef 0%, #f2e8e0 50%, #ede0d4 100%)",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      {/* Decorative top flowers (SVG) */}
      <div style={{ marginBottom: 32, opacity: 0.4 }}>
        <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
          <path d="M20 45c0-14 12-25 25-25s25 11 25 25" stroke="#c9a89a" strokeWidth="1.5" fill="none" />
          <circle cx="30" cy="15" r="10" fill="#e8d5d5" opacity="0.5" />
          <circle cx="60" cy="10" r="12" fill="#c9a89a" opacity="0.3" />
          <circle cx="90" cy="18" r="9" fill="#9aab93" opacity="0.4" />
          <path d="M50 50c0-14 12-25 25-25s25 11 25 25" stroke="#9aab93" strokeWidth="1.2" fill="none" />
        </svg>
      </div>

      <h1
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 300,
          color: "var(--text-dark)",
          marginBottom: 16,
          lineHeight: 1.2,
        }}
      >
        {lang === "ru"
          ? "Пожалуйста, откройте сайт\nс мобильного устройства"
          : "Vă rugăm deschideți site-ul\nde pe dispozitivul mobil"}
      </h1>

      <p
        style={{
          fontFamily: "var(--font-montserrat), sans-serif",
          fontSize: 15,
          color: "var(--text-mid)",
          marginBottom: 32,
          lineHeight: 1.7,
          maxWidth: 420,
          whiteSpace: "pre-line",
        }}
      >
        {lang === "ru"
          ? "Наведите камеру вашего телефона на QR-код ниже"
          : "Îndreptați camera telefonului spre codul QR de mai jos"}
      </p>

      {/* QR Code */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 8px 40px rgba(107,79,58,0.1)",
          marginBottom: 32,
        }}
      >
        <canvas ref={canvasRef} style={{ width: 200, height: 200, display: "block" }} />
      </div>

      {/* Decorative bottom */}
      <div style={{ marginTop: 40, opacity: 0.3 }}>
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none">
          <path d="M10 35c0-14 12-25 25-25s25 11 25 25" stroke="#c9a89a" strokeWidth="1.5" fill="none" />
          <circle cx="50" cy="12" r="8" fill="#e8d5d5" opacity="0.5" />
          <circle cx="70" cy="20" r="6" fill="#9aab93" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Minimal QR-code generator (uses the API to create a QR image).
 * Falls back to text if canvas fails.
 */
function generateQR(ctx: CanvasRenderingContext2D, url: string, size: number) {
  // Use a QR code API to load the image
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&margin=0`;
  img.onload = () => {
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
  };
  img.onerror = () => {
    // Fallback: draw placeholder
    ctx.fillStyle = "#f2e8e0";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#6b4f3a";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("QR Code", size / 2, size / 2);
  };
}
