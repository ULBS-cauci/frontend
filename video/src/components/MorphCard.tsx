import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Props {
  /** Layout the card morphs FROM (absolute px within the scene). */
  from: Rect;
  /** Layout the card morphs TO. */
  to: Rect;
  /** Frame (relative to Sequence) the morph starts. */
  startFrame: number;
  /** Morph duration in frames. */
  duration?: number;
  radius?: number;
  /** Content shown before the morph (crossfades out). */
  children?: React.ReactNode;
  /** Content shown after the morph (crossfades in). Defaults to children. */
  toChildren?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Shared-element ("magic move") morph. The spec asks for Framer Motion
 * `layoutId` morphs — but Framer's layout animations are measured at runtime via
 * requestAnimationFrame, which is NOT frame-deterministic and breaks Remotion's
 * render. So we morph deterministically by interpolating an explicit from→to
 * rect with a spring, and crossfade the inner content. Same visual result,
 * fully reproducible per frame.
 */
export const MorphCard: React.FC<Props> = ({
  from,
  to,
  startFrame,
  duration = 26,
  radius = 24,
  children,
  toChildren,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: duration,
  });

  const lerp = (a: number, b: number) => interpolate(t, [0, 1], [a, b]);
  const rect: Rect = {
    x: lerp(from.x, to.x),
    y: lerp(from.y, to.y),
    width: lerp(from.width, to.width),
    height: lerp(from.height, to.height),
  };

  const afterContent = toChildren ?? children;

  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        borderRadius: radius,
        overflow: "hidden",
        ...style,
      }}
    >
      {children !== undefined && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - t }}>{children}</div>
      )}
      {afterContent !== undefined && (
        <div style={{ position: "absolute", inset: 0, opacity: t }}>{afterContent}</div>
      )}
    </div>
  );
};
