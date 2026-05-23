"use client";
import { useState, useEffect, useRef } from "react";
import { askStream } from "@/lib/api";
import type { Message } from "@/lib/types";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleAsk = async (query: string, attachmentIds: string[] = []) => {
    setError(null);
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: query },
      { role: "assistant", content: "" },
    ]);

    try {
      for await (const chunk of askStream(query, attachmentIds)) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: next[next.length - 1].content + chunk,
          };
          return next;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen bg-[#0c0b10] text-[#e8e4f0] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-10 pt-10 pb-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-start justify-start">
              <p className="text-[rgba(232,228,240,0.45)] text-base tracking-[-0.01em]">
                Our agent is ready to help.
              </p>
            </div>
          ) : (
            <>
              <MessageList messages={messages} />
              {loading && messages[messages.length - 1]?.content === "" && (
                <p className="text-[rgba(232,228,240,0.45)]">Thinking...</p>
              )}
              {error && <p className="text-[#f87171]">Error: {error}</p>}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        <div className="px-6 pb-7">
          <MessageInput onSubmit={handleAsk} disabled={loading} />
        </div>
      </div>
    </div>
  );
}
