import Chat from "@/components/chat/Chat";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const resolvedParams = await params;
  return <Chat conversationId={resolvedParams.id} />;
}
