import { brand } from "../brand";
import { TypeOn } from "./TypeOn";

interface Props {
  role: "user" | "assistant";
  text: string;
  /** When true, the text types/streams on via TypeOn. */
  streaming?: boolean;
  /** Frame (relative to Sequence) streaming begins. */
  startFrame?: number;
  cps?: number;
  maxWidth?: number;
  fontSize?: number;
}

/**
 * Replicates the ULBS Coach chat bubbles. User messages are right-aligned with
 * the violet-tinted glass fill; assistant messages are left-aligned with the
 * spark avatar and can stream their text on word-by-word.
 */
export const ChatBubble: React.FC<Props> = ({
  role,
  text,
  streaming = false,
  startFrame = 0,
  cps = 26,
  maxWidth = 720,
  fontSize = 26,
}) => {
  const isUser = role === "user";

  const body = streaming ? (
    <TypeOn text={text} startFrame={startFrame} cps={cps} />
  ) : (
    text
  );

  if (isUser) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <div
          style={{
            maxWidth,
            background: "rgba(124,106,247,0.16)",
            border: "1px solid rgba(124,106,247,0.30)",
            borderRadius: 18,
            padding: "16px 22px",
            fontFamily: brand.fontFamily,
            fontSize,
            lineHeight: 1.35,
            color: brand.text,
          }}
        >
          {body}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 16, maxWidth, width: "100%" }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          flexShrink: 0,
          background: "rgba(124,106,247,0.12)",
          border: "1px solid rgba(124,106,247,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id="bubbleSpark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={brand.blue} />
              <stop offset="100%" stopColor={brand.magenta} />
            </linearGradient>
          </defs>
          <path
            d="M50 4 C54 30 70 46 96 50 C70 54 54 70 50 96 C46 70 30 54 4 50 C30 46 46 30 50 4Z"
            fill="url(#bubbleSpark)"
          />
        </svg>
      </div>
      <div
        style={{
          flex: 1,
          fontFamily: brand.fontFamily,
          fontSize,
          lineHeight: 1.5,
          color: brand.text,
          paddingTop: 6,
        }}
      >
        {body}
      </div>
    </div>
  );
};
