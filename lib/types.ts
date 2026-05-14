import { UUID } from "crypto";

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  role: MessageRole;
  content: string;
}

export interface AskRequest {
  conversation_id: string; // Changed from UUID
  content: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  course_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface MessagePublic {
  id: string;
  conversation_id: string;
  sender: "User" | "System" | "AI";
  content: string;
  output_type_requested: string | null;
  created_at: string;
}
