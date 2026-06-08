import { AbsoluteFill, interpolate } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

type ZoomBlurProps = {
  /** Max blur in px at the peak of the transition. */
  blur?: number;
};

/**
 * Cinematic "rush" transition: the outgoing scene recedes + blurs while the
 * incoming scene rushes forward from oversize + sharpens. Pair with a punchy
 * springTiming for the "knock-you-back" feel.
 */
const ZoomBlurPresentation: React.FC<
  TransitionPresentationComponentProps<ZoomBlurProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const blurMax = passedProps.blur ?? 22;
  const entering = presentationDirection === "entering";
  const p = presentationProgress;

  const scale = entering
    ? interpolate(p, [0, 1], [1.45, 1]) // rushes in from oversize
    : interpolate(p, [0, 1], [1, 0.82]); // recedes
  const opacity = entering
    ? interpolate(p, [0, 0.35, 1], [0, 0.85, 1])
    : interpolate(p, [0, 0.7, 1], [1, 0.4, 0]);
  const blur = entering
    ? interpolate(p, [0, 1], [blurMax, 0])
    : interpolate(p, [0, 1], [0, blurMax]);

  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})`, filter: `blur(${blur}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

export const zoomBlur = (
  props: ZoomBlurProps = {},
): TransitionPresentation<ZoomBlurProps> => {
  return { component: ZoomBlurPresentation, props };
};
