import { graph } from "@/lib/langgraph/graph";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

export const maxDuration = 60;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const validMessages = messages.map((m: Message) => {
    if (m.role === "user") {
      return new HumanMessage(m.content);
    }
    return new AIMessage(m.content);
  });

  // Generate a random thread_id for now
  const thread_id = Math.random().toString(36).substring(7);

  const stream = await graph.streamEvents(
    {
      messages: validMessages,
    },
    {
      version: "v2",
      configurable: {
        thread_id,
      },
    }
  );

  const textStream = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.event === "on_chat_model_stream" &&
          event.data.chunk.content
        ) {
          controller.enqueue(event.data.chunk.content);
        }
      }
      controller.close();
    },
  });

  return new Response(textStream);
}
