import { AbsoluteFill, Sequence, Audio, staticFile, useVideoConfig } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { zoomBlur } from "./presentations/zoomBlur";
import { whipPan } from "./presentations/whipPan";
import { GradientMeshBackground } from "./components/GradientMeshBackground";
import { Scene0Ready } from "./scenes/Scene0_Ready";
import { Scene2Hero } from "./scenes/Scene2_Hero";
import { Scene3Question } from "./scenes/Scene3_Question";
import { Scene4LearnDifferently } from "./scenes/Scene4_LearnDifferently";
import { Scene5Diagram } from "./scenes/Scene5_Diagram";
import { Scene6SystemPrompt } from "./scenes/Scene6_SystemPrompt";
import { Scene7Outro } from "./scenes/Scene7_Outro";

// Drop your own files in public/audio to replace the generated ones; set false
// to silence everything (renders never fail — files ship with the project).
const ENABLE_AUDIO = true;

/**
 * Main orchestrator. Scenes are chained with <TransitionSeries> so EVERY cut is
 * an animated transition — fades, a spring slide, a clock-wipe, a 3D flip, and
 * two cinematic zoom-blur "rushes" on the biggest beats. A single gradient mesh
 * sits behind everything for continuity.
 *
 * Timeline (durations / transitions, frames):
 *   S1 120 ─fade14─ S2 130 ─zoomBlur22─ S3 310 ─slide20─ S4 240
 *   ─clockWipe24─ S5 230 ─flip24─ S6 220 ─zoomBlur26─ S7 170
 *   total = 1420 − 130 = 1290 frames (43s @ 30fps)
 */
export const Video: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f" }}>
      <GradientMeshBackground />

      {ENABLE_AUDIO && (
        <>
          {/* Lo-fi synth bed across the whole video. */}
          <Audio src={staticFile("audio/bg-track.wav")} volume={0.55} />
          {/* Word-slam impacts on "Are / you / ready?". */}
          {[6, 24, 44].map((f) => (
            <Sequence key={f} from={f} durationInFrames={16}>
              <Audio src={staticFile("audio/whoosh.wav")} volume={0.45} />
            </Sequence>
          ))}
          {/* Reveal + transition whooshes. */}
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
          {/* Soft ding when the AI answer lands in Scene 3. */}
          <Sequence from={391} durationInFrames={26}>
            <Audio src={staticFile("audio/ding.wav")} volume={0.6} />
          </Sequence>
        </>
      )}

      <TransitionSeries>
        {/* Hook → reveal straight into the hero statement. */}
        <TransitionSeries.Sequence durationInFrames={105}>
          <Scene0Ready />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 24 })}
          presentation={zoomBlur({ blur: 30 })}
        />

        <TransitionSeries.Sequence durationInFrames={130}>
          <Scene2Hero />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 22 })}
          presentation={zoomBlur({ blur: 26 })}
        />

        <TransitionSeries.Sequence durationInFrames={310}>
          <Scene3Question />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={springTiming({ config: { damping: 18 }, durationInFrames: 20 })}
          presentation={whipPan({ direction: "left", blur: 26 })}
        />

        <TransitionSeries.Sequence durationInFrames={240}>
          <Scene4LearnDifferently />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 24 })}
          presentation={clockWipe({ width, height })}
        />

        <TransitionSeries.Sequence durationInFrames={230}>
          <Scene5Diagram />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={springTiming({ config: { damping: 18 }, durationInFrames: 24 })}
          presentation={whipPan({ direction: "right", blur: 28 })}
        />

        <TransitionSeries.Sequence durationInFrames={220}>
          <Scene6SystemPrompt />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 26 })}
          presentation={zoomBlur({ blur: 30 })}
        />

        <TransitionSeries.Sequence durationInFrames={170}>
          <Scene7Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
