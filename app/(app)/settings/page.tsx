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

      <div className="relative mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-[rgba(232,228,240,0.45)] text-sm mt-1">
          Your personal instructions apply to every chat
        </p>
      </div>

      <div className="relative max-w-2xl">
        <label className="block text-sm font-medium text-[rgba(232,228,240,0.75)] mb-2">
          Custom system prompt
        </label>
        <p className="text-[rgba(232,228,240,0.4)] text-xs mb-3">
          Tell the tutor how you’d like it to respond. This is applied on top of the
          platform’s defaults and any predefined prompt you pick in chat.
        </p>

        {loading ? (
          <p className="text-[rgba(232,228,240,0.35)] text-sm">Loading…</p>
        ) : (
          <>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={8}
              placeholder="e.g. Always explain with a real-world analogy, then a concise summary."
              className="w-full rounded-xl border border-[rgba(232,228,240,0.12)] bg-[#141219] px-4 py-3 text-[15px] text-[#e8e4f0] placeholder:text-[rgba(232,228,240,0.3)] outline-none focus:border-[rgba(124,106,247,0.5)] transition-colors resize-y"
            />
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saveState === "saving"}
                className="rounded-lg bg-[#7c6af7] px-5 py-2 text-sm font-medium text-white hover:bg-[#6a58e0] transition-colors disabled:opacity-50"
              >
                {saveState === "saving" ? "Saving…" : "Save"}
              </button>
              {saveState === "saved" && (
                <span className="text-sm text-[#4ade80]">Saved</span>
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
  );
}
