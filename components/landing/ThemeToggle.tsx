"use client";
import { useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "rgba(232,228,240,0.45)",
          letterSpacing: "0.04em",
          userSelect: "none",
        }}
      >
        {dark ? "Dark" : "Light"}
      </span>

      <button
        onClick={() => setDark((d) => !d)}
        style={{
          position: "relative",
          width: 56,
          height: 30,
          borderRadius: 999,
          background: dark
            ? "rgba(20,18,25,0.7)"
            : "rgba(200,195,220,0.3)",
          border: "1px solid rgba(232,228,240,0.12)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)",
          cursor: "pointer",
          transition: "background 0.3s ease",
          padding: 0,
        }}
        aria-label="Toggle theme"
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: dark ? 3 : 27,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: dark
              ? "linear-gradient(135deg, #1e1a2e, #2d2540)"
              : "linear-gradient(135deg, #f0ead8, #e0d8c0)",
            boxShadow: dark
              ? "0 2px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)"
              : "0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6)",
            transition: "left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
          }}
        >
          {dark ? "🌙" : "☀️"}
        </div>
      </button>
    </div>
  );
}
