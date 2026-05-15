import Sidebar from "@/components/chat/Sidebar";
import Chat from "@/components/chat/Chat";

export default function ChatPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Chat />
      </main>
    </div>
  );
}
