import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { brand } from "../../brand";
import { FadeSlide } from "../../components/FadeSlide";
import { ScreenshotFrame } from "../../components/ScreenshotFrame";

/** Vertical — Quizzes + Flashcards stacked, flashcard flips. */
export const VScene4LearnDifferently: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card1 = spring({ frame: frame - 24, fps, config: { damping: 16 }, durationInFrames: 22 });
  const card2 = spring({ frame: frame - 34, fps, config: { damping: 16 }, durationInFrames: 22 });
  const bob = Math.sin(frame / 15) * 4;
  const flip = spring({ frame: frame - 80, fps, config: { damping: 200 }, durationInFrames: 24 });
  const rotateY = interpolate(flip, [0, 1], [0, 180]);
  const showBack = rotateY > 90;
  const exit = interpolate(frame, [222, 240], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: exit }}>
      <div style={{ width: 940 }}>
        <FadeSlide direction="up" distance={50} enterAt={6} enterDuration={20}>
          <div style={{ fontFamily: brand.fontFamily, fontSize: 72, fontWeight: 700, letterSpacing: "-0.03em", color: brand.text, marginBottom: 50, textAlign: "center" }}>
            Want to learn <span style={{ background: brand.gradient, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>differently?</span>
          </div>
        </FadeSlide>

        <div style={{ display: "flex", flexDirection: "column", gap: 44, alignItems: "center" }}>
          <div style={{ opacity: card1, transform: `translateY(${interpolate(card1, [0, 1], [50, 0]) + bob}px)`, textAlign: "center" }}>
            <Label>Quizzes</Label>
            <ScreenshotFrame src="screenshots/quiz.png" width={860} alt="ULBS Coach quiz UI" />
          </div>

          <div style={{ opacity: card2, transform: `translateY(${interpolate(card2, [0, 1], [50, 0])}px)`, perspective: 1600, textAlign: "center" }}>
            <Label>Flashcards</Label>
            <div style={{ position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${rotateY}deg)` }}>
              <div style={{ backfaceVisibility: "hidden", opacity: showBack ? 0 : 1 }}>
                <ScreenshotFrame src="screenshots/flashcards.png" width={860} alt="ULBS Coach flashcards UI" />
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
                <span style={{ fontFamily: brand.fontFamily, fontSize: 38, fontWeight: 500, color: brand.text }}>
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

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: brand.fontFamily, fontSize: 26, fontWeight: 600, color: brand.textMuted, marginBottom: 16, letterSpacing: "0.02em" }}>
    {children}
  </div>
);
