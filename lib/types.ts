export type MessageRole = "user" | "assistant" | "system";

export interface QuizAnswer {
  question: string;
  student_answer: string;
  correct: boolean;
  feedback: string;
}

export interface Source {
  material_id: string;
  file_name: string;
  download_url: string;
}

export type ContextSwitchRequestEvent = {
  type: "context_switch_request";
  detected_course_id: string;
  detected_course_name: string;
  user_message_id: string;
};

export type StreamEvent =
  | { type: "status"; message: string }
  | { type: "chunk"; content: string }
  | { type: "sources"; sources: Source[] }
  | { type: "error"; message: string }
  | { type: "done"; message_id: string }
  | ContextSwitchRequestEvent;

export interface PendingContextSwitch {
  detectedCourseId: string;
  detectedCourseName: string;
  originalQuery: string;
  originalAttachmentIds: string[];
  originalUserMessageId: string;
}

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
  sources?: Source[];
  attachments?: AttachmentPublic[];
  quiz_answers?: QuizAnswer[] | null;
}

export interface AskRequest {
  content: string;
  conversation_id?: string;
  attachment_ids?: string[];
  force_current_course?: boolean;
  output_format_id?: string;
  existing_message_id?: string;
}

export interface OutputFormatPublic {
  id: string;
  name: string;
  description: string | null;
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
  sources?: Source[];
  attachments: AttachmentPublic[];
  quiz_answers?: QuizAnswer[] | null;
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
  updated_at: string | null;
}

export interface UserSettingsUpdate {
  custom_system_prompt?: string | null;
  selected_system_prompt_id?: string | null;
}

export type LearningPathModuleAction = "ask_tutor" | "generate_quiz";

export interface LearningPathModule {
  id: string;
  title: string;
  objectives: string[];
  summary: string | null;
  material_ids: string[];
  suggested_action: LearningPathModuleAction | null;
}

export interface LearningPath {
  id: string;
  user_id: string;
  course_id: string;
  title: string;
  language: string | null;
  modules: LearningPathModule[];
  progress: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

// SSE events emitted by POST /learning-paths/generate (distinct from chat StreamEvent).
export type LearningPathStreamEvent =
  | { type: "status"; message: string }
  | { type: "error"; message: string }
  | { type: "learning_path_done"; learning_path_id: string };
