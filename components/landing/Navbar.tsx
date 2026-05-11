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

      <a
        href="/login"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 18px",
          borderRadius: 9999,
          background: colors.text,
          color: colors.bg,
          fontSize: fontSizes.sm,
          fontWeight: 500,
          textDecoration: "none",
          fontFamily: "inherit",
        }}
      >
        Sign in →
      </a>
    </nav>
  );
}
