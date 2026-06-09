"use client";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { askStream, regenerateStream, getMessages, createConversation, getAttachmentDownloadUrl, getCourse } from "@/lib/api";
import type { AttachmentPublic, Message, MessagePublic, MessageRole, PendingContextSwitch } from "@/lib/types";
import MessageList from "./MessageList";
import MessageInput, { type MessageInputHandle } from "./MessageInput";
import FilePreview from "../FilePreview";
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
  const [streaming, setStreaming] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingSwitch, setPendingSwitch] = useState<PendingContextSwitch | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastUserRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<MessageInputHandle>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollIntent = useRef<"bottom" | "user-top" | null>(null);
  const [previewing, setPreviewing] = useState<AttachmentPublic | null>(null);

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
          quiz_answers: m.quiz_answers,
        }));
        setMessages(formatted);
        scrollIntent.current = "bottom";
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

  useEffect(() => {
    const urlCourseId = searchParams.get("course_id");
    const urlCourseName = searchParams.get("course_name");
    if (urlCourseId && urlCourseName) {
      setSelectedCourse(urlCourseId, urlCourseName);
      return;
    }

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
  }, [conversationId, conversations, setSelectedCourse, searchParams]);

  const handleAsk = async (
    query: string,
    attachmentIds: string[] = [],
    attachments: AttachmentPublic[] = [],
    outputFormatId = "",
    forceCurrentCourse = false,
    addUserBubble = true,
    existingMessageId = "",
  ) => {
    // Ignore re-entrant calls while a request is already streaming — guards against
    // a duplicate POST /ask if a submit fires again before the first one settles.
    if (abortRef.current) return;
    setError(null);
    setPendingSwitch(null);
    setLoading(true);
    setStreaming(true);

    if (addUserBubble) {
      scrollIntent.current = "user-top";
      setMessages((prev) => [
        ...prev,
        { role: "user", content: query, attachments },
        { role: "assistant", content: "" },
      ]);
    } else {
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    }

    const controller = new AbortController();
    abortRef.current = controller;

    let targetConvId = activeConvId;
    let isNewConv = false;

    try {
      if (!targetConvId) {
        const newConv = await createConversation(selectedCourseId ?? undefined);
        targetConvId = newConv.id;
        setActiveConvId(targetConvId);
        isNewConv = true;
      }

      for await (const event of askStream(query, targetConvId, attachmentIds, forceCurrentCourse, outputFormatId || undefined, controller.signal, existingMessageId || undefined)) {
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
            const unique = event.sources.filter(
              (s, i, arr) => arr.findIndex(x => x.material_id === s.material_id) === i
            );
            next[next.length - 1] = { ...last, sources: unique };
            return next;
          });
        } else if (event.type === "done") {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (!last) return next;
            next[next.length - 1] = { ...last, id: event.message_id };
            return next;
          });
        } else if (event.type === "context_switch_request") {
          setMessages((prev) => prev.slice(0, -1));
          setPendingSwitch({
            detectedCourseId: event.detected_course_id,
            detectedCourseName: event.detected_course_name,
            originalQuery: query,
            originalAttachmentIds: attachmentIds,
            originalUserMessageId: event.user_message_id,
          });
          return; // stop the stream loop — loading=false fires in the finally block
        }
      }

      if (isNewConv) {
        await refreshConversations();
        router.replace(`/chat/${targetConvId}`);
      }
    } catch (err) {
      if (controller.signal.aborted) {
        // Stopped by the user: discard the in-progress turn (the just-added user +
        // assistant bubbles) and restore the prompt so it can be edited and resent.
        // The backend persists nothing for a cancelled stream, so this stays consistent.
        setMessages((prev) => prev.slice(0, -2));
        inputRef.current?.restore(query, attachments);
      } else {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    } finally {
      abortRef.current = null;
      setStreaming(false);
      setLoading(false);
      setStatusMessage(null);
    }
  };

  const handleSwitchCourse = () => {
    if (!pendingSwitch) return;
    const snap = pendingSwitch;

    setPendingSwitch(null);
    setError(null);
    setStatusMessage(null);
    setMessages([]);
    setLoading(true);
    setSelectedCourse(snap.detectedCourseId, snap.detectedCourseName);

    (async () => {
      try {
        const newConv = await createConversation(snap.detectedCourseId);
        setActiveConvId(newConv.id);

        setMessages([
          { role: "user", content: snap.originalQuery },
          { role: "assistant", content: "" },
        ]);

        for await (const event of askStream(
          snap.originalQuery,
          newConv.id,
          snap.originalAttachmentIds,
        )) {
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
    // Re-submit with force=true and the original message ID so the backend skips
    // creating a duplicate user message, then short-circuits to a polite refusal.
    handleAsk(snap.originalQuery, snap.originalAttachmentIds, [], "", true, false, snap.originalUserMessageId);
  };

  const handleRegenerate = async () => {
    if (!activeConvId) return;
    if (abortRef.current) return;
    setError(null);
    setLoading(true);
    setStreaming(true);
    // Snapshot the current messages so a stop can restore the previous answer untouched.
    const snapshot = messages;
    setMessages((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];
      if (last?.role !== "assistant") return prev;
      next[next.length - 1] = { role: "assistant", content: "" };
      return next;
    });

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      for await (const event of regenerateStream(activeConvId, controller.signal)) {
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
            const unique = event.sources.filter(
              (s, i, arr) => arr.findIndex(x => x.material_id === s.material_id) === i
            );
            next[next.length - 1] = { ...last, sources: unique };
            return next;
          });
        }
      }
    } catch (err) {
      if (controller.signal.aborted) {
        // Stopped by the user: the backend kept the original answer (it only commits a
        // regeneration at the very end), so restore the pre-regeneration view.
        setMessages(snapshot);
      } else {
        setError(err instanceof Error ? err.message : "Unknown error during regeneration");
      }
    } finally {
      abortRef.current = null;
      setStreaming(false);
      setLoading(false);
      setStatusMessage(null);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
  };

  const canRegenerate =
    !loading &&
    !!activeConvId &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    messages[messages.length - 1].content !== "";

  useLayoutEffect(() => {
    if (scrollIntent.current === "bottom") {
      const container = scrollContainerRef.current;
      const bottom = bottomRef.current;
      if (container && bottom) {
        container.scrollTop =
          container.scrollTop +
          bottom.getBoundingClientRect().top -
          container.getBoundingClientRect().top -
          container.clientHeight;
      }
    } else if (scrollIntent.current === "user-top") {
      const container = scrollContainerRef.current;
      const el = lastUserRef.current;
      if (container && el) {
        const offset = Math.round(container.clientHeight / 3);
        container.scrollTop =
          el.getBoundingClientRect().top -
          container.getBoundingClientRect().top +
          container.scrollTop -
          offset;
      }
    }
    scrollIntent.current = null;
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

          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-10 pt-4 pb-6">
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
                  streamingActive={loading}
                  conversationId={activeConvId}
                  lastUserRef={lastUserRef}
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
                {loading && <div className="h-screen shrink-0" aria-hidden="true" />}
              </>
            )}
          </div>

          <div className="px-6 pb-7">
            <MessageInput
              ref={inputRef}
              onSubmit={handleAsk}
              disabled={loading || streaming}
              isGenerating={streaming}
              onStop={handleStop}
            />
          </div>
        </div>
      </div>

      {/* Attachment preview pane */}
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
            <FilePreview
              url={getAttachmentDownloadUrl(previewing.id)}
              fileName={previewing.file_name}
            />
          </div>
        </div>
      )}
    </div>
  );
}
