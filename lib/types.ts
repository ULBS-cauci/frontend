export type MessageRole = "user" | "assistant" | "system";

export interface Course {
  id: string;
  title: string;
  description: string | null;
  held_by: string | null;
  teacher_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttachmentPublic {
  id: string;
  file_name: string;
  created_at: string;
}

export type Attachment = AttachmentPublic;

export interface Message {
  id?: string;
  role: MessageRole;
  content: string;
  attachments?: AttachmentPublic[];
}

export interface AskRequest {
  content: string;
  conversation_id?: string;
  attachment_ids?: string[];
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
  output_format_id: string | null;
  created_at: string;
  attachments: AttachmentPublic[];
}

export interface Material {
  id: string;
  course_id: string;
  file_name: string;
  file_type: string | null;
  vector_namespace: string | null;
  uploaded_by: string | null;
  object_storage_key: string | null;
  created_at: string;
}

export interface CourseCreate {
  title: string;
  description?: string;
}

export interface CourseUpdate {
  title?: string;
  description?: string;
}

export interface SystemPromptSummary {
  id: string;
  title: string | null;
}

export interface UserSettings {
  user_id: string;
  custom_system_prompt: string | null;
  selected_system_prompt_id: string | null;
  updated_at: string;
}

export interface UserSettingsUpdate {
  custom_system_prompt?: string | null;
  selected_system_prompt_id?: string | null;
}
