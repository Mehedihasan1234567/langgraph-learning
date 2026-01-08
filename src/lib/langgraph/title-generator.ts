import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { env } from "@/lib/env";

/**
 * Generates a concise 3-5 word title for a chat based on the first user message
 * @param userMessage - The first user message content
 * @returns A short title (3-5 words)
 */
export async function generateChatTitle(userMessage: string): Promise<string> {
  try {
    // Use a lightweight model for title generation via OpenRouter
    const titleModel = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      apiKey: env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
      },
      temperature: 0.3, // Lower temperature for more consistent titles
      maxTokens: 20, // Limit to keep titles short
    });

    const prompt = `Generate a concise title (3-5 words maximum) for a chat conversation that starts with this message: "${userMessage}"

Return only the title, no quotes, no explanation, just the title.`;

    const response = await titleModel.invoke([new HumanMessage(prompt)]);

    let title =
      typeof response.content === "string"
        ? response.content.trim()
        : String(response.content).trim();

    // Remove quotes if present
    title = title.replace(/^["']|["']$/g, "");

    // Ensure it's not too long (max 50 chars)
    if (title.length > 50) {
      title = title.substring(0, 47) + "...";
    }

    // Fallback if empty
    if (!title || title.length === 0) {
      title = "New Chat";
    }

    return title;
  } catch (error) {
    console.error("Error generating chat title:", error);
    // Fallback: use first few words of the message
    const words = userMessage.split(/\s+/).slice(0, 5).join(" ");
    return words || "New Chat";
  }
}
