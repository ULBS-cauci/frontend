import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import LandingInput from "@/components/landing/LandingInput";
import ThemeToggle from "@/components/landing/ThemeToggle";
import { colors } from "@/lib/tokens";


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
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          mixBlendMode: "overlay",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

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
