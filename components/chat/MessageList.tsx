import ReactMarkdown from "react-markdown";
import type { Message } from "@/lib/types";
import { colors, fontSizes, radii } from "@/lib/tokens";

interface Props {
  messages: Message[];
}

export default function MessageList({ messages }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
            <p
              style={{
                fontSize: fontSizes.sm,
                color: colors.textMuted,
                marginBottom: 6,
                letterSpacing: "0.03em",
              }}
            >
              {isUser ? "You" : "Agent"}
            </p>
            <div
              style={{
                background: colors.bg,
                border: "1px solid rgba(232,228,240,0.07)",
                borderRadius: radii.md,
                padding: "16px 20px",
                color: colors.text,
                fontSize: fontSizes.base,
                lineHeight: 1.7,
                maxWidth: "75%",
              }}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        );
      })}
    </div>
  );
}
