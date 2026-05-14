import { UUID } from "crypto";

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  role: MessageRole;
  content: string;
}

export interface AskRequest {
  conversation_id: UUID;
  content: string;
}
