import type { ComponentType } from "react";

export interface BlockRendererProps {
  content: string;
  streaming: boolean;
  conversationId?: string;
}

export type BlockRenderer = ComponentType<BlockRendererProps>;
