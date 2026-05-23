import { config } from "./config";
import { AskRequest, Attachment } from "./types";

const ASK_ENDPOINT = `${config.apiUrl}${config.apiPrefix}/sessions/ask`;
const ATTACHMENT_UPLOAD_ENDPOINT = `${config.apiUrl}${config.apiPrefix}/sessions/attachments/upload`;

export async function uploadAttachment(file: File): Promise<Attachment> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(ATTACHMENT_UPLOAD_ENDPOINT, { method: "POST", body: form });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function* askStream(query: string, attachmentIds: string[] = []): AsyncIterable<string> {
  const request: AskRequest = {
    query,
    ...(attachmentIds.length > 0 ? { attachment_ids: attachmentIds } : {}),
  };

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
