import type { ComponentType } from "react";
import type { QuizAnswer } from "@/lib/types";

export interface MessageRendererProps {
  content: string;
  streaming: boolean;
  conversationId?: string;
  messageId?: string;
  quizAnswers?: QuizAnswer[];
}

export type MessageRenderer = ComponentType<MessageRendererProps>;
