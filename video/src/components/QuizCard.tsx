import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";

interface Props {
  startFrame: number;
  width?: number;
}

const QUESTION = "Which structure gives O(1) average lookup?";
const OPTIONS: [string, string][] = [
  ["A", "Linked list"],
  ["B", "Hash table"],
  ["C", "Binary tree"],
];
const CORRECT = "B";

/**
 * Faithful rebuild of the app's multiple-choice Quiz card (Quiz.tsx):
 * #141219 surface, violet border, mono-prefixed options, Check button, and the
 * green "Correct!" result. Options stagger in, the answer auto-selects, then
 * the result reveals — as if the quiz is being generated and solved live.
 */
export const QuizCard: React.FC<Props> = ({ startFrame, width = 520 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  const enter = spring({ frame: local, fps, config: { damping: 200 }, durationInFrames: 18 });
  const y = interpolate(enter, [0, 1], [40, 0]);

  const selectAt = 70; // frame the correct option highlights
  const resultAt = 92; // frame the result box appears

  return (
    <div
      style={{
        width,
        opacity: enter,
        transform: `translateY(${y}px)`,
        borderRadius: 18,
        background: "#141219",
        border: "1px solid rgba(124,106,247,0.25)",
        padding: 26,
        boxShadow: "0 24px 70px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: theme.violetLight,
            background: "rgba(124,106,247,0.14)",
            border: "1px solid rgba(124,106,247,0.3)",
            borderRadius: 999,
            padding: "3px 12px",
            fontFamily: theme.fontFamily,
          }}
        >
          Quiz
        </span>
      </div>

      <p
        style={{
          fontFamily: theme.fontFamily,
          fontSize: 22,
          fontWeight: 500,
          color: theme.text,
          margin: "0 0 18px",
        }}
      >
        {QUESTION}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {OPTIONS.map(([key, label], i) => {
          const optStart = 16 + i * 9;
          const optIn = interpolate(local, [optStart, optStart + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const selected = local >= selectAt && key === CORRECT;
          return (
            <div
              key={key}
              style={{
                opacity: optIn,
                transform: `translateX(${interpolate(optIn, [0, 1], [-16, 0])}px)`,
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: 12,
                fontFamily: theme.fontFamily,
                fontSize: 18,
                border: selected ? "1px solid #7c6af7" : "1px solid rgba(232,228,240,0.12)",
                background: selected ? "rgba(124,106,247,0.30)" : "transparent",
                color: selected ? theme.violetLight : "rgba(232,228,240,0.6)",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontFamily: "monospace", marginRight: 10 }}>{key}.</span>
              {label}
            </div>
          );
        })}
      </div>

      {local < resultAt ? (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px 20px",
            borderRadius: 12,
            background: "#7c6af7",
            color: "#fff",
            fontFamily: theme.fontFamily,
            fontSize: 16,
            fontWeight: 500,
            opacity: interpolate(local, [40, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          Check
        </div>
      ) : (
        <div
          style={{
            marginTop: 4,
            padding: 14,
            borderRadius: 12,
            background: "rgba(52,211,153,0.08)",
            border: "1px solid rgba(52,211,153,0.3)",
            opacity: interpolate(local, [resultAt, resultAt + 10], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <p style={{ fontFamily: theme.fontFamily, fontSize: 17, fontWeight: 600, color: "#34d399", margin: "0 0 4px" }}>
            Correct!
          </p>
          <p style={{ fontFamily: theme.fontFamily, fontSize: 15, color: "rgba(232,228,240,0.7)", margin: 0 }}>
            Hash tables average O(1) lookups via direct key hashing.
          </p>
        </div>
      )}
    </div>
  );
};
