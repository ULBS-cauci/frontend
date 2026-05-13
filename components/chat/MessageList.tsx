import ReactMarkdown from "react-markdown";
import type { Message } from "@/lib/types";

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
            <div className="bg-[#0c0b10] border border-[rgba(232,228,240,0.07)] rounded-[16px] px-5 py-4 text-[#e8e4f0] text-base leading-[1.7] max-w-[75%]">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        );
      })}
    </div>
  );
}
