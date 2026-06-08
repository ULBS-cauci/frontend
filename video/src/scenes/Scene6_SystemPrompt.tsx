import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { brand } from "../brand";
import { fonts } from "../fonts";
import { FadeSlide } from "../components/FadeSlide";
import { TypeOn } from "../components/TypeOn";

const PROMPT = "Always reply in Romanian. Be concise. Use real-world analogies.";

/**
 * Scene 6 — Make it yours (0:33–0:40).
 * Headline → the system-prompt panel slides up → the custom prompt types in →
 * the same question yields two response styles side-by-side (default vs.
 * customised), selling personalisation → closing tagline.
 */
export const Scene6SystemPrompt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TYPE_START = 48;
  const compareIn = spring({ frame: frame - 128, fps, config: { damping: 200 }, durationInFrames: 22 });
  const custIn = spring({ frame: frame - 138, fps, config: { damping: 200 }, durationInFrames: 22 });
  const tagline = interpolate(frame, [168, 186], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const exit = interpolate(frame, [196, 210], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: exit }}>
      <div style={{ width: 1400, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FadeSlide direction="up" distance={30} enterAt={6} enterDuration={18}>
          <div style={{ fontFamily: fonts.display, fontSize: 62, fontWeight: 700, letterSpacing: "-0.03em", color: brand.text, marginBottom: 36 }}>
            Make the AI <span style={{ background: brand.gradient, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>yours.</span>
          </div>
        </FadeSlide>

        {/* System prompt panel */}
        <FadeSlide direction="up" distance={70} enterAt={14} enterDuration={22} style={{ width: "100%" }}>
          {/* App-style system-prompt field (matches the real settings input). */}
          <div
            style={{
              width: "100%",
              borderRadius: 14,
              background: "#15131c",
              border: "1px solid rgba(124,106,247,0.45)",
              padding: 24,
              marginBottom: 36,
              boxShadow: "0 0 0 4px rgba(124,106,247,0.10)",
            }}
          >
            <div style={{ fontFamily: brand.fontFamily, fontSize: 18, letterSpacing: "0.14em", textTransform: "uppercase", color: brand.textFaint, marginBottom: 12 }}>
              System prompt
            </div>
            <div style={{ fontFamily: brand.fontFamily, fontSize: 28, color: brand.text, lineHeight: 1.3 }}>
              <TypeOn text={PROMPT} startFrame={TYPE_START} cps={22} />
            </div>
          </div>
        </FadeSlide>

        {/* Default vs customised */}
        <div style={{ display: "flex", gap: 32, width: "100%" }}>
          <ResponseCard
            in={compareIn}
            tag="Default"
            tagColor={brand.textMuted}
            text="TCP is a connection-oriented protocol that guarantees the ordered, reliable delivery of packets between hosts, whereas UDP is connectionless and does not."
          />
          <ResponseCard
            in={custIn}
            tag="Your tutor"
            tagColor={brand.violet}
            highlight
            text="TCP e ca o scrisoare recomandată: primești confirmare la livrare. UDP e ca o carte poștală: rapidă, dar fără garanții."
          />
        </div>

        <div style={{ opacity: tagline, marginTop: 34, fontFamily: fonts.display, fontSize: 32, fontWeight: 500, color: brand.textMuted }}>
          Your prompt. Your tutor. <span style={{ color: brand.text }}>Your way.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ResponseCard: React.FC<{
  in: number;
  tag: string;
  tagColor: string;
  text: string;
  highlight?: boolean;
}> = ({ in: enter, tag, tagColor, text, highlight }) => (
  <div
    style={{
      flex: 1,
      opacity: enter,
      transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
      borderRadius: 14,
      background: highlight ? "rgba(124,106,247,0.10)" : "rgba(255,255,255,0.03)",
      border: highlight ? "1px solid rgba(124,106,247,0.45)" : "1px solid rgba(232,228,240,0.10)",
      padding: 26,
    }}
  >
    <div style={{ fontFamily: brand.fontFamily, fontSize: 18, fontWeight: 600, color: tagColor, marginBottom: 14, letterSpacing: "0.02em" }}>
      {tag}
    </div>
    <div style={{ fontFamily: brand.fontFamily, fontSize: 23, lineHeight: 1.45, color: brand.text }}>{text}</div>
  </div>
);
