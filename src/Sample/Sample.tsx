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
      </div>
    </AbsoluteFill>
  );
};
