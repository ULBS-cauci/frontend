"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Conversation } from "./types";
import { getConversations } from "./api";

interface ChatContextType {
  conversations: Conversation[];
  refreshConversations: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const refreshConversations = async () => {
    try {
      const data = await getConversations();
      // Sort by updated_at descending
      data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  useEffect(() => {
    refreshConversations();
  }, []);

  return (
    <ChatContext.Provider value={{ conversations, refreshConversations }}>
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
