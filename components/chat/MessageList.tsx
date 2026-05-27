import ReactMarkdown from "react-markdown";
import type { Message } from "@/lib/types";

interface Props {
  messages: Message[];
  onRegenerate?: () => void;
}

export default function MessageList({ messages, onRegenerate }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        const isLastAssistant = !isUser && i === messages.length - 1;
        return (
          <div key={i} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
            <p className="text-[13px] text-[rgba(232,228,240,0.45)] mb-1.5 tracking-[0.03em]">
              {isUser ? "You" : "ULBS Coach"}
            </p>
            <div className="bg-[#0c0b10] border border-[rgba(232,228,240,0.07)] rounded-[28px] px-5 py-4 text-[#e8e4f0] text-base leading-[1.7] max-w-[75%]">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
            {isLastAssistant && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="mt-2 flex items-center gap-1.5 text-[12px] text-[rgba(232,228,240,0.35)] hover:text-[rgba(232,228,240,0.65)] transition-colors"
                title="Regenerate response"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
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
