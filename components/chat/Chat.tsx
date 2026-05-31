"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { askStream, regenerateStream, getMessages, createConversation, getAttachmentDownloadUrl } from "@/lib/api";
import type { AttachmentPublic, Message, MessagePublic, MessageRole } from "@/lib/types";
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

  const [previewing, setPreviewing] = useState<AttachmentPublic | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  // Fetch PDF as blob when an attachment is selected so we get a same-origin
  // blob URL — cross-origin iframes block Chrome's built-in PDF viewer.
  useEffect(() => {
    if (!previewing) {
      if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
      setPreviewError(false);
      return;
    }

    let cancelled = false;
    setPreviewLoading(true);
    setPreviewError(false);

    fetch(getAttachmentDownloadUrl(previewing.id))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        setPreviewBlobUrl(URL.createObjectURL(blob));
      })
      .catch(() => {
        if (!cancelled) setPreviewError(true);
      })
      .finally(() => {
        if (!cancelled) setPreviewLoading(false);
      });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewing]);

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
          id: m.id,
          role: senderToRole[m.sender],
          content: m.content,
          attachments: m.attachments,
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

    return () => {
      cancelled = true;
    };
  }, [conversationId, setActiveConvId, setMessages]);

  const handleAsk = async (
    query: string,
    attachmentIds: string[] = [],
    attachments: AttachmentPublic[] = [],
  ) => {
    setError(null);
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: query, attachments },
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

  const handleRegenerate = async () => {
    if (!activeConvId) return;
    setError(null);
    setLoading(true);
    setMessages((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];
      if (last?.role !== "assistant") return prev;
      next[next.length - 1] = { role: "assistant", content: "" };
      return next;
    });
    try {
      for await (const chunk of regenerateStream(activeConvId)) {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (!last) return next;
          next[next.length - 1] = { role: "assistant", content: last.content + chunk };
          return next;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error during regeneration");
    } finally {
      setLoading(false);
    }
  };

  const canRegenerate =
    !loading &&
    !!activeConvId &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    messages[messages.length - 1].content !== "";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen bg-[#0c0b10] text-[#e8e4f0] flex">
      {/* Chat pane — full width with no preview, half width when PDF is open */}
      <div className={`${previewing ? "w-1/2" : "w-full"} flex items-center justify-center px-6 py-10`}>
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
                <MessageList
                  messages={messages}
                  onRegenerate={canRegenerate ? handleRegenerate : undefined}
                  onAttachmentClick={setPreviewing}
                />
                {loading && messages[messages.length - 1]?.content === "" && (
                  <p className="text-[rgba(232,228,240,0.45)]">Thinking...</p>
                )}
                {error && (
                  <p className="text-[#f87171] bg-[#2a1111] p-3 rounded-lg border border-[#f87171]/20 my-4">
                    Error: {error}
                  </p>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          <div className="px-6 pb-7">
            <MessageInput onSubmit={handleAsk} disabled={loading} />
          </div>
        </div>
      </div>

      {/* PDF preview pane */}
      {previewing && (
        <div className="w-1/2 border-l border-[rgba(232,228,240,0.07)] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-[#141219] border-b border-[rgba(232,228,240,0.07)] shrink-0">
            <span className="text-sm text-[#e8e4f0] truncate max-w-[80%]" title={previewing.file_name}>
              {previewing.file_name}
            </span>
            <button
              type="button"
              onClick={() => setPreviewing(null)}
              className="text-2xl leading-none text-[rgba(232,228,240,0.6)] hover:text-[#e8e4f0] transition-colors px-2"
              aria-label="Close preview"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {previewLoading && (
              <div className="flex items-center justify-center h-full text-[rgba(232,228,240,0.45)] text-sm">
                Loading…
              </div>
            )}
            {previewError && (
              <div className="flex items-center justify-center h-full text-[#f87171] text-sm">
                Failed to load PDF.
              </div>
            )}
            {!previewLoading && !previewError && previewBlobUrl && (
              <iframe
                src={previewBlobUrl}
                className="w-full h-full bg-white"
                title={previewing.file_name}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
