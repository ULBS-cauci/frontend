import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { SparkMark } from "./Logo";

interface Line {
  /** width of the shimmer line in px, or "title" for a heading row. */
  w: number;
  title?: boolean;
}

interface Props {
  /** Frame the card starts revealing at. */
  startFrame: number;
  width?: number;
  heading: string;
  lines: Line[];
}

/**
 * The assistant answer that "grows" out of the input. Reveals a heading then
 * streams skeleton lines, mimicking a streamed markdown response.
 */
export const AnswerCard: React.FC<Props> = ({
  startFrame,
  width = 920,
  heading,
  lines,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  const enter = spring({
    frame: local,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });
  const y = interpolate(enter, [0, 1], [40, 0]);
  const opacity = interpolate(local, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width,
        transform: `translateY(${y}px)`,
        opacity,
        borderRadius: 22,
        padding: 32,
        background: "rgba(21,19,28,0.92)",
        border: `1px solid ${theme.glassBorder}`,
        boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
        display: "flex",
        gap: 20,
      }}
    >
      {/* Assistant avatar */}
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          background: "rgba(124,106,247,0.12)",
          border: "1px solid rgba(124,106,247,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <SparkMark size={24} />
      </div>

      <div style={{ flex: 1 }}>
        <Heading text={heading} startLocal={6} local={local} />
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          {lines.map((line, i) => {
            const lineStart = 18 + i * 7;
            const lineOpacity = interpolate(
              local,
              [lineStart, lineStart + 8],
              [0, line.title ? 1 : 0.5],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            const lineGrow = interpolate(
              local,
              [lineStart, lineStart + 12],
              [0, line.w],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div
                key={i}
                style={{
                  height: line.title ? 22 : 16,
                  width: lineGrow,
                  borderRadius: 8,
                  opacity: lineOpacity,
                  background: line.title
                    ? theme.brandGradient
                    : "rgba(232,228,240,0.30)",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** Typewriter heading inside the answer card. */
const Heading: React.FC<{ text: string; startLocal: number; local: number }> = ({
  text,
  startLocal,
  local,
}) => {
  const chars = Math.max(
    0,
    Math.min(text.length, Math.floor((local - startLocal) / 1.4)),
  );
  return (
    <div
      style={{
        fontFamily: theme.fontFamily,
        fontSize: 30,
        fontWeight: 600,
        color: theme.text,
        letterSpacing: "-0.01em",
        minHeight: 36,
      }}
    >
      {text.slice(0, chars)}
    </div>
  );
};
