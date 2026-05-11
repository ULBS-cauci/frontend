import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import LandingInput from "@/components/landing/LandingInput";
import ThemeToggle from "@/components/landing/ThemeToggle";
import { colors } from "@/lib/tokens";

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.92  0 0 0 0 0.89  0 0 0 0 0.83  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

export default function Home() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        overflow: "hidden",
        isolation: "isolate",
        fontFamily: "inherit",
      }}
    >

      {/* Grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: GRAIN,
          opacity: 0.5,
          mixBlendMode: "overlay",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <ThemeToggle />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            padding: "40px 24px 80px",
          }}
        >
          <Hero />
          <LandingInput />
        </div>
      </div>
    </main>
  );
}
