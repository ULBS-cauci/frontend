import MermaidBlock from "./MermaidBlock";
import QuizBlock from "./QuizBlock";
import InfoCardBlock from "./InfoCardBlock";
import type { BlockRenderer } from "./types";

export const BLOCK_RENDERERS: Record<string, BlockRenderer> = {
  mermaid: MermaidBlock,
  quiz: QuizBlock,
  infocard: InfoCardBlock,
};
