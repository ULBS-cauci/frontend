"use client";
import { useMemo } from "react";
import type { MessageRendererProps } from "./rendererTypes";
import MessageTypePlaceholder from "./MessageTypePlaceholder";

interface InfoCard {
  title: string;
  summary: string;
  points?: string[];
}

export default function InfoCard({ content, streaming }: MessageRendererProps) {
  const card = useMemo<InfoCard | null>(() => {
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  }, [content]);

  if (streaming || !card) {
    return <MessageTypePlaceholder content={content} streaming={streaming} />;
  }

  return (
    <div className="my-3 rounded-xl bg-[#141219] border border-[rgba(124,106,247,0.3)] p-4">
      <h3 className="font-semibold text-[#a78bfa] text-base mb-2">{card.title}</h3>
      <p className="text-[#e8e4f0] text-sm leading-relaxed">{card.summary}</p>
      {card.points && card.points.length > 0 && (
        <ul className="list-disc list-inside space-y-1 mt-3">
          {card.points.map((p, i) => (
            <li key={i} className="text-[rgba(232,228,240,0.75)] text-sm">
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
