"use client";
import { useState, FormEvent, KeyboardEvent } from "react";
import { colors, radii } from "@/lib/tokens";

interface Props {
  onSubmit: (query: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
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
          placeholder="Ask a question…"
          disabled={disabled}
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
            height: 32,
            opacity: disabled ? 0.5 : 1,
          }}
        />
      </form>
    </div>
  );
}
