import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex flex-col items-center text-center gap-5 max-w-3xl ">
      <h1 className="m-0 text-[80px] font-bold leading-[0.96] tracking-[-0.03em] text-[#e8e4f0] whitespace-nowrap">
        Introducing ULBS Coach
      </h1>
      <Link href="/chat" className="px-8 py-3 mt-6 bg-black text-white rounded-full text-base font-semibold shadow-[0_0_24px_rgba(124,106,247,0.45)] hover:shadow-[0_0_36px_rgba(124,106,247,0.65)] hover:scale-105 transition-all duration-200">
        Try ULBS
      </Link>
    </div>
  );
}

