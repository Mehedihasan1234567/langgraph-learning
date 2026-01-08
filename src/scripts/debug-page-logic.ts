
import { db } from "@/db";
import { chats } from "@/db/schema";
import { graph } from "@/lib/langgraph/graph";
import { convertLangChainToAISDK } from "@/lib/message-utils";
import { desc } from "drizzle-orm";

async function debugPageLogic() {
  try {
    console.log("1. Fetching latest chat...");
    const recentChats = await db
        .select()
        .from(chats)
        .orderBy(desc(chats.updatedAt))
        .limit(1);

    if (recentChats.length === 0) {
        console.log("No chats found.");
        return;
    }

    const latestChat = recentChats[0];
    console.log(`Chat ID: ${latestChat.id}`);

    console.log("2. Fetching Graph State...");
    const state = await graph.getState({
      configurable: {
        thread_id: latestChat.id,
      },
    });

    const langChainMessages = state.values?.messages || [];
    console.log(`Found ${langChainMessages.length} raw messages from graph.`);

    langChainMessages.forEach((m: any, i: number) => {
        console.log(`[Raw ${i}] Type: ${m.constructor.name}, Content: ${JSON.stringify(m.content).substring(0, 50)}...`);
    });

    console.log("3. Converting to AI SDK format...");
    const initialMessages = convertLangChainToAISDK(
      langChainMessages,
      latestChat.id,
    );

    console.log(`Converted to ${initialMessages.length} UI messages.`);
    console.log(JSON.stringify(initialMessages, null, 2));

  } catch (error) {
    console.error("Debug Error:", error);
  }
}

debugPageLogic();
