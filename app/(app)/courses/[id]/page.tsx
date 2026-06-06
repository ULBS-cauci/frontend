"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCourse, getMaterials, uploadMaterial, getMaterialPreviewUrl } from "@/lib/api";
import FilePreview from "@/components/FilePreview";
import type { Course, Material } from "@/lib/types";

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selected, setSelected] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);
    try {
      const uploaded = await uploadMaterial(id, file);
      const mats = await getMaterials(id);
      setMaterials(mats);
      setSelected(mats.find((m) => m.id === uploaded.id) ?? mats[mats.length - 1]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    Promise.all([getCourse(id), getMaterials(id)])
      .then(([fetchedCourse, mats]) => {
        setCourse(fetchedCourse);
        setMaterials(mats);
        if (mats.length > 0) setSelected(mats[0]);
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
    <div className="h-screen bg-[#0c0b10] text-[#e8e4f0] flex flex-col overflow-hidden">
      <div className="px-8 py-5 border-b border-white/[0.06] flex items-center gap-4 shrink-0">
        <button
          onClick={() => router.push("/courses")}
          className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/70 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Courses
        </button>
        <span className="text-white/15">/</span>
        <h1 className="text-sm font-medium text-white/80">{course.title}</h1>
      </div>

      <div className="flex flex-1 overflow-hidden gap-5 p-5">

        <div className="w-72 shrink-0 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-white/40 uppercase tracking-widest font-medium">
              Materials · {materials.length}
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-40"
            >
              {uploading ? (
                <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
            </button>
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.pptx,.png,.jpg,.jpeg" className="hidden" onChange={handleFileChange} />
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1">
            {materials.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 mt-12 text-white/20">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                <p className="text-xs">No materials yet.</p>
              </div>
            ) : (
              materials.map((mat) => {
                const isSelected = selected?.id === mat.id;
                return (
                  <button
                    key={mat.id}
                    onClick={() => setSelected(mat)}
                    className={`w-full text-left rounded-2xl p-4 flex flex-col gap-3 transition-all duration-150 border ${
                      isSelected
                        ? "bg-[#7c6af7]/10 border-[#7c6af7]/30"
                        : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? "bg-[#7c6af7]/20" : "bg-white/5"
                    }`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isSelected ? "#a78bfa" : "rgba(255,255,255,0.4)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                      <span className={`text-sm font-medium truncate leading-snug ${isSelected ? "text-white" : "text-white/70"}`}>
                        {mat.file_name}
                      </span>
                      {mat.file_type && (
                        <span className={`text-[11px] uppercase font-medium tracking-wider ${isSelected ? "text-[#a78bfa]" : "text-white/25"}`}>
                          {mat.file_type}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex-1 rounded-3xl p-[1px] shrink-0 flex flex-col" style={{ background: "linear-gradient(135deg, rgba(124,106,247,0.5) 0%, rgba(96,165,250,0.2) 50%, rgba(124,106,247,0.1) 100%)" }}>
        <div className="flex-1 rounded-[23px] overflow-hidden bg-[#0a0910] flex flex-col">
          {selected && selected.object_storage_key ? (
            <>
              <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-3 shrink-0">
                <div className="w-6 h-6 rounded-md bg-[#7c6af7]/15 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <span className="text-sm text-white/70 truncate">{selected.file_name}</span>
              </div>
              <div key={selected.id} className="flex-1 overflow-hidden">
                <FilePreview
                  url={getMaterialPreviewUrl(selected.course_id, selected.id)}
                  fileName={selected.file_name}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-white/15">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="text-sm">
                {materials.length === 0 ? "No materials uploaded yet." : "Select a material to preview."}
              </p>
            </div>
          )}
        </div>
        </div>

      </div>
    </div>
  );
}
