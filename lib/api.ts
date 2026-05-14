import { UUID } from "crypto";
import { config } from "./config";
import { AskRequest, Conversation, MessagePublic } from "./types";

const SESSIONS_ENDPOINT = `${config.apiUrl}${config.apiPrefix}/sessions`;
const ASK_ENDPOINT = `${SESSIONS_ENDPOINT}/ask`;

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
