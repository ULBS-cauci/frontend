import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";

interface Props {
  /** Full question text to type out. */
  text: string;
  /** Frame at which typing starts. */
  startFrame: number;
  /** Frames per character. */
  charDuration?: number;
  /** Width of the input in px. */
  width?: number;
  /** Show the animated glow border. */
  glow?: boolean;
  /** 0..1 scale applied for morph transitions. */
  scale?: number;
  /** Show the send button as "active" (filled) once typing is done. */
  fullText?: string;
}

/**
 * A faithful mock of the ULBS Coach chat composer with a typewriter effect and
 * a blinking caret. Used as the centerpiece "type a question" moment.
 */
export const ChatInput: React.FC<Props> = ({
  text,
  startFrame,
  charDuration = 2.2,
  width = 920,
  glow = true,
  scale = 1,
}) => {
  const frame = useCurrentFrame();

  const charsShown = Math.max(
    0,
    Math.min(text.length, Math.floor((frame - startFrame) / charDuration)),
  );
  const typed = text.slice(0, charsShown);
  const doneTyping = charsShown >= text.length;

  // Blinking caret.
  const caretOpacity = Math.sin(frame / 4) > 0 ? 1 : 0.15;

  // Spinning conic glow border — matches the app's .glow-border (4s / 360deg).
  const borderAngle = (frame / (4 * 30)) * 360;

  const sendActive = doneTyping;
  const sendScale = doneTyping
    ? interpolate(
        frame,
        [startFrame + text.length * charDuration, startFrame + text.length * charDuration + 8],
        [0.8, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )
    : 1;

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
      <div
        style={{
          position: "relative",
          width,
          borderRadius: 22,
          padding: glow ? 1.5 : 0,
          background: glow
            ? `conic-gradient(from ${borderAngle}deg, transparent 0%, transparent 25%, #7c6af7 40%, #a78bfa 50%, #c084fc 60%, transparent 75%, transparent 100%)`
            : "transparent",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            borderRadius: 21,
            padding: "26px 26px 26px 30px",
            background: "rgba(21,19,28,0.92)",
            border: `1px solid ${theme.glassBorder}`,
            backdropFilter: "blur(16px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
          }}
        >
          {/* Plus / attach icon */}
          <PlusIcon />

          {/* Text + caret */}
          <div
            style={{
              flex: 1,
              fontFamily: theme.fontFamily,
              fontSize: 30,
              color: typed.length ? theme.text : theme.textFaint,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
              whiteSpace: "pre-wrap",
            }}
          >
            {typed.length ? typed : "Ask ULBS Coach anything…"}
            {!doneTyping && (
              <span
                style={{
                  display: "inline-block",
                  width: 3,
                  height: 30,
                  marginLeft: 2,
                  transform: "translateY(5px)",
                  background: theme.violetLight,
                  opacity: caretOpacity,
                  borderRadius: 2,
                }}
              />
            )}
          </div>

          {/* Send button */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${sendScale})`,
              background: sendActive
                ? theme.brandGradient
                : "rgba(124,106,247,0.15)",
              border: sendActive
                ? "none"
                : `1px solid ${theme.glassBorder}`,
              transition: "background 0.2s",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 19V5M12 5l-7 7M12 5l7 7"
                stroke={sendActive ? "#0c0b10" : theme.violetLight}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlusIcon: React.FC = () => (
  <div
    style={{
      width: 44,
      height: 44,
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(124,106,247,0.10)",
      border: "1px solid rgba(124,106,247,0.22)",
      flexShrink: 0,
    }}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke={theme.violetLight}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  </div>
);
