"use client";
import { useState, useCallback } from "react";
import Link from "next/link";

export default function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0c0b10] text-[#e8e4f0] overflow-hidden" onMouseMove={handleMouseMove}>
      {/* Mouse glow — transform-only for GPU-smooth tracking */}
      <div
        className="pointer-events-none fixed z-0 top-0 left-0"
        style={{
          transform: `translate(calc(${mouse.x}px - 50%), calc(${mouse.y}px - 50%))`,
          willChange: "transform",
          width: 800,
          height: 800,
          background: `
            radial-gradient(circle at center, rgba(139,92,246,0.22) 0%, rgba(109,76,247,0.10) 25%, transparent 55%),
            radial-gradient(circle at center, rgba(167,139,250,0.06) 0%, transparent 70%)
          `,
          borderRadius: "50%",
        }}
      />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-12 py-6">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="text-[#e8e4f0] text-lg font-semibold tracking-tight">ULBS Coach</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[rgba(232,228,240,0.65)] cursor-default px-4 py-2">
            Sign in
          </span>
          <Link
            href="/chat"
            className="text-sm font-medium rounded-full px-5 py-2 transition-all hover:brightness-110"
            style={{
              background: "rgba(124,106,247,0.18)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(124,106,247,0.35)",
            }}
          >
            Open app
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center text-center pt-16 pb-28 px-6">
        {/* Badge */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-[rgba(167,139,250,0.2)] bg-[rgba(124,106,247,0.07)] px-4 py-1.5 text-xs text-[rgba(167,139,250,0.85)]">
          <span className="text-[#a78bfa]">✦</span>
          Now in private preview
        </div>

        {/* Heading */}
        <h1 className="max-w-3xl text-6xl font-bold leading-[1.06] tracking-[-0.03em] text-[#e8e4f0] mb-5">
          Meet ULBS Coach.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #a78bfa 0%, #7c6af7 50%, #c084fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            The student's life saver.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-md text-[rgba(232,228,240,0.5)] text-base leading-relaxed mb-10">
          Know exactly what to study, how to study it, and what your professor actually wants. Pass with confidence.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, rgba(124,106,247,0.55) 0%, rgba(109,76,210,0.55) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(167,139,250,0.45)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 32px rgba(124,106,247,0.25)",
            }}
          >
            Start chatting →
          </Link>
          <span
            className="rounded-full px-6 py-3 text-sm font-medium text-[rgba(232,228,240,0.75)] cursor-default"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(232,228,240,0.1)",
            }}
          >
            Sign in
          </span>
        </div>
      </div>

      {/* Chat preview — floating */}
      <div className="relative z-10 flex justify-center px-6 pb-24">
        <Link
          href="/chat"
          className="float block w-full max-w-lg rounded-2xl p-5 cursor-pointer transition-all hover:brightness-110"
          style={{
            background: "rgba(18,14,30,0.65)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(124,106,247,0.2)",
            boxShadow: "0 0 60px rgba(124,106,247,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Card header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[rgba(124,106,247,0.12)]">
            <div className="w-2 h-2 rounded-full bg-[#7c6af7] opacity-80" />
            <span className="text-xs text-[rgba(232,228,240,0.4)] font-medium tracking-wide">ULBS Coach · Dl. Breazu</span>
          </div>

          <div className="flex flex-col gap-3">
            {/* User message */}
            <div
              className="self-end rounded-2xl px-4 py-2.5 text-sm text-white max-w-[78%]"
              style={{
                background: "linear-gradient(135deg, rgba(124,106,247,0.5) 0%, rgba(88,60,210,0.5) 100%)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(167,139,250,0.3)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              Cum iau examenul la dl. Breazu la SO?
            </div>

            {/* AI message */}
            <div
              className="self-start rounded-2xl px-4 py-2.5 text-sm text-[rgba(232,228,240,0.88)] max-w-[88%] leading-relaxed"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(232,228,240,0.07)",
              }}
            >
              Dl. Breazu pune accent pe <span className="text-[#a78bfa] font-medium">procese, thread-uri și sincronizare</span>. Cel mai sigur: rezolvă subiectele din anii trecuți și știe să explici diferența dintre deadlock și starvation.
            </div>

            {/* User message 2 */}
            <div
              className="self-end rounded-2xl px-4 py-2.5 text-sm text-white max-w-[78%]"
              style={{
                background: "linear-gradient(135deg, rgba(124,106,247,0.5) 0%, rgba(88,60,210,0.5) 100%)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(167,139,250,0.3)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              Fă-mi un plan de învățat pe 3 zile.
            </div>

            {/* Thinking dots */}
            <div className="flex gap-1.5 px-1 pt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#7c6af7] opacity-70 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-[#7c6af7] opacity-70 animate-bounce" style={{ animationDelay: "160ms" }} />
              <span className="w-2 h-2 rounded-full bg-[#7c6af7] opacity-70 animate-bounce" style={{ animationDelay: "320ms" }} />
            </div>
          </div>
        </Link>
      </div>

      {/* Features section */}
      <div className="relative z-10 px-12 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-[#e8e4f0] mb-3">
            Study less.{" "}
            <span className="text-[rgba(232,228,240,0.35)]">Understand more.</span>
          </h2>
          <p className="text-[rgba(232,228,240,0.4)] text-sm">Everything you need to ace your exams.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
          {/* Quiz */}
          <div
            className="rounded-2xl p-9"
            style={{
              background: "rgba(18,14,30,0.55)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(124,106,247,0.15)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
              style={{ background: "rgba(124,106,247,0.18)", border: "1px solid rgba(124,106,247,0.25)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <h3 className="text-[#e8e4f0] font-semibold mb-2">Generate quizzes</h3>
            <p className="text-[rgba(232,228,240,0.45)] text-sm leading-relaxed">
              Turn any lecture or PDF into practice questions. Test yourself before the professor does.
            </p>
          </div>

          {/* Flashcards */}
          <div
            className="rounded-2xl p-9"
            style={{
              background: "rgba(18,14,30,0.55)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(124,106,247,0.15)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
              style={{ background: "rgba(124,106,247,0.18)", border: "1px solid rgba(124,106,247,0.25)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </div>
            <h3 className="text-[#e8e4f0] font-semibold mb-2">Create flashcards</h3>
            <p className="text-[rgba(232,228,240,0.45)] text-sm leading-relaxed">
              Instantly build flashcard decks from your notes. Review on the go, remember everything.
            </p>
          </div>

          {/* Diagrams */}
          <div
            className="rounded-2xl p-9"
            style={{
              background: "rgba(18,14,30,0.55)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(124,106,247,0.15)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
              style={{ background: "rgba(124,106,247,0.18)", border: "1px solid rgba(124,106,247,0.25)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="8" y="14" width="8" height="7" rx="1" />
                <path d="M6.5 10v2.5M17.5 10v1M12 14v-1.5M6.5 12.5h11" />
              </svg>
            </div>
            <h3 className="text-[#e8e4f0] font-semibold mb-2">Draw diagrams</h3>
            <p className="text-[rgba(232,228,240,0.45)] text-sm leading-relaxed">
              Visualize complex concepts with auto-generated diagrams. Understand structure at a glance.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(232,228,240,0.06)] px-12 py-6 flex items-center justify-between">
        <span className="text-xs text-[rgba(232,228,240,0.3)]">© 2026 ULBS Coach — Built for students.</span>
        <span className="text-xs text-[rgba(232,228,240,0.3)]">Made with love in Sibiu.</span>
      </footer>
    </div>
  );
}
