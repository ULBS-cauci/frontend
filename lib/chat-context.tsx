"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Conversation, Message } from "./types";
import { getConversations } from "./api";

interface ChatContextType {
  conversations: Conversation[];
  refreshConversations: () => Promise<void>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  activeConvId: string | undefined;
  setActiveConvId: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedCourseId: string | null;
  selectedCourseName: string | null;
  setSelectedCourse: (id: string | null, name: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | undefined>(undefined);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);

  const setSelectedCourse = useCallback((id: string | null, name: string | null) => {
    setSelectedCourseId(id);
    setSelectedCourseName(name);
  }, []);

  const refreshConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  }, []);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  return (
    <ChatContext.Provider value={{
      conversations, refreshConversations,
      messages, setMessages,
      activeConvId, setActiveConvId,
      selectedCourseId, selectedCourseName, setSelectedCourse,
    }}>
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
