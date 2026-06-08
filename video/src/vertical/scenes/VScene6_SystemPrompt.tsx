import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { brand } from "../../brand";
import { FadeSlide } from "../../components/FadeSlide";
import { TypeOn } from "../../components/TypeOn";

const PROMPT = "Always reply in Romanian. Be concise. Use real-world analogies.";

/** Vertical — app-style system prompt input + stacked default/custom answers. */
export const VScene6SystemPrompt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TYPE_START = 48;
  const compareIn = spring({ frame: frame - 128, fps, config: { damping: 200 }, durationInFrames: 22 });
  const custIn = spring({ frame: frame - 138, fps, config: { damping: 200 }, durationInFrames: 22 });
  const tagline = interpolate(frame, [168, 186], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exit = interpolate(frame, [196, 210], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: exit }}>
      <div style={{ width: 960, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FadeSlide direction="up" distance={30} enterAt={6} enterDuration={18}>
          <div style={{ fontFamily: brand.fontFamily, fontSize: 68, fontWeight: 700, letterSpacing: "-0.03em", color: brand.text, marginBottom: 36, textAlign: "center" }}>
            Make the AI <span style={{ background: brand.gradient, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>yours.</span>
          </div>
        </FadeSlide>

        <FadeSlide direction="up" distance={70} enterAt={14} enterDuration={22} style={{ width: "100%" }}>
          <div
            style={{
              width: "100%",
              borderRadius: 14,
              background: "#15131c",
              border: "1px solid rgba(124,106,247,0.45)",
              padding: 26,
              marginBottom: 32,
              boxShadow: "0 0 0 4px rgba(124,106,247,0.10)",
            }}
          >
            <div style={{ fontFamily: brand.fontFamily, fontSize: 18, letterSpacing: "0.14em", textTransform: "uppercase", color: brand.textFaint, marginBottom: 12 }}>
              System prompt
            </div>
            <div style={{ fontFamily: brand.fontFamily, fontSize: 30, color: brand.text, lineHeight: 1.3 }}>
              <TypeOn text={PROMPT} startFrame={TYPE_START} cps={22} />
            </div>
          </div>
        </FadeSlide>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, width: "100%" }}>
          <Card in={compareIn} tag="Default" tagColor={brand.textMuted}
            text="TCP is a connection-oriented protocol that guarantees ordered, reliable delivery of packets, whereas UDP is connectionless and does not." />
          <Card in={custIn} tag="Your tutor" tagColor={brand.violet} highlight
            text="TCP e ca o scrisoare recomandată: confirmare la livrare. UDP e ca o carte poștală: rapidă, dar fără garanții." />
        </div>

        <div style={{ opacity: tagline, marginTop: 34, fontFamily: brand.fontFamily, fontSize: 34, fontWeight: 500, color: brand.textMuted, textAlign: "center" }}>
          Your prompt. Your tutor. <span style={{ color: brand.text }}>Your way.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Card: React.FC<{ in: number; tag: string; tagColor: string; text: string; highlight?: boolean }> = ({ in: enter, tag, tagColor, text, highlight }) => (
  <div
    style={{
      opacity: enter,
      transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
      borderRadius: 14,
      background: highlight ? "rgba(124,106,247,0.10)" : "rgba(255,255,255,0.03)",
      border: highlight ? "1px solid rgba(124,106,247,0.45)" : "1px solid rgba(232,228,240,0.10)",
      padding: 26,
    }}
  >
    <div style={{ fontFamily: brand.fontFamily, fontSize: 18, fontWeight: 600, color: tagColor, marginBottom: 12, letterSpacing: "0.02em" }}>{tag}</div>
    <div style={{ fontFamily: brand.fontFamily, fontSize: 26, lineHeight: 1.45, color: brand.text }}>{text}</div>
  </div>
);
