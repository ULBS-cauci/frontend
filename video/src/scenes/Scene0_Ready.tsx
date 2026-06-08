import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { brand } from "../brand";

/**
 * Scene 0 — Hook (landscape). "Are" / "you" / "ready?" each get SLAMMED in one
 * after another: they fly down from oversize + motion blur and overshoot-settle
 * (low-damping spring), like the words are thrown hard onto the screen. The last
 * word pops in the brand gradient. Leads into the hero via the zoom-blur cut.
 */

const SlamWord: React.FC<{
  at: number;
  children: React.ReactNode;
  gradient?: boolean;
}> = ({ at, children, gradient }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Low-damping spring → punchy overshoot ("thrown" feel).
  const s = spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 130, mass: 0.8 } });
  const scale = interpolate(s, [0, 1], [1.9, 1]);
  const y = interpolate(s, [0, 1], [-90, 0]);
  const rot = interpolate(s, [0, 1], [-7, 0]);
  const opacity = interpolate(frame, [at, at + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blur = interpolate(frame, [at, at + 9], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${y}px) scale(${scale}) rotate(${rot}deg)`,
        filter: `blur(${blur}px)`,
        ...(gradient
          ? {
              background: brand.gradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }
          : { color: brand.text }),
      }}
    >
      {children}
    </span>
  );
};

export const Scene0Ready: React.FC = () => {
  const frame = useCurrentFrame();

  const blackout = interpolate(frame, [0, 8], [1, 0], { extrapolateRight: "clamp" });
  const glow = interpolate(Math.sin(frame / 7), [-1, 1], [0.35, 0.8]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 700,
          background: `radial-gradient(circle at center, rgba(124,106,247,${glow}) 0%, rgba(200,80,240,${glow * 0.5}) 35%, transparent 64%)`,
          filter: "blur(48px)",
        }}
      />
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontSize: 136,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          display: "flex",
          gap: "0 32px",
        }}
      >
        <SlamWord at={4}>Are</SlamWord>
        <SlamWord at={22}>you</SlamWord>
        <SlamWord at={42} gradient>
          ready?
        </SlamWord>
      </div>
      <AbsoluteFill style={{ background: "#000", opacity: blackout, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
