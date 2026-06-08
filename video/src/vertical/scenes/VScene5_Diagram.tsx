import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { brand } from "../../brand";
import { GlassCard } from "../../components/GlassCard";
import { ChatBubble } from "../../components/ChatBubble";
import { FadeSlide } from "../../components/FadeSlide";
import { Flowchart } from "../../components/Flowchart";

/** Vertical — self-drawing Mermaid-style flowchart in a glass chat frame. */
export const VScene5Diagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pull = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 34 });
  const camScale = interpolate(pull, [0, 1], [1.06, 1.0]);
  const DRAW = 40;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 180 }}>
        <FadeSlide direction="up" distance={30} enterAt={8} enterDuration={18}>
          <div style={{ fontFamily: brand.fontFamily, fontSize: 60, fontWeight: 700, letterSpacing: "-0.03em", color: brand.text, textAlign: "center" }}>
            Diagrams, <span style={{ background: brand.gradient, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>drawn live.</span>
          </div>
        </FadeSlide>
      </div>

      <div style={{ transform: `scale(${camScale})`, width: 980 }}>
        <GlassCard radius={26} padding={32} gradientEdge>
          <div style={{ marginBottom: 24 }}>
            <ChatBubble role="user" text="Explain binary search as a diagram." fontSize={26} maxWidth={620} />
          </div>
          <Flowchart frame={frame} drawStart={DRAW} />
        </GlassCard>
      </div>
    </AbsoluteFill>
  );
};
