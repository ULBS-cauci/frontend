import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type Direction = "up" | "down" | "left" | "right";

interface Props {
  children: React.ReactNode;
  direction?: Direction;
  /** Travel distance in px. */
  distance?: number;
  /** Frame (relative to Sequence) to start entering. */
  enterAt?: number;
  /** Enter duration in frames. */
  enterDuration?: number;
  /** Frame to start exiting (omit to never exit). */
  exitAt?: number;
  /** Exit duration in frames. */
  exitDuration?: number;
  style?: React.CSSProperties;
  className?: string;
}

const axis = (d: Direction, v: number) =>
  d === "up"
    ? `translateY(${v}px)`
    : d === "down"
      ? `translateY(${-v}px)`
      : d === "left"
        ? `translateX(${v}px)`
        : `translateX(${-v}px)`;

/**
 * Generic spring-based enter + (optional) linear exit. Springs give the
 * "breathing", never-linear motion the brand calls for; the exit is a quick
 * fade+slide so scenes hand off cleanly rather than hard-cutting.
 */
export const FadeSlide: React.FC<Props> = ({
  children,
  direction = "up",
  distance = 40,
  enterAt = 0,
  enterDuration = 20,
  exitAt,
  exitDuration = 12,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Enter: spring from offset → 0, opacity 0 → 1.
  const enter = spring({
    frame: frame - enterAt,
    fps,
    config: { damping: 200 },
    durationInFrames: enterDuration,
  });
  let opacity = enter;
  let offset = interpolate(enter, [0, 1], [distance, 0]);

  // Exit: linear fade + slide out (opposite direction reads as "leaving").
  if (exitAt !== undefined && frame >= exitAt) {
    const t = interpolate(frame, [exitAt, exitAt + exitDuration], [0, 1], {
      extrapolateRight: "clamp",
    });
    opacity = 1 - t;
    offset = interpolate(t, [0, 1], [0, distance * 0.6]);
  }

  return (
    <div className={className} style={{ ...style, opacity, transform: axis(direction, offset) }}>
      {children}
    </div>
  );
};
