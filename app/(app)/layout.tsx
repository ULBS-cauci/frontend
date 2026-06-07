import Sidebar from "@/components/chat/Sidebar";
import { ChatProvider } from "@/lib/chat-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <div className="h-screen overflow-hidden bg-[#0c0b10] text-[#e8e4f0] p-6">
        <div className="h-full flex border border-[rgba(167,139,250,0.18)] rounded-2xl overflow-hidden">
          <Sidebar />
          <main className="flex-1 h-full overflow-y-auto">{children}</main>
        </div>
      </div>
    </ChatProvider>
  );
}
