import Chat from "@/components/chat/Chat";

interface ChatPageProps {
  params: { id: string };
}

export default function ChatPage({ params }: ChatPageProps) {
  return <Chat conversationId={params.id} />;
}
