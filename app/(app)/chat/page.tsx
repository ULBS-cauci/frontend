"use client";
import { useState } from "react";
import Chat from "@/components/chat/Chat";

export default function ChatPage() {
  const [initialQuery] = useState<string | undefined>(() => {
    const q = sessionStorage.getItem("firstMessage") ?? undefined;
    if (q) sessionStorage.removeItem("firstMessage");
    return q;
  });

  return <Chat initialQuery={initialQuery} />;
}
