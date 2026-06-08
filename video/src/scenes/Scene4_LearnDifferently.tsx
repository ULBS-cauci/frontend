import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { brand } from "../brand";
import { fonts } from "../fonts";
import { FadeSlide } from "../components/FadeSlide";
import { ScreenshotFrame } from "../components/ScreenshotFrame";

/**
 * Scene 4 — Learn Differently (0:18–0:26).
 * Headline slides in from the left; two cards spring in 6 frames (~200ms) apart.
 * The Quizzes card floats (subtle vertical bobble); the Flashcards card does a
 * 3D flip from question (screenshot) to answer.
 */
export const Scene4LearnDifferently: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrances, staggered.
  const card1 = spring({ frame: frame - 24, fps, config: { damping: 16 }, durationInFrames: 22 });
  const card2 = spring({ frame: frame - 30, fps, config: { damping: 16 }, durationInFrames: 22 });

  // Quiz card floats: ±4px on a slow sine.
  const bob = Math.sin(frame / 15) * 4;

  // Flashcard flip (question → answer) around frame 78.
  const flip = spring({ frame: frame - 78, fps, config: { damping: 200 }, durationInFrames: 24 });
  const rotateY = interpolate(flip, [0, 1], [0, 180]);
  const showBack = rotateY > 90;

  // Scene exit fade (hand-off to Scene 5).
  const exit = interpolate(frame, [222, 240], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: exit }}>
      <div style={{ width: 1500 }}>
        <FadeSlide direction="left" distance={60} enterAt={6} enterDuration={20}>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 66,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: brand.text,
              marginBottom: 52,
            }}
          >
            Want to learn <span style={{ background: brand.gradient, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>differently?</span>
          </div>
        </FadeSlide>

        <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
          {/* Quizzes — floating */}
          <div style={{ flex: 1, opacity: card1, transform: `translateY(${interpolate(card1, [0, 1], [50, 0]) + bob}px)` }}>
            <CardLabel>Quizzes</CardLabel>
            <ScreenshotFrame src="screenshots/quiz.png" width={700} alt="ULBS Coach quiz UI" />
          </div>

          {/* Flashcards — 3D flip */}
          <div style={{ flex: 1, opacity: card2, transform: `translateY(${interpolate(card2, [0, 1], [50, 0])}px)`, perspective: 1600 }}>
            <CardLabel>Flashcards</CardLabel>
            <div style={{ position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${rotateY}deg)` }}>
              <div style={{ backfaceVisibility: "hidden", opacity: showBack ? 0 : 1 }}>
                <ScreenshotFrame src="screenshots/flashcards.png" width={700} alt="ULBS Coach flashcards UI" />
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  opacity: showBack ? 1 : 0,
                  borderRadius: 20,
                  background: "linear-gradient(150deg, rgba(124,106,247,0.28), rgba(200,80,240,0.18))",
                  border: "1px solid rgba(124,106,247,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: 40,
                }}
              >
                <span style={{ fontFamily: brand.fontFamily, fontSize: 34, fontWeight: 500, color: brand.text }}>
                  Big-O measures how runtime grows with input size.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CardLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: fonts.display,
      fontSize: 26,
      fontWeight: 600,
      color: brand.textMuted,
      marginBottom: 16,
      letterSpacing: "0.02em",
    }}
  >
    {children}
  </div>
);
