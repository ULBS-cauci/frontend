import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { ChatInput } from "../components/ChatInput";
import { AnswerCard } from "../components/AnswerCard";
import { theme } from "../theme";

const QUESTION = "How to learn for this exam?";

/**
 * Scene 2 — the hero moment.
 * Phase A: the composer sits centered and a student types a question.
 * Phase B: the composer glides up and the assistant answer grows out from it,
 *          recreating the "type → transform into answer" interaction.
 */
export const AskScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TYPE_START = 14;
  const charDuration = 2.2;
  const typeEnd = TYPE_START + QUESTION.length * charDuration; // ~73 frames
  const MORPH_AT = typeEnd + 14; // answers quickly after typing

  // Composer enters.
  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 16 });
  const enterScale = interpolate(enter, [0, 1], [0.92, 1]);

  // Morph: composer slides from vertical center up toward the top.
  const morph = spring({
    frame: frame - MORPH_AT,
    fps,
    config: { damping: 200 },
    durationInFrames: 26,
  });
  // Centered (0) → lifted up by 230px.
  const composerY = interpolate(morph, [0, 1], [0, -230]);
  const composerScale = interpolate(morph, [0, 1], [1, 0.82]);

  const answerStart = MORPH_AT + 10;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Hint label above the composer, fades out as we morph. */}
      <div
        style={{
          position: "absolute",
          top: 300,
          opacity: interpolate(frame, [0, 14, MORPH_AT - 10, MORPH_AT + 4], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontFamily: theme.fontFamily,
          fontSize: 22,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: theme.textFaint,
        }}
      >
        Just ask.
      </div>

      {/* Composer */}
      <div
        style={{
          position: "absolute",
          transform: `translateY(${composerY}px) scale(${composerScale * enterScale})`,
        }}
      >
        <ChatInput text={QUESTION} startFrame={TYPE_START} charDuration={charDuration} />
      </div>

      {/* Answer grows below the lifted composer. */}
      {frame >= answerStart && (
        <div style={{ position: "absolute", transform: "translateY(120px)" }}>
          <AnswerCard
            startFrame={answerStart}
            heading="Here's your focused study plan:"
            lines={[
              { w: 360, title: true },
              { w: 760 },
              { w: 700 },
              { w: 540 },
              { w: 300, title: true },
              { w: 720 },
              { w: 480 },
            ]}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
