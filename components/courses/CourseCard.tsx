"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCourse } from "@/lib/api";
import type { Course } from "@/lib/types";
import EditCourseModal from "@/components/courses/EditCourseModal";

const CARD_SHADOW = `
  inset 0 -80px 60px -30px rgba(100, 60, 220, 0.16),
  inset 0 -40px 30px -8px rgba(140, 100, 255, 0.9),
  inset 0 -20px 20px -6px rgba(200, 180, 255, 0.03),
  inset 0 6px 6px -2px rgba(120, 80, 220, 0.04)
`;

interface CourseCardProps {
  course: Course;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: (course: Course) => void;
}

export default function CourseCard({ course, onDelete, onUpdate }: CourseCardProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    try {
      await deleteCourse(course.id);
      onDelete(course.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete course");
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
        className="relative cursor-pointer transition-transform duration-300 hover:scale-[1.02] flex flex-col overflow-hidden h-[280px]"
        style={{
          borderRadius: 40,
          background: "linear-gradient(180deg, #0A0909 0%, #09101F 100%)",
          boxShadow: CARD_SHADOW,
        }}
      >
        <div className="flex flex-col flex-1 px-6 pt-5 pb-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-white/30">
              {new Date(course.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
                className="text-white/60 hover:text-white transition-colors text-base leading-none px-1"
              >
                ⋮
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-6 z-20 bg-[#141219] border border-white/10 rounded-xl shadow-xl overflow-hidden w-max">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditing(true); setMenuOpen(false); }}
                    className="w-full flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/60 hover:bg-white/[0.06] hover:text-white transition-colors"
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
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2.5">
            <h3 className="text-[21px] font-bold text-white leading-snug">{course.title}</h3>
            {course.description && (
              <p className="text-[14px] text-white/45 line-clamp-2 leading-relaxed">{course.description}</p>
            )}
            {course.teacher_name && (
              <p className="text-[13px] text-white/30">by {course.teacher_name}</p>
            )}
          </div>

          {error && (
            <p className="mt-3 text-[13px] text-[#f87171]">{error}</p>
          )}

          <div className="mt-auto">
            <button
              onClick={(e) => { e.stopPropagation(); router.push(`/courses/${course.id}`); }}
              className="px-3.5 py-1.5 rounded-full text-[14px] text-white/65 border border-white/10 hover:border-white/20 hover:text-white transition-colors bg-white/4"
            >
              See materials →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
