"use client";
import type { Message, AttachmentPublic } from "@/lib/types";
import MarkdownMessage from "./MarkdownMessage";

interface Props {
  messages: Message[];
  onRegenerate?: () => void;
  onAttachmentClick?: (attachment: AttachmentPublic) => void;
  streamingActive?: boolean;
  conversationId?: string;
  lastUserRef?: React.RefObject<HTMLDivElement>;
}

function AttachmentChip({
  attachment,
  onClick,
}: {
  attachment: AttachmentPublic;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] border bg-[rgba(124,106,247,0.15)] border-[rgba(124,106,247,0.35)] text-[#a78bfa] cursor-pointer hover:brightness-125 transition"
      title={attachment.file_name}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <span className="max-w-[160px] truncate">{attachment.file_name}</span>
    </button>
  );
}

export default function MessageList({ messages, onRegenerate, onAttachmentClick, streamingActive, conversationId, lastUserRef }: Props) {
  const lastUserIndex = messages.reduce((acc, msg, i) => (msg.role === "user" ? i : acc), -1);

  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        const isLastAssistant = !isUser && i === messages.length - 1;
        const hasAttachments = !!msg.attachments && msg.attachments.length > 0;
        const isThinking = isLastAssistant && !!streamingActive && !msg.content;
        return (
          <div
            key={msg.id ?? i}
            ref={isUser && i === lastUserIndex ? lastUserRef : undefined}
            className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
          >
            <div className="p-3"></div>
            <p className="text-[13px] text-[rgba(232,228,240,0.45)] mb-1.5 tracking-[0.03em]">
              {isUser ? "You" : "ULBS Coach"}
            </p>
            <div
              className={`rounded-[28px] px-5 py-4 text-[#e8e4f0] text-base leading-[1.7] ${isUser ? "max-w-[75%]" : isThinking ? "" : "max-w-[90%]"}`}
              style={{
                background: "rgba(20,14,35,0.35)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(124,106,247,0.15)",
                boxShadow: "inset 0 1px 0 rgba(167,139,250,0.08)",
              }}
            >
              {isThinking ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[rgba(167,139,250,0.7)] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[rgba(167,139,250,0.7)] animate-bounce" style={{ animationDelay: "160ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[rgba(167,139,250,0.7)] animate-bounce" style={{ animationDelay: "320ms" }} />
                </div>
              ) : (
                <MarkdownMessage
                  content={msg.content}
                  streaming={isLastAssistant && !!streamingActive}
                  conversationId={conversationId ?? undefined}
                />
              )}
            </div>
            {isUser && hasAttachments && (
              <div className="flex flex-wrap gap-2 mt-2 justify-end max-w-[75%]">
                {msg.attachments!.map((a) => (
                  <AttachmentChip
                    key={a.id}
                    attachment={a}
                    onClick={() => onAttachmentClick?.(a)}
                  />
                ))}
              </div>
            )}
            {isLastAssistant && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="mt-2 mb-[20px] flex items-center gap-1.5 text-[12px] text-[rgba(232,228,240,0.35)] hover:text-[rgba(232,228,240,0.65)] transition-colors"
                title="Regenerate response"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                Regenerate
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
