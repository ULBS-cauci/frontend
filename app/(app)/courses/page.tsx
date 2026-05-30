"use client";
import { useState, useEffect } from "react";
import { getCourses } from "@/lib/api";
import type { Course } from "@/lib/types";
import CourseCard from "@/components/courses/CourseCard";
import AddCourseModal from "@/components/courses/AddCourseModal";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mine, setMine] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCourses(mine)
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [mine]);

  return (
    <div className="min-h-screen bg-[#0c0b10] text-[#e8e4f0] px-12 py-12 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {showModal && (
        <AddCourseModal
          onClose={() => setShowModal(false)}
          onCreated={(course) => setCourses((prev) => [...prev, course])}
        />
      )}

      <div className="relative mb-10 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-[rgba(232,228,240,0.45)] text-sm mt-1">
            Manage your courses and materials
          </p>
        </div>
        {/* Teacher "Show mine" filter. NOTE: there is no current-user/role context yet,
            so this toggle is shown unconditionally and filters by the dummy dev user.
            Gate it on the teacher role once an auth/current-user context exists. */}
        <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1 text-sm">
          <button
            onClick={() => setMine(false)}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              !mine ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            All courses
          </button>
          <button
            onClick={() => setMine(true)}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              mine ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            Show mine
          </button>
        </div>
      </div>

      {loading && (
        <p className="relative text-[rgba(232,228,240,0.35)] text-sm">Loading...</p>
      )}
      {error && <p className="relative text-[#f87171] text-sm">{error}</p>}

      <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        <button
          onClick={() => setShowModal(true)}
          className="relative overflow-hidden rounded-[40px] border border-dashed border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col items-center justify-center gap-3 h-[280px] group hover:bg-white/[0.02] bg-[#0f0f14]"
        >
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <span className="text-sm text-white/35 group-hover:text-white/60 transition-colors">
            Add course
          </span>
        </button>

        {courses.map((course, i) => (
          <CourseCard
            key={course.id}
            course={course}
            index={i}
            onDelete={(id) => setCourses((prev) => prev.filter((c) => c.id !== id))}
            onUpdate={(updated) => setCourses((prev) => prev.map((c) => c.id === updated.id ? updated : c))}
          />
        ))}
      </div>
    </div>
  );
}
