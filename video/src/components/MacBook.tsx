import { interpolate } from "remotion";

interface Props {
  /** 0 = fully open, 1 = lid shut. */
  lidProgress: number;
  /** Content shown on the screen (e.g. the app). */
  children?: React.ReactNode;
  width?: number;
}

const SCREEN_W = 1100;
const SCREEN_H = 690; // ~16:10
const SCALE_REF = 1100;

/**
 * A stylised MacBook rendered with CSS 3D transforms.
 * The lid rotates about the hinge from upright (open) to flat (closed).
 */
export const MacBook: React.FC<Props> = ({ lidProgress, children, width = 1100 }) => {
  // Lid angle: upright (open) -> lying flat on the base (closed).
  const lidAngle = interpolate(lidProgress, [0, 1], [-92, -1]);
  // Once past the midpoint, we're seeing the back of the lid (aluminium).
  const showBack = lidProgress > 0.52;
  const scale = width / SCALE_REF;

  return (
    <div
      style={{
        perspective: 2600,
        perspectiveOrigin: "50% 30%",
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      <div style={{ transformStyle: "preserve-3d", transform: "rotateX(8deg)" }}>
        {/* Base / keyboard deck */}
        <div
          style={{
            position: "relative",
            width: SCREEN_W + 60,
            height: 22,
            margin: "0 auto",
            borderRadius: "10px 10px 14px 14px",
            background: "linear-gradient(#3a3a42, #1c1c22)",
            boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
            transform: "translateZ(0)",
          }}
        >
          {/* Trackpad notch */}
          <div
            style={{
              position: "absolute",
              top: 3,
              left: "50%",
              transform: "translateX(-50%)",
              width: 130,
              height: 6,
              borderRadius: 4,
              background: "rgba(255,255,255,0.06)",
            }}
          />
          {/* Hinge + lid */}
          <div
            style={{
              position: "absolute",
              left: 30,
              bottom: 0,
              width: SCREEN_W,
              height: SCREEN_H,
              transformOrigin: "50% 100%",
              transform: `rotateX(${lidAngle}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front face — the screen */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 16,
                background: "#0a0a0e",
                border: "10px solid #1a1a20",
                boxSizing: "border-box",
                overflow: "hidden",
                backfaceVisibility: "hidden",
                opacity: showBack ? 0 : 1,
              }}
            >
              <div style={{ width: "100%", height: "100%", borderRadius: 6, overflow: "hidden" }}>
                {children}
              </div>
            </div>

            {/* Back face — aluminium lid with logo */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 16,
                background: "linear-gradient(135deg, #2a2a31, #16161b)",
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: showBack ? 1 : 0,
              }}
            >
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none" style={{ opacity: 0.5 }}>
                <path
                  d="M50 4 C54 30 70 46 96 50 C70 54 54 70 50 96 C46 70 30 54 4 50 C30 46 46 30 50 4Z"
                  fill="rgba(167,139,250,0.55)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
