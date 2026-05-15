"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCourses, getMaterials } from "@/lib/api";
import type { Course, Material } from "@/lib/types";

function FileIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getCourses(), getMaterials(id)])
      .then(([courses, mats]) => {
        const found = courses.find((c) => c.id === id) ?? null;
        setCourse(found);
        setMaterials(mats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen bg-[#0c0b10] flex items-center justify-center">
        <p className="text-[rgba(232,228,240,0.35)] text-sm">Loading...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="h-screen bg-[#0c0b10] flex items-center justify-center">
        <p className="text-[#f87171] text-sm">{error ?? "Course not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0b10] text-[#e8e4f0] px-12 py-12">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={() => router.push("/courses")}
          className="flex items-center gap-1.5 text-sm text-[rgba(232,228,240,0.35)] hover:text-[#e8e4f0] transition-colors mb-4"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Courses
        </button>
        <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
        {course.description && (
          <p className="text-[rgba(232,228,240,0.45)] text-sm mt-1">{course.description}</p>
        )}
      </div>

      {/* Materials */}
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-[rgba(232,228,240,0.35)] uppercase tracking-widest">
            Materials · {materials.length}
          </p>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[rgba(232,228,240,0.45)] hover:text-[#e8e4f0] hover:bg-[rgba(232,228,240,0.06)] transition-colors border border-[rgba(232,228,240,0.07)]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add material
          </button>
        </div>

        {materials.length === 0 ? (
          <div className="border border-dashed border-[rgba(232,228,240,0.1)] rounded-2xl p-10 flex flex-col items-center justify-center gap-3">
            <p className="text-sm text-[rgba(232,228,240,0.35)]">No materials uploaded yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#141219] border border-[rgba(232,228,240,0.06)] group"
              >
                <div className="flex items-center gap-3 text-[rgba(232,228,240,0.75)]">
                  <FileIcon />
                  <div>
                    <p className="text-sm font-medium">{mat.file_name}</p>
                    {mat.file_type && (
                      <p className="text-xs text-[rgba(232,228,240,0.35)]">{mat.file_type}</p>
                    )}
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[rgba(232,228,240,0.35)] hover:text-[#f87171] p-1.5 rounded-lg hover:bg-[rgba(248,113,113,0.08)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
