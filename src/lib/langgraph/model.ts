import { ChatOpenAI } from "@langchain/openai";
import { env } from "@/lib/env";

export const model = new ChatOpenAI({
  modelName: "meta-llama/llama-3.3-70b-instruct:free", // OpenRouter Model ID
  apiKey: env.OPENROUTER_API_KEY, // API key must be in .env
  configuration: {
    baseURL: "https://openrouter.ai/api/v1", // OpenRouter Base URL
  },
  temperature: 0.7, // Adjust as needed
});
