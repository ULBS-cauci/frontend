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

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

      <div className="relative mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="text-[rgba(232,228,240,0.45)] text-sm mt-1">
          Manage your courses and materials
        </p>
      </div>

      {loading && (
        <p className="relative text-[rgba(232,228,240,0.35)] text-sm">Loading...</p>
      )}
      {error && <p className="relative text-[#f87171] text-sm">{error}</p>}

      <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        <button
          onClick={() => setShowModal(true)}
          className="relative overflow-hidden rounded-3xl border border-dashed border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col items-center justify-center gap-3 h-80 group hover:bg-white/[0.02] bg-[#0f0f14]"
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
