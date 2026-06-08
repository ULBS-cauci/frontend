import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";

interface Props {
  startFrame: number;
  /** Frame (local) at which the card flips to reveal the answer. */
  flipAt: number;
  front: string;
  back: string;
  width?: number;
  height?: number;
}

/**
 * A study flashcard that pops in, then flips (rotateY) from question to answer.
 */
export const Flashcard: React.FC<Props> = ({
  startFrame,
  flipAt,
  front,
  back,
  width = 300,
  height = 190,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  const enter = spring({ frame: local, fps, config: { damping: 13 }, durationInFrames: 18 });
  const pop = interpolate(enter, [0, 1], [0.6, 1]);

  const flip = spring({ frame: local - flipAt, fps, config: { damping: 200 }, durationInFrames: 22 });
  const rotateY = interpolate(flip, [0, 1], [0, 180]);
  const showingBack = rotateY > 90;

  const faceBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 22,
    fontFamily: theme.fontFamily,
    backfaceVisibility: "hidden",
    border: "1px solid rgba(124,106,247,0.3)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
  };

  return (
    <div style={{ width, height, transform: `scale(${pop})`, opacity: enter, perspective: 1200 }}>
      <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transform: `rotateY(${rotateY}deg)` }}>
        {/* Front — question */}
        <div style={{ ...faceBase, background: "#141219", opacity: showingBack ? 0 : 1 }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: theme.textFaint, marginBottom: 12 }}>
              Flashcard
            </div>
            <div style={{ fontSize: 19, fontWeight: 500, color: theme.text }}>{front}</div>
          </div>
        </div>
        {/* Back — answer */}
        <div
          style={{
            ...faceBase,
            background: "linear-gradient(150deg, rgba(124,106,247,0.22), rgba(192,132,252,0.14))",
            transform: "rotateY(180deg)",
            opacity: showingBack ? 1 : 0,
          }}
        >
          <div style={{ fontSize: 19, fontWeight: 500, color: theme.text }}>{back}</div>
        </div>
      </div>
    </div>
  );
};
