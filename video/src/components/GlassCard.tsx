import { brand } from "../brand";

interface Props {
  children: React.ReactNode;
  radius?: number;
  padding?: number | string;
  /** Strength of the frosted blur. */
  blur?: number;
  /** Add a faint gradient edge-light on top of the glass. */
  gradientEdge?: boolean;
  style?: React.CSSProperties;
}

/**
 * Frosted-glass surface. Translucent fill + backdrop blur + a 1px light border
 * and a soft top highlight, with a deep shadow for lift. This is the visual
 * backbone of the "glass" look used throughout the video.
 */
export const GlassCard: React.FC<Props> = ({
  children,
  radius = 24,
  padding = 28,
  blur = 28,
  gradientEdge = false,
  style,
}) => {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: radius,
        padding,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
        border: `1px solid ${brand.glassBorder}`,
        backdropFilter: `blur(${blur}px) saturate(140%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(140%)`,
        boxShadow:
          "0 30px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Top sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 80% at 50% -20%, rgba(255,255,255,0.16) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />
      {/* Optional gradient edge light */}
      {gradientEdge && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            padding: 1,
            background: brand.gradient,
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: 0.55,
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};
