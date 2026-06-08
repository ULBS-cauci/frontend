import { AbsoluteFill, Sequence, Audio, staticFile, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { zoomBlur } from "../presentations/zoomBlur";
import { whipPan } from "../presentations/whipPan";
import { GradientMeshBackground } from "../components/GradientMeshBackground";
import { VScene0Ready } from "./scenes/VScene0_Ready";
import { VScene2Hero } from "./scenes/VScene2_Hero";
import { VScene3Question } from "./scenes/VScene3_Question";
import { VScene4LearnDifferently } from "./scenes/VScene4_LearnDifferently";
import { VScene5Diagram } from "./scenes/VScene5_Diagram";
import { VScene6SystemPrompt } from "./scenes/VScene6_SystemPrompt";
import { VScene7Outro } from "./scenes/VScene7_Outro";

const ENABLE_AUDIO = true;

/**
 * Vertical (9:16) cut — same story, durations, transitions and audio cues as the
 * landscape Video, with portrait-tuned scene layouts. Reuses the same shared
 * components and the zoom-blur presentation.
 */
export const VideoVertical: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f" }}>
      <GradientMeshBackground />

      {ENABLE_AUDIO && (
        <>
          <Audio src={staticFile("audio/bg-track.wav")} volume={0.55} />
          {[6, 24, 44].map((f) => (
            <Sequence key={f} from={f} durationInFrames={16}>
              <Audio src={staticFile("audio/whoosh.wav")} volume={0.45} />
            </Sequence>
          ))}
          <Sequence from={57} durationInFrames={22}>
            <Audio src={staticFile("audio/whoosh.wav")} volume={0.85} />
          </Sequence>
          <Sequence from={167} durationInFrames={22}>
            <Audio src={staticFile("audio/whoosh.wav")} volume={0.65} />
          </Sequence>
          <Sequence from={459} durationInFrames={22}>
            <Audio src={staticFile("audio/whoosh.wav")} volume={0.7} />
          </Sequence>
          <Sequence from={671} durationInFrames={22}>
            <Audio src={staticFile("audio/whoosh.wav")} volume={0.6} />
          </Sequence>
          <Sequence from={877} durationInFrames={22}>
            <Audio src={staticFile("audio/whoosh.wav")} volume={0.7} />
          </Sequence>
          <Sequence from={1069} durationInFrames={22}>
            <Audio src={staticFile("audio/whoosh.wav")} volume={0.85} />
          </Sequence>
          <Sequence from={391} durationInFrames={26}>
            <Audio src={staticFile("audio/ding.wav")} volume={0.6} />
          </Sequence>
        </>
      )}

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={105}>
          <VScene0Ready />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 24 })}
          presentation={zoomBlur({ blur: 30 })}
        />

        <TransitionSeries.Sequence durationInFrames={130}>
          <VScene2Hero />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={springTiming({ config: { damping: 200 }, durationInFrames: 22 })} presentation={zoomBlur({ blur: 26 })} />

        <TransitionSeries.Sequence durationInFrames={310}>
          <VScene3Question />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={springTiming({ config: { damping: 18 }, durationInFrames: 20 })} presentation={whipPan({ direction: "up", blur: 26 })} />

        <TransitionSeries.Sequence durationInFrames={240}>
          <VScene4LearnDifferently />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={linearTiming({ durationInFrames: 24 })} presentation={clockWipe({ width, height })} />

        <TransitionSeries.Sequence durationInFrames={230}>
          <VScene5Diagram />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={springTiming({ config: { damping: 18 }, durationInFrames: 24 })} presentation={whipPan({ direction: "down", blur: 28 })} />

        <TransitionSeries.Sequence durationInFrames={220}>
          <VScene6SystemPrompt />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={springTiming({ config: { damping: 200 }, durationInFrames: 26 })} presentation={zoomBlur({ blur: 30 })} />

        <TransitionSeries.Sequence durationInFrames={170}>
          <VScene7Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
