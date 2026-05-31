"use client";
import { useEffect, useState } from "react";
import { getOutputFormats } from "@/lib/api";
import type { OutputFormatPublic } from "@/lib/types";

interface Props {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export default function OutputTypePicker({ value, onChange, disabled }: Props) {
  const [formats, setFormats] = useState<OutputFormatPublic[]>([]);

  useEffect(() => {
    getOutputFormats().then(setFormats).catch(() => {});
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || formats.length === 0}
      className="shrink-0 h-8 rounded-lg bg-[#1a1825] border border-[rgba(124,106,247,0.3)] text-[rgba(232,228,240,0.7)] text-[13px] px-2 outline-none focus:border-[rgba(124,106,247,0.6)] hover:border-[rgba(124,106,247,0.5)] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <option value="">Explanation</option>
      {formats.map((f) => (
        <option key={f.id} value={f.id}>
          {f.name.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
