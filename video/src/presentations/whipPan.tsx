import { AbsoluteFill, interpolate } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

type WhipProps = {
  /** Pan direction the content flies toward. */
  direction?: "left" | "right" | "up" | "down";
  /** Max motion blur in px. */
  blur?: number;
};

/**
 * Professional "whip pan": both scenes streak the same way with heavy motion
 * blur — the outgoing scene flies off, the incoming scene snaps in from the
 * opposite edge. Reads like a fast camera whip. Pair with a snappy springTiming.
 */
const WhipPanPresentation: React.FC<
  TransitionPresentationComponentProps<WhipProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const dir = passedProps.direction ?? "left";
  const blurMax = passedProps.blur ?? 24;
  const entering = presentationDirection === "entering";
  const p = presentationProgress;

  // Percentage offset along the axis.
  const horizontal = dir === "left" || dir === "right";
  const sign = dir === "left" || dir === "up" ? -1 : 1;

  // exiting: 0 → 100*sign (flies off). entering: -100*sign → 0 (snaps in).
  const offset = entering
    ? interpolate(p, [0, 1], [-100 * sign, 0])
    : interpolate(p, [0, 1], [0, 100 * sign]);

  const translate = horizontal ? `translateX(${offset}%)` : `translateY(${offset}%)`;
  const blur = entering
    ? interpolate(p, [0, 0.6, 1], [blurMax, blurMax * 0.5, 0])
    : interpolate(p, [0, 0.4, 1], [0, blurMax * 0.5, blurMax]);
  const opacity = entering
    ? interpolate(p, [0, 0.25, 1], [0, 1, 1])
    : interpolate(p, [0, 0.75, 1], [1, 1, 0]);

  return (
    <AbsoluteFill style={{ transform: translate, filter: `blur(${blur}px)`, opacity }}>
      {children}
    </AbsoluteFill>
  );
};

export const whipPan = (props: WhipProps = {}): TransitionPresentation<WhipProps> => {
  return { component: WhipPanPresentation, props };
};
