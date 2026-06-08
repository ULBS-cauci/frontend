import Sidebar from "@/components/chat/Sidebar";
import { ChatProvider } from "@/lib/chat-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <div className="relative h-screen overflow-hidden bg-[#0c0b10] text-[#e8e4f0] p-6">
        <div className="relative h-full flex border border-[rgba(167,139,250,0.18)] rounded-2xl overflow-hidden" style={{ boxShadow: "0 0 40px rgba(124,106,247,0.1), 0 0 100px rgba(124,106,247,0.05)" }}>
          <Sidebar />
          <main className="flex-1 h-full overflow-y-auto chat-scroll">{children}</main>
        </div>
      </div>
    </ChatProvider>
  );
}
