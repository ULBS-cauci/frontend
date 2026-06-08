import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { brand } from "../brand";

interface Props {
  children: React.ReactNode;
  /** "thinking" = rotating glow; "static" = steady gradient ring. */
  variant?: "thinking" | "static";
  /** Outer border radius in px. */
  radius?: number;
  /** Border thickness in px. */
  thickness?: number;
  /** Seconds per full rotation (matches the app's 2s feel). */
  secondsPerTurn?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * THE SIGNATURE SHOT.
 * A conic-gradient ring whose angle is driven frame-by-frame (deterministic on
 * render — no reliance on CSS animation timing) plus a soft outer glow that
 * pulses. Wrap any element; it renders a 1px–thick gradient border + glow and
 * an inner dark surface, exactly like the app's "AI is thinking" composer.
 */
export const AnimatedBorder: React.FC<Props> = ({
  children,
  variant = "thinking",
  radius = 24,
  thickness = 2,
  secondsPerTurn = 2,
  className,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Angle advances a full turn every `secondsPerTurn`. Frame-accurate.
  const angle =
    variant === "thinking"
      ? (frame / (secondsPerTurn * fps)) * 360
      : 135;

  // Glow intensity breathes on a ~1.3s sine so the shot feels alive, premium.
  const glow = interpolate(Math.sin(frame / 7), [-1, 1], [0.25, 0.6]);

  const ring =
    variant === "thinking"
      ? `conic-gradient(from ${angle}deg, transparent 0%, transparent 22%, ${brand.blue} 38%, ${brand.violet} 50%, ${brand.magenta} 62%, transparent 80%, transparent 100%)`
      : brand.gradient;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        borderRadius: radius,
        padding: thickness,
        background: ring,
        // Soft, pulsing outer glow — the premium halo.
        boxShadow:
          variant === "thinking"
            ? `0 0 60px rgba(124,106,247,${glow}), 0 0 120px rgba(200,80,240,${glow * 0.5})`
            : "0 18px 60px rgba(124,106,247,0.35)",
        ...style,
      }}
    >
      <div
        style={{
          borderRadius: radius - thickness,
          background: "rgba(13,12,18,0.94)",
          backdropFilter: "blur(16px)",
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
