import ReactMarkdown from "react-markdown";
import type { Message } from "@/lib/types";
import { config } from "@/lib/config";

interface Props {
  messages: Message[];
}

export default function MessageList({ messages }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        return (
          <div key={i} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
            <p className="text-[13px] text-[rgba(232,228,240,0.45)] mb-1.5 tracking-[0.03em]">
              {isUser ? "You" : "ULBS Coach"}
            </p>
            <div className="max-w-[75%]">
              <div className="bg-[#0c0b10] border border-[rgba(232,228,240,0.07)] rounded-[28px] px-5 py-4 text-[#e8e4f0] text-base leading-[1.7]">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
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
          </div>
        );
      })}
    </div>
  );
}
