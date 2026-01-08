import { graph } from "@/lib/langgraph/graph";
import { convertLangChainToAISDK } from "@/lib/message-utils";
import ChatPageClient from "./ChatPageClient";
import { notFound } from "next/navigation";
import { getChat } from "@/lib/db/actions";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { auth } from "@/lib/auth";

interface ChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  const threadId = id;
  const session = await auth();

  // User must be authenticated to view any chat page
  if (!session?.user?.id) {
    // This should be handled by middleware, but it's a good safeguard.
    notFound();
  }
  const userId = session.user.id;

  // Verify chat exists in database AND belongs to the current user
  const chat = await getChat(threadId);
  if (!chat || chat.userId !== userId) {
    notFound();
  }

  try {
    // Retrieve the state from LangGraph using the checkpointer
    const state = await graph.getState({
      configurable: {
        thread_id: threadId,
      },
    });

    // Extract messages from the state
    const langChainMessages = state.values?.messages || [];

    // Convert LangChain messages to Vercel AI SDK format
    const initialMessages = convertLangChainToAISDK(
      langChainMessages,
      threadId,
    );

    // Pass initialMessages to the client component
    return (
      <ChatPageClient
        threadId={threadId}
        initialMessages={initialMessages}
        chatTitle={chat.title}
        chatSidebar={<ChatSidebar userId={userId} currentChatId={threadId} />}
      />
    );
  } catch (error) {
    console.error("Error loading chat state:", error);
    // If state doesn't exist yet (new chat), pass empty messages
    return (
      <ChatPageClient
        threadId={threadId}
        initialMessages={[]}
        chatTitle={chat.title}
        chatSidebar={<ChatSidebar userId={userId} currentChatId={threadId} />}
      />
    );
  }
}
