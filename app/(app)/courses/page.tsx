"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCourses, createCourse } from "@/lib/api";
import type { Course } from "@/lib/types";

const CARD_STYLES = [
  {
    bg: "bg-gradient-to-t from-blue-500/70 via-blue-700/30 to-[#0a0910]/95",
    shadow:
      "shadow-[0_30px_120px_-20px_rgba(59,130,246,0.7)] hover:shadow-[0_30px_140px_-15px_rgba(59,130,246,0.9)]",
    border: "border-blue-500/40",
    iconBg: "bg-white/10 backdrop-blur-md",
    iconColor: "#ffffff",
    titleHover: "group-hover:text-blue-200",
  },
  {
    bg: "bg-gradient-to-t from-emerald-500/70 via-emerald-700/30 to-[#0a0910]/95",
    shadow:
      "shadow-[0_30px_120px_-20px_rgba(16,185,129,0.7)] hover:shadow-[0_30px_140px_-15px_rgba(16,185,129,0.9)]",
    border: "border-emerald-500/40",
    iconBg: "bg-white/10 backdrop-blur-md",
    iconColor: "#ffffff",
    titleHover: "group-hover:text-emerald-200",
  },
  {
    bg: "bg-gradient-to-t from-purple-500/70 via-purple-700/30 to-[#0a0910]/95",
    shadow:
      "shadow-[0_30px_120px_-20px_rgba(168,85,247,0.7)] hover:shadow-[0_30px_140px_-15px_rgba(168,85,247,0.9)]",
    border: "border-purple-500/40",
    iconBg: "bg-white/10 backdrop-blur-md",
    iconColor: "#ffffff",
    titleHover: "group-hover:text-purple-200",
  },
];

function AddCourseModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (course: Course) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const course = await createCourse({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      onCreated(course);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#141219] border border-[rgba(232,228,240,0.08)] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-semibold text-[#e8e4f0] mb-5">New Course</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[rgba(232,228,240,0.45)] uppercase tracking-widest">
              Title *
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Algorithms"
              className="bg-[rgba(232,228,240,0.06)] text-[#e8e4f0] text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[rgba(124,106,247,0.4)] placeholder:text-[rgba(232,228,240,0.25)] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[rgba(232,228,240,0.45)] uppercase tracking-widest">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={3}
              className="bg-[rgba(232,228,240,0.06)] text-[#e8e4f0] text-sm rounded-xl px-4 py-3 outline-none border border-transparent focus:border-[rgba(124,106,247,0.4)] placeholder:text-[rgba(232,228,240,0.25)] transition-colors resize-none"
            />
            
          </div>

          {error && <p className="text-[#f87171] text-xs">{error}</p>}

          <div className="flex gap-2 justify-end mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-[rgba(232,228,240,0.45)] hover:text-[#e8e4f0] hover:bg-[rgba(232,228,240,0.06)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className="px-4 py-2 rounded-xl text-sm bg-[#7c6af7] text-white font-medium hover:bg-[#6b5ce7] transition-colors disabled:opacity-40"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const router = useRouter();
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
      {/* Subtle grid background */}
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
        <p className="relative text-[rgba(232,228,240,0.35)] text-sm">
          Loading...
        </p>
      )}
      {error && <p className="relative text-[#f87171] text-sm">{error}</p>}

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, i) => {
          const style = CARD_STYLES[i % CARD_STYLES.length];
          return (
            <button
              key={course.id}
              onClick={() => router.push(`/courses/${course.id}`)}
              className={`
                relative overflow-hidden rounded-3xl
                ${style.bg}
                border ${style.border}
                p-8 text-left
                ${style.shadow}
                transition-all duration-500
                hover:scale-[1.02]
                group
                aspect-[5/6]
                flex flex-col
              `}
            >
              {/* Top inner highlight - subtle shine */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

              {/* Icon — top left */}
              <div
                className={`relative w-11 h-11 rounded-xl ${style.iconBg} border border-white/10 flex items-center justify-center`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={style.iconColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>

              {/* Spacer pushes content to bottom */}
              <div className="flex-1" />

              {/* Content — bottom */}
              <div className="relative">
                <h3
                  className={`text-2xl font-semibold mb-3 text-white transition-colors ${style.titleHover}`}
                >
                  {course.title}
                </h3>

                {course.description && (
                  <p className="text-sm text-white/70 line-clamp-2 mb-4">
                    {course.description}
                    {course.held_by}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                  <span>View course</span>
                  <span>→</span>
                </div>
              </div>
            </button>
          );
        })}

        {/* Add course button */}
        <button
          onClick={() => setShowModal(true)}
          className="
            relative overflow-hidden rounded-3xl
            bg-[#0a0910]
            border border-dashed border-white/15
            hover:border-purple-400/40
            transition-all duration-300
            flex flex-col items-center justify-center gap-3
            aspect-[5/6]
            group
            hover:bg-purple-500/[0.03]
          "
        >
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-purple-500/15 transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">
            Add course
          </span>
        </button>
      </div>
    </div>
  );
}