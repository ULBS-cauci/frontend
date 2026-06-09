"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Conversation, Message, OutputFormatPublic } from "./types";
import { getConversations, getOutputFormats } from "./api";

type ConvPref = { outputFormatId: string; promptId?: string };

interface ChatContextType {
  conversations: Conversation[];
  refreshConversations: () => Promise<void>;
  bumpConversation: (id: string) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  activeConvId: string | undefined;
  setActiveConvId: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedCourseId: string | null;
  selectedCourseName: string | null;
  setSelectedCourse: (id: string | null, name: string | null) => void;
  outputFormats: OutputFormatPublic[];
  convPrefs: Record<string, ConvPref>;
  setConvPref: (convId: string, pref: Partial<ConvPref>) => void;
  migrateNewConvPref: (newConvId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | undefined>(undefined);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);
  const [outputFormats, setOutputFormats] = useState<OutputFormatPublic[]>([]);
  const [convPrefs, setConvPrefs] = useState<Record<string, ConvPref>>({});

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

  const bumpConversation = useCallback((id: string) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      const [conv] = next.splice(idx, 1);
      return [conv, ...next];
    });
  }, []);

  const setConvPref = useCallback((convId: string, pref: Partial<ConvPref>) => {
    setConvPrefs((prev) => {
      const current: ConvPref = prev[convId] ?? { outputFormatId: "" };
      return { ...prev, [convId]: { ...current, ...pref } };
    });
  }, []);

  const migrateNewConvPref = useCallback((newConvId: string) => {
    setConvPrefs((prev) => {
      const { __new__: newPref, ...rest } = prev;
      if (!newPref) return prev;
      return { ...rest, [newConvId]: newPref };
    });
  }, []);

  useEffect(() => {
    refreshConversations();
    getOutputFormats().then(setOutputFormats).catch((err) => console.error("Failed to fetch output formats:", err));
  }, [refreshConversations]);

  return (
    <ChatContext.Provider value={{
      conversations, refreshConversations, bumpConversation,
      messages, setMessages,
      activeConvId, setActiveConvId,
      selectedCourseId, selectedCourseName, setSelectedCourse,
      outputFormats, convPrefs, setConvPref, migrateNewConvPref,
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
