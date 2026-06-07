import { config } from "./config";
import { AskRequest, AttachmentPublic, Conversation, MessagePublic, Course, CourseCreate, CourseUpdate, Material, StreamEvent, OutputFormatPublic, SystemPromptSummary, UserSettings, UserSettingsUpdate } from "./types";

const SESSIONS_ENDPOINT = `${config.apiUrl}${config.apiPrefix}/sessions`;
const ASK_ENDPOINT = `${SESSIONS_ENDPOINT}/ask`;
const ATTACHMENT_UPLOAD_ENDPOINT = `${SESSIONS_ENDPOINT}/attachments/upload`;
const ATTACHMENT_DOWNLOAD_ENDPOINT = `${SESSIONS_ENDPOINT}/attachments`;
const COURSES_ENDPOINT = `${config.apiUrl}${config.apiPrefix}/courses`;
const USER_ENDPOINT = `${config.apiUrl}${config.apiPrefix}/user`;

export function getAttachmentDownloadUrl(attachmentId: string): string {
  return `${ATTACHMENT_DOWNLOAD_ENDPOINT}/${encodeURIComponent(attachmentId)}`;
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(`${SESSIONS_ENDPOINT}/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch conversations: ${response.status}`);
  }
  return response.json();
}

export async function createConversation(courseId?: string): Promise<Conversation> {
  const response = await fetch(`${SESSIONS_ENDPOINT}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course_id: courseId ?? null }),
  });
  if (!response.ok) {
    throw new Error(`Failed to create conversation: ${response.status}`);
  }
  return response.json();
}

export async function getMessages(conversationId: string): Promise<MessagePublic[]> {
  const response = await fetch(`${SESSIONS_ENDPOINT}/${conversationId}/messages`);
  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.status}`);
  }
  return response.json();
}

export async function uploadAttachment(file: File): Promise<AttachmentPublic> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(ATTACHMENT_UPLOAD_ENDPOINT, { method: "POST", body: form });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function uploadMaterial(courseId: string, file: File): Promise<Material> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${COURSES_ENDPOINT}/${encodeURIComponent(courseId)}/materials`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `Upload failed: ${res.status}`);
  }
  return res.json();
}

export async function getCourses(mine = false): Promise<Course[]> {
  const res = await fetch(`${COURSES_ENDPOINT}/${mine ? "?mine=true" : ""}`);
  if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);
  return res.json();
}

export async function getCourse(courseId: string): Promise<Course> {
  const res = await fetch(`${COURSES_ENDPOINT}/${courseId}`);
  if (!res.ok) throw new Error(`Failed to fetch course: ${res.status}`);
  return res.json();
}

export async function createCourse(data: CourseCreate): Promise<Course> {
  const res = await fetch(`${COURSES_ENDPOINT}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create course: ${res.status}`);
  return res.json();
}

export async function updateCourse(courseId: string, data: CourseUpdate): Promise<Course> {
  const res = await fetch(`${COURSES_ENDPOINT}/${courseId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update course: ${res.status}`);
  return res.json();
}

export async function deleteCourse(courseId: string): Promise<void> {
  const res = await fetch(`${COURSES_ENDPOINT}/${courseId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete course: ${res.status}`);
}

export async function getSystemPrompts(): Promise<SystemPromptSummary[]> {
  const res = await fetch(`${USER_ENDPOINT}/system-prompts`);
  if (!res.ok) throw new Error(`Failed to fetch system prompts: ${res.status}`);
  return res.json();
}

export async function getUserSettings(): Promise<UserSettings> {
  const res = await fetch(`${USER_ENDPOINT}/settings`);
  if (!res.ok) throw new Error(`Failed to fetch settings: ${res.status}`);
  return res.json();
}

export async function updateUserSettings(data: UserSettingsUpdate): Promise<UserSettings> {
  const res = await fetch(`${USER_ENDPOINT}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update settings: ${res.status}`);
  return res.json();
}

export async function getMaterials(courseId: string): Promise<Material[]> {
  const res = await fetch(`${COURSES_ENDPOINT}/${courseId}/materials`);
  if (!res.ok) throw new Error(`Failed to fetch materials: ${res.status}`);
  return res.json();
}


async function* readStream(response: Response): AsyncIterable<StreamEvent> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      if (!event.startsWith("data: ")) continue;
      const data = event.slice(6);
      if (data === "[DONE]") return;
      const parsed = JSON.parse(data);
      if (parsed.type === "status") {
        yield { type: "status", message: parsed.message };
      } else if (parsed.type === "chunk") {
        yield { type: "chunk", content: parsed.content };
      } else if (parsed.type === "sources") {
        yield { type: "sources", sources: parsed.sources };
      } else if (parsed.type === "context_switch_request") {
        yield {
          type: "context_switch_request",
          detected_course_id: parsed.detected_course_id,
          detected_course_name: parsed.detected_course_name,
          user_message_id: parsed.user_message_id,
        };
      } else if (parsed.type === "error") {
        throw new Error(parsed.message);
      }
    }
  }
}

export async function gradeAnswer(
  question: string,
  referenceAnswer: string,
  studentAnswer: string,
): Promise<{ correct: boolean; feedback: string }> {
  const res = await fetch(`${SESSIONS_ENDPOINT}/grade-answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      reference_answer: referenceAnswer,
      student_answer: studentAnswer,
    }),
  });
  if (!res.ok) throw new Error(`Grading failed: ${res.status}`);
  return res.json();
}

export async function getOutputFormats(): Promise<OutputFormatPublic[]> {
  const res = await fetch(`${SESSIONS_ENDPOINT}/output-formats`);
  if (!res.ok) throw new Error(`Failed to fetch output formats: ${res.status}`);
  return res.json();
}

export async function* askStream(
  content: string,
  conversation_id: string,
  attachmentIds: string[] = [],
  forceCurrentCourse = false,
  outputFormatId?: string,
  signal?: AbortSignal,
  existingMessageId?: string,
): AsyncIterable<StreamEvent> {
  const request: AskRequest = {
    content,
    conversation_id,
    ...(attachmentIds.length > 0 ? { attachment_ids: attachmentIds } : {}),
    ...(forceCurrentCourse ? { force_current_course: true } : {}),
    ...(outputFormatId ? { output_format_id: outputFormatId } : {}),
    ...(existingMessageId ? { existing_message_id: existingMessageId } : {}),
  };

  const response = await fetch(ASK_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Backend returned ${response.status}: ${await response.text()}`);
  }

  yield* readStream(response);
}

export async function* regenerateStream(conversation_id: string): AsyncIterable<StreamEvent> {
  const response = await fetch(`${SESSIONS_ENDPOINT}/${conversation_id}/regenerate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok || !response.body) {
    throw new Error(`Backend returned ${response.status}: ${await response.text()}`);
  }

  yield* readStream(response);
}
