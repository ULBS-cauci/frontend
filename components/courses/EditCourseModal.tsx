"use client";
import { useState } from "react";
import { updateCourse } from "@/lib/api";
import type { Course } from "@/lib/types";

interface EditCourseModalProps {
  course: Course;
  onClose: () => void;
  onUpdated: (course: Course) => void;
}

export default function EditCourseModal({ course, onClose, onUpdated }: EditCourseModalProps) {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await updateCourse(course.id, {
        title: title.trim(),
        description: description.trim() || undefined,
      });
      onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#141219] border border-[rgba(232,228,240,0.08)] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-semibold text-[#e8e4f0] mb-5">Edit Course</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[rgba(232,228,240,0.45)] uppercase tracking-widest">
              Title *
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              {loading ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
