"use client";
import { useEffect, useId, useRef, useState } from "react";
import type { BlockRendererProps } from "./types";

let initialized = false;

async function getMermaid() {
  const m = (await import("mermaid")).default;
  if (!initialized) {
    m.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "dark",
      themeVariables: {
        primaryColor: "#7c6af7",
        primaryTextColor: "#e8e4f0",
        primaryBorderColor: "#7c6af7",
        lineColor: "#a78bfa",
        background: "#141219",
        mainBkg: "#141219",
        nodeBorder: "#7c6af7",
        clusterBkg: "#1a1825",
        titleColor: "#e8e4f0",
        edgeLabelBackground: "#141219",
      },
    });
    initialized = true;
  }
  return m;
}

export default function MermaidBlock({ content, streaming }: BlockRendererProps) {
  const uid = useId();
  const renderSeq = useRef(0);
  const [svg, setSvg] = useState<string | null>(null);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    if (streaming) return;
    const seq = ++renderSeq.current;
    setSvg(null);
    setRenderError(false);

    (async () => {
      try {
        const m = await getMermaid();
        const id = `mermaid-${uid.replace(/:/g, "")}-${seq}`;
        const { svg } = await m.render(id, content);
        if (renderSeq.current !== seq) return;
        // Mermaid v11 renders a bomb/error SVG instead of throwing on syntax errors.
        // Check for the rendered <g class="error-icon"> element (not just the string,
        // which also appears in the embedded CSS of every valid diagram).
        if (svg.includes('<g class="error-icon"') || svg.includes("Syntax error in text")) {
          setRenderError(true);
          return;
        }
        setSvg(svg);
      } catch (e) {
        console.error("[MermaidBlock] render failed:", e);
        if (renderSeq.current === seq) setRenderError(true);
      }
    })();
  }, [content, streaming, uid]);

  if (streaming || (!svg && !renderError)) {
    return (
      <div className="my-3 rounded-xl bg-[#141219] border border-[rgba(124,106,247,0.2)] p-4 animate-pulse">
        <div className="h-4 bg-[rgba(124,106,247,0.15)] rounded w-3/4 mb-2" />
        <div className="h-32 bg-[rgba(124,106,247,0.08)] rounded w-full" />
      </div>
    );
  }

  if (renderError) {
    return (
      <pre className="my-3 text-xs text-[rgba(232,228,240,0.6)] bg-[#141219] border border-[rgba(232,228,240,0.1)] rounded-xl p-4 overflow-x-auto whitespace-pre-wrap break-all">
        {content}
      </pre>
    );
  }

  return (
    <div
      className="my-3 rounded-xl bg-[#141219] border border-[rgba(124,106,247,0.15)] p-4 overflow-x-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg! }}
    />
  );
}
