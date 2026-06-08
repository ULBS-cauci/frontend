"use client";
import { useState, useEffect, useRef } from "react";
import { getCourses } from "@/lib/api";
import type { Course } from "@/lib/types";
import { useChatContext } from "@/lib/chat-context";

export default function CourseSelector() {
  const { selectedCourseId, selectedCourseName, setSelectedCourse } = useChatContext();
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCourses().then(setCourses).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-sm text-white/70 hover:text-white/90 transition-colors max-w-[200px]"
        title={selectedCourseName ?? "All courses"}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#a78bfa]">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <span className="truncate">{selectedCourseName ?? "All courses"}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 ml-auto opacity-50">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          style={{ scrollbarWidth: "none" }}
          className="absolute top-full mt-1.5 right-0 z-50 min-w-[14rem] max-w-xs max-h-64 overflow-y-auto rounded-xl bg-[#1a1825] border border-white/[0.08] shadow-xl [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            onClick={() => { setSelectedCourse(null, null); setOpen(false); }}
            className={`w-full text-left px-3 py-2 text-sm transition-colors ${
              !selectedCourseId
                ? "text-white bg-[#7c6af7]/15"
                : "text-white/60 hover:bg-white/[0.05] hover:text-white/90"
            }`}
          >
            All courses
          </button>
          {courses.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => { setSelectedCourse(c.id, c.title); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                selectedCourseId === c.id
                  ? "text-white bg-[#7c6af7]/15"
                  : "text-white/60 hover:bg-white/[0.05] hover:text-white/90"
              }`}
              title={c.title}
            >
              {c.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
