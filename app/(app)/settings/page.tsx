"use client";
import { useState, useEffect } from "react";
import { getUserSettings, updateUserSettings } from "@/lib/api";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function SettingsPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    getUserSettings()
      .then((s) => setPrompt(s.custom_system_prompt ?? ""))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaveState("saving");
    try {
      await updateUserSettings({ custom_system_prompt: prompt.trim() || null });
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0b10] text-[#e8e4f0] px-12 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-[rgba(232,228,240,0.45)] text-sm mt-1">
          Your personal instructions apply to every chat
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="rounded-2xl border border-[rgba(232,228,240,0.07)] bg-[rgba(255,255,255,0.02)] p-6">
          <label
            htmlFor="custom-system-prompt"
            className="block text-sm font-medium text-[rgba(232,228,240,0.85)] mb-1"
          >
            Custom system prompt
          </label>
          <p className="text-[rgba(232,228,240,0.4)] text-xs mb-4">
            Tell the tutor how you'd like it to respond. This is applied on top of the
            platform's defaults and any predefined prompt you pick in chat.
          </p>

          {loading ? (
            <p className="text-[rgba(232,228,240,0.35)] text-sm">Loading…</p>
          ) : (
            <>
              <textarea
                id="custom-system-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={8}
                placeholder="e.g. Always explain with a real-world analogy, then a concise summary."
                className="w-full rounded-xl border border-[rgba(232,228,240,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[15px] text-[#e8e4f0] placeholder:text-[rgba(232,228,240,0.25)] outline-none focus:border-[rgba(124,106,247,0.4)] transition-colors resize-y"
              />

              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saveState === "saving"}
                  className="relative rounded-xl px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50 overflow-hidden transition-opacity"
                  style={{
                    background: "rgba(124,106,247,0.15)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(124,106,247,0.35)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 20px rgba(124,106,247,0.15)",
                  }}
                >
                  <span className="relative z-10">
                    {saveState === "saving" ? "Saving…" : "Save"}
                  </span>
                </button>

                {saveState === "saved" && (
                  <span className="text-sm text-[#4ade80] flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Saved
                  </span>
                )}
                {saveState === "error" && (
                  <span className="text-sm text-[#f87171]">Failed to save. Try again.</span>
                )}
              </div>
            </>
          )}
          {error && <p className="mt-3 text-[#f87171] text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}
