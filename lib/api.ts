import { config } from "./config";
import { AskRequest, Conversation, MessagePublic, Course, CourseCreate, CourseUpdate, Material } from "./types";

const SESSIONS_ENDPOINT = `${config.apiUrl}${config.apiPrefix}/sessions`;
const ASK_ENDPOINT = `${SESSIONS_ENDPOINT}/ask`;
const COURSES_ENDPOINT = `${config.apiUrl}${config.apiPrefix}/courses`;
const FILES_ENDPOINT = `${config.apiUrl}${config.apiPrefix}/files`;

export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(SESSIONS_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Failed to fetch conversations: ${response.status}`);
  }
  return response.json();
}

export async function createConversation(): Promise<Conversation> {
  const response = await fetch(SESSIONS_ENDPOINT, { method: "POST" });
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

export async function uploadMaterial(courseId: string, file: File): Promise<Material> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${FILES_ENDPOINT}/upload?course_id=${courseId}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `Upload failed: ${res.status}`);
  }
  return res.json();
}

export async function getCourses(): Promise<Course[]> {
  const res = await fetch(COURSES_ENDPOINT);
  if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);
  return res.json();
}

export async function createCourse(data: CourseCreate): Promise<Course> {
  const res = await fetch(COURSES_ENDPOINT, {
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

export async function getMaterials(courseId: string): Promise<Material[]> {
  const res = await fetch(`${COURSES_ENDPOINT}/${courseId}/materials`);
  if (!res.ok) throw new Error(`Failed to fetch materials: ${res.status}`);
  return res.json();
}

export async function* askStream(content: string, conversation_id: string): AsyncIterable<string> {
  const request: AskRequest = { content, conversation_id };

  const response = await fetch(ASK_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok || !response.body) {
    throw new Error(
      `Backend returned ${response.status}: ${await response.text()}`
    );
  }

  const reader = response.body.getReader();
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
      yield JSON.parse(data);
    }
  }
}
