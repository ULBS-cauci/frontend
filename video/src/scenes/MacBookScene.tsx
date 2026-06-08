import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { MacBook } from "../components/MacBook";
import { AppScreen } from "../components/AppScreen";
import { SparkMark, GradientText } from "../components/Logo";
import { theme } from "../theme";

/**
 * Scene 1 — a MacBook showing the app. After a beat the lid closes, and as it
 * shuts the brand lockup ("Meet ULBS Coach") rises into view.
 */
export const MacBookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Laptop floats in.
  const enter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 24 });
  const enterY = interpolate(enter, [0, 1], [60, 0]);

  // Lid stays open for a bit, then closes.
  const CLOSE_START = 78;
  const CLOSE_END = 130;
  const lid = interpolate(frame, [CLOSE_START, CLOSE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Laptop drifts down + shrinks slightly as it closes, making room for the title.
  const laptopY = interpolate(frame, [CLOSE_START, CLOSE_END + 30], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const laptopScale = interpolate(frame, [CLOSE_START, CLOSE_END + 30], [1, 0.82], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const laptopOpacity = interpolate(frame, [CLOSE_END + 20, CLOSE_END + 60], [1, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title appears as the lid finishes closing.
  const titleIn = spring({
    frame: frame - (CLOSE_END - 6),
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  const titleY = interpolate(titleIn, [0, 1], [40, 0]);
  const markScale = interpolate(titleIn, [0, 1], [0.4, 1]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Brand lockup behind/above the closing laptop */}
      <div
        style={{
          position: "absolute",
          top: 250,
          opacity: titleIn,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div style={{ transform: `scale(${markScale})`, marginBottom: 24 }}>
          <SparkMark size={84} />
        </div>
        <div
          style={{
            fontFamily: theme.fontFamily,
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: theme.text,
          }}
        >
          Meet <GradientText>ULBS Coach</GradientText>
        </div>
      </div>

      {/* The MacBook */}
      <div
        style={{
          transform: `translateY(${enterY + laptopY}px) scale(${laptopScale})`,
          opacity: enter * laptopOpacity,
        }}
      >
        <MacBook lidProgress={lid} width={1180}>
          <AppScreen />
        </MacBook>
      </div>
    </AbsoluteFill>
  );
};
