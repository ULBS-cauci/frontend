"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getLearningPath,
  getCourse,
  getMaterials,
  updateLearningPathProgress,
} from "@/lib/api";
import type { LearningPath, LearningPathModule } from "@/lib/types";
import { useChatContext } from "@/lib/chat-context";

interface Props {
  pathId: string;
}

export default function LearningPathView({ pathId }: Props) {
  const router = useRouter();
  const { outputFormats, setConvPref } = useChatContext();
  const [path, setPath] = useState<LearningPath | null>(null);
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [materialNames, setMaterialNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingModule, setSavingModule] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getLearningPath(pathId)
      .then(async (p) => {
        if (cancelled) return;
        setPath(p);
        const [course, materials] = await Promise.all([
          getCourse(p.course_id).catch(() => null),
          getMaterials(p.course_id).catch(() => []),
        ]);
        if (cancelled) return;
        if (course) setCourseTitle(course.title);
        setMaterialNames(Object.fromEntries(materials.map((m) => [m.id, m.file_name])));
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pathId]);

  const completedCount = useMemo(
    // Count only modules that still exist, so a stale progress key can't push the
    // count (and the percentage) above the module total.
    () => (path ? path.modules.filter((m) => path.progress[m.id]).length : 0),
    [path],
  );

  const toggleModule = async (moduleId: string, completed: boolean) => {
    if (!path) return;
    // Optimistic update.
    setPath({ ...path, progress: { ...path.progress, [moduleId]: completed } });
    setSavingModule(moduleId);
    try {
      const updated = await updateLearningPathProgress(pathId, moduleId, completed);
      setPath(updated);
    } catch {
      // Roll back on failure.
      setPath((prev) =>
        prev ? { ...prev, progress: { ...prev.progress, [moduleId]: !completed } } : prev,
      );
    } finally {
      setSavingModule(null);
    }
  };

  const startModuleChat = (module: LearningPathModule, kind: "ask_tutor" | "generate_quiz") => {
    if (!path) return;
    const prompt =
      kind === "generate_quiz"
        ? `Create a quiz to test me on "${module.title}".`
        : `Teach me about "${module.title}". ${module.objectives.join(" ")}`;
    if (kind === "generate_quiz") {
      const quiz = outputFormats.find((f) => f.name === "quiz");
      if (quiz) setConvPref("__new__", { outputFormatId: quiz.id });
    }
    const params = new URLSearchParams({
      course_id: path.course_id,
      course_name: courseTitle,
      prompt,
    });
    router.push(`/chat?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-[rgba(232,228,240,0.35)] text-sm">Loading learning path...</p>
      </div>
    );
  }

  if (error || !path) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-[#f87171] text-sm">{error ?? "Learning path not found."}</p>
      </div>
    );
  }

  const total = path.modules.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="h-full overflow-y-auto chat-scroll bg-[#0c0b10] text-[#e8e4f0]">
      <div className="max-w-3xl mx-auto px-8 py-10">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/70 transition-colors mb-5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>

        <p className="text-xs uppercase tracking-widest text-[#a78bfa] font-medium mb-1">
          {courseTitle || "Learning Path"}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight mb-4">{path.title}</h1>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-white/50 mb-1.5">
            <span>{completedCount} of {total} modules complete</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7c6af7] to-[#a78bfa] transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Modules */}
        <ol className="flex flex-col gap-4">
          {path.modules.map((module, idx) => {
            const done = !!path.progress[module.id];
            return (
              <li
                key={module.id}
                className={`rounded-2xl border p-5 transition-colors ${
                  done
                    ? "bg-[#7c6af7]/[0.06] border-[#7c6af7]/25"
                    : "bg-white/[0.03] border-white/[0.07]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleModule(module.id, !done)}
                    disabled={savingModule === module.id}
                    aria-label={done ? "Mark incomplete" : "Mark complete"}
                    className={`mt-0.5 w-6 h-6 shrink-0 rounded-md border flex items-center justify-center transition-colors disabled:opacity-50 ${
                      done
                        ? "bg-[#7c6af7] border-[#7c6af7] text-white"
                        : "border-white/25 hover:border-[#a78bfa] text-transparent"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-white/30 font-medium">{idx + 1}</span>
                      <h2 className={`text-base font-medium ${done ? "text-white/50 line-through" : "text-white"}`}>
                        {module.title}
                      </h2>
                    </div>

                    {module.summary && (
                      <p className="text-sm text-white/55 mt-1.5 leading-relaxed">{module.summary}</p>
                    )}

                    {module.objectives.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 mt-3">
                        {module.objectives.map((obj, i) => (
                          <li key={i} className="text-sm text-white/65">{obj}</li>
                        ))}
                      </ul>
                    )}

                    {/* Source materials */}
                    {module.material_ids.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {module.material_ids.map((mid) => (
                          <span
                            key={mid}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] bg-white/[0.05] border border-white/10 text-white/55"
                            title={materialNames[mid] ?? "Source material"}
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span className="max-w-[160px] truncate">{materialNames[mid] ?? "Material"}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => startModuleChat(module, "ask_tutor")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7c6af7]/15 hover:bg-[#7c6af7]/25 border border-[#7c6af7]/30 text-[#c4b5fd] text-[13px] font-medium transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Ask the tutor
                      </button>
                      <button
                        onClick={() => startModuleChat(module, "generate_quiz")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white/65 text-[13px] font-medium transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /><circle cx="12" cy="12" r="10" />
                        </svg>
                        Quiz me
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
