// ULBS Coach brand tokens — pulled from the app's globals.css / Hero.tsx.
export const theme = {
  bg: "#0c0b10",
  bgElevated: "#15131c",
  text: "#e8e4f0",
  textMuted: "rgba(232,228,240,0.55)",
  textFaint: "rgba(232,228,240,0.35)",

  violet: "#7c6af7",
  violetLight: "#a78bfa",
  violetPink: "#c084fc",

  // Surfaces with the signature translucent-violet glass look.
  glassBg: "rgba(124,106,247,0.08)",
  glassBorder: "rgba(124,106,247,0.30)",

  brandGradient: "linear-gradient(135deg, #a78bfa 0%, #7c6af7 50%, #c084fc 100%)",
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
} as const;

// Composition constants.
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
  // ~53.5s total (sum of scene lengths minus overlapping transitions).
  durationInFrames: 1605,
} as const;
