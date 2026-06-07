import type { ComponentType } from "react";

export interface MessageRendererProps {
  content: string;
  streaming: boolean;
  conversationId?: string;
}

export type MessageRenderer = ComponentType<MessageRendererProps>;
