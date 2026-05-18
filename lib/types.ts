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

export interface Message {
  role: MessageRole;
  content: string;
}

export interface AskRequest {
  query: string;
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
