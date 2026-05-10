import ReactMarkdown from "react-markdown";
import type { Message } from "@/lib/types";

interface Props {
  messages: Message[];
}

export default function MessageList({ messages }: Props) {
  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <strong>{msg.role === "user" ? "You" : "Tutor"}:</strong>
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}