import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { brand } from "../brand";
import { fonts } from "../fonts";

const WORDS: { t: string; accent?: boolean }[] = [
  { t: "Meet" },
  { t: "ULBS" },
  { t: "Coach" },
  { t: "—" },
  { t: "the", accent: true },
  { t: "student's", accent: true },
  { t: "life", accent: true },
  { t: "saver.", accent: true },
];

/**
 * Scene 2 — Hero statement (0:04–0:08).
 * Words spring in with a 4-frame stagger (damping 12 / stiffness 100 → a lively
 * but controlled pop). The whole line slides up + fades on exit.
 */
export const Scene2Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const STAGGER = 4;
  const START = 8;

  // Exit (108→120): line slides up 40px and fades.
  const exitT = interpolate(frame, [108, 120], [0, 1], { extrapolateLeft: "clamp" });
  const lineY = interpolate(exitT, [0, 1], [0, -40]);
  const lineOpacity = 1 - exitT;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 8%" }}>
      <div
        style={{
          transform: `translateY(${lineY}px)`,
          opacity: lineOpacity,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 22px",
          maxWidth: 1500,
        }}
      >
        {WORDS.map((w, i) => {
          const wordIn = spring({
            frame: frame - (START + i * STAGGER),
            fps,
            config: { damping: 12, stiffness: 100 },
          });
          const y = interpolate(wordIn, [0, 1], [38, 0]);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                transform: `translateY(${y}px)`,
                opacity: wordIn,
                fontFamily: fonts.display,
                fontSize: 96,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: w.accent ? undefined : brand.text,
                background: w.accent ? brand.gradient : undefined,
                WebkitBackgroundClip: w.accent ? "text" : undefined,
                backgroundClip: w.accent ? "text" : undefined,
                WebkitTextFillColor: w.accent ? "transparent" : undefined,
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
