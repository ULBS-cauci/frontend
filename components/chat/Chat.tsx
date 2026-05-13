"use client";
import { useState, useEffect, useRef } from "react";
import { askStream } from "@/lib/api";
import type { Message } from "@/lib/types";
import { colors, fontSizes, radii } from "@/lib/tokens";
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        background: colors.bg,
        color: colors.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 860,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: colors.bg,
          border: "1px solid rgba(232,228,240,0.07)",
          borderRadius: radii.lg,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "40px 40px 24px",
          }}
        >
          {messages.length === 0 ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "start",
                justifyContent: "start",
              }}
            >
              <p
                style={{
                  color: colors.textMuted,
                  fontSize: fontSizes.lg-4,
                  letterSpacing: "-0.01em",
                }}
              >
                Our agent is ready to help.
              </p>
            </div>
          ) : (
            <>
              <MessageList messages={messages} />
              {loading && messages[messages.length - 1]?.content === "" && (
                <p style={{ color: colors.textMuted }}>Thinking...</p>
              )}
              {error && <p style={{ color: "#f87171" }}>Error: {error}</p>}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        <div style={{ padding: "0 24px 28px" }}>
          <MessageInput onSubmit={handleAsk} disabled={loading} />
        </div>
      </div>
    </div>
  );
}
