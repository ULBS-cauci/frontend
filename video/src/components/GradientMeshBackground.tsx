import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

/**
 * Drifting gradient-mesh background. Three blurred radial blobs orbit slowly on
 * sine paths so the backdrop "breathes" without ever distracting. Entirely
 * frame-driven (deterministic) — no CSS animation timing involved.
 */
export const GradientMeshBackground: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow, out-of-phase sine drifts (period ~ video length) keep motion organic.
  const drift = (phase: number, amp: number, base: number) =>
    base + Math.sin(frame / 90 + phase) * amp;

  const blobs = [
    { x: drift(0, 14, 28), y: drift(1.2, 10, 30), color: "rgba(79,124,255,0.22)", size: 46 },
    { x: drift(2.1, 16, 70), y: drift(0.5, 12, 38), color: "rgba(124,106,247,0.20)", size: 52 },
    { x: drift(4.0, 12, 52), y: drift(3.1, 14, 72), color: "rgba(200,80,240,0.16)", size: 44 },
  ];

  // Gentle global pulse on overall intensity.
  const pulse = interpolate(Math.sin(frame / 40), [-1, 1], [0.85, 1.05]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0f" }}>
      {blobs.map((b, i) => (
        <AbsoluteFill
          key={i}
          style={{
            opacity: pulse,
            background: `radial-gradient(circle at ${b.x}% ${b.y}%, ${b.color} 0%, transparent ${b.size}%)`,
          }}
        />
      ))}
      {/* Vignette to focus the center. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 38%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
