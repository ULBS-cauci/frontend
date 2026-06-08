import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { theme } from "../theme";
import { GradientText } from "../components/Logo";

interface Feature {
  icon: React.ReactNode;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    icon: <PlanIcon />,
    title: "Personalised study plans",
    body: "Know exactly what to study and in what order — tuned to your course and exam.",
  },
  {
    icon: <QuizIcon />,
    title: "Quizzes & instant feedback",
    body: "Test yourself with generated questions and see where you actually stand.",
  },
  {
    icon: <DiagramIcon />,
    title: "Diagrams that click",
    body: "Hard concepts turned into clear visuals, so they finally make sense.",
  },
];

/** Scene 3 — three capability cards that stagger in. */
export const Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 18 });
  const titleY = interpolate(titleIn, [0, 1], [24, 0]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div
        style={{
          transform: `translateY(${titleY}px)`,
          opacity: titleIn,
          fontFamily: theme.fontFamily,
          fontSize: 60,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: theme.text,
          marginBottom: 64,
          textAlign: "center",
        }}
      >
        Everything you need to <GradientText>pass with confidence</GradientText>
      </div>

      <div style={{ display: "flex", gap: 32 }}>
        {FEATURES.map((f, i) => {
          const start = 14 + i * 12;
          const cardIn = spring({
            frame: frame - start,
            fps,
            config: { damping: 200 },
            durationInFrames: 22,
          });
          const cardY = interpolate(cardIn, [0, 1], [60, 0]);
          return (
            <div
              key={i}
              style={{
                width: 440,
                opacity: cardIn,
                transform: `translateY(${cardY}px)`,
                borderRadius: 24,
                padding: 40,
                background: "rgba(21,19,28,0.85)",
                border: `1px solid ${theme.glassBorder}`,
                boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  background: "rgba(124,106,247,0.12)",
                  border: "1px solid rgba(124,106,247,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 28,
                }}
              >
                {f.icon}
              </div>
              <div
                style={{
                  fontFamily: theme.fontFamily,
                  fontSize: 30,
                  fontWeight: 600,
                  color: theme.text,
                  marginBottom: 14,
                  letterSpacing: "-0.01em",
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontFamily: theme.fontFamily,
                  fontSize: 21,
                  lineHeight: 1.5,
                  color: theme.textMuted,
                }}
              >
                {f.body}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

function PlanIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={theme.violetLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
function QuizIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={theme.violetLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12" y2="17" />
    </svg>
  );
}
function DiagramIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={theme.violetLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <path d="M10 6.5h5a2 2 0 0 1 2 2V14" />
    </svg>
  );
}
