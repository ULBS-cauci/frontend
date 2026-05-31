"use client";
import type { BlockRendererProps } from "./types";

export default function BlockPlaceholder({ content, streaming }: BlockRendererProps) {
  if (streaming) {
    return (
      <div className="my-3 rounded-xl bg-[#141219] border border-[rgba(124,106,247,0.2)] p-4 animate-pulse">
        <div className="h-3 bg-[rgba(124,106,247,0.15)] rounded w-3/4 mb-2" />
        <div className="h-3 bg-[rgba(124,106,247,0.1)] rounded w-1/2" />
      </div>
    );
  }
  return (
    <pre className="my-3 text-xs text-[rgba(232,228,240,0.6)] bg-[#141219] border border-[rgba(232,228,240,0.1)] rounded-xl p-4 overflow-x-auto whitespace-pre-wrap break-all">
      {content}
    </pre>
  );
}
