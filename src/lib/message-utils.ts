import type { BaseMessage } from "@langchain/core/messages";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

/**
 * Converts LangChain message format to Vercel AI SDK format
 * @param langChainMessages - Array of LangChain BaseMessage objects
 * @param threadId - Optional thread ID for generating unique message IDs
 * @returns Array of messages in Vercel AI SDK format
 */
export function convertLangChainToAISDK(
  langChainMessages: BaseMessage[],
  threadId?: string,
): Array<{
  id: string;
  role: "user" | "assistant" | "system";
  parts: Array<{ type: "text"; text: string }>;
}> {
  return langChainMessages
    .filter((msg) => {
      // Filter out system messages from the UI (they're handled internally)
      // Robustly check for HumanMessage and AIMessage (including Chunks)
      const type = msg.getType ? msg.getType() : "";
      return (
        type === "human" ||
        type === "ai" ||
        msg instanceof HumanMessage ||
        msg instanceof AIMessage
      );
    })
    .map((msg, index) => {
      // Determine role based on message type
      let role: "user" | "assistant" | "system" = "system";
      const type = msg.getType ? msg.getType() : "";

      if (type === "human" || msg instanceof HumanMessage) {
        role = "user";
      } else if (type === "ai" || msg instanceof AIMessage) {
        role = "assistant";
      }

      // Extract content from message
      // LangChain messages can have content as string or array
      let content = "";
      if (typeof msg.content === "string") {
        content = msg.content;
      } else if (Array.isArray(msg.content)) {
        // Handle array content (e.g., multimodal messages)
        content = msg.content
          .map((item) => {
            if (typeof item === "string") return item;
            if (item && typeof item === "object" && "text" in item) {
              return item.text;
            }
            return "";
          })
          .join("");
      }

      // Generate unique ID
      const messageId = threadId
        ? `msg-${threadId}-${index}`
        : `msg-${Date.now()}-${index}-${Math.random().toString(36).substring(7)}`;

      return {
        id: messageId,
        role,
        parts: [{ type: "text" as const, text: content }],
      };
    });
}
