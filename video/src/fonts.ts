// Reverted to the original font (Inter system stack) — no Google Fonts download,
// which also removes the per-frame font network requests during render.
// Kept as a tiny alias so scenes that import `fonts` don't need editing.
import { brand } from "./brand";

export const fonts = {
  display: brand.fontFamily,
  body: brand.fontFamily,
} as const;
