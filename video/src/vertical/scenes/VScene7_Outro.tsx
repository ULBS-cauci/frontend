import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { brand } from "../../brand";

const GLINTS = 14;

/** Vertical outro — cinematic, no card. */
export const VScene7Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 14 } });
  const logoY = interpolate(logoIn, [0, 1], [40, 0]);
  const logoScale = interpolate(logoIn, [0, 1], [0.84, 1]);
  const glow = interpolate(Math.sin(frame / 8), [-1, 1], [0.45, 0.85]);
  const float = Math.sin(frame / 24) * 4;
  const tagline = interpolate(frame, [22, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaIn = spring({ frame: frame - 34, fps, config: { damping: 14 } });
  const ctaScale = interpolate(ctaIn, [0, 1], [0.8, 1]);
  const pulse = 1 + Math.sin(frame / 9) * 0.015;
  const url = interpolate(frame, [54, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          background: `radial-gradient(circle at center, rgba(124,106,247,${glow}) 0%, rgba(200,80,240,${glow * 0.5}) 35%, transparent 66%)`,
          filter: "blur(50px)",
        }}
      />

      {Array.from({ length: GLINTS }).map((_, i) => {
        const seed = ((i * 9301 + 49297) % 233280) / 233280;
        const x = (seed - 0.5) * 900;
        const speed = 0.4 + seed * 0.6;
        const yStart = 700;
        const y = yStart - ((frame * speed + i * 60) % 1500);
        const op = interpolate(y, [yStart - 1200, yStart], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ position: "absolute", width: 6, height: 6, borderRadius: "50%", background: i % 2 ? brand.violet : brand.magenta, transform: `translate(${x}px, ${y}px)`, opacity: op }} />
        );
      })}

      <div style={{ position: "relative", textAlign: "center", transform: `translateY(${float}px)`, padding: "0 60px" }}>
        <div
          style={{
            transform: `translateY(${logoY}px) scale(${logoScale})`,
            opacity: logoIn,
            fontFamily: brand.fontFamily,
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1.02,
            background: brand.gradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ULBS Coach
        </div>

        <div style={{ opacity: tagline, marginTop: 22, fontFamily: brand.fontFamily, fontSize: 40, fontWeight: 400, color: brand.text }}>
          Your AI tutor.Anytime.
        </div>

        <div style={{ marginTop: 48, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              transform: `scale(${ctaScale * pulse})`,
              fontFamily: brand.fontFamily,
              fontSize: 30,
              fontWeight: 600,
              color: "white",
              padding: "20px 52px",
              borderRadius: 999,
              boxShadow: "0 18px 60px rgba(124,106,247,0.5)",
            }}
          >
            Coming soon
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
};
