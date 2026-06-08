import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

// --- Tailwind v4 ---------------------------------------------------------
// Remotion bundles with its own webpack config; enableTailwind injects the
// Tailwind v4 PostCSS pipeline so utility classes + our globals.css work.
Config.overrideWebpackConfig((currentConfiguration) => {
  return enableTailwind(currentConfiguration);
});

// --- Render quality ------------------------------------------------------
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(null); // auto-detect cores
Config.setCrf(18); // visually lossless H.264
