"use client";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { MESSAGE_RENDERERS } from "./messageTypes/registry";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  content: string;
  streaming?: boolean;
  conversationId?: string;
}

function MarkdownMessage({
  content,
  streaming = false,
  conversationId,
}: Props) {
  const components: Components = {
    // Strip the outer <pre> — registered block renderers own their container;
    // unregistered block code re-creates <pre> inside the code renderer below.
    pre({ children }) {
      return <>{children}</>;
    },

    code({ className, children }) {
      const lang = /language-(\w+)/.exec(className ?? "")?.[1];
      const Renderer = lang ? MESSAGE_RENDERERS[lang] : undefined;
      if (Renderer) {
        const raw = String(children ?? "").replace(/\n$/, "");
        return (
          <Renderer content={raw} streaming={streaming} conversationId={conversationId} />
        );
      }
      if (lang) {
        return (
          <SyntaxHighlighter
            language={lang}
            style={vscDarkPlus}
            customStyle={{
              margin: "8px 0",
              borderRadius: "10px",
              fontSize: "13px",
              background: "#1e1e1e",
              border: "1px solid rgba(232,228,240,0.08)",
            }}
            wrapLongLines
          >
            {String(children ?? "").replace(/\n$/, "")}
          </SyntaxHighlighter>
        );
      }
      return (
        <code className="bg-[rgba(124,106,247,0.12)] text-[#a78bfa] rounded px-1.5 py-0.5 text-[0.85em] font-mono">
          {children}
        </code>
      );
    },

    // Prose styles
    h1: ({ children }) => (
      <h1 className="text-xl font-bold text-[#e8e4f0] mt-4 mb-2 first:mt-0">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg font-semibold text-[#e8e4f0] mt-3 mb-2 first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-semibold text-[#a78bfa] mt-2 mb-1 first:mt-0">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-outside pl-5 mb-2 space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside pl-5 mb-2 space-y-1">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-[rgba(232,228,240,0.9)] leading-relaxed">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-[#e8e4f0]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[rgba(124,106,247,0.45)] pl-3 italic text-[rgba(232,228,240,0.65)] my-2">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-[#a78bfa] hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    ),
    hr: () => <hr className="border-[rgba(232,228,240,0.1)] my-3" />,
  };

  return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
}

// Memoize so messages that aren't streaming don't re-render (and re-render their
// Mermaid diagrams) every time the last message receives a new chunk.
export default memo(MarkdownMessage);
