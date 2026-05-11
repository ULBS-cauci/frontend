"use client";
import { useState, useEffect, useRef } from "react";
import { askStream } from "@/lib/api";
import type { Message } from "@/lib/types";
import { colors } from "@/lib/tokens";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface Props {
  initialQuery?: string;
}

export default function Chat({ initialQuery }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const didAutoSubmit = useRef(false);
  const started = messages.length > 0;

  const handleAsk = async (query: string) => {
    setError(null);
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: query },
      { role: "assistant", content: "" },
    ]);

    try {
      for await (const chunk of askStream(query)) {
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
    if (started) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, started]);

  useEffect(() => {
    if (initialQuery && !didAutoSubmit.current) {
      didAutoSubmit.current = true;
      handleAsk(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: colors.bg,
        color: colors.text,
      }}
    >
      {/* Messages */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 80,
          overflowY: "auto",
          padding: "40px 0 24px",
          opacity: started ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 16px" }}>
          <MessageList messages={messages} />
          {loading && messages[messages.length - 1]?.content === "" && (
            <p style={{ color: colors.textMuted }}>Thinking...</p>
          )}
          {error && (
            <p style={{ color: "#f87171" }}>Error: {error}</p>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Centered placeholder when no messages */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          opacity: started ? 0 : 1,
          pointerEvents: started ? "none" : "auto",
          transition: "opacity 0.3s ease",
        }}
      >
        <h1
          style={{
            fontSize: 32,
            marginBottom: 8,
            color: colors.text,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          AI Tutor
        </h1>
        <p style={{ color: colors.textMuted }}>
          Ask me anything about your courses.
        </p>
      </div>

      {/* Input */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 700,
          padding: "0 16px",
          bottom: started ? 16 : "calc(50% - 60px)",
          transition: "bottom 0.4s ease",
        }}
      >
        <MessageInput onSubmit={handleAsk} disabled={loading} />
      </div>
    </div>
  );
}
