import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { theme } from "../theme";
import { GradientText } from "../components/Logo";
import { QuizCard } from "../components/QuizCard";
import { Flashcard } from "../components/Flashcard";

/**
 * Scene 4 — "from one question, a whole study set."
 * A heading, then a live-built quiz on the left and a deck of flashcards that
 * pop in and flip on the right.
 */
export const GenerateScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 18 });
  const titleY = interpolate(titleIn, [0, 1], [24, 0]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleIn,
          fontFamily: theme.fontFamily,
          fontSize: 54,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: theme.text,
          marginBottom: 56,
          textAlign: "center",
        }}
      >
        Instantly turned into <GradientText>quizzes &amp; flashcards</GradientText>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 56 }}>
        {/* Quiz, building live */}
        <QuizCard startFrame={20} width={560} />

        {/* Flashcard deck */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <Flashcard
            startFrame={40}
            flipAt={48}
            front="What is Big-O notation?"
            back="A measure of how runtime grows with input size."
            width={360}
          />
          <Flashcard
            startFrame={62}
            flipAt={70}
            front="Define a hash collision."
            back="Two keys mapping to the same bucket index."
            width={360}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
