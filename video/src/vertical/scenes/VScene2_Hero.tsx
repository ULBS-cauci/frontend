import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { brand } from "../../brand";

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

/** Vertical hero statement — word-by-word, wraps in portrait. */
export const VScene2Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const STAGGER = 4;
  const START = 8;
  const exitT = interpolate(frame, [108, 120], [0, 1], { extrapolateLeft: "clamp" });
  const lineY = interpolate(exitT, [0, 1], [0, -40]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 70px" }}>
      <div
        style={{
          transform: `translateY(${lineY}px)`,
          opacity: 1 - exitT,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 20px",
        }}
      >
        {WORDS.map((w, i) => {
          const wordIn = spring({ frame: frame - (START + i * STAGGER), fps, config: { damping: 12, stiffness: 100 } });
          const y = interpolate(wordIn, [0, 1], [38, 0]);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                transform: `translateY(${y}px)`,
                opacity: wordIn,
                fontFamily: brand.fontFamily,
                fontSize: 84,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.12,
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
