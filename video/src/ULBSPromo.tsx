import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import { Background } from "./components/Background";
import { MacBookScene } from "./scenes/MacBookScene";
import { AskScene } from "./scenes/AskScene";
import { GenerateScene } from "./scenes/GenerateScene";
import { Outro } from "./scenes/Outro";

const T = 25;

/**
 * ULBS Coach promo — ~53s @ 30fps, 1920x1080.
 *
 * 1. MacBook: app on screen → lid closes → "Meet ULBS Coach" rises.
 * 2. Ask: glowing composer, types "How to learn for this exam?", quick answer.
 * 3. Generate: a slick flip into live-built quizzes & flashcards.
 * 4. Outro: brand + CTA.
 *
 * Scene lengths + transitions: 320 + 470 + 560 + 330 = 1680; minus 3x25 = 1605.
 */
export const ULBSPromo: React.FC = () => {
  return (
    <Background>
      <AbsoluteFill>
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={320}>
            <MacBookScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T })}
            presentation={fade()}
          />

          <TransitionSeries.Sequence durationInFrames={470}>
            <AskScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={springTiming({ config: { damping: 200 }, durationInFrames: 30 })}
            presentation={flip()}
          />

          <TransitionSeries.Sequence durationInFrames={560}>
            <GenerateScene />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            timing={linearTiming({ durationInFrames: T })}
            presentation={fade()}
          />

          <TransitionSeries.Sequence durationInFrames={330}>
            <Outro />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>
    </Background>
  );
};
