"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { askStream, getMessages, createConversation } from "@/lib/api";
import type { Message, MessagePublic, MessageRole } from "@/lib/types";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useChatContext } from "@/lib/chat-context";

interface ChatProps {
  conversationId?: string;
}

export default function Chat({ conversationId }: ChatProps) {
  const router = useRouter();
  const { refreshConversations, messages, setMessages, activeConvId, setActiveConvId } = useChatContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    setActiveConvId(conversationId);

    if (!conversationId) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getMessages(conversationId)
      .then((fetchedMessages) => {
        if (cancelled) return;
        const senderToRole: Record<MessagePublic["sender"], MessageRole> = {
          User: "user",
          System: "system",
          AI: "assistant",
        };
        const formatted: Message[] = fetchedMessages.map((m) => ({
          role: senderToRole[m.sender],
          content: m.content,
        }));
        setMessages(formatted);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Unknown error loading messages");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [conversationId, setActiveConvId, setMessages]);

  const handleAsk = async (query: string, attachmentIds: string[] = []) => {
    setError(null);
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: query },
      { role: "assistant", content: "" },
    ]);

    let targetConvId = activeConvId;
    let isNewConv = false;

    try {
      if (!targetConvId) {
        const newConv = await createConversation();
        targetConvId = newConv.id;
        setActiveConvId(targetConvId);
        isNewConv = true;
      }

      for await (const chunk of askStream(query, targetConvId, attachmentIds)) {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (!last) return next;
          next[next.length - 1] = {
            role: "assistant",
            content: last.content + chunk,
          };
          return next;
        });
      }

      if (isNewConv) {
        await refreshConversations();
        router.replace(`/chat/${targetConvId}`);
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
                {loading ? "Loading..." : "Our agent is ready to help."}
              </p>
            </div>
          ) : (
            <>
              <MessageList messages={messages} />
              {loading && messages[messages.length - 1]?.content === "" && (
                <p className="text-[rgba(232,228,240,0.45)]">Thinking...</p>
              )}
              {error && <p className="text-[#f87171] bg-[#2a1111] p-3 rounded-lg border border-[#f87171]/20 my-4">Error: {error}</p>}
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
