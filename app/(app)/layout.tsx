import Sidebar from "@/components/chat/Sidebar";
import { ChatProvider } from "@/lib/chat-context";

  export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
      <ChatProvider>
        <div className="flex">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </ChatProvider>
    );
  }