"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCourse } from "@/lib/api";
import type { Course } from "@/lib/types";
import EditCourseModal from "@/components/courses/EditCourseModal";

const PALETTE = [
  {
    border: "linear-gradient(135deg, #a78bfa, #60a5fa)",
    glow: "0 0 16px rgba(167,139,250,0.2), 0 0 40px rgba(167,139,250,0.06)",
  },
  {
    border: "linear-gradient(135deg, #2dd4bf, #818cf8)",
    glow: "0 0 16px rgba(45,212,191,0.2), 0 0 40px rgba(45,212,191,0.06)",
  },
  {
    border: "linear-gradient(135deg, #60a5fa, #a78bfa)",
    glow: "0 0 16px rgba(96,165,250,0.2), 0 0 40px rgba(96,165,250,0.06)",
  },
];

function themeFromIndex(index: number) {
  return PALETTE[index % PALETTE.length];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface CourseCardProps {
  course: Course;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: (course: Course) => void;
}

export default function CourseCard({ course, index, onDelete, onUpdate }: CourseCardProps) {
  const router = useRouter();
  const theme = themeFromIndex(index);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    const timer = setTimeout(() => document.addEventListener("click", close), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", close);
    };
  }, [menuOpen]);

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setDeleting(true);
    try {
      await deleteCourse(course.id);
      onDelete(course.id);
    } finally {
      setDeleting(false);
      setMenuOpen(false);
    }
  }

  return (
    <>
    {editing && (
      <EditCourseModal
        course={course}
        onClose={() => setEditing(false)}
        onUpdated={(updated) => { onUpdate(updated); setEditing(false); }}
      />
    )}
    <div
      onClick={() => router.push(`/courses/${course.id}`)}
      className="relative rounded-3xl p-[1.5px] h-80 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      style={{ background: theme.border, boxShadow: theme.glow }}
    >
      <div className="bg-[#0a0a0f] rounded-[22px] p-6 flex flex-col h-full">

        <div className="flex justify-between items-start">
          <span className="text-xs text-white/40 font-medium">
            {formatDate(course.created_at)}
          </span>

          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
              className="text-white/25 hover:text-white/60 transition-colors text-base leading-none px-1"
            >
              ⋮
            </button>

            {menuOpen && (
              <>
                <div className="absolute right-0 top-6 z-20 bg-[#141219] border border-white/10 rounded-xl shadow-xl overflow-hidden w-max">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditing(true); setMenuOpen(false); }}
                    className="w-full flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/60 hover:bg-white/06 hover:text-white transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                    </svg>
                    {deleting ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col gap-1">
          <h3 className="text-[22px] font-bold text-white leading-snug">
            {course.title}
          </h3>
          {course.description && (
            <p className="text-sm text-white/50 line-clamp-2">{course.description}</p>
          )}
          {course.held_by && (
            <p className="text-xs text-white/30">by {course.held_by}</p>
          )}
        </div>
        
        <button
          onClick={(e) => { e.stopPropagation(); router.push(`/courses/${course.id}`); }}
          className="mt-4 self-start px-4 py-2 rounded-full bg-white/10 text-white/75 text-sm font-medium border border-white/10 hover:bg-white/20 hover:text-white transition-colors"
        >
          See Materials →
        </button>
      </div>
    </div>
    </>
  );
}
