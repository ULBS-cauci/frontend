import { theme } from "../theme";

/** Sparkle brand mark (the ✦ used across the app) rendered as crisp SVG. */
export const SparkMark: React.FC<{ size?: number; spin?: number }> = ({
  size = 40,
  spin = 0,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    style={{ transform: `rotate(${spin}deg)` }}
  >
    <defs>
      <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={theme.violetLight} />
        <stop offset="50%" stopColor={theme.violet} />
        <stop offset="100%" stopColor={theme.violetPink} />
      </linearGradient>
    </defs>
    <path
      d="M50 4 C54 30 70 46 96 50 C70 54 54 70 50 96 C46 70 30 54 4 50 C30 46 46 30 50 4Z"
      fill="url(#sparkGrad)"
    />
  </svg>
);

/** Wordmark: spark + "ULBS Coach". */
export const Logo: React.FC<{ scale?: number; spin?: number }> = ({
  scale = 1,
  spin = 0,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      transform: `scale(${scale})`,
    }}
  >
    <SparkMark size={48} spin={spin} />
    <span
      style={{
        fontFamily: theme.fontFamily,
        fontSize: 40,
        fontWeight: 700,
        letterSpacing: "-0.03em",
        color: theme.text,
      }}
    >
      ULBS Coach
    </span>
  </div>
);

/** Text painted with the brand gradient. */
export const GradientText: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <span
    style={{
      background: theme.brandGradient,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
      ...style,
    }}
  >
    {children}
  </span>
);
