import React from "react";
import { Composition } from "remotion";
import { RatioShowcase } from "./Showcase";
import { MootCourtPromo } from "./MootCourtPromo";
import { MootCourtCinematic } from "./MootCourtCinematic";
import { MootCourtShort } from "./MootCourtShort";
import { FeatureShowcase } from "./FeatureShowcase";
import { LiveSessionSnippet } from "./LiveSessionSnippet";
import { ConstitutionalLaw } from "./ConstitutionalLaw";
import { RecruitmentPromo } from "./RecruitmentPromo";
import { AIJudgeVideo } from "./AIJudgeVideo";
import { AnalyticsFeedbackVideo } from "./AnalyticsFeedbackVideo";
import {
  ThumbnailGeneral,
  ThumbnailMootCourt,
  ThumbnailConstitutionalLaw,
  ThumbnailLiveSession,
} from "./Thumbnail";

// 9:16 vertical video for WhatsApp/Instagram Stories
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Original compositions (kept for reference) ── */}

      <Composition
        id="RatioShowcase"
        component={RatioShowcase}
        durationInFrames={FPS * 20}
        fps={FPS}
        width={393}
        height={852}
      />

      <Composition
        id="MootCourtPromo"
        component={MootCourtPromo}
        durationInFrames={FPS * 20}
        fps={FPS}
        width={393}
        height={852}
      />

      {/* ── New cinematic versions ── */}

      {/* 73-second cinematic version — voiceover-paced, Apple-style */}
      <Composition
        id="MootCourtCinematic"
        component={MootCourtCinematic}
        durationInFrames={FPS * 73}
        fps={FPS}
        width={393}
        height={852}
      />

      {/* ~32-second high-impact cut — social media optimised (950 frames for Charlie) */}
      <Composition
        id="MootCourtShort"
        component={MootCourtShort}
        durationInFrames={950}
        fps={FPS}
        width={393}
        height={852}
      />

      {/* ── Feature & Session videos ── */}

      {/* 70-second feature showcase — rapid-fire tour of RATIO's ecosystem */}
      <Composition
        id="FeatureShowcase"
        component={FeatureShowcase}
        durationInFrames={FPS * 70}
        fps={FPS}
        width={393}
        height={852}
      />

      {/* 55-second live AI session snippet — voice-acted courtroom exchange */}
      <Composition
        id="LiveSessionSnippet"
        component={LiveSessionSnippet}
        durationInFrames={FPS * 55}
        fps={FPS}
        width={393}
        height={852}
      />

      {/* ── Subject-specific showcases ── */}

      {/* 55-second constitutional law showcase — topic overview + practice demo */}
      <Composition
        id="ConstitutionalLaw"
        component={ConstitutionalLaw}
        durationInFrames={FPS * 55}
        fps={FPS}
        width={393}
        height={852}
      />

      {/* 55-second AI Judge promo — features walkthrough */}
      <Composition
        id="AIJudgeVideo"
        component={AIJudgeVideo}
        durationInFrames={FPS * 55}
        fps={FPS}
        width={393}
        height={852}
      />

      {/* 50-second analytics & feedback showcase — performance tracking promo */}
      <Composition
        id="AnalyticsFeedbackVideo"
        component={AnalyticsFeedbackVideo}
        durationInFrames={FPS * 50}
        fps={FPS}
        width={393}
        height={852}
      />

      {/* ── Recruitment ── */}

      {/* 48-second recruitment promo — summer roles + work experience */}
      <Composition
        id="RecruitmentPromo"
        component={RecruitmentPromo}
        durationInFrames={FPS * 48}
        fps={FPS}
        width={393}
        height={852}
      />

      {/* ── Thumbnails (still images, 1 frame each) ── */}

      <Composition
        id="ThumbnailGeneral"
        component={ThumbnailGeneral}
        durationInFrames={1}
        fps={FPS}
        width={393}
        height={852}
      />

      <Composition
        id="ThumbnailMootCourt"
        component={ThumbnailMootCourt}
        durationInFrames={1}
        fps={FPS}
        width={393}
        height={852}
      />

      <Composition
        id="ThumbnailConstitutionalLaw"
        component={ThumbnailConstitutionalLaw}
        durationInFrames={1}
        fps={FPS}
        width={393}
        height={852}
      />

      <Composition
        id="ThumbnailLiveSession"
        component={ThumbnailLiveSession}
        durationInFrames={1}
        fps={FPS}
        width={393}
        height={852}
      />
    </>
  );
};
