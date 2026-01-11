import { db } from "@/db";
import { chats } from "@/db/schema";
import { graph } from "@/lib/langgraph/graph";
import { desc } from "drizzle-orm";

async function debugLatestChat() {
  try {
    // 1. Get the latest chat
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
    console.log("Latest Chat ID:", latestChat.id);
    console.log("Latest Chat Title:", latestChat.title);

    // 2. Get LangGraph state
    const state = await graph.getState({
      configurable: {
        thread_id: latestChat.id,
      },
    });

    console.log("--- Graph State Messages ---");
    if (state.values && state.values.messages) {
      state.values.messages.forEach((msg: any, index: number) => {
        console.log(
          `[${index}] Role: ${msg.getType ? msg.getType() : msg.constructor.name}`,
        );
        console.log(
          `    Content: ${JSON.stringify(msg.content).substring(0, 100)}...`,
        );
        if (msg.tool_calls) {
          console.log(`    Tool Calls: ${JSON.stringify(msg.tool_calls)}`);
        }
      });
    } else {
      console.log("No messages found in state.");
    }

    console.log("--- Checkpoint Metadata ---");
    console.log(
      state.createdAt ? `Created At: ${state.createdAt}` : "No timestamp",
    );
    console.log(state.config);
  } catch (error) {
    console.error("Debug Error:", error);
  }
}

debugLatestChat();
