import Hero from "@/components/landing/Hero";
import ThemeToggle from "@/components/landing/ThemeToggle";
import Navbar from "@/components/landing/Navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0c0b10] text-[#e8e4f0] overflow-hidden isolate font-inherit">
      <div className="absolute inset-0 opacity-50 mix-blend-overlay pointer-events-none z-[1]" />
      <Navbar />
      <div className="relative z-[2] flex flex-col min-h-screen">
        <ThemeToggle />
        <div className="flex-1 flex flex-col items-center justify-start gap-10 px-6 py-20">
          <Hero />
        </div>
      </div>
    </main>
  );
}
