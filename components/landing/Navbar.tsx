import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-12 py-[26px]">
      <span className="text-[#e8e4f0] text-xl font-semibold tracking-[-0.01em]">
        ULBS Coach
      </span>
      <div className="flex items-center gap-4">
        <Link href="/login" className="px-8 py-4 bg-black text-white rounded-full text-base font-medium">Login</Link>
        <Link href="/signup" className="px-8 py-4 bg-white text-black rounded-full text-base font-medium">Sign Up</Link>
      </div>
    </nav>
  );
}
