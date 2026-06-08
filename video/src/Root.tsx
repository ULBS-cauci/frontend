import { Composition } from "remotion";
import { Video } from "./Video";
import { VideoVertical } from "./vertical/VideoVertical";
import { VIDEO } from "./brand";
import "./styles/globals.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Landscape 16:9 */}
      <Composition
        id="ULBSPromo"
        component={Video}
        durationInFrames={VIDEO.durationInFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      {/* Vertical 9:16 (Reels / TikTok / Stories) — same length & fps. */}
      <Composition
        id="ULBSPromoVertical"
        component={VideoVertical}
        durationInFrames={VIDEO.durationInFrames}
        fps={VIDEO.fps}
        width={1080}
        height={1920}
      />
    </>
  );
};
