"use client";
import { useState, FormEvent } from "react";

interface Props {
  onSubmit: (query: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask a question..."
        disabled={disabled}
        style={{ flex: 1, padding: 8, fontSize: 16 }}
      />
      <button type="submit" disabled={disabled} style={{ padding: "8px 16px" }}>
        Send
      </button>
    </form>
  );
}