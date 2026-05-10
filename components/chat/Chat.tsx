"use client";
import { useState } from "react";
import { askStream } from "@/lib/api";
import type { Message } from "@/lib/types";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1>AI Tutor</h1>

      <MessageList messages={messages} />

      {loading && messages[messages.length - 1]?.content === "" && (
        <p style={{ color: "#999" }}>Thinking...</p>
      )}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div style={{ marginTop: 24 }}>
        <MessageInput onSubmit={handleAsk} disabled={loading} />
      </div>
    </main>
  );
}
