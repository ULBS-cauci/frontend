// Centralised brand + composition constants. Imported by inline styles so the
// look stays correct even if Tailwind utility classes were ever stripped.
export const brand = {
  bg: "#0a0a0f",
  text: "#e8e4f0",
  textMuted: "rgba(232,228,240,0.55)",
  textFaint: "rgba(232,228,240,0.32)",

  blue: "#4f7cff",
  violet: "#7c6af7",
  magenta: "#c850f0",

  gradient: "linear-gradient(135deg, #4f7cff 0%, #7c6af7 50%, #c850f0 100%)",
  // Soft glass surface used across the video.
  glassBg: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(255,255,255,0.14)",
  glassHighlight: "rgba(255,255,255,0.10)",
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
} as const;

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
  // Scene lengths (105 + 1300 = 1405) minus overlapping transitions (140). See Video.tsx.
  // (Logo scene removed: Hook → straight into the "student's life saver" hero.)
  durationInFrames: 1265, // ~42s @ 30fps
} as const;

// Scene boundaries (frames) — single source of truth for Video.tsx + scenes.
export const SCENES = {
  logo: { from: 0, duration: 120 }, // 0:00–0:04
  hero: { from: 120, duration: 120 }, // 0:04–0:08
  question: { from: 240, duration: 300 }, // 0:08–0:18  (hero scene)
  learn: { from: 540, duration: 240 }, // 0:18–0:26
  diagram: { from: 780, duration: 210 }, // 0:26–0:33
  systemPrompt: { from: 990, duration: 210 }, // 0:33–0:40
  outro: { from: 1200, duration: 150 }, // 0:40–0:45
} as const;
