"use client";
import { useState } from "react";
import Link from "next/link";

type Role = "student" | "professor" | "admin";

interface Props {
  role?: Role;
}

const MOCK_HISTORY = [
  { id: "1", title: "Ce cursuri am în semestrul 2?" },
  { id: "2", title: "Cum calculez media?" },
  { id: "3", title: "Cerințe proiect POO" },
];

function ToggleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 3v18" />
    </svg>
  );
}

export default function Sidebar({ role = "professor" }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState("");

  const filtered = MOCK_HISTORY.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`relative shrink-0 h-screen transition-all duration-300 ${isOpen ? "w-60" : "w-14 p-[1.5px]"}`}
    >
      {!isOpen && (
        <div className="glow-border-right absolute inset-0 rounded-r-3xl z-0" />
      )}
      <div
        className={`relative z-[1] w-full h-full flex flex-col bg-[#0c0b10] rounded-r-3xl ${
          isOpen ? "border-r border-t border-b border-[rgba(232,228,240,0.07)]" : ""
        }`}
      >
        <div className={`flex pt-6 px-3 ${isOpen ? "justify-end" : "justify-center"}`}>
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="text-[rgba(232,228,240,0.45)] hover:text-[#e8e4f0] transition-colors p-1.5 rounded-lg hover:bg-[rgba(232,228,240,0.06)]"
          >
            <ToggleIcon />
          </button>
        </div>

        <div className={`flex flex-col flex-1 overflow-hidden transition-opacity ${isOpen ? "opacity-100 duration-300 delay-150" : "opacity-0 duration-150 pointer-events-none"}`}>
            <div className="p-3 pt-2 flex flex-col gap-1">
              <Link
                href="/chat"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#e8e4f0] text-sm hover:bg-[rgba(232,228,240,0.06)] transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New chat
              </Link>

              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(232,228,240,0.35)]" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search chats"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[rgba(232,228,240,0.06)] text-[#e8e4f0] text-sm placeholder:text-[rgba(232,228,240,0.35)] rounded-lg pl-8 pr-3 py-2 outline-none"
                />
              </div>
            </div>

            {/* Nav items */}
            {(role === "professor" || role === "admin") && (
              <div className="px-3 flex flex-col gap-0.5">
                <Link href="/courses" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[rgba(232,228,240,0.75)] hover:bg-[rgba(232,228,240,0.06)] transition-colors">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  {role === "admin" ? "All Courses" : "Courses"}
                </Link>

                {role === "admin" && (
                  <Link
                    href="/admin/professors"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[rgba(232,228,240,0.75)] hover:bg-[rgba(232,228,240,0.06)] transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Professors
                  </Link>
                )}
              </div>
            )}

            {/* History */}
            <div className="flex-1 overflow-y-auto px-3">
              <div className="mt-2">
                <p className="text-[rgba(232,228,240,0.35)] text-xs px-3 py-2 uppercase tracking-widest">
                  History
                </p>
                <div className="flex flex-col gap-0.5">
                  {filtered.length === 0 ? (
                    <p className="text-[rgba(232,228,240,0.35)] text-sm px-3 py-2">
                      No chats found.
                    </p>
                  ) : (
                    filtered.map((chat) => (
                      <Link
                        key={chat.id}
                        href={`/chat/${chat.id}`}
                        className="text-sm text-[rgba(232,228,240,0.75)] px-3 py-2 rounded-lg hover:bg-[rgba(232,228,240,0.06)] transition-colors truncate block"
                      >
                        {chat.title}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* User */}
            <div className="p-3 border-t border-[rgba(232,228,240,0.07)] flex flex-col gap-1">
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-7 h-7 rounded-full bg-[#7c6af7] flex items-center justify-center text-xs text-white font-medium shrink-0">
                  D
                </div>
                <span className="text-sm text-[rgba(232,228,240,0.75)] truncate">Denisa Ionescu</span>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[rgba(232,228,240,0.45)] hover:text-[#e8e4f0] hover:bg-[rgba(232,228,240,0.06)] transition-colors w-full text-left">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
