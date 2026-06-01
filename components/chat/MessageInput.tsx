"use client";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { uploadAttachment, getSystemPrompts, getUserSettings, updateUserSettings } from "@/lib/api";
import type { AttachmentPublic, SystemPromptSummary } from "@/lib/types";

interface PendingAttachment {
  clientKey: string;
  fileName: string;
  status: "uploading" | "ready" | "error";
  attachment?: AttachmentPublic;
  errorMessage?: string;
}

interface Props {
  onSubmit: (query: string, attachmentIds: string[], attachments: AttachmentPublic[]) => void;
  disabled?: boolean;
}

function FileChip({
  attachment,
  onRemove,
}: {
  attachment: PendingAttachment;
  onRemove: () => void;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] border ${
        attachment.status === "error"
          ? "bg-[rgba(248,113,113,0.1)] border-[rgba(248,113,113,0.35)] text-[#f87171]"
          : "bg-[rgba(124,106,247,0.15)] border-[rgba(124,106,247,0.35)] text-[#a78bfa]"
      }`}
    >
      {attachment.status === "uploading" ? (
        <svg className="animate-spin shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      )}
      <span className="max-w-[160px] truncate" title={attachment.fileName}>
        {attachment.status === "error" ? attachment.errorMessage : attachment.fileName}
      </span>
      {attachment.status !== "uploading" && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity leading-none"
          aria-label="Remove attachment"
        >
          ×
        </button>
      )}
    </div>
  );
}

function Check() {
  return (
    <svg className="shrink-0 text-[#a78bfa]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function MessageInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [prompts, setPrompts] = useState<SystemPromptSummary[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [promptsLoading, setPromptsLoading] = useState(false);
  const [promptsError, setPromptsError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const full = ta.scrollHeight;
    ta.style.height = `${Math.min(full, 200)}px`;
    ta.style.overflowY = full > 200 ? "auto" : "hidden";
  }, [value]);

  useEffect(() => {
    if (!menuOpen) return;
    let active = true;
    setPromptsLoading(true);
    setPromptsError(false);
    Promise.all([getSystemPrompts(), getUserSettings()])
      .then(([list, settings]) => {
        if (!active) return;
        setPrompts(list);
        setSelectedPromptId(settings.selected_system_prompt_id);
      })
      .catch(() => { if (active) setPromptsError(true); })
      .finally(() => { if (active) setPromptsLoading(false); });
    return () => { active = false; };
  }, [menuOpen]);

  // Close the menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setSubmenuOpen(false);
      }
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") { setMenuOpen(false); setSubmenuOpen(false); }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => { setMenuOpen(false); setSubmenuOpen(false); };

  const handleUploadClick = () => {
    closeMenu();
    fileInputRef.current?.click();
  };

  const handleSelectPrompt = async (id: string | null) => {
    setSelectedPromptId(id);
    closeMenu();
    try {
      await updateUserSettings({ selected_system_prompt_id: id });
    } catch {
      /* selection is best-effort; leave local state as-is */
    }
  };

  useEffect(() => {
    if (!disabled) textareaRef.current?.focus();
  }, [disabled]);

  const isUploading = pendingAttachments.some((a) => a.status === "uploading");
  const readyAttachments = pendingAttachments
    .filter((a) => a.status === "ready")
    .map((a) => a.attachment!);
  const readyIds = readyAttachments.map((a) => a.id);

  const canSubmit =
    (value.trim() !== "" || readyIds.length > 0) && !disabled && !isUploading;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(value.trim(), readyIds, readyAttachments);
    setValue("");
    setPendingAttachments([]);
    textareaRef.current?.focus();
  };

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    e.target.value = "";

    const newSlots: PendingAttachment[] = files.map((file) => ({
      clientKey: crypto.randomUUID(),
      fileName: file.name,
      status: "uploading",
    }));

    setPendingAttachments((prev) => [...prev, ...newSlots]);

    await Promise.allSettled(
      files.map((file, i) =>
        uploadAttachment(file)
          .then((attachment) => {
            if (!mountedRef.current) return;
            setPendingAttachments((prev) =>
              prev.map((p) =>
                p.clientKey === newSlots[i].clientKey
                  ? { ...p, status: "ready", attachment }
                  : p
              )
            );
          })
          .catch((err) => {
            if (!mountedRef.current) return;
            setPendingAttachments((prev) =>
              prev.map((p) =>
                p.clientKey === newSlots[i].clientKey
                  ? { ...p, status: "error", errorMessage: err instanceof Error ? err.message : "Upload failed." }
                  : p
              )
            );
          })
      )
    );
  };

  const removeAttachment = (clientKey: string) => {
    setPendingAttachments((prev) => prev.filter((p) => p.clientKey !== clientKey));
  };

  return (
    <div className="relative w-full rounded-[28px] p-[1.5px]">
      <div
        className="glow-border absolute inset-0 rounded-[inherit] z-0"
        style={{ animationDuration: focused ? "2s" : "4s" }}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-[1] w-full bg-[#141219] rounded-[26px] px-5 py-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]"
      >
        {pendingAttachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {pendingAttachments.map((a) => (
              <FileChip key={a.clientKey} attachment={a} onRemove={() => removeAttachment(a.clientKey)} />
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <div ref={menuRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              disabled={disabled || isUploading}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[rgba(232,228,240,0.35)] hover:text-[rgba(232,228,240,0.7)] hover:bg-[rgba(232,228,240,0.06)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Add"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              {isUploading ? (
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute bottom-full left-0 mb-2 w-56 rounded-2xl border border-[rgba(232,228,240,0.12)] bg-[#1c1a24] p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.55)] z-20"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleUploadClick}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-[14px] text-[rgba(232,228,240,0.85)] hover:bg-[rgba(232,228,240,0.07)] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Upload a document
                </button>

                <div
                  className="relative"
                  onMouseEnter={() => setSubmenuOpen(true)}
                  onMouseLeave={() => setSubmenuOpen(false)}
                >
                  <button
                    type="button"
                    role="menuitem"
                    aria-haspopup="menu"
                    aria-expanded={submenuOpen}
                    onFocus={() => setSubmenuOpen(true)}
                    className={`flex w-full items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-left text-[14px] text-[rgba(232,228,240,0.85)] transition-colors ${submenuOpen ? "bg-[rgba(232,228,240,0.07)]" : "hover:bg-[rgba(232,228,240,0.07)]"}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
                      </svg>
                      Customise
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>

                  {submenuOpen && (
                    <div className="absolute bottom-0 left-full pl-1.5">
                      <div
                        role="menu"
                        style={{ scrollbarWidth: "none" }}
                        className="w-60 max-h-80 overflow-y-auto rounded-2xl border border-[rgba(232,228,240,0.12)] bg-[#1c1a24] p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.55)] [&::-webkit-scrollbar]:hidden"
                      >
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => handleSelectPrompt(null)}
                          className="flex w-full items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-[14px] text-[rgba(232,228,240,0.55)] hover:bg-[rgba(232,228,240,0.07)] transition-colors"
                        >
                          None
                          {selectedPromptId === null && <Check />}
                        </button>

                        {promptsLoading && (
                          <p className="px-3 py-2 text-[13px] text-[rgba(232,228,240,0.4)]">Loading…</p>
                        )}
                        {promptsError && (
                          <p className="px-3 py-2 text-[13px] text-[#f87171]">Couldn’t load prompts.</p>
                        )}
                        {!promptsLoading && !promptsError && prompts.length === 0 && (
                          <p className="px-3 py-2 text-[13px] text-[rgba(232,228,240,0.4)]">No prompts available.</p>
                        )}

                        {prompts.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            role="menuitem"
                            onClick={() => handleSelectPrompt(p.id)}
                            className={`flex w-full items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-[14px] transition-colors ${selectedPromptId === p.id ? "bg-[rgba(124,106,247,0.12)] text-[#c4b5fd]" : "text-[rgba(232,228,240,0.85)] hover:bg-[rgba(232,228,240,0.07)]"}`}
                          >
                            <span className="truncate">{p.title ?? "Untitled"}</span>
                            {selectedPromptId === p.id && <Check />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex-1 flex items-center">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              rows={1}
              autoFocus
              disabled={disabled}
              placeholder="Ask a question…"
              style={{ scrollbarWidth: "none" }}
              className="block w-full py-[9px] bg-transparent border-none outline-none resize-none text-[#e8e4f0] text-[18px] leading-[1.5] font-[inherit] placeholder:text-[rgba(232,228,240,0.35)] disabled:opacity-50 max-h-[200px] [&::-webkit-scrollbar]:hidden"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full text-[rgba(232,228,240,0.35)] hover:text-[rgba(232,228,240,0.7)] hover:bg-[rgba(232,228,240,0.06)] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
