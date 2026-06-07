"use client";
import type { PendingContextSwitch } from "@/lib/types";

interface Props {
  pending: PendingContextSwitch;
  onSwitch: () => void;
  onStay: () => void;
}

export default function ContextSwitchBanner({ pending, onSwitch, onStay }: Props) {
  return (
    <div className="my-4 rounded-2xl border border-[#7c6af7]/30 bg-[#7c6af7]/[0.07] px-5 py-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#7c6af7]/20 flex items-center justify-center shrink-0 mt-0.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          It looks like your question is related to <span className="text-[#a78bfa] font-medium">{pending.detectedCourseName}</span>.
          Would you like to switch to this course?
        </p>
      </div>
      <div className="flex gap-2 pl-10">
        <button
          type="button"
          onClick={onSwitch}
          className="px-3.5 py-1.5 rounded-lg bg-[#7c6af7]/20 hover:bg-[#7c6af7]/35 text-[#c4b5fd] text-sm font-medium transition-colors border border-[#7c6af7]/30"
        >
          Yes, switch to {pending.detectedCourseName}
        </button>
        <button
          type="button"
          onClick={onStay}
          className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] text-white/60 hover:text-white/80 text-sm transition-colors border border-white/[0.08]"
        >
          Stay here
        </button>
      </div>
    </div>
  );
}
