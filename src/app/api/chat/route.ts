import { graph } from "@/lib/langgraph/graph";
import { auth } from "@/lib/auth";
import { HumanMessage } from "@langchain/core/messages";
import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { getChat, updateChat } from "@/lib/db/actions";
import { generateChatTitle } from "@/lib/langgraph/title-generator";
import { LangChainAdapter } from "ai";

export const maxDuration = 60;

// Define types for the request payload for type safety
interface ApiChatMessagePart {
  type: "text";
  text: string;
}

interface ApiChatMessage {
  role: "user" | "assistant" | "system";
  content?: string; // For older SDK versions
  parts?: ApiChatMessagePart[]; // For AI SDK v4+
}

interface ApiRequestBody {
  messages: ApiChatMessage[];
  thread_id: string;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;

    const { messages, thread_id: providedThreadId } =
      (await req.json()) as ApiRequestBody;

    // Security Check: If a thread_id is provided, ensure it belongs to the user.
    if (providedThreadId) {
      const chat = await getChat(providedThreadId);
      if (!chat || chat.userId !== userId) {
        return new Response("Forbidden", { status: 403 });
      }
    }

    // The thread_id is now guaranteed to be safe if it exists.
    const thread_id = providedThreadId;

    // Extract only the LAST message - LangGraph checkpointer handles the history.
    // The client sends the full history, but we only want to process the new input.
    const lastMessage = messages[messages.length - 1];
    const newUserMessages = [];

    if (lastMessage && lastMessage.role === "user") {
      let content = "";

      // Handle AI SDK v4+ parts structure
      if (lastMessage.parts && Array.isArray(lastMessage.parts)) {
        content = lastMessage.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("");
      } else if (lastMessage.content) {
        // Fallback: older content structure
        content = lastMessage.content;
      }

      const safeContent = content || "";
      newUserMessages.push(new HumanMessage({ content: safeContent }));
    }

    // Get the first user message for title generation
    const firstUserMessage = (newUserMessages[0]?.content as string) || "";

    // Check if this is a new chat (exactly 1 user message in the conversation)
    let isNewChat = false;
    try {
      const existingState = await graph.getState({
        configurable: { thread_id },
      });
      // Count user messages in existing state
      const existingUserMessages =
        existingState.values?.messages?.filter(
          (msg: any): msg is HumanMessage => msg instanceof HumanMessage,
        ) || [];
      // If no existing user messages and we have exactly 1 new user message, it's a new chat
      isNewChat =
        existingUserMessages.length === 0 && newUserMessages.length === 1;
    } catch (error) {
      // If state doesn't exist, it's a new chat
      isNewChat = newUserMessages.length === 1;
    }

    // LangGraph streaming with checkpointer
    const stream = await graph.streamEvents(
      {
        messages: newUserMessages,
      },
      {
        version: "v2",
        configurable: {
          thread_id,
        },
      },
    );

    // Auto-Title Feature: Generate title in background for new chats
    if (isNewChat && firstUserMessage) {
      after(async () => {
        try {
          const title = await generateChatTitle(firstUserMessage);
          await updateChat(thread_id, title);
          // Revalidate paths to update sidebar
          revalidatePath("/chat", "layout");
          revalidatePath("/", "layout");
        } catch (error) {
          console.error("Error generating/updating chat title:", error);
        }
      });
    }

    // Use LangChainAdapter to stream the response
    return LangChainAdapter.toDataStreamResponse(stream);
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
