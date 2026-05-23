export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  role: MessageRole;
  content: string;
}

export interface Attachment {
  id: string;
  file_name: string;
  object_storage_key: string;
  created_at: string;
}

export interface AskRequest {
  query: string;
  attachment_ids?: string[];
}
