import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { theme } from "../theme";
import { Logo, GradientText } from "../components/Logo";

/** Scene 4 — closing brand lockup + call to action. */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 14 } });
  const logoScale = interpolate(logoIn, [0, 1], [0.7, 1]);

  const lineIn = spring({ frame: frame - 16, fps, config: { damping: 200 }, durationInFrames: 18 });
  const lineY = interpolate(lineIn, [0, 1], [26, 0]);

  const ctaIn = spring({ frame: frame - 34, fps, config: { damping: 14 } });
  const ctaScale = interpolate(ctaIn, [0, 1], [0.8, 1]);
  const pulse = 1 + Math.sin(frame / 9) * 0.012;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ transform: `scale(${logoScale})`, marginBottom: 40 }}>
        <Logo scale={1.5} />
      </div>

      <div
        style={{
          transform: `translateY(${lineY}px)`,
          opacity: lineIn,
          fontFamily: theme.fontFamily,
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: theme.text,
          textAlign: "center",
          maxWidth: 1100,
          lineHeight: 1.1,
          marginBottom: 48,
        }}
      >
        Study smarter. <GradientText>Pass with confidence.</GradientText>
      </div>

      <div
        style={{
          transform: `scale(${ctaScale * pulse})`,
          opacity: ctaIn,
          fontFamily: theme.fontFamily,
          fontSize: 28,
          fontWeight: 600,
          color: "#0c0b10",
          background: theme.brandGradient,
          padding: "20px 48px",
          borderRadius: 999,
          boxShadow: "0 18px 60px rgba(124,106,247,0.45)",
        }}
      >
        Open the app →
      </div>
    </AbsoluteFill>
  );
};
