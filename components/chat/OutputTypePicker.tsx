"use client";
import { useState, useRef, useEffect } from "react";
import { useChatContext } from "@/lib/chat-context";

interface Props {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export default function OutputTypePicker({ value, onChange, disabled }: Props) {
  const { outputFormats } = useChatContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isDisabled = disabled || outputFormats.length === 0;

  const allOptions = [
    { id: "", name: "Explanation" },
    ...outputFormats.map((f) => ({ id: f.id, name: f.name.replace(/_/g, " ") })),
  ];

  const selected = allOptions.find((o) => o.id === value) ?? allOptions[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => setOpen((o) => !o)}
        className="h-8 rounded-lg bg-[#1a1825] border border-[rgba(124,106,247,0.3)] text-[rgba(232,228,240,0.7)] text-[13px] px-3 flex items-center gap-1.5 outline-none focus:border-[rgba(124,106,247,0.6)] hover:border-[rgba(124,106,247,0.5)] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed capitalize"
      >
        {selected.name}
        <svg
          width="11" height="11" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          className={`shrink-0 opacity-50 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 bottom-full mb-1 z-50 min-w-full rounded-lg bg-[#1a1825] border border-[rgba(124,106,247,0.3)] overflow-hidden shadow-xl">
          {allOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => { onChange(opt.id); setOpen(false); }}
              className={`w-full text-center text-[13px] px-4 py-1.5 capitalize transition-colors ${
                opt.id === value
                  ? "bg-[rgba(124,106,247,0.25)] text-[rgba(232,228,240,0.95)]"
                  : "text-[rgba(232,228,240,0.65)] hover:bg-[rgba(124,106,247,0.12)] hover:text-[rgba(232,228,240,0.85)]"
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
