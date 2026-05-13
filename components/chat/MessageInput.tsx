"use client";
import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";

interface Props {
  onSubmit: (query: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled) textareaRef.current?.focus();
  }, [disabled]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
    textareaRef.current?.focus();
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
    <div className="relative w-full rounded-[28px] p-[1.5px]">
      <div
        className="glow-border absolute inset-0 rounded-[inherit] z-0"
        style={{ animationDuration: focused ? "2s" : "4s" }}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-[1] w-full bg-[#141219] rounded-[26px] px-6 py-[22px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]"
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask a question…"
          autoFocus
          disabled={disabled}
          className="w-full bg-transparent border-none outline-none resize-none text-[#e8e4f0] text-[18px] leading-[1.5] font-[inherit] h-12 disabled:opacity-50"
        />
      </form>
    </div>
  );
}
