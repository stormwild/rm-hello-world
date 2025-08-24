import { getAudioData } from "@remotion/media-utils";
import { useState, useEffect, useMemo } from "react";
import {
  AbsoluteFill,
  spring,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Sample = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const seconds = (frame / fps).toFixed(2);
  const scale = spring({
    fps,
    frame,
  });

  const [audioData, setAudioData] = useState<Awaited<
    ReturnType<typeof getAudioData>
  > | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getAudioData(staticFile("WhisperedDreams30sClip.mp3"));
      if (!cancelled) setAudioData(data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Prepare down‑sampled bars
  const bars = useMemo(() => {
    if (!audioData) return [];
    const samples = audioData.channelWaveforms[0]; // mono mix of first channel
    const NUM_BARS = 200; // adjust detail
    const bucketSize = Math.floor(samples.length / NUM_BARS) || 1;
    const arr = [];
    for (let i = 0; i < NUM_BARS; i++) {
      let sum = 0;
      for (let j = 0; j < bucketSize; j++) {
        const v = samples[i * bucketSize + j] ?? 0;
        sum += Math.abs(v);
      }
      arr.push(sum / bucketSize);
    }
    // Normalize
    const max = Math.max(...arr, 1);
    return arr.map((v) => v / max);
  }, [audioData]);

  const progress = frame / durationInFrames;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("WhisperedDreams30sClip.mp3")} />

      <div
        style={{
          color: "white",
          fontSize: "5rem",
          margin: "0 auto",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <p style={{ transform: `scale(${scale})` }}>Whispered Dreams</p>
        <p>Duration: {durationInFrames} frames</p>
        <p>FPS: {fps}</p>
        <p>Current Frame: {frame}</p>
        <p>Time: {seconds}s</p>

        {/* Waveform */}
        <div
          style={{
            width: 1200,
            height: 160,
            display: "flex",
            alignItems: "flex-end",
            gap: 2,
            marginTop: 40,
          }}
        >
          {bars.map((b, i) => {
            const barProgress = i / bars.length;
            const active = barProgress <= progress;
            return (
              <div
                key={i}
                style={{
                  width: 1200 / bars.length - 2,
                  height: 10 + b * 150,
                  background: active ? "#5ab0ff" : "#333",
                  transition: "background 0.1s linear",
                }}
              />
            );
          })}
          {!audioData && (
            <div style={{ position: "absolute", fontSize: 24, color: "#888" }}>
              Loading waveform...
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
