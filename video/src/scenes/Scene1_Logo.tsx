import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { brand } from "../brand";

/**
 * Scene 1 — Logo reveal (cinematic, no card).
 * Opens from black; the wordmark springs up over a breathing gradient glow, a
 * thin gradient underline grows beneath it, and the tagline fades in. Airy and
 * centered — the S1→S2 fade handles the hand-off.
 */
export const Scene1Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blackout = interpolate(frame, [0, 14], [1, 0], { extrapolateRight: "clamp" });

  // Wordmark entrance.
  const logoIn = spring({ frame: frame - 6, fps, config: { damping: 14 } });
  const logoY = interpolate(logoIn, [0, 1], [44, 0]);
  const logoScale = interpolate(logoIn, [0, 1], [0.86, 1]);

  // Breathing glow + gentle float.
  const glow = interpolate(Math.sin(frame / 9), [-1, 1], [0.35, 0.7]);
  const float = Math.sin(frame / 24) * 4;

  // Underline grows.
  const underline = spring({ frame: frame - 22, fps, config: { damping: 200 }, durationInFrames: 22 });
  const tagline = interpolate(frame, [34, 52], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Glow halo */}
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 720,
          background: `radial-gradient(circle at center, rgba(124,106,247,${glow}) 0%, rgba(200,80,240,${glow * 0.5}) 35%, transparent 64%)`,
          filter: "blur(50px)",
        }}
      />

      <div style={{ position: "relative", textAlign: "center", transform: `translateY(${float}px)` }}>
        <div
          style={{
            transform: `translateY(${logoY}px) scale(${logoScale})`,
            opacity: logoIn,
            fontFamily: brand.fontFamily,
            fontSize: 132,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1,
            background: brand.gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ULBS Coach
        </div>

        {/* Gradient underline */}
        <div
          style={{
            margin: "28px auto 0",
            height: 4,
            width: interpolate(underline, [0, 1], [0, 320]),
            borderRadius: 4,
            background: brand.gradient,
            opacity: underline,
          }}
        />

        <div
          style={{
            opacity: tagline,
            marginTop: 26,
            fontFamily: brand.fontFamily,
            fontSize: 38,
            fontWeight: 400,
            letterSpacing: "0.01em",
            color: brand.textMuted,
          }}
        >
          Learn faster. Stress less.
        </div>
      </div>

      <AbsoluteFill style={{ background: "#000", opacity: blackout, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
