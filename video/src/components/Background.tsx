import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";

/**
 * Animated, GPU-cheap background that recreates the app's drifting violet glow.
 * Two radial blobs slowly orbit so every scene feels alive without distracting.
 */
export const Background: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();

  const x1 = interpolate(frame, [0, 750, 1500], [30, 70, 35], {
    extrapolateRight: "clamp",
  });
  const y1 = interpolate(frame, [0, 750, 1500], [25, 60, 30]);
  const x2 = interpolate(frame, [0, 750, 1500], [80, 40, 75]);
  const y2 = interpolate(frame, [0, 750, 1500], [70, 30, 65]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${x1}% ${y1}%, rgba(124,106,247,0.22) 0%, rgba(109,76,247,0.08) 28%, transparent 58%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${x2}% ${y2}%, rgba(192,132,252,0.16) 0%, transparent 52%)`,
        }}
      />
      {/* Subtle vignette to focus the center. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
