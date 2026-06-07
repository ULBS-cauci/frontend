"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Conversation, Message, OutputFormatPublic } from "./types";
import { getConversations, getOutputFormats } from "./api";

interface ChatContextType {
  conversations: Conversation[];
  refreshConversations: () => Promise<void>;
  bumpConversation: (id: string) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  activeConvId: string | undefined;
  setActiveConvId: React.Dispatch<React.SetStateAction<string | undefined>>;
  outputFormats: OutputFormatPublic[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | undefined>(undefined);
  const [outputFormats, setOutputFormats] = useState<OutputFormatPublic[]>([]);

  const refreshConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  }, []);

  const bumpConversation = useCallback((id: string) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      const [conv] = next.splice(idx, 1);
      return [conv, ...next];
    });
  }, []);

  useEffect(() => {
    refreshConversations();
    getOutputFormats().then(setOutputFormats).catch((err) => console.error("Failed to fetch output formats:", err));
  }, [refreshConversations]);

  return (
    <ChatContext.Provider value={{ conversations, refreshConversations, bumpConversation, messages, setMessages, activeConvId, setActiveConvId, outputFormats }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
