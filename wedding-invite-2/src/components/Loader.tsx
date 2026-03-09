"use client";
import { useEffect, useState } from "react";

const RING_CIRCUMFERENCE = 2 * Math.PI * 44; // r=44 → ≈276.46

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const startFade = () => {
      setFading(true);
      setTimeout(() => setVisible(false), 900);
    };

    const minDelay = setTimeout(() => {
      if (document.readyState === "complete") {
        startFade();
      } else {
        window.addEventListener("load", startFade, { once: true });
      }
    }, 2200);

    return () => clearTimeout(minDelay);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes ring-draw {
          0%   { stroke-dashoffset: ${RING_CIRCUMFERENCE.toFixed(2)}; opacity: 0; }
          15%  { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes ring-draw-2 {
          0%   { stroke-dashoffset: ${RING_CIRCUMFERENCE.toFixed(2)}; opacity: 0; }
          15%  { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.3); }
          50%       { opacity: 1; transform: scale(1); }
        }
        @keyframes loader-text {
          0%   { opacity: 0; letter-spacing: 0.15em; }
          100% { opacity: 1; letter-spacing: 0.35em; }
        }
        .ring-1 {
          stroke-dasharray: ${RING_CIRCUMFERENCE.toFixed(2)};
          stroke-dashoffset: ${RING_CIRCUMFERENCE.toFixed(2)};
          animation: ring-draw 1.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
        }
        .ring-2 {
          stroke-dasharray: ${RING_CIRCUMFERENCE.toFixed(2)};
          stroke-dashoffset: ${RING_CIRCUMFERENCE.toFixed(2)};
          animation: ring-draw-2 1.4s cubic-bezier(0.4, 0, 0.2, 1) 0.55s forwards;
        }
        .spark-1 { animation: sparkle 1.1s ease-in-out 1.55s infinite; }
        .spark-2 { animation: sparkle 1.1s ease-in-out 1.75s infinite; }
        .spark-3 { animation: sparkle 1.1s ease-in-out 1.65s infinite; }
        .loader-label {
          animation: loader-text 1s ease-out 1.2s both;
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf6f1",
          gap: "1.4rem",
          transition: "opacity 0.9s ease",
          opacity: fading ? 0 : 1,
          pointerEvents: fading ? "none" : "all",
        }}
      >
        {/* Rings SVG */}
        <svg
          width="160"
          height="100"
          viewBox="0 0 160 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ring 1 — dusty rose, left */}
          <circle
            className="ring-1"
            cx="66"
            cy="50"
            r="44"
            stroke="#b8867a"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Ring 2 — warm brown, right */}
          <circle
            className="ring-2"
            cx="94"
            cy="50"
            r="44"
            stroke="#6b4f3a"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Sparkles near the intersection */}
          <g className="spark-1">
            <line x1="80" y1="10" x2="80" y2="16" stroke="#c9a882" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="76" y1="13" x2="84" y2="13" stroke="#c9a882" strokeWidth="1.8" strokeLinecap="round"/>
          </g>
          <g className="spark-2" style={{ transformOrigin: "148px 28px" }}>
            <line x1="148" y1="22" x2="148" y2="34" stroke="#c9a882" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="142" y1="28" x2="154" y2="28" stroke="#c9a882" strokeWidth="1.6" strokeLinecap="round"/>
          </g>
          <g className="spark-3" style={{ transformOrigin: "15px 28px" }}>
            <line x1="15" y1="22" x2="15" y2="34" stroke="#b8867a" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="9" y1="28" x2="21" y2="28" stroke="#b8867a" strokeWidth="1.6" strokeLinecap="round"/>
          </g>
        </svg>

        {/* Text */}
        <p
          className="loader-label"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(13px, 4vw, 16px)",
            color: "#b8867a",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Loading
        </p>
      </div>
    </>
  );
}
