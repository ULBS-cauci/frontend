import { colors, fontSizes } from "@/lib/tokens";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "26px 48px",
      }}
    >
      <span
        style={{
          color: colors.text,
          fontSize: fontSizes.lg,
          fontWeight: 600,
          letterSpacing: "-0.01em",
        }}
      >
        ULBS Coach
      </span>
    </nav>
  );
}
