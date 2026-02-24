import React from "react";
import { Composition } from "remotion";
import { RatioShowcase } from "./Showcase";

// 9:16 vertical video for WhatsApp/Instagram Stories
// 30fps, 20 seconds = 600 frames
const FPS = 30;
const DURATION_SECONDS = 20;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RatioShowcase"
        component={RatioShowcase}
        durationInFrames={FPS * DURATION_SECONDS}
        fps={FPS}
        width={393}
        height={852}
      />
    </>
  );
};
