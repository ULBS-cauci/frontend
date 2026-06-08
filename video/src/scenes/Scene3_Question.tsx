import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { brand } from "../brand";
import { fonts } from "../fonts";
import { AnimatedBorder } from "../components/AnimatedBorder";
import { TypeOn } from "../components/TypeOn";
import { ChatBubble } from "../components/ChatBubble";

const QUESTION = "Explain the difference between TCP and UDP with an example.";
const ANSWER =
  "TCP guarantees ordered, reliable delivery — ideal for loading web pages. UDP is faster and connectionless — perfect for video calls.";

// Phase markers (local frames) — tuned so each beat can breathe.
const SUB_IN = 10;
const TYPE_START = 34;
const SEND = 126; // user message flies up
const THINK_START = 138; // rotating border kicks in
const THINK_END = 198; // ~2s of "thinking"
const RESP_START = 202; // answer streams
const EXIT = 282; // zoom-out crossfade

/**
 * Scene 3 — The Question (0:08–0:18). HERO SCENE.
 * Sub-headline → composer materialises → question types itself → message flies
 * up → the composer border spins (the signature glow) for ~2s → answer streams
 * in → gentle zoom-out into Scene 4.
 */
export const Scene3Question: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sub = interpolate(frame, [SUB_IN, SUB_IN + 16], [0, 1], { extrapolateRight: "clamp" });

  // Composer materialises (spring scale + fade).
  const composerIn = spring({ frame: frame - 6, fps, config: { damping: 200 }, durationInFrames: 18 });

  const sent = frame >= SEND;
  const thinking = frame >= THINK_START && frame < THINK_END;
  const answering = frame >= RESP_START;

  // User bubble flies up into history after send.
  const userBubble = spring({ frame: frame - SEND, fps, config: { damping: 18 }, durationInFrames: 18 });
  const userY = interpolate(userBubble, [0, 1], [60, 0]);

  // Whole-scene zoom-out + crossfade on exit.
  const exitT = interpolate(frame, [EXIT, 300], [0, 1], { extrapolateLeft: "clamp" });
  const sceneScale = 1 - exitT * 0.08;
  const sceneOpacity = 1 - exitT;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 1180,
          transform: `scale(${sceneScale})`,
          opacity: sceneOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Sub-headline */}
        <div
          style={{
            opacity: sub,
            marginBottom: 40,
            fontFamily: fonts.display,
            fontSize: 36,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: brand.textMuted,
          }}
        >
          Need help learning? Ask our AI Agent.
        </div>

        {/* Message history (appears above the composer once sent) */}
        <div style={{ width: "100%", minHeight: 260, display: "flex", flexDirection: "column", gap: 22, justifyContent: "flex-end", marginBottom: 26 }}>
          {sent && (
            <div style={{ transform: `translateY(${userY}px)`, opacity: userBubble }}>
              <ChatBubble role="user" text={QUESTION} fontSize={26} maxWidth={760} />
            </div>
          )}
          {answering && (
            <ChatBubble role="assistant" text={ANSWER} streaming startFrame={RESP_START} cps={55} fontSize={27} maxWidth={900} />
          )}
        </div>

        {/* The composer — signature rotating border while thinking */}
        <div style={{ width: "100%", transform: `scale(${interpolate(composerIn, [0, 1], [0.94, 1])})`, opacity: composerIn }}>
          <AnimatedBorder variant={thinking ? "thinking" : "static"} radius={22} thickness={2}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "24px 26px" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(124,106,247,0.10)",
                  border: "1px solid rgba(124,106,247,0.22)",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke={brand.violet} strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>

              <div style={{ flex: 1, fontFamily: brand.fontFamily, fontSize: 28, color: sent ? brand.textFaint : brand.text, lineHeight: 1.2 }}>
                {sent ? (
                  thinking ? "Thinking…" : "Ask ULBS Coach anything…"
                ) : (
                  <TypeOn text={QUESTION} startFrame={TYPE_START} cps={20} />
                )}
              </div>

              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: brand.gradient,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
