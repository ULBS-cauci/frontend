import Mermaid from "./Mermaid";
import Quiz from "./Quiz";
import InfoCard from "./InfoCard";
import type { MessageRenderer } from "./rendererTypes";

export const MESSAGE_RENDERERS: Record<string, MessageRenderer> = {
  mermaid: Mermaid,
  quiz: Quiz,
  infocard: InfoCard,
};
