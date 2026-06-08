import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { theme } from "../theme";
import { SparkMark, GradientText } from "../components/Logo";

/** Scene 1 — branded open: spark mark blooms, then the tagline. */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markIn = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const markScale = interpolate(markIn, [0, 1], [0.3, 1]);
  const markSpin = interpolate(frame, [0, 60], [-90, 0], {
    extrapolateRight: "clamp",
  });

  const badgeOpacity = interpolate(frame, [18, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleIn = spring({
    frame: frame - 24,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const titleY = interpolate(titleIn, [0, 1], [30, 0]);

  const subOpacity = interpolate(frame, [54, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div style={{ transform: `scale(${markScale})`, marginBottom: 36 }}>
        <SparkMark size={108} spin={markSpin} />
      </div>

      <div
        style={{
          opacity: badgeOpacity,
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderRadius: 999,
          border: "1px solid rgba(167,139,250,0.22)",
          background: "rgba(124,106,247,0.07)",
          padding: "8px 18px",
          fontFamily: theme.fontFamily,
          fontSize: 18,
          color: "rgba(167,139,250,0.9)",
        }}
      >
        <span>✦</span> Now in private preview
      </div>

      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleIn,
          fontFamily: theme.fontFamily,
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: theme.text,
          textAlign: "center",
          lineHeight: 1.05,
        }}
      >
        Meet <GradientText>ULBS Coach</GradientText>
      </div>

      <div
        style={{
          opacity: subOpacity,
          marginTop: 24,
          fontFamily: theme.fontFamily,
          fontSize: 30,
          color: theme.textMuted,
          textAlign: "center",
        }}
      >
        The student&rsquo;s life saver.
      </div>
    </AbsoluteFill>
  );
};
