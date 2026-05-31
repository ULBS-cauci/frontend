export type MessageRole = "user" | "assistant" | "system";

export interface Source {
  material_id: string;
  file_name: string;
  download_url: string;
}

export type StreamEvent =
  | { type: "content"; chunk: string }
  | { type: "sources"; sources: Source[] };

export interface Course {
  id: string;
  title: string;
  description: string | null;
  held_by: string | null;
  teacher_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  role: MessageRole;
  content: string;
  sources?: Source[];
}

export interface AskRequest {
  conversation_id: string;
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
  sources?: Source[];
}

export interface Material {
  id: string;
  course_id: string;
  file_name: string;
  file_type: string | null;
  vector_namespace: string | null;
  uploaded_by: string | null;
  object_storage_key: string | null;
  preview_url: string | null;
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
