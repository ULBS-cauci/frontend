"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { askStream, regenerateStream, getMessages, createConversation, getAttachmentDownloadUrl, getCourse } from "@/lib/api";
import type { AttachmentPublic, Message, MessagePublic, MessageRole, PendingContextSwitch } from "@/lib/types";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import CourseSelector from "./CourseSelector";
import ContextSwitchBanner from "./ContextSwitchBanner";
import { useChatContext } from "@/lib/chat-context";

interface ChatProps {
  conversationId?: string;
}

export default function Chat({ conversationId }: ChatProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    conversations, refreshConversations, messages, setMessages,
    activeConvId, setActiveConvId,
    selectedCourseId, setSelectedCourse,
  } = useChatContext();
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingSwitch, setPendingSwitch] = useState<PendingContextSwitch | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [previewing, setPreviewing] = useState<AttachmentPublic | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  // Seed course selection from URL params (e.g. redirect from course detail page).
  useEffect(() => {
    const courseId = searchParams.get("course_id");
    const courseName = searchParams.get("course_name");
    if (courseId && courseName) {
      setSelectedCourse(courseId, decodeURIComponent(courseName));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          sources: m.sources,
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

  // Restore the course selector to match the active conversation's stored course_id.
  // Runs on page load and whenever the conversations list refreshes (e.g. after a new
  // conversation is created). Without this, selectedCourseId resets to null on every
  // page refresh even though course_id is persisted in the DB.
  useEffect(() => {
    if (!conversationId) {
      setSelectedCourse(null, null);
      return;
    }
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return; // list not yet loaded — will re-run when it arrives
    if (!conv.course_id) {
      setSelectedCourse(null, null);
      return;
    }
    let cancelled = false;
    getCourse(conv.course_id)
      .then((course) => {
        if (!cancelled) setSelectedCourse(course.id, course.title);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [conversationId, conversations, setSelectedCourse]);

  const handleAsk = async (
    query: string,
    attachmentIds: string[] = [],
    attachments: AttachmentPublic[] = [],
    forceCurrentCourse = false,
    existingMessageId?: string,
  ) => {
    setError(null);
    setPendingSwitch(null);
    setLoading(true);

    // Only add the user bubble when it's a fresh message (not a re-submission).
    if (!existingMessageId) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: query, attachments },
        { role: "assistant", content: "" },
      ]);
    } else {
      // Re-submission: append a fresh empty assistant bubble.
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    }

    let targetConvId = activeConvId;
    let isNewConv = false;

    try {
      if (!targetConvId) {
        const newConv = await createConversation(selectedCourseId ?? undefined);
        targetConvId = newConv.id;
        setActiveConvId(targetConvId);
        isNewConv = true;
      }

      for await (const event of askStream(query, targetConvId, attachmentIds, forceCurrentCourse, existingMessageId)) {
        if (event.type === "status") {
          setStatusMessage(event.message);
        } else if (event.type === "chunk") {
          setStatusMessage(null);
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (!last) return next;
            next[next.length - 1] = { ...last, content: last.content + event.content };
            return next;
          });
        } else if (event.type === "sources") {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (!last) return next;
            next[next.length - 1] = { ...last, sources: event.sources };
            return next;
          });
        } else if (event.type === "context_switch_request") {
          // Remove the empty assistant bubble and show the confirmation banner instead.
          setMessages((prev) => prev.slice(0, -1));
          setPendingSwitch({
            detectedCourseId: event.detected_course_id,
            detectedCourseName: event.detected_course_name,
            originalQuery: query,
            originalAttachmentIds: attachmentIds,
            userMessageId: event.user_message_id,
          });
        }
      }

      if (isNewConv) {
        await refreshConversations();
        router.replace(`/chat/${targetConvId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
      setStatusMessage(null);
    }
  };

  const handleSwitchCourse = () => {
    if (!pendingSwitch) return;
    const snap = pendingSwitch;

    // Reset all state completely BEFORE any async work so the stream has a
    // clean, empty canvas to write into.
    setPendingSwitch(null);
    setError(null);
    setStatusMessage(null);
    setMessages([]);                 // explicit wipe — no old-course content leaks through
    setLoading(true);
    setSelectedCourse(snap.detectedCourseId, snap.detectedCourseName);

    (async () => {
      try {
        const newConv = await createConversation(snap.detectedCourseId);
        setActiveConvId(newConv.id);

        // Seed the user bubble AFTER we have the conversation ID so the stream
        // appends to a known, stable message array owned by this conv.
        setMessages([
          { role: "user", content: snap.originalQuery },
          { role: "assistant", content: "" },
        ]);

        for await (const event of askStream(snap.originalQuery, newConv.id, snap.originalAttachmentIds)) {
          if (event.type === "status") {
            setStatusMessage(event.message);
          } else if (event.type === "chunk") {
            setStatusMessage(null);
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (!last) return next;
              next[next.length - 1] = { ...last, content: last.content + event.content };
              return next;
            });
          } else if (event.type === "sources") {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (!last) return next;
              next[next.length - 1] = { ...last, sources: event.sources };
              return next;
            });
          }
        }

        // Navigate AFTER the stream is fully consumed. Navigating mid-stream would
        // trigger useEffect([conversationId]) which calls setMessages([]) and wipes
        // the in-progress chunks.
        await refreshConversations();
        router.replace(`/chat/${newConv.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
        setStatusMessage(null);
      }
    })();
  };

  const handleStayCourse = () => {
    if (!pendingSwitch) return;
    const snap = pendingSwitch;
    setPendingSwitch(null);
    // Re-submit with force=true — backend returns a graceful refusal without running RAG.
    handleAsk(snap.originalQuery, snap.originalAttachmentIds, [], true, snap.userMessageId);
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
      for await (const event of regenerateStream(activeConvId)) {
        if (event.type === "status") {
          setStatusMessage(event.message);
        } else if (event.type === "chunk") {
          setStatusMessage(null);
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (!last) return next;
            next[next.length - 1] = { role: "assistant", content: last.content + event.content };
            return next;
          });
        }
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
          {/* Header bar with course selector */}
          <div className="flex items-center justify-end px-10 pt-6 pb-2 shrink-0">
            <CourseSelector />
          </div>

          <div className="flex-1 overflow-y-auto px-10 pt-4 pb-6">
            {messages.length === 0 && !pendingSwitch ? (
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
                {pendingSwitch && (
                  <ContextSwitchBanner
                    pending={pendingSwitch}
                    onSwitch={handleSwitchCourse}
                    onStay={handleStayCourse}
                  />
                )}
                {loading && (messages[messages.length - 1]?.content === "" || statusMessage) && (
                  <div className="mt-1 pl-3 border-l-2 border-[rgba(167,139,250,0.5)] flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[rgba(167,139,250,0.7)] animate-pulse shrink-0" />
                    <span className="text-sm text-[rgba(232,228,240,0.7)] italic">
                      {statusMessage ?? "Thinking..."}
                    </span>
                  </div>
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
