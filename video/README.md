# ULBS Coach — Promo Video (Remotion)

A ~43-second, 1920×1080 @ 30fps Apple-keynote-style promo for **ULBS Coach**, built with
[Remotion](https://remotion.dev) + Tailwind v4. Frosted-glass aesthetic, Space Grotesk
display type, cinematic transitions, and a generated lo-fi soundtrack. Self-contained, so it
never collides with the Next.js app's dependencies.

## Scenes (1290 frames)

| # | Scene | Beat |
|---|-------|------|
| 1 | Logo reveal | Glass plate floats up: wordmark + "Learn faster. Stress less." |
| 2 | Hero statement | "Meet ULBS Coach — the student's life saver" word-by-word |
| 3 | **The Question** | Types a question → **signature rotating glow border** → streamed answer |
| 4 | Learn differently | Floating Quizzes card + flipping Flashcards card |
| 5 | Diagrams on demand | Self-drawing **Mermaid-style flowchart** (binary search) in a glass chat frame |
| 6 | Make it yours | System prompt types in → default vs. customised answer (glass) |
| 7 | Outro / CTA | Glass plate + rotating-gradient CTA "Start learning free →" |

Scenes are chained with `<TransitionSeries>` so every cut is animated: fade, a spring
slide, a clock-wipe, a 3D flip, and two cinematic **zoom-blur "rushes"** (custom presentation
in `src/presentations/zoomBlur.tsx`) on the biggest beats.

The signature shot (Scene 3) is `components/AnimatedBorder.tsx` — a conic-gradient ring whose
angle is driven **frame-by-frame** (deterministic on render) with a soft, pulsing outer glow.
The glass look lives in `components/GlassCard.tsx`.

## Run it

```bash
cd video
# IMPORTANT: reinstall on your machine so native binaries match your OS
rm -rf node_modules package-lock.json && npm install

npm run dev          # Remotion Studio — scrub the timeline & tweak live
npm run render       # → out/ulbs-coach-promo.mp4
npm run render:still # → out/poster.png (frame 360)
```

> First render downloads a headless Chromium automatically (~1 min, one time).

## Project structure

```
src/
  Root.tsx                 # registers the "ULBSPromo" composition (1920x1080/30fps/1350f)
  Video.tsx                # orchestrator: persistent background + 7 <Sequence> scenes + audio hooks
  brand.ts                 # brand tokens + scene timing (single source of truth)
  styles/globals.css       # Tailwind import + @property --angle + brand vars
  components/
    AnimatedBorder.tsx     # ★ signature rotating conic glow
    TypeOn.tsx             # frame-accurate typewriter
    FadeSlide.tsx          # spring enter / fade-slide exit
    MorphCard.tsx          # deterministic shared-element morph
    ChatBubble.tsx         # app-faithful chat bubbles (user / assistant, streaming)
    GradientMeshBackground.tsx
    ScreenshotFrame.tsx    # frames a /public screenshot with the app border
  scenes/Scene1_Logo.tsx … Scene7_Outro.tsx
public/screenshots/        # placeholder PNGs — swap for real app captures
```

## Swapping in real screenshots

Replace the files in `public/screenshots/` (`landing.png`, `chat-empty.png`,
`chat-response.png`, `quiz.png`, `flashcards.png`, `diagram.png`, `system-prompt.png`)
with real captures at ~1280×820. `ScreenshotFrame` keeps the rounded gradient border, so
sizing/styling stays consistent.

## Audio

Audio is **on** (`ENABLE_AUDIO = true` in `Video.tsx`) and ships with generated files in
`public/audio/`: a 52s lo-fi synth bed (`bg-track.wav`), a `whoosh.wav` on the dramatic
transitions, and a `ding.wav` when the AI answer lands. Swap any of them for your own track
(same filenames) or set `ENABLE_AUDIO = false` to silence everything.

## Notes / decisions

- **Determinism:** every animation derives from `useCurrentFrame()` — no `setTimeout`,
  `requestAnimationFrame`, or `Date.now()`, so renders are reproducible.
- **Framer Motion:** included as a dependency, but `MorphCard` deliberately morphs via
  Remotion interpolation rather than Framer's `layoutId` — Framer's layout animations are
  RAF/measurement-based and are **not** frame-deterministic under Remotion's renderer.
- **Tailwind v4** is wired via `@remotion/tailwind-v4` in `remotion.config.ts`; brand-critical
  colors/gradients are kept inline so the look holds regardless of utility classes.
- The earlier prototype files (e.g. `MacBook.tsx`, `AskScene.tsx`, `ULBSPromo.tsx`) are no
  longer referenced and can be deleted — the canonical entry is `Video.tsx`.
