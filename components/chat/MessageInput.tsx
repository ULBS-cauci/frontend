"use client";
import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  KeyboardEvent,
} from "react";
import { uploadAttachment } from "@/lib/api";
import type { AttachmentPublic } from "@/lib/types";

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
  isGenerating?: boolean;
  onStop?: () => void;
}

export interface MessageInputHandle {
  /** Repopulate the input with a previously-sent prompt (used when a stream is stopped). */
  restore: (text: string, attachments: AttachmentPublic[]) => void;
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

const MessageInput = forwardRef<MessageInputHandle, Props>(function MessageInput(
  { onSubmit, disabled, isGenerating, onStop }: Props,
  ref,
) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useImperativeHandle(ref, () => ({
    restore: (text: string, attachments: AttachmentPublic[]) => {
      setValue(text);
      // The attachments were already uploaded, so rebuild them as ready chips
      // directly from the AttachmentPublic objects — no re-upload needed.
      setPendingAttachments(
        attachments.map((attachment) => ({
          clientKey: crypto.randomUUID(),
          fileName: attachment.file_name,
          status: "ready",
          attachment,
        })),
      );
      textareaRef.current?.focus();
    },
  }));

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
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="shrink-0 text-[rgba(232,228,240,0.35)] hover:text-[rgba(232,228,240,0.7)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Attach file"
          >
            {isUploading ? (
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.pptx,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="relative flex-1 h-12 flex items-center">
            {value === "" && (
              <span className="absolute left-0 inset-y-0 flex items-center text-[rgba(232,228,240,0.35)] text-[18px] leading-[1.5] pointer-events-none select-none">
                Ask a question…
              </span>
            )}
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
              className="w-full bg-transparent border-none outline-none resize-none text-[#e8e4f0] text-[18px] leading-[1.5] font-[inherit] disabled:opacity-50"
            />
          </div>

          {isGenerating ? (
            <button
              type="button"
              onClick={onStop}
              className="shrink-0 text-[#a78bfa] hover:text-[#c4b5fd] transition-colors"
              aria-label="Stop generating"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSubmit}
              className="shrink-0 text-[rgba(232,228,240,0.35)] hover:text-[rgba(232,228,240,0.7)] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Send"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
});

export default MessageInput;
