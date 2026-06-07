"use client";
import type { Message, AttachmentPublic } from "@/lib/types";
import { config } from "@/lib/config";
import MarkdownMessage from "./MarkdownMessage";

interface Props {
  messages: Message[];
  onRegenerate?: () => void;
  onAttachmentClick?: (attachment: AttachmentPublic) => void;
  streamingActive?: boolean;
  conversationId?: string;
  lastUserRef?: React.RefObject<HTMLDivElement | null>;
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
        return (
          <div
            key={msg.id ?? i}
            ref={isUser && i === lastUserIndex ? lastUserRef : undefined}
            className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
          >
            <p className="text-[13px] text-[rgba(232,228,240,0.45)] mb-1.5 tracking-[0.03em]">
              {isUser ? "You" : "ULBS Coach"}
            </p>
            <div className={`${isUser ? "max-w-[75%]" : "max-w-[90%] w-full"}`}>
              <div className="bg-[#0c0b10] border border-[rgba(232,228,240,0.07)] rounded-[28px] px-5 py-4 text-[#e8e4f0] text-base leading-[1.7]">
                <MarkdownMessage
                  content={msg.content}
                  streaming={isLastAssistant && !!streamingActive}
                  conversationId={conversationId ?? undefined}
                />
              </div>
              {!isUser && msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 px-1">
                  <p className="text-[11px] text-[rgba(232,228,240,0.35)] mb-1.5 tracking-widest uppercase">
                    Sources
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((source) => (
                      <a
                        key={source.material_id}
                        href={`${config.apiUrl}${source.download_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#7c6af7]/30 text-[#a78bfa] text-xs hover:border-[#7c6af7]/60 hover:text-[#c084fc] transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span className="max-w-[180px] truncate">{source.file_name}</span>
                      </a>
                    ))}
                  </div>
                </div>
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
                className="mt-2 flex items-center gap-1.5 text-[12px] text-[rgba(232,228,240,0.35)] hover:text-[rgba(232,228,240,0.65)] transition-colors"
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
