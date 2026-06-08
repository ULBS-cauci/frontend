import { useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";

interface Props {
  text: string;
  /** Frame (relative to the enclosing Sequence) at which typing begins. */
  startFrame?: number;
  /** Characters per second. */
  cps?: number;
  /** Show a blinking caret while typing. */
  caret?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Frame-accurate typewriter. Character count is derived purely from the current
 * frame, so it renders identically every time (no timers / RAF). The caret
 * blinks on a frame-based cycle and disappears once the text is complete.
 */
export const TypeOn: React.FC<Props> = ({
  text,
  startFrame = 0,
  cps = 20,
  caret = true,
  style,
  className,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = Math.max(0, frame - startFrame);
  const charsPerFrame = cps / fps;
  const shown = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const done = shown >= text.length;

  // Frame-based blink (~2 blinks/sec at 30fps).
  const caretOn = Math.floor(frame / 8) % 2 === 0;

  return (
    <span className={className} style={style}>
      {text.slice(0, shown)}
      {caret && !done && (
        <span
          style={{
            display: "inline-block",
            width: "0.06em",
            marginLeft: "0.04em",
            transform: "translateY(0.08em)",
            background: brand.violet,
            opacity: caretOn ? 1 : 0.15,
            // Match line-height of surrounding text.
            height: "1em",
          }}
        >
          &nbsp;
        </span>
      )}
    </span>
  );
};
