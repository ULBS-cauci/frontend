"use client";
import { useState, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { colors, radii } from "@/lib/tokens";

export default function LandingInput() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    sessionStorage.setItem("firstMessage", trimmed);
    router.push("/chat");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        width: "100%",
        maxWidth: 820,
      }}
    >

      <div
        style={{
          position: "relative",
          width: "100%",
          borderRadius: radii.lg,
          padding: 1.5,
        }}
      >
        <div
          className="glow-border"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            zIndex: 0,
            animationDuration: focused ? "2s" : "4s",
          }}
        />

        <form
          onSubmit={handleSubmit}
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            background: colors.surface,
            borderRadius: radii.lg - 2,
            padding: "22px 24px",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Ask about anything - your thesis draft, exam dates…"
            autoFocus
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              color: colors.text,
              fontSize: 18,
              lineHeight: 1.5,
              fontFamily: "inherit",
              height: focused ? 96 : 32,
              overflow: "hidden",
              transition: "height 0.35s ease",
            }}
          />
        </form>
      </div>
    </div>
  );
}
