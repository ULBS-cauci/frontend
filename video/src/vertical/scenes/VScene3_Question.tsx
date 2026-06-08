import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { brand } from "../../brand";
import { AnimatedBorder } from "../../components/AnimatedBorder";
import { TypeOn } from "../../components/TypeOn";
import { ChatBubble } from "../../components/ChatBubble";

const QUESTION = "Explain the difference between TCP and UDP with an example.";
const ANSWER =
  "TCP guarantees ordered, reliable delivery — ideal for loading web pages. UDP is faster and connectionless — perfect for video calls.";

const SUB_IN = 10;
const TYPE_START = 34;
const SEND = 126;
const THINK_START = 138;
const THINK_END = 198;
const RESP_START = 202;
const EXIT = 282;

/** Vertical hero scene — composer + rotating glow border + streamed answer. */
export const VScene3Question: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sub = interpolate(frame, [SUB_IN, SUB_IN + 16], [0, 1], { extrapolateRight: "clamp" });
  const composerIn = spring({ frame: frame - 6, fps, config: { damping: 200 }, durationInFrames: 18 });
  const sent = frame >= SEND;
  const thinking = frame >= THINK_START && frame < THINK_END;
  const answering = frame >= RESP_START;
  const userBubble = spring({ frame: frame - SEND, fps, config: { damping: 18 }, durationInFrames: 18 });
  const userY = interpolate(userBubble, [0, 1], [60, 0]);
  const exitT = interpolate(frame, [EXIT, 300], [0, 1], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 960,
          transform: `scale(${1 - exitT * 0.08})`,
          opacity: 1 - exitT,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ opacity: sub, marginBottom: 48, fontFamily: brand.fontFamily, fontSize: 40, fontWeight: 500, color: brand.textMuted, textAlign: "center", lineHeight: 1.25 }}>
          Need help learning?<br />Ask our AI Agent.
        </div>

        <div style={{ width: "100%", minHeight: 420, display: "flex", flexDirection: "column", gap: 26, justifyContent: "flex-end", marginBottom: 30 }}>
          {sent && (
            <div style={{ transform: `translateY(${userY}px)`, opacity: userBubble }}>
              <ChatBubble role="user" text={QUESTION} fontSize={30} maxWidth={760} />
            </div>
          )}
          {answering && (
            <ChatBubble role="assistant" text={ANSWER} streaming startFrame={RESP_START} cps={55} fontSize={31} maxWidth={900} />
          )}
        </div>

        <div style={{ width: "100%", transform: `scale(${interpolate(composerIn, [0, 1], [0.94, 1])})`, opacity: composerIn }}>
          <AnimatedBorder variant={thinking ? "thinking" : "static"} radius={24} thickness={2}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "26px 26px" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(124,106,247,0.10)", border: "1px solid rgba(124,106,247,0.22)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke={brand.violet} strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ flex: 1, fontFamily: brand.fontFamily, fontSize: 30, color: sent ? brand.textFaint : brand.text, lineHeight: 1.25 }}>
                {sent ? (thinking ? "Thinking…" : "Ask ULBS Coach anything…") : <TypeOn text={QUESTION} startFrame={TYPE_START} cps={20} />}
              </div>
              <div style={{ width: 56, height: 56, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: brand.gradient }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19V5M12 5l-7 7M12 5l7 7" stroke="#0a0a0f" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </AnimatedBorder>
        </div>
      </div>
    </AbsoluteFill>
  );
};
