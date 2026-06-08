import { Img, staticFile } from "remotion";
import { brand } from "../brand";

interface Props {
  /** Path under /public, e.g. "screenshots/quiz.png". */
  src: string;
  width: number;
  /** Optional fixed height; otherwise auto by image ratio. */
  height?: number;
  alt?: string;
  radius?: number;
  /** Gradient border + glow (the app's framed look). */
  framed?: boolean;
  style?: React.CSSProperties;
}

/**
 * Wraps a screenshot in the app's signature frame: rounded corners, a 1px
 * gradient border and a soft shadow. Swap the placeholder PNGs in
 * /public/screenshots for real captures — sizing stays identical.
 */
export const ScreenshotFrame: React.FC<Props> = ({
  src,
  width,
  height,
  alt = "",
  radius = 20,
  framed = true,
  style,
}) => {
  return (
    <div
      style={{
        width,
        borderRadius: radius,
        padding: framed ? 1.5 : 0,
        background: framed ? brand.gradient : "transparent",
        boxShadow: framed ? "0 30px 90px rgba(0,0,0,0.55)" : undefined,
        ...style,
      }}
    >
      <div
        style={{
          borderRadius: radius - 1.5,
          overflow: "hidden",
          background: "#0d0c12",
        }}
      >
        <Img
          src={staticFile(src)}
          alt={alt}
          style={{ display: "block", width: "100%", height: height ?? "auto", objectFit: "cover" }}
        />
      </div>
    </div>
  );
};
